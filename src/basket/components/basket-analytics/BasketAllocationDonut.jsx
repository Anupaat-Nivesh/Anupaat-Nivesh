import React from 'react';
import { Doughnut } from 'react-chartjs-2';

export default function BasketAllocationDonut({ slices, title = 'Portfolio construction' }) {
  if (!slices?.length) return null;

  const data = {
    labels: slices.map((s) => s.label),
    datasets: [
      {
        data: slices.map((s) => s.pct),
        backgroundColor: slices.map((s) => s.color || '#FE0101'),
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="an-basket-alloc">
      <h2 className="an-card-heading">{title}</h2>
      <div className="an-basket-alloc__body">
        <div className="an-basket-alloc__chart">
          <Doughnut
            data={data}
            options={{
              cutout: '68%',
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <ul className="an-basket-alloc__legend">
          {slices.map((s) => (
            <li key={s.label}>
              <span className="an-basket-alloc__dot" style={{ background: s.color }} />
              <span>{s.label}</span>
              <strong>{s.pct}%</strong>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
