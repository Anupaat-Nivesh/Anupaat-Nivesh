/**
 * Minimal NSE India fetch helper (server-side proxy).
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const DEFAULT_HEADERS = {
  'User-Agent': UA,
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.nseindia.com/',
};

/**
 * @param {string} path - e.g. `/api/allIndices`
 * @param {{ referer?: string }} [opts]
 */
export async function nseFetch(path, opts = {}) {
  const url = path.startsWith('http') ? path : `https://www.nseindia.com${path}`;
  const res = await fetch(url, {
    headers: {
      ...DEFAULT_HEADERS,
      ...(opts.referer ? { Referer: opts.referer } : {}),
    },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`NSE ${res.status} ${path}: ${t.slice(0, 120)}`);
  }
  return res.json();
}

export function formatNseDateDdMmmYyyy(d = new Date()) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export function parseDealDate(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d{2})-([A-Za-z]+)-(\d{4})$/);
  if (!m) return null;
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Sept: 8, Oct: 9, Nov: 10, Dec: 11,
  };
  const mon = months[m[2]];
  if (mon == null) return null;
  return new Date(Number(m[3]), mon, Number(m[1]));
}
