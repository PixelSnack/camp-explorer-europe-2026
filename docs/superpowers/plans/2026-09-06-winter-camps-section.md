# Winter Camps Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a winter camps section to www.europeansummercamps.com behind a publication flag, with its own data file, a shared card component, scoped hash routing, centralized analytics and a crawlable home teaser, without changing any summer-derived number or protected metadata.

**Architecture:** Winter camps live in `src/data/winterCamps.js` (same shape as `allCamps` plus `season: "winter"`); `allCamps` keeps meaning summer, so every summer count is untouched. The Discover card markup moves into `src/components/CampCard.jsx` with no visual change and is reused by a new `#winter` view. Two constants in `src/data/season.js` (`WINTER_SEASON`, `WINTER_PUBLISHED`) gate the season label and every promotional entry point. The validator grows global ID, required-field, winter-vocabulary, featured-cap and protected-title checks.

**Tech Stack:** React 18, Vite 7, Tailwind, shadcn/ui, lucide-react; Node validators run as prebuild; headless Chrome over the DevTools protocol for rendered checks (no test framework in this repo).

**Spec:** `docs/superpowers/specs/2026-09-06-winter-camps-section-design.md`

## Global Constraints

- Live production site with real income; scalpel not axe; every task ends in a passing build (`npm run build` runs both validators) and lint (`npm run lint`, 0 errors, 2 known warnings).
- Title tag, og:title, twitter:title, meta description, H1 and every summer-derived number stay byte-identical; the validator snapshot in Task 1 enforces the titles.
- Home grid markup untouched (indexed view). Discover card markup moves but its rendered DOM must be identical (Task 3 diff).
- Outward text: no em dash (U+2014), no unverified numbers, no safety guarantees, no X-not-Y formulas; booking wording true for winter.
- Winter rows: per-child price with unit and provenance comment; `dates` at most 40 characters; `bookingStatus` only `"open"` and only when verified; `rating: null, reviews: 0` unless `reviewData` is supplied; tested https `bookingUrl`; `category: "winter"`, `season: "winter"`; IDs continue the shared sequence (70 reserved for ILC, so winter starts after the new summer camps).
- Commit after every task with explicit paths (never `git add .`); never amend; the owner pushes via GitHub Desktop.
- `WINTER_PUBLISHED` flips to `true` only when at least four winter camps are verified STRONG on all five points.

---

### Task 0: Tag the known-good release

**Files:** none

- [ ] **Step 1:** `git tag pre-winter-2026-09-06` on the current HEAD (the last commit before any winter code). Rollback path (b) in the spec reverts to this tag's state for the Discover extraction; path (a) is the flag flip.

---

### Task 1: Season constants, winter data file, validator extensions

**Files:**
- Modify: `src/data/season.js`
- Create: `src/data/winterCamps.js`
- Modify: `scripts/validate-camps.js`

**Interfaces:**
- Produces: `WINTER_SEASON: string` ('2026-27'), `WINTER_PUBLISHED: boolean`, `winterCamps: Camp[]` (default export too), validator functions `validateCamp(camp, season)`.

- [ ] **Step 1: Append to `src/data/season.js`**

```js
/** Winter season label shown on the winter view. Roll every September together with SEASON_YEAR. */
export const WINTER_SEASON = '2026-27'

/**
 * Gates every promotional entry point of the winter section together (menu item, home teaser).
 * The #winter hash renders regardless so the view can be tested dark.
 * Flip to true only when at least four winter camps are verified STRONG on all five points.
 */
export const WINTER_PUBLISHED = false
```

- [ ] **Step 2: Create `src/data/winterCamps.js`**

```js
// Winter camp directory data: residential ski, snowboard and winter sports camps that individual
// families can book for one child. Same shape as allCamps in camps.js plus season: "winter".
// Rules: per-child price with unit and provenance comment; dates under 40 characters; bookingStatus
// only "open" and only when verified; rating null / reviews 0 unless reviewData is supplied;
// category "winter"; IDs continue the shared sequence (scripts/validate-camps.js enforces all of this).
import winterImage from '../assets/european-winter-camp-ski-lesson-children-alps.webp'

export const winterCamps = [
]

export { winterImage }
export default winterCamps
```

- [ ] **Step 3: Extend `scripts/validate-camps.js`**

Replace the imports and the per-camp loop with a `validateCamp(camp, season)` function that runs the existing checks and the new ones, then run it over both arrays. Add after the existing imports:

```js
import { winterCamps } from '../src/data/winterCamps.js';
```

Replace `for (const camp of allCamps) { ... }` (the whole existing loop body stays inside the function) with:

```js
const REQUIRED_TEXT = ['name', 'location', 'country', 'ages', 'price', 'dates', 'type'];
const REQUIRED_ARRAYS = ['activities', 'highlights', 'languages'];

function validateCamp(camp, season) {
  // ... existing bookingUrl, videoUrl, country, ages, bookingStatus, rating, reviews and reviewData checks ...

  // Required card fields (the card renders every one of these)
  for (const key of REQUIRED_TEXT) {
    if (typeof camp[key] !== 'string' || camp[key].trim() === '') fail(camp.id, camp.name, `${key} must be a non-empty string`);
  }
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(camp[key]) || camp[key].length === 0) fail(camp.id, camp.name, `${key} must be a non-empty array`);
  }
  if (!camp.image) fail(camp.id, camp.name, 'image must be an imported asset');
  if (!['budget', 'mid', 'premium', 'luxury'].includes(camp.priceRange)) fail(camp.id, camp.name, `priceRange must be budget|mid|premium|luxury, got: ${camp.priceRange}`);

  if (season === 'winter') {
    if (camp.season !== 'winter') fail(camp.id, camp.name, 'winter rows must carry season: "winter"');
    if (camp.category !== 'winter') fail(camp.id, camp.name, 'winter rows must carry category: "winter"');
    if (typeof camp.dates === 'string' && camp.dates.length > 40) fail(camp.id, camp.name, `dates must be 40 characters or fewer on winter rows, got ${camp.dates.length}`);
    if (camp.bookingStatus !== undefined && camp.bookingStatus !== 'open') fail(camp.id, camp.name, 'winter bookingStatus may only be "open" (verified) or absent');
    if (camp.reviews > 0 && !camp.reviewData) fail(camp.id, camp.name, 'winter rows with reviews must carry reviewData');
  } else if (camp.season !== undefined) {
    fail(camp.id, camp.name, 'summer rows must not carry a season field');
  }
}

for (const camp of allCamps) validateCamp(camp, 'summer');
for (const camp of winterCamps) validateCamp(camp, 'winter');

// Cross-array invariants
const seenIds = new Set();
const featuredByCategory = {};
for (const camp of [...allCamps, ...winterCamps]) {
  if (!Number.isInteger(camp.id) || camp.id < 1) fail(camp.id, camp.name, 'id must be a positive integer');
  if (seenIds.has(camp.id)) fail(camp.id, camp.name, 'duplicate id across the summer and winter arrays');
  seenIds.add(camp.id);
  if (camp.featured) featuredByCategory[camp.category] = (featuredByCategory[camp.category] || 0) + 1;
}
for (const [category, count] of Object.entries(featuredByCategory)) {
  if (count > 3) staticFail('paid slots', `category "${category}" has ${count} featured rows; the cap is 3`);
}
```

The existing bookingStatus year check must apply to summer rows only (winter rows are limited to "open" above), so wrap the `published && Number(published[1]) !== SEASON_YEAR` branch in `season === 'summer'`.

Replace the title check with an exact snapshot of the three protected titles:

```js
const expectedTitle = `European Summer Camps ${SEASON_YEAR} | 100+ Camp Programs | Camp Explorer Europe`;
const expectedShortTitle = `European Summer Camps ${SEASON_YEAR} | 100+ Camp Programs`;
const ogTitle = (html.match(/<meta property="og:title" content="(.*?)"/) || [])[1] || '';
const twitterTitle = (html.match(/<meta name="twitter:title" content="(.*?)"/) || [])[1] || '';
if (title !== expectedTitle) staticFail('index.html', `<title> must be exactly "${expectedTitle}", got "${title}"`);
if (ogTitle !== expectedTitle) staticFail('index.html', `og:title must be exactly "${expectedTitle}", got "${ogTitle}"`);
if (twitterTitle !== expectedShortTitle) staticFail('index.html', `twitter:title must be exactly "${expectedShortTitle}", got "${twitterTitle}"`);
```

Log line: `console.log(`Validating ${allCamps.length} summer and ${winterCamps.length} winter camps...\n`)`.

- [ ] **Step 4: Run the validator and expect PASS**

Run: `npm run validate:camps`
Expected: `All 65 summer and 0 winter camps passed validation.` (adjust the final log line accordingly).

- [ ] **Step 5: Prove the new checks fail on bad input**

Temporarily add `{ id: 1, season: 'winter', category: 'sports', name: 'x', location: 'x', country: 'x', ages: '6-12 years', price: 'x', priceRange: 'budget', rating: null, reviews: 0, image: winterImage, type: 'x', activities: ['x'], dates: 'x', highlights: ['x'], languages: ['x'], established: 2000, capacity: 10, bookingUrl: 'https://example.com/', bookingStatus: 'not yet open' }` to `winterCamps`, run `npm run validate:camps`, expect FAIL lines for duplicate id 1, category, and bookingStatus. Remove the row. Run again, expect PASS.

- [ ] **Step 6: Build, lint, commit**

```
npm run build && npm run lint
git add src/data/season.js src/data/winterCamps.js scripts/validate-camps.js
git commit -F <message file>   # "Data: winter season constants, empty winterCamps module, validator extensions (global IDs, required fields, winter vocabulary, featured cap, protected-title snapshot)"
```

---

### Task 2: Centralized booking and video instrumentation with `camp_season`

**Files:**
- Modify: `src/App.jsx` (module-scope helpers near `trackOutboundClick`; the three inline video handlers in the Home grid, Discover grid and Compare card)

**Interfaces:**
- Produces: `handleVideoClick(camp)` (module scope), `trackOutboundClick(camp)` now sends `camp_season`.

- [ ] **Step 1: Extend `trackOutboundClick` and add `handleVideoClick`**

```js
// GA4 Outbound Click Tracking - All camps for business intelligence
const trackOutboundClick = (camp) => {
  if (window.gtag) {
    window.gtag('event', 'camp_booking_click', {
      camp_name: camp.name,
      camp_id: camp.id,
      camp_category: camp.category,
      camp_country: camp.country,
      camp_season: camp.season || 'summer',
      is_featured: camp.featured || false,
      destination_url: camp.bookingUrl
    })
  }
}

// Video button: one event per click, then the YouTube link (window.open stays synchronous for iOS)
const handleVideoClick = (camp) => {
  if (window.gtag) {
    window.gtag('event', 'video_click', {
      camp_name: camp.name,
      camp_id: camp.id,
      camp_season: camp.season || 'summer'
    })
  }
  window.open(camp.videoUrl, '_blank', 'noopener,noreferrer')
}
```

- [ ] **Step 2: Replace the three inline video handlers** (Home grid, Discover grid, Compare card) with:

```jsx
onClick={(e) => { e.stopPropagation(); handleVideoClick(camp) }}
```

Markup, classes, aria-label and the SVG stay exactly as they are.

- [ ] **Step 3: Verify**

`grep -c "'video_click'" src/App.jsx` must print 1. `npm run build && npm run lint` pass.

- [ ] **Step 4: Commit** `git add src/App.jsx` with message "Analytics: one video_click and one camp_booking_click path for every placement; events carry camp_season".

---

### Task 3: `BookingStatusBadge` and `CampCard` extraction with a rendered DOM diff

**Files:**
- Create: `src/components/BookingStatusBadge.jsx` (moves `getBookingBadge` and `BookingStatusBadge` out of App.jsx unchanged)
- Create: `src/components/CampCard.jsx` (the Discover card markup, verbatim, with handlers as props)
- Create: `scripts/cdp-verify.mjs` (headless Chrome over the DevTools protocol against `vite preview`)
- Modify: `src/App.jsx` (imports; Discover grid renders `<CampCard>`)

**Interfaces:**
- `CampCard` props: `{ camp, isSelected: boolean, onToggleCompare(camp), onBook(camp), onVideo(camp) }`. Root element keeps `data-camp-card={camp.id}` and the exact class string. Alt text: `${camp.name} - ${camp.type} ${camp.season === 'winter' ? 'winter' : 'summer'} camp in ${camp.location} for ages ${camp.ages}`; title: `${camp.name} - European ${camp.season === 'winter' ? 'Winter' : 'Summer'} Camp ${camp.ages}`.
- `scripts/cdp-verify.mjs` usage: `node scripts/cdp-verify.mjs --url http://localhost:4173/ --hash discover --width 1280 --dump cards.txt` writes the concatenated `outerHTML` of every `[data-camp-card]` to the dump file, prints the count, the document width, horizontal overflow and console errors; `--shot file.png` captures a viewport screenshot.

- [ ] **Step 1: Capture the BEFORE dump** on the current build: `npm run build && npx vite preview --port 4173` (background), then `node scripts/cdp-verify.mjs --url http://localhost:4173/ --hash discover --width 1280 --dump "$SCRATCH/discover-before.txt"`. Expected: 65 cards, no overflow, no console errors.
- [ ] **Step 2: Create `src/components/BookingStatusBadge.jsx`** with the two functions exactly as they are in App.jsx (import `Badge` from `@/components/ui/badge.jsx`); export both. In App.jsx import them and delete the module-scope copies.
- [ ] **Step 3: Create `src/components/CampCard.jsx`** by moving the Discover `<Card ...>...</Card>` block. Replace `selectedCamps.find(c => c.id === camp.id)` with `isSelected`, `handleCampSelection(camp)` with `onToggleCompare(camp)`, `handleBookingClick(camp)` with `onBook(camp)`, the video handler with `onVideo(camp)`; import `mapCompressed` from `../data/camps.js`; import `Card, CardContent, CardDescription, CardHeader, CardTitle`, `Badge`, `Button`, icons `MapPin, Calendar, Users, Star, Globe, Award, Heart`, and `BookingStatusBadge`.
- [ ] **Step 4: Discover grid renders the component**

```jsx
{[...filteredCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((camp) => (
  <CampCard
    key={camp.id}
    camp={camp}
    isSelected={!!selectedCamps.find(c => c.id === camp.id)}
    onToggleCompare={handleCampSelection}
    onBook={handleBookingClick}
    onVideo={handleVideoClick}
  />
))}
```

- [ ] **Step 5: Capture the AFTER dump** and diff: rebuild, preview, `node scripts/cdp-verify.mjs ... --dump "$SCRATCH/discover-after.txt"`, then `cmp` the two dumps. Expected: identical bytes. Also run `--hash home --width 390` and `--hash discover --width 390` and check no overflow and no console errors.
- [ ] **Step 6: Commit** `git add src/components/BookingStatusBadge.jsx src/components/CampCard.jsx scripts/cdp-verify.mjs src/App.jsx`, message "Refactor: Discover card extracted into CampCard with identical rendered DOM (before/after dump diff); BookingStatusBadge moved to its own module; cdp-verify script added".

---

### Task 4: Routing, navigation, the winter view and the home teaser (dark behind the flag)

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `winterCamps`, `WINTER_SEASON`, `WINTER_PUBLISHED`, `CampCard`, `handleVideoClick`.
- Produces: section `winter` in `KNOWN_SECTIONS`; breadcrumb case; nav buttons gated by `WINTER_PUBLISHED`; `winterCountryCount` memo.

- [ ] **Step 1: Imports and whitelist**

```js
import { winterCamps } from './data/winterCamps.js'
import { SEASON_YEAR, DIRECTORY_UPDATED, WINTER_SEASON, WINTER_PUBLISHED } from './data/season.js'
import winterHeroAvif from './assets/european-winter-camp-ski-lesson-children-alps.avif'
import winterHeroWebp from './assets/european-winter-camp-ski-lesson-children-alps.webp'
import winterHeroJpg from './assets/european-winter-camp-ski-lesson-children-alps.jpg'
const KNOWN_SECTIONS = new Set(['home', 'discover', 'winter', 'compare', 'plan', 'guide', 'resources', 'privacy', 'about', 'impressum', 'terms'])
```

- [ ] **Step 2: Hash handler scoping** (filter parameters only on discover and home):

```js
const [section, query] = rawHash.split('?')
if (KNOWN_SECTIONS.has(section)) setActiveSection(section)
if (query && (section === 'discover' || section === 'home')) {
  const params = new URLSearchParams(query)
  const term = params.get('search')
  if (term) setSearchTerm(term.slice(0, 200))
  const category = params.get('category')
  if (category && KNOWN_CATEGORIES.has(category)) setSelectedFilter(category)
}
```

- [ ] **Step 3: `handleNavigation` closes the filter drawer**: add `setFilterSheetOpen(false)` as its first line.
- [ ] **Step 4: Breadcrumb case** after `discover`: `case 'winter': crumbs.push({ name: 'Winter Camps', href: '#winter', current: true }); break`.
- [ ] **Step 5: Winter count memo** next to `countryList`:

```js
const winterCountryCount = useMemo(() => new Set(winterCamps.map(camp => camp.country)).size, [])
```

- [ ] **Step 6: Nav buttons** (desktop, after Discover Camps; mobile, same position), gated:

```jsx
{WINTER_PUBLISHED && (
  <button onClick={() => handleNavigation('winter')} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'winter' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}>Winter Camps</button>
)}
```

Mobile variant uses the mobile classes (`block px-6 py-4 rounded-lg text-lg font-medium w-full text-left touch-target transition-colors ...`) and closes the menu.

- [ ] **Step 7: Winter view**, placed after the Discover fragment:

```jsx
{activeSection === 'winter' && (
  <>
  <section id="winter" className="relative overflow-hidden bg-gray-900">
    <picture className="absolute inset-0 w-full h-full">
      <source srcSet={winterHeroAvif} type="image/avif" />
      <source srcSet={winterHeroWebp} type="image/webp" />
      <img src={winterHeroJpg} alt="Children following a ski instructor on a gentle slope beside a wooden chalet at a European winter camp" className="w-full h-full object-cover" width="1376" height="774" loading="eager" />
    </picture>
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">European Winter Camps</h2>
      <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-6">Residential ski and snowboard camps and winter sports schools for children and teenagers, running from December to April and booked for one child at a time.</p>
      <p className="text-sm text-orange-200 bg-black/20 rounded-lg py-2 px-4 inline-block">Dates and prices are shown for the {WINTER_SEASON} winter season as published by each operator.</p>
      <p className="mt-6 text-sm text-gray-300">{winterCamps.length} winter camps in {winterCountryCount} countries</p>
    </div>
  </section>
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {winterCamps.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Winter listings are being verified</h3>
          <p className="text-gray-600 mb-6">Browse the summer directory in the meantime.</p>
          <Button className="btn-secondary" onClick={() => handleNavigation('discover')}>Discover Summer Camps</Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...winterCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((camp) => (
            <CampCard key={camp.id} camp={camp} isSelected={!!selectedCamps.find(c => c.id === camp.id)} onToggleCompare={handleCampSelection} onBook={handleBookingClick} onVideo={handleVideoClick} />
          ))}
        </div>
      )}
    </div>
  </section>
  </>
)}
```

- [ ] **Step 8: Home teaser**, inside the home fragment after the FAQ section, gated:

```jsx
{WINTER_PUBLISHED && (
  <section id="winter-preview" className="py-16 bg-white" aria-labelledby="winter-teaser-heading">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
      <picture>
        <source srcSet={winterHeroAvif} type="image/avif" />
        <source srcSet={winterHeroWebp} type="image/webp" />
        <img src={winterHeroJpg} alt="Children at a supervised residential ski camp in the European Alps" className="rounded-lg shadow-xl w-full h-auto" width="1376" height="774" loading="lazy" />
      </picture>
      <div>
        <h2 id="winter-teaser-heading" className="text-3xl font-bold text-gray-900 mb-4">Winter Camps in Europe</h2>
        <p className="text-gray-600 mb-6">Our winter section lists residential ski camps for kids and winter sports schools that run from December to April, verified against the same five-point criteria as every summer camp. Each listing shows dates, per-child prices, ages and what the price includes, with a direct link to the operator.</p>
        <Button className="btn-primary" onClick={() => handleNavigation('winter')}>View European Winter Camps</Button>
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 9: Verify** with `npm run build && npm run lint`, then `scripts/cdp-verify.mjs` at widths 320, 390, 768, 800, 1024, 1440 for hashes `home`, `discover`, `winter`, and the route `winter?category=sports` followed by `discover` (expected: 65 cards, no category chip). With the flag false the nav must not show "Winter Camps" and the home DOM must not contain `winter-preview`. Zero console errors.
- [ ] **Step 10: Commit** `git add src/App.jsx`, message "Feature: winter camps view on #winter (dark behind WINTER_PUBLISHED), scoped hash parameters, breadcrumb, gated nav and home teaser".

---

### Task 5: Winter data rows and the publish release

**Files:**
- Modify: `src/data/winterCamps.js` (verified rows), `src/data/season.js` (`WINTER_PUBLISHED = true`), `src/data/faq.js` (new entry), `index.html` (FAQPage mirror, ItemList eighth item, `knowsAbout`), `public/sitemap.xml` (lastmod)
- Create: `scripts/sync-faq-jsonld.mjs` (regenerates the FAQPage block from `faq.js`)

Precondition: at least four winter camps verified STRONG on all five points, each number re-read by the lead on the operator page (winter research report plus Chrome for pages that do not render).

- [ ] **Step 1: Data rows** in the `allCamps` shape plus `season: "winter"`, `category: "winter"`, `image` imported in winterCamps.js from one of the three card assets `src/assets/european-winter-camp-{snowboard-lesson-teenagers-alps,cross-country-skiing-children-nordic,chalet-evening-snow}.webp` (the ski-lesson hero stays a hero, not a card), `type` such as "Ski & Snowboard Camp", `dates` under 40 characters (for example "Dec 12, 2026 - Apr 24, 2027"), provenance comments on `price` and `dates`, `bookingStatus: "open"` only with a dated verification comment.
- [ ] **Step 2: FAQ entry** appended to `FAQ_ITEMS`:

```js
{
  question: "Are there European winter camps for children?",
  answer: "Yes. Our winter directory covers residential ski, snowboard and winter sports programmes that accept individual bookings for children and teenagers, with sessions between December and April. Listings show ages, dates and per-child prices as published by the operator. Check each programme's accommodation, supervision, ability requirements and availability before booking. Open the Winter Camps section from the menu."
}
```

Conditional wording (Fable SEO review, 6 Sept): only if the verified rows actually run those weeks, extend the first sentence with "with weekly sessions across the Christmas, February half-term and Easter school holidays"; only once the rows are verified, name their countries after "winter camps in Europe" (for example "in Switzerland and France"). Never claim a holiday week or a country that no row carries.

Two publish-time additions accepted from the Astra SEO review (6 Sept): (a) name two verified programmes inside the teaser paragraph (country, ages, session dates) so the crawlable surface carries concrete evidence; (b) send a `winter_view` GA4 event when `activeSection` becomes `winter` (one per section entry, `event_category: 'navigation'`), so teaser clicks and winter views can be read next to the season-tagged booking events.

- [ ] **Step 3: `scripts/sync-faq-jsonld.mjs`** reads `FAQ_ITEMS`, builds the FAQPage object with 2-space indentation matching the existing block, and replaces the block between `<!-- FAQ Structured Data for Rich Snippets -->` and the closing `</script>` in index.html. Run it, then `npm run validate:faq` must pass.
- [ ] **Step 4: index.html** ItemList: add position 8 `{"@type": "ListItem", "position": 8, "name": "Winter Camps", "description": "Residential ski, snowboard and winter sports camps for children, December to April", "url": "https://www.europeansummercamps.com/#winter"}` and set `numberOfItems` to 8; Organization `knowsAbout` gains "European Winter Camps" and "Ski Camps for Kids". Sitemap `lastmod` to the release date.
- [ ] **Step 5:** `WINTER_PUBLISHED = true`. Build, lint, cdp-verify at all widths (nav with the extra item at 768 and 800, teaser on home, 13 FAQ items, winter grid with the real rows, longest date and price strings on cards).
- [ ] **Step 6: Commit** with explicit paths, message "Content: winter camps published (N verified listings), FAQ entry mirrored into JSON-LD, ItemList and knowsAbout updated".

---

### Task 6: Reviews, gates, push, production verification

- [ ] **Step 1:** Lead's full review of the complete diff since the tag (CampCard, validators, data, analytics, JSON-LD).
- [ ] **Step 2:** Fable `enterprise-code-reviewer` on the same diff (model override fable), briefed with the audience, the constraints and the diff; then GPT-6 Astra via `scripts/ai-review.sh astra` with the same diff. Adjudicate every finding in the spec's adjudication section; land accepted fixes in a follow-up commit.
- [ ] **Step 3:** Rollback drills before the push: (a) set `WINTER_PUBLISHED = false`, build, confirm nav and teaser vanish, restore; (b) `git stash`-free check that `git revert` of the Task 3 and Task 4 commits applies cleanly on a throwaway branch, then delete the branch.
- [ ] **Step 4:** Owner pushes via GitHub Desktop; owner checks on an iPhone. Lead verifies production via Claude in Chrome (desktop and the headless phone-width pass): winter view, Discover unchanged, home teaser, console clean, live title unchanged (`curl` the HTML).
- [ ] **Step 5:** Weekly GSC watch adds the displayed title link and summer head-term positions against the pre-release baseline.

## Self-review

Spec coverage: data model and constants (Task 1), routing and nav (Task 4), winter view and empty state (Task 4), crawlable surface (Task 4 teaser, Task 5 FAQ and JSON-LD), analytics (Task 2), Premium sort and cap (Task 4 sort, Task 1 cap), copy rules (Tasks 4 and 5 text), verification and rollout (Tasks 0, 3, 6). Placeholders: none. Names used consistently: `winterCamps`, `winterImage`, `WINTER_SEASON`, `WINTER_PUBLISHED`, `CampCard`, `handleVideoClick`, `winterCountryCount`, `BookingStatusBadge`.
