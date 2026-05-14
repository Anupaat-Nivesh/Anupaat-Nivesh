/**
 * Razorpay checkout for basket unlock — uses same backend as consulting payments.
 */

import { createOrder, verifyPayment } from '../../api/paymentApi';
import { isBackendAvailable } from '../../api/config';
import paymentConfig, { formatAmountForRazorpay } from '../../utils/paymentConfig';
import { loadRazorpayScript } from '../../services/paymentService';

export async function createBasketOrder({ basket, userData }) {
  const amount = basket.price;
  const bookingReference = `BASKET_${basket.id}_${Date.now()}`;
  const bookingData = {
    bookingReference,
    amount,
    currency: 'INR',
    source: 'elemental_basket',
    basketId: basket.id,
    basketName: basket.name,
  };

  return createOrder({
    amount,
    userData,
    bookingData,
    service: 'basket_unlock',
    notes: {
      service: 'basket_unlock',
      basketId: basket.id,
      basketName: basket.name,
      bookingReference,
    },
  });
}

export async function openBasketCheckout({
  basket,
  userData,
  onSuccess,
  onFailure,
}) {
  await loadRazorpayScript();
  if (!window.Razorpay) {
    throw new Error('Razorpay failed to load');
  }

  const order = await createBasketOrder({ basket, userData });
  const amountRupees = basket.price;

  const options = {
    key: paymentConfig.razorpayKeyId,
    amount: formatAmountForRazorpay(amountRupees),
    currency: 'INR',
    name: 'Anupaat Nivesh',
    description: `Basket unlock — ${basket.symbol} ${basket.name}`,
    image: '/logo.webp',
    order_id: order.order_id,
    prefill: {
      name: [userData.firstName, userData.lastName].filter(Boolean).join(' ').trim() || userData.name || '',
      email: userData.email || '',
      contact: userData.phone || '',
    },
    notes: {
      service: 'basket_unlock',
      basketId: basket.id,
    },
    theme: { color: '#0B1F3A' },
    handler: async function handler(response) {
      try {
        if (process.env.NODE_ENV === 'development' && !isBackendAvailable()) {
          onSuccess(response);
          return;
        }
        const ok = await verifyPayment({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          userData,
          bookingData: {
            bookingReference: `BASKET_${basket.id}`,
            basketId: basket.id,
            source: 'elemental_basket',
          },
          bookingReference: `BASKET_${basket.id}`,
          amount: amountRupees,
          currency: 'INR',
          source: 'elemental_basket',
        });
        if (ok.verified) onSuccess(response);
        else onFailure(new Error('Verification failed'));
      } catch (e) {
        if (process.env.NODE_ENV === 'development' && !isBackendAvailable()) {
          onSuccess(response);
        } else {
          onFailure(e);
        }
      }
    },
    modal: {
      ondismiss() {
        if (onFailure) onFailure(new Error('Payment cancelled'));
      },
    },
  };

  const rz = new window.Razorpay(options);
  rz.open();
  return rz;
}
