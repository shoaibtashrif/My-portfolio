import { Router } from 'express';
import { sendInquiryEmails } from '../services/mailer.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, company, role, topic, message, preferredTime, source } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message details are required.' });
    }

    const result = await sendInquiryEmails({
      name: name.trim(),
      email: email.trim(),
      company: typeof company === 'string' ? company.trim() : undefined,
      role: typeof role === 'string' ? role.trim() : undefined,
      topic: typeof topic === 'string' && topic.trim() ? topic.trim() : 'Project / Engineering Inquiry',
      message: message.trim(),
      preferredTime: typeof preferredTime === 'string' ? preferredTime.trim() : undefined,
      source: source || 'contact_form',
    });

    return res.json({
      success: true,
      message: 'Inquiry submitted. Confirmation copy and follow-up details have been sent.',
      calendlyUrl: result.calendlyUrl,
    });
  } catch (err: unknown) {
    console.error('Contact inquiry error:', err);
    const msg = err instanceof Error ? err.message : 'Failed to send inquiry email.';
    return res.status(500).json({ error: msg });
  }
});

export default router;

