# Code quality + SEO code review, 17 Aug 2026

*Agent: enterprise-code-reviewer (Fable), read-only, acquirer due-diligence lens. Line numbers refer to App.jsx BEFORE the lead's edits that night (subsequent edits shifted lines by ~+13). Adjudicated by lead in HEALTH_CHECK_2026-08-17.md.*

## A. Verdict
Grade today: **B-**. Coherent, accessibility-minded and SEO-literate for a hash-routed SPA, but an acquirer's engineer would see one 4,700-line component carrying ~600 duplicated lines, zero tests, a data "database" whose validator only checks review fields, a routing bug reachable from the skip link, and docs whose line maps are six months stale. Three things that most raise the grade: (1) extract CampCard, FilterBar and a data-driven SiteFooter (~600 lines out, no behavior change); (2) harden the data layer: extend scripts/validate-camps.js (id uniqueness, allowed category/priceRange, ages regex, https bookingUrl) plus a ~10-case Vitest suite for filteredCamps and buildOutboundUrl; (3) fix the hash-route whitelist and the marquee cleanup leak, then regenerate CODE_STRUCTURE.md.

## B. SEO findings (ranked)
1. Hash URLs in JSON-LD render a blank page: index.html:96 SearchAction "#discover?search=..." and seven ItemList URLs at 111-153 like "#discover?category=premium"; App.jsx hash handler had no "?" parsing and no whitelist, so activeSection became "discover?category=premium" (empty main). Same mechanism broke the skip link href="#main-content". Fix: split on "?", whitelist known sections. **[Lead: FIXED tonight, both parts]**
2. Stale year and price claims in the crawlable head: index.html:8 title "...2026", :10 "Prices from €330", :145 "under €2,000", :314 "(€330-€2,000)", :338 "booked by January 2026". Data floor is €130 (camps.js "From €130/week"); tiers documented as under €800/week. Fix in the year-agnostic rollover; align FAQ price bands with priceTierOptions; footer "€330+" and Guide badge too. **[Lead: DEFERRED to rollover deploy, one edit]**
3. index.html:104 numberOfItems 100 but 7 items. **[FIXED]**
4. sitemap.xml lastmod 2026-02-06 stale. **[FIXED: 2026-08-17]**
5. public/Guides/*.txt and .docx deployed and crawlable; duplicate of Guide section. Fix: move out of public/ or Disallow: /Guides/. **[DEFERRED: owner call; guides may be linked for download]**
6. Alt text describes content not in the image (all 65 cards use three stock images). **[DEFERRED: needs per-image copy decision]**
7. Discover/Compare/Plan open with h2, no h1 (Guide/Privacy/About do). **[DEFERRED: a11y nit, only / is indexed]**
8. Terminology breach: "Showing X of 65 camps", "Showing 65 camps". **[FIXED: organizations]**
9. footer role=contentinfo sits inside main; Impressum/Terms/About render after main. Fix: restructure. **[DEFERRED: layout change]**
10. Rollover residue in head: alternateName "...2026", noscript h1. **[DEFERRED to rollover]**

## C. Code quality (impact/effort; effort S/M/L, risk)
1. Duplication (M, Low): card render Home vs Discover (~190 lines), filter block (~140), video button x3, footer country list hand-coded 22 x 8 lines while countryList already derives it, and Romania and Slovenia are MISSING from the footer. Extract CampCard, FilterBar (or useCampFilters), VideoButton, data-driven footer. ~600 lines (13%). **[DEFERRED: Phase 2 refactor; footer omission noted for owner]**
2. Marquee effect leaks listeners/timers (initWithDelay cleanup discarded, timers never cleared). **[DEFERRED: marquee is delicate; exact patch recorded, apply with visual check]**
3. build.esbuild.drop is not a Vite key. **[FIXED, verified in dist]**
4. GA4 config dead params + double page_view. **[FIXED]**
5. Contact modal: alert() blocking; success timer not cleared; no role=dialog/aria-modal/Escape/focus trap. **[DEFERRED: UI behavior]**
6. exhaustive-deps allCamps. **[FIXED]**
7. A11y gaps: compare toggle no aria-label **[FIXED]**, compare X unlabeled **[FIXED]**, footer h5 onClick not keyboard reachable, search inputs placeholder-only labels, drawer buttons lack aria-pressed. **[rest DEFERRED]**
8. Breakpoints inconsistent (769/768/767 in App.jsx/App.css). **[DEFERRED]**
9. Render-time allocations (option arrays, routing map, multilingual terms recreated per render; sort per render). **[DEFERRED: hoist to module scope, safe next session]**
10. Hash/state desync: several setActiveSection calls without updating location.hash; unknown hash had no default. **[whitelist FIXED; single navigate() DEFERRED]**
11. shadcn theme tokens unwired (bg-primary etc. are no-ops; secondary and outline Badge identical). **[DEFERRED]**
12. Comment hygiene: hyperbolic/stale comments. **[DEFERRED, cosmetic]**
13. Dead deps: @tanstack/react-virtual (commented import), sharp (used only by favicon script), @types/react without TS. **[DEFERRED]**
14. Tests: none. Minimal surface: filteredCamps combos, buildOutboundUrl, getEmailRouting, hash parsing, validate-camps rules. Vitest + jsdom. **[DEFERRED: recommend next session]**

## D. Data layer
1. Validator scope was review fields only. **[PARTIALLY FIXED: https/YouTube URL checks added; id/category/priceRange/ages checks DEFERRED]**
2. Age-filter blind spot: "6+ years (families)" and "All ages (families)" fail the regex and match every age group. **[DEFERRED: filter behavior decision]**
3. Format drift: location includes country for ids 1-23 but not after; price unit "/1 week" vs "/week" vs "/day". **[Wave 2]**
4. Provenance: established 1364 (university, not camp) renders "Est. 1364"; ID 28 bookingUrl ends "-online"; 2025 URLs on IDs 24 and 31. **[Wave 2 re-verify]**
5. Em dash ban breached in three highlights. **[FIXED]**
6. 1.6MB PNG as card thumbnail. **[FIXED: webp]**
7. CLAUDE.md §7.1 schema lists duration/description/url which do not exist; actual keys differ. **[DEFERRED: docs pass]**

## E. Quick wins (no UI/behavior change): applied where marked FIXED above; remaining: hoist allocations, trim comments, robots Disallow /Guides/ (owner call).

## F. Docs drift
CODE_STRUCTURE.md section map off by 30-500 lines (actual: Home 948-1576, Discover 1579-1965, Compare 1968-2146, Plan 2149-2310, Guide 2313-2848, Resources 2850-3401 (absent from map), Privacy 3404-3460, Footer 3463-3928, Cookie 3932-3971, Impressum/Terms 3974-4115, About 4117-4313, Contact/Drawer 4316-4673); function table pre-extraction numbers; camps.js sample record stale (price unit, rating 4.7/259, priceRange luxury); "end of allCamps ~1193" is ~1542. README.md: "36 organizations, 21 countries" vs 65/24; "from €335" vs €130 floor; HSTS/CSP claim rested on the ignored _headers. CLAUDE.md §3.1 "App.jsx lines ~23-2500" stale. Hygiene: src/App.jsx.backup and .phase-b-backup on disk (gitignored). **[DEFERRED: docs regeneration pass next session]**

## G. Coverage
App.jsx read in full: 1-1400, 1400-2360, 3280-3460, 3440-3980, 4117-4700; grep-only 2360-3280 (Guide/Resources body) and 3980-4117. Read fully: index.html, vite.config.js, package.json, eslint.config.js, jsconfig.json, tailwind.config.js, postcss.config.js, components.json, .gitignore, sitemap.xml, robots.txt, _headers, main.jsx, index.css, App.css 1-140, camps.js (all), validate-camps.js, loaders, ErrorBoundary.jsx, ui/badge.jsx, button.jsx, drawer.jsx; CODE_STRUCTURE.md, README.md partial. Not read: ui/card.jsx, ui/breadcrumb.jsx, src/lib/utils.js, public/Guides, dist. No files created or edited.
