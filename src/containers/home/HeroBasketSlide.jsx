import React from 'react';
import { Link } from 'react-router-dom';
import ElementalIcon from '../../basket/components/ElementalIcon';
import { elementalBaskets } from '../../basket/data/config/index.js';
import { BASKET_UNLOCK_PRICE } from '../../basket/data/baskets';

/** Hero slide — promotes FIRE / WATER / EARTH baskets as primary homepage CTA. */
export default function HeroBasketSlide() {
  return (
    <>
      <div className="hero-content">
        <p className="hero-eyebrow">Mutual Fund Baskets</p>
        <h1>
          FIRE · WATER · EARTH
          <br />
          Curated Portfolios for Every Investor
        </h1>
        <p className="hero-benefit">
          Risk-first elemental baskets — expert-built mutual fund portfolios matched to
          how you think about money, not just returns.
        </p>
        <div className="hero-pills">
          <span>✓ ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} per basket</span>
          <span>✓ 6-fund curated portfolios</span>
          <span>✓ Free analytics before unlock</span>
        </div>
        <div className="hero-content__spacer" aria-hidden="true" />
        <div className="hero-content__foot">
          <div className="hero-actions">
            <Link to="/invest/baskets" className="btn btn-primary hero-cta-btn">
              Explore All Baskets
            </Link>
            <Link
              to="/invest/risk-profile"
              className="btn hero-cta-btn hero-cta-btn--outline-dark"
            >
              Do Risk Profiling
            </Link>
          </div>
          <div className="hero-basket-quick-links" aria-label="Browse individual baskets">
            {elementalBaskets.map((b) => (
              <Link
                key={b.id}
                to={`/invest/basket/${b.id}`}
                className={`hero-basket-chip hero-basket-chip--${b.element}`}
              >
                <ElementalIcon element={b.element} size={18} />
                <span>{b.name} Basket</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-panel hero-panel--baskets" data-aos="fade-up">
        <div className="hero-panel__badge">Elemental Baskets</div>
        <div className="hero-panel__body">
          <div className="hero-basket-panel__grid">
            {elementalBaskets.map((b) => (
              <Link
                key={b.id}
                to={`/invest/basket/${b.id}`}
                className={`hero-basket-card hero-basket-card--${b.element}`}
              >
                <div className="hero-basket-card__head">
                  <span className="hero-basket-card__icon">
                    <ElementalIcon element={b.element} size={28} />
                  </span>
                  <div>
                    <h3>{b.name} Basket</h3>
                    <p className="hero-basket-card__subtitle">
                      {b.comparison?.objective}
                    </p>
                  </div>
                </div>
                <p className="hero-basket-card__pitch">{b.personality?.pitch}</p>
                <div className="hero-basket-card__meta">
                  <span>{b.riskLevel}</span>
                  <span>{b.horizonYears}</span>
                </div>
                <span className="hero-basket-card__cta">View basket →</span>
              </Link>
            ))}
          </div>
          <Link to="/invest/baskets#basket-comparison" className="hero-basket-panel__all">
            Compare all three baskets
          </Link>
        </div>
      </div>
    </>
  );
}
