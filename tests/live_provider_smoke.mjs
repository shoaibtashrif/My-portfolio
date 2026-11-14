import { readFileSync } from 'node:fs';
import { WebSocket } from '../backend/node_modules/ws/wrapper.mjs';

const speech = readFileSync('/tmp/voice-interrupt.pcm');
const socket = new WebSocket('wss://shoaib.159-195-16-164.sslip.io/ws/live-voice', {
  lookup: (_host, _options, callback) => callback(null, [{ address: '159.195.16.164', family: 4 }]),
});
let binaryMessages = 0;
let interval;
let transcript = '';
const started = Date.now();
const timeout = setTimeout(() => finish(false), 60000);

function finish(ok, reply = '') {
  clearTimeout(timeout);
  clearInterval(interval);
  console.log(JSON.stringify({ ok, binaryMessages, transcript, reply, elapsedMs: Date.now() - started }));
  socket.close();
  if (!ok) process.exitCode = 1;
}

socket.on('open', () => socket.send(JSON.stringify({ type: 'start', sampleRate: 16000 })));
socket.on('message', (raw, binary) => {
  if (binary) {
    binaryMessages += 1;
    if (binaryMessages === 1) {
      let offset = 0;
      interval = setInterval(() => {
        if (socket.readyState !== WebSocket.OPEN) return;
        socket.send(offset < speech.length ? speech.subarray(offset, offset + 640) : Buffer.alloc(640));
        offset += 640;
      }, 20);
    }
    return;
  }
  const message = JSON.parse(raw.toString());
  if (message.type === 'transcript.final') transcript = message.text;
  if (message.type === 'assistant.text.final' && binaryMessages >= 2 && transcript) {
    finish(true, message.text);
  }
  if (message.type === 'error') finish(false, message.message);
});
socket.on('error', () => finish(false));
