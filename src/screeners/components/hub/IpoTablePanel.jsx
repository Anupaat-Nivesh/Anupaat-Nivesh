import React, { useMemo, useState } from 'react';
import MarketInsightsPanelShell from '../../../shared/marketInsights/MarketInsightsPanelShell';
import ScreenerContextFilters from '../../../shared/marketInsights/ScreenerContextFilters';
import ScrollableTable from '../../../shared/marketInsights/ScrollableTable';
import { defaultFilterState, getContextFilterPreset } from '../../../shared/marketInsights/screenerFilterConfig';
import { buildNewsSearchUrl, buildNseQuoteUrl, buildNseSearchUrl } from '../../utils/externalLinks';
import '../../../shared/marketInsights/market-insights-filters.css';
import '../../../shared/marketInsights/screener-context-filters.css';

function parseDate(str) {
  if (!str) return null;
  const t = new Date(str).getTime();
  return Number.isNaN(t) ? null : t;
}

export default function IpoTablePanel({ rows = [], loading }) {
  const preset = getContextFilterPreset('ipo-issues');
  const [filters, setFilters] = useState(() => defaultFilterState(preset));

  const filtered = useMemo(() => {
    let list = rows || [];
    const type = filters.issueType;
    if (type && type !== 'all') {
      list = list.filter((r) => {
        const t = (r.issueType || '').toLowerCase();
        if (type === 'ipo') return t.includes('ipo');
        if (type === 'rights') return t.includes('right');
        if (type === 'other') return !t.includes('ipo') && !t.includes('right');
        return true;
      });
    }
    const now = Date.now();
    if (filters.window === 'open') {
      list = list.filter((r) => {
        const start = parseDate(r.startDate);
        const end = parseDate(r.endDate);
        return start != null && end != null && start <= now && end >= now;
      });
    } else if (filters.window === 'upcoming') {
      list = list.filter((r) => {
        const start = parseDate(r.startDate);
        return start != null && start > now;
      });
    }
    return list;
  }, [rows, filters.issueType, filters.window]);

  return (
    <MarketInsightsPanelShell id="ipo-issues" title="IPO / Right Issues" subtitle="MARKET INSIGHTS" accent="orange">
      <div className="scf-filter-card">
        <ScreenerContextFilters screenerType="ipo-issues" values={filters} onChange={setFilters} />
      </div>

      <ScrollableTable>
        <table className="mi-data-table">
          <thead>
            <tr>
              <th>STOCK NAME</th>
              <th>START DATE</th>
              <th>END DATE</th>
              <th>TYPE OF ISSUE</th>
              <th>FACE VALUE</th>
              <th>OFFER PRICE</th>
              <th>ISSUE SIZE</th>
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
                  <span aria-hidden="true">🔍</span>
                  <br />
                  No issues match the selected filters
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((row, i) => (
                <tr key={`${row.symbol}-${i}`}>
                  <td>
                    <span className="mi-data-table__company">{row.stockName}</span>
                    {row.symbol && <span className="mi-data-table__sym">{row.symbol}</span>}
                    <span className="mi-data-table__links">
                      {(buildNseQuoteUrl(row.symbol) || buildNseSearchUrl(row.stockName)) && (
                        <a
                          href={buildNseQuoteUrl(row.symbol) || buildNseSearchUrl(row.stockName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mi-data-table__micro-link"
                        >
                          NSE
                        </a>
                      )}
                      {buildNewsSearchUrl({ symbol: row.symbol, companyName: row.stockName }) && (
                        <a
                          href={buildNewsSearchUrl({ symbol: row.symbol, companyName: row.stockName })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mi-data-table__micro-link"
                        >
                          News
                        </a>
                      )}
                    </span>
                  </td>
                  <td className="mi-data-table__meta">{row.startDate}</td>
                  <td className="mi-data-table__meta">{row.endDate}</td>
                  <td className="mi-data-table__text">{row.issueType}</td>
                  <td className="mi-data-table__text">{row.faceValue}</td>
                  <td className="mi-data-table__text">{row.offerPrice}</td>
                  <td className="mi-data-table__text">{row.issueSize}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </ScrollableTable>
    </MarketInsightsPanelShell>
  );
}
