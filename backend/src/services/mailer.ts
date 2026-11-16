import nodemailer from 'nodemailer';

export interface InquiryPayload {
  name: string;
  email: string;
  company?: string;
  role?: string;
  topic: string;
  message: string;
  preferredTime?: string;
  source?: 'contact_form' | 'ai_assistant_chat' | 'ai_assistant_voice';
}

export interface TranscriptMessageItem {
  role: 'user' | 'assistant';
  content: string;
  channel?: 'chat' | 'voice';
  timestamp?: string;
}

export interface TranscriptEmailPayload {
  sessionId: string;
  trigger: 'widget_closed' | 'voice_ended' | 'page_leave' | 'idle_timeout';
  mode: 'chat' | 'voice' | 'mixed';
  pageUrl?: string;
  startedAt?: string;
  isFollowUp?: boolean;
  messages: TranscriptMessageItem[];
}

const DEFAULT_CALENDLY_URL = 'https://calendly.com/shoaib-tashrif/30min';
const DEFAULT_LINKEDIN_URL = 'https://www.linkedin.com/in/shoaibtashrif';
const DEFAULT_GITHUB_URL = 'https://github.com/shoaibtashrif';
const DEFAULT_SITE_URL = 'https://shoaibtashrif.vercel.app';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getOwnerEmail(): string {
  return (
    process.env.OWNER_NOTIFICATION_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    'shoaib.tashrif@gmail.com'
  );
}

function getSenderEmail(): string {
  return (
    process.env.EMAIL_FROM_ADDRESS?.trim() ||
    process.env.SMTP_USER?.trim() ||
    getOwnerEmail()
  );
}

function renderEmailShell(params: {
  eyebrow: string;
  heading: string;
  subheading: string;
  bodyHtml: string;
  calendlyUrl: string;
  ctaHeading?: string;
  ctaLabel?: string;
}): string {
  const safeEyebrow = escapeHtml(params.eyebrow);
  const safeHeading = escapeHtml(params.heading);
  const safeSubheading = escapeHtml(params.subheading);
  const safeCalendly = escapeHtml(params.calendlyUrl);
  const ctaHeading = escapeHtml(
    params.ctaHeading || 'Schedule a 30-Minute Discovery Call',
  );
  const ctaLabel = escapeHtml(params.ctaLabel || 'Book a Call on Calendly');

  return `
  <div style="background:#F1F5F9;padding:24px 12px;font-family:Inter,'Segoe UI',Arial,sans-serif;color:#0F172A;">
    <div style="max-width:620px;margin:0 auto;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
      <div style="border-top:4px solid #0284C7;padding:24px 28px 18px;border-bottom:1px solid #E2E8F0;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0284C7;margin-bottom:6px;">${safeEyebrow}</div>
        <h2 style="margin:0 0 6px;font-size:21px;line-height:1.3;color:#0F172A;font-weight:700;">${safeHeading}</h2>
        <p style="margin:0;font-size:13px;color:#64748B;">${safeSubheading}</p>
      </div>

      <div style="padding:22px 28px;">
        ${params.bodyHtml}

        <div style="margin-top:24px;padding:18px 20px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;">
          <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#0F172A;">${ctaHeading}</p>
          <a href="${safeCalendly}" style="display:inline-block;background:#0284C7;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:7px;margin-right:10px;">${ctaLabel}</a>
          <a href="${DEFAULT_LINKEDIN_URL}" style="display:inline-block;background:#FFFFFF;color:#0F172A;border:1px solid #CBD5E1;text-decoration:none;font-size:13px;font-weight:600;padding:9px 16px;border-radius:7px;">Connect on LinkedIn</a>
        </div>
      </div>

      <div style="padding:16px 28px;background:#F8FAFC;border-top:1px solid #E2E8F0;font-size:12px;line-height:1.6;color:#64748B;">
        <strong style="color:#0F172A;">Shoaib Tashrif</strong> &middot; Full Stack AI Software Engineer<br/>
        <a href="${safeCalendly}" style="color:#0284C7;text-decoration:none;">Schedule a Call</a> &middot;
        <a href="${DEFAULT_LINKEDIN_URL}" style="color:#0284C7;text-decoration:none;">LinkedIn</a> &middot;
        <a href="${DEFAULT_GITHUB_URL}" style="color:#0284C7;text-decoration:none;">GitHub</a> &middot;
        <a href="${DEFAULT_SITE_URL}" style="color:#0284C7;text-decoration:none;">Website</a>
      </div>
    </div>
  </div>`;
}

async function sendSingleEmail(params: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  fromName?: string;
}): Promise<{ messageId: string; transport: string }> {
  const fromName = params.fromName || 'Shoaib Tashrif';
  const fromEmail = getSenderEmail();

  // 1. HTTPS Email Relay Webhook (e.g. Google Apps Script or Vercel Relay) — bypasses VPS SMTP port blocks
  const relayUrl = process.env.EMAIL_RELAY_URL?.trim();
  if (relayUrl) {
    const res = await fetch(relayUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.EMAIL_RELAY_SECRET
          ? { 'x-relay-secret': process.env.EMAIL_RELAY_SECRET.trim() }
          : {}),
      },
      body: JSON.stringify({
        secret: process.env.EMAIL_RELAY_SECRET?.trim() || undefined,
        to: params.to,
        subject: params.subject,
        html: params.html,
        replyTo: params.replyTo,
        fromName,
      }),
    });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Email relay failed (${res.status}): ${text.slice(0, 200)}`);
    }
    let parsedId = `relay-${Date.now()}`;
    try {
      const json = JSON.parse(text) as { messageId?: string; id?: string; ok?: boolean; error?: string };
      if (json.ok === false && json.error) {
        throw new Error(`Email relay error: ${json.error}`);
      }
      if (json.messageId || json.id) parsedId = String(json.messageId || json.id);
    } catch (err) {
      if (err instanceof Error && err.message.startsWith('Email relay error:')) throw err;
    }
    return { messageId: parsedId, transport: 'https_relay' };
  }

  // 2. Brevo HTTPS API (works over port 443 without custom domain restrictions)
  const brevoKey = process.env.BREVO_API_KEY?.trim();
  if (brevoKey) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoKey,
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: params.to }],
        ...(params.replyTo ? { replyTo: { email: params.replyTo } } : {}),
        subject: params.subject,
        htmlContent: params.html,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { messageId?: string; message?: string };
    if (!res.ok) {
      throw new Error(`Brevo API error (${res.status}): ${data?.message || 'request failed'}`);
    }
    return { messageId: data.messageId || `brevo-${Date.now()}`, transport: 'brevo' };
  }

  // 3. Resend HTTPS API (works over port 443)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    const resendFrom = process.env.RESEND_FROM?.trim() || `${fromName} <${fromEmail}>`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [params.to],
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
        subject: params.subject,
        html: params.html,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) {
      throw new Error(`Resend API error (${res.status}): ${data?.message || 'request failed'}`);
    }
    return { messageId: data.id || `resend-${Date.now()}`, transport: 'resend' };
  }

  // 4. Direct SMTP fallback (forced IPv4 + 8s connect timeout so blocked ports fail fast)
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('No email transport configured (set EMAIL_RELAY_URL, BREVO_API_KEY, RESEND_API_KEY, or SMTP credentials).');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    family: 4,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
    auth: { user, pass },
  } as any);

  const info = await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to: params.to,
    ...(params.replyTo ? { replyTo: params.replyTo } : {}),
    subject: params.subject,
    html: params.html,
  });

  return { messageId: info.messageId, transport: 'smtp' };
}

export async function sendInquiryEmails(payload: InquiryPayload): Promise<{
  calendlyUrl: string;
  ownerMessageId: string;
  visitorMessageId: string;
}> {
  const ownerEmail = getOwnerEmail();
  const calendlyUrl = process.env.CALENDLY_URL || DEFAULT_CALENDLY_URL;
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  });

  const sourceLabel =
    payload.source === 'ai_assistant_voice'
      ? 'Voice Call Inquiry'
      : payload.source === 'ai_assistant_chat'
      ? 'Live Chat Inquiry'
      : 'Website Contact Form';

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeCompany = escapeHtml(payload.company || 'Not specified');
  const safeRole = escapeHtml(payload.role || 'Not specified');
  const safeTopic = escapeHtml(payload.topic);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br/>');
  const safePreferredTime = escapeHtml(payload.preferredTime || 'Flexible / To be scheduled on Calendly');

  const ownerHtml = renderEmailShell({
    eyebrow: `New Client Lead · ${sourceLabel}`,
    heading: payload.topic,
    subheading: `Submitted by ${payload.name} on ${submittedAt} PKT`,
    calendlyUrl,
    ctaHeading: 'Quick Links for Follow-Up',
    ctaLabel: 'Open Calendly Link',
    bodyHtml: `
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px;">
        <tr><td style="padding:7px 0;color:#64748B;width:130px;border-bottom:1px solid #F1F5F9;">Name</td><td style="padding:7px 0;color:#0F172A;font-weight:600;border-bottom:1px solid #F1F5F9;">${safeName}</td></tr>
        <tr><td style="padding:7px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Email</td><td style="padding:7px 0;border-bottom:1px solid #F1F5F9;"><a href="mailto:${safeEmail}" style="color:#0284C7;text-decoration:none;font-weight:500;">${safeEmail}</a></td></tr>
        <tr><td style="padding:7px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Company</td><td style="padding:7px 0;color:#0F172A;border-bottom:1px solid #F1F5F9;">${safeCompany}</td></tr>
        <tr><td style="padding:7px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Role</td><td style="padding:7px 0;color:#0F172A;border-bottom:1px solid #F1F5F9;">${safeRole}</td></tr>
        <tr><td style="padding:7px 0;color:#64748B;">Preferred Time</td><td style="padding:7px 0;color:#0F172A;">${safePreferredTime}</td></tr>
      </table>

      <div style="background:#F8FAFC;border-left:3px solid #0284C7;border-radius:0 8px 8px 0;padding:14px 16px;">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#64748B;margin-bottom:6px;">Project Details</div>
        <div style="font-size:14px;line-height:1.65;color:#1E293B;">${safeMessage}</div>
      </div>

      <p style="margin:14px 0 0;font-size:13px;color:#475569;">
        An instant confirmation copy with your Calendly link and LinkedIn profile has been sent to <strong>${safeEmail}</strong>. Hit <strong>Reply</strong> to write back directly to ${safeName}.
      </p>
    `,
  });

  const visitorHtml = renderEmailShell({
    eyebrow: 'Shoaib Tashrif · Inquiry Confirmation',
    heading: `Thanks for reaching out, ${payload.name}`,
    subheading: `We received your inquiry via ${sourceLabel}`,
    calendlyUrl,
    ctaHeading: 'Want to lock in a 30-minute discovery call right away?',
    ctaLabel: 'Book 30-Min Discovery Call',
    bodyHtml: `
      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:#334155;">
        Hi ${safeName},<br/><br/>
        Thank you for getting in touch. I review every technical and project inquiry personally and will respond to you shortly. Below is a copy of what you shared:
      </p>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:14px 16px;">
        <p style="margin:0 0 6px;font-size:13px;color:#0F172A;"><strong>Topic:</strong> ${safeTopic}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#0F172A;"><strong>Preferred Time:</strong> ${safePreferredTime}</p>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#334155;"><strong>Details:</strong><br/>${safeMessage}</p>
      </div>
    `,
  });

  const [ownerResult, visitorResult] = await Promise.all([
    sendSingleEmail({
      to: ownerEmail,
      replyTo: payload.email,
      fromName: 'Shoaib Tashrif — Lead Desk',
      subject: `New Project Lead: ${payload.topic} — ${payload.name}`,
      html: ownerHtml,
    }),
    sendSingleEmail({
      to: payload.email,
      replyTo: ownerEmail,
      fromName: 'Shoaib Tashrif',
      subject: `Received: ${payload.topic} — Next steps with Shoaib Tashrif`,
      html: visitorHtml,
    }),
  ]);

  return {
    calendlyUrl,
    ownerMessageId: ownerResult.messageId,
    visitorMessageId: visitorResult.messageId,
  };
}

export async function sendTranscriptEmail(payload: TranscriptEmailPayload): Promise<{
  messageId: string;
  transport: string;
}> {
  const ownerEmail = getOwnerEmail();
  const calendlyUrl = process.env.CALENDLY_URL || DEFAULT_CALENDLY_URL;
  const endedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  });

  const triggerLabels: Record<TranscriptEmailPayload['trigger'], string> = {
    widget_closed: 'Visitor closed chat window',
    voice_ended: 'Voice call ended',
    page_leave: 'Visitor left site',
    idle_timeout: 'Session idle timeout',
  };

  const modeLabels: Record<TranscriptEmailPayload['mode'], string> = {
    chat: 'Website Chat',
    voice: 'Voice Call',
    mixed: 'Chat + Voice Call',
  };

  const userMessagesCount = payload.messages.filter((m) => m.role === 'user').length;
  const safePageUrl = escapeHtml(payload.pageUrl || DEFAULT_SITE_URL);
  const followUpLabel = payload.isFollowUp ? ' (Follow-up)' : '';

  const turnsHtml = payload.messages
    .map((m) => {
      const isUser = m.role === 'user';
      const label = isUser
        ? `Visitor${m.channel === 'voice' ? ' (Voice)' : ''}`
        : `Assistant${m.channel === 'voice' ? ' (Voice)' : ''}`;
      const bg = isUser ? '#F0F9FF' : '#F8FAFC';
      const borderLeft = isUser ? '3px solid #0284C7' : '3px solid #CBD5E1';
      const labelColor = isUser ? '#0284C7' : '#64748B';
      return `
        <div style="background:${bg};border:1px solid #E2E8F0;border-left:${borderLeft};border-radius:8px;padding:12px 14px;margin-bottom:10px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${labelColor};margin-bottom:4px;">${label}</div>
          <div style="font-size:14px;line-height:1.6;color:#1E293B;">${escapeHtml(m.content).replace(/\n/g, '<br/>')}</div>
        </div>
      `;
    })
    .join('');

  const html = renderEmailShell({
    eyebrow: `New Visitor Conversation · ${modeLabels[payload.mode]}${followUpLabel}`,
    heading: `${modeLabels[payload.mode]} Transcript (${payload.messages.length} turns)`,
    subheading: `${triggerLabels[payload.trigger]} · ${endedAt} PKT`,
    calendlyUrl,
    ctaHeading: 'Share Your Booking or Profile Links',
    ctaLabel: 'Open Calendly Link',
    bodyHtml: `
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:16px;">
        <tr><td style="padding:5px 0;color:#64748B;width:110px;border-bottom:1px solid #F1F5F9;">Page Visited</td><td style="padding:5px 0;border-bottom:1px solid #F1F5F9;"><a href="${safePageUrl}" style="color:#0284C7;text-decoration:none;">${safePageUrl}</a></td></tr>
        <tr><td style="padding:5px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Visitor Turns</td><td style="padding:5px 0;color:#0F172A;font-weight:600;border-bottom:1px solid #F1F5F9;">${userMessagesCount}</td></tr>
        <tr><td style="padding:5px 0;color:#64748B;">Session ID</td><td style="padding:5px 0;color:#475569;font-family:monospace;font-size:12px;">${escapeHtml(payload.sessionId)}</td></tr>
      </table>

      <div>${turnsHtml}</div>
    `,
  });

  return sendSingleEmail({
    to: ownerEmail,
    fromName: 'Shoaib Tashrif — Lead Desk',
    subject: `New Lead Transcript (${modeLabels[payload.mode]}${followUpLabel}) — ${userMessagesCount} visitor ${userMessagesCount === 1 ? 'message' : 'messages'}`,
    html,
  });
}
