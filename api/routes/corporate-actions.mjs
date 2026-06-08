/**
 * Corporate actions (splits, bonus, dividends) from NSE India.
 * Proxied server-side to avoid browser CORS and NSE bot blocks.
 *
 * Upstream: GET https://www.nseindia.com/api/corporates-corporateActions
 */

import express from 'express';

const router = express.Router();

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const NSE_HEADERS = {
  'User-Agent': UA,
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  Referer: 'https://www.nseindia.com/companies-listing/corporate-filings-actions',
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = { at: 0, payload: null };

const MONTHS = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Sept: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseNseDate(str) {
  if (!str || str === '-') return null;
  const m = String(str).match(/^(\d{2})-([A-Za-z]+)-(\d{4})$/);
  if (!m) return null;
  const mon = MONTHS[m[2]];
  if (mon == null) return null;
  return new Date(Number(m[3]), mon, Number(m[1]));
}

function formatDisplayDate(d) {
  if (!d || Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseMoneyRs(text) {
  const m = String(text).match(/Rs\.?\s*([\d.]+)/i);
  return m ? parseFloat(m[1]) : null;
}

function classifyAction(subject) {
  const s = String(subject || '').trim();
  const lower = s.toLowerCase();
  if (lower.includes('face value split') || lower.includes('sub-division')) return 'split';
  if (/^bonus\s/i.test(s)) return 'bonus';
  if (lower.includes('dividend')) return 'dividend';
  return null;
}

function parseSplit(subject, faceVal) {
  const fromTo = String(subject).match(
    /from\s+rs\.?\s*([\d.]+)(?:\s*\/\s*-)?\s*per\s+share\s+to\s+rs\.?\s*([\d.]+)(?:\s*\/\s*-)?/i
  );
  const oldFv = fromTo ? parseFloat(fromTo[1]) : parseFloat(faceVal) || null;
  const newFv = fromTo ? parseFloat(fromTo[2]) : null;
  const tag =
    oldFv != null && newFv != null
      ? `FV: ${oldFv.toFixed(2)} → ${newFv.toFixed(2)}`
      : 'Face value split';
  let description = subject;
  if (oldFv != null && newFv != null && newFv > 0) {
    const mult = oldFv / newFv;
    const multStr = Number.isInteger(mult) ? String(mult) : mult.toFixed(2);
    description = `Each share becomes ${multStr} share(s) after split.`;
  }
  return { tag, description, oldFv, newFv };
}

function parseBonus(subject) {
  const m = String(subject).match(/bonus\s*(\d+)\s*:\s*(\d+)/i);
  const ratio = m ? `${m[1]}:${m[2]}` : null;
  const tag = ratio ? `Ratio: ${ratio}` : 'Bonus issue';
  let description = subject;
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (b > 0) {
      description = `Get ${a} bonus share(s) for every ${b} share(s) held.`;
    }
  }
  return { tag, description, ratio };
}

function parseDividend(subject, faceVal) {
  const s = String(subject);
  let dividendType = 'Dividend';
  if (/interim/i.test(s)) dividendType = 'Interim';
  else if (/final/i.test(s)) dividendType = 'Final';
  else if (/special/i.test(s)) dividendType = 'Special';

  const amounts = [...s.matchAll(/rs\.?\s*([\d.]+)\s*per\s+share/gi)].map((x) => parseFloat(x[1]));
  const amount = amounts.length ? amounts.reduce((a, b) => a + b, 0) : parseMoneyRs(s);
  const fv = parseFloat(faceVal);
  const payoutPct =
    amount != null && fv > 0 ? Math.round((amount / fv) * 10000) / 100 : null;

  const valueTag = amount != null ? `Value: ${amount} Rs.` : 'Dividend';
  const payoutNote =
    payoutPct != null ? `Payout: ${payoutPct.toFixed(2)}% of FV` : s.slice(0, 80);

  return {
    dividendType,
    valueTag,
    perShareLabel: 'PER SHARE',
    payoutNote,
    amount,
  };
}

function normalizeRow(raw) {
  const kind = classifyAction(raw.subject);
  if (!kind) return null;

  const exDateObj = parseNseDate(raw.exDate);
  const base = {
    symbol: raw.symbol,
    companyName: raw.comp || raw.symbol,
    series: raw.series,
    faceValue: raw.faceVal,
    subject: raw.subject,
    exDate: formatDisplayDate(exDateObj),
    exDateObj: exDateObj ? exDateObj.getTime() : 0,
    kind,
  };

  if (kind === 'split') {
    return { ...base, ...parseSplit(raw.subject, raw.faceVal) };
  }
  if (kind === 'bonus') {
    return { ...base, ...parseBonus(raw.subject) };
  }
  return { ...base, ...parseDividend(raw.subject, raw.faceVal) };
}

function pickItems(rows, limit) {
  const today = startOfDay(new Date());
  const valid = rows.filter((r) => r.exDateObj > 0);
  const upcoming = valid
    .filter((r) => new Date(r.exDateObj) >= today)
    .sort((a, b) => a.exDateObj - b.exDateObj);
  if (upcoming.length >= limit) return upcoming.slice(0, limit);
  const past = valid
    .filter((r) => new Date(r.exDateObj) < today)
    .sort((a, b) => b.exDateObj - a.exDateObj);
  return [...upcoming, ...past].slice(0, limit);
}

function formatRangeDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function fetchNseCorporateActions(fromDate, toDate) {
  const url = `https://www.nseindia.com/api/corporates-corporateActions?index=equities&from_date=${fromDate}&to_date=${toDate}`;
  const res = await fetch(url, { headers: NSE_HEADERS });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`NSE HTTP ${res.status} ${t.slice(0, 120)}`);
  }
  const json = await res.json();
  if (!Array.isArray(json)) throw new Error('Unexpected NSE response');
  return json;
}

router.get('/', async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 5, 1), 15);
  const now = Date.now();

  if (cache.payload && now - cache.at < CACHE_TTL_MS) {
    return res.json({
      ok: true,
      cached: true,
      fetchedAt: cache.at,
      source: 'NSE India',
      ...cache.payload,
    });
  }

  try {
    const from = new Date();
    from.setMonth(from.getMonth() - 3);
    const to = new Date();
    to.setMonth(to.getMonth() + 9);

    const raw = await fetchNseCorporateActions(formatRangeDate(from), formatRangeDate(to));
    const normalized = raw.map(normalizeRow).filter(Boolean);

    const payload = {
      splits: pickItems(
        normalized.filter((r) => r.kind === 'split'),
        limit
      ),
      bonuses: pickItems(
        normalized.filter((r) => r.kind === 'bonus'),
        limit
      ),
      dividends: pickItems(
        normalized.filter((r) => r.kind === 'dividend'),
        limit
      ),
      disclaimer:
        'Corporate action dates and terms from NSE India (unofficial API). Ex-dates can change; verify on the exchange before acting. Not investment advice.',
    };

    cache = { at: now, payload };
    res.json({ ok: true, cached: false, fetchedAt: now, source: 'NSE India', ...payload });
  } catch (e) {
    console.error('corporate-actions:', e);
    res.status(502).json({
      ok: false,
      error: e?.message || 'Failed to load corporate actions',
      splits: [],
      bonuses: [],
      dividends: [],
    });
  }
});

export default router;
