# Production Routing for `/onboarding`

## Recommended Architecture

Use a **first-party page route** on your site (`/onboarding`) that embeds the Google Apps Script Web App in an `iframe`.

- Keeps user-visible URL fixed as `https://www.anupaatnivesh.com/onboarding`
- Preserves native Google Apps Script and Google Form behavior (including file uploads)
- Avoids proxying multipart uploads through your infra
- Avoids CORS and request-signature side effects introduced by reverse proxies

This repo already includes the production page at:

- `src/pages/Onboarding/Onboarding.jsx`
- `src/pages/Onboarding/Onboarding.css`
- Route: `src/App.js` -> `/onboarding`

---

## Option Analysis (Pros/Cons)

### 1) iframe embedding (recommended)

**Pros**
- Lowest risk for Google Form + Apps Script file uploads
- No backend proxy maintenance
- No CORS manipulation needed
- Fastest to deploy and easiest rollback

**Cons**
- Upstream page URL still exists in HTML context (not in browser address bar)
- Depends on Google endpoint allowing frame embedding

### 2) Reverse proxy (Apache/Nginx)

**Pros**
- User never contacts `script.google.com` directly in browser URL
- Full URL masking in address bar

**Cons**
- Can break file uploads and form submissions due to rewritten headers/cookies
- Fragile against Google response/header changes
- Operationally heavy (timeouts, buffering, body size, TLS, upstream redirects)
- Harder to debug

### 3) Redirect (301/302)

**Pros**
- Very simple and reliable
- Uploads/forms work exactly as Google intended

**Cons**
- Browser URL changes to Google Script URL (fails your masking requirement)

### 4) Cloudflare Worker proxy

**Pros**
- More controllable than origin reverse proxy
- Can keep browser URL stable

**Cons**
- High complexity for multipart/form-data and streaming uploads
- Greater risk of edge-case failures and body-size/runtime limits
- More moving parts (Worker, routes, edge logging, cache rules)

---

## React/Vercel Implementation (Already Applied)

### Route in React

`/onboarding` now renders a full-screen branded shell with:
- modern loading overlay
- responsive iframe
- fallback button if embedding fails in a browser

### Environment override (optional)

Set this in Vercel project env vars if URL changes:

```bash
REACT_APP_ONBOARDING_WEBAPP_URL=https://script.google.com/macros/s/AKfycbyz7TLi26OXU1aPSgIopz95dEbXYrkTHKRD51tWf8Zc4EgBahsY7-evXMs6-E7U_pcL7Q/exec?v=10
```

### Vercel rewrite for SPA fallback

If deep-link routes fail on refresh, use this `vercel.json` routing section:

```json
{
  "version": 2,
  "builds": [
    { "src": "server.mjs", "use": "@vercel/node" },
    { "src": "package.json", "use": "@vercel/static-build", "config": { "distDir": "build" } }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server.mjs" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

---

## Apache Reference Config

Use only if hosting behind Apache (non-Vercel static host).

```apache
Options -MultiViews
RewriteEngine On

# Keep existing files untouched
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# SPA fallback
RewriteRule ^ index.html [QSA,L]

# Security headers for your shell page
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

> Do **not** proxy `/onboarding` to Google via `ProxyPass` unless you accept upload breakage risk.

---

## Nginx Reference Config

```nginx
server {
    listen 443 ssl http2;
    server_name www.anupaatnivesh.com anupaatnivesh.com;

    root /var/www/anupaat/build;
    index index.html;

    # API pass-through example (if needed)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # SPA route handling
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Basic hardening headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
}
```

---

## Cloudflare Worker Proxy (Not Recommended for Upload Flow)

If you still want URL masking through Worker:

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname !== "/onboarding") {
      return new Response("Not found", { status: 404 });
    }

    const target = new URL(
      "https://script.google.com/macros/s/AKfycbyz7TLi26OXU1aPSgIopz95dEbXYrkTHKRD51tWf8Zc4EgBahsY7-evXMs6-E7U_pcL7Q/exec?v=10"
    );

    const upstreamReq = new Request(target.toString(), request);
    upstreamReq.headers.set("host", target.host);

    const resp = await fetch(upstreamReq, {
      redirect: "follow",
      cf: { cacheTtl: 0, cacheEverything: false }
    });

    const headers = new Headers(resp.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");

    return new Response(resp.body, {
      status: resp.status,
      headers
    });
  }
};
```

Use only after testing real file uploads from:
- iOS Safari
- Android Chrome
- desktop Chrome/Firefox/Safari

---

## Security Considerations

- Keep onboarding page over HTTPS only.
- Use strict referrer policy (`strict-origin-when-cross-origin`).
- Do not inject user content into iframe URL.
- Keep iframe `src` pinned to trusted Apps Script URL.
- Avoid storing uploaded files via your own proxy unless required.
- Monitor Apps Script deployment permissions:
  - execute as intended account
  - access level set correctly for your onboarding audience

---

## Deployment Steps

1. Deploy React app with `/onboarding` route.
2. Confirm deep-link support (`/onboarding` refresh should load app).
3. Verify Google Apps Script deployment is latest and public scope is correct.
4. Open `https://www.anupaatnivesh.com/onboarding` on mobile + desktop.
5. Complete full flow including file upload and submission.
6. Validate that browser address bar stays on your domain.

---

## Debugging Checklist (If Uploads Fail)

1. Open browser DevTools -> Network:
   - confirm POST goes to Google Apps Script endpoint
   - confirm status is `200`/`302` and no CORS block
2. Check Google Apps Script deployment:
   - deployed as Web App
   - correct version published
   - access permissions match expected users
3. Test direct URL once:
   - if direct URL upload fails too, issue is Apps Script/form config
4. Check iframe policy:
   - if frame is blocked, browser console shows frame/XFO/CSP errors
5. Validate file size/type limits in Google Form and Apps Script logic.
6. Re-test on mobile networks (4G/5G) for timeout behavior.

---

## Final Recommendation

For your requirement set, **keep `/onboarding` as a React-hosted iframe wrapper** (implemented) and avoid reverse proxying uploads. It is the most stable production architecture with the lowest risk of breaking existing Google Apps Script upload and form behavior.
