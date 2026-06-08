/**
 * Enrich basket fund rows with return3y / expense for UI until admin provides live data.
 */
export function enrichBasketFunds(basket) {
  const baseReturn = basket.metrics?.cagr3y ?? 12;
  const funds = (basket.funds || []).map((f, i) => ({
    ...f,
    return3y: f.return3y ?? Math.round((baseReturn + (i % 5) * 2.1 - 4) * 10) / 10,
    expenseRatio: f.expenseRatio ?? (0.8 + (i % 4) * 0.35).toFixed(2),
  }));

  const equityPct =
    basket.allocationFull?.find((a) => /equity/i.test(a.name))?.pct ||
    basket.allocationPreviewFree?.find((a) => /equity/i.test(a.label))?.pct ||
    0;

  const debtPct =
    basket.allocationFull?.find((a) => /debt|hybrid|liquid/i.test(a.name))?.pct || 0;

  const avgExpense =
    funds.length > 0
      ? Math.round((funds.reduce((s, f) => s + parseFloat(f.expenseRatio || 0), 0) / funds.length) * 100) / 100
      : 1.2;

  const constructionSlices = basket.portfolioConstruction?.length
    ? basket.portfolioConstruction
    : null;

  return {
    ...basket,
    funds,
    expenseRatio: basket.expenseRatio ?? avgExpense,
    equityPct,
    debtPct,
    distributionSlices: constructionSlices
      ? constructionSlices.map((a) => ({ label: a.label, pct: a.pct, color: a.color }))
      : basket.allocationFull?.length
        ? basket.allocationFull.map((a) => ({ label: a.name, pct: a.pct, color: a.color }))
        : basket.allocationPreviewFree.map((a) => ({ label: a.label, pct: a.pct, color: a.color })),
    assetSlices: basket.allocationPreviewFree?.map((a) => ({
      label: a.label,
      pct: a.pct,
      color: a.color,
    })),
  };
}
