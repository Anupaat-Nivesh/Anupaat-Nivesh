import { useEffect, useState } from 'react';
import { fetchBasketAnalytics } from '../services/basketAnalyticsApi';
import { getResolvedGrowthComparison } from '../utils/growthChartData';

function enrichAnalyticsClient(json) {
  if (!json) return json;
  const growthComparison = getResolvedGrowthComparison(json, json.navHistory);
  return {
    ...json,
    growthComparison: { ...json.growthComparison, ...growthComparison },
  };
}

export default function useBasketAnalytics(basketId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!basketId) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchBasketAnalytics(basketId)
      .then((json) => {
        if (!cancelled) setData(enrichAnalyticsClient(json));
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [basketId]);

  return { analytics: data, loading, error };
}
