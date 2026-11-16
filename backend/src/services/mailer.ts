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
  const calendlyUrl = process.env.CALENDLY_URL || 'https://calendly.com/shoaib-tashrif/30min';
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  });

  const sourceLabel =
    payload.source === 'ai_assistant_voice'
      ? 'AI Voice Assistant'
      : payload.source === 'ai_assistant_chat'
      ? 'AI Chat Assistant'
      : 'Portfolio Contact Form';

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeCompany = escapeHtml(payload.company || 'Not specified');
  const safeRole = escapeHtml(payload.role || 'Not specified');
  const safeTopic = escapeHtml(payload.topic);
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br/>');
  const safePreferredTime = escapeHtml(payload.preferredTime || 'Flexible / To be scheduled on Calendly');

  const ownerHtml = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#070D1E;color:#F8FAFC;padding:28px;border-radius:14px;max-width:640px;margin:0 auto;border:1px solid rgba(56,189,248,0.22);">
    <div style="border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:16px;margin-bottom:20px;">
      <span style="display:inline-block;background:#0284C7;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">New Portfolio Inquiry</span>
      <h2 style="margin:12px 0 4px;font-size:20px;color:#FFFFFF;">${safeTopic}</h2>
      <p style="margin:0;color:#94A3B8;font-size:13px;">Source: ${sourceLabel} &middot; ${submittedAt} PKT</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
      <tr><td style="padding:8px 0;color:#94A3B8;width:140px;">Name</td><td style="padding:8px 0;color:#FFFFFF;font-weight:600;">${safeName}</td></tr>
      <tr><td style="padding:8px 0;color:#94A3B8;">Email</td><td style="padding:8px 0;color:#38BDF8;">${safeEmail}</td></tr>
      <tr><td style="padding:8px 0;color:#94A3B8;">Company</td><td style="padding:8px 0;color:#E2E8F0;">${safeCompany}</td></tr>
      <tr><td style="padding:8px 0;color:#94A3B8;">Role</td><td style="padding:8px 0;color:#E2E8F0;">${safeRole}</td></tr>
      <tr><td style="padding:8px 0;color:#94A3B8;">Preferred Time</td><td style="padding:8px 0;color:#E2E8F0;">${safePreferredTime}</td></tr>
    </table>

    <div style="background:#0E172C;border:1px solid rgba(56,189,248,0.18);border-radius:10px;padding:16px;margin-bottom:20px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#38BDF8;font-weight:700;margin-bottom:8px;">Message / Inquiry Copy</div>
      <div style="font-size:14px;line-height:1.65;color:#E2E8F0;">${safeMessage}</div>
    </div>

    <div style="background:rgba(2,132,199,0.12);border-left:3px solid #0284C7;padding:12px 14px;border-radius:6px;font-size:13px;color:#CBD5E1;">
      <strong>Follow-up Action:</strong> Confirmation email with your Calendly link (<a href="${calendlyUrl}" style="color:#38BDF8;">${calendlyUrl}</a>) is being delivered to ${safeEmail}. Reply directly to respond to ${safeName}.
    </div>
  </div>`;

  const visitorHtml = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#F8FAFC;color:#0F172A;padding:28px;border-radius:14px;max-width:640px;margin:0 auto;border:1px solid #E2E8F0;">
    <div style="background:#070D1E;color:#FFFFFF;padding:20px 24px;border-radius:10px;margin-bottom:22px;">
      <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#38BDF8;font-weight:700;">Shoaib Tashrif &middot; Full Stack AI Software Engineer</div>
      <h2 style="margin:8px 0 4px;font-size:20px;color:#FFFFFF;">Thanks for reaching out, ${safeName}!</h2>
      <p style="margin:0;color:#CBD5E1;font-size:13px;">Here is a copy of your inquiry and next steps to schedule a call.</p>
    </div>

    <p style="font-size:14px;line-height:1.65;color:#334155;">
      Your message has been received via <strong>${sourceLabel}</strong>. Shoaib reviews all technical and project inquiries personally and will follow up with you shortly.
    </p>

    <div style="background:#FFFFFF;border:1px solid #CBD5E1;border-radius:10px;padding:16px;margin:18px 0;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#0284C7;font-weight:700;margin-bottom:10px;">Your Submitted Inquiry Copy</div>
      <p style="margin:4px 0;font-size:13px;"><strong>Topic:</strong> ${safeTopic}</p>
      <p style="margin:4px 0;font-size:13px;"><strong>Preferred Time:</strong> ${safePreferredTime}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#334155;line-height:1.6;"><strong>Details:</strong><br/>${safeMessage}</p>
    </div>

    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:18px;text-align:center;margin:20px 0;">
      <p style="margin:0 0 12px;font-size:14px;color:#0F172A;font-weight:600;">Want to lock in a 30-minute discovery call right away?</p>
      <a href="${calendlyUrl}" style="display:inline-block;background:#0284C7;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:8px;">Book 30-Min Call on Calendly</a>
    </div>

    <p style="font-size:12px;color:#64748B;margin-top:18px;border-top:1px solid #E2E8F0;padding-top:14px;">
      Best regards,<br/>
      <strong>Shoaib Tashrif</strong> &middot; Full Stack AI Software Engineer<br/>
      Email: <a href="mailto:shoaib.tashrif@gmail.com" style="color:#0284C7;">shoaib.tashrif@gmail.com</a> &middot;
      GitHub: <a href="https://github.com/shoaibtashrif" style="color:#0284C7;">github.com/shoaibtashrif</a>
    </p>
  </div>`;

  const [ownerResult, visitorResult] = await Promise.all([
    sendSingleEmail({
      to: ownerEmail,
      replyTo: payload.email,
      fromName: 'Shoaib Tashrif Portfolio',
      subject: `[Portfolio Inquiry] ${payload.topic} — ${payload.name}`,
      html: ownerHtml,
    }),
    sendSingleEmail({
      to: payload.email,
      replyTo: ownerEmail,
      fromName: 'Shoaib Tashrif',
      subject: `Copy of your inquiry for Shoaib Tashrif — ${payload.topic}`,
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
  const endedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Karachi',
  });

  const triggerLabels: Record<TranscriptEmailPayload['trigger'], string> = {
    widget_closed: 'Visitor closed assistant',
    voice_ended: 'Voice call ended',
    page_leave: 'Visitor left / hid site',
    idle_timeout: 'Session completed (idle timeout)',
  };

  const modeLabels: Record<TranscriptEmailPayload['mode'], string> = {
    chat: 'AI Chat',
    voice: 'AI Voice Call',
    mixed: 'AI Chat + Voice',
  };

  const userMessagesCount = payload.messages.filter((m) => m.role === 'user').length;
  const safePageUrl = escapeHtml(payload.pageUrl || 'https://shoaibtashrif.vercel.app');
  const followUpBadge = payload.isFollowUp ? ' (Updated Follow-up)' : '';

  const turnsHtml = payload.messages
    .map((m) => {
      const isUser = m.role === 'user';
      const label = isUser
        ? `Visitor${m.channel === 'voice' ? ' (Voice)' : ''}`
        : `Shoaib's AI${m.channel === 'voice' ? ' (Voice)' : ''}`;
      const bg = isUser ? '#0F2544' : '#0E172C';
      const border = isUser ? 'rgba(56,189,248,0.45)' : 'rgba(148,163,184,0.22)';
      const badgeColor = isUser ? '#38BDF8' : '#94A3B8';
      return `
        <div style="background:${bg};border:1px solid ${border};border-radius:10px;padding:12px 14px;margin-bottom:10px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${badgeColor};margin-bottom:4px;">${label}</div>
          <div style="font-size:14px;line-height:1.6;color:#F1F5F9;">${escapeHtml(m.content).replace(/\n/g, '<br/>')}</div>
        </div>
      `;
    })
    .join('');

  const html = `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;background:#070D1E;color:#F8FAFC;padding:28px;border-radius:14px;max-width:660px;margin:0 auto;border:1px solid rgba(56,189,248,0.22);">
    <div style="border-bottom:1px solid rgba(148,163,184,0.2);padding-bottom:16px;margin-bottom:18px;">
      <span style="display:inline-block;background:#0284C7;color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:999px;">New ${modeLabels[payload.mode]} Interaction${followUpBadge}</span>
      <h2 style="margin:12px 0 4px;font-size:20px;color:#FFFFFF;">${modeLabels[payload.mode]} Transcript (${payload.messages.length} turns)</h2>
      <p style="margin:0;color:#94A3B8;font-size:13px;">Trigger: ${escapeHtml(triggerLabels[payload.trigger])} &middot; ${endedAt} PKT</p>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:18px;">
      <tr><td style="padding:5px 0;color:#94A3B8;width:120px;">Session ID</td><td style="padding:5px 0;color:#E2E8F0;">${escapeHtml(payload.sessionId)}</td></tr>
      <tr><td style="padding:5px 0;color:#94A3B8;">Page URL</td><td style="padding:5px 0;color:#38BDF8;">${safePageUrl}</td></tr>
      <tr><td style="padding:5px 0;color:#94A3B8;">Visitor Turns</td><td style="padding:5px 0;color:#FFFFFF;font-weight:600;">${userMessagesCount}</td></tr>
    </table>

    <div style="margin-top:14px;">
      ${turnsHtml}
    </div>
  </div>`;

  return sendSingleEmail({
    to: ownerEmail,
    fromName: 'Shoaib Portfolio AI',
    subject: `[Portfolio ${modeLabels[payload.mode]}]${followUpBadge} New interaction (${userMessagesCount} visitor ${userMessagesCount === 1 ? 'message' : 'messages'})`,
    html,
  });
}
