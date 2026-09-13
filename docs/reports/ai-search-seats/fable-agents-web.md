# Agent-web seat (Fable agent), final report, 13 Sept 2026

## 1. What ships, what is announced, what is a proposal

| Item | Status | Date, source |
|---|---|---|
| ChatGPT Work with cloud browser (replaced ChatGPT agent and Atlas) | Ships, paid plans, "supported regions" | Atlas stopped 9 Aug 2026; "ChatGPT agent is no longer available" (help.openai.com/en/articles/20001371, /11752874, /20001280) |
| OpenAI Instant Checkout + Agentic Commerce Protocol | Ships, US, physical goods only | openai.com/index/buy-it-in-chatgpt; feed spec covers physical and digital items only |
| ChatGPT apps (Booking.com, Expedia) | Ships outside EEA/UK/CH at launch | 6 Oct 2025 |
| Google Chrome auto browse (Gemini 3) | Ships, US, AI Pro/Ultra, desktop; Android from late June 2026 | 28 Jan 2026; 12 May 2026 |
| Google AI Mode agentic booking (restaurants worldwide, tickets and appointments US, hotels US) | Ships, partner-only | 17 Nov 2025; 10 Apr 2026; 27 Aug 2026 |
| Google Universal Commerce Protocol | Early-access merchants, retail only | 11 Jan 2026 |
| Google Agent Payments Protocol (AP2) | Spec plus samples | v0.2, 16 Sept 2025 |
| Gemini Spark (cloud agent acting in Chrome) | US-only beta for AI Ultra | 19 May 2026 |
| Claude in Chrome | Ships, Pro/Team/Enterprise | GA 18 Dec 2025; safety article 12 Aug 2026 |
| Claude API browser use tool (accessibility-tree first) | Ships | toolset dated 1 Aug 2026 |
| Perplexity Comet | Ships, free; agent tasks need Pro/Max | July 2025; iOS March 2026 |
| Microsoft Edge agentic browsing | Business-only preview, EEA excluded | 20 May 2026 |
| Microsoft NLWeb | Reference implementation; no assistant confirmed consuming public endpoints | github.com/microsoft/NLWeb |
| WebMCP | W3C Draft Community Group Report (10 Sept 2026); Chrome 149 origin trial | webmachinelearning.github.io/webmcp |
| Web Bot Auth | IETF WG draft 1 Sept 2026; deployed by OpenAI, Cloudflare, Vercel, Akamai, HUMAN | datatracker.ietf.org/wg/webbotauth |
| IETF AI Preferences vocabulary | WG draft 07, 19 Aug 2026, "does not yet have consensus" | |
| Cloudflare Content Signals | In managed robots.txt (3.8M domains); Google says no effect (Mueller, 6 July 2026) | |
| Cloudflare AI Crawl Control, pay per crawl, pay per use, Markdown for Agents, Agent Readiness score | Ship; pay per use has two partners | 1 July 2026; 17 Apr 2026 |
| schema.org Actions for agents | Vocabulary since 2014; no 2025 or 2026 release adds agent vocabulary | |

## 2. What each vendor's agent does on a website

OpenAI: Operator (Jan 2025) to ChatGPT agent (July 2025) to Atlas (Oct 2025) to removal of both in August 2026. What remains: the cloud browser inside ChatGPT Work, which reads pages, clicks, fills forms, pauses for sign-in and before "confirming a booking or making a payment". It signs every request with RFC 9421 signatures, Signature-Agent "https://chatgpt.com"; Vercel-hosted sites need no configuration. The Publishers FAQ says the agent "uses ARIA tags" and owners should "follow WAI-ARIA best practices".

Google: Chrome auto browse acts in the user's Chrome, asks for confirmation before purchases or posts. Server-hosted agents fetch as Google-Agent, which ignores robots.txt. AI Mode agentic booking never browses arbitrary sites: partner platforms only, with a Google Pay flow. Site-owner guidance is web.dev/articles/ai-agent-site-ux (1 April 2026): semantic buttons and links, cursor pointer, the for attribute on labels, consistent layout, no transparent overlays, targets over 8 square pixels, everything necessary "clearly reflected in the interface".

Anthropic: Claude in Chrome runs in the user's browser via the DevTools protocol, sends no identifying header, requires site permission, confirms purchases and sensitive input, blocks financial sites by default. The API browser use tool reads the accessibility tree first, screenshots second; "hidden text doesn't reach Claude". Server fetches use Claude-User and Claude-SearchBot, both honouring robots.txt.

Perplexity: Comet clicks, navigates, fills forms, asks before browser actions; enterprise admins can set per-domain access. It sends no verifiable identity; HUMAN notes Amazon's November 2025 legal threat over undisclosed agent sessions. Perplexity-User "generally ignores robots.txt".

Microsoft: agentic browsing is business-only preview, EEA excluded, irrelevant to European parents in 2026. NLWeb: no evidence any assistant queries third-party endpoints.

## 3. Protocols and signals

ACP: product feed with nine mandatory fields, three server flows; physical and digital items only; US, approved partners, 4 percent fee. UCP: /.well-known/ucp, Merchant Center, retail only. AP2: signed mandates under FIDO; no production consumer use. None has a services or booking object; a summer camp cannot join any of them; camp booking stays a browsing task through 2026. WebMCP: community draft, Chrome 149 origin trial from about June 2026; only Chrome-hosted agents can call the tools; watch, do not build. Web Bot Auth: the only agent-identity mechanism with real deployment; Vercel verifies it automatically. AIPREF: two categories, no consensus. Content Signals: honoured by no named AI company; Cloudflare's scan of 200,000 domains found 4 percent declared any AI preference. schema.org Actions: no vendor documents any browsing agent reading potentialAction; the "7 percent of reservations via ChatGPT connectors" ReserveAction claim is agency marketing. NOT FOUND.

## 4. Late 2026: a personal AI books a summer camp for a parent

On the directory: (1) the search or fetch step sees only title, description and JSON-LD on the SPA; the static pages are the only surfaces those steps can read camp names and prices from. (2) In a browsing step the agent loads the homepage in a real browser and sees the 68 rendered cards; tree agents read headings, text and buttons; screenshot agents read the layout. (3) It filters: the country and age filters are ARIA listboxes with chips, exposed cleanly. The cookie bar is a fixed strip after five seconds, not a modal, so it does not block clicks. (4) It extracts price, dates and the booking badge from card text, the best case per every vendor guidance. (5) It leaves: the card's "View Details & Book" is a button that calls window.open (App.jsx lines 116 to 120 and 1455; CampCard.jsx). A tree agent sees a labelled button with no href, cannot read the destination before clicking, and the click spawns a new tab that headless and cloud browsers handle unevenly. A real anchor with the tracked URL would let every class of agent, and every non-browsing fetcher, discover the operator URL without a click. The one structural weakness found on the site.

On the operator's page: (6) server-rendered pages with labelled forms work; JS-heavy builders (Wix-based skitenfamily.com, vierumaki.fi) defeat tree agents. (7) Availability and price must be text; PDFs, price images and "request a quote" flows stop the task. (8) Registration forms ask for passport, medical and consent data: every shipping agent pauses; the parent finishes. (9) Payment: the cloud browser cannot complete payments; the others require confirmation. No 2026 agent completes a camp deposit unattended. (10) The referral still arrives with our UTM parameters as long as the agent clicks our button rather than searching the operator directly.

## 5. Ten actions, five wastes, least-sure claims

Actions: 1 render the booking control as a real anchor to the tracked URL, keeping the GA4 handler; 2 ship the static pages with prices, dates and operator URL in plain HTML; 3 "verified on operator's page on [date]" beside every price and date; 4 keep Vercel's bot protection off, confirm Web Bot Auth verification is on; 5 keep robots.txt allowing the user fetchers; 6 run isitagentready.com once for a baseline; 7 audit the accessibility tree of the homepage and one static page; 8 an operator-facing paragraph in the outreach kit (price and dates in text, labelled forms, no PDF-only pricing); 9 segment GA4 or Vercel Observability for signed-agent traffic; 10 revisit WebMCP in early 2027.

Wastes: ACP, UCP, AP2; NLWeb or an MCP server; Content Signals or AIPREF lines; pay per crawl; potentialAction or ReserveAction JSON-LD.

Least sure: the cloud browser's payment and sign-in limits (OpenAI's two articles contradict); whether Chrome 149's WebMCP trial is live today; whether window.open buttons materially hurt agent completion (no measured study; the "78 versus 42 percent" figure has no primary source).
