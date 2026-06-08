import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvestSubNav from '../components/InvestSubNav';
import useMfExplorerFilters from '../hooks/useMfExplorerFilters';
import MarketInsightsFilterBar from '../../shared/marketInsights/MarketInsightsFilterBar';
import MfExplorerShortcuts from '../../shared/marketInsights/MfExplorerShortcuts';
import {
  MF_CAP_OPTIONS,
  MF_CATEGORY_OPTIONS,
  MF_PLAN_OPTIONS,
  MF_SORT_OPTIONS,
} from '../../shared/marketInsights/mfExplorerConfig';
import {
  loadSchemeList,
  searchSchemes,
  fetchMetricsBatch,
} from '../services/mfApi';
import {
  isDirectGrowthScheme,
  isRegularGrowthScheme,
  inferFundCategory,
  inferFundHouse,
  isLikelyActiveInvestableScheme,
  hasRecentNav,
  matchesCapStyle,
  categoryLabel,
  fundQualityScore,
  starsFromScore,
  formatNav,
  formatAumCr,
  sortFunds,
} from '../utils/mfMetrics';
import '../../shared/marketInsights/market-insights-filters.css';
import '../styles/basket-screener.css';

const PAGE_SIZE = 20;
const RANK_PREFETCH = 80;
const MIN_MAJOR_AMC_FUNDS = 12;
const MAJOR_AMCS = new Set([
  'SBI',
  'HDFC',
  'ICICI Prudential',
  'Nippon India',
  'Aditya Birla Sun Life',
  'Kotak Mahindra',
  'Axis',
  'UTI',
  'DSP',
  'Mirae Asset',
  'Tata',
  'Canara Robeco',
  'Franklin Templeton',
  'Motilal Oswal',
  'Bandhan',
  'Edelweiss',
  'Invesco India',
  'LIC',
  'Sundaram',
  'HSBC',
  'PGIM India',
  'Mahindra Manulife',
  'Navi',
  'Baroda BNP Paribas',
  'Union',
  'Quant',
  'Parag Parikh',
  'WhiteOak',
]);
const ALWAYS_INCLUDE_AMCS = new Set(['WhiteOak', 'Franklin Templeton', 'Mahindra Manulife']);

const MIN_RETURN_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '8', label: '≥ 8%' },
  { value: '10', label: '≥ 10%' },
  { value: '12', label: '≥ 12%' },
  { value: '15', label: '≥ 15%' },
  { value: '18', label: '≥ 18%' },
];

function initials(name) {
  return (name || 'MF')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function StarRating({ score }) {
  const stars = starsFromScore(score);
  if (!stars) return <span className="an-mf-muted">…</span>;
  return (
    <span className="an-mf-fund-table__stars" title={`Score ${score}`}>
      {'★'.repeat(stars)}
      <span className="an-mf-fund-table__stars-dim">{'★'.repeat(5 - stars)}</span>
    </span>
  );
}

function ReturnCell({ value, tone = 'default' }) {
  if (value == null) return <span className="an-mf-muted">…</span>;
  if (tone === 'muted') {
    return <span className="an-mf-return-muted">{value}%</span>;
  }
  if (tone === 'highlight') {
    return <span className="an-mf-return-highlight">{value}%</span>;
  }
  const cls = value >= 0 ? 'an-mf-return-pos' : 'an-mf-return-neg';
  return <span className={cls}>{value}%</span>;
}

export default function MutualFundScreener() {
  const navigate = useNavigate();
  const { filters, applyPreset, resetFilters, patchFilter, setCategories } = useMfExplorerFilters();

  const [allSchemes, setAllSchemes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [searchHits, setSearchHits] = useState(null);
  const [page, setPage] = useState(0);
  const [metrics, setMetrics] = useState({});
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [rankLoading, setRankLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingList(true);
        const list = await loadSchemeList();
        if (!cancelled) setAllSchemes(list);
      } catch (e) {
        if (!cancelled) setListError(e.message || 'Could not load fund list');
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const q = filters.q.trim();
    if (q.length < 2) {
      setSearchHits(null);
      return undefined;
    }
    const t = setTimeout(async () => {
      try {
        const hits = await searchSchemes(q, 80);
        setSearchHits(hits);
        setPage(0);
      } catch {
        setSearchHits([]);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [filters.q]);

  useEffect(() => {
    setPage(0);
  }, [
    filters.preset,
    filters.categories.join(','),
    filters.plan,
    filters.amc,
    filters.cap,
    filters.minCagr1y,
    filters.minCagr3y,
    filters.sort,
  ]);

  const amcOptions = useMemo(() => {
    const counts = new Map();
    allSchemes.forEach((s) => {
      if (!isLikelyActiveInvestableScheme(s.schemeName)) return;
      const amc = inferFundHouse(s.schemeName);
      if (!amc || amc === 'Other') return;
      counts.set(amc, (counts.get(amc) || 0) + 1);
    });
    const list = [...counts.entries()]
      .filter(
        ([amc, count]) =>
          MAJOR_AMCS.has(amc) && (count >= MIN_MAJOR_AMC_FUNDS || ALWAYS_INCLUDE_AMCS.has(amc))
      )
      .sort((a, b) => a[0].localeCompare(b[0], 'en'))
      .map(([amc]) => ({ value: amc, label: amc }));
    return [{ value: '', label: 'All AMCs' }, ...list];
  }, [allSchemes]);

  const filtered = useMemo(() => {
    let base = (searchHits ?? allSchemes).filter((s) => {
      if (!isLikelyActiveInvestableScheme(s.schemeName)) return false;
      const amc = inferFundHouse(s.schemeName);
      return MAJOR_AMCS.has(amc);
    });

    if (filters.plan === 'direct') {
      base = base.filter((s) => isDirectGrowthScheme(s.schemeName));
    } else if (filters.plan === 'regular') {
      base = base.filter((s) => isRegularGrowthScheme(s.schemeName));
    }

    if (filters.categories.length) {
      base = base.filter((s) => filters.categories.includes(inferFundCategory(s.schemeName)));
    }

    if (filters.amc) {
      base = base.filter((s) => inferFundHouse(s.schemeName) === filters.amc);
    }

    if (filters.cap) {
      base = base.filter((s) => matchesCapStyle(s.schemeName, filters.cap));
    }

    if (filters.q.trim().length >= 2 && !searchHits) {
      const q = filters.q.toLowerCase();
      base = base.filter((s) => s.schemeName.toLowerCase().includes(q));
    }

    const min1 = filters.minCagr1y ? Number(filters.minCagr1y) : null;
    const min3 = filters.minCagr3y ? Number(filters.minCagr3y) : null;
    if (min1 != null || min3 != null) {
      base = base.filter((s) => {
        const m = metrics[s.schemeCode];
        if (!m) return true;
        if (min1 != null && (m.cagr1y == null || m.cagr1y < min1)) return false;
        if (min3 != null && (m.cagr3y == null || m.cagr3y < min3)) return false;
        return true;
      });
    }

    base = base.filter((s) => {
      const m = metrics[s.schemeCode];
      if (!m) return true;
      if (m.isActive === false) return false;
      if (m.sipAllowed === false && m.lumpsumAllowed === false) return false;
      if (m.latestNavDate && !hasRecentNav(m.latestNavDate, 15)) return false;
      return true;
    });

    return base;
  }, [allSchemes, searchHits, filters, metrics]);

  const sorted = useMemo(
    () => sortFunds(filtered, metrics, filters.sort),
    [filtered, metrics, filters.sort]
  );

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const mergeMetrics = useCallback((batch) => {
    setMetrics((prev) => {
      const next = { ...prev };
      batch.forEach((val, key) => {
        if (val) next[key] = { ...val, qualityScore: fundQualityScore(val) };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    const codes = sorted.slice(0, RANK_PREFETCH).map((r) => r.schemeCode);
    const missing = codes.filter((c) => !metrics[c]);
    if (!missing.length) return undefined;

    let cancelled = false;
    setRankLoading(true);
    (async () => {
      try {
        const batch = await fetchMetricsBatch(missing, 8);
        if (!cancelled) mergeMetrics(batch);
      } finally {
        if (!cancelled) setRankLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sorted.length, filters.plan, filters.categories.join(','), filters.cap, filters.amc, filters.minCagr1y, filters.minCagr3y, filters.sort, searchHits?.length, filters.q]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPageMetrics = useCallback(async () => {
    const codes = pageRows.map((r) => r.schemeCode);
    const missing = codes.filter((c) => !metrics[c]);
    if (!missing.length) return;
    setLoadingMetrics(true);
    try {
      const batch = await fetchMetricsBatch(missing, 5);
      mergeMetrics(batch);
    } finally {
      setLoadingMetrics(false);
    }
  }, [pageRows, metrics, mergeMetrics]);

  useEffect(() => {
    if (pageRows.length) loadPageMetrics();
  }, [page, pageRows.map((r) => r.schemeCode).join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

  const openFund = (code) => navigate(`/invest/fund/${code}`);

  const categorySelectValue = filters.categories.length === 1 ? filters.categories[0] : '';

  const primaryFields = [
    {
      id: 'mf-search',
      label: 'SEARCH FUND',
      type: 'search',
      value: filters.q,
      onChange: (v) => patchFilter('q', v),
      placeholder: 'Fund name…',
      info: 'Type part of a scheme name. Results update after NAV metrics load for the shortlist.',
    },
    {
      id: 'mf-amc',
      label: 'SEARCH AMC',
      value: filters.amc,
      onChange: (v) => patchFilter('amc', v),
      options: amcOptions,
      info: 'Show funds managed by one asset management company (AMC) only.',
    },
    {
      id: 'mf-category',
      label: 'CATEGORY',
      value: categorySelectValue,
      onChange: (v) => setCategories(v ? [v] : []),
      options: [{ value: '', label: 'All categories' }, ...MF_CATEGORY_OPTIONS],
      info: 'Broad SEBI-style bucket: equity, debt, hybrid, international, or solution oriented.',
    },
    {
      id: 'mf-plan',
      label: 'PLAN TYPE',
      value: filters.plan,
      onChange: (v) => patchFilter('plan', v),
      options: MF_PLAN_OPTIONS,
      info: 'Direct plans have lower expense ratios; regular plans include distributor trail.',
    },
  ];

  const secondaryFields = [
    {
      id: 'mf-cap',
      label: 'STYLE',
      value: filters.cap,
      onChange: (v) => patchFilter('cap', v),
      options: MF_CAP_OPTIONS,
      info: 'Equity style sleeve inferred from scheme name (large / mid / small / ELSS / index).',
    },
    {
      id: 'mf-min1y',
      label: 'MIN 1Y RETURN',
      value: filters.minCagr1y,
      onChange: (v) => patchFilter('minCagr1y', v),
      options: MIN_RETURN_OPTIONS,
      info: 'Hides funds until 1-year CAGR from mfapi.in is loaded and meets your floor.',
      disabled: loadingList,
    },
    {
      id: 'mf-min3y',
      label: 'MIN 3Y RETURN',
      value: filters.minCagr3y,
      onChange: (v) => patchFilter('minCagr3y', v),
      options: MIN_RETURN_OPTIONS,
      info: 'Same as 1Y filter but uses 3-year annualised return after NAV fetch.',
      disabled: loadingList,
    },
  ];

  const tertiaryFields = [
    {
      id: 'mf-sort',
      label: 'SORT BY',
      value: filters.sort,
      onChange: (v) => patchFilter('sort', v),
      options: MF_SORT_OPTIONS,
      info: 'Order the table by internal quality score, CAGR, or alphabetically.',
    },
  ];

  return (
    <div className="an-invest-sharp an-mf-explorer">
      <InvestSubNav />

      <header className="an-mf-explorer-page-head" id="mf-explorer">
        <p className="an-mf-explorer-page-head__eyebrow">Live NAV screener</p>
        <h1 className="an-mf-explorer-page-head__title">Mutual fund explorer</h1>
        <p className="an-mf-explorer-page-head__desc">
          Filter direct and regular growth plans with quick shortcuts. Share or bookmark a screen via the
          URL.
        </p>
      </header>

      <section className="an-mf-explorer-card an-mf-explorer-card--filters" aria-labelledby="mf-filters-title">
        <h2 id="mf-filters-title" className="an-mf-explorer-card__title">
          Filters
        </h2>

        <MfExplorerShortcuts activePreset={filters.preset} onSelect={applyPreset} />

        <MarketInsightsFilterBar
          className="an-mf-explorer-filters"
          primaryFields={primaryFields}
          secondaryFields={secondaryFields}
          tertiaryFields={tertiaryFields}
          onReset={resetFilters}
          sectionInfo="Mutual fund filters apply to the live NAV universe. Quick shortcuts set category, plan, and sort; min return filters need NAV data loaded first."
        />
      </section>

      <section className="an-mf-explorer-card an-mf-explorer-card--results" aria-labelledby="mf-results-title">
        <div className="an-mf-explorer-results-head">
          <h2 id="mf-results-title" className="an-mf-explorer-card__title an-mf-explorer-card__title--inline">
            Fund list
          </h2>
          <div className="an-mf-explorer-toolbar">
            <span className="an-mf-explorer-toolbar__count">
              {loadingList
                ? 'Loading universe…'
                : `${sorted.length.toLocaleString('en-IN')} funds match`}
              {(rankLoading || loadingMetrics) && ' · Updating NAV…'}
            </span>
            <span className="an-mf-explorer-toolbar__range">
              Showing {sorted.length ? page * PAGE_SIZE + 1 : 0}–
              {Math.min((page + 1) * PAGE_SIZE, sorted.length)}
            </span>
          </div>
        </div>

        {listError && <div className="an-mf-explorer-error" role="alert">{listError}</div>}

        <div className="an-mf-explorer-table-wrap">
          <table className="an-mf-fund-table">
            <thead>
              <tr>
                <th className="an-mf-fund-table__col-rating">Rating</th>
                <th className="an-mf-fund-table__col-fund">Fund</th>
                <th className="an-mf-fund-table__col-num">AUM</th>
                <th className="an-mf-fund-table__col-num">NAV</th>
                <th className="an-mf-fund-table__col-num">1Y</th>
                <th className="an-mf-fund-table__col-num">3Y</th>
                <th className="an-mf-fund-table__col-num">5Y</th>
                <th className="an-mf-fund-table__col-num">Till date</th>
                <th className="an-mf-fund-table__col-cat">Category</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, idx) => {
                const m = metrics[row.schemeCode];
                const rank = page * PAGE_SIZE + idx + 1;
                return (
                  <tr
                    key={row.schemeCode}
                    tabIndex={0}
                    onClick={() => openFund(row.schemeCode)}
                    onKeyDown={(e) => e.key === 'Enter' && openFund(row.schemeCode)}
                    role="link"
                  >
                    <td className="an-mf-fund-table__col-rating">
                      <span className="an-mf-fund-table__rank">#{rank}</span>
                      <StarRating score={m?.qualityScore ?? fundQualityScore(m)} />
                    </td>
                    <td className="an-mf-fund-table__col-fund">
                      <div className="an-mf-fund-table__fund">
                        <span className="an-mf-fund-table__accent" aria-hidden="true" />
                        <span className="an-mf-fund-table__avatar">{initials(row.schemeName)}</span>
                        <span className="an-mf-fund-table__fund-text">
                          <span className="an-mf-fund-table__name">{row.schemeName}</span>
                          <span className="an-mf-fund-table__amc">
                            {m?.fundHouse || inferFundHouse(row.schemeName)}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      {m?.aumCr != null ? (
                        <span className="an-mf-aum">{formatAumCr(m.aumCr)}</span>
                      ) : (
                        <span className="an-mf-muted">—</span>
                      )}
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      {m?.latestNav != null ? formatNav(m.latestNav) : '…'}
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      <ReturnCell value={m?.cagr1y} tone="muted" />
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      <ReturnCell value={m?.cagr3y} tone="muted" />
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      <ReturnCell value={m?.cagr5y} tone="muted" />
                    </td>
                    <td className="an-mf-fund-table__col-num">
                      <ReturnCell value={m?.cagrTillDate} tone="highlight" />
                    </td>
                    <td className="an-mf-fund-table__col-cat">
                      {m ? categoryLabel(m.category) : categoryLabel(inferFundCategory(row.schemeName))}
                    </td>
                  </tr>
                );
              })}
              {!loadingList && pageRows.length === 0 && (
                <tr>
                  <td colSpan={9} className="an-mf-fund-table__empty">
                    No funds match. Adjust filters or try a quick shortcut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pageCount > 1 && (
          <div className="an-mf-explorer-pagination">
            <button
              type="button"
              className="an-btn-ghost an-btn-ghost--sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {page + 1} / {pageCount}
            </span>
            <button
              type="button"
              className="an-btn-ghost an-btn-ghost--sm"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <p className="an-compliance">
        NAV &amp; returns from mfapi.in; AUM and portfolio data from mfdata.in when available. Ratings are
        NAV-derived. Past performance ≠ future results.
      </p>
    </div>
  );
}
