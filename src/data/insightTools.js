/** Public insight-tool URLs shown in nav, footer, and CTAs. */
export const MARKET_COMPASS_URL = 'https://compass.anupaatnivesh.com';
export const MARKET_COMPASS_LOGIN_PATH = '/valuation/login';
/** Proxied breadth app; `embed=1` skips top-level redirect to this site’s chrome page. */
export const MARKET_BREADTH_URL = 'https://markets.anupaatnivesh.com/?embed=1';
export const MARKET_BREADTH_PATH = '/screeners/market-breadth';

/** Routes that embed an external tool under site chrome (navbar + ticker). */
export const EMBEDDED_TOOL_PATHS = [MARKET_COMPASS_LOGIN_PATH, MARKET_BREADTH_PATH];

/** Hostinger often serves `/path/` — normalize before embed-route checks. */
export function normalizeAppPath(pathname = '') {
  const trimmed = String(pathname).split('?')[0].replace(/\/+$/, '');
  return trimmed || '/';
}

export function isEmbeddedToolPath(pathname) {
  return EMBEDDED_TOOL_PATHS.includes(normalizeAppPath(pathname));
}
