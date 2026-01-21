/**
 * Payment Service
 * Handles Razorpay payment integration
 * Architecture: Frontend handles UI, Backend handles payment operations
 */

import paymentConfig, { formatAmountForRazorpay } from '../utils/paymentConfig';
import { createOrder as apiCreateOrder, verifyPayment as apiVerifyPayment } from '../api/paymentApi';
import { isBackendAvailable } from '../api/config';

/**
 * Load Razorpay script dynamically
 * @returns {Promise} Promise that resolves when script is loaded
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order via backend API
 * Falls back to mock mode in development if backend is not available
 * @param {Object} userData - User information
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Order data with order_id
 */
export const createRazorpayOrder = async (userData, bookingData) => {
  // Use backend API if available
  if (isBackendAvailable()) {
    try {
      const orderData = await apiCreateOrder({
        amount: paymentConfig.consultingSessionPrice,
        userData,
        bookingData
      });
      return orderData;
    } catch (error) {
      console.error('Failed to create order via backend:', error);
      // In production, throw error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Failed to create payment order. Please try again.');
      }
      // In development, fall back to mock mode
      console.warn('Falling back to mock order creation (development mode)');
    }
  }

  // Development mode: Without backend, we cannot create real Razorpay orders
  // Razorpay requires server-side order creation for security
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Development Mode: Backend API not configured.');
    console.warn('⚠️ Payment testing requires a backend server to create Razorpay orders.');
    console.warn('⚠️ Set REACT_APP_API_BASE_URL to your backend URL, or use Razorpay test mode with a test backend.');
    
    // Return a placeholder that will fail gracefully
    // This allows the UI to show the error to the user
    throw new Error(
      'Payment processing requires a backend server. ' +
      'Please configure REACT_APP_API_BASE_URL in .env file and start your backend server. ' +
      'For testing, you can use Razorpay test mode with a test backend.'
    );
  }

  // Production mode: Backend is required
  throw new Error('Backend API is required for payment processing. Please configure REACT_APP_API_BASE_URL.');
};

/**
 * Initialize Razorpay checkout
 * @param {Object} options - Checkout options
 * @param {string} options.orderId - Razorpay order ID
 * @param {Object} options.userData - User information
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 * @returns {Promise<Object>} Razorpay instance
 */
export const initializeRazorpayCheckout = async ({
  orderId,
  userData,
  onSuccess,
  onFailure
}) => {
  try {
    // Load Razorpay script
    await loadRazorpayScript();

    if (!window.Razorpay) {
      throw new Error('Razorpay script not loaded');
    }

    // Prepare checkout options
    const options = {
      ...paymentConfig.checkoutOptions,
      key: paymentConfig.razorpayKeyId,
      amount: formatAmountForRazorpay(paymentConfig.consultingSessionPrice),
      order_id: orderId,
      prefill: {
        name: `${userData.firstName} ${userData.lastName}`.trim(),
        email: userData.email || '',
        contact: userData.phone || ''
      },
      handler: async function(response) {
        // Payment successful - verify on backend
        try {
          // In development mode without backend, skip verification
          if (process.env.NODE_ENV === 'development' && !isBackendAvailable()) {
            console.warn('⚠️ Development Mode: Skipping payment verification. Backend not available.');
            onSuccess(response);
            return;
          }

          const verified = await verifyPayment({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            userData,
            bookingData: userData.bookingData || {}
          });

          if (verified) {
            onSuccess(response);
          } else {
            onFailure(new Error('Payment verification failed'));
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          // In development, allow payment to proceed even if verification fails
          if (process.env.NODE_ENV === 'development' && !isBackendAvailable()) {
            console.warn('⚠️ Development Mode: Payment verification failed, but allowing to proceed.');
            onSuccess(response);
          } else {
          onFailure(error);
          }
        }
      },
      modal: {
        ondismiss: function() {
          if (onFailure) {
            onFailure(new Error('Payment cancelled by user'));
          }
        }
      }
    };

    // Initialize Razorpay
    const razorpay = new window.Razorpay(options);
    
    // Open checkout
    razorpay.open();

    return razorpay;
  } catch (error) {
    console.error('Error initializing Razorpay:', error);
    throw error;
  }
};

/**
 * Verify payment signature via backend API
 * Falls back to mock mode in development if backend is not available
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} True if payment is verified
 */
export const verifyPayment = async (paymentData) => {
  // Use backend API if available
  if (isBackendAvailable()) {
    try {
      const result = await apiVerifyPayment(paymentData);
      return result.verified === true;
    } catch (error) {
      console.error('Failed to verify payment via backend:', error);
      // In production, throw error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Payment verification failed. Please contact support.');
      }
      // In development, fall back to mock mode
      console.warn('Falling back to mock payment verification (development mode)');
    }
  }

  // Development mode: Mock verification
  // This should only be used when backend is not available in development
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Development Mode: Using mock payment verification. Backend API not configured.');
  return true;
  }

  // Production mode: Backend is required
  throw new Error('Backend API is required for payment verification. Please configure REACT_APP_API_BASE_URL.');
};

/**
 * Handle payment success
 * @param {Object} paymentResponse - Razorpay payment response
 * @param {Object} userData - User information
 * @param {Object} bookingData - Booking information
 * @returns {Object} Payment success data
 */
export const handlePaymentSuccess = (paymentResponse, userData, bookingData) => {
  return {
    paymentId: paymentResponse.razorpay_payment_id,
    orderId: paymentResponse.razorpay_order_id,
    signature: paymentResponse.razorpay_signature,
    amount: paymentConfig.consultingSessionPrice,
    currency: paymentConfig.currency,
    timestamp: new Date().toISOString(),
    userData,
    bookingData
  };
};

/**
 * Handle payment failure
 * @param {Error} error - Error object
 * @returns {Object} Payment failure data
 */
export const handlePaymentFailure = (error) => {
  return {
    error: error.message || 'Payment failed',
    timestamp: new Date().toISOString()
  };
};

export default {
  loadRazorpayScript,
  createRazorpayOrder,
  initializeRazorpayCheckout,
  verifyPayment,
  handlePaymentSuccess,
  handlePaymentFailure
};

