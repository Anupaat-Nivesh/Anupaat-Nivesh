/**
 * Post-purchase notifications for basket unlock (Resend via backend API).
 */

import { submitContactForm } from '../../services/contactSubmitService';

export async function sendBasketPurchaseEmails({ userData, basket, paymentId }) {
  const message = `Thank you for unlocking ${basket.name} (${basket.symbol}).

Payment reference: ${paymentId || '—'}
Basket access is now active on your account.

Our team will email the detailed fund list and connect with you for AMFI onboarding and execution setup.

— Anupaat Nivesh`;

  try {
    await submitContactForm({
      formType: 'basket_unlock',
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone || '',
      message,
      subject: `Basket unlocked — ${basket.name}`,
      metadata: {
        basketId: basket.id,
        basketName: basket.name,
        paymentId: paymentId || '',
        amount: `₹${basket.price}`,
      },
    });
    return { sent: true };
  } catch (e) {
    console.warn('Basket confirmation email failed:', e);
    return { sent: false, error: e };
  }
}
