/**
 * Indian mutual fund data via mfapi.in (free, no API key).
 * https://www.mfapi.in/docs/
 */

import {
  computeReturnsFromNav,
  inferFundCategory,
  parsePlanTags,
  categoryLabel,
} from '../utils/mfMetrics';
import { fetchEnrichmentBulk, fetchFundProfile } from './mfEnrichmentApi';

const MF_LIST_URL = 'https://api.mfapi.in/mf';
const CACHE_KEY = 'an_mf_scheme_list_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const metricsCache = new Map();
let enrichmentWarned = false;

function mergeEnrichment(base, enriched) {
  if (!enriched?.enrichmentAvailable) return base;
  return {
    ...base,
    aumCr: enriched.aumCr ?? base.aumCr ?? null,
    expenseRatio: enriched.expenseRatio ?? base.expenseRatio ?? null,
    rating: enriched.rating ?? base.rating ?? null,
    cagr1y: enriched.cagr1y ?? base.cagr1y,
    cagr3y: enriched.cagr3y ?? base.cagr3y,
    cagr5y: enriched.cagr5y ?? base.cagr5y,
    sipAllowed: enriched.sipAllowed ?? base.sipAllowed ?? null,
    lumpsumAllowed: enriched.lumpsumAllowed ?? base.lumpsumAllowed ?? null,
    isActive: enriched.isActive ?? base.isActive ?? null,
    enrichmentAvailable: true,
    enrichmentSource: enriched.enrichmentSource || 'mfdata.in',
  };
}

async function tryEnrichmentBulk(codes) {
  try {
    return await fetchEnrichmentBulk(codes);
  } catch (e) {
    if (!enrichmentWarned && process.env.NODE_ENV === 'development') {
      enrichmentWarned = true;
      console.warn('[mf] enrichment unavailable:', e.message);
    }
    return {};
  }
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MF API ${res.status}`);
  return res.json();
}

export async function loadSchemeList() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) {
      const { at, list } = JSON.parse(raw);
      if (Date.now() - at < CACHE_TTL_MS && Array.isArray(list)) return list;
    }
  } catch {
    /* ignore */
  }

  const list = await fetchJson(MF_LIST_URL);
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list }));
  } catch {
    /* quota */
  }
  return list;
}

export async function searchSchemes(query, limit = 40) {
  const q = query.trim();
  if (!q || q.length < 2) return [];
  const url = `https://api.mfapi.in/mf/search?q=${encodeURIComponent(q)}`;
  const rows = await fetchJson(url);
  return rows.slice(0, limit);
}

export async function fetchSchemeDetail(schemeCode) {
  return fetchJson(`https://api.mfapi.in/mf/${schemeCode}`);
}

export async function fetchSchemeMetrics(schemeCode) {
  const key = String(schemeCode);
  if (metricsCache.has(key)) return metricsCache.get(key);

  const promise = (async () => {
    const detail = await fetchSchemeDetail(schemeCode);
    const { meta, data } = detail;
    const returns = computeReturnsFromNav(data || []);
    const category = inferFundCategory(meta?.scheme_name, meta?.scheme_category);
    return {
      schemeCode: key,
      schemeName: meta?.scheme_name || '',
      fundHouse: meta?.fund_house || '—',
      schemeCategory: meta?.scheme_category || '—',
      schemeType: meta?.scheme_type || '—',
      isinGrowth: meta?.isin_growth || meta?.isin_div_reinvestment || '—',
      planTags: parsePlanTags(meta?.scheme_name),
      category,
      categoryLabel: categoryLabel(category),
      ...returns,
    };
  })();

  metricsCache.set(key, promise);
  return promise;
}

export async function fetchMetricsBatch(codes, concurrency = 4) {
  const results = new Map();
  const queue = [...codes];

  async function worker() {
    while (queue.length) {
      const code = queue.shift();
      try {
        const m = await fetchSchemeMetrics(code);
        results.set(code, m);
      } catch {
        results.set(code, null);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const enrichedMap = await tryEnrichmentBulk(codes);
  for (const [code, row] of results.entries()) {
    if (!row) continue;
    const e = enrichedMap[String(code)];
    if (e) results.set(code, mergeEnrichment(row, e));
  }

  return results;
}

/** Full profile for fund detail page */
export async function fetchFullSchemeProfile(schemeCode) {
  try {
    const profile = await fetchFundProfile(schemeCode);
    if (profile?.schemeCode) {
      const category = inferFundCategory(profile.schemeName, profile.schemeCategory);
      const navSeries = (profile.navSeries || []).map((r) => ({
        date: typeof r.date === 'string' ? parseMfDateFromIso(r.date) : new Date(r.date),
        nav: r.nav,
      }));
      return {
        ...profile,
        planTags: parsePlanTags(profile.schemeName),
        category,
        categoryLabel: categoryLabel(category),
        navSeries,
        composition: profile.portfolio?.enrichmentAvailable
          ? {
              sectors: profile.portfolio.sectors || [],
              holdings: profile.portfolio.holdings || [],
              month: profile.portfolio.month,
              managers: profile.portfolio.managers || [],
              isIllustrative: false,
            }
          : profile.managers?.length
            ? {
                sectors: [],
                holdings: [],
                month: null,
                managers: profile.managers,
                isIllustrative: true,
              }
            : null,
      };
    }
  } catch {
    /* fall back to mfapi-only */
  }

  const detail = await fetchSchemeDetail(schemeCode);
  const { meta, data } = detail;
  const returns = computeReturnsFromNav(data || []);
  const category = inferFundCategory(meta?.scheme_name, meta?.scheme_category);
  return {
    schemeCode: String(schemeCode),
    schemeName: meta?.scheme_name || '',
    fundHouse: meta?.fund_house || '—',
    schemeCategory: meta?.scheme_category || '—',
    schemeType: meta?.scheme_type || '—',
    isinGrowth: meta?.isin_growth || meta?.isin_div_reinvestment || '—',
    planTags: parsePlanTags(meta?.scheme_name),
    category,
    categoryLabel: categoryLabel(category),
    benchmarkNote:
      'Returns are computed from published NAV history. AUM and holdings load when mfdata.in is available.',
    composition: null,
    ...returns,
  };
}

function parseMfDateFromIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
