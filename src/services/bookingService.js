/**
 * Booking Service
 * Handles booking storage and retrieval
 * TODO: Replace with actual backend API calls
 */

/**
 * Save booking to backend
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise<Object>} Saved booking with booking_id
 */
export const saveBooking = async (bookingData) => {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bookings`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(bookingData)
  // });
  // return await response.json();

  // Placeholder: Generate mock booking ID for development
  const mockBookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.warn('Using mock booking storage. Replace with backend API call.');
  
  return {
    booking_id: mockBookingId,
    booking_reference: bookingData.bookingReference || `AN-CS-${Date.now()}`,
    status: 'confirmed',
    ...bookingData
  };
};

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking data
 */
export const getBooking = async (bookingId) => {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/${bookingId}`);
  // return await response.json();

  console.warn('Using mock booking retrieval. Replace with backend API call.');
  
  return {
    booking_id: bookingId,
    status: 'confirmed',
    message: 'Mock booking data - replace with backend API'
  };
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/${bookingId}/status`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status })
  // });
  // return await response.json();

  console.warn('Using mock booking status update. Replace with backend API call.');
  
  return {
    booking_id: bookingId,
    status,
    updated_at: new Date().toISOString()
  };
};

/**
 * Save complete booking with payment
 * Combines user data, booking data, and payment data
 * @param {Object} data - Complete booking data
 * @returns {Promise<Object>} Saved booking
 */
export const saveCompleteBooking = async (data) => {
  const bookingData = {
    bookingReference: data.bookingReference,
    userData: {
      firstName: data.userData.firstName,
      lastName: data.userData.lastName,
      email: data.userData.email,
      phone: data.userData.phone,
      age: data.userData.age,
      incomeRange: data.userData.incomeRange,
      primaryConcern: data.userData.primaryConcern
    },
    bookingData: {
      calendlyEventId: data.bookingData.calendlyEventId,
      calendlyEventUri: data.bookingData.calendlyEventUri,
      startTime: data.bookingData.startTime,
      endTime: data.bookingData.endTime,
      timezone: data.bookingData.timezone,
      location: data.bookingData.location
    },
    paymentData: {
      paymentId: data.paymentData.paymentId,
      orderId: data.paymentData.orderId,
      amount: data.paymentData.amount,
      currency: data.paymentData.currency,
      status: 'captured',
      timestamp: data.paymentData.timestamp
    },
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  return await saveBooking(bookingData);
};

export default {
  saveBooking,
  getBooking,
  updateBookingStatus,
  saveCompleteBooking
};

