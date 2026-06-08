import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

const PERIODS = [
  { id: '3m', months: 3, label: '3M' },
  { id: '6m', months: 6, label: '6M' },
  { id: '1y', months: 12, label: '1Y' },
  { id: '2y', months: 24, label: '2Y' },
  { id: '3y', months: 36, label: '3Y' },
  { id: 'max', months: null, label: 'Max' },
];

const SHORT_PERIODS = new Set(['3m', '6m', '1y']);

function sliceSeries(series, months) {
  if (!months || !series?.length) return series || [];
  const latest = toDate(series[series.length - 1].date);
  if (!latest) return series || [];
  const cut = new Date(latest);
  cut.setMonth(cut.getMonth() - months);
  return series.filter((p) => {
    const d = toDate(p.date);
    return d ? d >= cut : false;
  });
}

function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatChartDate(value) {
  const d = toDate(value);
  if (!d) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAxisLabel(value, period) {
  const d = toDate(value);
  if (!d) return '';
  if (SHORT_PERIODS.has(period)) {
    return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  }
  return d.getFullYear().toString();
}

function formatNavValue(v) {
  if (v == null || Number.isNaN(v)) return '—';
  return `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

/** Prefer 1Y; fall back to 6M when history is thin. */
export function pickDefaultChartPeriod(navSeries = []) {
  if (!navSeries?.length) return '1y';
  const latest = toDate(navSeries[navSeries.length - 1]?.date);
  if (!latest) return '1y';

  const countSince = (months) => {
    const cut = new Date(latest);
    cut.setMonth(cut.getMonth() - months);
    return navSeries.filter((p) => {
      const d = toDate(p.date);
      return d && d >= cut;
    }).length;
  };

  if (countSince(12) >= 20) return '1y';
  if (countSince(6) >= 12) return '6m';
  return 'max';
}

/** Thin very long series so the spline stays smooth without losing shape. */
function prepareChartPoints(points, period) {
  if (!points?.length) return [];
  const maxPoints = period === 'max' ? 180 : period === '3y' ? 160 : 120;
  if (points.length <= maxPoints) return points;

  const step = Math.ceil(points.length / maxPoints);
  const sampled = points.filter((_, i) => i % step === 0 || i === points.length - 1);
  const last = points[points.length - 1];
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled;
}

export default function FundNavChart({ navSeries = [], inceptionDate }) {
  const [period, setPeriod] = useState('1y');
  const initializedPeriod = useRef(false);

  useEffect(() => {
    if (!navSeries?.length || initializedPeriod.current) return;
    initializedPeriod.current = true;
    setPeriod(pickDefaultChartPeriod(navSeries));
  }, [navSeries]);

  const months = PERIODS.find((p) => p.id === period)?.months;

  const points = useMemo(() => {
    const sliced = sliceSeries(navSeries, months);
    return prepareChartPoints(sliced, period);
  }, [navSeries, months, period]);

  const chartData = useMemo(() => {
    const tickEvery = Math.max(1, Math.floor(points.length / 7));
    return {
      labels: points.map((p, i) => {
        if (i % tickEvery !== 0 && i !== points.length - 1) return '';
        return formatAxisLabel(p.date, period);
      }),
      datasets: [
        {
          data: points.map((p) => p.nav),
          borderColor: '#c41e3a',
          backgroundColor: (context) => {
            const { chart } = context;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(196, 30, 58, 0.08)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(196, 30, 58, 0.14)');
            gradient.addColorStop(1, 'rgba(196, 30, 58, 0.01)');
            return gradient;
          },
          fill: true,
          tension: 0.42,
          cubicInterpolationMode: 'monotone',
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#c41e3a',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2,
          borderWidth: 2.75,
        },
      ],
    };
  }, [points, period]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#fff',
          titleColor: '#6b7280',
          bodyColor: '#111827',
          bodyFont: { size: 17, weight: '700' },
          titleFont: { size: 13, weight: '600' },
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1,
          padding: 16,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            title(items) {
              const idx = items[0]?.dataIndex;
              return formatChartDate(points[idx]?.date);
            },
            label(ctx) {
              return formatNavValue(ctx.parsed.y);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: SHORT_PERIODS.has(period) ? 6 : 8,
            font: { size: 13, weight: '600' },
            color: '#6b7280',
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          position: 'left',
          ticks: {
            font: { size: 13, weight: '600' },
            color: '#6b7280',
            callback: (v) => Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
          },
          grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
          border: { display: false },
        },
      },
    }),
    [period, points]
  );

  if (!points.length) {
    return (
      <div className="an-fund-chart-panel an-fund-chart-panel--empty">
        <p className="an-sb-muted">NAV history is not available for this fund yet.</p>
      </div>
    );
  }

  return (
    <div className="an-fund-chart-panel">
      <div className="an-fund-chart-panel__canvas">
        <Line data={chartData} options={options} />
      </div>
      <div className="an-fund-chart-panel__footer">
        <div className="an-fund-period-bar" role="tablist" aria-label="Chart period">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={period === p.id}
              className={`an-fund-period-btn ${period === p.id ? 'is-active' : ''}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {inceptionDate && (
          <p className="an-fund-chart-panel__inception">
            Since {formatChartDate(inceptionDate)}
          </p>
        )}
      </div>
    </div>
  );
}
