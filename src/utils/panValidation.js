/**
 * Must stay in sync with api/utils/panValidation.mjs
 */

const PAN_INDIAN =
  /^[A-Z]{3}[PCHFATBLJG][A-Z][0-9]{4}[A-Z]$/;

export function isValidIndianPan(pan) {
  const p = String(pan || '')
    .trim()
    .toUpperCase();
  return PAN_INDIAN.test(p);
}

export const INVALID_PAN_MESSAGE =
  'Enter a valid 10-character PAN as on your income tax PAN card.';
