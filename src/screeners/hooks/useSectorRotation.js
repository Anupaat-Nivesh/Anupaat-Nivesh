import { useEffect, useState } from 'react';
import { fetchSectorRotation } from '../services/screenersApi';

export default function useSectorRotation() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchSectorRotation();
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load sector rotation data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { loading, error, data };
}
