import React, { useMemo, useState } from 'react';
import ScreenerInsightPanel from '../ScreenerInsightPanel';
import ScreenerContextFilters from '../../../shared/marketInsights/ScreenerContextFilters';
import { defaultFilterState, getContextFilterPreset } from '../../../shared/marketInsights/screenerFilterConfig';
import {
  buildDeliveryInsightsFromDeals,
  filterDealsByPeriod,
} from '../../utils/dealFilters';
import '../../../shared/marketInsights/market-insights-filters.css';
import '../../../shared/marketInsights/screener-context-filters.css';
import '../../styles/screener-hub-cards.css';

const PANELS = [
  {
    key: 'activeStocks',
    fields: 'deals',
    title: 'Active Stocks',
    iconTone: 'teal',
    href: '#all-deals',
    info: 'Stocks with the most deal tickets in the selected range (delivery proxy).',
  },
  {
    key: 'deliveryBreakout',
    fields: 'volume',
    title: 'Delivery Breakout',
    iconTone: 'blue',
    href: '#delivery-insights',
    info: 'Highest traded quantities from bulk/block deals in the window.',
  },
  {
    key: 'volumeBreakout',
    fields: 'volume',
    title: 'Volume Breakout',
    iconTone: 'green',
    href: '#all-deals',
    info: 'Names ranked by deal value alongside volume breakout dates.',
  },
];

const RANGE_TO_PERIOD = { '3m': '3m', '6m': '6m', '1y': '1y' };

export default function DeliveryInsightsSection({ deliveryInsights, deals = [], loading }) {
  const preset = getContextFilterPreset('delivery-insights');
  const [filters, setFilters] = useState(() => defaultFilterState(preset));

  const computed = useMemo(() => {
    if (deals?.length) {
      const period = RANGE_TO_PERIOD[filters.range] || '1y';
      const windowed = filterDealsByPeriod(deals, period);
      return buildDeliveryInsightsFromDeals(windowed, { sortBy: filters.sortBy });
    }
    return deliveryInsights;
  }, [deals, deliveryInsights, filters.range, filters.sortBy]);

  if (loading) {
    return <div className="scr-hub__row scr-hub__row--3 scr-hub__row--loading" aria-busy="true" />;
  }

  return (
    <section className="scr-delivery" id="delivery-insights">
      <header className="scr-delivery__head">
        <h2 className="scr-delivery__title">Delivery insights</h2>
        <ScreenerContextFilters screenerType="delivery-insights" values={filters} onChange={setFilters} />
        {computed?.note && <p className="scr-delivery__note">{computed.note}</p>}
      </header>
      <div className="scr-hub__row scr-hub__row--3">
        {PANELS.map(({ key, fields, title, iconTone, href }) => {
          const items = computed?.[key] || [];
          return (
            <ScreenerInsightPanel
              key={key}
              id={`delivery-${key}`}
              title={title}
              iconTone={iconTone}
              viewAllHref={href}
              viewAllVariant="pill"
            >
              <ul className="scr-hub-card__list">
                {items.map((row) => (
                  <li key={`${row.symbol}-${row.companyName}`} className="scr-hub-card__row scr-hub-card__row--stack">
                    <div className="scr-hub-card__row-top">
                      <div>
                        <div className="scr-hub-card__company">{row.companyName}</div>
                        <div className="scr-hub-card__sym">{row.symbol}</div>
                      </div>
                      <a className="scr-hub-card__view" href="#all-deals">
                        View deals
                      </a>
                    </div>
                    {fields === 'deals' ? (
                      <div className="scr-hub-card__metric scr-hub-card__metric--left">
                        <span className="scr-hub-card__metric-label">Deals</span>
                        <span className="scr-hub-card__metric-value">{row.deals}</span>
                      </div>
                    ) : (
                      <>
                        <div className="scr-hub-card__metric scr-hub-card__metric--left">
                          <span className="scr-hub-card__metric-label">Total Volume</span>
                          <span className="scr-hub-card__metric-value">{row.totalVolume}</span>
                        </div>
                        <div className="scr-hub-card__meta">
                          <span>Date </span>
                          <span>{row.dateRange}</span>
                          <span> · End </span>
                          <span>{row.endDate}</span>
                        </div>
                      </>
                    )}
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
