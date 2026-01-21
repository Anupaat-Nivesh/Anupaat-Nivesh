/**
 * Admin Notification Service
 * Sends notifications to admin when users register for consulting sessions
 */

import emailjs from '@emailjs/browser';
import * as config from '../components/contact/Config';

/**
 * Send admin notification when user registers for consulting session
 * @param {Object} userData - User information from form
 * @returns {Promise<Object>} EmailJS response
 */
export const sendAdminRegistrationNotification = async (userData) => {
  try {
    // Prepare email template parameters
    const templateParams = {
      user_name: `${userData.firstName} ${userData.lastName}`,
      user_email: userData.email,
      user_phone: userData.phone || 'Not provided',
      user_age: userData.age || 'Not provided',
      income_range: userData.incomeRange || 'Not provided',
      primary_concern: userData.primaryConcern || 'Not provided',
      message: `New user registration for consulting session:

Name: ${userData.firstName} ${userData.lastName}
Email: ${userData.email}
Phone: ${userData.phone || 'Not provided'}
Age: ${userData.age || 'Not provided'}
Annual Income Range: ${userData.incomeRange || 'Not provided'}
Primary Concern: ${userData.primaryConcern || 'Not provided'}

This user has filled the consulting session form and is ready to book a time slot.`,
      to_email: process.env.REACT_APP_ADMIN_EMAIL || 'info@anupaatnivesh.com',
      subject: 'New Consulting Session Registration'
    };

      // Use EmailJS to send notification
    // Use existing template - you can create a dedicated admin template later
    const response = await emailjs.send(
      config.emailJSserviceID,
      config.emailJStemplateID, // TODO: Create dedicated admin notification template
      templateParams,
      config.emailJSKey
    );

    console.log('✅ Admin notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending admin notification:', error);
    // Don't throw error - this is a background notification
    // User flow should continue even if notification fails
    return { success: false, error: error.message };
  }
};

export default {
  sendAdminRegistrationNotification
};

