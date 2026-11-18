/**
 * Hostinger/hCDN returns its own 404 for missing paths BEFORE .htaccess runs.
 * In-app React Router links work; cold/direct/shared URLs 404 unless a physical
 * `build/<route>/index.html` exists.
 *
 * This script copies build/index.html into every public SPA route folder.
 * Calculator routes also get Investment Planner Open Graph tags.
 *
 * Preferred short calculator share URLs remain /s/{shortId}.
 *
 * Deploy: upload the full contents of build/ (not a subset). Physical route
 * folders are required for direct links on Hostinger — .htaccess alone is not enough.
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

const CALCULATOR_OG_ROUTES = new Set([
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
]);

/**
 * Every static public path from App.js that must cold-load on Hostinger.
 * Keep in sync when adding routes. Dynamic segments (fund/:code) still need
 * Apache rewrite / panel 404 → index.html if hit directly.
 */
const SPA_MIRROR_ROUTES = [
  // Core
  'home',
  'about',
  'whyanupaat',
  'offerings',
  'contact',
  'ourApp',
  'appdownload',
  // Calculators (+ OG)
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
  // Booking / payments
  'consulting-session',
  'booking',
  'book-session',
  'book-consultation',
  'payment',
  'payment-success',
  'payment-error',
  'signup',
  'onboarding',
  // Valuation / compass
  'valuation',
  'valuation/login',
  'market-deployment-intelligence',
  // Company
  'faqs',
  'partner-with-us',
  'corporate',
  'privacy-policy',
  // Offerings
  'loan-against-securities',
  'fixed-income-alternatives',
  'fixed-deposits',
  'bonds',
  'unlisted-stocks',
  'p2p-lending',
  'mutual-funds',
  'equity-basket',
  // Tools / screeners
  'tools',
  'screeners',
  'screeners/sector-rotation',
  'screeners/market-breadth',
  // Invest / baskets
  'invest',
  'invest/baskets',
  'invest/funds',
  'invest/risk-profile',
  'invest/goals',
  'invest/basket/fire',
  'invest/basket/water',
  'invest/basket/earth',
  'invest/dashboard',
  'invest/payment-success',
  'baskets',
  'baskets/fire-s',
  'baskets/water',
  'baskets/earth',
  // Standalone
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

const parents = new Set();

for (const route of SPA_MIRROR_ROUTES) {
  const dir = path.join(buildDir, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  const canonical = `/${route}`;
  const html = CALCULATOR_OG_ROUTES.has(route)
    ? injectInvestmentPlannerOg(indexHtml, canonical)
    : indexHtml;
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  parents.add(route.split('/')[0]);
  const note = CALCULATOR_OG_ROUTES.has(route) ? ' (Investment Planner OG)' : '';
  console.log(`spa-hostinger-fallback: ${route}/index.html${note}`);
}

// Hostinger panel custom 404 often wins over ErrorDocument; keep a real 404.html anyway.
fs.writeFileSync(path.join(buildDir, '404.html'), indexHtml);
console.log('spa-hostinger-fallback: 404.html (SPA fallback)');
console.log(
  `spa-hostinger-fallback: ${SPA_MIRROR_ROUTES.length} routes under ${parents.size} top-level folders — upload full build/`
);
