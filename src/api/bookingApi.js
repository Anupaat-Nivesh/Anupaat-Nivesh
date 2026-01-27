/**
 * Booking API
 * Handles all booking-related API calls to backend
 */

import { apiPost, apiGet, apiPut } from './client';
import { API_ENDPOINTS } from './config';

/**
 * Create booking via backend
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise<Object>} Created booking with booking_id
 */
export const createBooking = async (bookingData) => {
  const response = await apiPost(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);

  return {
    booking_id: response.booking_id || response.id,
    booking_reference: response.booking_reference || bookingData.bookingReference,
    status: response.status || 'confirmed',
    ...response
  };
};

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking data
 */
export const getBooking = async (bookingId) => {
  const response = await apiGet(
    API_ENDPOINTS.BOOKINGS.GET.replace(':bookingId', bookingId)
  );

  return response;
};

/**
 * Get booking by reference
 * @param {string} reference - Booking reference
 * @returns {Promise<Object>} Booking data
 */
export const getBookingByReference = async (reference) => {
  const response = await apiGet(
    API_ENDPOINTS.BOOKINGS.GET_BY_REFERENCE.replace(':reference', reference)
  );

  return response;
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await apiPut(
    API_ENDPOINTS.BOOKINGS.UPDATE_STATUS.replace(':bookingId', bookingId),
    { status }
  );

  return response;
};

/**
 * Save complete booking with payment
 * @param {Object} data - Complete booking data with payment
 * @returns {Promise<Object>} Saved booking
 */
export const saveCompleteBooking = async (data) => {
  const bookingPayload = {
    bookingReference: data.bookingReference,
    userData: {
      firstName: data.userData.firstName,
      lastName: data.userData.lastName,
      email: data.userData.email,
      phone: data.userData.phone,
      age: data.userData.age,
      incomeRange: data.userData.incomeRange,
      primaryConcern: data.userData.primaryConcern,
      source: data.userData.source || data.source // Include source from userData or top level
    },
    bookingData: {
      calendlyEventId: data.bookingData?.calendlyEventId,
      calendlyEventUri: data.bookingData?.calendlyEventUri,
      calendlyInviteeUri: data.bookingData?.calendlyInviteeUri,
      startTime: data.bookingData?.startTime,
      endTime: data.bookingData?.endTime,
      timezone: data.bookingData?.timezone,
      location: data.bookingData?.location,
      eventName: data.bookingData?.eventName || 'Consulting Session',
      bookingReference: data.bookingReference,
      source: data.bookingData?.source || data.source // Include source
    },
    paymentData: {
      paymentId: data.paymentData.paymentId,
      orderId: data.paymentData.orderId,
      signature: data.paymentData.signature,
      amount: data.paymentData.amount,
      currency: data.paymentData.currency,
      status: 'captured',
      timestamp: data.paymentData.timestamp
    },
    source: data.source || data.userData?.source || data.bookingData?.source || 'N/A', // Top-level source
    status: 'confirmed'
  };

  return await createBooking(bookingPayload);
};

export default {
  createBooking,
  getBooking,
  getBookingByReference,
  updateBookingStatus,
  saveCompleteBooking
};

