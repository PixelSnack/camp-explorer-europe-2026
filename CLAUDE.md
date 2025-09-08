# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Camp Explorer Europe 2026 is a sophisticated React-based web application showcasing 100+ verified European summer camps. It features advanced search/filtering, comprehensive camp data, and modern responsive design optimized for camp discovery and selection.

## Core Architecture

- **Framework**: React 18 + Vite (single-page application)
- **Styling**: Tailwind CSS with custom components and shadcn/ui component library
- **State Management**: React hooks (useState, useEffect) - no external state library
- **Main Data**: All camp data is embedded in `src/App.jsx` as a JavaScript array (`allCamps`)
- **Component Structure**: Monolithic component in `App.jsx` with shadcn/ui components in `src/components/ui/`

## Essential Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:5173
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
npm run lint         # Run ESLint (important - always run before commits)

# No test suite currently configured
```

## Key Implementation Details

### Camp Data Structure
- Located in `src/App.jsx` starting around line 23
- Each camp object includes: id, name, location, country, ages, price, category, activities, languages, highlights
- 8 camp categories: premium, academic, language, sports, family, budget, unique
- Price ranges from €330 to CHF 6,980

### Search & Filtering System
- Real-time search across camp names, locations, countries (searchTerm state)
- Category filtering with dynamic result counts (selectedFilter state)  
- Country-based filtering (selectedCountry state)
- Combined search + filter logic in filtering functions

### Component Architecture
- Single large component in `App.jsx` (~2000+ lines)
- Uses shadcn/ui components extensively (Button, Card, Badge, etc.)
- Path alias configured: `@/` maps to `./src/`
- Images stored in `src/assets/` and imported directly

### Styling Approach
- Tailwind CSS with custom utilities in `src/App.css`
- Responsive design: mobile-first with tablet/desktop breakpoints
- Color-coded camp categories with custom CSS classes
- Heavy use of Tailwind utility classes throughout JSX

## Build Configuration

- **Vite config**: Optimized bundle splitting for React/React-DOM and Lucide icons
- **ESLint**: Configured for React with hooks and refresh plugins
- **Tailwind**: Basic setup scanning all JS/JSX files
- **Deployment**: Configured for Vercel with proper base path and asset handling

## Development Guidelines

- Follow existing patterns when adding new camps to `allCamps` array
- Maintain consistent data structure for camp objects
- Use existing shadcn/ui components before creating custom ones
- Stick to inline Tailwind classes matching existing style patterns
- Test search/filter functionality thoroughly when modifying camp data
- Always run `npm run lint` before making commits

## File Organization

```
src/
├── App.jsx           # Main application component (contains all camp data)
├── App.css           # Custom global styles and utilities
├── main.jsx          # React entry point
├── assets/           # Images and static media
├── components/ui/    # shadcn/ui component library
├── lib/utils.js      # Utility functions (mainly cn class merging)
└── hooks/            # Custom React hooks
```

## Project Context & Business Strategy

### ResourceHub Overview
This site is part of **ResourceHub** - an umbrella project for building authoritative niche informational websites. Other sites include Pinworm Guide (completed). All sites follow the same strategy: become the #1 Google resource for their specific topic through comprehensive content and enterprise-level SEO.

### Business Model & Goals
- **Target Audience**: Parents seeking European summer camps for children/youth (up to 24 years, preferably younger)
- **Primary Goal**: Become the definitive one-stop resource for European summer camps for kids and youth
- **Monetization Strategy**: Generate traffic to eventually monetize through data sales, site sales, or premium camp listing fees
- **User Journey**: Comprehensive information → direct links to camp websites (no booking handling)

### Content Strategy & Quality Standards
- **Camp Selection Criteria**: Price ranges, age groups, activities, accreditation, location, themes (academic, sports, etc.)
- **Verification Process**: Extensive internet research using camp websites, review sites, 3rd party sources, and AI cross-referencing
- **Quality Assurance**: Must verify camps are real, relevant, with accurate data, pricing, and working website links
- **Camp Types**: Both smaller local camps and larger international camps, all serving kids/youth demographic

### SEO & Growth Strategy
- **Enterprise-level SEO**: Every element optimized for search terms parents would use
- **File Naming**: All files and URLs must follow SEO best practices  
- **Content-First Approach**: Build comprehensive guides before websites, covering topics not found elsewhere
- **Traffic Goal**: Become #1 Google result for European summer camp searches

### Technical Deployment Workflow
- **Development**: GitHub → GitHub Desktop → Push to Vercel
- **Infrastructure**: GitHub (PixelSnack), Vercel deployment, CloudFlare domains
- **Tools Available**: GitHub CLI and Vercel CLI configured in Claude Code environment

### Recent Technical Updates (September 2025)
- **Google Search Console Issues Fixed**: Resolved all critical structured data errors including missing image properties, priceValidUntil, hasMerchantReturnPolicy, and shippingDetails
- **404 Errors Resolved**: Removed invalid hreflang references to non-existent language directories (/de/, /fr/, /es/) that were causing crawl errors
- **Social Media Meta Tags Updated**: Corrected og:image and twitter:image to reference current lakeside hero image instead of outdated version
- **Sitemap Optimized**: Updated with current modification dates and proper image references, ready for search engine resubmission
- **JSON-LD Structured Data**: Fixed parsing errors and validation issues across all schema markup

### CRITICAL SEO ARCHITECTURE ISSUES IDENTIFIED (September 2025)
**Major Discovery**: Comprehensive code audit revealed excellent implementation quality BUT critical SPA indexing limitations:

1. **Single-Page Architecture Problem**: Google can only index homepage (1 of 22 sitemap URLs). Hash-based navigation (#discover, #guide, etc.) cannot be crawled as separate pages.

2. **Sitemap Contains Fake URLs**: Current sitemap lists 22 URLs with hash fragments that don't exist as server-rendered pages:
   - `/#discover`, `/#guide`, `/#resources?section=booking-timeline`
   - `/#discover?country=Switzerland` etc.
   - Google marks these as "Discovered - not indexed"

3. **Schema.org Product Misuse**: Using Product/Offer schema for camps in index.html is incorrect - camps aren't e-commerce products. Should use Organization/EducationalOrganization.

### IMMEDIATE IMPLEMENTATION PLAN (Approved September 2025)

**PHASE 1 (Week 1) - ZERO RISK QUICK WINS:**
- Add security headers to `public/_headers` (HSTS, CSP, nosniff, frame-options)
- Clean sitemap to only real URLs, resubmit to GSC
- Fix accessibility: "View Details & Book" needs unique aria-labels (App.jsx:1097)
- Fix footer filters: Convert `<li onClick>` to `<button>` for keyboard access (App.jsx:2591-2598)
- Hero image: Convert CSS background to `<img>` with `fetchpriority="high"`

**PHASE 2 (Weeks 2-4) - ARCHITECTURE UPGRADE:**
- Implement React Router alongside existing hash navigation
- Create real routes: `/guide`, `/discover/switzerland`, `/category/premium`
- Extract components while preserving all existing functionality
- Add static generation (Next.js integration or Vite SSG)

**PHASE 3 (Weeks 5-8) - SEO OPTIMIZATION:**
- Generate dedicated country/category pages with unique content
- Replace Product schema with proper Organization schema
- Add About/Privacy pages for E-E-A-T
- Implement proper structured data per page type

### Code Quality Assessment (September 2025)
**REALITY CHECK**: After reading entire 2,675-line codebase systematically:

**✅ ALREADY EXCELLENT:**
- Accessibility: Skip links, ARIA labels, touch targets, descriptive alt text
- Performance: Lazy loading, proper image handling, mobile-first CSS
- Security: Most headers configured, strategic robots.txt  
- Code quality: Well-structured components, clean data model
- UX: Advanced filtering, comparison tools, comprehensive content

**❌ ONLY 3 CRITICAL ISSUES:**
1. Footer accessibility (keyboard navigation)
2. Repeated button text (screen reader issue)  
3. Missing HSTS header

**Audit Accuracy**: PDF audit claims were 70% inaccurate/exaggerated. HTML audit was much more accurate.

## SEO & Technical Health Status

### Search Engine Optimization (Updated Sept 2025)
- **CRITICAL ISSUE**: Sitemap contains 22 hash-fragment URLs that cannot be indexed (must fix immediately)
- **Structured Data**: Clean on homepage but using incorrect Product schema for camps (needs Organization schema)
- **Open Graph Tags**: Properly configured with correct hero image references
- **Meta Tags**: Complete title, description, keywords, and social media optimization
- **Search Console Status**: Only 1 URL indexed (homepage), 22 "Discovered - not indexed"
- **IMMEDIATE ACTION**: Clean sitemap, implement real routes for proper indexation

### Current Hero Image
- **Filename**: `european-summer-camps-lakeside-hero.png`
- **Location**: `src/assets/`
- **Usage**: Referenced in App.jsx and all social media meta tags
- **Note**: Ensure consistency across all meta tags when updating images

## Important Notes

- Camp data is hardcoded in JavaScript - no external API or CMS
- No backend or database - purely static frontend application
- Images are imported and bundled with Vite
- Responsive design heavily tested across device sizes
- SEO and performance optimized for camp discovery use case
- All development decisions should prioritize SEO, user experience, and content quality
- Always verify social media meta tags match current assets when making image updates

## ResourceHub Universal Lessons Learned

Based on the Camp Explorer Europe 2026 project development, here are 10 key universal principles for building successful ResourceHub niche authority websites:

### Technical Foundation
1. **Structured Data Excellence**: Complete JSON-LD schema with all required properties (images, pricing, merchant policies). Missing properties cause Search Console errors that directly impact rankings.

2. **Social Media Meta Synchronization**: og:image and twitter:image must stay synchronized with actual hero images. Mismatched references create confusing user experiences in social shares.

3. **Strategic Robots.txt Configuration**: Allow beneficial AI assistants (ChatGPT, Claude, Perplexity, FacebookBot) for discoverability. Block data scrapers (CCBot, Google-Extended) but allow SEO tools (Ahrefs, Semrush). Align blocking strategy with business goals, not generic security advice.

### SEO Architecture  
4. **Clean URL Structure**: Never reference non-existent pages in hreflang tags or sitemaps. Invalid language directories create 404 crawler errors that harm SEO health.

5. **Proactive Sitemap Maintenance**: Update lastmod dates after significant changes, include proper image references, and resubmit to search engines to accelerate re-crawling and indexing.

### Content Strategy
6. **Comprehensive Data Over Surface Content**: 100+ verified entries with detailed information (pricing, specifications, unique features) outperforms thin directory listings. Quality verification builds authority and user trust.

### User Experience
7. **Advanced Search/Filter Systems**: Real-time search across multiple fields with category filtering and dynamic result counts. Combined search + filter logic must work reliably across all use cases.

8. **Mobile-First Performance**: Most niche resource discovery happens on mobile. Responsive design and performance optimization for mobile networks is mandatory, not optional.

### Business Intelligence
9. **Search Console Monitoring**: Google Console issues directly impact rankings. Fix structured data errors immediately as they compound over time. Weekly audits prevent small issues becoming major problems.

10. **Technical Documentation**: Maintain comprehensive documentation (like this CLAUDE.md) covering current technical state, hero image filenames, SEO status, and resolved issues to prevent regression.

### ResourceHub Implementation Framework
For each new niche site: Start with comprehensive data collection → Implement complete structured data → Set up consistent social media meta tags → Configure strategic robots.txt → Create detailed sitemaps → Monitor Search Console weekly → Document all technical decisions.

**Success Metrics**: Zero critical Search Console errors, complete structured data validation, consistent social media previews, growing organic traffic from target keywords, AI assistant accessibility for user queries.

## CURRENT IMPLEMENTATION STATUS (September 8, 2025)

### Comprehensive Analysis Complete ✅
- **Full codebase reviewed**: 2,675 lines in App.jsx + all supporting files
- **All audit reports analyzed**: PDF (inaccurate), HTML (accurate), backlog.md, deepsearch-report.md
- **Critical issues identified**: SPA indexing problem is the main blocker
- **Code quality verified**: Exceptionally well-written, 90% of "issues" already resolved

### Next Session Continuation Point
**If Claude session resets, continue from:**
1. **PHASE 1 implementation** - Start with security headers in `public/_headers`
2. **Sitemap cleanup** - Remove all hash URLs, keep only `/` until real routes exist  
3. **Accessibility fixes** - Fix App.jsx lines 1097 (buttons) and 2591-2598 (footer)
4. **Hero image optimization** - Convert CSS background to HTML `<picture>` element

### Key Files to Reference
- `CLAUDE.md` - This file (comprehensive project documentation)
- `src/App.jsx` - Main component (2,675 lines, well-structured)
- `public/sitemap.xml` - Contains 22 fake hash URLs (needs cleaning)
- `public/_headers` - Security headers (needs HSTS, CSP additions)
- `index.html` - Contains incorrect Product schema (lines 121-279)

### Implementation Safety Notes
- **PRESERVE existing functionality** - filtering, search, navigation all work excellently
- **Additive approach** - Add React Router alongside hash navigation initially
- **Risk mitigation** - Test thoroughly, maintain fallbacks, deploy incrementally
- **Code quality** - Already excellent, needs architectural SEO enhancement only

### Business Context Reminder
- **12 camp organizations** representing 100+ individual programs
- **Target**: Become #1 for "European summer camps" on Google  
- **Current traffic**: 20 visitors/week, 70% bounce (single-page issue)
- **Monetization**: Eventually through data sales, site sales, or premium listings