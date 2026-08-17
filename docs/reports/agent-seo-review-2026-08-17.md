# SEO review, 17 Aug 2026

*Agent: seo-performance-optimizer (Fable), read-only. Adjudicated by lead in HEALTH_CHECK_2026-08-17.md.*

## A. Verdict
Strong: canonical, robots meta, OG/Twitter, single-URL sitemap, no AggregateRating anywhere, entity-linked WebSite/Organization via @id, one H1 on the indexed home view, descriptive keyword-bearing alt text on hero, collage and cards, terminology rule clean (no "65 camps"/"100+ organizations" in src; org counts dynamic via allCamps.length). Live robots.txt and sitemap match the repo. Single biggest SEO risk today: staleness signals as the 2027 cycle opens ("Updated January 2026", "2026 Season NOW OPEN", sitemap lastmod) - covered by the approved rollover. Biggest UNaddressed structured-data issue: FAQPage markup for content that is not on the page.

## B. Findings (ranked)
1. **FAQPage JSON-LD marks up invisible content.** index.html:286-373 holds 10 Q&As; no FAQ UI exists in src. Google's guidance: content must be visible; since 2023 the rich result shows only for government/health sites. Today the block earns nothing and carries a small spammy-markup exposure; several answers dated. Fix: render a visible FAQ block (guide view or below-fold home) mirroring the same text, de-yeared; keep JSON-LD in sync. Do NOT simply delete: it is the richest text a non-JS fetcher receives. Risk Low. **[Lead: DEFERRED to rollover deploy; content addition]**
2. Staleness cluster: sitemap lastmod **[FIXED]**; "Camps verified for 2026 season | Updated January 2026", "2026 Season NOW OPEN", "fill by March 2026", "booked by January 2026" **[rollover]**.
3. Price claims contradict data: meta "Prices from €330", FAQ "€330-€2,000", ItemList "under €2,000", Guide badge "€330-CHF 7,000". Site tier is "Under €800/week"; true minimum €130/week. Fix in the SAME edit as the rollover title/meta change (touch the snippet once). Risk Low. **[DEFERRED to rollover, deliberately]**
4. Camp names are not headings (CardTitle renders a div; only compare view uses h3). Fix: h3 for card names, styling unchanged. Benefit: entity extraction for Google and AI, heading nav for screen readers. Risk Low. **[DEFERRED: structural, owner-visible; top recommendation]**
5. robots.txt: (a) trailing Disallow/Allow block attaches to the MJ12bot group; harmless. (b) Citation crawlers OAI-SearchBot, Claude-SearchBot, Claude-User, Perplexity-User, Meta-ExternalAgent fell under * (allowed); made explicit **[FIXED]**. (c) Google-Extended Disallow forgoes Gemini-app citations, not Search or AI Overviews (Google doc: not a ranking signal). **[Owner decision]**
6. Deprecated image sitemap tags (image:title/caption). Harmless. **[DEFERRED]**
7. Schema hygiene: serviceType/audience on Organization types are validator warnings only; numberOfItems **[FIXED]**; vague addresses. Optional.
8. ItemList URLs "#discover?category=..." landed on discover without the filter. **[FIXED tonight]**
9. Hash views open with H2; only / is indexed, a11y nit. **[DEFERRED]**
10. LCP hero is bundle-imported so cannot be preloaded from index.html; serve from /public with stable names + link rel=preload. COULD NOT measure LCP. **[DEFERRED, Phase 2/perf]**
11. **Testimonials at App.jsx ~3077-3140: "Sarah M., Munich", "Marcus K., Amsterdam", "Elena R., London", each "Platform User", five stars. COULD NOT VERIFY provenance.** If not real: E-E-A-T and consumer-law issue (fake reviews banned under UK DMCC 2024 and EU UCPD). Reachable only via #resources, so SEO exposure low; trust exposure real. Fix: verify or remove/relabel. **[Lead: FLAGGED URGENT for owner; this project had a fake-testimonial incident in Jan 2026]**
12. Hardcoded "24 Countries" in ~11 places will drift at country 25. Low priority.
Left alone on purpose: H1 wording (ranks; Med risk to change), title length (71 chars, ranks), og:locale.

## C. AI-citation notes
Evidence: WebFetch of the live homepage returns only the title; the SPA shell has no body text beyond noscript, and JSON-LD gets stripped by text converters. Non-rendering bots see title, description, possibly JSON-LD; the 65 camps live only in the JS bundle. Reasoning (labelled): the citation rate most likely comes from (1) exact-match domain and title for the head query, (2) Bing's rendered index (ChatGPT search leans on Bing; site ranks 1-3 on Bing), (3) the JSON-LD FAQ and category text being quotable, numeric and hedged, (4) directory format matching "list of" intents. Small, safe strengtheners: make the FAQ visible; keep JSON-LD current; card names as h3; a truthful visible "Last updated" line plus dateModified on the WebSite node; explicit Allow for citation crawlers (done). Structural, medium term: build-time prerender of the home view so camp names/prices exist in static HTML (Med risk; Phase 2). llms.txt: harmless, cheap, no measurable gain expected as of 2026 (Google says not needed; Perplexity reportedly reads it).

## D. Season-rollover SEO note
Agree with year-agnostic. Risk: title changes cause short-term CTR/rank wobble (Low-Med, days to weeks); mitigate by keeping "2027 season dates" visible in body text where load-bearing. Do it as ONE deploy: title, meta (fold in the €330 fix), H1 sub-line, WebSite alternateName/ItemList names, FAQ text (and the visible FAQ), noscript H1, sitemap lastmod. Never iterate the title twice. Re-check once GSC access lands.

## E. Coverage
Read in full: index.html, robots.txt, sitemap.xml, vercel.json, card.jsx. Grep-driven review of App.jsx (headings, alt, hash handler, counts, terminology) with targeted reads; camps.js grep. Verified live sitemap, robots and homepage shell. Fetched Google, OpenAI and Anthropic crawler docs. Not done: Lighthouse/CWV, Rich Results Test, Search Console (no access), OG image byte size, testimonial provenance. No files created or edited.
