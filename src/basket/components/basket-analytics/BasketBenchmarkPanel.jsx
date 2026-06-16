import React, { useMemo } from 'react';
import {
  BASKET_PERF_PERIODS,
  formatPerfPct,
  getBenchmarkReturns,
  getResolvedBasketReturns,
  perfDiff,
} from '../../utils/basketPerformance';
import { getResolvedGrowthComparison } from '../../utils/growthChartData';

/**
 * Basket vs Nifty 50 — same inception window, both indexed to 100 at basket launch.
 */
export default function BasketBenchmarkPanel({ analytics, basket, loading }) {
  const nifty = useMemo(() => getBenchmarkReturns(analytics, 'nifty50'), [analytics]);
  const basketReturns = useMemo(
    () => getResolvedBasketReturns(analytics, basket),
    [analytics, basket]
  );
  const growthComparison = useMemo(
    () => getResolvedGrowthComparison(analytics, analytics?.navHistory),
    [analytics]
  );
  const inception = analytics?.inceptionDate;

  return (
    <section className="an-basket-benchmark">
      <h2 className="an-card-heading">Basket vs Nifty 50</h2>
      <p className="an-sb-muted">
        Nifty 50 index fund NAV normalized to 100 on the same date as this basket&apos;s synthetic
        inception ({inception || '—'}). Compares portfolio-level basket returns, not single-scheme
        factsheets.
      </p>

      <div className="an-basket-benchmark__table-wrap">
        <table className="an-basket-benchmark__table">
          <thead>
            <tr>
              <th scope="col">Period</th>
              <th scope="col">Basket</th>
              <th scope="col">Nifty 50</th>
              <th scope="col">Difference</th>
            </tr>
          </thead>
          <tbody>
            {BASKET_PERF_PERIODS.map(({ key, label, kind }) => {
              const bVal = basketReturns[key];
              const nVal = nifty[key];
              const diff = perfDiff(bVal, nVal);
              const diffClass =
                diff == null ? '' : diff > 0 ? 'is-pos' : diff < 0 ? 'is-neg' : '';
              return (
                <tr key={key}>
                  <th scope="row">
                    {label}
                    {kind === 'cagr' && key !== 'cagrSinceInception' ? ' (CAGR)' : ''}
                  </th>
                  <td>{loading ? '…' : formatPerfPct(bVal)}</td>
                  <td>{loading ? '…' : formatPerfPct(nVal)}</td>
                  <td className={diffClass}>
                    {loading ? '…' : diff == null ? '—' : formatPerfPct(diff)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(growthComparison.basket != null || growthComparison.nifty50 != null) && (
        <div className="an-basket-benchmark__growth">
          <div>
            <span>Growth of ₹1,00,000 — Basket</span>
            <strong>
              {loading
                ? '…'
                : growthComparison.basket != null
                  ? `₹${growthComparison.basket.toLocaleString('en-IN')}`
                  : '—'}
            </strong>
          </div>
          <div>
            <span>Growth of ₹1,00,000 — Nifty 50</span>
            <strong>
              {loading
                ? '…'
                : growthComparison.nifty50 != null
                  ? `₹${growthComparison.nifty50.toLocaleString('en-IN')}`
                  : '—'}
            </strong>
          </div>
        </div>
      )}
    </section>
  );
}
