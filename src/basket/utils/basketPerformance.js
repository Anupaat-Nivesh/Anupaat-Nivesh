/** Basket-level performance period definitions (synthetic NAV). */

export const BASKET_PERF_PERIODS = [
  { key: 'return1m', label: '1 Month', kind: 'return' },
  { key: 'return3m', label: '3 Months', kind: 'return' },
  { key: 'return6m', label: '6 Months', kind: 'return' },
  { key: 'return1y', label: '1 Year', kind: 'return' },
  { key: 'cagr3y', label: '3 Years', kind: 'cagr' },
  { key: 'cagr5y', label: '5 Years', kind: 'cagr' },
  { key: 'cagrSinceInception', label: 'Since Inception', kind: 'cagr' },
];

export const BASKET_PERF_KEYS = BASKET_PERF_PERIODS.map((p) => p.key);

export function formatPerfPct(val) {
  if (val == null || Number.isNaN(val)) return '—';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val}%`;
}

function findNavOnOrBefore(series, targetDate) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].date <= targetDate) return series[i].nav;
  }
  return null;
}

function cagrBetween(startNav, endNav, years) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  return Math.round(((endNav / startNav) ** (1 / years) - 1) * 1000) / 10;
}

/**
 * Compute period returns from an indexed NAV series [{ date: 'YYYY-MM-DD', nav }].
 * Same windows as basket analytics engine.
 */
export function computeNavPeriodReturns(navHistory) {
  if (!navHistory?.length) return {};

  const series = navHistory
    .map((p) => ({ date: new Date(p.date), nav: Number(p.nav) }))
    .filter((r) => !Number.isNaN(r.nav) && r.date.getTime())
    .sort((a, b) => a.date - b.date);

  if (series.length < 2) return {};

  const latest = series[series.length - 1];
  const first = series[0];
  const yearsSince = Math.max((latest.date - first.date) / (365.25 * 86400000), 1 / 365);

  const offset = (months) => {
    const d = new Date(latest.date);
    d.setMonth(d.getMonth() - months);
    return d;
  };
  const offsetYears = (y) => {
    const d = new Date(latest.date);
    d.setFullYear(d.getFullYear() - y);
    return d;
  };

  const pct = (startNav) =>
    startNav && startNav > 0
      ? Math.round(((latest.nav - startNav) / startNav) * 10000) / 100
      : null;

  const nav3y = findNavOnOrBefore(series, offsetYears(3));
  const nav5y = findNavOnOrBefore(series, offsetYears(5));

  return {
    return1m: pct(findNavOnOrBefore(series, offset(1))),
    return3m: pct(findNavOnOrBefore(series, offset(3))),
    return6m: pct(findNavOnOrBefore(series, offset(6))),
    return1y: pct(findNavOnOrBefore(series, offsetYears(1))),
    cagr3y: nav3y ? cagrBetween(nav3y, latest.nav, 3) : null,
    cagr5y: nav5y ? cagrBetween(nav5y, latest.nav, 5) : null,
    cagrSinceInception: cagrBetween(first.nav, latest.nav, yearsSince),
  };
}

function coalescePeriodReturns(...sources) {
  const out = {};
  for (const key of BASKET_PERF_KEYS) {
    for (const src of sources) {
      if (src?.[key] != null && !Number.isNaN(src[key])) {
        out[key] = src[key];
        break;
      }
    }
    if (out[key] == null) out[key] = null;
  }
  return out;
}

/** Basket period returns: API returns → NAV history → static MVP fallback. */
export function getResolvedBasketReturns(analytics, basket) {
  const fromNav = computeNavPeriodReturns(analytics?.navHistory);
  const mvp = basket?.historicalPerformanceMvp || null;
  const periods = coalescePeriodReturns(analytics?.returns, fromNav, mvp);
  return {
    ...periods,
    asOfDate: analytics?.returns?.asOfDate ?? null,
    inceptionDate: analytics?.returns?.inceptionDate ?? analytics?.inceptionDate ?? null,
    currentNav: analytics?.returns?.currentNav ?? null,
  };
}

export function getBenchmarkReturns(analytics, benchmarkId = 'nifty50') {
  const bm = analytics?.benchmarks?.[benchmarkId];
  const fromSeries = computeNavPeriodReturns(bm?.series);
  return coalescePeriodReturns(bm?.returns, fromSeries);
}

export function perfDiff(basketVal, benchVal) {
  if (basketVal == null || benchVal == null) return null;
  return Math.round((basketVal - benchVal) * 100) / 100;
}
