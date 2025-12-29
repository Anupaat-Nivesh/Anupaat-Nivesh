// ============================================
// UNIFIED RESPONSE HANDLER
// Production-ready, simplified response processing
// ============================================

/**
 * Unified function to create a valid response object
 * This replaces multiple normalization functions with a single, reliable handler
 */
export function createResponse(text, options = {}) {
  const {
    id = null,
    sender = 'bot',
    timestamp = new Date(),
    quickReplies = [],
    showCTAs = true,
    ctaType = 'general',
    language = 'hinglish'
  } = options;

  // Ensure text is always a string
  let responseText = '';
  if (typeof text === 'string') {
    responseText = text.trim();
  } else if (text && typeof text === 'object') {
    responseText = text.text || text.message || text.content || text.output_text || '';
    responseText = String(responseText).trim();
  } else {
    responseText = String(text || '').trim();
  }

  // Generate unique ID if not provided
  const messageId = id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: messageId,
    text: responseText,
    sender,
    timestamp,
    quickReplies: Array.isArray(quickReplies) ? quickReplies : [],
    showCTAs,
    ctaType
  };
}

/**
 * Extract text from AI response (handles all OpenAI API formats)
 * Production-ready with comprehensive format support
 */
export function extractTextFromAIResponse(data) {
  if (!data) return '';

  // String response
  if (typeof data === 'string') {
    return data.trim();
  }

  // Chat Completions API format (most common)
  if (data?.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    if (typeof content === 'string') return content.trim();
    if (Array.isArray(content)) {
      return content
        .map(c => {
          if (typeof c === 'string') return c;
          if (c?.type === 'text' && c?.text) return c.text;
          return c?.text || c?.content || '';
        })
        .filter(c => c && c.trim().length > 0)
        .join(' ')
        .trim();
    }
  }

  // Alternative: choices[0].content (some API variations)
  if (data?.choices?.[0]?.content) {
    const content = data.choices[0].content;
    if (typeof content === 'string') return content.trim();
  }

  // Direct text fields (LLM Agent response format)
  if (data?.text) return String(data.text).trim();
  if (data?.message) return String(data.message).trim();
  if (data?.content) {
    const content = data.content;
    if (typeof content === 'string') return content.trim();
    if (Array.isArray(content)) {
      return content
        .map(c => c?.text || (typeof c === 'string' ? c : ''))
        .filter(c => c)
        .join(' ')
        .trim();
    }
  }
  if (data?.output_text) return String(data.output_text).trim();

  // Nested message object
  if (data?.message?.text) return String(data.message.text).trim();
  if (data?.message?.content) {
    const msgContent = data.message.content;
    if (typeof msgContent === 'string') return msgContent.trim();
  }

  // Fallback - log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Could not extract text from AI response:', {
      keys: Object.keys(data || {}),
      type: typeof data,
      hasChoices: !!data?.choices,
      sample: JSON.stringify(data).substring(0, 200)
    });
  }

  return '';
}

/**
 * Validate response has required fields
 * Ensures response is valid before rendering
 */
export function validateResponse(response) {
  if (!response || typeof response !== 'object') {
    return false;
  }

  // Check for text in multiple possible fields
  const text = response.text || response.message || response.content || response.output_text || '';
  
  // Must be a non-empty string
  if (typeof text !== 'string' || text.trim().length === 0) {
    return false;
  }

  // Ensure minimum length (prevent single character or whitespace responses)
  if (text.trim().length < 3) {
    return false;
  }

  return true;
}

