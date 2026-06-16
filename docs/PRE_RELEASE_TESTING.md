# Pre-release testing checklist (Item 17)

Run before merging `feature/ui-enhancements` to production.

## Automated gate

```bash
npm run build
npm run validate:release          # local API: npm run server on :8000
npm run validate:release -- --api-base https://YOUR-VERCEL-ORIGIN
```

**Pass criteria:** 0 failures in `validate:release`.

---

## 1. Risk profiling flow

| Step | Route | Expected |
|------|-------|----------|
| Open quiz | `/invest/risk-profile` | 6 questions, progress bar |
| Aggressive answers | Buy more, 10+ years, wealth growth | → **FIRE** (score ≥ 68) |
| Moderate answers | Hold calmly, 5–10 years | → **WATER** (score 44–67) |
| Conservative answers | Prefer to exit, <3 years, safety first | → **EARTH** (score ≤ 43) |
| Persistence | Complete quiz, refresh page | Result stored in `localStorage` (`an_basket_risk_profile`) |
| CTA | Result screen | Links to basket detail + compare |

---

## 2. Basket recommendation logic

| Surface | Check |
|---------|--------|
| Landing widget | Pills: Aggressive → FIRE, Moderate → WATER, Conservative → EARTH |
| Widget copy | Shows objective (not blank subtitle) |
| Risk quiz | Scoring thresholds align with widget profiles |
| Compare table | Risk scores: FIRE 8–10, WATER 5–8, EARTH Below 5 |

---

## 3. Performance calculations

| Check | Detail |
|-------|--------|
| KPI strip | 7 periods: 1M, 3M, 6M, 1Y, 3Y, 5Y, Since Inception |
| Growth chart | Basket NAV vs Nifty 50 only (no projection rows) |
| Compare table | Basket row + Nifty 50 row per period |
| Cached data | `api/data/basketAnalytics.json` has NAV history for all three |
| Live API | `GET /api/baskets/:id/analytics` returns 200 |

Formula reference: `src/basket/utils/basketPerformance.js` — period returns from indexed NAV; CAGR uses `(end/start)^(1/years) - 1`.

---

## 4. Mobile responsiveness

Test at **375px** and **768px** widths:

| Page | Focus areas |
|------|-------------|
| `/invest/baskets` | Catalog cards, compare table horizontal scroll |
| `/invest/basket/fire` | Portfolio construction grid stacks, sticky checkout |
| `/invest/risk-profile` | Option buttons tap targets |
| Homepage | Hero basket slide, lead capture two-column → single column |
| Homepage | Contact section unchanged |

---

## 5. Deploy to testing environment

### Option A — Vercel preview (API)

1. Push branch: `git push -u origin feature/ui-enhancements`
2. Vercel auto-builds preview if project linked to repo
3. Validate API: `npm run validate:release -- --api-base https://<preview>.vercel.app`

### Option B — Hostinger staging (UI)

1. Set build env on staging:
   - `REACT_APP_API_BASE_URL` = Vercel origin (no `/api` suffix)
   - `REACT_APP_RAZORPAY_KEY_ID` = test or live key matching Vercel
2. `npm run build` → upload `build/` to staging Hostinger path
3. Manual QA on staging URL

### Option C — Local review (current)

- UI: `npm run start` → http://localhost:3000
- API: `npm run server` → http://localhost:8000
- Proxy: CRA proxies `/api` to :8000 in development

---

## Sign-off

- [ ] `npm run validate:release` — 0 failures
- [ ] Risk quiz manually tested (3 profiles)
- [ ] Recommendation widget shows correct basket + objective
- [ ] Performance numbers match between KPI strip and compare table
- [ ] Mobile layout reviewed (375px)
- [ ] Staging/preview URL shared for stakeholder review
