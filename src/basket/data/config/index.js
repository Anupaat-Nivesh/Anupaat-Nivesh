import fire from './fire.js';
import water from './water.js';
import earth from './earth.js';
import { getAssetAllocationPct, validateBasketAllocations } from './shared.js';

export const ELEMENTAL_BASKET_IDS = ['fire', 'water', 'earth'];

export const elementalBaskets = [fire, water, earth];

export const basketById = Object.fromEntries(elementalBaskets.map((b) => [b.id, b]));

/** Dev guard — allocations must total 100% */
if (process.env.NODE_ENV === 'development') {
  const issues = validateBasketAllocations(elementalBaskets);
  if (issues.length) {
    console.warn('[basket config] Allocation validation:', issues.join('; '));
  }
}

/** Risk profile → basket mapping for recommendation widget */
export const BASKET_RECOMMENDATIONS = elementalBaskets.map((b) => ({
  riskProfile: b.recommendation.riskProfile,
  label: b.recommendation.label,
  basketId: b.id,
  name: b.name,
  personality: b.personality,
  expectedReturn: b.expectedReturn,
  riskLevel: b.riskLevel,
}));

/** Standard 4 asset-class heads — same order on every basket; must sum to 100% each. */
export const STANDARD_ASSET_CLASS_LABELS = [
  'Equity',
  'Debt / Liquid',
  'Gold',
  'Hybrid / Multi Asset',
];

/**
 * Fixed 4-row asset allocation for comparison table (reads allocationPreviewFree only).
 */
export function getAssetAllocationCompareLabels() {
  return STANDARD_ASSET_CLASS_LABELS;
}

/** Standardized comparison rows — same order and labels on landing + detail. */
export const COMPARISON_META_ROWS = [
  { key: 'comparison.objective', label: 'Objective' },
  { key: 'riskLevel', label: 'Risk Level' },
  { key: 'comparison.riskScoreRange', label: 'Risk Score (out of 10)' },
  { key: 'horizonYears', label: 'Investment Horizon' },
  { key: 'minInvestment', label: 'Minimum Investment', format: 'inr' },
  { key: 'expectedReturn', label: 'Expected Return*', format: 'pct' },
  { key: 'comparison.suitability', label: 'Suitable For' },
];

/** @deprecated Use COMPARISON_META_ROWS + getAssetAllocationCompareLabels */
export const COMPARISON_TABLE_ROWS = COMPARISON_META_ROWS;

export function getComparisonValue(basket, key) {
  if (key.startsWith('asset:')) {
    const label = key.slice('asset:'.length);
    return getAssetAllocationPct(basket, label);
  }
  if (key.includes('.')) {
    const [a, b] = key.split('.');
    return basket[a]?.[b];
  }
  return basket[key];
}

export function getAssetAllocationTotal(basket) {
  return (basket.allocationPreviewFree || []).reduce((s, a) => s + (a.pct || 0), 0);
}

export { fire, water, earth };
export {
  projectLumpsum,
  formatLakhINR,
  formatINR,
  getAssetAllocationPct,
  sumAllocationPct,
  BASKET_MIN_INVESTMENT,
  BASKET_UNLOCK_PRICE,
} from './shared.js';
