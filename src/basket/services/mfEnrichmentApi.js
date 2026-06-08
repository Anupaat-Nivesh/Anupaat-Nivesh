/**
 * Backend proxy for mfdata.in enrichment (AUM, holdings, managers).
 */

import { buildApiUrl } from '../../api/config';

async function parseJson(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error || `API ${res.status}`);
  }
  return body;
}

export async function fetchEnrichmentBulk(schemeCodes) {
  if (!schemeCodes?.length) return {};
  const url = buildApiUrl('/api/mutual-funds/enrich/bulk');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ schemeCodes: schemeCodes.map(String) }),
  });
  const body = await parseJson(res);
  return body.schemes || {};
}

export async function fetchFundProfile(schemeCode) {
  const url = buildApiUrl(`/api/mutual-funds/profile/${encodeURIComponent(schemeCode)}`);
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  const body = await parseJson(res);
  return body.profile;
}
