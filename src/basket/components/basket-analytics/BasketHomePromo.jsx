import React from 'react';
import BasketPersonalitySection from './BasketPersonalitySection';
import BasketRecommendationWidget from './BasketRecommendationWidget';
import '../../styles/basket-analytics.css';
import '../../styles/basket-shared.css';

/** Homepage slice — personality-first basket discovery (no BasketUserProvider required). */
export default function BasketHomePromo() {
  return (
    <section className="home-section an-basket-home-promo section__padding">
      <BasketPersonalitySection ctaHref="/invest/baskets" />
      <div className="an-basket-home-promo__widget">
        <BasketRecommendationWidget />
      </div>
    </section>
  );
}
