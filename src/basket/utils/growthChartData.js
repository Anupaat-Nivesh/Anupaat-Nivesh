/** Growth chart — resolve NAV series, benchmark alignment, and ₹1L summary values. */

export function performanceLineToNavHistory(performanceLine, inceptionDate) {
  if (!performanceLine?.length) return [];

  const start = inceptionDate ? new Date(inceptionDate) : new Date();
  if (Number.isNaN(start.getTime())) {
    start.setTime(Date.now());
    start.setMonth(start.getMonth() - performanceLine.length);
  }

  return performanceLine.map(({ m, v }) => {
    const d = new Date(start);
    d.setMonth(d.getMonth() + (m - 1));
    return { date: d.toISOString().slice(0, 10), nav: v };
  });
}

export function resolveNavHistory(analytics, basket) {
  if (analytics?.navHistory?.length) return analytics.navHistory;
  if (basket?.performanceLine?.length) {
    return performanceLineToNavHistory(
      basket.performanceLine,
      analytics?.inceptionDate || basket.inceptionDate
    );
  }
  return [];
}

/** Map benchmark NAV onto basket date labels (last known value on or before each date). */
export function alignBenchmarkNav(basketDates, benchmarkSeries) {
  if (!basketDates?.length) return [];
  if (!benchmarkSeries?.length) return basketDates.map(() => null);

  const sorted = [...benchmarkSeries].sort((a, b) =>
    String(a.date).localeCompare(String(b.date))
  );

  return basketDates.map((date) => {
    let last = null;
    for (const pt of sorted) {
      if (String(pt.date) > String(date)) break;
      last = pt.nav;
    }
    return last;
  });
}

export function growthFromIndexedNav(nav) {
  if (nav == null || Number.isNaN(nav)) return null;
  return Math.round((nav / 100) * 100000);
}

export function getResolvedGrowthComparison(analytics, navHistory) {
  const gc = analytics?.growthComparison || {};
  const latestBasketNav = analytics?.returns?.currentNav ?? navHistory?.at(-1)?.nav;
  const latestNiftyNav =
    analytics?.benchmarks?.nifty50?.currentNav ??
    analytics?.benchmarks?.nifty50?.series?.at(-1)?.nav;

  return {
    basket: gc.basket ?? growthFromIndexedNav(latestBasketNav),
    nifty50: gc.nifty50 ?? growthFromIndexedNav(latestNiftyNav),
  };
}

export function buildGrowthChartModel(analytics, basket, { activeSeries = ['basket', 'nifty50'] } = {}) {
  const navHistory = resolveNavHistory(analytics, basket);
  if (!navHistory.length) return { navHistory: [], growth: {}, chartData: null };

  const labels = navHistory.map((p) => p.date);
  const growth = getResolvedGrowthComparison(analytics, navHistory);
  const datasets = [];

  if (activeSeries.includes('basket')) {
    datasets.push({
      label: 'Basket NAV',
      data: navHistory.map((p) => p.nav),
    });
  }

  if (activeSeries.includes('nifty50')) {
    const bmSeries = analytics?.benchmarks?.nifty50?.series;
    if (bmSeries?.length) {
      datasets.push({
        label: 'Nifty 50',
        data: alignBenchmarkNav(labels, bmSeries),
      });
    }
  }

  return {
    navHistory,
    growth,
    chartData: datasets.length ? { labels, datasets } : null,
  };
}
