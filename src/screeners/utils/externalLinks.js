function clean(value) {
  return String(value || '').trim();
}

export function toNseSymbol(symbol) {
  const raw = clean(symbol).toUpperCase();
  if (!raw) return '';
  return raw.replace(/[^A-Z0-9&-]/g, '');
}

export function buildNseQuoteUrl(symbol) {
  const sym = toNseSymbol(symbol);
  if (!sym) return null;
  return `https://www.nseindia.com/get-quotes/equity?symbol=${encodeURIComponent(sym)}`;
}

export function buildNseSearchUrl(query) {
  const q = clean(query);
  if (!q) return null;
  return `https://www.nseindia.com/search?q=${encodeURIComponent(q)}`;
}

export function buildNewsSearchUrl({ symbol, companyName } = {}) {
  const query = [clean(companyName), clean(symbol)].filter(Boolean).join(' ');
  if (!query) return null;
  return `https://news.google.com/search?q=${encodeURIComponent(query)}`;
}
