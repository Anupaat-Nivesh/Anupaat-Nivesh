import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BASKET_RECOMMENDATIONS, basketById } from '../../data/config/index.js';
import ElementalIcon from '../ElementalIcon';

export default function BasketRecommendationWidget({ className = '' }) {
  const [selected, setSelected] = useState(BASKET_RECOMMENDATIONS[0]?.riskProfile || 'Aggressive');
  const match = BASKET_RECOMMENDATIONS.find((r) => r.riskProfile === selected);
  const basket = match ? basketById[match.basketId] : null;

  return (
    <section className={`an-basket-rec-widget ${className}`.trim()}>
      <h2 className="an-card-heading">Find your basket</h2>
      <p className="an-sb-muted">Match your risk comfort to a curated mutual fund basket.</p>

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

      {basket && (
        <div className={`an-basket-rec-widget__result an-basket-rec-widget__result--${basket.element}`}>
          <div className="an-basket-rec-widget__result-head">
            <ElementalIcon element={basket.element} size={32} />
            <div>
              <strong>{basket.name}</strong>
              <span>{basket.comparison?.target}</span>
            </div>
          </div>
          <dl className="an-basket-rec-widget__stats">
            <div>
              <dt>Expected return*</dt>
              <dd>{basket.expectedReturn}%</dd>
            </div>
            <div>
              <dt>Risk score</dt>
              <dd>{basket.comparison?.riskScoreDisplay}/10</dd>
            </div>
            <div>
              <dt>Horizon</dt>
              <dd>{basket.horizonYears}</dd>
            </div>
          </dl>
          <Link to={`/invest/basket/${basket.id}`} className="an-basket-rec-widget__cta">
            View {basket.name} analytics →
          </Link>
        </div>
      )}

      <p className="an-basket-rec-widget__quiz">
        <Link to="/invest/risk-profile">Take the full risk quiz →</Link>
      </p>
      <p className="an-basket-rec-widget__note">*Illustrative target — not guaranteed. Past performance ≠ future returns.</p>
    </section>
  );
}
