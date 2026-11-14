class SergeantPcmPlaybackProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.inputRate = 24000;
    // Pre-allocate 120 seconds of Float32 audio at 24kHz so the real-time audio thread never allocates/slices arrays
    this.capacity = 24000 * 120;
    this.buffer = new Float32Array(this.capacity);
    this.writeIndex = 0;
    this.readPos = 0;
    this.playing = false;
    this.ended = false;
    this.epoch = null;
    // Gemini 3.8 Live sends an initial ~720ms burst and then pauses ~1033ms while synthesizing the next clause.
    // Waiting for 1000ms (or this.ended for short replies <1000ms) eliminates mid-sentence buffer underruns.
    this.baseTargetMs = 1000;
    this.targetMs = 1000;
    this.maxTargetMs = 1400;
    this.underruns = 0;
    this.maxBufferedSamples = 0;
    this.wasUnderrun = false;

    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === 'reset') {
        this.reset();
      } else if (data.type === 'start') {
        this.reset();
        this.inputRate = Number(data.sampleRate) || 24000;
        this.epoch = data.epoch || null;
      } else if (data.type === 'audio' && data.buffer instanceof ArrayBuffer) {
        this.pushPcm16(data.buffer);
      } else if (data.type === 'end') {
        this.ended = true;
        if (this.availableSamples() === 0) {
          this.finishEpoch();
        }
      }
    };
  }

  reset() {
    this.writeIndex = 0;
    this.readPos = 0;
    this.playing = false;
    this.ended = false;
    this.epoch = null;
    this.targetMs = this.baseTargetMs;
    this.underruns = 0;
    this.maxBufferedSamples = 0;
    this.wasUnderrun = false;
  }

  availableSamples() {
    return Math.max(0, this.writeIndex - Math.floor(this.readPos));
  }

  pushPcm16(buffer) {
    const pcm = new Int16Array(buffer);
    if (this.writeIndex + pcm.length > this.capacity) {
      // Compact unread samples to the start of the pre-allocated buffer
      const readIdx = Math.floor(this.readPos);
      const frac = this.readPos - readIdx;
      const remaining = Math.max(0, this.writeIndex - readIdx);
      if (remaining > 0 && readIdx > 0) {
        this.buffer.copyWithin(0, readIdx, this.writeIndex);
      }
      this.writeIndex = remaining;
      this.readPos = frac;
    }

    const limit = Math.min(pcm.length, this.capacity - this.writeIndex);
    for (let i = 0; i < limit; i += 1) {
      this.buffer[this.writeIndex + i] = pcm[i] / 32768;
    }
    this.writeIndex += limit;

    const available = this.availableSamples();
    if (available > this.maxBufferedSamples) {
      this.maxBufferedSamples = available;
    }
  }

  finishEpoch() {
    const finishedEpoch = this.epoch;
    const underruns = this.underruns;
    const maxBufferMs = Math.round((this.maxBufferedSamples / this.inputRate) * 1000);
    this.reset();
    this.port.postMessage({
      type: 'drained',
      epoch: finishedEpoch,
      underruns,
      maxBufferMs,
    });
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    if (!output || !output[0]) return true;
    const channel = output[0];
    channel.fill(0);

    const available = this.availableSamples();
    const targetSamples = Math.max(1, Math.round((this.inputRate * this.targetMs) / 1000));

    if (!this.playing) {
      if (available >= targetSamples || (this.ended && available > 0)) {
        this.playing = true;
        if (this.wasUnderrun) {
          this.wasUnderrun = false;
          this.port.postMessage({
            type: 'rebuffered',
            epoch: this.epoch,
            count: this.underruns,
            bufferedMs: Math.round((available / this.inputRate) * 1000),
            targetMs: this.targetMs,
          });
        }
      } else {
        if (this.ended && available === 0 && this.epoch) {
          this.finishEpoch();
        }
        return true;
      }
    }

    const step = this.inputRate / sampleRate;
    for (let i = 0; i < channel.length; i += 1) {
      const idx = Math.floor(this.readPos);
      if (idx >= this.writeIndex) {
        this.playing = false;
        if (this.ended) {
          this.finishEpoch();
        } else {
          this.underruns += 1;
          this.wasUnderrun = true;
          this.targetMs = Math.min(this.maxTargetMs, this.targetMs + 150);
          this.port.postMessage({
            type: 'underrun',
            epoch: this.epoch,
            count: this.underruns,
            bufferedMs: 0,
            targetMs: this.targetMs,
          });
        }
        break;
      }

      const nextIdx = Math.min(this.writeIndex - 1, idx + 1);
      const frac = this.readPos - idx;
      const s0 = this.buffer[idx] || 0;
      const s1 = this.buffer[nextIdx] || 0;
      channel[i] = s0 + (s1 - s0) * frac;
      this.readPos += step;
    }

    if (this.readPos >= 48000 && Math.floor(this.readPos) >= this.writeIndex) {
      this.writeIndex = 0;
      this.readPos = 0;
    }

    return true;
  }
}

registerProcessor('sergeant-pcm-playback', SergeantPcmPlaybackProcessor);
