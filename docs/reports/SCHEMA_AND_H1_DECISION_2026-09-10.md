# Bing "H1 tag missing", and what it actually points at

*10 September 2026. Owner asked for an Astra second opinion and an SEO agent third opinion after Bing Webmaster Tools flagged the home page. Lead adjudicates; both were paired with the lead's own read of the same files.*

## The verdict on the H1: change nothing

**Decision: ACCEPTED (both seats), no code change.**

Bing reports "Indexed successfully" and separately "1 SEO/GEO issue: H1 tag missing".
Verified in the served HTML: the only `<h1>` sits inside `<noscript>`, and `<div id="root">`
is empty. The real H1 exists only after React renders.

The three systems have to be separated, and both seats did so independently:

| System | Reality |
|---|---|
| Bingbot indexing | Renders JavaScript. Proof is in the report itself: it indexed us and we rank 1 to 5 on Bing using content that exists nowhere in the raw HTML. |
| The SEO/GEO analyzer | A static lint over a non-rendered snapshot. It does not count `<noscript>`. It has no input to ranking. |
| AI and LLM crawlers | Mostly do not execute JS. For them the body is four sentences of noscript plus our JSON-LD. This is the real gap, and it is not an H1 problem. |

**Why not ship a placeholder H1 inside `#root`:** with `createRoot` there is no hydration
mismatch, so it is mechanically safe, but it costs a certain layout shift and a visible
flash on mid-tier mobile to buy a probable lint change. We are green on CWV with headroom
and 70 percent of traffic is mobile. The `sr-only` variant is worse: it ships a heading no
human ever sees on a site ranking 1 to 5. **Rejected.** It belongs to Phase 2, where SSG
makes it free and correct.

**The `<noscript>` block stays exactly as it is.** It is honest, it serves real non-JS
users, and growing it into a keyword shadow page is the classic pattern that attracts a
manual review.

## The finding that actually matters, and that I had missed

`index.html` has **two** ItemList blocks, not one:

- line 94: the category list, `numberOfItems: 7`. This is the one I knew about.
- line 159: **"Featured European Summer Camps Directory", `numberOfItems: 3`.**

Verified in the file. To any crawler that does not run JavaScript, europeansummercamps.com
presents as a directory of **three camps**: Les Elfes, Oxford Summer Courses and one more.
We have 67 organisations. That is the moat, and it is invisible to non-rendering retrieval.

Both seats independently ranked fixing this far above the H1, and for the same reason: it
is invisible to users, so it costs nothing in flash, CLS, LCP or Lighthouse, changes no
protected copy, and it is the format AI crawlers parse best with no JS.

## Two problems that exist RIGHT NOW, regardless of any expansion

These are live today and are the reason this is not merely a nice-to-have:

1. **The list is called "Featured" and Les Elfes sits at `position: 1`.** Les Elfes is a
   paying Premium customer. ILC is about to be. A schema list titled "Featured" with a
   paying customer at position 1 conflates paid placement with editorial selection.
   `position` implies ranking. This needs a plain descriptive name, stable id order, and
   paid status kept out of the schema entirely.
2. **The three hand-written entries carry invented street addresses.** `index.html:171`
   has `"streetAddress": "Verbier Resort Area"`, which is not a street address.
   `camps.js` holds no street addresses at all, only `location` and `country`.

## If we expand it, the rules (adjudicated, not yet implemented)

- Generate from `camps.js` at build time. Never hand-edit. Add a validator rule so schema
  and data cannot drift, because drift between schema and page is a real spam signal.
- **Emit `addressLocality` plus ISO-2 `addressCountry` only.** Omit, never infer. Trim the
  three existing entries DOWN to this shape rather than scaling their invented shape up to 67.
- Emit `audience` only when both age bounds parse to integers. `parseAges` accepts
  "6+ years" and "All ages"; omit the node rather than guess.
- No `offers`, no `priceRange`, no `AggregateRating`. Price without a bookable offer on our
  own domain is a mismatch pattern, and it creates a second surface to keep in sync with the
  quarterly price review.
- Use `bookingUrl`. UTM is appended at runtime in `App.jsx:79` and must never reach schema.
- Give each node `@id` of `.../#camp-<id>` so two listings sharing an operator URL are not
  silently merged into one by consumers.
- **Do not invent `/camps/<slug>` URLs.** On this SPA they return the shell with HTTP 200,
  so a crawler finds 67 identical pages. Worse than omitting the field.
- Put the block at the END of `<body>`, not in head. `</head>` is line 441; adding ~1,900
  lines above the module script delays the parser reaching the bundle and risks LCP.

## The hard dependency to record

**This conflicts with TanStack Virtual.** Structured data must describe the page's primary
content. All 67 mount in the DOM today, so 67 in schema is honest. The day virtual
scrolling ships, roughly 15 items are in the DOM and a 67-item schema becomes a mismatch.
Treat expanding the ItemList and shipping virtual scrolling as coupled roadmap items.

## Status

Nothing implemented. The owner asked explicitly for a scalpel and no rash change.
The H1 decision is "leave it", which needs no code. The ItemList expansion is recommended
but not started, and items 1 and 2 under "problems that exist right now" should be fixed
whether or not we expand.

Also satisfied tonight: the caveat about sequencing after the location fix. All 67
`location` strings now end with a country anchor and `validate-camps.js` enforces it, so
deriving `addressLocality` can no longer encode the ID 29 wrong-continent defect.
