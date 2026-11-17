/**
 * Hostinger/hCDN often returns a real 404 for missing paths instead of
 * applying .htaccess SPA rewrites. Copy build/index.html into important
 * route folders so deep links resolve to the React app.
 *
 * Calculator folders also get a tiny redirect sibling is unnecessary — the SPA
 * shell is enough once `calculators/index.html` is uploaded with matching static/.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');
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
  'about',
  'contact',
  'offerings',
  'ourApp',
  'appdownload',
  'consulting-session',
  'book-session',
  'signup',
  'faqs',
  'partner-with-us',
  'corporate',
  'privacy-policy',
  'valuation',
];

for (const route of routes) {
  const dir = path.join(buildDir, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
  console.log(`spa-hostinger-fallback: ${route}/index.html`);
}

// Extra: lightweight redirect at calculators/redirect.html is unused.
// Share pages send users to /?tab=… when /calculators is still missing on CDN.
