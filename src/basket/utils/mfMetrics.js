/** Parse mfapi date DD-MM-YYYY */
export function parseMfDate(str) {
  const [d, m, y] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** NAV series sorted oldest → newest */
export function sortNavSeries(data) {
  return [...data]
    .map((row) => ({ date: parseMfDate(row.date), nav: parseFloat(row.nav) }))
    .filter((r) => !Number.isNaN(r.nav) && r.date.getTime())
    .sort((a, b) => a.date - b.date);
}

function findNavOnOrBefore(series, targetDate) {
  let best = null;
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].date <= targetDate) {
      best = series[i].nav;
      break;
    }
  }
  return best;
}

function cagr(startNav, endNav, years) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  const r = (endNav / startNav) ** (1 / years) - 1;
  return Math.round(r * 1000) / 10;
}

/**
 * Compute 1Y / 3Y / 5Y CAGR from mfapi NAV history.
 * @param {{ date: string, nav: string }[]} data
 */
export function computeReturnsFromNav(data) {
  const series = sortNavSeries(data);
  if (series.length < 2) {
    return {
      cagr1y: null,
      cagr3y: null,
      cagr5y: null,
      cagrTillDate: null,
      latestNav: null,
      latestNavDate: null,
      navChange1d: null,
      inceptionDate: null,
      navSeries: series,
    };
  }

  const latest = series[series.length - 1];
  const prev = series.length > 1 ? series[series.length - 2] : null;
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
  if (prev && prev.nav > 0) {
    navChange1d = Math.round(((latest.nav - prev.nav) / prev.nav) * 10000) / 100;
  }

  return {
    latestNav: latest.nav,
    latestNavDate: latest.date,
    cagr1y: nav1y ? cagr(nav1y, latest.nav, 1) : null,
    cagr3y: nav3y ? cagr(nav3y, latest.nav, 3) : null,
    cagr5y: nav5y ? cagr(nav5y, latest.nav, 5) : null,
    cagrTillDate: cagr(first.nav, latest.nav, yearsSinceInception),
    navChange1d,
    inceptionDate: first.date,
    navSeries: series,
  };
}

const CATEGORY_RULES = [
  { id: 'equity', label: 'Equity', test: (n, c) => /equity|flexi cap|large cap|mid cap|small cap|elss|index|sectoral|thematic|focused/i.test(c) && !/debt|liquid|gilt|bond|money market/i.test(c) },
  { id: 'debt', label: 'Debt', test: (n, c) => /debt|liquid|gilt|bond|money market|duration|credit risk|banking and psu/i.test(c) },
  { id: 'hybrid', label: 'Hybrid', test: (n, c) => /hybrid|balanced|advantage|multi asset|arbitrage|dynamic asset/i.test(c) },
  { id: 'international', label: 'International Equity', test: (n, c) => /international|global|us |nasdaq|s&p|overseas|foreign/i.test(c) },
  { id: 'solution', label: 'Solution Oriented', test: (n, c) => /retirement|children|education|pension/i.test(c) },
];

export function inferFundCategory(schemeName, schemeCategory = '') {
  const n = schemeName || '';
  const c = `${schemeCategory} ${n}`;
  for (const rule of CATEGORY_RULES) {
    if (rule.test(n, c)) return rule.id;
  }
  return 'other';
}

export function categoryLabel(id) {
  return CATEGORY_RULES.find((r) => r.id === id)?.label || 'Other';
}

/** Prefer Direct + Growth rows for cleaner screener */
export function isDirectGrowthScheme(name) {
  const n = name.toLowerCase();
  return n.includes('direct') && (n.includes('growth') || n.includes('(g)') || /\bdirect\b.*\bgr\b/i.test(n));
}

export function isRegularGrowthScheme(name) {
  const n = name.toLowerCase();
  const isDirect = n.includes('direct');
  const isGrowth = n.includes('growth') || n.includes('(g)') || /\bgr\b/.test(n);
  return !isDirect && isGrowth;
}

export function parsePlanTags(schemeName = '') {
  const n = schemeName.toLowerCase();
  const direct = n.includes('direct');
  const growth = n.includes('growth') || n.includes('(g)');
  const idcw = n.includes('idcw') || n.includes('dividend');
  const parts = [];
  if (direct) parts.push('Direct');
  else parts.push('Regular');
  if (idcw) parts.push('IDCW');
  else if (growth) parts.push('Growth');
  return parts.join(' · ');
}

export function formatInceptionDate(date) {
  if (!date) return '—';
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatNav(nav) {
  if (nav == null || Number.isNaN(nav)) return '—';
  return `₹${nav.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

/** AUM in crores (mfdata.in `aum_cr`). */
export function formatAumCr(aumCr) {
  if (aumCr == null || Number.isNaN(aumCr)) return '—';
  if (aumCr >= 10000) {
    return `₹${(aumCr / 10000).toLocaleString('en-IN', { maximumFractionDigits: 2 })}k Cr`;
  }
  return `₹${aumCr.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
}

export function formatReturnPct(value) {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value}%`;
}

/** Risk-adjusted score for “top rated” sort (NAV-derived). */
export function fundQualityScore(metrics) {
  if (!metrics) return null;
  const c3 = metrics.cagr3y;
  const c1 = metrics.cagr1y;
  const ct = metrics.cagrTillDate;
  if (c3 == null && c1 == null && ct == null) return null;
  const s3 = c3 ?? c1 ?? ct ?? 0;
  const s1 = c1 ?? c3 ?? 0;
  const st = ct ?? c3 ?? 0;
  return Math.round((s3 * 0.5 + s1 * 0.3 + st * 0.2) * 10) / 10;
}

export function starsFromScore(score) {
  if (score == null) return 0;
  if (score >= 18) return 5;
  if (score >= 14) return 4;
  if (score >= 10) return 3;
  if (score >= 6) return 2;
  if (score >= 0) return 1;
  return 1;
}

export function formatCrFromNav(nav, multiplier = 1) {
  if (nav == null) return '—';
  return `₹ ${(nav * multiplier).toFixed(2)}`;
}

/** Infer AMC from mfapi scheme name (before first " - "). */
export function inferFundHouse(schemeName = '') {
  const n = String(schemeName).trim();
  if (!n) return 'Other';

  const KNOWN_AMC_PREFIXES = [
    'Aditya Birla Sun Life',
    'Baroda BNP Paribas',
    'Canara Robeco',
    'Franklin Templeton',
    'ICICI Prudential',
    'Invesco India',
    'Kotak Mahindra',
    'Mahindra Manulife',
    'Mirae Asset',
    'Motilal Oswal',
    'Nippon India',
    'Parag Parikh',
    'PGIM India',
    'SBI',
    'Tata',
    'UTI',
    'Axis',
    'HDFC',
    'DSP',
    'Bandhan',
    'Edelweiss',
    'HSBC',
    'JM',
    'LIC',
    'Navi',
    'Quant',
    'Sundaram',
    'Union',
    'WhiteOak',
    '360 ONE',
    'BOI',
  ];

  const lc = n.toLowerCase();
  const known = KNOWN_AMC_PREFIXES.find((amc) => lc.startsWith(amc.toLowerCase()));
  if (known) return known;

  const fund = n.match(/^(.+?\s+Mutual Fund)/i);
  if (fund) return fund[1].trim();

  const left = n.split(' - ')[0].trim();
  const words = left.split(/\s+/).filter(Boolean);
  if (!words.length) return 'Other';

  const amcBoundaryWord = new Set([
    'fund',
    'funds',
    'plan',
    'growth',
    'idcw',
    'direct',
    'regular',
    'large',
    'mid',
    'small',
    'flexi',
    'multi',
    'equity',
    'debt',
    'hybrid',
    'value',
    'focused',
    'balanced',
    'banking',
    'liquid',
    'gilt',
    'bond',
    'credit',
    'short',
    'long',
    'duration',
    'ultra',
    'index',
    'nifty',
    'sensex',
    'nasdaq',
    'bluechip',
    'contra',
    'opportunities',
    'arbitrage',
    'retirement',
    'children',
    'tax',
    'elss',
    'saver',
    'cap',
    'fof',
    'etf',
  ]);

  const cleaned = words.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
  let boundary = cleaned.findIndex((w) => {
    if (!w) return false;
    if (amcBoundaryWord.has(w)) return true;
    if (w.startsWith('fund')) return true;
    if (w.endsWith('fund')) return true;
    if (w.endsWith('cap')) return true;
    return false;
  });
  if (boundary <= 0) boundary = Math.min(words.length, 2);
  const amc = words.slice(0, boundary).join(' ').trim();
  return amc || left;
}

/** Heuristic: keep only open / currently investable funds in explorer */
export function isLikelyActiveInvestableScheme(schemeName = '') {
  const s = schemeName.toLowerCase();
  if (!s) return false;
  const blocked =
    /close\s*ended|closed\s*ended|fixed\s*maturity|fmp|interval|capital\s*protection|maturity\s*plan|series\b|wound\s*up|segregated|suspended/.test(
      s
    );
  if (blocked) return false;
  return /(direct|regular|growth|idcw|dividend|fund)/.test(s);
}

/** Consider NAV stale if older than n days */
export function hasRecentNav(latestNavDate, days = 15) {
  if (!latestNavDate) return false;
  const d = latestNavDate instanceof Date ? latestNavDate : new Date(latestNavDate);
  if (!d || Number.isNaN(d.getTime())) return false;
  const ageMs = Date.now() - d.getTime();
  return ageMs <= days * 24 * 60 * 60 * 1000;
}

const CAP_PATTERNS = {
  largecap: /large\s*cap|largecap|bluechip/i,
  midcap: /mid\s*cap|midcap/i,
  smallcap: /small\s*cap|smallcap/i,
  elss: /elss|tax\s*saver/i,
  index: /index|nifty|sensex|passive/i,
  flexi: /flexi\s*cap|flexicap|multi\s*cap/i,
};

export function matchesCapStyle(schemeName, capId) {
  if (!capId) return true;
  const n = schemeName || '';
  const re = CAP_PATTERNS[capId];
  return re ? re.test(n) : true;
}

export function sortFunds(rows, metrics, sortKey) {
  const list = [...rows];
  if (sortKey === 'name') {
    list.sort((a, b) => a.schemeName.localeCompare(b.schemeName));
    return list;
  }
  if (sortKey === 'return-1y') {
    list.sort((a, b) => (metrics[b.schemeCode]?.cagr1y ?? -999) - (metrics[a.schemeCode]?.cagr1y ?? -999));
    return list;
  }
  if (sortKey === 'return-3y') {
    list.sort((a, b) => (metrics[b.schemeCode]?.cagr3y ?? -999) - (metrics[a.schemeCode]?.cagr3y ?? -999));
    return list;
  }
  list.sort((a, b) => {
    const sa = fundQualityScore(metrics[a.schemeCode]) ?? -9999;
    const sb = fundQualityScore(metrics[b.schemeCode]) ?? -9999;
    if (sa < sb) return 1;
    if (sa > sb) return -1;
    return a.schemeName.localeCompare(b.schemeName);
  });
  return list;
}
