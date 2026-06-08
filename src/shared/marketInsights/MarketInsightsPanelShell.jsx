import React from 'react';
import './market-insights-filters.css';

export default function MarketInsightsPanelShell({
  id,
  title,
  subtitle = 'MARKET INSIGHTS',
  accent = 'purple',
  icon,
  children,
  className = '',
}) {
  return (
    <section
      id={id}
      className={`mi-panel mi-panel--${accent} ${className}`.trim()}
    >
      <header className="mi-panel__head">
        <div className="mi-panel__head-left">
          {icon && <span className="mi-panel__icon">{icon}</span>}
          <div>
            <h2 className="mi-panel__title">{title}</h2>
            {subtitle && <p className="mi-panel__sub">{subtitle}</p>}
          </div>
        </div>
      </header>
      {children}
    </section>
  );
}
