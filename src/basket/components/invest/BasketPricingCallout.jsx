import React from 'react';
import { Link } from 'react-router-dom';
import { BASKET_UNLOCK_PRICE } from '../../data/baskets';

/** Compact pricing — per-basket unlock (no regular vs direct comparison). */
export default function BasketPricingCallout({ basketsHref = '#baskets' }) {
  return (
    <aside className="an-basket-pricing-callout">
      <div>
        <p className="an-basket-pricing-callout__eyebrow">Simple pricing</p>
        <p className="an-basket-pricing-callout__price">
          ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')}
          <span> per basket</span>
        </p>
        <p className="an-sb-muted">
          One-time unlock via Razorpay — full holdings, email delivery, and team onboarding for
          FIRE, WATER, or EARTH.
        </p>
      </div>
      <Link to={basketsHref} className="an-btn-primary">
        Choose a basket
      </Link>
    </aside>
  );
}
