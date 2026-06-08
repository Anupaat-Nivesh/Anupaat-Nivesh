import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useSectorRotation from '../hooks/useSectorRotation';
import '../styles/sector-rotation.css';

function rrgRatio(s) {
  return Number(s?.rrg?.plotX ?? 50).toFixed(2);
}

function rrgMom(s) {
  return Number(s?.rrg?.plotY ?? 50).toFixed(2);
}

function QuadMap({ sectors }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);

  const activeId = pinnedId || hoveredId;
  const active = useMemo(
    () => sectors.find((s) => s.id === activeId) || null,
    [sectors, activeId]
  );

  const clearHover = useCallback(() => {
    if (!pinnedId) setHoveredId(null);
  }, [pinnedId]);

  const onDotClick = useCallback((id) => {
    setPinnedId((prev) => (prev === id ? null : id));
    setHoveredId(id);
  }, []);

  return (
    <div
      className="sr-rrg"
      onMouseLeave={clearHover}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setPinnedId(null);
          setHoveredId(null);
        }
      }}
    >
      <div className="sr-rrg__axis sr-rrg__axis--x" />
      <div className="sr-rrg__axis sr-rrg__axis--y" />
      <div className="sr-rrg__quad sr-rrg__quad--leading">Leading</div>
      <div className="sr-rrg__quad sr-rrg__quad--weakening">Weakening</div>
      <div className="sr-rrg__quad sr-rrg__quad--lagging">Lagging</div>
      <div className="sr-rrg__quad sr-rrg__quad--improving">Improving</div>

      {sectors.map((s) => {
        const isActive = s.id === activeId;
        return (
          <button
            key={s.id}
            type="button"
            className={`sr-rrg__dot${isActive ? ' is-active' : ''}`}
            style={{ left: `${s.rrg.plotX}%`, top: `${s.rrg.plotY}%`, '--dot-color': s.color }}
            aria-label={`${s.name}, ratio ${rrgRatio(s)}, momentum ${rrgMom(s)}`}
            onMouseEnter={() => setHoveredId(s.id)}
            onFocus={() => setHoveredId(s.id)}
            onBlur={() => {
              if (!pinnedId) setHoveredId(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onDotClick(s.id);
            }}
          >
            <span className="sr-rrg__dot-core" style={{ background: s.color }} />
          </button>
        );
      })}

      {active && (
        <div
          className={`sr-rrg__tooltip${active.rrg.plotX > 72 ? ' sr-rrg__tooltip--left' : ''}${
            active.rrg.plotY < 18 ? ' sr-rrg__tooltip--below' : ''
          }`}
          style={{ left: `${active.rrg.plotX}%`, top: `${active.rrg.plotY}%` }}
          role="tooltip"
        >
          <span className="sr-rrg__tooltip-swatch" style={{ background: active.color }} aria-hidden />
          <span className="sr-rrg__tooltip-text">
            <strong>{active.indexName || active.name}</strong>
            <span className="sr-rrg__tooltip-meta">
              Ratio {rrgRatio(active)}, Mom {rrgMom(active)}
            </span>
            <span className="sr-rrg__tooltip-sub">
              RS 30D {active.rs30d >= 0 ? '+' : ''}
              {active.rs30d.toFixed(2)}% · Momentum {active.momentum >= 0 ? '+' : ''}
              {active.momentum.toFixed(2)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function Heatmap({ sectors }) {
  return (
    <div className="sr-heatmap">
      {sectors.map((s) => {
        const tone = s.change1d >= 0 ? 'up' : 'down';
        const strength = Math.min(1, Math.abs(s.change1d) / 2.5);
        return (
          <div
            key={s.id}
            className={`sr-heatmap__cell sr-heatmap__cell--${tone}`}
            style={{ opacity: 0.35 + strength * 0.65 }}
            title={`${s.name} · 1D ${s.change1d}% · 30D ${s.change30d}%`}
          >
            <div className="sr-heatmap__name">{s.name}</div>
            <div className={`sr-heatmap__chg ${tone === 'up' ? 'is-up' : 'is-down'}`}>
              {s.change1d >= 0 ? '+' : ''}
              {s.change1d.toFixed(2)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RankingTable({ sectors }) {
  return (
    <div className="sr-table-wrap">
      <table className="sr-table">
        <thead>
          <tr>
            <th>Sector</th>
            <th>Score</th>
            <th>Quadrant</th>
            <th>1D</th>
            <th>30D</th>
            <th>RS 30D</th>
            <th>Momentum</th>
          </tr>
        </thead>
        <tbody>
          {sectors.map((s, i) => (
            <tr key={s.id}>
              <td>
                <div className="sr-sector-cell">
                  <span className="sr-sector-dot" style={{ background: s.color }} />
                  <span>{i + 1}. {s.name}</span>
                </div>
              </td>
              <td>{s.rotationScore}</td>
              <td>{s.quadrantMeta.label}</td>
              <td className={s.change1d >= 0 ? 'is-up' : 'is-down'}>{s.change1d >= 0 ? '+' : ''}{s.change1d.toFixed(2)}%</td>
              <td className={s.change30d >= 0 ? 'is-up' : 'is-down'}>{s.change30d >= 0 ? '+' : ''}{s.change30d.toFixed(2)}%</td>
              <td className={s.rs30d >= 0 ? 'is-up' : 'is-down'}>{s.rs30d >= 0 ? '+' : ''}{s.rs30d.toFixed(2)}%</td>
              <td className={s.momentum >= 0 ? 'is-up' : 'is-down'}>{s.momentum >= 0 ? '+' : ''}{s.momentum.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RsLeaderboardChart({ sectors }) {
  const maxAbs = Math.max(...sectors.map((s) => Math.abs(s.rs30d)), 1);
  return (
    <div className="sr-rs-bars">
      {sectors.slice(0, 12).map((s) => {
        const width = Math.max(6, Math.round((Math.abs(s.rs30d) / maxAbs) * 100));
        const up = s.rs30d >= 0;
        return (
          <div className="sr-rs-row" key={s.id}>
            <span className="sr-rs-name">{s.name}</span>
            <div className="sr-rs-track">
              <div className={`sr-rs-fill ${up ? 'is-up' : 'is-down'}`} style={{ width: `${width}%` }} />
            </div>
            <span className={`sr-rs-val ${up ? 'is-up' : 'is-down'}`}>
              {up ? '+' : ''}
              {s.rs30d.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MomentumChart({ sectors }) {
  const maxVal = Math.max(
    ...sectors.flatMap((s) => [Math.abs(s.change1d), Math.abs(s.change30d), Math.abs(s.change365d)]),
    1
  );

  const h = (v) => `${Math.max(4, (Math.abs(v) / maxVal) * 100)}%`;

  return (
    <div className="sr-momo">
      <div className="sr-momo__legend">
        <span><i className="c-1d" />1D</span>
        <span><i className="c-30d" />30D</span>
        <span><i className="c-365d" />365D</span>
      </div>
      <div className="sr-momo__bars">
        {sectors.slice(0, 12).map((s) => (
          <div key={s.id} className="sr-momo__group">
            <div className="sr-momo__cols">
              <span className={`sr-momo__bar c-1d ${s.change1d >= 0 ? 'is-up' : 'is-down'}`} style={{ height: h(s.change1d) }} title={`1D ${s.change1d}%`} />
              <span className={`sr-momo__bar c-30d ${s.change30d >= 0 ? 'is-up' : 'is-down'}`} style={{ height: h(s.change30d) }} title={`30D ${s.change30d}%`} />
              <span className={`sr-momo__bar c-365d ${s.change365d >= 0 ? 'is-up' : 'is-down'}`} style={{ height: h(s.change365d) }} title={`365D ${s.change365d}%`} />
            </div>
            <span className="sr-momo__name">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompactTable({ title, subtitle, columns, rows, renderRow }) {
  return (
    <article className="sr-panel sr-compact">
      <div className="sr-compact__head">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="sr-table-wrap">
        <table className="sr-table sr-table--compact">
          <thead>
            <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>{rows.map(renderRow)}</tbody>
        </table>
      </div>
    </article>
  );
}

function SupportResistanceTable({ rows }) {
  const fmt = (v) => (v == null || !Number.isFinite(v) ? '—' : Number(v).toFixed(4));

  return (
    <article className="sr-panel sr-panel--support">
      <div className="sr-support__head">
        <h2>RS Support & Resistance</h2>
        <p>Dynamic Pivot Levels (10, 50, 200 SMA) computed from relative-strength pivot-point formula.</p>
      </div>
      <div className="sr-table-wrap">
        <table className="sr-table sr-table--pivot">
          <thead>
            <tr>
              <th rowSpan={2}>Sector</th>
              <th rowSpan={2}>Benchmark</th>
              <th colSpan={3}>10-DAY</th>
              <th colSpan={3}>50-DAY</th>
              <th colSpan={3}>200-DAY</th>
            </tr>
            <tr>
              <th>Pivot</th>
              <th>Support</th>
              <th>Resistance</th>
              <th>Pivot</th>
              <th>Support</th>
              <th>Resistance</th>
              <th>Pivot</th>
              <th>Support</th>
              <th>Resistance</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map((r) => (
              <tr key={r.sector}>
                <td>{r.sector}</td>
                <td className="sr-td-muted">{r.benchmark}</td>
                <td>{fmt(r.levels10?.pivot)}</td>
                <td className="sr-td-support">{fmt(r.levels10?.support)}</td>
                <td className="sr-td-resistance">{fmt(r.levels10?.resistance)}</td>
                <td>{fmt(r.levels50?.pivot)}</td>
                <td className="sr-td-support">{fmt(r.levels50?.support)}</td>
                <td className="sr-td-resistance">{fmt(r.levels50?.resistance)}</td>
                <td>{fmt(r.levels200?.pivot)}</td>
                <td className="sr-td-support">{fmt(r.levels200?.support)}</td>
                <td className="sr-td-resistance">{fmt(r.levels200?.resistance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sr-support__note">
        RS pivot uses: <code>Pivot_n = (RS_High,n + RS_Low,n + RS_Close,n) / 3</code>. High/Low for 10/50/200 are approximated
        using the nearest NSE lookback values available in our feed.
      </p>
    </article>
  );
}

export default function SectorRotationDashboard() {
  const { loading, error, data } = useSectorRotation();
  const [tab, setTab] = useState('rrg');
  const [period, setPeriod] = useState('SMA 50 (Med)');

  const sectors = useMemo(() => data?.sectors || [], [data]);
  const topByRs = useMemo(() => [...sectors].sort((a, b) => b.rs30d - a.rs30d).slice(0, 3), [sectors]);
  const laggingByRs = useMemo(() => [...sectors].sort((a, b) => a.rs30d - b.rs30d).slice(0, 3), [sectors]);
  const momentumLeaders = useMemo(() => [...sectors].sort((a, b) => b.momentum - a.momentum).slice(0, 3), [sectors]);

  const moodPct = useMemo(() => {
    const b = data?.marketBreadth;
    if (!b) return 0;
    const total = (Number(b.advances) || 0) + (Number(b.declines) || 0) + (Number(b.unchanged) || 0);
    if (!total) return 0;
    return Math.round(((Number(b.advances) || 0) / total) * 100);
  }, [data]);

  const buySell = useMemo(() => {
    const q = data?.quadrants;
    const buy = (q?.leading?.length || 0) + (q?.improving?.length || 0);
    const sell = (q?.lagging?.length || 0) + (q?.weakening?.length || 0);
    return { buy, sell, label: moodPct >= 50 ? 'Bullish' : 'Bearish' };
  }, [data, moodPct]);

  const tabSectors =
    tab === 'momentum'
      ? [...sectors].sort((a, b) => b.momentum - a.momentum)
      : [...sectors].sort((a, b) => b.rs30d - a.rs30d);
  const dashboards = data?.dashboards || {};
  const rsSupportResistance = data?.rsSupportResistance || [];

  return (
    <div className="sr-page section__padding">
      <header className="sr-head">
        <div>
          <p className="sr-kicker">Rotation dashboard</p>
          <h1>Sector rotation</h1>
          <p className="sr-sub">
            Live NSE sectoral indices mapped into RRG-style quadrants using relative strength vs NIFTY 50.
          </p>
        </div>
        <div className="sr-head__actions">
          <Link to="/screeners" className="sr-link">← Back to screeners hub</Link>
          {data?.asOn && <p className="sr-asof">As on {data.asOn}</p>}
        </div>
      </header>

      {error && <p className="sr-error">{error}</p>}

      {loading && <div className="sr-skeleton" aria-busy="true" />}

      {!loading && data && (
        <>
          <section className="sr-summary">
            <article className="sr-card">
              <h2>Market breadth</h2>
              <p className="sr-benchmark">
                {moodPct}% {buySell.label}
              </p>
              <p className="sr-meta">
                {buySell.buy} Buy / {buySell.sell} Sell signals
              </p>
            </article>
            <article className="sr-card">
              <h2>Top mover (30D)</h2>
              <p className="sr-benchmark">{topByRs?.[0]?.name || '—'}</p>
              <p className="sr-meta">
                {topByRs?.[0]?.change30d >= 0 ? '+' : ''}
                {topByRs?.[0]?.change30d?.toFixed(2)}% return
              </p>
            </article>
            <article className="sr-card">
              <h2>Momentum leader</h2>
              <p className="sr-benchmark">{momentumLeaders?.[0]?.name || '—'}</p>
              <p className="sr-meta">
                {momentumLeaders?.[0]?.momentum >= 0 ? '+' : ''}
                {momentumLeaders?.[0]?.momentum?.toFixed(2)}% momentum
              </p>
            </article>
            <article className="sr-card">
              <h2>Lagging sector</h2>
              <p className="sr-benchmark">{laggingByRs?.[0]?.name || '—'}</p>
              <p className="sr-meta">
                {laggingByRs?.[0]?.change30d >= 0 ? '+' : ''}
                {laggingByRs?.[0]?.change30d?.toFixed(2)}% return
              </p>
            </article>
          </section>

          <section className="sr-toolbar">
            <div className="sr-toolbar__tabs">
              {[
                { id: 'rrg', label: 'RRG Quadrant' },
                { id: 'rs', label: 'RS Leaderboard' },
                { id: 'heatmap', label: 'Heatmap' },
                { id: 'momentum', label: 'Momentum' },
              ].map((t) => (
                <button key={t.id} type="button" className={`sr-toolbar__tab${tab === t.id ? ' is-active' : ''}`} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="sr-toolbar__meta">
              Benchmark: <strong>{data.benchmark?.name}</strong>
              <span className="sr-toolbar__spacer" />
              Period:&nbsp;
              <select
                className="sr-toolbar__select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                aria-label="Rotation period"
              >
                <option>SMA 50 (Med)</option>
                <option>Weekly (Short)</option>
                <option>Monthly (Long)</option>
              </select>
            </div>
          </section>

          <section className="sr-grid">
            <article className="sr-panel">
              {tab === 'rrg' && (
                <>
                  <h2>Relative Rotation Graph</h2>
                  <QuadMap sectors={sectors} />
                </>
              )}
              {tab === 'rs' && (
                <>
                  <h2>Relative Strength Leaderboard</h2>
                  <RsLeaderboardChart sectors={tabSectors} />
                  <RankingTable sectors={tabSectors} />
                </>
              )}
              {tab === 'heatmap' && (
                <>
                  <h2>Heatmap (1D)</h2>
                  <Heatmap sectors={sectors} />
                </>
              )}
              {tab === 'momentum' && (
                <>
                  <h2>Sector Momentum</h2>
                  <MomentumChart sectors={sectors} />
                  <RankingTable sectors={tabSectors} />
                </>
              )}
            </article>
            <aside className="sr-side">
              <div className="sr-panel sr-sidecard">
                <h2>Metadata</h2>
                <ul className="sr-meta-list">
                  <li><span className="m1">◫</span> <strong>Ranking Based On:</strong> Calendar-based 1M, 3M, 6M returns</li>
                  <li><span className="m2">〰</span> <strong>Relative Strength Window:</strong> 2Y</li>
                  <li><span className="m3">▦</span> <strong>Heatmap Window:</strong> 5Y</li>
                  <li><span className="m4">⚡</span> <strong>Momentum Trend Window:</strong> 1Y</li>
                  <li><span className="m5">◈</span> <strong>Benchmark:</strong> {data.benchmark?.name || 'NIFTY 500'}</li>
                </ul>
              </div>

              <div className="sr-panel sr-sidecard">
                <h2>Top sectors</h2>
                <span className="sr-side-count">{topByRs.length}</span>
                <ul className="sr-side-list">
                  {topByRs.map((s) => (
                    <li key={s.id}>
                      <span className="sr-side-dot" style={{ background: s.color }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
                <div className="sr-side-muted">Trailing pocket</div>
                <ul className="sr-side-list">
                  {laggingByRs.map((s) => (
                    <li key={s.id}>
                      <span className="sr-side-dot sr-side-dot--down" style={{ background: s.color }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sr-panel sr-sidecard">
                <h2>Methodology</h2>
                <p className="sr-method">{data.methodology}</p>
              </div>
            </aside>
          </section>

          <section className="sr-grid sr-grid--equal">
            <CompactTable
              title="Trending Sectors"
              subtitle="Momentum-weighted composite ranks"
              columns={['Sector', '1M Return', '3M Return', '6M Return', 'Score', 'Signal']}
              rows={dashboards.trendingSectors || []}
              renderRow={(r) => (
                <tr key={r.id}>
                  <td>{r.sector}</td>
                  <td className={r.ret1m >= 0 ? 'is-up' : 'is-down'}>{r.ret1m >= 0 ? '+' : ''}{r.ret1m.toFixed(2)}%</td>
                  <td className={r.ret3m >= 0 ? 'is-up' : 'is-down'}>{r.ret3m >= 0 ? '+' : ''}{r.ret3m.toFixed(2)}%</td>
                  <td className={r.ret6m >= 0 ? 'is-up' : 'is-down'}>{r.ret6m >= 0 ? '+' : ''}{r.ret6m.toFixed(2)}%</td>
                  <td>{r.score.toFixed(2)}%</td>
                  <td><span className={`sr-signal ${r.signal === 'BUY' ? 'is-buy' : 'is-watch'}`}>{r.signal}</span></td>
                </tr>
              )}
            />

            <CompactTable
              title="Relative Strength (Daily) vs Weekly EMA-30"
              subtitle="RS relative to 30-week EMA (W-FRI)"
              columns={['Sector', 'RS', 'EMA-30 Weekly', '% Diff']}
              rows={dashboards.rsVsWeeklyEma || []}
              renderRow={(r) => (
                <tr key={r.id}>
                  <td>{r.sector}</td>
                  <td>{r.rs.toFixed(4)}</td>
                  <td>{r.ema30Weekly.toFixed(4)}</td>
                  <td className={r.diffPct >= 0 ? 'is-up' : 'is-down'}>{r.diffPct >= 0 ? '+' : ''}{r.diffPct.toFixed(2)}%</td>
                </tr>
              )}
            />
          </section>

          <SupportResistanceTable rows={rsSupportResistance} />
        </>
      )}
    </div>
  );
}
