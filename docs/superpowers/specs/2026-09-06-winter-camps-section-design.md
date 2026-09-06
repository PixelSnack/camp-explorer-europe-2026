# Winter camps section: design (6 September 2026)

*Status: approved direction (owner, 6 Sept 2026: "full power forward as recommended"); spec written for review before the build. Author: ESC Claude. Audience of the feature: parents choosing a winter camp for their child on a live production site.*

## 1. Goal and non-goals

**Goal.** Give www.europeansummercamps.com a winter camps section that (a) catches winter demand in the September to November window, which is the summer directory's quiet season, (b) rides the existing domain's ranking instead of starting a new domain from zero, (c) sells Premium placements to winter operators on real traffic, and (d) is built so the winter data and copy can be lifted into a standalone site later without a rewrite.

**Non-goals for this build.** No separate domain site (the owner buys europeanwintercamps.com as a defensive registration and points it at the winter section). No change to the title tag, H1, meta description or the summer headline numbers. No winter filters beyond a count line (with five to eight listings, filters would be noise). No new photography (CSS-themed header in the existing design language; a generated winter backdrop can follow).

## 2. Data

- New file `src/data/winterCamps.js` exporting `winterCamps`, an array with the same shape as `allCamps` plus `season: "winter"`. Same rules: per-child price with unit and provenance comment, `dates` under about 40 characters, `bookingStatus` only when verified, `rating: null, reviews: 0` unless reviews are verified, tested https `bookingUrl`, one `category` value `"winter"`.
- IDs continue the shared sequence (next free after 70, which is reserved for ILC), so comparison keys and `data-camp-card` stay unique.
- `allCamps` keeps meaning the summer directory. Every summer-derived number (marquee, hero stats, footer, About, Guide, filter counts, `countryList`, `AGE_SPAN`, sitemap caption) is untouched. The winter view derives its own count and country count from `winterCamps`.
- Booking badge: same `getBookingBadge` rules. First cut uses `"open"` (green) where registration is verified open and no badge otherwise; a "<year> dates published" label for a December-to-April season is left for a later decision, and the validator's year check stays as it is.
- `scripts/validate-camps.js` runs the same per-camp checks over `winterCamps` and additionally requires `season === "winter"`; it also checks that no ID is shared between the two arrays.

## 3. Routing and navigation

- `winter` joins `KNOWN_SECTIONS`; the view renders when `activeSection === 'winter'`, hash `#winter`.
- Menu item "Winter Camps" in the desktop nav and the mobile menu, placed after "Discover Camps". Breadcrumb entry "Winter Camps".
- `handleNavigation('winter')` is the only entry point; no filter state is changed on entry, so a parent returning to Discover finds their filters intact.

## 4. The winter view

- Header block in the existing card language: gradient background (deep blue to sky), H2 "European Winter Camps", one intro paragraph (ski and snowboard camps and winter sports schools, residential, December to April, booked individually), a hedged season line that holds for winter ("Most winter camps take bookings from September; dates shown are for the coming winter where published"), and the count line "N winter camps in M countries".
- Grid: the same card as the Discover grid. To avoid a third copy of 200 lines of card markup, the Discover card is extracted into a `CampCard` component (props: `camp`, `selected`, `onToggleCompare`, `onBook`) with no visual change; the Winter grid reuses it. The Home grid is left untouched in this build (it is the indexed view; zero-touch rule).
- Empty state: if `winterCamps` is empty the view shows the header and a "first winter listings arrive in autumn 2026" line; the menu item ships only when at least four verified winter camps exist.
- The filter FAB and the scroll-to-last-camp button work as on Discover (cards carry `data-camp-card`).

## 5. Crawlable surface (the SEO part that matters)

Hash views are invisible to crawlers, so the winter content that Google can read must live on the home view and in index.html:
- Home view: a short "Winter camps" teaser section between the FAQ and the footer: H2, two sentences, a button to `#winter`. This is the only crawlable winter text and it is written for the query "winter camps europe" without touching the summer H1 or title.
- FAQ: one new entry "Are there European winter camps for children?" in `src/data/faq.js`, mirrored into the FAQPage JSON-LD in index.html (the build fails otherwise).
- JSON-LD: the WebSite `mainEntity` ItemList gains an eighth `ListItem` "Winter Camps" pointing at `#winter`; `numberOfItems` becomes 8. BreadcrumbList gains "Winter Camps".
- Sitemap: unchanged (single URL). A real `/winter` URL is a Phase 2 item.
- Title, meta description, og tags, H1: unchanged. Protecting the head terms outranks winter.

## 6. Analytics and Premium

- `camp_booking_click` and `video_click` gain `camp_season: 'winter' | 'summer'` so winter referrals can be reported to operators.
- Premium works unchanged (`featured: true`, badge label by price class, video button). The cap of three Premium slots applies to the winter section as one category.

## 7. Copy rules

- Em-dash ban, no X-not-Y formulas, no tricolons, no numeric claims without a source. Booking-timeline wording must be true for winter camps (owner rule, 17 Aug 2026). Do not undersell the verification work; the FAQ answer names the five-point test.

## 8. Verification and rollout

1. Content first: at least four winter camps verified STRONG on all five points (Les Elfes Winter is the anchor; UCPA, La Garenne and the Finnish operator are candidates; German resellers are excluded by construction). Each number checked by the lead on the operator page; La Garenne's fee table needs a real browser.
2. Build in three commits: data plus validator; `CampCard` extraction with a before/after DOM diff of the Discover grid (no visual change); the winter view, nav, home teaser, FAQ and JSON-LD.
3. Reviews: my own full review of the diff, a GPT-6 Astra adversarial pass on the App.jsx diff (routing, counts, state), and a Gemini 3.8 Flash SEO second opinion on the teaser and FAQ copy. Every finding adjudicated in the plan record.
4. Gates: build with both validators, lint, headless-Chrome checks at 320, 390 and desktop (winter view, Discover unchanged, home teaser, all hash routes, console clean), then production visual check via Claude in Chrome after the owner pushes.
5. Rollback: revert the winter-view commit; data and validator commits are inert without it.

## 9. Later, not now

Separate domain when winter passes about ten listings and Phase 2 (React Router plus SSG) gives `/winter` a real URL; a generated winter hero image; a "2026/27 dates published" badge label; winter-specific filters; migrating the Home grid to `CampCard`.

## Decisions recorded

- On-site section over a new domain now: the domain's authority and the September-to-November window decide it; the defensive registration keeps the name.
- Separate data file over a `season` field on `allCamps`: zero regression risk for every summer-derived number and a clean extraction path.
- Hidden filter toggle rejected: no crawlable surface, nothing to sell, muddied counts.
