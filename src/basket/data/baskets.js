/**
 * Elemental basket catalog — sourced from config/fire|water|earth.js
 * Admin overrides merge at runtime (localStorage).
 */

import { elementalBaskets, ELEMENTAL_BASKET_IDS, BASKET_UNLOCK_PRICE } from './config/index.js';

export const BASKET_IDS = ELEMENTAL_BASKET_IDS;

/** Public product name for FIRE · WATER · EARTH baskets. */
export const BASKET_PRODUCT_NAME = 'Mutual fund baskets';

/** One-time Razorpay unlock fee per basket (FIRE · WATER · EARTH). */
export { BASKET_UNLOCK_PRICE };

export const defaultBaskets = elementalBaskets;

export const futureBaskets = [
  { id: 'air', element: 'air', name: 'AIR', tagline: 'Tactical Opportunities', status: 'coming' },
  { id: 'metal', element: 'metal', name: 'METAL', tagline: 'Gold / Silver Tactical', status: 'coming' },
  { id: 'sky', element: 'sky', name: 'SKY', tagline: 'Global Diversification', status: 'coming' },
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
