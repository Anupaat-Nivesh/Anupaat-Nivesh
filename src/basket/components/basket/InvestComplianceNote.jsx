import React from 'react';
import { BASKET_UNLOCK_PRICE } from '../../data/baskets';

export default function InvestComplianceNote() {
  return (
    <aside className="an-invest-disclaimer" role="note">
      <div className="an-invest-disclaimer__icon" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 8v5m0 3h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="an-invest-disclaimer__body">
        <p className="an-invest-disclaimer__title">Important information</p>
        <p>
          Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before
          investing.
        </p>
        <p>
          <strong>Mutual fund baskets</strong> are offered on a direct-plan unlock model (₹
          {BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} one-time fee per basket via Razorpay).
          <strong> Regular funds</strong> may be invested through your distributor relationship — we earn AMC
          commission; no separate platform fee for research on this site.
        </p>
      </div>
    </aside>
  );
}
