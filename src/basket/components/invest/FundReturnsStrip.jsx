import React, { useMemo } from 'react';
import { formatReturnPct } from '../../utils/mfMetrics';

const PERIODS = [
  { id: '1y', label: '1 Year', key: 'cagr1y' },
  { id: '3y', label: '3 Year', key: 'cagr3y' },
  { id: '5y', label: '5 Year', key: 'cagr5y' },
  { id: 'max', label: 'Since inception', key: 'cagrTillDate' },
];

function toneForValue(value) {
  if (value == null) return 'neutral';
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

export default function FundReturnsStrip({ profile, activePeriod, onPeriodChange }) {
  const items = useMemo(
    () =>
      PERIODS.map((p) => ({
        ...p,
        value: profile?.[p.key] ?? null,
        tone: toneForValue(profile?.[p.key]),
      })),
    [profile]
  );

  const bestId = useMemo(() => {
    const withValues = items.filter((i) => i.value != null);
    if (withValues.length < 2) return null;
    const best = withValues.reduce((a, b) => (b.value > a.value ? b : a));
    return best.id;
  }, [items]);

  return (
    <div className="an-fund-returns-strip" role="group" aria-label="Returns by period">
      {items.map((item) => {
        const isActive = activePeriod === item.id;
        const isBest = bestId === item.id && item.value != null && item.value > 0;

        return (
          <button
            key={item.id}
            type="button"
            className={[
              'an-fund-returns-strip__item',
              `an-fund-returns-strip__item--${item.tone}`,
              isActive ? 'is-active' : '',
              isBest ? 'is-best' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onPeriodChange(item.id)}
            aria-pressed={isActive}
          >
            <span className="an-fund-returns-strip__label">{item.label}</span>
            <span className="an-fund-returns-strip__value">
              {item.value != null ? formatReturnPct(item.value) : '—'}
            </span>
            {isBest && <span className="an-fund-returns-strip__badge">Top</span>}
          </button>
        );
      })}
    </div>
  );
}
