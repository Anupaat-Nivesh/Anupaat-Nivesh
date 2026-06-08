/** Merge live NAV analytics into basket catalog shape for charts & KPIs. */

export function mergeBasketAnalytics(basket, analytics) {
  if (!basket || !analytics) return basket;

  const { returns, risk, navHistory } = analytics;
  const mvp = basket.historicalPerformanceMvp;
  const performanceLine = (navHistory || []).map((p, i) => ({ m: i + 1, v: p.nav }));

  return {
    ...basket,
    liveAnalytics: analytics,
    metrics: {
      ...basket.metrics,
      cagr3y: returns?.cagr3y ?? mvp?.cagr3y ?? basket.metrics?.cagr3y,
      cagr5y: returns?.cagr5y ?? mvp?.cagr5y ?? basket.metrics?.cagr5y,
      sharpe: risk?.sharpe ?? basket.metrics?.sharpe,
      maxDrawdown: risk?.maxDrawdown ?? basket.metrics?.maxDrawdown,
      volatility: risk?.volatility,
      currentNav: returns?.currentNav,
      return1y: returns?.return1y ?? mvp?.return1y,
      return3m: returns?.return3m ?? mvp?.return3m,
      return6m: returns?.return6m ?? mvp?.return6m,
      growth1Lakh: returns?.growth1Lakh,
    },
    performanceLine: performanceLine.length ? performanceLine : basket.performanceLine,
    volatilityPct: risk?.volatility ?? basket.volatilityPct,
  };
}
