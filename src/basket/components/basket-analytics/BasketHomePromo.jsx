import React from 'react';
import { Link } from 'react-router-dom';
import BasketRecommendationWidget from './BasketRecommendationWidget';
import { BASKET_UNLOCK_PRICE } from '../../data/baskets';
import '../../styles/basket-analytics.css';
import '../../styles/basket-shared.css';

/** Homepage — single path to basket recommendation (hero covers basket discovery). */
export default function BasketHomePromo() {
  return (
    <section className="home-section an-basket-home-promo section__padding">
      <div className="an-basket-home-promo__intro">
        <h2 className="an-section-title">Not sure which basket fits?</h2>
        <p className="an-sb-muted">
          Match your risk profile to FIRE, WATER, or EARTH — unlock any basket for ₹
          {BASKET_UNLOCK_PRICE.toLocaleString('en-IN')} once.
        </p>
        <Link to="/invest/baskets" className="an-btn-ghost">
          View all baskets →
        </Link>
      </div>
      <BasketRecommendationWidget />
    </section>
  );
}
