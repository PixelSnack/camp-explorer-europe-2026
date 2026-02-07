# Review Aggregation System — Methodology & Documentation

*Last Updated: February 7, 2026*
*Status: Phase 1 Complete (foundation deployed), Phases 2-4 pending*

---

## Overview

Camp Explorer Europe aggregates publicly available review data from multiple platforms to provide families with an honest, transparent trust signal. This document defines the tier system, calculation methodology, data structure, research workflow, and refresh schedule.

---

## Review Source Tier System

### Tier 1 — Camp/Education-Specific (Weight: 1.3x)
Most relevant sources. Higher weight reflects domain expertise.

| Key | Platform | Notes |
|-----|----------|-------|
| `campratingz` | CampRatingz.com | Largest camp-specific review directory |
| `worldcamps` | WorldCamps.org | Multi-region camp discovery with reviews |
| `bestsummercourses` | Best Summer Courses Guide | Editorial curation at bestsummercourses.com |
| `goabroad` | GoAbroad.com | International program reviews |

### Tier 2 — Major General Platforms (Weight: 1.0x)
High-volume, high-trust, universal coverage.

| Key | Platform | Notes |
|-----|----------|-------|
| `google` | Google Reviews / Business | Most universal, hardest to fake |
| `trustpilot` | Trustpilot | Strong in UK/Europe, verified purchase system |
| `tripadvisor` | TripAdvisor | Strong for travel/accommodation |
| `facebook` | Facebook Reviews | Widely used across Europe |

### Tier 3 — Country/Regional Platforms (Weight: 0.8x)
Narrower audience but valuable for camps only found here.

| Key | Platform | Notes |
|-----|----------|-------|
| `camping2be` | Camping2Be | 900K+ European campsite reviews |
| `ukcampsite` | UKCampsite.co.uk | UK-specific |
| `campsde` | Camps.de | Germany-specific |
| `firstcamp` | First Camp | Nordic-specific |

Source keys are defined in `REVIEW_SOURCES` constant in `src/data/camps.js`.

---

## Calculation Methodology

### Weighted Average Rating

```
aggregateRating = sum(rating_i * weight_i * count_i) / sum(weight_i * count_i)
```

Where:
- `rating_i` = rating on platform i (normalized to 1.0-5.0)
- `weight_i` = tier multiplier (1.3, 1.0, or 0.8)
- `count_i` = number of reviews on platform i

Round to 1 decimal place (e.g., 4.7).

### Total Review Count
Simple sum of all review counts across all sources.

### Normalization
All sources normalized to 1.0-5.0 scale. Facebook "Recommended %" converted: `(recommended% / 100) * 5`.

### Minimum Thresholds
- **1+ source with 1+ review**: Display rating and review count normally
- **0 sources / 0 reviews**: Show "Verified Camp" badge (no star rating displayed)

---

## Data Structure

### Per camp (with reviews):
```javascript
{
  rating: 4.8,          // weighted average (top-level computed cache)
  reviews: 847,         // total count
  reviewData: {
    lastVerified: "2026-02",
    sources: {
      google: { rating: 4.8, count: 412 },
      trustpilot: { rating: 4.9, count: 356 },
      tripadvisor: { rating: 5.0, count: 79 }
    }
  }
}
```

### Per camp (no reviews found):
```javascript
{
  rating: null,         // no data = no rating displayed
  reviews: 0,
  reviewData: {
    lastVerified: "2026-02",
    sources: {},
    notes: "Small local camp, no online presence found"
  }
}
```

### Design Decisions
- **`reviewData` is additive** — can be added gradually per batch without breaking anything
- **Top-level `rating` and `reviews` are permanent** — they're the computed cache used by all UI render locations
- **`notes` field is optional** — only include when there's context worth noting (follows bookingStatus pattern)
- **Source keys must be from `REVIEW_SOURCES`** — build-time validation enforces this

---

## UI Behavior

### Camps with reviews (reviews > 0):
- Star rating badge on card image (top-right)
- Heart icon + "{count} reviews" in trust indicator area

### Camps without reviews (reviews === 0, rating === null):
- No star rating badge on card image
- Trust indicator row hidden entirely (clean card, no negative signal)
- All camps are verified — showing a badge on only some implies others are not

### Compare Panel:
- Rating row hidden entirely when rating is null

### Styling consistency:
- Home and Discover sections use matching styles: `font-weight: 400`, `text-sm`, `gray-500`
- Home uses `.trust-indicator` CSS class (App.css), Discover uses inline Tailwind classes

---

## Schema Considerations (SEO)

**Do NOT add AggregateRating schema.** Reasons:
1. Google prohibits third-party aggregated reviews in structured data
2. EducationalOrganization (our schema type) is blocked from review snippets
3. No individual camp pages exist (SPA)
4. Manual action risk could remove ALL rich results

**What we CAN do:**
- Display aggregated data in the UI (editorial content, not schema)
- Show "lastVerified" date for freshness signals
- In Phase 2 (individual pages): use `sameAs` links to review platform profiles

---

## Legal Notes

Displaying aggregated review counts is standard directory/aggregator practice (Trivago, Kayak, Hotels.com all do this). We are editorially reporting publicly available facts.

**What we do NOT do:**
- No AggregateRating schema markup
- No copying of actual review text (copyright)
- No claiming reviews were submitted on our site

---

## Build-Time Validation

The `npm run validate:camps` script (runs automatically as `prebuild` hook) checks:

1. `rating` is null or number 1.0-5.0
2. `reviews` is non-negative integer
3. If `rating === null`, then `reviews === 0` (and vice versa)
4. If `reviewData` present:
   - `lastVerified` matches YYYY-MM format
   - All source keys are from `REVIEW_SOURCES`
   - Each source has valid rating (1.0-5.0) and count (integer >= 1)
   - Total `reviews` equals sum of all source counts
   - `rating` matches weighted average (within 0.1 tolerance)

**Build fails on any validation error.** This prevents data integrity issues from reaching production.

---

## Research Workflow

### Agent Prompt Template (for camp-data-verifier):
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
- Platform name, Rating (on their scale), Review count, URL
- Date verified (today)

If NOT FOUND on a platform, say "NOT FOUND" — do NOT guess.
Report findings only, do not edit files.
```

### Batch Strategy
- 5 camps per agent, up to 4 agents in parallel = 20 camps per round
- Priority: Group A (40 camps with existing unverified data) first, Group B (25 camps with 0 reviews) second
- Manual spot-check: Verify at least 2 camps per batch against actual platforms

### New Camp SOP
When adding any new camp, include review research in the camp-content-researcher prompt. During data entry:
1. If reviews found: populate `reviewData.sources`, calculate weighted `rating` and total `reviews`
2. If no reviews found: set `rating: null, reviews: 0`
3. Spot-check at least 1 source URL manually

---

## Refresh Schedule

- **Quarterly**: Full verification cycle (all camps, batched over 2-3 sessions)
- **On camp addition**: Immediate review research (per SOP above)
- **On user report**: Verify within 48 hours
- **Annual**: Deep audit — check all source URLs still work, update methodology if platform landscape changed

---

## Implementation Phases

### Phase 1: Foundation (February 7, 2026) — COMPLETE
- REVIEW_SOURCES constants + JSDoc in camps.js
- Set `rating: null` for 25 zero-review camps
- UI: "Verified Camp" badge for 0-review camps, hide rating when null
- Build-time validation script (prebuild hook)
- This documentation

### Phase 2: Re-verify existing 40 camps (2-3 sessions)
- Batch by review count: 400+ first, then 100-399, then <100
- Add `reviewData` with verified sources
- Recalculate weighted averages

### Phase 3: Research 25 zero-review camps (1-2 sessions)
- Search all platforms for each camp
- Some will gain reviews, some stay at 0 with "Verified Camp" badge

### Phase 4: Documentation updates (1 session)
- Update CLAUDE.md, CODE_STRUCTURE.md, CAMP_VERIFICATION_CRITERIA.md
- Update agent instructions with review collection responsibilities

---

## Current Statistics (Phase 1)

| Metric | Count |
|--------|-------|
| Total camps | 65 |
| Camps with reviews | 40 (62%) |
| Camps without reviews | 25 (38%) |
| Camps showing "Verified Camp" | 25 |
| Review sources defined | 12 |
| Validation rules | 8+ |

---

*Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>*
