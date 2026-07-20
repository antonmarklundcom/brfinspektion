# Google Ads campaign structure — built paused (Phase 4)

> Source of truth: `strategy.md` §6 (launch plan) and `plan.md` D5 (CPC label ambiguity).
> This document is the "campaigns built in paused state" deliverable from plan.md Phase 4
> task 2 — there is no Ads account connected to this repo, so the build is this written
> spec plus the conversion-tracking code (`lib/analytics.ts`, `components/marketing/CookieConsent.tsx`).
> The operator (or whoever has Ads account access) creates the campaigns from this spec and
> leaves them paused until §3 below is fully checked off.

## 1. Account settings

- Targeting: Sweden, Swedish language. No city/region campaigns — keyword-data.md shows no
  volume to slice geographically and the service is national.
- Bidding: Manual CPC or Maximize Conversions **with an explicit bid cap**. Never uncapped
  automated bidding — the account's conversion volume is too low for the algorithm to learn
  from, and uncapped bidding is the known failure mode at the CPC ceilings observed below.
- Match types at launch: phrase + exact only. No broad match until ≥90 days of search-term
  report data exists.
- Negatives (apply account-wide from day one): hsb, riksbyggen, sbc, nabo (brand traffic,
  wrong intent), förvaltning, jobb, lön, utbildning, bil (besiktning ambiguity with vehicle
  inspection), villa, hus (where irrelevant to BRF/bostadsrätt intent).

## 2. Campaigns

| # | Campaign | Ad group keywords (phrase + exact) | Landing page | Observed CPC (SEK) |
|---|---|---|---|---|
| 1 | Stambyte (core) | stambyte brf; stambyte bostadsrättsförening; stambyte i bostadsrättsförening; stambyte förening; kostnad stambyte bostadsrättsförening; besiktning stambyte | `/stambyte`, cost terms → `/stambyte/kostnad` | "stambyte brf" 26.83–84.23 **(ambiguous label — D5, re-verify before setting bids)**; "stambyte bostadsrättsförening" 7.15–71.46 |
| 2 | Besiktning (generic BRF) | besiktning brf | `/` | 15.62–136.51 — highest observed CPC; cap tightly and watch the search-terms report closely for irrelevant intents (e.g. överlåtelsebesiktning) to negative out |
| 3 | Garantibesiktning | 2 års besiktning bostadsrätt/brf/lägenhet; 5 års besiktning brf/bostadsrätt | `/garantibesiktning` | 8.20–81.81 across variants |
| 4 | OVK | ovk besiktning bostadsrätt; ovk besiktning brf; ovk besiktning lägenhet | `/ovk-besiktning` | 9.10–72.62 |

Conversion goals per campaign: `calculator_submit` (primary), `contact_submit` (secondary).
Both fire client-side on successful form submission — see `lib/analytics.ts`.

Do **not** add the six D4 keyword-gap terms (kontrollansvarig kostnad, besiktningsman
kostnad, ovk kostnad, relining vs stambyte, kontrollansvarig brf, entreprenadbesiktning)
until a fresh Keyword Planner pull confirms there is search volume behind them.

## 3. Go-live checklist — campaigns stay paused until every item is checked

- [ ] **D5** — fresh KWP pull re-verifying the "stambyte brf" CPC label (26.83 vs 84.23 SEK
      was ambiguously tagged in the original export).
- [ ] **D4 (partial)** — fresh KWP pull on the six gap terms above; add to campaigns only if
      the data supports it.
- [ ] Manual SERP check (D6) — `research/serp-notes.md` covers this via general web search;
      a real incognito Google.se search from Sweden immediately before setting live bids is
      still recommended per that file's caveat.
- [ ] Conversion tracking verified firing in both GA4 DebugView and the Ads account's
      "Diagnostics" tab for each conversion action — requires `NEXT_PUBLIC_GA_ID`,
      `NEXT_PUBLIC_GOOGLE_ADS_ID`, and the two per-action label env vars set in production
      (see `.env.example`).
- [ ] §7.1 partner terms signed, **or** the operator explicitly accepts running Ads while
      terms are pending (leads still captured and held) — Anton's call, recorded in writing.
- [ ] Budget and bid caps set by the operator (see strategy.md §6.3 — no figure is invented
      here; sizing logic only).

## 4. Setting up conversion tracking once the Ads account exists

1. In Google Ads, create two conversion actions: "Kalkylator — inskickad" and
   "Kontaktformulär — inskickat". Copy each action's conversion label
   (`AW-XXXXXXXXX/AbC-D_efG-h12` — the part after the slash).
2. Set env vars in hPanel: `NEXT_PUBLIC_GOOGLE_ADS_ID` (the `AW-XXXXXXXXX` part, shared by
   both actions), `NEXT_PUBLIC_GOOGLE_ADS_CALCULATOR_LABEL`, `NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL`.
3. Redeploy. `CookieConsent` loads the gtag.js snippet configured for both the GA4 property
   and the Ads account (still gated on analytics consent — no change to the consent model);
   `trackEvent()` fires the GA4 event and, when the matching label env var is set, an Ads
   `conversion` event via `send_to`.
4. Verify in GA4 DebugView and Google Ads → Tools → Conversions → the action → Diagnostics
   before checking off the go-live item above.
