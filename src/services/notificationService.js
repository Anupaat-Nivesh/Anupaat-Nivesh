/**
 * Notification Service
 * Booking confirmations via Resend API (EmailJS fallback when API not configured).
 */

import { submitContactForm } from './contactSubmitService';

export const sendEmailConfirmation = async (data) => {
  const message = `Thank you for booking a consulting session with Anupaat Nivesh!

Booking Reference: ${data.bookingReference}
Session Date: ${data.bookingData.startTime || 'To be scheduled'}
Amount Paid: ₹${data.paymentData.amount}
Payment ID: ${data.paymentData.paymentId || '—'}

We look forward to helping you achieve your financial goals!`;

  await submitContactForm({
    formType: 'booking_confirmation',
    firstName: data.userData.firstName,
    lastName: data.userData.lastName,
    email: data.userData.email,
    phone: data.userData.phone || '',
    message,
    subject: `Consulting session confirmed — ${data.bookingReference}`,
    metadata: {
      bookingReference: data.bookingReference,
      paymentId: data.paymentData.paymentId || '',
      amount: `₹${data.paymentData.amount}`,
    },
  });
};

export const sendWhatsAppConfirmation = async (phone, bookingData) => {
  console.log('WhatsApp confirmation placeholder:', {
    phone,
    bookingReference: bookingData.bookingReference,
  });
  return true;
};

export const sendAdminNotification = async (bookingData) => {
  const message = `New paid consulting session booking:

Reference: ${bookingData.bookingReference}
User: ${bookingData.userData.firstName} ${bookingData.userData.lastName}
Email: ${bookingData.userData.email}
Phone: ${bookingData.userData.phone || '—'}
Amount: ₹${bookingData.paymentData.amount}`;

  await submitContactForm({
    formType: 'consulting_registration',
    firstName: bookingData.userData.firstName,
    lastName: bookingData.userData.lastName,
    email: bookingData.userData.email,
    phone: bookingData.userData.phone || '',
    message,
    subject: `New booking — ${bookingData.bookingReference}`,
    sendUserConfirmation: false,
    metadata: {
      bookingReference: bookingData.bookingReference,
      amount: `₹${bookingData.paymentData.amount}`,
    },
  });
  return true;
};

export const sendAllNotifications = async (bookingData) => {
  const results = {
    email: false,
    whatsapp: false,
    admin: false,
    errors: [],
  };

  try {
    await sendEmailConfirmation(bookingData);
    results.email = true;
  } catch (error) {
    results.errors.push({ type: 'email', error: error.message });
  }

  try {
    results.whatsapp = await sendWhatsAppConfirmation(bookingData.userData.phone, bookingData);
  } catch (error) {
    results.errors.push({ type: 'whatsapp', error: error.message });
  }

  try {
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
  sendAllNotifications,
};
