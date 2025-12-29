// AI Service - Handles AI model integration for intelligent responses
// Supports OpenAI, Anthropic, or custom AI models

import { logger } from './logger';

// ============================================
// CONFIGURATION
// ============================================

// Set your AI model preference here
export const AI_CONFIG = {
  // Options: 'openai', 'anthropic', 'local', 'none'
  provider: process.env.REACT_APP_AI_PROVIDER || 'openai',


  // OpenAI Configuration
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || '',
    model: 'gpt-4o-mini', // Default model - will be dynamically selected based on intent/complexity
    temperature: 0.7,
    maxTokens: 1000 // Increased for complete responses - prevents truncation, allows full explanations and comparisons
  },

  // Anthropic Configuration
  anthropic: {
    apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY || '',
    model: 'claude-3-haiku-20240307',
    maxTokens: 500
  },

  // Local/Backend API Configuration
  local: {
    endpoint: process.env.REACT_APP_AI_ENDPOINT || 'http://localhost:3001/api/chat',
    model: 'local-llm'
  }
};

// ============================================
// MODEL ROUTING & SELECTION HELPERS
// ============================================

/**
 * Check if model uses Responses API (gpt-5.x) or Chat Completions API (gpt-4.x)
 * NOTE: We no longer use gpt-5.x models to avoid Responses API issues
 */
export function isResponsesAPIModel(model) {
  // Always return false - we only use gpt-4.x models which use Chat Completions API
  return false;
}

/**
 * Dynamic model selection based on intent and conversation depth
 * Cost-optimized: Use cheaper models for simple queries, premium for complex ones
 */
export function selectModelByIntent(intent, conversationDepth = 0, messageLength = 0, isHighIntent = false) {
  // Calculate depth score (0-1) based on conversation complexity
  const depthScore = Math.min(
    (conversationDepth / 15) + // More messages = higher depth
    (messageLength > 150 ? 0.3 : messageLength > 50 ? 0.1 : 0) + // Long messages = more complex
    (isHighIntent ? 0.3 : 0), // High intent = serious discussion
    1.0
  );

  // 🟢 Default: gpt-4o-mini (cheapest, good for 70-80% of queries)
  // Use for: FAQs, SIP basics, small talk, simple queries
  let selectedModel = 'gpt-4o-mini';

  // 🟡 Use gpt-4o for goal planning and moderate complexity (20-30% of queries)
  // Use for: Goal explanation, allocation logic, product exploration
  // NOTE: We removed gpt-5.2 to avoid Responses API issues - using gpt-4o for complex queries instead
  if (
    (intent === 'goal_planning' && depthScore > 0.25) ||
    (intent === 'product_exploration' && depthScore > 0.25) ||
    (depthScore > 0.35 && conversationDepth > 2) ||
    // For very deep conversations, still use gpt-4o (not gpt-5.2)
    (intent === 'goal_planning' && depthScore > 0.75 && conversationDepth > 7) ||
    (isHighIntent && depthScore > 0.8 && conversationDepth > 7) ||
    (intent === 'risk_profile' && depthScore > 0.7 && conversationDepth > 5)
  ) {
    selectedModel = 'gpt-4o';
  }

  console.log('🎯 Model Selection:', {
    intent,
    depthScore: depthScore.toFixed(2),
    conversationDepth,
    messageLength,
    isHighIntent,
    selectedModel,
    reason: selectedModel === 'gpt-4o' ? 'Moderate/high complexity - goal/allocation logic' :
      'Simple query - FAQs/basics'
  });

  return selectedModel;
}

/**
 * Extract message content from API response (handles both API formats)
 */
/**
 * Normalize text from various API response formats
 * Handles strings, arrays, objects, and nested structures
 */
function normalizeText(value) {
  if (!value) return "";

  if (typeof value === "string") return value.trim();

  // Responses API sometimes returns array segments
  if (Array.isArray(value)) {
    return value
      .map(v => {
        if (typeof v === "string") return v;
        if (typeof v === "object" && v !== null) {
          // Try multiple extraction paths for nested objects
          return v?.text ?? 
            v?.content ?? 
            v?.message ?? 
            (typeof v?.content === 'string' ? v.content : '') ??
            (Array.isArray(v?.content) ? normalizeText(v.content) : '') ??
            '';
        }
        return String(v || "");
      })
      .filter(v => v.length > 0)
      .join(" ")
      .trim();
  }

  // If it's an object, extract text content with comprehensive fallback
  if (typeof value === "object" && value !== null) {
    // Try direct text properties first
    if (value.text && typeof value.text === 'string') {
      return value.text.trim();
    }
    if (value.content && typeof value.content === 'string') {
      return value.content.trim();
    }
    if (value.message && typeof value.message === 'string') {
      return value.message.trim();
    }
    if (value.output_text && typeof value.output_text === 'string') {
      return value.output_text.trim();
    }

    // Handle nested content arrays (e.g., content: [{type: "text", text: "..."}])
    if (Array.isArray(value.content)) {
      const extracted = normalizeText(value.content);
      if (extracted) return extracted;
    }

    // Handle nested objects with text/content properties
    if (value.content && typeof value.content === 'object') {
      const nested = normalizeText(value.content);
      if (nested) return nested;
    }

    // FINAL SAFETY FALLBACK: Try to extract any string-like property
    try {
      // Look for any property that might contain text
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          const prop = value[key];
          if (typeof prop === 'string' && prop.trim().length > 0) {
            return prop.trim();
          }
          if (Array.isArray(prop)) {
            const arrText = normalizeText(prop);
            if (arrText) return arrText;
          }
        }
      }
      // Last resort: JSON stringify (but only if object has meaningful content)
      const jsonStr = JSON.stringify(value);
      // Only return JSON if it's not just "{}" or "[]"
      if (jsonStr && jsonStr.length > 2 && !['{}', '[]'].includes(jsonStr)) {
        return jsonStr;
      }
    } catch (e) {
      // If JSON.stringify fails, return empty
      console.warn('⚠️ normalizeText: Failed to stringify object', e);
    }

    return "";
  }

  return String(value || "").trim();
}

// ============================================
// BULLET-PROOF MESSAGE EXTRACTOR
// Handles all OpenAI API response formats
// ============================================
export function extractMessageFromResponse(data, isResponsesAPI) {
  // 1) If data is already a plain string, return it
  if (typeof data === "string") {
    return data.trim();
  }

  // 2) If data is null/undefined, return empty string
  if (!data || (typeof data !== 'object')) {
    return "";
  }

  // 3) Chat Completions API format - try all possible paths
  let msg = null;

  // Primary path: choices[0].message.content
  if (data?.choices?.[0]?.message?.content) {
    msg = data.choices[0].message.content;
  }
  // Alternative: choices[0].message (full message object)
  else if (data?.choices?.[0]?.message) {
    msg = data.choices[0].message;
  }
  // Alternative: choices[0].content
  else if (data?.choices?.[0]?.content) {
    msg = data.choices[0].content;
  }
  // Responses API: output_text
  else if (data?.output_text) {
    msg = data.output_text;
  }
  // Responses API: output.text
  else if (data?.output?.text) {
    msg = data.output.text;
  }
  // Responses API: output (if string)
  else if (typeof data?.output === 'string') {
    msg = data.output;
  }
  // Direct text field
  else if (data?.text) {
    msg = data.text;
  }
  // Direct content field
  else if (data?.content) {
    msg = data.content;
  }
  // Delta content (streaming)
  else if (data?.choices?.[0]?.delta?.content) {
    msg = data.choices[0].delta.content;
  }

  // 4) If we got a string, return it
  if (typeof msg === "string") {
    return msg.trim();
  }

  // 5) If msg is an array (content blocks), extract text from each
  if (Array.isArray(msg)) {
    const extracted = msg
      .map(x => {
        if (typeof x === 'string') return x;
        if (typeof x === 'object' && x !== null) {
          return x?.text ?? x?.content ?? x?.message ?? "";
        }
        return String(x || "");
      })
      .filter(x => x && x.length > 0)
      .join(" ")
      .trim();
    
    if (extracted) {
      return extracted;
    }
  }

  // 6) If msg is an object, try to extract text/content
  if (typeof msg === "object" && msg !== null) {
    const extracted = msg?.text ?? 
                     msg?.content ?? 
                     msg?.message ??
                     (Array.isArray(msg?.content) ? 
                       msg.content.map(c => c?.text || c?.content || '').join(' ') : 
                       '');
    
    if (extracted && typeof extracted === 'string' && extracted.trim().length > 0) {
      return extracted.trim();
    }
  }

  // 7) Try to extract from data directly (deep nested structures)
  if (data?.choices?.[0]?.message?.content) {
    const content = data.choices[0].message.content;
    if (Array.isArray(content)) {
      const extracted = content
        .map(c => c?.text || c?.content || (typeof c === 'string' ? c : ''))
        .filter(c => c && c.length > 0)
        .join(' ')
        .trim();
      if (extracted) {
        return extracted;
      }
    }
  }

  // 8) Last resort: try JSON.stringify for debugging (but only if it's meaningful)
  if (data && Object.keys(data).length > 0) {
    console.warn('⚠️ extractMessageFromResponse: Could not extract text from response structure', {
      isResponsesAPI,
      dataKeys: Object.keys(data),
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      firstChoiceKeys: data.choices?.[0] ? Object.keys(data.choices[0]) : [],
      messageKeys: data.choices?.[0]?.message ? Object.keys(data.choices[0].message) : [],
      contentValue: data.choices?.[0]?.message?.content,
      contentType: typeof data.choices?.[0]?.message?.content,
      contentIsArray: Array.isArray(data.choices?.[0]?.message?.content)
    });
  }

  // 9) Total fallback - return empty string (will trigger guardrail)
  return "";
}

// ============================================
// QUALITY SCORING LAYER
// Rejects weak, shallow, or incomplete responses
// ============================================
function evaluateResponseQuality(text) {
  if (!text) return { score: 0, reason: "empty" };

  const len = text.trim().length;
  const hasStructure = /(\d\)|•|-|\*\*)/.test(text);  // bullets / steps / markdown
  const hasConcepts = /(allocation|risk|goals|long-term|disciplined|equity|debt|invest|portfolio|diversification|asset)/i.test(text);
  const hasExplanation = /(means|is|helps|allows|enables|provides|offers|focus|approach|strategy)/i.test(text);
  const hasMultipleSentences = (text.match(/[.!?]\s+/g) || []).length >= 2;

  let score = 0;

  // Length scoring
  if (len > 80) score += 0.2;
  if (len > 150) score += 0.2;
  if (len > 250) score += 0.1;

  // Structure scoring
  if (hasStructure) score += 0.2;
  if (hasMultipleSentences) score += 0.1;

  // Content quality scoring
  if (hasConcepts) score += 0.2;
  if (hasExplanation) score += 0.1;

  return { 
    score: Math.min(score, 1), 
    reason: score < 0.6 ? "weak" : score < 0.8 ? "acceptable" : "good",
    details: { len, hasStructure, hasConcepts, hasExplanation, hasMultipleSentences }
  };
}

function enforceQuality(text, retryFn = null) {
  if (!text || typeof text !== 'string') {
    return text || "";
  }

  const quality = evaluateResponseQuality(text);

  if (quality.score >= 0.6) {
    return text;
  }

  console.warn("⚠️ Quality too low — auto repairing", { 
    quality,
    textPreview: text.substring(0, 100)
  });

  // Attempt retry if function provided
  if (retryFn && typeof retryFn === 'function') {
    try {
      const retryResult = retryFn("improve_quality");
      if (retryResult && typeof retryResult === 'string') {
        const retryQuality = evaluateResponseQuality(retryResult);
        if (retryQuality.score >= 0.6) {
          console.log('✅ Quality: Retry improved response');
          return retryResult.trim();
        }
      }
    } catch (error) {
      console.warn('⚠️ Quality: Retry failed', error);
    }
  }

  // Last fallback — safe default advisor explanation
  return `Let me explain this in a clearer and more helpful way 👍

The key idea is disciplined, goal-based investing with the right asset allocation across equity and debt — not chasing returns. 

If you'd like, I can also help you understand how this applies to your situation.`;
}

// ============================================
// TONE CONSISTENCY LAYER
// Ensures replies always sound like advisor persona
// ============================================
function repairTone(text) {
  if (!text || typeof text !== 'string') {
    return text || "";
  }

  let repaired = text;

  // Remove salesy / hype words
  const salesyPatterns = [
    /guaranteed/gi,
    /sure-shot/gi,
    /double money/gi,
    /quick profit/gi,
    /get rich/gi,
    /instant returns/gi,
    /risk-free/gi,
    /guaranteed returns/gi
  ];

  salesyPatterns.forEach(pattern => {
    repaired = repaired.replace(pattern, " ");
  });

  // Add advisor framing if missing key concepts
  const hasAdvisorFraming = /(asset allocation|long-term|disciplined|goal-based|diversification|risk management)/i.test(repaired);
  
  if (!hasAdvisorFraming && repaired.length > 50) {
    // Only add if response is substantial enough
    repaired += `

Our approach focuses on disciplined, long-term investing with the right asset allocation based on your goals and risk comfort — not speculation or short-term chasing.`;
  }

  return repaired.trim();
}

function enforceTone(text) {
  return repairTone(text);
}

// ============================================
// HALLUCINATION SAFETY LAYER
// Prevents false claims, guarantees, and fabricated numbers
// ============================================
function checkForRiskyContent(text) {
  if (!text || typeof text !== 'string') {
    return { safe: false, reason: "empty" };
  }

  const forbiddenPatterns = [
    /guaranteed\s+(return|profit|income|gains?)/i,
    /fixed\s+return/i,
    /risk\s*free/i,
    /double\s+money/i,
    /\bmonthly\s+10%/i,
    /sure\s+profit/i,
    /guaranteed\s+(\d+%|\d+\s*percent)/i,
    /no\s+risk/i,
    /zero\s+risk/i,
    /always\s+profit/i,
    /never\s+lose/i,
    /100%\s+guaranteed/i,
    /guaranteed\s+to\s+(double|triple|make)/i
  ];

  const flagged = forbiddenPatterns.some(p => p.test(text));
  const matchedPatterns = forbiddenPatterns.filter(p => p.test(text));

  return { 
    safe: !flagged, 
    flagged,
    matchedPatterns: matchedPatterns.length > 0 ? matchedPatterns.map(p => p.toString()) : []
  };
}

function enforceHallucinationSafety(text, retryFn = null) {
  if (!text || typeof text !== 'string') {
    return text || "";
  }

  const status = checkForRiskyContent(text);

  if (status.safe) {
    return text;
  }

  console.warn("🚨 Hallucination / claim risk detected — repairing response", {
    matchedPatterns: status.matchedPatterns,
    textPreview: text.substring(0, 150)
  });

  // Attempt retry if function provided
  if (retryFn && typeof retryFn === 'function') {
    try {
      const retryResult = retryFn("remove_risky_claims");
      if (retryResult && typeof retryResult === 'string') {
        const retryStatus = checkForRiskyContent(retryResult);
        if (retryStatus.safe) {
          console.log('✅ Safety: Retry removed risky claims');
          return retryResult.trim();
        }
      }
    } catch (error) {
      console.warn('⚠️ Safety: Retry failed', error);
    }
  }

  // Safe fallback that maintains compliance
  return `To answer responsibly — returns in equity and mutual funds are **market-linked and not guaranteed**. 

Instead of promising outcomes, we focus on disciplined investing, diversification and the right asset allocation for your goals.

Would you like to understand how to build a portfolio that aligns with your risk comfort and financial goals?`;
}

// ============================================
// RESPONSE GUARDRAIL UTILITY
// Ensures responses are never empty or too short
// ============================================
function enforceResponseGuardrails(text, rawResponse, retryFn = null) {
  const MIN_LENGTH = 20; // prevents single-word / broken replies

  // Convert to string safely
  const safeText = (text || "").toString().trim();

  // Case 1 — Valid response
  if (safeText && safeText.length >= MIN_LENGTH) {
    return safeText;
  }

  console.warn("⚠️ Guardrail Triggered — Empty or weak AI response", {
    text,
    textLength: safeText.length,
    rawResponseKeys: rawResponse ? Object.keys(rawResponse) : [],
    hasChoices: !!rawResponse?.choices,
    choicesLength: rawResponse?.choices?.length || 0
  });

  // Case 2 — Attempt a SINGLE auto-retry if retry function provided
  if (retryFn && typeof retryFn === 'function') {
    try {
      const retryResult = retryFn(true); // flag as retry mode
      if (retryResult && typeof retryResult === 'string' && retryResult.trim().length >= MIN_LENGTH) {
        console.log('✅ Guardrail: Retry succeeded');
        return retryResult.trim();
      }
    } catch (error) {
      console.warn('⚠️ Guardrail: Retry failed', error);
    }
  }

  // Case 3 — Graceful advisor fallback (do not break UX)
  return `I'm here to help — let me explain that in a simple way 👍

Equity investing is a way to grow wealth over the long term by investing in businesses. Returns are market-linked and may fluctuate in the short term, but disciplined investing with the right asset allocation helps build value over time.

If you'd like, I can also help you understand:
• how equity fits into your overall asset allocation
• whether it is suitable for your goals
• or how to start step-by-step.`;
}

// ============================================
// FINALIZE AI RESPONSE
// Complete pipeline: extraction → normalization → guardrails → quality → tone → safety
// Order matters: guardrails first, then quality, tone, and safety
// ============================================
export function finalizeAIResponse(data, isResponsesAPI = false, retryFn = null) {
  // Step 1: Extract and normalize text
  const raw = extractMessageFromResponse(data, isResponsesAPI);
  const normalized = normalizeText(raw);
  
  // Step 2: Guardrails — ensure not blank (minimum length check)
  let text = enforceResponseGuardrails(normalized, data, retryFn);
  
  // Step 3: Quality — ensure useful and complete (reject weak/shallow responses)
  text = enforceQuality(text, retryFn);
  
  // Step 4: Tone — ensure advisor voice (calm, ethical, educational)
  text = enforceTone(text);
  
  // Step 5: Safety — ensure compliant & honest (no false claims or guarantees)
  text = enforceHallucinationSafety(text, retryFn);
  
  return text;
}

// ============================================
// AI MODEL INTEGRATION
// ============================================

/**
 * Call AI model to generate intelligent response
 * @param {string} userMessage - User's question
 * @param {string} language - Language code
 * @param {object} context - Conversation context
 * @param {string} intent - Detected intent
 * @param {object} options - Additional options (conversationDepth, messageLength, isHighIntent)
 * @returns {Promise<object>} AI response with text and metadata
 */
export const callAIModel = async (userMessage, language, context, intent, options = {}) => {
  // Dynamic model selection based on intent and complexity
  const { conversationDepth = 0, messageLength = userMessage.length, isHighIntent = false } = options;
  const selectedModel = selectModelByIntent(intent, conversationDepth, messageLength, isHighIntent);

  // Temporarily override config model with dynamically selected model for this call
  const originalModel = AI_CONFIG.openai.model;
  const previousModel = AI_CONFIG.openai.model; // Save to restore later
  AI_CONFIG.openai.model = selectedModel;

  console.log('🤖 AI Model Selection:', {
    originalConfigModel: originalModel,
    selectedModel,
    intent,
    conversationDepth,
    messageLength,
    isHighIntent
  });
  // Check if AI provider is configured
  const provider = AI_CONFIG.provider;
  const apiKey = AI_CONFIG[provider]?.apiKey;

  // Debug logging
  console.log('🤖 AI Service Call:', {
    provider,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    language,
    intent
  });

  // If no AI provider configured, return null to use rule-based responses
  if (provider === 'none' || !apiKey) {
    console.warn('⚠️ AI not configured:', { provider, hasApiKey: !!apiKey });
    return null;
  }

  try {
    let result;
    switch (provider) {
      case 'openai':
        result = await callOpenAI(userMessage, language, context, intent);
        break;
      case 'anthropic':
        result = await callAnthropic(userMessage, language, context, intent);
        break;
      case 'local':
        result = await callLocalAPI(userMessage, language, context, intent);
        break;
      default:
        console.warn('⚠️ Unknown AI provider:', provider);
        result = null;
    }

    // Restore original model after API call
    AI_CONFIG.openai.model = previousModel;

    return result;
  } catch (error) {
    // Restore original model on error
    AI_CONFIG.openai.model = previousModel;
    console.error('❌ AI Model Error:', error);

    // Check if it's a quota/rate limit error - these should have been handled by callOpenAI
    const isQuotaError = error.message?.includes('quota') || error.message?.includes('429') ||
      error.message?.includes('insufficient_quota');

    if (isQuotaError) {
      console.warn('⚠️ OpenAI quota exceeded - falling back to rule-based responses');
      // Return null gracefully for quota errors
      return null;
    }

    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      provider,
      hasApiKey: !!apiKey
    });
    // Fallback to rule-based responses on error
    return null;
  }
};

// ============================================
// OPENAI INTEGRATION
// ============================================

const callOpenAI = async (userMessage, language, context, intent) => {
  const model = AI_CONFIG.openai.model;

  // ⚠️ IMPORTANT: API Format Detection
  // All models now use Chat Completions API (gpt-4o-mini, gpt-4o)
  // We removed gpt-5.x models to avoid Responses API issues
  console.log('🔍 API Format Detection:', {
    model: model,
    apiType: 'Chat Completions API (gpt-4.x)',
    usesMaxTokens: true
  });

  // NOTE: Responses API routing removed - we only use Chat Completions API now

  // gpt-4.x models use Chat Completions API with max_tokens
  console.log('✅ Routing to Chat Completions API (/v1/chat/completions) for model:', model);

  // Use provided messages array if available (from LLM Agent), otherwise build it
  let messages;

  if (context.messages && Array.isArray(context.messages)) {
    // Use the full messages array from LLM Agent (includes system prompt, context summary, conversation history)
    messages = context.messages;
  } else {
    // Build messages array from system prompt and user message (fallback mode)
    const systemPrompt = getSystemPrompt(language, context, intent);
    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
  }

  console.log('📤 Calling OpenAI API:', {
    model: model,
    messagesCount: messages.length,
    hasApiKey: !!AI_CONFIG.openai.apiKey
  });

  // Build request body - standard chat completions API
  // NOTE: gpt-4o-mini, gpt-4o, etc. use chat.completions API with max_tokens
  const requestBody = {
    model: model,
    messages: messages,
    max_tokens: AI_CONFIG.openai.maxTokens
    // NOTE: We intentionally omit temperature to avoid model-specific unsupported_value errors.
    // Default temperature is acceptable for this product and improves compatibility.
  };

  console.log('📤 Chat Completions API Request:', {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: model,
    messagesCount: messages.length,
    requestBody: {
      model: requestBody.model,
      messagesCount: requestBody.messages.length,
      max_tokens: requestBody.max_tokens,
      temperature: requestBody.temperature
    }
  });

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { error: { message: errorText } };
    }

    const errorCode = errorData?.error?.code;
    const errorMessage = errorData?.error?.message || errorText;

    console.error('❌ OpenAI Chat Completions API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorCode: errorCode,
      errorMessage: errorMessage,
      // Log raw request payload for debugging
      requestPayload: {
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: requestBody.model,
        messagesCount: requestBody.messages.length,
        max_tokens: requestBody.max_tokens,
        temperature: requestBody.temperature,
        // First and last message preview (for debugging without exposing full content)
        firstMessage: requestBody.messages[0]?.content?.substring(0, 100) || 'N/A',
        lastMessage: requestBody.messages[requestBody.messages.length - 1]?.content?.substring(0, 100) || 'N/A'
      }
    });

    // Handle quota/rate limit errors gracefully - return null to trigger fallback
    if (response.status === 429) {
      if (errorCode === 'insufficient_quota' || errorMessage.includes('quota')) {
        console.warn('⚠️ OpenAI quota exceeded - falling back to rule-based responses');
        return null; // Return null instead of throwing to trigger fallback
      } else {
        // Rate limit - could retry, but for now fallback
        console.warn('⚠️ OpenAI rate limit - falling back to rule-based responses');
        return null;
      }
    }

    // Handle invalid model errors (e.g., if model name doesn't exist)
    if (
      response.status === 404 ||
      errorCode === 'model_not_found' ||
      (errorMessage.includes('model') && errorMessage.includes('not found'))
    ) {
      console.error('❌ OpenAI model not found:', AI_CONFIG.openai.model);
      console.warn('⚠️ Falling back to rule-based responses. Please check if the model name is correct.');
      return null; // Return null to trigger fallback
    }

    // Handle unsupported parameter/value errors.
    // NOTE: We do NOT retry with the Responses API anymore (gpt-5.x removed).
    if (response.status === 400 && (
      errorCode === 'unsupported_parameter' ||
      errorCode === 'unsupported_value' ||
      errorMessage.includes('max_tokens') ||
      errorMessage.includes('max_completion_tokens') ||
      errorMessage.includes('temperature')
    )) {
      console.error('❌ OpenAI parameter/value error:', errorMessage);

      console.warn('⚠️ Model has different parameter requirements. Falling back to rule-based responses.');
      return null; // Return null to trigger fallback
    }

    // For other errors, still throw to be caught by error handler
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const data = await response.json();

  // Use finalizeAIResponse which includes extraction + normalization + guardrails
  // This ensures we never return empty/undefined responses
  const message = finalizeAIResponse(data, false);

  console.log('✅ OpenAI Response received:', {
    model: data.model,
    hasContent: !!message,
    contentLength: message?.length || 0,
    responseStructure: {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasMessage: !!data.choices?.[0]?.message,
      messageContentType: typeof data?.choices?.[0]?.message?.content,
      messageContentIsArray: Array.isArray(data?.choices?.[0]?.message?.content),
      messageContentPreview: Array.isArray(data?.choices?.[0]?.message?.content) 
        ? JSON.stringify(data.choices[0].message.content).substring(0, 200)
        : data?.choices?.[0]?.message?.content?.substring(0, 200)
    }
  });

  // Guardrail ensures message is never empty, but double-check for safety
  if (!message || (typeof message === 'string' && message.trim().length === 0)) {
    console.error('❌ CRITICAL: finalizeAIResponse returned empty (should not happen)', {
      message: message,
      fullResponse: data
    });
    // This should never happen due to guardrail, but if it does, return fallback
    return {
      text: "I'm here to help — let me explain that in a simple way. If you'd like more details, please ask again or connect with our advisor team.",
      model: data.model || AI_CONFIG.openai.model,
      provider: 'openai'
    };
  }

  return {
    text: message, // Already trimmed and validated by guardrail
    model: data.model || AI_CONFIG.openai.model,
    provider: 'openai'
  };
};

// ============================================
// OPENAI NEW API (Responses API - Currently unused, kept for future reference)
// ============================================

// eslint-disable-next-line no-unused-vars
const callOpenAINewAPI = async (userMessage, language, context, intent) => {
  const model = AI_CONFIG.openai.model;

  // Build the input text from messages
  let inputText;

  if (context.messages && Array.isArray(context.messages)) {
    // Convert messages array to a single input string
    // Format: System prompt + conversation history + user message
    const systemMsg = context.messages.find(m => m.role === 'system');
    const conversationMsgs = context.messages.filter(m => m.role !== 'system');

    inputText = systemMsg ? `${systemMsg.content}\n\n` : '';
    inputText += conversationMsgs.map(m => {
      if (m.role === 'user') return `User: ${m.content}`;
      if (m.role === 'assistant') return `Assistant: ${m.content}`;
      return m.content;
    }).join('\n\n');

    if (!inputText.includes(userMessage)) {
      inputText += `\n\nUser: ${userMessage}`;
    }
  } else {
    // Build from system prompt and user message
    const systemPrompt = getSystemPrompt(language, context, intent);
    inputText = `${systemPrompt}\n\nUser: ${userMessage}`;
  }

  console.log('📤 Calling OpenAI New API (responses.create):', {
    model: model,
    inputLength: inputText.length,
    hasApiKey: !!AI_CONFIG.openai.apiKey
  });

  // Build request body for new API structure
  // NOTE: Responses API uses max_output_tokens (NOT max_tokens) - Currently unused
  // These APIs are NOT parameter-compatible
  const requestBody = {
    model: model,
    input: inputText,
    max_output_tokens: AI_CONFIG.openai.maxTokens
    // Note: temperature may not be supported in Responses API, so we omit it
  };

  console.log('📤 Responses API Request:', {
    endpoint: 'https://api.openai.com/v1/responses',
    model: model,
    inputLength: inputText.length,
    requestBody: {
      model: requestBody.model,
      inputLength: requestBody.input.length,
      max_output_tokens: requestBody.max_output_tokens,
      inputPreview: requestBody.input.substring(0, 200) + '...' // First 200 chars for debugging
    }
  });

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_CONFIG.openai.apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch (e) {
      errorData = { error: { message: errorText } };
    }

    const errorCode = errorData?.error?.code;
    const errorMessage = errorData?.error?.message || errorText;

    console.error('❌ OpenAI Responses API Error:', {
      status: response.status,
      statusText: response.statusText,
      errorCode: errorCode,
      errorMessage: errorMessage,
      // Log raw request payload for debugging
      requestPayload: {
        endpoint: 'https://api.openai.com/v1/responses',
        model: requestBody.model,
        inputLength: requestBody.input.length,
        max_output_tokens: requestBody.max_output_tokens,
        inputPreview: requestBody.input.substring(0, 300) + '...' // First 300 chars for debugging
      }
    });

    // Handle quota/rate limit errors gracefully
    if (response.status === 429) {
      if (errorCode === 'insufficient_quota' || errorMessage.includes('quota')) {
        console.warn('⚠️ OpenAI quota exceeded - falling back to rule-based responses');
        return null;
      } else {
        console.warn('⚠️ OpenAI rate limit - falling back to rule-based responses');
        return null;
      }
    }

    // Handle invalid model errors
    if (
      response.status === 404 ||
      errorCode === 'model_not_found' ||
      (errorMessage.includes('model') && errorMessage.includes('not found'))
    ) {
      console.error('❌ OpenAI model not found:', model);
      console.warn('⚠️ Falling back to rule-based responses. Please check if the model name is correct.');
      return null;
    }

    // For other errors, throw to be caught by error handler
    throw new Error(`OpenAI New API error: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const data = await response.json();

  // Log full response structure for debugging
  logger.debug('api', 'OpenAI Responses API raw response', {
    model: data.model || model,
    responseKeys: Object.keys(data),
    responseStructure: {
      hasOutputText: !!data.output_text,
      outputTextType: typeof data.output_text,
      outputTextValue: data.output_text,
      hasOutput: !!data.output,
      outputType: typeof data.output,
      outputValue: data.output,
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length || 0,
      hasText: !!data.text,
      textType: typeof data.text,
      fullResponse: data
    }
  });

  // Extract message using safe extractor (handles multiple response structures)
  const message = extractMessageFromResponse(data, true);

  logger.info('api', 'OpenAI Responses API Response extracted', {
    model: data.model || model,
    hasContent: !!message,
    contentLength: message?.length || 0,
    contentType: typeof message,
    messagePreview: typeof message === 'string' ? message.substring(0, 200) : String(message).substring(0, 200)
  });

  // Check if we got any content
  if (!message || (typeof message === 'string' && message.trim().length === 0)) {
    logger.error('api', 'OpenAI Responses API response has empty or null content', {
      message: message,
      messageType: typeof message,
      fullResponse: data,
      attemptedPaths: {
        output_text: data?.output_text,
        output_text_type: typeof data?.output_text,
        output_text_value: data?.output_text,
        output: data?.output,
        output_type: typeof data?.output,
        output_value: data?.output,
        choices: data?.choices,
        choices_length: data.choices?.length || 0,
        text: data?.text,
        text_type: typeof data?.text
      }
    });

    // If Responses API returns empty, try falling back to Chat Completions API
    // This can happen if the model doesn't actually support Responses API or returns empty
    console.warn('⚠️ Responses API returned empty content. Attempting fallback to Chat Completions API...');

    // Check if model might work with Chat Completions API
    // If it's gpt-4o-mini or similar, it definitely should use Chat Completions
    if (model === 'gpt-4o-mini' || model === 'gpt-4o' || model.startsWith('gpt-4')) {
      console.warn('⚠️ Model should use Chat Completions API, not Responses API. This is a routing error.');
      // Don't retry here - the routing logic should have prevented this
      return null;
    }

    // NOTE: gpt-5.x models are no longer used - all models use Chat Completions API
    return null;
  }

  return {
    text: typeof message === 'string' ? message.trim() : String(message),
    model: data.model || model,
    provider: 'openai'
  };
};

// ============================================
// ANTHROPIC INTEGRATION
// ============================================

const callAnthropic = async (userMessage, language, context, intent) => {
  // Use provided messages array if available (from LLM Agent), otherwise build it
  let systemPrompt;
  let messages;

  if (context.messages && Array.isArray(context.messages)) {
    // Extract system prompt from messages array
    const systemMsg = context.messages.find(m => m.role === 'system');
    systemPrompt = systemMsg?.content || getSystemPrompt(language, context, intent);

    // Extract user/assistant messages (Anthropic format)
    messages = context.messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));
  } else {
    // Build messages array from system prompt and user message (fallback mode)
    systemPrompt = getSystemPrompt(language, context, intent);
    messages = [
      { role: 'user', content: userMessage }
    ];
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_CONFIG.anthropic.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: AI_CONFIG.anthropic.model,
      max_tokens: AI_CONFIG.anthropic.maxTokens,
      system: systemPrompt,
      messages: messages
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.content[0].text.trim(),
    model: AI_CONFIG.anthropic.model,
    provider: 'anthropic'
  };
};

// ============================================
// LOCAL/BACKEND API INTEGRATION
// ============================================

const callLocalAPI = async (userMessage, language, context, intent) => {
  const response = await fetch(AI_CONFIG.local.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: userMessage,
      language,
      context,
      intent
    })
  });

  if (!response.ok) {
    throw new Error(`Local API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.response || data.text,
    model: AI_CONFIG.local.model,
    provider: 'local'
  };
};

// ============================================
// SYSTEM PROMPT GENERATION
// ============================================

const getSystemPrompt = (language, context, intent) => {
  const languageNames = {
    'hinglish': 'Hinglish (mix of Hindi and English)',
    'hi': 'Hindi',
    'en': 'English',
    'pa': 'Punjabi'
  };

  // Use lite/fallback prompt for quick responses
  // This is used when LLM Agent is not available or for simpler queries
  return `You are a friendly and conversational financial assistant for Anupaat Nivesh, an Indian financial advisory firm.

Give clear, simple, empathetic answers, adapt to the user's knowledge level, and ask one helpful follow-up question at the end.

LANGUAGE: Respond in ${languageNames[language] || 'Hinglish'} - match user's language preference.

KEY RULES:
- Keep responses concise (2-3 sentences)
- Use simple language, no jargon
- Be warm and helpful
- Never recommend specific funds or guarantee returns
- Focus on education and understanding
- Use Indian examples and relatable analogies

USER CONTEXT:
- Intent: ${intent}
- Goal: ${context.goal || 'not specified'}
- Experience: ${context.experience || 'unknown'}

Remember: You're helping Indian investors (often first-time) understand long-term investing. Build trust through clarity and empathy.`;
};

// ============================================
// LEARNING & MEMORY SYSTEM
// ============================================

const LEARNING_STORAGE_KEY = 'arthai_learning_data';

/**
 * Save conversation pattern for learning
 */
export const saveLearningPattern = (userMessage, intent, response, language) => {
  try {
    const existing = JSON.parse(localStorage.getItem(LEARNING_STORAGE_KEY) || '[]');
    const pattern = {
      timestamp: new Date().toISOString(),
      message: userMessage,
      intent,
      language,
      responseLength: response?.text?.length || 0,
      usedCalculator: response?.usedCalculator || false
    };

    existing.push(pattern);

    // Keep only last 1000 interactions
    if (existing.length > 1000) {
      existing.shift();
    }

    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving learning pattern:', error);
  }
};

/**
 * Get learned patterns for better responses
 */
export const getLearningPatterns = () => {
  try {
    return JSON.parse(localStorage.getItem(LEARNING_STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error loading learning patterns:', error);
    return [];
  }
};

/**
 * Analyze patterns to improve responses
 */
export const analyzePatterns = (intent, language) => {
  const patterns = getLearningPatterns();
  const relevant = patterns.filter(p =>
    p.intent === intent && p.language === language
  );

  if (relevant.length === 0) return null;

  // Calculate average response length for this intent
  const avgLength = relevant.reduce((sum, p) => sum + p.responseLength, 0) / relevant.length;
  const calculatorUsage = relevant.filter(p => p.usedCalculator).length / relevant.length;

  return {
    avgResponseLength: avgLength,
    calculatorUsageRate: calculatorUsage,
    totalInteractions: relevant.length
  };
};

const aiService = {
  callAIModel,
  saveLearningPattern,
  getLearningPatterns,
  analyzePatterns,
  AI_CONFIG
};

export default aiService;

