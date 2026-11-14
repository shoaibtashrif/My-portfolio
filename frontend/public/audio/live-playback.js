// PCM playback lives on the audio thread, independent of React/rendering stalls.
class LivePlayback extends AudioWorkletProcessor {
  constructor() {
    super();
    this.queue = []; this.offset = 0; this.samples = 0;
    this.playing = false; this.finished = false; this.last = 0;
    this.reportClock = 0; this.underruns = 0;
    this.target = 14400; // 600 ms cushion: observed provider packets can arrive slower than realtime
    this.port.onmessage = ({ data }) => {
      if (data.type === 'clear') {
        this.queue = []; this.offset = 0; this.samples = 0;
        this.playing = false; this.finished = false;
        this.port.postMessage({ type: 'state', queued: 0, underruns: this.underruns });
      } else if (data.type === 'end') {
        this.finished = true;
      } else if (data.type === 'audio') {
        // Bound memory/latency if a suspended tab accumulates minutes of speech.
        if (this.samples + data.samples.length > 24000 * 60) {
          this.port.postMessage({ type: 'overflow' }); return;
        }
        this.queue.push(data.samples); this.samples += data.samples.length;
        this.finished = false;
      }
    };
  }
  process(_inputs, outputs) {
    const out = outputs[0][0];
    const step = 24000 / sampleRate;
    if (!this.playing && (this.samples >= this.target || (this.finished && this.samples > 0))) {
      this.playing = true;
    }
    for (let i = 0; i < out.length; i++) {
      if (this.playing && this.samples > 0 && this.queue.length) {
        const head = this.queue[0];
        const index = Math.floor(this.offset);
        const a = head[index] || 0;
        const b = index + 1 < head.length ? head[index + 1] : (this.queue[1]?.[0] ?? a);
        out[i] = a + (b - a) * (this.offset - index);
        this.last = out[i];
        this.offset += step; this.samples = Math.max(0, this.samples - step);
        while (this.queue.length && this.offset >= this.queue[0].length) {
          this.offset -= this.queue.shift().length;
        }
        if (!this.queue.length) {
          this.offset = 0; this.samples = 0; this.playing = false;
          if (!this.finished) {
            this.underruns++;
            this.target = Math.min(48000, this.target + 7200); // rebuffer after network jitter
          }
        }
      } else {
        // Short ramp avoids clicks when interrupted or when a stream underruns.
        this.last *= 0.95;
        if (Math.abs(this.last) < 0.00001) this.last = 0;
        out[i] = this.last;
      }
    }
    this.reportClock += out.length;
    if (this.reportClock >= sampleRate / 20) {
      this.reportClock = 0;
      this.port.postMessage({ type: 'state', queued: this.samples, underruns: this.underruns });
    }
    return true;
  }
}
registerProcessor('live-playback', LivePlayback);
