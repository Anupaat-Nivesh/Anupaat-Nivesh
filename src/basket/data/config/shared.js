export const BASKET_UNLOCK_PRICE = 4999;

export const performanceSeries = (base, volatility) => {
  const months = [];
  let v = base;
  for (let i = 0; i < 36; i += 1) {
    v *= 1 + (Math.sin(i / 3) * volatility + (i % 5) * 0.002);
    months.push({ m: i + 1, v: Math.round(v * 100) / 100 });
  }
  return months;
};

/** Lumpsum projection from expected CAGR (config-driven, not UI hardcoded). */
export function projectLumpsum(principal, cagrPct, years) {
  return Math.round(principal * (1 + cagrPct / 100) ** years);
}

export function formatLakhINR(amount) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Asset allocation slices must sum to 100% — single source of truth for public/compare views. */
export function sumAllocationPct(slices = []) {
  return slices.reduce((s, a) => s + (Number(a.pct) || 0), 0);
}

export function getAssetAllocationPct(basket, label) {
  const slice = basket.allocationPreviewFree?.find((a) => a.label === label);
  return slice?.pct ?? null;
}

const REQUIRED_ASSET_LABELS = ['Equity', 'Debt / Liquid', 'Gold', 'Hybrid / Multi Asset'];

export function validateBasketAllocations(baskets) {
  const issues = [];
  for (const b of baskets) {
    const labels = (b.allocationPreviewFree || []).map((a) => a.label);
    for (const req of REQUIRED_ASSET_LABELS) {
      if (!labels.includes(req)) {
        issues.push(`${b.id}: missing asset class "${req}"`);
      }
    }
    const assetSum = sumAllocationPct(b.allocationPreviewFree);
    if (Math.abs(assetSum - 100) > 0.01) {
      issues.push(`${b.id}: allocationPreviewFree sums to ${assetSum}% (expected 100%)`);
    }
    const constructionSum = sumAllocationPct(b.portfolioConstruction);
    if (Math.abs(constructionSum - 100) > 0.01) {
      issues.push(`${b.id}: portfolioConstruction sums to ${constructionSum}% (expected 100%)`);
    }
  }
  return issues;
}
