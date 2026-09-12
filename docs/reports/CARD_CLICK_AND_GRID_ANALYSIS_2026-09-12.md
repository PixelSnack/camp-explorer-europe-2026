# Card click, four columns and the activities chip: who gains, who loses

*12 September 2026. Owner questions: how many visitors would a four-column desktop grid improve, cramp or leave unchanged; did Astra give a second opinion; should a click on the card open the booking site (with SEO); why does "+N more" do nothing. Numbers from GA4 property 521172443, 14 June to 11 September 2026. Astra's second opinion and its adjudication are at the end.*

## 1. Four columns: the honest headcount

Sessions in the window: 896. Mobile 648 (72 percent), desktop 241 (27 percent), tablet 7.

| Option | Better off | Worse off | Unchanged |
|---|---|---|---|
| A. Four columns inside today's 1280 px wrapper | 0 measured. Cards 27 percent narrower and rows 10 percent taller on every desktop | 241 desktop sessions, 27 percent | 655, 73 percent (phones and tablets) |
| B. Four columns from 1536 px with a 1600 px wrapper | At most 132 sessions, 15 percent (desktop screens at or above 1536 px, mostly 1920x1080; the 24 sessions on 1536 px screens are included because a width media query counts the scrollbar, and they would get 344 px cards, 10 percent narrower than today) | 0 by construction below 1536 px | 764, 85 percent |
| C. Leave at three columns | 0 | 0 | 896, 100 percent |

"Better off" in B is not established. Four cards of 360 px per row instead of three of 384 px is a density preference: more cards per screen, each 6 percent narrower, slightly more wrapping in names and highlights. No conversion evidence exists either way; the site's own data cannot show it because nothing has changed. So B is a change for 15 percent of visitors with an unproven benefit, and A is a measured loss for 27 percent. Under the owner's rule (a change must benefit a majority) neither qualifies. **Recommendation: C.** Revisit only if desktop share rises well above today's 27 percent, or if a partner or user test shows a preference for denser rows.

Astra was not consulted on the first version of this analysis (written on the owner's request as an investigation, without a panel round). It has now been given both questions with the full context; its verdicts are adjudicated in section 4.

## 2. Should a click anywhere on the card open the booking site?

What the code does today: the card carries `cursor: pointer` and a hover zoom, but no click handler. The only exit is the blue "View Details & Book" button, which fires the GA4 `camp_booking_click` event, appends the UTM parameters and opens the operator's site in a new tab with `noopener,noreferrer`. There is no anchor element to any camp site on the page, so crawlers see no outbound links. There are no internal detail pages; the button's "View Details" opens the operator directly.

The pointer cursor without a click is a false affordance, and the owner's own experience proves it: the card invites a click and nothing happens. That part must change one way or the other.

| Option | Effect on parents | Effect on the business | Accessibility | SEO |
|---|---|---|---|---|
| 1. Whole card opens the operator site | On a phone (72 percent), the card fills the screen and the list is scrolled by touch; taps that land on a card while scrolling or when reaching for compare or video open an external site in a new tab. Desktop users get a bigger target | Every accidental tap is a `camp_booking_click`, so the referral counts reported to paying partners inflate and stop being honest | A card with buttons inside (compare, video, activities) becomes a clickable region containing controls; screen readers announce a large element with no clear name; every inner control needs stopPropagation | None. A JS click handler is invisible to crawlers, so nothing is gained or lost |
| 2. Keep the button as the only exit, remove `cursor: pointer` from the card | Honest affordance; the image zoom stays as a hover delight | Referral counts stay clean | Unchanged, already correct | None |
| 3. Card click opens an in-site detail view (expanded card or modal) with all activities, all six highlights, the unused `specialFeatures` facts and the booking button | Gives the click a purpose, keeps accidental taps inside the site, surfaces verified content that is rendered nowhere today | Clean referral counts; more content per camp is the groundwork for the Phase 2 per-camp pages that will carry their own URLs | Needs a dialog pattern (focus trap, Escape, labelled heading); the shadcn drawer already in the project covers phones | None today (still one URL); becomes the content source for real camp pages later, which is where the SEO gain lives |
| 4. Wrap the card in a real anchor to the operator site | As 1, plus middle-click and right-click work | As 1 | Invalid HTML (buttons inside an anchor) and the worst screen-reader experience of the four | 68 crawlable outbound links appear on the page. Neutral to slightly negative for the single page's own ranking; no benefit to the site |

**Recommendation:** do not make the card an outbound link (options 1 and 4). Option 2 is the immediate, two-line fix: remove `cursor: pointer` from `.camp-card` so the card stops promising a click it does not deliver, and keep the hover zoom. Option 3 is the change worth planning: it answers "View Details" honestly, uses content already verified, and is the natural step towards per-camp pages. It is a proper feature (a design pass, mobile drawer, keyboard behaviour, GA4 event for opens), not a same-day edit.

## 3. The "+N more" chip, and Via Ferrata

All 68 camps have more than three activities (the largest list has twelve). The chip was a static badge with no handler, and the comparison view does not list activities, so the extra activities were visible nowhere on the site. Fixed on 12 September: the chip is a button that expands the row in place and collapses again ("Show fewer"), keyboard reachable with `aria-expanded`, identically in the shared card component and the Home grid copy.

Why the reviews did not catch it: every review this month checked facts against sources and the diff in front of it; none walked the card as a parent would. That is a gap in the review brief, now added to the panel brief template: "walk the card as a first-time parent and press everything".

"Via Ferrata" is not an error. It is a protected mountain climbing route with fixed cables and ladders (Italian for "iron path"), and ILC's own brochure and home page list it for the oldest group. It is jargon to most parents, so the chip now reads "Via Ferrata Climbing" on both cards that carry it. A wider pass over all activity and highlight strings for jargon a non-alpine parent would not know is a sensible follow-up.

## 4. Astra second opinion (gpt-6-astra, effort high, brief with the GA4 numbers, the measurements and the code facts)

Astra's verdicts, each adjudicated by the lead:

| Astra said | Verdict |
|---|---|
| Four columns: agree with C. A has demonstrated costs; B has plausible browsing benefits (more alternatives per scan, roughly a quarter fewer rows) but no evidence of better decisions or conversion, and even a proven gain for every exposed visitor would not reach a majority. | ACCEPTED. The recommendation stands. |
| A width media query includes the scrollbar, so 1536 px screens do reach the 2xl breakpoint and would get 344 px cards, not stay at three columns. | ACCEPTED, the table above is corrected: B changes about 15 percent of sessions, not 12. Conclusion unchanged. |
| The viewport-driven chip sizing and the badge clearance should be fixed before any density experiment. | ACCEPTED as a note for the day four columns is revisited. |
| Card click: recommend option 2 (explicit call to action only), option 3 second, whole-card navigation last; a whole-card anchor with buttons inside is invalid nested interactive content. | ACCEPTED. Matches the lead's ranking. |
| Remove the card-wide pointer cursor and the image zoom. | Cursor: ACCEPTED as part of option 2, pending the owner's choice between 2 and 3. Zoom: REJECTED, the owner asked to keep it, and a hover effect on an image is not a click promise. |
| Render the call to action as a real anchor with the UTM URL, fire the GA4 event only, no window.open; label it "Visit camp website" with a new-tab indication. | DEFERRED. Sound in principle (middle click, crawlable link, no popup blocking), but it changes the outbound tracking pipeline that was verified on production on 6 Sept, and window.open was chosen for synchronous behaviour on iOS. It needs its own round with a GA4 real-time check, not a same-day edit. The label question ("View Details" promises details the site does not show) goes to the owner with option 3. |
| Add rel="sponsored" to links on paid placements. | REJECTED, as on 11 Sept (owner-confirmed): every camp on the site carries the same booking link, free or paid; Premium buys card styling, placement and extra content, not the link. The links are editorial. |
| "+N more": agree with inline expansion; use a button, aria-expanded, aria-controls to a unique region id, keep focus on the toggle, let the card grow, no booking event. | ACCEPTED and implemented: button, aria-expanded, aria-controls with ids unique per view and camp, label "Show all N activities" / "Show fewer", row grows in place, no event fired. |
| Extract the activities block into a small shared component rather than two copies. | DEFERRED. The Home grid copy is deliberate (see CampCard.jsx header) and the FilterBar extraction is already the recorded tech debt; both copies were changed identically and verified. |
| Surface specialFeatures through a separate "More camp details" disclosure, not through the activities control. | ACCEPTED as the shape of option 3 if the owner chooses it. |

What Astra confirmed clean: the grid arithmetic, the traffic proportions, the handler behaviour and the interaction inventory. It reviewed the brief, not the live site.
