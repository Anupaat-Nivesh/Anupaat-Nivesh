/**
 * Mutual fund explorer — presets & URL query keys (shared with /screeners cards).
 */

export const MF_QUERY_KEYS = {
  preset: 'preset',
  q: 'q',
  category: 'category',
  plan: 'plan',
  amc: 'amc',
  cap: 'cap',
  minCagr1y: 'min1y',
  minCagr3y: 'min3y',
  sort: 'sort',
};

export const MF_PLAN_OPTIONS = [
  { value: 'direct', label: 'Direct · Growth' },
  { value: 'regular', label: 'Regular · Growth' },
  { value: 'all', label: 'All plans' },
];

export const MF_CATEGORY_OPTIONS = [
  { value: 'equity', label: 'Equity' },
  { value: 'debt', label: 'Debt' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'international', label: 'International' },
  { value: 'solution', label: 'Solution oriented' },
];

export const MF_CAP_OPTIONS = [
  { value: '', label: 'All styles' },
  { value: 'largecap', label: 'Large cap' },
  { value: 'midcap', label: 'Mid cap' },
  { value: 'smallcap', label: 'Small cap' },
  { value: 'elss', label: 'ELSS / Tax saver' },
  { value: 'index', label: 'Index funds' },
  { value: 'flexi', label: 'Flexi cap' },
];

export const MF_SORT_OPTIONS = [
  { value: 'top-rated', label: 'Top rated' },
  { value: 'return-1y', label: '1Y return' },
  { value: 'return-3y', label: '3Y return' },
  { value: 'name', label: 'Name A–Z' },
];

/** Quick shortcuts — map to filter state (also used on /screeners MF cards). */
export const MF_EXPLORER_PRESETS = [
  {
    id: 'top-rated-equity',
    label: 'Top rated · Equity',
    description: 'Direct growth equity · sorted by score',
    params: { preset: 'top-rated-equity', category: 'equity', plan: 'direct', sort: 'top-rated' },
  },
  {
    id: 'large-cap',
    label: 'Large cap',
    description: 'Blue-chip oriented direct plans',
    params: { preset: 'large-cap', category: 'equity', plan: 'direct', cap: 'largecap', sort: 'top-rated' },
  },
  {
    id: 'elss',
    label: 'ELSS / Tax saver',
    description: 'Section 80C equity funds',
    params: { preset: 'elss', category: 'equity', plan: 'direct', cap: 'elss', sort: 'return-3y' },
  },
  {
    id: 'debt',
    label: 'Debt funds',
    description: 'Liquid, gilt, corporate bond',
    params: { preset: 'debt', category: 'debt', plan: 'direct', sort: 'top-rated' },
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    description: 'Balanced & multi-asset',
    params: { preset: 'hybrid', category: 'hybrid', plan: 'direct', sort: 'top-rated' },
  },
  {
    id: 'high-1y',
    label: '1Y ≥ 15%',
    description: 'Strong recent performers',
    params: { preset: 'high-1y', plan: 'direct', min1y: '15', sort: 'return-1y' },
  },
  {
    id: 'high-3y',
    label: '3Y ≥ 12%',
    description: 'Consistent long-term',
    params: { preset: 'high-3y', plan: 'direct', min3y: '12', sort: 'return-3y' },
  },
  {
    id: 'sip-ready',
    label: 'SIP-ready',
    description: 'Direct growth · diversified',
    params: { preset: 'sip-ready', category: 'equity,hybrid', plan: 'direct', sort: 'top-rated' },
  },
];

export const DEFAULT_MF_FILTERS = {
  preset: '',
  q: '',
  categories: ['equity'],
  plan: 'direct',
  amc: '',
  cap: '',
  minCagr1y: '',
  minCagr3y: '',
  sort: 'top-rated',
};

export function presetById(id) {
  return MF_EXPLORER_PRESETS.find((p) => p.id === id);
}

/** @param {URLSearchParams} searchParams */
export function parseMfFiltersFromSearchParams(searchParams) {
  const presetId = searchParams.get(MF_QUERY_KEYS.preset) || '';
  const preset = presetById(presetId);
  const hasQuery = [...searchParams.keys()].length > 0;
  const hasCategoryParam = searchParams.has(MF_QUERY_KEYS.category);

  let categories;
  if (hasCategoryParam) {
    const categoryRaw = searchParams.get(MF_QUERY_KEYS.category) || '';
    categories = categoryRaw ? categoryRaw.split(',').filter(Boolean) : [];
  } else if (preset?.params?.category) {
    categories = preset.params.category.split(',').filter(Boolean);
  } else if (!hasQuery) {
    categories = [...DEFAULT_MF_FILTERS.categories];
  } else {
    categories = [];
  }

  return {
    preset: presetId,
    q: searchParams.get(MF_QUERY_KEYS.q) || '',
    categories,
    plan: searchParams.get(MF_QUERY_KEYS.plan) || preset?.params?.plan || DEFAULT_MF_FILTERS.plan,
    amc: searchParams.get(MF_QUERY_KEYS.amc) || '',
    cap: searchParams.get(MF_QUERY_KEYS.cap) || preset?.params?.cap || '',
    minCagr1y: searchParams.get(MF_QUERY_KEYS.minCagr1y) || preset?.params?.min1y || '',
    minCagr3y: searchParams.get(MF_QUERY_KEYS.minCagr3y) || preset?.params?.min3y || '',
    sort: searchParams.get(MF_QUERY_KEYS.sort) || preset?.params?.sort || DEFAULT_MF_FILTERS.sort,
  };
}

/** @param {object} filters */
export function mfFiltersToSearchParams(filters) {
  const p = new URLSearchParams();
  if (filters.preset) p.set(MF_QUERY_KEYS.preset, filters.preset);
  if (filters.q?.trim()) p.set(MF_QUERY_KEYS.q, filters.q.trim());
  if (filters.categories?.length) {
    p.set(MF_QUERY_KEYS.category, filters.categories.join(','));
  } else if (filters.preset || filters.q || filters.amc || filters.cap || filters.minCagr1y || filters.minCagr3y) {
    p.set(MF_QUERY_KEYS.category, '');
  }
  if (filters.plan) p.set(MF_QUERY_KEYS.plan, filters.plan);
  if (filters.amc) p.set(MF_QUERY_KEYS.amc, filters.amc);
  if (filters.cap) p.set(MF_QUERY_KEYS.cap, filters.cap);
  if (filters.minCagr1y) p.set(MF_QUERY_KEYS.minCagr1y, String(filters.minCagr1y));
  if (filters.minCagr3y) p.set(MF_QUERY_KEYS.minCagr3y, String(filters.minCagr3y));
  if (filters.sort && filters.sort !== 'top-rated') p.set(MF_QUERY_KEYS.sort, filters.sort);
  return p;
}

export function buildMfExplorerPath(filters) {
  const q = mfFiltersToSearchParams(filters).toString();
  return q ? `/invest/funds?${q}` : '/invest/funds';
}

export function applyPresetParams(presetId) {
  const preset = presetById(presetId);
  if (!preset) return { ...DEFAULT_MF_FILTERS };
  const categoryRaw = preset.params.category || '';
  return {
    ...DEFAULT_MF_FILTERS,
    preset: presetId,
    categories: categoryRaw ? categoryRaw.split(',').filter(Boolean) : DEFAULT_MF_FILTERS.categories,
    plan: preset.params.plan || DEFAULT_MF_FILTERS.plan,
    cap: preset.params.cap || '',
    minCagr1y: preset.params.min1y || '',
    minCagr3y: preset.params.min3y || '',
    sort: preset.params.sort || DEFAULT_MF_FILTERS.sort,
    q: '',
    amc: '',
  };
}
