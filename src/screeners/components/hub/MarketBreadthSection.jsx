import React from 'react';
import HubSectionHeader from './HubSectionHeader';

function Donut({ advancesPct, declinesPct, unchangedPct, sentiment }) {
  const gradient = `conic-gradient(
    #10b981 0 ${advancesPct}%,
    #ef4444 ${advancesPct}% ${advancesPct + declinesPct}%,
    #9ca3af ${advancesPct + declinesPct}% 100%
  )`;
  return (
    <div className="scr-breadth__donut-wrap">
      <div className="scr-breadth__donut" style={{ background: gradient }} aria-hidden="true">
        <div className="scr-breadth__donut-hole">
          <span className="scr-breadth__sent-label">SENTIMENT</span>
          <span className={`scr-breadth__sent-value scr-breadth__sent-value--${sentiment?.tone || 'neutral'}`}>
            {sentiment?.label || '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ tone, label, value, pct, icon }) {
  return (
    <div className={`scr-breadth__metric scr-breadth__metric--${tone}`}>
      <div className="scr-breadth__metric-head">
        {icon}
        <span>{label}</span>
      </div>
      <div className="scr-breadth__metric-value">{value?.toLocaleString('en-IN')}</div>
      <div className="scr-breadth__bar-track">
        <div className="scr-breadth__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className={`scr-breadth__metric-pct scr-breadth__metric-pct--${tone}`}>{pct}%</div>
    </div>
  );
}

export default function MarketBreadthSection({ data, loading }) {
  if (loading) {
    return (
      <section className="scr-hub-panel scr-breadth scr-breadth--loading" aria-busy="true">
        <div className="scr-hub__skeleton scr-hub__skeleton--lg" />
      </section>
    );
  }
  if (!data) return null;

  const { date, advances, declines, unchanged, advanceDeclineRatio, advancesPct, declinesPct, unchangedPct, sentiment } =
    data;

  return (
    <section className="scr-hub-panel scr-breadth" id="market-breadth">
      <HubSectionHeader
        title="Market Breadth"
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 18l6-8 4 5 6-11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        }
        accent="blue"
        meta={
          <span className="scr-breadth__ratio-pill">
            ADVANCE-DECLINE RATIO: <strong>{advanceDeclineRatio}</strong>
          </span>
        }
      />
      <p className="scr-breadth__date">{date}</p>
      <div className="scr-breadth__body">
        <Donut
          advancesPct={advancesPct}
          declinesPct={declinesPct}
          unchangedPct={unchangedPct}
          sentiment={sentiment}
        />
        <MetricCard
          tone="up"
          label="Advances"
          value={advances}
          pct={advancesPct}
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 11l5-6 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
        />
        <MetricCard
          tone="down"
          label="Declines"
          value={declines}
          pct={declinesPct}
          icon={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 5l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          }
        />
        <MetricCard
          tone="flat"
          label="Unchanged"
          value={unchanged}
          pct={unchangedPct}
          icon={<span className="scr-breadth__dash">—</span>}
        />
      </div>
    </section>
  );
}
