# Media Admin Hostinger Setup

This guide configures `/mediadata` with backend username/password auth and auto-publish media.

## 1) Database migration (MySQL)

Run:

```sql
source db/migrations/20260513_media_items.sql;
```

Or copy SQL and execute in Hostinger MySQL console.

## 2) Backend dependencies

These are already added in `package.json`:

- `express-session`
- `cookie-parser`
- `mysql2`
- `bcryptjs`

## 3) Generate password hash

Run locally:

```bash
node -e "const b=require('bcryptjs');console.log(b.hashSync('YourStrongPassword',12))"
```

Copy the printed hash.

## 4) Environment variables (Hostinger Node app)

Set these in Hostinger panel:

- `MEDIA_ADMIN_USERNAME`
- `MEDIA_ADMIN_PASSWORD_HASH`
- `MEDIA_SESSION_SECRET`
- `MEDIA_UPLOAD_DIR` (example: `/home/username/apps/anupaat/uploads/media`)
- `MEDIA_FILES_BASE_URL` (example: `https://www.anupaatnivesh.com/media-files`)
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS` (include `https://www.anupaatnivesh.com`)
- existing app env vars already used by payments/onboarding

## 5) Static media files mapping

The server exposes uploads via:

- `GET /media-files/<filename>`

Because `server.mjs` uses:

- `app.use('/media-files', express.static(getMediaUploadDir()));`

Ensure `MEDIA_UPLOAD_DIR` points to a writable directory.

## 6) Verify login + publish flow

1. Open `https://www.anupaatnivesh.com/mediadata`
2. Login with `MEDIA_ADMIN_USERNAME` + password.
3. Add media via upload or URL + purpose.
4. Confirm item appears in the list.
5. Visit homepage and verify Media Presence updates immediately.

## 7) Troubleshooting

- `401 Unauthorized` on admin endpoints:
  - check session cookies are allowed and HTTPS is enabled.
- `503 Media auth is not configured`:
  - missing one of `MEDIA_ADMIN_USERNAME`, `MEDIA_ADMIN_PASSWORD_HASH`, `MEDIA_SESSION_SECRET`.
- `500 Media DB is not configured`:
  - check `DB_*` env vars.
- Upload works but image/video not visible:
  - check `MEDIA_UPLOAD_DIR` permissions and `MEDIA_FILES_BASE_URL`.

## 8) Optional Vercel fallback

If you keep Vercel for backend temporarily, media upload directory defaults to `/tmp/anupaat-media` (ephemeral). For persistence, use Hostinger or external object storage.
