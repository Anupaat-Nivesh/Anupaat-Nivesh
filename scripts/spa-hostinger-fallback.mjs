/**
 * Hostinger/hCDN often 404s SPA paths instead of rewriting to index.html.
 * Mirror calculator routes so cold loads / shared links resolve.
 *
 * Also inject Investment Planner Open Graph tags into those copies so
 * WhatsApp previews work for URLs like /calculators?tab=education-v2
 * (crawlers do not run React JS).
 *
 * Preferred short share URLs remain /s/{shortId} (static OG HTML).
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
  // Insert before </head> if missing
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

  // Ensure image dimensions for WhatsApp
  if (!/property=["']og:image:width["']/i.test(out)) {
    out = out.replace(
      /<\/head>/i,
      `  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="Anupaat Nivesh — Investment Planner" />\n</head>`
    );
  }
  return out;
}

const routes = [
  { route: 'calculators', canonical: '/calculators' },
  { route: 'calculators/child-education', canonical: '/calculators/child-education' },
  { route: 'calculators/child-education-v2', canonical: '/calculators/child-education-v2' },
];

for (const { route, canonical } of routes) {
  const dir = path.join(buildDir, ...route.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  const html = injectInvestmentPlannerOg(indexHtml, canonical);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`spa-hostinger-fallback: ${route}/index.html (Investment Planner OG)`);
}
