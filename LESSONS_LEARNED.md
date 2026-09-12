# Lessons Learned & Rules

*Last Updated: September 4, 2026*
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

### Lesson: Background Agents Return Empty Output & Cause Session Crashes (February 2026)

**Problem**: When agents run in the background (`run_in_background: true`), their output file appears empty when read later. In a February 6, 2026 session, 5 background camp-research agents were launched simultaneously. All 5 completed (12,000-18,000+ tokens each, 20+ tools used), but every one returned empty results. The contingency plan of reading output files directly (`C:\Users\Soda\AppData\Local\Temp\claude\...\tasks\[id].output`) also returned empty. Recovery attempts consumed the remaining context window, causing a session crash — losing ALL research work.

**Root Cause**: Bug in background task output retrieval mechanism. Agents complete their work but findings are never written to the output file. The bug has been reported to Anthropic.

**Impact**:
- All 5 agents' research was lost (hours of web searches across 5 countries)
- Recovery attempts (TaskOutput calls, direct file reads) consumed context window
- Session crashed, requiring full restart from zero
- Total waste: the entire session's work

**Solution**: Never use `run_in_background: true` for any agent whose output you need. Run agents in foreground only. Limit parallel foreground agents to 2-3 max to avoid context window pressure.

**Rule**:
1. **NEVER use `run_in_background: true`** for any research agent — the output will be empty
2. Reading output files directly is NOT a viable workaround (also empty)
3. Run agents in **foreground only** so findings are returned inline
4. Up to **4 parallel foreground agents** is safe and has been done many times without issue
5. The crash was caused by background mode + failed recovery attempts consuming context — NOT by the number of agents

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

### Lesson: Always Search in Native Language for Non-English Countries (February 2026)

**Problem**: When researching camps in France, Germany, Italy, Greece, and Finland, English-only searches miss many local camps that don't have English websites.

**Root Cause**: Local residential camps (especially budget/community-run ones) often only appear in native-language search results. For example, French "colonies de vacances" have a 140-year tradition but many don't appear in English searches.

**Solution**: Instructed all research agents to search in BOTH native language AND English. Examples:
- France: "colonie de vacances 2026", "séjour jeunes été"
- Germany: "Ferienlager 2026", "Sommercamp Kinder"
- Italy: "campo estivo 2026", "colonia estiva"
- Greece: "kataskinosi kalokairi", "nautiko camp"
- Finland: "kesäleiri 2026", "lasten leiri"

**Rule**: When researching camps in a non-English country, ALWAYS search in BOTH the native language AND English. Include native-language search terms in agent prompts.

---

### Lesson: Agent-Reported Age Ranges May Be Wrong (February 2026)

**Problem**: Camp-content-researcher agent reported Vierumäki Finnhockey School ages as "9-14 years". Manual verification via web search revealed actual ages are "10-16 years".

**Root Cause**: Agent likely misread or inferred age data. JS-heavy sites (like vierumaki.fi) don't render properly via WebFetch, so agent may have gotten data from a secondary source.

**Impact**: Would have shown incorrect age range to parents, potentially causing families to register children who are too young or overlooking the camp for eligible teens.

**Solution**: Manual web search verification caught the error before deployment. Fixed in camps.js with correction comment.

**Rule**:
1. **Always manually verify at least the price and age range** for every camp before final deployment
2. For JS-rendered sites that WebFetch can't scrape, use WebSearch or Chrome MCP for verification
3. Add verification comments in code noting corrections from agent data

---

### Lesson: Agents Fabricate Dates Rather Than Admitting Uncertainty (February 2026)

**Problem**: Camp-data-verifier agent reported Luontoliitto registration opens "Feb 15". The actual date on luppi.fi/leirit/ was **17.2** (February 17) — clearly visible in plain text on the page.

**Root Cause**: Agent either misread the European date format (17.2 = Feb 17, not Feb 15) or fabricated a plausible-sounding date rather than admitting it couldn't confirm. The text was not hidden in an image or JS — it was plain HTML text the agent should have read correctly.

**Impact**: Deployed incorrect opening date to production. Parents checking our site would see "Opens Feb 15" and potentially miss that registration actually opens Feb 17.

**Solution**: User manually verified from screenshot and caught the 2-day discrepancy.

**Rule**:
1. **Dates are high-precision data** — a 2-day error matters for registration deadlines
2. **Always manually verify dates and deadlines** — agents treat them as approximate when they're exact
3. Agents must be instructed: "If you cannot read the exact date, say NOT FOUND — do not approximate"
4. European date format (DD.MM) is commonly misread — verify the day/month aren't swapped
5. **Expand the manual verification checklist**: price, age range, AND dates/deadlines

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

### Lesson: Ask Before Implementing During Investigation or Discussion (February 2026)

**Problem**: Repeated pattern of Claude editing code when the user is asking for advice or investigating an issue — not requesting implementation. Examples:
1. User asked investigative questions about an iOS hero wobble issue. Claude immediately implemented a fix without asking.
2. User said "we should consider ignoring it unless you have a great fix" about a badge overlap. Claude immediately started editing files instead of discussing options first.

**Root Cause**: Misinterpreting the user's intent — questions or requests for advice don't mean "fix it now." When the user asks "should we do X?" or "what do you think?", they want a discussion, not file edits.

**Impact**: User loses control of when code changes happen. Even if the fix is correct, editing before the user has a chance to weigh in bypasses their decision-making.

**Solution**: When user is asking questions, requesting advice, or discussing options — ONLY respond with analysis and recommendations. Never open an editor. Explicitly ask "Would you like me to implement this?" and wait for a clear "yes."

**Rule**: When the user is in "discussion mode" (asking for advice, weighing options, investigating):
1. Explain the root cause or trade-offs
2. Describe the proposed solution(s) — in text, not in code edits
3. Give your recommendation
4. **ASK**: "Would you like me to implement this?"
5. **Wait for explicit approval before editing any files**
6. **NEVER use Edit, Write, or Bash tools** until the user says to proceed

**Signs of discussion/investigation mode** (DO NOT EDIT):
- "Can you look into..."
- "Why is this happening?"
- "What's causing..."
- "I noticed [issue], can you explain?"
- "We should consider..."
- "Unless you have a great fix..."
- "What do you think about..."
- "Should we..."
- Any phrasing that asks for your opinion or presents options

**Signs of implementation mode** (OK to proceed):
- "Fix the..."
- "Update the..."
- "Change X to Y"
- "Implement..."
- "Go ahead"
- "Do it"
- Explicit "yes" after you asked for permission

---

### Lesson: A decision made without data needs a recorded re-check trigger (September 2026)

**Problem**: The 16 Aug "year-agnostic title" decision was made without Search Console access. The reservation was written down. When the data arrived (3 Sept), it showed year-bearing queries were the best-converting segment, competitors already carried "2027" in their titles, and Google documents no ranking cost for a title change.

**Solution**: Re-decided explicitly with the owner's delegated authority: the title and descriptions keep a season year (rolled every September); everything else went year-agnostic. Recorded in docs/reports/WAVE1_ROLLOVER_PLAN_2026-09-03.md with the evidence and the reviewer verdicts.

**Rule**: When deciding without a key data source, write the missing evidence and the re-check trigger next to the decision, and when the evidence lands, re-decide on the record instead of defending the earlier call.

---

### Lesson: Agent reports are truncated by the message channel at roughly 5,000 characters (September 2026)

**Problem**: Three agent reports arrived cut off mid-sentence, twice each, and re-requests were cut again.

**Rule**: Brief every agent to answer in under 4,500 characters, ask for the most important sections first, and split long deliverables across separate requests. Verify anything critical yourself rather than waiting on a resend.

---

### Lesson: Gmail Search Results Truncate Thread Message Lists (September 2026)

**Problem**: Gmail MCP `search_threads` returned only the first ~5 of 9 messages in the LINEŠA thread, consistently across four different queries (including a sent-mail search scoped to the recipient). Based on that view, the 17 Aug reply was declared "never sent", an apology email stating so was drafted, and the owner sent it. The full thread (`get_thread`) showed the reply HAD been sent, and LINEŠA had already answered it on 24 Aug.

**Root Cause**: Search results include a per-thread message list that silently caps its length. It was treated as the complete thread. Multiple queries agreeing proved nothing, since all shared the same truncation.

**Impact**: A factually false statement ("our reply was never sent") went to a government agency contact who knew it was false. Owner decision: leave it, no correction email.

**Solution**: Full-thread verification before negative claims; tool bug reported to Anthropic.

**Rule**:
1. NEVER conclude a message was not sent, or that a thread received no reply, from search results alone
2. Before ANY "this never happened" claim about correspondence, read the full thread with `get_thread`
3. Several queries agreeing is not confirmation when they share the same data path

---

## Tooling & Environment

### Lesson: A Python MCP server loses its TLS workaround on package upgrade (September 2026)

**Problem**: Every `gsc` MCP call failed with `[SSL: CERTIFICATE_VERIFY_FAILED]` on 3 Sept 2026, although the same calls worked on 17 Aug.

**Root Cause**: Playground upgraded the server package on 22 Aug (mcp-gsc 0.1.0 to mcp-search-console 0.3.3). The old TLS fix for the corporate-AV interception lived inside site-packages; the new version uses a code path that ignores the `HTTPLIB2_CA_CERTS` env var still set in `~/.claude.json`. CLAUDE.md had predicted exactly this.

**Solution**: Pulled the data with a standalone script using the same service-account file plus `truststore.inject_into_ssl()` and `HTTPLIB2_CA_CERTS`, validation never disabled. Bridge note to Playground for the server fix.

**Rule**: After any MCP server upgrade, run one live call before relying on it. Keep a direct-API fallback for critical data sources. Never fix a TLS failure by disabling certificate validation.

---

### Lesson: Visual verification without the Chrome extension (September 2026)

**Problem**: The Claude in Chrome extension stopped responding on `localhost` (site permission not granted for that origin), and headless `chrome --screenshot` with a 16,000px window produced a 16,000px hero because the hero is sized to the viewport.

**Solution**: Drove headless Chrome over the DevTools protocol with a small Node script (dismiss consent, `scrollIntoView` per section, iPhone device emulation, console and exception capture, FAQ toggle), captured viewport screenshots per section and a JSON report of rendered strings.

**Rule**: For local or preview visual checks use a CDP script against `vite preview`, not tall-window screenshots. Read the rendered DOM for strings (title, marquee, badges, counts) and read screenshots for layout. Production verification through the extension still follows after the owner pushes.

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

## 5 September 2026 (season rollover close-out)

- **Never undersell the verification work in outward copy.** A FAQ answer written from the schema phrase "compiled from public sources, not site inspections" made the site sound like it does no verification. The owner corrected it: state the five-point test, the manual checks and the direct enquiries to camps, without claiming inspections or guarantees. Rule: describe what we actually do, no more and no less; the claims list in CAMP_VERIFICATION_CRITERIA.md is the boundary.
- **Reviewer estimates are not measurements.** The mobile-first reviewer estimated widths from font metrics and flagged tablet clipping that did not exist (measured 697px pill inside 800px) while correctly finding a 320px overlap. Every layout finding is checked against rendered DevTools measurements before code changes; rejections are recorded with the numbers.
- **Regional copy must name substance, not only price.** "Eastern Europe offers budget-friendly programs" read as condescending; the fix names the listed camps' strengths (university summer school, Lake Balaton sailing, national-park wilderness, seaside camps). Check every country sentence for this pattern.
- **Tooling:** `grep -c` exits 1 on zero matches and silently breaks a `&&` chain (a commit was skipped once); use `|| true` or check the count in Python. A Python file named `inspect.py` shadows the stdlib and breaks every import. The Search Console URL-inspection deep link with an `id` parameter returns 404; open the property and use the top inspection bar. The Claude in Chrome window ignores resize when maximized; phone-width verification runs through the headless DevTools script.

## 6 September 2026 (Wave 2 round 1, winter section built dark)

- **Research agents are slow, not broken (corrected the same evening).** The seven Opus research agents delivered full reports 40 to 70 minutes after dispatch; the "idle without reports" reading came from truncated idle notifications, and the Haiku ping and WebFetch tests both replied. The Node WebFetch hook was wrongly suspected. Rule: an idle notification with a truncated result is not a missing report; ask the agent for the report as its reply, and budget an hour for web-research agents. Keep Astra web research as the parallel lane, not the replacement.
- **A gate that contradicts itself is explained before anything is committed.** A DOM read said "Booking open" and a screenshot a minute later said "2027 dates published" from the same server. The cause was the verify script: proc.kill() leaves headless Chrome alive on Windows (216 processes in one day), the random DevTools port collided with a leftover browser still on the app URL, and a same-URL navigation is a hash-only change that never reloads. Fixed in `scripts/cdp-verify.mjs` (Chrome-chosen port read from DevToolsActivePort, taskkill /T at teardown). Rule: never reconcile a contradiction by re-running until it agrees; find the mechanism.
- **Check the runner log before treating an external review as done.** The Astra SEO review "ran" but the log shows HTTP 429 `credit_balance_exhausted`; no output file was written. Rule: `scripts/ai-review.sh` output without a `.md` means it did not run; read the `.log`. Verify credit on the OpenAI organisation before planning a panel.
- **Both Google connectors were broken by Norton's TLS interception, and the IPv6 line was a decoy (fixed 6 Sept 2026, night).** Pinning gRPC to the IPv4 address exposed the real error, `unable to get local issuer certificate`; every Google API host presented a certificate issued by `Norton Web/Mail Shield Root`, trusted by Windows but absent from the connectors' 16 August roots file. The interception came from Norton's AI-agent protection ("Webovervågning", which monitors Claude Code), and deactivating Norton as a whole did not stop it. The owner switched that toggle off; the issuer became Google Trust Services and both the ga4 gRPC path and the gsc httplib2 path passed within seconds, the ga4 MCP without a restart. Rules: when a TLS or connect error names one address, test the other family before believing it; check the presented issuer with the Windows store before touching any roots file; a trust-file edit is the owner's action, not the agent's (the classifier blocked it, rightly). Superseded lesson below kept for the record.
- **The GA4 MCP fails on IPv6, not on credentials.** It dialled an IPv6 address; this PC has no IPv6 route (curl -6 fails, curl -4 works). Bridge note to Playground (their custody). Production event behaviour is verified by stubbing gtag and window.open over the DevTools protocol; that gate stays the fast check.
- **A discounted price is not the public price.** My Camp's 570 euro was the returning-participant or sibling discount; the brochure's "valor ao publico" is 620 euro. Rule: when an operator shows more than one figure, list the price a first-time family pays and record the others in the provenance comment.
- **Headless Chrome on this machine (the explicit entry, cross-referenced to Playground's 2026-07-11 to 07-14 lessons and the bridge's shared-machine facts).** Symptoms: system-wide lag, low-memory kills, a verify gate that reads a stale page. Causes, all seen here on 6 Sept 2026: (1) `proc.kill()` and even `taskkill /PID /T` can reap a corpse because chrome.exe may hand off to the real browser and exit; (2) a random DevTools port in a shared range collides with a leftover browser; (3) any harness timeout kills the script without its exit handlers. Rules now encoded in `scripts/cdp-verify.mjs`: Chrome picks its own port and the script reads `DevToolsActivePort` from its own throwaway profile; every exit path sweeps by the run's unique profile name in the process command line; every launch first reaps strays older than three minutes; the sweep pattern was validated against a live run (12 processes matched) before its zeros were trusted; profile removal retries because locks outlive the kill. Between batches, count with `Get-CimInstance Win32_Process` filtered on `esc-cdp-`. Playground had already fixed and logged this in July; the shared-machine facts file in the bridge is the place to check before writing any browser-spawning tool.
- **The enrolment form is the source of truth for "open".** Les Elfes' dates and price were already right from August; what the owner's link changed was the badge, because the operator's enrolment form lists every 2027 session as selectable with its price. Marketing pages announce, forms sell. Rule: a badge of "open" comes from the booking or enrolment form, "dates published" from a dated programme page, nothing from anything else. The six-step search order (dates page, enrolment form, brochure PDF, interactive widgets need a browser, unlabelled years reported as printed, every price label reported) is now in `.claude/agents/camp-data-verifier.md` and the panel brief template.
- **Interactive booking flows hide dates from fetch tools.** Altitude's booking widget asks for the child's birth month and year before it shows anything, and its calendar cannot move past the last configured month. An agent without a browser reports the marketing page and stops; the lead walks the flow in Chrome (done 6 Sept: nothing bookable beyond September 2026). Both sides go into the listing: the published weeks with their calendar year, and "(not yet bookable)".
- **Unlabelled dates can still be verified by the calendar.** Altitude publishes Sunday-to-Saturday weeks with no year; the weekdays exist only in 2027 and differ from the 2026 dates the same page carried in August. Record the reasoning in the provenance comment and set no badge.
- **Astra web research is a proven seat.** 20 to 28 operator pages per run in its own context, honest NOT FOUND, resolved a fee table WebFetch could not render. The lead still re-reads every number that enters camps.js.
- **Refactor gate for the card markup:** dump the outerHTML of every `[data-camp-card]` over the DevTools protocol before and after and compare bytes; cut the block programmatically, never retype it.
- **Bash heredocs above roughly 5 KB fail on this tool** with an unmatched-quote error even when quoted. Multi-line files go through the Write tool; Bash runs short commands and scripts saved to the scratchpad.
- **Review gates trigger on artefact type.** The winter spec went to Astra and Gemini before the build and the diff went to Astra and a Fable agent before the push; every finding is adjudicated in the spec. Astra's comparison "blocker" was rejected on evidence (selection holds camp objects), which is the lead's job.
- **Generated assets get descriptive file names from the start** (`european-winter-camp-ski-lesson-children-alps`, not `winter-alpine-hero`); Vite keeps the base name in the built URL, and renaming later touches imports, ledger and cached URLs.


## 7 September 2026 (AFK night run, Fable in charge): eight lessons

1. **The agent channel cuts every result at 16,000 characters, and a cut result reaches the lead as nothing.** Four of six research reports arrived truncated and one arrived twice cut. Rule: ask agents for tables under 6,500 characters, split in halves by id, no preamble; when a result is cut, request only the missing part by name. Budget an extra round per agent.
2. **An agent-reported email address is a claim until the string is seen on the operator's page.** A curl of the cited page with a browser User-Agent and a grep for the exact address confirmed 49 of 52 in one pass; the three misses were a fetch block, a JavaScript-rendered address and an entity-encoded one, each settled by a second route. Cloudflare's email protection decodes offline: XOR the hex pairs of `data-cfemail` with the first byte. Entity-encoded addresses (`&#104;&#97;...`) decode the same way through any HTML entity decoder. Never write to an address that failed every check; leave the recipient empty and say so in the first line.
3. **Form-only operators are not one category.** A general contact form works (Atlas Summer Courses took the message and confirmed). An admissions form does not: HIF's requires a phone number, a student's name and a date of birth, and a directory enquiry cannot honestly fill them; the message stays a draft and the route is the phone. Check the required fields before typing the message.
4. **The auto-mode classifier can block a batched submit click that it allowed moments earlier as a standalone click.** Retry once as a plain click, never loop; if refused again, stop and report.
5. **A GA4 table parsed by regex must be scoped to its section.** The first pass took "booking clicks by camp" from the whole report and picked up the video-clicks table for Les Elfes (25 instead of 53). Split on the heading first, then parse.
6. **Some domains are blocked for the Chrome tab with "Navigation to this domain is not allowed"** (djuringa-juniors.fr, campadventure.de, dincamp.dk, kidscampamerica.com, romanianunitedfund.org this night). Use the fetch tool or curl (curl_cffi with Chrome impersonation when a site returns 403; recipe in memory) rather than retrying the tab.
7. **Invoice and outreach wording carry the business image.** The owner struck the line that explained the VAT exemption by a turnover threshold: it tells a client nothing they need and undercuts the picture of a successful business. Invoices say "VAT exempt" and name ResourceHub as the umbrella company; outreach asks for the invoicing details, states the value delivered, and frames the fee as the way to stay listed, never as a cost we cannot absorb. Read every outward line as the client would.
8. **Winter camps are not ski camps** (owner correction 6 Sept, applied throughout the vetting): the winter point is "the core activity's equipment and instruction stated"; a coach-inclusive price is the only fail that can sink an otherwise good non-ski camp, and that is the owner's call, not the rubric's.

### Lesson: Bulk drafting produces outward-facing errors, and two of them are dangerous (September 2026)

**Problem**: In the 7 September AFK run, about 60 Gmail drafts were created in one pass. The owner found two faults when he came to send them, and stopped sending as a result:
1. **Internal notes to the owner were left inside the draft body.** A note meant for him sat in a message addressed to a camp operator. Had he been tired and sent it, an internal remark would have gone out under his name to a business contact.
2. **The sender was never switched to partnerships@.** Drafts default to the owner's personal Gmail address, so a partnership message would have arrived from a private address rather than the business one.

**Root cause**: Volume. Quality control does not survive sixty repetitions in a single unbroken run, and neither fault is visible unless each draft is read as the recipient would read it. The bulk itself was the defect, not any individual draft.

**Impact**: The owner stopped sending the outreach batch. Real revenue work stalled, which is a worse outcome than a slower, smaller batch would have been.

**Rule**:
1. **Draft in batches of 5 to 10, never more.** After each batch, re-read every draft end to end as the recipient before starting the next.
2. **Nothing addressed to the owner ever goes inside a draft body.** Anything he needs to know goes in the chat message or the session report, never in the message itself. If a draft genuinely cannot be completed (no address found, a figure missing), say so in chat and leave the recipient field empty rather than writing a note into the text.
3. **The Gmail API cannot set the sender.** `create_draft` has no `from` field, so every draft is created on the owner's default address. State explicitly, every time drafts are handed over, that the From address must be switched to partnerships@ before sending. Do not assume he remembers.
4. **Read each finished draft once as the recipient.** Not as the author checking facts: as a camp operator receiving a cold message. That is the pass that catches an internal note, a placeholder or a wrong sender.
5. A smaller batch that can actually be sent beats a complete batch that stalls.

**Correction to the above, same evening.** I first concluded that the stray internal notes were confined to the four drafts that had no recipient, because the 7 September procedure instructed a note there. The owner corrected me: notes also appear in drafts that do have a recipient. That is the more dangerous case, since those can be sent in a single click.

Two lessons on top of the original:
1. **Do not generalise a root cause from the samples you happened to open.** I read four drafts, found a pattern that matched a known instruction, and treated it as the full explanation. A believable mechanism is not the same as a measured scope.
2. **When the scope of a defect is unknown, say unknown.** The safe instruction is "read every draft before sending", not "the ones with recipients are fine". Stating a reassuring boundary that has not been verified is worse than stating none, because it stops the person checking.

---

## 12 September 2026: Premium cards, labels, drafts, Revolut

### Reviews check facts; nobody pressed the card
Three fact-checking reviews in one month passed a "+N more" activities chip that did nothing on any of 68 cards, and a "Via Ferrata" chip no non-alpine parent understands. The owner found both on his phone in a minute.
**Rule**: every review of anything a parent sees includes one pass as a first-time parent who presses everything. Now in the panel brief template (item 8). Jargon in activity and highlight strings gets a plain-language rendering ("Via Ferrata Climbing").

### One word, three meanings
"Premium" was the paid product (band on the card), the editorial category "Premium Alpine", and a price tier. The band read as a quality rating, and the paid label would have been a lesser word (FEATURED) for cheaper camps buying the same product.
**Rule**: the public label for paid placement is FEATURED, whatever the price tier; the category name may carry "Premium" because it is editorial; the product may be called a Premium listing in partner communication because the partner gets premium treatment. Never let a label depend on the camp's price class. Never promise a top row; the promise is "placed ahead of the standard listings".

### Majority rule for layout changes
Four cards per row measured as a 27 percent narrower card for every desktop visitor, or a change for at most 15 percent of sessions if gated. Neither benefits a majority.
**Rule**: before a layout change, count who is better off, worse off and unchanged from GA4 and measure the change on the real build (inject the style through the CDP script). A "nicer for wide screens" idea is a preference until measured.

### Outward mail: "we", verified numbers, a threshold
The owner rewrote the sent mails to "we" and added the indirect-referral sentence; the drafts still said "I", carried 11-to-19 referral figures that look weak, and promised "top of its category".
**Rule**: outward mail says "we", never "I". A referral figure appears only when re-read in GA4 on the day and only at 20 or more, with the indirect sentence; below that, the indirect sentence alone. Two-camp operators get the combined figure. Read the owner's own sent mails before drafting more of the same kind; his edits are the standard.

### A script that transforms drafts still needs the eye
The batch script applied the wording rules correctly but silently skipped the GA4 figure update it was supposed to make (a map defined and never used) and failed to match two sentences with a different shape (Altitude, Village Camps). Reading every generated body caught all three.
**Rule**: generate, then read each output as the recipient before it goes into a draft. Never trust a transformation on the sample that happened to look right.

### Small tool facts worth keeping
- Gmail `search_threads` can miss a reply received hours earlier; `get_thread` shows it. When a partner says a reply exists, read the thread, do not trust the search.
- Drive folders shared by link cannot be listed through the Drive connectors; read the file ids from the Drive page DOM and fetch `drive.google.com/thumbnail?id=...&sz=w480`, full size from `uc?export=download&id=...`.
- The Chrome MCP window resize did not change the viewport; `scripts/cdp-verify.mjs --width 390 --mobile --shot` is the phone-width check that works.
- A click that changes React state must be measured after a tick (`await new Promise(r => setTimeout(r, 400))` in the eval), or the DOM still shows the old state.
- Revolut Business Merchant: public fee pages return 403/404 to WebFetch; fees are only readable in the app. The web session expires quickly; the owner logs in, Claude never enters credentials.

### Payment wording: the invoice comes first, the link is an option
The first payment sentence for the outreach drafts said the invoice "can be paid by card or by bank transfer through a secure payment link". The owner read it as a bookkeeper would: a link from an unknown sender feels risky. Rewritten so the standard invoice, payable by bank transfer, is the primary and the online card payment is offered "should you prefer that"; the word "link" is gone.
**Rule**: when money is asked for, name the ordinary route first and the convenient one second, and never make the convenient one sound like the only one. Words that trigger fraud instincts ("link", "click", "pay now") stay out of first contact.

### A partner reply is not a changelog
The reply drafts to ILC and Les Elfes listed every highlight and every label change. The owner: they want to know the card is updated as they asked and that we value them; they will not read the rest.
**Rule**: a reply to a paying partner about work done says three things: done as you asked, tell us if anything should change, thank you. Detail lives on the card itself, not in the mail.

### Gmail drafts through the connector: three mechanics
- `update_draft` with only `body` keeps recipients and subject, regenerates the HTML, and is safe for a standalone draft. A draft inside a partner's thread must be replaced (`create_draft` with `replyToMessageId` on the partner's latest message) and the old one retitled [SUPERSEDED, DISCARD]; updating it detaches it from the thread.
- `list_drafts` page tokens go stale as soon as drafts change. Reusing a token from an earlier listing returns a different slice and makes drafts look missing. Always page from a fresh page 1.
- Bash prints UTF-8 as mojibake on this machine (Søren, Viñuelas); set `PYTHONIOENCODING=utf-8` before printing text that will be pasted into a draft.

### Revolut Business in the browser
- The web app renders dropdowns, date pickers and uploads through requestAnimationFrame. When the tab is not the visible tab (`document.visibilityState === "hidden"`) nothing renders and uploads sit on "Verifying image" forever. Ask the owner to keep the tab in front; check visibility before blaming the page.
- Leading zeros are stripped from invoice numbers, in the default and per invoice: the format is `2026-N`.
- "Create" on an invoice makes it Open and payable; the next screen offers "Send" and "Later". "Later" keeps it unsent. Cancel it from the "..." menu if it was a test.
- Payment-page branding, contact email and invoice numbering are account-wide, so they touch every ResourceHub brand; Playground is told through the bridge when they change.

## 12 September 2026, late: the owner's edits to the outreach mail are the tone rule

**What happened:** the owner sent King's College himself after editing my template in seven places (see NEXT_STEPS START HERE and auto-memory `outreach-wording-owner-edits-2026-09-12`). Every edit moved the mail the same way: name the sender, keep paragraphs short, phrase the ask as their decision, make the benefit concrete, make replying easy.

**Rule:** outward drafts open with the founder line, run four-to-five-line paragraphs, say "if you decide" and "we hope you will decide", state what the fee buys ("the full 2027 season"), close with "simply reply". When a template change is applied to existing drafts: one regex per shared sentence, each asserted to match exactly once, per-camp facts never touched, small batches, and every draft re-read from Gmail and diffed afterwards before "done" is said. The owner's reason for small batches: a large batch once leaked internal notes into the mails.

