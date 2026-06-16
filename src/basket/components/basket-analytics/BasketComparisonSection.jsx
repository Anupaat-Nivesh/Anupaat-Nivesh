import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useBasketAnalytics from '../../hooks/useBasketAnalytics';
import {
  elementalBaskets,
  COMPARISON_META_ROWS,
  getAssetAllocationCompareLabels,
  getComparisonValue,
  getAssetAllocationTotal,
  formatINR,
} from '../../data/config/index.js';
import { getElementColor } from '../../data/elementalColors';
import {
  BASKET_PERF_PERIODS,
  formatPerfPct,
  getBenchmarkReturns,
  getResolvedBasketReturns,
} from '../../utils/basketPerformance';

function formatCell(value, format) {
  if (value == null) return '—';
  if (format === 'pct') return `${value}%`;
  if (format === 'inr') return formatINR(value);
  return String(value);
}

function formatPeriodLabel({ label, kind, key }) {
  if (kind === 'cagr' && key !== 'cagrSinceInception') return `${label} (CAGR)`;
  return label;
}

export default function BasketComparisonSection() {
  const fire = useBasketAnalytics('fire');
  const water = useBasketAnalytics('water');
  const earth = useBasketAnalytics('earth');
  const analyticsById = { fire, water, earth };
  const assetLabels = getAssetAllocationCompareLabels();
  const anyLoading = fire.loading || water.loading || earth.loading;
  const anyError = fire.error || water.error || earth.error;

  const basketReturnsById = useMemo(
    () => ({
      fire: getResolvedBasketReturns(fire.analytics, elementalBaskets.find((b) => b.id === 'fire')),
      water: getResolvedBasketReturns(water.analytics, elementalBaskets.find((b) => b.id === 'water')),
      earth: getResolvedBasketReturns(earth.analytics, elementalBaskets.find((b) => b.id === 'earth')),
    }),
    [fire.analytics, water.analytics, earth.analytics]
  );

  const niftyById = useMemo(
    () => ({
      fire: getBenchmarkReturns(fire.analytics, 'nifty50'),
      water: getBenchmarkReturns(water.analytics, 'nifty50'),
      earth: getBenchmarkReturns(earth.analytics, 'nifty50'),
    }),
    [fire.analytics, water.analytics, earth.analytics]
  );

  return (
    <section id="basket-comparison" className="an-basket-compare an-tri-compare">
      <div className="an-basket-compare__head">
        <p className="an-basket-landing-eyebrow">Compare baskets</p>
        <h2 className="an-section-title an-basket-compare__title">
          Fire, Water &amp; Earth — side by side
        </h2>
        <p className="an-sb-muted an-basket-compare__lead">
          Objectives, risk scores, strategic allocation, and basket-level returns versus the Nifty
          50 — in one place.
        </p>
      </div>

      <div className="an-basket-compare__summary">
        <div className="an-basket-compare__summary-spacer" aria-hidden="true" />
        {elementalBaskets.map((b) => (
          <Link
            key={b.id}
            to={`/invest/basket/${b.id}`}
            className={`an-basket-compare__summary-card an-basket-compare__summary-card--${b.element}`}
            style={{ '--basket-card-accent': getElementColor(b.element) }}
          >
            <h3>{b.name}</h3>
            <p>{b.comparison?.objective}</p>
            <span>Risk score {b.comparison?.riskScoreRange}</span>
          </Link>
        ))}
      </div>

      <div className="an-tri-compare__table-wrap">
        <table className="an-tri-compare__table">
          <colgroup>
            <col className="an-tri-compare__col-feature" />
            <col className="an-tri-compare__col-basket" span={3} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Feature</th>
              {elementalBaskets.map((b) => (
                <th key={b.id} scope="col">
                  <Link to={`/invest/basket/${b.id}`} className="an-tri-compare__th-link">
                    {b.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_META_ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {elementalBaskets.map((b) => (
                  <td key={b.id}>{formatCell(getComparisonValue(b, row.key), row.format)}</td>
                ))}
              </tr>
            ))}

            <tr className="an-tri-compare__section-row">
              <td colSpan={elementalBaskets.length + 1}>
                <strong>Basket performance</strong> — synthetic NAV
              </td>
            </tr>
            {BASKET_PERF_PERIODS.map((period) => (
              <tr key={`basket-${period.key}`}>
                <th scope="row">{formatPeriodLabel(period)}</th>
                {elementalBaskets.map((b) => {
                  const { loading } = analyticsById[b.id];
                  const val = basketReturnsById[b.id]?.[period.key];
                  return (
                    <td key={b.id}>{loading && val == null ? '…' : formatPerfPct(val)}</td>
                  );
                })}
              </tr>
            ))}

            <tr className="an-tri-compare__section-row">
              <td colSpan={elementalBaskets.length + 1}>
                <strong>Nifty 50 benchmark</strong> — same inception window per basket
              </td>
            </tr>
            {BASKET_PERF_PERIODS.map((period) => (
              <tr key={`nifty-${period.key}`}>
                <th scope="row">{formatPeriodLabel(period)}</th>
                {elementalBaskets.map((b) => {
                  const { loading } = analyticsById[b.id];
                  const val = niftyById[b.id]?.[period.key];
                  return (
                    <td key={b.id}>{loading && val == null ? '…' : formatPerfPct(val)}</td>
                  );
                })}
              </tr>
            ))}

            {anyLoading && (
              <tr className="an-tri-compare__loading-hint">
                <td colSpan={elementalBaskets.length + 1}>Loading live metrics…</td>
              </tr>
            )}

            {!anyLoading && anyError && (
              <tr className="an-tri-compare__loading-hint">
                <td colSpan={elementalBaskets.length + 1}>
                  Live analytics unavailable — showing values computed from cached NAV where possible.
                </td>
              </tr>
            )}

            <tr className="an-tri-compare__section-row">
              <td colSpan={elementalBaskets.length + 1}>
                <strong>Asset allocation</strong> (4 strategic heads — 100% each)
              </td>
            </tr>
            {assetLabels.map((label) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {elementalBaskets.map((b) => (
                  <td key={b.id}>{formatCell(getComparisonValue(b, `asset:${label}`), 'pct')}</td>
                ))}
              </tr>
            ))}
            <tr className="an-tri-compare__total-row">
              <th scope="row">Total allocation</th>
              {elementalBaskets.map((b) => (
                <td key={b.id}>
                  <strong>{formatCell(getAssetAllocationTotal(b), 'pct')}</strong>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="an-tri-compare__cta-row">
        {elementalBaskets.map((b) => (
          <Link key={b.id} to={`/invest/basket/${b.id}`} className="an-tri-compare__link">
            View {b.name} →
          </Link>
        ))}
        <Link to="/invest/risk-profile" className="an-tri-compare__link">
          Do Risk Profiling →
        </Link>
      </div>
    </section>
  );
}
