import React from 'react';
import { Link } from 'react-router-dom';
import ScreenerIcon, { iconToneForId } from './ScreenerIcon';

function formatAction(count) {
  if (!count) return 'View all';
  if (/view/i.test(count)) return count.includes('→') ? count : `${count} →`;
  return `${count} →`;
}

function CardShell({ item, className, children }) {
  const cls = `scr-card${item.href ? '' : ' scr-card--btn'}${className ? ` ${className}` : ''}`;

  if (item.href) {
    if (item.href.startsWith('/') && !item.href.startsWith('/#')) {
      return (
        <Link to={item.href} className={cls}>
          {children}
        </Link>
      );
    }
    return (
      <a href={item.href} className={cls}>
        {children}
      </a>
    );
  }

  if (item.onClick) {
    return (
      <button type="button" className={cls} onClick={item.onClick}>
        {children}
      </button>
    );
  }

  return (
    <button type="button" className={cls}>
      {children}
    </button>
  );
}

/**
 * Reference screener catalog tile (icon · tag · title · description · purple CTA).
 */
export default function ScreenerCatalogCard({ item, className = '' }) {
  const tone = item.iconTone || iconToneForId(item.id);
  const action = formatAction(item.count || item.action);

  return (
    <CardShell item={item} className={className}>
      <ScreenerIcon name={item.icon} tone={tone} />
      <div className="scr-card__body">
        <span className="scr-card__tag">{item.tag}</span>
        <h3 className="scr-card__title">{item.title}</h3>
        <p className="scr-card__desc">{item.description}</p>
      </div>
      <span className="scr-card__action">{action}</span>
    </CardShell>
  );
}
