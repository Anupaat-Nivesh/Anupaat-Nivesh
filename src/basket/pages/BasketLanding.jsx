import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBasketUser } from '../context/BasketUserContext';
import InvestSubNav from '../components/InvestSubNav';
import ElementalIcon, { elementFromBasketId } from '../components/ElementalIcon';
import ComingSoonBaskets from '../components/basket/ComingSoonBaskets';
import BasketRecommendationWidget from '../components/basket-analytics/BasketRecommendationWidget';
import BasketComparisonSection from '../components/basket-analytics/BasketComparisonSection';
import BasketPricingCallout from '../components/invest/BasketPricingCallout';
import { BASKET_PRODUCT_NAME, BASKET_UNLOCK_PRICE } from '../data/baskets';
import '../styles/basket-screener.css';
import '../styles/basket-cards.css';
import '../styles/basket-analytics.css';

export default function BasketLanding() {
  const { catalog, hasAccess } = useBasketUser();

  return (
    <div className="an-invest-sharp an-basket-landing">
      <InvestSubNav />

      <header className="an-basket-landing-hero">
        <div>
          <p className="an-basket-landing-eyebrow">{BASKET_PRODUCT_NAME}</p>
          <h1 className="an-sb-page-title">
            FIRE · WATER · EARTH
            <br />
            <span className="section-heading-focus">
              ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} per basket
            </span>
          </h1>
          <p className="an-sb-muted">
            Curated mutual fund portfolios with free analytics. Unlock once to see full holdings and
            get onboarding support from our team.
          </p>
          <div className="an-hero-ctas">
            <Link to="/invest/risk-profile" className="an-btn-primary">
              Do Risk Profiling
            </Link>
            <a className="an-btn-ghost" href="#baskets">
              Browse baskets
            </a>
            <a className="an-btn-ghost" href="#basket-comparison">
              Compare performance
            </a>
          </div>
        </div>
      </header>

      <section id="baskets" className="an-basket-landing-catalog">
        <h2 className="an-section-title">Choose your basket</h2>
        <div className="an-basket-grid an-basket-grid--catalog">
          {catalog.map((b, idx) => {
            const unlocked = hasAccess(b.id);
            const element = b.element || elementFromBasketId(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="an-basket-grid__cell"
              >
                <Link
                  to={`/invest/basket/${b.id}`}
                  className={`an-basket-card an-basket-card--${element}`}
                >
                  {unlocked && <span className="an-basket-card__unlocked">Unlocked</span>}
                  <div className="an-basket-card__glow" aria-hidden="true" />
                  <div className="an-basket-card__body">
                    <div className="an-basket-card__icon-wrap">
                      <ElementalIcon element={element} size={44} />
                    </div>
                    <h3 className="an-basket-card__title">{b.name}</h3>
                    <p className="an-basket-card__tagline">{b.comparison?.objective || b.tagline}</p>
                    <div className="an-basket-card__tags">
                      <span className="an-basket-card__tag">Risk {b.comparison?.riskScoreRange}</span>
                      <span className="an-basket-card__tag">{b.horizonYears}</span>
                    </div>
                    <p className="an-basket-card__price-row">
                      Min ₹{b.minInvestment.toLocaleString('en-IN')} ·{' '}
                      <strong>₹{b.price.toLocaleString('en-IN')}</strong> unlock
                    </p>
                    <span className="an-basket-card__cta">
                      {unlocked ? 'View holdings →' : 'View analytics →'}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <BasketComparisonSection />

      <section className="an-basket-landing-rec-band">
        <BasketRecommendationWidget className="an-basket-rec-widget--full" showEyebrow />
      </section>

      <BasketPricingCallout basketsHref="#baskets" />

      <ComingSoonBaskets />
    </div>
  );
}
