# SERP notes — top 6 commercial terms

Manual SERP check per strategy.md §6.4 go-live checklist item 3 / keyword-data.md's documented
data gap ("no competitor share-of-voice / SERP data included"). Done via web search on
2026-07-18 — not a live Google SERP scrape, so treat competitor rankings as directional, not
exact positions. Re-verify with an actual incognito Google search from Sweden before finalizing
on-page titles or setting live Ads bids, per the original checklist item.

**Nothing here is used to fabricate pricing or claims on our own site** (plan.md's
no-fabrication rule still applies) — this is competitive context only, to sanity-check page
titles, on-page angle, and Ads difficulty per term.

## 1. "besiktning brf" (10/mo, CPC 15.62–136.51 SEK, High competition)

Independent besiktningsmän and inspection firms — no dominant industry brand:
[besiktningsman.se](https://www.besiktningsman.se/brf),
[sefast.se](https://sefast.se/tjanst/besiktning/fastighetsbesiktning-brf/),
[sverigesfastighetskonsult.se](https://www.sverigesfastighetskonsult.se/brf-besiktning-en-guide-for-bostadsrattsforeningar/)
(ranks twice — strong topical coverage), valfops.se, besiktningsbyran.se, and
[brfpris.se](https://brfpris.se/hiss/besiktning/) (a lead-gen/content site structurally similar
to what we're building, also ranks twice).

**Read**: fragmented SERP, no SBC/Riksbyggen/HSB dominance. Matches the High CPC in
keyword-data.md (real commercial competition) but the organic field is winnable —
`sverigesfastighetskonsult.se`'s double ranking (a dedicated guide page) is the closest
pattern to our `/` + `/stambyte` structure. No change to page titles indicated.

## 2. "stambyte brf" (50/mo, seed keyword)

Dominated by major industry brands: SBC, Riksbyggen, Bostadsrätterna, HSB (via mynewsdesk),
bostadsjuristerna.se, plus commercial firms Frakka, Edenbergs VVS, Svefab, Nabo.

**Read**: the hardest SERP of the six — matches strategy.md's existing call to treat the
stambyte informational cluster as an SEO-over-time play, not a quick-win target, and to lean
on Ads for near-term visibility on this term. No page-title change indicated; confirms the
existing strategy rather than changing it.

**Incidental data point** (third-party, not adopted as our own claim): multiple competitor
pages cite stambyte costs in the 150,000–350,000 SEK/apartment range (Stockholm-specific) and
400,000+ SEK for a whole small property. This is useful *context* for Partner B when they
eventually calibrate `lib/calculator-config.ts` (plan.md D1) — our current placeholder
per-apartment ranges (100k–300k) are in the right order of magnitude — but it is a competitor
marketing claim, not verified data, and must not be copied into our site as fact.

## 3. "ovk besiktning bostadsrätt" (70/mo, highest volume in the commercial dataset)

Industry bodies first (SBC, Bostadsrätterna), then dedicated OVK service firms:
[ovkcenter.se](https://www.ovkcenter.se/ovk-besiktning-bostadsratt) (ranks twice), item-inst.se,
scandvik.se, storstadensventilation.se, optihus.se, nordiskeo.se, sakraror.se.

**Read**: genuinely commercial — several dedicated OVK companies compete directly for this
exact phrase. Confirms keyword-data.md's Medium competition rating is real, not noise. Our
`/ovk-besiktning` page's current framing (statutory-requirement, "vi håller reda på när er
förenings nästa besiktning ska genomföras") differs from the competitor pattern (most lead
with "beställ offert" service framing) — worth keeping as a differentiator, no change made.

## 4. "5 års besiktning brf" (20/mo, CPC up to 81.81 SEK)

By far the thinnest SERP of the six: mostly **individual BRF associations' own pages**
announcing their own upcoming besiktning (brfsymfonin.se, brfbrommatracks.se, brfsolgrand.se,
hsbbrfboulevarden.se, tollarehamnplan.se), plus besiktningsman.se and a byggahus.se forum
thread. Only one dedicated commercial competitor page found.

**Read**: real white space. No company is systematically targeting this term the way OVK
companies target OVK terms. This supports the strategic thesis in strategy.md §4/§7.7 — the
garantibesiktning/2yr-5yr cluster is under-exploited relative to its recurring-revenue value.
`/garantibesiktning`'s consolidation-page approach is well-positioned here; no change made.

## 5. "ovk besiktning brf" (20/mo, CPC up to 72.62 SEK)

The most commercially saturated SERP of the six — 8+ dedicated OVK service companies:
hemluft.se, besiktningsföretaget.se ([xn--besiktningsfretaget-16b.se](https://xn--besiktningsfretaget-16b.se/tjanster/ovk-besiktning/brf/)),
ovkbesiktningar.se, nrklimat.se, svenskovk.se, ovkbrf.se, ovkbesiktning.nu, skandek.se.

**Read**: matches term 3's read — OVK is a crowded, established service-provider market
online. Ads campaigns targeting OVK terms (strategy.md §6.2 campaign 4) should expect real
auction competition from these firms specifically, not just generic besiktning companies.
Negative-keyword list is already reasonably tight; no change made based on this finding.

## 6. "stambyte bostadsrättsförening" (20/mo)

Same authority pattern as term 2: bostadsjuristerna, SBC, Bostadsrätterna, Nabo, Frakka, HSB,
Riksbyggen, plus two exact/near-exact-match commercial domains —
[stambyte.se](https://stambyte.se/stambyte-bostadsratt/) and
[stambytesgruppen.se](https://stambytesgruppen.se/stambyte-bostadsrattsforening/).

**Read**: essentially the same competitive set as "stambyte brf" — confirms these two
keywords are correctly treated as one cluster on `/stambyte` (strategy.md §4.1), not worth
targeting separately. No change made.

## Overall conclusions for the go-live checklist

- No on-page title/H1 changes indicated by this pass — current titles already differentiate
  reasonably from what's ranking.
- Confirms the existing Ads-now / SEO-over-time split in strategy.md is directionally right:
  stambyte terms are hard organic fights dominated by SBC/Riksbyggen/HSB/Bostadsrätterna; OVK
  terms are commercially crowded with dedicated service firms; `besiktning brf` and especially
  the garantibesiktning cluster are comparatively open.
- Still need before setting live Ads bids: an actual incognito Google.se search (this pass used
  general web search, not a Google SERP scrape) and the CPC re-verification already flagged as
  plan.md D5.
