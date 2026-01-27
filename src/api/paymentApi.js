/**
 * Payment API
 * Handles all payment-related API calls to backend
 */

import { apiPost, apiGet } from './client';
import { API_ENDPOINTS } from './config';

/**
 * Create Razorpay order via backend
 * @param {Object} data - Order creation data
 * @param {number} data.amount - Amount in rupees
 * @param {Object} data.userData - User information
 * @param {Object} data.bookingData - Booking information
 * @returns {Promise<Object>} Order data with order_id
 */
export const createOrder = async (data) => {
  const response = await apiPost(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
    amount: data.amount,
    currency: 'INR',
    userData: data.userData,
    bookingData: data.bookingData,
    notes: {
      service: 'consulting_session',
      bookingReference: data.bookingData?.bookingReference
    }
  });

  return {
    order_id: response.order_id || response.id,
    amount: response.amount,
    currency: response.currency || 'INR',
    ...response
  };
};

/**
 * Verify payment signature via backend
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.paymentId - Razorpay payment ID
 * @param {string} paymentData.orderId - Razorpay order ID
 * @param {string} paymentData.signature - Payment signature
 * @param {Object} paymentData.userData - User information
 * @param {Object} paymentData.bookingData - Booking information
 * @returns {Promise<Object>} Verification result
 */
export const verifyPayment = async (paymentData) => {
  const response = await apiPost(API_ENDPOINTS.PAYMENTS.VERIFY, {
    payment_id: paymentData.paymentId,
    order_id: paymentData.orderId,
    signature: paymentData.signature,
    userData: paymentData.userData,
    bookingData: paymentData.bookingData,
    bookingReference: paymentData.bookingReference,
    amount: paymentData.amount,
    currency: paymentData.currency || 'INR',
    source: paymentData.source || paymentData.userData?.source || paymentData.bookingData?.source
  });

  return {
    verified: response.verified === true || response.success === true,
    paymentData: response.paymentData || response,
    ...response
  };
};

/**
 * Get order details
 * @param {string} orderId - Razorpay order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrder = async (orderId) => {
  const response = await apiGet(
    API_ENDPOINTS.PAYMENTS.GET_ORDER.replace(':orderId', orderId)
  );

  return response;
};

export default {
  createOrder,
  verifyPayment,
  getOrder
};

