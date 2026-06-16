import React from 'react';
import LeadForm from './LeadForm';
import { BASKET_UNLOCK_PRICE } from '../../basket/data/baskets';
import './HomeLeadCapture.css';

/** Homepage lead capture — simplified messaging, placed before Contact. */
export default function HomeLeadCapture() {
  return (
    <section className="home-lead-capture section__padding" aria-labelledby="home-lead-heading">
      <div className="home-lead-capture__inner">
        <div className="home-lead-capture__copy">
          <p className="home-lead-capture__eyebrow">Free consultation</p>
          <h2 id="home-lead-heading" className="home-lead-capture__title">
            Talk to an advisor
          </h2>
          <p className="home-lead-capture__subtitle">
            Share your goal and contact details — we&apos;ll call back within one business day with
            next steps for mutual funds, SIPs, or basket portfolios.
          </p>
          <ul className="home-lead-capture__points">
            <li>AMFI-registered mutual fund distributor</li>
            <li>Goal-based planning — no stock tips</li>
            <li>FIRE · WATER · EARTH baskets from ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')}</li>
          </ul>
        </div>
        <LeadForm
          compact
          formType="consultation"
          source="homepage"
          submitLabel="Request a callback"
        />
      </div>
    </section>
  );
}
