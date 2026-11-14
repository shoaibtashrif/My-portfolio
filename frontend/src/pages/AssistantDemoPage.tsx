import { FormEvent, useRef, useState } from 'react';
import {
  Bot,
  Calendar,
  CheckCircle2,
  Globe,
  Mic,
  Send,
  Square,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';

interface Message {
  role: 'user' | 'model';
  text: string;
  bookingSubmitted?: boolean;
  calendlyUrl?: string;
}

const STARTER_PROMPTS = [
  'Tell me about Shoaib’s Voice AI & LangGraph experience.',
  'Shoaib ne healthcare aur automation mein kya projects banaye hain?',
  'I want to book a 30-minute call with Shoaib.',
  'What is Shoaib’s full-stack tech stack?',
];

function pcmToWavUrl(base64Pcm: string, sampleRate = 24000): string {
  const binary = atob(base64Pcm);
  const pcmLen = binary.length;
  const buffer = new ArrayBuffer(44 + pcmLen);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmLen, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLen, true);

  const bytes = new Uint8Array(buffer, 44);
  for (let i = 0; i < pcmLen; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return URL.createObjectURL(new Blob([buffer], { type: 'audio/wav' }));
}

export default function AssistantDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hello! I am Shoaib's personal AI assistant. Ask me anything about Shoaib Tashrif's AI engineering experience, voice systems, projects, or tech stack in any language — or tell me your name, email, and topic to submit an inquiry and book a 30-minute call on Calendly.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [statusNote, setStatusNote] = useState<string>('Ready · Multilingual Voice & Text');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  function speakFallback(text: string) {
    if (!voiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      text.replace(/https?:\/\/\S+/g, 'the Calendly link on screen')
    );
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  }

  function playResponseAudio(audioBase64: string | null, audioMimeType: string | null, fallbackText: string) {
    if (!voiceOutputEnabled) return;
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }

    if (!audioBase64) {
      speakFallback(fallbackText);
      return;
    }

    try {
      let srcUrl: string;
      if (audioMimeType && audioMimeType.includes('pcm')) {
        srcUrl = pcmToWavUrl(audioBase64, 24000);
      } else if (audioMimeType && !audioMimeType.includes('pcm')) {
        srcUrl = `data:${audioMimeType};base64,${audioBase64}`;
      } else {
        srcUrl = pcmToWavUrl(audioBase64, 24000);
      }
      const audio = new Audio(srcUrl);
      activeAudioRef.current = audio;
      audio.play().catch(() => speakFallback(fallbackText));
    } catch {
      speakFallback(fallbackText);
    }
  }

  async function sendTextMessage(textToSend: string) {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setStatusNote('Thinking with Gemini 3.8...');

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chat request failed');

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: data.reply,
          bookingSubmitted: Boolean(data.bookingSubmitted),
          calendlyUrl: data.calendlyUrl,
        },
      ]);
      setStatusNote('Ready · Multilingual Voice & Text');
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `Sorry, I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}`,
        },
      ]);
      setStatusNote('Ready');
    } finally {
      setLoading(false);
    }
  }

  async function toggleVoiceRecording() {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        if (blob.size < 500) {
          setStatusNote('Ready · Audio too short, please try again');
          return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = String(reader.result || '').split(',')[1] || '';
          setMessages((prev) => [...prev, { role: 'user', text: '🎤 [Voice Message Sent]' }]);
          setLoading(true);
          setStatusNote('Understanding voice & generating reply...');

          try {
            const res = await fetch('/api/assistant/voice', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64,
                mimeType,
                history: messages.map((m) => ({ role: m.role, text: m.text })),
              }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Voice processing failed');

            setMessages((prev) => [
              ...prev,
              {
                role: 'model',
                text: data.reply,
                bookingSubmitted: Boolean(data.bookingSubmitted),
                calendlyUrl: data.calendlyUrl,
              },
            ]);
            playResponseAudio(data.audioBase64, data.audioMimeType, data.reply);
            setStatusNote('Ready · Multilingual Voice & Text');
          } catch (err) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'model',
                text: `Voice error: ${err instanceof Error ? err.message : 'Unable to process audio'}`,
              },
            ]);
            setStatusNote('Ready');
          } finally {
            setLoading(false);
          }
        };
        reader.readAsDataURL(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setStatusNote('Listening... Click Stop when finished speaking');
    } catch {
      setStatusNote('Microphone permission denied or unavailable');
    }
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    sendTextMessage(input);
  }

  return (
    <div>
      <section className="section-dark" style={{ paddingTop: 48, paddingBottom: 72 }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <span className="eyebrow" style={{ marginBottom: 10 }}>
                <Bot size={14} />
                Gemini 3.8 Multilingual Voice &amp; Chat
              </span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.7rem)', fontWeight: 800 }}>
                Shoaib&apos;s Personal AI Assistant
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span className="tag tag-dark">
                <Globe size={13} style={{ marginRight: 6 }} />
                All Languages Supported
              </span>
              <button
                type="button"
                onClick={() => setVoiceOutputEnabled((v) => !v)}
                className="btn btn-secondary-dark"
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                {voiceOutputEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                {voiceOutputEnabled ? 'Voice Reply: On' : 'Voice Reply: Muted'}
              </button>
              <a
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ padding: '8px 15px', fontSize: 13 }}
              >
                <Calendar size={15} />
                Calendly (30m)
              </a>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 310px',
              gap: 24,
              alignItems: 'start',
            }}
            className="assistant-grid"
          >
            {/* CHAT & VOICE CONSOLE */}
            <div
              style={{
                background: '#0E172C',
                border: '1px solid rgba(56, 189, 248, 0.22)',
                borderRadius: 18,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 540,
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid rgba(56, 189, 248, 0.14)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 13,
                  color: '#94A3B8',
                }}
              >
                <span>Status: <strong style={{ color: '#38BDF8' }}>{statusNote}</strong></span>
                <span>Knowledge Base v2.1.0</span>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: 20,
                  overflowY: 'auto',
                  maxHeight: 460,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      background: m.role === 'user' ? '#0284C7' : '#131F3A',
                      border:
                        m.role === 'user'
                          ? '1px solid #0EA5E9'
                          : '1px solid rgba(56, 189, 248, 0.18)',
                      color: '#F8FAFC',
                      padding: '12px 16px',
                      borderRadius: 14,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    <div>{m.text}</div>
                    {m.bookingSubmitted && (
                      <div
                        style={{
                          marginTop: 12,
                          paddingTop: 10,
                          borderTop: '1px solid rgba(56, 189, 248, 0.22)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ADE80', fontSize: 13, fontWeight: 700 }}>
                          <CheckCircle2 size={15} />
                          Inquiry Form Submitted &amp; Email Copy Sent!
                        </div>
                        <a
                          href={m.calendlyUrl || PORTFOLIO_PROFILE.calendlyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-primary"
                          style={{ padding: '8px 14px', fontSize: 13, alignSelf: 'flex-start' }}
                        >
                          <Calendar size={14} />
                          Pick 30-Min Slot on Calendly
                        </a>
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ fontSize: 13, color: '#38BDF8', fontStyle: 'italic' }}>
                    Shoaib&apos;s AI Assistant is responding...
                  </div>
                )}
              </div>

              <form
                onSubmit={handleFormSubmit}
                style={{
                  padding: 16,
                  borderTop: '1px solid rgba(56, 189, 248, 0.16)',
                  background: '#070D1E',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  disabled={loading}
                  title={recording ? 'Stop recording' : 'Speak in any language'}
                  className={recording ? 'voice-pulse' : ''}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 11,
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    background: recording ? '#DC2626' : 'rgba(2, 132, 199, 0.18)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {recording ? <Square size={17} /> : <Mic size={18} />}
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask in English, Urdu, Arabic, or any language..."
                  disabled={loading || recording}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    background: '#0E172C',
                    color: '#FFFFFF',
                    fontSize: 14,
                    outline: 'none',
                  }}
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn btn-primary"
                  style={{ padding: '12px 16px' }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* SIDEBAR SUGGESTIONS */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div className="card-dark">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#FFFFFF' }}>
                  Quick Prompts
                </h3>
                <div style={{ display: 'grid', gap: 8 }}>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendTextMessage(prompt)}
                      disabled={loading}
                      style={{
                        textAlign: 'left',
                        padding: '10px 12px',
                        borderRadius: 10,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(56, 189, 248, 0.18)',
                        color: '#E2E8F0',
                        fontSize: 13,
                        lineHeight: 1.45,
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-dark">
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#FFFFFF' }}>
                  Voice &amp; Booking Flow
                </h3>
                <p style={{ fontSize: 13.5, color: '#94A3B8', margin: 0, lineHeight: 1.6 }}>
                  Click the <strong style={{ color: '#38BDF8' }}>Mic button</strong> to speak in any
                  language, or ask the assistant to book a call — it collects your name, email, and
                  topic, emails both you and Shoaib, and gives you the Calendly link.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .assistant-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

