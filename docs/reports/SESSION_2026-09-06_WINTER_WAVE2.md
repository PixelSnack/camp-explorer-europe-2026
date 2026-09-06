# Session record, 6 September 2026: Wave 2 round 1, winter section built dark, external panel

*Lead: ESC Claude (Fable 5.1). Owner decisions: full go on Wave 2 dates, four new summer camps, and a winter section on the main site (owner now owns europeanwintercamps.com). External reviews were run through GPT-6 Astra (adversarial and web research) and Gemini 3.8 Flash (SEO); the verbatim outputs are in `docs/reports/external-reviews-2026-09-06/`. Every adjudication is in the winter spec.*

## Shipped to production (pushed by the owner, verified live)

- Guide page figures aligned with the data; unsourced discount percentages removed (92764d7).
- Analytics: one booking and one video event path; events carry `camp_season` (c6c3091).
- Discover card extracted into `CampCard` with a byte-identical rendered DOM, verified on the live site after the push (4bb1309).
- Winter view on `#winter` behind `WINTER_PUBLISHED = false`: backdrop, season line, empty state; scoped hash parameters; gated nav and teaser (c9444b7).
- Tooling: `scripts/ai-review.sh`, `scripts/gen-image.sh`, `scripts/cdp-verify.mjs`, `scripts/sync-faq-jsonld.mjs`; validator extensions; the ESC external-AI guide.
- Production gates after the push: live title unchanged; live Discover DOM identical to the pre-extraction baseline; home at 390px shows no winter entry points; `#winter` renders clean; zero console errors.

## Committed after the push (owner to push)

- Astra diff-review fixes (e218404), Wave 2 round 1 corrections (612e065), winter assets renamed and three card images ledgered.

## Wave 2 round 1: eleven camps re-verified on operator pages (Astra web research, 61 pages; lead re-read every changed value)

No operator among the eleven has published 2027 dates or opened 2027 registration; the season notice covers it. Corrections landed: EUROCAM (9) 2026 sessions, Enforex Barcelona (7) dates and programme link, My Camp (25) programme link, Camp California (34) session structure, Explorer (32) sessions, Warsaw Montessori (24) renamed to Farm Summer Camp with PLN 2,900 per week and the English programme page (no parent-present family camp exists), Jagiellonian (28) PLN 8,260 per two weeks (URL correct despite "online" in the slug), Vierumäki (65) renamed Finnhockey Camp. Confirmed unchanged: Altitude (4), Evasoleil (48), Kalkalpen (26). Still to re-verify when published: Vierumäki 2026/2027 price and dates; My Camp price (verification wall).

## Winter candidates (publish gate: four STRONG)

| Candidate | Verdict | Key facts (operator pages) | Next step |
|---|---|---|---|
| Les Elfes Winter, Verbier | STRONG | Ages 6-17; 12 Dec 2026 to 24 Apr 2027; CHF 2,200 to 2,950 per week by session; ski pass, four meals, instruction, 1:7 slope ratio included; equipment hire and transfers extra; enrolment advertised open | Add as the first winter row (ID after the new summer camps); confirm the enrol URL loads in a browser |
| La Garenne Winter, Villars | POSSIBLE, near STRONG | Super Ski ages 8-14 from CHF 4,400 per week (conditions PDF shows 4,200: conflict); English+Ski and Integration ages 5-14 from CHF 7,950 per two weeks; sessions 10 Jan to 19 Mar 2027; pass and equipment included | Resolve the fee conflict (read the PDF in a browser or ask the school), then add |
| HIF Winter Camp, Ftan | POSSIBLE, near STRONG | 9 to 19 Feb 2027; ages 10-16; CHF 4,586 per 11 days; boarding campus; max 30 | Confirm lift pass and hire inclusion, then add |
| UCPA colos ski, France | POSSIBLE | Own villages; from EUR 475 (5 days) and EUR 1,016 (7 days); 2027 dates not yet on sale | Re-check in October for dated 2027 departures |
| Leirikesä talvileirit, Finland | POSSIBLE | Winter 2026-27 not published | Re-check in October |
| Lyngmo Crossroad, Norway | lead only | 19 to 22 Feb 2027, price unit unclear | Low priority |
| Scottish Ski Club Bormio | REJECT | Transfers included in the price, base unnamed | none |

## Ice hockey candidates (summer additions)

| Candidate | Verdict | Key facts | Next step |
|---|---|---|---|
| Furudals Hockeyskola, Sweden | POSSIBLE, near STRONG | IFK Ore's own player residence Hockeyborg; 2027 weeks 27 Jun to 17 Jul; SEK 6,640 per week plus SEK 650 boarding; birth years 2011-2018; est. 1980 | Lead re-reads the 2027 form and residence page, then add as ID 71 |
| Leksands Hockeyskola, Sweden | POSSIBLE | 2027 form: SEK 5,995 per week plus SEK 1,295 boarding (English text says 1,180); arena rooms; weeks 26-29 | Ask which boarding figure applies |
| Stadium Sports Camp, Norrköping | POSSIBLE | 2027 hockey weeks 27 Jun to 3 Jul and 4 to 10 Jul; SEK 4,595 per week; ages 10-14; Swedish-only registration | Confirm English booking support |
| Lysekils Sommarhockeyskola | POSSIBLE | SEK 6,695 per week 2026 internat, school classrooms, adult night supervision | Wait for 2027 |
| Tanhuvaara Sporttileiri, Finland | POSSIBLE | EUR 150 per 4-day session 2026, communal accommodation | Wait for 2027 |
| Hockey Talent School Třinec | POSSIBLE | CZK 13,400 full board 2026; sleeping location not stated | Email the operator |
| IHVW Leukerbad | POSSIBLE | 2027 week 11-16 Jul; price page still 2026 Saas-Grund | Re-check |

## Tooling and process findings

- Seven Claude research agents (Opus) went idle without delivering reports and did not answer a ping; the user-level PreToolUse hook that auto-approves WebFetch and WebSearch spawns a Node process with no timeout, which the shared-machine facts say stalls under the corporate AV. Diagnosis pending (two Haiku test agents were dispatched). Astra web research covered the load in its own context: 25 to 28 pages per run, honest NOT FOUND, 5 to 10 minutes.
- Bash heredocs above roughly 5 KB fail on this tool with an unmatched-quote error; multi-line files go through the Write tool and short Bash commands.
- Refactor gate that works: dump the outerHTML of every card over the DevTools protocol before and after, compare bytes (`scripts/cdp-verify.mjs --dump`).
- camps.js carries 12 pre-existing em dashes (mostly in comments); the outward-text scan of the 65 descriptions remains open debt.
