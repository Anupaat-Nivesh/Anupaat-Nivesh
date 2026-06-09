import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useBasketUser } from '../context/BasketUserContext';
import InvestSubNav from '../components/InvestSubNav';
import PlanPricingBanner from '../components/invest/PlanPricingBanner';
import ElementalIcon, { elementFromBasketId } from '../components/ElementalIcon';
import BasketUnlockFlow from '../components/basket/BasketUnlockFlow';
import ComingSoonBaskets from '../components/basket/ComingSoonBaskets';
import InvestComplianceNote from '../components/basket/InvestComplianceNote';
import BasketPersonalitySection from '../components/basket-analytics/BasketPersonalitySection';
import BasketRecommendationWidget from '../components/basket-analytics/BasketRecommendationWidget';
import BasketTriCompareSection from '../components/basket-analytics/BasketTriCompareSection';
import { BASKET_PRODUCT_NAME, BASKET_UNLOCK_PRICE } from '../data/baskets';
import '../styles/basket-screener.css';
import '../styles/basket-cards.css';
import '../styles/basket-analytics.css';

function MiniBars() {
  const h = [40, 65, 45, 80, 55, 90, 70, 95, 75, 100, 85, 110];
  return (
    <div className="an-mini-bars">
      {h.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ delay: i * 0.04, duration: 0.5, ease: 'easeOut' }}
          className="an-mini-bars__bar"
          data-accent={i % 3 === 0}
        />
      ))}
    </div>
  );
}

export default function BasketLanding() {
  const { catalog, hasAccess } = useBasketUser();

  return (
    <div className="an-invest-sharp an-basket-landing">
      <InvestSubNav />

      <header className="an-basket-landing-hero">
        <div>
          <p className="an-basket-landing-eyebrow">{BASKET_PRODUCT_NAME} · Direct plan</p>
          <h1 className="an-sb-page-title">
            Curated baskets.
            <br />
            <span className="section-heading-focus">Pay once. Invest with clarity.</span>
          </h1>
          <p className="an-sb-muted">
            No login required — choose a basket, unlock for ₹{BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} via Razorpay,
            receive fund details by email, and our team handles onboarding.
          </p>
          <div className="an-hero-ctas">
            <a className="an-btn-primary" href="#baskets">
              Choose a basket
            </a>
            <Link to="/invest/risk-profile" className="an-btn-ghost">
              Take risk quiz
            </Link>
            <Link to="/screeners" className="an-btn-ghost">
              Market screeners
            </Link>
          </div>
          <div className="an-trust-row">
            <span className="an-trust-pill">Razorpay secure checkout</span>
            <span className="an-trust-pill">Email + team onboarding</span>
            <span className="an-trust-pill">
              Research AUM lens <CountUp end={128} duration={2.2} suffix=" Cr+" />
            </span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="an-glass-card an-basket-preview-card"
        >
          <div className="an-basket-preview-card__head">
            <span>Portfolio preview</span>
            <span className="an-basket-preview-card__tag">Analytics-first</span>
          </div>
          <MiniBars />
          <p className="an-basket-preview-card__foot">Live NAV, allocation & risk — before you unlock</p>
        </motion.div>
      </header>

      <section id="baskets" className="an-basket-landing-catalog">
        <h2 className="an-section-title">{BASKET_PRODUCT_NAME}</h2>
        <p className="an-sb-muted an-basket-landing-catalog__lead">
          Three risk-calibrated portfolios — full analytics free; fund names unlock on purchase.
        </p>
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
                    <p className="an-basket-card__tagline">{b.tagline}</p>
                    <div className="an-basket-card__tags">
                      <span className="an-basket-card__tag">{b.riskLevel}</span>
                      <span className="an-basket-card__tag">{b.horizonYears}</span>
                    </div>
                    <div className="an-basket-card__vol">
                      <div className="an-basket-card__vol-head">
                        <span>Volatility</span>
                        <span className="an-basket-card__vol-pct">{b.volatilityPct}%</span>
                      </div>
                      <div className="an-basket-card__vol-track">
                        <div
                          className="an-basket-card__vol-fill"
                          style={{ width: `${b.volatilityPct}%` }}
                        />
                      </div>
                    </div>
                    <p className="an-basket-card__price-row">
                      Min ₹{b.minInvestment.toLocaleString('en-IN')} ·{' '}
                      <strong>₹{b.price.toLocaleString('en-IN')}</strong> {b.priceLabel}
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

      <BasketTriCompareSection />

      <div className="an-basket-landing-discovery">
        <BasketPersonalitySection ctaHref="#baskets" />
        <div className="an-basket-landing-rec">
          <BasketRecommendationWidget />
          <p className="an-basket-landing-quiz-link">
            Want a guided answer?{' '}
            <Link to="/invest/risk-profile">Take the 2-minute risk profile quiz →</Link>
          </p>
        </div>
      </div>

      <PlanPricingBanner basketsHref="#baskets" />
      <BasketUnlockFlow />

      <ComingSoonBaskets />

      <InvestComplianceNote />
    </div>
  );
}
