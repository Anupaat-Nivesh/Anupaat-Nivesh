import React from 'react';
import { Link } from 'react-router-dom';
import ElementalIcon from '../ElementalIcon';
import { elementalBaskets } from '../../data/config/index.js';

export default function BasketPersonalitySection({ ctaHref = '/invest/baskets' }) {
  return (
    <section className="an-basket-personality">
      <div className="an-basket-personality__head">
        <p className="an-basket-landing-eyebrow">Mutual fund baskets</p>
        <h2 className="an-section-title">Choose Your Investment Personality</h2>
        <p className="an-sb-muted">
          Risk-first portfolio design — pick the basket that matches how you think about money, not just returns.
        </p>
      </div>
      <div className="an-basket-personality__grid">
        {elementalBaskets.map((b) => (
          <Link
            key={b.id}
            to={`/invest/basket/${b.id}`}
            className={`an-basket-personality__card an-basket-personality__card--${b.element}`}
          >
            <div className="an-basket-personality__icon">
              <ElementalIcon element={b.element} size={36} />
            </div>
            <h3>
              {b.personality?.title || b.name} – {b.personality?.subtitle}
            </h3>
            <p>{b.personality?.pitch}</p>
            <span className="an-basket-personality__meta">
              {b.riskLevel} · {b.horizonYears}
            </span>
          </Link>
        ))}
      </div>
      <div className="an-basket-personality__foot">
        <Link to={ctaHref} className="an-btn-primary">
          Explore all baskets
        </Link>
      </div>
    </section>
  );
}
