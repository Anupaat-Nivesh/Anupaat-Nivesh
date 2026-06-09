import React from 'react';

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

function scoreToZone(score) {
  if (score == null) return { label: '—', tone: 'neutral' };
  if (score <= 35) return { label: 'Low', tone: 'low' };
  if (score <= 60) return { label: 'Moderate', tone: 'mid' };
  if (score <= 80) return { label: 'High', tone: 'high' };
  return { label: 'Very High', tone: 'vhigh' };
}

export default function Riskometer({ score, label }) {
  const s = score == null || !Number.isFinite(Number(score)) ? null : Math.max(0, Math.min(100, Math.round(Number(score))));
  const zone = scoreToZone(s);

  const cx = 110;
  const cy = 100;
  const r = 82;
  const start = 180;
  const end = 360;
  const needleDeg = start + (s == null ? 0 : (s / 100) * (end - start));
  const needleTip = polar(cx, cy, r - 14, needleDeg);

  // Note: visually we keep a "risk increasing to the right" dial.
  const zColor = zone.tone === 'low' ? '#059669' : zone.tone === 'mid' ? '#f59e0b' : zone.tone === 'high' ? '#f97316' : '#dc2626';
  const tone = zone.tone;

  const needleClass =
    tone === 'low' ? 'is-low' : tone === 'mid' ? 'is-mid' : tone === 'high' ? 'is-high' : 'is-vhigh';

  const effectiveZones = [
    { from: 0, to: 35, color: '#16a34a' },
    { from: 35, to: 60, color: '#f59e0b' },
    { from: 60, to: 80, color: '#f97316' },
    { from: 80, to: 100, color: '#dc2626' },
  ];

  return (
    <div className="an-riskom">
      <div className="an-riskom__top">
        <span className="an-riskom__title">{label || 'Riskometer'}</span>
        <span className="an-riskom__score">
          {s == null ? '—' : s}
          <span className="an-riskom__of">/100</span>
        </span>
      </div>

      <div className="an-riskom__gauge" aria-hidden="true">
        <svg className="an-riskom__svg" viewBox="0 0 220 118">
          <defs>
            <linearGradient id="an-riskom-shine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={arcPath(cx, cy, r, start, end)} fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />

          {effectiveZones.map((z) => {
            const a0 = start + (z.from / 100) * (end - start);
            const a1 = start + (z.to / 100) * (end - start);
            return (
              <path key={`${z.from}-${z.to}`} d={arcPath(cx, cy, r, a0, a1)} fill="none" stroke={z.color} strokeWidth="12" strokeLinecap="butt" opacity="0.95" />
            );
          })}

          <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke={zColor} strokeWidth="3" strokeLinecap="round" className={`an-riskom__needle ${needleClass}`} />
          <circle cx={cx} cy={cy} r="6" fill="#fff" stroke={zColor} strokeWidth="3" />

          <path d={arcPath(cx, cy, r - 5, 200, 340)} fill="none" stroke="url(#an-riskom-shine)" strokeWidth="18" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      <div className="an-riskom__zone">
        <span className="an-riskom__zone-label">{zone.label}</span>
      </div>
    </div>
  );
}

