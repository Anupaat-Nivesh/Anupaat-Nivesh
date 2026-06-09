import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import ScripboxCard from './ScripboxCard';
import AccordionSection from './AccordionSection';

const CAP_COLORS = ['#FE0101', '#ff6b6b', '#161a1d'];

export default function EquityAnalysisCard({ marketCap, sectors }) {
  const capData = {
    labels: marketCap.map((m) => m.label),
    datasets: [
      {
        data: marketCap.map((m) => m.pct),
        backgroundColor: CAP_COLORS,
        borderWidth: 0,
      },
    ],
  };

  const marketCapSection = {
    title: 'Market Cap',
    content: (
      <div className="an-sb-donut-wrap">
        <div style={{ width: 160, height: 160 }}>
          <Doughnut
            data={capData}
            options={{
              cutout: '62%',
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div style={{ width: '100%' }}>
          {marketCap.map((m, i) => (
            <div key={m.label} className="an-sb-legend-row">
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <span className="an-sb-legend-dot" style={{ background: CAP_COLORS[i % CAP_COLORS.length] }} />
                {m.label}
              </span>
              <strong>{m.pct}%</strong>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  const sectorsSection = {
    title: 'Sectors',
    content: (
      <div>
        {sectors.map((s) => (
          <div key={s.label} className="an-sb-sector-row">
            <div className="an-sb-sector-row__head">
              <span>{s.label}</span>
              <strong>{s.pct}%</strong>
            </div>
            <div className="an-sb-sector-bar">
              <div className="an-sb-sector-fill" style={{ width: `${Math.min(100, s.pct)}%` }} />
            </div>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <ScripboxCard title="Equity Analysis">
      <AccordionSection sections={[marketCapSection, sectorsSection]} />
    </ScripboxCard>
  );
}
