import React from 'react';
import FilterInfoButton from '../../shared/marketInsights/FilterInfoButton';
import '../styles/screener-hub-cards.css';

const ICONS = {
  brand: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  green: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16l6-8 4 5 6-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  blue: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 18V8M10 18V4M15 18v-6M20 18v-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  purple: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4v16M8 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  teal: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 14h4l2-8 3 12 2-6h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  gold: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 20c4-6 8-6 12 0M8 12c4 4 8 4 12 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

/**
 * White insight card — header (icon · title · i · View All) + scrollable body.
 */
export default function HubInsightCard({
  id,
  title,
  iconTone = 'blue',
  sectionInfo,
  viewAllHref = '#',
  viewAllLabel = 'View All',
  viewAllVariant = 'link',
  children,
  className = '',
}) {
  const viewCls =
    viewAllVariant === 'pill' ? 'scr-hub-card__view scr-hub-card__view--pill' : 'scr-hub-card__view';

  return (
    <article id={id} className={`scr-hub-card${className ? ` ${className}` : ''}`}>
      <header className="scr-hub-card__head">
        <span className={`scr-hub-card__icon scr-hub-card__icon--${iconTone}`}>
          {ICONS[iconTone] || ICONS.blue}
        </span>
        <h3 className="scr-hub-card__title">{title}</h3>
        <div className="scr-hub-card__head-actions">
          {sectionInfo && (
            <FilterInfoButton text={sectionInfo} label={`About ${title}`} variant="i" align="end" />
          )}
          <a href={viewAllHref} className={viewCls}>
            {viewAllLabel} ›
          </a>
        </div>
      </header>
      <div className="scr-hub-card__body mi-card-scroll">{children}</div>
    </article>
  );
}
