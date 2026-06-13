# Contact form email — Resend setup (production)

Contact, lead, and mutual-fund inquiry forms send email via **Resend on the Vercel API** (`POST /api/contact/submit`), not EmailJS.

EmailJS + Gmail OAuth breaks when Google tokens expire (`Invalid grant` / `Gmail_API`). Resend uses a server API key and does not depend on Gmail reconnects.

---

## Your action checklist

### 1. Resend domain (one-time)

1. Log in at [resend.com](https://resend.com)
2. **Domains** → add `anupaatnivesh.com` (or subdomain you send from)
3. Add DNS records Resend shows (SPF, DKIM)
4. Wait until domain status is **Verified**

### 2. Vercel environment variables

Project → **Settings → Environment Variables** → **Production** (and Preview if needed):

| Variable | Example | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | `re_...` | Yes |
| `CONTACT_ALERT_TO_EMAIL` | `info@anupaatnivesh.com` | Yes (inbox for leads) |
| `CONTACT_ALERT_FROM_EMAIL` | `Anupaat Nivesh <info@anupaatnivesh.com>` | Yes (must use verified domain) |
| `CORS_ALLOWED_ORIGINS` | `https://www.anupaatnivesh.com,https://anupaatnivesh.com` | Yes for Hostinger frontend |

If `CONTACT_ALERT_*` are omitted, the API falls back to `ONBOARDING_ALERT_*` values.

**Redeploy Vercel** after saving env vars.

### 3. Hostinger frontend build

When building the React app for Hostinger, set in `.env.production`:

```env
REACT_APP_API_BASE_URL=https://anupaat-nivesh.vercel.app
```

(No trailing `/api`. Rebuild and upload `build/`.)

### 4. Smoke test

```bash
# API health
curl -s https://anupaat-nivesh.vercel.app/api/contact/health

# Test submit (replace with your values)
curl -s -X POST https://anupaat-nivesh.vercel.app/api/contact/submit \
  -H "Content-Type: application/json" \
  -H "Origin: https://www.anupaatnivesh.com" \
  -d '{"formType":"contact","firstName":"Test","lastName":"User","email":"you@example.com","phone":"+919501195200","message":"API smoke test"}'
```

Then submit the live **Contact Us** form on www.anupaatnivesh.com.

---

## Local development

Terminal A:
```bash
npm run server
```

Terminal B — `.env.local`:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
RESEND_API_KEY=re_...
CONTACT_ALERT_TO_EMAIL=your-email@example.com
CONTACT_ALERT_FROM_EMAIL=Anupaat Nivesh <info@anupaatnivesh.com>
```

```bash
npm start
```

Optional EmailJS fallback (not recommended):
```env
REACT_APP_CONTACT_USE_EMAILJS=true
REACT_APP_EMAILJS_SERVICE_ID=...
REACT_APP_EMAILJS_TEMPLATE_ID=...
REACT_APP_EMAILJS_PUBLIC_KEY=...
```

---

## Forms covered

| Form | formType |
|------|----------|
| `/contact` | `contact` |
| LeadForm (homepage / hero) | `lead` / `portfolio_review` |
| Mutual fund modal | `mutual_fund` |
| Basket unlock confirmation | `basket_unlock` |
| Booking confirmation | `booking_confirmation` |
| Consulting session registration | `consulting_registration` |
| ArthAI chatbot leads | `chatbot_lead` |

All forms try Resend via `/api/contact/submit` first. If the API returns 503 (Resend not configured), production falls back to EmailJS automatically so forms keep working until Phase 2 env vars are set.
