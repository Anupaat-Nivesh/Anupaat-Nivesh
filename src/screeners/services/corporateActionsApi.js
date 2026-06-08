import { getApiBaseUrl } from '../../api/config';

function corporateActionsUrl(limit = 5) {
  const base = getApiBaseUrl();
  const q = new URLSearchParams({ limit: String(limit) });
  if (base) return `${base}/api/corporate-actions?${q}`;
  return `/api/corporate-actions?${q}`;
}

/**
 * @returns {Promise<{
 *   ok: boolean;
 *   splits: Array;
 *   bonuses: Array;
 *   dividends: Array;
 *   error?: string;
 *   source?: string;
 *   disclaimer?: string;
 * }>}
 */
export async function fetchCorporateActions(limit = 5) {
  const res = await fetch(corporateActionsUrl(limit), {
    headers: { Accept: 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

export const NSE_CORPORATE_ACTIONS_URL =
  'https://www.nseindia.com/companies-listing/corporate-filings-actions';
