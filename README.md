# মনের মানুষ (Moner Manush)

A dating platform for adults (18+) in Bangladesh, built with Next.js (App
Router), TypeScript, Tailwind CSS and Prisma/PostgreSQL.

**Important product rules baked into this codebase:**

- There is **no public sign-up**. Members never create their own accounts —
  an admin creates every account (User ID + temporary password) from the
  admin panel, after membership payment and identity/age verification.
- Every member must be **18 years or older** (enforced at the schema and
  form-validation level — the admin "new member" form rejects ages under 18).
- No stock or scraped photos are shipped. Members without an admin-uploaded,
  consented photo show a generated initials avatar
  (`src/lib/avatar.ts` / `src/components/ui/Avatar.tsx`).
- Demo/seed members are clearly flagged `isDemo: true` in the database and
  carry a visible "Demo" badge in the UI. **Remove them before going live**
  (see "Removing demo data" below).

---

## 1. Requirements

- Node.js 20+
- A PostgreSQL database (local via Docker, or a managed provider — see
  "Production deployment")

## 2. Local setup

```bash
# 1. Install dependencies
npm install

# 2. Start a local PostgreSQL instance (or point DATABASE_URL at your own)
docker compose up -d

# 3. Copy the environment template and fill in values
cp .env.example .env
# then edit .env — at minimum set SESSION_SECRET

# 4. Run migrations
npm run db:migrate

# 5. Seed demo data (an admin login + 3 membership plans + 10 demo members)
npm run db:seed

# 6. Start the dev server
npm run dev
```

Visit http://localhost:3000 for the public site and
http://localhost:3000/admin/login for the admin panel.

The seed script prints the generated admin login to the terminal
(`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from your `.env`, defaults to
`admin@monermanush.net` / `ChangeMe123!`). **Change this password immediately
in a real deployment.**

Demo members are created with random temporary passwords that are *not*
printed (only the admin account's is, since that's how you get into the
panel). To log in as a demo member for testing, reset their password from
the admin panel (`/admin/members/[id]` → "নতুন Temporary Password তৈরি
করুন") or via Prisma Studio (`npm run db:studio`).

## 3. Environment variables

See `.env.example` for the full list. Key ones:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Signs session JWTs — generate with `openssl rand -base64 48` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (digits only) used by every "WhatsApp-এ..." button and the floating chat button |
| `NEXT_PUBLIC_SITE_URL` | Used for SEO metadata, Open Graph tags and the sitemap |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Bootstrap admin account created by `npm run db:seed` |

## 4. Database: PostgreSQL / MySQL / Cloudflare D1

The schema (`prisma/schema.prisma`) ships configured for **PostgreSQL**,
which is what the app has been built and tested against.

- **PostgreSQL (recommended)** — works as-is. Any managed Postgres
  (Neon, Supabase, Railway, RDS, etc.) works — just set `DATABASE_URL`.
- **MySQL** — change `datasource db { provider = "mysql" ... }` in
  `prisma/schema.prisma`, remove the Postgres-only `mode: "insensitive"`
  filter options used in a few `findMany` calls (`src/lib/data.ts`,
  `src/app/api/admin/members/route.ts`, `src/app/admin/members/page.tsx`),
  and re-run `npx prisma migrate dev`.
- **Cloudflare D1** — D1 uses SQLite semantics and Prisma's D1 driver
  adapter, which is a larger structural change (edge runtime, adapter-based
  `PrismaClient`, no native `Json` column type — `MembershipPlan.features`
  would need to become a serialized string). Only take this path if you're
  deploying to Cloudflare Workers/Pages; otherwise PostgreSQL is simpler.

## 5. Production photo storage

In development, nothing is uploaded anywhere — members without a real photo
just get a generated avatar. When you're ready to let admins upload real,
consented member photos:

1. Add a `MemberPhoto` upload endpoint under `src/app/api/admin/members/[id]/photos`
   that streams the file to **private** object storage (S3, Cloudflare R2,
   Backblaze B2, etc.) — never to `public/`, since anything in `public/` is
   served to anyone with the URL.
2. Store the storage key (not a public URL) in `MemberPhoto.url`.
3. Serve photos through an authenticated route handler that checks
   `getSession()` before generating a short-lived signed URL, so only
   logged-in members can view them.

## 6. Removing demo data before going live

```bash
npx prisma studio
# delete all Member rows where isDemo = true, and their cascaded
# Wallet / Membership / WalletTransaction rows

# or, from the app's Postgres directly:
psql "$DATABASE_URL" -c "DELETE FROM \"Member\" WHERE \"isDemo\" = true;"
```

Membership plans seeded by `npm run db:seed` (Basic/Premium/VIP) are **not**
demo data — they're real starter plans. Edit their price/features from
`/admin/plans` to match your actual pricing before launch.

## 7. Production deployment

### Option A — Vercel + managed Postgres

1. Push this repo to GitHub.
2. Create a Postgres database (Neon, Supabase, or Vercel Postgres) and copy
   its connection string.
3. Import the repo into Vercel, set the environment variables from
   `.env.example` in the Vercel dashboard (`DATABASE_URL`,
   `SESSION_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`).
4. Run migrations once against the production database:
   ```bash
   DATABASE_URL="<production-url>" npx prisma migrate deploy
   DATABASE_URL="<production-url>" SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npx prisma db seed
   ```
5. Deploy. Vercel builds with `npm run build` automatically.

### Option B — VPS (e.g. a Bangladesh-based provider) with PM2 + Nginx

```bash
git clone <your-repo-url>
cd moner-manush
npm ci
cp .env.example .env   # fill in production values
npx prisma migrate deploy
npm run build
pm2 start npm --name moner-manush -- start
```

Put Nginx in front as a reverse proxy to `localhost:3000`, and terminate TLS
there (Let's Encrypt via certbot) so `www.monermanush.net` is served over
HTTPS — required for secure cookies (`SESSION_SECRET`-signed session cookies
are marked `secure` in production, see `src/lib/session.ts`).

## 8. Security notes

- Passwords are hashed with bcrypt (`src/lib/password.ts`, 12 salt rounds) —
  never stored in plain text.
- Sessions are signed JWTs in an `httpOnly`, `sameSite=lax` cookie
  (`src/lib/jwt.ts`, `src/lib/session.ts`); `secure` is enabled automatically
  when `NODE_ENV=production`.
- `src/proxy.ts` (Next.js's route-interception layer) enforces
  role-based access to `/dashboard/*` (members only) and `/admin/*` (admins
  only) before any page code runs.
- Login attempts are rate-limited per IP+identifier
  (`src/lib/rate-limit.ts`). This is in-memory and per-process — swap it for
  a shared store (Upstash Redis, Vercel KV) if you deploy more than one
  server instance.
- First-time member login forces a password change
  (`Member.mustChangePassword`, enforced by `/dashboard/settings`).

## 9. Project structure

```
prisma/schema.prisma        Data model
prisma/seed.ts               Demo data seed script
src/proxy.ts                Role-based route protection
src/lib/                    Auth, password hashing, validation, WhatsApp links, avatars
src/app/(public pages)      Landing page, profile listing/detail, membership, security, contact, login
src/app/dashboard/          Member dashboard (protected)
src/app/admin/              Admin panel (protected)
src/app/api/                Route handlers for auth, member actions, admin actions
src/components/             UI building blocks, grouped by area
```
