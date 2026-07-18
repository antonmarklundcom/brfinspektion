# strategy.md — BRF Inspektion: Business Model & Go-to-Market

> Companion to `plan.md` (build order) and `architecture.md` (technical spec).
> All search volumes and CPC figures cited here come from `keyword-data.md` (Google
> Keyword Planner, Jul 2025–Jun 2026). Nothing numeric may be added beyond that file.
> **§7 lists what is planned but NOT agreed — do not present those items as settled.**

## 1. Business model recap

BRF Inspektion is a lead-generation and customer-acquisition engine, not a service firm.
Anton owns the brand, the funnel (site + calculator + Google Ads), and the backend/CRM.
Two partner firms deliver the actual services:

- **Partner A** — kontrollansvarig (KA) / besiktningsman firm: construction oversight,
  entreprenadbesiktningar, statutory 2-year and 5-year garantibesiktningar (AB04/ABT06),
  likely OVK-certified (*confirm before publishing OVK credentials — plan.md D10*).
- **Partner B** — BRF assessment: statusbesiktning, underhållsplan, "do we need a stambyte
  and when" analysis.

Revenue model: revenue share / referral fee on delivered services. **Terms with both
partners are NOT finalized (§7.1)** — the funnel can be built and even launched for lead
capture before terms are signed, but no lead should be formally handed over under an
assumed commercial arrangement.

Why this niche works despite tiny search volumes: a stambyte is a 20–60M SEK contractor
spend and one of the most anxiety-inducing decisions a volunteer BRF board ever makes.
One converted lead can be worth 15k–1M+ SEK in partner service value across the ladder,
and every completed project generates statutory, non-optional repeat business (2-yr/5-yr
garantibesiktning, recurring OVK). This is a low-volume / high-value / high-trust market:
the site must win on credibility per visitor, not on traffic.

## 2. Service ladder (with partner attribution)

| Step | Service | Price band (internal planning — see §7.2 before publishing) | Delivered by | Role in funnel |
|---|---|---|---|---|
| 1 | Kostnadskalkyl (interactive calculator) | Free | System (automated) | Lead magnet; email capture |
| 2 | Statusbesiktning / förstudie | 15–40k SEK | Partner B | First paid engagement; low-risk entry |
| 3 | Upphandlingsstöd, förfrågningsunderlag | 50–150k SEK | Partner B (assessment side) / Partner A (technical spec) — **exact split unconfirmed, §7.1** | Bridges "we need it" → "we're procuring it" |
| 4 | Kontrollansvarig + entreprenadbesiktningar through the stambyte | 200k–1M+ SEK | Partner A | Core monetization |
| 5 | Garantibesiktning 2 yr + 5 yr | (not priced — §7.2) | Partner A | **Automatic**: CRM auto-generates follow-up tasks 21 and 57 months after project completion (architecture.md §4.6). Statutory, not optional — near-100% relevance to every completed project. |
| 6 | OVK-besiktning (every 3 or 6 years) | (not priced — §7.2) | Partner A (*pending certification confirmation*) | Second recurring line; also a standalone entry point (highest-volume commercial keyword in the data at 70/mo). |
| 7 | Digital underhållsplan (subscription) | Future | System | Phase 5 only — not built or marketed yet. |

Monetization logic: the free calculator converts anonymous anxiety ("what would this cost
us?") into a qualified lead with structured data (byggår, antal lägenheter, stamtyp). Each
ladder step de-risks the next. The CRM's follow-up engine converts one-off wins into a
compounding book of statutory repeat business — this, not SEO volume, is the long-term moat.

## 3. Domain strategy

- **brfinspektion.se** — the entire business. Assessment-phase framing ("inspektion") is
  broad enough for the whole ladder.
- **brfentreprenad.se** — 301 redirect to `/upphandling` only. Keyword data is unambiguous:
  "brf entreprenad", "entreprenad brf", "brf byggfirma", "byggfirma brf" all show <10
  (effectively 0) monthly searches. Do not build content there; value is brand-protection
  and offline mention only.

## 4. SEO: keyword → page map

Core principle from the data: **two distinct keyword economies.**

- **Ads-now terms:** low volume (10–70/mo), commercial intent, real CPCs (up to 136.51 SEK
  on "besiktning brf", 81.81 SEK on "5 års besiktning brf"). SEO alone can't be the plan
  here — a #1 ranking on a 10/mo term is ~a handful of clicks. Buy this traffic from day
  one; the pages below serve as landing pages and will rank organically over time as a
  bonus.
- **SEO-over-time terms:** the underhållsplan cluster (720 + 110 + 50 + 50 + 40 + 10/mo
  variants) and broad informational terms (bostadsrättslagen 2 400/mo, bostadsrättsförening
  12 100/mo). Too broad or too informational to convert directly — build guide content for
  topical authority and calculator-routed soft conversion. Never bid on the broad head
  terms.

### 4.1 Page-by-page targeting

| Page | Primary keyword (vol/mo) | Secondary/consolidated variants | Notes |
|---|---|---|---|
| `/` | brand + "besiktning brf" (10, CPC 15.62–136.51) | — | Ads landing for generic besiktning-intent; positions full ladder. |
| `/stambyte` | stambyte brf (50) | stambyte bostadsrättsförening (20), stambyte i bostadsrättsförening (20), stambyte förening (10) | One page for all phrasing variants — body copy + FAQ absorb them. Do NOT build separate HSB pages ("stambyte hsb" etc. are brand-adjacent; a guide mentions the HSB context instead, §5.3). |
| `/stambyte/kostnad` | kostnad stambyte bostadsrättsförening (10) | stambyte avgiftshöjning (10) | FAQPage schema on cost/avgift questions; the informational→commercial bridge; strongest internal links to calculator. |
| `/stambyte/behovsbedomning` | no measured head term — intent page ("behöver vi stambyte?") | relining vs stambyte (**no data — plan.md D4**) | Routes to calculator; provisional title until D4 research. |
| `/kostnadskalkyl` | — (conversion tool, not an SEO target) | — | noindex NOT set — let it rank if it does, but no keyword commitment. |
| `/statusbesiktning` | no measured term (data gap "besiktningsman kostnad" — D4) | — | Built on intent logic; provisional title. |
| `/kontrollansvarig` | no data yet ("kontrollansvarig brf", "kontrollansvarig kostnad" — D4) | — | Same. |
| `/entreprenadbesiktning` | no data yet (D4) | besiktning renovering lägenhet (10) tangentially | Same. |
| `/garantibesiktning` | 2 års besiktning bostadsrätt (20) + 5 års besiktning brf (20, CPC 13.85–81.81) | 2 års besiktning brf (10), 2 års besiktning lägenhet (10), 5 års besiktning bostadsrätt (10) | **The consolidation showcase:** one page, all 2yr/5yr × brf/bostadsrätt/lägenhet variants as FAQ questions with FAQPage schema. Total addressable ≈70/mo across variants. Never split into per-variant pages. |
| `/ovk-besiktning` | ovk besiktning bostadsrätt (70, CPC 12.16–35.55) | ovk besiktning brf (20, CPC 16.90–72.62), ovk besiktning lägenhet (20) | Highest-volume commercial term in the dataset. Note YoY −92% on the head term — treat volume as soft, verify at D4 refresh. Statutory-requirement framing ("krav enligt PBL, kommunen kan förelägga"). |
| `/upphandling` | none (confirmed ~0 volume) | — | Exists for the ladder + brfentreprenad.se redirect target, not for SEO. |
| `/underhallsplan` | underhållsplan brf (720) | brf underhållsplan (110), underhållsplan liten brf (50), underhållsplan brf exempel (50), underhållsplan brf offentlig (40), underhållsplan pdf (10) | **Biggest organic opportunity in all the data.** Service page targets the head term; the long-tail variants belong to guides (§5.3) interlinked with it. Realism: this term is competitive (established underhållsplan SaaS players) — a long game, hence SEO-over-time bucket. |
| `/guider/*` | informational cluster (§5.3) | bostadsrättslagen (2 400) etc. | Topical authority; every guide ends with a calculator CTA. |

### 4.2 Cannibalization rules

- Exactly one page per cluster above; guides link INTO service pages with descriptive anchors,
  never target a service page's primary term in their own title/H1.
- "fastighetsförvaltning brf" (210/mo): **explicitly excluded** — that intent is full-service
  property management (HSB/SBC/Riksbyggen/Nabo territory). No page, no guide, no Ads.
- HSB/Riksbyggen-branded queries: never landing pages (trademark + wrong intent); one guide
  covers "stambyte när föreningen är HSB/Riksbyggen-ansluten" editorially (§5.3).

## 5. Copy briefs (what each page must say)

Shared rules: du/ni-form, no anglicisms in headings, closed compounds, honest pricing per
plan.md D3, no fabricated social proof, every page uses the four design patterns of
architecture.md §7. Tone: lugn, saklig, expert — like a good besiktningsman talks, not like
a marketer.

### 5.1 Homepage
H1 direction: "Oberoende besiktning och kontroll för er bostadsrättsförening" (final
phrasing may be tuned; must contain besiktning + bostadsrättsförening, no brand-only H1).
Sections: trust header → problem framing (stambyte = största beslutet en styrelse fattar;
20–60M SEK spans may be cited as market context, phrased as "ofta i spannet…") → service-
ladder cards (all tiers incl. recurring OVK/garanti) → "Så går det till" → why independent
(oberoende av entreprenörer — the core differentiator vs contractors who "inspect" their own
work) → FAQ → calculator CTA band.

### 5.2 Service pages
Each: what the service is (plain language, assume zero construction knowledge) → when a
board needs it (tie to the ladder step before/after) → process timeline → what it costs
(per D3 rules) → who performs it ("certifierad kontrollansvarig" etc. only per D10
confirmation) → FAQ (the consolidated keyword variants live here) → lead form.
`/garantibesiktning` FAQ must answer, at minimum, in variant phrasings: vad är en
2-årsbesiktning / 5-årsbesiktning, gäller det vår bostadsrättsförening, vem betalar,
vad händer om fel upptäcks, vad säger AB04/ABT06, gäller det även enskilda lägenheter.
`/ovk-besiktning` FAQ: vad är OVK, hur ofta (3 eller 6 år beroende på ventilationssystem
— stated as the rule, not a guess about the reader's building), vad händer om vi inte gör
den, vad kostar den (process answer until D4/D3 data exists).

### 5.3 Guides (initial set, in priority order)

1. "Underhållsplan för brf — komplett guide (med exempel)" — targets the 110/50/50/40 long
   tail under `/underhallsplan`'s head term; includes "liten brf" section; CTA → calculator
   + `/underhallsplan`.
2. "Vad kostar ett stambyte? Så räknar ni" — supports `/stambyte/kostnad`, targets nothing
   that page owns in title (angle: the calculation method, avgiftshöjning question); CTA →
   calculator.
3. "Stambyte eller relining — hur vet styrelsen vad som krävs?" — fills the D4 gap
   editorially; provisional targeting until data exists; CTA → `/stambyte/behovsbedomning`.
4. "Styrelsens ansvar vid stambyte enligt bostadsrättslagen" — borrows authority from the
   2 400/mo bostadsrättslagen cluster without pretending to rank for the head term.
5. "Stambyte i HSB- eller Riksbyggen-ansluten förening — vad gäller?" — absorbs the
   hsb-variant queries (30+20+20/mo) editorially.
Guides 1–3 ship in Phase 1; 4–5 in Phase 4.

## 6. Google Ads launch plan

### 6.1 Realistic expectations (set these with the operator up front)

The entire measured commercial keyword set totals roughly **300–400 searches/month
nationally** across all stambyte/besiktning/OVK/garanti terms in the data. With CPCs
observed from ~7 SEK up to 136.51 SEK, this is a **handful-of-clicks-per-day** account,
not a scaling machine. Expect single-digit leads per month at launch; the economics work
because one tier-4 lead can carry the whole quarter. Do not promise volume; instrument
everything and judge on cost-per-qualified-lead after 60–90 days, not CTR.

National targeting (Sweden, Swedish language), no city campaigns — the data shows no
volume to slice geographically, and the service is national.

### 6.2 Campaign structure (build paused in Phase 4; launch after §6.4 checklist)

| Campaign | Ad groups / keywords (phrase + exact) | Landing page | Observed CPC basis |
|---|---|---|---|
| 1. Stambyte (core) | stambyte brf; stambyte bostadsrättsförening; stambyte i bostadsrättsförening; stambyte förening; kostnad stambyte bostadsrättsförening; besiktning stambyte | `/stambyte`, cost terms → `/stambyte/kostnad` | "stambyte brf" 26.83/84.23 SEK **(ambiguous label — plan.md D5, re-verify before setting bids)**; stambyte bostadsrättsförening 7.15–71.46 |
| 2. Besiktning (generic BRF) | besiktning brf | `/` | 15.62–136.51 SEK — highest observed CPC; cap tightly, watch search terms report closely for irrelevant intents (överlåtelsebesiktning etc.) and negative them |
| 3. Garantibesiktning | 2 års besiktning bostadsrätt/brf/lägenhet; 5 års besiktning brf/bostadsrätt | `/garantibesiktning` | 8.20–81.81 SEK across variants |
| 4. OVK | ovk besiktning bostadsrätt; ovk besiktning brf; ovk besiktning lägenhet | `/ovk-besiktning` | 9.10–72.62 SEK |

Negatives from day one: hsb, riksbyggen, sbc, nabo (brand traffic, wrong intent),
förvaltning, jobb/lön/utbildning, bil (besiktning ambiguity), villa/hus where irrelevant.
Match types: phrase + exact only at launch; no broad match until ≥90 days of search-term
data. Conversion goals: `calculator_submit` (primary), `contact_submit`. Manual CPC or
Maximize Conversions **with a bid cap** — never uncapped automated bidding on a
low-volume account (the algorithm has too few conversions to learn from; runaway CPCs are
the known failure mode at these CPC ceilings).

### 6.3 Budget

No budget figure exists in the data and none is invented here. Sizing logic for the
operator's decision: at the observed CPC ranges (tens of SEK typical, >100 SEK ceiling on
campaign 2), a daily budget must buy at least a few clicks across four campaigns to
generate any signal — the operator sets the number; the recommendation is to commit to a
90-day evaluation window rather than judging week one, given the volumes above.

### 6.4 Go-live checklist (blocking)

1. D5 resolved: fresh KWP pull re-verifying "stambyte brf" CPC labeling.
2. D4 partial: fresh KWP pull on the six gap terms (kontrollansvarig kostnad,
   besiktningsman kostnad, ovk kostnad, relining vs stambyte, kontrollansvarig brf,
   entreprenadbesiktning) — add to campaigns only if data supports.
3. ~~Manual SERP check on top 5–6 commercial terms~~ — done, see `research/serp-notes.md`
   (D6). That pass used general web search, not a live Google.se SERP; a real incognito
   Google.se search from Sweden immediately before setting live bids is still recommended,
   per the caveat at the top of that file.
4. Conversion tracking verified firing (architecture.md §6.2).
5. §7.1 partner terms signed — **or** operator explicitly accepts running Ads while terms
   are pending (leads captured and held). Anton's call, recorded in writing.
6. Budget + bid caps set by operator.

### 6.5 Trend caution (from the data — do not oversell)

Trends are mostly flat or declining: "ovk besiktning bostadsrätt" −92% YoY, "stambyte
bostadsrätt hsb" −50% YoY, several 3-month declines. Only "stambyte brf" (+33% YoY) and
"5 års besiktning brf" (+50% 3-mo) trend up. Plan on flat demand; no growth assumptions
in any forecast. No seasonality data exists beyond these columns — don't invent a
"spring renovation season" narrative.

## 7. Unresolved business dependencies — PLANNED ≠ AGREED

| # | Item | Status | Risk if ignored |
|---|---|---|---|
| 7.1 | **Partner revenue-share terms (A and B)** | **Not finalized. No assumed %, no assumed exclusivity, no assumed lead-fee model.** Site build may proceed; formal lead handoff and any "vi levererar via certifierade partner"-claims tied to named firms wait for signatures. Also unconfirmed: who delivers tier 3 (upphandlingsstöd) and Partner A's OVK certification (plan.md D10). | Leads generated with no agreed economics; partner disputes; published claims that turn out untrue. |
| 7.2 | **Committable public pricing** for tiers 2–6 | Internal planning bands only (15–40k / 50–150k / 200k–1M+); garanti/OVK unpriced. | Publishing them as prices creates commitments partners never accepted. Follow plan.md D3 fallback. |
| 7.3 | **Calculator coefficients** | Must come from Partner B (plan.md D1). | A wrong number in the lead magnet destroys exactly the credibility this brand depends on. |
| 7.4 | **Keyword data gaps** (plan.md D4) + CPC ambiguity (D5) + SERP check (D6) | Open research tasks before Ads go-live / final on-page titles. | Bidding blind; mis-titled pages. |
| 7.5 | **Ads budget** | Not set (§6.3). | — |
| 7.6 | **Operator accounts**: Resend (or SMTP choice) + sending-domain DNS, GA4, Google Ads, Neon org/region, Hostinger plan confirmation, org.nr/legal identity for footer & privacy policy | All operator-side setup (plan.md D8/D9, architecture.md §10). | Phase 0/1 exit criteria unreachable without them. |
| 7.7 | **Closing discipline** | The CRM (stale-lead flags, auto follow-up tasks, daily digest) is built specifically to counter the operator's own noted pattern of strong starts and weak follow-through — but tooling only works if the digest is read and tasks are actioned. Recommendation: a standing weekly 30-min pipeline review (Anton + Diana if applicable) as an operating rule, not a software feature. | The single most likely failure mode of the whole business. |
