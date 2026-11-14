# Voice module rebuild from working Shaista implementation

The previous portfolio repair was rejected after the user's listening test. This rebuild replaces that implementation; do not treat earlier zero-underrun tests as user acceptance.

## Reference inspected (read-only)

SSH shaista, /root/shaista/sergeant-ai-coach:
- backend/src/lib/googleLiveSession.ts
- backend/src/lib/voiceGateway.ts
- frontend/src/hooks/useVoiceCall.ts
- frontend/public/audio/pcm-capture-worklet.js
- frontend/public/audio/pcm-playback-worklet.js

Reference files were downloaded to /tmp/shaista-voice-reference. No files or services were changed on Shaista. Its user accounts, database, secrets, coaching memory and ticket system were not copied into the public portfolio.

## New portfolio architecture

- services/voice/googleLiveSession.ts: standalone Google native audio session; native browser sample rate resampled to 16kHz on the server; Google's default automatic turn detection; binary 24kHz PCM output, explicit assistant/audio turn IDs.
- services/geminiLiveWsProxy.ts: validated start/stop/mute controls and binary audio bridge at the existing /ws/live-voice endpoint.
- hooks/useVoiceCall.ts: mic and socket lifecycle, generation guards against late async work, real microphone mute, turn-scoped playback, transcript history, cleanup on close/mode switch/unmount.
- pcm-capture-worklet.js and pcm-playback-worklet.js: adapted directly from deployed Shaista, renamed processors. Capture has 80Hz high-pass filtering, adaptive noise floor, soft noise attenuation, 20ms frames. Playback uses the reference's 180ms initial target, adaptive rebuffering up to 360ms, ramps and diagnostics. Added epoch to drained notifications to prevent a stale completion changing a new turn's UI.
- Voice prompt is separate from chat instructions and reuses the existing portfolio factual knowledge. Natural short replies, no repeated language advertising, one relevant question at a time, no invented availability/prices. Inquiry email requires caller confirmation; only confirmed tool success is described as sent. Calendly remains necessary to book a meeting.
- Call UI replaced with a compact white/navy/blue panel, start/end, mic mute, timer, optional transcript. Existing text-chat endpoint and booking links retained.

## Checks

- Backend and frontend builds passed.
- Seven automated tests passed: PCM rate conversion, control/binary event ordering, interruption and replacement IDs, output continuity/drain, short response, jitter diagnostics, 44.1kHz playback.
- Real production browser, 390x844: no page errors, no horizontal overflow; Google greeting played/drained with zero underruns. Mute/unmute, end/restart, close passed.
- Subjective audio quality on the user's actual microphone/speakers still requires their acceptance. No claim that all internet/provider delays can be eliminated.

## Deployment

https://shoaib.159-195-16-164.sslip.io/
SSH scott, /root/shoaib-portfolio; service shoaib-portfolio (8090).
Only rebuilt voice backend modules and frontend build/assets deployed. Scott Executive Ally services unaffected. Existing private GEMINI_API_KEY retained; no Shaista credentials copied.
Backup: /root/shoaib-backups/voice-before-rebuild-20261114.tgz (backend/dist and frontend/dist).
Local previous source: /tmp/shoaib-voice-v1-backup.
Frontend and backend protocol changed together; refresh older open tabs before testing.

Real production barge-in verification also passed: synthesized spoken question streamed in 20ms PCM frames during the greeting; Google emitted one assistant.interrupted event, transcribed the question, then produced 30 binary audio chunks for the relevant new answer. No inquiry/email was sent. Two browser calls each reported zero underruns in server playback logs.

## Follow-up after real user test

The user still heard severe stuttering. Live evidence confirmed the report: calls at 08:25–08:26 produced 6, 10 and 13 playback underruns per response. The service used only about 28 MB RAM, Google network RTT was about 2.5 ms with no packet loss, and the backend stayed active. The failure was not CPU/RAM exhaustion: Gemini sometimes delivered less than 180–360 ms of audio before the current playback buffer emptied. Rebuffering caused each audible stop/start.

Playback now uses complete-turn smoothing. Gemini audio remains buffered on the backend until `turnComplete`, then one contiguous PCM block is sent to the browser. This intentionally adds the remaining generation time before speech begins but prevents packet timing from breaking speech. A local `speech_start` signal flushes playback immediately for barge-in even though the provider turn has already completed.

Production browser verification after this change: Google generated 3,560 ms of audio in 3,566 ms; the browser received the complete 170,880-byte block and played it with zero underruns. Desktop dropdown was also replaced with a compact white two-column panel; 1200x850 check measured 610x307 px, no viewport overflow, and no page errors.

Backup immediately before this follow-up: `/root/shoaib-backups/voice-dropdown-before-smooth-20261114.tgz`.
