/**
 * Production-Safe Logger
 * Only logs errors in production, all logs in development
 * Sanitizes sensitive data before logging
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Sensitive patterns to redact
const SENSITIVE_PATTERNS = [
  /api[_-]?key/gi,
  /secret/gi,
  /password/gi,
  /token/gi,
  /auth/gi,
  /credential/gi,
  /sk-[a-zA-Z0-9]+/g, // OpenAI API keys
  /AIzaSy[a-zA-Z0-9_-]+/g, // Google API keys
  /[0-9]{10,}/g, // Phone numbers (10+ digits)
];

/**
 * Sanitize data to remove sensitive information
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = Array.isArray(data) ? [...data] : { ...data };

  function redactValue(value) {
    if (typeof value === 'string') {
      let redacted = value;
      SENSITIVE_PATTERNS.forEach(pattern => {
        redacted = redacted.replace(pattern, '[REDACTED]');
      });
      // Truncate long strings
      if (redacted.length > 500) {
        redacted = redacted.substring(0, 500) + '...[truncated]';
      }
      return redacted;
    }
    return value;
  }

  function sanitizeObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => 
        typeof item === 'object' && item !== null ? sanitizeObject(item) : redactValue(item)
      );
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      
      // Skip sensitive keys entirely
      if (SENSITIVE_PATTERNS.some(pattern => pattern.test(lowerKey))) {
        result[key] = '[REDACTED]';
        continue;
      }

      if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
        result[key] = sanitizeObject(value);
      } else {
        result[key] = redactValue(value);
      }
    }
    return result;
  }

  return sanitizeObject(sanitized);
}

/**
 * Production-safe logger
 */
export const logger = {
  /**
   * Log info messages (only in development)
   */
  info: (...args) => {
    if (isDevelopment) {
      const sanitized = args.map(arg => sanitizeData(arg));
      console.log('[INFO]', ...sanitized);
    }
  },

  /**
   * Log warnings (only in development)
   */
  warn: (...args) => {
    if (isDevelopment) {
      const sanitized = args.map(arg => sanitizeData(arg));
      console.warn('[WARN]', ...sanitized);
    }
  },

  /**
   * Log errors (always logged, but sanitized)
   */
  error: (...args) => {
    const sanitized = args.map(arg => sanitizeData(arg));
    console.error('[ERROR]', ...sanitized);
  },

  /**
   * Debug logs (only in development)
   */
  debug: (...args) => {
    if (isDevelopment) {
      const sanitized = args.map(arg => sanitizeData(arg));
      console.debug('[DEBUG]', ...sanitized);
    }
  },

  /**
   * Log with category (for structured logging)
   */
  log: (category, message, data = {}) => {
    if (isDevelopment) {
      const sanitized = sanitizeData(data);
      console.log(`[${category.toUpperCase()}]`, message, sanitized);
    }
  },

  /**
   * Production-safe email logging (never logs email/phone in production)
   */
  email: (message, data = {}) => {
    if (isDevelopment) {
      console.log('[EMAIL]', message, sanitizeData(data));
    } else {
      // In production, only log that email was sent, not the content
      console.log('[EMAIL]', message, { sent: true, timestamp: new Date().toISOString() });
    }
  }
};

export default logger;

