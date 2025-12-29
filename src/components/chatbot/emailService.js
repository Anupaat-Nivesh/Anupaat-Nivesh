// Email Service - Handles sending emails when users submit contact form
// Uses existing EmailJS configuration from contact form
// Supports EmailJS (client-side) and backend API (production)

// Import existing EmailJS configuration from contact form
import { 
  emailJSserviceID, 
  emailJSKey,
  emailJStemplateID,
  emailJSMFtemplteID,
  emailJSOpsTemplateID
} from '../contact/Config';
import logger from '../../utils/logger';
import { sanitizeUserMessage, validateEmail, validatePhone } from '../../utils/security';

/**
 * Email Service Configuration
 */
export const EMAIL_CONFIG = {
  // EmailJS Configuration (uses existing config from contact form)
  emailjs: {
    serviceId: emailJSserviceID,
    templateId: emailJStemplateID, // User confirmation template
    // Ops notification template: Using template_abk1zsr (emailJSMFtemplteID) for ArthAI leads
    // This template expects: name, number, mail, fundname
    opsTemplateId: emailJSMFtemplteID, // Always use template_abk1zsr for ops leads
    publicKey: emailJSKey,
    enabled: true // Always enabled since config exists
  },
  
  // Backend API Configuration (for production - optional)
  backend: {
    endpoint: process.env.REACT_APP_EMAIL_API_ENDPOINT || '',
    enabled: process.env.REACT_APP_EMAIL_API_ENABLED === 'true'
  },
  
  // Email addresses
  fromEmail: 'anupaatnivesh@gmail.com',
  opsEmail: 'ops.anupaatnivesh@gmail.com'
};

/**
 * Send email to user and ops team when contact form is submitted
 * @param {Object} contactData - Contact information
 * @param {Object} conversationData - Conversation context
 * @returns {Promise<Object>} - Success/error result
 */
export async function sendContactEmails(contactData, conversationData = {}) {
  // Sanitize and validate input
  const sanitizedEmail = contactData.email ? sanitizeUserMessage(contactData.email) : null;
  const sanitizedPhone = contactData.phone ? sanitizeUserMessage(contactData.phone) : null;
  const sanitizedName = contactData.name ? sanitizeUserMessage(contactData.name) : null;
  
  // Validate email and phone
  if (sanitizedEmail && !validateEmail(sanitizedEmail)) {
    logger.error('Invalid email format provided');
    return { success: false, error: 'Invalid email format' };
  }
  
  if (sanitizedPhone && !validatePhone(sanitizedPhone)) {
    logger.error('Invalid phone format provided');
    return { success: false, error: 'Invalid phone format' };
  }
  
  const { email, phone, name } = {
    email: sanitizedEmail,
    phone: sanitizedPhone,
    name: sanitizedName
  };
  
  const { conversationSummary, intentType, language, messagesLength } = conversationData;

  // Determine recipient email (user's email if provided, otherwise skip user email)
  const userEmail = email || null;
  
  if (!userEmail && !phone) {
    logger.warn('No email or phone provided, skipping email sending');
    return { success: false, error: 'No contact information provided' };
  }

  logger.email('sendContactEmails called', {
    hasEmail: !!email,
    hasPhone: !!phone,
    emailjsEnabled: EMAIL_CONFIG.emailjs.enabled,
    emailjsServiceId: EMAIL_CONFIG.emailjs.serviceId,
    backendEnabled: EMAIL_CONFIG.backend.enabled
  });

  try {
    // Try backend API first (if enabled)
    if (EMAIL_CONFIG.backend.enabled && EMAIL_CONFIG.backend.endpoint) {
      logger.email('Using backend API for email sending');
      return await sendViaBackendAPI(contactData, conversationData);
    }
    
    // Fallback to EmailJS (if enabled)
    if (EMAIL_CONFIG.emailjs.enabled && EMAIL_CONFIG.emailjs.serviceId) {
      logger.email('Using EmailJS for email sending');
      return await sendViaEmailJS(contactData, conversationData);
    }
    
    // If no email service configured, log and return success (don't block form submission)
    logger.warn('Email service not configured. Please set up EmailJS or backend API.', {
      emailjsEnabled: EMAIL_CONFIG.emailjs.enabled,
      emailjsServiceId: EMAIL_CONFIG.emailjs.serviceId,
      backendEnabled: EMAIL_CONFIG.backend.enabled
    });
    return { success: true, skipped: true, message: 'Email service not configured' };
    
  } catch (error) {
    logger.error('Error sending emails:', error);
    // Don't throw error - email failure shouldn't block form submission
    return { success: false, error: error.message, skipped: false };
  }
}

/**
 * Send emails via backend API (production)
 */
async function sendViaBackendAPI(contactData, conversationData) {
  try {
    const response = await fetch(EMAIL_CONFIG.backend.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: contactData.email,
        opsCopy: EMAIL_CONFIG.opsEmail,
        from: EMAIL_CONFIG.fromEmail,
        contactData,
        conversationData
      })
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }

    const result = await response.json();
    logger.email('Emails sent via backend API');
    return { success: true, method: 'backend', ...result };
  } catch (error) {
    logger.error('Backend API email error:', error);
    throw error;
  }
}

/**
 * Send emails via EmailJS (client-side)
 * Note: Requires EmailJS account setup at https://www.emailjs.com/
 */
async function sendViaEmailJS(contactData, conversationData) {
  logger.email('sendViaEmailJS called');
  
  // Dynamically import EmailJS (only if needed)
  let emailjs;
  try {
    emailjs = await import('@emailjs/browser');
    logger.debug('EmailJS library imported successfully');
  } catch (error) {
    logger.error('EmailJS library not installed. Run: npm install @emailjs/browser', error);
    throw new Error('EmailJS library not available');
  }

  const { email, phone, name } = contactData;
  const { conversationSummary, intentType, language, messagesLength } = conversationData;

  // Extract EmailJS functions (handle both default and named exports)
  const emailjsModule = emailjs.default || emailjs;
  const { init, send } = emailjsModule;
  
  // Initialize EmailJS with public key
  init(EMAIL_CONFIG.emailjs.publicKey);
  
  logger.debug('EmailJS initialized', { serviceId: EMAIL_CONFIG.emailjs.serviceId });

  const results = [];

  // 1. Send email to user (if email provided)
  // Use existing template structure: first_name, last_name, user_email, number, message
  if (email) {
    try {
      // Split name into first and last name if provided
      const nameParts = (name || '').split(' ');
      const firstName = nameParts[0] || 'Valued';
      const lastName = nameParts.slice(1).join(' ') || 'Customer';
      
      const userEmailResult = await send(
        EMAIL_CONFIG.emailjs.serviceId,
        EMAIL_CONFIG.emailjs.templateId,
        {
          // Map to existing template fields
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          number: phone || 'Not provided',
          message: getUserEmailTemplate(name, language),
          // Additional fields for template customization
          to_email: email,
          to_name: name || 'Valued Customer',
          subject: 'Thank you for contacting Anupaat Nivesh',
          intent: intentType || 'General inquiry'
        }
      );
      results.push({ type: 'user', success: true, result: userEmailResult });
      logger.email('User email sent via EmailJS');
    } catch (error) {
      logger.error('Failed to send user email:', error);
      results.push({ type: 'user', success: false, error: error.message });
    }
  }

  // 2. Send notification email to ops team
  // Using template_abk1zsr (emailJSMFtemplteID) for ArthAI lead notifications
  // Template expects: name, number, mail, fundname
  const opsTemplateId = emailJSMFtemplteID; // Use template_abk1zsr for ops leads
  
  logger.debug('Using template_abk1zsr for ArthAI lead notification');
  
  try {
    // Build subject line: "Mutual fund query from Email- {{email}} and {{mobile number}}"
    // Or combination of both, or whichever is provided
    let subjectName = '';
    if (email && phone) {
      subjectName = `Email- ${email} and ${phone}`;
    } else if (email) {
      subjectName = `Email- ${email}`;
    } else if (phone) {
      subjectName = `Mobile- ${phone}`;
    } else {
      subjectName = 'ArthAI Chatbot';
    }
    
    // Prepare template data - use "null" for missing values as requested
    const templateData = {
      // Template field: {{name}} - used in subject and body
      name: name || subjectName || 'null',
      
      // Template field: {{number}} - mobile number
      number: phone || 'null',
      
      // Template field: {{mail}} - email address
      mail: email || 'null',
      
      // Template field: {{fundname}} - always "ArthAI" for chatbot leads
      fundname: 'ArthAI'
    };
    
    // Subject line: "Mutual fund query from {{name}}"
    const emailSubject = `Mutual fund query from ${subjectName}`;
    
    logger.email('Sending ops email with lead data', {
      templateId: opsTemplateId,
      serviceId: EMAIL_CONFIG.emailjs.serviceId,
      subject: emailSubject,
      hasEmail: !!email,
      hasPhone: !!phone,
      hasName: !!name,
      fundname: 'ArthAI',
      intent: intentType
    });
    
    const opsEmailResult = await send(
      EMAIL_CONFIG.emailjs.serviceId,
      opsTemplateId,
      {
        // Map to template_abk1zsr fields exactly as template expects
        name: templateData.name,
        number: templateData.number,
        mail: templateData.mail,
        fundname: templateData.fundname,
        // Additional fields for EmailJS (subject, recipient, etc.)
        subject: emailSubject,
        to_email: EMAIL_CONFIG.opsEmail,
        to_name: 'Anupaat Nivesh Ops Team'
      }
    );
    results.push({ type: 'ops', success: true, result: opsEmailResult });
    logger.email('Ops lead notification email sent via EmailJS', {
      status: opsEmailResult.status,
      templateId: opsTemplateId,
      subject: emailSubject
    });
  } catch (error) {
    logger.error('Failed to send ops email:', error);
    results.push({ type: 'ops', success: false, error: error.message });
  }

  const allSuccessful = results.every(r => r.success);
  return {
    success: allSuccessful,
    method: 'emailjs',
    results,
    userEmailSent: results.find(r => r.type === 'user')?.success || false,
    opsEmailSent: results.find(r => r.type === 'ops')?.success || false
  };
}

/**
 * Generate user email template
 */
function getUserEmailTemplate(name, language) {
  const templates = {
    hinglish: `Namaste ${name || 'Sir/Madam'}! 👋

Dhanyavad aapne Anupaat Nivesh se connect kiya.

**Aapke saath kya hoga:**
✓ Humare expert advisors jald hi aapse connect karenge
✓ Personalized investment plan discuss karenge
✓ Aapke goals ke hisaab se best strategy suggest karenge

**Next Steps:**
Humara team 24-48 hours mein aapko call ya email karega.

Agar aapko koi urgent question hai, toh aap directly contact kar sakte hain:
📧 contact@anupaatnivesh.com
📱 9501195200

Aapka dhyan dene ke liye dhanyavad! 🙏

**Anupaat Nivesh Team**`,

    hindi: `नमस्ते ${name || 'सर/मैडम'}! 👋

धन्यवाद आपने Anupaat Nivesh से कनेक्ट किया।

**आपके साथ क्या होगा:**
✓ हमारे विशेषज्ञ सलाहकार जल्द ही आपसे संपर्क करेंगे
✓ व्यक्तिगत निवेश योजना पर चर्चा करेंगे
✓ आपके लक्ष्यों के अनुसार सर्वोत्तम रणनीति सुझाएंगे

**अगले कदम:**
हमारी टीम 24-48 घंटों में आपको कॉल या ईमेल करेगी।

अगर आपको कोई जरूरी सवाल है, तो आप सीधे संपर्क कर सकते हैं:
📧 contact@anupaatnivesh.com
📱 9501195200

आपका ध्यान देने के लिए धन्यवाद! 🙏

**Anupaat Nivesh Team**`,

    punjabi: `ਸਤ ਸ੍ਰੀ ਅਕਾਲ ${name || 'ਸਰ/ਮੈਡਮ'}! 👋

ਧੰਨਵਾਦ ਤੁਸੀਂ Anupaat Nivesh ਨਾਲ ਜੁੜੇ।

**ਤੁਹਾਡੇ ਨਾਲ ਕੀ ਹੋਵੇਗਾ:**
✓ ਸਾਡੇ ਮਾਹਿਰ ਸਲਾਹਕਾਰ ਜਲਦੀ ਹੀ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰਨਗੇ
✓ ਨਿੱਜੀ ਨਿਵੇਸ਼ ਯੋਜਨਾ 'ਤੇ ਚਰਚਾ ਕਰਨਗੇ
✓ ਤੁਹਾਡੇ ਟੀਚਿਆਂ ਦੇ ਅਨੁਸਾਰ ਸਭ ਤੋਂ ਵਧੀਆ ਰਣਨੀਤੀ ਸੁਝਾਉਣਗੇ

**ਅਗਲੇ ਕਦਮ:**
ਸਾਡੀ ਟੀਮ 24-48 ਘੰਟਿਆਂ ਵਿੱਚ ਤੁਹਾਨੂੰ ਕਾਲ ਜਾਂ ਈਮੇਲ ਕਰੇਗੀ।

ਜੇ ਤੁਹਾਡੇ ਕੋਲ ਕੋਈ ਜ਼ਰੂਰੀ ਸਵਾਲ ਹੈ, ਤਾਂ ਤੁਸੀਂ ਸਿੱਧੇ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ:
📧 contact@anupaatnivesh.com
📱 9501195200

ਤੁਹਾਡਾ ਧਿਆਨ ਦੇਣ ਲਈ ਧੰਨਵਾਦ! 🙏

**Anupaat Nivesh Team**`,

    english: `Hello ${name || 'Valued Customer'}! 👋

Thank you for contacting Anupaat Nivesh.

**What happens next:**
✓ Our expert advisors will connect with you shortly
✓ We'll discuss a personalized investment plan
✓ We'll suggest the best strategy based on your goals

**Next Steps:**
Our team will call or email you within 24-48 hours.

If you have any urgent questions, you can contact us directly:
📧 contact@anupaatnivesh.com
📱 9501195200

Thank you for your interest! 🙏

**Anupaat Nivesh Team**`
  };

  return templates[language] || templates.english;
}

/**
 * Generate ops team email template (legacy - kept for backward compatibility)
 */
function getOpsEmailTemplate(contactData, conversationData) {
  return getOpsLeadDataTemplate(contactData, conversationData);
}

/**
 * Generate structured sales lead data template for ops team
 * Formatted for easy lead processing and CRM entry
 */
function getOpsLeadDataTemplate(contactData, conversationData) {
  const { email, phone, name } = contactData;
  const { conversationSummary, intentType, language, messagesLength } = conversationData;

  // Parse conversation summary if it's JSON
  let summaryText = conversationSummary || 'No summary available';
  try {
    if (typeof conversationSummary === 'string' && conversationSummary.startsWith('{')) {
      const parsed = JSON.parse(conversationSummary);
      summaryText = `Topics: ${parsed.topics_discussed || 'General inquiry'}\nMessages: ${parsed.message_count || messagesLength || 0}`;
    }
  } catch (e) {
    // Keep original if parsing fails
  }

  // Format timestamp in IST
  const timestamp = new Date().toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Determine lead priority based on intent
  const leadPriority = intentType && intentType !== 'general' ? 'HIGH' : 'MEDIUM';
  const leadSource = 'Chatbot';

  return `🔔 NEW SALES LEAD - ACTION REQUIRED

═══════════════════════════════════════════════════════
📋 LEAD INFORMATION
═══════════════════════════════════════════════════════

👤 CONTACT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${email || '❌ Not provided'}
📱 Phone: ${phone || '❌ Not provided'}
👤 Name: ${name || '❌ Not provided'}

🎯 LEAD QUALIFICATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Intent: ${intentType || 'General inquiry'}
📊 Priority: ${leadPriority}
🌐 Language: ${language || 'Unknown'}
📈 Source: ${leadSource}
💬 Conversation Length: ${messagesLength || 0} messages
🕐 Timestamp: ${timestamp}

📝 CONVERSATION SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${summaryText}

═══════════════════════════════════════════════════════
✅ ACTION REQUIRED
═══════════════════════════════════════════════════════

⏰ Follow-up: Contact within 24-48 hours
📞 Priority: ${leadPriority}
📋 Next Steps:
   1. Review conversation summary
   2. Contact lead via ${email ? 'email' : phone ? 'phone' : 'available contact method'}
   3. Provide personalized investment plan
   4. Update CRM with lead status

═══════════════════════════════════════════════════════
🤖 Generated by Anupaat Nivesh Chatbot
═══════════════════════════════════════════════════════`;
}

/**
 * Setup instructions for EmailJS
 */
export const EMAILJS_SETUP_INSTRUCTIONS = `
To enable email sending via EmailJS:

1. Sign up at https://www.emailjs.com/
2. Create an email service (connect your Gmail account)
3. Create email templates:
   - Template 1: User confirmation email
   - Template 2: Ops notification email
4. Get your Service ID, Template ID, and Public Key
5. Add to .env file:
   REACT_APP_EMAILJS_SERVICE_ID=your_service_id
   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
   REACT_APP_EMAILJS_ENABLED=true

6. Install EmailJS library:
   npm install @emailjs/browser
`;

