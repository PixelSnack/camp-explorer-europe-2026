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

## Afternoon continuation (after the lead's context compaction, 6 September 2026)

### Reviews adjudicated, fixes landed (a0f9e67)
Fable code review: SHIP, two MEDIUM (Compare view season labels, count-line plurals) and four LOW. Fable SEO review: SEO-safe to publish, seven findings (anchor CTA, holiday and country wording at publish, unverifiable promises removed, scene-description alt text, asset naming already done, image sizing deferred, ItemList fine). Every finding is recorded ACCEPTED, DEFERRED or ALREADY DONE in the spec's adjudication section. GPT-6 Astra SEO review NOT RUN: HTTP 429 `credit_balance_exhausted` on the OpenAI organisation; owner adds credits, then re-run the brief. Gates: build and validators, lint, zero U+2014, Discover DOM byte-identical to the live production dump, compare view with two summer camps unchanged, home at 390 clean.

### Wave 2 round 1b, read by the lead on operator sources (53b506f, Altitude in the following commit)
- Les Elfes (ID 1), owner tip: six two-week 2027 sessions 6 Jun to 28 Aug, CHF 4,750 to 6,500; the enrolment form lists every 2027 session as selectable with its price. Badge moved from "2027 dates published" to "open" (green Booking open, the first verified 2027 badge). Winter and spring 2027 dates on the same page match the winter research.
- My Camp (ID 25): the 2026 price list in both operator brochures gives 620 euro per week VAT included as the public price; 570 euro is the returning-participant or second-sibling discount, 530 euro the partner rate. Price 570 to 620; season 28 Jun to 5 Sep 2026 weekly (brochure calendar). Ages 6 to 17 and inclusions confirmed (dormitory or glamping, five meals, activities, insurance; transport and bedding excluded).
- Altitude (ID 4): the residential page now shows Sunday-to-Saturday weeks 27 Jun to 31 Jul and the day camp Mon 28 Jun to Fri 13 Aug. No year is printed, but those weekdays exist only in 2027 and replace the 2026 dates the same page carried in August. Dates field moved to 2027; no badge, since the booking form still describes the 2026 season. Prices unchanged (CHF 975 day week, CHF 2,950 residential week).
- Still open for October: Camp California's 1,095 euro applies to session 1 only (two-week sessions from 1,975 euro); Explorer operator 845 euro against a third-party 830 (use the operator); Kalkalpen 2026 event past with nothing bookable; Vierumaki 460 euro unverifiable (the 9-12 camp has no product page).

### Tracking verified on production (owner priority, 6 September)
On both the Discover cards and the Home grid a booking click fires exactly one `camp_booking_click` with camp_name, camp_id, camp_category, camp_country, camp_season, is_featured and destination_url, and opens the operator URL with utm_source, utm_medium, utm_campaign and utm_content. The `noopener,noreferrer` flag predates today (four occurrences at the pre-winter tag), so operators have always attributed us through the UTM parameters, and that path is unchanged. The GA4 MCP could not confirm event counts: it dials an IPv6 address and this PC has no IPv6 route (curl -6 fails, curl -4 works); bridge note to Playground. Human check for the owner: GA4 Realtime while clicking a card.

### Tooling defect found and fixed (86f8310)
`scripts/cdp-verify.mjs` ended runs with proc.kill(), which on Windows leaves the browser and its renderers alive: 216 headless Chrome processes from one day of gates, which also explains the low-memory kills of the preview server. The random DevTools port in a shared 500-port range collided with a leftover browser still sitting on the app URL; a same-URL navigation is a hash-only change, so that browser never reloaded and one screenshot showed a stale bundle. Fix: Chrome picks its own port (read from DevToolsActivePort in the throwaway profile) and teardown sends Browser.close then taskkill /T /F. Verified with two consecutive runs and zero leftovers. Rule: a gate that contradicts itself is explained before anything is committed.

### Agent channel: working, not broken
The Haiku tests replied (PONG; WebFetch ok). The seven Opus research agents delivered full reports 40 to 70 minutes after dispatch; the earlier "idle without reports" reading came from truncated idle notifications. The Node WebFetch hook is not implicated. The lesson in LESSONS_LEARNED is corrected. `research-winter` died at the session limit before re-sending its report; Astra's winter research covers the same ground.

### Late research (Opus agents), for the four-new-camps target
| Candidate | Verdict | Key facts (operator pages) | Next step |
|---|---|---|---|
| Club Adventure, Overasselt (NL) | STRONG | Own group accommodation with dormitories; 7-day Outdoor Kids Camp ages 5-8 EUR 789, Survivalkamp ages 8-13 EUR 795, programme, lodging, all meals, instruction included; 2026 weeks 12 Jul to 22 Aug sold out; 2027 not published | Lead re-reads both camp pages, then add |
| Stadium Sports Camp, Norrkoping (SE) | STRONG | Ice hockey week ages 10-14; 2027 weeks 27 Jun to 3 Jul and 4 to 10 Jul; SEK 4,595 per week incl. four meals, activities, insurance; on-campus lodging with leaders sleeping alongside | Confirm card payment without a Swedish address, then add |
| Leksands Hockeyskola (SE) | STRONG per Opus (weak point 1) | 2027 form: SEK 5,995 per week plus SEK 1,295 boarding; boarders sleep on the floor in Tegera Arena on their own mattress, awake night staff | Owner judgment on the arena-floor boarding |
| ADEPS, Wallonia (BE) | POSSIBLE | Public sports body, residential stages in its own 18 centres, all five points pass; catalogue stops at October 2026, no summer 2027 date or price | Re-check when the summer catalogue opens |
| UGDA music school (LU) | POSSIBLE | Only Luxembourg operator with 2027 dates (16 to 26 Jul 2027, ages 14-21); venue is a state youth centre (point 5) | Owner call on point 5 |
| Kolping Ferienland Salem (DE, family) | POSSIBLE | Own family centre, 14-day stays with childcare; pricing is per person per day (child 7-13 EUR 55.50) | Needs a per-child unit decision before listing |
| Stella Maris Cuxhaven (DE, family) | POSSIBLE | All five pass; summer 2027 not published | October |
| Manusurf Camp Ado (FR) | POSSIBLE | Own surf house, ages 10-17; two prices on the site (830 and 950) | Resolve the price first |
| Move-It Sportcamps (DE), Slapshot Academy (CZ), Lysekil (SE), Hockey Talent School Trinec (CZ), Groupe Animateur (LU) | POSSIBLE | One open question each (venue ownership, unnamed hotel, 2027 dates) | Later |
| Kazou (BE), Sport Vlaanderen (BE) | REJECT / unverifiable | Bus travel in the price; JavaScript-only booking platform | none |

### Observation, not acted on
`handleCampSelection` builds the next selection from the closure value rather than a functional update, so two clicks in one tick lose one selection. Humans cannot produce that; the gate now clicks with a render between. Candidate for a later scalpel change.
