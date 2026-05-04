/**
 * Keep in sync with api/utils/panValidation.mjs
 */

const VALID_FOURTH_CHARS = new Set(['P', 'C', 'H', 'F', 'A', 'T', 'B', 'L', 'J', 'G']);

export const TAX_STATUS_TO_PAN_FOURTH = {
  individual: 'P',
  minor: 'P',
  'nri-nre': 'P',
  'nri-nro': 'P',
  huf: 'H',
  firm: 'F',
  company: 'C',
  trust: 'T',
  aop: 'A',
  boi: 'B',
  'local-authority': 'L',
  government: 'G',
};

export function validatePanFormat(pan) {
  const p = String(pan || '').trim().toUpperCase();
  if (p.length !== 10) {
    return { ok: false, message: 'PAN must be exactly 10 characters' };
  }
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(p)) {
    return {
      ok: false,
      message: 'PAN must be AAAAA9999A (5 letters, 4 digits, 1 letter)',
    };
  }
  const fourth = p[3];
  if (!VALID_FOURTH_CHARS.has(fourth)) {
    return {
      ok: false,
      message:
        'PAN 4th character must be valid (e.g. P for individual, C company, H HUF)',
    };
  }
  return { ok: true, normalized: p };
}

export function validatePanForTaxStatus(pan, taxStatus) {
  const fmt = validatePanFormat(pan);
  if (!fmt.ok) return fmt;

  const expected = taxStatus && TAX_STATUS_TO_PAN_FOURTH[taxStatus];
  if (!expected) {
    return fmt;
  }

  if (fmt.normalized[3] !== expected) {
    return {
      ok: false,
      message: `For selected tax status, PAN's 4th letter must be ${expected}`,
    };
  }
  return fmt;
}
