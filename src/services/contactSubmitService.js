/**
 * Unified contact form submission — Resend via backend API (production).
 * EmailJS is kept only as optional dev fallback when REACT_APP_CONTACT_USE_EMAILJS=true.
 */

import emailjs from '@emailjs/browser';
import * as config from '../components/contact/Config';
import { submitContactInquiry } from '../api/contactApi';
import { ApiError } from '../api/client';

const USE_EMAILJS_FALLBACK =
  process.env.REACT_APP_CONTACT_USE_EMAILJS === 'true';

function canUseEmailJSFallback(apiErr) {
  if (!config.emailJSserviceID || !config.emailJSKey) return false;
  if (USE_EMAILJS_FALLBACK) return true;
  // Production safety: if Resend API not configured yet, keep forms working via EmailJS
  return apiErr instanceof ApiError && apiErr.status === 503;
}

/**
 * Map API / EmailJS errors to user-friendly messages.
 */
export function getContactSubmitErrorMessage(err) {
  if (err instanceof ApiError) {
    if (err.status === 503) {
      return 'Our message service is temporarily unavailable. Please WhatsApp us at +91 95011 95200 or email info@anupaatnivesh.com.';
    }
    if (err.status === 400 && err.data?.error) {
      return err.data.error;
    }
  }

  const text = err?.text || err?.message || '';
  if (
    text.includes('Invalid grant') ||
    text.includes('Gmail_API') ||
    text.includes('insufficient authentication scopes')
  ) {
    return 'Our email service is being updated. Please try again in a few minutes or contact us on WhatsApp at +91 95011 95200.';
  }
  if (text.includes('412')) {
    return 'Form validation failed. Please check all fields are filled correctly.';
  }

  return err?.message || 'Failed to send message. Please try again.';
}

async function sendViaEmailJS(payload) {
  const templateParams = {
    first_name: payload.firstName,
    last_name: payload.lastName,
    user_email: payload.email,
    number: payload.phone,
    message: payload.message,
    user_name: [payload.firstName, payload.lastName].filter(Boolean).join(' '),
    ...(payload.metadata?.fundName ? { fundname: payload.metadata.fundName } : {}),
  };

  const templateId =
    payload.formType === 'mutual_fund' || payload.formType === 'chatbot_lead'
      ? config.emailJSMFtemplteID
      : config.emailJStemplateID;

  const res = await emailjs.send(
    config.emailJSserviceID,
    templateId,
    templateParams,
    config.emailJSKey
  );

  if (res.status !== 200) {
    throw new Error(`Email send failed (${res.status})`);
  }
  return { success: true, method: 'emailjs' };
}

/**
 * @param {Object} payload — formType, firstName, lastName, email, phone, message, subject?, metadata?, website? (honeypot)
 */
export async function submitContactForm(payload) {
  const body = {
    formType: payload.formType || 'contact',
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    email: payload.email || '',
    phone: payload.phone || '',
    message: payload.message || '',
    subject: payload.subject || '',
    metadata: payload.metadata || {},
    sendUserConfirmation: payload.sendUserConfirmation !== false,
    website: payload.website || '',
  };

  try {
    const result = await submitContactInquiry(body);
    return { ...result, method: 'resend' };
  } catch (apiErr) {
    if (canUseEmailJSFallback(apiErr)) {
      console.warn('Contact API unavailable, using EmailJS fallback:', apiErr?.message || apiErr);
      return sendViaEmailJS(body);
    }
    throw apiErr;
  }
}
