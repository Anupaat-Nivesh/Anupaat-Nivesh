/**
 * Drive folder name: FirstName[_Middle...]_LastName[_...]_PAN
 * - Words in the first-name field are joined with underscores.
 * - Words in the last-name field are appended the same way (optional field).
 * - Last-name tokens matching null / n.a. / na / - are skipped (treated as empty).
 */

const PLACEHOLDER_TOKEN = /^(null|n\/a|na|[-.]+)$/i;

function sanitizeNameToken(word) {
  const s = String(word).normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '');
  return s || '';
}

function tokenizeFirstName(str) {
  if (!str || !String(str).trim()) return [];
  return String(str)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(sanitizeNameToken)
    .filter(Boolean);
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
