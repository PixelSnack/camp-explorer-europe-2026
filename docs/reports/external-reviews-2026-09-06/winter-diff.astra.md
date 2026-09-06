**MEDIUM — Hash navigation bypasses drawer cleanup.**  
**Evidence:** `src/App.jsx`, hunks `@@459→464` and `@@588→594`: `handleNavigation()` closes the filter sheet, but the hash handler changes `activeSection` without doing so.

Back/forward, breadcrumb anchors and direct hash changes can therefore retain `filterSheetOpen`. Assuming the existing sheet or scroll lock reads that state, it can either remain over the destination or reopen when returning to Discover. The added cleanup covers buttons, not navigation generally.

**Smallest fix:** close the sheet in the recognized-section hash branch too; close the mobile menu there if still open. Keep unknown hashes such as `#main-content` non-navigational. Verify that filter-parameter updates within Discover do not unexpectedly dismiss an actively used sheet.

**MEDIUM — Required-array validation admits render-crashing data.**  
**Evidence:** `scripts/validate-camps.js`, `@@34→46`, checks only array existence and length; `src/components/CampCard.jsx`, activity/language/highlight rendering.

For example, `languages: [{}]` satisfies the new check but throws when React renders the object. `['']` also passes while producing an empty badge. This is a validator false negative, not evidence that today’s verified summer rows are broken. Likewise, `image: {}` passes the truthiness check despite not being a usable imported image URL.

**Smallest fix:** require every array element to be a nonempty string, and require `image` to be a nonempty string. Do not claim that a runtime string check proves import provenance. Add negative fixtures to the existing validator verification—not a new test framework.

**MEDIUM — A permitted winter price can lose its booking unit.**  
**Evidence:** `src/components/CampCard.jsx`, price block around lines 94–101; `scripts/validate-camps.js`, required-text check; `src/data/winterCamps.js`, per-child price contract.

`price: 'From €1,200/child/week'` passes the shown price validation, but renders “€1,200” and “child”; “week” disappears because only `split('/')[1]` is displayed. That is material information for parents. This is latent with the empty winter array, and inherited summer formatting must not be changed casually.

**Smallest fix:** for winter only, render the entire substring after the first slash. Leave the summer expression unchanged. Alternatively, explicitly document and validate a single-slash winter format such as `From €1,200/child per week`.

**MEDIUM — Winter hero contrast needs a winter-only safeguard.**  
**Evidence:** `src/App.jsx`, `@@1851`, hero overlay `via-black/40` with `text-gray-200` body copy and `text-gray-300` counts.

Assuming the supplied ski photograph contains bright snow behind the central text, the overlay is insufficient: white under 40% black becomes approximately `#999`, giving the gray body copy only about 2.3:1 contrast, below 4.5:1. This is a conditional risk supported by the CSS, not a measured failure of the unseen image.

**Smallest fix:** give the winter text a reliably dark backing, or strengthen the overlay enough to meet contrast over its brightest crop. Check mobile crops as well as desktop; changing the winter treatment need not touch summer.

**LOW — Protected-title checks confuse HTML formatting with title changes.**  
**Evidence:** `scripts/validate-camps.js`, `@@176→219`, `ogTitle` and `twitterTitle` regexes.

An unchanged title value with reversed attribute order or single quotes fails the build. Conversely, checking only the first match does not reject duplicate title metadata. Exact *values* are appropriate protection; exact attribute serialization is an unnecessary build constraint.

**Smallest fix:** extract the relevant tags and attributes independently of order and quote style, assert exactly one of each, then compare against the same protected strings. Do not modify the protected title values.

**LOW — The flag-off preview is genuinely public.**  
**Evidence:** `src/App.jsx`, `KNOWN_SECTIONS` and `@@1851`; `src/data/season.js`, publication-flag comment.

This is explicitly intentional, not an accidental bypass of the documented flag contract. Nevertheless, anyone can open `#winter` today and see the hero, season claim and empty state. If winter rows are subsequently added while the flag remains false, those rows and their booking buttons become publicly reachable before promotion starts.

**Smallest fix if that exposure is unacceptable:** allow the route only when `WINTER_PUBLISHED || import.meta.env.DEV`, handling the production hash as an unavailable route. Otherwise, record acceptance that this is a public preview. Do **not** add page-wide `noindex` to hide it: summer shares the same indexable URL. Fragment routing is neither access control nor a guarantee of crawler invisibility.

**LOW — Winter country totals lack the normalization used by the static summer check.**  
**Evidence:** `src/App.jsx`, `@@393`, `winterCountryCount`; `scripts/validate-camps.js`, static `countryCount`.

The required-text validator accepts surrounding whitespace. Winter rows containing `"France"` and `"France "` therefore count as two countries, although the static summer counter trims them.

**Smallest fix:** use `camp.country.trim()` in the winter counter. No summer-derived number needs to change.

### Checked clean

- **Summer filtering and ordering:** the shown Discover pipeline and featured-first comparator are unchanged. Both sorts operate on copies, not the source arrays. Winter counts do not enter summer calculations.
- **React extraction:** the key remains on the mapped `CampCard`; selection becomes an equivalent boolean prop. There is no new component state, custom memo comparator or captured selection state. The empty dependency array for winter country counts is appropriate assuming build-time, immutable data.
- **Comparison:** the supplied card wiring calls the existing selection handler with the same camp. Winter deliberately shares comparison state; season isolation should not be invented as a requirement. The unseen handler and persistence logic cannot be independently certified here.
- **Booking, video and GA4:** all shown video call sites retain `stopPropagation`, emit through one handler and open synchronously. Existing payload fields remain, with `camp_season` added and summer defaulting correctly. Booking delegates to the unchanged helper, so there is no visible UTM-construction change.
- **Security:** both popup paths retain `noopener,noreferrer`; no asynchronous popup step or new raw-HTML injection surface is introduced. React escapes the displayed string fields. The omitted URL-validation implementation prevents certifying its full parsing/host rules.
- **Validators:** positive integer IDs and duplicate detection cover both arrays; the featured cap is per category. Winter’s `"open"`-or-absent rule matches the stated contract. Badge extraction preserves summer status behavior.
- **Indexed Home:** the flag suppresses the new Home teaser and both nav entries. Protected metadata and summer data are not edited. Static image imports alone do not establish that winter images are downloaded on Home.
- **Accessibility:** comparison labels and `aria-pressed`, booking/video labels, and season-specific card alternatives survive extraction. Bottom date/status badges retain wrapping. The reported 65-card DOM equality strongly supports markup parity, but cannot establish click behavior or mobile layout.

### Remaining release checks

Extend the existing DevTools script to exercise Home, Discover and Compare booking/video clicks: one GA4 event, correct season, identical summer UTM output, and unchanged comparison/filter behavior. Cover back/forward with the drawer open.

At 320, 375 and 390px, use temporary winter fixtures with a featured badge, rating, booking-open badge, maximum-length dates and long price/type text. Inspect clipping and independently positioned top-badge collisions; a 40-character date cap is not a pixel-width guarantee. Restore the empty data and false flag afterward. Include one real-iPhone booking/video smoke check—headless Chrome does not establish Safari popup behavior.

No demonstrated **BLOCKER/HIGH summer regression** appears in the supplied diff.