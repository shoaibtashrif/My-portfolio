import { randomUUID } from 'node:crypto';
import { IncomingMessage, Server as HttpServer } from 'node:http';
import { Duplex } from 'node:stream';
import WebSocket, { RawData, WebSocketServer } from 'ws';
import { GoogleLiveSession, SpeechAccount, VoiceTicketPayload } from './googleLiveSession.js';
import { recordVoiceTurn, scheduleVoiceEndFlush } from '../services/transcriptStore.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export interface VoiceGateway {
  close(): Promise<void>;
}

export function attachVoiceGateway(server: HttpServer): VoiceGateway {
  const webSocketServer = new WebSocketServer({ noServer: true, maxPayload: 256 * 1024 });
  const sessions = new Set<VoiceCallSession>();

  const upgradeHandler = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    void handleUpgrade(request, socket, head);
  };
  server.on('upgrade', upgradeHandler);

  async function handleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname !== '/api/v1/voice' && url.pathname !== '/ws/live-voice') {
        return rejectUpgrade(socket, 404, 'Not found');
      }

      const clientSessionId = (url.searchParams.get('sessionId') || '').trim();
      const pageUrl = (url.searchParams.get('pageUrl') || '').trim();
      const conversationId = clientSessionId || randomUUID();

      const payload: VoiceTicketPayload = {
        userId: 'visitor',
        conversationId,
        callId: randomUUID(),
        openingContext:
          "Greet the caller warmly in 1 short sentence as Shoaib Tashrif's personal AI assistant and let them know they can speak in any language.",
      };

      webSocketServer.handleUpgrade(request, socket, head, (client) => {
        const session = new VoiceCallSession(client, payload, pageUrl, () => sessions.delete(session));
        sessions.add(session);
        session.start();
      });
    } catch (error) {
      console.warn('[voice] Upgrade failed:', safeError(error));
      rejectUpgrade(socket, 503, 'Voice service unavailable');
    }
  }

  return {
    async close() {
      server.off('upgrade', upgradeHandler);
      for (const session of sessions) session.close(1001, 'Server shutting down');
      await new Promise<void>((resolve) => webSocketServer.close(() => resolve()));
    },
  };
}

class VoiceCallSession {
  private googleLive: GoogleLiveSession | null = null;
  private providerStarting = false;
  private queuedAudio: Buffer[] = [];
  private clientMuted = false;
  private closed = false;
  private clientKeepAlive: NodeJS.Timeout | null = null;

  constructor(
    private readonly client: WebSocket,
    private readonly ticket: VoiceTicketPayload,
    private readonly pageUrl: string,
    private readonly onClosed: () => void,
  ) {}

  start() {
    this.client.binaryType = 'arraybuffer';
    this.client.on('message', (data, isBinary) => this.onClientMessage(data, isBinary));
    this.client.on('close', (code, reason) => {
      this.log('client_socket_closed', { code, reason: reason.toString() || 'none' });
      this.cleanup();
    });
    this.client.on('error', (error) => console.warn('[voice] Client socket:', safeError(error)));

    this.clientKeepAlive = setInterval(() => {
      if (this.client.readyState === WebSocket.OPEN) this.client.ping();
    }, 15_000);

    this.sendJson({
      type: 'call.ready',
      callId: this.ticket.callId,
      conversationId: this.ticket.conversationId,
      outputSampleRate: 24_000,
    });
    this.updateState('connecting');
  }

  close(code = 1000, reason = 'Call ended') {
    if (this.closed) return;
    this.closed = true;
    if (this.client.readyState === WebSocket.OPEN) this.client.close(code, reason);
    this.cleanup();
  }

  private onClientMessage(data: RawData, isBinary: boolean) {
    if (isBinary) {
      if (this.clientMuted) return;
      const audio = toBuffer(data);
      if (!audio.length) return;
      if (this.googleLive) {
        this.googleLive.sendClientAudio(audio);
        return;
      }
      if (this.queuedAudio.reduce((total, item) => total + item.length, 0) < 384_000) {
        this.queuedAudio.push(audio);
      }
      return;
    }

    try {
      const message = JSON.parse(data.toString()) as Record<string, unknown>;
      if (message.type === 'start') {
        const sampleRate = clampInteger(Number(message.sampleRate), 8_000, 48_000, 48_000);
        if (!this.googleLive && !this.providerStarting) {
          void this.startVoiceProvider(sampleRate).catch((err) => {
            this.providerStarting = false;
            console.warn('[voice] Provider start failed:', safeError(err));
            this.sendJson({
              type: 'error',
              code: 'stt_error',
              message: 'Voice service unavailable.',
            });
          });
        }
      } else if (message.type === 'stop') {
        this.close(1000, 'Call ended by user');
      } else if (message.type === 'client.mute') {
        const muted = message.muted === true;
        this.clientMuted = muted;
        this.googleLive?.setMuted(muted);
        this.log('client_mute_changed', { muted });
        this.sendJson({ type: 'mute.ack', muted });
      } else if (message.type === 'playback_complete' && this.googleLive) {
        this.updateState('listening');
      } else if (message.type === 'client.playback_metric') {
        const metric =
          message.metric === 'underrun'
            ? 'playback_underrun'
            : message.metric === 'rebuffered'
            ? 'playback_rebuffered'
            : '';
        if (metric) {
          this.log(metric, {
            turnId: typeof message.turnId === 'string' ? message.turnId : null,
            count: clampInteger(Number(message.count), 0, 10_000, 0),
            bufferedMs: clampInteger(Number(message.bufferedMs), 0, 5_000, 0),
            targetMs: clampInteger(Number(message.targetMs), 0, 5_000, 0),
          });
        }
      }
    } catch {
      this.sendJson({ type: 'error', code: 'invalid_message', message: 'Invalid call message' });
    }
  }

  private async startVoiceProvider(sampleRate: number) {
    if (this.providerStarting || this.closed) return;
    this.providerStarting = true;
    try {
      const account: SpeechAccount = {
        id: 'google-live-primary',
        apiKey: GEMINI_API_KEY,
        model: 'models/gemini-3.8-live',
        voiceName: 'Fenrir',
      };

      this.googleLive = new GoogleLiveSession(account, this.ticket, {
        sendJson: (payload) => this.sendJson(payload),
        sendAudio: (audio) => {
          if (this.client.readyState === WebSocket.OPEN) {
            this.client.send(audio, { binary: true });
          }
        },
        updateState: (status) => this.updateState(status),
        log: (event, fields) => this.log(event, fields),
      });

      await this.googleLive.start(sampleRate);
      for (const chunk of this.queuedAudio) {
        this.googleLive.sendClientAudio(chunk);
      }
      this.queuedAudio = [];
    } finally {
      this.providerStarting = false;
    }
  }

  private sendJson(payload: Record<string, unknown>) {
    if (payload.type === 'transcript.final' && typeof payload.text === 'string') {
      recordVoiceTurn(this.ticket.conversationId, {
        pageUrl: this.pageUrl || undefined,
        role: 'user',
        content: payload.text,
      });
    } else if (payload.type === 'assistant.text.final' && typeof payload.text === 'string') {
      recordVoiceTurn(this.ticket.conversationId, {
        pageUrl: this.pageUrl || undefined,
        role: 'assistant',
        content: payload.text,
      });
    }
    if (this.client.readyState === WebSocket.OPEN) {
      this.client.send(JSON.stringify(payload));
    }
  }

  private updateState(status: string) {
    this.sendJson({ type: 'call.state', status });
  }

  private log(event: string, fields?: Record<string, unknown>) {
    console.log(`[voice] ${event}`, fields || {});
  }

  private cleanup() {
    this.closed = true;
    if (this.clientKeepAlive) {
      clearInterval(this.clientKeepAlive);
      this.clientKeepAlive = null;
    }
    if (this.googleLive) {
      this.googleLive.close();
      this.googleLive = null;
    }
    this.queuedAudio = [];
    scheduleVoiceEndFlush(this.ticket.conversationId, 4000);
    this.onClosed();
  }
}

function toBuffer(data: RawData): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (Array.isArray(data)) return Buffer.concat(data);
  return Buffer.alloc(0);
}

function rejectUpgrade(socket: Duplex, status: number, message: string) {
  if (socket.destroyed) return;
  socket.write(
    `HTTP/1.1 ${status} ${message}\r\nConnection: close\r\nContent-Type: text/plain\r\nContent-Length: ${Buffer.byteLength(
      message,
    )}\r\n\r\n${message}`,
  );
  socket.destroy();
}

function clampInteger(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.round(value)));
}

function safeError(error: unknown): string {
  return error instanceof Error ? error.message : 'unknown error';
}

