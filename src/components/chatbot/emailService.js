// Email Service - ArthAI chatbot lead notifications via Resend API (EmailJS fallback)

import logger from '../../utils/logger';
import { sanitizeUserMessage, validateEmail, validatePhone } from '../../utils/security';
import { submitContactForm } from '../../services/contactSubmitService';

export const EMAIL_CONFIG = {
  opsEmail: 'info@anupaatnivesh.com',
};

function buildSubjectName(email, phone) {
  if (email && phone) return `Email- ${email} and ${phone}`;
  if (email) return `Email- ${email}`;
  if (phone) return `Mobile- ${phone}`;
  return 'ArthAI Chatbot';
}

function splitName(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || 'ArthAI',
    lastName: parts.slice(1).join(' '),
  };
}

/**
 * Send email to user and ops team when chatbot contact form is submitted.
 */
export async function sendContactEmails(contactData, conversationData = {}) {
  const sanitizedEmail = contactData.email ? sanitizeUserMessage(contactData.email) : null;
  const sanitizedPhone = contactData.phone ? sanitizeUserMessage(contactData.phone) : null;
  const sanitizedName = contactData.name ? sanitizeUserMessage(contactData.name) : null;

  if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
    logger.error('Invalid email format provided');
    return { success: false, error: 'Invalid email format' };
  }

  if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
    logger.error('Invalid phone format provided');
    return { success: false, error: 'Invalid phone format' };
  }

  const email = sanitizedEmail;
  const phone = sanitizedPhone;
  const name = sanitizedName;
  const { conversationSummary, intentType, language } = conversationData;

  if (!email && !phone) {
    logger.warn('No email or phone provided, skipping email sending');
    return { success: false, error: 'No contact information provided' };
  }

  const subjectName = buildSubjectName(email, phone);
  const { firstName, lastName } = splitName(name || subjectName);
  const userMessage = getUserEmailTemplate(name, language);
  const opsMessage =
    conversationSummary ||
    `ArthAI chatbot lead${intentType ? ` (${intentType})` : ''}. User requested follow-up.`;

  logger.email('sendContactEmails via contact API', {
    hasEmail: !!email,
    hasPhone: !!phone,
    intent: intentType,
  });

  try {
    const result = await submitContactForm({
      formType: 'chatbot_lead',
      firstName,
      lastName,
      email: email || '',
      phone: phone || '',
      message: opsMessage,
      subject: `Mutual fund query from ${subjectName}`,
      sendUserConfirmation: Boolean(email),
      metadata: {
        fundName: 'ArthAI',
        intent: intentType || '',
        language: language || 'english',
        conversationSummary: conversationSummary || '',
      },
    });

    return {
      success: true,
      method: result.method || 'resend',
      userEmailSent: Boolean(email),
      opsEmailSent: true,
    };
  } catch (error) {
    logger.error('Error sending chatbot emails:', error);
    return { success: false, error: error.message, skipped: false };
  }
}

export default {
  sendContactEmails,
  EMAIL_CONFIG,
};
