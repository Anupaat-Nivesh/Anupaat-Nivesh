/**
 * Aggregates NSE data for the Screeners hub dashboard.
 */

import { formatNseDateDdMmmYyyy, nseFetch, parseDealDate } from './nseClient.mjs';
import { SECTOR_INDEX_CONFIG } from './sectorRotationData.mjs';

/** Value in ₹ Crores: (qty × price) / 10,000,000 */
export function dealValueCr(qty, avgPrice) {
  const q = Number(String(qty).replace(/,/g, ''));
  const p = Number(avgPrice);
  if (!q || !p) return null;
  return Math.round((q * p) / 1e7 * 100) / 100;
}

export function formatInrCr(valueCr) {
  if (valueCr == null) return '—';
  return `₹ ${valueCr.toFixed(2)} Cr`;
}

export function formatInrLakh(valueCr) {
  if (valueCr == null) return '—';
  const lakhs = valueCr * 100;
  if (lakhs >= 100) return `₹ ${(lakhs / 100).toFixed(2)} Cr`;
  return `₹ ${lakhs.toFixed(2)} L`;
}

function classifyParty(clientName = '') {
  const n = String(clientName).toUpperCase().trim();
  if (!n) return 'other';
  if (/MUTUAL FUND|MF-|ASSET MANAGEMENT|AMC\b|TRUST\b.*FUND/.test(n)) return 'mf';
  if (
    /\bFPI\b|FOREIGN|L\.L\.C|LLC\b|L\.P\.|CAYMAN|MAURITIUS|SINGAPORE|HONG KONG|UBS|GOLDMAN|JPMORGAN|SMALLCAP WORLD/.test(
      n
    )
  )
    return 'fii';
  if (
    /LIMITED|LTD\.|LLP|BANK|INSURANCE|SECURITIES|BROKING|CAPITAL MARKETS|FINANCE|HOLDINGS|INVESTMENT/.test(
      n
    )
  )
    return 'dii';
  return 'promoter';
}

function normalizeDeal(raw, dealType) {
  const qty = Number(String(raw.qty || 0).replace(/,/g, ''));
  const avgPrice = Number(raw.watp || 0);
  const valueCr = dealValueCr(qty, avgPrice);
  const partyType = classifyParty(raw.clientName);
  const action = String(raw.buySell || '').toUpperCase();
  return {
    date: raw.date,
    dateObj: parseDealDate(raw.date)?.getTime() || 0,
    companyName: raw.name,
    symbol: raw.symbol,
    party: raw.clientName,
    partyType,
    action,
    dealType: dealType === 'block' ? 'BLOCK' : 'BULK',
    quantity: qty,
    avgPrice,
    valueCr,
    valueLabel: valueCr != null ? `${valueCr.toFixed(2)} Cr` : '—',
    remarks: raw.remarks || '',
    badges: [
      { text: action, tone: action === 'BUY' ? 'buy' : 'sell' },
      { text: dealType === 'block' ? 'BLOCK' : 'BULK', tone: 'muted' },
    ],
  };
}

function sentimentFromRatio(ratio) {
  if (ratio >= 1.2) return { label: 'Bullish', tone: 'bull' };
  if (ratio >= 1.05) return { label: 'Mildly Bullish', tone: 'mild-bull' };
  if (ratio >= 0.95) return { label: 'Neutral', tone: 'neutral' };
  if (ratio >= 0.8) return { label: 'Mildly Bearish', tone: 'mild-bear' };
  return { label: 'Bearish', tone: 'bear' };
}

function pct(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function findIndex(data, name) {
  if (!Array.isArray(data)) return null;
  return data.find((i) => i.index === name || i.indexSymbol === name) || null;
}

const TICKER_INDEX_NAMES = [
  'NIFTY 50',
  'NIFTY BANK',
  'NIFTY NEXT 50',
  'NIFTY MIDCAP SELECT',
  'NIFTY 100',
  'NIFTY MIDCAP 100',
  'NIFTY SMALLCAP 100',
];

export function buildIndexStrip(allIndices) {
  const data = allIndices?.data || [];
  return TICKER_INDEX_NAMES.map((name) => {
    const row = findIndex(data, name);
    if (!row || row.last == null) return null;
    const changePct = Number(row.percentChange);
    const pct = Number.isFinite(changePct) ? changePct : 0;
    return {
      id: name.replace(/\s+/g, '-').toLowerCase(),
      name,
      value: Number(row.last).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      change: Math.round(pct * 100) / 100,
      up: pct >= 0,
    };
  }).filter(Boolean);
}

export async function fetchIndexStrip() {
  const allIndices = await nseFetch('/api/allIndices');
  return buildIndexStrip(allIndices);
}

const MOVER_CATEGORIES = [
  { id: 'NIFTY', label: 'Nifty 50' },
  { id: 'BANKNIFTY', label: 'Bank Nifty' },
  { id: 'NIFTYNEXT50', label: 'Nifty Next 50' },
  { id: 'allSec', label: 'All securities' },
  { id: 'FOSec', label: 'F&O' },
];

function normalizeVariationRow(raw) {
  const ltp = Number(raw.ltp);
  const high = Number(raw.high_price);
  const low = Number(raw.low_price);
  return {
    symbol: raw.symbol,
    series: raw.series || 'EQ',
    ltp,
    prevPrice: Number(raw.prev_price),
    perChange: Number(raw.perChange),
    change: Number(raw.net_price),
    open: Number(raw.open_price),
    high,
    low,
    volume: Number(raw.trade_quantity) || 0,
    turnoverCr: Number(raw.turnover) || 0,
    atDayHigh: high > 0 && ltp >= high * 0.9995,
    atDayLow: low > 0 && ltp <= low * 1.0005,
  };
}

function normalizeActiveRow(raw) {
  return {
    symbol: raw.symbol,
    ltp: Number(raw.lastPrice),
    prevPrice: Number(raw.previousClose),
    perChange: Number(raw.pChange),
    change: Number(raw.lastPrice) - Number(raw.previousClose),
    volume: Number(raw.quantityTraded || raw.totalTradedVolume) || 0,
    turnover: Number(raw.totalTradedValue) || 0,
    high: Number(raw.dayHigh || raw.high) || null,
    low: Number(raw.dayLow || raw.low) || null,
    atDayHigh: false,
    atDayLow: false,
  };
}

function pickVariationByCategory(json, categoryId) {
  const block = json?.[categoryId];
  return (block?.data || []).map(normalizeVariationRow);
}

function mapVariationCategories(json) {
  const out = {};
  for (const { id } of MOVER_CATEGORIES) {
    out[id] = pickVariationByCategory(json, id);
  }
  return out;
}

function deriveWeek52High(rows) {
  return [...rows]
    .filter((r) => r.atDayHigh)
    .sort((a, b) => b.perChange - a.perChange)
    .slice(0, 25);
}

function deriveWeek52Low(rows) {
  return [...rows]
    .filter((r) => r.atDayLow)
    .sort((a, b) => a.perChange - b.perChange)
    .slice(0, 25);
}

async function fetchMarketMovers() {
  const refererGainers = 'https://www.nseindia.com/market-data/top-gainers-losers';
  const refererActive = 'https://www.nseindia.com/market-data/most-active-equities';

  const [gainersJson, losersJson, volumeJson] = await Promise.all([
    nseFetch('/api/live-analysis-variations?index=gainers', { referer: refererGainers }),
    nseFetch('/api/live-analysis-variations?index=loosers', { referer: refererGainers }),
    nseFetch('/api/live-analysis-most-active-securities?index=volume', { referer: refererActive }),
  ]);

  const gainers = mapVariationCategories(gainersJson);
  const losers = mapVariationCategories(losersJson);
  const topVolume = (volumeJson?.data || []).map(normalizeActiveRow).slice(0, 30);

  const combinedFor52 = [
    ...gainers.allSec,
    ...losers.allSec,
    ...topVolume.map((r) => ({ ...r, high: r.high ?? r.ltp, low: r.low ?? r.ltp })),
  ];
  const bySymbol = new Map();
  for (const row of combinedFor52) {
    if (!row.symbol) continue;
    const prev = bySymbol.get(row.symbol);
    if (!prev || Math.abs(row.perChange) > Math.abs(prev.perChange || 0)) {
      bySymbol.set(row.symbol, row);
    }
  }
  const universe = [...bySymbol.values()];

  return {
    categories: MOVER_CATEGORIES,
    defaultCategory: 'allSec',
    gainers,
    losers,
    topVolume,
    week52High: deriveWeek52High(universe),
    week52Low: deriveWeek52Low(universe),
    week52Note:
      'Stocks trading at or near the session high/low (NSE live). For the official 52-week list, see NSE market data.',
  };
}

function buildMarketBreadth(allIndices, movers) {
  const advances = Number(allIndices.advances) || 0;
  const declines = Number(allIndices.declines) || 0;
  const unchanged = Number(allIndices.unchanged) || 0;
  const total = advances + declines + unchanged;
  const ratio = declines > 0 ? Math.round((advances / declines) * 100) / 100 : advances;
  const cat = movers?.defaultCategory || 'allSec';
  return {
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    advances,
    declines,
    unchanged,
    total,
    advanceDeclineRatio: ratio,
    advancesPct: pct(advances, total),
    declinesPct: pct(declines, total),
    unchangedPct: pct(unchanged, total),
    sentiment: sentimentFromRatio(ratio),
    drillDown: {
      advances: (movers?.gainers?.[cat] || []).slice(0, 25),
      declines: (movers?.losers?.[cat] || []).slice(0, 25),
      advancesLabel: `Top gainers (${MOVER_CATEGORIES.find((c) => c.id === cat)?.label || cat})`,
      declinesLabel: `Top losers (${MOVER_CATEGORIES.find((c) => c.id === cat)?.label || cat})`,
      unchangedNote:
        'NSE does not publish a live list of unchanged stocks. Count reflects all listed equities vs gainers/losers.',
    },
  };
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function moodLabel(score) {
  if (score >= 75) return { label: 'Strong bullish', tone: 'bull' };
  if (score >= 60) return { label: 'Bullish', tone: 'mild-bull' };
  if (score >= 45) return { label: 'Neutral', tone: 'neutral' };
  if (score >= 30) return { label: 'Bearish', tone: 'mild-bear' };
  return { label: 'Strong bearish', tone: 'bear' };
}

function greedFearZone(score) {
  if (score >= 75) return { label: 'Extreme Greed', tone: 'extreme-greed', zone: 'greed' };
  if (score >= 55) return { label: 'Greed', tone: 'greed', zone: 'greed' };
  if (score >= 45) return { label: 'Neutral', tone: 'neutral', zone: 'neutral' };
  if (score >= 25) return { label: 'Fear', tone: 'fear', zone: 'fear' };
  return { label: 'Extreme Fear', tone: 'extreme-fear', zone: 'fear' };
}

/** Shared NSE inputs for composite mood + greed/fear MMI. */
function buildMmiInputs(allIndices, movers, breadth) {
  const nifty = findIndex(allIndices?.data || [], 'NIFTY 50');
  const broadGainers = movers?.gainers?.allSec || [];
  const broadLosers = movers?.losers?.allSec || [];
  const topVolume = movers?.topVolume || [];

  const volumeBullishShare = topVolume.length
    ? topVolume.filter((r) => Number(r.perChange) >= 0).length / topVolume.length
    : 0.5;
  const breadthRatio = breadth?.advanceDeclineRatio || 1;
  const breadthComponent = clamp(((breadthRatio - 0.6) / 1.2) * 100, 0, 100);
  const intradayComponent = clamp((Number(nifty?.percentChange || 0) + 2) * 25, 0, 100);
  const weeklyComponent = clamp((Number(nifty?.perChange30d || 0) + 10) * 5, 0, 100);
  const monthlyComponent = clamp((Number(nifty?.perChange365d || 0) + 20) * 2.2, 0, 100);
  const moverSkew = clamp(
    ((broadGainers.length - broadLosers.length) / Math.max(1, broadGainers.length + broadLosers.length)) * 50 + 50,
    0,
    100
  );
  const volumeComponent = clamp(volumeBullishShare * 100, 0, 100);

  return {
    hourlyRaw: 0.35 * intradayComponent + 0.4 * breadthComponent + 0.25 * volumeComponent,
    weeklyRaw: 0.45 * weeklyComponent + 0.35 * breadthComponent + 0.2 * moverSkew,
    monthlyRaw: 0.6 * monthlyComponent + 0.2 * weeklyComponent + 0.2 * breadthComponent,
    greedFearHourly: 0.3 * intradayComponent + 0.35 * breadthComponent + 0.2 * volumeComponent + 0.15 * moverSkew,
    greedFearWeekly: 0.4 * weeklyComponent + 0.3 * breadthComponent + 0.2 * moverSkew + 0.1 * volumeComponent,
    greedFearMonthly: 0.5 * monthlyComponent + 0.25 * weeklyComponent + 0.15 * breadthComponent + 0.1 * moverSkew,
  };
}

function buildMarketMoodIndex(allIndices, movers, breadth) {
  const { hourlyRaw, weeklyRaw, monthlyRaw } = buildMmiInputs(allIndices, movers, breadth);

  const make = (key, scoreRaw) => {
    const score = Math.round(clamp(scoreRaw, 0, 100));
    return {
      key,
      score,
      ...moodLabel(score),
    };
  };

  const schedules = {
    hourly: make('hourly', hourlyRaw),
    weekly: make('weekly', weeklyRaw),
    monthly: make('monthly', monthlyRaw),
  };

  return {
    id: 'composite',
    title: 'Market mood index',
    defaultSchedule: 'hourly',
    schedules,
    methodology:
      'Composite mood score (0–100) from NIFTY momentum, advance–decline breadth, and mover/volume skew. Directional context only — not a trading signal.',
  };
}

function buildGreedFearIndex(allIndices, movers, breadth) {
  const { greedFearHourly, greedFearWeekly, greedFearMonthly } = buildMmiInputs(allIndices, movers, breadth);

  const make = (key, scoreRaw) => {
    const score = Math.round(clamp(scoreRaw, 0, 100));
    return {
      key,
      score,
      ...greedFearZone(score),
    };
  };

  const schedules = {
    hourly: make('hourly', greedFearHourly),
    weekly: make('weekly', greedFearWeekly),
    monthly: make('monthly', greedFearMonthly),
  };

  return {
    id: 'greed-fear',
    title: 'Greed / Fear index',
    defaultSchedule: 'hourly',
    schedules,
    zones: [
      { min: 0, max: 25, label: 'Extreme Fear' },
      { min: 25, max: 45, label: 'Fear' },
      { min: 45, max: 55, label: 'Neutral' },
      { min: 55, max: 75, label: 'Greed' },
      { min: 75, max: 100, label: 'Extreme Greed' },
    ],
    methodology:
      'Fear & greed score (0–100) from live breadth, NIFTY momentum, volume bias, and gainer/loser skew. Higher = greed zone; lower = fear zone.',
  };
}

function buildMarketSnapshot(allIndices, movers, marketOverview) {
  const breadth = buildMarketBreadth(allIndices, movers);
  return {
    breadth,
    movers,
    indices: marketOverview?.indices || [],
    moodIndex: buildMarketMoodIndex(allIndices, movers, breadth),
    greedFearIndex: buildGreedFearIndex(allIndices, movers, breadth),
  };
}

function buildMarketOverview(allIndices) {
  const indices = ['NIFTY 50', 'NIFTY NEXT 50'].map((name) => {
    const row = findIndex(allIndices.data, name);
    if (!row) return { name, ok: false };
    const last = Number(row.last);
    const prev = Number(row.previousClose);
    const change = last - prev;
    const changePct = Number(row.percentChange) ?? (prev ? (change / prev) * 100 : 0);
    return {
      ok: true,
      name,
      last,
      change,
      changePct,
      up: change >= 0,
      open: Number(row.open),
      high: Number(row.high),
      low: Number(row.low),
      previousClose: prev,
      yearHigh: Number(row.yearHigh),
      yearLow: Number(row.yearLow),
      perChange30d: Number(row.perChange30d),
      perChange365d: Number(row.perChange365d),
      date365dAgo: row.date365dAgo,
      advances: row.advances,
      declines: row.declines,
      unchanged: row.unchanged,
    };
  });
  return { indices };
}

function aggregateStockInsights(deals) {
  const bySymbol = new Map();
  const byParty = new Map();

  for (const d of deals) {
    const sym = d.symbol;
    if (!bySymbol.has(sym)) {
      bySymbol.set(sym, { symbol: sym, companyName: d.companyName, valueCr: 0, count: 0 });
    }
    const s = bySymbol.get(sym);
    s.valueCr += d.valueCr || 0;
    s.count += 1;

    const party = d.party;
    if (!byParty.has(party)) byParty.set(party, { party, partyType: d.partyType, valueCr: 0, count: 0 });
    const p = byParty.get(party);
    p.valueCr += d.valueCr || 0;
    p.count += 1;
  }

  const topDeals = [...bySymbol.values()]
    .sort((a, b) => b.valueCr - a.valueCr)
    .slice(0, 3)
    .map((r) => ({
      companyName: r.companyName,
      symbol: r.symbol,
      dealsValue: formatInrCr(r.valueCr),
      valueCr: r.valueCr,
    }));

  const insiderTrades = deals
    .filter((d) => d.partyType === 'promoter')
    .sort((a, b) => b.valueCr - a.valueCr)
    .slice(0, 3)
    .map((d) => ({
      companyName: d.companyName,
      symbol: d.symbol,
      dealsValue: formatInrCr(d.valueCr),
      valueCr: d.valueCr,
    }));

  const leadingInvestors = [...byParty.values()]
    .filter((p) => p.partyType === 'mf')
    .sort((a, b) => b.valueCr - a.valueCr)
    .slice(0, 3)
    .map((p) => ({
      companyName: p.party.toUpperCase(),
      symbol: '',
      dealsValue: formatInrCr(p.valueCr),
      valueCr: p.valueCr,
    }));

  return { topDeals, insiderTrades, leadingInvestors };
}

function buildDeliveryInsights(deals) {
  const bySymbol = new Map();
  for (const d of deals) {
    if (!bySymbol.has(d.symbol)) {
      bySymbol.set(d.symbol, {
        symbol: d.symbol,
        companyName: d.companyName,
        dealCount: 0,
        totalQty: 0,
        valueCr: 0,
        minDate: d.dateObj,
        maxDate: d.dateObj,
      });
    }
    const s = bySymbol.get(d.symbol);
    s.dealCount += 1;
    s.totalQty += d.quantity;
    s.valueCr += d.valueCr || 0;
    s.minDate = Math.min(s.minDate, d.dateObj);
    s.maxDate = Math.max(s.maxDate, d.dateObj);
  }

  const formatVol = (qty) => {
    if (qty >= 1e7) return `${(qty / 1e7).toFixed(2)} Cr.`;
    if (qty >= 1e5) return `${(qty / 1e5).toFixed(2)} L.`;
    return qty.toLocaleString('en-IN');
  };

  const fmtRange = (min, max) => {
    const f = (t) =>
      t
        ? new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
        : '—';
    return `${f(min)} - ${f(max)}`;
  };

  const ranked = [...bySymbol.values()].sort((a, b) => b.dealCount - a.dealCount);
  const activeStocks = ranked.slice(0, 3).map((s) => ({
    companyName: s.companyName,
    symbol: s.symbol,
    deals: s.dealCount,
  }));

  const byVolume = [...bySymbol.values()].sort((a, b) => b.totalQty - a.totalQty);
  const mapBreakout = (list) =>
    list.slice(0, 3).map((s) => ({
      companyName: s.companyName,
      symbol: s.symbol,
      totalVolume: formatVol(s.totalQty),
      dateRange: fmtRange(s.minDate, s.maxDate),
      endDate: fmtRange(s.maxDate, s.maxDate).split(' - ')[1] || '—',
    }));

  return {
    activeStocks,
    deliveryBreakout: mapBreakout(byVolume),
    volumeBreakout: mapBreakout([...byVolume].sort((a, b) => b.valueCr - a.valueCr)),
    note: 'Volumes derived from NSE bulk/block deal quantities (proxy, not exchange delivery %).',
  };
}

function buildRecentActivity(deals) {
  const parties = [...new Set(deals.map((d) => d.party))].slice(0, 20);
  const defaultParty = parties[0] || '';

  const recentBets = deals
    .filter((d) => d.partyType === 'promoter' || d.partyType === 'dii')
    .sort((a, b) => b.dateObj - a.dateObj)
    .slice(0, 5)
    .map((d) => ({
      companyName: d.companyName,
      symbol: d.symbol,
      action: d.action,
      date: d.date,
      dealValue: d.valueCr != null && d.valueCr < 1 ? formatInrLakh(d.valueCr) : formatInrCr(d.valueCr),
      party: d.party,
      valueCr: d.valueCr,
    }));

  const recentBigBuys = deals
    .filter((d) => d.action === 'BUY')
    .sort((a, b) => b.valueCr - a.valueCr)
    .slice(0, 5)
    .map((d) => ({
      companyName: d.companyName,
      symbol: d.symbol,
      dealValue: formatInrCr(d.valueCr),
      valueCr: d.valueCr,
    }));

  return { parties, defaultParty, recentBets, recentBigBuys };
}

function filterOrderBookAnnouncements(rows) {
  return (rows || [])
    .filter((a) => {
      const text = `${a.attchmntText || ''} ${a.desc || ''}`.toLowerCase();
      return /purchase order|order book|receipt of order|work order|contract award|bagged order/.test(text);
    })
    .slice(0, 50)
    .map((a) => ({
      newsDate: a.an_dt?.split(' ')[0] || a.an_dt,
      companyName: a.sm_name,
      symbol: a.symbol,
      headline: a.attchmntText || a.desc,
      issuerEntity: a.sm_name,
      issuerType: 'Domestic Entity',
      orderSize: (a.attchmntText || a.desc || '').slice(0, 120),
      timePeriod: 'As per filing',
      filingUrl: a.attchmntFile,
    }));
}

function formatPctChange(pct) {
  if (pct == null || !Number.isFinite(Number(pct))) return '—';
  const n = Number(pct);
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function formatNetCr(netCr) {
  if (netCr == null || !Number.isFinite(netCr)) return '—';
  const abs = Math.abs(netCr);
  const label = abs >= 1 ? `${abs.toFixed(2)} Cr` : `${(abs * 100).toFixed(0)} L`;
  return `${netCr >= 0 ? '+' : '-'}₹${label}`;
}

function aggregateInstitutionalFlow(deals, partyType) {
  const list = deals.filter((d) => d.partyType === partyType);
  let buyCr = 0;
  let sellCr = 0;
  const netByDay = new Map();

  for (const d of list) {
    const v = d.valueCr || 0;
    if (d.action === 'BUY') buyCr += v;
    else if (d.action === 'SELL') sellCr += v;

    const day = new Date(d.dateObj);
    day.setHours(0, 0, 0, 0);
    const key = day.getTime();
    const prev = netByDay.get(key) || 0;
    netByDay.set(key, prev + (d.action === 'BUY' ? v : -v));
  }

  const netCr = Math.round((buyCr - sellCr) * 100) / 100;
  const dayKeys = [...netByDay.keys()].sort((a, b) => a - b);
  const latestDayKey = dayKeys[dayKeys.length - 1];
  const prevDayKey = dayKeys[dayKeys.length - 2];
  const latestDayNet =
    latestDayKey != null ? Math.round((netByDay.get(latestDayKey) || 0) * 100) / 100 : 0;
  const prevDayNet = prevDayKey != null ? Math.round((netByDay.get(prevDayKey) || 0) * 100) / 100 : 0;
  const dayJump = Math.round((latestDayNet - prevDayNet) * 100) / 100;

  return {
    buyCr: Math.round(buyCr * 100) / 100,
    sellCr: Math.round(sellCr * 100) / 100,
    netCr,
    latestDayNet,
    prevDayNet,
    dayJump,
    dealCount: list.length,
    latest: list[0] || null,
  };
}

function formatIndexPrice(n) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatJumpLabel(dayJump, prevDayNet) {
  const jump = formatNetCr(dayJump);
  if (!prevDayNet || !Number.isFinite(prevDayNet) || prevDayNet === 0) return jump;
  const pct = Math.round((dayJump / Math.abs(prevDayNet)) * 1000) / 10;
  return `${jump} (${pct >= 0 ? '+' : ''}${pct}% vs prior)`;
}

function truncateParty(name, max = 32) {
  const s = String(name || '').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

function chartFromValues(entries, legend) {
  const items = (entries || []).filter((e) => e && Number.isFinite(e.value));
  if (!items.length) return null;
  const maxAbs = Math.max(...items.map((e) => Math.abs(e.value)), 0.01);
  return {
    legend,
    items: items.map((e) => ({
      label: e.label,
      height: Math.round(28 + (Math.abs(e.value) / maxAbs) * 62),
      up: e.value >= 0,
    })),
  };
}

function flowChart(buyCr, sellCr, legend) {
  const total = buyCr + sellCr;
  if (!total) return null;
  const buyPct = Math.round((buyCr / total) * 100);
  return {
    legend,
    items: [
      { label: 'Buy', height: Math.max(20, buyPct), up: true },
      { label: 'Sell', height: Math.max(20, 100 - buyPct), up: false },
    ],
  };
}

function findSectorRow(data, cfg) {
  if (!Array.isArray(data)) return null;
  if (cfg.exact) {
    return data.find((r) => r.index === cfg.match || r.indexSymbol === cfg.match) || null;
  }
  return (
    data.find((r) => r.index === cfg.match || r.indexSymbol === cfg.match) ||
    data.find((r) => String(r.index || '').startsWith(cfg.match)) ||
    null
  );
}

function buildHeroCarousel({ allIndices, deals, marketSnapshot, marketOverview, movers, indexStrip }) {
  const asOn = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const nifty50 = marketOverview?.indices?.find((i) => i.ok && i.name === 'NIFTY 50');
  const niftyBank = findIndex(allIndices?.data || [], 'NIFTY BANK');
  const breadth = marketSnapshot?.breadth;
  const mood = marketSnapshot?.moodIndex?.schedules?.hourly;
  const greedFear = marketSnapshot?.greedFearIndex?.schedules?.hourly;

  const fii = aggregateInstitutionalFlow(deals, 'fii');
  const dii = aggregateInstitutionalFlow(deals, 'dii');
  const mf = aggregateInstitutionalFlow(deals, 'mf');

  const sectorRows = SECTOR_INDEX_CONFIG.map((cfg) => {
    const raw = findSectorRow(allIndices?.data || [], cfg);
    if (!raw) return null;
    return {
      label: cfg.label,
      change1d: Number(raw.percentChange) || 0,
      change30d: Number(raw.perChange30d) || 0,
    };
  }).filter(Boolean);

  const sorted1d = [...sectorRows].sort((a, b) => b.change1d - a.change1d);
  const sorted30d = [...sectorRows].sort((a, b) => b.change30d - a.change30d);
  const topSector1d = sorted1d[0];
  const bottomSector1d = sorted1d[sorted1d.length - 1];
  const topSector30d = sorted30d[0];

  const topGainer = movers?.gainers?.allSec?.[0];
  const topLoser = movers?.losers?.allSec?.[0];
  const topVolume = movers?.topVolume?.[0];

  const indexChart = chartFromValues(
    (indexStrip || []).slice(0, 6).map((idx) => ({
      label: (idx.name || '').replace('NIFTY ', '').slice(0, 6),
      value: Number(idx.change) || 0,
    })),
    'Index moves (1D %)'
  );

  const sectorChart = chartFromValues(
    sorted1d.slice(0, 6).map((s) => ({
      label: s.label.slice(0, 4),
      value: s.change1d,
    })),
    'Sector heat (1D %)'
  );

  const volumeInsight = topVolume
    ? {
        kind: 'volume',
        title: 'Volume leader',
        detail: `${topVolume.symbol} · ${formatPctChange(topVolume.perChange)} · Unusual activity`,
        tag: 'LIVE',
        up: Number(topVolume.perChange) >= 0,
      }
    : topGainer
      ? {
          kind: 'volume',
          title: 'Top gainer',
          detail: `${topGainer.symbol} · ${formatPctChange(topGainer.perChange)}`,
          tag: 'NSE',
          up: true,
        }
      : {
          kind: 'breadth',
          title: 'Market breadth',
          detail: 'Awaiting mover feed',
          up: true,
        };

  const latestInstitutional = [fii.latest, dii.latest, mf.latest].filter(Boolean).sort((a, b) => b.dateObj - a.dateObj)[0];

  return {
    default: {
      badge: 'Live market pulse',
      asOn,
      primary: {
        label: 'NIFTY 50',
        value: formatIndexPrice(nifty50?.last),
        delta: formatPctChange(nifty50?.changePct),
        up: nifty50?.up !== false,
      },
      metrics: [
        {
          label: 'NIFTY Bank',
          value: formatPctChange(niftyBank?.percentChange),
          up: Number(niftyBank?.percentChange) >= 0,
        },
        {
          label: 'A/D ratio',
          value: breadth?.advanceDeclineRatio != null ? String(breadth.advanceDeclineRatio) : '—',
          up: (breadth?.advanceDeclineRatio || 0) >= 1,
        },
        {
          label: 'Breadth',
          value: breadth ? `${breadth.advances}↑ ${breadth.declines}↓` : '—',
          up: (breadth?.advances || 0) >= (breadth?.declines || 0),
        },
        {
          label: 'MMI',
          value: mood ? `${mood.score} · ${mood.label.split(' ')[0]}` : '—',
          up: (mood?.score || 0) >= 50,
        },
      ],
      insight: {
        kind: 'breadth',
        title: breadth?.sentiment?.label || 'Session sentiment',
        detail: breadth
          ? `${breadth.advances?.toLocaleString('en-IN')} advancing · ${breadth.declines?.toLocaleString('en-IN')} declining`
          : volumeInsight.detail,
        tag: breadth?.advanceDeclineRatio != null ? `A/D ${breadth.advanceDeclineRatio}` : 'LIVE',
        up: breadth?.sentiment?.tone === 'bull' || breadth?.sentiment?.tone === 'mild-bull',
      },
      chart: indexChart,
      footnote: greedFear ? `Fear & Greed ${greedFear.score}/100 · ${greedFear.label}` : undefined,
    },
    growth: {
      badge: 'Smart money · 7D deals',
      asOn,
      primary: {
        label: 'FII net (7 days)',
        value: formatNetCr(fii.netCr),
        delta: `Buy ${formatInrCr(fii.buyCr)} · Sell ${formatInrCr(fii.sellCr)}`,
        up: fii.netCr >= 0,
      },
      metrics: [
        { label: 'FII today', value: formatNetCr(fii.latestDayNet), up: fii.latestDayNet >= 0 },
        { label: 'FII jump', value: formatJumpLabel(fii.dayJump, fii.prevDayNet), up: fii.dayJump >= 0 },
        { label: 'DII today', value: formatNetCr(dii.latestDayNet), up: dii.latestDayNet >= 0 },
        { label: 'DII net 7D', value: formatNetCr(dii.netCr), up: dii.netCr >= 0 },
      ],
      insight: latestInstitutional
        ? {
            kind: 'flow',
            title: `${latestInstitutional.partyType.toUpperCase()} ${latestInstitutional.action}`,
            detail: `${latestInstitutional.symbol} · ${latestInstitutional.valueLabel} · ${truncateParty(latestInstitutional.party)}`,
            tag: latestInstitutional.dealType || 'DEAL',
            up: latestInstitutional.action === 'BUY',
          }
        : {
            kind: 'flow',
            title: 'Institutional flow',
            detail: 'No bulk/block deals in the current window',
            up: true,
          },
      chart: flowChart(fii.buyCr, fii.sellCr, 'FII buy vs sell (7D)'),
      footnote: `${fii.dealCount} FII · ${dii.dealCount} DII deals (heuristic labels)`,
    },
    insight: {
      badge: 'Sector rotation',
      asOn,
      primary: {
        label: topSector1d ? `${topSector1d.label} leads` : 'Sector leader',
        value: topSector1d ? formatPctChange(topSector1d.change1d) : '—',
        delta: bottomSector1d ? `Laggard ${bottomSector1d.label} ${formatPctChange(bottomSector1d.change1d)}` : '—',
        up: (topSector1d?.change1d ?? 0) >= 0,
      },
      metrics: [
        {
          label: '30D leader',
          value: topSector30d ? `${topSector30d.label} ${formatPctChange(topSector30d.change30d)}` : '—',
          up: (topSector30d?.change30d ?? 0) >= 0,
        },
        {
          label: 'Spread 1D',
          value:
            topSector1d && bottomSector1d
              ? formatPctChange(topSector1d.change1d - bottomSector1d.change1d)
              : '—',
          up: topSector1d && bottomSector1d ? topSector1d.change1d >= bottomSector1d.change1d : true,
        },
        {
          label: 'Top gainer',
          value: topGainer ? `${topGainer.symbol} ${formatPctChange(topGainer.perChange)}` : '—',
          up: Number(topGainer?.perChange) >= 0,
        },
        {
          label: 'Top loser',
          value: topLoser ? `${topLoser.symbol} ${formatPctChange(topLoser.perChange)}` : '—',
          up: false,
        },
      ],
      insight: {
        kind: 'sector',
        title: 'Rotation signal',
        detail:
          topSector1d && bottomSector1d
            ? `${topSector1d.label} outperforming · ${bottomSector1d.label} lagging on 1D`
            : 'Scanning sector indices',
        tag: 'RRG',
        up: (topSector1d?.change1d ?? 0) > (bottomSector1d?.change1d ?? 0),
      },
      chart: sectorChart,
      footnote: greedFear ? `Market mood ${greedFear.label} (${greedFear.score})` : undefined,
    },
  };
}

function buildIpoRows(current, upcoming) {
  const rows = [...(upcoming || []), ...(current || [])];
  return rows.slice(0, 30).map((r) => ({
    stockName: r.companyName || r.symbol || r.issuetype || '—',
    symbol: r.symbol,
    startDate: r.issueStartDate || r.bidStartDate || '—',
    endDate: r.issueEndDate || r.bidEndDate || '—',
    issueType: r.issuetype || r.issueType || 'IPO',
    faceValue: r.faceValue || r.facevalue || '—',
    offerPrice: r.priceBand || r.maxPrice || r.issuePrice || '—',
    issueSize: r.issueSize || r.totalIssueSize || '—',
  }));
}

/**
 * @returns {Promise<object>}
 */
export async function buildScreenersHubPayload() {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  const fromStr = formatNseDateDdMmmYyyy(from);
  const toStr = formatNseDateDdMmmYyyy(to);

  const [allIndices, largeDeal, announcements, currentIpo, upcomingIpo, movers] = await Promise.all([
    nseFetch('/api/allIndices'),
    nseFetch('/api/snapshot-capital-market-largedeal', {
      referer: 'https://www.nseindia.com/market-data/bulk-deal',
    }),
    nseFetch(
      `/api/corporate-announcements?index=equities&from_date=${fromStr}&to_date=${toStr}`,
      { referer: 'https://www.nseindia.com/companies-listing/corporate-filings-announcements' }
    ).catch(() => []),
    nseFetch('/api/ipo-current-issue').catch(() => []),
    nseFetch('/api/all-upcoming-issues?category=ipo').catch(() => []),
    fetchMarketMovers().catch(() => null),
  ]);

  const rawDeals = [
    ...(largeDeal.BULK_DEALS_DATA || []).map((d) => ({ ...d, _type: 'bulk' })),
    ...(largeDeal.BLOCK_DEALS_DATA || []).map((d) => ({ ...d, _type: 'block' })),
  ];
  const deals = rawDeals
    .map((d) => normalizeDeal(d, d._type))
    .filter((d) => d.valueCr != null)
    .sort((a, b) => b.dateObj - a.dateObj);

  const filterByType = (type) => deals.filter((d) => d.partyType === type);
  const marketOverview = buildMarketOverview(allIndices);
  const marketSnapshot = buildMarketSnapshot(allIndices, movers, marketOverview);
  const indexStrip = buildIndexStrip(allIndices);

  return {
    asOnDate: largeDeal.as_on_date || null,
    heroCarousel: buildHeroCarousel({
      allIndices,
      deals,
      marketSnapshot,
      marketOverview,
      movers,
      indexStrip,
    }),
    indexStrip,
    marketBreadth: buildMarketBreadth(allIndices, movers),
    marketSnapshot,
    marketMovers: movers,
    marketOverview,
    stockInsights: aggregateStockInsights(deals),
    deliveryInsights: buildDeliveryInsights(deals),
    recentActivity: buildRecentActivity(deals),
    deals: {
      all: deals.slice(0, 100),
      promoter: filterByType('promoter').slice(0, 80),
      fii: filterByType('fii').slice(0, 80),
      dii: filterByType('dii').slice(0, 80),
      mf: filterByType('mf').slice(0, 80),
    },
    orderBook: filterOrderBookAnnouncements(announcements),
    ipoIssues: buildIpoRows(currentIpo, upcomingIpo),
    filters: { fromDate: fromStr, toDate: toStr },
  };
}
