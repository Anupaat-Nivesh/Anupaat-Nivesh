import React from 'react';
import useScreenersHub from '../hooks/useScreenersHub';
import HubPageGroup from './hub/HubPageGroup';
import MarketSnapshotSection from './hub/MarketSnapshotSection';
import RecentDealsSection from './hub/RecentDealsSection';
import StockInsightsSection from './hub/StockInsightsSection';
import DeliveryInsightsSection from './hub/DeliveryInsightsSection';
import DealsTablePanel from './hub/DealsTablePanel';
import OrderBookPanel from './hub/OrderBookPanel';
import IpoTablePanel from './hub/IpoTablePanel';
import '../styles/screeners-hub.css';

export default function ScreenersHubLive() {
  const { loading, error, data } = useScreenersHub();

  return (
    <div className="scr-hub-live">
      {error && (
        <p className="scr-hub-live__error" role="alert">
          {error}. Ensure the API server is running (<code>npm run server</code>).
        </p>
      )}

      {/* 1 — Session context: indices, activity, breadth */}
      <HubPageGroup
        id="market-pulse"
        title="Market pulse"
        description="Live market breadth, top movers, and index levels — then standout bulk/block deals below."
      >
        <MarketSnapshotSection marketSnapshot={data?.marketSnapshot} loading={loading} />
      </HubPageGroup>

      {/* 2 — Curated stock lists from deal flow */}
      <HubPageGroup
        id="market-insights"
        title="Curated insights"
        description="Aggregated leaders from bulk and block deals. Use filters on each row to change period, side, or sort."
        divider
      >
        <StockInsightsSection
          stockInsights={data?.stockInsights}
          deals={data?.deals?.all}
          loading={loading}
        />
        <DeliveryInsightsSection
          deliveryInsights={data?.deliveryInsights}
          deals={data?.deals?.all}
          loading={loading}
        />
      </HubPageGroup>

      {/* 3 — Transaction detail by participant type */}
      <HubPageGroup
        id="bulk-block-deals"
        title="Bulk & block deals"
        description="Full NSE bulk and block deal feed, then split by participant. Party labels (FII, DII, MF, promoter) are name-based heuristics — verify before acting."
        divider
      >
        <RecentDealsSection recentActivity={data?.recentActivity} loading={loading} />
        <DealsTablePanel
          id="all-deals"
          title="All Deals"
          accent="purple"
          rows={data?.deals?.all}
          loading={loading}
        />
        <DealsTablePanel
          id="fii-trades"
          title="FII Trades"
          accent="indigo"
          rows={data?.deals?.fii}
          loading={loading}
        />
        <DealsTablePanel
          id="dii-trades"
          title="DII Trades"
          accent="green"
          rows={data?.deals?.dii}
          loading={loading}
        />
        <DealsTablePanel
          id="mf-deals"
          title="Mutual Funds Deals"
          accent="orange"
          rows={data?.deals?.mf}
          loading={loading}
        />
        <DealsTablePanel
          id="promoter-trades"
          title="Promoter Trades"
          accent="red"
          rows={data?.deals?.promoter}
          loading={loading}
        />
        {data?.asOnDate && (
          <p className="scr-hub-live__footnote scr-hub-live__footnote--group">
            Bulk/block deals as on {data.asOnDate}. Source: NSE India.
          </p>
        )}
      </HubPageGroup>

      {/* 4 — Exchange filings & issues */}
      <HubPageGroup
        id="announcements"
        title="Announcements & issues"
        description="Company order-book updates from NSE filings and current IPO / rights issues."
        divider
      >
        <OrderBookPanel rows={data?.orderBook} loading={loading} />
        <IpoTablePanel rows={data?.ipoIssues} loading={loading} />
      </HubPageGroup>
    </div>
  );
}
