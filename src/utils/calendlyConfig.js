/**
 * Calendly Configuration Utility
 * Centralized configuration for Calendly integration
 * All sensitive data loaded from environment variables
 */

export const calendlyConfig = {
  // Calendly Event URL (public URL - safe for frontend)
  consultingUrl: process.env.REACT_APP_CALENDLY_CONSULTING_URL || 
                 process.env.REACT_APP_CALENDLY_URL || 
                 '',
  
  // Calendly API Token (for backend API calls - not used in frontend)
  // This should only be used in backend services
  apiToken: process.env.REACT_APP_CALENDLY_API_TOKEN || '',
  
  // Default event type
  defaultEventType: 'consulting_session',
  
  // Prefill options
  prefillOptions: {
    name: true,
    email: true,
    phone: true,
    customFields: true
  },
  
  // Custom field mappings for Calendly
  customFieldMappings: {
    phone: 'a1',
    age: 'a2',
    incomeRange: 'a3',
    primaryConcern: 'a4'
  },
  
  // Widget settings
  widgetSettings: {
    hideEventTypeDetails: false,
    hideLandingPageDetails: false,
    primaryColor: '#FE0101', // Brand primary color
    textColor: '#000000',
    backgroundColor: '#ffffff'
  }
};

/**
 * Validate Calendly configuration
 * @returns {boolean} True if configuration is valid
 */
export const validateCalendlyConfig = () => {
  if (!calendlyConfig.consultingUrl) {
    console.warn('Calendly URL not configured. Set REACT_APP_CALENDLY_CONSULTING_URL in .env');
    return false;
  }
  return true;
};

/**
 * Build Calendly URL with prefill parameters
 * @param {Object} userData - User data to prefill
 * @returns {string} Calendly URL with prefill parameters
 */
export const buildCalendlyUrl = (userData = null) => {
  if (!calendlyConfig.consultingUrl) {
    return '';
  }
  
  if (!userData) {
    return calendlyConfig.consultingUrl;
  }
  
  const params = new URLSearchParams();
  
  // Prefill name
  if (calendlyConfig.prefillOptions.name && userData.firstName && userData.lastName) {
    params.append('name', `${userData.firstName} ${userData.lastName}`);
  }
  
  // Prefill email
  if (calendlyConfig.prefillOptions.email && userData.email) {
    params.append('email', userData.email);
  }
  
  // Prefill custom fields
  if (calendlyConfig.prefillOptions.customFields) {
    if (userData.phone) {
      params.append(calendlyConfig.customFieldMappings.phone, userData.phone);
    }
    if (userData.age) {
      params.append(calendlyConfig.customFieldMappings.age, userData.age);
    }
    if (userData.incomeRange) {
      params.append(calendlyConfig.customFieldMappings.incomeRange, userData.incomeRange);
    }
    if (userData.primaryConcern) {
      params.append(calendlyConfig.customFieldMappings.primaryConcern, userData.primaryConcern);
    }
  }
  
  return `${calendlyConfig.consultingUrl}?${params.toString()}`;
};

/**
 * Get Calendly widget embed URL
 * @param {Object} userData - User data to prefill
 * @returns {string} Calendly embed URL
 */
export const getCalendlyEmbedUrl = (userData = null) => {
  return buildCalendlyUrl(userData);
};

/**
 * Extract booking data from Calendly event
 * @param {Object} calendlyEvent - Calendly event data from postMessage
 * @returns {Object} Formatted booking data
 */
export const extractCalendlyBookingData = (calendlyEvent) => {
  if (!calendlyEvent || !calendlyEvent.payload) {
    return null;
  }
  
  const payload = calendlyEvent.payload;
  const event = payload.event || {};
  const invitee = payload.invitee || {};
  
  return {
    calendlyEventId: event.uuid || '',
    calendlyEventUri: event.uri || '',
    calendlyInviteeUri: invitee.uri || '',
    eventName: event.name || 'Consulting Session',
    startTime: event.start_time || '',
    endTime: event.end_time || '',
    timezone: event.timezone || 'Asia/Kolkata',
    location: event.location?.location || 'Online',
    inviteeName: invitee.name || '',
    inviteeEmail: invitee.email || '',
    inviteePhone: invitee.phone_number || '',
    questionsAndAnswers: invitee.questions_and_answers || [],
    status: 'scheduled'
  };
};

export default calendlyConfig;

