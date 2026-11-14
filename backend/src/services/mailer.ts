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

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== 'false';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP_USER and SMTP_PASS must be configured in environment variables.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function sendInquiryEmails(payload: InquiryPayload): Promise<{
  calendlyUrl: string;
  ownerMessageId: string;
  visitorMessageId: string;
}> {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_USER!;
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL || fromEmail;
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

  // 1. Email to Shoaib (Owner Notification + Follow-up)
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
      <strong>Follow-up Action:</strong> A confirmation copy with your Calendly link (<a href="${calendlyUrl}" style="color:#38BDF8;">${calendlyUrl}</a>) was automatically sent to ${safeEmail}. Reply directly to this email to follow up with ${safeName}.
    </div>
  </div>`;

  // 2. Confirmation + Copy + Follow-up Email to Visitor
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

  const [ownerInfo, visitorInfo] = await Promise.all([
    transporter.sendMail({
      from: `"Shoaib Tashrif Portfolio" <${fromEmail}>`,
      to: ownerEmail,
      replyTo: payload.email,
      subject: `[Portfolio Inquiry] ${payload.topic} — ${payload.name}`,
      html: ownerHtml,
    }),
    transporter.sendMail({
      from: `"Shoaib Tashrif" <${fromEmail}>`,
      to: payload.email,
      replyTo: ownerEmail,
      subject: `Copy of your inquiry for Shoaib Tashrif — ${payload.topic}`,
      html: visitorHtml,
    }),
  ]);

  return {
    calendlyUrl,
    ownerMessageId: ownerInfo.messageId,
    visitorMessageId: visitorInfo.messageId,
  };
}

