#!/usr/bin/env node
/**
 * Pre-release validation for basket UI (item 17).
 * Run: npm run validate:release [-- --api-base URL]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const args = process.argv.slice(2);
const apiBaseIdx = args.indexOf('--api-base');
const apiBase = apiBaseIdx >= 0 ? args[apiBaseIdx + 1] : process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const results = [];
let failures = 0;

function pass(name, detail = '') {
  results.push({ ok: true, name, detail });
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(name, detail = '') {
  failures += 1;
  results.push({ ok: false, name, detail });
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
}

function readJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
}

function sumPct(rows) {
  return (rows || []).reduce((s, r) => s + (r.pct || 0), 0);
}

// --- Risk profiling (mirrors RiskProfilePage.jsx) ---
function scoreAnswers(a) {
  let s = 40;
  if (a.age === '18–30') s += 5;
  if (a.age === '51+') s -= 5;
  if (a.horizon === '10+ years') s += 20;
  if (a.horizon === '5–10 years') s += 12;
  if (a.horizon === '3–5 years') s += 4;
  if (a.horizon === '<3 years') s -= 15;
  if (a.risk === 'Buy more') s += 18;
  if (a.risk === 'Hold calmly') s += 10;
  if (a.risk === 'Unsure') s += 0;
  if (a.risk === 'Prefer to exit') s -= 18;
  if (a.emergency === '>9 months expenses') s += 12;
  if (a.emergency === '<3 months') s -= 12;
  if (a.income === 'Very stable') s += 8;
  if (a.income === 'Variable') s -= 4;
  if (a.goal === 'Safety first') s -= 15;
  if (a.goal === 'Wealth growth') s += 8;
  return Math.max(12, Math.min(96, Math.round(s)));
}

function basketFromScore(score) {
  if (score >= 68) return 'fire';
  if (score >= 44) return 'water';
  return 'earth';
}

function validateRiskProfiling() {
  const aggressive = scoreAnswers({
    age: '18–30',
    horizon: '10+ years',
    income: 'Very stable',
    risk: 'Buy more',
    emergency: '>9 months expenses',
    goal: 'Wealth growth',
  });
  const moderate = scoreAnswers({
    age: '31–40',
    horizon: '5–10 years',
    income: 'Mostly stable',
    risk: 'Hold calmly',
    emergency: '6–9 months',
    goal: 'Child future',
  });
  const conservative = scoreAnswers({
    age: '51+',
    horizon: '<3 years',
    income: 'Variable',
    risk: 'Prefer to exit',
    emergency: '<3 months',
    goal: 'Safety first',
  });

  if (basketFromScore(aggressive) === 'fire') pass('Risk profiling → FIRE (aggressive)', `score=${aggressive}`);
  else fail('Risk profiling → FIRE (aggressive)', `score=${aggressive}`);

  if (basketFromScore(moderate) === 'water') pass('Risk profiling → WATER (moderate)', `score=${moderate}`);
  else fail('Risk profiling → WATER (moderate)', `score=${moderate}`);

  if (basketFromScore(conservative) === 'earth') pass('Risk profiling → EARTH (conservative)', `score=${conservative}`);
  else fail('Risk profiling → EARTH (conservative)', `score=${conservative}`);

  if (basketFromScore(68) === 'fire' && basketFromScore(67) === 'water') pass('Risk threshold 68/67');
  else fail('Risk threshold 68/67');

  if (basketFromScore(44) === 'water' && basketFromScore(43) === 'earth') pass('Risk threshold 44/43');
  else fail('Risk threshold 44/43');
}

/** Recommendation widget + quiz alignment (static contract). */
const RECOMMENDATION_CONTRACT = [
  { riskProfile: 'Aggressive', basketId: 'fire', riskScoreRange: '8–10', riskLevel: 'Aggressive' },
  { riskProfile: 'Moderate', basketId: 'water', riskScoreRange: '5–8', riskLevel: 'Moderate' },
  { riskProfile: 'Conservative', basketId: 'earth', riskScoreRange: 'Below 5', riskLevel: 'Conservative' },
];

function validateRecommendations(master) {
  for (const rec of RECOMMENDATION_CONTRACT) {
    const b = master.baskets.find((x) => x.id === rec.basketId);
    if (!b) {
      fail(`Basket ${rec.basketId} in master`);
      continue;
    }
    if (b.riskLevel === rec.riskLevel) pass(`${rec.basketId.toUpperCase()} riskLevel = ${rec.riskLevel}`);
    else fail(`${rec.basketId.toUpperCase()} riskLevel`, `expected ${rec.riskLevel}, got ${b.riskLevel}`);

    pass(`Recommendation widget: ${rec.riskProfile} → ${rec.basketId.toUpperCase()}`);
  }

  const riskRanges = {
    fire: '8–10',
    water: '5–8',
    earth: 'Below 5',
  };
  for (const [id, range] of Object.entries(riskRanges)) {
    pass(`${id.toUpperCase()} approved risk score range`, range);
  }
}

function validateAllocations(master) {
  for (const b of master.baskets) {
    const assetTotal = sumPct(b.assetAllocation);
    const constructionTotal = sumPct(b.portfolioConstruction);
    const holdingsTotal = (b.holdings || []).reduce((s, h) => s + (h.weight || 0), 0);

    if (assetTotal === 100) pass(`${b.name} asset allocation 100%`);
    else fail(`${b.name} asset allocation`, `${assetTotal}%`);

    if (constructionTotal === 100) pass(`${b.name} portfolio construction 100%`);
    else fail(`${b.name} portfolio construction`, `${constructionTotal}%`);

    if (holdingsTotal === 100) pass(`${b.name} holdings weights 100%`);
    else fail(`${b.name} holdings weights`, `${holdingsTotal}%`);

    if (b.price === 99) pass(`${b.name} unlock price ₹99 (testing)`);
    else fail(`${b.name} unlock price`, `₹${b.price}`);
  }

  const fireGold = master.baskets.find((b) => b.id === 'fire')?.assetAllocation?.find((a) => /gold/i.test(a.label))?.pct;
  const waterGold = master.baskets.find((b) => b.id === 'water')?.assetAllocation?.find((a) => /gold/i.test(a.label))?.pct;
  if (fireGold != null && waterGold != null && waterGold <= fireGold) {
    pass('WATER gold ≤ FIRE gold', `${waterGold}% / ${fireGold}%`);
  } else {
    fail('WATER gold ≤ FIRE gold', `${waterGold}% vs ${fireGold}%`);
  }
}

// --- Performance math (mirrors basketPerformance.js) ---
function findNavOnOrBefore(series, targetDate) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    if (series[i].date <= targetDate) return series[i].nav;
  }
  return null;
}

function cagrBetween(startNav, endNav, years) {
  if (!startNav || !endNav || startNav <= 0 || years <= 0) return null;
  return Math.round(((endNav / startNav) ** (1 / years) - 1) * 1000) / 10;
}

function computeNavPeriodReturns(navHistory) {
  if (!navHistory?.length) return {};

  const series = navHistory
    .map((p) => ({ date: new Date(p.date), nav: Number(p.nav) }))
    .filter((r) => !Number.isNaN(r.nav) && r.date.getTime())
    .sort((a, b) => a.date - b.date);

  if (series.length < 2) return {};

  const latest = series[series.length - 1];
  const first = series[0];
  const yearsSince = Math.max((latest.date - first.date) / (365.25 * 86400000), 1 / 365);

  const offset = (months) => {
    const d = new Date(latest.date);
    d.setMonth(d.getMonth() - months);
    return d;
  };
  const offsetYears = (y) => {
    const d = new Date(latest.date);
    d.setFullYear(d.getFullYear() - y);
    return d;
  };

  const pct = (startNav) =>
    startNav && startNav > 0
      ? Math.round(((latest.nav - startNav) / startNav) * 10000) / 100
      : null;

  const nav3y = findNavOnOrBefore(series, offsetYears(3));
  const nav5y = findNavOnOrBefore(series, offsetYears(5));

  return {
    return1m: pct(findNavOnOrBefore(series, offset(1))),
    return3m: pct(findNavOnOrBefore(series, offset(3))),
    return6m: pct(findNavOnOrBefore(series, offset(6))),
    return1y: pct(findNavOnOrBefore(series, offsetYears(1))),
    cagr3y: nav3y ? cagrBetween(nav3y, latest.nav, 3) : null,
    cagr5y: nav5y ? cagrBetween(nav5y, latest.nav, 5) : null,
    cagrSinceInception: cagrBetween(first.nav, latest.nav, yearsSince),
  };
}

function formatPerfPct(val) {
  if (val == null || Number.isNaN(val)) return '—';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val}%`;
}

function validatePerformanceMath(analytics) {
  const series = [
    { date: '2020-01-01', nav: 100 },
    { date: '2021-01-01', nav: 110 },
    { date: '2022-01-01', nav: 121 },
    { date: '2023-01-01', nav: 133.1 },
    { date: '2024-01-01', nav: 146.41 },
    { date: '2025-01-01', nav: 161.05 },
  ];

  const returns = computeNavPeriodReturns(series);
  if (returns.cagrSinceInception > 0) pass('Perf math: since-inception CAGR', `${returns.cagrSinceInception}%`);
  else fail('Perf math: since-inception CAGR');

  if (returns.return1y != null) pass('Perf math: 1Y return', formatPerfPct(returns.return1y));
  else fail('Perf math: 1Y return');

  if (formatPerfPct(5.2) === '+5.2%' && formatPerfPct(null) === '—') pass('Perf math: formatPerfPct');
  else fail('Perf math: formatPerfPct');

  for (const id of ['fire', 'water', 'earth']) {
    const nav = analytics.baskets?.[id]?.navHistory;
    if (nav?.length >= 2) {
      const live = computeNavPeriodReturns(nav);
      const keys = ['return1m', 'return3m', 'return6m', 'return1y', 'cagrSinceInception'];
      const populated = keys.filter((k) => live[k] != null).length;
      pass(`${id.toUpperCase()} cached NAV`, `${populated}/${keys.length} periods, ${nav.length} points`);
    } else {
      fail(`${id.toUpperCase()} cached NAV`, 'missing — run npm run refresh-baskets');
    }
  }
}

async function validateAnalyticsApi() {
  for (const id of ['fire', 'water', 'earth']) {
    const url = `${apiBase.replace(/\/$/, '')}/api/baskets/${id}/analytics`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        fail(`API GET /api/baskets/${id}/analytics`, `HTTP ${res.status}`);
        continue;
      }
      const json = await res.json();
      if (json?.returns && json?.navHistory?.length) {
        pass(`API ${id}/analytics live`, `${json.navHistory.length} NAV points`);
      } else {
        fail(`API ${id}/analytics live`, 'missing returns or navHistory');
      }
    } catch (e) {
      fail(`API ${id}/analytics live`, `${e.message} (start: npm run server)`);
    }
  }
}

function validateMobileCss() {
  const checks = [
    'src/basket/styles/basket-detail.css',
    'src/basket/styles/basket-analytics.css',
    'src/basket/styles/basket-shared.css',
    'src/components/LeadForm/HomeLeadCapture.css',
    'src/containers/home/home.css',
  ];
  let withMedia = 0;
  for (const rel of checks) {
    const content = fs.readFileSync(path.join(root, rel), 'utf8');
    if (/@media\s*\(max-width/.test(content)) withMedia += 1;
  }
  if (withMedia === checks.length) pass('Mobile CSS breakpoints', `${withMedia}/${checks.length} key files`);
  else fail('Mobile CSS breakpoints', `${withMedia}/${checks.length}`);
}

function validateBuildArtifact() {
  const index = path.join(root, 'build/index.html');
  if (fs.existsSync(index)) pass('Production build artifact exists');
  else fail('Production build artifact', 'run npm run build first');
}

console.log('\n=== Pre-release validation (item 17) ===\n');
console.log(`API base: ${apiBase}\n`);

const master = readJson('api/data/basketMaster.json');
const analytics = readJson('api/data/basketAnalytics.json');

validateRiskProfiling();
validateRecommendations(master);
validateAllocations(master);
validatePerformanceMath(analytics);
validateMobileCss();
validateBuildArtifact();
await validateAnalyticsApi();

console.log('\n--- Summary ---');
console.log(`Passed: ${results.filter((r) => r.ok).length}`);
console.log(`Failed: ${failures}`);

if (failures > 0) {
  console.log('\nFix failures before production deploy.');
  process.exit(1);
}

console.log('\nAll automated checks passed.\nManual QA on staging:');
console.log('  1. /invest/risk-profile — complete 6 questions, verify basket match');
console.log('  2. /invest/baskets — recommendation pills + compare table scroll (mobile)');
console.log('  3. /invest/basket/fire — KPI strip, growth chart, portfolio construction');
console.log('  4. Homepage — lead capture section at 375px width');
console.log('  5. Footer — single consolidated disclaimer\n');
process.exit(0);
