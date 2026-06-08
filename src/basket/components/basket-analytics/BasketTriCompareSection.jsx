import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useBasketAnalytics from '../../hooks/useBasketAnalytics';
import {
  elementalBaskets,
  COMPARISON_META_ROWS,
  getAssetAllocationCompareLabels,
  getComparisonValue,
  getAssetAllocationTotal,
  projectLumpsum,
  formatLakhINR,
} from '../../data/config/index.js';

const LIVE_PERF_ROWS = [
  { key: 'return1y', label: '1Y return (live NAV)' },
  { key: 'cagr3y', label: '3Y CAGR (live NAV)' },
  { key: 'currentNav', label: 'Basket NAV' },
  { key: 'growth1Lakh', label: 'Growth of ₹1L', format: 'lakh' },
];

const PROJECTION_HORIZONS = [5, 10, 15, 20];

function formatCell(value, format) {
  if (value == null) return '—';
  if (format === 'pct') return `${value}%`;
  if (format === 'score10') return `${value}/10`;
  if (format === 'lakh') return formatLakhINR(value);
  if (format === 'nav') return String(value);
  return String(value);
}

function perfValue(basket, analytics, key) {
  const live = analytics?.returns?.[key];
  if (live != null) return live;
  const mvp = basket.historicalPerformanceMvp;
  if (!mvp) return null;
  const map = {
    return1y: mvp.return1y,
    cagr3y: mvp.cagr3y,
    currentNav: null,
    growth1Lakh: null,
  };
  return map[key] ?? null;
}

export default function BasketTriCompareSection() {
  const fire = useBasketAnalytics('fire');
  const water = useBasketAnalytics('water');
  const earth = useBasketAnalytics('earth');
  const analyticsById = { fire, water, earth };
  const assetLabels = getAssetAllocationCompareLabels();
  const anyLoading = fire.loading || water.loading || earth.loading;

  const projectionRows = useMemo(
    () =>
      PROJECTION_HORIZONS.map((years) => ({
        years,
        values: Object.fromEntries(
          elementalBaskets.map((b) => [
            b.id,
            projectLumpsum(b.growthProjectionPrincipal || 100000, b.expectedReturn, years),
          ])
        ),
      })),
    []
  );

  return (
    <section className="an-tri-compare">
      <h2 className="an-section-title">FIRE · WATER · EARTH</h2>
      <p className="an-sb-muted an-tri-compare__lead">
        Compare risk profile, allocation, live NAV performance, and illustrative growth projections.
      </p>

      <div className="an-tri-compare__table-wrap">
        <table className="an-tri-compare__table">
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
                <strong>Live performance</strong> (synthetic basket NAV)
              </td>
            </tr>
            {LIVE_PERF_ROWS.map((row) => (
              <tr key={row.key}>
                <th scope="row">{row.label}</th>
                {elementalBaskets.map((b) => {
                  const { analytics, loading } = analyticsById[b.id];
                  const val = perfValue(b, analytics, row.key);
                  const fmt =
                    row.key === 'currentNav' ? 'nav' : row.format === 'lakh' ? 'lakh' : 'pct';
                  const display =
                    loading && val == null
                      ? '…'
                      : row.key === 'return1y' || row.key === 'cagr3y'
                        ? val != null
                          ? `${val}%`
                          : '—'
                        : formatCell(val, fmt);
                  return <td key={b.id}>{display}</td>;
                })}
              </tr>
            ))}
            {anyLoading && (
              <tr className="an-tri-compare__loading-hint">
                <td colSpan={elementalBaskets.length + 1}>Loading live metrics…</td>
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

            <tr className="an-tri-compare__section-row">
              <td colSpan={elementalBaskets.length + 1}>
                <strong>Growth of ₹1,00,000*</strong> (illustrative projections)
              </td>
            </tr>
            {projectionRows.map((row) => (
              <tr key={row.years}>
                <th scope="row">{row.years} years</th>
                {elementalBaskets.map((b) => (
                  <td key={b.id}>{formatLakhINR(row.values[b.id])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="an-tri-compare__cta-row">
        {elementalBaskets.map((b) => (
          <Link key={b.id} to={`/invest/basket/${b.id}`} className="an-tri-compare__link">
            View {b.name} →
          </Link>
        ))}
      </div>

      <p className="an-compliance an-tri-compare__disclaimer">
        *Growth projections use expected return assumptions from basket configuration — illustrative only.
        Live performance metrics are computed from underlying scheme NAV history where available.
      </p>
    </section>
  );
}
