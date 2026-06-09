/**
 * Post-purchase notifications for basket unlock (best-effort via EmailJS).
 */

import emailjs from '@emailjs/browser';
import * as config from '../../components/contact/Config';

export async function sendBasketPurchaseEmails({ userData, basket, paymentId }) {
  const name = [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim() || 'Investor';
  const message = `Thank you for unlocking ${basket.name} (${basket.symbol}).

Payment reference: ${paymentId || '—'}
Basket access is now active on your account.

Our team will email the detailed fund list and connect with you for AMFI onboarding and execution setup.

— Anupaat Nivesh`;

  try {
    await emailjs.send(
      config.emailJSserviceID,
      config.emailJStemplateID,
      {
        user_name: name,
        user_email: userData.email,
        user_phone: userData.phone || '',
        booking_reference: `BASKET_${basket.id}`,
        payment_amount: `₹${basket.price}`,
        payment_id: paymentId || '',
        service_type: `Mutual Fund Basket — ${basket.name}`,
        message,
      },
      config.emailJSKey
    );
    return { sent: true };
  } catch (e) {
    console.warn('Basket confirmation email failed:', e);
    return { sent: false, error: e };
  }
}
