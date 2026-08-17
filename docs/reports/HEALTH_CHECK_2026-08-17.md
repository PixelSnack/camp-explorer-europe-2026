# Site Health Check, 17 August 2026: Synthesis and Morning Briefing

*Lead: ESC Claude (Fable 5), full delegated authority overnight. Panel: security-audit-specialist (Fable), enterprise-code-reviewer (Fable), seo-performance-optimizer (Fable), camp-data-verifier x2 (Fable), camp-content-researcher, plus GPT-5.6-SOL adversarial security review and the lead's own pass. All agents and externals read-only; only the lead touched code. Every finding below is ACCEPTED, REJECTED with reason, or DEFERRED. Nothing was pushed: all commits are local for your review.*

---

## ☕ Morning briefing (read this first)

**The one thing that matters most:** for eleven months the site served **no security headers at all**. `public/_headers` is a Netlify/Cloudflare-Pages format that Vercel silently ignores; every doc claiming "enterprise-grade CSP enforced" was wrong. Production had no CSP, no clickjacking protection, no nosniff, no Referrer-Policy. **Fixed tonight in `vercel.json`** (verified valid JSON, build green): X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy enforced; CSP in Report-Only so nothing can break; flip to enforced after a production console check. Push = the fix goes live. This was confirmed live via curl and independently by SOL and the security agent.

**Second most important:** the data on your five most-clicked camps had drifted. Les Elfes (your featured demo) was showing a per-week price for a product the operator sells only in two-week blocks; Adventure Camp Bavaria had the wrong age range (9-16 vs the real 7-17) and price; Enforex was €55/week under and one year short on ages. All corrected from official operator pages, with provenance comments. Two operators (Les Elfes, Bavaria) have already published Summer 2027; those two cards now show an accurate blue "2027 dates published" badge.

**Third:** your contact form's EmailJS setup can be abused as an open relay by anyone reading the bundle, if the template's recipient is `{{to_email}}`. That fix is in your EmailJS dashboard (five minutes, list below), not in code.

**Numbers you can now quote with confidence** (all GA4, in `docs/PARTNER_STATS_2026.md`): 94% engagement rate, 35% booking click-through, 1,668 booking clicks this year, **ChatGPT is your #2 traffic source at 21% of sessions**, 95 countries, 69% mobile. The ILC draft was corrected to these figures.

**⚠️ Needs your eyes, not mine:** the Resources page carries three five-star testimonials ("Sarah M., Munich", "Marcus K., Amsterdam", "Elena R., London", each labelled "Platform User"). Neither the SEO reviewer nor I could verify their provenance, and this project's own LESSONS_LEARNED records agents fabricating testimonials in January 2026. If these are not real families, they are a consumer-law problem (fake reviews are banned under EU UCPD and UK DMCC 2024) and an E-E-A-T problem. I did not remove them (content decision), but please confirm or delete today.

**What I did NOT do** (deliberately, for you to decide): flip CSP to enforced; enable HSTS includeSubDomains; change any UI; remove `to_email` from code (must follow the dashboard change, not precede it); add any camp; touch the season-rollover strings.

### Your morning checklist (in order)
1. **Review and push** the local commits in GitHub Desktop (list at the bottom). Then `curl -sI https://www.europeansummercamps.com/` should show the new headers.
2. **EmailJS dashboard** (highest-value five minutes): Templates → template_lm9wnse → set the To field to a fixed address (contact@ is fine; all five forward to the same inbox anyway) and remove `{{to_email}}`; Account → Security → enable "block non-browser API calls", domain allowlist for europeansummercamps.com/www, per-IP rate limit, usage alert; consider reCAPTCHA (needs a small code change, I can do it).
3. **Vercel**: confirm the plan. Hobby forbids commercial use and you now charge for listings. Enable Attack Challenge Mode / Firewall and a spend alert.
4. **Cloudflare**: is the DNS record proxied (orange cloud)? If DNS-only, there is no caching/WAF in front of Vercel. Add SPF, DKIM and DMARC for europeansummercamps.com so nobody can spoof partnerships@ to camps you are invoicing.
5. **GitHub**: 2FA on, secret-scanning push protection on (free for public repos), Dependabot alerts on.
6. **Google Analytics**: turn off Google Signals unless you use it (CSP scope + consent).
7. Send the 10 drafts when ready (ILC now has correct traffic figures).
8. Decide on the testimonials (above) and on the visible-FAQ recommendation (section 6).
9. After 48h of CSP report-only with a clean browser console on production: tell me and I flip it to enforced.

---

## 1. Security (adjudicated)

| # | Finding | Source | Verdict | Action |
|---|---|---|---|---|
| S1 | No security headers live; `_headers` ignored by Vercel | lead (curl), SOL, sec-agent | **ACCEPTED, CRITICAL** | Fixed: `vercel.json` (d54606e). CSP report-only → enforce after console check. `_headers` removed, docs corrected |
| S2 | EmailJS open relay / quota exhaustion via caller-controlled `to_email` + public IDs in bundle | sec-agent HIGH, SOL Medium, lead | **ACCEPTED, HIGH** | Owner dashboard (checklist 2). Tonight: maxLength on all form fields (50d99ab). Later: remove `to_email` after template hardcode; optional reCAPTCHA |
| S3 | 1.6MB PNG served as card thumbnail (bandwidth/DoS surface, LCP) | sec-agent HIGH | **ACCEPTED** | Fixed: import switched to pixel-identical 127KB webp (b12b5a1); PNG no longer in dist |
| S4 | Vercel plan may be Hobby (non-commercial) | sec-agent | **DEFERRED to owner** | Checklist 3 |
| S5 | Pre-consent preconnects to Google; dead Google Fonts preconnects | sec-agent MEDIUM | **ACCEPTED** | Fixed: removed from index.html (b12b5a1) |
| S6 | Privacy page thin (no controller, processors, transfer, retention) | sec-agent MEDIUM | **DEFERRED** (legal copy needs owner) | Draft privacy text next session |
| S7 | Booking URLs trusted without scheme check | sec-agent MEDIUM, SOL | **ACCEPTED** | Fixed: build-time validator enforces https + YouTube (b12b5a1) |
| S8 | ID 28 Jagiellonian URL points to an ONLINE course; IDs 24/31 use 2025 URLs | sec-agent | **ACCEPTED, DEFERRED to Wave 2** | Re-verify these three camps |
| S9 | About page "no commissions... unbiased" misleading once placement is paid | sec-agent MEDIUM | **ACCEPTED** | Fixed wording (50d99ab) |
| S10 | console.log shipped to prod (esbuild.drop under wrong key) | sec-agent LOW | **ACCEPTED** (verified in dist) | Fixed (b12b5a1) |
| S11 | Third-party emails in public repo (Boundless, LINEŠA contacts) | sec-agent LOW | **DEFERRED to owner** | Move partner tracker out of tracked docs? Your call |
| S12 | .env.production not gitignored | sec-agent LOW | **ACCEPTED** | Fixed |
| S13 | Dev server host 0.0.0.0 | sec-agent LOW | **DEFERRED** | Keep for phone testing; note |
| S14 | SearchAction schema `#discover?search=` landed on blank page | sec-agent LOW (SEO impact real) | **ACCEPTED** | Fixed: hash parser (50d99ab) |
| S15 | HSTS includeSubDomains/preload | SOL | **DEFERRED** | After DNS subdomain inventory |
| S16 | `interest-cohort` obsolete in Permissions-Policy | SOL | **ACCEPTED** | Using browsing-topics |
| S17 | vercel.json JSON escape invalid in first draft | SOL | **ACCEPTED** (SOL caught a real bug) | Fixed before commit |
| S18 | ld+json inline script would violate CSP script-src | SOL | **REJECTED**: CSP governs execution; `application/ld+json` data blocks are not executed and raise no violation. Report-only will confirm empirically | none |
| S19 | 13 dev-only npm advisories | audit | **ACCEPTED** | `npm audit fix` 13→1 (sharp, needs breaking major, deferred) |

Confirmed clean (agent + lead + SOL): no dangerouslySetInnerHTML/innerHTML/eval; all window.open noopener,noreferrer; search rendered as React text; consent gating correct for GA4 and Vercel Analytics; localStorage holds only cookieConsent; robots/sitemap leak nothing; no credentials in tracked files (case-insensitive scan).

## 2. Data accuracy (top-5 clicked camps, verified on official sites)

| Camp | Was | Now | Evidence |
|---|---|---|---|
| Les Elfes (featured) | From CHF 4,550/1 week; "June - August 2026" | **From CHF 4,750/2 weeks**; 6 Jun - 28 Aug 2027 (six 2-week sessions); badge "2027 dates published" | leselfes.com/dates-and-pricing: summer priced per two weeks only; 2027 4'750-6'500 CHF |
| Adventure Camp Bavaria | 9-16 years; €445/1 week; "July 22-29, 2026" | **7-17 years; From €435/1 week**; 27 Jun - 11 Sep 2027 weekly; badge "2027 dates published" | bookacamp.de: 7-17 on every row; 2027 €435-585 |
| Enforex Barcelona Beach | 5-14; €1,295/1 week | **5-15; €1,350/1 week** | enforex.com dates-prices |
| Altitude Camps | June 30 - Aug 15, 2026 | June 29 - Aug 14, 2026 | altitude-camps.com |
| EUROCAM Bohemia | matches | unchanged (2026 dates string is off; 2027 not published) | euro-camp.eu |

Note for the rollover: Les Elfes' shoulder-season two-week price (CHF 4,750 ≈ €2,500/wk) sits in the *premium* tier, not luxury; peak July (6,500) is luxury. `priceRange` left as luxury pending your call (it is the Luxury filter's anchor camp).

## 3. Links: 61/66 OK, 5 broken
Campi del Vento (404), Vierumaki Finnhockey (404), RS Sjøleir (404), Summer Camps Holland (404), Nordisk Sommerlejr (454). Replacement URLs: see section 7 (link-repair agent) below.

## 4. Traffic (full report: TRAFFIC_2026-08-17.md; partner-facing: PARTNER_STATS_2026.md)
2,186 sessions YTD; July record 382/302; engagement 94%; organic 66% + AI 16% = 82%; ChatGPT #2 source (21%); US/UK/ES/DE/FR top geos; mobile 69%; 1,668 booking clicks; 35% click-through in July.

## 5. Camp gap map (hockey + winter)
Strong: **Stadium Sports Camp** (Sweden, residential hockey, all 5 pass) and **Les Elfes Winter** (Verbier, all 5 pass, same operator as ID 1). Possible: Hockey Talent School Trinec (CZ), UCPA colos ski (FR), La Garenne winter, Leksand. Rejected: agency/hotel-based/reseller/group-only candidates (details in roadmap). **Winter recommendation: add as a separately labelled section, not an eighth category, and only after the year-agnostic rollover.** Full table in CAMP_EXPANSION_ROADMAP.md Batch 3.

## 6. Code quality and SEO (adjudicated)

**Code review verdict: B-** (enterprise-code-reviewer, Fable): coherent, accessibility-minded, SEO-literate, but one 4,700-line component with ~600 duplicated lines, no tests, a thin data validator, a routing bug reachable from the skip link, and stale docs. Full report: agent-code-review-2026-08-17.md. **SEO verdict** (seo-performance-optimizer, Fable): fundamentals strong (canonical, single H1, no AggregateRating, entity-linked schema, terminology clean, robots/sitemap match live); biggest risk is staleness as 2027 opens (rollover); biggest structured-data issue is FAQPage markup for invisible content. Full report: agent-seo-review-2026-08-17.md.

| # | Finding | Verdict | Status |
|---|---|---|---|
| Q1 | Hash handler: SearchAction `#discover?search=` and ItemList `#discover?category=` landed on blank/unfiltered pages; skip link `#main-content` blanked the page | ACCEPTED (SEO + a11y bug) | **FIXED**: split on `?`, whitelist sections, apply search + category |
| Q2 | esbuild.drop under wrong key; console.log shipped | ACCEPTED (verified in dist) | **FIXED** |
| Q3 | GA4: dead config keys + explicit page_view double-counted every consented load | ACCEPTED | **FIXED** (views metric halves from now; sessions/users unaffected) |
| Q4 | Compare toggle/remove buttons unlabeled | ACCEPTED | **FIXED** (aria-label, aria-pressed) |
| Q5 | `capacity: null` rendered " max" | ACCEPTED | **FIXED** |
| Q6 | "Showing 65 camps" breaks the 65-organizations rule | ACCEPTED | **FIXED** |
| Q7 | Three em dashes in camp highlights | ACCEPTED (ban) | **FIXED** |
| Q8 | ItemList numberOfItems 100 vs 7 items; sitemap lastmod stale | ACCEPTED | **FIXED** |
| Q9 | Citation crawlers implicit under * | ACCEPTED | **FIXED** (explicit Allow) |
| Q10 | FAQPage JSON-LD for content not visible on page | ACCEPTED | **DEFERRED to rollover deploy**: render a visible FAQ mirroring the JSON-LD (content addition, your call on placement) |
| Q11 | Meta/FAQ/Guide price claims "from €330" vs €130 floor and "under €800/wk" tier | ACCEPTED | **DEFERRED, deliberately**: change the snippet ONCE, in the same deploy as the year-agnostic title/meta |
| Q12 | Camp names rendered as div, not h3 | ACCEPTED (Low risk, real benefit) | **DEFERRED**: top structural recommendation, needs your nod (heading outline change) |
| Q13 | ~600 duplicated lines (CampCard, FilterBar, VideoButton, footer) | ACCEPTED | DEFERRED: Phase 2 refactor; note footer country list is hand-coded and MISSES Romania and Slovenia |
| Q14 | Marquee effect leaks timers/listeners | ACCEPTED | DEFERRED: patch recorded, apply with visual check (marquee is delicate) |
| Q15 | Contact modal: alert(), no dialog semantics/focus trap, timer not cleared | ACCEPTED | DEFERRED (UI behavior) |
| Q16 | No tests | ACCEPTED | DEFERRED: Vitest suite for filteredCamps/buildOutboundUrl/hash/validator recommended next session |
| Q17 | Validator only checked review fields | ACCEPTED | PARTIAL: URL checks added; id/category/priceRange/ages checks next |
| Q18 | Age filter blind spot for "6+ years (families)" / "All ages" | ACCEPTED | DEFERRED (filter behavior decision) |
| Q19 | Docs drift: CODE_STRUCTURE line map, README counts (36/21), CLAUDE.md schema fields | ACCEPTED | DEFERRED: docs regeneration pass |
| Q20 | Testimonials of unverifiable provenance | ACCEPTED as risk | **FLAGGED URGENT for owner** (briefing) |
| Q21 | Google-Extended Disallow forgoes Gemini-app citations only | noted | Owner decision |
| Q22 | H1 wording / title length | reviewer left alone | AGREE: ranks; do not touch |
| Q23 | Guides .docx/.txt crawlable in public/ | noted | Owner call (may be intended downloads) |

Rollover guidance from SEO review, adopted into the plan: do title, meta (fold in the price fix), H1 sub-line, alternateName/ItemList names, FAQ text + visible FAQ, noscript H1 and sitemap lastmod as ONE deploy; never iterate the title twice; expect days-to-weeks CTR wobble; re-check once GSC lands.

## 7. Link repair (5 broken → 4 replaced, 1 false alarm)

| Camp | Old | New | Notes |
|---|---|---|---|
| Campi del Vento (64) | .../campi-estivi-per-ragazzi (404) | .../campi-estivi-per-ragazzi.html | HIGH confidence; ages on site go to 25 (ours 7-19) |
| Vierumaki Finnhockey (65) | /en/finnhockey-school (404) | Finnish Finnhockey Camp page | Program REBRANDED "Finnhockey Camp"; Wave 2: rename + re-verify |
| RS Sjøleir (44) | rs-noatun.no (404) | sjoliv.rs.no/ungdomkurs/rs-sjoleir | Price updated From NOK 8,190/5 days (was 7,900); "no courses currently scheduled" on booking page |
| Summer Camps Holland (41) | /en/sailing (404) | /en/camps (org overview) | Lead chose overview over the keelboat course page (ours is an org-level listing, ages 7-17; course pages are 12-18) |
| Nordisk Sommerlejr (40) | 454 on curl | unchanged | Bot block on curl; page loads and matches our data |
All replacements verified 200 by the agent (WebFetch) and the lead (curl). Committed 7ba5075.

## 8. Commits tonight (all local, none pushed)
See `git log --oneline a1beb8d..HEAD`. Code/config: d54606e (vercel.json headers), 7cc6622 (camp data, 4 camps), 50d99ab (App.jsx batch A), b12b5a1 (config batch B), bdf8487 (npm audit fix), 138a183 (docs truth + remove _headers), 7ba5075 (links, hash whitelist, GA4, a11y, terminology), 117dd05 (category hash param, robots). Docs: traffic, partner stats, plan, roadmap Batch 3, six agent/external reports, this synthesis. Total ~30 commits. Build, prebuild validation and lint green on HEAD (2 shadcn lint warnings only).

## 9. Method notes
Plan file written before fixes (docs/plans/2026-08-17-overnight-fixes.md). Every fix: smallest change, build + prebuild validation + lint green, separate commit. SOL paired with two Fable passes (agent + lead). Session limit hit at ~22:53 and 02:30 reset; cron wake-up at 02:47 resumed cleanly; agents resumed from saved transcripts.
