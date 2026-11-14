# Gemini Live voice repair — November 14, 2026

Project: shoaib-portfolio, service shoaib-portfolio on SSH host scott. This deployment does not modify the Executive Ally app.

## Findings

- The browser scheduled individual AudioBufferSourceNodes on the React/main thread with only 75ms initial protection against packet jitter.
- Gemini messages were serialized through a Promise chain including SMTP work, so slow email delivery could block audio and interruption messages. The service journal showed an SMTP timeout (separate email delivery problem, not repaired here).
- Capture could transmit before provider setup and accumulate old microphone audio.
- The source had a hardcoded Gemini key fallback. Removed it; existing server GEMINI_API_KEY is configured and remains private.
- Real provider timing test: 6.21 seconds of PCM arrived over approximately 8.77 seconds after the first packet, with some packet gaps above one second. No playback implementation can maintain both zero latency and uninterrupted output when the provider consistently produces audio slower than realtime.

## Changes

- AudioWorklet queue renders Gemini PCM16 LE 24kHz on the audio thread, resampling to the device rate. Uses one native-rate duplex AudioContext with browser echo cancellation/noise suppression.
- Starts with 600ms buffered audio; after starvation increases the buffer by 300ms up to 2 seconds. Completed short turns drain without waiting for the threshold. Small fade avoids clicks on stop/underrun.
- Server interruption clears queued speech immediately. Playback does not stop merely because input transcription arrives.
- Microphone 40ms frames only transmit after setupComplete. Congestion fails with a reconnect message rather than replaying accumulated stale speech.
- Independent media/tool processing; explicit automatic VAD with low speech-start sensitivity, 200ms prefix padding and 500ms silence; context compression enabled.
- Async start/cancel generation guard, explicit AudioContext resume, resource cleanup, setup timeout, bounded WebSocket payloads/output buffering. Session expiry prompts a fresh call; automatic session resumption is not implemented.
- Structured close diagnostics include duration/audio chunk count/interruption count, no audio or transcripts.
- Tool result no longer claims email succeeded after delivery failure.

## Validation

- Backend TypeScript and frontend production builds pass.
- `node --test tests/live-playback.test.mjs`: five passing tests (queue continuity, interruption/new turn, short final response, jitter recovery, 44.1kHz drift).
- Real production TLS WebSocket: setup accepted for gemini-3.8-live, audio greeting and turnComplete received.
- Synthetic spoken PCM streamed in real time during greeting: real provider interruption received, input transcription received, subsequent relevant voice reply received. No booking/email tool invoked.
- Headless Chrome with fake microphone: no page errors; audio worklet active; injected interruption zeroed queue. The first 120ms-buffer implementation showed repeated underruns and was increased based on actual measurements. Updated test showed one underrun, rather than eight, under that test run; this is not a controlled benchmark or a guarantee on other networks.
- Human speaker/microphone echo conditions and subjective quality still need a live listening check.

## Deployment / rollback

Public URL: https://shoaib.159-195-16-164.sslip.io/
Backend: /root/shoaib-portfolio/backend/dist/services/geminiLiveWsProxy.js
Frontend: /root/shoaib-portfolio/frontend/dist (prior hashed assets retained).
Service: shoaib-portfolio, port 8090.
Rollback: /root/shoaib-backups/voice-before-20261114.tgz contains previous backend/dist and frontend/dist. Source paths were absent remotely; archive contains the compiled artifacts despite tar warning for missing source files. Local original source copies are in /tmp/shoaib-voice-before; preserve privately (old source contains an embedded credential).
Restore compiled artifacts from the private backup and restart shoaib-portfolio if needed. Do not restart or alter scott-backend/scott-preview.

Official references:
- https://ai.google.dev/gemini-api/docs/live-api/best-practices
- https://ai.google.dev/gemini-api/docs/live-api/capabilities

Final production browser check after deployment: silent fake microphone, real Google greeting, 22 received audio chunks, turnComplete received, queue fully drained, **zero playback underruns and zero page errors**. Real speaker echo / human barge-in remains a manual acceptance check.
