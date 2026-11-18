/**
 * Hostinger/hCDN often 404s SPA deep links instead of rewriting to index.html.
 *
 * Keep the build easy to upload: only two parent folders beyond CRA output —
 *   calculators/   (OG-injected share/cold-load pages + child routes)
 *   screeners/     (market-breadth + sector-rotation cold-load pages)
 *
 * Other client routes rely on public/.htaccess + ErrorDocument 404 → index.html.
 * Preferred short calculator share URLs remain /s/{shortId}.
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

const OG_TITLE = 'Investment Planner';
const OG_DESCRIPTION =
  'Free investment planners from Anupaat Nivesh — SIPs, goals, education, and more. Mobile-friendly educational calculators.';
const OG_IMAGE = 'https://www.anupaatnivesh.com/og/calculators/investment-planner.png';
const SITE = 'https://www.anupaatnivesh.com';

/** Only these two parents (plus their subfolders) are written into build/. */
const PARENT_FOLDERS = ['calculators', 'screeners'];

const CALCULATOR_OG_ROUTES = new Set([
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
]);

const SPA_MIRROR_ROUTES = [
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
  'screeners',
  'screeners/market-breadth',
  'screeners/sector-rotation',
];

/** Top-level dirs from older builds that used to mirror every SEO route — remove so deploy stays lean. */
const LEGACY_TOP_LEVEL_MIRRORS = [
  'home',
  'about',
  'offerings',
  'contact',
  'ourApp',
  'appdownload',
  'consulting-session',
  'booking',
  'book-session',
  'signup',
  'valuation',
  'faqs',
  'partner-with-us',
  'corporate',
  'privacy-policy',
  'loan-against-securities',
  'fixed-income-alternatives',
  'fixed-deposits',
  'bonds',
  'unlisted-stocks',
  'p2p-lending',
  'tools',
  'invest',
  'ArthAI',
  'chatbot',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceMeta(html, attrName, attrValue, content) {
  const re = new RegExp(
    `<meta[^>]+${attrName}=["']${escapeRegExp(attrValue)}["'][^>]*>`,
    'i'
  );
  const tag = `<meta ${attrName}="${attrValue}" content="${content}" />`;
  if (re.test(html)) {
    return html.replace(re, tag);
  }
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function injectInvestmentPlannerOg(html, canonicalPath) {
  let out = html;
  out = out.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${OG_TITLE} | Anupaat Nivesh</title>`
  );
  out = replaceMeta(out, 'name', 'description', OG_DESCRIPTION);
  out = replaceMeta(out, 'property', 'og:title', OG_TITLE);
  out = replaceMeta(out, 'property', 'og:description', OG_DESCRIPTION);
  out = replaceMeta(out, 'property', 'og:url', `${SITE}${canonicalPath}`);
  out = replaceMeta(out, 'property', 'og:image', OG_IMAGE);
  out = replaceMeta(out, 'name', 'twitter:title', OG_TITLE);
  out = replaceMeta(out, 'name', 'twitter:description', OG_DESCRIPTION);
  out = replaceMeta(out, 'name', 'twitter:image', OG_IMAGE);
  out = out.replace(
    /<link rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${SITE}${canonicalPath}" />`
  );

  if (!/property=["']og:image:width["']/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="Anupaat Nivesh — Investment Planner" />\n</head>`
    );
  }
  return out;
}

function rmDirIfExists(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Drop sprawling legacy mirrors from prior builds
for (const name of LEGACY_TOP_LEVEL_MIRRORS) {
  rmDirIfExists(path.join(buildDir, name));
}

// Rebuild only the two parent trees cleanly
for (const parent of PARENT_FOLDERS) {
  rmDirIfExists(path.join(buildDir, parent));
}

for (const route of SPA_MIRROR_ROUTES) {
  const dir = path.join(buildDir, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  const canonical = `/${route}`;
  const html = CALCULATOR_OG_ROUTES.has(route)
    ? injectInvestmentPlannerOg(indexHtml, canonical)
    : indexHtml;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  const note = CALCULATOR_OG_ROUTES.has(route) ? ' (Investment Planner OG)' : '';
  console.log(`spa-hostinger-fallback: ${route}/index.html${note}`);
}

// Hostinger custom 404 panel often ignores ErrorDocument; a real 404.html helps other SPA paths.
fs.writeFileSync(path.join(buildDir, '404.html'), indexHtml);
console.log('spa-hostinger-fallback: 404.html (SPA fallback)');
console.log(
  'spa-hostinger-fallback: Hostinger extras → static/ + calculators/ + screeners/ (+ 404.html)'
);
