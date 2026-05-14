import React, { useState } from 'react';
import { GOAL_TYPES } from '../data/goals';
import { useBasketUser } from '../context/BasketUserContext';

function Ring({ pct, label, sub }) {
  const gid = React.useId().replace(/:/g, '');
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const gradId = `grad_${gid}`;
  return (
    <div style={{ textAlign: 'center', width: 140 }}>
      <svg width={140} height={140} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="10"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <defs>
          <linearGradient id={gradId} x1="0" x2="1">
            <stop offset="0" stopColor="#00A676" />
            <stop offset="1" stopColor="#c9a227" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ marginTop: -96, fontWeight: 800, fontSize: '1.25rem' }}>{pct}%</div>
      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>{sub}</div>
    </div>
  );
}

export default function GoalGPSPage() {
  const { goals, setGoals, darkMode } = useBasketUser();
  const [type, setType] = useState('retirement');
  const [target, setTarget] = useState(2000000);
  const [monthly, setMonthly] = useState(15000);
  const [years, setYears] = useState(15);

  const addGoal = () => {
    const inflation = 1.06 ** years;
    const futureTarget = Math.round(target * inflation);
    const prob = Math.min(95, Math.round(55 + (monthly / 500) * 0.8 + years * 1.2));
    setGoals((g) => [
      ...g,
      {
        id: `g_${Date.now()}`,
        type,
        target: futureTarget,
        monthly,
        years,
        probability: prob,
        created: new Date().toISOString(),
      },
    ]);
  };

  const bg = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(11,31,58,0.04)';

  return (
    <section style={{ paddingTop: '1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Goal GPS</h1>
      <p className="an-muted">Inflation-adjusted targets with achievement probability — illustrative models.</p>

      <div className="an-glass-card" style={{ padding: '1.25rem', marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 12 }}>Add a goal</h2>
        <div className="an-form-group">
          <label>Goal type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {GOAL_TYPES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.icon} {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="an-form-group">
          <label>Today’s target corpus (₹)</label>
          <input type="number" value={target} min={100000} step={50000} onChange={(e) => setTarget(Number(e.target.value))} />
        </div>
        <div className="an-form-group">
          <label>Monthly SIP (₹)</label>
          <input type="number" value={monthly} min={1000} step={500} onChange={(e) => setMonthly(Number(e.target.value))} />
        </div>
        <div className="an-form-group">
          <label>Years to goal</label>
          <input type="number" value={years} min={1} max={40} onChange={(e) => setYears(Number(e.target.value))} />
        </div>
        <button type="button" className="an-btn-primary" onClick={addGoal}>
          Plot on GPS
        </button>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2rem' }}>Your goals</h2>
      {goals.length === 0 && <p style={{ opacity: 0.75 }}>No goals yet — add your first milestone.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: 16 }}>
        {goals.map((g) => {
          const meta = GOAL_TYPES.find((x) => x.id === g.type) || { label: g.type, icon: '🎯' };
          const pct = Math.min(100, Math.round((g.monthly * g.years * 12 * 100) / g.target));
          return (
            <div key={g.id} className="an-glass-card" style={{ padding: '1rem', background: bg }}>
              <Ring pct={pct} label={`${meta.icon} ${meta.label}`} sub={`~${g.probability}% on-track`} />
              <p style={{ fontSize: '0.75rem', opacity: 0.8, maxWidth: 140, marginTop: 8 }}>
                Inflation-adjusted target ≈ ₹{g.target.toLocaleString('en-IN')}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
