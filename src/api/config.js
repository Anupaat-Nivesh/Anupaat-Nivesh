/**
 * API Configuration
 * Centralized configuration for backend API communication
 * 
 * Architecture:
 * - Frontend makes API calls to backend
 * - Backend handles all sensitive operations (payment, secrets)
 * - Frontend only handles UI and client-side logic
 */

/**
 * Get API base URL from environment or use default
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => {
  // In development, can use local backend or mock mode
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  }
  
  // In production, must have API base URL configured
  return process.env.REACT_APP_API_BASE_URL || '';
};

/**
 * Check if backend API is available
 * @returns {boolean} True if API base URL is configured
 */
export const isBackendAvailable = () => {
  return !!getApiBaseUrl();
};

/**
 * API Configuration
 */
export const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * API Endpoints
 * All backend API endpoints are defined here
 */
export const API_ENDPOINTS = {
  // Payment endpoints
  PAYMENTS: {
    CREATE_ORDER: '/api/payments/create-order',
    VERIFY: '/api/payments/verify-payment',
    GET_ORDER: '/api/payments/order/:orderId'
  },
  
  // Booking endpoints
  BOOKINGS: {
    CREATE: '/api/bookings',
    GET: '/api/bookings/:bookingId',
    UPDATE_STATUS: '/api/bookings/:bookingId/status',
    GET_BY_REFERENCE: '/api/bookings/reference/:reference'
  },
  
  // Health check
  HEALTH: '/api/health',

  // Client onboarding (KYC documents)
  ONBOARDING: {
    SUBMIT: '/api/onboarding/submit'
  }
};

/**
 * Build full API URL
 * @param {string} endpoint - API endpoint
 * @param {Object} params - URL parameters to replace
 * @returns {string} Full API URL
 */
export const buildApiUrl = (endpoint, params = {}) => {
  let url = `${apiConfig.baseURL}${endpoint}`;
  
  // Replace URL parameters
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

export default apiConfig;

