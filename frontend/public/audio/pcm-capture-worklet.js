class SergeantPcmCaptureProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunkFrames = Math.max(512, Math.round(sampleRate * 0.04));
    this.buffer = new Int16Array(this.chunkFrames);
    this.offset = 0;
    this.sumSquares = 0;
    this.sampleCount = 0;
    this.speaking = false;
    this.assistantSpeaking = false;
    this.speechFrames = 0;
    this.silenceFrames = 0;
    this.baseSpeechThreshold = 0.012;
    this.bargeInSpeechThreshold = 0.035;
    this.silenceThreshold = 0.007;
    this.speechStartChunks = 2;
    this.silenceEndChunks = Math.max(8, Math.round(0.45 / 0.04));

    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === 'assistant_speaking') {
        this.assistantSpeaking = Boolean(data.speaking);
        if (this.assistantSpeaking) {
          this.speaking = false;
          this.speechFrames = 0;
        }
      }
    };
  }

  flushChunk() {
    if (this.offset <= 0) return;
    const out = this.buffer.slice(0, this.offset);
    const rms = this.sampleCount > 0 ? Math.sqrt(this.sumSquares / this.sampleCount) : 0;
    this.offset = 0;
    this.sumSquares = 0;
    this.sampleCount = 0;

    const activeThreshold = this.assistantSpeaking
      ? this.bargeInSpeechThreshold
      : this.baseSpeechThreshold;
    const startChunksNeeded = this.assistantSpeaking ? 3 : this.speechStartChunks;

    if (rms >= activeThreshold) {
      this.speechFrames += 1;
      this.silenceFrames = 0;
      if (!this.speaking && this.speechFrames >= startChunksNeeded) {
        this.speaking = true;
        this.port.postMessage({ type: 'speech_start', rms });
      }
    } else if (rms < this.silenceThreshold) {
      this.speechFrames = 0;
      if (this.speaking) {
        this.silenceFrames += 1;
        if (this.silenceFrames >= this.silenceEndChunks) {
          this.speaking = false;
          this.silenceFrames = 0;
          this.port.postMessage({ type: 'speech_end' });
        }
      }
    }

    // While the assistant is actively speaking, do NOT stream background silence / speaker bleed
    // to Gemini Live (which throttles Gemini's audio generation and triggers false interruptions).
    // Only stream mic audio while assistant is speaking if the user actually barges in (this.speaking === true).
    if (this.assistantSpeaking && !this.speaking) {
      return;
    }

    this.port.postMessage(out.buffer, [out.buffer]);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const channel = input[0];

    for (let i = 0; i < channel.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, channel[i]));
      this.sumSquares += sample * sample;
      this.sampleCount += 1;
      this.buffer[this.offset] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      this.offset += 1;
      if (this.offset >= this.chunkFrames) {
        this.flushChunk();
      }
    }

    return true;
  }
}

registerProcessor('sergeant-pcm-capture', SergeantPcmCaptureProcessor);
