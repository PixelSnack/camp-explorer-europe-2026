# Code Review Report: Camp Explorer Europe 2026

*Review Date: February 1, 2026 (MAJOR UPDATE: February 3, 2026 — comprehensive implementation session)*
*Reviewed By: Claude Opus 4.5 (3-pass review + 5-agent parallel audit: 2 enterprise, 2 SEO, 1 security)*
*Codebase Snapshot: 4,679 lines App.jsx + 1,196 lines camps.js, 52 organizations, 24 countries*

> **February 3 Implementation Session**: 12 items completed in 5 batched commits. Vite upgraded to 7.3.1 (CVE fixes), honeypot spam protection added, Error Boundary implemented, CSP hardened, ItemList schema completed, Organization @id linking added. Security score improved to 7.8/10, SEO to 6.5/10.

---

## Quick Reference (Start Here)

**Current Health Scores:** Code 7.0 | Arch 6.0 | SEO 6.5 | A11y 7.0 | Security 7.8 | Perf 7.2 | Mobile 8.0 | Docs 7.5

**Next 5 Priority Items (in order):**
| # | Item | Type | Risk | Why Priority |
|---|------|------|------|--------------|
| 1 | **T2-17** | Marquee memory leak fix | Low | Performance, listener accumulation |
| 2 | **T2-32** | Organization logo/contactPoint | Low | SEO - Knowledge Panel enrichment |
| 3 | **T3-19** | Camp card image dimensions | Low | CLS/Core Web Vitals |
| 4 | **T3-34** | Core Web Vitals baseline | Zero | Measurement prerequisite |
| 5 | **T1-14** | Verify Twitter handle | Zero | Social card validation |

**Tier Status Summary (updated Feb 3 post-implementation):**
- **Tier 1**: 15 items (10 done, 5 pending) — zero-risk cleanup
- **Tier 2**: 36 items (26 done, 10 pending) — low-risk improvements
- **Tier 3**: 18 items (10 done/promoted, 8 pending) — medium-risk fixes
- **Tier 4**: 8 items (0 done, 8 pending) — Phase 2 only

**Total: 77 items** (46 done, 31 pending)

**Key Files:** `src/App.jsx` (4,661 lines) | `src/data/camps.js` (1,196 lines) | `public/_headers` | `index.html`

---

## Section 1: Executive Summary

### Review Methodology
Three independent review passes executed per CODE_REVIEW_PLAN.md:
- **Pass 1**: enterprise-code-reviewer agent (accessibility, security, mobile UX, performance, business logic)
- **Pass 2**: seo-performance-optimizer agent (structured data, meta tags, Core Web Vitals, competitor analysis)
- **Pass 3**: Direct Claude analysis (dependencies, assets, dead code, duplication, CSS)

### Overall Health Assessment

This is a well-built, functional production website that is successfully serving real families and growing organically. The monolithic architecture is appropriate for the current traffic level (168 visitors/month). The codebase is readable and maintainable. The primary concerns are accumulated dead weight (unused dependencies, orphaned assets) and some structured data inaccuracies that could affect SEO growth.

### Top 5 Strengths (DO NOT TOUCH)
1. **SEO is working** — 73% organic traffic, ranking #1-5 for target keywords
2. **Mobile UX is solid** — 70% mobile traffic handled well, touch targets correct
3. **Security headers are enterprise-grade** — HSTS, CSP, X-Frame-Options all correct
4. **Filter system works correctly** — Multi-select with proper OR logic, ARIA compliant
5. **GDPR compliance is complete** — Cookie consent gates analytics properly

### Top 5 Concerns (updated Feb 3 — post Tier 1+2+3 partial)
1. ~~**~10.4MB of orphaned image assets**~~ **✅ RESOLVED (Tier 1, Feb 2)**
2. ~~**41 unused shadcn/ui components + 24 unused Radix packages**~~ **✅ RESOLVED (Tier 1, Feb 2)**
3. ~~**Meta tag country counts are wrong**~~ **✅ RESOLVED (Tier 2, Feb 2)**
4. ~~**CSP missing connect-src for GA4**~~ **✅ RESOLVED (Tier 2, Feb 2)**
5. ~~**allCamps array inside component**~~ **✅ RESOLVED (Tier 2, Feb 2 — extracted to camps.js)**

**Current top 5 concerns (Feb 3, 2026 PM — post implementation session):**
1. ~~**🚨 SECURITY: Vite 4.x is EOL with known CVEs**~~ **✅ RESOLVED** — Upgraded to 7.3.1 (T2-33, Feb 3)
2. ~~**🚨 SECURITY: No spam protection on contact form**~~ **✅ RESOLVED** — Honeypot added (T2-34, Feb 3)
3. **Marquee useEffect memory leak** — event listeners accumulate on every navigation → **T2-17** (still pending)
4. ~~**No React Error Boundary**~~ **✅ RESOLVED** — ErrorBoundary.jsx added (T2-18, Feb 3)
5. **Zero test coverage** — no safety net for changes, buyer-readiness concern → **T3-31** (still pending)

*Resolved in Feb 3 PM session (12 items):*
- T2-33 Vite upgrade ✅, T2-34 Honeypot ✅, T2-18 Error Boundary ✅
- T2-20 CSP hardening ✅, T2-28 font-src ✅, T1-15 AVIF cache ✅
- T2-31 ItemList schema ✅, T2-29 Organization @id ✅, T2-23 noscript ✅
- T2-25 GA4 guard ✅, T2-19 Breadcrumb cache ✅, T1-18 npm audit ✅

### Health Scores (updated Feb 3, 2026 — post Implementation Session)

| Dimension | Original (Feb 1) | Previous (Feb 3 AM) | Current (Feb 3 PM) | Notes |
|-----------|-------------------|---------------------|---------------------|-------|
| Code Quality | 5/10 | 6.5/10 | **7.0/10** | +Error Boundary, breadcrumb memoization, GA4 guard |
| Architecture | 5/10 | 6/10 | **6.0/10** | Still monolithic, no tests. ErrorBoundary is a start. |
| SEO | 6.5/10 | 6.0/10 | **6.5/10** | ItemList 7/7 ✅, Organization @id ✅, noscript ✅. Alt text still unaudited. |
| Accessibility | 7/10 | 7/10 | **7.0/10** | No change — focus traps still needed. |
| Security | 7/10 | 7.0/10 | **7.8/10** | Vite 7.3.1 ✅, honeypot ✅, CSP hardened ✅, font-src ✅. Only T2-17 remains. |
| Performance | 6/10 | 7/10 | **7.2/10** | +breadcrumb memoization, +AVIF cache rules |
| Mobile UX | 8/10 | 8/10 | **8.0/10** | No change — already strong |
| Documentation | 6/10 | 7.5/10 | **7.5/10** | This document updated with implementation status |

---

## Section 2: DO NOT TOUCH List

These systems are battle-tested, working in production, and must NOT be modified without explicit user approval:

| System | Location (stable identifier) | Current Lines | Why Protected |
|--------|-------------------------------|----------------|---------------|
| Marquee animation | `initializeMarqueeSystem()` in useEffect + App.css marquee classes | App.jsx ~622-762 | Battle-tested iOS/Android, complex animation timing. Fix the memory leak (new Tier 2) but do NOT restructure. |
| GA4 tracking + UTM system | `buildOutboundUrl()`, `trackOutboundClick()`, `handleBookingClick()` | App.jsx ~75-108 | Revenue-critical, working, drives partner reporting |
| EmailJS contact form | `handleContactFormSubmit()` + EmailJS config | App.jsx ~135-187 | Working cross-platform, tested with real submissions |
| Security headers | `public/_headers` | All lines | Enterprise-grade, audited Sept 2025 + Feb 2026. Add to CSP, don't restructure. |
| Cookie consent system | `handleCookieAccept()`, `handleCookieReject()`, consent useEffect | App.jsx ~533-560, ~818-830 | GDPR compliant, gates GA4 + Vercel Analytics correctly |
| Schema/structured data | index.html JSON-LD blocks | index.html ~76-395 | Currently ranking #1 on Google. Fix errors carefully — number changes only. |
| Scroll navigation | scroll useEffect + `scrollToTop()`, `scrollToLastCamp()` | App.jsx ~597-619 | Tested iOS + desktop, Jan 2026, dead zones working. Fix listener churn (new Tier 3) without changing behavior. |
| Filter useMemo logic | `filteredCamps` useMemo | App.jsx ~290-324 | Working correctly with multi-select OR logic |
| robots.txt | `public/robots.txt` | All lines | Strategic config driving AI referral traffic (5 chatgpt.com visitors) |
| Image optimization pipeline | AVIF/WebP/PNG `<picture>` elements | App.jsx ~940-960 | 93-96% reduction, working across all browsers |

**NEW — Added Feb 3 from 5-agent audit:**

| System | Location | Why Protected |
|--------|----------|---------------|
| `src/data/camps.js` data structure | Field names, types, required properties | Changing field names breaks all App.jsx references |
| `index.html` `<title>` and `<meta description>` | Lines 8, 10 | Driving #1 Google ranking — change with extreme care |
| `package.json` scripts section | build, dev, lint commands | All documentation references these exact commands |

---

## Section 3: Findings by Risk Tier

### Tier 1 — ZERO RISK (cleanup, no logic changes)

These can be done immediately with zero chance of breaking functionality.

#### T1-1: Remove orphaned image assets from src/assets/

| File | Size | Evidence Not Used |
|------|------|-------------------|
| european-summer-camps-hero.png | ~3.0MB | Only .webp version imported in App.jsx |
| european-summer-camps-map.png | ~2.5MB | Only .webp version imported in App.jsx |
| european-camp-activities-collage.png | ~1.9MB | Only .webp version imported in App.jsx |
| react.svg | ~4KB | Vite template default, never imported |
| camps-map.avif | ~68KB | Not imported (webp version used instead) |
| camps-map.webp | ~68KB | Verify — may be duplicate of map import |

**Space recoverable**: ~7.5MB from src/assets/
**Test**: `npm run build` — if it builds, files weren't imported
**Commit**: `Cleanup: Remove orphaned image assets (~7.5MB) from src/assets`

#### T1-2: Remove orphaned hero image from public/

| File | Size | Evidence Not Used |
|------|------|-------------------|
| european-summer-camps-hero.png | ~3.0MB | Not referenced in any HTML/JSX/XML file |

**Space recoverable**: ~3.0MB
**Note**: Verify og:image in index.html — if it references this file, it's NOT orphaned
**Test**: `npm run build` + check og:image meta tag
**Commit**: `Cleanup: Remove orphaned hero PNG from public/ (~3MB)`

#### T1-3: Remove unused shadcn/ui component files

41 of 46 shadcn/ui components were never imported. Only these 5 are used:
- `button.jsx` (App.jsx)
- `card.jsx` (App.jsx)
- `badge.jsx` (App.jsx)
- `breadcrumb.jsx` (App.jsx)
- `drawer.jsx` (App.jsx)

**Unused components to delete** (all in src/components/ui/):
accordion, alert, alert-dialog, aspect-ratio, avatar, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip

**Updated Feb 2**: Original review said 41 unused of 46. The toggle files were already in the 46 count — the original list just didn't name them explicitly. Actual: 46 total, 41 unused, 5 kept.

**Space recoverable**: Minimal disk space, but reduces cognitive overhead and file count
**Test**: `npm run build` — must pass
**Commit**: `Cleanup: Remove 41 unused shadcn/ui components (only 5 used)`
**Status**: ✅ DONE (Feb 2, 2026) — 42 files deleted (41 components + use-mobile.js hook), 4,234 lines removed

#### T1-4: Uninstall unused npm packages

**Packages used only by unused shadcn/ui components:**
- `recharts` (only in chart.jsx — unused)
- `sonner` (only in sonner.jsx — unused)
- `date-fns` (only in calendar.jsx — unused)
- `react-day-picker` (only in calendar.jsx — unused)
- `cmdk` (only in command.jsx — unused)

**Unused Radix packages** (24 packages — `@radix-ui/react-slot` needed by button.jsx, `vaul` by drawer.jsx, and `@radix-ui/react-dialog` needed internally by vaul):
`@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-label`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toast`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`, `@radix-ui/react-tooltip`

**Also unused**: `gtag` (GA4 is inline in App.jsx, npm package never imported)

**Updated Feb 2**: `@radix-ui/react-dialog` REMOVED from uninstall list (vaul depends on it internally). Added `gtag`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`. Net: 30 packages.

**Command**: `npm uninstall recharts sonner date-fns react-day-picker cmdk gtag @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip`

**Keep**: `@radix-ui/react-slot` (used by button.jsx), `@radix-ui/react-dialog` (required by vaul), `vaul` (used by drawer.jsx)
**Test**: `npm run build` — must pass
**Commit**: `Cleanup: Uninstall 30 unused npm packages (shadcn/ui deps + Radix + gtag)`

#### T1-5: Remove dead CSS classes from App.css

| Class | Defined In | Used In App.jsx | Verdict |
|-------|-----------|-----------------|---------|
| `.ios-scroll-fix` | App.css | Not found | DEAD — remove |
| `.smooth-scroll` | App.css | Not found | DEAD — remove |
| `.safe-area-content` | App.css | Not found | DEAD — remove |
| `.camp-price-label` | App.css | Not found | DEAD — remove |

**Test**: `npm run build` + visual check on dev server
**Commit**: `Cleanup: Remove 4 unused CSS classes from App.css`

#### T1-6: Remove dead state variable

| Variable | Line | Evidence |
|----------|------|----------|
| `_showFilters` | ~116 | Prefixed with underscore, not used in JSX or effects |

**Test**: `npm run build`
**Commit**: `Cleanup: Remove unused _showFilters state variable`

#### T1-7: Remove duplicate preconnect/DNS-prefetch tags in index.html

**Problem**: index.html has duplicate `preconnect` to `fonts.googleapis.com` (lines ~76 and ~414) and duplicate DNS-prefetch entries (lines ~79-81 and ~417-419). Browsers handle duplicates gracefully but it's unnecessary HTML bloat.

**Fix**: Remove the second set of duplicates.

**Files**: index.html
**Test**: `npm run build` + verify page loads correctly
**Commit**: `Cleanup: Remove duplicate preconnect/DNS-prefetch tags`

#### T1-8: Remove unused/junk meta tags from index.html

**Problem**: Lines ~56-73 and ~66-73 of index.html contain non-standard meta tags that no search engine uses: `content-type`, `target-audience`, `content-rating`, `content-category`, `rating`, `distribution`, `revisit-after`, `language`, `geo.region`, `geo.placename`, `target`, `audience`. These add ~500 bytes of HTML bloat and reveal keyword strategy to competitors (meta keywords tag).

**Fix**: Remove all non-functional meta tags. Keep standard ones (viewport, description, robots, OG, Twitter).

**Files**: index.html
**Test**: `npm run build` + verify page renders correctly
**Commit**: `Cleanup: Remove unused meta tags from index.html`

#### T1-9: Remove duplicate "Budget Excellence" from footer ✅ COMPLETE (Feb 3, 2026)

**Problem**: Footer "Camp Categories" list has "Budget Excellence" twice (lines 3698-3705 AND 3716-3724). Both call `handleCategoryFilter('budget_excellence')`. Visible duplicate affecting professionalism.

**Fix applied**: Deleted lines 3723-3731 (the second occurrence).
**Commit**: `6b38a4e` — Code Review Batch 2

#### T1-10: Fix missed hyperbolic comment at line 217 ✅ COMPLETE (Feb 3, 2026)

**Problem**: Line 217 still reads `// Enterprise Marquee System - State of the Art`. Item #32 (T3-8) was supposed to fix all hyperbolic comments but missed this one.

**Fix applied**: Changed to `// Marquee overflow animation system`
**Commit**: `6b38a4e` — Code Review Batch 2

#### ~~T1-11: Complete ItemList schema~~ — **MOVED TO T2-31**

*Promoted to Tier 2 per Feb 3 enterprise audit — malformed JSON-LD can break all schema. See T2-31 for full definition.*

#### T1-12: Remove useless robots.txt hash Allow lines (NEW — 5-agent Feb 3 audit)

**Problem**: Lines 83-87 contain `Allow: /#discover`, `Allow: /#compare`, etc. Crawlers strip hash fragments — these do nothing. Just reveals site structure.

**Fix**: Remove lines 83-87 entirely.
**Files**: public/robots.txt
**Test**: Validate robots.txt syntax
**Commit**: `Cleanup: Remove useless hash fragment Allow lines from robots.txt`

#### T1-13: Update robots.txt "Last updated" comment (NEW — 5-agent Feb 3 audit)

**Problem**: Line 104 says `# Last updated: 2025-08-29` — over 5 months stale.

**Fix**: Update to current date.
**Files**: public/robots.txt (line 104)
**Test**: None needed
**Commit**: `Docs: Update robots.txt last-updated date`

#### T1-14: Verify @CampExplorerEU Twitter handle exists (NEW — 5-agent Feb 3 audit)

**Problem**: `twitter:site` meta tag references `@CampExplorerEU`. If handle doesn't exist or isn't controlled, Twitter Card rendering may be suppressed.

**Fix**: Verify handle exists on X/Twitter. If not, remove the `twitter:site` meta tag.
**Files**: index.html (twitter:site meta tag)
**Test**: Check Twitter Card validator
**Commit**: `SEO: Remove invalid twitter:site handle` (if handle doesn't exist)

#### T1-15: Add AVIF cache rule to _headers (NEW — 5-agent Feb 3 audit)

**Problem**: `.avif` files not covered by caching rules — only `.png`, `.jpg`, `.webp` are listed.

**Fix**: Add `/*.avif` with same `Cache-Control: public, max-age=31536000, immutable`
**Files**: public/_headers
**Test**: `npm run build` + verify AVIF files served with correct headers
**Commit**: `Perf: Add AVIF files to immutable cache rules`

#### T1-16: Change X-XSS-Protection from 1 to 0 (MOVED from T2-22)

**Problem**: `X-XSS-Protection: 1; mode=block` is deprecated. Modern browsers removed XSS Auditor; this can introduce vulnerabilities.

**Fix**: Change to `X-XSS-Protection: 0`
**Files**: public/_headers (line 54)
**Test**: `npm run build`
**Commit**: `Security: Set X-XSS-Protection to 0 (deprecated auditor)`

#### T1-17: Add security.txt file (NEW — Feb 3 second audit)

**Problem**: No `/.well-known/security.txt` file exists. Modern security best practice includes this file with contact information for security researchers to report vulnerabilities.

**Fix**: Create `public/.well-known/security.txt` with:
- Contact email (partnerships@europeansummercamps.com)
- Preferred language (en)
- Optional: Expires date, policy URL
**Files**: public/.well-known/security.txt (new)
**Test**: After deploy, verify https://www.europeansummercamps.com/.well-known/security.txt loads
**Commit**: `Security: Add security.txt for vulnerability reporting`

#### T1-18: Run npm audit and document findings (NEW — Feb 3 second audit)

**Problem**: No `npm audit` has been run and documented. Unknown vulnerability status.

**Fix**: Run `npm audit`, document findings, fix any HIGH/CRITICAL issues.
**Files**: N/A (command only)
**Test**: `npm audit` output should show 0 high/critical vulnerabilities
**Commit**: `Docs: npm audit run — document findings`

---

### Tier 2 — LOW RISK (isolated extractions, no logic changes)

#### T2-1: Move allCamps array outside component function

**Problem**: `const allCamps = [...]` (~1,200 lines) is defined inside the App component function. This means the entire array is re-created on every render, defeating useMemo that depends on it.

**Fix**: Move `allCamps` above the `function App()` declaration. It's static data with no dependency on component state.

**Files**: src/App.jsx
**Test**: `npm run build` + verify all camps display, search works, filters work
**Commit**: `Perf: Move allCamps array outside component (eliminates re-creation on render)`
**Rollback**: `git revert <hash>`

#### T2-2: Extract allCamps to separate data file

**Problem**: ~1,200 lines of static camp data in App.jsx makes the file harder to navigate.

**Fix**: Create `src/data/camps.js` exporting `allCamps`. Import in App.jsx.

**Depends on**: T2-1 (move outside component first)
**Files**: src/App.jsx (remove data, add import), src/data/camps.js (new file)
**Test**: `npm run build` + verify all camps display correctly
**Commit**: `Refactor: Extract camp data to src/data/camps.js (~1,200 lines)`

#### T2-3: Add maxLength to search inputs

**Problem**: Search inputs (lines ~2214-2222 and ~2743-2751) have no maxLength, allowing extremely long input strings.

**Fix**: Add `maxLength={200}` to both search input elements.

**Files**: src/App.jsx (2 locations)
**Test**: `npm run build` + verify search still works with normal queries
**Commit**: `Security: Add maxLength to search inputs`

#### T2-4: Add rel="noopener noreferrer" to window.open calls

**Problem**: 4 `window.open()` calls missing `noopener` — minor security concern.

**Locations**: Lines ~109, ~2527, ~3064, ~3244 in App.jsx
**Fix**: Change `window.open(url, '_blank')` to `window.open(url, '_blank', 'noopener,noreferrer')`

**Files**: src/App.jsx (4 locations)
**Test**: `npm run build` + verify external links still open correctly
**Commit**: `Security: Add noopener to all window.open calls`

#### T2-5: Improve LCP for hero image

**Problem**: The hero image (Largest Contentful Paint element) is loaded via React's `<picture>` element which only exists after JavaScript executes. The browser cannot discover the LCP image until React renders, adding 200-500ms to LCP.

**Caveat**: A simple `<link rel="preload">` in index.html won't work because Vite hashes asset filenames at build time (e.g., `hero-lakeside-BxK3mN2.webp`). A static preload tag would not match the hashed output.

**Fix (Option A — simple, recommended)**: Add `fetchpriority="high"` to the `<img>` inside the `<picture>` element in App.jsx. This tells the browser to prioritize the image once React renders. Partial improvement but zero-risk.

**Fix (Option B — full solution)**: Use a Vite plugin (e.g., `vite-plugin-html`) to inject the preload tag at build time with the correct hashed filename. More complex but eliminates the JS-rendering delay entirely.

**Files**: src/App.jsx (Option A) or vite.config.js + index.html (Option B)
**Test**: `npm run build` + Lighthouse LCP measurement before/after
**Commit**: `Perf: Add fetchpriority=high to LCP hero image`

#### T2-7: Replace hardcoded organization counts with dynamic `allCamps.length`

**Problem**: The number "52" is hardcoded in **7 locations** across App.jsx. Every time camps are added or removed, these must all be found and updated manually — and they've been missed repeatedly (e.g., "23+" survived from launch until February 2026).

**Hardcoded locations (all in src/App.jsx):**
1. **Line ~1580**: Hero stats `value: "52"` (Organizations badge)
2. **Line ~2134**: Marquee text `"52 Verified Organizations"`
3. **Line ~3471**: Badge text `"52 Verified Organizations"`
4. **Line ~3937**: Guide CTA `"52 verified camp organizations"` (was "23+" until Feb 2026)
5. **Line ~4594**: Schema/SEO `"52 verified organizations"`
6. **Line ~5026**: Footer `"52 verified organizations"`
7. **Line ~5267**: FAQ answer `"52 verified organizations"`

**Also hardcoded outside App.jsx:**
8. **public/sitemap.xml**: Image caption (currently says "42" — see T2-11)

**Fix**: After T2-1 (move allCamps outside component), create `const CAMP_COUNT = allCamps.length` and use it in all 7 App.jsx locations via template literals or JSX expressions. Sitemap.xml must remain hardcoded (static file) but add a comment noting it needs manual update.

**Depends on**: T2-1 (allCamps must be module-level to reference `.length` at top level)
**Files**: src/App.jsx (7 locations), public/sitemap.xml (add reminder comment)
**Test**: `npm run build` + verify all 7 locations display correct count + add/remove a test camp to confirm count updates automatically
**Commit**: `DX: Replace 7 hardcoded org counts with dynamic allCamps.length`

#### T2-8: Extract marquee useEffect to custom hook

**Problem**: Marquee animation useEffect (~lines 1792-1932) is 140 lines with inline debounce utility, retry logic, IntersectionObserver, and platform detection. This is the single largest useEffect in the component.

**Fix**: Extract to `src/hooks/useMarqueeAnimation.js` custom hook.

**Files**: src/App.jsx (~lines 1792-1932) → new src/hooks/useMarqueeAnimation.js
**Test**: `npm run build` + verify marquee works on mobile and desktop
**Commit**: `Refactor: Extract marquee animation to useMarqueeAnimation hook`

#### T2-9: Wrap filterOptions in useMemo

**Problem**: `filterOptions` (~line 1516) filters allCamps 7 times per render without memoization.

**Fix**: Wrap in `useMemo` with `[allCamps]` dependency (or no deps if allCamps is module-level after T2-1).

**Files**: src/App.jsx (~line 1516)
**Test**: `npm run build` + verify category counts display correctly
**Commit**: `Perf: Memoize filterOptions category counts`

#### T2-10: Fix ItemList numberOfItems schema value

*Promoted from Tier 3 — changing a string to integer in JSON-LD is zero-risk.*

**Problem**: In index.html structured data, `numberOfItems` is set to string `"100+"` — schema.org requires an integer.

**Fix**: Change to integer `100` (or actual count of items in the list)

**Files**: index.html
**Test**: Google Rich Results Test after deployment
**Commit**: `SEO: Fix ItemList numberOfItems to integer (was string "100+")`

#### T2-11: Fix stale sitemap.xml caption

*Promoted from Tier 3 — updating text in static XML is zero-risk.*

**Problem**: sitemap.xml image caption says "42 organizations, 23 countries" — should be "52 organizations, 24 countries"

**Fix**: Update text in sitemap.xml

**Files**: public/sitemap.xml
**Test**: Validate sitemap at /sitemap.xml after deployment
**Commit**: `SEO: Update sitemap caption to current counts (52 orgs, 24 countries)`

#### T2-12: Fix HTTP booking URL for Camp Bjontegaard

*Promoted from Tier 3 — one-character change in a data field.*

**Problem**: Camp ID 15 (Camp Bjontegaard) has `bookingUrl: "http://sommerleir.no/"` — the only HTTP URL in the dataset.

**Fix**: Change to `"https://sommerleir.no/"` (verify HTTPS works first).

**Files**: src/App.jsx (~line 539)
**Test**: `npm run build` + verify HTTPS link works
**Commit**: `Fix: Change Camp Bjontegaard URL from HTTP to HTTPS`

#### T2-13: Remove `Crawl-delay: 1` from robots.txt

*Promoted from Tier 3 — Google ignores it, Bing is throttled by it.*

**Problem**: `Crawl-delay: 1` tells bots to wait 1 second between requests. For a 1-page site, this throttles Bing (9% of traffic) unnecessarily.

**Fix**: Remove the `Crawl-delay: 1` line from robots.txt.

**Files**: public/robots.txt (~line 105)
**Test**: Verify robots.txt is valid after change
**Commit**: `SEO: Remove Crawl-delay from robots.txt (unnecessary for small site)`

#### T2-14: Update sitemap lastmod date

*Promoted from Tier 3 — changing a date is zero-risk.*

**Problem**: sitemap.xml `lastmod` is `2026-01-25` but content has changed multiple times since.

**Fix**: Update to current date whenever content changes. Add to commit checklist as a reminder.

**Files**: public/sitemap.xml (~line 6)
**Test**: Validate sitemap XML
**Commit**: `SEO: Update sitemap lastmod to current date`

#### T2-15: Update CODE_STRUCTURE.md with accurate line numbers

*Promoted from Tier 3 — documentation-only, zero code risk.*

**Problem**: Every line number reference in CODE_STRUCTURE.md is wrong by 100-400+ lines. Camp counts stale.

**Fix**: Update all references to match current App.jsx.

**Files**: CODE_STRUCTURE.md
**Test**: Spot-check 5 line references against actual App.jsx
**Commit**: `Docs: Update CODE_STRUCTURE.md to match current codebase`

#### T2-16: Remove `user-scalable=no` from viewport meta (PROMOTED from Tier 3 — Feb 3 audit)

**Problem**: `user-scalable=no` in index.html line 5 prevents pinch-to-zoom. WCAG 1.4.4 violation. Lighthouse flags it. Site claims "WCAG 2.1 AA COMPLIANT" but this directly contradicts that claim.

**Fix**: Remove `user-scalable=no` from the viewport meta content attribute. Keep `viewport-fit=cover`.
**Files**: index.html (line 5)
**Test**: `npm run build` + verify pinch-to-zoom works on mobile, no layout shifts
**Commit**: `A11y: Remove user-scalable=no to allow pinch-to-zoom`

#### T2-17: Fix marquee useEffect memory leak (NEW — Feb 3 audit)

**Problem**: `initializeMarqueeSystem()` (line 623) calls `tryInitialize()` via `setTimeout` (line 741), which calls `initWithDelay()` (line 625). `initWithDelay()` returns a cleanup function (line 717-722) that removes 4 event listeners. But `tryInitialize()` never captures this return value, and `initializeMarqueeSystem()` returns `undefined`. So line 759 `const cleanup = initializeMarqueeSystem()` assigns `undefined` to cleanup — the useEffect has no cleanup. Every home→away→home navigation adds 4 more event listeners (resize, visibilitychange, IntersectionObserver, motionMediaQuery change) without removing the old ones.

**Fix**: Restructure so `tryInitialize` captures and stores the cleanup from `initWithDelay()`, and `initializeMarqueeSystem()` returns a function that calls the stored cleanup. Minimal changes — don't refactor the marquee logic itself (DO NOT TOUCH).
**Files**: src/App.jsx (lines 623-762)
**Test**: `npm run build` + verify marquee works on mobile + navigate home→discover→home multiple times, check no listener accumulation in DevTools
**Commit**: `Fix: Marquee useEffect memory leak — capture and return cleanup function`

#### T2-18: Add React Error Boundary (NEW — Feb 3 audit)

**Problem**: Zero error boundaries. A single runtime error in any camp card, filter, or section crashes the entire page with a white screen. Camp data is manually maintained — a typo like `activities: null` instead of `activities: []` would crash the site.

**Fix**: Create `src/components/ErrorBoundary.jsx` (class component — React requires class for error boundaries). Wrap main content in App.jsx. Show a user-friendly "Something went wrong" message with a reload button.
**Files**: src/components/ErrorBoundary.jsx (new), src/App.jsx (wrap content)
**Test**: `npm run build` + temporarily break one camp entry to verify error boundary catches it
**Commit**: `Safety: Add React Error Boundary to prevent white-screen crashes`

#### T2-19: Cache `generateBreadcrumbs()` result (NEW — Feb 3 audit)

**Problem**: `generateBreadcrumbs()` called twice per render — once for `.map()` at line 906, again inside the callback at line 923 for `.length`. Creates two separate array allocations.

**Fix**: Store result in a variable before the JSX: `const breadcrumbs = generateBreadcrumbs()`. Use `breadcrumbs.map(...)` and `breadcrumbs.length`.
**Files**: src/App.jsx (lines 906, 923)
**Test**: `npm run build` + verify breadcrumbs display correctly
**Commit**: `Perf: Cache generateBreadcrumbs() result (was called twice per render)`

#### T2-20: CSP hardening — add missing directives (NEW — Feb 3 audit)

**Problem**: CSP at `_headers` line 57 is missing `object-src`, `base-uri`, and `form-action` directives. These are standard hardening recommendations.

**Fix**: Append to CSP: `; object-src 'none'; base-uri 'self'; form-action 'self' https://api.emailjs.com`
**Files**: public/_headers (line 57)
**Test**: Deploy + check browser console for CSP violations + verify contact form still submits
**Commit**: `Security: Add object-src, base-uri, form-action to CSP`

#### T2-21: Add Permissions-Policy header (NEW — Feb 3 audit)

**Problem**: No `Permissions-Policy` header restricting browser features (camera, microphone, geolocation, payment).

**Fix**: Add `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` to `_headers` after line 57.
**Files**: public/_headers
**Test**: `npm run build` + verify site loads normally
**Commit**: `Security: Add Permissions-Policy header`

#### ~~T2-22: Replace deprecated X-XSS-Protection header~~ **DUPLICATE — See T1-16**

*This item was a duplicate of T1-16. Consolidated to Tier 1 as zero-risk header change.*

#### T2-23: Add `<noscript>` fallback content (NEW — Feb 3 audit)

**Problem**: If JavaScript fails to load, users and crawlers see empty `<div id="root"></div>`. A basic `<noscript>` block provides a safety net for JS rendering failures (relevant for Googlebot edge cases).

**Fix**: Add `<noscript>` inside `<body>` with site name, description, and note to enable JavaScript. Keep it brief (~5 lines).
**Files**: index.html
**Test**: `npm run build` + disable JS in browser to verify fallback shows
**Commit**: `SEO: Add noscript fallback content for JS rendering failures`

#### T2-24: Fix privacy policy inconsistency ✅ COMPLETE (Feb 3, 2026)

**Problem**: App.jsx line 3400 said "We never collect: Personal information, email addresses" but contact form collects name and email.

**Fix applied**: Restructured "Data We Collect" section with clear categories:
- Automatic Data (analytics, technical info, cookie prefs)
- Information You Provide (contact form details)
- Closing: "We do not sell your personal information"

Removed unnecessary "What We Don't Collect" section (mentioning passwords/payments was fear-triggering for concepts users weren't thinking about).

**Commits**: `532f01d` + `0e8140a`

#### T2-25: Guard GA4 initialization against multiple fires (NEW — 5-agent Feb 3 audit)

**Problem**: useEffect at line 580 can run multiple times if cookieConsent changes. Each run appends another `<script>` tag and pushes duplicate events, inflating analytics.

**Fix**: Add guard: `if (window.gtag) return;` before calling `initializeGA4()`.
**Files**: src/App.jsx (~line 580)
**Test**: `npm run build` + toggle consent, verify only one script tag in DOM
**Commit**: `Fix: Guard GA4 initialization against duplicate calls`

#### T2-26: Align sitemap image URL with og:image format (NEW — 5-agent Feb 3 audit)

**Problem**: sitemap.xml line 10 points to `.webp`, og:image points to `.png`. Inconsistent image signals.

**Fix**: Update sitemap to point to the same `.png` file as og:image (PNG is more compatible).
**Files**: public/sitemap.xml (line 10)
**Test**: Validate sitemap XML
**Commit**: `SEO: Align sitemap image URL with og:image (both PNG)`
**⬇️ TIER DOWNGRADE POSSIBLE**: Per Feb 3 second audit, this is zero-risk (changing one URL in a static file) — could be Tier 1.

#### T2-27: Fix Guide section stale prices (NEW — 5-agent Feb 3 audit)

**Problem**: Guide section shows "Les Elfes CHF 4,990" (line 2720) but actual is CHF 4,550. "Oxford Summer Courses GBP 6,220" (line 2748) but actual is GBP 6,995.

**Fix**: Update hardcoded prices to match camps.js data.
**Files**: src/App.jsx (lines ~2720, ~2748)
**Test**: `npm run build` + verify Guide prices match camp cards
**Commit**: `Fix: Update stale prices in Guide section`

#### T2-28: Add CSP font-src directive (NEW — 5-agent Feb 3 audit)

**Problem**: CSP has no `font-src` directive. Falls back to `default-src 'self'` which may block Google Fonts.

**Fix**: Add `font-src 'self' https://fonts.gstatic.com` to CSP.
**Files**: public/_headers (line 57)
**Test**: Deploy + check browser console for CSP violations + verify fonts load
**Commit**: `Security: Add font-src directive to CSP for Google Fonts`

#### T2-29: Add Organization schema @id linking (NEW — Feb 3 second audit)

**Problem**: Two Organization schema blocks exist in index.html (lines 79-97 as WebSite author/publisher, and lines 242-264 as standalone). Neither has @id — Google may treat them as separate entities.

**Fix**: Add `"@id": "https://www.europeansummercamps.com/#organization"` to the standalone Organization block. Reference this @id in the WebSite author/publisher properties.
**Files**: index.html (lines 79-97 and 242-264)
**Test**: Google Rich Results Test after deployment
**Commit**: `SEO: Add @id linking between Organization schema blocks`

#### T2-30: Add CSP report-uri directive (NEW — Feb 3 second audit)

**Problem**: CSP has no reporting endpoint. CSP violations go unnoticed — XSS attempts, mixed content, and third-party injection attempts are invisible.

**Fix**: Add `report-uri https://your-report-endpoint` or use `Report-To` header with a free service like report-uri.com.
**Files**: public/_headers (line 57)
**Test**: Deploy + trigger intentional CSP violation + verify report received
**Commit**: `Security: Add CSP report-uri for violation monitoring`
**Note**: Optional but recommended for production monitoring.

#### T2-31: Complete ItemList schema — add 3 missing categories (MOVED from T1-11)

**Problem**: The ItemList in index.html (lines 111-140) only includes 4 of 7 categories: Premium Alpine, Academic & STEM, Language Immersion, Sports Specialty. Missing: Family Programs, Budget Excellence, Unique Experiences. The `numberOfItems: 100` suggests comprehensive coverage but the list is incomplete.

**Fix**: Add 3 ListItem entries for the missing categories after position 4.
**Files**: index.html (lines 111-140)
**Test**: `npm run build` + Google Rich Results Test
**Commit**: `SEO: Complete ItemList schema with all 7 categories`
**Note**: Promoted from Tier 1 — malformed JSON-LD can break all schema.

#### T2-32: Add Organization logo/contactPoint/sameAs (MOVED from T3-25)

**Problem**: Standalone Organization schema lacks `logo`, `contactPoint`, `sameAs` properties recommended for Knowledge Panel.

**Fix**: Add logo (favicon.svg or logo URL), contactPoint (email), sameAs (social profiles if they exist).
**Files**: index.html (lines ~242-265)
**Test**: Google Rich Results Test
**Commit**: `SEO: Enrich Organization schema with logo/contactPoint`
**Note**: Promoted from Tier 3 — adding schema properties is low-risk.

#### T2-33: Upgrade Vite 4.x to 6.x (PROMOTED from T3-22 — Feb 3 meta-audit) 🚨 SECURITY

**Problem**: Vite 4.4.5 in package.json is EOL with known CVEs: CVE-2024-45812 (server.fs.deny bypass), CVE-2024-45811 (XSS in dev server). These primarily affect dev server but upgrading is strongly recommended.

**Fix**: `npm install vite@latest` and test thoroughly. Check vite.config.js for breaking changes.
**Files**: package.json, vite.config.js (may need updates)
**Test**: `npm run build` + `npm run dev` + thorough manual testing
**Commit**: `Security: Upgrade Vite from 4.x to 6.x (EOL with CVEs)`
**PRIORITY**: HIGH — security vulnerability. All 3 review agents (enterprise, SEO, security) unanimously recommended promotion.
**Note**: Promoted from Tier 3 (was T3-22) — known CVEs warrant immediate action despite "primarily dev server" impact.

#### T2-34: Add honeypot spam protection to contact form (PROMOTED from T3-23 — Feb 3 meta-audit) 🛡️

**Problem**: Contact form has no spam protection. EmailJS credentials are in source — bots could send spam via your EmailJS account, potentially exhausting quota or causing account suspension.

**Fix**: Add a honeypot field (hidden input that bots fill but humans don't see). Zero-risk implementation.
```jsx
// In form JSX:
<input type="text" name="website" className="hidden" tabIndex="-1" autoComplete="off" />

// In submit handler:
if (e.target.website.value) return; // Bot detected
```
**Files**: src/App.jsx (contact form ~line 4346)
**Test**: `npm run build` + verify form still works for humans + test with filled honeypot
**Commit**: `Security: Add honeypot spam protection to contact form`
**PRIORITY**: HIGH — zero-risk implementation with high value. All review agents recommended promotion.
**Note**: Promoted from Tier 3 (was T3-23) — honeypot is simpler than CAPTCHA, requires no external service.

**Also recommended (not checklist item):** Verify EmailJS dashboard has domain restrictions set to `europeansummercamps.com` and reasonable monthly quota limits.

---

### Tier 3 — MEDIUM RISK (logic-touching, careful testing required)

#### T3-1: Fix CSP connect-src for Google Analytics

**Problem**: `public/_headers` Content-Security-Policy is missing `connect-src` directive for `google-analytics.com` and `googletagmanager.com`. Strict browsers may block GA4 data collection, causing incomplete analytics.

**Fix**: Append to existing CSP `connect-src`: `https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com`

**Files**: public/_headers (line ~57)
**Test**: Deploy, check browser console for CSP violations, verify GA4 receives events
**Commit**: `Security: Add GA4 domains to CSP connect-src directive`

#### T3-2: Fix meta tag country counts in index.html

**Problem**: 4 locations reference wrong country counts:
- Line ~10: `<meta name="description">` says "21 countries"
- Line ~34: `og:description` says "13 countries"
- Line ~46: `twitter:description` says "13 countries"
- Line ~253: Organization JSON-LD `description` says "21 countries"

**Fix**: Update all 4 to "24 countries". Change the number only — do NOT reword the surrounding text (SEO-sensitive).

**Files**: index.html (4 locations)
**Test**: `npm run build` + inspect meta tags in built output
**Caution**: The `<meta name="description">` directly generates Google search snippets. Change number only, preserve sentence structure.
**Commit**: `SEO: Fix country count in meta tags (was 21/13, now 24)`

#### T3-3: Fix footer "Local & Municipal Gems" linking to nonexistent category

**Problem**: Footer link at ~line 4882 calls `handleCategoryFilter('local')`, but no camp has `category: 'local'`. Clicking shows 0 results.

**Fix**: Either remove the link, or change it to link to an existing category (e.g., `'budget_excellence'`).

**Files**: src/App.jsx (~line 4882)
**Test**: `npm run build` + click the footer link, verify results appear
**Commit**: `Fix: Remove broken "Local" category link from footer`

#### T3-4: Fix "Book Now" text in Compare section

**Problem**: Compare section button says "Book Now" (~line 3229) but the site is explicitly "NOT a booking agent" per Terms/Impressum. Home/Discover correctly say "View Details & Book".

**Fix**: Change button text to "View Details & Book" to match other sections.

**Files**: src/App.jsx (~line 3229)
**Test**: `npm run build` + check Compare section button text
**Commit**: `Fix: Change Compare "Book Now" to "View Details & Book" for consistency`

#### T3-5: Fix two camps with null established year

**Problem**: Camp IDs 24 (~line 672) and 26 (~line 717) have `established: null`, causing "Est. " with no year to render at lines ~2497 and ~3035.

**Fix**: Add conditional: `{camp.established && <span>Est. {camp.established}</span>}` in both card rendering locations.

**Files**: src/App.jsx (camp data + 2 card rendering locations)
**Test**: `npm run build` + verify camp cards for IDs 24, 26 no longer show "Est."
**Commit**: `Fix: Handle null established year in camp cards`

#### T3-6: Fix badge CSS inconsistency between Home and Discover sections

**Problem**: Home section uses `className="badge-responsive"` (~line 2460) for "2026 Open" badge, Discover uses `className="text-xs"` (~line 2999). Discover badges may be too small on mobile.

**Fix**: Change Discover section to use `badge-responsive` to match Home section.

**Files**: src/App.jsx (~line 2999)
**Test**: `npm run build` + compare badge sizes on mobile between Home and Discover
**Commit**: `Fix: Use consistent badge-responsive class in Discover section`

#### ~~T3-7: Remove `user-scalable=no` from viewport meta~~ — **PROMOTED TO TIER 2** (T2-16, Feb 3 audit)

WCAG 1.4.4 violation on a site claiming AA compliance. One-line fix. See T2-16 above.

#### T3-8: Remove hyperbolic code comments

**Problem**: Comments like "ENTERPRISE MARQUEE INTELLIGENCE SYSTEM - STATE OF THE ART" and "Bleeding-edge performance optimization" undermine credibility with buyers/maintainers.

**Fix**: Replace with factual descriptions:
- "ENTERPRISE MARQUEE INTELLIGENCE SYSTEM" → "Marquee overflow detection and animation"
- "Bleeding-edge performance optimization" → "Memoized filter computation"

**Files**: src/App.jsx (lines ~1479, ~1791, and others)
**Test**: `npm run build`
**Commit**: `Cleanup: Replace hyperbolic comments with factual descriptions`

#### T3-9: Add numeric price field to camp data

**Problem**: Price strings are in inconsistent formats (`"From CHF 4,550/1 week"`, `"EUR335/10 days"`, etc.). Cannot sort by price or filter by range programmatically.

**Fix**: Add `priceNumericEUR: 4550` alongside display price string for each camp. Requires currency conversion research for all 52 camps.

**Files**: src/App.jsx (camp data) or src/data/camps.js (after T2-2 extraction)
**Test**: `npm run build` + verify no display changes (field is data-only initially)
**Commit**: `Data: Add machine-readable EUR price field to all camps`

#### T3-10: Remove `meta keywords` tag

**Problem**: Google has ignored `<meta name="keywords">` since 2009. It only reveals keyword strategy to competitors.

**Files**: index.html (line ~11)
**Test**: `npm run build`
**Commit**: `SEO: Remove meta keywords tag (ignored by Google, reveals strategy)`

#### T3-11: Add `og:image:type` meta tag

**Problem**: Missing `og:image:type` tag. Helps platforms process the og:image correctly.

**Fix**: Add `<meta property="og:image:type" content="image/png" />` after existing og:image tags.

**Files**: index.html
**Test**: `npm run build`
**Commit**: `SEO: Add og:image:type meta tag for social sharing`

#### T3-12: Remove unnecessary hreflang tags

**Problem**: Site has `hreflang="en"` and `x-default` both pointing to the same URL. For a monolingual English site with no alternate language versions, these add no value.

**Files**: index.html (lines ~73-74)
**Test**: `npm run build`
**Commit**: `Cleanup: Remove unnecessary hreflang tags (monolingual site)`

#### T3-13: Remove or fix non-functional BreadcrumbList/SearchAction schema

**Problem**: BreadcrumbList and SearchAction schemas use hash fragment URLs (e.g., `/#discover?search={search_term}`). Google ignores hash fragments, making these non-functional. Non-functional schema could be flagged as misleading.

**Fix**: Remove both schema blocks entirely until Phase 2 provides real routes. (Alternatively, keep SearchAction but acknowledge it won't generate rich results until Phase 2.)

**Files**: index.html (JSON-LD blocks)
**Test**: Google Rich Results Test after deployment
**Caution**: Removing structured data is always lower risk than keeping incorrect data.
**Commit**: `SEO: Remove non-functional BreadcrumbList/SearchAction schema (requires Phase 2 routes)`

#### T3-14: Investigate `resourceSection` state variable

**Problem**: `resourceSection` is set but its purpose in render code is unclear. May be dead state similar to `_showFilters`.

**Fix**: Investigate usage. If unused in JSX/effects, remove it (becomes Tier 1 level). If used, document its purpose.

**Files**: src/App.jsx
**Test**: `npm run build` + verify affected sections still work
**Commit**: TBD based on investigation

#### T3-15: Scroll listener re-subscription churn (NEW — Feb 3 audit)

**Problem**: useEffect at lines 597-619 has dependency array `[showBackToTop, scrollDirection]`. Every time scroll direction changes or button visibility toggles, the effect tears down and re-attaches the scroll listener. On a typical scroll through 52 camps, this fires dozens of times.

**Fix**: Use refs for `showBackToTop` and `scrollDirection` values inside the handler instead of reading from closure. Change dependency array to `[]` for a stable listener.
**Files**: src/App.jsx (lines 597-619)
**Test**: `npm run build` + verify scroll button appears/disappears correctly + arrow direction toggles + no jank
**Commit**: `Perf: Stabilize scroll listener with refs (eliminate re-subscription churn)`

#### T3-16: Move static filter arrays to module scope (NEW — Feb 3 audit)

**Problem**: `priceTierOptions` and `ageGroupOptions` (lines ~374-387) are plain arrays defined inside the component function body. Recreated every render despite never changing.

**Fix**: Move both arrays above `function App()`.
**Files**: src/App.jsx (lines 374-387)
**Test**: `npm run build` + verify filter dropdowns still populate correctly
**Commit**: `Perf: Move static filter option arrays to module scope`

#### T3-17: Move footer outside `<main>` element (NEW — Feb 3 audit)

**Problem**: The `<footer>` element (line ~3425) is rendered inside `<main>`, which closes after the footer (~line 3900). Semantically, footer should be a sibling of `<main>`, not inside it.

**Fix**: Move the `</main>` closing tag to before the `<footer>`.
**Files**: src/App.jsx
**Test**: `npm run build` + verify layout unchanged
**Commit**: `A11y: Move footer outside main element (semantic HTML fix)`

#### T3-18: Add focus trap to contact form modal (NEW — Feb 3 audit)

**Problem**: Contact form modal (lines ~4287-4483) has no focus trap. Tab key cycles through background content behind the modal. WCAG 2.1 focus management concern.

**Fix**: Add focus trap logic — on open, move focus to first input; on Tab past last element, wrap to first; on Escape, close modal.
**Files**: src/App.jsx (contact modal section)
**Test**: `npm run build` + keyboard-only testing: Tab through modal, verify no escape to background
**Commit**: `A11y: Add focus trap to contact form modal`

#### T3-19: Add width/height to camp card images (NEW — Feb 3 audit)

**Problem**: Camp card `<img>` elements at lines ~1196, ~1738, ~1988 lack `width` and `height` attributes. The parent div has `h-56` which partially mitigates CLS, but explicit dimensions are the standard approach for CLS prevention.

**Fix**: Add `width="400" height="224"` to all three `<img>` elements.
**Files**: src/App.jsx (3 locations)
**Test**: `npm run build` + verify card images display correctly at all breakpoints
**Commit**: `Perf: Add width/height to camp card images (CLS prevention)`

#### T3-20: Reset contact form after submission (NEW — Feb 3 audit)

**Problem**: After successful submission (lines 175-179), `formSubmitted` is set true and modal closes after 3s, but HTML form fields are never reset. If modal reopens, previous values persist.

**Fix**: Add form reset after successful submission. Either `e.target.reset()` in the submit handler or reset the form ref.
**Files**: src/App.jsx (line ~175)
**Test**: `npm run build` + submit form, close, reopen — fields should be empty
**Commit**: `Fix: Reset contact form fields after successful submission`

#### T3-21: Add `rel="sponsored"` to Featured camp booking links (NEW — Feb 3 audit)

**Problem**: Featured listings are paid placements (€99/year). Google guidelines require `rel="sponsored"` on paid/commercial outbound links. Currently no `rel` attributes on booking `<a>` tags — they use `window.open` via `handleBookingClick`. If `<a>` tags are added in Phase 2 or if Featured links become direct `<a>` elements, `rel="sponsored"` is required.

**Fix**: For now, document the requirement. When Featured listings use `<a>` tags, ensure `rel="sponsored noopener noreferrer"`.
**Files**: Documentation note (no code change until `<a>` tags are used)
**Commit**: N/A (documentation only for now)

#### ~~T3-22: Upgrade Vite 4.x to 5.x or 6.x~~ **PROMOTED TO T2-33**

*Promoted to Tier 2 per Feb 3 meta-audit (8 agents unanimous). Known CVEs warrant higher priority. See T2-33 for full definition.*

#### ~~T3-23: Add CAPTCHA/honeypot to contact form~~ **PROMOTED TO T2-34**

*Promoted to Tier 2 per Feb 3 meta-audit (8 agents unanimous). Honeypot is zero-risk. See T2-34 for full definition.*

#### ~~T3-24: Add Organization @id linking~~ **CONSOLIDATED TO T2-29**

*This item was promoted to Tier 2 as T2-29 per Feb 3 second audit (low-risk schema addition).*

#### ~~T3-25: Add Organization logo/contactPoint/sameAs~~ — **MOVED TO T2-32**

*Promoted to Tier 2 per Feb 3 second audit — adding schema properties is low-risk. See T2-32 for full definition.*

#### T3-26: Keep console.error in production build (NEW — 5-agent Feb 3 audit)

**Problem**: vite.config.js line 31 drops ALL console statements including console.error, making production debugging impossible.

**Fix**: Change `drop: ['console', 'debugger']` to `drop: ['debugger']` and add `pure_funcs: ['console.log', 'console.info', 'console.debug']` to keep error/warn.
**Files**: vite.config.js (line 31)
**Test**: `npm run build` + verify console.error works
**Commit**: `DX: Keep console.error in production for debugging`

#### T3-27: Remove invalid `keywords` property from WebSite schema (NEW — Feb 3 second audit)

**Problem**: WebSite schema at index.html line ~87 has a `keywords` property. This is not a valid schema.org WebSite property — it may be ignored or cause validation warnings.

**Fix**: Remove the `keywords` line from the WebSite JSON-LD block.
**Files**: index.html (line ~87)
**Test**: Google Rich Results Test
**Commit**: `SEO: Remove invalid keywords property from WebSite schema`

#### ~~T3-28: Add focus trap to contact form modal~~ **DUPLICATE — See T3-18**

*This item was a duplicate of T3-18. Consolidated.*

#### ~~T3-29: Reset contact form after successful submission~~ **DUPLICATE — See T3-20**

*This item was a duplicate of T3-20. Consolidated.*

#### T3-31: Add testing strategy with smoke tests (NEW — Feb 3 meta-audit)

**Problem**: Zero tests exist. This is consistently flagged by enterprise reviewers as a buyer-readiness concern and creates no safety net for refactoring. Any change could break core functionality without detection.

**Fix**: Set up Vitest with at least 3 smoke tests covering critical paths:
1. **Search test**: Verify search filters camps by name/location
2. **Filter test**: Verify category/country filters produce expected results
3. **Form test**: Verify contact form validation and submission flow

**Files**: New `src/__tests__/` directory, `vitest.config.js`, `package.json` (add vitest devDependency)
**Test**: `npm run test` should pass all 3 smoke tests
**Commit**: `Test: Add Vitest with 3 smoke tests (search, filter, form)`
**Note**: Addresses enterprise-code-reviewer concern about zero test coverage.

#### T3-32: Audit camp card alt text quality (NEW — Feb 3 SEO meta-audit)

**Problem**: Section 6 claims 7/10 Image SEO score but camp card alt text was never audited. 52 camp cards may have generic or inadequate alt text affecting image search visibility.

**Fix**: Audit all camp card `<img>` alt attributes. Each should include: camp name, location, and primary activity type.
**Files**: src/data/camps.js (if alt text stored there) or src/App.jsx (camp card rendering)
**Test**: Manual review of all 52 alt texts
**Commit**: `SEO: Audit and improve camp card alt text quality`
**Note**: Addresses SEO agent concern about unaudited Image SEO claims.

#### T3-33: Add `loading="lazy"` to below-fold images (NEW — Feb 3 SEO meta-audit)

**Problem**: Camp card images below the initial viewport load immediately, competing with LCP resources. Lazy loading defers non-critical images.

**Fix**: Add `loading="lazy"` to camp card `<img>` elements (NOT the hero image which needs immediate load).
**Files**: src/App.jsx (camp card image elements ~lines 1196, 1738, 1988)
**Test**: `npm run build` + verify images lazy-load on scroll (Network tab)
**Commit**: `Perf: Add lazy loading to below-fold camp card images`

#### T3-34: Establish Core Web Vitals monitoring baseline (NEW — Feb 3 SEO meta-audit)

**Problem**: No documented baseline for LCP, CLS, INP metrics. Cannot track improvements or regressions without baseline.

**Fix**: Run PageSpeed Insights on production URL, document baseline scores in this section.
**Files**: Documentation update only
**Test**: N/A
**Commit**: `Docs: Document Core Web Vitals baseline scores`
**Note**: Add to monthly maintenance schedule (Section 9).

---

### Tier 4 — PHASE 2 ONLY (architectural, defer to React Router migration)

#### T4-1: Extract shared FilterBar component

**Problem**: ~800 lines of filter UI duplicated between Home section (~lines 2198-2560) and Discover section (~lines 2725-3100). Nearly identical logic and JSX.

**Why deferred**: Extracting a shared component from a monolithic file requires careful prop design. This is much easier when sections become route components in Phase 2.

#### T4-2: Extract shared CampCard component

**Problem**: Camp card rendering is duplicated across Home/Discover sections.

**Why deferred**: Same as T4-1 — easier after Route decomposition.

#### T4-3: Split sections into route components

**Problem**: Single 5,800-line App.jsx with 10 conditional sections. Code navigation is difficult for a buyer or maintainer.

**Why deferred**: This IS Phase 2 (React Router migration). The monolith works fine at current traffic.

#### T4-4: Fix multiple H1 elements

**Problem**: 13 H1 elements across different sections. Only the active section's H1 is visible at a time (hash navigation), but crawlers may see all of them.

**Why deferred**: In Phase 2 with real routes, each page gets exactly one H1 naturally.

#### T4-5: Fix SearchAction and BreadcrumbList hash fragments

**Problem**: Schema.org SearchAction URL target uses hash fragment (`/#discover?search={search_term}`). Google ignores hash fragments, so this is non-functional. Same issue with BreadcrumbList URLs.

**Why deferred**: Requires real routes (Phase 2) for functional URLs.

---

## Section 4: Audit Tables

### Table A: npm Dependencies (Production)

| Package | Used | Imported In | Notes |
|---------|------|-------------|-------|
| `react` | YES | App.jsx, main.jsx | Core framework |
| `react-dom` | YES | main.jsx | Core framework |
| `lucide-react` | YES | App.jsx | Icon library |
| `class-variance-authority` | YES | button.jsx | shadcn/ui utility |
| `clsx` | YES | lib/utils.js | shadcn/ui utility |
| `tailwind-merge` | YES | lib/utils.js | shadcn/ui utility |
| `@radix-ui/react-slot` | YES | button.jsx | Used by Button component |
| `vaul` | YES | drawer.jsx | Used by Drawer component |
| `@emailjs/browser` | YES | App.jsx | Contact form |
| `@tanstack/react-virtual` | NO* | Commented import line 19 | Ready but not yet implemented |
| `recharts` | NO | Only in unused chart.jsx | Remove |
| `sonner` | NO | Only in unused sonner.jsx | Remove |
| `date-fns` | NO | Only in unused calendar.jsx | Remove |
| `react-day-picker` | NO | Only in unused calendar.jsx | Remove |
| `cmdk` | NO | Only in unused command.jsx | Remove |
| `@radix-ui/react-accordion` | NO | Only in unused accordion.jsx | Remove |
| `@radix-ui/react-alert-dialog` | NO | Only in unused alert-dialog.jsx | Remove |
| `@radix-ui/react-aspect-ratio` | NO | Only in unused aspect-ratio.jsx | Remove |
| `@radix-ui/react-avatar` | NO | Only in unused avatar.jsx | Remove |
| `@radix-ui/react-checkbox` | NO | Only in unused checkbox.jsx | Remove |
| `@radix-ui/react-collapsible` | NO | Only in unused collapsible.jsx | Remove |
| `@radix-ui/react-context-menu` | NO | Only in unused context-menu.jsx | Remove |
| `@radix-ui/react-dialog` | YES* | Required internally by vaul (drawer) | **KEEP** |
| `@radix-ui/react-dropdown-menu` | NO | Only in unused dropdown-menu.jsx | Remove |
| `@radix-ui/react-hover-card` | NO | Only in unused hover-card.jsx | Remove |
| `@radix-ui/react-label` | NO | Only in unused label.jsx | Remove |
| `@radix-ui/react-menubar` | NO | Only in unused menubar.jsx | Remove |
| `@radix-ui/react-navigation-menu` | NO | Only in unused navigation-menu.jsx | Remove |
| `@radix-ui/react-popover` | NO | Only in unused popover.jsx | Remove |
| `@radix-ui/react-progress` | NO | Only in unused progress.jsx | Remove |
| `@radix-ui/react-radio-group` | NO | Only in unused radio-group.jsx | Remove |
| `@radix-ui/react-scroll-area` | NO | Only in unused scroll-area.jsx | Remove |
| `@radix-ui/react-select` | NO | Only in unused select.jsx | Remove |
| `@radix-ui/react-separator` | NO | Only in unused separator.jsx | Remove |
| `@radix-ui/react-slider` | NO | Only in unused slider.jsx | Remove |
| `@radix-ui/react-switch` | NO | Only in unused switch.jsx | Remove |
| `@radix-ui/react-tabs` | NO | Only in unused tabs.jsx | Remove |
| `@radix-ui/react-toast` | NO | Only in unused toast.jsx | Remove |
| `@radix-ui/react-tooltip` | NO | Only in unused tooltip.jsx | Remove |

*`@tanstack/react-virtual` is intentionally kept — planned for virtual scrolling implementation.*

### Table B: Image Assets

| File | Location | Size | Imported In | Verdict |
|------|----------|------|-------------|---------|
| european-summer-camps-lakeside-hero.png | src/assets/ | 1,635KB | App.jsx (heroImage) | USED |
| hero-lakeside.avif | src/assets/ | 165KB | App.jsx | USED |
| hero-lakeside.webp | src/assets/ | 124KB | App.jsx | USED |
| hero-lakeside-compressed.png | src/assets/ | 661KB | App.jsx | USED |
| activities-collage.avif | src/assets/ | 269KB | App.jsx | USED |
| activities-collage.webp | src/assets/ | 129KB | App.jsx | USED |
| activities-collage-compressed.png | src/assets/ | 279KB | App.jsx | USED |
| camps-map-compressed.png | src/assets/ | 346KB | App.jsx | USED |
| ~~european-summer-camps-hero.png~~ | ~~src/assets/~~ | ~~3,033KB~~ | — | ✅ DELETED (Tier 1) |
| ~~european-summer-camps-map.png~~ | ~~src/assets/~~ | ~~2,492KB~~ | — | ✅ DELETED (Tier 1) |
| ~~european-camp-activities-collage.png~~ | ~~src/assets/~~ | ~~1,921KB~~ | — | ✅ DELETED (Tier 1) |
| ~~camps-map.avif~~ | ~~src/assets/~~ | ~~126KB~~ | — | ✅ DELETED (Tier 1) |
| ~~camps-map.webp~~ | ~~src/assets/~~ | ~~67KB~~ | — | ✅ DELETED (Tier 1) |
| ~~react.svg~~ | ~~src/assets/~~ | ~~4KB~~ | — | ✅ DELETED (Tier 1) |
| ~~european-summer-camps-hero.png~~ | ~~public/~~ | ~~3,033KB~~ | — | ✅ DELETED (Tier 1) |
| european-summer-camps-lakeside-hero.png | public/ | 621KB | og:image | ✅ GENERATED (Tier 1) |
| european-summer-camps-lakeside-hero.webp | public/ | 124KB | Source for PNG | USED |

**Tier 1 result**: ~10.6MB orphaned images removed. New 621KB PNG generated for og:image.

### Table C: shadcn/ui Components

| Component | Imported In App.jsx | Verdict |
|-----------|-------------------|---------|
| button.jsx | YES | KEEP |
| card.jsx | YES | KEEP |
| badge.jsx | YES | KEEP |
| breadcrumb.jsx | YES | KEEP |
| drawer.jsx | YES | KEEP |
| accordion.jsx | NO | REMOVE |
| alert.jsx | NO | REMOVE |
| alert-dialog.jsx | NO | REMOVE |
| aspect-ratio.jsx | NO | REMOVE |
| avatar.jsx | NO | REMOVE |
| calendar.jsx | NO | REMOVE |
| carousel.jsx | NO | REMOVE |
| chart.jsx | NO | REMOVE |
| checkbox.jsx | NO | REMOVE |
| collapsible.jsx | NO | REMOVE |
| command.jsx | NO | REMOVE |
| context-menu.jsx | NO | REMOVE |
| dialog.jsx | NO | REMOVE |
| dropdown-menu.jsx | NO | REMOVE |
| form.jsx | NO | REMOVE |
| hover-card.jsx | NO | REMOVE |
| input.jsx | NO | REMOVE |
| input-otp.jsx | NO | REMOVE |
| label.jsx | NO | REMOVE |
| menubar.jsx | NO | REMOVE |
| navigation-menu.jsx | NO | REMOVE |
| pagination.jsx | NO | REMOVE |
| popover.jsx | NO | REMOVE |
| progress.jsx | NO | REMOVE |
| radio-group.jsx | NO | REMOVE |
| resizable.jsx | NO | REMOVE |
| scroll-area.jsx | NO | REMOVE |
| select.jsx | NO | REMOVE |
| separator.jsx | NO | REMOVE |
| sheet.jsx | NO | REMOVE |
| sidebar.jsx | NO | REMOVE |
| skeleton.jsx | NO | REMOVE |
| slider.jsx | NO | REMOVE |
| sonner.jsx | NO | REMOVE |
| switch.jsx | NO | REMOVE |
| table.jsx | NO | REMOVE |
| tabs.jsx | NO | REMOVE |
| textarea.jsx | NO | REMOVE |
| toast.jsx | NO | REMOVE |
| toaster.jsx | NO | REMOVE |
| tooltip.jsx | NO | REMOVE |

**Summary**: 5 USED / 41 UNUSED out of 46 total — **✅ 41 unused DELETED (Tier 1, Feb 2)**

### Table D: Custom CSS Classes (Dead Code) — ✅ ALL DELETED (Tier 1)

| Class Name | Verdict |
|------------|---------|
| ~~`.ios-scroll-fix`~~ | ✅ DELETED |
| ~~`.smooth-scroll`~~ | ✅ DELETED |
| ~~`.safe-area-content`~~ | ✅ DELETED |
| ~~`.camp-price-label`~~ | ✅ DELETED |

### Table E: useState Hooks

| Variable | Setter | Initial Value | ~Line | Section(s) | Notes |
|----------|--------|---------------|-------|------------|-------|
| activeSection | setActiveSection | "home" | ~96 | All | Navigation state |
| previousSection | setPreviousSection | "home" | ~97 | Navigation | History tracking |
| searchTerm | setSearchTerm | "" | ~98 | Home, Discover | Search input |
| selectedCategory | setSelectedCategory | "all" | ~99 | Home, Discover | Category filter |
| selectedCountries | setSelectedCountries | [] | ~100 | Home, Discover | Multi-select filter |
| selectedAgeGroups | setSelectedAgeGroups | [] | ~101 | Home, Discover | Multi-select filter |
| selectedPriceTier | setSelectedPriceTier | "" | ~102 | Home, Discover | Single-select filter |
| compareList | setCompareList | [] | ~103 | Compare | Camp comparison |
| showContactModal | setShowContactModal | false | ~104 | Contact | Modal visibility |
| contactForm | setContactForm | {...} | ~105 | Contact | Form state |
| emailStatus | setEmailStatus | "" | ~106 | Contact | Submission status |
| cookieConsent | setCookieConsent | null | ~107 | Global | GDPR consent |
| scrollDirection | setScrollDirection | "down" | ~108 | Global | Arrow direction |
| showCountryDropdown | setShowCountryDropdown | false | ~109 | Home, Discover | Desktop dropdown |
| showAgeDropdown | setShowAgeDropdown | false | ~110 | Home, Discover | Desktop dropdown |
| showPriceDropdown | setShowPriceDropdown | false | ~111 | Home, Discover | Desktop dropdown |
| isFilterDrawerOpen | setIsFilterDrawerOpen | false | ~112 | Home, Discover | Mobile drawer |
| mobileFilterTab | setMobileFilterTab | "country" | ~113 | Home, Discover | Drawer tab state |
| ~~_showFilters~~ | — | false | ~116 | NONE | ✅ DELETED (Tier 1) |

---

## Section 5: Implementation Checklist

Ordered by risk tier (Tier 1 first). One item per commit.

> **Numbering Convention (Updated Feb 3, 2026 — meta-audit):**
> - **Completed items** retain historical sequential numbers (#1-25) for commit traceability
> - **Pending items** use ONLY T-prefix identifiers (T1-12, T2-16, T3-15, etc.) — future-proof, no conflicts when adding items
> - T-prefix definitions are in Section 3 (Findings by Risk Tier)
>
> **Consolidations:** T2-22 → T1-16, T3-24 → T2-29, T3-28 → T3-18, T3-29 → T3-20
>
> **Promotions (Feb 3 meta-audit):** T3-22 → **T2-33** (Vite CVEs), T3-23 → **T2-34** (honeypot)
>
> **New items (Feb 3 meta-audit):** T3-31 (testing), T3-32 (alt text audit), T3-33 (lazy loading), T3-34 (CWV baseline)
>
> **Total unique items:** ~77
>
> *Note: Enterprise reviewer recommends future cleanup to use ONLY T-prefix and archive historical #1-25 numbers to appendix.*

### Tier 1 — Zero Risk Cleanup ✅ COMPLETE (February 2, 2026)

*All 8 items executed in 8 commits. Build passes (8.2s), lint 0 errors / 4 warnings.*

- [x] **1. Remove orphaned PNG images from src/assets/** (T1-1) — Commit `f6e0ce7`
- [x] **2. Fix broken og:image + remove orphaned hero PNG from public/** (T1-2) — Commit `1cbbb53`
- [x] **3. Remove 41 unused shadcn/ui component files + use-mobile hook** (T1-3) — Commit `c3afc26`
- [x] **4. Uninstall 30 unused npm packages** (T1-4) — Commit `70c6f72`
- [x] **5. Remove 4 dead CSS classes from App.css** (T1-5) — Commit `cd08678`
- [x] **6. Remove dead _showFilters state** (T1-6) — Commit `5f034c7`
- [x] **7. Consolidate preconnect/DNS-prefetch + fix crossorigin** (T1-7) — Commit `cc9ed6f`
- [x] **8. Remove 12 junk meta tags from index.html** (T1-8) — Commit `d02a63c`

**Impact summary**: ~10.6MB orphaned images removed, 41 unused components deleted (4,234 lines), 30 unused npm packages uninstalled (1,634 lines from lock), broken og:image fixed (social sharing now works), preconnect crossorigin corrected, lint warnings 7→4.

*Note: App.jsx line numbers shifted by ~1 line after Tier 1 (only `_showFilters` removed). All Tier 2/3 line references below are current as of February 2, 2026.*

### Tier 2 — Low Risk Improvements ✅ COMPLETE (February 2, 2026)

*Revised February 2, 2026 after 4-agent parallel review. Executed February 2, 2026. 14 items completed, 1 already done, 1 not needed. See Section 9 for verification log.*

**Execution groups** (respect dependencies):
- **Group A** (T2-1→T2-2→T2-7): Foundation — sequential, T2-2 depends on T2-1, T2-7 depends on both
- **Group B** (T2-3, T2-4, T2-12, T2-13): Independent fixes — any order
- **Group C** (T2-10, T2-11): SEO static files — any order
- **Group D** (T3-1→T2, T3-2→T2): Promoted from Tier 3 — low-risk, high-impact
- **Group E** (T2-9): Performance — after Group A
- **Group F** (T2-14, T2-15): Documentation — LAST, after all code changes
- **Group G** (T2-16 through T2-23): New items from Feb 3 audit — pending
- **Group H** (T2-24 through T2-32): More Feb 3 audit items + promoted items — pending
- **Group I** (T1-12 through T1-18): New Tier 1 items — pending

#### Group A: Foundation (sequential)

- [x] **9. Move allCamps outside component function** (T2-1) ✅ Feb 2
  - Moved to module level (line 112). CRLF-aware node script used after 3 failed attempts.
  - Commit: `Perf: Move allCamps outside component function`

- [x] **10. Extract allCamps to src/data/camps.js** (T2-2) ✅ Feb 2
  - Created src/data/camps.js with 3 image imports + allCamps. App.jsx 5,825→4,661 lines.
  - Fix: Re-exported activitiesCompressed, mapCompressed (used in JSX outside allCamps).
  - Commit: `Refactor: Extract camp data to src/data/camps.js`

- [x] **11. Replace hardcoded org counts with dynamic allCamps.length** (T2-7) ✅ Feb 2
  - Found 8 locations (not 7). All "52" replaced with allCamps.length or template literals.
  - Commit: `DX: Replace 8 hardcoded org counts with dynamic allCamps.length`

#### Group B: Independent fixes (any order)

- [x] **12. Add maxLength to search inputs** (T2-3) ✅ Feb 2
  - Both search inputs now have `maxLength={200}`. Enterprise-reviewed.
  - Commit: `Security: Add maxLength=200 to search inputs`

- [x] **13. Add noopener to window.open calls** (T2-4) ✅ Feb 2
  - All 4 window.open calls now include `'noopener,noreferrer'`. Enterprise-reviewed.
  - Commit: `Security: Add noopener to window.open calls`

- [x] **14. Fix HTTP booking URL for Camp Bjontegaard** (T2-12) ✅ Feb 2
  - Changed to https://sommerleir.no/ in src/data/camps.js.
  - Commit: `Fix: Change Camp Bjontegaard URL from HTTP to HTTPS`

- [x] **15. Remove Crawl-delay from robots.txt** (T2-13) ✅ Feb 2
  - Removed Crawl-delay: 1 and associated comment.
  - Commit: `SEO: Remove Crawl-delay from robots.txt`

- [x] ~~**16. Improve LCP for hero image** (T2-5)~~ **ALREADY DONE — fetchpriority="high" exists at App.jsx line 2118**
  - Discovered by SEO file reviewer (Feb 2, 2026): `<img ... fetchpriority="high">` already present
  - No action needed

#### Group C: SEO static file fixes (any order)

- [x] **17. Fix ItemList numberOfItems to integer** (T2-10) ✅ Feb 2
  - Changed `"100+"` (string) to `100` (integer).
  - Commit: `SEO: Fix numberOfItems to integer value`

- [x] **18. Fix stale sitemap caption** (T2-11) ✅ Feb 2
  - Updated to 52 organizations, 24 countries.
  - Commit: `SEO: Update sitemap to 52 organizations, 24 countries`

- [x] ~~**19. Fix og:image:height dimension error**~~ **ALREADY CORRECT** ✅ No action needed
  - Verified: og:image:height is already `720` (not 1680 as SEO agent claimed)
  - og:image:width is `1680` — the 1680x720 dimensions are correct as-is

#### Group D: Promoted from Tier 3 (low-risk, high-impact)

- [x] **20. Fix CSP connect-src for Google Analytics** (T3-1 → promoted to Tier 2) ✅ Feb 2
  - Added google-analytics.com, analytics.google.com, googletagmanager.com to connect-src.
  - Commit: `Security: Add GA4 domains to CSP connect-src`

- [x] **21. Fix meta tag country counts in index.html** (T3-2 → promoted to Tier 2) ✅ Feb 2
  - Updated 4 locations: meta description (21→24), og:description (13→24), twitter (13→24), schema (21→24).
  - Numbers only changed, sentence wording preserved.
  - **POST-CHECK**: Monitor Search Console for 7 days.
  - Commit: `SEO: Fix country count in meta tags (was 21/13, now 24)`

#### Group E: Performance (after Group A)

- [x] **22. Wrap filterOptions in useMemo** (T2-9) ✅ Feb 2
  - Wrapped with empty deps `[]` since allCamps is module-level.
  - Commit: `Perf: Memoize filterOptions category counts`

#### Group F: Documentation (LAST — after all code changes)

- [x] **23. Update CODE_STRUCTURE.md with accurate line numbers** (T2-15) ✅ Feb 2
  - Major update: added camps.js, updated all section line numbers, file structure.
  - Commit: `Docs: Update CODE_STRUCTURE.md to match current codebase`

- [x] **24. Update sitemap lastmod date** (T2-14) ✅ Feb 2
  - Set to 2026-02-02.
  - Commit: `SEO: Update sitemap lastmod to 2026-02-02`

- [x] **25. Update CODE_REVIEW_2026.md — mark Tier 2 complete** ✅ Feb 2
  - All items marked, deviations noted.
  - Commit: `Docs: Mark Tier 2 complete in CODE_REVIEW_2026.md`

#### Group G: New items from February 3 five-agent audit (partial)

- [x] **T2-16**: Remove user-scalable=no from viewport ✅ Feb 3
  - **WCAG 1.4.4 violation** fixed. Pinch-to-zoom now enabled.
  - Commit: `f24f7ff` — Code Review Batch 1

- [ ] **T2-17**: Fix marquee memory leak
  - `initializeMarqueeSystem()` never returns cleanup from `initWithDelay()`. Line 759 gets `undefined`.
  - Event listeners (resize, visibilitychange, IntersectionObserver, motionMediaQuery) accumulate on every home→away→home navigation.
  - Fix: Restructure so cleanup function is captured and returned. Minimal change — do NOT extract the hook.
  - Files: src/App.jsx (~lines 622-762)
  - Test: `npm run build` + navigate home→discover→home 5 times, check DevTools for listener count
  - Commit: `Fix: Capture marquee cleanup function to prevent memory leak`

- [x] **T2-18**: Add React Error Boundary ✅ Feb 3
  - Created src/components/ErrorBoundary.jsx (class component with fallback UI)
  - Wrapped App content with ErrorBoundary. Shows reload button on crashes.
  - Commit: `ceb0fa5` — Safety: Add React Error Boundary

- [x] **T2-19**: Cache generateBreadcrumbs() result ✅ Feb 3
  - Converted to useMemo with [activeSection] dependency. Now called once per render.
  - Commit: `1dda248` — Perf: GA4 duplicate guard + breadcrumb memoization

- [x] **T2-20**: Harden CSP directives ✅ Feb 3
  - Added object-src 'none', base-uri 'self', form-action 'self' https://api.emailjs.com
  - Commit: `a2c9af0` — Security: Add honeypot spam protection + CSP hardening

- [ ] **T2-21**: Add Permissions-Policy header
  - Add `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` to `_headers`
  - File: public/_headers
  - Test: `npm run build` + check response headers
  - Commit: `Security: Add Permissions-Policy header (restrict unused APIs)`
  - *Deferred: Security agent assessed as "over-engineering" for a camp directory*

- [ ] ~~**T2-22**~~: ~~Fix deprecated X-XSS-Protection~~ — **CONSOLIDATED TO T1-16**

- [x] **T2-23**: Add `<noscript>` fallback ✅ Feb 3
  - Added noscript with site title, description, and JS requirement notice.
  - Commit: `09952e1` — SEO: Complete ItemList schema + Organization @id + noscript

#### Group H: New items from 5-agent Feb 3 comprehensive audit (pending)

- [x] **T2-24**: Fix privacy policy inconsistency ✅ Feb 3
  - Restructured "Data We Collect" with clear categories (Automatic Data, Info You Provide)
  - Removed fear-triggering "What We Don't Collect" section
  - Commits: `532f01d` + `0e8140a`

- [x] **T2-25**: Guard GA4 initialization ✅ Feb 3
  - Added `if (window.gtag) return` guard before initializeGA4().
  - Commit: `1dda248` — Perf: GA4 duplicate guard + breadcrumb memoization

- [x] **T2-26**: Align sitemap image with og:image ✅ Feb 3
  - Changed sitemap.xml from .webp to .png — now matches og:image.
  - Commit: `f24f7ff` — Code Review Batch 1

- [x] **T2-27**: Fix Guide section stale prices ✅ Feb 3
  - Les Elfes: CHF 4,990 → CHF 4,550, Oxford: £6,220 → £6,995, UK range: £1,575-6,220 → £1,595-6,995
  - Commit: `6b38a4e` — Code Review Batch 2

- [x] **T2-28**: Add CSP font-src directive ✅ Feb 3
  - Added `font-src 'self' https://fonts.gstatic.com` to CSP.
  - Commit: `a2c9af0` — Security: Add honeypot spam protection + CSP hardening

- [x] **T2-29**: Add Organization schema @id linking ✅ Feb 3
  - Added @id to standalone Organization block. Updated WebSite author/publisher to reference @id.
  - Commit: `09952e1` — SEO: Complete ItemList schema + Organization @id + noscript

- [ ] **T2-30**: Add CSP report-uri directive (optional)
  - Enable CSP violation monitoring.
  - File: public/_headers (line 57)
  - Test: Deploy + verify reports received
  - Commit: `Security: Add CSP report-uri for violation monitoring`
  - *Deferred: Lower priority per security agent — monitoring without response capability is limited value*

- [x] **T2-31**: Complete ItemList schema — add 3 missing categories ✅ Feb 3
  - Added Family Programs (position 5), Budget Excellence (position 6), Unique Experiences (position 7).
  - Now lists all 7 categories instead of 4.
  - Commit: `09952e1` — SEO: Complete ItemList schema + Organization @id + noscript

- [ ] **T2-32**: Add Organization logo/contactPoint/sameAs (moved from T3-25)
  - Enriches Organization for Knowledge Panel.
  - File: index.html (lines ~242-265)
  - Test: Google Rich Results Test
  - Commit: `SEO: Enrich Organization schema with logo/contactPoint`

#### Group J: Security priorities from Feb 3 meta-audit (NEW)

- [x] **T2-33**: Upgrade Vite 4.x to 7.x 🚨 SECURITY ✅ Feb 3
  - Upgraded vite 4.4.5 → 7.3.1, @vitejs/plugin-react 4.0.3 → 5.1.3
  - Resolves CVE-2024-45812 (CVSS 7.5), CVE-2024-45811 (CVSS 6.1)
  - npm audit: 4 → 2 moderate vulnerabilities (remaining are eslint dev-only)
  - Commit: `83d2872` — Security: Upgrade Vite 4.4.5 → 7.3.1

- [x] **T2-34**: Add honeypot spam protection 🛡️ ✅ Feb 3
  - Added hidden honeypot field to contact form + bot detection in submit handler.
  - Commit: `a2c9af0` — Security: Add honeypot spam protection + CSP hardening

#### Group I: New Tier 1 items from 5-agent Feb 3 audit (partial)

- [x] **T1-12**: Remove useless robots.txt hash Allow lines ✅ Feb 3
  - Removed 5 hash Allow lines (/#discover, /#compare, /#plan, /#guide, /#resources)
  - Commit: `f24f7ff` — Code Review Batch 1

- [x] **T1-13**: Update robots.txt last-updated comment ✅ Feb 3
  - Updated from 2025-08-29 to 2026-02-03
  - Commit: `f24f7ff` — Code Review Batch 1

- [ ] **T1-14**: Verify @CampExplorerEU Twitter handle
  - Check if handle exists, remove twitter:site if not.
  - File: index.html
  - Test: Twitter Card validator
  - Commit: `SEO: Remove invalid twitter:site handle` (if needed)

- [x] **T1-15**: Add AVIF cache rule ✅ Feb 3
  - Added `/*.avif` with immutable cache rule to _headers.
  - Commit: `a2c9af0` — Security: Add honeypot spam protection + CSP hardening

- [x] **T1-16**: Change X-XSS-Protection to 0 ✅ Feb 3
  - Changed from `1; mode=block` to `0` (deprecated auditor)
  - Commit: `f24f7ff` — Code Review Batch 1

- [ ] **T1-17**: Add security.txt file
  - File: public/.well-known/security.txt (new)
  - Test: Verify accessible after deploy
  - Commit: `Security: Add security.txt for vulnerability reporting`
  - *Deferred: Security agent assessed as "security theater" — nice but no actual protection*

- [x] **T1-18**: Run npm audit and document findings ✅ Feb 3
  - Ran npm audit before Vite upgrade: 4 moderate vulnerabilities (esbuild, vite, eslint)
  - After Vite 7.3.1 upgrade: 2 moderate (eslint only — dev-time)
  - No HIGH/CRITICAL vulnerabilities

#### Removed from Tier 2

- [x] ~~**T2-5: Add fetchpriority="high" to hero image**~~ — ALREADY IMPLEMENTED (line 2118)
- [x] ~~**T2-8: Extract marquee useEffect to custom hook**~~ — RECLASSIFIED TO TIER 3 → TIER 4 (see T4-7)
  - 140-line battle-tested useEffect on DO NOT TOUCH list (Section 2)
  - Complex: inline debounce, retry logic, IntersectionObserver, iOS/Android platform detection
  - Affects 70% of users (mobile). Risk too high for Tier 2.
  - Demoted further to Tier 4 (Feb 3) — contradicts DO NOT TOUCH. Memory leak bug is separate item T2-17.

### Tier 3 — Medium Risk Fixes (8 of 11 complete as of February 3, 2026)

*Revised February 2, 2026: T3-1 and T3-2 promoted to Tier 2 (items #20-#21). T3-13 demoted to Tier 4. T2-8 added here.*
*February 3, 2026: 8 quick wins completed (items #27-30, #32, #34-37). #26 demoted to Tier 4. #31 promoted to Tier 2. 1 item remains (#33 — numeric price field). New Tier 3 items T3-15 through T3-21 added from 5-agent fresh audit.*

- [x] ~~**T3-1. Fix CSP connect-src for GA4**~~ — **PROMOTED TO TIER 2** (item #20)
- [x] ~~**T3-2. Fix meta tag country counts**~~ — **PROMOTED TO TIER 2** (item #21)

- [x] ~~**26. Extract marquee useEffect to custom hook**~~ — **DEMOTED TO TIER 4** (T4-7)
  - Contradicts DO NOT TOUCH list. The actual bug (memory leak) is T2-17. This extraction is cosmetic refactor only.
  - Defer to Phase 2 when component splits make extraction natural.

- [x] **27. Fix broken "Local" category footer link** (T3-3) ✅ Feb 3
  - Changed to `handleCategoryFilter('budget_excellence')` with label "Budget Excellence"
  - Commit: `Fix: Change broken "Local" footer link to Budget Excellence`

- [x] **28. Fix "Book Now" text in Compare section** (T3-4) ✅ Feb 3
  - Changed to "View Details & Book" to match Home/Discover sections
  - Commit: `Fix: Change Compare "Book Now" to "View Details & Book"`

- [x] **29. Fix null established year display** (T3-5) ✅ Feb 3
  - Added conditional rendering in both Home and Discover card locations
  - Commit: `Fix: Handle null established year in camp cards`

- [x] **30. Fix badge CSS inconsistency Home vs Discover** (T3-6) ✅ Feb 3
  - Changed Discover section activity/language badges from `text-xs` to `badge-responsive`
  - Commit: `Fix: Use consistent badge-responsive class in Discover`

- [x] ~~**T3-7. Remove user-scalable=no from viewport**~~ → **PROMOTED TO TIER 2** as T2-16 (#26)
  - See Tier 2 Group G item #26 for updated tracking.

- [x] **32. Remove hyperbolic code comments** (T3-8) ✅ Feb 3
  - Replaced 5 hyperbolic comments with factual descriptions
  - "ENTERPRISE MARQUEE INTELLIGENCE SYSTEM" → "Marquee overflow detection and animation"
  - "Bleeding-edge performance optimization" → "Memoized filter computation"
  - "ATTACH ENTERPRISE EVENT LISTENERS" → "Attach event listeners"
  - "CLEANUP FUNCTION - ENTERPRISE MEMORY MANAGEMENT" → "Cleanup function"
  - "RESPONSIVE INTELLIGENCE - RESIZE DETECTION" → "Resize detection"
  - Commit: `Cleanup: Replace hyperbolic comments with factual descriptions`

- [ ] ~~**T3-9**~~: ~~Add numeric price field to camp data~~ — **DEMOTED TO T4-8**
  - Requires currency conversion research for 52 camps in 8+ currencies
  - Significant data engineering effort — defer to Phase 2

- [x] **34. Remove meta keywords tag** (T3-10) ✅ Feb 3
  - Removed entire meta keywords tag from index.html
  - Commit: `SEO: Remove meta keywords tag (ignored by Google, reveals strategy)`

- [x] **35. Add og:image:type meta tag** (T3-11) ✅ Feb 3
  - Added `<meta property="og:image:type" content="image/png" />` after og:image:height
  - Commit: `SEO: Add og:image:type meta tag for social sharing`

- [x] **36. Remove unnecessary hreflang tags** (T3-12) ✅ Feb 3
  - Removed hreflang="en" and x-default alternate links (monolingual site)
  - Commit: `Cleanup: Remove unnecessary hreflang tags (monolingual site)`

- [x] ~~**37. Remove non-functional BreadcrumbList/SearchAction schema** (T3-13)~~ — **DEMOTED TO TIER 4**
  - SEO reviewer (Feb 2, 2026): Removing structured data is riskier than keeping non-functional schema. Google may interpret removal negatively. Wait for Phase 2 real routes.

- [x] **37. Investigate resourceSection state variable** (T3-14) ✅ Feb 3 — NOT DEAD
  - Investigated: `resourceSection` is actively used to control Plan section sub-pages
  - Used at lines ~2798, 2865, 2935, 3013, 3112, 3230, 3329 (7 conditional renders)
  - Controls which resource sub-section displays (booking-timeline, safety-standards, etc.)
  - No action needed — this is live, functional state

#### New Tier 3 items from February 3 five-agent audit

- [ ] **T3-15**: Fix scroll listener re-subscription
  - useEffect at lines 597-619 has `[showBackToTop, scrollDirection]` deps causing listener churn on every scroll direction change.
  - Fix: Use refs instead of state in the scroll handler to avoid re-subscription.
  - Files: src/App.jsx (~lines 597-619)
  - Test: `npm run build` + scroll up/down, verify performance in DevTools
  - Commit: `Perf: Use refs in scroll listener to prevent re-subscription churn`

- [ ] **T3-16**: Move static filter arrays to module scope
  - `priceTierOptions` and `ageGroupOptions` (lines 374-387) are static arrays recreated every render.
  - Fix: Move to module scope above `function App()`.
  - Files: src/App.jsx (~lines 374-387)
  - Test: `npm run build` + verify filters still work
  - Commit: `Perf: Move static filter option arrays to module scope`

- [ ] **T3-17**: Fix footer semantic structure
  - `<footer>` is currently inside `<main>`. Should be a sibling of `<main>` per HTML5 semantics.
  - Files: src/App.jsx (~line 3600)
  - Test: `npm run build` + verify footer renders correctly
  - Commit: `A11y: Move footer outside main element (HTML5 semantics)`

- [ ] **T3-18**: Add focus trap for contact modal
  - No focus trap in contact form modal (lines 4287-4483). Tab key can escape modal.
  - Files: src/App.jsx (contact modal section)
  - Test: `npm run build` + open modal, Tab through all fields, verify focus stays within
  - Commit: `A11y: Add focus trap to contact form modal`

- [ ] **T3-19**: Add focus management for mobile menu
  - No focus management when mobile nav opens (lines 885-896). Focus should move to first menu item.
  - Files: src/App.jsx (mobile menu section)
  - Test: `npm run build` + open mobile menu, verify focus moves correctly
  - Commit: `A11y: Add focus management to mobile menu`

- [ ] **T3-20**: Add width/height to camp card images
  - Lines 1196, 1738, 1988 lack explicit dimensions, causing CLS.
  - Files: src/App.jsx (camp card image elements)
  - Test: `npm run build` + verify no visual changes, check CLS in Lighthouse
  - Commit: `Perf: Add width/height to camp card images (CLS prevention)`

#### New Tier 3 items from 5-agent comprehensive Feb 3 audit

- [x] ~~**T3-22**~~: ~~Upgrade Vite 4.x~~ — **PROMOTED TO T2-33** (Feb 3 meta-audit)
  - See T2-33 in Tier 2 section for full definition

- [x] ~~**T3-23**~~: ~~Add CAPTCHA/honeypot~~ — **PROMOTED TO T2-34** (Feb 3 meta-audit)
  - See T2-34 in Tier 2 section for full definition

- [ ] ~~**T3-24**~~: ~~Add Organization @id linking~~ — **CONSOLIDATED TO T2-29**

- [ ] ~~**T3-25**~~: ~~Add Organization logo/contactPoint/sameAs~~ — **MOVED TO T2-32**

- [ ] **T3-26**: Keep console.error in production
  - vite.config.js drops all console statements making debugging impossible.
  - File: vite.config.js (line 31)
  - Test: `npm run build` + verify console.error works
  - Commit: `DX: Keep console.error in production for debugging`

- [x] **T3-27**: Remove invalid `keywords` property from WebSite schema ✅ Feb 3
  - Removed non-standard `keywords` property from WebSite JSON-LD
  - Commit: `f24f7ff` — Code Review Batch 1

#### New Tier 3 items from Feb 3 meta-audit (8 agents)

- [ ] **T3-31**: Add testing strategy with smoke tests (NEW)
  - Enterprise concern: zero tests, buyer-readiness gap
  - Set up Vitest with 3 smoke tests (search, filter, form)
  - Files: New `src/__tests__/`, `vitest.config.js`, `package.json`
  - Commit: `Test: Add Vitest with 3 smoke tests`

- [ ] **T3-32**: Audit camp card alt text quality (NEW)
  - SEO concern: 7/10 Image SEO claimed but never audited
  - Audit all 52 camp alt texts for quality
  - Files: src/App.jsx or src/data/camps.js
  - Commit: `SEO: Audit and improve camp card alt text quality`

- [ ] **T3-33**: Add `loading="lazy"` to below-fold images (NEW)
  - Performance: defer non-LCP images
  - Add to camp card images (NOT hero)
  - Files: src/App.jsx (~lines 1196, 1738, 1988)
  - Commit: `Perf: Add lazy loading to below-fold camp card images`

- [ ] **T3-34**: Establish Core Web Vitals baseline (NEW)
  - No documented LCP/CLS/INP baseline to track against
  - Run PageSpeed Insights, document results
  - Files: Documentation only
  - Commit: `Docs: Document Core Web Vitals baseline scores`

### Tier 4 — Phase 2 Only

- [ ] **T4-1**: Extract shared FilterBar component — Requires React Router
- [ ] **T4-2**: Extract shared CampCard component — Requires React Router
- [ ] **T4-3**: Split sections into route components — IS Phase 2
- [ ] **T4-4**: Fix multiple H1 elements — Natural with real routes
- [ ] **T4-5**: Fix schema hash fragment URLs — Requires real routes
- [ ] **T4-6**: Remove/replace non-functional BreadcrumbList/SearchAction schema (demoted from T3-13)
  - Demoted Feb 2, 2026: SEO reviewer found removing schema is riskier than keeping non-functional schema
  - When Phase 2 provides real routes, replace hash URLs with real paths instead of removing
- [ ] **T4-7**: Extract marquee useEffect to custom hook (demoted from Tier 3)
  - Demoted Feb 3, 2026: Contradicts DO NOT TOUCH list (Section 2). Pure refactor with high mobile risk (70% traffic).
  - The actual bug (memory leak) is now a separate Tier 2 item (T2-17). This extraction is cosmetic.
  - When Phase 2 splits App.jsx into route components, extraction becomes natural and lower-risk.
- [ ] **T4-8**: Add numeric price field to camp data (demoted from T3-9)
  - Requires currency conversion research for 52 camps in 8+ currencies
  - Significant data engineering effort — defer to Phase 2

---

## Section 6: SEO-Specific Findings

### Structured Data Issues
1. ~~**numberOfItems is string "100+"**~~ — ✅ FIXED (Feb 2, item #17). Now integer `100`.
2. **SearchAction uses hash fragment** — Google ignores `/#discover?search={search_term}`. Non-functional until Phase 2. Keeping as-is per SEO reviewer advice (removing is riskier).
3. **BreadcrumbList uses hash URLs** — Same issue. Keeping until Phase 2 provides real URLs.
4. **Event schema is NOT implemented** — CLAUDE.md incorrectly claims "Event schema for camps." Actual schema uses `EducationalOrganization` in an `ItemList` in index.html. This is a documentation error in CLAUDE.md (should say "EducationalOrganization schema"). Event schema is better suited for Phase 2 individual camp pages with specific dates/locations.
5. **No individual camp structured data** — Camps have zero schema markup. AggregateRating schema would generate star ratings in SERPs (competitor world-camps.org does this). Requires Phase 2 individual camp pages.
6. **ItemList schema incomplete** (NEW — Feb 3 audit) — Only 4 of 7 categories listed in index.html lines 111-140 (missing Family Programs, Budget Excellence, Unique Experiences). See T2-31.
7. **`@CampExplorerEU` Twitter handle** — Referenced in `twitter:site` meta tag. Verify this handle actually exists and is controlled. If not, remove the meta tag.
8. **No `<noscript>` fallback** (NEW — Feb 3 audit) — JS-disabled users and some crawlers see blank page. See T2-23.
9. **`rel="sponsored"` needed for Featured listings** (NEW — Feb 3 audit) — Paid placements (€99/year) require `rel="sponsored"` per Google guidelines. Not actionable until booking links use `<a>` tags. See T3-21.

**NEW from 5-agent Feb 3 audit:**
10. **robots.txt hash Allow lines useless** — Lines 83-87 (`Allow: /#discover` etc.) do nothing. Crawlers strip hash fragments.
11. **robots.txt "Last updated" stale** — Line 104 says 2025-08-29, over 5 months old.
12. **sitemap.xml image points to .webp, og:image to .png** — Inconsistency between social and search image signals.
13. **Organization schema missing @id linking** — Two Organization blocks without linkage, weakens Knowledge Graph.
14. **Organization schema missing logo/contactPoint/sameAs** — Reduces Knowledge Panel potential.
15. **Camp card images missing `<picture>` element** — No WebP/AVIF optimization for camp cards.
16. **`user-scalable=no` is SEO penalty** — Lighthouse mobile audit fails, affects mobile-first indexing.

### Meta Tag Issues
1. ~~**Country counts inconsistent**~~ — ✅ FIXED (Feb 2, item #21). All meta tags now say 24 countries.
2. **Title and description are effective** — Currently driving 73% organic traffic. Change with extreme care.
3. **Confirmed #1 ranking** (Feb 3 audit) — Site ranks #1 for "european summer camps 2026" despite SPA limitation. Protect this position.

### Content SEO
1. **Multiple H1 elements** — 13 H1s across sections. Only 1 visible at a time due to hash nav, but crawlers may see all. Phase 2 fix.
2. **Heading hierarchy generally good** within each section.

### Competitor Insights (from SEO agent)

| Feature | Your Site | bestsummercourses.com | campeurope.net | world-camps.org | bestparents.com | noreceptionclub.com |
|---------|-----------|----------------------|----------------|-----------------|-----------------|---------------------|
| Individual camp pages | No (SPA) | Yes | Yes (per program) | Yes (400+ pages) | Yes | Blog format |
| Country-specific pages | No | Yes | No | Yes | Unknown | No |
| Category pages | No | Yes | No | No | No | No |
| Blog content | No | Yes (News & Advice) | No | No | Yes | Yes (primary strategy) |
| Age-specific pages | No | Yes | No | No | No | No |
| Indexable URLs | **1** | 50+ | ~10 | **400+** | 30+ | 10-15 |
| Structured data | Good foundation, gaps | Unknown | Basic | Product + AggregateRating | Unknown | Article schema |
| FAQ schema | Yes (10 Qs) | Unknown | Yes | No | No | No |
| Number of camps | 52 orgs / 100+ | ~50+ curated | ~50 | 400+ | 30+ | 10-15 curated |

**Key gap**: Every competitor has multiple indexable URLs. world-camps.org ranks for 400+ long-tail camp-name queries that we cannot compete for with a single URL. bestsummercourses.com captures age-specific queries with dedicated pages.
**Your advantage**: Superior structured data, comprehensive FAQ schema, verified pricing, clean domain authority. Content quality per page is higher than most competitors. Already ranking #1 for primary directory query despite SPA limitation.
**Critical insight**: The path from 168 to 1,000+ monthly sessions runs directly through Phase 2. Individual camp pages alone could 5-10x indexable page count.
- Phase 2 (React Router + SSG) is essential for growth beyond ~300 monthly visitors
- Current organic traffic (168/month) is approaching the SPA ceiling

### Phase 2 SEO Roadmap
1. **Individual camp pages** (`/camps/les-elfes-international/`) — unlocks 52+ new indexable pages and long-tail keyword potential
2. **Country landing pages** (`/countries/switzerland/`) — target "[country] summer camps 2026" queries
3. **Category landing pages** (`/categories/premium-alpine/`) — target category-specific searches
4. **Age-group pages** (`/camps/teens/`, `/camps/kids-6-10/`) — target age-specific queries (bestsummercourses.com already wins these)
5. **Blog/guide content** (`/guides/how-to-choose-european-summer-camp/`) — extract existing guide content from hash fragments into real crawlable pages
6. **Server-side rendering or static site generation** — eliminate JavaScript rendering dependency entirely
7. **Working SearchAction and BreadcrumbList** — with real URL paths, these schemas will produce rich results
8. **AggregateRating schema per camp** — generates star ratings in SERPs (world-camps.org does this)
9. Proper canonical tags per page, one H1 per route

### Overall SEO Score: 6.0/10 (ADJUSTED February 3, 2026 — down from 7.0 → 6.5 → 6.0)

*Score reduced: user-scalable=no mobile penalty, robots.txt issues, og:image/sitemap mismatch, Organization schema gaps offset prior improvements.*

| Sub-dimension | Score | Notes |
|---------------|-------|-------|
| Meta Tags & Title | 8/10 | ✅ Country counts fixed. Title/description driving #1 ranking. |
| Structured Data | 5.0/10 | **Adjusted** (was 5.5): Duplicate Organization without @id, FAQ rich results unlikely post-Aug 2023, og:image/sitemap mismatch |
| Content SEO / Headings | 5/10 | 13 H1 tags on one page; rich content trapped in single URL |
| Image SEO | 7/10 | **Adjusted** (was 8): Camp card alt text needs audit, og:image/sitemap mismatch |
| Technical SEO | 6.0/10 | **Adjusted** (was 6.5): user-scalable=no mobile penalty, robots.txt hash lines, stale date |
| Core Web Vitals | 7/10 | Good image optimization and caching; camp card images lack width/height (CLS) |
| Caching & Headers | 9/10 | Excellent immutable cache headers, strong security headers |
| Schema Accuracy | 6.5/10 | ✅ Country counts fixed. numberOfItems fixed. ItemList still incomplete. |
| Competitor Parity | 4/10 | Single biggest gap: 1 indexable URL vs competitors' 10-400+ |

### Phase 2 SEO Roadmap Additions (NEW — 5-agent Feb 3 audit)

**Added items:**
10. **Programmatic SEO pages** — Generate `/summer-camps-near-zurich/`, `/affordable-camps-under-2000/` from camp data filtering
11. **Internal linking strategy** — Each camp page links to same-country, same-category, similar-price camps
12. **Dynamic XML sitemap generation** — Auto-generate from route manifest
13. **Content hub / pillar page architecture** — Guide content becomes pillar pages linking to camp pages
14. **Google Business Profile** — Claim as online directory service for branded search
15. **hreflang implementation** — When translated content exists (German, French, Danish)

### SEO Documentation Notes

**Caveat for AggregateRating (Phase 2 item #8)**: "Requires genuine user review data, not estimated ratings. Do NOT implement with fabricated ratings — violates Google's structured data spam policy."

**FAQ rich results limitation**: Since August 2023, Google shows FAQ rich results only for government/health sites. FAQ schema still helps comprehension but generates zero rich snippets for commercial directories.

---

## Section 6.5: Known Gaps (UPDATED — 8-agent Feb 3 meta-audit)

Areas consciously NOT covered by this review that future sessions should address:

| Gap | Impact | Status | Checklist Item |
|-----|--------|--------|----------------|
| **Testing strategy** | High | 🆕 NOW TRACKED | **T3-31** — Add Vitest with 3 smoke tests |
| **npm audit / dependency vulnerabilities** | High | 🆕 NOW TRACKED | **T1-18** — Run npm audit and document |
| **Vite CVEs** | High | 🆕 NOW TRACKED | **T2-33** — Upgrade Vite 4.x to 6.x |
| **Spam protection** | High | 🆕 NOW TRACKED | **T2-34** — Add honeypot to contact form |
| **Camp card alt text quality** | Medium | 🆕 NOW TRACKED | **T3-32** — Audit all 52 camp alt texts |
| **Core Web Vitals baseline** | Medium | 🆕 NOW TRACKED | **T3-34** — Document LCP/CLS/INP baseline |
| **Bundle size analysis** | Medium | Not tracked | Removed 30 packages but never measured before/after with `vite-bundle-visualizer`. |
| **Error monitoring / logging** | Medium | Not tracked | Error Boundary catches crashes but doesn't report anywhere. No Sentry/LogRocket. |
| **CI/CD review** | Medium | Not tracked | No build checks, lint gates, or preview deployments. One bad push goes live instantly. |
| **Environment configuration** | Low | Not tracked | EmailJS/GA4 IDs hardcoded — no .env usage. Works but not ideal. |

*Feb 3 meta-audit addressed 6 of 10 gaps by creating checklist items.*

---

## Section 7: Architecture & Buyer-Readiness Assessment

*Added from dedicated architecture review pass (February 1, 2026)*

### Acquisition Readiness Score: 5/10

A buyer who is comfortable with React could take this over, but they would immediately want to spend 1-2 days restructuring before doing anything else. The codebase is functional but not "hand off and walk away" ready. The extensive documentation partially compensates for architectural shortcomings, but stale line numbers erode that trust.

### What a Buyer Sees in 30 Minutes

**Positives:**
- Simple, understandable stack (React + Vite + Tailwind) — no backend complexity
- Good accessibility (WCAG 2.1 AA, ARIA throughout)
- Good SEO foundation (structured data, meta tags, FAQ schema)
- Clean deployment pipeline (Vercel auto-deploy from GitHub)
- Comprehensive documentation (even if line numbers are stale)
- Data verification comments show care for accuracy
- Camp data is well-structured with consistent fields

**Negatives:**
- ~~5,825-line God Component~~ **Improved**: Now 4,661-line App.jsx + 1,196-line camps.js — still a God Component but data separated
- ~~Camp data embedded in UI code~~ **✅ RESOLVED (Feb 2)**: Camp data extracted to `src/data/camps.js`
- Zero tests of any kind — no safety net for changes
- ~~38 unused UI components and ~10 unused npm packages signal "kitchen sink" installation~~ **✅ RESOLVED (Tier 1)** — 41 components + 30 packages removed
- Filter UI duplication is documented tech debt never addressed (Tier 4)
- No routing library — the app conditionally shows/hides sections (Phase 2)
- ~~Stale documentation line numbers undermine confidence~~ **✅ RESOLVED (Feb 2)** — CODE_STRUCTURE.md updated

### Code Organization Issues

**Separation of concerns: Minimal.** Camp data now in separate file (Feb 2). But business logic, analytics, email config, GDPR handling, and all 10+ UI sections still live in one function. Zero custom components besides App itself.

**What took longest to find:** The filtering logic at line ~290 (`filteredCamps` useMemo) — previously buried between 1,200 lines of camp data and 300 lines of navigation handlers. Camp data extraction (Feb 2) improved this.

### Naming & Readability

Naming is **generally good**: consistent camelCase, descriptive function names (`handleCategoryFilter`, `toggleCountry`, `clearAllFilters`). State variables clearly communicate purpose.

**Issues:**
- ~~`resourceSection` state — set but purpose unclear~~ **✅ RESOLVED (Feb 3)** — investigated, actively used for Plan section sub-pages
- ~~**Hyperbolic code comments undermine credibility**~~ **✅ MOSTLY RESOLVED (Feb 3, item #32)** — 5 hyperbolic comments replaced. One missed: line 217 "Enterprise Marquee System - State of the Art" (see T1-10)
- Magic number: `badgeWidth - 40` (~line 1824) with vague inline comment. Should be a named constant.
- Inconsistent boundary between module-scope and component-scope functions

### State Management Assessment

19 useState hooks, logically groupable:
- **Filter state (5)**: `selectedFilter`, `searchTerm`, `selectedCountries`, `selectedPriceTier`, `selectedAgeGroups` — candidates for `useReducer` or custom `useFilters` hook
- **UI state (6)**: `isMenuOpen`, `activeSection`, `filterSheetOpen`, `openDropdown`, `showContactForm`, `showBackToTop`
- **Form state (2)**: `isSubmittingForm`, `formSubmitted`
- **GDPR state (2)**: `cookieConsent`, `showCookieBanner`
- **Other (3)**: `selectedCamps`, `scrollDirection`, `resourceSection` (~~`_showFilters`~~ deleted Feb 2)

No hidden state dependency issues found — useMemo dependency arrays are correct.

### Function Design Issues

- **App() function**: 4,661 lines (after camp data extraction) — the entire application is one function
- **Marquee useEffect** (~lines 1792-1932): 140 lines with inline debounce utility, retry logic, IntersectionObserver, and platform detection. Should be a custom hook `useMarqueeAnimation`.
- **`handleResourceLink`**: Switch with 7+ cases of duplicated scroll-to-element logic. Each case does the same thing with minor variations.
- **`generateBreadcrumbs`** (~lines 1587-1617): Verbose switch statement that could be replaced with a simple object lookup (map section name to breadcrumb config).
- ~~**`filterOptions`** (~line 1516): Filters allCamps 7 times per render without memoization~~ **✅ RESOLVED (Feb 2, item #22)** — wrapped in useMemo
- **Age matching in `filteredCamps`** (~lines 1485-1496): Uses inline IIFE that reduces readability.

### Data Architecture Issues

1. **No machine-readable price field**: Only human-readable strings in inconsistent formats: `"From CHF 4,550/1 week"`, `"EUR335/10 days"`, `"$7,095/16 days"`, `"From EUR145/3 days"`, `"EUR410-440/1 week"`. Cannot programmatically sort by price. A `priceNumericEUR: 4550` field would unlock sorting, range filtering, and data export.
2. **Mixed currency formats**: EUR, CHF, GBP, NOK, DKK, SEK, PLN, USD across 52 camps — `priceRange` field (budget/mid/premium/luxury) normalizes this for filtering but raw prices are unparseable by code.
3. **Same 4 images** reused across all 56 camps — image field is decorative, not informational.
4. **ID gaps** (13, 16, 19, 22 removed) — comment explanations are good but a buyer wonders about data integrity.
5. **`reviews: 0`** on 8 camps — ambiguous: "not collected" vs "zero reviews."
6. ~~**Hardcoded stats** ("52") scattered across JSX~~ **✅ RESOLVED (Feb 2, item #11)** — 8 locations replaced with `allCamps.length`

### Documentation Accuracy (CODE_STRUCTURE.md)

| What it says | Actual | Off by |
|-------------|--------|--------|
| ~5,000 lines | 5,825 lines | 16% |
| Camp data lines 210-1166 | Lines 224-1410 | End line off by 244 |
| 45/42 camps | 56 objects (52 active) | Significantly stale |
| State lines 105-183 | Lines 112-198 | Off by ~15 lines |
| useEffect lines 1270-1494 | Lines 1702-1964 | Off by ~430 lines |
| Lists 10 UI components | 46 components exist (5 used) | 36 unlisted |

**Verdict**: ~~CODE_STRUCTURE.md was unreliable~~ **✅ RESOLVED (Feb 2, item #23)** — fully updated with accurate line numbers, camps.js structure, correct file listing.

### Top 10 Buyer-Readiness Improvements (from architecture review)

| Priority | Improvement | Impact | Status |
|----------|------------|--------|--------|
| 1 | Extract camp data to `src/data/camps.js` | Massive — reduces App.jsx by 1,200 lines | ✅ Done (Feb 2) |
| 2 | Extract CampCard component | High — eliminates duplication | Tier 4 |
| 3 | Extract FilterBar component | High — eliminates ~800 lines duplication | Tier 4 |
| 4 | Add numeric price field to data | High for any buyer enhancing the product | Tier 3 (#33) |
| 5 | Remove unused shadcn/ui components | Clean repo signal | ✅ Done (Feb 2) |
| 6 | Remove unused npm packages | Reduces confusion about actual stack | ✅ Done (Feb 2) |
| 7 | Delete dead state (`_showFilters`) | Code hygiene signal | ✅ Done (Feb 2) |
| 8 | Remove hyperbolic code comments | Credibility with buyers | ✅ Done (Feb 3) |
| 9 | Update CODE_STRUCTURE.md line numbers | Documentation trust | ✅ Done (Feb 2) |
| 10 | Extract marquee useEffect to custom hook | Reduces App.jsx complexity | Tier 4 |

### New Checklist Items from Architecture Review

Items added to Section 5 checklist from this pass:
- T3-8 (#30): Remove hyperbolic code comments
- T2-15 (#19): Update CODE_STRUCTURE.md with accurate line numbers *(promoted to Tier 2)*
- T3-9 (#31): Add numeric price field to camp data
- T2-8 (#21): Extract marquee useEffect to custom hook
- T2-9 (#22): Wrap filterOptions in useMemo

Items #1-4 from the Top 10 table above (extract data, CampCard, FilterBar, and route splitting) are already captured as T2-2, T4-2, T4-1, and T4-3 respectively.

---

## Section 8: Tier 1 Implementation Plan — ✅ EXECUTED (February 2, 2026)

> **📦 ARCHIVE CANDIDATE**: This section is 100% complete (all 8 items executed Feb 2). Enterprise reviewer recommends moving to `docs/archive/CODE_REVIEW_TIER1_COMPLETE.md` to reduce document length. Kept here for now as historical reference and verification audit trail.

*Pre-implementation verification performed by Claude Opus 4.5 using 3 parallel Explore agents to cross-check every claim in the original review against actual file contents.*

### Critical Discovery: og:image is BROKEN on live site

**Lines 42 & 53** of `index.html` reference:
```
https://www.europeansummercamps.com/european-summer-camps-lakeside-hero.png
```

But `public/` only contains:
- `european-summer-camps-hero.png` (3.0MB) — the **OLD** hero image, NOT the lakeside one
- `european-summer-camps-lakeside-hero.webp` (127KB) — correct image but **wrong format** (.webp not .png)

**The `.png` file referenced by og:image does NOT exist in `public/`.** Social sharing previews (Facebook, LinkedIn, Twitter, Slack, iMessage link previews) are currently showing a broken/missing image. This must be fixed as part of Tier 1 work.

### Verification Findings

| Item | Review Claim | Verification Result |
|------|-------------|-------------------|
| T1-1 (orphaned src/assets/) | 5 orphaned files ~7.5MB | **Confirmed 6 files ~7.6MB** — also found `camps-map.avif` (126KB) orphaned |
| T1-2 (orphaned public/ hero) | 1 file ~3MB, check og:image first | **og:image references non-existent `.png`** — must fix meta tags before deleting |
| T1-3 (unused shadcn/ui) | 41 unused of 46 | **Confirmed 41 unused** — kept components do NOT import from deleted ones (safe) |
| T1-4 (unused npm packages) | 29 packages | **Confirmed** — verified each @radix-ui package is only used by deleted components |
| T1-5 (dead CSS) | 4 classes | **Confirmed** — no dynamic class construction references them either |
| T1-6 (dead state) | `_showFilters` unused | **Confirmed** — line 116, underscore-prefixed, never referenced |
| T1-7 (duplicate preconnect) | Simple duplicates | **CORRECTION**: Second block (lines 414-419) contains 3 unique domains — must consolidate, not just delete |
| T1-8 (junk meta) | Non-standard meta tags | **Confirmed 13 junk tags** — lines 18-21 and 66-73 |

### T1-7 Consolidation Detail

The original review said "remove the second set of duplicates." Verification found the second block is NOT pure duplicates:

**First block (lines 76-82):** `fonts.googleapis.com`, `googletagmanager.com`, `google-analytics.com`, `vercel.live`
**Second block (lines 414-419):** `fonts.googleapis.com` (DUPLICATE), `fonts.gstatic.com` (UNIQUE — needed for Google Fonts), `vercel.app` (UNIQUE), `vercel.com` (UNIQUE)

**Correct action:** Move the 3 unique entries into the first block, then delete the second block entirely.

### Execution Order (8 commits, one per item)

Each commit is independently revertible via `git revert <hash>`.

#### Commit 1: T1-6 — Remove dead `_showFilters` state variable
- **File**: `src/App.jsx` line 116
- **Action**: Delete `const [_showFilters, _setShowFilters] = useState(false)`
- **Test**: `npm run build`
- **Commit msg**: `Cleanup: Remove unused _showFilters state variable`

#### Commit 2: T1-5 — Remove 4 dead CSS classes
- **File**: `src/App.css`
- **Action**: Delete these class definitions:
  - `.ios-scroll-fix` (line ~82)
  - `.smooth-scroll` (line ~28)
  - `.safe-area-content` (line ~105)
  - `.camp-price-label` (line ~381)
- **Test**: `npm run build` + `npm run dev` (visual spot-check hero, cards, footer)
- **Commit msg**: `Cleanup: Remove 4 unused CSS classes from App.css`

#### Commit 3: T1-8 — Remove 13 junk meta tags from index.html
- **File**: `index.html`
- **Action**: Remove lines 18-21 (`content-type`, `target-audience`, `content-rating`, `content-category`) and lines 66-73 (`rating`, `distribution`, `revisit-after`, `language`, `geo.region`, `geo.placename`, `target`, `audience`)
- **Keep**: All standard tags (viewport, description, robots, og:*, twitter:*, PWA, favicon, theme-color)
- **Test**: `npm run build` + page loads correctly
- **Commit msg**: `Cleanup: Remove 13 non-standard meta tags from index.html`

#### Commit 4: T1-7 — Consolidate duplicate preconnect/DNS-prefetch tags
- **File**: `index.html`
- **Action**:
  1. Fix Block 1: Remove `crossorigin` from `fonts.googleapis.com` preconnect (serves CSS, not CORS)
  2. Add to Block 1 (after line 82): `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />`, `<link rel="dns-prefetch" href="//vercel.app" />`, `<link rel="dns-prefetch" href="//vercel.com" />`
  3. Delete the entire second block (lines shift after junk meta removal in Commit 3)
- **Updated Feb 2**: Final verification found `crossorigin` was incorrectly applied to `fonts.googleapis.com` in Block 1. Google Fonts requires: `fonts.googleapis.com` WITHOUT crossorigin (CSS), `fonts.gstatic.com` WITH crossorigin (font files).
- **Test**: `npm run build` + `npm run dev` + verify Google Fonts render correctly
- **Commit msg**: `Cleanup: Consolidate preconnect/DNS-prefetch tags (remove duplicates, fix crossorigin, keep unique domains)`

#### Commit 5: T1-2 — Fix broken og:image AND remove orphaned public/ hero PNG
- **Files**: `index.html` lines 42 and 53, `public/european-summer-camps-hero.png`, `public/european-summer-camps-lakeside-hero.png` (NEW)
- **Action**:
  1. Generate `european-summer-camps-lakeside-hero.png` from the `.webp` source using sharp (1680x720, optimized PNG)
  2. Place generated PNG in `public/` — this makes the og:image URL valid AND satisfies robots.txt line 99
  3. Keep og:image and twitter:image URLs as-is (they already reference the correct `.png` filename)
  4. Update `og:image:width` to `1680` and `og:image:height` to `720` if not already correct
  5. Delete `public/european-summer-camps-hero.png` (3.0MB — the OLD hero, not referenced anywhere)
- **Updated Feb 2**: Original plan was to switch og:image to `.webp`. Final verification found LinkedIn and some platforms don't reliably support `.webp` for social previews. Generating a proper `.png` from the `.webp` source is safer — all platforms support PNG, and it also satisfies `robots.txt` line 99 which allows crawlers to access this exact filename.
- **IMPORTANT**: This FIXES a currently broken feature on the live site (social sharing previews)
- **Net disk change**: Remove 3.0MB old hero, add ~500-800KB optimized lakeside PNG = net savings ~2.2-2.5MB
- **Test**: `npm run build` + verify meta tags in built `dist/index.html` + verify PNG file exists in `dist/`
- **Commit msg**: `Fix: Generate og:image PNG for social sharing + remove orphaned 3MB old hero from public/`

#### Commit 6: T1-1 — Remove 6 orphaned images from src/assets/
- **Directory**: `src/assets/`
- **Delete these files** (all verified NOT imported in App.jsx lines 60-68):
  - `european-summer-camps-hero.png` (3.0MB) — old hero, replaced by lakeside version
  - `european-summer-camps-map.png` (2.5MB) — original unoptimized map
  - `european-camp-activities-collage.png` (1.9MB) — original unoptimized collage
  - `camps-map.avif` (126KB) — not imported (only `.png` compressed version is used)
  - `camps-map.webp` (67KB) — not imported (only `.png` compressed version is used)
  - `react.svg` (4KB) — Vite template default, never imported
- **Total savings**: ~7.6MB
- **Test**: `npm run build` — Vite fails on missing imports, so a passing build proves none were needed
- **Commit msg**: `Cleanup: Remove 6 orphaned image assets (~7.6MB) from src/assets/`

#### Commit 7: T1-3 — Remove 41 unused shadcn/ui component files
- **Directory**: `src/components/ui/`
- **Keep ONLY these 5 files**:
  - `button.jsx` (imported in App.jsx line 47)
  - `card.jsx` (imported in App.jsx line 48)
  - `badge.jsx` (imported in App.jsx line 49)
  - `breadcrumb.jsx` (imported in App.jsx line 57)
  - `drawer.jsx` (imported in App.jsx line 59)
- **Also keep**: `../lib/utils.js` (utility used by all kept components)
- **Delete all 41 other `.jsx` files** in `src/components/ui/`: accordion, alert, alert-dialog, aspect-ratio, avatar, calendar, carousel, chart, checkbox, collapsible, command, context-menu, dialog, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip
- **Also delete**: `src/hooks/use-mobile.js` — only imported by `sidebar.jsx` (being deleted). Orphaned after this commit.
- **Updated Feb 2**: Original review listed 41 files. Pre-execution verification found `toggle.jsx` and `toggle-group.jsx` also exist and are unused. Final verification found orphaned `src/hooks/use-mobile.js` (only used by sidebar.jsx).
- **Safe because**: Verified that the 5 kept components do NOT import from any of the 41 deleted components. All interdependencies are only among deleted components.
- **Test**: `npm run build` — Vite will error on any missing import
- **Commit msg**: `Cleanup: Remove 41 unused shadcn/ui components + orphaned use-mobile hook`

#### Commit 8: T1-4 — Uninstall 30 unused npm packages
- **Must run AFTER Commit 7** (component files that referenced these packages must be deleted first)
- **Uninstall command**:
  ```bash
  npm uninstall recharts sonner date-fns react-day-picker cmdk gtag @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
  ```
- **Updated Feb 2**: Pre-execution verification changes vs original plan:
  - **REMOVED from uninstall**: `@radix-ui/react-dialog` — vaul depends on it internally (confirmed in `node_modules/vaul/package.json`)
  - **ADDED to uninstall**: `gtag` (GA4 is inline in App.jsx, npm package never imported), `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group` (used only by now-deleted toggle components)
  - Net change: 29 → 30 packages
- **KEEP these packages** (verified in use):
  - `@radix-ui/react-slot` — used by button.jsx, badge.jsx, breadcrumb.jsx
  - `@radix-ui/react-dialog` — required internally by vaul (drawer.jsx)
  - `vaul` — used by drawer.jsx
  - `@tanstack/react-virtual` — intentionally kept for planned virtual scrolling feature
  - `class-variance-authority` — used by button.jsx, badge.jsx
  - `clsx` + `tailwind-merge` — used by lib/utils.js
  - `lucide-react` — icon library used throughout App.jsx
  - `@emailjs/browser` — contact form
- **Test**: `npm run build` + `npm run lint`
- **Note**: This modifies `package.json` and `package-lock.json` — large diff is expected
- **Commit msg**: `Cleanup: Uninstall 30 unused npm packages (shadcn/ui deps + Radix + gtag)`

### Post-Tier-1 Verification Checklist

After all 8 commits, verify:
```
npm run build          # Must pass
npm run lint           # Must pass (warnings will decrease — fewer shadcn files)
npm run dev            # Manual checks:
  [ ] Homepage loads, hero image displays in <picture> element
  [ ] Search works (type "Switzerland", results filter)
  [ ] Category filter buttons work (click "Premium Alpine")
  [ ] Country filter works (footer country links)
  [ ] "All Camps" reset works
  [ ] Camp cards render with badges, buttons, ratings
  [ ] Mobile filter drawer opens (uses vaul/Drawer component)
  [ ] Breadcrumbs display correctly
  [ ] Contact form opens (uses Button component)
  [ ] Google Fonts load (verify preconnect consolidation didn't break)
  [ ] og:image meta tag points to existing .png file (generated from .webp)
  [ ] Generated PNG exists in dist/ after build
```

### Pre-Execution Verification Log (February 2, 2026)

Three rounds of verification performed before execution:

| Round | Agent/Method | Key Findings |
|-------|-------------|-------------|
| 1 | Explore agent (fresh codebase scan) | Confirmed all original Tier 1 claims. Line numbers, file counts, orphaned status all match. |
| 2 | enterprise-code-reviewer (targeted) | Found: `toggle.jsx`/`toggle-group.jsx` missed (43 not 41), `gtag` package unused, `@radix-ui/react-dialog` must be KEPT (vaul dependency) |
| 3 | enterprise-code-reviewer (broad final) | Found: `fonts.gstatic.com` crossorigin fix needed in preconnect consolidation, og:image must be PNG not WebP (LinkedIn compatibility), `src/hooks/use-mobile.js` orphaned, `robots.txt` line 99 references the og:image filename (will be satisfied by generated PNG) |

**Changes from original plan:**
- Commit 4: Added `crossorigin` fix for `fonts.googleapis.com` → `fonts.gstatic.com`
- Commit 5: Generate PNG from WebP instead of switching meta to WebP (platform compatibility)
- Commit 7: 41 → 43 files + orphaned `use-mobile.js` hook
- Commit 8: 29 → 30 packages (−react-dialog, +gtag, +toggle, +toggle-group)

### What Tier 1 Does NOT Touch

- Zero changes to App.jsx logic, filtering, search, analytics, GDPR, camp data, or scroll navigation
- Zero changes to security headers (`public/_headers`), robots.txt, or structured data schemas
- Zero changes to any live user-facing functionality (except fixing broken og:image — net positive)
- SEO meta description country counts (T3-2) were deferred to Tier 3, then **promoted to Tier 2** (item #21) after Feb 2 review found search snippets showing wrong numbers

---

## Section 9: Security Audit (February 3, 2026)

*Fresh audit by security-audit-specialist agent as part of 5-agent parallel review.*

### Security Score: 7.0/10 (ADJUSTED Feb 3 meta-audit — reconciled with Section 1)

*Lowered from 7.5 to 7.0: Vite 4.x CVEs (-0.3) and no spam protection (-0.2) offset X-XSS-Protection fix (+0.5). Will return to 7.5 after T2-33 (Vite upgrade) and T2-34 (honeypot) are implemented.*

**Improvements since September 2025 audit:**
- ✅ `noopener,noreferrer` on all `window.open` calls (Feb 2)
- ✅ `maxLength={200}` on search inputs (Feb 2)
- ✅ CSP `connect-src` updated for GA4 domains (Feb 2)
- ✅ Camp Bjontegaard HTTP→HTTPS fix (Feb 2)

**Remaining issues (mapped to checklist items):**

| Finding | Severity | Checklist Item |
|---------|----------|---------------|
| CSP missing `object-src`, `base-uri`, `form-action` | Medium | T2-20 (#30) |
| No `Permissions-Policy` header | Low | T2-21 (#31) |
| `X-XSS-Protection: 1; mode=block` deprecated | Low | T1-16 |
| No `<noscript>` fallback | Low | T2-23 (#33) |
| No React Error Boundary | Medium | T2-18 (#28) |
| Marquee memory leak (listener accumulation) | Medium | T2-17 (#27) |
| `user-scalable=no` (accessibility, not security) | Low | T2-16 (#26) |

**Noted but deferred — UPDATED Feb 3:**
- ~~Vite 4.x approaching EOL~~ **PROMOTED TO TIER 2** (T2-33): CVEs confirmed, requires immediate action
- Dev server binds to `0.0.0.0` — dev-only, no production impact
- `key={index}` anti-pattern in static camp lists — low risk for static data, not a security issue

**What's working well:**
- HSTS with 1-year max-age + includeSubDomains
- CSP with script-src nonces (via Vercel), img-src whitelist
- GDPR consent gating for both GA4 and Vercel Analytics
- EmailJS service with restricted domain access
- All external links have `target="_blank"` with `noopener,noreferrer`
- Cookie consent stored in localStorage (no tracking cookies without consent)

### Core Web Vitals Status (NEW — Feb 3 second audit)

| Metric | Target | Current Status | Related Items |
|--------|--------|----------------|---------------|
| **LCP** | <2.5s | ✅ `fetchpriority="high"` on hero image (T2-5 DONE) | Hero image optimized, 93-96% size reduction |
| **CLS** | <0.1 | ⚠️ Camp images have container `h-56` but no explicit width/height | T3-20 pending (camp card images) |
| **INP** | <200ms | ✅ Not measured, no known issues | React event handlers are lightweight |

*Monitor via PageSpeed Insights and Lighthouse regularly.*

### Accepted Risks (NEW — Feb 3 second audit)

The following are known limitations accepted for this project:

| Risk | Rationale | Mitigation |
|------|-----------|------------|
| `'unsafe-inline'` in CSP for styles | Required for Tailwind CSS and React inline styles | Low risk — no user-generated CSS |
| No SRI for dynamically loaded scripts | GA4 and Vercel scripts are dynamically generated; SRI hashes not feasible | Domain-restricted CSP provides partial protection |
| EmailJS credentials in frontend source | By design — EmailJS is intended for client-side use | Domain restrictions + honeypot (T2-34) |
| Dev server binds to `0.0.0.0` | Development only, no production impact | Documented, not a production issue |
| `key={index}` in static camp lists | Low risk for static data that never reorders | Acceptable performance trade-off |

### Security Maintenance Schedule (NEW — Feb 3 second audit)

| Frequency | Action | Notes |
|-----------|--------|-------|
| **Monthly** | Run `npm audit` | Address HIGH/CRITICAL findings immediately |
| **Monthly** | Check Vercel security dashboard | Review deployment logs for anomalies |
| **Quarterly** | Review and update dependencies | `npm outdated`, evaluate breaking changes |
| **Quarterly** | Re-run security-audit-specialist agent | Fresh audit against current codebase |
| **Annually** | Review security headers | Compare against latest OWASP recommendations |
| **As needed** | Check for CVEs in major dependencies | Subscribe to Vite, React security advisories |

---

## Appendix: Review Execution Log

| Pass | Agent/Method | Duration | Status |
|------|-------------|----------|--------|
| 0 | 2x Explore agents (parallel) | Completed | All codebase data gathered |
| 1 | enterprise-code-reviewer (run 1) | Completed | Full report received |
| 2 | seo-performance-optimizer (run 1) | Completed | Full report received |
| 3 | Direct Claude analysis | Completed | 8 audits performed |
| 4 | enterprise-code-reviewer (validation run) | 2m42s | Confirmed findings + 3 new items |
| 5 | seo-performance-optimizer (validation run) | Completed | Confirmed findings + 6 new items |
| 6 | enterprise-code-reviewer (architecture pass) | Completed | Buyer-readiness assessment, code organization, naming review |
| 7 | 3x Explore agents (parallel verification, Feb 2) | Completed | Cross-checked all Tier 1 claims against actual files. Found og:image broken, T1-7 consolidation needed, confirmed all other claims. |
| 8 | enterprise-code-reviewer (Tier 2 plan review, Feb 2) | Completed | Assessed all 14 items. Found: T2-7 missing from checklist, T2-8 should be Tier 3, T2-14/T2-15 should be reordered to last, T2-2 image import complication. |
| 9 | seo-performance-optimizer (Tier 2 plan review, Feb 2) | Completed | Assessed all SEO items. Found: T3-1 should promote to Tier 2 (analytics data loss), T3-2 should promote with caution (wrong search snippets), T3-13 should demote to Tier 4 (removing schema risky). |
| 10 | enterprise-code-reviewer (Tier 2 code verification, Feb 2) | Completed | Verified all line numbers accurate. Confirmed allCamps at 222-1409, search inputs at 2213/2742, window.open at 4 locations, filterOptions at 1515. No hidden risks found. |
| 11 | seo-performance-optimizer (Tier 2 file verification, Feb 2) | Completed | **KEY FINDING**: fetchpriority="high" ALREADY EXISTS at line 2118 — T2-5 is already done. Also found og:image:height wrong (1680 vs 720). Confirmed all other claims accurate. |
| 12 | 2x Explore agents (fresh verification, Feb 2 session 2) | Completed | Confirmed clean revert of all T2-1 attempts. No artifacts. All T2 items still untouched. File is CRLF, 5,823 lines. Root cause: node split on `\n` not `\r\n`. |
| 13 | 5-agent parallel fresh audit (Feb 3) | Completed | enterprise-code-reviewer on review docs + codebase, seo-performance-optimizer on review docs + codebase, security-audit-specialist on codebase. All findings manually verified against actual code. |
| 14 | Manual code verification (Feb 3) | Completed | Verified 10 key findings: marquee leak (confirmed), duplicate footer (confirmed), breadcrumb double-call (confirmed), scroll listener deps (confirmed), maxLength already present (agent wrong), Vercel analytics gated (agent wrong), line 217 comment (confirmed), ItemList incomplete (confirmed), CSP gaps (confirmed), user-scalable=no (confirmed). |

---

## Section 10: Tier 2 Pre-Implementation Verification (February 2, 2026)

*4 parallel agents reviewed the Tier 2 plan and affected code simultaneously.*

### Methodology
| Agent | Focus | Key Contribution |
|-------|-------|-----------------|
| enterprise-code-reviewer #1 | Review the PLAN itself | Found missing checklist item, reclassification needed, execution order issues |
| seo-performance-optimizer #1 | Review the PLAN's SEO items | Identified promotions/demotions, risk assessment per item |
| enterprise-code-reviewer #2 | Verify ACTUAL CODE matches plan claims | Confirmed all line numbers, found image import complication |
| seo-performance-optimizer #2 | Verify ACTUAL FILES for SEO items | Found fetchpriority already exists, og:image:height error |

### Changes Made to Tier 2 Plan

| Change | Source Agent | Rationale |
|--------|------------|-----------|
| REMOVE T2-5 (fetchpriority) | SEO file reviewer | Already implemented at App.jsx line 2118 |
| RECLASSIFY T2-8 to Tier 3 | Enterprise plan reviewer | 140-line battle-tested code on DO NOT TOUCH list; mobile-critical (70% traffic) |
| ADD T2-7 to checklist | Enterprise plan reviewer | Was described in Section 3 but missing from Section 5 checklist |
| PROMOTE T3-1 to Tier 2 | SEO plan reviewer | CSP may be blocking GA4 — analytics data loss is blind spot for SEO decisions |
| PROMOTE T3-2 to Tier 2 | Both SEO reviewers | Search snippets showing "13 countries" and "21 countries" when actual is 24 |
| ADD og:image:height fix | SEO file reviewer | Says 1680, actual image is 1680x720 — should be 720 |
| DEMOTE T3-13 to Tier 4 | SEO plan reviewer | Removing structured data riskier than keeping non-functional schema |
| NOTE T2-2 complication | Enterprise plan reviewer | Image imports (heroImage etc.) must move with camp data to new file |
| REORDER T2-14, T2-15 | Enterprise plan reviewer | Documentation should come LAST after all code changes |
| NOTE T2-9 dependency | Enterprise plan reviewer | filterOptions useMemo depends on T2-1 (empty deps if allCamps module-level) |

### T2-1 Implementation Note (CRLF Issue)

**Previous session attempted T2-1 three times — all failed and were reverted.**

**Root cause:** Node scripts split on `\n` but App.jsx uses CRLF (`\r\n`). Orphaned `\r` characters corrupted the file.

**Working approach:** Use CRLF-aware node script:
```javascript
const lineEnding = content.includes('\r\n') ? '\r\n' : '\n';
const lines = content.split(lineEnding);
// ... move block ...
fs.writeFileSync('src/App.jsx', newLines.join(lineEnding), 'utf8');
```

**Key details for the move:**
- `const allCamps = [` at line 223 (0-indexed: 222)
- Closing `]` at line 1409 (0-indexed: 1408)
- Insert above `function App()` at line 112 (0-indexed: 111)
- De-indent by 2 spaces (block was inside function)
- Image imports (lines 61-68) are already at module level — no move needed
- **Fallback:** PowerShell handles CRLF natively if node fails again

### Verification Results

All Tier 2 claims verified against actual code:
- allCamps at lines 222-1409 inside function App() at line 112 ✅
- Search inputs at lines ~2213 and ~2742 with no maxLength ✅
- 4 window.open calls at lines ~109, ~2526, ~3063, ~3243 ✅
- filterOptions at ~line 1515, not wrapped in useMemo ✅
- numberOfItems is string "100+" in index.html ✅
- Sitemap caption says "42 organizations...23 countries" ✅
- Camp Bjontegaard has HTTP URL at line ~539 ✅
- Crawl-delay: 1 at robots.txt line ~105 ✅
- og:image:height claims 1680 (should be 720) ✅
- fetchpriority="high" ALREADY EXISTS at line 2118 ✅

---

*This review document is a living audit. Updated February 3, 2026 with 8-agent meta-audit findings.*
*Follow the Implementation Checklist (Section 5) in order, one item per commit.*
*Always test with `npm run build` + `npm run dev` after each change.*

*Total checklist items: **77** (Tier 1: 8 done + 7 pending = 15, Tier 2: 16 done + 20 pending = 36, Tier 3: 10 done/promoted + 8 pending = 18, Tier 4: 8)*

*February 3, 2026 second audit: Added 9 new items (T1-17, T1-18, T2-29, T2-30, T3-27, T3-28, T3-29 and updates). Consolidated 2 duplicates (T2-22 → T1-16, T3-24 → T2-29). Promoted T1-11 → T2-31, T3-25 → T2-32.*

*February 3, 2026 5-agent audit: Added 14 new items. Key additions: legal privacy fix, Vite security upgrade, CAPTCHA for contact form, Organization schema improvements, robots.txt cleanup.*

*February 3, 2026 8-agent meta-audit: Scores reconciled (SEO 6.0, Security 7.0). Promoted T3-22 → T2-33 (Vite CVEs), T3-23 → T2-34 (honeypot). Added T3-31 (testing), T3-32 (alt text), T3-33 (lazy loading), T3-34 (CWV baseline). Quick Reference section added. Known Gaps updated with checklist cross-references.*

*Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>*
