import React, { useMemo, useState } from 'react';
import FilterInfoButton from '../../../shared/marketInsights/FilterInfoButton';
import MmiSpeedometer from '../../../shared/marketInsights/MmiSpeedometer';

const MOVER_TABS = [
  { id: 'gainers', label: 'Top gainers' },
  { id: 'losers', label: 'Top losers' },
  { id: 'volume', label: 'Top volume' },
  { id: 'week52High', label: '52W high' },
  { id: 'week52Low', label: '52W low' },
];

function formatVol(n) {
  if (!n) return '—';
  if (n >= 1e7) return `${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(2)} L`;
  return n.toLocaleString('en-IN');
}

function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Donut({ advancesPct, declinesPct, sentiment }) {
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

function BreadthMetric({ tone, label, value, pct, active, onClick, icon }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      className={`scr-breadth__metric scr-breadth__metric--${tone}${active ? ' is-active' : ''}${onClick ? ' scr-breadth__metric--btn' : ''}`}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
    >
      <div className="scr-breadth__metric-head">
        {icon}
        <span>{label}</span>
      </div>
      <div className="scr-breadth__metric-value">{value?.toLocaleString('en-IN')}</div>
      <div className="scr-breadth__bar-track">
        <div className="scr-breadth__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className={`scr-breadth__metric-pct scr-breadth__metric-pct--${tone}`}>{pct}%</div>
    </Tag>
  );
}

function MoversTable({ rows, showVolume = true }) {
  if (!rows?.length) {
    return <p className="scr-snapshot__empty">No live rows for this view.</p>;
  }
  return (
    <div className="scr-snapshot__table-wrap">
      <table className="scr-snapshot__table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>LTP</th>
            <th>Change %</th>
            {showVolume && <th>Volume</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const up = (row.perChange ?? 0) >= 0;
            return (
              <tr key={row.symbol}>
                <td>
                  <span className="scr-snapshot__sym">{row.symbol}</span>
                  {row.series && row.series !== 'EQ' && (
                    <span className="scr-snapshot__series">{row.series}</span>
                  )}
                </td>
                <td>{formatPrice(row.ltp)}</td>
                <td className={up ? 'is-up' : 'is-down'}>
                  {up ? '+' : ''}
                  {Number(row.perChange).toFixed(2)}%
                </td>
                {showVolume && <td>{formatVol(row.volume)}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const MMI_SCHEDULES = ['hourly', 'weekly', 'monthly'];

function scheduleLabel(key) {
  if (key === 'hourly') return 'daily';
  return key;
}

function MmiCard({ index, schedule, onScheduleChange, infoLabel, infoText, variant = 'composite' }) {
  const active = index?.schedules?.[schedule];
  if (!index?.schedules || !active) return null;

  return (
    <div className={`scr-snapshot__mood scr-snapshot__mood--${variant}`}>
      <div className="scr-snapshot__mood-head">
        <h3 className="scr-snapshot__mood-title">{index.title || 'Market mood index'}</h3>
        <div className="scr-snapshot__mood-head-actions">
          <div className="scr-snapshot__mood-tabs" role="tablist" aria-label={`${index.title} schedule`}>
            {MMI_SCHEDULES.map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={schedule === key}
                className={`scr-snapshot__mood-tab${schedule === key ? ' is-active' : ''}`}
                onClick={() => onScheduleChange(key)}
              >
                {scheduleLabel(key)}
              </button>
            ))}
          </div>
          {infoText && (
            <FilterInfoButton variant="i" align="end" label={infoLabel} text={infoText} />
          )}
        </div>
      </div>
      <div className="scr-snapshot__mood-body">
        <MmiSpeedometer
          score={active.score}
          label={active.label}
          tone={active.tone}
          variant={variant}
        />
        <p className="scr-snapshot__mood-note">{index.methodology}</p>
      </div>
    </div>
  );
}

function IndexStrip({ indices }) {
  const list = (indices || []).filter((i) => i.ok);
  if (!list.length) return null;
  return (
    <div className="scr-snapshot__indices">
      {list.map((idx) => (
        <div key={idx.name} className="scr-snapshot__index-pill">
          <span className="scr-snapshot__index-name">{idx.name}</span>
          <span className={`scr-snapshot__index-val ${idx.up ? 'is-up' : 'is-down'}`}>
            {idx.last?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className={`scr-snapshot__index-chg ${idx.up ? 'is-up' : 'is-down'}`}>
            {idx.up ? '+' : ''}
            {idx.changePct?.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MarketSnapshotSection({ marketSnapshot, loading }) {
  const [breadthDrill, setBreadthDrill] = useState(null);
  const [moverTab, setMoverTab] = useState('gainers');
  const [category, setCategory] = useState('allSec');
  const [moodSchedule, setMoodSchedule] = useState('hourly');

  const breadth = marketSnapshot?.breadth;
  const movers = marketSnapshot?.movers;
  const moodIndex = marketSnapshot?.moodIndex;
  const greedFearIndex = marketSnapshot?.greedFearIndex;

  const moverRows = useMemo(() => {
    if (!movers) return [];
    if (moverTab === 'volume') return movers.topVolume || [];
    if (moverTab === 'week52High') return movers.week52High || [];
    if (moverTab === 'week52Low') return movers.week52Low || [];
    const bucket = moverTab === 'losers' ? movers.losers : movers.gainers;
    return bucket?.[category] || [];
  }, [movers, moverTab, category]);

  const drillRows = useMemo(() => {
    if (!breadthDrill || !breadth?.drillDown) return [];
    if (breadthDrill === 'advances') return breadth.drillDown.advances || [];
    if (breadthDrill === 'declines') return breadth.drillDown.declines || [];
    return [];
  }, [breadthDrill, breadth]);

  const drillTitle = useMemo(() => {
    if (breadthDrill === 'advances') return breadth?.drillDown?.advancesLabel || 'Advances';
    if (breadthDrill === 'declines') return breadth?.drillDown?.declinesLabel || 'Declines';
    if (breadthDrill === 'unchanged') return 'Unchanged';
    return '';
  }, [breadthDrill, breadth]);

  const showCategoryPicker = moverTab === 'gainers' || moverTab === 'losers';
  const showMmi = moodIndex?.schedules || greedFearIndex?.schedules;

  if (loading) {
    return (
      <section className="scr-market-snapshot scr-snapshot" id="market-snapshot" aria-busy="true">
        <header className="scr-section__head scr-market-snapshot__head">
          <span className="scr-section__icon scr-section__icon--blue" aria-hidden="true">
            ◷
          </span>
          <h2 className="scr-section__title">Market snapshot</h2>
        </header>
        <div className="scr-hub__skeleton scr-hub__skeleton--lg" />
      </section>
    );
  }

  if (!breadth) return null;

  const {
    date,
    advances,
    declines,
    unchanged,
    advanceDeclineRatio,
    advancesPct,
    declinesPct,
    unchangedPct,
    sentiment,
  } = breadth;

  return (
    <section className="scr-market-snapshot scr-snapshot" id="market-snapshot" aria-labelledby="market-snapshot-heading">
      <header className="scr-section__head scr-market-snapshot__head">
        <span className="scr-section__icon scr-section__icon--blue" aria-hidden="true">
          ◷
        </span>
        <h2 id="market-snapshot-heading" className="scr-section__title">
          Market snapshot
        </h2>
        <FilterInfoButton
          variant="i"
          align="end"
          label="About market snapshot"
          text="Market breadth counts all NSE-listed equities advancing, declining, or unchanged. Click Advances or Declines for top movers in that direction. Tabs show NSE live gainers, losers, volume, and stocks at session high/low."
        />
      </header>

      <IndexStrip indices={marketSnapshot?.indices} />

      {showMmi && (
        <div className="scr-snapshot__mmi-row">
          <MmiCard
            variant="composite"
            index={moodIndex}
            schedule={moodSchedule}
            onScheduleChange={setMoodSchedule}
            infoLabel="About market mood index"
            infoText="Composite score from NIFTY momentum, market breadth, and volume/mover skew. Bullish/bearish labels reflect directional bias for the selected schedule."
          />
          <MmiCard
            variant="greed-fear"
            index={greedFearIndex}
            schedule={moodSchedule}
            onScheduleChange={setMoodSchedule}
            infoLabel="About greed / fear index"
            infoText="0–100 fear and greed gauge: extreme fear (below 25), fear (25–45), neutral (45–55), greed (55–75), extreme greed (above 75). Uses the same daily, weekly, and monthly schedules as the mood index."
          />
        </div>
      )}

      <div className="scr-hub-panel scr-breadth scr-snapshot__breadth" id="market-breadth">
        <div className="scr-snapshot__breadth-top">
          <p className="scr-breadth__date">{date}</p>
          <span className="scr-breadth__ratio-pill">
            ADVANCE–DECLINE RATIO: <strong>{advanceDeclineRatio}</strong>
          </span>
        </div>
        <div className="scr-breadth__body">
          <Donut advancesPct={advancesPct} declinesPct={declinesPct} sentiment={sentiment} />
          <BreadthMetric
            tone="up"
            label="Advances"
            value={advances}
            pct={advancesPct}
            active={breadthDrill === 'advances'}
            onClick={() => setBreadthDrill((d) => (d === 'advances' ? null : 'advances'))}
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 11l5-6 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <BreadthMetric
            tone="down"
            label="Declines"
            value={declines}
            pct={declinesPct}
            active={breadthDrill === 'declines'}
            onClick={() => setBreadthDrill((d) => (d === 'declines' ? null : 'declines'))}
            icon={
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 5l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
          <BreadthMetric
            tone="flat"
            label="Unchanged"
            value={unchanged}
            pct={unchangedPct}
            active={breadthDrill === 'unchanged'}
            onClick={() => setBreadthDrill((d) => (d === 'unchanged' ? null : 'unchanged'))}
            icon={<span className="scr-breadth__dash">—</span>}
          />
        </div>

        {breadthDrill && (
          <div className="scr-snapshot__drill" role="region" aria-label={drillTitle}>
            <div className="scr-snapshot__drill-head">
              <h3 className="scr-snapshot__drill-title">{drillTitle}</h3>
              <button type="button" className="scr-snapshot__drill-close" onClick={() => setBreadthDrill(null)}>
                Close
              </button>
            </div>
            {breadthDrill === 'unchanged' ? (
              <p className="scr-snapshot__drill-note">{breadth.drillDown?.unchangedNote}</p>
            ) : (
              <MoversTable rows={drillRows} />
            )}
          </div>
        )}
      </div>

      <div className="scr-snapshot__movers">
        <div className="scr-snapshot__movers-head">
          <h3 className="scr-snapshot__movers-title">Market movers</h3>
          <div className="scr-snapshot__tabs" role="tablist" aria-label="Mover categories">
            {MOVER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={moverTab === tab.id}
                className={`scr-snapshot__tab${moverTab === tab.id ? ' is-active' : ''}`}
                onClick={() => setMoverTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {showCategoryPicker && movers?.categories && (
          <div className="scr-snapshot__cat-row">
            <label className="scr-snapshot__cat-label" htmlFor="snapshot-mover-cat">
              Index / segment
            </label>
            <select
              id="snapshot-mover-cat"
              className="scr-snapshot__cat-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {movers.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {(moverTab === 'week52High' || moverTab === 'week52Low') && movers?.week52Note && (
          <p className="scr-snapshot__drill-note">{movers.week52Note}</p>
        )}

        <MoversTable rows={moverRows} showVolume={moverTab === 'volume' || moverTab === 'gainers' || moverTab === 'losers'} />
      </div>
    </section>
  );
}
