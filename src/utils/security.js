/**
 * Security Utilities
 * Input sanitization and validation to prevent XSS and injection attacks
 */

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') return str;
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Sanitize user input for safe display
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick=, etc.)
    .trim()
    .substring(0, 10000); // Limit length
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * Validate phone number format
 */
export function validatePhone(phone) {
  if (!phone || typeof phone !== 'string') return false;
  // Allow digits, +, spaces, hyphens, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(cleaned) && cleaned.length <= 15;
}

/**
 * Validate and sanitize name
 */
export function validateName(name) {
  if (!name || typeof name !== 'string') return false;
  const sanitized = sanitizeInput(name);
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-']{1,100}$/;
  return nameRegex.test(sanitized);
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Escape special regex characters
 */
export function escapeRegex(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check for potential SQL injection patterns (for backend validation)
 */
export function containsSQLInjection(input) {
  if (typeof input !== 'string') return false;
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|#|\/\*|\*\/|;)/g,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\bUNION\s+SELECT\b)/gi,
  ];
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Check for potential XSS patterns
 */
export function containsXSS(input) {
  if (typeof input !== 'string') return false;
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];
  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize user message for chatbot
 */
export function sanitizeUserMessage(message) {
  if (!message || typeof message !== 'string') return '';
  
  // Check for XSS
  if (containsXSS(message)) {
    return sanitizeInput(message);
  }
  
  // Limit length
  const maxLength = 5000;
  if (message.length > maxLength) {
    return sanitizeInput(message.substring(0, maxLength));
  }
  
  return sanitizeInput(message);
}

