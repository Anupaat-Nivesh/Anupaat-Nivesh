/**
 * Client for mfdata.in — free MF API (AUM, returns, holdings, managers).
 * https://mfdata.in/docs
 */

const MFDATA_BASE = process.env.MFDATA_API_BASE || 'https://mfdata.in/api/v1';
const REQUEST_TIMEOUT_MS = Number(process.env.MFDATA_TIMEOUT_MS) || 12000;

export class MfdataUnavailableError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'MfdataUnavailableError';
    this.status = status;
  }
}

async function mfdataFetch(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${MFDATA_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      throw new MfdataUnavailableError(`mfdata.in HTTP ${res.status}`, res.status);
    }
    const json = await res.json();
    if (json?.status !== 'success') {
      throw new MfdataUnavailableError(json?.message || 'mfdata.in error');
    }
    return json.data;
  } catch (e) {
    if (e?.name === 'AbortError') {
      throw new MfdataUnavailableError('mfdata.in request timed out');
    }
    if (e instanceof MfdataUnavailableError) throw e;
    throw new MfdataUnavailableError(e?.message || 'mfdata.in unreachable');
  } finally {
    clearTimeout(timer);
  }
}

/** @param {number|string} schemeCode AMFI / mfapi scheme code */
export function fetchMfdataScheme(schemeCode) {
  return mfdataFetch(`/schemes/${encodeURIComponent(schemeCode)}`);
}

export function fetchMfdataHoldings(familyId, month) {
  const q = month ? `?month=${encodeURIComponent(month)}` : '';
  return mfdataFetch(`/families/${familyId}/holdings${q}`);
}

export function fetchMfdataSectors(familyId) {
  return mfdataFetch(`/families/${familyId}/sectors`);
}

export function fetchMfdataPeople(familyId) {
  return mfdataFetch(`/families/${familyId}/people`);
}

export function searchMfdataSchemes(query, limit = 10) {
  return mfdataFetch(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

/** Up to 100 scheme codes (POST body). */
export async function bulkMfdataSchemes(schemeCodes) {
  const codes = schemeCodes.map((c) => Number(c)).filter((n) => !Number.isNaN(n));
  if (!codes.length) return [];
  return mfdataFetch('/schemes/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scheme_codes: codes.slice(0, 100) }),
  });
}
