/**
 * Environment Variables Check Utility
 * Helps diagnose environment variable loading issues
 */

export const checkEnvVars = () => {
  const envVars = {
    REACT_APP_WHATSAPP_NUMBER: process.env.REACT_APP_WHATSAPP_NUMBER,
    REACT_APP_RAZORPAY_KEY_ID: process.env.REACT_APP_RAZORPAY_KEY_ID,
    REACT_APP_CALENDLY_CONSULTING_URL: process.env.REACT_APP_CALENDLY_CONSULTING_URL,
    REACT_APP_CALENDLY_URL: process.env.REACT_APP_CALENDLY_URL,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
  };

  console.group('🔍 Environment Variables Check');
  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}:`, value.substring(0, 50) + (value.length > 50 ? '...' : ''));
    } else {
      console.warn(`❌ ${key}: Not set`);
    }
  });
  console.groupEnd();

  return envVars;
};

export default checkEnvVars;

