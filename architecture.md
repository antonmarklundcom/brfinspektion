# architecture.md — BRF Inspektion: Technical Architecture

> Companion to `plan.md` (build order) and `strategy.md` (business/SEO/Ads). This file is
> the technical spec. Where a choice is made here, it is decided — implement it. Where an
> item says **CONFIRM WITH OPERATOR**, implement the documented fallback and flag it; do
> not silently pick something else.

## 1. Stack decisions (final)

| Layer | Choice | Why / notes |
|---|---|---|
| Framework | **Next.js 15+, App Router, TypeScript, React Server Components** | Required by brief; programmatic page generation from shared components (keyword-variant consolidation) rules out static HTML. |
| Styling | **Tailwind CSS** | Fast, consistent, no runtime CSS-in-JS cost; matches mobile-first requirement. |
| DB | **Neon Postgres (EU region — pick `eu-central-1` Frankfurt unless operator's existing Neon org says otherwise)** + **Prisma ORM** | Required by brief. EU region matters for GDPR posture and latency. Use the **pooled** connection string (`-pooler` host) as `DATABASE_URL` and the direct string as `DIRECT_URL` for migrations. |
| Auth | **Auth.js (NextAuth v5), Credentials provider, JWT session strategy** | 3–5 known users, no self-signup, no OAuth needed. Passwords bcrypt-hashed (`bcryptjs`, cost 12). JWT strategy avoids DB session reads on every request and works cleanly on a single Node process. |
| Email | **Resend** (HTTP API) | Works from any host (no SMTP port worries on shared/managed hosting), simple API, EU-friendly. **CONFIRM WITH OPERATOR** that a Resend account + verified sending domain (`no-reply@brfinspektion.se`, SPF/DKIM DNS records) is created — this is plan.md D8. Fallback if operator prefers: Hostinger SMTP via `nodemailer`; isolate behind the `lib/email.ts` interface so the swap is one file. |
| Validation | **Zod** everywhere a request body crosses a boundary (forms, API routes, cron endpoint). | |
| Analytics | **GA4** via `@next/third-parties`, loaded only after cookie consent (see §6.2). | |
| Scheduler | External cron hitting a secured API route (see §6.4). | |
| Hosting | Hostinger managed Node.js (see §8). | |
| Repo/CI | GitHub, GitHub Actions for lint/typecheck/test on PR (see §9). | |

Explicitly rejected alternatives (do not revisit): separate headless CMS (content volume is
small and code-managed MDX is enough); external CRM SaaS (partner-scoped access + statutory
follow-up automation is core IP and must be first-class in the data model); spreadsheet
backend (forbidden by brief); Vercel hosting (operator's playbook is Hostinger).

## 2. Repository & route structure

```
/
├── app/
│   ├── (public)/                      # public marketing layout group
│   │   ├── layout.tsx                 # header, footer, Organization JSON-LD
│   │   ├── page.tsx                   # /
│   │   ├── stambyte/
│   │   │   ├── page.tsx               # /stambyte
│   │   │   ├── kostnad/page.tsx       # /stambyte/kostnad
│   │   │   └── behovsbedomning/page.tsx
│   │   ├── kostnadskalkyl/page.tsx    # calculator (client component island)
│   │   ├── statusbesiktning/page.tsx
│   │   ├── kontrollansvarig/page.tsx
│   │   ├── entreprenadbesiktning/page.tsx
│   │   ├── garantibesiktning/page.tsx # consolidated 2yr/5yr, FAQPage schema
│   │   ├── ovk-besiktning/page.tsx
│   │   ├── upphandling/page.tsx       # brfentreprenad.se redirect target
│   │   ├── underhallsplan/page.tsx
│   │   ├── guider/
│   │   │   ├── page.tsx               # guide index
│   │   │   └── [slug]/page.tsx        # MDX-driven guides
│   │   ├── om-oss/page.tsx
│   │   ├── kontakt/page.tsx
│   │   ├── integritetspolicy/page.tsx
│   │   └── villkor/page.tsx
│   ├── admin/                         # role-gated, noindex, not in sitemap
│   │   ├── layout.tsx                 # auth guard + admin nav
│   │   ├── page.tsx                   # dashboard
│   │   ├── leads/page.tsx             # pipeline list
│   │   ├── leads/[id]/page.tsx        # lead detail
│   │   ├── kunder/page.tsx            # customers
│   │   ├── kunder/[id]/page.tsx       # customer + projects + tasks
│   │   ├── uppgifter/page.tsx         # follow-up tasks (due/upcoming)
│   │   └── installningar/page.tsx     # users (Owner only)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── leads/route.ts             # POST from forms/calculator (public, zod-validated, rate-limited)
│   │   └── cron/followups/route.ts    # GET/POST, guarded by CRON_SECRET header
│   ├── sitemap.ts
│   ├── robots.ts
│   └── middleware.ts                  # /admin guard + brfentreprenad.se host redirect
├── components/
│   ├── ui/                            # buttons, cards, form fields, section shells
│   ├── marketing/                     # Hero, ServiceLadder, ProcessSteps, FaqAccordion,
│   │                                  # PriceIndicator, TrustBar, LeadForm, CtaBand
│   └── admin/                         # PipelineBoard/List, LeadCard, StatusBadge, TaskList
├── content/
│   └── guider/*.mdx                   # guide content, frontmatter: title, description,
│                                      # publishedAt, faq[] (drives FAQPage schema)
├── lib/
│   ├── prisma.ts                      # singleton client
│   ├── auth.ts                        # Auth.js config + role helpers
│   ├── email.ts                       # all outbound mail behind one interface
│   ├── calculator.ts                  # pure function: inputs -> estimate (see §3)
│   ├── calculator-config.ts           # coefficients (TODO-PRICING, see §3.3)
│   ├── schema-org.ts                  # JSON-LD builders (Organization/Service/FAQPage)
│   ├── followups.ts                   # task-generation rules (see §4.6)
│   └── seo.ts                         # metadata helpers, canonical builder
├── prisma/
│   ├── schema.prisma
│   └── seed.ts                        # Owner user + partner records
├── scripts/                           # deploy helpers (see §8)
└── tests/                             # vitest + playwright (see §9)
```

Conventions:
- One page = one primary intent; shared components (`FaqAccordion`, `PriceIndicator`,
  `LeadForm`, `ProcessSteps`) are how near-duplicate keyword variants (2 års/5 års ×
  brf/bostadsrätt/lägenhet; OVK × bostadsrätt/brf/lägenhet) are consolidated onto ONE page
  each with FAQPage schema, instead of thin per-variant pages. The variant phrasings live in
  the FAQ questions and body copy of the consolidated page (see strategy.md §4).
- Every public page exports `generateMetadata` with title, description, and canonical
  (absolute, `https://brfinspektion.se/...`).
- `/admin` and `/api` are excluded from sitemap; `robots.ts` disallows `/admin`.
- Guides are MDX in-repo, not a CMS. Frontmatter `faq` array renders both the visible
  accordion and the FAQPage JSON-LD from one source (schema must always match visible
  content — never emit schema for content not on the page).

## 3. The calculator (`/kostnadskalkyl`)

### 3.1 Inputs (all Swedish labels, mobile-first single-column form)

| Field | Type | Label (sv) | Required |
|---|---|---|---|
| byggAr | number select (decade buckets 1930→2010+) | "Byggår" | yes |
| antalLagenheter | number | "Antal lägenheter" | yes |
| stamTyp | enum select | "Typ av stammar" — options: Gjutjärn, Plast/PVC, Koppar, Relinade, Vet ej | yes |
| senasteStambyte | select | "Senaste stambyte/relining" — Aldrig/0–10 år/10–30 år/30+ år/Vet ej | yes |
| kannedaProblem | multi-checkbox | "Kända problem" — Fuktskador, Dålig lukt, Stopp/läckage, Inga kända | no |
| brfNamn | text | "Föreningens namn" | yes |
| kontaktNamn | text | "Ditt namn" | yes |
| epost | email | "E-post" | yes |
| telefon | tel | "Telefon" | no |
| roll | select | "Din roll" — Styrelseledamot/Ordförande/Förvaltare/Boende/Annat | no |
| consent | checkbox | GDPR consent, link to /integritetspolicy | yes |

### 3.2 Output

Pure function in `lib/calculator.ts`: `(inputs) => { rangeLowSek, rangeHighSek, perApartmentLow,
perApartmentHigh, riskBand: 'LAG' | 'MEDEL' | 'HOG' | 'AKUT', riskFactors: string[] }`.
Risk band from age + stamtyp + senasteStambyte + problems (rule table in
`calculator-config.ts`, unit-tested). Result rendered on screen immediately AND emailed to
the submitter (this is the lead-magnet exchange), AND stored as a `Lead` with
`type=CALCULATOR` and full inputs + computed output in `calculatorData` JSON.

### 3.3 Coefficients — DO NOT INVENT

`calculator-config.ts` ships with placeholder per-apartment cost range constants marked
`// TODO-PRICING (plan.md D1): values must come from Partner B — placeholders are
deliberately wide and labeled "grov uppskattning" in UI`. The UI copy must present the
number as a rough national range and immediately pivot to the risk assessment and the
statusbesiktning CTA. The executing model implements the *mechanism* (config → pure
function → tests with the placeholder values) and leaves the calibration to the operator.

### 3.4 Anti-abuse

Honeypot field + simple per-IP rate limit (in-memory LRU is fine on a single Node process;
note in code that multi-instance hosting would need a store) on `POST /api/leads`. No CAPTCHA
in v1 (friction kills B2B conversion; revisit if spam appears).

## 4. Data model — Prisma schema sketch

This is the intended schema. The executing model may adjust field nullability/indexes as
implementation reveals needs, but must not remove entities, enums, or the access-scoping
fields, and must document any deviation in the PR description.

```prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")    // Neon POOLED (-pooler) string
  directUrl = env("DIRECT_URL")      // Neon direct string, migrations only
}

enum Role { OWNER PARTNER }

enum LeadStatus { NEW CONTACTED QUALIFIED HANDED_OVER WON LOST }

enum LeadType { CALCULATOR CONTACT }

enum ServiceType {
  STATUSBESIKTNING          // tier 2, Partner B
  UPPHANDLINGSSTOD          // tier 3
  KONTROLLANSVARIG          // tier 4, Partner A
  ENTREPRENADBESIKTNING     // tier 4, Partner A
  GARANTIBESIKTNING_2AR     // recurring, Partner A
  GARANTIBESIKTNING_5AR     // recurring, Partner A
  OVK                       // recurring, Partner A (certification: plan.md D10)
  UNDERHALLSPLAN
  OVRIGT
}

enum StamTyp { GJUTJARN PLAST_PVC KOPPAR RELINADE VET_EJ }

enum ProjectStatus { PLANERAD PAGAENDE SLUTFORD AVBRUTEN }

enum TaskType { GARANTI_2AR GARANTI_5AR OVK_ATERKOMMANDE LEAD_UPPFOLJNING CUSTOM }

enum TaskStatus { PENDING DONE DISMISSED }

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  role         Role
  partnerId    String?             // set iff role == PARTNER
  partner      Partner?  @relation(fields: [partnerId], references: [id])
  active       Boolean   @default(true)
  createdAt    DateTime  @default(now())
  notes        Note[]
  statusEvents StatusEvent[]
}

model Partner {
  id        String   @id @default(cuid())
  name      String                    // e.g. "Partner A — KA/besiktning"
  services  ServiceType[]            // which tiers this partner delivers
  users     User[]
  leads     Lead[]
  projects  Project[]
  tasks     FollowUpTask[]
  createdAt DateTime @default(now())
}

model Lead {
  id               String     @id @default(cuid())
  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt
  type             LeadType
  status           LeadStatus @default(NEW)
  sourcePath       String                    // page the form was submitted from, e.g. "/stambyte"
  utm              Json?                     // utm_source/medium/campaign captured client-side
  // contact
  kontaktNamn      String
  epost            String
  telefon          String?
  roll             String?
  brfNamn          String
  kommun           String?
  // calculator payload (null for plain contact leads)
  byggAr           Int?
  antalLagenheter  Int?
  stamTyp          StamTyp?
  calculatorData   Json?                     // full inputs + computed output snapshot
  message          String?
  interestedIn     ServiceType?              // inferred from sourcePath, overridable in admin
  // pipeline
  assignedPartnerId String?
  assignedPartner  Partner?   @relation(fields: [assignedPartnerId], references: [id])
  customerId       String?
  customer         Customer?  @relation(fields: [customerId], references: [id])
  consentAt        DateTime                  // GDPR consent timestamp
  notes            Note[]
  statusEvents     StatusEvent[]
  tasks            FollowUpTask[]

  @@index([status, createdAt])
  @@index([assignedPartnerId])
}

model Customer {
  id          String    @id @default(cuid())
  brfNamn     String
  orgNr       String?   @unique
  kommun      String?
  adress      String?
  // primary contact (board contacts rotate; keep simple, one primary + notes)
  kontaktNamn String?
  epost       String?
  telefon     String?
  ovkIntervalYears Int?          // 3 or 6 — set manually by Owner (plan.md D7), never defaulted
  createdAt   DateTime  @default(now())
  leads       Lead[]
  projects    Project[]
  tasks       FollowUpTask[]
  notes       Note[]
}

model Project {
  id            String        @id @default(cuid())
  customerId    String
  customer      Customer      @relation(fields: [customerId], references: [id])
  serviceType   ServiceType
  partnerId     String?
  partner       Partner?      @relation(fields: [partnerId], references: [id])
  status        ProjectStatus @default(PLANERAD)
  startDate     DateTime?
  completedDate DateTime?     // setting this + status SLUTFORD fires follow-up generation (§4.6)
  contractValueSek Int?       // optional, Owner-only visibility (§5)
  description   String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  tasks         FollowUpTask[]
  notes         Note[]

  @@index([customerId])
  @@index([partnerId, status])
}

model FollowUpTask {
  id          String     @id @default(cuid())
  type        TaskType
  status      TaskStatus @default(PENDING)
  dueDate     DateTime
  title       String                      // e.g. "Boka 2-årsbesiktning – Brf Exempel"
  description String?
  // exactly one primary anchor in practice; all optional for flexibility
  leadId      String?
  lead        Lead?      @relation(fields: [leadId], references: [id])
  customerId  String?
  customer    Customer?  @relation(fields: [customerId], references: [id])
  projectId   String?
  project     Project?   @relation(fields: [projectId], references: [id])
  partnerId   String?                     // partner who should act / be notified
  partner     Partner?   @relation(fields: [partnerId], references: [id])
  autoGenerated Boolean  @default(false)
  notifiedAt  DateTime?                   // when the due-notification email went out
  completedAt DateTime?
  createdAt   DateTime   @default(now())

  @@index([status, dueDate])
}

model Note {
  id         String    @id @default(cuid())
  body       String
  authorId   String
  author     User      @relation(fields: [authorId], references: [id])
  leadId     String?
  lead       Lead?     @relation(fields: [leadId], references: [id])
  customerId String?
  customer   Customer? @relation(fields: [customerId], references: [id])
  projectId  String?
  project    Project?  @relation(fields: [projectId], references: [id])
  createdAt  DateTime  @default(now())
}

model StatusEvent {                        // audit trail for the pipeline
  id        String     @id @default(cuid())
  leadId    String
  lead      Lead       @relation(fields: [leadId], references: [id])
  from      LeadStatus
  to        LeadStatus
  byUserId  String?                        // null = system
  byUser    User?      @relation(fields: [byUserId], references: [id])
  createdAt DateTime   @default(now())
}
```

### 4.6 Follow-up generation rules (`lib/followups.ts`)

Triggered in the server action that marks a `Project` `SLUTFORD` with a `completedDate`
(single transaction; idempotent — skip if an auto-generated task of that type already exists
for the project):

| Completed project type | Tasks created | Due date |
|---|---|---|
| KONTROLLANSVARIG or ENTREPRENADBESIKTNING (i.e. a stambyte-scale entreprenad) | GARANTI_2AR + GARANTI_5AR | completedDate + 21 months, and + 57 months (≈3 months before the statutory 2-yr/5-yr marks under AB04/ABT06, leaving booking lead time) |
| OVK | OVK_ATERKOMMANDE | completedDate + (customer.ovkIntervalYears × 12 − 3) months; if `ovkIntervalYears` is null, create the task with due = completedDate + 33 months **flagged** `title: "…(intervall ej satt – bekräfta 3 eller 6 år)"` — surfacing the missing data instead of guessing it |
| GARANTIBESIKTNING_2AR | nothing (the 5-yr task already exists from the original project) | — |

Also: on every new `Lead`, auto-create `LEAD_UPPFOLJNING` due +3 business days (deleted/
completed automatically when the lead leaves `NEW`). This is the "follow-up is unmissable"
mechanism from the brief.

### 4.8 Future-proofing for Phase 5 (underhållsplan subscription)

No build now. The constraint honored by this schema: `Customer` is a stable anchor with
projects/tasks/notes hanging off it, so a future `Subscription` or `MaintenancePlanItem`
model attaches to `customerId` without migration pain. Do not add speculative tables.

## 5. Auth & authorization model

- **Roles:** `OWNER` (Anton — full visibility and all mutations, user management) and
  `PARTNER` (sees ONLY leads/projects/tasks where `assignedPartnerId` / `partnerId` equals
  their own `partnerId`; can update status and add notes on those; cannot see
  `contractValueSek`, other partners' records, or aggregate dashboards).
- Enforcement lives in the **data-access layer, not the UI**: every admin query goes through
  `lib/` repository functions that take the session and apply `partnerId` scoping in the
  `where` clause when role is PARTNER. UI hiding alone is not acceptable. Server actions
  re-check role before mutating.
- `middleware.ts` blocks all `/admin/*` without a session; `installningar` (user management)
  additionally requires OWNER.
- No self-signup. Owner creates partner users in `/admin/installningar`; seed script creates
  the initial Owner (credentials from env `SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`, forced
  change on first login is nice-to-have, not required v1).
- Session: JWT, 30-day maxAge, role + partnerId embedded in token, re-validated against DB
  on admin layout render (so deactivating a user takes effect promptly).
- A "Diana" (assistant) user, if needed, is simply a second OWNER-role user —
  **CONFIRM WITH OPERATOR** whether a restricted third role is wanted later; do not build it now.

## 6. Integrations

### 6.1 Email (all through `lib/email.ts`)

| Trigger | To | Content |
|---|---|---|
| New lead (any type) | Owner (env `NOTIFY_EMAIL`, default operator's address) | Full lead details + direct link to `/admin/leads/[id]` |
| Calculator submission | Submitter | Their estimate + risk band + CTA to book statusbesiktning; plain, trustworthy, no marketing fluff |
| Lead assigned to partner | That partner's user emails | Lead summary (no other-partner data) + admin link |
| Follow-up task due (cron) | Owner + assigned partner | Task title, customer, due date, admin link |
| Daily digest (cron, 07:00 Europe/Stockholm) | Owner | New leads yesterday, leads stuck in NEW > 3 days, tasks due ≤ 14 days |

Sender: `BRF Inspektion <no-reply@brfinspektion.se>` — requires verified domain (plan.md D8).
All templates in Swedish, plain-HTML (table-free simple layout), no tracking pixels.

### 6.2 Analytics & consent

GA4 only, loaded after consent via a minimal self-built cookie banner (two buttons:
"Godkänn"/"Endast nödvändiga" — no dark patterns; banner must not block reading the page).
Conversion events: `calculator_submit`, `contact_submit` (fired client-side on success
response). Google Ads conversion tag added in Phase 4, gated by the same consent. No other
trackers.

### 6.3 Schema.org markup plan (JSON-LD via `lib/schema-org.ts`)

| Page type | Schema | Notes |
|---|---|---|
| All pages (layout) | `Organization` | name, url, logo placeholder, `areaServed: SE`, contactPoint. No fake `aggregateRating` — ever. |
| Service pages (stambyte, statusbesiktning, kontrollansvarig, entreprenadbesiktning, garantibesiktning, ovk-besiktning, upphandling, underhallsplan) | `Service` + `FAQPage` where the page has a real visible FAQ | `Service.provider` → Organization; `serviceType` in Swedish; include `areaServed: SE`. FAQ content per strategy.md §4 (this is where keyword variants get consolidated). |
| /stambyte/kostnad | `FAQPage` (cost questions) | No fabricated exact prices in answers — ranges only where committable (plan.md D3), else process-framed answers. |
| Guides | `Article` + optional `FAQPage` from frontmatter | `datePublished`/`dateModified` real, author = Organization. |
| / (home) | `Organization` + `WebSite` | No SearchAction (no site search v1). |

Rule: JSON-LD must mirror visible page content exactly. Validate with Rich Results test
before each phase exit.

### 6.4 Scheduled jobs

Hostinger managed Node.js gives no reliable in-process scheduler guarantee (process may
sleep/restart). Decision: **`GET /api/cron/followups` secured by `Authorization: Bearer
${CRON_SECRET}`**, invoked daily at 06:00 Europe/Stockholm by an external scheduler —
use Hostinger's hPanel cron (curl) if available on the plan, else cron-job.org
(**CONFIRM WITH OPERATOR** which; both hit the same endpoint, code is identical).
The endpoint is idempotent (uses `notifiedAt` to avoid duplicate emails) and does:
1. Send due-task notifications (`dueDate <= today + 14 days` and `notifiedAt` null).
2. Compile + send the daily digest.
3. Create missing `LEAD_UPPFOLJNING` tasks (belt-and-braces sweep).

### 6.5 Lead handoff (WhatsApp)

The operator's other funnels use WhatsApp. v1: the lead-notification email includes a
`wa.me`-style click-to-chat link with the lead's phone number (if provided) so the operator
can open the conversation in one tap. No WhatsApp Business API integration in v1 (cost/
complexity not justified at this volume) — flag as a possible Phase 4+ enhancement.

## 7. Design system (2–4 deliberate patterns, trust-first)

Visual identity targets a risk-averse BRF board member aged ~45–75 reading on mobile.
Credible-and-calm, not startup-flashy. The four patterns (and only these):

1. **Trust header + proof strip:** every page opens with a plain-language H1 stating the
   service and for whom ("Besiktning och kontroll vid stambyte — för er styrelse"),
   subline, primary CTA, and a horizontal strip of *true* trust markers only:
   certifications once confirmed (plan.md D10), "Fast kontaktperson", "Oberoende av
   entreprenörer". No logos or stats until real ones exist.
2. **Service-ladder card row:** the homepage (and condensed on service pages) shows the
   ladder as 4 steps from free → full project oversight, each card: what, when in the BRF's
   journey, price framing (per plan.md D3 rules), link. This is the site's core navigation
   metaphor.
3. **Process timeline:** numbered "Så går det till" section (3–5 steps) on every service
   page — risk-averse buyers need to see the process before they'll submit a form.
4. **FAQ accordion + lead form band:** every service page ends with the FAQ accordion
   (drives FAQPage schema) followed by the short lead form pre-tagged with the page.

Typography/color: system-adjacent sans (e.g. Inter via `next/font`, self-hosted — no
external font CDN), one deep trust-blue primary, one warm accent for CTAs, generous
whitespace, WCAG AA contrast. Images: described placeholders only (per plan.md rule 3).
Language rules: du-form throughout ("ni/er" when addressing the board collectively is
correct and preferred on service pages), no anglicisms in headings, closed compounds.

## 8. Deployment — Hostinger managed Node.js (verified against the operator's
nextjs-deploy-hostinger playbook)

### 8.1 Build & run

Hostinger's **managed Node.js Apps** feature deploys straight from a GitHub repo — no manual
SSH file copying, no PM2, no Nginx config. hPanel → **Websites → Add Website → Node.js
Apps → Import Git Repository**, authorize GitHub, pick `antonmarklundcom/brfinspektion` and
the `main` branch. It auto-detects Next.js and runs `npm run build` then `npm start`.

**Do not set `output: "standalone"` in `next.config.ts`.** `next start` does not work
correctly against a standalone build (confirmed directly: running `npm run build && npm run
start` with `output: "standalone"` set prints `"next start" does not work with "output:
standalone" configuration` and does not serve the app correctly). Since Hostinger's deploy
runs plain `npm start`, the default (non-standalone) build output is what must ship — this
repo's `next.config.ts` deliberately has no `output` override; do not add one back.

Node version: select **Node.js 22** in the Hostinger app settings (matches this repo's
`engines.node` in `package.json` and the version used in CI). Build command `npm run build`,
start command `npm start` — both auto-detected, verify them rather than assuming.

Env vars set in hPanel (never committed): `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`AUTH_URL` (the real deployed URL — the temporary `*.hostingersite.com` one at first, updated
to `https://brfinspektion.se` + redeployed once the custom domain is mapped), `RESEND_API_KEY`,
`NOTIFY_EMAIL`, `CRON_SECRET`, `NEXT_PUBLIC_GA_ID`. `SEED_OWNER_EMAIL`/`SEED_OWNER_PASSWORD`
are only needed locally when running the seed script against production (§8.3) — harmless to
also set in hPanel, not required there.

### 8.2 Known pitfalls (verified from real Hostinger deployments — handle proactively)

1. **Hostinger SSH → Neon IPv6 routing is broken, with no reliable server-side fix.**
   Hostinger's shared servers resolve Neon's Postgres hostname to IPv6 and the connection
   fails from an SSH shell; pooler endpoints, `NODE_OPTIONS=--dns-result-order=ipv4first`,
   and connection-string IP overrides were all tried on real deployments and none reliably
   fixed the SSH-shell case. **The working procedure is to never run Prisma commands via
   Hostinger SSH at all** — run `prisma migrate deploy` and the seed script from the
   operator's local machine instead (§8.3), where outbound IPv4 to Neon works normally. The
   deployed app's own runtime DB connection is a separate network path from the SSH shell —
   verify it works (a real lead write) rather than assuming it inherits the SSH problem.
2. **SSH npm/npx PATH issue** (only relevant if SSH is used for anything, which should be
   rare with the managed GitHub-integration flow): non-interactive SSH sessions don't have
   node/npm on PATH by default. Activate manually, e.g.
   `export PATH=/opt/alt/alt-nodejs22/root/usr/bin:$PATH` (confirm the exact version
   directory under `/opt/alt/` in an interactive session first — don't guess it).
3. **Windows PowerShell UTF-16 pitfall:** the operator runs Prisma commands locally on
   Windows. Never create `.env` via `>` redirect — PowerShell's default UTF-16 output
   corrupts `.env` and `schema.prisma` for Prisma's parser. Use
   `Set-Content -Path .env -Value '...' -Encoding utf8`. Also: if `npm`/`npx` are blocked by
   execution policy, `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
   fixes it once.

### 8.3 Migrations

Run `prisma migrate deploy` and `npm run db:seed` **from the operator's local machine**
against the production `DATABASE_URL`/`DIRECT_URL` (see 8.2 point 1 — not via Hostinger SSH,
not as an automatic step on app boot). One-time per schema change / initial deploy.

### 8.4 Domains

- `brfinspektion.se` → the app (HTTPS via Hostinger, mapped in the app's domain settings).
- `brfentreprenad.se` → **301** to `https://brfinspektion.se/upphandling`. Prefer
  hosting/DNS-level redirect; if the domain must be pointed at the same app instead,
  `proxy.ts` matches `host === 'brfentreprenad.se'` (and `www.`) and returns a 301.
  Also canonicalize `www.brfinspektion.se` → apex (or the reverse — pick apex) with 301.

### 8.5 Post-deploy checklist

- [ ] App loads on the Hostinger URL, then on the custom domain with valid SSL.
- [ ] `AUTH_URL` matches the final domain (redeploy after changing it).
- [ ] Login works with real Owner credentials — rotate the seed password immediately if a
      placeholder was ever used to seed production.
- [ ] A real calculator or contact submission writes a `Lead` row (verify in `/admin/leads`
      or Prisma Studio against the production DB) and the notification email arrives.
- [ ] `/sitemap.xml` and `/robots.txt` are reachable on the live domain.
- [ ] Which Hostinger account and how many Node.js app slots remain is noted somewhere the
      operator can find it later (slots are a scarce, shared resource across the operator's
      other projects).

## 9. Testing & CI

GitHub Actions on PR: `lint`, `tsc --noEmit`, `vitest`, and a Playwright smoke suite
(build + start + critical paths). Minimum required tests (these encode the business rules —
do not skip):

1. **Calculator unit tests:** rule table → expected risk band and range for representative
   input combos, including all `VET_EJ` paths.
2. **Partner scoping test (critical):** PARTNER-role session querying leads/projects/tasks
   receives only records with their `partnerId`; direct fetch of another partner's lead by
   id returns not-found/forbidden; `contractValueSek` absent from partner-visible payloads.
3. **Follow-up generation tests:** stambyte-type project completed → exactly one GARANTI_2AR
   (+21 mo) and one GARANTI_5AR (+57 mo) task, idempotent on re-save; OVK with null interval
   → flagged task, not a silently guessed date.
4. **Lead API tests:** zod rejection of bad payloads, honeypot drop, consent required,
   Lead row + `LEAD_UPPFOLJNING` task created on success.
5. **Playwright smoke:** home renders, calculator happy path to result screen, contact form
   submit, admin login + pipeline view, sitemap/robots respond, `/admin` unauthenticated →
   redirect to login.
6. **Schema markup test:** each service page's rendered HTML contains valid JSON-LD of the
   expected `@type`s (parse and assert, don't regex).

## 10. Open technical questions — CONFIRM, don't assume

1. **Hostinger plan capabilities:** does the operator's plan support hPanel cron (§6.4)? §8's
   deploy flow itself (managed GitHub-integration Node.js Apps) is confirmed against the
   operator's real playbook, not assumed — no longer an open question. If the playbook
   repo/notes evolve further, follow them over §8 where they conflict, and note the conflict.
2. **Resend vs Hostinger SMTP** (§1) — operator picks; code is provider-agnostic behind
   `lib/email.ts`.
3. **Neon region/org** — reuse operator's existing Neon account/org and region if one exists.
4. **hPanel cron vs cron-job.org** for §6.4.
5. **www vs apex canonical** — §8.4 says pick apex; confirm no operator preference.
6. **Second OWNER user ("Diana")** — create or not at seed time (§5).
7. **Google Ads / GA4 account IDs** — operator supplies; code reads from env.
