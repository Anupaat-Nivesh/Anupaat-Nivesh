/**
 * Batch-discover factsheet PDF links for explorer funds (Direct Growth, major AMCs).
 *
 * Usage:
 *   node scripts/fetch-factsheets.mjs --limit 30
 *   node scripts/fetch-factsheets.mjs --only-missing --limit 120
 *
 * Optional (100 free queries/day): set GOOGLE_CSE_API_KEY + GOOGLE_CSE_CX in .env
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverFactsheetUrl } from '../api/services/factsheetDiscovery.mjs';
import {
  getAmcIndexPath,
  replaceAmcIndex,
  saveAmcIndex,
  upsertSchemeDocAndManagers,
} from '../api/services/amcDocumentIndexStore.mjs';
import { isExplorerScheme, isMajorAmcScheme, inferFundHouse } from '../api/services/mfSchemeUtils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function loadEnvFile() {
  for (const name of ['.env', '.env.local']) {
    const p = path.join(ROOT, name);
    if (!fs.existsSync(p)) continue;
    const raw = fs.readFileSync(p, 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i < 1) continue;
      const k = t.slice(0, i).trim();
      const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

function parseArgs(argv) {
  const out = { limit: 40, onlyMissing: false, delayMs: 2800 };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--only-missing') out.onlyMissing = true;
    else if (a === '--limit') out.limit = Number(argv[++i]) || out.limit;
    else if (a === '--delay') out.delayMs = Number(argv[++i]) || out.delayMs;
  }
  return out;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadIndex() {
  const p = getAmcIndexPath();
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return { generatedAt: null, amcDocumentPages: {}, schemes: {} };
  }
}

function isWeakFactsheetUrl(url, index) {
  if (!url) return true;
  const u = String(url).toLowerCase();
  if (!u.includes('.pdf')) return true;
  const pages = Object.values(index.amcDocumentPages || {}).map((v) => String(v).toLowerCase());
  return pages.some((page) => u === page || u.startsWith(`${page.replace(/\/$/, '')}/`));
}

async function loadExplorerSchemes() {
  const res = await fetch('https://api.mfapi.in/mf');
  if (!res.ok) throw new Error(`mfapi list ${res.status}`);
  const list = await res.json();
  return list
    .filter((row) => isExplorerScheme(row.schemeName) && isMajorAmcScheme(row.schemeName))
    .map((row) => ({
      schemeCode: String(row.schemeCode),
      schemeName: row.schemeName,
      fundHouse: inferFundHouse(row.schemeName),
    }));
}

async function main() {
  loadEnvFile();
  const args = parseArgs(process.argv);
  const index = loadIndex();
  const schemes = index.schemes || {};

  let targets = await loadExplorerSchemes();
  if (args.onlyMissing) {
    targets = targets.filter((t) => {
      const hit = schemes[t.schemeCode];
      return isWeakFactsheetUrl(hit?.factsheetUrl, index);
    });
  }

  targets = targets.slice(0, args.limit);

  // eslint-disable-next-line no-console
  console.log(`Discovering factsheets for ${targets.length} schemes (delay ${args.delayMs}ms)...`);

  let found = 0;
  let missed = 0;

  for (let i = 0; i < targets.length; i += 1) {
    const row = targets[i];
    const result = await discoverFactsheetUrl({
      schemeName: row.schemeName,
      fundHouse: row.fundHouse,
    });

    if (result.url) {
      upsertSchemeDocAndManagers({
        schemeCode: row.schemeCode,
        schemeName: row.schemeName,
        fundHouse: row.fundHouse,
        factsheetUrl: result.url,
        managers: schemes[row.schemeCode]?.managers || [],
        source: `factsheet-${result.source}`,
      });
      found += 1;
      // eslint-disable-next-line no-console
      console.log(`[${i + 1}/${targets.length}] ✓ ${row.schemeCode} ${result.url.slice(0, 90)}`);
    } else {
      missed += 1;
      // eslint-disable-next-line no-console
      console.log(`[${i + 1}/${targets.length}] — ${row.schemeName.slice(0, 70)}`);
    }

    if ((i + 1) % 10 === 0) saveAmcIndex();
    if (i < targets.length - 1) await sleep(args.delayMs);
  }

  saveAmcIndex();

  // eslint-disable-next-line no-console
  console.log(`Done. Found ${found}, missed ${missed}. Index: ${getAmcIndexPath()}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
