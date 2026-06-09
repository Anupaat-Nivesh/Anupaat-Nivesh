import React, { useMemo, useState } from 'react';
import ScreenerInsightPanel from '../ScreenerInsightPanel';
import ScreenerContextFilters from '../../../shared/marketInsights/ScreenerContextFilters';
import { defaultFilterState, getContextFilterPreset } from '../../../shared/marketInsights/screenerFilterConfig';
import {
  buildStockInsightsFromDeals,
  filterDealsByPeriod,
} from '../../utils/dealFilters';
import '../../../shared/marketInsights/market-insights-filters.css';
import '../../../shared/marketInsights/screener-context-filters.css';
import '../../styles/screener-hub-cards.css';

const PANELS = [
  {
    key: 'topDeals',
    title: 'Top Deal Making Stocks',
    iconTone: 'blue',
    href: '#all-deals',
    info: 'Companies with the highest total bulk & block deal value in your selected window.',
  },
  {
    key: 'insiderTrades',
    title: 'Insider Traded Stocks',
    iconTone: 'purple',
    href: '#promoter-trades',
    info: 'Names where promoter-classified clients traded in the filtered period.',
  },
  {
    key: 'leadingInvestors',
    title: 'Leading Investors',
    iconTone: 'gold',
    href: '#fii-trades',
    info: 'Top institutions (FII / DII / MF) by aggregated deal value.',
  },
];

export default function StockInsightsSection({ stockInsights, deals = [], loading }) {
  const preset = getContextFilterPreset('stock-insights');
  const [filters, setFilters] = useState(() => defaultFilterState(preset));

  const computed = useMemo(() => {
    if (deals?.length) {
      const windowed = filterDealsByPeriod(deals, filters.period);
      return buildStockInsightsFromDeals(windowed, {
        sortBy: filters.sortBy,
        side: filters.side,
      });
    }
    return stockInsights;
  }, [deals, stockInsights, filters.period, filters.sortBy, filters.side]);

  if (loading) {
    return <div className="scr-hub__row scr-hub__row--3 scr-hub__row--loading" aria-busy="true" />;
  }

  return (
    <section className="scr-insights" id="stock-insights">
      <header className="scr-insights__head">
        <span className="scr-insights__star" aria-hidden="true">
          ★
        </span>
        <h2 className="scr-insights__title">Stock updates insights</h2>
        <ScreenerContextFilters screenerType="stock-insights" values={filters} onChange={setFilters} />
      </header>

      <div className="scr-hub__row scr-hub__row--3">
        {PANELS.map(({ key, title, iconTone, href }) => {
          const items = computed?.[key] || [];
          return (
            <ScreenerInsightPanel
              key={key}
              id={`insight-${key}`}
              title={title}
              iconTone={iconTone}
              viewAllHref={href}
              viewAllVariant="pill"
              countLabel={items.length ? `View All` : 'View All'}
            >
              <ul className="scr-hub-card__list">
                {items.length === 0 && <li className="scr-hub-card__empty">No deals in window</li>}
                {items.map((row) => (
                  <li key={`${row.symbol}-${row.companyName}`} className="scr-hub-card__row">
                    <div>
                      <div className="scr-hub-card__company">{row.companyName}</div>
                      {row.symbol && <div className="scr-hub-card__sym">{row.symbol}</div>}
                    </div>
                    <div className="scr-hub-card__metric">
                      <span className="scr-hub-card__metric-label">Deal Value</span>
                      <span className="scr-hub-card__metric-value">{row.dealsValue}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </ScreenerInsightPanel>
          );
        })}
      </div>
    </section>
  );
}
