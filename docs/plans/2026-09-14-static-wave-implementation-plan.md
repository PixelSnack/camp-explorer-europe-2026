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

### 15.1 GPT-6 Astra (effort high, 6,557 characters, no web search; read in full)

| Finding | Verdict and change to the plan |
|---|---|
| Critical: matching a figure anywhere in the data cannot catch a price joined to the wrong programme; provenance explicit only for winter; the plan says eleven winter rows against the brief's ten | ACCEPTED. Step 2(d) becomes: every rendered offer is keyed by operator, programme, session and package, each claim is validated against that keyed source in the visible text and the JSON-LD, incompatible joins fail the build, and every offer row shows the operator source link, check date, currency, unit, season and inclusions. The count is eleven (ID 83 was published on 13 September); counts are always derived from the data, never typed. |
| Critical: step 4 builds a second consent implementation; the protection contract omits existing camp content and navigation | ACCEPTED. Step 3 extracts one consent and GA4 runtime module (`src/lib/consent.js`) used by the app and compiled into the static boot file; step 4 wires the static pages to it and writes no second implementation. Step 0 adds existing camp content and navigation to the protected list. |
| High: mandatory ItemList rejects the methodology page; unconditional rejection of noindex rejects the expiry stubs | ACCEPTED. Step 2(c) validates by page type and state: active methodology page needs WebPage and BreadcrumbList; active listing pages need ItemList and BreadcrumbList; active pages must be indexable; expired or withdrawn stubs must carry noindex and be absent from the sitemap. The methodology page's validity is tied to the season constants, not to sessions. |
| High: the 404 page and the routing and header checks arrive after batch one | ACCEPTED. `public/404.html` and the preview curl matrix (routing, unknown-path 404, headers, CSP, canonical, consent and GA4 script) move into the batch 1a release gate; the trailingSlash change keeps its own commit between batches; current slash behaviour is verified without changing configuration. |
| High: keyword volumes, the landing-page baseline and the scenario test slipped to batch two | ACCEPTED. Step 13 runs before batch 1a: volumes and Bing country impressions or NOT FOUND, the GA4 landing-page baseline, the three AI reports, and the reconstruction test of the February scenario's 8,000 monthly impressions. Unavailable volumes do not block a page that passed the gates. |
| High: no rebuild-failure alert; withdrawal stubs only for known-indexed pages; pings before deployment | ACCEPTED. The weekly rebuild is activated and smoke-tested before batch 1a and alerts the lead on failure or a missed run (workflow status notification); withdrawn URLs stay as informative noindex stubs for at least ninety days regardless of indexing; IndexNow pings, including withdrawals and expiries, run only after a successful production deployment. |
| Medium: "the founder" is not a named reviewer; "same-day fix" is an unsupported promise | ACCEPTED. The page names the reviewer and separates human checks from AI assistance; "same-day fix" is an owner decision before the draft is final. |
| Medium: the parent-journey test is missing | ACCEPTED. Before batch two: Claude in Chrome follows a parent question through the winter page to an operator's booking page, stopping before any form; blocking defects are fixed before expansion. |
| Most likely failure: step 2 rejects the first real pages; test with three fixtures (active methodology, active listing, expired stub) plus three mutations (wrong canonical, typed digit, price swapped between offer keys) | ACCEPTED as the first test written. |
| What must not change: static pages not prerendering; per-build root protection; real booking anchors; focused country pages with the gates; answer blocks without claiming they guarantee citations; pause and diagnose, never delete | Confirmed. |

### 15.2 Read-only engineering agent (Fable 5.1; checked every step against the repository by file and line)

| Finding | Verdict and change to the plan |
|---|---|
| High: step 8 rewrites dist/sitemap.xml while step 2(a) asserts every pre-existing dist file unchanged; vite copies public/sitemap.xml into dist, so the guard fails on every build | ACCEPTED. Step 2(a) hashes dist/index.html and every pre-existing dist file except dist/sitemap.xml; for the sitemap it asserts the homepage url block from public/sitemap.xml is present byte-for-byte and every other loc is a generated page. validate-camps.js keeps checking public/sitemap.xml. |
| High: step 4's "public/static-boot.js, hashed, built by the generator" cannot all be true (public is copied verbatim) | ACCEPTED. src/static/boot.js is a template; the generator imports src/lib/outbound.js and src/lib/consent.js, inlines the event name and parameter names, writes dist/assets/static-boot-<content hash>.js; per-camp values travel as data attributes on the anchor; CSP script-src 'self' covers it. |
| High: step 2 contradictions (noindex on stubs, ItemList on a page without camps, root links with a trailing slash) | ACCEPTED, folded into the page-type and lifecycle rule from 15.1; the root URL is exempt from the no-trailing-slash rule. |
| Medium: basename matching of images collides on prefixes and winter images exist only as .jpg; null-loader returns "placeholder" silently | ACCEPTED. Step 1 sets build.manifest true (changes nothing in dist/index.html) and resolves every image specifier through dist/.vite/manifest.json; a missing specifier throws, never falls back. |
| Medium: three booking controls, not two (App.jsx home grid, CampCard.jsx, App.jsx compare view); 79 rows (68 summer plus 11 winter); use Button asChild with an anchor so classes and data-slot survive; middle-click and ctrl-click on an anchor do not fire onClick, so a few referrals go untracked | ACCEPTED. Step 3 covers all three controls, the fixture covers 79 rows, the compare view gets its own cdp-verify check, and the anchor also listens to auxclick so middle-clicks are tracked; the residual gap (ctrl-click in some browsers) is recorded in FEATURED_CAMPS.md because the referral figure is a sold number. |
| Medium: "run by the deploy workflow" names nothing that exists; a push-triggered Action would race Vercel | ACCEPTED. IndexNow runs by hand after production verification of each batch. |
| Medium: until trailingSlash is set, /slug and /slug/ both serve 200, so batch 1 ships with duplicate URLs | ACCEPTED with a change to 15.1: the trailingSlash commit moves before batch 1a, alone, proven by the preview curl matrix; the council's "between batches" was written before this duplicate-URL fact was on the table. Preview tests require the owner to push a branch in GitHub Desktop; added to the checkpoints. |
| Low: cdp-verify dismisses the cookie banner before measuring, so the link-block overlap test must run before dismissal; template classes enlarge the CSS and change its hash, invisible to the double build | ACCEPTED. Overlap test at width 390 before dismissal; CSS size recorded before step 1 and growth capped. |
| Low: no lastmod source for a page without camp data | ACCEPTED. Each page module exports LAST_REVIEWED (ISO date); validate:static rejects a missing or malformed value. |
| Low: cheapest import-boundary assertion is a resolve hook that throws on any .jsx specifier | ACCEPTED. |
| Most likely failure: step 1's loader; test: after one build, import winterCamps.js through the loader and assert every image path exists under dist | ACCEPTED as the second test written, after the validator fixtures. |
| What must not change: index.html head, vercel.json headers and no cleanUrls, validate-camps.js static checks, the data-camp-card attribute, the outbound parameter names and values, the cookieConsent key, the prebuild chain | Confirmed. |

### 15.3 SEO seat (seo-performance-optimizer agent, briefed on the AI-search record, the seat reports, the competitor analysis and the council record before judging)

| Finding | Verdict and change to the plan |
|---|---|
| Blocking: no verification-date field exists; check dates live in comments the generator cannot read; the visible "verified on" line is the trait with experimental support (arXiv 2605.25517) | ACCEPTED. New step 0b before step 5: a `verifiedOn: "YYYY-MM-DD"` field on every row of camps.js and winterCamps.js, copied from the existing provenance comments, enforced in validate-camps.js (ISO date, not in the future). Until then the generator can print only the site-wide DIRECTORY_UPDATED month. |
| Blocking: step 2(c) bans max-snippet, but the root carries the permissive max-snippet:-1 form that lets Overviews and Copilot quote us | ACCEPTED. Every generated page carries `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`; the validator fails on noindex (non-stubs), nosnippet, noarchive, nocache, or a non-negative max-snippet. |
| Blocking: ItemList required on a page without camps | ACCEPTED (also raised by the other two seats; folded into the page-type rule). |
| Blocking: trailingSlash after batch 1 seeds duplicate URLs during the indexing measurement; add an X-Robots-Tag noindex check on the preview host | ACCEPTED (same as 15.2); the preview curl matrix asserts the preview host sends X-Robots-Tag noindex and production does not. |
| High: the ten-day trigger acts on a signal Switzerland and Spain cannot fix | ACCEPTED in part. The trigger becomes: if URL Inspection still reads "Discovered" or "Crawled, currently not indexed" 14 days after the request, re-inspect, verify the sitemap and link block, record it; batch two proceeds on its content gates. The council's reordering clause is retired; the winter page ships regardless, as decided. |
| High: the winter page drops three of the four winter standards (total cost with equipment and lift pass, teaching language, minimum age) | ACCEPTED. Each winter row prints instruction language, minimum age, and what the price excludes (from the row's data; the inclusion facts re-read on 13 September are in the highlights and provenance comments and move into fields in step 0b where needed). |
| High: no table anywhere; Bing's guidance names tables; a table is the most extractable form for non-rendering fetchers | ACCEPTED. Every multi-camp page carries, after the answer block, a table: camp, town and country, ages, price with currency and unit, dates, verified date, operator link. |
| High: one question heading per camp fights the evidence; use two to four question H2s and entity H3s per camp | ACCEPTED. Step 10 to 12: H2s are the page's real questions (two to four), H3s are entity headings "Camp, Town, Country". |
| High: no title formula or meta description rule | ACCEPTED. Title `<Topic> [year where load-bearing] | Camp Explorer Europe`, never leading with "European Summer Camps"; one interpolated description under 155 characters; validator asserts title and description uniqueness against the root and each other; og and twitter tags mirror them. |
| High: Sweden and Denmark sit exactly on the four-operator floor | ACCEPTED. Decided now: a row that fails its Wave 2 re-check folds into the Nordic page and that country page waits. |
| High: no rule for a camp whose 2027 dates are unpublished on release day | ACCEPTED in principle; exact wording adopted from the seat's continuation below. |
