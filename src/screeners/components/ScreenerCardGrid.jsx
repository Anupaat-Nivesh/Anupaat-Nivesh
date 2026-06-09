import React from 'react';
import ScreenerCatalogCard from './ScreenerCatalogCard';

export default function ScreenerCardGrid({ title, iconTone, items, sectionId, meta }) {
  return (
    <section className="scr-section" id={sectionId} aria-labelledby={`${sectionId}-heading`}>
      <header className="scr-section__head">
        <span className={`scr-section__icon scr-section__icon--${iconTone}`} aria-hidden="true">
          ◷
        </span>
        <h2 id={`${sectionId}-heading`} className="scr-section__title">
          {title}
        </h2>
        {meta && <span className="scr-section__meta">{meta}</span>}
      </header>
      <ul className="scr-card-grid">
        {items.map((item) => (
          <li key={item.id}>
            <ScreenerCatalogCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
