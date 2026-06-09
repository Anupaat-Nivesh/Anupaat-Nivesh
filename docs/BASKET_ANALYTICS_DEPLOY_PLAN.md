# Mutual Fund Baskets — Deployment & Operations Plan

**Anupaat Nivesh · Mutual Fund Baskets (FIRE · WATER · EARTH)**  
**Last updated:** May 2026  
**Status:** Phase 1 ready — GitHub-backed JSON, no Supabase required  
**Current dev branch:** `feature/basket` → merge into `main` before go-live

This is the single source of truth for go-live, daily operations, and post-launch changes.

**→ First go-live:** **Section 0** (push `feature/basket` → `main` + Vercel + Hostinger).  
**→ Before every later deploy:** **Section 7** checklist + Section 4.7 refresh commands.

---

## 0. Go-live runbook — push `feature/basket` to `main` + production config

Complete these steps **in order**. Check off each box before moving on.

**Repo:** `https://github.com/Anupaat-Nivesh/Anupaat-Nivesh.git`  
**Working branch:** `feature/basket` (all basket + screeners + invest work lives here)  
**Production branch:** `main` (Vercel + GitHub Actions should deploy from here)

**Deploy split reminder:**
- **Vercel** = API (`server.mjs`, `/api/baskets/*`, payments, screeners)
- **Hostinger** = React static site (`build/` folder)
- **GitHub Actions** = daily NAV refresh → opens PR to merge `basketAnalytics.json` into `main`

---

### Step 0 — Pre-flight on your machine (local)

**Where:** Terminal, project root `/Users/gouravchugh/projects/an_Website/an-basket`

```bash
cd /Users/gouravchugh/projects/an_Website/an-basket
git checkout feature/basket
git fetch origin
```

- [ ] You are on branch `feature/basket`
- [ ] `npm start` compiles without errors (already running is OK)
- [ ] API server works:

```bash
# Terminal A (if not already running)
npm run server
# → http://localhost:8000
```

- [ ] Refresh basket analytics and confirm all three baskets compute:

```bash
npm run refresh-baskets
```

Expected output: success for `fire`, `water`, `earth` (no fatal errors).

- [ ] API smoke test:

```bash
curl -s http://localhost:8000/api/health
curl -s http://localhost:8000/api/baskets/fire/analytics | head -c 300
curl -s http://localhost:8000/api/baskets/water/analytics | head -c 300
curl -s http://localhost:8000/api/baskets/earth/analytics | head -c 300
```

- [ ] Production build succeeds:

```bash
npm run build
```

- [ ] Quick UI checks in browser (`http://localhost:3000`):
  - [ ] `/invest/baskets` — landing loads, 3 cards, compare table
  - [ ] `/invest/basket/fire` — KPIs + chart (not all dashes)
  - [ ] `/mutual-funds` — redirects to `/invest/baskets`
  - [ ] Unlock form visible; fund names hidden when locked (incognito)

**Stop if any step fails** — fix locally before committing.

---

### Step 1 — Review what will be committed

```bash
git status
git diff --stat
```

**Must be included (basket go-live):**

| Path | Why |
|------|-----|
| `api/data/basketMaster.json` | Holdings for analytics engine |
| `api/data/basketAnalytics.json` | Live NAV metrics served by API |
| `.github/workflows/refresh-basket-analytics.yml` | Daily refresh |
| `api/routes/baskets.mjs` + `api/services/basketAnalytics*` | Basket API |
| `server.mjs`, `package.json`, `vercel.json` | API wiring |
| `src/basket/**` | Mutual fund baskets UI |
| `src/App.js`, `Navbar.jsx`, `Footer.jsx`, `Offerings.jsx`, `Home.jsx` | Routes + nav |
| `docs/BASKET_ANALYTICS_DEPLOY_PLAN.md` | This plan |

**Also on this branch (invest/screeners bundle):** `src/screeners/`, extra `api/routes/*`, `scripts/` — commit together if you want one release.

**Do NOT commit:**

| File | Reason |
|------|--------|
| `.env`, `.env.local` | Secrets (gitignored) |
| `.env.production` | Live keys — build locally only, never push |
| `node_modules/` | gitignored |

- [ ] Reviewed `git status` — no accidental secrets

---

### Step 2 — Stage and commit on `feature/basket`

```bash
git add api/data/basketMaster.json api/data/basketAnalytics.json
git add .github/workflows/refresh-basket-analytics.yml
git add api/routes/baskets.mjs api/services/basketAnalyticsEngine.mjs api/services/basketAnalyticsStore.mjs
git add server.mjs package.json vercel.json
git add src/basket/ src/App.js
git add src/components/navbar/Navbar.jsx
git add src/containers/footer/Footer.jsx
git add src/containers/offerings/Offerings.jsx
git add src/containers/home/Home.jsx
git add src/components/chatbot/ragService.js src/components/chatbot/ChatBot.jsx
git add src/pages/PaymentSuccess/PaymentSuccess.jsx src/pages/ThankYou/ThankYou.jsx
git add src/containers/tools/Tools.jsx
git add docs/BASKET_ANALYTICS_DEPLOY_PLAN.md

# Screeners + invest API bundle (same branch release)
git add api/routes/ api/services/ scripts/
git add src/screeners/ src/shared/ src/data/
git add .env.example .env.production.example

# Catch any remaining intentional changes
git status
# If OK, also: git add -u   (stages modifications + deletions, not new folders you skipped)
```

**Commit:**

```bash
git commit -m "$(cat <<'EOF'
feat: mutual fund baskets with live NAV analytics and GitHub daily refresh

- FIRE/WATER/EARTH baskets at /invest/baskets with synthetic NAV from mfapi.in
- Legacy /mutual-funds and /equity-basket redirect to baskets
- GitHub Action refreshes basketAnalytics.json nightly
EOF
)"
```

- [ ] `git commit` succeeded (no hook failures)
- [ ] If pre-commit hook modified files, fix and make a **new** commit (do not amend unless you created the prior commit and it was not pushed)

---

### Step 3 — Push `feature/basket` to GitHub

```bash
git push -u origin feature/basket
```

- [ ] Push succeeded
- [ ] On GitHub: branch `feature/basket` visible with your new commit

---

### Step 4 — Merge into `main`

Pick **one** path.

#### Option A — Pull request (recommended)

**Where:** GitHub website or CLI

```bash
gh pr create --base main --head feature/basket --title "Mutual fund baskets + live NAV analytics" --body "$(cat <<'EOF'
## Summary
- Mutual fund baskets (FIRE · WATER · EARTH) at /invest/baskets
- Synthetic basket NAV from mfapi.in, stored in api/data/basketAnalytics.json
- Daily GitHub Action refresh; legacy /mutual-funds and /equity-basket redirect

## Test plan
- [ ] Vercel deploy green
- [ ] GET /api/baskets/fire/analytics returns NAV
- [ ] Hostinger build with REACT_APP_API_BASE_URL
- [ ] /invest/baskets live on www
- [ ] Razorpay unlock test
EOF
)"
```

Then:
- [ ] Review PR diff on GitHub (spot-check `basketAnalytics.json` values)
- [ ] Merge PR → **Merge commit** or **Squash** (team preference)
- [ ] Delete `feature/basket` branch after merge (optional)

#### Option B — Direct merge locally

```bash
git fetch origin
git checkout main
git pull origin main
git merge feature/basket
# Resolve conflicts if any, then:
git push origin main
```

- [ ] `main` on GitHub has the basket commit(s)

**After merge:** Vercel should auto-deploy if the project is linked to `main`. Watch the Vercel dashboard.

---

### Step 5 — GitHub Actions (one-time + first run)

**Where:** GitHub → `Anupaat-Nivesh/Anupaat-Nivesh` → **Settings**

1. **Organization settings (required first — repo checkbox is grayed out until this is on)**  
   **Where:** https://github.com/organizations/Anupaat-Nivesh/settings/actions  
   - Workflow permissions: **Read and write permissions** → Save  
   - Enable: **Allow GitHub Actions to create and approve pull requests** → Save  

2. **Repository → Settings → Actions → General**  
   - Workflow permissions: **Read and write permissions** → Save  
   - Enable: **Allow GitHub Actions to create and approve pull requests** → Save  
   - If the PR checkbox is grayed out, the org admin must complete step 1 first.

3. **Actions** tab → **Refresh basket analytics** → **Run workflow** → Run on `main`

4. Wait for green check (~2–5 min)

- [ ] Workflow succeeded
- [ ] If NAV changed: PR opened titled `chore: refresh basket NAV analytics` (branch `chore/basket-nav-refresh`)
- [ ] Merge that PR into `main` (or enable **auto-merge** for this PR type — see below)
- [ ] Vercel redeployed after merge (if auto-deploy on push is on)

**If refresh succeeds but PR step fails** with `GitHub Actions is not permitted to create or approve pull requests`: the NAV JSON was still pushed to branch `chore/basket-nav-refresh`. Open the PR manually:  
https://github.com/Anupaat-Nivesh/Anupaat-Nivesh/compare/main...chore/basket-nav-refresh?expand=1  
Then fix steps 1–2 above and re-run the workflow.

**Why a PR, not a direct push?** `main` is branch-protected (“changes must be made through a pull request”). The workflow uses `peter-evans/create-pull-request` instead of pushing to `main`. A failed run with `GH006: Protected branch update failed` means the refresh worked but the old workflow tried to push directly — merge this workflow fix first, then re-run.

**Step 5b — Auto-approve & merge (required for hands-off daily NAV updates)**

`main` requires **2 human reviews** and blocks merges from the same actor that opened the PR. The refresh bot cannot satisfy that alone. Use the companion workflow `.github/workflows/auto-merge-basket-nav-refresh.yml` plus one admin PAT:

1. **Create a fine-grained PAT** (repo admin account, e.g. your GitHub user)  
   - Repository access: `Anupaat-Nivesh` only  
   - Permissions: **Contents** = Read and write, **Pull requests** = Read and write  
   - Copy the token once.

2. **Repository → Settings → Secrets and variables → Actions → New repository secret**  
   - Name: `BASKET_REFRESH_GH_TOKEN`  
   - Value: the PAT above  

3. **Settings → General → Pull Requests**  
   - [ ] **Allow auto-merge** (optional; admin merge workflow does not require this)

4. **Settings → Branches → `main` protection rule** (optional but recommended)  
   Under **Bypass list**, add the GitHub user who owns `BASKET_REFRESH_GH_TOKEN` so admin merge is reliable.  
   Keep **2 required reviews** for normal human PRs — the auto-merge workflow uses `gh pr merge --admin` only for `chore/basket-nav-refresh` PRs that touch **only** `api/data/basketAnalytics.json`.

**Nightly flow after setup:**  
`Refresh basket analytics` opens PR → `Auto-merge basket NAV refresh PR` approves (as PAT user) → waits for Vercel/checks → squash-merges to `main`.

**Schedule (already in YAML):** daily `30 17 * * *` UTC ≈ 11:00 PM IST.

**Secrets summary**

| Secret | Required when | Scopes / notes |
|--------|----------------|----------------|
| *(none)* | Org allows `GITHUB_TOKEN` to open PRs | Default refresh workflow |
| `BASKET_REFRESH_GH_TOKEN` | **Recommended always** | Admin PAT: contents + pull-requests write; used to open PR (if needed), approve, and admin-merge |

---

### Step 6 — Vercel configuration (API backend)

**Where:** [vercel.com](https://vercel.com) → your project (e.g. `anupaat-nivesh`) → **Settings → Environment Variables**

Add or verify for **Production** (and **Preview** if you test preview URLs):

| Variable | Value | Notes |
|----------|--------|-------|
| `CORS_ALLOWED_ORIGINS` | `https://www.anupaatnivesh.com,https://anupaatnivesh.com` | Exact browser origins; add Hostinger staging URL while testing |
| `RAZORPAY_KEY_ID` | `rzp_live_...` | Must match frontend key |
| `RAZORPAY_KEY_SECRET` | `...` | Server only — never in React bundle |
| `RAZORPAY_WEBHOOK_SECRET` | from Razorpay dashboard | If webhooks already used |

**Phase 1 — leave empty / unset:**

| Variable | Notes |
|----------|-------|
| `SUPABASE_URL` | Not needed |
| `SUPABASE_SERVICE_ROLE_KEY` | Not needed |
| `CRON_SECRET` | Not needed (GitHub Action is authoritative) |

**Optional (basket admin refresh endpoint):**

| Variable | Notes |
|----------|-------|
| `BASKET_ADMIN_SECRET` | For `POST /api/baskets/refresh` manual trigger |

**After saving env vars:**

1. **Deployments** → latest → **⋯** → **Redeploy** (required for env changes)
2. [ ] Redeploy finished successfully

**Smoke test** (replace `YOUR-VERCEL-ORIGIN`):

```bash
export VERCEL_ORIGIN="https://anupaat-nivesh.vercel.app"

curl -sS "${VERCEL_ORIGIN}/api/health"
curl -sS "${VERCEL_ORIGIN}/api/baskets/fire/analytics" | head -c 400
curl -sS "${VERCEL_ORIGIN}/api/baskets/water/analytics" | head -c 400
curl -sS "${VERCEL_ORIGIN}/api/baskets/earth/analytics" | head -c 400
```

- [ ] All return JSON (not HTML login page)
- [ ] `currentNav` and `return1y` present for each basket

**CORS preflight** (from your machine):

```bash
curl -sI -X OPTIONS "${VERCEL_ORIGIN}/api/baskets/fire/analytics" \
  -H "Origin: https://www.anupaatnivesh.com" \
  -H "Access-Control-Request-Method: GET" | grep -i access-control
```

- [ ] `access-control-allow-origin` includes your Hostinger origin

**Vercel Cron note:** `vercel.json` has a cron for `/api/baskets/cron/refresh`. It will 401 without `CRON_SECRET` — safe to ignore for Phase 1. Optional: remove the `crons` block in a follow-up commit to reduce log noise.

---

### Step 7 — Hostinger configuration (React frontend)

**Where:** Your Mac — project root. Upload target: Hostinger file manager / FTP (same as today).

#### 7.1 Create production env file (local only)

```bash
cp .env.production.hostinger.example .env.production
```

Edit `.env.production` — **minimum for baskets:**

```bash
NODE_ENV=production
CI=false

# Vercel origin ONLY — no trailing slash, no /api
REACT_APP_API_BASE_URL=https://anupaat-nivesh.vercel.app

REACT_APP_BASE_URL=https://www.anupaatnivesh.com

# Razorpay LIVE key (must match Vercel RAZORPAY_KEY_ID)
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Copy remaining REACT_APP_* from your current production values:
# EmailJS, Calendly, WhatsApp, consulting prices, etc.
```

- [ ] `REACT_APP_API_BASE_URL` does **not** end with `/api`
- [ ] Razorpay key matches Vercel server key (same Razorpay account)
- [ ] `.env.production` is **not** committed to git

#### 7.2 Build static files

```bash
npm run build
```

- [ ] `build/` folder created without errors
- [ ] `build/static/js/main.*.js` exists

#### 7.3 Upload to Hostinger

**Where:** Hostinger hPanel → File Manager (or FTP client)

1. Backup current `public_html` (or site root) — zip download optional
2. Upload **contents** of local `build/` folder into the site root (overwrite `index.html`, `static/`, etc.)
3. Do **not** upload `node_modules/`, `src/`, or `.env.production`

- [ ] Upload complete
- [ ] `index.html` timestamp updated on server

#### 7.4 Clear cache

- [ ] Hard refresh browser: **Cmd+Shift+R** (Mac) / **Ctrl+Shift+R** (Windows)
- [ ] If Hostinger has CDN/cache plugin, purge cache once

---

### Step 8 — Production verification (live site)

**Where:** Browser + DevTools → Network tab

| # | URL | Pass |
|---|-----|------|
| 1 | `https://www.anupaatnivesh.com/invest/baskets` | Landing, 3 cards, compare table |
| 2 | `https://www.anupaatnivesh.com/invest/basket/fire` | KPIs populated |
| 3 | `https://www.anupaatnivesh.com/mutual-funds` | Redirects to baskets |
| 4 | `https://www.anupaatnivesh.com/equity-basket` | Redirects to baskets |
| 5 | Incognito basket detail | No fund names when locked |
| 6 | Network → `.../api/baskets/fire/analytics` | Status 200, not CORS error |
| 7 | Unlock flow | Razorpay opens (test/live per your keys) |
| 8 | Navbar | “Mutual fund baskets” link works |

**If API calls fail:**

| Symptom | Fix |
|---------|-----|
| CORS error | Add exact `https://www.anupaatnivesh.com` to Vercel `CORS_ALLOWED_ORIGINS`, redeploy |
| 404 on `/api/api/...` | Fix `REACT_APP_API_BASE_URL` — remove `/api` suffix, rebuild Hostinger |
| KPIs all `—` | Confirm `basketAnalytics.json` on `main`; Vercel redeployed after merge |
| Old mutual-funds page | Old Hostinger build — re-upload `build/` |

---

### Step 9 — Razorpay (if first basket payments on live)

**Where:** [dashboard.razorpay.com](https://dashboard.razorpay.com)

- [ ] Live mode keys in Vercel + `.env.production` (not test keys)
- [ ] Webhook URL points to `https://YOUR-VERCEL-ORIGIN/api/payments/webhook` (if used)
- [ ] Test ₹1 unlock on staging origin first if possible

---

### Step 10 — Post go-live monitoring (first 48 hours)

- [ ] Next day after 11 PM IST: GitHub Action ran (Actions tab)
- [ ] If Action committed JSON: Vercel redeployed
- [ ] Spot-check NAV on `/invest/basket/fire` vs previous day
- [ ] Watch Razorpay dashboard for successful basket payments

---

### Step 11 — Rollback (if something breaks)

**Frontend only (Hostinger):** Re-upload previous `build/` backup zip.

**API (Vercel):** Deployments → previous deployment → **Promote to Production**.

**Data:** `git revert` the bad commit on `main` or restore prior `api/data/basketAnalytics.json` from git history, push, wait for Vercel redeploy.

---

### Quick command reference (copy-paste)

```bash
# Full local pre-flight
npm run refresh-baskets && npm run build

# Push branch
git push -u origin feature/basket

# After merge, verify API
curl -s https://anupaat-nivesh.vercel.app/api/baskets/fire/analytics | head -c 300

# Hostinger build
cp .env.production.hostinger.example .env.production
# edit .env.production, then:
npm run build
```

---

## 1. Product & architecture overview

### What we sell (only product)

| Basket | ID | Risk | Public name |
|--------|-----|------|-------------|
| FIRE | `fire` | Aggressive | Fast-track growth sleeve |
| WATER | `water` | Moderate | Balanced glide path |
| EARTH | `earth` | Conservative | Capital preservation sleeve |

**Customer-facing label:** **Mutual fund baskets** (`BASKET_PRODUCT_NAME` in `src/basket/data/baskets.js`).

**Unlock price:** ₹4,999 one-time per basket (Razorpay).

**Not sold / removed from nav:**
- Legacy `/mutual-funds` marketing page → redirects to `/invest/baskets`
- Legacy `/equity-basket` page → redirects to `/invest/baskets`
- MF fund explorer (`/invest/funds`) remains for internal/screeners deep-links — not promoted in main nav

### Split deploy (production model)

| Layer | Host | Role |
|-------|------|------|
| React UI | **Hostinger** | Static `build/` — basket landing, detail, unlock, homepage promo |
| Express API | **Vercel** | `/api/baskets/*`, payments, mutual funds API, screeners |
| Analytics data | **GitHub repo** | `api/data/basketAnalytics.json` — committed, bundled on Vercel deploy |
| Basket holdings | **GitHub repo** | `api/data/basketMaster.json` + `src/basket/data/config/*.js` |
| Daily refresh | **GitHub Actions** | Fetches NAV from mfapi.in, recomputes metrics, opens PR for JSON |

### Data flow (no database required — Phase 1)

```
mfapi.in (AMFI scheme NAV history)
        ↓
npm run refresh-baskets
        ↓
api/data/basketAnalytics.json  ← committed to git
        ↓
GitHub Action (daily ~11 PM IST) → commit if changed → push
        ↓
Vercel auto-deploy → API reads bundled JSON
        ↓
Hostinger React → GET /api/baskets/:id/analytics
```

### Public vs paid (product rule)

| Audience | Sees |
|----------|------|
| **Public (free)** | Basket NAV, returns, growth chart vs benchmarks, 4-head asset allocation, portfolio construction (categories only), sectors, AN Score™, risk parameters |
| **Paid (₹4,999 unlock)** | Exact fund names + weights, research notes |

Fund names live in `src/basket/data/config/*.js` (`funds` array) and `api/data/basketMaster.json` (`holdings`) — gated in UI until unlock.

### Standard asset allocation (4 heads — must sum to 100% each)

| Head | Used in compare table & public allocation card |
|------|-----------------------------------------------|
| Equity | ✓ |
| Debt / Liquid | ✓ |
| Gold | ✓ |
| Hybrid / Multi Asset | ✓ |

Configured in each basket’s `allocationPreviewFree` in `src/basket/data/config/{fire,water,earth}.js`.

---

## 2. Routes & navigation

### Primary URLs (use these in marketing)

| URL | Page |
|-----|------|
| `/invest/baskets` | **Mutual fund baskets** landing (catalog, compare, unlock) |
| `/invest/basket/fire` | FIRE detail + analytics |
| `/invest/basket/water` | WATER detail + analytics |
| `/invest/basket/earth` | EARTH detail + analytics |
| `/invest/risk-profile` | Risk quiz → basket recommendation |
| `/invest/payment-success` | Post-Razorpay confirmation |

### Redirects (legacy bookmarks)

| Old URL | Redirects to |
|---------|--------------|
| `/mutual-funds` | `/invest/baskets` |
| `/equity-basket` | `/invest/baskets` |
| `/invest` | `/invest/baskets` |
| `/baskets` | `/invest/baskets` |
| `/baskets/fire-s` | `/invest/basket/fire` |
| `/baskets/water` | `/invest/basket/water` |
| `/baskets/earth` | `/invest/basket/earth` |
| `/invest/dashboard` | `/invest/baskets` |

### Secondary (not in main nav)

| URL | Page |
|-----|------|
| `/invest/funds` | MF screener (screeners deep-links) |
| `/invest/fund/:schemeCode` | Single fund detail |
| `/invest/admin` | Hidden admin catalog override |

### Site navigation (post-simplification)

- **Navbar → What we do:** “Mutual fund baskets” → `/invest/baskets`
- **Footer → Invest products:** “Mutual Fund Baskets” → `/invest/baskets`
- **Offerings page:** MF baskets section → `/invest/baskets` (equity basket section removed)

---

## 3. Key files reference

### Data & config (source of truth)

| Path | Purpose |
|------|---------|
| `src/basket/data/baskets.js` | `BASKET_PRODUCT_NAME`, `BASKET_UNLOCK_PRICE`, catalog export |
| `src/basket/data/config/fire.js` | FIRE UI config, allocation, funds (paid), personality |
| `src/basket/data/config/water.js` | WATER UI config |
| `src/basket/data/config/earth.js` | EARTH UI config |
| `src/basket/data/config/index.js` | Compare table rows, 4-head allocation labels, recommendations |
| `src/basket/data/config/shared.js` | `validateBasketAllocations`, `projectLumpsum` |
| `api/data/basketMaster.json` | Server holdings, scheme codes, weights (analytics engine) |
| `api/data/basketAnalytics.json` | **Computed** NAV history, returns, risk, benchmarks |

### Backend

| Path | Purpose |
|------|---------|
| `api/services/basketAnalyticsEngine.mjs` | Synthetic basket NAV, metrics, benchmarks |
| `api/services/basketAnalyticsStore.mjs` | Read/write JSON; optional Supabase (Phase 2) |
| `api/routes/baskets.mjs` | API routes |
| `server.mjs` | Mounts `/api/baskets` |
| `scripts/refresh-basket-analytics.mjs` | CLI refresh script |

### Automation

| Path | Purpose |
|------|---------|
| `.github/workflows/refresh-basket-analytics.yml` | Daily cron + manual dispatch |
| `package.json` → `"refresh-baskets"` | npm script alias |

### Frontend

| Path | Purpose |
|------|---------|
| `src/basket/layout/InvestLayout.jsx` | Invest shell + shared CSS imports |
| `src/basket/pages/BasketLanding.jsx` | Hero → catalog → compare → discovery → pricing |
| `src/basket/pages/BasketDetail.jsx` | Single template for fire / water / earth |
| `src/basket/pages/RiskProfilePage.jsx` | Risk quiz |
| `src/basket/pages/BasketPaymentSuccessPage.jsx` | Post-payment |
| `src/basket/components/basket-analytics/*` | KPIs, growth chart, compare, widgets |
| `src/basket/components/basket-analytics/BasketHomePromo.jsx` | Homepage promo block |
| `src/basket/styles/basket-shared.css` | Shared tokens, responsive polish |
| `src/basket/hooks/useBasketAnalytics.js` | Live API hook |
| `src/basket/utils/mergeBasketAnalytics.js` | API → UI metrics merge |

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/baskets/master` | Public basket metadata (no fund names) |
| `GET` | `/api/baskets/:id/analytics` | NAV, returns, charts, benchmarks |
| `GET` | `/api/baskets/:id/holdings` | Private — requires admin key |
| `POST` | `/api/baskets/refresh` | Manual refresh — requires admin key |
| `GET` | `/api/baskets/cron/refresh` | Vercel Cron (Phase 2 only; needs `CRON_SECRET`) |
| `GET` | `/api/health` | Health check |

---

## 4. Phase 1 — Go live (GitHub only, no Supabase)

**Goal:** Ship with pre-computed analytics in the repo. Daily GitHub Action keeps NAV fresh.

> **First-time deploy:** follow **Section 0** step-by-step (branch push, merge, Vercel, Hostinger). This section is the reference detail for each layer.

### 4.1 Local verification (before any deploy)

**Terminal 1 — API:**
```bash
cd /path/to/an-basket
npm run server
# → http://localhost:8000
```

**Refresh analytics & test API:**
```bash
npm run refresh-baskets

curl -s http://localhost:8000/api/baskets/fire/analytics | head -c 500
curl -s http://localhost:8000/api/baskets/water/analytics | head -c 500
curl -s http://localhost:8000/api/baskets/earth/analytics | head -c 500
curl -s http://localhost:8000/api/baskets/master
curl -s http://localhost:8000/api/health
```

**Expected:** JSON with `returns.currentNav`, `returns.return1y`, `navHistory`, `risk`. All three baskets return 200.

**Terminal 2 — Frontend:**
```bash
npm start
# → http://localhost:3000
```

**Manual UI checklist:**

| # | URL / action | Pass criteria |
|---|--------------|---------------|
| 1 | `/invest/baskets` | Hero, 3 basket cards, compare table (4 allocation heads + 100% total), risk quiz link |
| 2 | `/mutual-funds` | Redirects to `/invest/baskets` |
| 3 | `/equity-basket` | Redirects to `/invest/baskets` |
| 4 | `/invest` | Redirects to `/invest/baskets` |
| 5 | `/invest/basket/fire` | KPIs + live growth chart; no fund names when locked |
| 6 | `/invest/basket/water` | Gold = 10% in compare (not higher than FIRE) |
| 7 | `/invest/basket/earth` | Conservative copy, ideal-for labels |
| 8 | `/invest/risk-profile` | Quiz completes → links to recommended basket |
| 9 | Unlock flow | Razorpay form → payment success → holdings visible once |
| 10 | Homepage | `BasketHomePromo` personality + recommendation |
| 11 | Mobile | Compare table horizontal scroll; checkout above content on detail |
| 12 | Incognito | No fund names on public pages |

### 4.2 Git commit (minimum files for production)

Ensure these are **tracked in git** (not gitignored):

```
# Data
api/data/basketMaster.json
api/data/basketAnalytics.json

# CI
.github/workflows/refresh-basket-analytics.yml

# API
api/routes/baskets.mjs
api/services/basketAnalyticsEngine.mjs
api/services/basketAnalyticsStore.mjs
server.mjs
package.json
vercel.json

# Basket frontend
src/basket/
src/App.js
src/components/navbar/Navbar.jsx
src/containers/footer/Footer.jsx
src/containers/offerings/Offerings.jsx
src/containers/home/Home.jsx
src/components/chatbot/ragService.js
```

**Example commit:**
```bash
git add api/data/basketMaster.json api/data/basketAnalytics.json
git add .github/workflows/refresh-basket-analytics.yml
git add api/routes/baskets.mjs api/services/basketAnalytics*
git add server.mjs package.json vercel.json
git add src/basket/ src/App.js
git add src/components/navbar/Navbar.jsx src/containers/footer/Footer.jsx
git add src/containers/offerings/Offerings.jsx src/containers/home/Home.jsx
git commit -m "feat: mutual fund baskets with GitHub-backed daily NAV refresh"
git push origin <your-branch>
```

Merge to `main` (or production branch) when Section 7 checklist passes.

### 4.3 GitHub Actions — one-time setup

See **Section 0 → Step 5** (org/repo PR permissions) and **Step 5b** (auto-approve/merge + `BASKET_REFRESH_GH_TOKEN`).

1. Enable org + repo **Allow GitHub Actions to create and approve pull requests**.
2. Add secret **`BASKET_REFRESH_GH_TOKEN`** (admin fine-grained PAT).
3. Merge `.github/workflows/auto-merge-basket-nav-refresh.yml` to `main`.
4. Run **Refresh basket analytics** once — expect PR → auto-merge workflow approves and merges after checks.
5. **Schedule:** `30 17 * * *` UTC ≈ **11:00 PM IST** (after AMFI NAV window)

### 4.4 Vercel (API backend)

**Required environment variables:**

| Variable | Example | Notes |
|----------|---------|-------|
| `CORS_ALLOWED_ORIGINS` | `https://www.anupaatnivesh.com,https://anupaatnivesh.com` | Exact Hostinger origins; add staging while testing |
| `RAZORPAY_KEY_ID` | `rzp_live_...` | Payment |
| `RAZORPAY_KEY_SECRET` | `...` | Server-side only |

**NOT required for Phase 1:**

| Variable | Notes |
|----------|-------|
| `SUPABASE_URL` | Skip |
| `SUPABASE_SERVICE_ROLE_KEY` | Skip |
| `SUPABASE_BASKET_ANALYTICS_TABLE` | Skip |
| `CRON_SECRET` | Skip |

**Deploy steps:**

1. Confirm Vercel project linked to same GitHub repo
2. Push/merge to deploy branch
3. Smoke test:

```bash
curl https://YOUR-VERCEL-ORIGIN.vercel.app/api/health
curl https://YOUR-VERCEL-ORIGIN.vercel.app/api/baskets/fire/analytics
curl https://YOUR-VERCEL-ORIGIN.vercel.app/api/baskets/water/analytics
curl https://YOUR-VERCEL-ORIGIN.vercel.app/api/baskets/earth/analytics
```

**Vercel Cron note:** `vercel.json` includes a `crons` entry for `/api/baskets/cron/refresh`. For Phase 1 this **cannot persist JSON** on serverless and returns **401 without `CRON_SECRET`**. Safe to ignore log noise, or remove the `crons` block before deploy. **GitHub Action is the authoritative refresh path for Phase 1.**

### 4.5 Hostinger (React frontend)

1. **Create production env:**
   ```bash
   cp .env.production.hostinger.example .env.production
   ```

2. **Set in `.env.production`:**
   ```bash
   # Vercel API origin ONLY — no trailing /api
   REACT_APP_API_BASE_URL=https://YOUR-VERCEL-ORIGIN.vercel.app

   REACT_APP_BASE_URL=https://www.anupaatnivesh.com
   REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   # …other existing REACT_APP_* vars (EmailJS, etc.)
   ```

3. **Build & upload:**
   ```bash
   npm run build
   # Upload contents of build/ to Hostinger
   ```

4. **Hard refresh** (Cmd+Shift+R) on:
   - `/invest/baskets`
   - `/invest/basket/fire`
   - `/mutual-funds` (should redirect)
   - Homepage

**CORS debug:** DevTools → Network. If blocked, add exact Hostinger origin to `CORS_ALLOWED_ORIGINS` on Vercel and redeploy.

**Common mistake:** `REACT_APP_API_BASE_URL` must **not** end with `/api` (causes double `/api/api/`).

### 4.6 Production verification checklist

| # | Check | Pass criteria |
|---|-------|---------------|
| 1 | API health | `GET /api/health` → 200 |
| 2 | FIRE analytics | `currentNav`, `return1y` present |
| 3 | WATER analytics | Same |
| 4 | EARTH analytics | Same |
| 5 | Landing | 3 cards + compare table totals 100% |
| 6 | Legacy redirects | `/mutual-funds`, `/equity-basket`, `/invest` → baskets |
| 7 | Detail charts | KPIs populated (not all `—`) |
| 8 | Public privacy | No fund names without unlock |
| 9 | Unlock | Razorpay → holdings visible |
| 10 | GitHub Action | Manual run succeeds |
| 11 | Post-action | Vercel redeploys after data commit (if auto-deploy on push) |
| 12 | Navbar/footer | “Mutual fund baskets” links work |

### 4.7 Operational commands (ongoing)

```bash
# Refresh all baskets locally (commit JSON for immediate deploy)
npm run refresh-baskets

# Refresh one basket only (merges — does not wipe others)
node scripts/refresh-basket-analytics.mjs earth

# Remote refresh without local machine
# → GitHub → Actions → Refresh basket analytics → Run workflow
```

**Typical daily lag:** NAV ~11 PM IST → Action commits → Vercel redeploy (2–10 min). Acceptable for Phase 1.

**Allocation validation:** In development, `src/basket/data/config/index.js` logs warnings if any basket’s 4-head allocation ≠ 100%.

---

## 5. Phase 2 — Optional upgrades (later)

### Option A — Stay GitHub-only (recommended default)

- No extra infra; daily Action + Vercel redeploy is sufficient
- **Action:** None

### Option B — Vercel Cron + Supabase (same-day API without redeploy)

**When:** Analytics must update on API immediately after cron, without waiting for Vercel rebuild.

1. Create Supabase table `basket_analytics_cache` (see previous revision of this doc)
2. Vercel env: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_BASKET_ANALYTICS_TABLE`, `CRON_SECRET`
3. Keep GitHub Action as git source of truth

Code in `api/services/basketAnalyticsStore.mjs` already supports Supabase fallback.

### Option C — Full database

**When:** Admin panel, payment logs, rebalance audit, multi-editor workflows.

Not required for current launch.

---

## 6. Configuration guide (future edits)

### Change copy, expected return, allocation (UI only)

Edit `src/basket/data/config/{fire,water,earth}.js`:
- `allocationPreviewFree` — 4 heads, must sum to 100%
- `portfolioConstruction` — fund-category breakdown for donut
- `expectedReturn`, `personality`, `whyBasket`, `idealForLabels`

Redeploy **Hostinger** after UI config changes.

### Change underlying funds / weights (analytics + paid view)

1. Edit `api/data/basketMaster.json` → `holdings` (scheme codes from mfapi.in)
2. Edit matching `funds` array in config `*.js`
3. Align `portfolioConstruction` and `allocationPreviewFree` rollups
4. Run `npm run refresh-baskets`
5. Commit `basketMaster.json` + `basketAnalytics.json`
6. Redeploy Vercel (+ Hostinger if labels changed)

### Rename product label site-wide

Change `BASKET_PRODUCT_NAME` in `src/basket/data/baskets.js` — used in landing, subnav, breadcrumbs.

### Add a new basket (e.g. AIR when launched)

1. Create `src/basket/data/config/air.js`
2. Add to `elementalBaskets` in `src/basket/data/config/index.js`
3. Add entry to `api/data/basketMaster.json`
4. Add to `ELEMENTAL_BASKET_IDS` / `futureBaskets` as appropriate
5. Run refresh, commit, deploy

---

## 7. Pre-launch review checklist

Run this checklist **every time** before merging to production:

**Build & data**
- [ ] `npm run build` — succeeds
- [ ] `npm run refresh-baskets` — succeeds for fire, water, earth
- [ ] All three `GET /api/baskets/:id/analytics` return 200 locally
- [ ] `basketAnalytics.json` diff reasonable (NAV, dates)
- [ ] `api/data/basketAnalytics.json` is **not** in `.gitignore`
- [ ] `.github/workflows/refresh-basket-analytics.yml` on branch

**Allocation & compare**
- [ ] Compare table: 4 heads + total 100% per basket
- [ ] WATER gold ≤ FIRE gold (both 10%)
- [ ] No duplicate/wrong compare labels

**Routes & nav**
- [ ] `/invest/baskets` is primary entry
- [ ] `/mutual-funds`, `/equity-basket`, `/invest` redirect correctly
- [ ] Navbar + footer say “Mutual fund baskets”

**UI / UX**
- [ ] Landing order: hero → cards → compare → discovery → pricing
- [ ] Detail: one growth chart, one holdings block (no triple duplication)
- [ ] Risk quiz linked from landing
- [ ] Mobile: compare scroll, sticky checkout behavior OK
- [ ] Homepage `BasketHomePromo` renders

**Privacy & payments**
- [ ] Incognito: no fund names on public pages
- [ ] Razorpay unlock works (test mode on staging OK)
- [ ] Payment success page + EmailJS best-effort
- [ ] Compliance disclaimer on basket pages

**Production env**
- [ ] `REACT_APP_API_BASE_URL` set on Hostinger build (no `/api` suffix)
- [ ] `CORS_ALLOWED_ORIGINS` includes live Hostinger origin
- [ ] `REACT_APP_RAZORPAY_KEY_ID` set for live/test as appropriate

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| KPIs show `—` on production | JSON not deployed or API 404 | Commit `basketAnalytics.json`; verify Vercel deploy; check `REACT_APP_API_BASE_URL` |
| “Live analytics unavailable” banner | API down or CORS | Fix CORS; confirm Vercel health |
| CORS error from Hostinger | Origin missing | Add exact `https://www...` to Vercel `CORS_ALLOWED_ORIGINS` |
| Double `/api/api/` in requests | `REACT_APP_API_BASE_URL` ends with `/api` | Use origin only |
| Compare table ≠ 100% | `allocationPreviewFree` misconfigured | Fix config; check dev console warnings |
| GitHub Action no commit | No NAV change or no write permission | Enable Actions write; re-run workflow |
| Vercel shows stale NAV | Auto-deploy off or wrong branch | Enable deploy on push to `main` |
| FIRE inception short | WhiteOak Mid Cap ~Sep 2022 | Expected; disclosed in compliance copy |
| mfapi.in timeout in Action | Transient | Re-run workflow |
| Admin shows old price | `an_basket_admin_catalog` in localStorage | Clear in DevTools → Application |
| `/mutual-funds` still shows old page | Hostinger cache or old build | Rebuild + hard refresh; confirm `App.js` redirect |

---

## 9. Operations calendar

| When | What happens | Who |
|------|----------------|-----|
| Daily ~11 PM IST | GitHub Action fetches NAV, recomputes metrics | Automated |
| After Action PR merge | Vercel redeploys API with new JSON | Automated (if deploy on push + PR merged) |
| On config/fund change | Manual `refresh-baskets` + commit + deploy | You |
| On copy/UI change | `npm run build` + Hostinger upload | You |
| Weekly (optional) | Spot-check live NAV vs AMFI | You |

---

## 10. Quick reference — who does what

| Task | You | Automated |
|------|-----|-----------|
| Initial commit of analytics JSON | ✓ | |
| Enable GitHub Actions write | ✓ | |
| Set Vercel CORS + Razorpay | ✓ | |
| Build & upload Hostinger | ✓ | |
| Daily NAV fetch & metrics | | GitHub Action |
| Commit updated JSON | | GitHub Action |
| Vercel API redeploy | | Vercel (on push) |
| Serve analytics to website | | Vercel reads bundled JSON |

---

## 11. Related docs

| Doc | Purpose |
|-----|---------|
| `docs/INVEST_BACKLOG.md` | Product backlog |
| `docs/SCREENERS_ROADMAP.md` | Screeners feature roadmap |
| `.env.production.hostinger.example` | Hostinger build env template |
| `.env.example` | Local + optional Supabase vars (Phase 2) |
| `docs/DEPLOY_HOSTINGER_VERCEL.md` | General site deploy notes |

---

## 12. Live analytics snapshot (last local refresh)

Reference values — re-run `npm run refresh-baskets` before go-live for current numbers:

| Basket | NAV | 1Y return | 3Y CAGR |
|--------|-----|-----------|---------|
| FIRE | ~188.74 | ~8.68% | ~19.32% |
| WATER | ~197.05 | ~10.95% | ~16.54% |
| EARTH | ~246.51 | ~11.72% | ~16.21% |

FIRE inception limited by youngest constituent fund (~Sep 2022).

---

*Phase 1 = GitHub JSON + daily Action. No Supabase. No database. Primary URL: `/invest/baskets`. Ship first; optimize later.*
