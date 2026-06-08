const PERIOD_DAYS = {
  '1w': 7,
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

export function filterDealsByPeriod(deals, periodKey) {
  if (!deals?.length || !periodKey) return deals || [];
  const days = PERIOD_DAYS[periodKey];
  if (!days) return deals;
  const cutoff = Date.now() - days * 86400000;
  return deals.filter((d) => (d.dateObj || 0) >= cutoff);
}

export function filterDealsBySide(deals, side) {
  if (!deals?.length || !side || side === 'all') return deals || [];
  return deals.filter((d) => d.action === side);
}

export function filterDealsByType(deals, dealType) {
  if (!deals?.length || !dealType || dealType === 'all') return deals || [];
  return deals.filter((d) => d.dealType === dealType);
}

function formatInrCr(valueCr) {
  if (valueCr == null) return '—';
  return `₹ ${valueCr.toFixed(2)} Cr`;
}

/** Client-side stock insights (mirrors API aggregate with filters). */
export function buildStockInsightsFromDeals(deals, { sortBy = 'value', side = 'all' } = {}) {
  let list = filterDealsBySide(deals, side);

  const bySymbol = new Map();
  const byParty = new Map();

  for (const d of list) {
    const sym = d.symbol;
    if (!bySymbol.has(sym)) {
      bySymbol.set(sym, { symbol: sym, companyName: d.companyName, valueCr: 0, count: 0 });
    }
    const s = bySymbol.get(sym);
    s.valueCr += d.valueCr || 0;
    s.count += 1;

    const party = d.party;
    if (!byParty.has(party)) byParty.set(party, { party, partyType: d.partyType, valueCr: 0, count: 0 });
    const p = byParty.get(party);
    p.valueCr += d.valueCr || 0;
    p.count += 1;
  }

  const sortSymbols = (arr, key) => {
    if (key === 'name') return [...arr].sort((a, b) => a.companyName.localeCompare(b.companyName));
    if (key === 'deals') return [...arr].sort((a, b) => b.count - a.count);
    return [...arr].sort((a, b) => b.valueCr - a.valueCr);
  };

  const topDeals = sortSymbols([...bySymbol.values()], sortBy)
    .slice(0, 3)
    .map((r) => ({
      companyName: r.companyName,
      symbol: r.symbol,
      dealsValue: formatInrCr(r.valueCr),
      valueCr: r.valueCr,
    }));

  const insiderTrades = sortSymbols(
    list
      .filter((d) => d.partyType === 'promoter')
      .reduce((acc, d) => {
        const k = d.symbol;
        if (!acc.has(k)) acc.set(k, { symbol: k, companyName: d.companyName, valueCr: 0, count: 0 });
        const s = acc.get(k);
        s.valueCr += d.valueCr || 0;
        s.count += 1;
        return acc;
      }, new Map())
      .values(),
    sortBy
  )
    .slice(0, 3)
    .map((r) => ({
      companyName: r.companyName,
      symbol: r.symbol,
      dealsValue: formatInrCr(r.valueCr),
      valueCr: r.valueCr,
    }));

  const leadingInvestors = [...byParty.values()]
    .filter((p) => p.partyType === 'mf' || p.partyType === 'fii' || p.partyType === 'dii')
    .sort((a, b) => b.valueCr - a.valueCr)
    .slice(0, 3)
    .map((p) => ({
      companyName: p.party.toUpperCase(),
      symbol: '',
      dealsValue: formatInrCr(p.valueCr),
      valueCr: p.valueCr,
    }));

  return { topDeals, insiderTrades, leadingInvestors };
}

/** Delivery panels from filtered deals. */
export function buildDeliveryInsightsFromDeals(deals, { sortBy = 'deals' } = {}) {
  const bySymbol = new Map();
  for (const d of deals || []) {
    if (!bySymbol.has(d.symbol)) {
      bySymbol.set(d.symbol, {
        symbol: d.symbol,
        companyName: d.companyName,
        dealCount: 0,
        totalQty: 0,
        valueCr: 0,
        minDate: d.dateObj,
        maxDate: d.dateObj,
      });
    }
    const s = bySymbol.get(d.symbol);
    s.dealCount += 1;
    s.totalQty += d.quantity || 0;
    s.valueCr += d.valueCr || 0;
    s.minDate = Math.min(s.minDate, d.dateObj || 0);
    s.maxDate = Math.max(s.maxDate, d.dateObj || 0);
  }

  const formatVol = (qty) => {
    if (qty >= 1e7) return `${(qty / 1e7).toFixed(2)} Cr.`;
    if (qty >= 1e5) return `${(qty / 1e5).toFixed(2)} L.`;
    return qty.toLocaleString('en-IN');
  };

  const fmtRange = (min, max) => {
    const f = (t) =>
      t
        ? new Date(t).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
        : '—';
    return `${f(min)} - ${f(max)}`;
  };

  const ranked = [...bySymbol.values()].sort((a, b) => {
    if (sortBy === 'volume') return b.totalQty - a.totalQty;
    if (sortBy === 'value') return b.valueCr - a.valueCr;
    return b.dealCount - a.dealCount;
  });

  const activeStocks = ranked.slice(0, 3).map((s) => ({
    companyName: s.companyName,
    symbol: s.symbol,
    deals: s.dealCount,
  }));

  const byVolume = [...bySymbol.values()].sort((a, b) => b.totalQty - a.totalQty);
  const mapBreakout = (list) =>
    list.slice(0, 3).map((s) => ({
      companyName: s.companyName,
      symbol: s.symbol,
      totalVolume: formatVol(s.totalQty),
      dateRange: fmtRange(s.minDate, s.maxDate),
      endDate: fmtRange(s.maxDate, s.maxDate).split(' - ')[1] || '—',
    }));

  return {
    activeStocks,
    deliveryBreakout: mapBreakout(byVolume),
    volumeBreakout: mapBreakout([...bySymbol.values()].sort((a, b) => b.valueCr - a.valueCr)),
    note: 'Volumes derived from NSE bulk/block deal quantities (proxy, not exchange delivery %).',
  };
}
