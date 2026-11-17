/**
 * Hostinger/hCDN often 404s SPA paths instead of rewriting to index.html.
 * Only mirror the calculator routes that must open from a cold load / share hop.
 * Other pages stay single-entry via / (no extra public route folders).
 *
 * build/ stays gitignored — this only shapes the local deploy artifact.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('spa-hostinger-fallback: build/index.html missing — run build first');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');

const routes = [
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
];

for (const route of routes) {
  const dir = path.join(buildDir, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
  console.log(`spa-hostinger-fallback: ${route}/index.html`);
}
