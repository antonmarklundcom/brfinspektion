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
| `npm run build` | Production build (`output: standalone`) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests (pure logic only, no DB required) |
| `npm run test:e2e` | Playwright smoke suite (not yet added — see plan.md Phase 1) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate:dev` | Create/apply a migration locally |
| `npm run db:migrate:deploy` | Apply pending migrations in production (uses `DIRECT_URL`) |
| `npm run db:seed` | Seed the initial OWNER user |
| `npm run db:studio` | Prisma Studio |

Some tests in `tests/` (e.g. `tests/followups.test.ts`) are integration tests that require a
real `DATABASE_URL` and are skipped automatically when one isn't set. CI must provide a
disposable test database for that suite to run for real.

## Environment variables

See `.env.example` for the full list and inline notes. Do not commit `.env`.

## Deployment (Hostinger managed Node.js)

Full details in `architecture.md` §8. Summary:

1. `npm run build` produces `.next/standalone`, `.next/static`, and `public` — deploy all
   three per the operator's existing nextjs-deploy-hostinger playbook conventions.
2. Set env vars in hPanel (never commit secrets).
3. Neon IPv6 routing pitfall: use the **pooled** (`-pooler`) connection string for
   `DATABASE_URL`, and set `NODE_OPTIONS=--dns-result-order=ipv4first` in hPanel.
4. SSH npm PATH pitfall: deploy scripts must not assume `npm`/`node` resolve on a bare
   non-interactive SSH session — use absolute binary paths.
5. Run `npm run db:migrate:deploy` as an explicit deploy step (never automatically on boot).
6. Configure an external daily cron hitting `GET /api/cron/followups` with
   `Authorization: Bearer $CRON_SECRET` (Hostinger hPanel cron or cron-job.org — operator to
   confirm which, see architecture.md §6.4 / §10).
7. Point `brfentreprenad.se` at a 301 redirect to `/upphandling` (DNS-level preferred; the
   app's `proxy.ts` also handles it if the domain is routed to the same instance).

## Creating a partner user

No admin UI for user creation yet (Phase 2, see `plan.md`). Until then, create partner users
directly via Prisma Studio (`npm run db:studio`) or a one-off script modeled on
`prisma/seed.ts` — set `role: "PARTNER"` and `partnerId` to the relevant `Partner` record.

## Open items before this is a finished product

See `plan.md` §5 ("Open decisions & missing data") for the full list — most notably the
calculator's pricing coefficients (`lib/calculator-config.ts`, marked `TODO-PRICING`),
partner revenue-share terms, and committable public pricing.
