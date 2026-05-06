# Client Onboarding Production Setup (Beginner-Friendly)

This guide sets up the onboarding flow with:
- **Railway** for backend hosting
- **Supabase Storage** for document files
- **Supabase Postgres** for onboarding metadata
- **Resend** for new-submission email alerts

This is a cost-effective stack with generous free tiers for early usage.

## 1) Supabase setup

1. Create a new Supabase project.
2. Go to **Storage** and create bucket:
   - Name: `onboarding-documents`
   - Access: **Private**
3. Go to **SQL Editor**, run:

```sql
create table if not exists public.onboarding_submissions (
  submission_id text primary key,
  received_at timestamptz not null default now(),
  payload jsonb not null,
  files jsonb not null default '[]'::jsonb,
  source_ip text not null default '',
  user_agent text not null default ''
);
```

4. Go to **Project Settings > API** and copy:
   - `Project URL` -> `SUPABASE_URL`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`

> Keep service role key secret. Use only on backend.

## 2) Resend setup

1. Create account on Resend.
2. Verify your sending domain.
3. Create API key.
4. Keep these ready:
   - `RESEND_API_KEY`
   - `ONBOARDING_ALERT_FROM_EMAIL` (verified sender)
   - `ONBOARDING_ALERT_TO_EMAIL` (ops inbox)

## 3) Railway backend deploy

1. Push this repo to GitHub.
2. Create Railway project from this repo.
3. In Railway service settings:
   - Start command: `npm run server`
   - Root: repo root
4. Add environment variables:
   - `NODE_ENV=production`
   - `CORS_ALLOWED_ORIGINS=https://www.anupaatnivesh.com,https://anupaatnivesh.com`
   - `SUPABASE_URL=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - `SUPABASE_STORAGE_BUCKET=onboarding-documents`
   - `SUPABASE_ONBOARDING_TABLE=onboarding_submissions`
   - `RESEND_API_KEY=...`
   - `ONBOARDING_ALERT_FROM_EMAIL=KYC Bot <noreply@yourdomain.com>`
   - `ONBOARDING_ALERT_TO_EMAIL=ops@anupaatnivesh.com`
5. Deploy and copy the public Railway URL.

## 4) Frontend production config

Set these in your frontend deployment environment:
- `REACT_APP_API_BASE_URL=https://<your-railway-backend-domain>`
- `REACT_APP_AMFI_ARN=ARN-347085`

Rebuild frontend and deploy.

## 5) Verification checklist

1. Open `/client-onboarding`.
2. Fill form and upload test files.
3. Submit.
4. Confirm:
   - API returns success + submission id
   - New row appears in `onboarding_submissions`
   - Files appear in Supabase bucket path `onboarding/<submission-id>/...`
   - Email alert is received on ops inbox

## 6) Low-cost operations checklist

- Keep Supabase bucket private.
- Store only required documents.
- Add lifecycle cleanup later (e.g. auto-delete after 180 days).
- Restrict CORS to your website domains only.
- Never expose service role key to frontend.

## 7) If something fails

- `Cloud storage is not configured` response means Supabase vars missing.
- `Failed to save submission record` means DB table/permissions issue.
- No alert email means Resend domain/key/from email not fully configured.
