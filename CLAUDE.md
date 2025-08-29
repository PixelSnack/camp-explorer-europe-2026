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

### Immediate Priorities
1. **Mobile Optimization**: Enhance iOS and Android interface (currently PC-optimized)
2. **Geographic Expansion**: Add Scandinavia camps (high priority), then other European countries
3. **Content Growth**: Continuously add more verified camps with rich, detailed information

## Important Notes

- Camp data is hardcoded in JavaScript - no external API or CMS
- No backend or database - purely static frontend application
- Images are imported and bundled with Vite
- Responsive design heavily tested across device sizes
- SEO and performance optimized for camp discovery use case
- All development decisions should prioritize SEO, user experience, and content quality