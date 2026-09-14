# Static wave: implementation plan (14 September 2026, draft for three-seat review)

*Plan of record: `docs/reports/PHASE_2_COUNCIL_2026-09-13.md` sections 6.5 to 6.7, as amended by `docs/reports/AI_SEARCH_RESEARCH_2026-09-13.md` sections 8 and 12. This document turns those decisions into steps, files, tests, rollbacks and owner checkpoints. Nothing here re-opens a decision. Review seats and their adjudicated findings are in section 9.*

## 0. Invariants (fail the step if any is broken)

- The homepage's title, H1, canonical, JSON-LD and booking behaviour do not change. Permitted root edits: one visible link block outside the React mount (step 6), the shared outbound and consent code (step 3), and the booking control becoming a real link (step 3). Every root edit ships alone, proven by `scripts/cdp-verify.mjs --dump` before and after plus the tests named in its step.
- The generator never imports `src/App.jsx`; a validator asserts the boundary.
- No digit appears in hand-written page prose. Every price, date, age and count is interpolated from `src/data/camps.js`, `src/data/winterCamps.js` or `src/data/season.js`, and the postbuild validator asserts every printed figure is byte-equal to its source, in the visible text and in the JSON-LD.
- No em dash in any outward text; no URL is fabricated; every prose sentence with a factual claim carries a source comment in the template.
- No catch-all rewrite is ever added to `vercel.json`; `cleanUrls` stays off.
- Commit after every step with explicit paths; never push; the owner pushes.

## 1. Step 1: generator skeleton and asset loader prototype (day 1, no page content)

Files: `scripts/build-static-pages.mjs` (postbuild), `scripts/static-asset-loader.mjs`, `src/static/` (templates as plain functions returning strings; under `src` so Tailwind's content globs see the class names), `package.json` (`"postbuild": "node scripts/build-static-pages.mjs && npm run validate:static"`).
Mechanics: run after `vite build`; import the data modules and `season.js` only; resolve the compiled CSS by globbing `dist/assets/*.css` and asserting exactly one match; resolve image imports through the new loader, which maps `../assets/x.webp` to the hashed file emitted in `dist/assets/` (read the emitted file list, match by basename); emit `dist/<slug>/index.html`.
Test: build twice, once with the postbuild step disabled by an environment flag, and hash `dist/index.html` and every pre-existing asset; the hashes must be identical (this is the once-only double-build check; from then on step 2's per-build hash guard applies). A smoke page with one card image must render the image at a `/assets/...` URL, not "placeholder".
Rollback: delete the postbuild entry; nothing else changed.

## 2. Step 2: validate:static and the protection contract (day 1)

Files: `scripts/validate-static.js`, wired as the second postbuild command.
Checks: (a) the generator step hashed `dist/index.html` and all pre-existing assets immediately before it ran and they are unchanged after; (b) no `App.jsx` in the generator's import graph; (c) every generated page has exactly one `<link rel="canonical">` equal to its own URL, a `<title>`, one H1 that does not contain "European Summer Camps" or the head terms, an ItemList and BreadcrumbList JSON-LD with real URLs, no `noindex`, no `max-snippet` or `nosnippet`; (d) every price, date and age string on the page is byte-equal to a field in the data modules, and every numeric token in prose is inside an interpolation marker; (e) every internal link is written without a trailing slash; (f) every generated page carries `contentValidUntil` derived from the sessions it displays, and an expired page is emitted as a noindex stub and excluded from the sitemap (step 8).
Test: a fixture page with a typed digit fails; a page with a wrong canonical fails; the clean pages pass.
Rollback: none needed; a failing validator blocks the deploy, which is its job.

## 3. Step 3: outbound extraction and the booking control as a real link (day 2, root edit, ships alone)

Files: `src/lib/outbound.js` (exports `buildOutboundUrl`, `trackOutboundClick`, `GA_EVENT_NAME`, the parameter names); `src/App.jsx` and `src/components/CampCard.jsx` import from it; the card's "View Details & Book" becomes `<a href={trackedUrl} target="_blank" rel="noopener noreferrer">` with the same classes and the existing click handler firing `camp_booking_click` with identical parameters; no `window.open`.
Tests: before the change, capture `buildOutboundUrl(camp.bookingUrl, camp)` for all 78 rows to a fixture file; after, assert byte-equality. `scripts/cdp-verify.mjs --dump` before and after: the only DOM difference is button-to-anchor on the booking control. In GA4 DebugView, one click with consent accepted fires `camp_booking_click` with the same parameters; one click with consent rejected fires nothing and still opens the operator page. Lint and build green.
Owner checkpoint: visual check on production after the push (desktop and phone width), then the winter partner's card once.
Rollback: `git revert` of the single commit.

## 4. Step 4: shared consent and GA4 script for static pages (day 2)

Files: `public/static-boot.js` (external, never inline, because the CSP has no unsafe-inline): reads `localStorage` key `cookieConsent`, renders the same banner markup as the app, loads gtag on consent, delegates clicks on `a[data-booking]` to fire `camp_booking_click` with the parameters from `src/lib/outbound.js` (built into the file by the generator from the same constants). Templates reference it with a hashed filename.
Test: on a preview deployment, consent accepted then a booking click shows in DebugView; consent rejected shows nothing; the CSP report-only header logs no violation.
Rollback: remove the script tag from the templates.

## 5. Step 5: batch 1a, the how-we-verify page (target 22 September)

Files: `src/static/pages/how-we-verify.js`, content drafted in `docs/drafts/2026-09-14-how-we-verify.md` for the owner's read.
Content: what verified means here (operator's own page, date shown, per child, currency and unit, season), who checks (the founder, with an AI engineering team), the limits (we do not inspect camps, we do not hold bookings), the correction route (contact address, same-day fix), the paid-listing disclosure (administration fee, Premium placement), the last-updated date from `season.js`. Answer block first, then sections of 100 to 180 words under question headings. No camp figures on this page. JSON-LD: WebPage and BreadcrumbList. Self-canonical.
Release: sitemap entry with real lastmod; the link block on the homepage (step 6) points to it; IndexNow ping (step 7); Search Console URL Inspection request the same day; record the request date. Measurement: days to indexed, days to first impression. Trigger: not indexed within ten days reorders batch two to Switzerland and Spain.
Rollback: remove the page from the generator; republish a noindex stub for 90 days if it had been indexed.

## 6. Step 6: the homepage link block (with step 5, root edit)

File: `index.html`, a small `<nav aria-label="Guides">` placed after the `#root` div and before `<noscript>`, listing the static pages as plain anchors without trailing slashes, styled by the compiled CSS classes already present. React does not touch it.
Test: `scripts/cdp-verify.mjs --dump` shows the grid unchanged; the block renders at phone width without overlap; the validator (step 2) asserts the block exists and links only to generated pages.
Rollback: revert the commit.

## 7. Step 7: IndexNow (with step 5)

Files: `public/<key>.txt` (the key is a random 32-character string; it is not a secret), `scripts/indexnow-ping.mjs` (POST to api.indexnow.org with the changed URLs), run by the deploy workflow after a successful production build, or by hand after each batch.
Test: one ping returns HTTP 200 or 202; Bing Webmaster Tools shows the URL received within a day.
Rollback: none needed.

## 8. Step 8: expiry, sitemap and the weekly rebuild (with step 5)

Files: the generator writes `dist/sitemap.xml` from `public/sitemap.xml` plus every generated page with lastmod from the data; expired pages (contentValidUntil in the past) are emitted as noindex stubs and left out of the sitemap; `.github/workflows/weekly-rebuild.yml` already exists and needs the owner's `VERCEL_DEPLOY_HOOK_URL` secret.
Test: a fixture with a past contentValidUntil produces a stub and no sitemap entry; the live sitemap validates.
Owner checkpoint: create the deploy hook and the secret; run the workflow once by hand.

## 9. Step 9: trailingSlash and 404 (between batch 1 and batch 2, own commit)

Files: `vercel.json` gains `"trailingSlash": false`; `public/404.html` (plain page, brand header, link home, no figures).
Test on a preview deployment, curl matrix: `/`, `/index.html`, each generated path with and without a trailing slash (200 and 308), an asset path, a hash URL, an unknown path (404 with the branded page), and the security headers on every response.
Rollback: revert the commit.

## 10. Step 10: batch 1b, the winter page (target 26 September)

File: `src/static/pages/winter-camps-europe.js`, built from the eleven `winterCamps.js` rows. Answer block first (count, countries, price range in local currencies, date window, check date), then one section per camp of 100 to 180 words under a question heading, each row with name, town and country, ages, price with unit and currency, dates, what the price includes (from highlights), "verified on the operator's page, <date>", and the booking link with the UTM baked in. JSON-LD ItemList of the camps. contentValidUntil from the latest session end.
Gate: the image loader proven on a preview; the winter FAQ answer on the homepage consistent with the page.
Owner checkpoint: read the page on the preview before release. Winter partner told of the page in the next reply.

## 11. Step 11: batch 2, the Nordic pages (target 5 October)

Files: `src/static/pages/summer-camps-norway.js`, `summer-camps-denmark.js`, `summer-camps-sweden.js`, `nordic-summer-camps.js` (carries Finland).
Gates per page: every camp on it has its 2027 dates and price re-read on the operator's page (Wave 2), recorded in the provenance comment; four or more verified operators on a standalone page; at least one fact class the pages ranking for its query lack, recorded by opening those pages on the release day; keyword volumes and Bing country impressions pulled before this batch or recorded NOT FOUND.
Content rule: one page, one question; no page merges; focused sections; no listicle framing.

## 12. Step 12: batch 3, Switzerland and the big five (target 20 October)

Files: `summer-camps-switzerland.js` (a price-transparency page: what a Swiss camp costs for 2027, with dated sources; no camp-count claim anywhere), `summer-camps-spain.js`, `summer-camps-france.js`, `summer-camps-united-kingdom.js`, `summer-camps-germany.js`, `summer-camps-italy.js`. Same gates as step 11.

## 13. Measurement, before step 5 ships

`scripts/ga4-ai-referrers.py` monthly (baseline recorded 13 September); the Search Console generative AI performance report and the generative AI control (Include) read once; Bing AI Performance read once; the fixed head-query cohort by device and country weekly; per-URL impressions for every generated page; booking clicks by landing page with the operator report grouped by camp. Abort rule: technical or consent regressions stop deployment; sustained deterioration of the head-query cohort pauses expansion and triggers diagnosis.

## 14. Owner checkpoints, in order

1. Vercel deploy hook and the GitHub secret (step 8).
2. Search Console generative AI control reads Include; screenshot the generative AI report and Bing AI Performance for September (step 13).
3. Vercel Firewall: the managed AI-bots ruleset is inactive (no change needed if so).
4. Visual check of the booking-link change on production (step 3).
5. Read the how-we-verify draft and the winter page on preview before each release (steps 5 and 10).
6. Decide the Les Elfes card extras wording.
7. Push after each commit batch.

## 15. Review seats and adjudication

*(filled in after the three reviews: read-only engineering agent, seo-performance-optimizer agent briefed on the AI-search record, GPT-6 Astra)*
