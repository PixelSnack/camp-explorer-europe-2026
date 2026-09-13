# Citations seat (Fable agent), final report, 13 Sept 2026 (the agent hit the session limit right after delivering)

Reachability: X HTTP 402; Reddit JSON and Bluesky API 403; Hacker News reachable; Reddit and Bluesky via dated secondary recaps. M measured, O opinion, S secondary.

## Academic

- GEO (Aggarwal et al., KDD 2024), arXiv 2311.09735: 10,000 queries; "up to 40%" visibility; rewrites a source already in context, never tests retrieval. M, narrow.
- Critical survey, Martinez, arXiv 2607.14035, 15 July 2026: 45 studies; relevance and position in context "the most reproducible levers"; GEO gains "conditional on a source already being present"; no stable cross-platform causal effect on discoverability.
- "What Gets Cited: Competitive GEO", Vishwakarma et al., arXiv 2605.25517, 25 May 2026: 252,000 paired trials, six LLMs, 18 factors; topical relevance and list position dominate; explicit price information and recent timestamps are consistent moderate boosters; formatting-only edits negligible. M, testbed.
- Zhang et al., arXiv 2604.25707, 28 April 2026: 602 prompts, 21,143 citations, 72 features; ChatGPT cites fewer pages, each with higher influence; influential pages are longer, structured, rich in extractable definitions, facts, comparisons, steps. M, observational.
- GEO-16, arXiv 2509.10762, 13 Sept 2025: 70 prompts, 1,702 citations; metadata and freshness, semantic HTML, structured data associated. Small, correlational.
- Hugging Face: nothing beyond the GEO-bench dataset. NOT FOUND.

## Industry studies

1. Indig, ChatGPT citation position (SEL, 18 Feb 2026): 1.2M answers, 18,012 citations; 44.2% of citations from the first 30% of a page; definitions and Q&A structure cited 2x; entity-dense text. M.
2. Indig, domain concentration (SEL, 24 Mar 2026): top 30 domains take 67% of citations per topic; Google #1 pages cited 3.5x more than pages beyond top 20; 85% of retrieved pages never cited. M.
3. Indig with AirOps (April 2026, paywalled): pages covering 26 to 50% of fan-out sub-queries beat pages covering 100%; heading matching the query cited 41% vs 29%; retrieval rank 1 cited 58% vs 14% at rank 10. M via summaries.
4. SE Ranking, ChatGPT factors (SEJ, 26 Nov 2025): 129k domains, 216,524 pages; referring domains strongest; updates within 3 months; 120 to 180-word sections; 19+ statistics; FAQ schema underperformed (3.6 vs 4.2); llms.txt negligible. M.
5. SE Ranking, AI Mode (15 Dec 2025): 2.33M pages; top-10 Google rank raises citation odds; updated within 2 months +28%; 100 to 150-word sections; "FAQ schema markup has no impact". M.
6. Ahrefs schema causal test (11 May 2026): 1,885 pages vs matched controls; AIO -4.6%, AI Mode +2.4%, ChatGPT +2.2%, none significant. M.
7. Ahrefs freshness (28 Jul 2025): 16.975M cited URLs; AI-cited content 25.7% fresher than organic; ChatGPT strongest preference; average cited page still 2.9 years old. M.
8. Ahrefs, AIO vs rankings (2 Mar 2026): 863k SERPs; 38% of AIO-cited pages rank top 10, 31% outside top 100; overlap falling (76% in July 2025). M.
9. BrightEdge Feb 2026 (S): AIO on 48% of queries; 17% of citations from organic top 10.
10. Seer Interactive AIO CTR (24 Apr 2026): 53 brands, 5.47M queries; AIO CTR 2.4% in Feb 2026; cited pages 2.1% vs 0.9% uncited on the same SERP. M.
11. Semrush AI Visibility Index (26 Jun 2026): 126M US prompts; ChatGPT averages 15 sources per answer, Gemini 3; a brand mention does not imply the brand's site is cited. M.
12. Profound platform patterns (Jun 2025, updated Aug 2025): 680M citations; Wikipedia 7.8% of ChatGPT citations; Reddit 6.6% of Perplexity, 2.2% of AIO. M.
13. Profound Index Summer 2026 (19 Aug 2026): 1.9B conversations; after June's ChatGPT update citations per answer fell 10.4%; in regional markets 46 to 59% of citations go to country-specific domains. M, gated.
14. Similarweb AI search stats (updated 29 Jul 2026): ChatGPT share of AI referrals 76% to 53%, Gemini 9% to 27%, Claude 2% to 9%; after ChatGPT's May 2026 switch to inline brand links, homepage share of referrals rose from about 27% to about 62%; citation rate for travel and hospitality 23%. M.
15. SparkToro zero-click 2026 (Similarweb US clickstream Jan to Apr 2026): 68.01% of Google searches end without a click; 276 open-web clicks per 1,000 searches (374 in 2024). M.
16. Cyrus Shepard (7 May 2026): synthesis of 54 studies; URL accessibility 9.5, search rank 9.4, fan-out rank 9.3, preview control 9.2, query-answer match 9.2, intent-format match 9.0, topic cluster 8.9, answer near top 8.8, AI-ready structure 8.6, factually specific 8.3. O.

August 2026 ChatGPT change (S): from 8 August ChatGPT began scoping fan-out searches with site: operators; Reddit's share of ChatGPT search citations fell from 3.83% to 0.52% within a week; Lily Ray 20 Aug 2026: GPT-5.6 reduced fan-outs and citations for listicles (about -50%) and comparisons (about -32%); help centres and official documentation gained. Not verified against Profound's primary data.

Google's position (ai-features, 10 Dec 2025): "no additional requirements to appear in AI Overviews or AI Mode"; "You don't need to create new machine readable files".

Synthesis: be retrieved (Google or Bing rank, fan-out coverage); put the answer with concrete facts near the top; keep a visible recent update; query-matching headings over sections of about 100 to 180 words; explicit prices, dates, statistics, named entities. Schema and llms.txt do not move citations in the only controlled tests. Domain authority concentrates citations; a small site wins by focus, not breadth.

## Standards

llms.txt: spec repo 2,610 stars, pushed 4 Sept 2026. Ahrefs (Ryan Law, 15 June 2026), 137,000 domains: 28% publish the file, "97% received zero requests" in May 2026, bots never probe for it where absent. SEL (20 Jan 2026) tracked 10 sites 90 days: no attributable effect. Hacker News 19 Feb 2026 (tirreno server logs): all llms.txt requests came from WebPageTest and BuiltWith, "zero LLMs". John Mueller (2 June 2026): "purely speculative for now", none of the AI systems use it. Vendor claims that Anthropic or Perplexity "confirmed support": NOT FOUND in their crawler docs. Verdict: real spec, negligible consumption.

WebMCP: 3,995 stars, pushed 10 Sept 2026; Chrome 149 origin trial (9 June 2026); Mueller pointed to it as the practical alternative to llms.txt; which consumer agents call registered tools today: NOT FOUND. NLWeb: 6,254 stars, pushed 11 Aug 2026; no consumer assistant queries arbitrary endpoints: NOT FOUND. Cloudflare: Pay Per Crawl (1 July 2025) evolved to Pay Per Use (1 July 2026); from 15 Sept 2026 new defaults block training and agent crawlers on ad-monetised pages; Content Signals on 3.8M managed-robots domains (S). IETF AIPREF: drafts of 18 Aug 2026, not RFCs, no engine honours them. Agentic commerce: ACP with Stripe (Sept 2025), "Buy it in ChatGPT" 16 Feb 2026, deprioritised 6 March 2026 in favour of merchant apps with a 4% fee (S); AP2 v0.2 April 2026 under FIDO. Retail rails; nothing for a referral directory. Schema Actions and site MCP servers: NOT FOUND as consumed by any engine. GEO toolkits on GitHub are thin (112 stars, 0 stars); commercial trackers hold the data.

## For this site

Ten actions: 1 front-load every static page with an answer block (count, price range in local currency, session-date window, check date) before any prose; 2 visible "verified on" date per fact and per page, dateModified in JSON-LD, re-touch quarterly; 3 query-matching H2s over 100 to 180-word sections phrased as the parent's question; 4 keep pages focused, one country or topic per page (a reason not to merge the planned pages); 5 a plain-HTML "all listed camps" index page in the static build (name, town, country, price, dates, verified date, operator link) so non-rendering fetchers see camp facts, homepage untouched; 6 dense, entity-rich sentences with named sources ("checked on the operator's price page on 3 Sept 2026"); 7 protect retrieval: no max-snippet or nosnippet, no noindex on new pages, homepage footer links to every static page, sitemap per build; 8 treat Google and Bing rank as the AI lever; 9 a fixed monthly citation check, 15 parent prompts across ChatGPT, AI Mode, Perplexity, Copilot; 10 a few third-party mentions where AI looks for this query class (lowest priority; ChatGPT's Reddit weighting collapsed in August 2026).

Wastes: llms.txt beyond a five-minute file; more JSON-LD or FAQ schema for citations; WebMCP, NLWeb or a site MCP server now; ACP and AP2; "ultimate guide" long pages and Reddit seeding.

Least sure: the August 2026 ChatGPT change rests on tracker vendors and one recap; BrightEdge's 17% is secondary; the Indig and AirOps 815k-pair figures were read through summaries.
