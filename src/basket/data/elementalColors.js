/** Approved elemental basket colors — Fire Red, Water Blue, Earth Gold. */
export const ELEMENTAL_COLORS = {
  fire: {
    id: 'fire',
    label: 'Fire',
    name: 'Red',
    primary: '#FE0101',
    cssVar: '--basket-fire',
  },
  water: {
    id: 'water',
    label: 'Water',
    name: 'Blue',
    primary: '#5B8CFF',
    cssVar: '--basket-water',
  },
  earth: {
    id: 'earth',
    label: 'Earth',
    name: 'Gold',
    primary: '#C9A227',
    cssVar: '--basket-earth',
  },
};

export function getElementColor(element) {
  return ELEMENTAL_COLORS[element]?.primary ?? ELEMENTAL_COLORS.fire.primary;
}

export function hexToRgba(hex, alpha = 1) {
  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((c) => c + c)
          .join('')
      : normalized;
  const int = parseInt(full, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getElementRgba(element, alpha = 1) {
  return hexToRgba(getElementColor(element), alpha);
}

/** Donut / bar palette derived from the basket element color. */
export function getElementChartPalette(element, count = 4) {
  const base = getElementColor(element);
  const opacities = [1, 0.72, 0.48, 0.32, 0.22];
  return Array.from({ length: count }, (_, i) => hexToRgba(base, opacities[i] ?? 0.18));
}

/** Parse approved risk score range strings (e.g. "8–10", "Below 5"). */
export function parseRiskScoreRange(range) {
  if (!range) return null;
  const text = String(range).trim();
  if (/below/i.test(text)) {
    return { min: 0, max: 5, display: text, below: true };
  }
  const parts = text.replace(/[–—]/g, '-').split('-').map((n) => Number(n.trim()));
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
    return { min: parts[0], max: parts[1], display: text };
  }
  return null;
}
