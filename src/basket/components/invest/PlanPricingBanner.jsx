import React from 'react';
import { Link } from 'react-router-dom';
import { BASKET_PRODUCT_NAME, BASKET_UNLOCK_PRICE } from '../../data/baskets';

/**
 * Regular vs Direct — shown on basket pages only.
 */
export default function PlanPricingBanner({ basketsHref = '#baskets' }) {
  return (
    <div className="an-plan-pricing an-plan-pricing--baskets">
      <article className="an-plan-card an-plan-card--regular">
        <div className="an-plan-card__head">
          <h3>Regular plan</h3>
          <p className="an-plan-card__price">₹0 platform fee</p>
        </div>
        <p className="an-plan-card__note">
          Invest in regular mutual funds through your distributor relationship. We earn commission from AMCs —{' '}
          <strong>no separate charge</strong> from you for research on this site.
        </p>
        <ul className="an-plan-card__features">
          <li>Free fund discovery &amp; comparison</li>
          <li>Execution via ARN / existing RM process</li>
        </ul>
        <div className="an-plan-card__footer">
          <Link to="/consulting-session" className="btn an-plan-card__btn">
            Book consultation
          </Link>
          <p className="an-plan-card__cta-hint">Free introductory session</p>
        </div>
      </article>

      <article className="an-plan-card an-plan-card--direct">
        <div className="an-plan-card__head">
          <h3>
            Direct plan
            <span className="an-plan-badge">{BASKET_PRODUCT_NAME}</span>
          </h3>
          <p className="an-plan-card__price">₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} per basket</p>
        </div>
        <p className="an-plan-card__note">
          Direct plans have lower expense ratios. <strong>{BASKET_PRODUCT_NAME}</strong> (FIRE · WATER · EARTH) are curated
          direct portfolios — unlock once via Razorpay to see full holdings, receive fund details by email, and get
          onboarding support from our team.
        </p>
        <ul className="an-plan-card__features">
          <li>One-time basket fee per portfolio</li>
          <li>Holdings + research unlocked after payment</li>
          <li>Team call for KYC &amp; platform linking</li>
        </ul>
        <div className="an-plan-card__footer">
          <Link to={basketsHref} className="btn an-plan-card__btn">
            Choose our baskets
          </Link>
          <p className="an-plan-card__cta-hint">
            FIRE · WATER · EARTH — ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} one-time unlock
          </p>
        </div>
      </article>
    </div>
  );
}
