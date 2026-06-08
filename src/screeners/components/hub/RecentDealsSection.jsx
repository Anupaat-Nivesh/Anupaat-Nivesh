import React, { useEffect, useMemo, useState } from 'react';
import HubInsightCard from '../HubInsightCard';
import '../../styles/screener-hub-cards.css';

export default function RecentDealsSection({ recentActivity, loading }) {
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
    return <div className="scr-hub__row scr-hub__row--2 scr-hub__row--loading" aria-busy="true" />;
  }

  if (!recentActivity?.recentBets?.length && !recentActivity?.recentBigBuys?.length) {
    return null;
  }

  return (
    <div className="scr-hub__row scr-hub__row--2 scr-recent-deals">
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
    </div>
  );
}
