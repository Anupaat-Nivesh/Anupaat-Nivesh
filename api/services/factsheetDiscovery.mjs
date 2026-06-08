/**
 * Discover scheme factsheet PDF URLs via web search (no paid API).
 * Query pattern mirrors manual Google search: "factsheet <scheme name> PDF"
 * Falls back to site-restricted search on the AMC domain when needed.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const AMC_DOMAIN_HINTS = {
  'aditya birla sun life': ['mutualfund.adityabirlacapital.com', 'adityabirlamutual.com'],
  'nippon india': ['nipponindiaim.com', 'mf.nipponindiaim.com'],
  hdfc: ['hdfcfund.com'],
  'icici prudential': ['icicipruamc.com'],
  sbi: ['sbimf.com'],
  axis: ['axismf.com'],
  kotak: ['kotakmf.com'],
  uti: ['utimf.com'],
  dsp: ['dspim.com'],
  'mirae asset': ['miraeassetmf.co.in'],
  'franklin templeton': ['franklintempletonindia.com'],
  tata: ['tatamutualfund.com'],
  quant: ['quantmutual.com'],
  'motilal oswal': ['motilaloswalmf.com'],
  edelweiss: ['edelweissmf.com'],
  bandhan: ['bandhanmutual.com'],
  'mahindra manulife': ['mahindramanulife.com'],
  whiteoak: ['whiteoakamc.com', 'mf.whiteoakamc.com'],
  'parag parikh': ['ppfas.com'],
  'canara robeco': ['canararobeco.com'],
};

const AGGREGATOR_DOMAINS = [
  'personalfn.com',
  'moneycontrol.com',
  'valueresearchonline.com',
  'icicidirect.com',
  'groww.in',
  'paytmmoney.com',
  'etmoney.com',
  'indmoney.com',
  'economictimes.indiatimes.com',
  'scribd.com',
];

function normalizeText(v = '') {
  return String(v || '')
    .toLowerCase()
    .replace(/&amp;/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenOverlap(a, b) {
  const ta = new Set(normalizeText(a).split(' ').filter((t) => t.length > 2));
  const tb = new Set(normalizeText(b).split(' ').filter((t) => t.length > 2));
  if (!ta.size || !tb.size) return 0;
  let hit = 0;
  for (const t of ta) {
    if (tb.has(t)) hit += 1;
  }
  return hit / Math.max(ta.size, tb.size);
}

function decodeRedirectUrl(href) {
  try {
    let url = href;
    if (url.startsWith('//')) url = `https:${url}`;
    const parsed = new URL(url);
    const uddg = parsed.searchParams.get('uddg');
    if (uddg) return decodeURIComponent(uddg.replace(/&amp;/g, '&'));
    return url;
  } catch {
    return href;
  }
}

export function amcDomainsForFundHouse(fundHouse) {
  const fh = normalizeText(fundHouse);
  for (const [key, domains] of Object.entries(AMC_DOMAIN_HINTS)) {
    if (fh.includes(key) || key.includes(fh)) return domains;
  }
  return [];
}

/** Scheme name without AMC prefix and plan suffix — better for site: queries. */
export function shortSchemeSearchTerm(schemeName, fundHouse = '') {
  let s = String(schemeName || '').trim();
  const fh = String(fundHouse || '').replace(/\s+mutual fund$/i, '').trim();
  if (fh && fh !== 'Other') {
    const re = new RegExp(`^${fh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'i');
    s = s.replace(re, '').trim();
  }
  s = s
    .replace(/\s*-\s*(direct|regular)\s+(growth|idcw|dividend|plan).*$/i, '')
    .replace(/\s*-\s*growth$/i, '')
    .trim();
  return s || schemeName;
}

function isJunkUrl(url) {
  const u = url.toLowerCase();
  return (
    !u.startsWith('http') ||
    u.includes('duckduckgo.com') ||
    u.includes('duckduckgo.com/y.js') ||
    u.includes('bing.com/aclick') ||
    u.includes('/y.js?') ||
    u.includes('googleadservices.com')
  );
}

export function scoreCandidate(url, schemeName, fundHouse) {
  const u = url.toLowerCase();
  let score = 0;

  const domains = amcDomainsForFundHouse(fundHouse);
  const isAmc = domains.some((d) => u.includes(d));
  const isPdf = u.includes('.pdf');

  if (isPdf) score += 50;
  if (isAmc && isPdf) score += 45;
  if (isAmc && /factsheet|fact-sheet/i.test(u)) score += 25;
  if (isAmc && /\/kim\/|\/sid\/|scheme-information/i.test(u)) score += 12;
  if (/factsheet|fact-sheet|kim|sid|scheme-information|downloads/i.test(u)) score += 10;

  if (isAmc) score += 20;

  if (isAmc && !isPdf && /\/products?\//.test(u)) score -= 55;
  if (isAmc && !isPdf && !/\/downloads|factsheet|forms-and-downloads/i.test(u)) score -= 25;

  if (AGGREGATOR_DOMAINS.some((d) => u.includes(d))) score -= 45;
  if (!isAmc && isPdf) score -= 50;

  score += Math.round(tokenOverlap(schemeName, url) * 25);
  score += Math.round(tokenOverlap(shortSchemeSearchTerm(schemeName, fundHouse), url) * 15);

  return score;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function searchDuckDuckGo(query, maxResults = 8, attempt = 0) {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`DuckDuckGo HTTP ${res.status}`);
  const html = await res.text();
  const links = [];
  const re = /class="result__a"[^>]*href="([^"]+)"/g;
  let m = re.exec(html);
  while (m && links.length < maxResults) {
    links.push(decodeRedirectUrl(m[1]));
    m = re.exec(html);
  }

  if (!links.length && attempt < 2) {
    await sleep(1200 + attempt * 800);
    return searchDuckDuckGo(query, maxResults, attempt + 1);
  }

  return links;
}

async function searchGoogleCse(query, maxResults = 5) {
  const key = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;
  if (!key || !cx) return [];

  const url = new URL('https://www.googleapis.com/customsearch/v1');
  url.searchParams.set('key', key);
  url.searchParams.set('cx', cx);
  url.searchParams.set('q', query);
  url.searchParams.set('num', String(Math.min(maxResults, 10)));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google CSE HTTP ${res.status}`);
  const json = await res.json();
  return (json.items || []).map((item) => item.link).filter(Boolean);
}

function rankCandidates(candidates, schemeName, fundHouse) {
  const unique = [...new Set(candidates)].filter((url) => !isJunkUrl(url));
  return unique
    .map((url) => ({ url, score: scoreCandidate(url, schemeName, fundHouse) }))
    .sort((a, b) => b.score - a.score);
}

function isAmcPdfUrl(url, fundHouse) {
  const u = url.toLowerCase();
  if (!u.includes('.pdf')) return false;
  return amcDomainsForFundHouse(fundHouse).some((d) => u.includes(d));
}

function selectBest(ranked, fundHouse) {
  if (!ranked.length) return null;

  const amcPdf = ranked.find((r) => isAmcPdfUrl(r.url, fundHouse));
  if (amcPdf && amcPdf.score >= 70) return amcPdf;

  const best = ranked[0];
  if (isAmcPdfUrl(best.url, fundHouse)) return best;

  if (amcPdf && amcPdf.score >= best.score - 15) return amcPdf;

  if (best.score >= 25 && !/\.pdf/i.test(best.url) && amcPdf) return amcPdf;

  if (best.score >= 25) return best;
  if (amcPdf && amcPdf.score >= 25) return amcPdf;

  return null;
}

/**
 * @param {{ schemeName: string, fundHouse?: string }} input
 * @returns {Promise<{ url: string|null, source: string, query: string, candidates: string[] }>}
 */
export async function discoverFactsheetUrl({ schemeName, fundHouse = '' }) {
  const query = `factsheet ${schemeName} PDF`;
  const candidates = [];

  try {
    const google = await searchGoogleCse(query, 6);
    candidates.push(...google);
  } catch {
    /* optional */
  }

  if (!candidates.length) {
    try {
      candidates.push(...(await searchDuckDuckGo(query, 8)));
    } catch {
      /* continue to site search */
    }
  }

  let ranked = rankCandidates(candidates, schemeName, fundHouse);
  let best = selectBest(ranked, fundHouse);

  const needsSiteSearch =
    !best ||
    !isAmcPdfUrl(best.url, fundHouse) ||
    (best.score < 90 && !/factsheet|fact-sheet/i.test(best.url.toLowerCase()));

  const amcDomains = amcDomainsForFundHouse(fundHouse);
  if (needsSiteSearch && amcDomains.length) {
    const shortName = shortSchemeSearchTerm(schemeName, fundHouse);
    const siteQuery = `site:${amcDomains[0]} factsheet ${shortName} PDF`;
    try {
      await sleep(900);
      const siteLinks = await searchDuckDuckGo(siteQuery, 8);
      candidates.push(...siteLinks);
      ranked = rankCandidates(candidates, schemeName, fundHouse);
      best = selectBest(ranked, fundHouse);
    } catch {
      /* keep prior best */
    }
  }

  const unique = [...new Set(candidates)].filter((url) => !isJunkUrl(url));

  if (!best) {
    return { url: null, source: 'none', query, candidates: unique };
  }

  return {
    url: best.url,
    source: process.env.GOOGLE_CSE_API_KEY ? 'google-cse' : 'duckduckgo',
    query,
    candidates: unique,
    score: best.score,
  };
}
