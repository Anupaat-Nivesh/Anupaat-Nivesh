import React from 'react';

const STEPS = [
  { id: 1, label: 'Tap a basket', hint: 'Choose FIRE, WATER, or EARTH' },
  { id: 2, label: 'Review allocation', hint: 'See strategy & risk profile' },
  { id: 3, label: 'Enter details', hint: 'Name, email & mobile' },
  { id: 4, label: 'Pay with Razorpay', hint: 'Secure one-time unlock' },
  { id: 5, label: 'Unlock holdings', hint: 'Email + team onboarding' },
];

export default function BasketUnlockFlow() {
  return (
    <div className="an-basket-flow" aria-label="How to unlock a basket">
      <p className="an-basket-flow__eyebrow">How it works</p>
      <ol className="an-basket-flow__list">
        {STEPS.map((step, index) => (
          <li key={step.id} className="an-basket-flow__step">
            <div className="an-basket-flow__marker">
              <span className="an-basket-flow__num">{step.id}</span>
            </div>
            {index < STEPS.length - 1 && <span className="an-basket-flow__connector" aria-hidden="true" />}
            <div className="an-basket-flow__content">
              <span className="an-basket-flow__label">{step.label}</span>
              <span className="an-basket-flow__hint">{step.hint}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
