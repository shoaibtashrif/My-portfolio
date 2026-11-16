import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Bot, Calendar, Loader2, MessageSquare, Mic, MicOff, Phone, PhoneOff, Send, X } from 'lucide-react';
import { useVoiceCall } from '../hooks/useVoiceCall';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';
import { apiUrl } from '../config/api';
import ChatMessageText from './ChatMessageText';
import './assistant.css';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  calendlyUrl?: string;
  channel?: 'chat' | 'voice';
};

const INITIAL_GREETING = "Hi, I'm Shoaib's AI assistant. What are you working on?";

function createSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function FloatingAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: INITIAL_GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(createSessionId());
  const messagesRef = useRef<Message[]>(messages);
  messagesRef.current = messages;
  const lastSentCountRef = useRef(0);

  const voice = useVoiceCall({
    sessionId: sessionIdRef.current,
    onTurnMessage: (message) =>
      setMessages((previous) => [...previous, { ...message, channel: message.channel || 'voice' }]),
  });

  const flushTranscript = useCallback(
    (trigger: 'widget_closed' | 'voice_ended' | 'page_leave', useBeacon = false) => {
      const meaningful = messagesRef.current.filter(
        (m) => !(m.role === 'assistant' && m.content === INITIAL_GREETING),
      );
      const hasUserMessage = meaningful.some((m) => m.role === 'user');
      if (!hasUserMessage || meaningful.length <= lastSentCountRef.current) {
        return;
      }

      lastSentCountRef.current = meaningful.length;
      const hasVoice = meaningful.some((m) => m.channel === 'voice');
      const hasChat = meaningful.some((m) => m.channel !== 'voice');
      const resolvedMode = hasVoice && hasChat ? 'mixed' : hasVoice ? 'voice' : 'chat';

      const payload = JSON.stringify({
        sessionId: sessionIdRef.current,
        trigger,
        mode: resolvedMode,
        pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        messages: meaningful.map((m) => ({
          role: m.role,
          content: m.content,
          channel: m.channel || 'chat',
        })),
      });

      const endpoint = apiUrl('/api/assistant/transcript');
      if (useBeacon && typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const sent = navigator.sendBeacon(endpoint, new Blob([payload], { type: 'text/plain' }));
        if (sent) return;
      }

      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    },
    [],
  );

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener('open-shoaib-assistant', show);
    return () => window.removeEventListener('open-shoaib-assistant', show);
  }, []);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (voice.status === 'ended' || voice.status === 'error') {
      flushTranscript('voice_ended');
    }
  }, [flushTranscript, voice.status]);

  useEffect(() => {
    const onPageHide = () => flushTranscript('page_leave', true);
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushTranscript('page_leave', true);
      }
    };
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [flushTranscript]);

  const close = () => {
    voice.stopCall();
    setOpen(false);
    flushTranscript('widget_closed');
  };

  async function submit(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.slice(-10);
    setMessages((old) => [...old, { role: 'user', content: text, channel: 'chat' }]);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(apiUrl('/api/assistant/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          sessionId: sessionIdRef.current,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setMessages((old) => [
        ...old,
        { role: 'assistant', content: data.reply, calendlyUrl: data.calendlyUrl, channel: 'chat' },
      ]);
    } catch {
      setMessages((old) => [
        ...old,
        {
          role: 'assistant',
          content: 'Sorry, I could not connect. Please try again.',
          calendlyUrl: PORTFOLIO_PROFILE.calendlyUrl,
          channel: 'chat',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const labels = {
    idle: 'Let’s talk',
    connecting: 'Connecting…',
    listening: 'Listening',
    thinking: 'One moment…',
    speaking: 'Speaking',
    ended: 'Call ended',
    error: 'Could not connect',
  };

  return (
    <div className="portfolio-assistant">
      <button
        className="pa-launcher"
        aria-label={open ? 'Close AI Assistant' : 'Open AI Assistant'}
        onClick={() => (open ? close() : setOpen(true))}
      >
        {open ? (
          <X size={21} />
        ) : (
          <>
            <MessageSquare size={20} />
            <span>Ask Shoaib’s AI</span>
          </>
        )}
      </button>
      {open && (
        <section className="pa-panel" role="dialog" aria-label="Shoaib’s AI assistant">
          <header className="pa-header">
            <div className="pa-brand">
              <span className="pa-brand-icon">
                <Bot size={21} />
              </span>
              <div>
                <strong>Shoaib’s assistant</strong>
                <small>AI assistant · 90+ languages</small>
              </div>
            </div>
            <button className="pa-icon" aria-label="Close assistant" onClick={close}>
              <X size={19} />
            </button>
          </header>
          <div className="pa-tabs" role="tablist" aria-label="Conversation mode">
            <button
              role="tab"
              aria-selected={mode === 'chat'}
              onClick={() => {
                voice.stopCall();
                setMode('chat');
              }}
            >
              <MessageSquare size={15} />
              Chat
            </button>
            <button
              role="tab"
              aria-selected={mode === 'voice'}
              onClick={() => setMode('voice')}
            >
              <Phone size={15} />
              Call
            </button>
          </div>
          {mode === 'voice' ? (
            <div className="pa-call">
              <div className="pa-call-heading">
                <span className="pa-eyebrow">VOICE CONVERSATION</span>
                <h2>{labels[voice.status]}</h2>
                <p>
                  {voice.active
                    ? 'Speak naturally in any language. You can interrupt anytime.'
                    : 'Talk through an idea, a project, or a question.'}
                </p>
              </div>
              <div
                className={`pa-voice-mark ${voice.status === 'speaking' ? 'is-speaking' : ''}`}
                aria-hidden="true"
              >
                {voice.status === 'connecting' ? (
                  <Loader2 className="pa-spin" size={28} />
                ) : (
                  <>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </>
                )}
              </div>
              <span className="pa-timer">
                {voice.active
                  ? `${Math.floor(voice.seconds / 60)
                      .toString()
                      .padStart(2, '0')}:${(voice.seconds % 60).toString().padStart(2, '0')}`
                  : 'Your microphone starts only when you call.'}
              </span>
              {voice.error && (
                <p className="pa-error" role="alert">
                  {voice.error}
                </p>
              )}
              {(voice.transcript || voice.assistant) && (
                <details className="pa-transcript">
                  <summary>Conversation transcript</summary>
                  <div>
                    {voice.transcript && (
                      <p>
                        <b>You</b>
                        {voice.transcript}
                      </p>
                    )}
                    {voice.assistant && (
                      <p>
                        <b>Assistant</b>
                        {voice.assistant}
                      </p>
                    )}
                  </div>
                </details>
              )}
              {voice.booking && (
                <p className="pa-booking-result">
                  {voice.booking.emailSent
                    ? 'Your inquiry has been sent.'
                    : 'Email could not be sent. You can still book below.'}
                </p>
              )}
              <div className="pa-call-controls">
                {voice.active ? (
                  <>
                    <button
                      className={`pa-mute ${voice.muted ? 'is-muted' : ''}`}
                      aria-label={voice.muted ? 'Unmute microphone' : 'Mute microphone'}
                      aria-pressed={voice.muted}
                      onClick={voice.toggleMute}
                    >
                      {voice.muted ? <MicOff size={19} /> : <Mic size={19} />}
                    </button>
                    <button className="pa-end" onClick={voice.stopCall}>
                      <PhoneOff size={18} />
                      End call
                    </button>
                  </>
                ) : (
                  <button className="pa-start" onClick={() => void voice.startCall(messages)}>
                    <Phone size={18} />
                    {voice.status === 'error' ? 'Try again' : 'Start call'}
                  </button>
                )}
              </div>
              <a
                className="pa-book"
                href={PORTFOLIO_PROFILE.calendlyUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Calendar size={14} />
                Book a call with Shoaib
              </a>
            </div>
          ) : (
            <>
              <div className="pa-messages" role="log" aria-label="Chat messages">
                {messages.map((message, index) => (
                  <div className={`pa-message ${message.role}`} key={index}>
                    {message.role === 'assistant' ? (
                      <ChatMessageText text={message.content} />
                    ) : (
                      message.content
                    )}
                    {message.calendlyUrl && (
                      <a href={message.calendlyUrl} target="_blank" rel="noreferrer">
                        Choose a meeting time ↗
                      </a>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="pa-thinking">
                    <Loader2 size={15} className="pa-spin" />
                    One moment…
                  </div>
                )}
                <div ref={end} />
              </div>
              <form className="pa-compose" onSubmit={submit}>
                <input
                  aria-label="Your message"
                  placeholder="Ask me anything about Shoaib…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button aria-label="Send message" disabled={loading || !input.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </div>
  );
}
