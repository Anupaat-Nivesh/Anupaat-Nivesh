/**
 * Serves the market-breadth app on markets.anupaatnivesh.com.
 * Upstream origin is server-side only so the public site never links to it.
 */

const PUBLIC_HOST = (process.env.MARKETS_PUBLIC_HOST || 'markets.anupaatnivesh.com')
  .replace(/^https?:\/\//, '')
  .split('/')[0]
  .toLowerCase();

const UPSTREAM_ORIGIN = (process.env.MARKETS_BREADTH_ORIGIN || 'https://markets.manasarora.com')
  .replace(/\/+$/, '');

const UPSTREAM_DATA_URL =
  process.env.MARKETS_BREADTH_DATA_URL ||
  'https://breadth-ledger.manas-arora.workers.dev/data.json';

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

function rewriteHtml(html) {
  return html
    .replace(
      /const DATA_URL=location\.hostname\.endsWith\('workers\.dev'\)\?'\/data\.json':'https:\/\/breadth-ledger\.manas-arora\.workers\.dev\/data\.json';/g,
      "const DATA_URL='/data.json';"
    )
    .replace(/https:\/\/breadth-ledger\.manas-arora\.workers\.dev/gi, '')
    .replace(/https?:\/\/(?:www\.)?markets\.manasarora\.com/gi, `https://${PUBLIC_HOST}`)
    .replace(/markets\.manasarora\.com/gi, PUBLIC_HOST)
    .replace(/manasarora\.com/gi, PUBLIC_HOST);
}

function targetUrl(req) {
  const path = req.originalUrl || req.url || '/';
  if (path === '/data.json' || path.startsWith('/data.json?')) {
    return UPSTREAM_DATA_URL;
  }
  return `${UPSTREAM_ORIGIN}${path}`;
}

export async function proxyMarketsBreadth(req, res) {
  const url = targetUrl(req);
  let upstream;
  try {
    upstream = await fetch(url, {
      method: req.method,
      redirect: 'follow',
      headers: {
        Accept: req.headers.accept || '*/*',
        'User-Agent': req.headers['user-agent'] || 'AnupaatNiveshMarkets/1.0',
      },
    });
  } catch (err) {
    console.error('Markets breadth proxy fetch failed:', err?.message || err);
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
    if (!HOP_BY_HOP.has(key.toLowerCase())) {
      res.setHeader(key, value);
    }
  });
  res.setHeader('Cache-Control', 'public, max-age=60');

  if (contentType.includes('text/html')) {
    const html = rewriteHtml(await upstream.text());
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    return;
  }

  const buffer = Buffer.from(await upstream.arrayBuffer());
  res.send(buffer);
}
