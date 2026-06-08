import React, { useEffect, useMemo, useState } from 'react';
import HubInsightCard from '../HubInsightCard';
import '../../../shared/marketInsights/screener-context-filters.css';
import '../../styles/screener-hub-cards.css';

function MarketIndexBlock({ index }) {
  if (!index?.ok) {
    return (
      <div className="scr-mkt__block">
        <p className="scr-mkt__name">{index.name}</p>
        <p className="scr-hub-card__empty">Data unavailable</p>
      </div>
    );
  }
  const up = index.up;
  return (
    <div className="scr-mkt__block">
      <div className="scr-mkt__row">
        <span className="scr-mkt__name">{index.name}</span>
        <span className="scr-mkt__lbl">LAST PRICE</span>
      </div>
      <div className="scr-mkt__price-row">
        <span className={`scr-mkt__chg ${up ? 'is-up' : 'is-down'}`}>
          {up ? '▲' : '▼'} {Math.abs(index.changePct).toFixed(2)}% ({index.change >= 0 ? '+' : ''}
          {index.change.toFixed(2)})
        </span>
        <span className={`scr-mkt__price ${up ? 'is-up' : 'is-down'}`}>
          {index.last?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <dl className="scr-mkt__grid">
        <div><dt>Open</dt><dd>{index.open?.toFixed(2)}</dd></div>
        <div><dt>52W High</dt><dd>{index.yearHigh?.toFixed(2)}</dd></div>
        <div><dt>High</dt><dd className="is-up">{index.high?.toFixed(2)}</dd></div>
        <div><dt>Low</dt><dd className="is-down">{index.low?.toFixed(2)}</dd></div>
        <div><dt>Prev Close</dt><dd>{index.previousClose?.toFixed(2)}</dd></div>
        <div><dt>30D</dt><dd className="is-link">{index.perChange30d}%</dd></div>
        <div><dt>Date</dt><dd>{index.date365dAgo || '—'}</dd></div>
        <div><dt>365D</dt><dd className="is-link">{index.perChange365d}%</dd></div>
      </dl>
    </div>
  );
}

export default function RecentActivitySection({ recentActivity, marketOverview, loading }) {
  const [party, setParty] = useState('');
  const parties = recentActivity?.parties || [];

  useEffect(() => {
    if (!party && recentActivity?.defaultParty) {
      setParty(recentActivity.defaultParty);
    }
  }, [recentActivity?.defaultParty, party]);

  const bets = useMemo(() => {
    const list = recentActivity?.recentBets || [];
    if (!party) return list.slice(0, 3);
    return list.filter((b) => b.party === party).slice(0, 3);
  }, [recentActivity, party]);

  const bigBuys = (recentActivity?.recentBigBuys || []).slice(0, 5);

  if (loading) {
    return (
      <section className="scr-market-snapshot" id="market-snapshot" aria-busy="true" aria-label="Market snapshot loading">
        <header className="scr-section__head scr-market-snapshot__head">
          <span className="scr-section__icon scr-section__icon--blue" aria-hidden="true">
            ◷
          </span>
          <h2 className="scr-section__title">Market snapshot</h2>
        </header>
        <div className="scr-hub__row scr-hub__row--3 scr-hub__row--loading" />
      </section>
    );
  }

  return (
    <section className="scr-market-snapshot" id="market-snapshot" aria-labelledby="market-snapshot-heading">
      <header className="scr-section__head scr-market-snapshot__head">
        <span className="scr-section__icon scr-section__icon--blue" aria-hidden="true">
          ◷
        </span>
        <h2 id="market-snapshot-heading" className="scr-section__title">
          Market snapshot
        </h2>
      </header>
      <div className="scr-hub__row scr-hub__row--3">
      <HubInsightCard
        id="recent-bets"
        title="Recent Bets"
        iconTone="brand"
        viewAllHref="#all-deals"
        viewAllVariant="link"
      >
        <select
          className="scr-hub-card__select"
          value={party || recentActivity?.defaultParty || ''}
          onChange={(e) => setParty(e.target.value)}
          aria-label="Filter by party"
        >
          {parties.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <ul className="scr-hub-card__list">
          {bets.map((row) => (
            <li key={`${row.symbol}-${row.date}-${row.party}`} className="scr-hub-card__row">
              <div>
                <div className="scr-hub-card__company">{row.companyName}</div>
                <div className="scr-hub-card__sym">{row.symbol}</div>
                <div className="scr-hub-card__meta">
                  <span className={row.action === 'BUY' ? 'is-buy' : 'is-sell'}>{row.action}</span>
                  <span> · {row.date}</span>
                </div>
              </div>
              <div className="scr-hub-card__metric">
                <span className="scr-hub-card__metric-label">Deal Value</span>
                <span className="scr-hub-card__metric-value">{row.dealValue}</span>
              </div>
            </li>
          ))}
        </ul>
      </HubInsightCard>

      <HubInsightCard
        id="recent-big-buys"
        title="Recent Big Buys"
        iconTone="green"
        viewAllHref="#all-deals"
        viewAllVariant="pill"
      >
        <ul className="scr-hub-card__list">
          {bigBuys.map((row) => (
            <li key={`${row.symbol}-${row.dealValue}`} className="scr-hub-card__row">
              <div>
                <div className="scr-hub-card__company">{row.companyName}</div>
                <div className="scr-hub-card__sym">{row.symbol}</div>
              </div>
              <div className="scr-hub-card__metric">
                <span className="scr-hub-card__metric-label">Deal Value</span>
                <span className="scr-hub-card__metric-value">{row.dealValue}</span>
              </div>
            </li>
          ))}
        </ul>
      </HubInsightCard>

      <HubInsightCard
        id="market-overview-card"
        title="Market Overview"
        iconTone="blue"
        sectionInfo="Live index levels from NSE — last price, session change, and key ranges."
        viewAllHref="#market-breadth"
        viewAllVariant="link"
        viewAllLabel="View All"
      >
        {(marketOverview?.indices || []).map((idx) => (
          <MarketIndexBlock key={idx.name} index={idx} />
        ))}
      </HubInsightCard>
      </div>
    </section>
  );
}
