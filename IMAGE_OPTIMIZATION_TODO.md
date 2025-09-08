# HERO IMAGE OPTIMIZATION - CRITICAL PRIORITY

## Current Status
- **Hero Image**: `src/assets/european-summer-camps-lakeside-hero.png` (1.67MB - still too large!)
- **Build Output Shows**: 1,674.34 kB in production build
- **LCP Impact**: Major performance bottleneck for Core Web Vitals

## Required Actions
1. **Create Optimized Versions**:
   - AVIF format: Target <150KB (`hero-lakeside.avif`)
   - WebP format: Target <300KB (`hero-lakeside.webp`) 
   - Compressed PNG: Target <500KB (fallback)

2. **Image Location**: Save in `src/assets/`

3. **Code Implementation**: Update `src/App.jsx` around line 463-469
   - Replace CSS background-image with `<picture>` element
   - Add proper alt text, dimensions, and fetchPriority="high"
   - Maintain existing gradient overlay functionality

## Next Session Steps
1. Use image optimization tools (ImageOptim, Squoosh.app, or similar)
2. Implement the picture element code from IMPLEMENTATION_CHECKLIST.md
3. Test LCP improvement in DevTools
4. Deploy and verify performance gains

**Priority**: CRITICAL - This is the #1 performance bottleneck identified in audits

*Created: September 8, 2025*