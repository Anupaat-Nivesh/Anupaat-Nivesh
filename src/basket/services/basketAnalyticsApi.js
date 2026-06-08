import { getApiBaseUrl } from '../../api/config';

export async function fetchBasketAnalytics(basketId) {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/baskets/${encodeURIComponent(basketId)}/analytics`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Analytics ${res.status}`);
  }
  return res.json();
}
