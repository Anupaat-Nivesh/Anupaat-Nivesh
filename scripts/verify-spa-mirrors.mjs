/**
 * Cold-load check: every Hostinger SPA mirror must exist as build/<route>/index.html
 * and must look like the CRA shell (contains root div / main bundle reference).
 *
 * Usage: node scripts/verify-spa-mirrors.mjs
 * (run after npm run build)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'build');

// Keep list in sync with spa-hostinger-fallback.mjs
const ROUTES = [
  'home',
  'about',
  'whyanupaat',
  'offerings',
  'contact',
  'ourApp',
  'appdownload',
  'calculators',
  'calculators/child-education',
  'calculators/child-education-v2',
  'consulting-session',
  'booking',
  'book-session',
  'book-consultation',
  'payment',
  'payment-success',
  'payment-error',
  'signup',
  'onboarding',
  'valuation',
  'valuation/login',
  'market-deployment-intelligence',
  'faqs',
  'partner-with-us',
  'corporate',
  'privacy-policy',
  'terms-of-service',
  'loan-against-securities',
  'fixed-income-alternatives',
  'fixed-deposits',
  'bonds',
  'unlisted-stocks',
  'p2p-lending',
  'mutual-funds',
  'equity-basket',
  'tools',
  'screeners',
  'screeners/sector-rotation',
  'screeners/market-breadth',
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
  'ArthAI',
  'chatbot',
];

function assertMirror(route) {
  const file = path.join(buildDir, ...route.split('/'), 'index.html');
  if (!fs.existsSync(file)) {
    throw new Error(`Missing mirror: ${route}/index.html`);
  }
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="root"') && !html.includes("id='root'")) {
    throw new Error(`Mirror does not look like SPA shell: ${route}`);
  }
  return file;
}

function fetchStatus(port, urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: '127.0.0.1', port, path: urlPath, timeout: 5000 },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`timeout ${urlPath}`));
    });
  });
}

async function coldLoadTest(routes) {
  const port = 8765;
  const child = spawn(
    process.execPath,
    ['-e', `
      const http = require('http');
      const fs = require('fs');
      const path = require('path');
      const root = process.argv[1];
      const port = Number(process.argv[2]);
      http.createServer((req, res) => {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        if (urlPath.endsWith('/')) urlPath += 'index.html';
        else if (!path.extname(urlPath)) urlPath += '/index.html';
        const file = path.join(root, urlPath);
        if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
          res.writeHead(404); res.end('missing'); return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(file).pipe(res);
      }).listen(port, '127.0.0.1');
    `, buildDir, String(port)],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  await new Promise((r) => setTimeout(r, 400));

  const failures = [];
  try {
    for (const route of routes) {
      for (const suffix of ['', '/']) {
        const urlPath = `/${route}${suffix}`;
        const code = await fetchStatus(port, urlPath);
        if (code !== 200) {
          failures.push(`${urlPath} → ${code}`);
        }
      }
    }
    // Root must work
    const rootCode = await fetchStatus(port, '/');
    if (rootCode !== 200) failures.push(`/ → ${rootCode}`);
  } finally {
    child.kill('SIGTERM');
  }

  if (failures.length) {
    throw new Error(`Cold-load failures:\n${failures.join('\n')}`);
  }
}

if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error('verify-spa-mirrors: build/ missing — run npm run build first');
  process.exit(1);
}

console.log('verify-spa-mirrors: checking files…');
for (const route of ROUTES) {
  assertMirror(route);
}
if (!fs.existsSync(path.join(buildDir, '404.html'))) {
  throw new Error('Missing build/404.html');
}
console.log(`verify-spa-mirrors: ${ROUTES.length} mirrors OK on disk`);

console.log('verify-spa-mirrors: cold-load HTTP check (no SPA rewrite)…');
await coldLoadTest(ROUTES);
console.log('verify-spa-mirrors: all direct paths returned 200');
