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
 * CRA env: origin only (e.g. https://my-app.vercel.app), never a path ending in /api.
 * If someone sets .../api, appending "/api/..." would double the segment → 404.
 *
 * Split deploy (React on Hostinger, API on Vercel): set REACT_APP_API_BASE_URL at build time
 * to your Vercel API origin, and list your Hostinger site origin in Vercel CORS_ALLOWED_ORIGINS.
 */
export function normalizeReactAppApiOrigin(raw) {
  if (raw == null) return "";
  let s = String(raw).trim();
  if (!s) return "";
  s = s.replace(/\/+$/, "");
  s = s.replace(/\/api\/?$/i, "");
  return s.replace(/\/+$/, "");
}

/**
 * Get API base URL from environment or use default
 * @returns {string} API base URL
 */
export const getApiBaseUrl = () => {
  const fromEnv = normalizeReactAppApiOrigin(process.env.REACT_APP_API_BASE_URL);
  if (process.env.NODE_ENV === 'development') {
    return fromEnv || 'http://localhost:8000';
  }
  // Unified Vercel deploy: same-origin /api when env is empty
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
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
  },

  MEDIA: {
    PUBLIC_LIST: '/api/media/public',
    AUTH_LOGIN: '/api/media/auth/login',
    AUTH_LOGOUT: '/api/media/auth/logout',
    AUTH_ME: '/api/media/auth/me',
    ADMIN_LIST: '/api/media/admin/list',
    ADMIN_CREATE: '/api/media/admin/create',
    ADMIN_UPDATE: '/api/media/admin/:id',
    ADMIN_DELETE: '/api/media/admin/:id'
  },

  CONTACT: {
    SUBMIT: '/api/contact/submit',
    HEALTH: '/api/contact/health'
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

