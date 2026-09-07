# Weekly watch, 7 September 2026 (first of the weekly series; connectors live)

*Pulled at about 04:15 on 7 September 2026 through the gsc and ga4 MCP servers (both working since the Norton fix of 6 September). Search Console's last two days are always incomplete; read the week, not the tail.*

## Search Console, 31 August to 6 September (URL-prefix property https://www.europeansummercamps.com/)

| Measure | Value |
|---|---|
| Clicks | 39 |
| Impressions | 1,867 |
| CTR | 2.1 percent |
| Average position | 13.6 |

Daily clicks 6, 10, 4, 7, 5, 3, 4. The 5 and 6 September rows (123 and 92 impressions, position 26 to 27) are the incomplete tail, not a drop; check them again next week. Post-season trough: never read a September number as decline (CLAUDE.md).

## GA4, last 7 days against the 7 before (property 521172443)

| Measure | 31 Aug to 6 Sept | 24 to 30 Aug |
|---|---|---|
| Active users | 33 | 35 |
| Sessions | 65 | 42 |
| Views | 69 | 44 |
| Booking clicks (camp_booking_click) | 34 | not pulled |
| Video clicks | 1 | not pulled |

## Actions this week
- Weekly pull continues next Monday; add the per-camp booking clicks table to the next one (`scripts/ga4-pull.py --camp` or a run_report with the camp_name parameter).
- Wave 2 note from the night's checks: EUROCAM Bohemia (ID 9, our most-clicked listing, 86 referrals since March) is organised by SYKA AGENCY a.s., Prague, IČ 28499883, which its own contact page calls a travel agency. The camp-operator criterion needs the owner's judgement before the 2027 update; the listing stays as it is until then.
- ID 5 renamed to Atlas Summer Courses, Oxford (operator rebrand; figures re-read on the new site).
