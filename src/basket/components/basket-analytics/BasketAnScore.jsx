import React from 'react';
import { getElementColor } from '../../data/elementalColors';

const FACTORS = [
  { key: 'growth', label: 'Growth Potential' },
  { key: 'diversification', label: 'Diversification' },
  { key: 'stability', label: 'Stability' },
  { key: 'liquidity', label: 'Liquidity' },
  { key: 'riskControl', label: 'Risk Control' },
];

function Gauge({ score, label, large, accent }) {
  const pct = Math.min(100, Math.max(0, (score / 10) * 100));
  return (
    <div className={`an-an-score-gauge ${large ? 'an-an-score-gauge--lg' : ''}`}>
      <div
        className="an-an-score-gauge__ring"
        style={{ '--score-pct': `${pct}%`, '--score-accent': accent }}
        aria-hidden="true"
      >
        <span className="an-an-score-gauge__val">{score}</span>
      </div>
      <span className="an-an-score-gauge__label">{label}</span>
    </div>
  );
}

export default function BasketAnScore({ anScore, risk, element = 'fire' }) {
  if (!anScore) return null;
  const accent = getElementColor(element);

  return (
    <section className="an-an-score" style={{ '--an-score-accent': accent }}>
      <div className="an-an-score__head">
        <h2 className="an-card-heading">AN Risk Score™</h2>
        <p className="an-sb-muted">Proprietary portfolio intelligence — not a SEBI riskometer substitute</p>
      </div>
      <div className="an-an-score__grid">
        <Gauge score={anScore.overall} label="Overall" large accent={accent} />
        {FACTORS.map((f) => (
          <Gauge key={f.key} score={anScore[f.key]} label={f.label} accent={accent} />
        ))}
      </div>
      {risk && (
        <div className="an-an-score__live">
          <span>Live volatility: <strong>{risk.volatility ?? '—'}%</strong></span>
          <span>Sharpe: <strong>{risk.sharpe ?? '—'}</strong></span>
          <span>Max drawdown: <strong>{risk.maxDrawdown ?? '—'}%</strong></span>
        </div>
      )}
    </section>
  );
}
