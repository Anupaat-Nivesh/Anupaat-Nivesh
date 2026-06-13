import { apiRequest } from './client';
import { API_ENDPOINTS } from './config';

/**
 * Submit contact / lead inquiry via backend (Resend).
 * @param {Object} payload
 * @returns {Promise<{ success: boolean, userReplySent?: boolean }>}
 */
export async function submitContactInquiry(payload) {
  return apiRequest(API_ENDPOINTS.CONTACT.SUBMIT, {
    method: 'POST',
    body: payload,
  });
}

export async function getContactMailHealth() {
  return apiRequest(API_ENDPOINTS.CONTACT.HEALTH, { method: 'GET' });
}
