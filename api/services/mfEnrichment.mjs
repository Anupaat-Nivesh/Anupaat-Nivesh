/**
 * Enrich mfapi scheme codes with mfdata.in (AUM, returns, holdings, managers).
 */

import {
  MfdataUnavailableError,
  fetchMfdataScheme,
  fetchMfdataHoldings,
  fetchMfdataSectors,
  fetchMfdataPeople,
  bulkMfdataSchemes,
  searchMfdataSchemes,
} from './mfdataClient.mjs';
import { fetchMfapiScheme, computeReturnsFromNav } from './mfNavMetrics.mjs';
import {
  findSchemeDocAndManagers,
  getAmcDocumentPageByFundHouse,
  saveAmcIndex,
  upsertSchemeDocAndManagers,
} from './amcDocumentIndexStore.mjs';

const SCHEME_CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const FAMILY_CACHE_TTL_MS = 1000 * 60 * 60 * 12;

const schemeCache = new Map();
const familyCache = new Map();

function cacheGet(map, key) {
  const hit = map.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > hit.ttl) {
    map.delete(key);
    return null;
  }
  return hit.value;
}

function cacheSet(map, key, value, ttl) {
  map.set(key, { at: Date.now(), ttl, value });
}

function returnPct(period, returns) {
  if (!returns) return null;
  const raw = returns[period] ?? returns[period.toUpperCase()];
  if (raw == null) return null;
  if (typeof raw === 'number') return Math.round(raw * 10) / 10;
  if (typeof raw === 'object' && raw.value != null) {
    return Math.round(Number(raw.value) * 10) / 10;
  }
  return null;
}

const SECTOR_COLORS = ['#FE0101', '#161a1d', '#ff6b6b', '#64748b', '#f59e0b', '#0ea5e9'];

export function mapMfdataScheme(data) {
  if (!data) return { enrichmentAvailable: false };
  const returns = data.returns || {};
  const sipAllowed = data.sip_allowed ?? data.sipAvailable ?? data.sip ?? null;
  const lumpsumAllowed = data.lumpsum_allowed ?? data.purchase_allowed ?? data.lumpsumAvailable ?? null;
  const isActive =
    data.is_active ??
    data.active ??
    (typeof data.status === 'string'
      ? !/inactive|closed|discontinued|suspended/i.test(data.status)
      : null);
  return {
    enrichmentAvailable: true,
    enrichmentSource: 'mfdata.in',
    schemeCode: String(data.scheme_code ?? data.schemeCode ?? ''),
    schemeName: data.scheme_name || data.schemeName || '',
    aumCr: data.aum_cr ?? data.aumCr ?? null,
    expenseRatio: data.expense_ratio ?? null,
    rating: data.morningstar ?? data.rating ?? null,
    familyId: data.family_id ?? data.familyId ?? null,
    category: data.category || null,
    riskLevel: data.risk_level ?? data.riskometer ?? null,
    factsheetUrl: data.factsheet_url ?? data.factsheet ?? null,
    cagr1y: returnPct('1y', returns),
    cagr3y: returnPct('3y', returns),
    cagr5y: returnPct('5y', returns),
    nav: data.nav ?? null,
    navDate: data.nav_date ?? null,
    sipAllowed: sipAllowed == null ? null : Boolean(sipAllowed),
    lumpsumAllowed: lumpsumAllowed == null ? null : Boolean(lumpsumAllowed),
    isActive: isActive == null ? null : Boolean(isActive),
  };
}

function mapHoldingsPayload(holdingsData) {
  if (!holdingsData) return { holdings: [], month: null };
  const equity = holdingsData.equity || [];
  const debt = holdingsData.debt || [];
  const other = holdingsData.other || [];
  const rows = [...equity, ...debt, ...other]
    .map((h) => ({
      name: h.name || h.instrument || '—',
      weight: h.weight_pct ?? h.weight ?? null,
      sector: h.sector || h.asset_class || null,
    }))
    .filter((h) => h.name && h.weight != null)
    .sort((a, b) => b.weight - a.weight);
  return { holdings: rows, month: holdingsData.month || null };
}

function mapSectorsPayload(sectorsData) {
  if (!Array.isArray(sectorsData)) return [];
  return sectorsData
    .map((s, i) => ({
      label: s.sector || s.label || 'Other',
      pct: Math.round((s.weight_pct ?? s.pct ?? 0) * 10) / 10,
      color: SECTOR_COLORS[i % SECTOR_COLORS.length],
    }))
    .filter((s) => s.pct > 0)
    .sort((a, b) => b.pct - a.pct);
}

function mapManagersPayload(peopleData) {
  const managers = peopleData?.managers || [];
  return managers.map((m) => ({
    name: m.name,
    tenureYears: m.tenure_years ?? null,
    startDate: m.start_date ?? null,
  }));
}

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\b(direct|regular|growth|idcw|dividend|plan|option)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function resolveMfdataBySchemeName(schemeName, fallbackCode) {
  const query = String(schemeName || '').trim();
  if (!query) return null;
  try {
    const hits = await searchMfdataSchemes(query, 8);
    const list = Array.isArray(hits) ? hits : hits?.schemes || hits?.data || [];
    if (!list.length) return null;
    const target = norm(query);
    const ranked = list
      .map((row) => {
        const name = row.scheme_name || row.schemeName || '';
        const nameNorm = norm(name);
        const score =
          (nameNorm && (target.includes(nameNorm) || nameNorm.includes(target)) ? 3 : 0) +
          (String(row.scheme_code || row.schemeCode || '') === String(fallbackCode) ? 2 : 0);
        return { row, score };
      })
      .sort((a, b) => b.score - a.score);
    const best = ranked[0]?.row;
    if (!best) return null;
    const code = best.scheme_code || best.schemeCode;
    if (!code) return null;
    return fetchMfdataScheme(code);
  } catch {
    return null;
  }
}

export async function getSchemeEnrichment(schemeCode) {
  const key = String(schemeCode);
  const cached = cacheGet(schemeCache, key);
  if (cached) return cached;

  try {
    const data = await fetchMfdataScheme(key);
    const mapped = mapMfdataScheme(data);
    cacheSet(schemeCache, key, mapped, SCHEME_CACHE_TTL_MS);
    return mapped;
  } catch (e) {
    const fallback = {
      enrichmentAvailable: false,
      enrichmentSource: null,
      schemeCode: key,
      error: e instanceof MfdataUnavailableError ? e.message : 'Enrichment unavailable',
    };
    cacheSet(schemeCache, key, fallback, 60 * 1000);
    return fallback;
  }
}

export async function enrichSchemesBulk(schemeCodes) {
  const unique = [...new Set(schemeCodes.map(String))].filter(Boolean);
  const out = new Map();

  const needFetch = [];
  for (const code of unique) {
    const cached = cacheGet(schemeCache, code);
    if (cached) {
      out.set(code, cached);
    } else {
      needFetch.push(code);
    }
  }

  if (!needFetch.length) return out;

  try {
    const bulk = await bulkMfdataSchemes(needFetch);
    const list = Array.isArray(bulk) ? bulk : bulk?.schemes || bulk?.data || [];
    for (const row of list) {
      const mapped = mapMfdataScheme(row);
      const code = mapped.schemeCode || String(row.scheme_code);
      if (code) {
        cacheSet(schemeCache, code, mapped, SCHEME_CACHE_TTL_MS);
        out.set(code, mapped);
      }
    }
  } catch {
    /* bulk may not include AUM — fall through to per-scheme */
  }

  const stillMissing = needFetch.filter((c) => !out.has(c));
  const concurrency = 4;
  let nextIdx = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, stillMissing.length) }, async () => {
      while (true) {
        const i = nextIdx;
        nextIdx += 1;
        if (i >= stillMissing.length) break;
        const code = stillMissing[i];
        const row = await getSchemeEnrichment(code);
        out.set(code, row);
      }
    })
  );

  return out;
}

export async function getFamilyPortfolio(familyId) {
  const key = String(familyId);
  const cached = cacheGet(familyCache, key);
  if (cached) return cached;

  try {
    const [holdingsRaw, sectorsRaw, peopleRaw] = await Promise.all([
      fetchMfdataHoldings(familyId),
      fetchMfdataSectors(familyId),
      fetchMfdataPeople(familyId),
    ]);

    const payload = {
      enrichmentAvailable: true,
      enrichmentSource: 'mfdata.in',
      ...mapHoldingsPayload(holdingsRaw),
      sectors: mapSectorsPayload(sectorsRaw),
      managers: mapManagersPayload(peopleRaw),
    };
    cacheSet(familyCache, key, payload, FAMILY_CACHE_TTL_MS);
    return payload;
  } catch (e) {
    const fallback = {
      enrichmentAvailable: false,
      holdings: [],
      sectors: [],
      managers: [],
      error: e instanceof MfdataUnavailableError ? e.message : 'Portfolio data unavailable',
    };
    cacheSet(familyCache, key, fallback, 60 * 1000);
    return fallback;
  }
}

function mergeReturns(navReturns, enriched) {
  if (!enriched?.enrichmentAvailable) return navReturns;
  return {
    ...navReturns,
    cagr1y: enriched.cagr1y ?? navReturns.cagr1y,
    cagr3y: enriched.cagr3y ?? navReturns.cagr3y,
    cagr5y: enriched.cagr5y ?? navReturns.cagr5y,
    aumCr: enriched.aumCr ?? null,
    expenseRatio: enriched.expenseRatio ?? null,
    rating: enriched.rating ?? null,
    familyId: enriched.familyId ?? null,
    factsheetUrl: enriched.factsheetUrl ?? null,
    riskLevel: enriched.riskLevel ?? null,
    enrichmentAvailable: true,
    enrichmentSource: 'mfdata.in',
  };
}

export async function buildFundProfile(schemeCode) {
  const code = String(schemeCode);
  const [mfapi, firstEnriched] = await Promise.all([
    fetchMfapiScheme(code),
    getSchemeEnrichment(code),
  ]);

  const { meta, data } = mfapi;
  const localIndexHit = findSchemeDocAndManagers({
    schemeName: meta?.scheme_name,
    schemeCode: code,
    fundHouse: meta?.fund_house,
  });
  let enriched = firstEnriched;
  if (!enriched?.enrichmentAvailable || !enriched?.factsheetUrl || !enriched?.familyId) {
    const resolved = await resolveMfdataBySchemeName(meta?.scheme_name, code);
    if (resolved) {
      const resolvedMapped = mapMfdataScheme(resolved);
      if (resolvedMapped?.enrichmentAvailable) {
        enriched = {
          ...resolvedMapped,
          factsheetUrl: resolvedMapped.factsheetUrl || firstEnriched?.factsheetUrl || null,
        };
        cacheSet(schemeCache, code, enriched, SCHEME_CACHE_TTL_MS);
      }
    }
  }

  const navReturns = computeReturnsFromNav(data || []);
  const merged = mergeReturns(navReturns, enriched);

  let portfolio = null;
  if (enriched.familyId) {
    portfolio = await getFamilyPortfolio(enriched.familyId);
  }

  const managersFromPortfolio = portfolio?.managers || [];
  const managersFromLocal = Array.isArray(localIndexHit?.managers) ? localIndexHit.managers : [];
  const managers = managersFromPortfolio.length ? managersFromPortfolio : managersFromLocal;
  const factsheetUrl =
    merged.factsheetUrl ||
    localIndexHit?.factsheetUrl ||
    getAmcDocumentPageByFundHouse(meta?.fund_house) ||
    null;

  if (factsheetUrl || managers.length) {
    upsertSchemeDocAndManagers({
      schemeCode: code,
      schemeName: meta?.scheme_name,
      fundHouse: meta?.fund_house,
      factsheetUrl,
      managers,
      source: enriched?.enrichmentAvailable ? 'mfdata.in' : 'local-cache',
    });
    saveAmcIndex();
  }

  return {
    schemeCode: code,
    schemeName: meta?.scheme_name || enriched.schemeName || '',
    fundHouse: meta?.fund_house || '—',
    schemeCategory: meta?.scheme_category || enriched.category || '—',
    schemeType: meta?.scheme_type || '—',
    isinGrowth: meta?.isin_growth || meta?.isin_div_reinvestment || '—',
    benchmarkNote:
      enriched.enrichmentAvailable
        ? 'Returns and AUM from mfdata.in where available; NAV chart from mfapi.in. Not investment advice.'
        : 'Returns computed from mfapi.in NAV history. AUM/holdings load when mfdata.in is available.',
    ...merged,
    factsheetUrl,
    managers,
    enrichmentAvailable: Boolean(enriched.enrichmentAvailable),
    portfolio,
    enrichmentError: enriched.enrichmentAvailable ? null : enriched.error,
  };
}
