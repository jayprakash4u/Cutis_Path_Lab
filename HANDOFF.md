# Handoff Notes — Cutis Path Lab

## Local development (current setup)

```bash
npm install
npm run dev
```

- **Database:** MySQL 8 (`cutispathlab`), accessed through `src/lib/mysql.js` — a `mysql2` connection pool using parameterized queries.
- **Env:** Copy `.env.example` → `.env.local` and fill in the `MYSQL_*` values.
- **DB setup:** `npm run db:init` (schema) then `npm run db:seed` (catalog + content), or `npm run db:setup` for both.

### Route structure

`src/app` is split into two route groups. Parentheses mean the folder does **not**
appear in the URL — `/about` and `/admin/login` are unchanged.

- `(site)/` — public pages
- `(admin)/admin/` — staff panel, with nested `(auth)` (login) and `(dashboard)` groups
- `api/`, `layout.jsx`, `globals.css`, `robots.js`, `sitemap.js` stay at the root

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
- All SQL is parameterized (`?` placeholders) — no string-interpolated values
- `?active=false` on referrals/categories/gallery/testimonials requires admin login

## Remaining for senior / production deploy

### Database

Migrated off Windows-only `sqlcmd`/SQL Server to **MySQL 8 via `mysql2`**, so the app
now runs on any platform. Remaining hardening:

- MySQL is reachable on a public port; restrict the firewall to known IPs, or move to an SSH tunnel / private network.
- Set `MYSQL_SSL=true` once the server presents a valid certificate, so credentials aren't sent in the clear.
- Grant the app user only the privileges it needs (`SELECT/INSERT/UPDATE/DELETE`), not `ALL`.

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
| `MYSQL_HOST` | Yes | MySQL server host |
| `MYSQL_PORT` | Yes | Usually `3306` |
| `MYSQL_DATABASE` | Yes | `cutispathlab` |
| `MYSQL_USER` | Yes | App database user |
| `MYSQL_PASSWORD` | Yes | App database password |
| `MYSQL_SSL` | Recommended | `true`, or `skip-verify` for self-signed certs |
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
| `npm run db:init` | Create MySQL schema (safe to re-run) |
| `npm run db:seed` | Seed catalog + content (leaves bookings/messages untouched) |
| `npm run db:setup` | `db:init` then `db:seed` |
