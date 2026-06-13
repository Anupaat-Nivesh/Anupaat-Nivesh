/**
 * Admin Notification Service
 * Consulting session registration alerts via Resend API (EmailJS fallback).
 */

import { submitContactForm } from './contactSubmitService';

export const sendAdminRegistrationNotification = async (userData) => {
  try {
    const message = `New user registration for consulting session:

Name: ${userData.firstName} ${userData.lastName}
Email: ${userData.email}
Phone: ${userData.phone || 'Not provided'}
Age: ${userData.age || 'Not provided'}
Annual Income Range: ${userData.incomeRange || 'Not provided'}
Primary Concern: ${userData.primaryConcern || 'Not provided'}

This user has filled the consulting session form and is ready to book a time slot.`;

    await submitContactForm({
      formType: 'consulting_registration',
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      message,
      subject: 'New consulting session registration',
      sendUserConfirmation: false,
      metadata: {
        age: userData.age || '',
        incomeRange: userData.incomeRange || '',
        primaryConcern: userData.primaryConcern || '',
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendAdminRegistrationNotification,
};
