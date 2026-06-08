import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBasketUser } from '../context/BasketUserContext';
import { getBasketById } from '../data/baskets';
import { sendBasketPurchaseEmails } from '../services/basketNotify';
import InvestSubNav from '../components/InvestSubNav';
import '../styles/basket-screener.css';
import '../styles/basket-detail.css';

export default function BasketPaymentSuccessPage() {
  const location = useLocation();
  const basketId = location.state?.basketId;
  const paymentId = location.state?.paymentId;
  const { catalog, user } = useBasketUser();
  const basket = basketId ? getBasketById(catalog, basketId) : null;
  const name = basket?.name || basketId?.toUpperCase();

  useEffect(() => {
    if (!basket || !user?.email) return;
    sendBasketPurchaseEmails({
      userData: user,
      basket,
      paymentId,
    }).catch(() => {});
  }, [basket, user, paymentId]);

  return (
    <div className="an-invest-sharp">
      <InvestSubNav />
      <section className="an-payment-success" style={{ textAlign: 'center', padding: '2.5rem 0 3rem' }}>
        <div className="an-payment-success__icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="an-sb-page-title" style={{ marginTop: '0.5rem' }}>
          Payment successful
        </h1>
        <p className="an-sb-muted an-payment-success__copy">
          {name ? (
            <>
              <strong>{name}</strong> is unlocked.
            </>
          ) : (
            'Your basket is unlocked.'
          )}{' '}
          We will email the detailed fund list to <strong>{user?.email || 'your registered email'}</strong>. Our advisory
          team will reach out within 1–2 business days for AMFI onboarding and execution setup.
        </p>
        {paymentId && (
          <p className="an-fund-mono an-payment-success__ref">Payment ref: {paymentId}</p>
        )}
        <ul className="an-success-steps">
          <li>Confirmation email with basket holdings (best-effort via EmailJS)</li>
          <li>Team call for KYC / platform linking</li>
          <li>Start SIP or lumpsum as per basket mandate</li>
        </ul>
        <div className="an-payment-success__actions">
          <Link className="an-btn-primary" to={basketId ? `/invest/basket/${basketId}` : '/invest/baskets'}>
            View basket
          </Link>
        <Link className="an-btn-ghost" to="/invest/baskets">
          View all baskets
        </Link>
        </div>
      </section>
    </div>
  );
}
