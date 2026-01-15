/**
 * Payment Service
 * Handles Razorpay payment integration
 * Note: Payment verification MUST be done on backend
 */

import paymentConfig, { formatAmountForRazorpay } from '../utils/paymentConfig';

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
 * Create Razorpay order (backend call)
 * TODO: Replace with actual backend API call
 * @param {Object} userData - User information
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} Order data with order_id
 */
export const createRazorpayOrder = async (userData, bookingData) => {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payments/create-order`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount: paymentConfig.consultingSessionPrice, userData, bookingData })
  // });
  // return await response.json();

  // Placeholder: Generate mock order ID for development
  // In production, this MUST come from backend
  const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.warn('Using mock order ID. Replace with backend API call.');
  
  return {
    order_id: mockOrderId,
    amount: formatAmountForRazorpay(paymentConfig.consultingSessionPrice),
    currency: paymentConfig.currency
  };
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
          onFailure(error);
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
 * Verify payment signature (backend call)
 * TODO: Replace with actual backend API call
 * @param {Object} paymentData - Payment data
 * @returns {Promise<boolean>} True if payment is verified
 */
export const verifyPayment = async (paymentData) => {
  // TODO: Replace with actual backend API call
  // Example: const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/payments/verify`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(paymentData)
  // });
  // const result = await response.json();
  // return result.verified === true;

  // Placeholder: For development, assume payment is verified
  // In production, this MUST verify signature on backend
  console.warn('Using mock payment verification. Replace with backend API call.');
  
  return true;
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

