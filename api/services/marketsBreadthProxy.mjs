/**
 * Serves the market-breadth app on markets.anupaatnivesh.com.
 * Upstream origin is server-side only so the public site never links to it.
 *
 * Top-level browser visits redirect to the Anupaat embed page (iframe chrome).
 * Iframe / asset / data requests are proxied and rewritten off manasarora hosts.
 */

const PUBLIC_HOST = (process.env.MARKETS_PUBLIC_HOST || 'markets.anupaatnivesh.com')
  .replace(/^https?:\/\//, '')
  .split('/')[0]
  .toLowerCase();

const UPSTREAM_ORIGIN = (process.env.MARKETS_BREADTH_ORIGIN || 'https://markets.manasarora.com')
  .replace(/\/+$/, '');

const UPSTREAM_LEDGER = (
  process.env.MARKETS_BREADTH_LEDGER_ORIGIN ||
  'https://breadth-ledger.manas-arora.workers.dev'
).replace(/\/+$/, '');

/**
 * Live feed includes `near` + `rs` (Industry dropdowns for 52w highs / RS rating).
 * Snapshot is a smaller fallback without those arrays.
 */
const UPSTREAM_DATA_URL =
  process.env.MARKETS_BREADTH_DATA_URL || `${UPSTREAM_LEDGER}/data.json`;

const UPSTREAM_SNAP_URL =
  process.env.MARKETS_BREADTH_SNAP_URL || `${UPSTREAM_LEDGER}/data-snapshot.json`;

const UPSTREAM_HIT_URL =
  process.env.MARKETS_BREADTH_HIT_URL || 'https://breadth-hit.manas-arora.workers.dev/';

const UPSTREAM_NEW_URL =
  process.env.MARKETS_BREADTH_NEW_URL || 'https://breadth-new.manas-arora.workers.dev/';

const EMBED_PAGE_URL =
  process.env.MARKETS_EMBED_URL ||
  'https://www.anupaatnivesh.com/screeners/market-breadth';

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-encoding',
  'content-length',
]);

export function isMarketsBreadthHost(req) {
  const host = String(req.headers.host || '')
    .split(':')[0]
    .toLowerCase();
  return host === PUBLIC_HOST || host === `www.${PUBLIC_HOST}`;
}

function pathOnly(req) {
  const raw = req.originalUrl || req.url || '/';
  return String(raw).split('?')[0] || '/';
}

/** Top-level document visits → branded Anupaat page with iframe; iframe loads stay proxied. */
function shouldRedirectToEmbed(req) {
  const path = pathOnly(req);
  if (path !== '/' && path !== '') return false;

  const raw = String(req.originalUrl || req.url || '/');
  if (/[?&]embed(=|&|$)/i.test(raw)) return false;

  const dest = String(req.headers['sec-fetch-dest'] || '').toLowerCase();
  // Only redirect clear top-level navigations. Missing dest (older clients / some
  // embedders) must keep proxying so the Anupaat iframe still loads the tool.
  if (dest === 'iframe' || dest === 'embedded') return false;
  return dest === 'document';
}

function isEmbedRequest(req) {
  const raw = String(req.originalUrl || req.url || '/');
  return /[?&]embed(=|&|$)/i.test(raw);
}

/**
 * Rewrite absolute manas / worker URLs to same-origin relative paths.
 * Emails like name@manasarora.com are preserved (never host-substituted).
 */
function rewriteHtml(html, { embed = false } = {}) {
  const emailTokens = [];
  let out = html.replace(/([A-Z0-9._%+-]+)@manasarora\.com/gi, (match) => {
    const token = `__AN_EMAIL_${emailTokens.length}__`;
    emailTokens.push(match);
    return token;
  });

  out = out
    .replace(
      /const DATA_URL=location\.hostname\.endsWith\('workers\.dev'\)\?'\/data\.json':'https:\/\/breadth-ledger\.manas-arora\.workers\.dev\/data\.json';/g,
      "const DATA_URL='/data.json';"
    )
    .replace(
      /const SNAP_URL=location\.hostname\.endsWith\('workers\.dev'\)\?'\/data-snapshot\.json':'https:\/\/breadth-ledger\.manas-arora\.workers\.dev\/data-snapshot\.json';/g,
      "const SNAP_URL='/data-snapshot.json';"
    )
    .replace(
      /const HIT='https:\/\/breadth-hit\.manas-arora\.workers\.dev\/',NEW='https:\/\/breadth-new\.manas-arora\.workers\.dev\/';/g,
      "const HIT='/_an/hit',NEW='/_an/new';"
    )
    .replace(
      /https:\/\/breadth-ledger\.manas-arora\.workers\.dev\/data-snapshot\.json/gi,
      '/data-snapshot.json'
    )
    .replace(
      /https:\/\/breadth-ledger\.manas-arora\.workers\.dev\/data\.json/gi,
      '/data.json'
    )
    .replace(/https:\/\/breadth-ledger\.manas-arora\.workers\.dev/gi, '')
    .replace(/https:\/\/breadth-hit\.manas-arora\.workers\.dev\/?/gi, '/_an/hit')
    .replace(/https:\/\/breadth-new\.manas-arora\.workers\.dev\/?/gi, '/_an/new')
    .replace(/https?:\/\/(?:www\.)?markets\.manasarora\.com/gi, `https://${PUBLIC_HOST}`)
    .replace(/markets\.manasarora\.com/gi, PUBLIC_HOST);

  emailTokens.forEach((email, i) => {
    out = out.split(`__AN_EMAIL_${i}__`).join(email);
  });

  // In Anupaat iframe: hide floating Black Friday bar (covers controls) and keep
  // absolute menus (Sections) from fighting parent chrome.
  if (embed && !/id="an-embed-chrome"/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `<style id="an-embed-chrome">.fcta{display:none!important}#secPanel{z-index:80}</style>\n</head>`
    );
  }

  return out;
}

function targetUrl(req) {
  const raw = req.originalUrl || req.url || '/';
  const path = String(raw).split('?')[0];

  if (path === '/data.json' || path.startsWith('/data.json/')) {
    return UPSTREAM_DATA_URL;
  }
  if (path === '/data-snapshot.json' || path.startsWith('/data-snapshot.json/')) {
    return UPSTREAM_SNAP_URL;
  }
  if (path === '/_an/hit' || path.startsWith('/_an/hit/')) {
    return UPSTREAM_HIT_URL;
  }
  if (path === '/_an/new' || path.startsWith('/_an/new/')) {
    return UPSTREAM_NEW_URL;
  }
  return `${UPSTREAM_ORIGIN}${raw}`;
}

function upstreamHeaders(req) {
  return {
    Accept: req.headers.accept || '*/*',
    // Some ledger edges 404 non-browser UAs; prefer the caller UA or a normal browser string.
    'User-Agent':
      req.headers['user-agent'] ||
      'Mozilla/5.0 (compatible; AnupaatNiveshMarkets/1.0; +https://www.anupaatnivesh.com)',
    Referer: `${UPSTREAM_ORIGIN}/`,
  };
}

async function fetchUpstream(url, req) {
  return fetch(url, {
    method: req.method,
    redirect: 'follow',
    headers: upstreamHeaders(req),
  });
}

export async function proxyMarketsBreadth(req, res) {
  if (shouldRedirectToEmbed(req)) {
    res.redirect(302, EMBED_PAGE_URL);
    return;
  }

  const path = pathOnly(req);
  const isDataJson = path === '/data.json' || path.startsWith('/data.json/');
  // Prefer live ledger even if env still points at snapshot (near/rs power Industry dropdowns).
  const liveDataUrl = UPSTREAM_DATA_URL.includes('data-snapshot')
    ? `${UPSTREAM_LEDGER}/data.json`
    : UPSTREAM_DATA_URL;
  let url = isDataJson ? liveDataUrl : targetUrl(req);
  let upstream;
  try {
    upstream = await fetchUpstream(url, req);
    // Live data.json carries near/rs; fall back to snapshot if live fails.
    if (isDataJson && !upstream.ok && liveDataUrl !== UPSTREAM_SNAP_URL) {
      console.warn(
        `Markets breadth live data ${upstream.status}; falling back to snapshot`
      );
      url = UPSTREAM_SNAP_URL;
      upstream = await fetchUpstream(url, req);
    }
  } catch (err) {
    if (isDataJson && liveDataUrl !== UPSTREAM_SNAP_URL) {
      try {
        console.warn('Markets breadth live data fetch error; falling back to snapshot');
        upstream = await fetchUpstream(UPSTREAM_SNAP_URL, req);
      } catch (err2) {
        console.error('Markets breadth proxy fetch failed:', err2?.message || err2);
        upstream = null;
      }
    } else {
      console.error('Markets breadth proxy fetch failed:', err?.message || err);
      upstream = null;
    }
  }

  if (!upstream) {
    res.status(502).type('html').send(
      '<!doctype html><html><head><meta charset="utf-8"><title>Market breadth</title></head>' +
        '<body style="font-family:system-ui;padding:2rem"><h1>Market breadth is temporarily unavailable</h1>' +
        '<p>Please try again in a few minutes.</p></body></html>'
    );
    return;
  }

  const contentType = upstream.headers.get('content-type') || '';
  res.status(upstream.status);

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    // Drop frame-blocking headers so the tool can embed under anupaatnivesh.com chrome.
    if (HOP_BY_HOP.has(lower) || lower === 'x-frame-options' || lower === 'content-security-policy') {
      return;
    }
    res.setHeader(key, value);
  });
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://www.anupaatnivesh.com https://anupaatnivesh.com http://localhost:3000 http://127.0.0.1:3000"
  );
  res.removeHeader('X-Frame-Options');

  if (contentType.includes('text/html')) {
    const html = rewriteHtml(await upstream.text(), { embed: isEmbedRequest(req) });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    return;
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.send(buffer);
}
