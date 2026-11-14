import { randomUUID } from 'node:crypto';
import WebSocket from 'ws';
import { SHOAIB_SYSTEM_PROMPT } from '../data/shoaibKnowledge.js';

const GOOGLE_LIVE_WS_URL =
  'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent';

export interface GoogleLiveCallbacks {
  sendJson: (payload: Record<string, unknown>) => void;
  sendAudio: (audio: Buffer) => void;
  updateState: (status: string) => void;
  log: (event: string, fields?: Record<string, unknown>) => void;
}

export interface SpeechAccount {
  id: string;
  apiKey: string;
  model: string;
  voiceName: string;
}

export interface VoiceTicketPayload {
  userId: string;
  conversationId: string;
  callId: string;
  openingContext?: string;
}

const VOICE_CONVERSATION_RULES = `
VOICE CONVERSATION RULES:
- Speak naturally, warmly, and concisely (1 to 3 short sentences per turn) as Shoaib Tashrif's personal AI assistant.
- Support 90+ languages seamlessly: automatically detect the caller's language and respond in that exact language.
- Do not use markdown formatting, bullet points, or raw URLs in spoken replies.
- If the caller interrupts you, immediately adapt to what they just said.
`.trim();

/**
 * Downsamples mono Int16 PCM audio from `sourceRate` to `targetRate` (16 kHz)
 * using linear interpolation so browser 48 kHz and mobile 16 kHz inputs both
 * stream cleanly to Gemini Live.
 */
export function resamplePcm16(input: Buffer, sourceRate: number, targetRate = 16_000): Buffer {
  if (!input.length || sourceRate === targetRate || sourceRate <= 0) return input;
  const inputSamples = Math.floor(input.length / 2);
  if (inputSamples === 0) return Buffer.alloc(0);
  const ratio = sourceRate / targetRate;
  const outputSamples = Math.max(1, Math.floor(inputSamples / ratio));
  const output = Buffer.allocUnsafe(outputSamples * 2);
  for (let i = 0; i < outputSamples; i++) {
    const srcPos = i * ratio;
    const idx = Math.floor(srcPos);
    const frac = srcPos - idx;
    const s0 = input.readInt16LE(Math.min(idx, inputSamples - 1) * 2);
    const s1 = input.readInt16LE(Math.min(idx + 1, inputSamples - 1) * 2);
    const sample = Math.max(-32768, Math.min(32767, Math.round(s0 + (s1 - s0) * frac)));
    output.writeInt16LE(sample, i * 2);
  }
  return output;
}

export class GoogleLiveSession {
  private ws: WebSocket | null = null;
  private ready = false;
  private closed = false;
  private queuedAudio: Buffer[] = [];
  private sampleRate = 16_000;
  private muted = false;

  private activeTurnId: string | null = null;
  private userMessageId: string | null = null;
  private assistantMessageId: string | null = null;
  private userTranscript = '';
  private userFinalized = false;
  private assistantText = '';
  private audioStarted = false;
  private turnNumber = 0;
  private messageQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly account: SpeechAccount,
    private readonly ticket: VoiceTicketPayload,
    private readonly callbacks: GoogleLiveCallbacks,
  ) {}

  async start(clientSampleRate: number): Promise<void> {
    this.sampleRate = clientSampleRate;
    if (this.closed) return;

    const voiceName = this.account.voiceName || 'Fenrir';
    const fullInstruction = `${SHOAIB_SYSTEM_PROMPT}\n\n${VOICE_CONVERSATION_RULES}`;

    const modelName = this.account.model.startsWith('models/')
      ? this.account.model
      : `models/${this.account.model || 'gemini-3.8-live'}`;

    const wsUrl = `${GOOGLE_LIVE_WS_URL}?key=${encodeURIComponent(this.account.apiKey)}`;
    const socket = new WebSocket(wsUrl);
    this.ws = socket;

    socket.on('open', () => {
      if (this.closed) {
        socket.close();
        return;
      }
      this.callbacks.log('google_live_connected', {
        model: modelName,
        voiceName,
        sampleRate: clientSampleRate,
      });
      socket.send(
        JSON.stringify({
          setup: {
            model: modelName,
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName },
                },
              },
            },
            systemInstruction: {
              parts: [{ text: fullInstruction }],
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        }),
      );
    });

    socket.on('message', (raw) => {
      this.messageQueue = this.messageQueue
        .then(() => this.onMessage(raw))
        .catch((error) => {
          console.warn(
            '[voice] Google Live message error:',
            error instanceof Error ? error.message : String(error),
          );
        });
    });

    socket.on('error', (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn('[voice] Google Live error:', msg);
      if (!this.closed) {
        this.callbacks.sendJson({
          type: 'error',
          code: 'stt_error',
          message: 'Google Live connection error. Check your Google AI Studio key and model.',
        });
      }
    });

    socket.on('close', (code, reason) => {
      const reasonText = reason.toString();
      this.callbacks.log('google_live_closed', { code, reason: reasonText || 'none' });
      this.ready = false;
      if (!this.closed && code !== 1000) {
        this.callbacks.sendJson({
          type: 'error',
          code: 'stt_error',
          message: reasonText || `Google Live closed (${code})`,
        });
      }
    });
  }

  sendClientAudio(audio: Buffer): void {
    if (this.closed || this.muted || !audio.length) return;
    const pcm16 = resamplePcm16(audio, this.sampleRate, 16_000);
    if (!pcm16.length) return;

    if (!this.ready || this.ws?.readyState !== WebSocket.OPEN) {
      if (this.queuedAudio.reduce((acc, b) => acc + b.length, 0) < 256_000) {
        this.queuedAudio.push(pcm16);
      }
      return;
    }

    this.ws.send(
      JSON.stringify({
        realtimeInput: {
          audio: {
            mimeType: 'audio/pcm;rate=16000',
            data: pcm16.toString('base64'),
          },
        },
      }),
    );
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.ready = false;
    if (
      this.ws &&
      (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)
    ) {
      this.ws.close(1000, 'Call ended');
    }
    this.ws = null;
  }

  private async onMessage(raw: WebSocket.RawData): Promise<void> {
    if (this.closed) return;
    let payload: Record<string, any>;
    try {
      payload = JSON.parse(raw.toString()) as Record<string, any>;
    } catch {
      return;
    }

    if (payload.setupComplete) {
      this.ready = true;
      for (const chunk of this.queuedAudio) {
        this.ws?.send(
          JSON.stringify({
            realtimeInput: {
              audio: { mimeType: 'audio/pcm;rate=16000', data: chunk.toString('base64') },
            },
          }),
        );
      }
      this.queuedAudio = [];
      this.callbacks.sendJson({ type: 'listening.ready' });
      this.callbacks.updateState('listening');

      if (this.ticket.openingContext && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            clientContent: {
              turns: [{ role: 'user', parts: [{ text: this.ticket.openingContext }] }],
              turnComplete: true,
            },
          }),
        );
      }
      return;
    }

    const sc = payload.serverContent;
    if (!sc) return;

    if (sc.inputTranscription?.text) {
      this.userTranscript += sc.inputTranscription.text;
      const preview = this.userTranscript.trim();
      if (preview) {
        this.callbacks.sendJson({ type: 'transcript.partial', text: preview });
      }
    }

    if (sc.interrupted) {
      const interruptedTurnId = this.activeTurnId;
      this.callbacks.log('google_live_interrupted', { turnId: interruptedTurnId });
      if (interruptedTurnId) {
        this.callbacks.sendJson({ type: 'assistant.interrupted', turnId: interruptedTurnId });
      }
      this.resetTurnState();
      this.callbacks.updateState('listening');
      return;
    }

    if (sc.modelTurn?.parts) {
      await this.ensureUserTurnFinalized();
      this.ensureAssistantTurnStarted();

      for (const part of sc.modelTurn.parts) {
        if (
          part.inlineData?.data &&
          String(part.inlineData.mimeType || '').startsWith('audio/pcm')
        ) {
          const audioBuf = Buffer.from(part.inlineData.data, 'base64');
          if (!this.audioStarted && this.activeTurnId) {
            this.audioStarted = true;
            this.callbacks.sendJson({
              type: 'audio.start',
              turnId: this.activeTurnId,
              sampleRate: 24_000,
            });
            this.callbacks.updateState('speaking');
          }
          if (audioBuf.length) {
            this.callbacks.sendAudio(audioBuf);
          }
        }
      }
    }

    if (sc.outputTranscription?.text) {
      await this.ensureUserTurnFinalized();
      this.ensureAssistantTurnStarted();
      const delta = String(sc.outputTranscription.text);
      this.assistantText += delta;
      if (this.activeTurnId) {
        this.callbacks.sendJson({
          type: 'assistant.text.delta',
          turnId: this.activeTurnId,
          text: delta,
        });
      }
    }

    if (sc.turnComplete) {
      await this.ensureUserTurnFinalized();
      const turnId = this.activeTurnId;
      const finalAssistant = this.assistantText.trim();
      if (turnId) {
        if (this.audioStarted) {
          this.callbacks.sendJson({ type: 'audio.end', turnId });
        }
        this.callbacks.sendJson({
          type: 'assistant.text.final',
          turnId,
          text: finalAssistant,
        });
      }
      const wasAudioStarted = this.audioStarted;
      this.callbacks.log('google_live_turn_complete', { turnId, audioStarted: wasAudioStarted });
      this.resetTurnState();
      if (!wasAudioStarted) {
        this.callbacks.updateState('listening');
      }
    }
  }

  private async ensureUserTurnFinalized(): Promise<void> {
    if (this.userFinalized) return;
    const text = this.userTranscript.trim();
    if (!text) return;
    this.userFinalized = true;
    this.userMessageId = `voice-user-${randomUUID()}`;
    this.callbacks.sendJson({ type: 'transcript.final', text });
    this.callbacks.updateState('thinking');
  }

  private ensureAssistantTurnStarted(): void {
    if (this.activeTurnId) return;
    this.turnNumber += 1;
    this.activeTurnId = randomUUID();
    this.assistantMessageId = `voice-assistant-${randomUUID()}`;
    this.callbacks.sendJson({ type: 'assistant.started', turnId: this.activeTurnId });
    this.callbacks.updateState('thinking');
  }

  private resetTurnState(): void {
    this.activeTurnId = null;
    this.userMessageId = null;
    this.assistantMessageId = null;
    this.userTranscript = '';
    this.userFinalized = false;
    this.assistantText = '';
    this.audioStarted = false;
  }
}

