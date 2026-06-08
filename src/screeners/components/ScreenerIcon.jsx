import React from 'react';

const paths = {
  'chart-up': (
    <path
      d="M6 28V18l6-6 5 4 7-9 4 5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  'chart-down': (
    <path
      d="M6 20l6 6 5-5 7 8 4-6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  pulse: (
    <path
      d="M6 20h4l3-10 4 14 3-8h5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  peak: (
    <path
      d="M8 26V14l6 6 4-8 6 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  dividend: (
    <>
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M20 16v8M16 20h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bonus: (
    <path
      d="M12 10h8v6h-6l-2 10-2-10H6v-6h6l2-10 2 10z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  split: (
  <>
    <path d="M10 8v16M22 8v16M10 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </>
  ),
  flow: (
    <path
      d="M8 20c4-8 8-8 12 0M8 12c4 8 8 8 12 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
  star: (
    <path
      d="M16 8l2.5 5 5.5.8-4 3.9 1 5.5L16 20l-5 4.2 1-5.5-4-3.9 5.5-.8L16 8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  cap: (
    <rect x="8" y="10" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
  ),
  tax: (
    <path
      d="M10 10h12v14H10V10zM14 6h4v4h-4V6z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  debt: (
    <path
      d="M8 22V12l8-4 8 4v10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  ),
  hybrid: (
    <circle cx="12" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
  ),
  sip: (
    <path
      d="M10 22V10l6-4 6 4v12M10 14h12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  ),
};

const tones = {
  green: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  red: { bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' },
  purple: { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
  gold: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  blue: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  brand: { bg: 'rgba(254,1,1,0.08)', color: '#FE0101', border: 'rgba(254,1,1,0.2)' },
  teal: { bg: '#ecfdf5', color: '#0d9488', border: '#99f6e4' },
};

export default function ScreenerIcon({ name = 'chart-up', tone = 'purple' }) {
  const t = tones[tone] || tones.purple;
  return (
    <span className="scr-icon" style={{ background: t.bg, color: t.color, borderColor: t.border }}>
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        {paths[name] || paths['chart-up']}
      </svg>
    </span>
  );
}

export function iconToneForId(id) {
  if (id.includes('loser') || id.includes('down')) return 'red';
  if (id.includes('dividend') || id.includes('gold')) return 'gold';
  if (id.includes('volume') || id.includes('pulse')) return 'teal';
  if (id.includes('gain') || id.includes('high') || id.includes('sip')) return 'green';
  if (id.includes('fii') || id.includes('flow')) return 'blue';
  if (id.includes('mf') || id.includes('fund') || id.includes('rated')) return 'brand';
  return 'purple';
}
