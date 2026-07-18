# plan.md — BRF Inspektion: Phased Build Roadmap

> **Who this document is for:** an executing AI model (Claude Sonnet 5 / Opus 4.8) building
> this project without access to the original planning conversation. Read this file first,
> then `architecture.md` (technical spec) and `strategy.md` (business/SEO/Ads spec).
> `keyword-data.md` (Google Keyword Planner export) is ground truth for all search-volume
> and CPC claims — never invent numbers beyond it.

## 0. Ground rules for the executing model

1. **All public site copy is in Swedish.** Du-form, no anglicisms in headings, closed
   compound words (e.g. "kostnadskalkyl", not "kostnads kalkyl"). Admin UI copy may be
   Swedish or English — pick Swedish for consistency, it's a Swedish operator.
2. **Zero fabricated content.** No invented testimonials, client logos, "500+ nöjda kunder"
   stats, or made-up pricing. Where a price is not committed (see §5 Open Decisions), show
   a range placeholder clearly marked `TODO-PRICING` in code and render the section with
   honest copy ("Kontakta oss för prisuppgift") until the operator supplies real numbers.
3. **No image/video generation.** Use described placeholders (`<!-- IMAGE: kort beskrivning -->`
   or a neutral CSS placeholder block with alt-text-style description). The operator supplies
   real assets later.
4. **One page = one primary search intent.** Never create two pages competing for the same
   keyword cluster (see strategy.md §4 for the keyword→page map).
5. When something in these documents is marked **OPEN DECISION** or **TODO**, do not resolve
   it by guessing — implement the documented fallback behavior and leave the marker.

## 1. What is being built (one paragraph)

A Swedish national lead-generation site + backend CRM at **brfinspektion.se** connecting BRF
boards (bostadsrättsföreningar) with two partner firms for inspection and construction-oversight
services around stambyte (pipe replacement) projects. Public site: Next.js marketing/SEO pages +
an interactive cost/risk calculator as lead magnet. Backend: lead pipeline, customer records,
partner-scoped logins, and automated follow-up scheduling for statutory recurring inspections
(2-year/5-year garantibesiktning, OVK every 3–6 years). Stack: Next.js (App Router) + Prisma +
Neon Postgres, deployed on Hostinger managed Node.js. Secondary domain **brfentreprenad.se** is
a 301 redirect only (keyword data confirms near-zero direct search volume for "brf entreprenad").

## 2. Phase overview and rationale

The public site and the backend/CRM are **separate phases** — but lead *capture and persistence*
is in Phase 1, not Phase 2. Rationale: the operator's own documented failure pattern is "starts
fast, struggles to close / leads fall through cracks." A launched site that emails leads into an
inbox with no database recreates that failure. Therefore: the database + lead table + email
notification exist from the first deploy; the admin *UI* for working those leads follows in
Phase 2.

| Phase | Name | Depends on | Blocked by open decisions? |
|---|---|---|---|
| 0 | Foundation & deploy pipeline | — | No |
| 1 | Public site + calculator + lead capture | Phase 0 | Partially (calculator coefficients, pricing) — has fallbacks |
| 2 | Admin CRM: pipeline, customers, partner access | Phase 1 | No (partner logins can be created before terms are signed) |
| 3 | Follow-up automation & recurring-revenue engine | Phase 2 | No |
| 4 | Content/SEO buildout + Google Ads launch | Phase 1 (site live) | Ads launch blocked by budget sign-off + CPC re-verification (strategy.md §6) |
| 5 | Future: underhållsplan subscription tool | Phase 3 + market proof | Yes — do not build until triggered by operator |

Phases 2–3 and Phase 4 can run in parallel if capacity allows; 4 needs the site live, 2–3 need
only the database.

## 3. Phase detail

### Phase 0 — Foundation & deploy pipeline

**Goal:** a deployable "hello world" Next.js app on Hostinger with Neon Postgres connected,
so every later phase ships behind a working pipeline instead of a big-bang launch.

Tasks:
1. Scaffold Next.js (App Router, TypeScript, no `src/` opinion — follow architecture.md §2
   exactly), Tailwind CSS, ESLint.
2. Prisma + Neon: initial schema (architecture.md §4 — implement the full schema now, it's
   cheaper than migrating later; unused tables are harmless).
3. Auth.js (NextAuth v5) credentials provider with seeded Owner account (architecture.md §5).
4. Deploy to Hostinger managed Node.js following architecture.md §8 — including the three
   known pitfalls (IPv6→Neon routing, SSH npm PATH, PowerShell UTF-16). Verify DB read/write
   from production.
5. Set up `brfinspektion.se` domain + HTTPS; configure `brfentreprenad.se` as 301 redirect
   to `https://brfinspektion.se/upphandling` (hosting/DNS level; if only app-level is
   possible, add host-based redirect in Next.js middleware — see architecture.md §8.4).
6. Transactional email provider wired and test-sent (architecture.md §6.1).

**Exit criteria:** production URL serves the app over HTTPS; a test row written to Neon from
production; a test email delivered; redirect domain returns 301.

### Phase 1 — Public site, calculator, lead capture

**Goal:** the complete public-facing site: every service page, the calculator, and leads
persisted to the database + emailed to the operator.

Tasks:
1. Design system: implement the 2–4 deliberate design patterns defined in architecture.md §7
   (trust-first B2B, mobile-first). No kitchen sink.
2. All public routes per architecture.md §2.1 with the copy briefs in strategy.md §5:
   `/`, `/stambyte`, `/stambyte/kostnad`, `/stambyte/behovsbedomning`, `/kostnadskalkyl`,
   `/statusbesiktning`, `/kontrollansvarig`, `/entreprenadbesiktning`, `/garantibesiktning`,
   `/ovk-besiktning`, `/upphandling`, `/underhallsplan`, `/om-oss`, `/kontakt`,
   `/integritetspolicy`, `/villkor`, plus `/guider` index with the first 3 guides
   (strategy.md §5.3).
3. Calculator at `/kostnadskalkyl` per architecture.md §3: inputs (byggår, antal lägenheter,
   stamtyp, + supporting fields), rule-based output (price range + risk band), result shown
   on screen AND emailed to the submitter; submission stored as a Lead. Coefficients ship as
   a config file with `TODO-PRICING` placeholder values that render honest wide ranges —
   see OPEN DECISION D1.
4. Contact forms on every service page (short form: name, BRF name, email, phone, message,
   auto-tagged with source page) → Lead row + notification email.
5. SEO plumbing: per-page metadata, canonical tags, `sitemap.xml`, `robots.txt`
   (disallow `/admin`), Organization/Service/FAQPage JSON-LD per architecture.md §6.3 and
   strategy.md §4.
6. GDPR basics: privacy policy page (real content covering the actual data collected —
   calculator inputs, contact data, storage in Neon/EU region), consent checkbox on forms,
   cookie-consent handling for analytics (architecture.md §6.2).

**Exit criteria:** all routes live; Lighthouse mobile ≥ 90 performance / ≥ 95 SEO on `/` and
`/stambyte`; a calculator submission produces a Lead row, a result email to the submitter,
and a notification email to the operator; schema markup validates in Google Rich Results test.

### Phase 2 — Admin CRM

**Goal:** the operator (and later partners) work leads inside the system, not in an inbox.

Tasks:
1. `/admin` area, role-gated per architecture.md §5 (OWNER sees all; PARTNER sees only
   assigned records).
2. Lead pipeline view: list + detail, status transitions
   (`NEW → CONTACTED → QUALIFIED → HANDED_OVER → WON / LOST`), notes, status history,
   assignment to a partner (assignment is what makes a lead visible to that partner).
3. Convert-to-customer flow: a WON lead creates/attaches to a `Customer` (the BRF) and a
   `Project` (service tier, partner, dates, optional contract value).
4. Partner accounts: create logins for Partner A and Partner B (works before revenue terms
   are final — access ≠ payment terms). Partners can update status and notes on assigned
   records only.
5. Dashboard: counts per pipeline stage, leads with no activity in X days flagged
   prominently ("unmissable follow-up" requirement), due follow-up tasks (Phase 3 feeds this).
6. Daily digest email to Owner: new leads + stale leads + due tasks (architecture.md §6.1).

**Exit criteria:** Owner can run a lead from NEW to WON to Customer+Project entirely in the UI;
a Partner login demonstrably cannot see unassigned records (write a test for this —
architecture.md §9); stale-lead flagging visible on dashboard.

### Phase 3 — Follow-up automation (the recurring-revenue engine)

**Goal:** statutory re-engagement is generated by the system, never remembered by a human.

Tasks:
1. `FollowUpTask` engine per architecture.md §4.6: completing a stambyte-type `Project`
   auto-creates garantibesiktning tasks due ~21 months and ~57 months after completion date
   (i.e. contact ~3 months before the 2-year and 5-year statutory marks); completing an OVK
   project auto-creates the next OVK task per the building's interval (3 or 6 years —
   stored per customer, set by the operator; do not guess the interval, it depends on
   ventilation system type).
2. Scheduled runner (architecture.md §6.4) that surfaces due tasks: dashboard section +
   email to Owner and assigned partner when a task enters its due window.
3. Manual task creation (custom follow-ups on leads/customers with due dates).
4. Lead-level follow-up: automatic "no contact in 3 business days" task on every NEW lead.

**Exit criteria:** integration test proves: mark stambyte project completed → two future
garanti tasks exist with correct due dates; cron endpoint fires → due-task email delivered.

### Phase 4 — Content/SEO buildout + Google Ads launch

**Goal:** traffic. Ads for the low-volume/high-CPC commercial terms now; SEO content for the
higher-volume informational cluster over time. Full spec: strategy.md §4–§6.

Tasks:
1. Guides buildout: publish the guide list in strategy.md §5.3 (underhållsplan cluster is
   the single biggest organic opportunity in the data — 720/mo head term).
2. Google Ads: campaign structure, keyword list, and bid caps per strategy.md §6 — **but do
   not set live bids until the flagged CPC re-verification is done** (the "stambyte brf" CPC
   figures came through ambiguously labeled; strategy.md §7).
3. Conversion tracking: calculator submit + contact submit as conversions (GA4 + Google Ads
   tag, consent-gated per architecture.md §6.2).
4. Manual SERP check on top 5–6 commercial terms (a documented keyword-data gap) — record
   findings in a `research/serp-notes.md` file in the repo before finalizing on-page titles.

**Exit criteria:** guides indexed; Ads campaigns built in paused state + a written go-live
checklist; conversions verified firing in GA4 DebugView.

### Phase 5 — FUTURE (do not build unprompted)

Subscription-based digital underhållsplan tool for boards, upsold after stambyte completion.
Only architectural obligation now: nothing in the Phase 0–4 data model may preclude it (the
`Customer` record is the anchor; see architecture.md §4.8). Build only when the operator
explicitly triggers it.

## 4. Milestones (single list, in order)

1. **M0 — Pipeline proven:** app + DB + email live on Hostinger. (Phase 0 exit)
2. **M1 — Site live:** all public pages + calculator capturing leads. (Phase 1 exit)
3. **M2 — CRM live:** leads worked in admin; partner logins scoped. (Phase 2 exit)
4. **M3 — Automation live:** garanti/OVK follow-up tasks auto-generated. (Phase 3 exit)
5. **M4 — Demand live:** guides published, Ads campaigns launched after re-verification.
6. **M5 — First closed-loop proof:** one real lead → partner handoff → status WON recorded.
   (Business milestone, not a build task — but the build is not "done" until the system has
   carried one real lead end to end.)

## 5. Open decisions & missing data — explicit blockers list

The executing model must NOT resolve these by inventing values. Each has a documented fallback.

| ID | Open item | Blocks | Fallback until resolved | Owner |
|---|---|---|---|---|
| D1 | **Calculator coefficients & price ranges** — real per-apartment stambyte cost ranges and risk logic must come from Partner B's professional judgment. | Calculator credibility (Phase 1) | Ship calculator with `TODO-PRICING` config; render deliberately wide ranges labeled "grov uppskattning" and lean on the risk-band + "boka statusbesiktning" CTA rather than the number. | Anton + Partner B |
| D2 | **Partner revenue-share terms not finalized** (both partners). | Nothing technical; blocks go-to-market promises and any pricing shown as committed | Show service pricing only where operator confirms it is committable; otherwise "offert"-framing. Flagged prominently in strategy.md §7. | Anton |
| D3 | **Committable prices for tiers 2–4** (statusbesiktning 15–40k, upphandlingsstöd 50–150k, KA 200k–1M+ are internal planning ranges, not confirmed public prices). | "Real pricing shown where committable" requirement (Phase 1) | Show ranges only if operator marks them committable; else transparent "från"-pricing withheld with honest copy. | Anton + partners |
| D4 | **Keyword gaps** — no data for: kontrollansvarig kostnad, besiktningsman kostnad, ovk kostnad, relining vs stambyte, kontrollansvarig brf, entreprenadbesiktning. | Final on-page targeting for those pages; Ads expansion | Build the pages on intent logic (they're needed for the service ladder regardless); mark title/H1 as provisional; fresh KWP pull before Ads expansion. | Anton |
| D5 | **"stambyte brf" CPC label ambiguity** (26.83 / 84.23 SEK unlabeled). | Live Ads bids (Phase 4) | Campaigns built paused; re-verify in KWP first. | Anton |
| D6 | ~~**SERP/competitor check** on top commercial terms~~ — done, `research/serp-notes.md`. Used general web search, not a live Google.se SERP; re-verify with an actual incognito search before finalizing Ads bids. | Final titles/meta (Phase 4 polish) | No title changes were indicated by the findings — current titles stand. | Done |
| D7 | **OVK interval per customer** (3 vs 6 years, depends on ventilation system). | Nothing — field exists | Per-customer field set manually by operator; no default assumed. | Operator per customer |
| D8 | **Email provider account + sending domain DNS** (SPF/DKIM). | Phase 0 exit | architecture.md §6.1 names the choice; operator must create the account and set DNS. | Anton |
| D9 | **Org details for footer/legal** (company name, org.nr, address for imprint + privacy policy controller identity). | Phase 1 legal pages | Placeholder markers `TODO-ORG`; pages ship with structure complete. | Anton |
| D10 | **Partner firm names/credentials for /om-oss and service pages** (real certifications: RISE/Kiwa certifierad KA, OVK-behörighet etc. — must be stated only as confirmed by partners). | Trust content (Phase 1) | Generic-but-true copy ("certifierad kontrollansvarig enligt PBL" only once confirmed); `TODO-PARTNER-CREDENTIALS` markers. | Anton + partners |

## 6. Definition of done (whole project, Phases 0–4)

- All exit criteria above met.
- No `TODO-PRICING` / `TODO-ORG` / `TODO-PARTNER-CREDENTIALS` markers remain on pages that
  are indexed (either resolved by operator input, or the section is rendered in its honest
  fallback form with the marker only in code comments).
- The tests listed in architecture.md §9 pass in CI (GitHub Actions).
- `README.md` in repo documents: local dev setup, deploy steps (Hostinger playbook incl.
  the three pitfalls), how to run migrations, how to create a partner user, and where the
  cron trigger lives.
