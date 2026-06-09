/**
 * Synthetic basket NAV engine — weighted normalized scheme NAVs (launch = 100).
 * Metrics computed from basket NAV history, not hardcoded factsheet returns.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { fetchMfapiScheme } from './mfNavMetrics.mjs';
import {
  loadBasketAnalyticsStore,
  loadBasketAnalyticsStoreSync,
  saveBasketAnalyticsStore,
} from './basketAnalyticsStore.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '../data');
const MASTER_PATH = join(DATA_DIR, 'basketMaster.json');

const RISK_FREE = 6.5;
const TRADING_DAYS = 252;

function parseMfDate(str) {
  const [d, m, y] = String(str).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function sortNavSeries(data) {
  return [...(data || [])]
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

function round1(n) {
  return n == null || Number.isNaN(n) ? null : Math.round(n * 10) / 10;
}

function round2(n) {
  return n == null || Number.isNaN(n) ? null : Math.round(n * 100) / 100;
}

function periodReturn(series, days) {
  if (series.length < 2) return null;
  const end = series[series.length - 1];
  const startDate = new Date(end.date);
  startDate.setDate(startDate.getDate() - days);
  const startNav = findNavOnOrBefore(series, startDate);
  if (!startNav || startNav <= 0) return null;
  return round2(((end.nav - startNav) / startNav) * 100);
}

function cagrBetween(startNav, endNav, years) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  return round2(((endNav / startNav) ** (1 / years) - 1) * 100);
}

function computeReturns(navSeries) {
  if (!navSeries?.length) return {};
  const latest = navSeries[navSeries.length - 1];
  const first = navSeries[0];
  const yearsSince = Math.max((latest.date - first.date) / (365.25 * 86400000), 1 / 365);

  const d30 = new Date(latest.date);
  d30.setMonth(d30.getMonth() - 1);
  const d90 = new Date(latest.date);
  d90.setMonth(d90.getMonth() - 3);
  const d180 = new Date(latest.date);
  d180.setMonth(d180.getMonth() - 6);
  const d365 = new Date(latest.date);
  d365.setFullYear(d365.getFullYear() - 1);
  const d3y = new Date(latest.date);
  d3y.setFullYear(d3y.getFullYear() - 3);
  const d5y = new Date(latest.date);
  d5y.setFullYear(d5y.getFullYear() - 5);

  const nav1m = findNavOnOrBefore(navSeries, d30);
  const nav3m = findNavOnOrBefore(navSeries, d90);
  const nav6m = findNavOnOrBefore(navSeries, d180);
  const nav1y = findNavOnOrBefore(navSeries, d365);
  const nav3y = findNavOnOrBefore(navSeries, d3y);
  const nav5y = findNavOnOrBefore(navSeries, d5y);

  const pct = (a, b) => (a && b ? round2(((b - a) / a) * 100) : null);

  return {
    currentNav: round2(latest.nav),
    return1m: pct(nav1m, latest.nav),
    return3m: pct(nav3m, latest.nav),
    return6m: pct(nav6m, latest.nav),
    return1y: pct(nav1y, latest.nav),
    cagr3y: nav3y ? cagrBetween(nav3y, latest.nav, 3) : null,
    cagr5y: nav5y ? cagrBetween(nav5y, latest.nav, 5) : null,
    cagrSinceInception: cagrBetween(first.nav, latest.nav, yearsSince),
    inceptionDate: dateKey(first.date),
    asOfDate: dateKey(latest.date),
    growth1Lakh: round2((latest.nav / 100) * 100000),
    growth1LakhReturn: round2(latest.nav - 100),
  };
}

function dailyReturns(navSeries) {
  const rets = [];
  for (let i = 1; i < navSeries.length; i += 1) {
    const prev = navSeries[i - 1].nav;
    const cur = navSeries[i].nav;
    if (prev > 0) rets.push((cur - prev) / prev);
  }
  return rets;
}

function stdDev(values) {
  if (!values.length) return null;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function computeRisk(navSeries) {
  const rets = dailyReturns(navSeries);
  if (!rets.length) return {};

  const dailyStd = stdDev(rets);
  const annualVol = dailyStd * Math.sqrt(TRADING_DAYS) * 100;
  const downside = rets.filter((r) => r < 0);
  const sortinoDaily = stdDev(downside);
  const annualSortinoDenom = sortinoDaily * Math.sqrt(TRADING_DAYS);

  const latest = navSeries[navSeries.length - 1];
  const first = navSeries[0];
  const years = Math.max((latest.date - first.date) / (365.25 * 86400000), 1 / 365);
  const annReturn = ((latest.nav / first.nav) ** (1 / years) - 1) * 100;

  let peak = navSeries[0].nav;
  let maxDd = 0;
  let peakIdx = 0;
  let troughIdx = 0;
  let maxPeakIdx = 0;

  navSeries.forEach((pt, i) => {
    if (pt.nav >= peak) {
      peak = pt.nav;
      peakIdx = i;
    }
    const dd = (pt.nav - peak) / peak;
    if (dd < maxDd) {
      maxDd = dd;
      troughIdx = i;
      maxPeakIdx = peakIdx;
    }
  });

  let recoveryDays = null;
  if (maxDd < 0) {
    const troughNav = navSeries[troughIdx].nav;
    for (let j = troughIdx + 1; j < navSeries.length; j += 1) {
      if (navSeries[j].nav >= navSeries[maxPeakIdx].nav) {
        recoveryDays = Math.round((navSeries[j].date - navSeries[troughIdx].date) / 86400000);
        break;
      }
    }
  }

  const sharpe = annualVol > 0 ? (annReturn - RISK_FREE) / annualVol : null;
  const sortino = annualSortinoDenom > 0 ? (annReturn - RISK_FREE) / (annualSortinoDenom * 100) : null;

  return {
    volatility: round2(annualVol),
    sharpe: round1(sharpe),
    sortino: round1(sortino),
    maxDrawdown: round2(maxDd * 100),
    recoveryDays,
    riskScore: round1(Math.min(10, Math.max(1, (sharpe || 0) * 4 + (maxDd * 100) / -5 + 5))),
  };
}

/** Align normalized scheme series on union of dates (forward-fill). */
function buildBasketNavSeries(holdings, schemeSeriesMap) {
  const weights = holdings.map((h) => h.weight / 100);

  const firstDates = holdings.map((h) => {
    const raw = schemeSeriesMap.get(h.schemeCode) || [];
    return raw.length ? raw[0].date.getTime() : 0;
  });
  const basketInception = new Date(Math.max(...firstDates));

  const normalized = holdings.map((h) => {
    const raw = schemeSeriesMap.get(h.schemeCode) || [];
    if (!raw.length) return { code: h.schemeCode, series: [] };
    const baseNav = findNavOnOrBefore(raw, basketInception);
    if (!baseNav) return { code: h.schemeCode, series: [] };
    const series = raw
      .filter((r) => r.date >= basketInception)
      .map((r) => ({
        date: r.date,
        nav: (r.nav / baseNav) * 100,
      }));
    return { code: h.schemeCode, series };
  });

  const dateSet = new Set();
  normalized.forEach((n) => n.series.forEach((r) => dateSet.add(dateKey(r.date))));
  const dates = [...dateSet].sort();

  const lastNav = new Map();
  const basketSeries = [];

  dates.forEach((dk) => {
    const d = new Date(dk);
    let allReady = true;
    let basketNav = 0;

    normalized.forEach((n, idx) => {
      const pt = n.series.find((r) => dateKey(r.date) === dk);
      if (pt) lastNav.set(n.code, pt.nav);
      if (!lastNav.has(n.code)) allReady = false;
      else basketNav += lastNav.get(n.code) * weights[idx];
    });

    if (allReady) basketSeries.push({ date: d, nav: round2(basketNav) });
  });

  return { basketSeries, inceptionDate: dateKey(basketInception) };
}

function downsampleSeries(series, maxPoints = 400) {
  if (series.length <= maxPoints) {
    return series.map((r) => ({ date: dateKey(r.date), nav: r.nav }));
  }
  const step = Math.ceil(series.length / maxPoints);
  const out = [];
  for (let i = 0; i < series.length; i += step) {
    out.push({ date: dateKey(series[i].date), nav: series[i].nav });
  }
  const last = series[series.length - 1];
  if (out[out.length - 1]?.date !== dateKey(last.date)) {
    out.push({ date: dateKey(last.date), nav: last.nav });
  }
  return out;
}

function fdSeries(inceptionDate, endDate, rate = 7) {
  const start = new Date(inceptionDate);
  const end = new Date(endDate);
  const out = [];
  let nav = 100;
  let cur = new Date(start);
  const daily = (1 + rate / 100) ** (1 / 365) - 1;
  while (cur <= end) {
    out.push({ date: dateKey(cur), nav: round2(nav) });
    nav *= 1 + daily;
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

async function fetchSchemeNav(schemeCode) {
  const json = await fetchMfapiScheme(schemeCode);
  return sortNavSeries(json.data || []);
}

function normalizeFromInception(series, inceptionDate) {
  const inc = new Date(inceptionDate);
  const base = findNavOnOrBefore(series, inc);
  if (!base) return [];
  return series
    .filter((r) => r.date >= inc)
    .map((r) => ({ date: r.date, nav: round2((r.nav / base) * 100) }));
}

export function loadBasketMaster() {
  return JSON.parse(readFileSync(MASTER_PATH, 'utf8'));
}

export function loadBasketAnalytics() {
  return loadBasketAnalyticsStoreSync();
}

export async function loadBasketAnalyticsAsync() {
  return loadBasketAnalyticsStore();
}

export async function saveBasketAnalytics(data) {
  return saveBasketAnalyticsStore(data);
}

export async function computeBasketAnalytics(basketConfig, { fetchNav = fetchSchemeNav } = {}) {
  const holdings = basketConfig.holdings || [];
  const schemeSeriesMap = new Map();

  await Promise.all(
    holdings.map(async (h) => {
      try {
        const series = await fetchNav(h.schemeCode);
        schemeSeriesMap.set(h.schemeCode, series);
      } catch (e) {
        console.warn(`NAV fetch failed ${h.schemeCode}:`, e.message);
        schemeSeriesMap.set(h.schemeCode, []);
      }
    })
  );

  const { basketSeries, inceptionDate } = buildBasketNavSeries(holdings, schemeSeriesMap);
  if (!basketSeries.length) {
    throw new Error(`No basket NAV series for ${basketConfig.id}`);
  }

  const returns = computeReturns(basketSeries);
  const risk = computeRisk(basketSeries);
  const navHistory = downsampleSeries(basketSeries);

  const benchmarks = {};
  const bm = basketConfig.benchmarks || {};
  const endDate = basketSeries[basketSeries.length - 1].date;

  if (bm.nifty50?.schemeCode) {
    try {
      const raw = await fetchNav(bm.nifty50.schemeCode);
      const norm = normalizeFromInception(raw, inceptionDate);
      benchmarks.nifty50 = {
        label: bm.nifty50.label,
        currentNav: norm.length ? norm[norm.length - 1].nav : null,
        series: downsampleSeries(norm, 200),
      };
    } catch {
      benchmarks.nifty50 = { label: bm.nifty50.label, series: [] };
    }
  }

  if (bm.nifty500?.schemeCode) {
    try {
      const raw = await fetchNav(bm.nifty500.schemeCode);
      const norm = normalizeFromInception(raw, inceptionDate);
      benchmarks.nifty500 = {
        label: bm.nifty500.label,
        currentNav: norm.length ? norm[norm.length - 1].nav : null,
        series: downsampleSeries(norm, 200),
      };
    } catch {
      benchmarks.nifty500 = { label: bm.nifty500.label, series: [] };
    }
  }

  if (bm.gold?.schemeCode) {
    try {
      const raw = await fetchNav(bm.gold.schemeCode);
      const norm = normalizeFromInception(raw, inceptionDate);
      benchmarks.gold = {
        label: bm.gold.label,
        currentNav: norm.length ? norm[norm.length - 1].nav : null,
        series: downsampleSeries(norm, 200),
      };
    } catch {
      benchmarks.gold = { label: bm.gold.label, series: [] };
    }
  }

  if (bm.fd?.rate) {
    benchmarks.fd = {
      label: bm.fd.label,
      currentNav: round2(100 * (1 + bm.fd.rate / 100) ** ((endDate - new Date(inceptionDate)) / (365.25 * 86400000))),
      series: downsampleSeries(
        fdSeries(inceptionDate, endDate, bm.fd.rate).map((r) => ({ date: new Date(r.date), nav: r.nav })),
        200
      ),
    };
  }

  return {
    basketId: basketConfig.id,
    updatedAt: new Date().toISOString(),
    inceptionDate,
    returns,
    risk,
    navHistory,
    benchmarks,
    growthComparison: {
      basket: returns.growth1Lakh,
      nifty50: benchmarks.nifty50?.currentNav ? round2((benchmarks.nifty50.currentNav / 100) * 100000) : null,
      nifty500: benchmarks.nifty500?.currentNav ? round2((benchmarks.nifty500.currentNav / 100) * 100000) : null,
      gold: benchmarks.gold?.currentNav ? round2((benchmarks.gold.currentNav / 100) * 100000) : null,
      fd: benchmarks.fd?.currentNav ? round2((benchmarks.fd.currentNav / 100) * 100000) : null,
    },
  };
}

export async function refreshAllBasketAnalytics({ basketIds } = {}) {
  const master = loadBasketMaster();
  const targets = master.baskets.filter((b) => !basketIds?.length || basketIds.includes(b.id));
  const existing = await loadBasketAnalyticsAsync();
  const store = {
    baskets: { ...(existing.baskets || {}) },
    updatedAt: new Date().toISOString(),
  };

  for (const basket of targets) {
    console.log(`Computing analytics for ${basket.id}…`);
    store.baskets[basket.id] = await computeBasketAnalytics(basket);
  }

  await saveBasketAnalytics(store);
  return store;
}

export async function getPublicAnalytics(basketId) {
  const store = await loadBasketAnalyticsAsync();
  const data = store.baskets?.[basketId];
  if (!data) return null;
  const { returns, risk, navHistory, benchmarks, growthComparison, inceptionDate, updatedAt } = data;
  return { basketId, returns, risk, navHistory, benchmarks, growthComparison, inceptionDate, updatedAt };
}

export function getPrivateHoldings(basketId) {
  const master = loadBasketMaster();
  const basket = master.baskets.find((b) => b.id === basketId);
  if (!basket) return null;
  return basket.holdings.map((h) => ({
    category: h.category,
    weight: h.weight,
    schemeName: h.schemeName,
    schemeCode: h.schemeCode,
  }));
}
