/** NAV metrics from mfapi.in (server-side, mirrors src/basket/utils/mfMetrics.js). */

function parseMfDate(str) {
  const [d, m, y] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function sortNavSeries(data) {
  return [...data]
    .map((row) => ({ date: parseMfDate(row.date), nav: parseFloat(row.nav) }))
    .filter((r) => !Number.isNaN(r.nav) && r.date.getTime())
    .sort((a, b) => a.date - b.date);
}

function findNavOnOrBefore(series, targetDate) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].date <= targetDate) return series[i].nav;
  }
  return null;
}

function cagr(startNav, endNav, years) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  return Math.round(((endNav / startNav) ** (1 / years) - 1) * 1000) / 10;
}

export function computeReturnsFromNav(data) {
  const series = sortNavSeries(data || []);
  if (series.length < 2) {
    return {
      cagr1y: null,
      cagr3y: null,
      cagr5y: null,
      cagrTillDate: null,
      latestNav: null,
      navChange1d: null,
      inceptionDate: null,
      navSeries: series,
    };
  }

  const latest = series[series.length - 1];
  const prev = series[series.length - 2];
  const first = series[0];
  const now = latest.date;
  const y1 = new Date(now);
  y1.setFullYear(y1.getFullYear() - 1);
  const y3 = new Date(now);
  y3.setFullYear(y3.getFullYear() - 3);
  const y5 = new Date(now);
  y5.setFullYear(y5.getFullYear() - 5);

  const nav1y = findNavOnOrBefore(series, y1);
  const nav3y = findNavOnOrBefore(series, y3);
  const nav5y = findNavOnOrBefore(series, y5);
  const yearsSinceInception = Math.max(
    (latest.date - first.date) / (365.25 * 24 * 60 * 60 * 1000),
    1 / 365
  );

  let navChange1d = null;
  if (prev?.nav > 0) {
    navChange1d = Math.round(((latest.nav - prev.nav) / prev.nav) * 10000) / 100;
  }

  return {
    latestNav: latest.nav,
    cagr1y: nav1y ? cagr(nav1y, latest.nav, 1) : null,
    cagr3y: nav3y ? cagr(nav3y, latest.nav, 3) : null,
    cagr5y: nav5y ? cagr(nav5y, latest.nav, 5) : null,
    cagrTillDate: cagr(first.nav, latest.nav, yearsSinceInception),
    navChange1d,
    inceptionDate: first.date.toISOString().slice(0, 10),
    navSeries: series.map((r) => ({
      date: r.date.toISOString().slice(0, 10),
      nav: r.nav,
    })),
  };
}

export async function fetchMfapiScheme(schemeCode) {
  const res = await fetch(`https://api.mfapi.in/mf/${encodeURIComponent(schemeCode)}`);
  if (!res.ok) throw new Error(`mfapi.in ${res.status}`);
  return res.json();
}
