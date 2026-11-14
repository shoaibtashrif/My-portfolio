'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceCallStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'ended'
  | 'error';

export type VoiceStatus = VoiceCallStatus;

export interface VoiceTurnMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UseVoiceCallOptions {
  onTurnMessage?: (message: VoiceTurnMessage) => void;
}

export function useVoiceCall(
  optionsOrCallback: UseVoiceCallOptions | ((message: VoiceTurnMessage) => void) = {},
) {
  const onTurnMessage =
    typeof optionsOrCallback === 'function'
      ? optionsOrCallback
      : optionsOrCallback.onTurnMessage;

  const [status, setStatus] = useState<VoiceCallStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [muted, setMuted] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveAssistantText, setLiveAssistantText] = useState('');
  const [callId, setCallId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [booking, setBooking] = useState<{ emailSent: boolean; calendlyUrl: string } | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const captureNodeRef = useRef<AudioWorkletNode | null>(null);
  const playbackNodeRef = useRef<AudioWorkletNode | null>(null);
  const currentTurnIdRef = useRef<string | null>(null);
  const mutedRef = useRef(false);
  const listeningReadyRef = useRef(false);
  const startingRef = useRef(false);
  const callGenerationRef = useRef(0);
  const onTurnMessageRef = useRef(onTurnMessage);
  onTurnMessageRef.current = onTurnMessage;

  const releaseResources = useCallback(() => {
    callGenerationRef.current += 1;
    startingRef.current = false;
    listeningReadyRef.current = false;
    currentTurnIdRef.current = null;

    const socket = socketRef.current;
    socketRef.current = null;
    if (socket) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'stop' }));
        }
        socket.close();
      } catch {
        // Ignore socket shutdown failures.
      }
    }

    if (captureNodeRef.current) {
      try {
        captureNodeRef.current.disconnect();
      } catch {
        // Ignore graph cleanup errors.
      }
      captureNodeRef.current = null;
    }

    if (playbackNodeRef.current) {
      try {
        playbackNodeRef.current.port.postMessage({ type: 'reset' });
        playbackNodeRef.current.disconnect();
      } catch {
        // Ignore graph cleanup errors.
      }
      playbackNodeRef.current = null;
    }

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) {
        track.stop();
      }
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      const ctx = audioContextRef.current;
      audioContextRef.current = null;
      if (ctx.state !== 'closed') {
        void ctx.close().catch(() => {});
      }
    }
  }, []);

  const stopCall = useCallback(() => {
    releaseResources();
    setStatus('ended');
    setMuted(false);
    mutedRef.current = false;
  }, [releaseResources]);

  useEffect(() => {
    return () => {
      releaseResources();
    };
  }, [releaseResources]);

  const isActive =
    status === 'connecting' ||
    status === 'listening' ||
    status === 'thinking' ||
    status === 'speaking';

  useEffect(() => {
    if (!isActive || status === 'connecting') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, status]);

  const startCall = useCallback(
    async (_history: VoiceTurnMessage[] = []) => {
      if (startingRef.current || status === 'connecting') return;
      startingRef.current = true;
      const generation = callGenerationRef.current + 1;
      callGenerationRef.current = generation;
      const isCurrent = () => callGenerationRef.current === generation;
      const failCall = (message: string) => {
        if (!isCurrent()) return;
        releaseResources();
        setErrorMessage(message);
        setStatus('error');
      };

      setStatus('connecting');
      setErrorMessage('');
      setLiveTranscript('');
      setLiveAssistantText('');
      setSeconds(0);
      setBooking(null);
      setMuted(false);
      mutedRef.current = false;
      listeningReadyRef.current = false;

      try {
        const audioContext = new AudioContext({ latencyHint: 'interactive' });
        audioContextRef.current = audioContext;
        await audioContext.resume();

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        if (!isCurrent()) {
          for (const track of mediaStream.getTracks()) track.stop();
          return;
        }
        mediaStreamRef.current = mediaStream;

        await audioContext.audioWorklet.addModule('/audio/pcm-capture-worklet.js?v=5');
        await audioContext.audioWorklet.addModule('/audio/pcm-playback-worklet.js?v=5');
        if (!isCurrent()) return;

        const captureNode = new AudioWorkletNode(audioContext, 'sergeant-pcm-capture');
        const playbackNode = new AudioWorkletNode(audioContext, 'sergeant-pcm-playback', {
          numberOfInputs: 0,
          numberOfOutputs: 1,
          outputChannelCount: [1],
        });
        captureNodeRef.current = captureNode;
        playbackNodeRef.current = playbackNode;
        playbackNode.connect(audioContext.destination);

        const micSource = audioContext.createMediaStreamSource(mediaStream);
        const silentGain = audioContext.createGain();
        silentGain.gain.value = 0;
        micSource.connect(captureNode);
        captureNode.connect(silentGain);
        silentGain.connect(audioContext.destination);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/v1/voice`;
        const socket = new WebSocket(wsUrl);
        socket.binaryType = 'arraybuffer';
        socketRef.current = socket;

        const sendJson = (payload: Record<string, unknown>) => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(payload));
          }
        };

        captureNode.port.onmessage = (event) => {
          if (
            !isCurrent() ||
            !listeningReadyRef.current ||
            mutedRef.current ||
            socket.readyState !== WebSocket.OPEN
          ) {
            return;
          }
          if (event.data instanceof ArrayBuffer) {
            const maxBufferedBytes = Math.round(audioContext.sampleRate * 2 * 1.0);
            if (socket.bufferedAmount > maxBufferedBytes) {
              failCall('Network connection is too slow for live voice right now.');
              return;
            }
            socket.send(event.data);
            return;
          }
          const payload = event.data as { type?: string };
          if (payload?.type === 'speech_start') {
            if (currentTurnIdRef.current) {
              playbackNode.port.postMessage({ type: 'reset' });
              captureNode.port.postMessage({ type: 'assistant_speaking', speaking: false });
              currentTurnIdRef.current = null;
              setLiveAssistantText('');
              setStatus('listening');
            }
            sendJson({ type: 'client.speech_start' });
          } else if (payload?.type === 'speech_end') {
            sendJson({ type: 'client.speech_end' });
          }
        };

        playbackNode.port.onmessage = (event) => {
          if (!isCurrent()) return;
          const data = event.data as {
            type?: string;
            epoch?: string | null;
            count?: number;
            bufferedMs?: number;
            targetMs?: number;
            underruns?: number;
            maxBufferMs?: number;
          };
          if (data?.type === 'drained') {
            if (!data.epoch || data.epoch === currentTurnIdRef.current) {
              const completedTurnId = currentTurnIdRef.current;
              currentTurnIdRef.current = null;
              captureNode.port.postMessage({ type: 'assistant_speaking', speaking: false });
              setStatus((prev) => (prev === 'speaking' ? 'listening' : prev));
              sendJson({
                type: 'playback_complete',
                turnId: completedTurnId,
                underruns: data.underruns ?? 0,
                maxBufferMs: data.maxBufferMs ?? 0,
              });
            }
            return;
          }

          if (data?.type === 'underrun' || data?.type === 'rebuffered') {
            sendJson({
              type: 'client.playback_metric',
              metric: data.type,
              turnId: data.epoch || currentTurnIdRef.current,
              count: data.count ?? 0,
              bufferedMs: data.bufferedMs ?? 0,
              targetMs: data.targetMs ?? 0,
            });
          }
        };

        socket.onopen = () => {
          if (!isCurrent()) return;
          sendJson({
            type: 'start',
            sampleRate: audioContext.sampleRate,
          });
        };

        socket.onmessage = (event) => {
          if (!isCurrent()) return;
          if (event.data instanceof ArrayBuffer) {
            if (!currentTurnIdRef.current) return;
            playbackNode.port.postMessage({ type: 'audio', buffer: event.data }, [event.data]);
            return;
          }

          try {
            const message = JSON.parse(String(event.data)) as Record<string, unknown>;
            switch (message.type) {
              case 'call.ready':
                setCallId(typeof message.callId === 'string' ? message.callId : null);
                break;
              case 'listening.ready':
                listeningReadyRef.current = true;
                setStatus('listening');
                break;
              case 'call.state':
                if (
                  message.status === 'connecting' ||
                  message.status === 'listening' ||
                  message.status === 'thinking' ||
                  message.status === 'speaking'
                ) {
                  if (message.status === 'listening' && currentTurnIdRef.current) {
                    break;
                  }
                  setStatus(message.status);
                }
                break;
              case 'transcript.partial':
                setLiveTranscript(typeof message.text === 'string' ? message.text : '');
                break;
              case 'transcript.final': {
                const text = typeof message.text === 'string' ? message.text : '';
                setLiveTranscript(text);
                if (text) onTurnMessageRef.current?.({ role: 'user', content: text });
                break;
              }
              case 'assistant.started':
                setLiveAssistantText('');
                setStatus('thinking');
                break;
              case 'assistant.text.delta':
                setLiveAssistantText((prev) =>
                  `${prev}${typeof message.text === 'string' ? message.text : ''}`,
                );
                break;
              case 'assistant.text.final': {
                const text = typeof message.text === 'string' ? message.text : '';
                setLiveAssistantText(text);
                if (text) onTurnMessageRef.current?.({ role: 'assistant', content: text });
                break;
              }
              case 'audio.start': {
                const turnId = typeof message.turnId === 'string' ? message.turnId : 'turn';
                currentTurnIdRef.current = turnId;
                captureNode.port.postMessage({ type: 'assistant_speaking', speaking: true });
                playbackNode.port.postMessage({
                  type: 'start',
                  sampleRate: Number(message.sampleRate) || 24000,
                  epoch: turnId,
                });
                setStatus('speaking');
                break;
              }
              case 'audio.end':
                if (
                  typeof message.turnId !== 'string' ||
                  message.turnId === currentTurnIdRef.current
                ) {
                  playbackNode.port.postMessage({ type: 'end' });
                }
                break;
              case 'assistant.interrupted':
                currentTurnIdRef.current = null;
                captureNode.port.postMessage({ type: 'assistant_speaking', speaking: false });
                playbackNode.port.postMessage({ type: 'reset' });
                setLiveAssistantText('');
                setStatus('listening');
                break;
              case 'booking.result':
                setBooking({
                  emailSent: message.emailSent === true,
                  calendlyUrl: typeof message.calendlyUrl === 'string' ? message.calendlyUrl : '',
                });
                break;
              case 'error':
                failCall(
                  typeof message.message === 'string' ? message.message : 'Voice call error',
                );
                break;
            }
          } catch {
            // Ignore malformed messages.
          }
        };

        socket.onerror = () => {
          failCall('Voice connection failed. Please try again.');
        };

        socket.onclose = (event) => {
          if (!isCurrent()) return;
          releaseResources();
          if (event.code !== 1000) {
            setErrorMessage(event.reason || 'Voice connection closed.');
            setStatus('error');
          } else {
            setStatus('ended');
          }
        };
      } catch (error) {
        if (!isCurrent()) return;
        const raw =
          error instanceof DOMException && error.name === 'NotAllowedError'
            ? 'Allow microphone access to start a call.'
            : error instanceof Error
            ? error.message
            : 'Unable to start voice call';
        failCall(raw);
      } finally {
        if (isCurrent()) {
          startingRef.current = false;
        }
      }
    },
    [releaseResources, status],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      mutedRef.current = next;
      const stream = mediaStreamRef.current;
      if (stream) {
        for (const track of stream.getAudioTracks()) {
          track.enabled = !next;
        }
      }
      const socket = socketRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'client.mute', muted: next }));
      }
      return next;
    });
  }, []);

  return {
    status,
    errorMessage,
    error: errorMessage,
    muted,
    liveTranscript,
    transcript: liveTranscript,
    liveAssistantText,
    assistant: liveAssistantText,
    callId,
    seconds,
    booking,
    isActive,
    active: isActive,
    startCall,
    stopCall,
    toggleMute,
  };
}
