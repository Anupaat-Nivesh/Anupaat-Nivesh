/**
 * Notification Service
 * Handles email, WhatsApp, and admin notifications
 */

import emailjs from '@emailjs/browser';
import * as config from '../components/contact/Config';

/**
 * Send email confirmation for consulting session booking
 * @param {Object} data - Booking and payment data
 * @returns {Promise<Object>} EmailJS response
 */
export const sendEmailConfirmation = async (data) => {
  try {
    // TODO: Create a new EmailJS template for consulting session confirmations
    // For now, use existing template with custom message
    
    const templateParams = {
      user_name: `${data.userData.firstName} ${data.userData.lastName}`,
      user_email: data.userData.email,
      user_phone: data.userData.phone,
      booking_reference: data.bookingReference,
      booking_date: data.bookingData.startTime || 'To be scheduled',
      payment_amount: `₹${data.paymentData.amount}`,
      payment_id: data.paymentData.paymentId,
      service_type: '1-on-1 Financial Consulting Session',
      message: `Thank you for booking a consulting session with Anupaat Nivesh!

Booking Reference: ${data.bookingReference}
Session Date: ${data.bookingData.startTime || 'To be scheduled'}
Amount Paid: ₹${data.paymentData.amount}

We look forward to helping you achieve your financial goals!`
    };

    // Use existing EmailJS service
    const response = await emailjs.send(
      config.emailJSserviceID,
      config.emailJStemplateID, // TODO: Create dedicated template for consulting sessions
      templateParams,
      config.emailJSKey
    );

    return response;
  } catch (error) {
    console.error('Error sending email confirmation:', error);
    throw error;
  }
};

/**
 * Send WhatsApp confirmation (placeholder)
 * TODO: Integrate with WhatsApp Business API
 * @param {string} phone - Phone number
 * @param {Object} bookingData - Booking data
 * @returns {Promise<boolean>} Success status
 */
export const sendWhatsAppConfirmation = async (phone, bookingData) => {
  // TODO: Implement WhatsApp Business API integration
  // For now, return success placeholder
  
  console.log('WhatsApp confirmation placeholder:', {
    phone,
    bookingReference: bookingData.bookingReference,
    message: `Your consulting session is confirmed! Reference: ${bookingData.bookingReference}`
  });

  // Placeholder: In production, this would call WhatsApp Business API
  // Example: await fetch('https://api.whatsapp.com/send', { ... });
  
  return true;
};

/**
 * Send admin notification (placeholder)
 * TODO: Integrate with admin notification system
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise<boolean>} Success status
 */
export const sendAdminNotification = async (bookingData) => {
  // TODO: Implement admin notification system
  // Could use EmailJS ops template, Slack webhook, or custom API
  
  console.log('Admin notification placeholder:', {
    bookingReference: bookingData.bookingReference,
    userEmail: bookingData.userData.email,
    amount: bookingData.paymentData.amount
  });

  // Placeholder: In production, this would notify admin team
  // Example: await emailjs.send(config.emailJSserviceID, config.emailJSOpsTemplateID, ...);
  
  return true;
};

/**
 * Send all notifications after successful booking
 * @param {Object} bookingData - Complete booking data
 * @returns {Promise<Object>} Notification results
 */
export const sendAllNotifications = async (bookingData) => {
  const results = {
    email: false,
    whatsapp: false,
    admin: false,
    errors: []
  };

  try {
    // Send email confirmation
    await sendEmailConfirmation(bookingData);
    results.email = true;
  } catch (error) {
    results.errors.push({ type: 'email', error: error.message });
  }

  try {
    // Send WhatsApp confirmation
    results.whatsapp = await sendWhatsAppConfirmation(bookingData.userData.phone, bookingData);
  } catch (error) {
    results.errors.push({ type: 'whatsapp', error: error.message });
  }

  try {
    // Send admin notification
    results.admin = await sendAdminNotification(bookingData);
  } catch (error) {
    results.errors.push({ type: 'admin', error: error.message });
  }

  return results;
};

export default {
  sendEmailConfirmation,
  sendWhatsAppConfirmation,
  sendAdminNotification,
  sendAllNotifications
};

