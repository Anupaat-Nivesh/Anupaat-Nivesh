import { Resend } from 'resend';

export function getResendClient() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function getContactFromEmail() {
  return (
    process.env.CONTACT_ALERT_FROM_EMAIL ||
    process.env.ONBOARDING_ALERT_FROM_EMAIL ||
    'Anupaat Nivesh <info@anupaatnivesh.com>'
  );
}

export function getContactToEmail() {
  return (
    process.env.CONTACT_ALERT_TO_EMAIL ||
    process.env.ONBOARDING_ALERT_TO_EMAIL ||
    process.env.REACT_APP_ADMIN_EMAIL ||
    'info@anupaatnivesh.com'
  );
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
