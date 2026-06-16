import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASKET_RECOMMENDATIONS, basketById } from '../../data/config/index.js';
import ElementalIcon from '../ElementalIcon';

export default function BasketRecommendationWidget({ className = '', showEyebrow = false }) {
  const [selected, setSelected] = useState(BASKET_RECOMMENDATIONS[0]?.riskProfile || 'Aggressive');
  const match = BASKET_RECOMMENDATIONS.find((r) => r.riskProfile === selected);
  const basket = match ? basketById[match.basketId] : null;
  const isFull = className.includes('an-basket-rec-widget--full');

  return (
    <section className={`an-basket-rec-widget ${className}`.trim()}>
      <header className="an-basket-rec-widget__header">
        <div className="an-basket-rec-widget__heading">
          {showEyebrow && <p className="an-basket-landing-eyebrow">Risk matcher</p>}
          <h2 className="an-basket-rec-widget__title">Match a basket to your risk</h2>
          {isFull && (
            <p className="an-basket-rec-widget__subtitle">
              Pick a profile to see the basket we designed for that risk level.
            </p>
          )}
        </div>

        <div className="an-basket-rec-widget__pills" role="tablist" aria-label="Risk profile">
          {BASKET_RECOMMENDATIONS.map((r) => (
            <button
              key={r.riskProfile}
              type="button"
              role="tab"
              aria-selected={selected === r.riskProfile}
              className={`an-basket-rec-widget__pill ${selected === r.riskProfile ? 'is-active' : ''}`}
              onClick={() => setSelected(r.riskProfile)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      {basket && (
        <div className={`an-basket-rec-widget__result an-basket-rec-widget__result--${basket.element}`}>
          <div className="an-basket-rec-widget__result-identity">
            <ElementalIcon element={basket.element} size={isFull ? 40 : 32} />
            <div>
              <strong>{basket.name}</strong>
              <span>{basket.comparison?.objective}</span>
            </div>
          </div>

          <dl className="an-basket-rec-widget__stats">
            <div>
              <dt>Expected return*</dt>
              <dd>{basket.expectedReturn}%</dd>
            </div>
            <div>
              <dt>Risk score</dt>
              <dd>{basket.comparison?.riskScoreRange}</dd>
            </div>
            <div>
              <dt>Horizon</dt>
              <dd>{basket.horizonYears}</dd>
            </div>
          </dl>

          <div className="an-basket-rec-widget__actions">
            <Link to={`/invest/basket/${basket.id}`} className="an-basket-rec-widget__cta">
              View {basket.name} analytics →
            </Link>
            {isFull && (
              <Link to="/invest/risk-profile" className="an-basket-rec-widget__secondary">
                Do Risk Profiling →
              </Link>
            )}
          </div>
        </div>
      )}

      {!isFull && (
        <p className="an-basket-rec-widget__profile-link">
          <Link to="/invest/risk-profile">Do Risk Profiling →</Link>
        </p>
      )}
    </section>
  );
}
