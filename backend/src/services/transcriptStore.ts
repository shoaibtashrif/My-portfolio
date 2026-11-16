import { sendTranscriptEmail, TranscriptEmailPayload, TranscriptMessageItem } from './mailer.js';

const GREETING_PREFIX = "Hi, I'm Shoaib's AI assistant.";
const IDLE_FLUSH_MS = 3 * 60 * 1000;
const SESSION_TTL_MS = 6 * 60 * 60 * 1000;

interface SessionState {
  sessionId: string;
  pageUrl?: string;
  startedAt: string;
  updatedAt: number;
  messages: TranscriptMessageItem[];
  lastSentCount: number;
  sending: boolean;
  idleTimer?: NodeJS.Timeout;
  voiceTimer?: NodeJS.Timeout;
}

const sessions = new Map<string, SessionState>();

function pruneExpiredSessions() {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [id, rec] of sessions.entries()) {
    if (rec.updatedAt < cutoff && !rec.sending) {
      if (rec.idleTimer) clearTimeout(rec.idleTimer);
      if (rec.voiceTimer) clearTimeout(rec.voiceTimer);
      sessions.delete(id);
    }
  }
}

function getOrCreateSession(sessionId: string, pageUrl?: string): SessionState {
  pruneExpiredSessions();
  const existing = sessions.get(sessionId);
  if (existing) {
    if (pageUrl) existing.pageUrl = pageUrl;
    existing.updatedAt = Date.now();
    return existing;
  }
  const created: SessionState = {
    sessionId,
    pageUrl,
    startedAt: new Date().toISOString(),
    updatedAt: Date.now(),
    messages: [],
    lastSentCount: 0,
    sending: false,
  };
  sessions.set(sessionId, created);
  return created;
}

function filterMeaningfulMessages(messages: TranscriptMessageItem[]): TranscriptMessageItem[] {
  return messages.filter((m) => {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) return false;
    const text = String(m.content || '').trim();
    if (!text) return false;
    if (m.role === 'assistant' && text.startsWith(GREETING_PREFIX)) return false;
    return true;
  });
}

function scheduleIdleFlush(rec: SessionState) {
  if (rec.idleTimer) clearTimeout(rec.idleTimer);
  rec.idleTimer = setTimeout(() => {
    void flushTranscript(rec.sessionId, {
      trigger: 'idle_timeout',
      mode: detectMode(rec.messages),
      pageUrl: rec.pageUrl,
    }).catch((err) => {
      console.error('[TranscriptStore] Idle flush error:', err);
    });
  }, IDLE_FLUSH_MS);
}

function detectMode(messages: TranscriptMessageItem[]): 'chat' | 'voice' | 'mixed' {
  const hasVoice = messages.some((m) => m.channel === 'voice');
  const hasChat = messages.some((m) => m.channel !== 'voice');
  if (hasVoice && hasChat) return 'mixed';
  if (hasVoice) return 'voice';
  return 'chat';
}

export function recordChatTurn(
  sessionId: string,
  params: { pageUrl?: string; userMessage: string; assistantReply: string },
): void {
  if (!sessionId) return;
  const rec = getOrCreateSession(sessionId, params.pageUrl);
  const now = new Date().toISOString();
  rec.messages.push(
    { role: 'user', content: params.userMessage, channel: 'chat', timestamp: now },
    { role: 'assistant', content: params.assistantReply, channel: 'chat', timestamp: now },
  );
  scheduleIdleFlush(rec);
}

export function recordVoiceTurn(
  sessionId: string,
  params: { pageUrl?: string; role: 'user' | 'assistant'; content: string },
): void {
  if (!sessionId || !params.content.trim()) return;
  const rec = getOrCreateSession(sessionId, params.pageUrl);
  rec.messages.push({
    role: params.role,
    content: params.content.trim(),
    channel: 'voice',
    timestamp: new Date().toISOString(),
  });
  scheduleIdleFlush(rec);
}

export function scheduleVoiceEndFlush(sessionId: string, delayMs = 4000): void {
  if (!sessionId) return;
  const rec = sessions.get(sessionId);
  if (!rec) return;
  if (rec.voiceTimer) clearTimeout(rec.voiceTimer);
  rec.voiceTimer = setTimeout(() => {
    void flushTranscript(sessionId, {
      trigger: 'voice_ended',
      mode: detectMode(rec.messages),
      pageUrl: rec.pageUrl,
    }).catch((err) => {
      console.error('[TranscriptStore] Voice end flush error:', err);
    });
  }, delayMs);
}

export async function flushTranscript(
  sessionId: string,
  options: {
    trigger: TranscriptEmailPayload['trigger'];
    mode?: TranscriptEmailPayload['mode'];
    pageUrl?: string;
    messages?: TranscriptMessageItem[];
  },
): Promise<{ emailed: boolean; skipped?: string }> {
  const cleanId = sessionId.trim();
  if (!cleanId) return { emailed: false, skipped: 'missing_session_id' };

  const rec = getOrCreateSession(cleanId, options.pageUrl);
  if (rec.idleTimer) {
    clearTimeout(rec.idleTimer);
    rec.idleTimer = undefined;
  }
  if (rec.voiceTimer) {
    clearTimeout(rec.voiceTimer);
    rec.voiceTimer = undefined;
  }

  const clientMessages = Array.isArray(options.messages)
    ? filterMeaningfulMessages(options.messages)
    : [];
  if (clientMessages.length > rec.messages.length) {
    rec.messages = clientMessages;
  }

  const effectiveMessages = filterMeaningfulMessages(rec.messages);
  const hasUserInteraction = effectiveMessages.some((m) => m.role === 'user');
  if (!hasUserInteraction || effectiveMessages.length === 0) {
    return { emailed: false, skipped: 'no_user_messages' };
  }

  if (rec.sending) {
    return { emailed: false, skipped: 'already_sending' };
  }

  if (effectiveMessages.length <= rec.lastSentCount) {
    return { emailed: false, skipped: 'already_sent' };
  }

  const isFollowUp = rec.lastSentCount > 0;
  const targetCount = effectiveMessages.length;
  rec.sending = true;

  try {
    await sendTranscriptEmail({
      sessionId: cleanId,
      trigger: options.trigger,
      mode: options.mode || detectMode(effectiveMessages),
      pageUrl: options.pageUrl || rec.pageUrl,
      startedAt: rec.startedAt,
      isFollowUp,
      messages: effectiveMessages,
    });
    rec.lastSentCount = targetCount;
    return { emailed: true };
  } finally {
    rec.sending = false;
  }
}
