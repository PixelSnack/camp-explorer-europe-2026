# Season Rollover Wave 1: decision record and implementation plan (3 September 2026)

*Lead: ESC Claude. Owner delegated full decision power for the night of 3 to 4 September 2026 ("follow your recommendations, run a Fable SEO check first, scalpel not axe"). Owner pushes in the morning. Evidence: docs/reports/GSC_PULL_2026-09-03.md, docs/reports/GSC_FIRST_PULL_2026-08-17.md, docs/reports/agent-seo-review-2026-08-17.md, an enterprise-code-reviewer inventory, a seo-performance-optimizer strategy review, a GPT-5.6-SOL adversarial review (15 findings) and live SERP checks.*

## Decisions (final)

1. **Title tag rolls the year in place, one token.** `European Summer Camps 2027 | 100+ Camp Programs | Camp Explorer Europe`. og:title and twitter:title follow. This reverses the 16 Aug year-agnostic decision for the title only, on data: year-bearing queries were 21% of classified query-row clicks over 90 days (7% in the post-season trough) at roughly double the CTR and the best positions in the dataset; "2027" queries do not exist yet but last cycle the new-year queries appeared in September and earned clicks from October; on "summer camps europe 2027" the site is absent from the top 10 while three competitors carry 2027 in their titles; Google documents no ranking cost for a title change and no freshness signal from a year in a title, only an "obsolete title" rewrite trigger when the year is not updated. Maintenance: one edit every September (checklist below). Rollback target if the title link misbehaves: the year-agnostic title `European Summer Camps | 100+ Camp Programs | Camp Explorer Europe`, never the 2026 string.
2. **Every other surface goes year-agnostic**: header brand lockup, marquee, hero stamp, CTA, Plan and Guide headings and timelines, footer, copyright, JSON-LD names and descriptions, noscript H1, sitemap image title, README. Years stay only where load-bearing: per-camp dates, per-camp booking badges, the "Updated <month year>" stamp, the meta description season mention.
3. **Booking badge default inverted**: absence of `bookingStatus` renders no badge; `"not yet open"` renders none; `"open"` renders green "Booking open"; any other verified string renders blue with that text. Three stale values removed from the data (IDs 15 and 18 "not yet open", ID 65 "Opens April").
4. **FAQ**: render the ten FAQPage questions visibly on the home view (native details/summary accordion, collapsed by default), de-yeared, price answer corrected; the JSON-LD stays and is kept in sync from the same data module. Reason: Google requires FAQPage content to be visible; deleting the block would remove the richest quotable text non-rendering crawlers see.
5. **Orphan downloads** `public/Guides/*.docx|*.txt` (2025-dated, unlinked, crawlable): removed from the deploy; they remain in git history.
6. **Price floor**: "from €330" becomes "from €130 per week" everywhere it appears (meta, FAQ, Guide, footer). Verified: lowest listing is Luontoliitto at From €130/week.
7. **Derived numbers**: country count and age span come from the data (true age span 3 to 20, hero said 3 to 24). Directory "Updated" month lives in one exported constant.
8. **About page**: "Licensed operation and regulatory compliance" and "Insurance coverage and liability assessment" become "as published by each organization" wording. The site does not verify licensing or insurance.
9. **Static notice above both camp grids**: most organizations publish 2027 dates between September and December; cards show the latest verified dates; a blue badge marks camps with 2027 dates published. Wording holds for winter programs.
10. **Not in this deploy**: camp-name h3 change, CSP enforce flip, EmailJS template pass, per-camp date changes, test infrastructure, component extraction, the parked overhaul. Warsaw Montessori (ID 24): booking URL points at a 2025 page that still returns 200, and the operator's 2026 page describes a children-only camp, not the family camp listed; Wave 2 re-verification item, untouched here.

## SOL adjudication (15 findings)
Accepted: 1 (FAQ visibility, resolved by rendering rather than deleting), 2 (title (b) plus the static notice), 3 (describe the 21% as classified-row share), 5 (age parser defined explicitly, validator coverage), 7 (explicit statuses reviewed, trimmed non-empty check), 8 (layout checks at 320/390/desktop, reduced motion), 9 (hash routes tested; IDs untouched), 11 (rollback target is the year-agnostic title), 12 (full-tree audit incl. dist and HTML entities), 13 (per-week unit kept, "Booking Information"), 14 (URL Inspection and request indexing after push), 15 (security check: no dangerouslySetInnerHTML, noopener preserved).
Partially accepted: 4 (description shortened to 157 chars; the "terminology violation" claim is wrong, CLAUDE.md permits "100+ verified camps"), 6 (About wording adopted; "verified" kept elsewhere because the methodology is published on the About page).
Rejected: 10 (dropping alternateName: "European Summer Camps" is the genuine public alias and the domain).

## Commit plan
1. `Data: remove stale booking statuses, year-less Filmkollo URL, derived directory constants, validator coverage` (camps.js, validate-camps.js, faq data module)
2. `Content: year-agnostic surfaces, inverted booking badge, visible FAQ, corrected price floor and age span` (App.jsx)
3. `SEO: title rolls to 2027 season; evergreen metadata, JSON-LD and sitemap` (index.html, sitemap.xml, README.md, public/Guides removal)
4. `Docs: Wave 1 record, September checklist, pickup block`

## Verification gates
Build, lint, validator; dev server at 320px, 390px and desktop across Home, Discover, Plan, Guide, About, footer, every hash route, console clean; full-tree audit for `2025|2026|€330|3-24|Season NOW OPEN|Opens April|anmalan-2026` classified line by line, plus `&mdash;|&#8212;|&#x2014;|—`, plus the built `dist/`; U+2014 count zero in outward text; JSON-LD parsed; security check; Fable SEO review before edits; Fable code review and security review of the diff; SOL diff pass. After the owner pushes: production visual and console check, `curl` of the live title, URL Inspection plus request indexing, sitemap resubmission, weekly GSC watch on head terms and 2027 queries for six weeks.

## September checklist (every year from 2027)
Roll the year in `<title>`, og:title, twitter:title and the meta description; refresh DIRECTORY_UPDATED; review every explicit `bookingStatus`; confirm the FAQ price answer against the data; bump sitemap lastmod; request indexing.
