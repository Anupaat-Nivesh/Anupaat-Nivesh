/**
 * Payment Configuration Utility
 * Centralized configuration for Razorpay payment integration
 * All sensitive data loaded from environment variables
 */

export const paymentConfig = {
  // Razorpay Key ID (public key - safe for frontend)
  razorpayKeyId: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
  
  // Consulting session pricing (INR; Razorpay uses rupees in our API layer)
  consultingSessionPrice: parseInt(process.env.REACT_APP_CONSULTING_SESSION_PRICE || '999', 10),
  consultingSessionActualPrice: parseInt(process.env.REACT_APP_CONSULTING_SESSION_ACTUAL_PRICE || '999', 10),
  
  // Currency
  currency: 'INR',
  
  // Payment methods enabled
  paymentMethods: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: false,
    emi: false
  },
  
  // Razorpay checkout options
  checkoutOptions: {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID || '',
    amount: 0, // Will be set dynamically
    currency: 'INR',
    name: 'Anupaat Nivesh',
    description: '1-on-1 Financial Consulting Session',
    image: '/logo.webp',
    order_id: '', // Will be set from backend
    handler: null, // Will be set dynamically
    prefill: {
      name: '',
      email: '',
      contact: ''
    },
    notes: {
      service: 'consulting_session'
    },
    theme: {
      color: '#FE0101' // Brand primary color
    },
    modal: {
      ondismiss: function() {
        console.log('Payment modal closed');
      }
    }
  }
};

/**
 * Validate payment configuration
 * @returns {boolean} True if configuration is valid
 */
export const validatePaymentConfig = () => {
  if (!paymentConfig.razorpayKeyId) {
    console.warn('Razorpay Key ID not configured. Set REACT_APP_RAZORPAY_KEY_ID in .env');
    return false;
  }
  return true;
};

/**
 * Get discount percentage
 * @returns {number} Discount percentage
 */
export const getDiscountPercentage = () => {
  const actual = paymentConfig.consultingSessionActualPrice;
  const price = paymentConfig.consultingSessionPrice;
  if (!actual || actual <= price) return 0;
  const discount = actual - price;
  return Math.round((discount / actual) * 100);
};

/**
 * Format amount for Razorpay (in paise)
 * @param {number} amount - Amount in rupees
 * @returns {number} Amount in paise
 */
export const formatAmountForRazorpay = (amount) => {
  return Math.round(amount * 100);
};

/**
 * Format amount for display
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted amount string
 */
export const formatAmountForDisplay = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default paymentConfig;

