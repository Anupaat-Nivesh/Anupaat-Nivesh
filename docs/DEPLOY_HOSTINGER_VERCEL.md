# Deploy: React on Hostinger + API on Vercel

Use this checklist with your co-developer hat on: validate **before** you point users at production, especially **Razorpay** and **CORS**.

---

## Architecture (what talks to what)

| Piece | Where it runs | Role |
|--------|----------------|------|
| React static (`build/`) | **Hostinger** | UI only; `REACT_APP_*` baked in at **build** time |
| Express (`server.mjs`) | **Vercel** | `/api/*` — payments, ticker, onboarding, media, health |
| Razorpay **Key ID** | Hostinger bundle | `REACT_APP_RAZORPAY_KEY_ID` (public) |
| Razorpay **Key secret**, webhook secret | **Vercel only** | Never in the React bundle |

Browser flow: **Hostinger origin** → `fetch(https://<vercel>/api/...)` → must pass **CORS** on Vercel.

---

## Phase 1 — Vercel (backend) first

### 1.1 Branch and deploy

1. Merge or deploy the branch you validated locally (`feature/valuation` or `main`) to the **same Vercel project** that serves `server.mjs`.
2. Confirm **Build** succeeds in the Vercel dashboard (logs show `react-scripts build` / `vercel-build` and Node function build if applicable).

### 1.2 Environment variables (Vercel → Project → Settings → Environment variables)

Set for **Production** (and **Preview** if you use preview URLs to test).

**Payments (required for live money)**

| Name | Notes |
|------|--------|
| `RAZORPAY_KEY_ID` | Same **account** as `REACT_APP_RAZORPAY_KEY_ID` on the frontend (usually `rzp_live_...` in prod) |
| `RAZORPAY_KEY_SECRET` | Server only |
| `RAZORPAY_WEBHOOK_SECRET` | From Razorpay Dashboard → Webhooks → signing secret |

**CORS (required for Hostinger → Vercel)**

| Name | Example value |
|------|----------------|
| `CORS_ALLOWED_ORIGINS` | `https://www.anupaatnivesh.com,https://anupaatnivesh.com` |

Use the **exact** origins users type in the browser (`https`, `www` vs apex, no trailing slash). The server **merges** this list with built-in defaults; add staging Hostinger URLs here while testing.

**Optional (if you use sheet logging after verify)**

| Name | Notes |
|------|--------|
| `GOOGLE_SHEETS_CREDENTIALS` | JSON string for service account |
| `GOOGLE_SHEET_ID` | Target spreadsheet |

**Everything else** you already use locally for the server (Supabase, Resend, `MEDIA_*`, etc.) — copy from `.env.production.example` into Vercel; do **not** put secrets in the Hostinger build.

### 1.3 Redeploy

After changing env vars: **Redeploy** (Deployments → … → Redeploy) so the serverless bundle picks them up.

### 1.4 Validate API (no Hostinger yet)

From a terminal:

```bash
VERCEL_ORIGIN="https://YOUR-PROJECT.vercel.app"  # no trailing slash, no /api

curl -sS "${VERCEL_ORIGIN}/api/health" | head -c 400
curl -sS "${VERCEL_ORIGIN}/api/market-ticker" | head -c 200
curl -sS "${VERCEL_ORIGIN}/api/payments/webhook" | head -c 300
```

Expect **JSON** (not HTML). `/api/payments/webhook` GET should mention whether the webhook secret is configured.

**Preview URLs (`*-git-*-*.vercel.app`)** may have **Vercel Deployment Protection** (SSO). Anonymous `curl` then returns HTML “Authentication Required” (401), not JSON. Use **`vercel curl`** (authenticated CLI), temporarily **disable protection** on that preview, or test against your **public** deployment (e.g. `https://anupaat-nivesh.vercel.app` or a production API domain).

**Hostinger apex/www** (`https://www.anupaatnivesh.com/api/...`) will usually return **HTML** (the React app), because the API is on **Vercel**, not Hostinger — that is expected. Validate `/api/*` against the **Vercel origin** you set in `REACT_APP_API_BASE_URL`.

**CORS preflight** (replace `https://www.anupaatnivesh.com` with your real Hostinger URL):

```bash
curl -sS -D - -o /dev/null -X OPTIONS "${VERCEL_ORIGIN}/api/health" \
  -H "Origin: https://www.anupaatnivesh.com" \
  -H "Access-Control-Request-Method: GET"
```

Look for `access-control-allow-origin` matching that origin (not blocked).

---

## Phase 2 — Razorpay (production)

1. Dashboard → **API Keys**: use **Live** keys on Vercel for production (`RAZORPAY_KEY_*`).
2. Dashboard → **Webhooks** → add URL:  
   `https://YOUR-PROJECT.vercel.app/api/payments/webhook`  
   (or your **custom API domain** if mapped on Vercel).
3. Subscribe to events you handle (e.g. `payment.captured`).
4. Copy **Webhook secret** → `RAZORPAY_WEBHOOK_SECRET` on Vercel.
5. **Key ID parity**: `REACT_APP_RAZORPAY_KEY_ID` in the **Hostinger build** must be the **same live Key ID** string as `RAZORPAY_KEY_ID` on Vercel (one is public in JS, one is server-side).

---

## Phase 3 — Hostinger (frontend build)

### 3.1 Prepare env for the build machine

1. Copy the template:  
   `cp .env.production.hostinger.example .env.production`
2. Edit **at minimum**:
   - `REACT_APP_API_BASE_URL` = your Vercel API origin **only** (example: `https://anupaat-nivesh.vercel.app`) — **never** append `/api`.
   - `REACT_APP_BASE_URL` = the **public Hostinger** site URL users will open.
   - `REACT_APP_RAZORPAY_KEY_ID` = live **public** key (`rzp_live_...`).
   - Calendly / EmailJS / WhatsApp / admin email as in production.

3. Run:

```bash
npm ci
npm run build
```

4. Upload the contents of **`build/`** to Hostinger (public root / `public_html`, or the path your domain uses). Preserve **`asset-manifest.json`** and hashed static folders.

### 3.2 Hostinger hygiene

- Site should be **HTTPS** (avoid mixed-content blocking API calls).
- If you use **SPA routing** (React Router), configure the panel to **fallback to `index.html`** for unknown paths (so `/valuation`, `/contact`, etc. do not 404).

---

## Phase 4 — End-to-end smoke tests (production)

Do these on the **live Hostinger URL** in a normal browser (or incognito after deploy).

| # | Action | Pass criteria |
|---|--------|----------------|
| 1 | Open homepage | Loads, no blank screen |
| 2 | Market ticker | Quotes scroll / update (Network: `GET .../api/market-ticker` → 200 JSON) |
| 3 | DevTools → Console | No red CORS errors on API calls |
| 4 | `/api` URL sanity | No requests to `.../api/api/...` |
| 5 | Consulting / payment flow | Opens Razorpay; **test with a small live payment** or Razorpay test mode on a staging Hostinger URL first |
| 6 | After payment | Verify redirect / success UI; check Vercel **function logs** for errors |
| 7 | Contact form | Submit works (EmailJS keys in build) |
| 8 | Critical routes | `/contact`, `/mutual-funds`, `/calculators`, `/valuation` load |

---

## Phase 5 — If something breaks

| Symptom | Likely cause |
|---------|----------------|
| CORS error in console | `CORS_ALLOWED_ORIGINS` missing your **exact** Hostinger origin |
| 404 on `.../api/api/...` | `REACT_APP_API_BASE_URL` ended with `/api` — remove it and **rebuild** Hostinger |
| HTML instead of JSON at `/api/...` | Wrong host (not Vercel API) or CDN serving `index.html` for API paths |
| Razorpay “configuration error” | Missing `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` on **Vercel** |
| Webhook never fires | Wrong webhook URL in Razorpay or `RAZORPAY_WEBHOOK_SECRET` mismatch |
| Key mismatch | `REACT_APP_RAZORPAY_KEY_ID` (build) ≠ `RAZORPAY_KEY_ID` (Vercel) for the same mode (test vs live) |

---

## Quick reference: who holds which variable

| Variable | Hostinger build (`REACT_APP_*`) | Vercel server |
|----------|----------------------------------|----------------|
| API origin | `REACT_APP_API_BASE_URL` | — |
| Razorpay Key **ID** | `REACT_APP_RAZORPAY_KEY_ID` | `RAZORPAY_KEY_ID` (match) |
| Razorpay **secret** | Never | `RAZORPAY_KEY_SECRET` |
| Webhook secret | Never | `RAZORPAY_WEBHOOK_SECRET` |
| CORS | — | `CORS_ALLOWED_ORIGINS` |

After any change to **`REACT_APP_*`**: rebuild and re-upload **`build/`**. After any change to **server secrets**: redeploy Vercel only.
