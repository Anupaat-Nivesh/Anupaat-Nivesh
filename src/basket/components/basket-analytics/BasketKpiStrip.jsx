import React from 'react';
import { BASKET_PERF_PERIODS, formatPerfPct } from '../../utils/basketPerformance';

export default function BasketKpiStrip({ returns, loading }) {
  return (
    <section className="an-basket-kpi-strip">
      <div className="an-basket-kpi-strip__head">
        <h2 className="an-card-heading">Basket performance</h2>
        {returns?.asOfDate && (
          <span className="an-basket-kpi-strip__asof">As of {returns.asOfDate}</span>
        )}
      </div>
      <p className="an-sb-muted an-basket-kpi-strip__note">
        All periods below are from weighted synthetic basket NAV — not individual fund returns.
      </p>
      <div className="an-basket-kpi-grid an-basket-kpi-grid--periods">
        {BASKET_PERF_PERIODS.map(({ key, label, kind }) => {
          const val = returns?.[key];
          const pos = val > 0;
          const neg = val < 0;
          return (
            <div key={key} className="an-basket-kpi-card">
              <span className="an-basket-kpi-card__label">
                {label}
                {kind === 'cagr' && key !== 'cagrSinceInception' ? ' (CAGR)' : ''}
              </span>
              <strong
                className={`an-basket-kpi-card__val ${pos ? 'is-pos' : ''} ${neg ? 'is-neg' : ''}`}
              >
                {loading ? '…' : formatPerfPct(val)}
              </strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
