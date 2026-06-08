#!/usr/bin/env node
/**
 * Refresh synthetic basket NAV + metrics from AMFI/mfapi.in NAV history.
 * Schedule daily (e.g. 11 PM IST) via cron or GitHub Actions.
 *
 * Usage: node scripts/refresh-basket-analytics.mjs [fire] [water]
 */

import { refreshAllBasketAnalytics } from '../api/services/basketAnalyticsEngine.mjs';

const basketIds = process.argv.slice(2).filter(Boolean);

console.log('Refreshing basket analytics…', basketIds.length ? basketIds : 'all');

try {
  const result = await refreshAllBasketAnalytics({ basketIds: basketIds.length ? basketIds : undefined });
  for (const [id, data] of Object.entries(result.baskets)) {
    const r = data.returns;
    console.log(
      `${id.toUpperCase()}: NAV ${r.currentNav} | 1Y ${r.return1y}% | 3Y CAGR ${r.cagr3y}% | Sharpe ${data.risk.sharpe}`
    );
  }
  console.log('Done. Saved to api/data/basketAnalytics.json (and Supabase if configured).');
} catch (e) {
  console.error('Failed:', e.message);
  process.exit(1);
}
