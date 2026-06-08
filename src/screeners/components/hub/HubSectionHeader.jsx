import React from 'react';

export default function HubSectionHeader({
  title,
  subtitle,
  icon,
  accent = 'purple',
  meta,
  actions,
}) {
  return (
    <header className={`scr-hub__panel-head scr-hub__panel-head--${accent}`}>
      <div className="scr-hub__panel-head-left">
        {icon && <span className="scr-hub__panel-icon">{icon}</span>}
        <div>
          <h2 className="scr-hub__panel-title">{title}</h2>
          {subtitle && <p className="scr-hub__panel-sub">{subtitle}</p>}
        </div>
      </div>
      <div className="scr-hub__panel-head-right">
        {meta && <span className="scr-hub__panel-meta">{meta}</span>}
        {actions}
      </div>
    </header>
  );
}
