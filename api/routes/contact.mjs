import express from 'express';
import { sendContactInquiry, isContactMailConfigured } from '../services/contactMailer.mjs';

const router = express.Router();

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 32,
  message: 5000,
  subject: 200,
};

function trim(str, max) {
  if (str == null) return '';
  return String(str).trim().slice(0, max);
}

function sanitizePayload(body = {}) {
  return {
    formType: trim(body.formType || 'contact', 40),
    firstName: trim(body.firstName, MAX.firstName),
    lastName: trim(body.lastName, MAX.lastName),
    email: trim(body.email, MAX.email).toLowerCase(),
    phone: trim(body.phone, MAX.phone),
    message: trim(body.message, MAX.message),
    subject: trim(body.subject, MAX.subject),
    metadata:
      body.metadata && typeof body.metadata === 'object' && !Array.isArray(body.metadata)
        ? Object.fromEntries(
            Object.entries(body.metadata)
              .slice(0, 20)
              .map(([k, v]) => [trim(k, 60), trim(v, 500)])
          )
        : {},
    sendUserConfirmation: body.sendUserConfirmation !== false,
    website: trim(body.website, 200),
  };
}

function validatePayload(p) {
  if (p.website) {
    return 'Invalid submission';
  }
  if (!p.firstName && !p.lastName && !p.email && !p.phone) {
    return 'Name, email, or phone is required';
  }
  if (p.email && !EMAIL_RE.test(p.email)) {
    return 'Invalid email address';
  }
  if (!p.message && p.formType === 'contact') {
    return 'Message is required';
  }
  return null;
}

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    configured: isContactMailConfigured(),
  });
});

router.post('/submit', async (req, res) => {
  try {
    if (!isContactMailConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Contact email service is not configured on the server.',
        code: 'CONTACT_NOT_CONFIGURED',
      });
    }

    const payload = sanitizePayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const result = await sendContactInquiry(payload);
    if (!result.sent) {
      return res.status(503).json({
        success: false,
        error: result.reason || 'Failed to send email',
        code: 'CONTACT_SEND_FAILED',
      });
    }

    return res.status(200).json({
      success: true,
      userReplySent: result.userReplySent === true,
    });
  } catch (err) {
    console.error('Contact submit error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to send your message. Please try again or contact us on WhatsApp.',
      code: 'CONTACT_SERVER_ERROR',
    });
  }
});

export default router;
