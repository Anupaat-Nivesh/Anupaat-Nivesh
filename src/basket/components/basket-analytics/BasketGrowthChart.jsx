import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';

const SERIES = [
  { id: 'basket', label: 'Basket', color: '#FE0101' },
  { id: 'nifty50', label: 'Nifty 50', color: '#2563eb' },
  { id: 'nifty500', label: 'Nifty 500', color: '#7c3aed' },
  { id: 'gold', label: 'Gold', color: '#c9a227' },
  { id: 'fd', label: 'FD @ 7%', color: '#64748b' },
];

function formatLakh(n) {
  if (n == null) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function BasketGrowthChart({ analytics, loading }) {
  const [active, setActive] = useState(['basket', 'nifty50', 'gold']);

  const chartData = useMemo(() => {
    if (!analytics?.navHistory?.length) return null;
    const labels = analytics.navHistory.map((p) => p.date);
    const datasets = [];

    if (active.includes('basket')) {
      datasets.push({
        label: 'Basket',
        data: analytics.navHistory.map((p) => p.nav),
        borderColor: '#FE0101',
        backgroundColor: 'rgba(254,1,1,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 2,
      });
    }

    SERIES.filter((s) => s.id !== 'basket' && active.includes(s.id)).forEach((s) => {
      const bm = analytics.benchmarks?.[s.id];
      if (!bm?.series?.length) return;
      const map = new Map(bm.series.map((p) => [p.date, p.nav]));
      datasets.push({
        label: s.label,
        data: labels.map((d) => map.get(d) ?? null),
        borderColor: s.color,
        tension: 0.3,
        pointRadius: 0,
        borderWidth: 1.5,
        spanGaps: true,
      });
    });

    return { labels, datasets };
  }, [analytics, active]);

  const growth = analytics?.growthComparison;
  const basketRet = analytics?.returns?.growth1LakhReturn;

  return (
    <section className="an-basket-growth">
      <div className="an-basket-growth__head">
        <div>
          <h2 className="an-card-heading">Growth of ₹1,00,000</h2>
          <p className="an-sb-muted">Synthetic basket NAV vs benchmarks (normalized to 100 at inception)</p>
        </div>
        <div className="an-basket-growth__summary">
          <div>
            <span>Current value</span>
            <strong>{loading ? '…' : formatLakh(growth?.basket)}</strong>
          </div>
          <div>
            <span>Absolute return</span>
            <strong className="an-return-pos">
              {loading ? '…' : basketRet != null ? `+${basketRet}%` : '—'}
            </strong>
          </div>
        </div>
      </div>

      <div className="an-basket-growth__toggles">
        {SERIES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`an-period-tab ${active.includes(s.id) ? 'is-active' : ''}`}
            onClick={() =>
              setActive((prev) =>
                prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
              )
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="an-basket-growth__chart">
        {chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { maxTicksLimit: 8, font: { size: 10 } }, grid: { display: false } },
                y: { ticks: { font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
              },
            }}
          />
        ) : (
          <p className="an-sb-muted">{loading ? 'Loading chart…' : 'Chart data unavailable'}</p>
        )}
      </div>
    </section>
  );
}
