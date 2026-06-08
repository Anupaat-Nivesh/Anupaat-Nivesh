import React from 'react';
import { FiLock } from 'react-icons/fi';

export default function BasketLockedHoldings({ basket, paid, onUnlock }) {
  const count = basket.fundCount || basket.funds?.length || 6;

  if (paid) {
    return (
      <section id="basket-holdings" className="an-basket-holdings an-basket-holdings--unlocked">
        <h2 className="an-card-heading">Underlying portfolio</h2>
        <p className="an-sb-muted">Exact allocations unlocked — invest via direct plans with our onboarding support.</p>
        <ul className="an-basket-holdings__list">
          {(basket.funds || []).map((f) => (
            <li key={f.scheme}>
              <span>{f.scheme}</span>
              <strong>{f.pct}%</strong>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section id="basket-holdings" className="an-basket-holdings an-basket-holdings--locked">
      <div className="an-basket-holdings__lock-icon" aria-hidden="true">
        <FiLock size={28} />
      </div>
      <h2 className="an-card-heading">Underlying portfolio</h2>
      <p className="an-basket-holdings__teaser">
        {count} professionally curated mutual funds
      </p>
      <p className="an-sb-muted">Exact fund names and weights available after purchase.</p>
      <button type="button" className="an-basket-holdings__cta" onClick={onUnlock}>
        Unlock {basket.name} · ₹{basket.price.toLocaleString('en-IN')}
      </button>
    </section>
  );
}
