# Review Aggregation System — Remaining Implementation Plan

*Created: February 7, 2026*
*Status: Phase 1 COMPLETE, Phases 2-4 remaining*
*Reference: REVIEW_METHODOLOGY.md for full system documentation*

---

## What's Already Done (Phase 1)

- `REVIEW_SOURCES` constant with 12 platforms, 3 tiers (1.3x/1.0x/0.8x) in `src/data/camps.js`
- JSDoc documenting `reviewData` shape in `src/data/camps.js`
- `rating: null` for all 25 zero-review camps (IDs: 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69)
- UI: rating badge hidden when `rating === null` (2 locations in App.jsx)
- UI: review row hidden when `reviews === 0` (2 locations in App.jsx)
- UI: compare panel rating row hidden when `rating === null`
- Build-time validation: `npm run validate:camps` as prebuild hook
- Trust indicator styling unified between Home and Discover sections
- `REVIEW_METHODOLOGY.md` created with full documentation

---

## Phase 2: Re-verify Existing 40 Camps (2-3 sessions)

### Goal
The 40 camps that currently show ratings (4.4-5.0) and review counts (45-892) have NO documented source. These numbers were assigned as estimates. We need to verify them against real platforms and add `reviewData` with actual sources.

### Batch Priority (highest visibility first)

**Batch 1-2: 9 camps with 400+ reviews (HIGHEST RISK — most visible)**
| ID | Name | Current Rating | Current Reviews |
|----|------|---------------|-----------------|
| 6 | Bede's Summer School | 4.8 | 892 |
| 1 | Les Elfes International | 4.9 | 847 |
| 41 | Summer Camps Holland - Sailing | 4.4 | 612 |
| 5 | Oxford Summer Courses | 4.9 | 567 |
| 35 | PGL Family Adventures Barton Hall | 4.7 | 523 |
| 34 | Camp California Croatia | 4.8 | 456 |
| 7 | Enforex Barcelona Beach | 4.7 | 445 |
| 29 | Village Camps Santa Cruz | 4.8 | 412 |
| 2 | La Garenne International | 4.9 | 423 |

**Batch 3-5: 16 camps with 100-399 reviews**
| ID | Name | Current Rating | Current Reviews |
|----|------|---------------|-----------------|
| 3 | Camp Suisse | 4.8 | 356 |
| 32 | Explorer International Kids' Camps | 4.9 | 312 |
| 11 | AC Milan Academy Camp | 4.9 | 312 |
| 36 | Carlingford Adventure Centre | 4.8 | 289 |
| 9 | EUROCAM Bohemia | 4.8 | 267 |
| 4 | Altitude Camps | 4.8 | 234 |
| 30 | Funside Balaton International Camp | 4.8 | 234 |
| 54 | Campamento La Serrana | 4.5 | 215 |
| 28 | Jagiellonian University Explorers' | 4.8 | 203 |
| 38 | Wild Camp Beckershof | 4.7 | 198 |
| 10 | Adventure Camp Bavaria | 4.6 | 189 |
| 8 | Alpine French School Day Camp | 4.6 | 178 |
| 33 | Ridgway Adventure | 4.9 | 178 |
| 37 | Filmkollo | 4.8 | 156 |
| 27 | Auersperg-International Summer Camp | 4.7 | 156 |
| 45 | Sirdal Huskyfarm | 5.0 | 150 |

**Batch 6-8: 15 camps with <100 reviews**
| ID | Name | Current Rating | Current Reviews |
|----|------|---------------|-----------------|
| 21 | Summer Camp Finland International | 4.7 | 142 |
| 14 | Adventure Treks Norway Expedition | 4.9 | 134 |
| 15 | Camp Bjøntegaard | 4.9 | 127 |
| 39 | Din Camp SportsCamp | 4.7 | 103 |
| 25 | My Camp at Quinta da Broeira | 4.7 | 95 |
| 42 | Zeilschool De Kikkert | 4.6 | 95 |
| 12 | Wildwind Youth Sailing Club | 4.8 | 89 |
| 20 | Ranum Efterskole International | 4.7 | 89 |
| 23 | Myhre Gård Riding Camp | 4.8 | 89 |
| 18 | Nordic Terrain Academy Day Camp | 4.6 | 87 |
| 24 | Warsaw Montessori Family Camp | 4.7 | 85 |
| 17 | Bold Earth Adventures - Iceland | 4.8 | 73 |
| 26 | Nationalpark Kalkalpen Family Camp | 4.6 | 72 |
| 40 | Nordisk Sommerlejr | 4.6 | 67 |
| 31 | Camp Semenic Explorer | 4.7 | 45 |

### Agent Prompt Template (copy-paste ready)

```
Verify review data for these 5 camps. For EACH camp, search:
1. Google Reviews — "[Camp Name] [City] reviews"
2. Trustpilot — "site:trustpilot.com [Camp Name]"
3. TripAdvisor — "site:tripadvisor.com [Camp Name]"
4. Facebook — "[Camp Name] Facebook page reviews"
5. CampRatingz — "site:campratingz.com [Camp Name]"
6. GoAbroad — "site:goabroad.com [Camp Name]"

For camps in non-English countries, also search in native language.

For EACH platform where you find reviews, report:
- Platform name
- Rating (on their scale, e.g. "4.8/5")
- Review count
- URL to the review page
- Date verified (today)

If NOT FOUND on a platform, say "NOT FOUND" — do NOT guess or fabricate.
Report findings only, do not edit files.

Camps to verify:
1. [Camp Name] (ID XX) — [City, Country] — currently shows [rating] with [reviews] reviews
2. [Camp Name] (ID XX) — [City, Country] — currently shows [rating] with [reviews] reviews
3. [Camp Name] (ID XX) — [City, Country] — currently shows [rating] with [reviews] reviews
4. [Camp Name] (ID XX) — [City, Country] — currently shows [rating] with [reviews] reviews
5. [Camp Name] (ID XX) — [City, Country] — currently shows [rating] with [reviews] reviews
```

### How to Process Agent Results

For each camp the agent reports on:

**Step 1: Calculate weighted average**
```
For each source found:
  weighted_contribution = rating * tier_weight * review_count

aggregateRating = sum(all weighted_contributions) / sum(tier_weight * review_count for each source)
Round to 1 decimal place.
```

Tier weights: campratingz/worldcamps/bestsummercourses/goabroad = 1.3, google/trustpilot/tripadvisor/facebook = 1.0, camping2be/ukcampsite/campsde/firstcamp = 0.8

**Step 2: Add reviewData to camps.js**
```javascript
// Example: Camp with Google (4.8, 412 reviews) + Trustpilot (4.9, 356 reviews)
{
  rating: 4.8,  // weighted average
  reviews: 768, // 412 + 356
  reviewData: {
    lastVerified: "2026-02",
    sources: {
      google: { rating: 4.8, count: 412 },
      trustpilot: { rating: 4.9, count: 356 }
    }
  }
}
```

**Step 3: If agent finds NO reviews anywhere**
```javascript
{
  rating: null,
  reviews: 0,
  reviewData: {
    lastVerified: "2026-02",
    sources: {},
    notes: "No reviews found on any platform"
  }
}
```

**Step 4: Manual spot-check**
- Verify at least 2 camps per batch by opening the actual platform URL
- Agents fabricate data — NEVER trust review numbers without spot-checking
- Common fabrication: agents report plausible-looking numbers that don't exist

**Step 5: Run validation + commit**
```bash
npm run validate:camps  # Must pass before committing
npm run build           # Full build test
```
Commit after each batch of ~5 camps. Don't wait until all 40 are done.

### Parallel Agent Strategy
- Run up to 4 camp-data-verifier agents in parallel (5 camps each = 20 per round)
- 2 rounds covers all 40 camps
- Launch all agents in a single message for parallel execution

---

## Phase 3: Research 25 Zero-Review Camps (1-2 sessions)

### Goal
Search all review platforms for the 25 camps currently showing no reviews. Some may have gained reviews since initial research. Those that remain at 0 keep their current display (hidden review row, no rating badge).

### Camp IDs to Research
43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69

### Same agent prompt template as Phase 2, but expect many "NOT FOUND" results.

### Processing
- If reviews found: add `reviewData`, calculate weighted `rating`, set `reviews` to total count
- If still no reviews: add `reviewData: { lastVerified: "2026-02", sources: {} }` (optional — can skip if no additional context to add)
- Camps that remain at 0 reviews are fine — they just show less info on the card

---

## Phase 4: Documentation Updates (1 session)

### Files to Update

**CLAUDE.md** — Multiple sections need updating:
- Section 7.1 "Camp Data Structure": Add `reviewData` to the data structure example
- Section 7.1: Document `rating: null` behavior
- Section 1 "Session Startup Protocol": Add REVIEW_METHODOLOGY.md to mandatory reading list
- Section 3.1 or new section: Add review verification workflow

**CODE_STRUCTURE.md** — Add documentation for:
- `REVIEW_SOURCES` constant location and purpose
- `reviewData` field on camp objects
- `scripts/` directory: `register-loader.mjs`, `null-loader.mjs`, `validate-camps.js`
- `prebuild` npm hook and what it validates
- UI rendering logic for null ratings and zero reviews (5 locations in App.jsx)

**CAMP_VERIFICATION_CRITERIA.md** — Add:
- "Step 6: Review Data Collection" to the verification workflow
- Platforms to search, tier system reference
- What to do when no reviews found

**DEVELOPMENT_GUIDELINES.md** — Add to pre-commit checklist:
- [ ] Review data validated (`npm run validate:camps`)
- [ ] New camps include review research
- [ ] `rating: null` for camps with `reviews: 0`

**MEMORY.md** — Update with:
- Final review system statistics (how many camps verified, sources found, etc.)
- Any lessons learned during Phase 2-3

**.claude/agents/camp-data-verifier.md** — Add:
- Review collection as part of verification responsibilities
- Platforms to search and reporting format
- Tier system reference

**.claude/agents/camp-content-researcher.md** — Add:
- Review search to new camp research SOP
- Report format for review data found during camp research

---

## Quick Reference

### Key Files
| File | Purpose |
|------|---------|
| `src/data/camps.js` | Camp data + REVIEW_SOURCES constant |
| `src/App.jsx` | UI rendering (5 locations modified) |
| `src/App.css` | `.trust-indicator` class (unified styling) |
| `scripts/register-loader.mjs` | ESM loader registration for Node.js |
| `scripts/null-loader.mjs` | Intercepts image imports in Node.js |
| `scripts/validate-camps.js` | Build-time camp data validator |
| `package.json` | `validate:camps` + `prebuild` scripts |
| `REVIEW_METHODOLOGY.md` | Full system documentation |

### Commands
```bash
npm run validate:camps  # Run validation standalone
npm run build           # Runs validation as prebuild hook, then Vite build
npm run dev             # Dev server (no validation — manual run if needed)
```

### Validation Rules (what the script checks)
1. `rating` is null or number 1.0-5.0
2. `reviews` is non-negative integer
3. `rating === null` ↔ `reviews === 0` (both directions)
4. `reviewData.lastVerified` matches YYYY-MM format
5. All source keys exist in `REVIEW_SOURCES`
6. Each source: rating 1.0-5.0, count integer >= 1
7. `reviews` equals sum of all source counts
8. `rating` matches weighted average (0.1 tolerance)

---

*Delete this file after Phase 4 is complete — all info will be in permanent docs by then.*
