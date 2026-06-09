import React, { useMemo, useState } from 'react';
import MarketInsightsPanelShell from '../../../shared/marketInsights/MarketInsightsPanelShell';
import MarketInsightsFilterBar from '../../../shared/marketInsights/MarketInsightsFilterBar';
import ScrollableTable from '../../../shared/marketInsights/ScrollableTable';
import {
  DEAL_FILTER_FIELD_META,
  getDealsPanelFilterConfig,
} from '../../../shared/marketInsights/screenerFilterConfig';
import { buildNewsSearchUrl, buildNseQuoteUrl } from '../../utils/externalLinks';
import '../../../shared/marketInsights/market-insights-filters.css';
import '../../../shared/marketInsights/screener-context-filters.css';

const COLUMNS = [
  { key: 'date', label: 'DATE' },
  { key: 'companyName', label: 'COMPANY NAME' },
  { key: 'party', label: 'PARTY / CLIENT' },
  { key: 'badges', label: 'ACTION TYPE' },
  { key: 'quantity', label: 'QUANTITY' },
  { key: 'avgPrice', label: 'AVG PRICE' },
  { key: 'valueLabel', label: 'VALUE (CR)' },
];

export default function DealsTablePanel({
  id,
  title,
  subtitle = 'MARKET INSIGHTS',
  accent = 'purple',
  rows = [],
  loading,
}) {
  const panelConfig = getDealsPanelFilterConfig(id);
  const enabledFields = panelConfig.fields;

  const [company, setCompany] = useState('');
  const [party, setParty] = useState('');
  const [action, setAction] = useState('all');
  const [dealType, setDealType] = useState('all');

  const companies = useMemo(() => [...new Set(rows.map((r) => r.companyName))].sort(), [rows]);
  const parties = useMemo(() => [...new Set(rows.map((r) => r.party))].sort(), [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (company && r.companyName !== company) return false;
      if (party && r.party !== party) return false;
      if (action !== 'all' && r.action !== action) return false;
      if (dealType !== 'all' && r.dealType !== dealType) return false;
      return true;
    });
  }, [rows, company, party, action, dealType]);

  const reset = () => {
    setCompany('');
    setParty('');
    setAction('all');
    setDealType('all');
  };

  const stateMap = {
    company: [company, setCompany],
    party: [party, setParty],
    action: [action, setAction],
    dealType: [dealType, setDealType],
  };

  const buildField = (fieldKey) => {
    const meta = DEAL_FILTER_FIELD_META[fieldKey];
    if (!meta || !enabledFields.includes(fieldKey)) return null;

    const [value, setter] = stateMap[fieldKey];

    let options = meta.options;
    if (fieldKey === 'company') {
      options = [{ value: '', label: 'All Stocks' }, ...companies.map((c) => ({ value: c, label: c }))];
    } else if (fieldKey === 'party') {
      options = [
        { value: '', label: 'All Parties' },
        ...parties.map((p) => ({
          value: p,
          label: p.length > 40 ? `${p.slice(0, 40)}…` : p,
        })),
      ];
    } else if (fieldKey === 'action') {
      options = [
        { value: 'all', label: 'All Types' },
        { value: 'BUY', label: 'Buy' },
        { value: 'SELL', label: 'Sell' },
      ];
    }

    return {
      id: `${id}-${fieldKey}`,
      label: meta.label,
      info: meta.info,
      value,
      onChange: setter,
      options,
      disabled: fieldKey === 'party' && parties.length === 0,
    };
  };

  const primaryFields = enabledFields.map(buildField).filter(Boolean);

  return (
    <MarketInsightsPanelShell id={id} title={title} subtitle={subtitle} accent={accent}>
      <MarketInsightsFilterBar
        primaryFields={primaryFields}
        onReset={reset}
        sectionInfo={panelConfig.sectionInfo}
      />

      <ScrollableTable>
        <table className="mi-data-table">
          <thead>
            <tr>
              {COLUMNS.map((c) => (
                <th key={c.key}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={COLUMNS.length}>Loading…</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="mi-data-table__empty">
                  No records found matching filters
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((row) => (
                <tr key={`${row.symbol}-${row.date}-${row.party}-${row.action}`}>
                  <td className="mi-data-table__meta">{row.date}</td>
                  <td>
                    <span className="mi-data-table__company">{row.companyName}</span>
                    <span className="mi-data-table__sym">{row.symbol}</span>
                    <span className="mi-data-table__links">
                      {buildNseQuoteUrl(row.symbol) && (
                        <a
                          href={buildNseQuoteUrl(row.symbol)}
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
                  <td className="mi-data-table__party">{row.party}</td>
                  <td>
                    <div className="mi-data-table__badges">
                      {(row.badges || []).map((b) => (
                        <span key={b.text} className={`mi-badge mi-badge--${b.tone}`}>
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="mi-num">{row.quantity?.toLocaleString('en-IN')}</td>
                  <td className="mi-num">{row.avgPrice}</td>
                  <td className="mi-num mi-data-table__value">
                    <strong>{row.valueLabel}</strong>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </ScrollableTable>
    </MarketInsightsPanelShell>
  );
}
