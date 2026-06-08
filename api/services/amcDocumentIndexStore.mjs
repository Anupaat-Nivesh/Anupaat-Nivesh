import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const INDEX_PATH = path.resolve(__dirname, '../data/amc-document-index.json');

function normalizeText(v = '') {
  return String(v || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\b(mutual fund|asset management|amc|limited|ltd|company|fund)\b/g, ' ')
    .replace(/\b(direct|regular|growth|idcw|dividend|plan|option)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeRead() {
  try {
    const raw = fs.readFileSync(INDEX_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // ignore and use defaults
  }
  return { generatedAt: null, amcDocumentPages: {}, schemes: {} };
}

function ensureDir() {
  const dir = path.dirname(INDEX_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let memory = safeRead();

export function getAmcIndexPath() {
  return INDEX_PATH;
}

export function getAmcDocumentPages() {
  return memory.amcDocumentPages || {};
}

export function getAmcDocumentPageByFundHouse(fundHouse) {
  const pages = getAmcDocumentPages();
  const fh = normalizeText(fundHouse);
  if (!fh) return null;
  const keys = Object.keys(pages);
  const hitKey = keys.find((k) => fh.includes(k) || k.includes(fh));
  return hitKey ? pages[hitKey] : null;
}

export function findSchemeDocAndManagers({ schemeName, schemeCode, fundHouse }) {
  const schemes = memory.schemes || {};
  const byCode = schemeCode ? schemes[String(schemeCode)] : null;
  if (byCode) return byCode;

  const targetName = normalizeText(schemeName);
  const targetHouse = normalizeText(fundHouse);
  if (!targetName) return null;

  const values = Object.values(schemes);
  const hit = values.find((row) => {
    const rowName = normalizeText(row?.schemeName);
    if (!rowName) return false;
    const nameMatch = rowName.includes(targetName) || targetName.includes(rowName);
    if (!nameMatch) return false;
    if (!targetHouse) return true;
    const rowHouse = normalizeText(row?.fundHouse);
    return !rowHouse || rowHouse === targetHouse || rowHouse.includes(targetHouse);
  });
  return hit || null;
}

export function upsertSchemeDocAndManagers({
  schemeCode,
  schemeName,
  fundHouse,
  factsheetUrl,
  managers = [],
  source = 'runtime',
}) {
  const code = String(schemeCode || '').trim();
  if (!code) return;
  const existing = memory.schemes?.[code] || {};
  memory.schemes = memory.schemes || {};
  memory.schemes[code] = {
    ...existing,
    schemeCode: code,
    schemeName: schemeName || existing.schemeName || '',
    fundHouse: fundHouse || existing.fundHouse || '',
    factsheetUrl: factsheetUrl || existing.factsheetUrl || null,
    managers: Array.isArray(managers) && managers.length ? managers : existing.managers || [],
    source,
    updatedAt: new Date().toISOString(),
  };
}

export function saveAmcIndex() {
  ensureDir();
  memory.generatedAt = new Date().toISOString();
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(memory, null, 2)}\n`, 'utf8');
}

export function replaceAmcIndex(nextIndex) {
  memory = {
    generatedAt: nextIndex?.generatedAt || new Date().toISOString(),
    amcDocumentPages: nextIndex?.amcDocumentPages || {},
    schemes: nextIndex?.schemes || {},
  };
  saveAmcIndex();
}
