/**
 * Booking Handler Utility
 * Handles Calendly booking completion and data extraction
 */

/**
 * Extract booking data from Calendly event
 * @param {Object} calendlyEvent - Calendly event data
 * @returns {Object} Formatted booking data
 */
export const extractBookingData = (calendlyEvent) => {
  if (!calendlyEvent) {
    return null;
  }

  return {
    calendlyEventId: calendlyEvent.id || '',
    calendlyEventUri: calendlyEvent.uri || '',
    calendlyInviteeUri: calendlyEvent.invitee_uri || '',
    eventName: calendlyEvent.event_type_name || '',
    startTime: calendlyEvent.start_time || '',
    endTime: calendlyEvent.end_time || '',
    timezone: calendlyEvent.timezone || 'Asia/Kolkata',
    location: calendlyEvent.location || '',
    status: calendlyEvent.status || 'scheduled'
  };
};

/**
 * Generate unique booking reference
 * Format: AN-CS-YYYY-MMDD-HHMM
 * @returns {string} Booking reference
 */
export const generateBookingReference = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `AN-CS-${year}-${month}${day}-${hour}${minute}-${random}`;
};

/**
 * Store booking data in sessionStorage
 * @param {Object} bookingData - Booking data to store
 */
export const storeBookingData = (bookingData) => {
  try {
    sessionStorage.setItem('consulting_session_booking', JSON.stringify(bookingData));
  } catch (error) {
    console.error('Error storing booking data:', error);
  }
};

/**
 * Retrieve booking data from sessionStorage
 * @returns {Object|null} Stored booking data or null
 */
export const getStoredBookingData = () => {
  try {
    const data = sessionStorage.getItem('consulting_session_booking');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving booking data:', error);
    return null;
  }
};

/**
 * Clear booking data from sessionStorage
 */
export const clearBookingData = () => {
  try {
    sessionStorage.removeItem('consulting_session_booking');
  } catch (error) {
    console.error('Error clearing booking data:', error);
  }
};

/**
 * Store user form data in sessionStorage
 * @param {Object} userData - User form data
 */
export const storeUserData = (userData) => {
  try {
    sessionStorage.setItem('consulting_session_user', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieve user data from sessionStorage
 * @returns {Object|null} Stored user data or null
 */
export const getStoredUserData = () => {
  try {
    const data = sessionStorage.getItem('consulting_session_user');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clear user data from sessionStorage
 */
export const clearUserData = () => {
  try {
    sessionStorage.removeItem('consulting_session_user');
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
};

/**
 * Format booking date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatBookingDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

export default {
  extractBookingData,
  generateBookingReference,
  storeBookingData,
  getStoredBookingData,
  clearBookingData,
  storeUserData,
  getStoredUserData,
  clearUserData,
  formatBookingDate
};

