import React, { useCallback, useEffect, useState } from 'react';

/** Carousel order matches reference: purple → green → blue */
export const HERO_SLIDE_ORDER = ['insight', 'growth', 'default'];
const AUTO_MS = 6500;

const INSIGHT_ICONS = {
  volume: '◉',
  flow: '⇄',
  sector: '◈',
  breadth: '◎',
};

function HeroMetric({ metric }) {
  if (!metric) return null;
  const up = metric.up !== false;
  return (
    <div className={`scr-hero-metric${up ? ' is-up' : ' is-down'}`}>
      <span className="scr-hero-metric__label">{metric.label}</span>
      <span className="scr-hero-metric__value">{metric.value}</span>
    </div>
  );
}

function HeroChart({ chart }) {
  if (!chart?.items?.length) return null;
  return (
    <div className="scr-hero-chart">
      {chart.legend ? <span className="scr-hero-chart__legend">{chart.legend}</span> : null}
      <div className="scr-hero-chart__bars">
        {chart.items.map((bar, i) => (
          <div key={`${bar.label}-${i}`} className="scr-hero-chart__col">
            <span
              className={`scr-hero-chart__bar${bar.up ? ' is-up' : ' is-down'}`}
              style={{ height: `${bar.height}%` }}
            />
            <span className="scr-hero-chart__lbl">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroLivePanel({ theme }) {
  const primary = theme.primary || {};
  const metrics = Array.isArray(theme.metrics) ? theme.metrics : [];
  const insight = theme.insight || {};
  const primaryUp = primary.up !== false;
  const insightUp = insight.up !== false;

  return (
    <div className="scr-hero-live">
      <div className="scr-hero-live__primary">
        <span className="scr-hero-live__primary-label">{primary.label}</span>
        <div className="scr-hero-live__primary-row">
          <span className="scr-hero-live__primary-value">{primary.value || '—'}</span>
          {primary.delta ? (
            <span className={`scr-hero-live__primary-delta${primaryUp ? ' is-up' : ' is-down'}`}>
              {primary.delta}
            </span>
          ) : null}
        </div>
      </div>

      {metrics.length > 0 ? (
        <div className="scr-hero-live__metrics">
          {metrics.map((m) => (
            <HeroMetric key={m.label} metric={m} />
          ))}
        </div>
      ) : null}

      <HeroChart chart={theme.chart} />

      {insight.title ? (
        <div className={`scr-hero-live__insight${insightUp ? ' is-up' : ' is-down'}`}>
          <span className="scr-hero-live__insight-icon" aria-hidden="true">
            {INSIGHT_ICONS[insight.kind] || '⌁'}
          </span>
          <div className="scr-hero-live__insight-body">
            <div className="scr-hero-live__insight-top">
              <strong>{insight.title}</strong>
              {insight.tag ? <span className="scr-hero-live__tag">{insight.tag}</span> : null}
            </div>
            <span>{insight.detail}</span>
          </div>
        </div>
      ) : null}

      {theme.footnote || theme.asOn ? (
        <div className="scr-hero-live__footrow">
          {theme.footnote ? <p className="scr-hero-live__foot">{theme.footnote}</p> : <span />}
          {theme.asOn ? <p className="scr-hero-live__as-on">Updated {theme.asOn}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function HeroSlide({ theme, isActive }) {
  return (
    <article
      className={`scr-hero-slide${isActive ? ' is-active' : ''}`}
      style={{ background: theme.gradient }}
      aria-hidden={!isActive}
    >
      <div className="scr-hero__pattern" aria-hidden="true" />
      <div className="scr-hero__shine" aria-hidden="true" />
      <div className="scr-hero__inner">
        <div className="scr-hero__copy">
          <span className="scr-hero__badge">
            <span className="scr-hero__dot" />
            {theme.badge}
          </span>
          <h2 className="scr-hero__title">
            {theme.title}
            {theme.titleAccent ? (
              <>
                <br />
                <span className="scr-hero__title-accent">{theme.titleAccent}</span>
              </>
            ) : null}
          </h2>
          <p className="scr-hero__subtitle">{theme.subtitle}</p>
        </div>
        <div className="scr-hero__widgets" aria-label="Live market figures">
          <HeroLivePanel theme={theme} />
        </div>
      </div>
    </article>
  );
}

export default function ScreenerHero({ themes, live }) {
  const slides = HERO_SLIDE_ORDER.map((id) => themes[id]).filter(Boolean);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index) => {
      if (!slides.length) return;
      setActive(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  return (
    <section
      className="scr-hero-carousel"
      aria-roledescription="carousel"
      aria-label="Market insights highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="scr-hero-slider">
        {slides.map((theme, i) => (
          <HeroSlide
            key={theme.id}
            theme={{
              ...theme,
              ...(live?.[theme.id] || {}),
            }}
            isActive={i === active}
          />
        ))}
      </div>

      <button
        type="button"
        className="scr-hero-nav-btn scr-hero-nav-btn--prev"
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="scr-hero-nav-btn scr-hero-nav-btn--next"
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
      >
        ›
      </button>

      <div className="scr-hero-navigation" role="tablist" aria-label="Hero slides">
        {slides.map((theme, i) => (
          <button
            key={theme.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={theme.label}
            className={`scr-hero-dot${i === active ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
