/**
 * Booking Service
 * Handles booking storage and retrieval
 * Architecture: Frontend makes API calls to backend
 */

import { createBooking as apiCreateBooking, getBooking as apiGetBooking, updateBookingStatus as apiUpdateBookingStatus, saveCompleteBooking as apiSaveCompleteBooking } from '../api/bookingApi';
import { isBackendAvailable } from '../api/config';

/**
 * Save booking to backend
 * Falls back to mock mode in development if backend is not available
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise<Object>} Saved booking with booking_id
 */
export const saveBooking = async (bookingData) => {
  // Use backend API if available
  if (isBackendAvailable()) {
    try {
      return await apiCreateBooking(bookingData);
    } catch (error) {
      console.error('Failed to save booking via backend:', error);
      // In production, throw error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to save booking. Please try again.');
      }
      // In development, fall back to mock mode
      console.warn('Falling back to mock booking storage (development mode)');
    }
  }

  // Development mode: Generate mock booking ID
  // This should only be used when backend is not available in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Development Mode: Using mock booking storage. Backend API not configured.');
    const mockBookingId = `booking_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    booking_id: mockBookingId,
    booking_reference: bookingData.bookingReference || `AN-CS-${Date.now()}`,
    status: 'confirmed',
    ...bookingData
  };
  }

  // Production mode: Backend is required
  throw new Error('Backend API is required for booking storage. Please configure REACT_APP_API_BASE_URL.');
};

/**
 * Get booking by ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking data
 */
export const getBooking = async (bookingId) => {
  if (isBackendAvailable()) {
    try {
      return await apiGetBooking(bookingId);
    } catch (error) {
      console.error('Failed to get booking via backend:', error);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  // Development mode: Mock response
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Development Mode: Using mock booking retrieval.');
  return {
    booking_id: bookingId,
    status: 'confirmed',
      message: 'Mock booking data - Backend API not configured'
  };
  }

  throw new Error('Backend API is required. Please configure REACT_APP_API_BASE_URL.');
};

/**
 * Update booking status
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated booking
 */
export const updateBookingStatus = async (bookingId, status) => {
  if (isBackendAvailable()) {
    try {
      return await apiUpdateBookingStatus(bookingId, status);
    } catch (error) {
      console.error('Failed to update booking status via backend:', error);
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  // Development mode: Mock response
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Development Mode: Using mock booking status update.');
  return {
    booking_id: bookingId,
    status,
    updated_at: new Date().toISOString()
  };
  }

  throw new Error('Backend API is required. Please configure REACT_APP_API_BASE_URL.');
};

/**
 * Save complete booking with payment
 * Combines user data, booking data, and payment data
 * @param {Object} data - Complete booking data
 * @returns {Promise<Object>} Saved booking
 */
export const saveCompleteBooking = async (data) => {
  // Use backend API if available
  if (isBackendAvailable()) {
    try {
      return await apiSaveCompleteBooking(data);
    } catch (error) {
      console.error('Failed to save complete booking via backend:', error);
      // In production, throw error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to save booking. Please contact support.');
      }
      // In development, fall back to mock mode
      console.warn('Falling back to mock booking storage (development mode)');
    }
  }

  // Development mode: Use local saveBooking function
  if (process.env.NODE_ENV === 'development') {
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
  }

  // Production mode: Backend is required
  throw new Error('Backend API is required for booking storage. Please configure REACT_APP_API_BASE_URL.');
};

export default {
  saveBooking,
  getBooking,
  updateBookingStatus,
  saveCompleteBooking
};

