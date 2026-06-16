import React from 'react';
import { getElementColor, parseRiskScoreRange } from '../../data/elementalColors';

export default function BasketRiskScoreViz({ element, riskScoreRange, riskLevel, liveVolatilityPct }) {
  const band = parseRiskScoreRange(riskScoreRange);
  const accent = getElementColor(element);

  if (!band) return null;

  const minPct = (band.min / 10) * 100;
  const widthPct = ((band.max - band.min) / 10) * 100;

  return (
    <div className="an-portfolio-risk">
      <h3 className="an-portfolio-risk__title">Risk score</h3>
      <p className="an-sb-muted an-portfolio-risk__lead">
        Approved profile range for this basket (scale 0–10).
      </p>

      <div className="an-portfolio-risk__score-row">
        <span className="an-portfolio-risk__badge" style={{ borderColor: accent, color: accent }}>
          {band.display}
        </span>
        {riskLevel && <span className="an-portfolio-risk__level">{riskLevel}</span>}
      </div>

      <div className="an-portfolio-risk__scale" aria-hidden="true">
        <div className="an-portfolio-risk__track">
          <div
            className="an-portfolio-risk__band"
            style={{
              left: `${minPct}%`,
              width: `${widthPct}%`,
              background: accent,
            }}
          />
        </div>
        <div className="an-portfolio-risk__ticks">
          {[0, 2, 4, 6, 8, 10].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      </div>

      {liveVolatilityPct != null && (
        <p className="an-portfolio-risk__live">
          Live portfolio volatility: <strong>{liveVolatilityPct}%</strong>
        </p>
      )}
    </div>
  );
}
