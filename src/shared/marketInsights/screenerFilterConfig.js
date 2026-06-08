/**
 * Filter definitions per screener / section — drives UI visibility, labels, and info copy.
 */

/** Compact header filters (Value · Period · Side style) */
export const CONTEXT_FILTER_PRESETS = {
  'stock-insights': {
    sectionInfo:
      'Aggregates NSE bulk and block deals. Use filters to change how the top names are ranked and which deals are included in the window.',
    filters: [
      {
        key: 'sortBy',
        ariaLabel: 'Sort by',
        options: [
          { value: 'value', label: 'Value' },
          { value: 'name', label: 'Name A–Z' },
          { value: 'deals', label: 'Deal count' },
        ],
        info: 'Rank companies by total deal value (₹ Cr), alphabetically, or by number of deals in the period.',
        defaultValue: 'value',
      },
      {
        key: 'period',
        ariaLabel: 'Period',
        options: [
          { value: '1w', label: '1 Week' },
          { value: '1m', label: '1 Month' },
          { value: '3m', label: '3 Months' },
          { value: '6m', label: '6 Months' },
          { value: '1y', label: '1 Year' },
        ],
        info: 'Only deals reported within this lookback window are counted toward the lists below.',
        defaultValue: '1w',
      },
      {
        key: 'side',
        ariaLabel: 'Buy or sell',
        options: [
          { value: 'all', label: 'All sides' },
          { value: 'BUY', label: 'Buy' },
          { value: 'SELL', label: 'Sell' },
        ],
        info: 'Filter deals by buy or sell side before aggregating into insight cards.',
        defaultValue: 'all',
      },
    ],
  },
  'delivery-insights': {
    sectionInfo:
      'Delivery-style panels use bulk/block deal quantity as a proxy (not official NSE delivery %). Adjust frequency and range to change ranking.',
    filters: [
      {
        key: 'frequency',
        ariaLabel: 'Frequency',
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' },
        ],
        info: 'Weekly groups activity by short windows; monthly smooths spikes across the range.',
        defaultValue: 'weekly',
      },
      {
        key: 'range',
        ariaLabel: 'Date range',
        options: [
          { value: '3m', label: '3 Months' },
          { value: '6m', label: '6 Months' },
          { value: '1y', label: '1 Year' },
        ],
        info: 'Limits which reported deals are included when ranking active and breakout names.',
        defaultValue: '1y',
      },
      {
        key: 'sortBy',
        ariaLabel: 'Sort by',
        options: [
          { value: 'deals', label: 'Deals' },
          { value: 'volume', label: 'Volume' },
          { value: 'value', label: 'Value' },
        ],
        info: 'Choose whether breakout lists emphasise deal count, traded quantity, or deal value.',
        defaultValue: 'deals',
      },
    ],
  },
  'recent-bets': {
    sectionInfo: 'Latest promoter and domestic institutional bulk deals. Pick a party to focus the list.',
    filters: [
      {
        key: 'party',
        ariaLabel: 'Party',
        options: [], // filled dynamically
        info: 'Filter recent bets to a single reporting party from the current deal set.',
        defaultValue: '',
      },
    ],
  },
  'order-book': {
    sectionInfo: 'Corporate announcements filtered for order wins, contracts, and purchase orders from NSE.',
    filters: [
      {
        key: 'period',
        ariaLabel: 'Period',
        options: [
          { value: '7d', label: '7 Days' },
          { value: '30d', label: '30 Days' },
          { value: '90d', label: '90 Days' },
        ],
        info: 'Show filings whose news date falls within this window.',
        defaultValue: '7d',
      },
      {
        key: 'search',
        ariaLabel: 'Search company',
        type: 'search',
        placeholder: 'Company name…',
        info: 'Narrows rows to companies whose name contains your text.',
        defaultValue: '',
      },
    ],
  },
  'ipo-issues': {
    sectionInfo: 'Current and upcoming IPO / rights issues listed on NSE.',
    filters: [
      {
        key: 'issueType',
        ariaLabel: 'Issue type',
        options: [
          { value: 'all', label: 'All types' },
          { value: 'ipo', label: 'IPO' },
          { value: 'rights', label: 'Rights' },
          { value: 'other', label: 'Other' },
        ],
        info: 'Filter by kind of primary market issue.',
        defaultValue: 'all',
      },
      {
        key: 'window',
        ariaLabel: 'Window',
        options: [
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Open now' },
          { value: 'upcoming', label: 'Upcoming' },
        ],
        info: 'Open = today between start and end dates; upcoming = start date in the future.',
        defaultValue: 'all',
      },
    ],
  },
};

/** Table filter fields for deal panels — which controls appear per screener id */
export const DEALS_PANEL_FILTER_CONFIG = {
  'all-deals': {
    sectionInfo: 'Every bulk and block deal reported on NSE for the session date, with party heuristics.',
    fields: ['company', 'party', 'action', 'dealType'],
  },
  'promoter-trades': {
    sectionInfo: 'Deals where the client name suggests promoter or insider activity (heuristic).',
    fields: ['company', 'party', 'action'],
  },
  'fii-trades': {
    sectionInfo: 'Deals tagged as foreign / FPI-style clients based on name patterns.',
    fields: ['company', 'party', 'action'],
  },
  'dii-trades': {
    sectionInfo: 'Domestic institutions, banks, and brokers classified from client names.',
    fields: ['company', 'party', 'action'],
  },
  'mf-deals': {
    sectionInfo: 'Bulk deals involving mutual funds, AMCs, and trust names.',
    fields: ['company', 'party', 'action'],
  },
};

export const DEAL_FILTER_FIELD_META = {
  company: {
    id: 'company',
    label: 'SEARCH COMPANY',
    compactLabel: 'Company',
    info: 'Limit the table to one stock. Leave on “All stocks” to see the full list.',
    type: 'select',
  },
  party: {
    id: 'party',
    label: 'SEARCH PARTY',
    compactLabel: 'Party',
    info: 'Filter by reporting client / institution name on the NSE deal.',
    type: 'select',
  },
  action: {
    id: 'action',
    label: 'ACTION',
    compactLabel: 'Buy / Sell',
    info: 'Show only buy-side, sell-side, or all deal directions.',
    type: 'select',
  },
  dealType: {
    id: 'dealType',
    label: 'DEAL TYPE',
    compactLabel: 'Deal type',
    info: 'Bulk deals are above exchange thresholds; block deals are negotiated blocks.',
    type: 'select',
    options: [
      { value: 'all', label: 'All types' },
      { value: 'BULK', label: 'Bulk' },
      { value: 'BLOCK', label: 'Block' },
    ],
  },
};

export function getContextFilterPreset(screenerType) {
  return CONTEXT_FILTER_PRESETS[screenerType] || null;
}

export function getDealsPanelFilterConfig(panelId) {
  return DEALS_PANEL_FILTER_CONFIG[panelId] || DEALS_PANEL_FILTER_CONFIG['all-deals'];
}

export function defaultFilterState(preset) {
  if (!preset?.filters) return {};
  return Object.fromEntries(preset.filters.map((f) => [f.key, f.defaultValue ?? '']));
}
