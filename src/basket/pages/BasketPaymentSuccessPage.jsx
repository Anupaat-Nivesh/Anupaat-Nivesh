import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBasketUser } from '../context/BasketUserContext';

export default function BasketPaymentSuccessPage() {
  const location = useLocation();
  const basketId = location.state?.basketId;
  const paymentId = location.state?.paymentId;
  const { catalog } = useBasketUser();
  const name = catalog.find((b) => b.id === basketId)?.name || basketId?.toUpperCase();

  return (
    <section style={{ textAlign: 'center', padding: '3rem 0' }}>
      <div style={{ fontSize: '3rem' }}>✓</div>
      <h1 style={{ fontWeight: 800 }}>Payment successful</h1>
      <p className="an-muted" style={{ margin: '0 auto', maxWidth: 420 }}>
        {name ? `${name} is now unlocked` : 'Your basket is unlocked'}. Invoice and confirmations can be triggered
        from your webhook / automation layer (<code style={{ fontSize: '0.75rem' }}>payment.captured</code>).
      </p>
      {paymentId && (
        <p style={{ fontSize: '0.75rem', opacity: 0.65, marginTop: 12 }}>
          Payment ref: {paymentId}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
        <Link className="an-btn-primary" to={basketId ? `/invest/basket/${basketId}` : '/invest'}>
          View basket
        </Link>
        <Link className="an-btn-ghost" to="/invest/dashboard">
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}
