import { randomUUID } from 'node:crypto';
import WebSocket, { type RawData } from 'ws';
import { VOICE_PROMPT } from './prompt.js';
import { sendInquiryEmails } from '../mailer.js';

export function resamplePcm16(input: Buffer, sourceRate: number, targetRate = 16000): Buffer {
  if (input.length % 2) throw new Error('Invalid PCM');
  if (sourceRate === targetRate) return input;
  const count = input.length / 2;
  if (!count) return Buffer.alloc(0);
  const ratio = sourceRate / targetRate;
  const output = Buffer.alloc(Math.floor(count / ratio) * 2);
  for (let i = 0; i < output.length / 2; i++) {
    const position = i * ratio;
    const index = Math.floor(position);
    const a = input.readInt16LE(Math.min(index, count - 1) * 2);
    const b = input.readInt16LE(Math.min(index + 1, count - 1) * 2);
    output.writeInt16LE(Math.round(a + (b - a) * (position - index)), i * 2);
  }
  return output;
}
interface Callbacks {
  json: (data: Record<string, unknown>) => void;
  audio: (data: Buffer) => void;
  end: () => void;
}
export class GoogleLiveSession {
  private socket: WebSocket | null = null;
  private ready = false;
  private closed = false;
  private muted = false;
  private turn: string | null = null;
  private audioStarted = false;
  private user = '';
  private assistant = '';
  private turnAudio: Buffer[] = [];
  private firstAudioAt = 0;
  private queued: Buffer[] = [];
  private setupTimer: ReturnType<typeof setTimeout> | undefined;
  private cancelledTools = new Set<string>();
  private seenTools = new Set<string>();
  private chunks = 0;
  private interruptions = 0;
  private started = Date.now();
  constructor(private rate: number, private callbacks: Callbacks) {}
  start(history: { role: string; content: string }[] = []) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return this.fail('Voice calling is temporarily unavailable.');
    const model = (process.env.GEMINI_LIVE_MODEL || 'gemini-3.8-live').replace(/^models\//, '');
    const socket = new WebSocket(`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${encodeURIComponent(key)}`, { perMessageDeflate: false });
    this.socket = socket;
    this.setupTimer = setTimeout(() => this.fail('Connection took too long. Please try again.'), 20000);
    socket.on('open', () => {
      if (this.closed) { socket.close(); return; }
      this.send({ setup: {
        model: `models/${model}`,
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: process.env.GEMINI_VOICE || 'Fenrir' } } } },
        systemInstruction: { parts: [{ text: VOICE_PROMPT + '\nRecent conversation (context only):\n' + JSON.stringify(history.slice(-6)) }] },
        inputAudioTranscription: {}, outputAudioTranscription: {},
        tools: [{ functionDeclarations: [{ name: 'submit_booking_inquiry', description: 'Send an inquiry after the caller confirms the details and agrees to send it. This does not book a meeting.', parameters: { type: 'OBJECT', properties: { name: { type: 'STRING' }, email: { type: 'STRING' }, topic: { type: 'STRING' }, company: { type: 'STRING' }, preferredTime: { type: 'STRING' } }, required: ['name', 'email', 'topic'] } }] }],
      } });
    });
    socket.on('message', raw => this.onMessage(raw));
    socket.on('error', () => this.fail('Voice connection failed. Please try again.'));
    socket.on('close', code => {
      console.info('portfolio_voice_closed', { code, durationMs: Date.now() - this.started, chunks: this.chunks, interruptions: this.interruptions });
      if (!this.closed) this.fail('The voice connection ended. Please call again.');
    });
  }
  private send(data: object) {
    if (!this.closed && this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(data));
  }
  private fail(message: string) {
    if (this.closed) return;
    this.callbacks.json({ type: 'error', message });
    this.close(); this.callbacks.end();
  }
  sendClientAudio(audio: Buffer) {
    if (this.closed || this.muted || !audio.length || audio.length % 2) return;
    const pcm = resamplePcm16(audio, this.rate);
    if (!this.ready) {
      // Only a small startup window; never replay seconds of old microphone input.
      if (this.queued.length < 10) this.queued.push(pcm);
      return;
    }
    if ((this.socket?.bufferedAmount || 0) > 64000) return this.fail('The network is too slow for a live call. Please reconnect.');
    this.send({ realtimeInput: { audio: { mimeType: 'audio/pcm;rate=16000', data: pcm.toString('base64') } } });
  }
  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted && this.ready) this.send({ realtimeInput: { audioStreamEnd: true } });
  }
  close() {
    if (this.closed) return;
    this.closed = true; this.ready = false; this.queued = [];
    clearTimeout(this.setupTimer);
    this.socket?.close(1000, 'Call ended');
  }
  private beginTurn() {
    if (this.turn) return;
    this.turn = randomUUID();
    if (this.user.trim()) this.callbacks.json({ type: 'transcript.final', text: this.user.trim() });
    this.callbacks.json({ type: 'assistant.started', turnId: this.turn });
  }
  private resetTurn() {
    this.turn = null;
    this.audioStarted = false;
    this.assistant = '';
    this.user = '';
    this.turnAudio = [];
    this.firstAudioAt = 0;
  }
  private onMessage(raw: RawData) {
    if (this.closed) return;
    let message: any;
    try { message = JSON.parse(raw.toString()); } catch { return; }
    if (message.setupComplete !== undefined) {
      this.ready = true; clearTimeout(this.setupTimer);
      this.callbacks.json({ type: 'listening.ready' });
      for (const pcm of this.queued) this.send({ realtimeInput: { audio: { mimeType: 'audio/pcm;rate=16000', data: pcm.toString('base64') } } });
      this.queued = [];
      this.send({ clientContent: { turns: [{ role: 'user', parts: [{ text: 'Greet me briefly, then listen.' }] }], turnComplete: true } });
    }
    if (message.error) return this.fail('Voice provider could not complete the request. Please try again.');
    if (message.goAway) return this.fail('This call session is ending. Please start a new call.');
    for (const id of message.toolCallCancellation?.ids || []) this.cancelledTools.add(id);
    for (const call of message.toolCall?.functionCalls || []) {
      if (!this.seenTools.has(call.id)) {
        this.seenTools.add(call.id);
        void this.runTool(call); // Never hold the media path behind SMTP.
      }
    }
    const sc = message.serverContent;
    if (!sc) return;
    if (sc.interrupted) {
      this.interruptions++;
      this.callbacks.json({ type: 'assistant.interrupted', turnId: this.turn });
      this.resetTurn();
    }
    if (sc.inputTranscription?.text) {
      this.user += sc.inputTranscription.text;
      this.callbacks.json({ type: 'transcript.partial', text: this.user.trim() });
    }
    if (!sc.interrupted) {
      for (const part of sc.modelTurn?.parts || []) {
        if (part.inlineData?.data && String(part.inlineData.mimeType).startsWith('audio/pcm')) {
          this.beginTurn();
          if (!this.audioStarted) this.firstAudioAt = Date.now();
          this.audioStarted = true;
          this.chunks++;
          // Gemini can occasionally produce PCM slower than realtime. Playing each
          // packet immediately makes the browser repeatedly run out of samples.
          // Keep this concise turn server-side, then deliver one contiguous PCM
          // block. This trades a little response-start latency for clean speech.
          this.turnAudio.push(Buffer.from(part.inlineData.data, 'base64'));
        }
      }
      if (sc.outputTranscription?.text) {
        this.beginTurn(); this.assistant += sc.outputTranscription.text;
        this.callbacks.json({ type: 'assistant.text.delta', turnId: this.turn, text: sc.outputTranscription.text });
      }
    }
    if (sc.turnComplete) {
      if (this.turn) {
        if (this.audioStarted && this.turnAudio.length) {
          const audio = Buffer.concat(this.turnAudio);
          this.callbacks.json({ type: 'audio.start', turnId: this.turn, sampleRate: 24000 });
          this.callbacks.audio(audio);
          this.callbacks.json({ type: 'audio.end', turnId: this.turn });
          console.info('portfolio_voice_turn_buffered', {
            generationMs: Date.now() - this.firstAudioAt,
            audioMs: Math.round((audio.length / 2 / 24000) * 1000),
            bytes: audio.length,
          });
        }
        this.callbacks.json({ type: 'assistant.text.final', turnId: this.turn, text: this.assistant });
      }
      this.resetTurn();
    }
  }
  private async runTool(call: any) {
    if (call.name !== 'submit_booking_inquiry' || this.closed) return;
    const args = call.args || {};
    let emailSent = false;
    if (typeof args.name === 'string' && args.name.length <= 150 && typeof args.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email) && typeof args.topic === 'string' && args.topic.length <= 5000) {
      try {
        await sendInquiryEmails({ name: args.name, email: args.email, topic: args.topic, message: args.topic, company: String(args.company || '').slice(0,200), preferredTime: String(args.preferredTime || '').slice(0,200), source: 'ai_assistant_voice' });
        emailSent = true;
      } catch { console.warn('portfolio_voice_inquiry_delivery_failed'); }
    }
    if (this.closed || this.cancelledTools.has(call.id)) return;
    const calendlyUrl = process.env.CALENDLY_URL || 'https://calendly.com/shoaib-tashrif/30min';
    this.callbacks.json({ type: 'booking.result', emailSent, calendlyUrl });
    this.send({ toolResponse: { functionResponses: [{ id: call.id, name: call.name, response: { emailSent, calendlyUrl, note: emailSent ? 'Inquiry sent. Visitor must choose a slot to book.' : 'Email not sent. Offer booking link; do not claim success.' } }] } });
  }
}
