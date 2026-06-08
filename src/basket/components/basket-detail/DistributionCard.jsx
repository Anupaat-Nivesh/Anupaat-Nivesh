import React from 'react';
import ScripboxCard from './ScripboxCard';

/** Public 4-head asset allocation — fund construction shown separately via donut. */
export default function DistributionCard({ assetSlices }) {
  if (!assetSlices?.length) return null;

  return (
    <ScripboxCard title="Asset allocation">
      <div className="an-distribution-card__body">
        <p className="an-sb-muted an-distribution-card__lead">
          Strategic mix across four asset classes (public view).
        </p>
        <div className="an-basket-alloc-mini">
          {assetSlices.map((s) => (
            <div key={s.label} className="an-basket-alloc-mini__row">
              <span>
                <span className="an-basket-alloc-mini__dot" style={{ background: s.color }} />
                {s.label}
              </span>
              <strong>{s.pct}%</strong>
            </div>
          ))}
        </div>
      </div>
    </ScripboxCard>
  );
}
