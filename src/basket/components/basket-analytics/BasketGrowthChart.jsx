import React, { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getElementColor, getElementRgba } from '../../data/elementalColors';
import { buildGrowthChartModel } from '../../utils/growthChartData';

const NIFTY_COLOR = '#2563eb';

const BENCHMARK_SERIES = [
  { id: 'basket', label: 'Basket NAV', primary: true },
  { id: 'nifty50', label: 'Nifty 50', primary: true },
];

function formatLakh(n) {
  if (n == null) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function BasketGrowthChart({ analytics, basket, loading, element = 'fire' }) {
  const [active, setActive] = useState(['basket', 'nifty50']);
  const basketColor = getElementColor(element);

  const { growth, chartData, usingFallbackNav } = useMemo(() => {
    const model = buildGrowthChartModel(analytics, basket, { activeSeries: active });
    const fallback =
      !analytics?.navHistory?.length && Boolean(basket?.performanceLine?.length);
    return { ...model, usingFallbackNav: fallback };
  }, [analytics, basket, active]);

  const chartJsData = useMemo(() => {
    if (!chartData) return null;
    return {
      labels: chartData.labels,
      datasets: chartData.datasets.map((ds) => {
        const isBasket = ds.label === 'Basket NAV';
        const color = isBasket ? basketColor : NIFTY_COLOR;
        return {
          ...ds,
          borderColor: color,
          backgroundColor: isBasket ? getElementRgba(element, 0.08) : undefined,
          fill: isBasket,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
          spanGaps: !isBasket,
        };
      }),
    };
  }, [chartData, basketColor, element]);

  return (
    <section className="an-basket-growth">
      <div className="an-basket-growth__head">
        <div>
          <h2 className="an-card-heading">Growth of ₹1,00,000</h2>
          <p className="an-sb-muted">
            Basket NAV vs Nifty 50 — both indexed to 100 at basket inception. Weighted portfolio
            level, not individual fund performance.
            {usingFallbackNav && (
              <>
                {' '}
                <span className="an-basket-growth__fallback-note">
                  Showing illustrative curve — connect live analytics for actual NAV history.
                </span>
              </>
            )}
          </p>
        </div>
        <div className="an-basket-growth__summary">
          <div>
            <span>Basket value</span>
            <strong>{loading ? '…' : formatLakh(growth?.basket)}</strong>
          </div>
          <div>
            <span>Nifty 50 value</span>
            <strong>{loading ? '…' : formatLakh(growth?.nifty50)}</strong>
          </div>
        </div>
      </div>

      <div className="an-basket-growth__toggles">
        {BENCHMARK_SERIES.map((s) => {
          const color = s.id === 'basket' ? basketColor : NIFTY_COLOR;
          return (
            <button
              key={s.id}
              type="button"
              className={`an-period-tab ${active.includes(s.id) ? 'is-active' : ''}`}
              style={active.includes(s.id) ? { borderColor: color, color } : undefined}
              onClick={() =>
                setActive((prev) =>
                  prev.includes(s.id) ? prev.filter((x) => x !== s.id) : [...prev, s.id]
                )
              }
            >
              <span
                className="an-basket-growth__legend-dot"
                style={{ background: color }}
                aria-hidden="true"
              />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="an-basket-growth__chart">
        {chartJsData ? (
          <Line
            data={chartJsData}
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
