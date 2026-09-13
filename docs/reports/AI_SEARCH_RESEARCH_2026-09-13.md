# Being found, cited and used by AI systems: research record and action plan (13 September 2026)

*Owner's brief: "We're moving towards an internet where users don't move around on the net, but their personal AI does. Google recently made changes to search in this direction, and AI Overviews get more and more prevalent. We need knowledge on this." He also asked that the findings be held up against the Phase 2 council plan (`PHASE_2_COUNCIL_2026-09-13.md`, decision 6.5 as amended in 6.6 and 6.7).*

*Seats: three Fable 5.1 research agents (platform mechanics from primary documentation; citation studies and community sources; the agent-ready web), GPT-6 Astra with live web search (13 searches, 13,160 output tokens of which 7,983 reasoning), Gemini 3.8 Flash (no web access this run, answered from training, 5,524 output and 6,708 thinking tokens), Grok 4.6 with X search on the surviving xAI key (29 X searches, 10 web searches, 9,330 output tokens of which 5,524 reasoning). Every load-bearing claim below was re-read by the lead on the primary page on 13 September 2026 unless marked otherwise. Findings are adjudicated, never relayed: section 10 says what each seat claimed and what survived.*

## 1. Why this matters to this site, in our own numbers

GA4, 1 January to 13 September 2026, sessions and booking clicks by referrer (`scripts/ga4-ai-referrers.py`, new today):

| Source | Sessions | Booking clicks to operators | Clicks per session |
|---|---|---|---|
| google | 1,423 | 880 | 0.62 |
| chatgpt.com | 406 | 312 | 0.77 |
| bing | 117 | 97 | 0.83 |
| perplexity.ai | 1 | 0 | |
| gemini, copilot, claude.ai | 0 | 0 | |

ChatGPT is already 21 percent of search-shaped sessions and 24 percent of the operator clicks we sell. A ChatGPT visitor clicks through to an operator more often than a Google visitor. Nothing else in the AI field sends us a visit yet: Gemini, Copilot, Perplexity and Claude referrals are zero or one. So "attractive to AI" means, in order: keep and grow the ChatGPT channel, become visible in Google's generative features (which cannot be separated in referrer data, they arrive as google), and be present when the others start sending traffic. Monthly ChatGPT sessions: 17, 78, 39, 18, 60, 76, 79, 31, 8 (September to date).

## 2. How each system reaches a page in September 2026 (verified on the vendors' pages)

| System | Index it draws on | Fetchers and robots tokens | Runs JavaScript | What it sees on our homepage today | Control |
|---|---|---|---|---|---|
| ChatGPT search and browsing | OpenAI's own crawl (OAI-SearchBot) plus partner indexes (Bing is documented as one; a complete allocation is NOT FOUND) | OAI-SearchBot (search index), ChatGPT-User (fetch on a user's request, robots may not apply), GPTBot (training, separate) | Not documented; Vercel's December 2024 measurement found no rendering; no 2026 guarantee either way | Title, description, JSON-LD; no camp names, prices or dates | robots.txt per token; changes propagate in about a day |
| Google AI Overviews and AI Mode | Google's index and ranking systems, with query fan-out | Googlebot; Google-Extended is a token for Gemini training and grounding, not a crawler, and does not affect Search or AI Overviews | Yes: the crawled-page copy of 11 September shows all 68 cards rendered | Everything | New in 2026: the "Search generative AI control" in Search Console, rolled out to all sites on 31 August 2026, default include. Check it reads Include. |
| Gemini app grounding | Google Search grounding | Google-Extended governs whether crawled content may ground Gemini answers | via Googlebot | Everything | Allowed since today (owner decision) |
| Claude | third-party search partners plus its own fetchers | ClaudeBot (training), Claude-SearchBot (search index), Claude-User (user fetch); all three are allowed in our robots.txt | The API web-fetch tool documents no JavaScript support | Title, description, JSON-LD | robots.txt, Crawl-delay honoured |
| Perplexity | own index plus partners | PerplexityBot (index), Perplexity-User (user fetch; the developer docs say it generally ignores robots, the July 2026 help article says restricted-URL summarising was disabled; treat as uncertain) | Not documented | Title, description, JSON-LD | robots.txt for the index bot |
| Bing and Copilot | Bing's index; Bingbot renders (evergreen Edge since 2019) | bingbot | Yes | Everything; Bing ranks us second and cites us | noarchive excludes a page from Copilot answers; nocache limits it to title and snippet; "AI Performance" report in Bing Webmaster Tools since 10 February 2026 |
| Apple Intelligence and Siri | Applebot index, ChatGPT fallback | Applebot (search, may render), Applebot-Extended (training only) | May render | Probably everything | robots.txt |

The pattern that matters: the two systems that already send us people (Google, Bing) render the homepage. The systems that fetch on demand (ChatGPT-User, Claude-User, Perplexity-User) read raw HTML and see no camps on it. The council's static pages are plain HTML, so they are the first pages of ours those fetchers can quote. That is the single strongest reason the wave is right.

## 3. What gets cited: measured evidence, graded

| Study | Sample and method | Finding | Weight |
|---|---|---|---|
| Aggarwal et al., "GEO", arXiv 2311.09735, KDD 2024 | 10,000 queries, controlled rewrites of source pages | Adding statistics, quotations and cited sources raised visibility in generative answers by roughly 30 to 40 percent; keyword stuffing hurt; smaller sites gained most | Foundational experiment, not a 2026 field result |
| Ahrefs, "We Tracked 1,885 Pages Adding Schema", 11 May 2026 (read today) | 1,885 pages that added JSON-LD, 4,000 matched controls, four test designs | No citation uplift on AI Overviews (−4.6 percent, small and significant), AI Mode (+2.4, indistinguishable from zero) or ChatGPT (+2.2); cited pages are three times likelier to carry schema, which is correlation | Strong, causal design |
| Ahrefs, AI Overview brand correlation, 26 May 2025 | 75,000 brands | Web mentions correlate with AI Overview visibility at 0.66, backlinks at 0.22 | Correlational |
| Semrush, most-cited domains, 10 November 2025 | 230,000 prompts, three platforms, 13 weekly snapshots | Reddit and Wikipedia prominent; patterns shift sharply between snapshots; AI Mode favours Google properties | Descriptive, unstable |
| SE Ranking, llms.txt, 7 November 2025 | about 300,000 domains, correlation and SHAP | No citation advantage from having the file | Observational |
| Ahrefs, llms.txt adoption, June 2026 (reported by Aleyda Solis and on Reddit; the Ahrefs URL returned 404 today, so secondary confirmation only) | 137,000 sites | 28 percent published one; 97 percent of those files got zero requests in May 2026 | Secondary confirmation only |
| Semrush and Kevin Indig, "ghost citations", 9 June 2026 | 3,981 domain appearances, 115 prompts, 14 countries, four systems | 62 percent of citations carried no brand mention in the answer | Being a source is not being named |
| Pew Research, 22 July 2025 | 900 US adults, 68,000 searches | Click on a traditional result 8 percent with an AI Overview versus 15 percent without; clicks on links inside the Overview 1 percent | Measured behaviour |
| Ahrefs CTR, updated February 2026 | about 300,000 keywords, Search Console December 2023 versus December 2025 | Position-one click-through 58 percent lower on queries with an AI Overview (about 7.3 to 1.6 percent) | Measured |
| Kevin Indig usability studies, July 2026 | 37 participants, 7 AI Mode tasks; 56 people, 221 ChatGPT product-comparison tasks | 77.6 percent of AI Mode sessions ended with no external visit; 92.8 percent of ChatGPT comparison tasks had no meaningful click | Small samples, directional |
| Preregistered experiment, arXiv 2608.18352, 18 August 2026 | 1,100 people | AI answers reduced publisher referrals without improving the user's experience | Preprint |
| Cyrus Shepard, 22 citation factors, 7 May 2026 | 54 experiments, patents and case studies scored for repeatability | Strongest: URL accessibility, existing search rank, fan-out rank, preview controls, query-answer match; weakest: llms.txt | Compilation, correlational |
| Google, "Guide to Optimizing for Generative AI Features", updated 10 July 2026 (read today) | vendor guidance | "You can ignore tactics like chunking content, creating unnecessary AI text files (like llms.txt), or pursuing inauthentic mentions"; structured data "isn't required"; unique, non-commodity content and normal SEO matter most | Primary vendor statement |
| Bing, AI Performance announcement, 10 February 2026 (read today) | vendor guidance | Headings, tables, FAQs and sourced evidence recommended; the report shows cited pages and grounding queries | Primary vendor statement |

What survives adjudication: (1) you must already rank and be fetchable, AI citation is downstream of ordinary search; (2) sourced, dated, specific facts in visible text are the one content trait with experimental support; (3) schema, llms.txt, chunking and FAQ blocks are not levers; (4) forum and Wikipedia presence matters in some engines but shifts monthly and cannot be manufactured honestly; (5) most AI answers end without a click, so the value of being cited is brand recognition and the operator link, not sessions.

## 4. Standards: what is real

- **llms.txt.** A real file format (v2 on 10 August 2026), used by developer tooling, with a Lighthouse audit. Google states it neither helps nor hurts Search; no major answer engine documents reading it; the measured request logs say almost nobody fetches it. Verdict: not a lever. Zero cost to add later, zero evidence of benefit now. The council page's "cheap move" is downgraded to "optional hygiene, do last".
- **Schema.org.** Keep the ItemList, BreadcrumbList and EducationalOrganization we have, add them to the static pages, do no more. ReserveAction exists as vocabulary and no consumer agent executes it.
- **WebMCP.** Real: a Chrome 149 origin trial and OpenAI's browser documents site-provided WebMCP tools. Early; nothing for a directory to do yet beyond watching.
- **Agentic commerce.** OpenAI's Agentic Commerce Protocol (with Stripe) is in beta and reached product discovery in ChatGPT on 24 March 2026; Google's UCP (11 January 2026) and AP2 (donated to FIDO, 28 April 2026) exist. None applies to a directory that does not take bookings. Operators might qualify one day; not our work.
- **Cloudflare pay-per-crawl, Content Signals, IETF AI preferences.** Real for Cloudflare-fronted sites; we are on Vercel; pay-per-crawl was still a closed beta on 28 July 2026 and is moving to "pay-per-use". Not applicable.
- **NLWeb, MCP servers for websites.** Working code exists; no search-inclusion benefit documented. Not for us.

## 5. Agents acting for parents

ChatGPT agent mode browses, fills forms and can buy; Claude in Chrome is generally available since 26 August 2026; Gemini in Chrome auto-browses; Perplexity Comet has reusable workflows. No published case of an agent booking a summer camp end to end was found by any seat. The path an agent takes on our site today: it reads the page (screenshot, raw HTML or accessibility tree), extracts camp names, dates, prices and ages from visible text, and follows the booking link to the operator, where a human still completes the form and pays. Google's "Build agent-friendly websites" guide (web.dev, 1 April 2026) asks for semantic HTML, accessible names and states, stable layouts and visible state changes. What helps us: plain booking links with the UTM baked in (the council already requires this), prices and dates as text, no interstitials over the content, labelled controls. What would break an agent: JavaScript-only prices, cookie modals that intercept clicks, unlabeled div buttons. Our cookie banner appears after five seconds and is dismissable; worth testing with an agent.

## 6. Measurement, set up before batch 1a

- **Search Console, Generative AI performance report**: impressions from AI Overviews and AI Mode by page, country and device (support.google.com/webmasters/answer/16984139, read today). Clicks from these features are not broken out. Owner: open it once and note the September baseline.
- **Search Console, Search generative AI control**: Settings > Search generative AI; default Include. Owner: confirm it reads Include.
- **Bing Webmaster Tools, AI Performance** (public preview since 10 February 2026): cited pages, citation counts, sampled grounding queries. This is the only place we can see ourselves being cited. Owner: open it and screenshot the current view.
- **GA4**: `scripts/ga4-ai-referrers.py` gives sessions and booking clicks by chatgpt.com, perplexity.ai, gemini, copilot, claude.ai, bing and google by month. Run it monthly; the table in section 1 is the baseline. OpenAI documents `utm_source=chatgpt.com` on some links, so also watch that parameter.
- **Attribution gap**: AI Overviews arrive as google; answers with no click leave no trace; parents who read our price in an answer and type the operator's name into a browser show up nowhere. So the click report we sell operators undercounts our influence, and the honest framing in the pitch stays "clicks we can prove", as decided on 13 September.

## 7. Risks

1. **Zero-click substitution.** The measured studies above say most AI sessions end without a visit. Our revenue is operator fees justified by referrals. If an answer engine quotes our verified price and links the operator directly, we did the work and the operator got the click. Mitigation: be the named source (the how-we-verify page and a consistent "verified on the operator's page, date shown" line make the brand quotable), measure citations in Bing's report, and tell operators plainly that AI answers now sit between families and both of us.
2. **Misquotation.** An engine can join our Swiss price to a Spanish camp or quote a 2026 price as 2027. Mitigation: every figure travels with its currency, unit, season, source and check date in the same sentence or row (the council's keyed-offer rule), and prior seasons are never shown as current.
3. **Training without benefit.** GPTBot, ClaudeBot and Google-Extended are allowed; blocking training tokens does not affect search visibility on any of these systems. Owner choice; the lead's view is that public price data has no training value worth a policy, and being helpful to every fetcher is the brand.
4. **Scrapers behind AI user agents.** The vendors publish IP ranges for verification; Vercel's firewall can verify bots. Not urgent at our traffic.

## 8. Held up against the council plan: what changes and what does not

**Confirmed by the evidence.** The static wave is exactly the right response to the AI channel: plain HTML pages with prices, dates and sources in visible text are the first thing ChatGPT's, Claude's and Perplexity's fetchers can quote, and Google and Bing already render the homepage. The no-digits-in-prose, keyed-offer and provenance rules are the content traits with experimental support. The methodology page first is doubly right: it is the pipeline test and the citation anchor. The decision not to prerender the homepage stands: Googlebot renders it, and the fetchers that do not run JavaScript get the same facts from the new pages.

**Amendments the research earns:**

1. **Every static page carries a provenance line per row**, in the text, not only in comments: "Verified on the operator's page, 13 September 2026", with currency, unit, season and inclusions in the same row. Already implied by the gates; now explicit as the citation asset.
2. **The how-we-verify page names the reviewer, the method, the limits, the correction contact and the paid-listing disclosure.** Google's reliability guidance and the ghost-citation finding both point to a named, contactable source.
3. **IndexNow ping on every release** (Bing, and through it the engines that use Bing). A key file and one POST per changed URL; an hour's work in the generator's release step.
4. **Baseline the three AI reports before batch 1a** (section 6), added to the pre-pilot list beside the keyword pull.
5. **Test the parent journey with a browsing agent** on the winter page before batch two: Claude in Chrome, from a question to the operator's booking page, stopping before any form. Record what it could and could not read.
6. **llms.txt drops off the "cheap moves" list** on the council page. Chunking, FAQ blocks for their own sake and extra schema stay off the plan. Google says so in writing and Ahrefs measured it.
7. **The homepage noscript question stays closed** unless the rendered-page evidence changes. The fetchers' gap is served by the new pages. If, after batch two, ChatGPT still cites only the homepage and quotes nothing from it, the 5 October review may revisit a static summary inside the root under the protection contract.
8. **The pitch to operators gains a sentence** for the next round, not the mails already sent: AI answers now quote prices and dates and often send the family straight on; the directory's verified figures are what those answers draw on.

**What the evidence does not support:** rebuilding anything for AI, buying citation dashboards, community-seeding on Reddit, an MCP or NLWeb endpoint, ReserveAction markup, blocking Google-Extended, or any forecast of AI traffic. The measured reality is that the channel is real (a fifth of sessions, a quarter of operator clicks) and unforecastable.

## 9. Ten actions, in order

| # | Action | Evidence | Cost |
|---|---|---|---|
| 1 | Ship batch 1a and 1b as decided, with prices, dates, sources and check dates in visible text and a provenance line per row | Fetcher mechanics (section 2); GEO experiment; Bing guidance | In the plan |
| 2 | Confirm the Search Console generative AI control reads Include; open the Generative AI performance report and Bing AI Performance and record September | Google and Bing documentation, read today | 20 minutes, owner |
| 3 | Run the GA4 referrer script monthly; add a GA4 channel group for AI referrers | Section 1 baseline | Done, plus 30 minutes in GA4 |
| 4 | IndexNow key and ping in the generator's release step | Bing documentation | 1 hour |
| 5 | The how-we-verify page with reviewer, method, limits, corrections, paid-listing disclosure | Google reliability guidance; ghost citations | In batch 1a |
| 6 | Agent walk-through of the winter page with Claude in Chrome, recorded | web.dev agent guidance | 1 hour |
| 7 | Keep JSON-LD on the static pages (ItemList, BreadcrumbList); no new schema | Ahrefs May 2026 | In the generator |
| 8 | Freshness as a visible fact: last-verified dates on pages, expiry rule from the council | Ahrefs freshness study (cited pages are younger) | In the plan |
| 9 | The November cost comparison as original, reproducible research others can cite | Ahrefs brand-mention correlation | Planned |
| 10 | A fixed panel of ten parent questions asked monthly in ChatGPT, Gemini, Perplexity and Copilot, scored for citation, brand mention, accuracy and booking path | Council measurement decision; GEO survey July 2026 | 1 hour a month |

**Five wastes of effort:** llms.txt as a visibility play; extra schema for citations; prerendering or otherwise editing the homepage for AI; MCP, NLWeb or ReserveAction for a site that does not take bookings; paid citation-tracking dashboards at our scale.

**Three claims the lead is least sure of:** whether ChatGPT-User ever renders JavaScript (no 2026 guarantee either way; the static pages make it moot); whether Perplexity's user fetcher honours robots.txt (its own documents conflict); how much of the ChatGPT channel is ChatGPT search versus the Bing index it draws on (OpenAI does not publish the split).

## 10. Seats and adjudication

**Astra (web search).** Twelve verified primary sources, every date checked by the lead on the page; the GSC generative AI report and the new generative AI control were its finds and both are real. Its ten actions are adopted with two exceptions: the robots audit for Claude-SearchBot and Claude-User is moot (both are already allowed at lines 48 and 51 of robots.txt), and "deliver the static-page plan" was already decided. ACCEPTED otherwise.

**Gemini (no web access this run).** Its mechanics table is 2024 documentation presented as current: it says Search Console has no AI Overview reporting (false since 2026), attributes a "Profound Strategy and Peec AI, 120,000 queries, 0 percent schema correlation, 84 percent table correlation" study and a "BrightEdge 60 percent lists" figure that no other seat or search could find (NOT VERIFIED, treated as invented), and its first action is to prerender the homepage, which contradicts the council decision and the rendered-page evidence. REJECTED on those. ACCEPTED: its friction list for browsing agents (hydration, overlays, unlabeled controls, JavaScript-only prices, bot challenges) matches the web.dev guidance; its referrer table is right; its "search versus training" robots distinction is right.

**Grok (X search).** Nineteen dated X posts with URLs, mostly from Barry Schwartz, Lily Ray, Aleyda Solis, Cyrus Shepard, Kevin Indig, Glenn Gabe and Rand Fishkin, quoted within fifteen words; the underlying studies (Pew, Ahrefs CTR, Ahrefs schema, Ahrefs llms.txt, Indig, Shepard) were confirmed by the lead where a primary page exists. Its verdicts (llms.txt is "GEO astrology", schema no uplift, Google-Extended irrelevant to Search, keep robots open) are ACCEPTED. Its "Google agent payments NOT FOUND" is superseded by Astra's UCP and AP2 sources.

**Fable research agents.** Their reports are recorded in section 11 as they arrived, with adjudication.

## 11. Fable research seats (reports in docs/reports/ai-search-seats/, adjudicated)

**Mechanics seat** (primary documentation, every row with a page date). ACCEPTED and added to the record: ChatGPT agent and Atlas were withdrawn in August 2026 and replaced by the ChatGPT Work cloud browser, which signs its requests (Web Bot Auth, RFC 9421) and which Vercel already verifies, so nothing needs configuring; Google-Agent and Perplexity-User ignore robots.txt by their own documentation; GA4's new "AI Assistant" channel explicitly excludes AI Overviews and AI Mode, so Google's AI traffic can only be seen in Search Console; IndexNow feeds Bing (a named ChatGPT provider) and not Google; the EBU and BBC study (October 2025, 3,000 answers) found 45 percent of AI answers with a significant issue, which is the strongest argument for putting the check date next to every figure; Vercel's AI-bots managed ruleset must stay off because it cannot tell OAI-SearchBot from GPTBot. DEFERRED: a Content Signals line in robots.txt (harmless, but Google says it has no effect and no AI company is documented honouring it).

**Citations seat** (reached Hacker News and the papers; X, Reddit and Bluesky blocked it). ACCEPTED as the most useful evidence in the whole exercise: Vishwakarma et al. (arXiv 2605.25517, May 2026, 252,000 paired trials) found explicit price information and recent timestamps to be consistent boosters of citation, which is exactly what this directory publishes; Kevin Indig's February 2026 study (1.2 million answers) found 44 percent of citations come from the first 30 percent of a page and query-matching headings double the odds; the April 2026 study with AirOps found pages answering 26 to 50 percent of a query's sub-questions beat pages that try to cover everything; SE Ranking found 100 to 180-word sections and updates within three months help and FAQ schema does not; Ahrefs found cited pages 25.7 percent fresher. The August 2026 ChatGPT change (site-scoped searches, Reddit's share down 86 percent, listicles cited about half as often) is secondary and is recorded as such; if true it favours focused, official-looking pages over listicles, which is what the country pages should be. Its proposal of a plain-HTML "all listed camps" index page is DEFERRED to the 5 October review: the country pages cover the same facts within weeks and a second full list could compete with the homepage for the head terms.

**Agent-web seat** (vendor pages, dated). ACCEPTED: no agentic commerce protocol covers services, so camp booking stays a browsing task through 2026 and the parent finishes every form; the web.dev guidance is the checklist; our cookie bar is a strip, not a modal; the filters are proper listboxes. Its one site finding is real and important: the card's "View Details & Book" control is a button that opens the tracked URL with window.open, so an accessibility-tree agent and every non-browsing fetcher cannot see the operator's address before clicking. Verified in CampCard.jsx and App.jsx. ACCEPTED as a change to make: render the control as a real link to the tracked URL, opening in a new tab, keeping the GA4 click handler. It edits the homepage DOM, so it ships with the outbound-code extraction under the council's protection contract, with the golden fixtures and a DebugView click as the test.

## 12. Amendments after the Fable seats (these supersede section 9 where they differ)

1. **Booking control becomes a real link** on every card, static and homepage, with the tracked URL in the href and the GA4 handler kept. One commit, tested against all 78 rows and one DebugView click, shipped with the outbound extraction before batch 1a.
2. **Every static page opens with an answer block**: two or three sentences giving the count, the price range in local currency, the session-date window and the check date, before any prose. Then sections of 100 to 180 words under headings phrased as the parent's question.
3. **One page, one question.** The country pages stay separate and focused; nothing is merged into a guide.
4. **Vercel bot protection stays off**; Web Bot Auth verification is on by default. Owner: glance at the Vercel Firewall page once to confirm the managed AI ruleset is inactive.
5. **The GA4 referrer script and the Search Console generative AI report are the AI measurement**; the "AI Assistant" channel in GA4 will not show Google's AI traffic, by Google's own definition.
6. **Operator guidance gains three lines** in the next outreach round: prices and dates as text on the booking page, labelled forms, no PDF-only pricing. It raises completion for the referrals they pay for.
