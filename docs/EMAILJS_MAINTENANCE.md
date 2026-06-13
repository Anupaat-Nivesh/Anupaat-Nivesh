# EmailJS maintenance (interim until Resend is live)

Use this while production still falls back to EmailJS when the Resend API is not configured.

## Verify Gmail connection (do now)

1. [EmailJS Dashboard](https://dashboard.emailjs.com/) → **Email Services**
2. Open your Gmail service → status must be **Connected** (green)
3. Smoke test on live site:
   - https://www.anupaatnivesh.com/contact
   - Homepage lead form (if enabled)
4. Confirm mail arrives at `info@anupaatnivesh.com`

## If users see “email service needs to be reconfigured”

1. EmailJS → **Email Services** → **Reconnect** Gmail
2. No Hostinger redeploy required
3. Re-test contact form

## 60-day calendar reminder

Set a recurring reminder (every 60 days):

> Check EmailJS Gmail connection — Anupaat Nivesh  
> Dashboard: https://dashboard.emailjs.com/admin

After Resend is verified and contact API health returns `"configured": true`, you can stop EmailJS reconnect checks for contact forms (keep until all flows are off EmailJS).

## When to retire EmailJS

Complete [CONTACT_EMAIL_SETUP.md](./CONTACT_EMAIL_SETUP.md) Phase 2, then verify:

```bash
curl -s https://anupaat-nivesh.vercel.app/api/contact/health
# {"ok":true,"configured":true}
```

When configured, forms use Resend first; EmailJS is only a silent fallback if the API returns 503.
