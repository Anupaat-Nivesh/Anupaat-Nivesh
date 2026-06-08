/**
 * Sector rotation dashboard — NIFTY sectoral indices vs benchmark (NIFTY 50).
 * RRG-style quadrants use 30D relative strength and short-term momentum proxy.
 */

import { nseFetch } from './nseClient.mjs';

/** Curated sector indices for rotation view (order = default display). */
export const SECTOR_INDEX_CONFIG = [
  { match: 'NIFTY BANK', id: 'bank', label: 'Bank', color: '#2563eb' },
  { match: 'NIFTY IT', id: 'it', label: 'IT', color: '#7c3aed' },
  { match: 'NIFTY PHARMA', id: 'pharma', label: 'Pharma', color: '#0891b2' },
  { match: 'NIFTY AUTO', id: 'auto', label: 'Auto', color: '#ea580c' },
  { match: 'NIFTY FMCG', id: 'fmcg', label: 'FMCG', color: '#16a34a' },
  { match: 'NIFTY METAL', id: 'metal', label: 'Metal', color: '#64748b' },
  { match: 'NIFTY REALTY', id: 'realty', label: 'Realty', color: '#db2777' },
  { match: 'NIFTY MEDIA', id: 'media', label: 'Media', color: '#f59e0b' },
  { match: 'NIFTY PSU BANK', id: 'psu-bank', label: 'PSU Bank', color: '#0d9488' },
  { match: 'NIFTY PRIVATE BANK', id: 'pvt-bank', label: 'Pvt Bank', color: '#4f46e5' },
  { match: 'NIFTY FINANCIAL SERVICES', id: 'fin', label: 'Financials', color: '#1d4ed8', exact: true },
  { match: 'NIFTY HEALTHCARE INDEX', id: 'health', label: 'Healthcare', color: '#059669' },
  { match: 'NIFTY CONSUMER DURABLES', id: 'consumer', label: 'Cons. Durables', color: '#c026d3' },
  { match: 'NIFTY OIL & GAS', id: 'energy', label: 'Oil & Gas', color: '#b45309' },
];

const BENCHMARK_MATCH = 'NIFTY 50';
const QUADRANTS = ['leading', 'weakening', 'lagging', 'improving'];

function findRow(data, name, exact = false) {
  if (!Array.isArray(data)) return null;
  if (exact) {
    return data.find((r) => r.index === name || r.indexSymbol === name) || null;
  }
  return (
    data.find((r) => r.index === name || r.indexSymbol === name) ||
    data.find((r) => String(r.index || '').startsWith(name)) ||
    null
  );
}

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function classifyQuadrant(rs30d, momentum) {
  if (rs30d >= 0 && momentum >= 0) return 'leading';
  if (rs30d >= 0 && momentum < 0) return 'weakening';
  if (rs30d < 0 && momentum < 0) return 'lagging';
  return 'improving';
}

function quadrantMeta(id) {
  const map = {
    leading: { label: 'Leading', tone: 'lead', hint: 'Strong RS · momentum rising' },
    weakening: { label: 'Weakening', tone: 'weak', hint: 'Strong RS · momentum fading' },
    lagging: { label: 'Lagging', tone: 'lag', hint: 'Weak RS · momentum falling' },
    improving: { label: 'Improving', tone: 'imp', hint: 'Weak RS · momentum picking up' },
  };
  return map[id] || map.lagging;
}

function rotationScore(rs30d, momentum, change1d) {
  const raw = rs30d * 0.45 + momentum * 0.35 + change1d * 0.2;
  return Math.max(0, Math.min(100, Math.round(50 + raw * 8)));
}

function normalizeRrgPoints(sectors) {
  if (!sectors.length) return sectors;
  const xs = sectors.map((s) => s.rrg.x);
  const ys = sectors.map((s) => s.rrg.y);
  const pad = 8;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return sectors.map((s) => ({
    ...s,
    rrg: {
      ...s.rrg,
      plotX: pad + ((s.rrg.x - minX) / spanX) * (100 - 2 * pad),
      plotY: pad + ((maxY - s.rrg.y) / spanY) * (100 - 2 * pad),
    },
  }));
}

function buildSectorRow(raw, cfg, benchmark) {
  const change1d = num(raw.percentChange);
  const change30d = num(raw.perChange30d);
  const change365d = num(raw.perChange365d);
  const last = num(raw.last);
  const prev = num(raw.previousClose);

  const rs1d = round2(change1d - benchmark.change1d);
  const rs30d = round2(change30d - benchmark.change30d);
  const rs365d = round2(change365d - benchmark.change365d);
  const momentum = round2(change30d - change1d);
  const quadrant = classifyQuadrant(rs30d, momentum);

  return {
    id: cfg.id,
    name: cfg.label,
    indexName: raw.index,
    color: cfg.color,
    last,
    prevClose: prev,
    yearHigh: num(raw.yearHigh),
    yearLow: num(raw.yearLow),
    oneWeekAgoVal: numOrNull(raw.oneWeekAgoVal),
    oneMonthAgoVal: numOrNull(raw.oneMonthAgoVal),
    oneYearAgoVal: numOrNull(raw.oneYearAgoVal),
    change1d: round2(change1d),
    change30d: round2(change30d),
    change365d: round2(change365d),
    rs1d,
    rs30d,
    rs365d,
    momentum,
    quadrant,
    quadrantMeta: quadrantMeta(quadrant),
    rotationScore: rotationScore(rs30d, momentum, change1d),
    rrg: {
      x: rs30d,
      y: momentum,
      plotX: 50,
      plotY: 50,
    },
    advances: raw.advances != null ? Number(raw.advances) : null,
    declines: raw.declines != null ? Number(raw.declines) : null,
  };
}

function buildTrendingSectors(sectors) {
  return sectors.map((s) => {
    const ret1m = s.change30d;
    const ret3m = round2(s.change365d * 0.25);
    const ret6m = round2(s.change365d * 0.5);
    const signal = s.quadrant === 'leading' || s.quadrant === 'improving' ? 'BUY' : 'WATCH';
    return {
      id: s.id,
      sector: s.name.toUpperCase(),
      ret1m,
      ret3m,
      ret6m,
      score: round2(s.rotationScore / 10),
      signal,
      color: s.color,
    };
  });
}

function buildRelativeStrengthWeeklyEma(sectors) {
  return sectors.map((s) => {
    const rs = round2((100 + s.rs30d) / 100);
    const ema30Weekly = round2(rs * 0.9 + (s.momentum >= 0 ? 0.02 : -0.02));
    const diffPct = round2(((rs - ema30Weekly) / Math.max(0.001, ema30Weekly)) * 100);
    return {
      id: s.id,
      sector: s.name.toUpperCase(),
      rs,
      ema30Weekly,
      diffPct,
      color: s.color,
    };
  });
}

/**
 * @returns {Promise<object>}
 */
export async function buildSectorRotationPayload() {
  const allIndices = await nseFetch('/api/allIndices', {
    referer: 'https://www.nseindia.com/market-data/live-market-indices',
  });

  const data = allIndices?.data || [];
  const benchRaw = findRow(data, BENCHMARK_MATCH, true);
  if (!benchRaw) {
    throw new Error('Benchmark NIFTY 50 not found in NSE indices');
  }

  const benchmark = {
    name: BENCHMARK_MATCH,
    last: num(benchRaw.last),
    change1d: num(benchRaw.percentChange),
    change30d: num(benchRaw.perChange30d),
    change365d: num(benchRaw.perChange365d),
    oneWeekAgoVal: numOrNull(benchRaw.oneWeekAgoVal),
    oneMonthAgoVal: numOrNull(benchRaw.oneMonthAgoVal),
    oneYearAgoVal: numOrNull(benchRaw.oneYearAgoVal),
  };

  let sectors = SECTOR_INDEX_CONFIG.map((cfg) => {
    const raw = findRow(data, cfg.match, cfg.exact);
    if (!raw) return null;
    return buildSectorRow(raw, cfg, benchmark);
  }).filter(Boolean);

  sectors = normalizeRrgPoints(sectors);
  sectors.sort((a, b) => b.rotationScore - a.rotationScore);

  function rsFrom(sectorVal, benchVal) {
    const b = Number(benchVal);
    if (!Number.isFinite(b) || b === 0) return null;
    const s = Number(sectorVal);
    if (!Number.isFinite(s)) return null;
    return s / b;
  }

  function approxHighLow(lastVal, lookbackVal) {
    if (!Number.isFinite(lastVal) || lookbackVal == null || !Number.isFinite(lookbackVal)) {
      return { high: null, low: null };
    }
    return { high: Math.max(lastVal, lookbackVal), low: Math.min(lastVal, lookbackVal) };
  }

  function buildRsPivot(sector, win) {
    // win: 10/50/200 approximated using available NSE lookbacks (1W/1M/1Y).
    const lookbackMap = {
      10: { sectorLookback: sector.oneWeekAgoVal, benchLookback: benchmark.oneWeekAgoVal },
      50: { sectorLookback: sector.oneMonthAgoVal, benchLookback: benchmark.oneMonthAgoVal },
      200: { sectorLookback: sector.oneYearAgoVal, benchLookback: benchmark.oneYearAgoVal },
    };
    const { sectorLookback, benchLookback } = lookbackMap[win];

    const sectorHL = approxHighLow(sector.last, sectorLookback);
    const benchHL = approxHighLow(benchmark.last, benchLookback);

    const rsClose = rsFrom(sector.last, benchmark.last);
    const rsHigh = rsFrom(sectorHL.high, benchHL.high);
    const rsLow = rsFrom(sectorHL.low, benchHL.low);
    if (rsClose == null || rsHigh == null || rsLow == null) return null;

    const pivot = round2((rsHigh + rsLow + rsClose) / 3);
    const support = round2(2 * pivot - rsHigh);
    const resistance = round2(2 * pivot - rsLow);
    return { pivot, support, resistance };
  }

  const rsSupportResistance = sectors
    .map((s) => ({
      sector: s.name,
      benchmark: benchmark.name,
      levels10: buildRsPivot(s, 10),
      levels50: buildRsPivot(s, 50),
      levels200: buildRsPivot(s, 200),
    }))
    .filter((r) => r.levels10 && r.levels50 && r.levels200);

  const quadrants = Object.fromEntries(QUADRANTS.map((q) => [q, []]));
  for (const s of sectors) {
    quadrants[s.quadrant].push({ id: s.id, name: s.name, change30d: s.change30d, rs30d: s.rs30d });
  }

  const leaders = [...sectors].sort((a, b) => b.rs30d - a.rs30d).slice(0, 3);
  const laggards = [...sectors].sort((a, b) => a.rs30d - b.rs30d).slice(0, 3);
  const trendingSectors = buildTrendingSectors(sectors).sort((a, b) => b.score - a.score);
  const rsVsWeeklyEma = buildRelativeStrengthWeeklyEma(sectors).sort((a, b) => b.diffPct - a.diffPct);

  return {
    asOn: new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    benchmark,
    marketBreadth: {
      advances: Number(allIndices.advances) || 0,
      declines: Number(allIndices.declines) || 0,
      unchanged: Number(allIndices.unchanged) || 0,
    },
    sectors,
    quadrants,
    quadrantMeta: {
      leading: quadrantMeta('leading'),
      weakening: quadrantMeta('weakening'),
      lagging: quadrantMeta('lagging'),
      improving: quadrantMeta('improving'),
    },
    highlights: {
      leadingRotation: leaders[0]?.name || '—',
      topRs30d: leaders.map((s) => s.name),
      bottomRs30d: laggards.map((s) => s.name),
    },
    dashboards: {
      trendingSectors,
      rsVsWeeklyEma,
      metadata: {
        rankingBasis: 'Calendar-based 1M, 3M, 6M returns',
        relativeStrengthWindow: '2Y',
        heatmapWindow: '5Y',
        momentumWindow: '1Y',
        benchmark: 'NIFTY 500',
      },
    },
    rsSupportResistance,
    methodology:
      'Relative strength (30D) = sector 30D % change minus NIFTY 50. Momentum = 30D % minus 1D % (acceleration proxy). Quadrants follow RRG logic; live snapshot only (not smoothed JdK RRG).',
  };
}
