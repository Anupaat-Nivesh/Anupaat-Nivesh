import React from 'react';

function FireIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="fire-grad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B4A" />
          <stop offset="0.55" stopColor="#FE0101" />
          <stop offset="1" stopColor="#B91C1C" />
        </linearGradient>
      </defs>
      <path
        d="M24 6c2 8 8 10 8 18a8 8 0 1 1-16 0c0-6 4-9 6-14 1 4 2 6 2 6z"
        fill="url(#fire-grad)"
      />
      <path
        d="M24 22c1.5 4 4 6 4 10a4 4 0 1 1-8 0c0-3 2-4.5 3-8 0.5 2 1 3 1 3z"
        fill="#FFD4A8"
        opacity="0.9"
      />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="water-grad" x1="8" y1="20" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
      <path
        d="M6 28c4-10 10-16 18-16s14 6 18 16c-4 8-12 14-18 14S10 36 6 28z"
        fill="url(#water-grad)"
        opacity="0.35"
      />
      <path
        d="M8 30c5-8 11-12 16-12s11 4 16 12c-3.5 6-9 10-16 10S11.5 36 8 30z"
        fill="url(#water-grad)"
      />
      <path
        d="M14 32c2-4 5-6 10-6s8 2 10 6c-2 3.5-5.5 6-10 6s-8-2.5-10-6z"
        fill="#BAE6FD"
        opacity="0.85"
      />
    </svg>
  );
}

function EarthIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="earth-grad" x1="12" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADE80" />
          <stop offset="1" stopColor="#15803D" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="16" fill="url(#earth-grad)" opacity="0.25" />
      <circle cx="24" cy="24" r="14" stroke="url(#earth-grad)" strokeWidth="2.5" fill="none" />
      <path
        d="M14 26c3-6 7-9 10-9 4 0 7 4 10 9-3 5-7 8-10 8-3 0-7-3-10-8z"
        fill="url(#earth-grad)"
      />
      <path d="M18 30c2-3 4-4 6-4s4 1 6 4" stroke="#BBF7D0" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 22h4M32 22h4" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function AirIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M8 22c6-4 12-4 18 0s12 4 18 0"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 30c5-3 10-3 14 0s9 3 14 0"
        stroke="#64748B"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M14 14l4 4M30 14l-4 4" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MetalIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="metal-grad" x1="24" y1="8" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#CA8A04" />
        </linearGradient>
      </defs>
      <path
        d="M26 6l2 8h8l-6.5 5 2.5 8-6-4.5-6 4.5 2.5-8L14 14h8l2-8z"
        fill="url(#metal-grad)"
      />
      <circle cx="34" cy="34" r="6" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
    </svg>
  );
}

function SkyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="sky-grad" x1="10" y1="32" x2="38" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <path d="M8 32h32" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 32V20l6-8 6 5 6-10 6 13v12"
        stroke="url(#sky-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="36" cy="14" r="3" fill="#60A5FA" opacity="0.5" />
    </svg>
  );
}

const ICONS = {
  fire: FireIcon,
  water: WaterIcon,
  earth: EarthIcon,
  air: AirIcon,
  metal: MetalIcon,
  sky: SkyIcon,
};

export default function ElementalIcon({ element = 'fire', className = '', size = 48 }) {
  const Icon = ICONS[element] || FireIcon;
  return (
    <span className={`an-elemental-icon ${className}`} style={{ width: size, height: size }} role="img">
      <Icon />
    </span>
  );
}

export function elementFromBasketId(id) {
  const known = ['fire', 'water', 'earth', 'air', 'metal', 'sky'];
  if (known.includes(id)) return id;
  return 'fire';
}
