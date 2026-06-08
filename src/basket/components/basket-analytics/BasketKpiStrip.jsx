import React from 'react';

const KPI_DEFS = [
  { key: 'return1m', label: '1 Month' },
  { key: 'return3m', label: '3 Month' },
  { key: 'return6m', label: '6 Month' },
  { key: 'return1y', label: '1 Year' },
  { key: 'cagr3y', label: '3Y CAGR' },
  { key: 'cagr5y', label: '5Y CAGR' },
];

function fmt(val) {
  if (val == null) return '—';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val}%`;
}

export default function BasketKpiStrip({ returns, loading }) {
  return (
    <section className="an-basket-kpi-strip">
      <div className="an-basket-kpi-strip__head">
        <h2 className="an-card-heading">Performance overview</h2>
        {returns?.asOfDate && (
          <span className="an-basket-kpi-strip__asof">As of {returns.asOfDate}</span>
        )}
      </div>
      <div className="an-basket-kpi-grid">
        {KPI_DEFS.map(({ key, label }) => {
          const val = returns?.[key];
          const pos = val > 0;
          const neg = val < 0;
          return (
            <div key={key} className="an-basket-kpi-card">
              <span className="an-basket-kpi-card__label">{label}</span>
              <strong
                className={`an-basket-kpi-card__val ${pos ? 'is-pos' : ''} ${neg ? 'is-neg' : ''}`}
              >
                {loading ? '…' : fmt(val)}
              </strong>
            </div>
          );
        })}
        <div className="an-basket-kpi-card an-basket-kpi-card--nav">
          <span className="an-basket-kpi-card__label">Basket NAV</span>
          <strong className="an-basket-kpi-card__val">
            {loading ? '…' : returns?.currentNav ?? '—'}
          </strong>
        </div>
      </div>
    </section>
  );
}
