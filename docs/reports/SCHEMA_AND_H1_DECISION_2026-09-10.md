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
2. **Two of the three hand-written entries carry a descriptor where a street address belongs.**
   CORRECTION: an earlier version of this file said all three were invented. That was my
   own imprecision, not the reviewer's. The SEO agent said only that the three entries
   *carry* streetAddress fields, that `camps.js` has none, and that scaling that shape to
   67 would mean inventing 64 addresses. It singled out `"Verbier Resort Area"` alone.
   Checked each by hand:
   - Les Elfes: `"Verbier Resort Area"` is not a street address. FIXED to
     "Rue du Centre sportif 20", which the operator supplied in her own invoicing
     details on 8 September 2026.
   - Oxford Summer Courses: "18 Beaumont Street, OX1 2NA" is a real, specific address.
     LEFT ALONE. There was never any evidence against it.
   - EUROCAM Bohemia: "Slavnovice village area, near Luznice River" is a description,
     not an address. streetAddress REMOVED; locality, postcode and country kept.
   The lesson is the one from earlier tonight repeating: do not generalise a finding
   across a set from one confirmed instance. Verify each member.

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

## Final status, 11 September 2026: NOT IMPLEMENTED, tooling removed

**Decision: do not expand the ItemList. Do not touch the H1. Keep the two address fixes.**

The owner challenged the premise and was right. `numberOfItems: 3` is **not a defect**.
That list contains three items and declares three. It is an honestly labelled featured
subset and it is internally consistent. Astra said the same: a three-entry featured subset
was never a formal claim that only three camps exist.

What actually happened: the SEO agent framed it as "we present as a directory of three
camps", I carried that framing into my report instead of adjudicating it, and the owner
reasonably said "repair it". The moment to push back was when I first reported it.

### The adjudication failure, recorded so it is not repeated

Three times in one night I relayed a finding instead of judging it. The doctrine is that
external findings are input, never authority, and the lead adjudicates because the lead
has full project knowledge and the agents do not.

1. **"Paid placement" and `rel="sponsored"`.** Repeated from Astra. Wrong for this
   business, and it worried the owner. Premium does not buy inclusion: every camp passes
   the same five-point verification, and payment changes nothing about whether a camp is
   listed or what we say about it. `rel="sponsored"` covers links paid for **as links**;
   ours exist for all 67 camps regardless. The PREMIUM badge is the disclosure, and a
   visible badge is the normal convention for a directory. We follow the intent of the
   rules and run an honest business. We are not the angels in the class.
2. **"numberOfItems 3 is a problem."** Not a defect, as above.
3. **"The three entries carry invented street addresses."** My own over-generalisation.
   The agent flagged only "Verbier Resort Area" plus the scaling risk. Oxford's address
   was real.

Rule now in auto-memory as `adjudicate-agents-never-relay`.

### Why the tooling was removed rather than parked

The generator was the only thing in the repository capable of writing to `index.html`,
which carries the protected title, the meta descriptions and four other JSON-LD blocks.
Leaving an inert writer aimed at that file, on a live site ranking 1 to 5, is a risk with
no matching benefit while the change is not wanted. The knowledge is the valuable part and
it is all in this file.

### What was kept

The two address corrections, verified per entry, built and live. "Verbier Resort Area" was
not an address and the operator had given us the real one. "Slavnovice village area, near
Luznice River" was a description, not an address. Oxford's was left alone.

Production verified healthy afterwards: all five JSON-LD blocks parse, 67 cards render,
H1 and meta intact, hero loaded, no horizontal overflow, and the Back button fix confirmed
working on the live site.

### If this is ever revisited

Everything needed is above: the node shape, the omissions and why, the ISO mapping
requirement, the validator rules, and the measured page weight (53.4 KB raw, but only
5.4 KB gzipped over the wire; index.html would go from 5.7 KB to 11.2 KB gzipped).

Astra's four genuine technical findings, which any future attempt must handle:

1. `serviceType` belongs to `Service`, not `EducationalOrganization`, and `audience` is not
   in `Organization`'s domain. Both were wrong in the plan.
2. A closing script sequence inside any generated string would break out of the script
   element. Escape every literal `<` as a unicode escape. Ordinary camp names never
   exercise this, so it needs a deliberate test fixture.
3. A per-listing `@id` falsely asserts that two programmes from one operator are two
   different organisations. Omit it; merging is the correct behaviour.
4. Moving the block to the end of body does not improve LCP, because the bytes still
   precede the module script. Google supports JSON-LD in head or body, so placement is
   neutral and the block should simply stay where it is.

Also satisfied: the caveat about sequencing after the location fix. All 67 `location`
strings now end with a country anchor and `validate-camps.js` enforces it.

The hard dependency on TanStack Virtual stands: 67 entries in schema describes the page
only while all 67 mount in the DOM.
