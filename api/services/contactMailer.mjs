import {
  escapeHtml,
  getContactFromEmail,
  getContactToEmail,
  getResendClient,
} from './resendClient.mjs';

const FORM_LABELS = {
  contact: 'Website contact form',
  lead: 'Lead capture form',
  mutual_fund: 'Mutual fund inquiry',
  basket_unlock: 'Basket unlock confirmation',
  consultation: 'Consultation request',
  portfolio_review: 'Portfolio review request',
  booking_confirmation: 'Consulting session booking confirmation',
  consulting_registration: 'Consulting session registration',
  chatbot_lead: 'ArthAI chatbot lead',
};

function buildOpsHtml(payload) {
  const label = FORM_LABELS[payload.formType] || payload.formType || 'Inquiry';
  const name = [payload.firstName, payload.lastName].filter(Boolean).join(' ').trim();
  const metaRows = Object.entries(payload.metadata || {})
    .filter(([, v]) => v != null && String(v).trim() !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`
    )
    .join('');

  return `
    <h2 style="margin:0 0 16px;">${escapeHtml(label)}</h2>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Name</td><td>${escapeHtml(name || '—')}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Email</td><td>${escapeHtml(payload.email || '—')}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;font-weight:600;">Phone</td><td>${escapeHtml(payload.phone || '—')}</td></tr>
      ${payload.subject ? `<tr><td style="padding:4px 12px 4px 0;font-weight:600;">Subject</td><td>${escapeHtml(payload.subject)}</td></tr>` : ''}
      ${metaRows}
    </table>
    <h3 style="margin:24px 0 8px;">Message</h3>
    <pre style="white-space:pre-wrap;font-family:sans-serif;font-size:14px;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(payload.message || '—')}</pre>
    <p style="color:#666;font-size:12px;margin-top:24px;">Sent via anupaatnivesh.com contact API · ${escapeHtml(new Date().toISOString())}</p>
  `;
}

function buildUserReplyHtml(payload) {
  const name = payload.firstName || 'there';
  return `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thank you for reaching out to <strong>Anupaat Nivesh</strong>. We have received your message and our team will get back to you within <strong>2 business days</strong>.</p>
    <p style="color:#666;font-size:13px;">If your query is urgent, you can WhatsApp us at +91 95011 95200.</p>
    <p>Warm regards,<br/>Team Anupaat Nivesh</p>
  `;
}

export function isContactMailConfigured() {
  return Boolean(getResendClient() && getContactToEmail() && getContactFromEmail());
}

/**
 * Send ops notification + optional user auto-reply via Resend.
 */
export async function sendContactInquiry(payload) {
  const resend = getResendClient();
  const toEmail = getContactToEmail();
  const fromEmail = getContactFromEmail();

  if (!resend || !toEmail || !fromEmail) {
    return {
      sent: false,
      reason: 'Contact email not configured (RESEND_API_KEY / CONTACT_ALERT_* )',
    };
  }

  const label = FORM_LABELS[payload.formType] || 'Website inquiry';
  const subject =
    payload.subject?.trim() ||
    `${label} — ${[payload.firstName, payload.lastName].filter(Boolean).join(' ') || payload.email || 'New lead'}`;

  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: payload.email || undefined,
    subject,
    html: buildOpsHtml(payload),
  });

  let userReplySent = false;
  if (payload.email && payload.sendUserConfirmation !== false) {
    try {
      await resend.emails.send({
        from: fromEmail,
        to: payload.email,
        subject: 'We received your message — Anupaat Nivesh',
        html: buildUserReplyHtml(payload),
      });
      userReplySent = true;
    } catch (err) {
      console.warn('User confirmation email failed (ops email sent):', err?.message || err);
    }
  }

  return { sent: true, userReplySent };
}
