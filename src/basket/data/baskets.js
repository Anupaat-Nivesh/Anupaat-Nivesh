/**
 * Elemental basket catalog — dummy data for UI & API-ready shapes.
 * Admin overrides merge at runtime (localStorage).
 */

export const BASKET_IDS = ['fire', 'water', 'earth'];

const performanceSeries = (base, volatility) => {
  const months = [];
  let v = base;
  for (let i = 0; i < 36; i += 1) {
    v *= 1 + (Math.sin(i / 3) * volatility + (i % 5) * 0.002);
    months.push({ m: i + 1, v: Math.round(v * 100) / 100 });
  }
  return months;
};

export const defaultBaskets = [
  {
    id: 'fire',
    symbol: '🔥',
    name: 'FIRE',
    tagline: 'Focused Intelligent Risk Exposure',
    summary: 'Aggressive growth through curated equity mutual funds with disciplined risk overlays.',
    riskLevel: 'Very High',
    riskScore: 88,
    horizonYears: '7+ years',
    minInvestment: 25000,
    price: 4999,
    priceLabel: 'One-Time Access',
    tags: ['Aggressive', 'Equity Heavy', 'Long-Term', 'High Growth'],
    volatilityPct: 82,
    philosophy:
      'FIRE seeks long-term compounding with tactical risk controls—no timing noise, only structural conviction.',
    sipSuggestionMonthly: 15000,
    allocationPreviewFree: [
      { label: 'Equity', pct: 92, color: '#00A676' },
      { label: 'Debt / Hybrid buffer', pct: 6, color: '#5b8cff' },
      { label: 'Gold / Commodities', pct: 2, color: '#c9a227' },
    ],
    allocationFull: [
      { name: 'Flexi-cap / focused equity', pct: 42, color: '#00A676' },
      { name: 'Mid & small-cap satellite', pct: 28, color: '#34d399' },
      { name: 'Sectoral / thematic (capped)', pct: 12, color: '#14b8a6' },
      { name: 'Dynamic asset allocation / hybrid', pct: 10, color: '#5b8cff' },
      { name: 'Gold ETF / commodity', pct: 8, color: '#c9a227' },
    ],
    marketCap: [
      { label: 'Large cap', pct: 48 },
      { label: 'Mid cap', pct: 32 },
      { label: 'Small cap', pct: 20 },
    ],
    sectors: [
      { label: 'Financials', pct: 22 },
      { label: 'IT', pct: 16 },
      { label: 'Consumer', pct: 14 },
      { label: 'Industrials', pct: 12 },
      { label: 'Healthcare', pct: 10 },
      { label: 'Others', pct: 26 },
    ],
    funds: [
      { scheme: 'Axis Flexi Cap Fund', pct: 14, overlap: 'Core' },
      { scheme: 'Parag Parikh Flexi Cap Fund', pct: 12, overlap: 'Core' },
      { scheme: 'Quant Small Cap Fund', pct: 10, overlap: 'Satellite' },
      { scheme: 'Nippon India Small Cap Fund', pct: 8, overlap: 'Satellite' },
      { scheme: 'SBI Magnum MidCap Fund', pct: 9, overlap: 'Satellite' },
      { scheme: 'ICICI Prudential Technology Fund', pct: 6, overlap: 'Thematic' },
      { scheme: 'HDFC Balanced Advantage Fund', pct: 10, overlap: 'Buffer' },
      { scheme: 'Kotak Gold ETF Fund of Fund', pct: 8, overlap: 'Hedge' },
      { scheme: 'Liquid / money market sleeve', pct: 23, overlap: 'Liquidity' },
    ],
    metrics: {
      cagr3y: 18.2,
      cagr5y: 15.4,
      sharpe: 1.12,
      maxDrawdown: -28.4,
      beta: 1.18,
    },
    rollingReturns: [
      { period: '1Y', p25: 4.2, p50: 12.8, p75: 22.1 },
      { period: '3Y', p25: 8.1, p50: 16.4, p75: 24.9 },
      { period: '5Y', p25: 10.2, p50: 14.8, p75: 19.3 },
    ],
    drawdownHistory: performanceSeries(100, 0.028),
    performanceLine: performanceSeries(100, 0.022),
    whyBasket: {
      allocation: 'Concentrated equity with capped thematic exposure and a hybrid sleeve to dampen sequence risk.',
      market: 'Positioned for earnings breadth recovery while avoiding unhedged single-factor bets.',
      framework: 'Quarterly rebalance, drift bands, and volatility-targeting overlays on satellite sleeves.',
      ideal: 'Investors with stable income, long horizon, and tolerance for 20–30% peak-to-trough swings.',
      avoid: 'Anyone needing capital within 5 years, or with low emergency-fund buffers.',
      outlook: 'Constructive on quality growth; tactical trims on extended valuations.',
    },
    research: [
      {
        title: 'March commentary — breadth over hype',
        date: '2026-03-02',
        excerpt: 'We added buffer to hybrid sleeve as mid-cap spreads tightened.',
      },
      {
        title: 'Risk note — thematic cap',
        date: '2026-02-15',
        excerpt: 'Thematic sleeves remain hard-capped at 12% aggregate NAV.',
      },
    ],
    rebalance: {
      lastDate: '2026-01-15',
      nextDue: '2026-04-15',
      driftPct: 4.2,
      status: 'Within tolerance',
      log: [
        { date: '2026-01-15', change: 'Trimmed thematic 1.5%, added to flexi-cap core' },
        { date: '2025-10-12', change: 'Raised gold sleeve 1% on volatility regime' },
      ],
    },
    cardGradient: 'linear-gradient(145deg, rgba(230,57,70,0.25) 0%, rgba(11,31,58,0.9) 55%)',
    glowColor: 'rgba(230, 57, 70, 0.45)',
  },
  {
    id: 'water',
    symbol: '🌊',
    name: 'WATER',
    tagline: 'Wealth Allocation Through Equity & Risk Management',
    summary: 'Balanced moderate portfolio blending growth equity with stabilizers for smoother wealth journeys.',
    riskLevel: 'Moderate',
    riskScore: 55,
    horizonYears: '5+ years',
    minInvestment: 15000,
    price: 4999,
    priceLabel: 'One-Time Access',
    tags: ['Balanced', 'Core + Satellite', 'Moderate Volatility'],
    volatilityPct: 52,
    philosophy:
      'WATER pairs conviction equity with risk dampeners—growth you can sleep with.',
    sipSuggestionMonthly: 10000,
    allocationPreviewFree: [
      { label: 'Equity', pct: 68, color: '#00A676' },
      { label: 'Debt / Hybrid', pct: 22, color: '#5b8cff' },
      { label: 'Gold', pct: 10, color: '#c9a227' },
    ],
    allocationFull: [
      { name: 'Core flexi / large blend', pct: 38, color: '#00A676' },
      { name: 'Mid-cap quality', pct: 18, color: '#34d399' },
      { name: 'Corporate bond / short duration', pct: 14, color: '#5b8cff' },
      { name: 'Dynamic hybrid allocator', pct: 12, color: '#818cf8' },
      { name: 'Gold / multi-asset', pct: 10, color: '#c9a227' },
      { name: 'Arbitrage / low vol sleeve', pct: 8, color: '#94a3b8' },
    ],
    marketCap: [
      { label: 'Large cap', pct: 58 },
      { label: 'Mid cap', pct: 28 },
      { label: 'Small cap', pct: 14 },
    ],
    sectors: [
      { label: 'Financials', pct: 18 },
      { label: 'IT', pct: 14 },
      { label: 'Consumer', pct: 16 },
      { label: 'Healthcare', pct: 11 },
      { label: 'Energy', pct: 9 },
      { label: 'Others', pct: 32 },
    ],
    funds: [
      { scheme: 'Mirae Asset Large Cap Fund', pct: 16, overlap: 'Core' },
      { scheme: 'Canara Robeco Bluechip Equity Fund', pct: 14, overlap: 'Core' },
      { scheme: 'Axis Midcap Fund', pct: 12, overlap: 'Satellite' },
      { scheme: 'HDFC Corporate Bond Fund', pct: 14, overlap: 'Stabilizer' },
      { scheme: 'ICICI Prudential All Seasons Bond Fund', pct: 12, overlap: 'Stabilizer' },
      { scheme: 'DSP Dynamic Asset Allocation Fund', pct: 12, overlap: 'Allocator' },
      { scheme: 'SBI Multi Asset Allocation Fund', pct: 10, overlap: 'Diversifier' },
      { scheme: 'Edelweiss Arbitrage Fund', pct: 10, overlap: 'Low beta' },
    ],
    metrics: {
      cagr3y: 14.1,
      cagr5y: 12.6,
      sharpe: 1.28,
      maxDrawdown: -18.2,
      beta: 0.88,
    },
    rollingReturns: [
      { period: '1Y', p25: 5.8, p50: 11.2, p75: 16.4 },
      { period: '3Y', p25: 9.4, p50: 13.1, p75: 17.8 },
      { period: '5Y', p25: 10.0, p50: 12.4, p75: 14.9 },
    ],
    drawdownHistory: performanceSeries(100, 0.018),
    performanceLine: performanceSeries(100, 0.015),
    whyBasket: {
      allocation: 'Barbell of quality equity and investment-grade debt with an allocator sleeve.',
      market: 'Balanced for mid-cycle slowdowns without sacrificing participation in recoveries.',
      framework: 'Drift limits ±6%, quarterly hygiene, risk budget shared across sleeves.',
      ideal: 'Professionals building wealth steadily with 5–10 year goals.',
      avoid: 'Speculators seeking maximum leverage to benchmarks.',
      outlook: 'Prefer carry in credit-light sleeves; equity tilt remains quality-first.',
    },
    research: [
      {
        title: 'February — allocator adds convexity',
        date: '2026-02-20',
        excerpt: 'Dynamic sleeve nudged up on rising cross-asset dispersion.',
      },
    ],
    rebalance: {
      lastDate: '2026-01-20',
      nextDue: '2026-04-20',
      driftPct: 2.1,
      status: 'Healthy',
      log: [
        { date: '2026-01-20', change: 'Rotated 2% from mid-cap to large blend' },
        { date: '2025-10-18', change: 'Increased gold sleeve 1%' },
      ],
    },
    cardGradient: 'linear-gradient(145deg, rgba(0,166,118,0.35) 0%, rgba(11,31,58,0.92) 50%)',
    glowColor: 'rgba(0, 166, 118, 0.4)',
  },
  {
    id: 'earth',
    symbol: '🌍',
    name: 'EARTH',
    tagline: 'Enduring Asset Reserve Through Prudence',
    summary: 'Conservative stability with inflation-aware diversifiers and capital preservation mindset.',
    riskLevel: 'Low–Moderate',
    riskScore: 32,
    horizonYears: '3+ years',
    minInvestment: 10000,
    price: 4999,
    priceLabel: 'One-Time Access',
    tags: ['Conservative', 'Capital preservation', 'Lower volatility'],
    volatilityPct: 28,
    philosophy:
      'EARTH prioritizes resilience—measured equity, high-grade debt, and real-asset diversifiers.',
    sipSuggestionMonthly: 7500,
    allocationPreviewFree: [
      { label: 'Equity', pct: 38, color: '#00A676' },
      { label: 'Debt', pct: 47, color: '#5b8cff' },
      { label: 'Gold / Multi-asset', pct: 15, color: '#c9a227' },
    ],
    allocationFull: [
      { name: 'Large-cap dividend / value blend', pct: 22, color: '#00A676' },
      { name: 'Conservative hybrid', pct: 16, color: '#34d399' },
      { name: 'Short to medium duration debt', pct: 28, color: '#5b8cff' },
      { name: 'Gilt / constant maturity (tactical)', pct: 12, color: '#6366f1' },
      { name: 'Gold FoF / multi-asset', pct: 14, color: '#c9a227' },
      { name: 'Liquid / overnight buffer', pct: 8, color: '#94a3b8' },
    ],
    marketCap: [
      { label: 'Large cap', pct: 72 },
      { label: 'Mid cap', pct: 20 },
      { label: 'Small cap', pct: 8 },
    ],
    sectors: [
      { label: 'Financials', pct: 20 },
      { label: 'Consumer staples', pct: 16 },
      { label: 'IT', pct: 12 },
      { label: 'Utilities', pct: 10 },
      { label: 'Healthcare', pct: 12 },
      { label: 'Others', pct: 30 },
    ],
    funds: [
      { scheme: 'ICICI Prudential Bluechip Fund', pct: 14, overlap: 'Core' },
      { scheme: 'HDFC Hybrid Equity Fund', pct: 16, overlap: 'Stabilizer' },
      { scheme: 'Axis Short Term Fund', pct: 18, overlap: 'Debt core' },
      { scheme: 'SBI Magnum Gilt Fund', pct: 12, overlap: 'Rates' },
      { scheme: 'DSP Ultra Short Fund', pct: 14, overlap: 'Liquidity' },
      { scheme: 'HDFC Gold Fund', pct: 12, overlap: 'Real assets' },
      { scheme: 'Nippon India Multi Asset Fund', pct: 14, overlap: 'Diversifier' },
    ],
    metrics: {
      cagr3y: 10.8,
      cagr5y: 9.9,
      sharpe: 1.45,
      maxDrawdown: -9.8,
      beta: 0.52,
    },
    rollingReturns: [
      { period: '1Y', p25: 6.2, p50: 9.4, p75: 12.1 },
      { period: '3Y', p25: 8.0, p50: 10.2, p75: 12.6 },
      { period: '5Y', p25: 8.6, p50: 9.9, p75: 11.4 },
    ],
    drawdownHistory: performanceSeries(100, 0.008),
    performanceLine: performanceSeries(100, 0.009),
    whyBasket: {
      allocation: 'Heavy investment-grade debt with selective equity and gold for purchasing-power defense.',
      market: 'Positioned for late-cycle volatility with emphasis on carry and quality.',
      framework: 'Tight duration management; equity sleeve capped with dividend bias.',
      ideal: 'Near-term goals, first-time investors, or capital stepping-stone allocations.',
      avoid: 'Investors seeking aggressive benchmark-chasing returns.',
      outlook: 'Cautious on credit risk; favor sovereign-heavy sleeves until spreads normalize.',
    },
    research: [
      {
        title: 'January — duration discipline',
        date: '2026-01-08',
        excerpt: 'Gilt sleeve trimmed after rally; added to short duration.',
      },
    ],
    rebalance: {
      lastDate: '2026-01-05',
      nextDue: '2026-04-05',
      driftPct: 1.3,
      status: 'Optimal',
      log: [
        { date: '2026-01-05', change: 'Reduced gilt 2%, added ultra-short' },
        { date: '2025-09-30', change: 'Gold sleeve +1% on real-yield inflection' },
      ],
    },
    cardGradient: 'linear-gradient(145deg, rgba(201,162,39,0.3) 0%, rgba(11,31,58,0.92) 55%)',
    glowColor: 'rgba(201, 162, 39, 0.45)',
  },
];

export const futureBaskets = [
  { id: 'air', symbol: '🌪', name: 'AIR', tagline: 'Tactical Opportunities', status: 'coming' },
  { id: 'metal', symbol: '⚡', name: 'METAL', tagline: 'Gold / Silver Tactical', status: 'coming' },
  { id: 'sky', symbol: '🌌', name: 'SKY', tagline: 'Global Diversification', status: 'coming' },
];

export function getBasketById(catalog, id) {
  return catalog.find((b) => b.id === id) || null;
}

export function mergeBasketCatalog(defaults, overrides) {
  if (!overrides || !overrides.length) return defaults.map((b) => ({ ...b }));
  const map = new Map(defaults.map((b) => [b.id, { ...b }]));
  overrides.forEach((o) => {
    if (!o.id) return;
    const cur = map.get(o.id);
    if (cur) map.set(o.id, { ...cur, ...o, metrics: { ...cur.metrics, ...o.metrics } });
  });
  return Array.from(map.values());
}
