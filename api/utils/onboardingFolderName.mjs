/**
 * Drive folder name: FirstName_LastNameParts_PAN
 * - First name: single segment (no spaces allowed in UI).
 * - Last name: optional; multiple words split with underscores.
 * - Last-name tokens matching null / n.a. / na / - are skipped (treated as empty).
 */

const PLACEHOLDER_TOKEN = /^(null|n\/a|na|[-.]+)$/i;

function sanitizeNameToken(word) {
  const s = String(word).normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
  return s || '';
}

function tokenizeFirstName(str) {
  if (!str || !String(str).trim()) return [];
  const t = sanitizeNameToken(String(str).trim());
  return t ? [t] : [];
}

function isPlaceholderToken(word) {
  return PLACEHOLDER_TOKEN.test(String(word).trim());
}

function tokenizeLastName(str) {
  if (!str || !String(str).trim()) return [];
  return String(str)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => !isPlaceholderToken(w))
    .map(sanitizeNameToken)
    .filter(Boolean);
}

export function buildOnboardingFolderName({ firstName, lastName, pan }) {
  const firstParts = tokenizeFirstName(firstName);
  const lastParts = tokenizeLastName(lastName);
  const panSafe = String(pan || '').trim().toUpperCase();

  if (!panSafe || firstParts.length === 0) {
    return '';
  }

  return [...firstParts, ...lastParts, panSafe].join('_');
}
