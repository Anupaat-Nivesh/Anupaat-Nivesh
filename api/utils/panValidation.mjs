/**
 * Indian PAN: 10 chars — LLLLTNNNNL (L=letter, T=holder type, N=digit).
 * 4th character (holder): P Individual, C Company, H HUF, F Firm/LLP, A AOP,
 * T Trust, B BOI, L Local Authority, J Artificial juridical person, G Government.
 * @see Income Tax India PAN structure
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
