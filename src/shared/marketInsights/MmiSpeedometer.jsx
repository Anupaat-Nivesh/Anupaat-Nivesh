import React, { useId } from 'react';
import './mmi-speedometer.css';

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg > 0 ? 1 : 0;
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
}

const ZONES = {
  composite: [
    { from: 0, to: 30, color: '#dc2626' },
    { from: 30, to: 45, color: '#f97316' },
    { from: 45, to: 55, color: '#9ca3af' },
    { from: 55, to: 75, color: '#84cc16' },
    { from: 75, to: 100, color: '#16a34a' },
  ],
  'greed-fear': [
    { from: 0, to: 25, color: '#991b1b' },
    { from: 25, to: 45, color: '#ef4444' },
    { from: 45, to: 55, color: '#9ca3af' },
    { from: 55, to: 75, color: '#22c55e' },
    { from: 75, to: 100, color: '#15803d' },
  ],
};

function scoreToAngle(score) {
  const s = Math.min(100, Math.max(0, Number(score) || 0));
  return 180 + (s / 100) * 180;
}

export default function MmiSpeedometer({ score, label, tone, variant = 'composite', size = 'md' }) {
  const uid = useId().replace(/:/g, '');
  const s = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  const cx = 100;
  const cy = 96;
  const r = 72;
  const needleAngle = scoreToAngle(s);
  const needleTip = polar(cx, cy, r - 14, needleAngle);
  const zones = ZONES[variant] || ZONES.composite;

  const tickScores = variant === 'greed-fear' ? [0, 25, 50, 75, 100] : [0, 25, 50, 75, 100];
  const tickLabels =
    variant === 'greed-fear'
      ? ['Fear', '', 'Neutral', '', 'Greed']
      : ['Bear', '', 'Neutral', '', 'Bull'];

  return (
    <div
      className={`scr-mmi-gauge scr-mmi-gauge--${size} scr-mmi-gauge--${variant}`}
      role="meter"
      aria-valuenow={s}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label}, ${s} out of 100`}
    >
      <svg className="scr-mmi-gauge__svg" viewBox="0 0 200 118" aria-hidden="true">
        <defs>
          <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Track */}
        <path
          d={arcPath(cx, cy, r, 180, 360)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Coloured zones */}
        {zones.map((z) => {
          const a0 = 180 + (z.from / 100) * 180;
          const a1 = 180 + (z.to / 100) * 180;
          return (
            <path
              key={`${z.from}-${z.to}`}
              d={arcPath(cx, cy, r, a0, a1)}
              fill="none"
              stroke={z.color}
              strokeWidth="10"
              strokeLinecap="butt"
              opacity={0.92}
            />
          );
        })}

        {/* Tick marks */}
        {tickScores.map((t) => {
          const a = scoreToAngle(t);
          const inner = polar(cx, cy, r - 6, a);
          const outer = polar(cx, cy, r + 2, a);
          return (
            <line
              key={t}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="#9ca3af"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          className={`scr-mmi-gauge__needle is-${tone || 'neutral'}`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="7" className="scr-mmi-gauge__hub" />
        <circle cx={cx} cy={cy} r="3" fill="#fff" />

        {/* Shine overlay on dial */}
        <path
          d={arcPath(cx, cy, r - 5, 200, 340)}
          fill="none"
          stroke={`url(#${uid}-shine)`}
          strokeWidth="18"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>

      <div className="scr-mmi-gauge__readout">
        <span className="scr-mmi-gauge__score">{s}</span>
        <span className="scr-mmi-gauge__of">/100</span>
      </div>

      <p className={`scr-mmi-gauge__label is-${tone || 'neutral'}`}>{label}</p>

      <div className="scr-mmi-gauge__ticks" aria-hidden="true">
        {tickScores.map((t, i) => (
          <span key={t} className="scr-mmi-gauge__tick">
            {tickLabels[i] || ''}
          </span>
        ))}
      </div>
    </div>
  );
}
