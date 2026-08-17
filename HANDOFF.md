# Handoff Notes — Cutis Path Lab

## Local development (current setup)

```bash
npm install
npm run dev
```

- **Database:** MySQL, database `cutispathlab`, accessed through `src/lib/mysql.js` (`mysql2/promise`).
- **Env:** Copy `.env.example` → `.env.local` and fill in values.
- **DB init:** See `package.json` scripts `db:init`, `db:seed`.

## Production items already done

- Admin-only access on `GET /api/bookings/[id]` (patient data protected)
- Rate limiting on contact, booking POST, and admin login
- Honeypot anti-bot fields on contact form
- Contact form email notifications to lab
- HTML-escaped email bodies (XSS-safe)
- `ADMIN_SESSION_SECRET` required in production
- Generic admin auth errors (no env/config hints to clients)
- Security headers including HSTS in production
- `robots.txt`, `sitemap.xml`, Open Graph metadata
- Health check: `GET /api/health`
- Sanitized API errors in production across all routes
- Sanitized database errors in production (`src/lib/mysql.js`)
- `?active=false` on referrals/categories/gallery/testimonials requires admin login

## Remaining for senior / production deploy

### Database

The app uses MySQL via `mysql2`. For production, provision a MySQL instance and set `MYSQL_*` env vars in `.env.local`.

### File uploads

Admin uploads (gallery, referrals, categories) write to `public/images/`. Move to **Google Cloud Storage** (or S3) for ephemeral/serverless hosts.

### Optional hardening

- Redis-backed rate limiting for multi-instance deploys
- CAPTCHA (reCAPTCHA / Turnstile) on public forms
- bcrypt-hashed admin password or external IdP
- Object storage CDN for images
- Structured logging (Cloud Logging, Sentry)
- `Dockerfile` + Cloud Run / VM deploy config

## Environment variables

| Variable | Required | Notes |
|----------|----------|-------|
| `MYSQL_HOST` | Yes | MySQL host |
| `MYSQL_PORT` | Yes | MySQL port |
| `MYSQL_DATABASE` | Yes | MySQL database name |
| `MYSQL_USER` | Yes | MySQL user |
| `MYSQL_PASSWORD` | Yes | MySQL password |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for SEO |
| `ADMIN_SESSION_SECRET` | Production | Long random string |
| `ADMIN_PASSWORD` | Yes | Strong password |
| `SMTP_*` | Recommended | Booking + contact emails |
| `BOOKING_NOTIFY_EMAIL` | Recommended | Lab inbox |

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Run production build |
| `npm run lint` | ESLint |
| `npm run db:init` | Initialize MySQL schema |
| `npm run db:seed` | Seed MySQL data |
