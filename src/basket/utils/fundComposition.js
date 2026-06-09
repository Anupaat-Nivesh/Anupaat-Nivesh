/**
 * Illustrative sector & stock composition until AMFI holdings API is wired.
 * Deterministic per schemeCode so the same fund always shows the same preview.
 */

const EQUITY_SECTORS = [
  { label: 'Financials', pct: 24 },
  { label: 'Information Technology', pct: 18 },
  { label: 'Consumer Discretionary', pct: 14 },
  { label: 'Industrials', pct: 12 },
  { label: 'Health Care', pct: 9 },
  { label: 'Energy', pct: 7 },
  { label: 'Others', pct: 16 },
];

const DEBT_SECTORS = [
  { label: 'Sovereign / G-Sec', pct: 38 },
  { label: 'AAA PSU & Corporate', pct: 32 },
  { label: 'AA+ Banking & NBFC', pct: 18 },
  { label: 'Cash & equivalents', pct: 12 },
];

const HYBRID_SECTORS = [
  { label: 'Equity', pct: 52 },
  { label: 'Debt & money market', pct: 38 },
  { label: 'Gold / arbitrage', pct: 10 },
];

const STOCK_POOLS = {
  equity: [
    'HDFC Bank Ltd.',
    'ICICI Bank Ltd.',
    'Reliance Industries Ltd.',
    'Infosys Ltd.',
    'ITC Ltd.',
    'Larsen & Toubro Ltd.',
    'Bharti Airtel Ltd.',
    'Axis Bank Ltd.',
    'Titan Company Ltd.',
    'Sun Pharmaceutical Industries Ltd.',
  ],
  debt: [
    'GOI 7.26% 2033',
    'NHAI 7.35% 2028',
    'REC Ltd. NCD',
    'NABARD Bond',
    'Treasury bills (T-Bills)',
    'SDL Maharashtra',
  ],
  hybrid: [
    'HDFC Bank Ltd.',
    'GOI 7.18% 2030',
    'Infosys Ltd.',
    'NABARD Bond',
    'Reliance Industries Ltd.',
    'Treasury bills (T-Bills)',
  ],
};

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function rotateSectors(base, seed, count = 6) {
  const start = seed % base.length;
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    const item = base[(start + i) % base.length];
    const jitter = ((seed + i * 7) % 5) - 2;
    picked.push({
      label: item.label,
      pct: Math.max(3, Math.min(40, item.pct + jitter)),
      color: sectorColor(i),
    });
  }
  const total = picked.reduce((s, x) => s + x.pct, 0);
  return picked.map((x) => ({ ...x, pct: Math.round((x.pct / total) * 1000) / 10 }));
}

function sectorColor(i) {
  const colors = ['#FE0101', '#161a1d', '#ff6b6b', '#64748b', '#f59e0b', '#0ea5e9'];
  return colors[i % colors.length];
}

function pickStocks(pool, seed, count = 8) {
  const out = [];
  for (let i = 0; i < count; i += 1) {
    out.push({
      name: pool[(seed + i * 3) % pool.length],
      weight: Math.round((14 - i * 1.2 + (seed % 4)) * 10) / 10,
    });
  }
  const total = out.reduce((s, x) => s + x.weight, 0);
  return out.map((x) => ({ ...x, weight: Math.round((x.weight / total) * 1000) / 10 }));
}

export function getFundComposition(schemeCode, categoryId = 'equity') {
  const seed = hashCode(String(schemeCode));
  let baseSectors = EQUITY_SECTORS;
  let stockPool = STOCK_POOLS.equity;

  if (categoryId === 'debt') {
    baseSectors = DEBT_SECTORS;
    stockPool = STOCK_POOLS.debt;
  } else if (categoryId === 'hybrid' || categoryId === 'solution') {
    baseSectors = HYBRID_SECTORS;
    stockPool = STOCK_POOLS.hybrid;
  } else if (categoryId === 'international') {
    baseSectors = [
      { label: 'US Technology', pct: 35 },
      { label: 'US Financials', pct: 18 },
      { label: 'Global Healthcare', pct: 15 },
      { label: 'Emerging markets', pct: 12 },
      { label: 'Others', pct: 20 },
    ];
    stockPool = ['Apple Inc.', 'Microsoft Corp.', 'NVIDIA Corp.', 'Amazon.com Inc.', 'Alphabet Inc.'];
  }

  return {
    sectors: rotateSectors(baseSectors, seed),
    holdings: pickStocks(stockPool, seed),
    isIllustrative: true,
  };
}
