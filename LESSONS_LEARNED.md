# Lessons Learned & Rules

*Last Updated: February 4, 2026 (Session 4)*
*Purpose: Centralized reference for errors encountered and rules derived from them*

---

## How to Use This Document

**When you encounter an error**: Add a new lesson following the format below.
**When starting a session**: Skim recent lessons to avoid repeating mistakes.
**Format**: Problem → Root Cause → Solution → Rule

### Meta-Lesson: Why This Document Exists

**This document is how we learn through trial and error.**

Claude Code doesn't retain memory between sessions. Without explicit documentation, the same mistakes get repeated. This document serves as persistent memory — capturing errors as they happen and deriving concrete rules to prevent recurrence.

**The key insight**: Every lesson must end with a **Rule** — a clear, actionable directive that future sessions can follow. Rules are not suggestions; they are requirements derived from real failures.

When you discover a problem, don't just fix it. Ask: "What rule would have prevented this?" Then add it here.

---

## Table of Contents

1. [Data Accuracy](#data-accuracy)
2. [Agent Management](#agent-management)
3. [Git & Version Control](#git--version-control)
4. [Context Window & Session Management](#context-window--session-management)
5. [Communication & Workflow](#communication--workflow)
6. [SEO & Technical](#seo--technical)
7. [ResourceHub Universal Principles](#resourcehub-universal-principles)

---

## Data Accuracy

### Lesson: Tour Operator vs Residential Camp (September 2025)

**Problem**: "Families Worldwide Prague & Tatras Adventure" mistakenly added as a camp.

**Root Cause**: Agent failed to distinguish tour operator from residential camp facility.

**Impact**: Families misled about service type - tour operators are NOT camps.

**Solution**: Created 5-point verification checklist in CAMP_VERIFICATION_CRITERIA.md.

**Rule**: Always verify camp has a dedicated residential facility (cabins/dormitories) - NOT hotels or tour lodging. All 5 criteria must pass before adding any camp.

---

### Lesson: Facility Rental vs Consumer Pricing (January 2026)

**Problem**: Camp Bjøntegaard displayed NOK 12,500 (facility rental rate) instead of NOK 5,890 (per-child price) — a 112% overcharge shown to real families.

**Root Cause**: Systematic failure to verify pricing was per-child consumer rate vs facility/group booking rate.

**Impact**: Only 4 of 23 camps were properly verified. Real families making booking decisions saw wrong prices.

**Solution**: Systematic verification of all camps via PRICING_VERIFICATION_URGENT.md (now 100% complete).

**Rule**: ALWAYS verify price is per-child for the camp program only. Watch for:
- Facility rental rates (for groups renting the whole venue)
- Corporate event pricing
- Group booking discounts
- Prices that include flights/transport

---

## Agent Management

### Lesson: Agents Making Unauthorized Changes (January 2026)

**Problem**: Agents created fake testimonials, fabricated statistics, and made unauthorized file edits.

**Root Cause**: Agents had file editing capabilities (Bash, Edit, Write tools) and too much autonomy.

**Impact**: Required extensive corrections, undermined data integrity, lost trust in agent outputs.

**Solution**: All agents converted to READ-ONLY research specialists. Removed Bash, Edit, Write tools from all agents via `/agents` UI.

**Rule**: Agents can ONLY research and report. Claude Code implements ALL code changes based on agent reports. Never delegate file editing to agents.

---

### Lesson: Background Agents Return Empty Output (February 2026)

**Problem**: When agents run in the background (`run_in_background: true`), their output file appears empty when read later, requiring the agent to be run again.

**Root Cause**: Unknown glitch in the background task output retrieval mechanism. The agent completes work but the findings aren't accessible when reading the output file.

**Impact**: Wasted time re-running agents. Defeats the purpose of parallelization when findings need to be "off-loaded" back to Claude Code for implementation.

**Solution**: Don't run read-only research agents in the background when their findings need to be processed immediately.

**Rule**: Never use `run_in_background: true` for READ-ONLY agents whose output you need to act on. Run them in the foreground so findings are returned directly. Background mode is only appropriate for fire-and-forget tasks where you don't need the output.

---

### Lesson: Agent Verification Requires Second Pass with Strict Instructions (February 2026)

**Problem**: Initial camp-data-verifier agents reported 4 new camps as "verified" but contained critical errors:
- Milias Camps listed as "Pelion Peninsula, Thessaly" — actually located at Mount Parnassos (wrong region entirely)
- Village Camps ages listed as 7-17 — actually 10-17 (could cause invalid bookings)
- Luontoliitto established year listed as 1951 — actually 1943
- Two booking URLs returned 404 errors

**Root Cause**: Agents took shortcuts, made assumptions, and didn't verify claims against actual website content. Initial verification prompts weren't strict enough.

**Impact**: Deployed incorrect data to production. Required manual verification and multiple correction commits. Could have misled real families.

**Solution**: Ran second verification pass with 4 parallel agents using strict instructions:
- "DO NOT GUESS"
- "Only report what you can verify on the website"
- "If you cannot find information, say 'NOT FOUND ON SITE'"
- Field-by-field verification checklist

**Rule**: For data accuracy tasks:
1. **Always run a second verification pass** before implementing agent findings
2. Include explicit "DO NOT GUESS" and "verify each field" instructions
3. **Manually spot-check URLs** — agents often report URLs that 404
4. For geographic data, cross-reference location claims (agents confused Pelion with Parnassos)
5. When in doubt, verify yourself using WebFetch/WebSearch

---

## Git & Version Control

### Lesson: Git Amend Blocks GitHub Desktop Push (Historical)

**Problem**: Using `git commit --amend` rewrites commit history, causing GitHub Desktop to fail when pushing.

**Root Cause**: Amended commits have different hashes than what's on the remote.

**Solution**: Always create new commits instead of amending.

**Rule**: NEVER use `git commit --amend`. Always create new commits, even for small fixes.

---

### Lesson: Windows Bash Creates Literal 'nul' File (Historical)

**Problem**: Using `2>nul` (Windows-style) in bash on Windows creates a literal file named `nul` in the project directory.

**Root Cause**: Bash interprets `2>nul` as "redirect to a file named nul" rather than Windows null device.

**Solution**: Always use Unix-style `2>/dev/null`.

**Rule**: In bash commands, ALWAYS use `2>/dev/null` (Unix-style), NEVER `2>nul` (Windows-style).

---

## Context Window & Session Management

### Lesson: Batched Commits for Multi-Item Tasks (February 2026)

**Problem**: When implementing many items (e.g., 9 code review fixes), working through all of them before committing risks losing work if auto-compaction occurs or the session is interrupted.

**Root Cause**: Auto-compaction summarizes context but can lose implementation details. Interruptions mid-edit leave work uncommitted.

**Impact**: Previous sessions lost partial work when context window compacted during large multi-file edits.

**Solution**: Commit in logical batches as you complete them, not one giant commit at the end.

**Rule**: When implementing 5+ items:
1. Group by file/risk profile (e.g., "static files" vs "App.jsx changes")
2. Complete a batch of 3-6 related items
3. Run `npm run build` to verify
4. Commit immediately with clear message
5. Then proceed to next batch

**Example**:
```
Batch 1: Static files (index.html, sitemap.xml, robots.txt) → Test → Commit ✓
Batch 2: App.jsx changes → Test → Commit ✓
Batch 3: Documentation → Commit ✓
```

---

## Communication & Workflow

### Lesson: Ask Before Implementing During Investigation (February 2026)

**Problem**: User asked investigative questions about an iOS hero wobble issue. Claude immediately implemented a fix without asking permission first.

**Root Cause**: Misinterpreting the user's intent — questions about a problem don't automatically mean "fix it now."

**Impact**: User lost control of when code changes happen. The fix was correct, but the user should decide when to implement.

**Solution**: When user is asking questions/investigating, explain the cause and proposed fix, then explicitly ask "Would you like me to implement this?" before making code changes.

**Rule**: When the user is in "investigation mode" (asking questions about an issue, not explicitly requesting a fix):
1. Explain the root cause
2. Describe the proposed solution
3. **ASK**: "Would you like me to implement this fix?"
4. Wait for explicit approval before editing any files

**Signs of investigation mode**:
- "Can you look into..."
- "Why is this happening?"
- "What's causing..."
- "I noticed [issue], can you explain?"

**Signs of implementation mode** (OK to proceed):
- "Fix the..."
- "Update the..."
- "Change X to Y"
- "Implement..."

---

## SEO & Technical

### Lesson: og:image Must Actually Exist (February 2026)

**Problem**: og:image meta tag referenced a `.png` file that didn't exist in `public/` — social sharing previews were broken.

**Root Cause**: File was renamed/moved but meta tags weren't updated to match.

**Solution**: Generated the correct PNG file and ensured meta tags match actual files.

**Rule**: After any image changes, verify og:image and twitter:image URLs point to files that actually exist. Test with social media debuggers.

---

### Lesson: Hash Fragment URLs in Schema Are Useless (February 2026)

**Problem**: robots.txt had `Allow: /#discover`, `Allow: /#compare` etc. SearchAction schema used `/#discover?search={search_term}`.

**Root Cause**: Misunderstanding of how crawlers handle URLs — they strip hash fragments entirely.

**Solution**: Removed useless hash Allow lines from robots.txt. Schema hash URLs kept until Phase 2 provides real routes.

**Rule**: Crawlers ignore everything after `#` in URLs. Don't use hash fragments in robots.txt Allow/Disallow rules or expect them to work in structured data URLs.

---

### Lesson: user-scalable=no Violates WCAG (February 2026)

**Problem**: Site claimed "WCAG 2.1 AA COMPLIANT" but had `user-scalable=no` in viewport meta, which directly violates WCAG 1.4.4.

**Root Cause**: Mobile-first development sometimes disables zoom for "cleaner" UX, but this harms accessibility.

**Solution**: Removed `user-scalable=no` from viewport meta tag.

**Rule**: Never use `user-scalable=no`. Users must be able to pinch-to-zoom. If claiming WCAG compliance, verify all claims are actually true.

---

## ResourceHub Universal Principles

*These principles apply to all ResourceHub niche authority websites.*

### Technical Foundation
1. **Structured Data Excellence**: Complete JSON-LD schema with all required properties prevents Search Console errors
2. **Social Media Meta Synchronization**: og:image and twitter:image must match actual hero images
3. **Strategic Robots.txt Configuration**: Allow beneficial AI (ChatGPT, Claude, Perplexity), block scrapers

### SEO Architecture
4. **Clean URL Structure**: Never reference non-existent pages in sitemaps - creates 404 crawler errors
5. **Proactive Sitemap Maintenance**: Update lastmod dates, include image references, resubmit frequently

### Content Strategy
6. **Comprehensive Data Over Surface Content**: 100+ verified entries with detailed info outperforms thin directories

### User Experience
7. **Advanced Search/Filter Systems**: Real-time search with category filtering and dynamic result counts
8. **Mobile-First Performance**: 70% of niche resource discovery happens on mobile

### Business Intelligence
9. **Search Console Monitoring**: Fix structured data errors immediately - they compound over time
10. **Technical Documentation**: Maintain comprehensive docs to prevent regression

---

## Adding New Lessons

When you encounter an error and find a fix, add it here using this template:

```markdown
### Lesson: [Brief Title] ([Date])

**Problem**: What went wrong?

**Root Cause**: Why did it happen?

**Impact**: What was the consequence?

**Solution**: How was it fixed?

**Rule**: What should always/never be done going forward?
```

---

*This document complements CLAUDE.md Section 10 (Historical Context) — both are maintained for different purposes. This doc is for quick lookup during active work; Section 10 provides narrative context.*
