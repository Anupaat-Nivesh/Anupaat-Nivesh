/**
 * Public market snapshot for homepage ticker.
 * Proxies Yahoo Finance chart API (server-side; avoids browser CORS).
 *
 * Indices + crude from Yahoo; USD/INR from USDINR=X; gold as indicative INR per 10 g
 * from COMEX GC=F (USD/oz) × USDINR=X; silver as indicative INR per kg from SI=F the same way.
 * ~45s in-memory cache to limit upstream calls.
 */

import express from 'express';

const router = express.Router();

const UA =
  'Mozilla/5.0 (compatible; AnupaatNivesh/1.0; +https://www.anupaatnivesh.com)';

/** Troy ounces → grams (USD/oz spot → INR/g) */
const GRAMS_PER_TROY_OZ = 31.1034768;

/** Fetched in parallel; final ticker order is set in buildOrderedQuotes (Nifty → Bank Nifty → Sensex → USD/INR → Gold → Silver → WTI). */
const INSTRUMENTS = [
  { id: 'nifty', label: 'Nifty 50', symbol: '^NSEI', currency: 'INR', kind: 'index' },
  { id: 'banknifty', label: 'Bank Nifty', symbol: '^NSEBANK', currency: 'INR', kind: 'index' },
  { id: 'sensex', label: 'Sensex', symbol: '^BSESN', currency: 'INR', kind: 'index' },
  { id: 'crude', label: 'WTI Crude', sublabel: '$ / bbl', symbol: 'CL=F', currency: 'USD', kind: 'wti' },
];

/** Yahoo symbols for COMEX metals + USD/INR (same feed used for FX chip and INR/10 g math). */
const FUTURES_FX = [
  { key: 'gc', symbol: 'GC=F' },
  { key: 'si', symbol: 'SI=F' },
  { key: 'usdinr', symbol: 'USDINR=X' },
];

const CACHE_TTL_MS = 45_000;
let cache = { at: 0, payload: null };

async function fetchYahooChart(symbol) {
  const enc = encodeURIComponent(symbol);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${enc}?range=1d&interval=5m`;
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Yahoo HTTP ${res.status} ${t.slice(0, 120)}`);
  }
  const json = await res.json();
  const err = json?.chart?.error;
  if (err) throw new Error(err.description || err.code || 'Yahoo chart error');
  const result = json?.chart?.result?.[0];
  if (!result?.meta) throw new Error('No chart result');
  const m = result.meta;
  const price =
    typeof m.regularMarketPrice === 'number'
      ? m.regularMarketPrice
      : m.regularMarketPreviousClose ?? m.previousClose ?? null;
  const prev =
    typeof m.previousClose === 'number'
      ? m.previousClose
      : typeof m.chartPreviousClose === 'number'
        ? m.chartPreviousClose
        : null;
  const changePct =
    price != null && prev != null && prev !== 0
      ? ((price - prev) / prev) * 100
      : null;
  return {
    symbol,
    shortName: m.shortName || m.longName || symbol,
    currency: m.currency || 'INR',
    price,
    previousClose: prev,
    changePct,
    marketTime: typeof m.regularMarketTime === 'number' ? m.regularMarketTime : null,
  };
}

function round2(n) {
  if (n == null || Number.isNaN(n)) return null;
  return Math.round(n * 100) / 100;
}

function buildInrPer10gQuote({ id, label, sublabel, title, price, changePct, marketTime, kind = 'inrPer10gRef' }) {
  return {
    ok: true,
    id,
    label,
    sublabel,
    kind,
    symbol: id,
    shortName: title,
    displayCurrency: 'INR',
    currency: 'INR',
    price,
    previousClose: null,
    changePct,
    marketTime,
  };
}

router.get('/', async (_req, res) => {
  const now = Date.now();
  if (cache.payload && now - cache.at < CACHE_TTL_MS) {
    return res.json({ ok: true, cached: true, fetchedAt: cache.at, quotes: cache.payload });
  }

  const rowTasks = INSTRUMENTS.map((def) =>
    fetchYahooChart(def.symbol)
      .then((raw) => ({
        ok: true,
        id: def.id,
        label: def.label,
        sublabel: def.sublabel || null,
        kind: def.kind,
        ...raw,
        displayCurrency: def.currency,
      }))
      .catch((e) => ({
        ok: false,
        id: def.id,
        label: def.label,
        sublabel: def.sublabel || null,
        kind: def.kind,
        error: e?.message || 'Fetch failed',
      }))
  );

  const futuresFxTasks = FUTURES_FX.map(({ key, symbol }) =>
    fetchYahooChart(symbol)
      .then((raw) => ({ key, ok: true, raw }))
      .catch((e) => ({ key, ok: false, error: e?.message }))
  );

  const [rowResults, futuresFxResults] = await Promise.all([
    Promise.all(rowTasks),
    Promise.all(futuresFxTasks),
  ]);

  const fxMap = {};
  for (const s of futuresFxResults) {
    if (s.ok) fxMap[s.key] = s.raw;
  }

  const byId = Object.fromEntries(rowResults.map((q) => [q.id, q]));
  const usdInr = fxMap.usdinr;
  const gc = fxMap.gc;
  const si = fxMap.si;

  let usdinrQuote;
  if (usdInr?.price != null) {
    usdinrQuote = {
      ok: true,
      id: 'usdinr',
      label: 'USD / INR',
      sublabel: 'Yahoo · USDINR=X',
      kind: 'fx',
      symbol: usdInr.symbol || 'USDINR=X',
      shortName: usdInr.shortName || 'USD/INR',
      displayCurrency: 'INR',
      currency: usdInr.currency || 'INR',
      price: usdInr.price,
      previousClose: usdInr.previousClose ?? null,
      changePct: usdInr.changePct,
      marketTime: usdInr.marketTime,
    };
  } else {
    usdinrQuote = {
      ok: false,
      id: 'usdinr',
      label: 'USD / INR',
      sublabel: 'USDINR=X',
      kind: 'fx',
      error: 'USD/INR unavailable',
    };
  }

  let goldQuote;
  let silverQuote;
  if (
    gc?.price != null &&
    si?.price != null &&
    usdInr?.price != null &&
    gc.previousClose != null &&
    si.previousClose != null &&
    usdInr.previousClose != null
  ) {
    const goldPer10 = round2(((gc.price * usdInr.price) / GRAMS_PER_TROY_OZ) * 10);
    /** Silver shown per kg (10 g × 100). Gold remains per 10 g. */
    const silverPerKg = round2(((si.price * usdInr.price) / GRAMS_PER_TROY_OZ) * 10 * 100);
    const prevGold10 = round2(((gc.previousClose * usdInr.previousClose) / GRAMS_PER_TROY_OZ) * 10);
    const prevSilverKg = round2(((si.previousClose * usdInr.previousClose) / GRAMS_PER_TROY_OZ) * 10 * 100);
    const goldCh =
      goldPer10 != null && prevGold10 != null && prevGold10 !== 0
        ? ((goldPer10 - prevGold10) / prevGold10) * 100
        : null;
    const silverCh =
      silverPerKg != null && prevSilverKg != null && prevSilverKg !== 0
        ? ((silverPerKg - prevSilverKg) / prevSilverKg) * 100
        : null;

    const mt = Math.max(gc.marketTime || 0, si.marketTime || 0, usdInr.marketTime || 0);

    goldQuote = buildInrPer10gQuote({
      id: 'gold-inr-10g',
      label: 'Gold',
      sublabel: 'GC=F · INR / 10 gram',
      kind: 'comexInrPer10g',
      title:
        'Indicative INR per 10 g: COMEX gold continuous future (GC=F), USD per troy oz, converted with Yahoo USD/INR (USDINR=X). Not an Indian exchange official print.',
      price: goldPer10,
      changePct: goldCh,
      marketTime: mt || null,
    });
    silverQuote = buildInrPer10gQuote({
      id: 'silver-inr-kg',
      label: 'Silver',
      sublabel: 'SI=F · INR / kg',
      kind: 'comexInrPerKg',
      title:
        'Indicative INR per kg: COMEX silver continuous future (SI=F), USD per troy oz, converted with Yahoo USD/INR (USDINR=X). Not an Indian exchange official print.',
      price: silverPerKg,
      changePct: silverCh,
      marketTime: mt || null,
    });
  } else {
    goldQuote = {
      ok: false,
      id: 'gold-inr-10g',
      label: 'Gold',
      sublabel: 'GC=F · INR / 10 gram',
      kind: 'comexInrPer10g',
      error: 'GC=F or USDINR=X unavailable',
    };
    silverQuote = {
      ok: false,
      id: 'silver-inr-kg',
      label: 'Silver',
      sublabel: 'SI=F · INR / kg',
      kind: 'comexInrPerKg',
      error: 'SI=F or USDINR=X unavailable',
    };
  }

  /** Display order: Nifty → Bank Nifty → Sensex → USD/INR → Gold → Silver → WTI Crude (then loops in the UI). */
  const quotes = [
    byId.nifty,
    byId.banknifty,
    byId.sensex,
    usdinrQuote,
    goldQuote,
    silverQuote,
    byId.crude,
  ].filter(Boolean);

  const anyOk = quotes.some((q) => q.ok);
  if (anyOk) {
    cache = { at: now, payload: quotes };
  }

  res.json({
    ok: anyOk,
    cached: false,
    fetchedAt: now,
    quotes,
    disclaimer:
      'Indicative data from Yahoo Finance (unofficial chart API). USD/INR is USDINR=X. Gold: COMEX GC=F (USD/oz) to approximate INR per 10 g. Silver: SI=F to approximate INR per kg. Contract specs, taxes, and local premia differ. Not investment advice.',
  });
});

export default router;
