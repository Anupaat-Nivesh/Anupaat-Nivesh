import { useEffect, useState } from 'react';
import { fetchBasketAnalytics } from '../services/basketAnalyticsApi';

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
        if (!cancelled) setData(json);
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
