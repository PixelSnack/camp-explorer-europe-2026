# CAMP EXPLORER EUROPE - QUICK REFERENCE CARD

## 🚨 CRITICAL ISSUES TO FIX (Priority Order)
1. **3MB Hero Image** - Major LCP bottleneck (public/european-summer-camps-hero.png)
2. **Fake Sitemap URLs** - 22 hash fragments Google can't index
3. **Product Schema Wrong** - Using e-commerce schema for camps (lines 121-279 in index.html)
4. **Footer Not Keyboard Accessible** - `<li onClick>` needs `<button>` (App.jsx:2591-2598)
5. **Repeated Button Text** - "View Details & Book" needs unique labels (App.jsx:1097)

## ⚡ PHASE 1 QUICK WINS (Week 1)
- [x] Add HSTS + CSP to `public/_headers` (COMPLETED ✅)
- [x] Clean sitemap to single URL only (COMPLETED ✅)
- [x] Fix button aria-labels and footer keyboard access (COMPLETED ✅)
- [ ] Convert 3MB PNG to optimized WebP/AVIF <300KB (REQUIRES IMAGE TOOLS)
- [ ] Deploy via GitHub Desktop → Vercel

## 📁 KEY FILES & LOCATIONS
- **Main Component**: `src/App.jsx` (2,675 lines, well-structured)
- **Sitemap**: `public/sitemap.xml` (remove 22 fake URLs)
- **Security**: `public/_headers` (add HSTS, CSP, nosniff)
- **Schema**: `index.html` lines 121-279 (fix Product→Organization)
- **Hero Image**: `public/european-summer-camps-hero.png` (3MB→<300KB)

## 🎯 SUCCESS METRICS
- Google Search Console: 1→10+ indexed pages
- Core Web Vitals: LCP <2.5s, CLS <0.1
- Lighthouse: Performance 90+, Accessibility 100
- Traffic: 20→500 monthly sessions

## ⚡ EMERGENCY COMMANDS
```bash
npm run build    # Must pass before deploy
npm run lint     # 6 shadcn warnings OK
git reset --hard HEAD~1  # Rollback if broken
```

## 🚀 DEPLOYMENT WORKFLOW
1. GitHub Desktop push (NOT command line)
2. Vercel auto-deploys from main branch
3. Test live site: https://www.europeansummercamps.com/
4. Monitor Vercel dashboard

## 📊 CURRENT STATUS (Sept 8, 2025)
- ✅ Code quality: EXCELLENT (90% of audit claims wrong)
- ✅ Build/lint: WORKING
- ❌ SEO architecture: NEEDS REAL ROUTES
- ❌ Hero image: 3MB PERFORMANCE KILLER
- 🎯 Ready for Phase 1 implementation

**NEXT SESSION: Read CLAUDE.md → Follow IMPLEMENTATION_CHECKLIST.md**