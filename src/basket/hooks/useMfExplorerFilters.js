import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  DEFAULT_MF_FILTERS,
  applyPresetParams,
  parseMfFiltersFromSearchParams,
  mfFiltersToSearchParams,
} from '../../shared/marketInsights/mfExplorerConfig';

export default function useMfExplorerFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseMfFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  const setFilters = useCallback(
    (next) => {
      const merged = typeof next === 'function' ? next(filters) : { ...filters, ...next };
      const params = mfFiltersToSearchParams(merged);
      setSearchParams(params, { replace: true });
    },
    [filters, setSearchParams]
  );

  const applyPreset = useCallback(
    (presetId) => {
      setFilters(applyPresetParams(presetId));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const patchFilter = useCallback(
    (key, value) => {
      setFilters((prev) => {
        const base = { ...prev, [key]: value };
        if (key !== 'preset') base.preset = '';
        return base;
      });
    },
    [setFilters]
  );

  const setCategories = useCallback(
    (categories) => {
      setFilters((prev) => ({ ...prev, categories, preset: '' }));
    },
    [setFilters]
  );

  const toggleCategory = useCallback(
    (id) => {
      setFilters((prev) => {
        const has = prev.categories.includes(id);
        const categories = has
          ? prev.categories.filter((c) => c !== id)
          : [...prev.categories, id];
        return {
          ...prev,
          categories: categories.length ? categories : [...DEFAULT_MF_FILTERS.categories],
          preset: '',
        };
      });
    },
    [setFilters]
  );

  return {
    filters,
    setFilters,
    applyPreset,
    resetFilters,
    patchFilter,
    setCategories,
    toggleCategory,
  };
}
