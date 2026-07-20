# BRF Inspektion

Lead-generation and CRM platform for BRF Inspektion. See `plan.md`, `architecture.md`,
`strategy.md`, and `keyword-data.md` in the repo root for the full build spec — this README
is local dev/deploy instructions only.

## Local development

```bash
npm install
cp .env.example .env   # fill in real values, see below
npx prisma generate
npx prisma migrate dev # requires DATABASE_URL + DIRECT_URL pointing at a real Postgres
npm run db:seed        # requires SEED_OWNER_EMAIL / SEED_OWNER_PASSWORD in .env
npm run dev
```

The app runs without a database for browsing public pages, but the calculator, contact
forms, and all of `/admin` require `DATABASE_URL`/`DIRECT_URL` to be set (Neon Postgres —
see architecture.md §1).

**Windows PowerShell:** if you redirect Prisma CLI output to a file (e.g. via `>` or
`Out-File`), always specify UTF-8 encoding explicitly (`-Encoding utf8` /
`Set-Content -Encoding utf8`). PowerShell's default UTF-16 output corrupts `.env` and
`schema.prisma` for Prisma's parser (architecture.md §8.2).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (pure logic only, no DB required) |
| `npm run test:e2e` | Playwright smoke suite (architecture.md §9 test #5) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate:dev` | Create/apply a migration locally |
| `npm run db:migrate:deploy` | Apply pending migrations in production (uses `DIRECT_URL`) |
| `npm run db:seed` | Seed the initial OWNER user |
| `npm run db:studio` | Prisma Studio |

Some tests in `tests/` (e.g. `tests/followups.test.ts`, `tests/crm-loop.test.ts`) are
integration tests that require a real `DATABASE_URL` and are skipped automatically when one
isn't set. CI provides a disposable Postgres service container for that suite to run for real
(see `.github/workflows/ci.yml`).

`npm run test:e2e` (Playwright) needs `DATABASE_URL`/`DIRECT_URL` (migrated + seeded) and
`SEED_OWNER_EMAIL`/`SEED_OWNER_PASSWORD` set to exercise the calculator, contact form, and
admin login flows — without them those specs skip and only the DB-independent specs
(homepage, schema markup, sitemap/robots, unauthenticated `/admin` redirect) run. It builds
and starts the app itself (`webServer` in `playwright.config.ts`), so no separate `npm run
dev` is needed first. If your environment pre-installs a Chromium revision that doesn't match
this repo's pinned `@playwright/test` version, set `PLAYWRIGHT_CHROMIUM_PATH` to that binary
instead of running `playwright install`.

## Environment variables

See `.env.example` for the full list and inline notes. Do not commit `.env`.

## Deployment (Hostinger managed Node.js)

Full details in `architecture.md` §8. This is the managed GitHub-integration flow (no
SSH/PM2/Nginx needed) — the `nextjs-deploy-hostinger` playbook's standard path:

1. Push this branch to `main` (Hostinger deploys from a branch, cleanest is `main`).
2. hPanel → **Websites → Add Website → Node.js Apps → Import Git Repository** → authorize
   GitHub → select `antonmarklundcom/brfinspektion`, branch `main`.
3. Verify auto-detected settings: **Node.js version 22**, build command `npm run build`,
   start command `npm start`. (There is deliberately no `output: "standalone"` in
   `next.config.ts` — `next start` does not work correctly with that setting, confirmed
   locally, so the default server output is what Hostinger's `npm start` expects.)
4. Add every variable from `.env.example` in hPanel (never commit secrets) — see the table
   below. Set `AUTH_URL` to the actual deployed URL (the `hostingersite.com` one at first;
   update it again once the custom domain is mapped, then redeploy).
5. Deploy.
6. Run the one-time DB setup **from your local machine, not via Hostinger SSH** — Hostinger's
   shared servers have broken IPv6 routing to Neon's Postgres endpoints, which breaks Prisma
   over an SSH shell. Locally, with `DATABASE_URL`/`DIRECT_URL` in `.env` pointed at the real
   Neon database:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
7. Map the custom domain (`brfinspektion.se`) in the app's Hostinger settings — DNS + SSL
   handled there if the domain is on Hostinger; otherwise an A/CNAME record pointing at what
   Hostinger provides. Update `AUTH_URL` to `https://brfinspektion.se` and redeploy.
8. Point `brfentreprenad.se` at a 301 redirect to `/upphandling` (DNS-level preferred; the
   app's `proxy.ts` also handles it if that domain is ever routed to the same instance).
9. Configure an external daily cron hitting `GET /api/cron/followups` with
   `Authorization: Bearer $CRON_SECRET` (Hostinger hPanel cron or cron-job.org — architecture.md
   §6.4 / §10; operator to confirm which).
10. Post-deploy checklist: app loads on the Hostinger URL, then the custom domain with valid
    SSL; login works with the real Owner credentials (rotate the seed password immediately if
    it was ever a placeholder); a calculator/contact submission writes a real `Lead` row;
    `/sitemap.xml` and `/robots.txt` are reachable; note which Hostinger account/slot this
    occupies.

### Environment variables to set in hPanel

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** (`-pooler`) connection string |
| `DIRECT_URL` | Neon **direct** connection string (only used locally for migrations, but harmless to set) |
| `AUTH_SECRET` | Generate with `npx auth secret` — different from any local dev value |
| `AUTH_URL` | The real deployed URL, e.g. `https://brfinspektion.se` (update + redeploy after domain mapping) |
| `RESEND_API_KEY` | From the operator's Resend account (or swap `lib/email.ts` for SMTP — see architecture.md §1) |
| `NOTIFY_EMAIL` | Where new-lead / digest emails go |
| `CRON_SECRET` | Long random string; must match what the external cron sends as `Authorization: Bearer …` |
| `NEXT_PUBLIC_GA_ID` | Leave blank until a real GA4 property exists |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_CALCULATOR_LABEL` / `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL` | Leave blank until the Ads go-live checklist (strategy.md §6.4) is cleared — see `docs/google-ads-campaigns.md` |
| `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD` | Only needed locally when running `npm run db:seed` against production — not required as a live hPanel var, but harmless to set |

## Creating a partner user

The Owner creates partner (and additional Owner) logins directly in the running app at
`/admin/installningar` — no Prisma Studio needed. `npm run db:seed` still creates the Partner
A / Partner B *organization* records automatically (name and service types only — no
credentials, since revenue-share terms aren't finalized, see plan.md D2/D10); the
installningar form is what turns "a partner org exists" into "that partner can log in."

## Open items before this is a finished product

See `plan.md` §5 ("Open decisions & missing data") for the full list — most notably the
calculator's pricing coefficients (`lib/calculator-config.ts`, marked `TODO-PRICING`),
partner revenue-share terms, and committable public pricing.
