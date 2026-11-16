import { Router, Request, Response } from 'express';
import { SHOAIB_SYSTEM_PROMPT } from '../data/shoaibKnowledge.js';
import { sendInquiryEmails, TranscriptEmailPayload, TranscriptMessageItem } from '../services/mailer.js';
import { flushTranscript, recordChatTurn } from '../services/transcriptStore.js';

const router = Router();

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODELS = [
  process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  'llama-3.3-70b-versatile',
];

const CALENDLY_URL =
  process.env.CALENDLY_URL || 'https://calendly.com/shoaib-tashrif/30min';

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

const BOOKING_TOOL_GROQ = {
  type: 'function',
  function: {
    name: 'submit_booking_inquiry',
    description:
      'Submits a project inquiry or call booking request for Shoaib Tashrif, emails both the visitor and Shoaib with the form copy and follow-up details, and returns the Calendly 30-min booking link.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Visitor full name' },
        email: { type: 'string', description: 'Visitor email address' },
        company: { type: 'string', description: 'Optional company or organization name' },
        topic: {
          type: 'string',
          description: 'Project details, requirements, or topic for the 30-minute call',
        },
        preferredTime: {
          type: 'string',
          description: 'Optional preferred date/time or timezone for the call',
        },
      },
      required: ['name', 'email', 'topic'],
    },
  },
};

function sanitizeChatReply(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\s*--\s*/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function callGroqChat(messages: any[], useTools = true) {
  let lastError: any = null;
  for (const model of GROQ_MODELS) {
    try {
      const payload: Record<string, unknown> = {
        model,
        messages,
        temperature: 0.55,
        max_tokens: 280,
      };
      if (useTools) {
        payload.tools = [BOOKING_TOOL_GROQ];
        payload.tool_choice = 'auto';
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();
      if (response.ok) {
        return data;
      }
      lastError = new Error(data?.error?.message || `Groq HTTP ${response.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Chat assistant is temporarily unavailable.');
}

// POST /api/assistant/chat — Powered by Groq GPT-OSS 120B (openai/gpt-oss-120b)
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], messages: legacyMessages, sessionId, pageUrl } = req.body as {
      message?: string;
      history?: ChatTurn[];
      messages?: Array<{ role: string; text?: string; content?: string }>;
      sessionId?: string;
      pageUrl?: string;
    };

    let resolvedMessage = message?.trim() || '';
    let resolvedHistory: ChatTurn[] = history;

    if (!resolvedMessage && Array.isArray(legacyMessages) && legacyMessages.length > 0) {
      const last = legacyMessages[legacyMessages.length - 1];
      resolvedMessage = String(last.text || last.content || '').trim();
      resolvedHistory = legacyMessages.slice(0, -1).map((m) => ({
        role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.text || m.content || ''),
      }));
    }

    if (!resolvedMessage) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const groqMessages: any[] = [
      { role: 'system', content: SHOAIB_SYSTEM_PROMPT },
      ...resolvedHistory.slice(-12).map((turn) => ({
        role: turn.role === 'assistant' ? 'assistant' : 'user',
        content: turn.content,
      })),
      { role: 'user', content: resolvedMessage },
    ];

    const data = await callGroqChat(groqMessages, true);
    const choice = data?.choices?.[0]?.message;

    let finalReply = '';
    let bookingSubmitted = false;
    let emailSent = false;

    const toolCalls = choice?.tool_calls;
    if (Array.isArray(toolCalls) && toolCalls.length > 0) {
      const tc = toolCalls[0];
      if (tc?.function?.name === 'submit_booking_inquiry') {
        let args: any = {};
        try {
          args = JSON.parse(tc.function.arguments || '{}');
        } catch {
          args = {};
        }

        const visitorName = String(args.name || 'Visitor');
        const visitorEmail = String(args.email || '');
        const visitorCompany = args.company ? String(args.company) : '';
        const visitorTopic = String(args.topic || resolvedMessage);
        const preferredTime = args.preferredTime ? String(args.preferredTime) : '';

        if (visitorEmail && visitorEmail.includes('@')) {
          bookingSubmitted = true;
          try {
            await sendInquiryEmails({
              name: visitorName,
              email: visitorEmail,
              company: visitorCompany,
              topic: visitorTopic,
              preferredTime,
              message: visitorTopic,
              source: 'ai_assistant_chat',
            });
            emailSent = true;
          } catch (mailErr) {
            console.error('Failed to send assistant booking email:', mailErr);
          }
        }

        const followUpMessages = [
          ...groqMessages,
          choice,
          {
            role: 'tool',
            tool_call_id: tc.id,
            name: 'submit_booking_inquiry',
            content: JSON.stringify({
              success: bookingSubmitted,
              emailSent,
              calendlyUrl: CALENDLY_URL,
              note: 'Confirm to the user that their inquiry copy and follow-up email have been sent to both their email and Shoaib, and invite them to pick their 30-minute slot on the Calendly link.',
            }),
          },
        ];

        const followUpData = await callGroqChat(followUpMessages, false);
        finalReply =
          followUpData?.choices?.[0]?.message?.content ||
          `Thank you, ${visitorName}! I have submitted your inquiry and sent a confirmation copy to ${visitorEmail} and Shoaib. You can book your 30-minute call directly here: ${CALENDLY_URL}`;
      }
    } else {
      finalReply =
        choice?.content ||
        "I am Shoaib's personal AI assistant. How can I help you learn about Shoaib's AI engineering work or book a 30-minute call?";
    }

    const cleanReply = sanitizeChatReply(finalReply);
    if (typeof sessionId === 'string' && sessionId.trim()) {
      recordChatTurn(sessionId.trim(), {
        pageUrl: typeof pageUrl === 'string' ? pageUrl.trim() : undefined,
        userMessage: resolvedMessage,
        assistantReply: cleanReply,
      });
    }

    return res.json({
      ok: true,
      reply: cleanReply,
      bookingSubmitted,
      emailSent,
      calendlyUrl: CALENDLY_URL,
    });
  } catch (error: any) {
    console.error('Assistant chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process chat message.',
    });
  }
});

// POST /api/assistant/transcript — sends a single transcript email when user finishes interacting
router.post('/transcript', async (req: Request, res: Response) => {
  try {
    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid transcript JSON payload.' });
      }
    }

    const sessionId = typeof body?.sessionId === 'string' ? body.sessionId.trim() : '';
    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' });
    }

    const validTriggers = new Set<TranscriptEmailPayload['trigger']>([
      'widget_closed',
      'voice_ended',
      'page_leave',
      'idle_timeout',
    ]);
    const trigger: TranscriptEmailPayload['trigger'] = validTriggers.has(body?.trigger)
      ? body.trigger
      : 'widget_closed';

    const validModes = new Set<TranscriptEmailPayload['mode']>(['chat', 'voice', 'mixed']);
    const mode: TranscriptEmailPayload['mode'] | undefined = validModes.has(body?.mode)
      ? body.mode
      : undefined;

    const messages: TranscriptMessageItem[] | undefined = Array.isArray(body?.messages)
      ? body.messages
          .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .map((m: any) => ({
            role: m.role,
            content: m.content.trim().slice(0, 8000),
            channel: m.channel === 'voice' ? 'voice' : 'chat',
          }))
      : undefined;

    const result = await flushTranscript(sessionId, {
      trigger,
      mode,
      pageUrl: typeof body?.pageUrl === 'string' ? body.pageUrl.trim().slice(0, 500) : undefined,
      messages,
    });

    return res.json({ ok: true, ...result });
  } catch (error: any) {
    console.error('Assistant transcript email error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to email conversation transcript.',
    });
  }
});

export default router;
