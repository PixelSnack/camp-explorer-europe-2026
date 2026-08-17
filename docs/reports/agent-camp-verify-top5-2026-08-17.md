# Camp data verifier report: top-5 most-clicked camps, 17 Aug 2026

*Agent: camp-data-verifier (Fable), read-only, official sites only. Adjudicated by lead in HEALTH_CHECK_2026-08-17.md.*

## Summary (camp | URL ok? | price | ages | 2027 dates?)

| Camp | URL | Price | Ages | 2027 dates |
|---|---|---|---|---|
| EUROCAM Bohemia (id 9) | OK | MATCH €335/10 days | MATCH 7-17 | No (2026 only). Our "July 15-25, 2026" matches none of their six terms |
| Adventure Camp Bavaria (id 10) | OK | **DIFFERS**: ours €445/1 week; official summer 2027 from €435 to €585/week (most weeks €495) | **DIFFERS**: ours 9-16; official 7-17 | **YES**, full 2027 calendar published (Sun-Sat weeks 27 Jun to 11 Sep 2027) |
| Les Elfes International (id 1, FEATURED) | OK (activities page) | **DIFFERS**: ours "From CHF 4,550/1 week"; official summer pricing is TWO-WEEK only: 2026 last session 4'600 CHF, 2027 sessions 4'750 to 6'500 CHF per two weeks | MATCH 6-17 | **YES**, six 2027 two-week sessions 6 Jun to 28 Aug 2027; 4-week booking discount CHF 1'000 |
| Altitude Camps (id 4) | OK | MATCH CHF 975/1 week (day camp); residential CHF 2,950/week | MATCH 3-14 | No (2026 only). Our dates off by one day each end (official 29 Jun to 14 Aug) |
| Enforex Barcelona Beach (id 7) | OK | **DIFFERS**: ours €1,295/1 week; official €1,350 (1 wk), €2,395 (2), €3,790 (3), €4,615 (4) | **DIFFERS**: ours 5-14; official 5-15 | No (year unstated on page; reads as current season) |

## Detail

### 1. EUROCAM Bohemia (id 9)
- URL https://www.euro-camp.eu/ loaded, "EUROCAMP | English Camp", single-program operator. OK.
- Price: "EUR 335" for "10-day stays" (all six 2026 terms). MATCH.
- Ages: "children between the ages of 7 and 17 years". MATCH.
- Dates: 2026 terms: I 2-11 Jul, II 11-20 Jul, III 20-29 Jul, IV 1-10 Aug, V 10-19 Aug, VI 19-28 Aug 2026. No 2027. camps.js "July 15-25, 2026" matches no term.
- Status: "Summer Offer 2026 - 21st edition". Site: "since 2006", "32 years of camp experience". Capacity NOT FOUND.

### 2. Adventure Camp Bavaria (id 10)
- URL https://www.campadventure.de/en/destinations/germany-adventure-camp-bayerischer-wald loaded ("Best International Summer Camp in Bavaria 2026", Regen). Prices/dates in official booking system https://www.bookacamp.de/de/booking/multi/campadventure/regenac.
- Price: page "from 365€"; booking rows: 16-22 Aug 26 "ab 495,00 €"; 23-29 Aug 26 "ab 435,00 €"; summer 2027 one-week rows "ab 495,00 €" (July), "ab 585,00 €" (1-7 Aug 27), "ab 525,00 €" (8-14 Aug 27), "ab 435,00 €" (22-28 Aug 27). €445 appears only on a March 2027 row.
- Ages: "7-17 years" on every summer row. camps.js 9-16 DIFFERS.
- 2027 one-week sessions: 27.06-03.07, 11.07-17.07, 18.07-24.07, 25.07-31.07, 01.08-07.08, 08.08-14.08, 15.08-21.08, 22.08-28.08, 29.08-04.09, 05.09-11.09; two-week combos e.g. 27.06-10.07.27 "ab 1095,00 €". Status "Bald buchbar".
- Capacity 90 / established 2003 NOT FOUND on pages read.

### 3. Les Elfes International (id 1)
- https://www.leselfes.com/dates-and-pricing/ summer table shows ONLY two-week prices: "16 Aug 2026 to 29 Aug 2026 - 4'600 CHF (Price for two weeks)"; 2027: 06-19 Jun 4'990; 20 Jun-03 Jul 5'900; 04-17 Jul 6'500; 18-31 Jul 6'200; 01-14 Aug 5'700; 15-28 Aug 4'750 (all "Price for two weeks"). Winter rows are per week, so the summer two-week labelling is deliberate.
- camps.js "From CHF 4,550/1 week": not on the page and the unit is wrong.
- Tier note: 4'750-6'500 CHF per two weeks; "luxury" (€3,000+/wk) holds only for peak July; shoulder sessions are premium tier.
- Ages "6 to 17" MATCH. "established in 1987", "10000 CAMPERS per year" MATCH. Capacity 180 NOT FOUND. Included: shared rooms with ensuite, full board 4 meals/day; transfers extra.

### 4. Altitude Camps (id 4)
- Day camp "CHF 975" (1 wk, 6-14), "CHF 950 / week" (2+ wks), Marmots "CHF 600 / week"; residential "CHF 2,950" one week, "CHF 5,550" two weeks. MATCH.
- Ages: Marmots 3-5, Day 3-14, Residential 7-14. camps.js 3-14 MATCH.
- Dates 2026: day camp "29th June - 14th August"; residential weekly 28 Jun to 1 Aug. camps.js "June 30 - August 15, 2026" off by one day. No 2027.
- Capacity 50 / established 2008 NOT FOUND. "traditional Swiss-style private chalets", "Groups of no more than 8".

### 5. Enforex Barcelona Beach (id 7)
- https://www.enforex.com/summercamps/dates-prices.html: "Barcelona Beach | € 1.350 | € 2.395 | € 3.790 | € 4.615 | € 1.350" (1/2/3/4/extra weeks), all-inclusive (20 classes/wk, accommodation, full board, activities, excursions).
- Ages "5 to 15" (https://www.enforex.com/summercamps/barcelona/). camps.js 5-14 DIFFERS.
- Dates: no year printed; sessions "June 28 - July 4", "July 5 - 18", "July 19 - August 1", "August 2 - 15", "August 16 - 29"; camp page "July 5 - August 22". camps.js "June 29 - August 23, 2026" matches neither. 2027 NOT FOUND.
- "Capacity: 180 students" MATCH; "80% international students" MATCH; Castelldefels MATCH.

## Coverage
All URLs above loaded via WebFetch (no numeric status exposed). No aggregators used. No files edited.
