import React, { useMemo, useState } from 'react';
import MarketInsightsPanelShell from '../../../shared/marketInsights/MarketInsightsPanelShell';
import ScreenerContextFilters from '../../../shared/marketInsights/ScreenerContextFilters';
import ScrollableTable from '../../../shared/marketInsights/ScrollableTable';
import { defaultFilterState, getContextFilterPreset } from '../../../shared/marketInsights/screenerFilterConfig';
import { buildNewsSearchUrl, buildNseQuoteUrl, buildNseSearchUrl } from '../../utils/externalLinks';
import '../../../shared/marketInsights/market-insights-filters.css';
import '../../../shared/marketInsights/screener-context-filters.css';

function parseNewsDate(str) {
  if (!str) return 0;
  const t = new Date(str).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export default function OrderBookPanel({ rows = [], loading }) {
  const preset = getContextFilterPreset('order-book');
  const [filters, setFilters] = useState(() => defaultFilterState(preset));

  const filtered = useMemo(() => {
    let list = rows || [];
    const days = { '7d': 7, '30d': 30, '90d': 90 }[filters.period] || 7;
    const cutoff = Date.now() - days * 86400000;
    list = list.filter((r) => parseNewsDate(r.newsDate) >= cutoff);
    const q = (filters.search || '').trim().toLowerCase();
    if (q) {
      list = list.filter((r) => r.companyName?.toLowerCase().includes(q));
    }
    return list;
  }, [rows, filters.period, filters.search]);

  return (
    <MarketInsightsPanelShell id="order-book" title="Company Order Book Updates" subtitle="MARKET INSIGHTS" accent="green">
      <div className="scf-filter-card">
        <ScreenerContextFilters screenerType="order-book" values={filters} onChange={setFilters} />
      </div>

      <ScrollableTable>
        <table className="mi-data-table mi-data-table--order-book">
          <thead>
            <tr>
              <th>NEWS DATE</th>
              <th>COMPANY NAME</th>
              <th>HEADLINE</th>
              <th>ISSUER ENTITY</th>
              <th>ISSUER TYPE</th>
              <th>ORDER SIZE</th>
              <th>TIME PERIOD</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7}>Loading…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="mi-data-table__empty">
                  No order-related filings in the selected window
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((row) => (
                <tr key={`${row.symbol}-${row.newsDate}-${row.headline?.slice(0, 20)}`}>
                  <td className="mi-data-table__meta">{row.newsDate}</td>
                  <td>
                    <span className="mi-data-table__company">{row.companyName}</span>
                    <span className="mi-data-table__links">
                      {(buildNseQuoteUrl(row.symbol) || buildNseSearchUrl(row.companyName)) && (
                        <a
                          href={buildNseQuoteUrl(row.symbol) || buildNseSearchUrl(row.companyName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mi-data-table__micro-link"
                        >
                          NSE
                        </a>
                      )}
                      {buildNewsSearchUrl({ symbol: row.symbol, companyName: row.companyName }) && (
                        <a
                          href={buildNewsSearchUrl({ symbol: row.symbol, companyName: row.companyName })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mi-data-table__micro-link"
                        >
                          News
                        </a>
                      )}
                    </span>
                  </td>
                  <td>
                    {row.filingUrl ? (
                      <a
                        href={row.filingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mi-data-table__link"
                      >
                        {row.headline}
                      </a>
                    ) : (
                      <span className="mi-data-table__text">{row.headline}</span>
                    )}
                  </td>
                  <td className="mi-data-table__text">{row.issuerEntity}</td>
                  <td className="mi-data-table__text">{row.issuerType}</td>
                  <td className="mi-data-table__text">{row.orderSize}</td>
                  <td className="mi-data-table__meta">{row.timePeriod}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </ScrollableTable>
    </MarketInsightsPanelShell>
  );
}
