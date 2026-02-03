# CODE STRUCTURE - Camp Explorer Europe 2026

*Technical reference for codebase architecture and App.jsx structure*

**Created:** January 24, 2026
**Last Updated:** February 2, 2026
**Purpose:** Quick reference for understanding code organization

---

## File Structure Overview

```
camp-explorer-europe-2026/
├── src/
│   ├── App.jsx              # Main component (~4,636 lines)
│   ├── data/
│   │   └── camps.js         # Camp data array (52 orgs, ~1,196 lines)
│   ├── App.css              # Custom global styles + marquee system
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind imports
│   ├── assets/              # Optimized images (93-96% reduced)
│   │   ├── hero-lakeside.avif
│   │   ├── hero-lakeside.webp
│   │   ├── hero-lakeside-compressed.png
│   │   ├── activities-collage.avif
│   │   ├── activities-collage.webp
│   │   ├── activities-collage-compressed.png
│   │   ├── camps-map-compressed.png
│   │   └── european-summer-camps-lakeside-hero.png
│   └── components/ui/       # shadcn/ui component library (5 files)
│       ├── badge.jsx
│       ├── breadcrumb.jsx
│       ├── button.jsx
│       ├── card.jsx
│       └── drawer.jsx
├── public/
│   ├── _headers             # Security headers (HSTS, CSP)
│   ├── sitemap.xml          # SEO sitemap
│   ├── robots.txt           # Bot/AI crawler config
│   ├── favicon.ico          # Multi-size favicon
│   ├── favicon.svg          # Vector favicon
│   ├── apple-touch-icon.png # iOS icon
│   └── android-chrome-*.png # Android/PWA icons
├── .claude/
│   └── agents/              # Specialized agent instructions (READ-ONLY)
│       ├── camp-data-verifier.md
│       ├── camp-content-researcher.md
│       ├── seo-performance-optimizer.md
│       ├── security-audit-specialist.md
│       └── enterprise-code-reviewer.md
├── docs/
│   ├── strategy/            # Future planning documents
│   └── archive/             # Historical/completed work
├── package.json
├── vite.config.js
├── tailwind.config.js
├── jsconfig.json
└── [documentation .md files]
```

---

## App.jsx Structure (~4,636 lines)

*Camp data extracted to `src/data/camps.js` (February 2, 2026)*

### Section Map

| Lines | Section | Description |
|-------|---------|-------------|
| 1-67 | **Imports** | React, Vercel, EmailJS, shadcn/ui, Lucide icons, images, camps.js |
| 8-46 | **GA4 & Tracking** | Analytics initialization, GA4 config |
| 70-108 | **Constants & Tracking** | Scroll thresholds, UTM builder, click tracking |
| 110-197 | **Component State** | function App(), all useState hooks |
| 199-222 | **Form Scroll Lock** | useEffect for contact form |
| 223-289 | **Multilingual Search** | European language translations |
| 290-335 | **Filtering Logic** | filteredCamps useMemo, filterOptions useMemo |
| 337-512 | **Navigation Handlers** | Filter handlers, navigation, comparison |
| 513-917 | **useEffects** | Routing, GDPR, marquee, scroll, mobile menu |
| 918-1164 | **Home Section** | Hero, search, camp grid, CTA |
| 1165-1920 | **Discover Section** | Standalone discover page |
| 1921-2120 | **Compare Section** | Side-by-side comparison |
| ~2120-2600 | **Plan Section** | Planning timeline |
| ~2600-3200 | **Guide Section** | Parent guide content |
| ~3200-3600 | **Privacy Section** | GDPR privacy policy |
| ~3600-3880 | **Footer** | Navigation links, stats |
| ~3880-3920 | **Cookie Banner** | GDPR consent modal |
| ~3920-4100 | **Impressum & Terms** | EU legal notices |
| ~4100-4400 | **About Section** | Research methodology |
| ~4400-4620 | **Contact Form & Drawer** | EmailJS modal, filter drawer |
| 4635 | **Closing** | Export default App |

### camps.js Structure (~1,196 lines)

| Lines | Content |
|-------|---------|
| 1-5 | Imports (heroImage, activitiesCompressed, mapCompressed) |
| 7-1193 | `export const allCamps = [...]` (52 camp objects) |
| 1195-1196 | Re-exports (activitiesCompressed, mapCompressed) + default export |

---

## Key Code Locations

### Camp Data (src/data/camps.js)

```javascript
// In src/data/camps.js
import heroImage from '../assets/european-summer-camps-lakeside-hero.png'
import activitiesCompressed from '../assets/activities-collage-compressed.png'
import mapCompressed from '../assets/camps-map-compressed.png'

export const allCamps = [
  {
    id: 1,
    featured: true,  // Premium listing flag
    name: "Les Elfes International",
    location: "Verbier, Switzerland",
    country: "Switzerland",
    ages: "6-17 years",
    price: "From CHF 4,550",
    priceRange: "premium",  // budget | mid | premium | luxury
    rating: 4.9,
    reviews: 847,
    image: heroImage,
    category: "premium",  // See categories below
    type: "Alpine Adventure",
    activities: ["Activity1", "Activity2", ...],
    dates: "June - August 2026",
    highlights: ["Highlight1", "Highlight2", ...],
    languages: ["English", "French", ...],
    specialFeatures: ["Feature1", "Feature2", ...],
    established: 1987,
    capacity: 180,
    bookingUrl: "https://...",
    videoUrl: "https://..."  // Optional
  },
  // ... 51 more camps (52 total)
]

// Re-exported for use in App.jsx JSX
export { activitiesCompressed, mapCompressed }
```

### Categories

| Category | Value | Description |
|----------|-------|-------------|
| Premium Alpine | `premium` | CHF 4,000+ Swiss/Austrian camps |
| Academic & STEM | `academic` | University prep, learning focus |
| Language Immersion | `language` | Primary language learning |
| Sports Specialty | `sports` | Dedicated sports training |
| Family Programs | `family` | Parents can attend |
| Budget Excellence | `budget_excellence` | Quality under €2,000 |
| Unique Experiences | `unique` | Nature-based, wilderness |

### Price Ranges

| Range | Value | Typical Price |
|-------|-------|---------------|
| Budget | `budget` | €330 - €1,999 |
| Mid | `mid` | €2,000 - €3,999 |
| Premium | `premium` | €4,000 - €5,999 |
| Luxury | `luxury` | €6,000+ |

---

## State Management (Lines 110-197)

```javascript
// Core UI State
const [isMenuOpen, setIsMenuOpen] = useState(false)
const [activeSection, setActiveSection] = useState('home')
const [showContactForm, setShowContactForm] = useState(false)
const [showBackToTop, setShowBackToTop] = useState(false)

// Filtering State
const [selectedFilter, setSelectedFilter] = useState('all')      // Category filter
const [searchTerm, setSearchTerm] = useState('')
const [selectedCountries, setSelectedCountries] = useState([])   // Multi-select (empty = all)
const [selectedPriceTier, setSelectedPriceTier] = useState('all') // Single-select
const [selectedAgeGroups, setSelectedAgeGroups] = useState([])   // Multi-select (empty = all)
const [filterSheetOpen, setFilterSheetOpen] = useState(false)    // Mobile drawer
const [openDropdown, setOpenDropdown] = useState(null)           // Desktop dropdown state
const dropdownRef = useRef(null)                                 // Click-outside detection
const [selectedCamps, setSelectedCamps] = useState([])           // For comparison

// Contact Form State
const [isSubmittingForm, setIsSubmittingForm] = useState(false)
const [formSubmitted, setFormSubmitted] = useState(false)

// GDPR State
const [cookieConsent, setCookieConsent] = useState(null)
const [showCookieBanner, setShowCookieBanner] = useState(false)
```

---

## Key Functions

### Navigation & Filtering

| Function | Line | Purpose |
|----------|------|---------|
| `handleNavigation(section)` | ~1172 | Navigate to section, update hash |
| `handleCategoryFilter(category)` | ~1201 | Filter by category, reset others |
| `toggleCountry(name)` | — | Toggle country in multi-select array |
| `toggleAgeGroup(value)` | — | Toggle age group in multi-select array |
| `clearAllFilters()` | — | Reset all filters (countries, price, age, search, category) |
| `activeFilterCount` | — | Count of active filter dimensions (derived) |
| `handleCampSelection(camp)` | ~1181 | Add/remove from comparison (max 3) |
| `handleResourceLink(resource)` | ~1212 | Navigate to resource sections |
| `scrollToTop()` | ~1805 | Smooth scroll to top + GA4 event |
| `scrollToLastCamp()` | ~1813 | Scroll to last visible camp card + GA4 event |

### Filter System Architecture

**Multi-select** (Country, Age Group): State is an array. Empty = all. Toggle adds/removes items. OR logic within filter type, AND across filter types.

**Single-select** (Price Tier): State is a string ('all' or tier name).

**UI Components:**
- **Desktop**: Custom dropdown menus with click-outside + Escape key dismissal
- **Mobile**: FAB button → vaul Drawer bottom sheet
- **Filter chips**: Rendered above camp grid with individual dismiss buttons
- **Clear all**: Red pill button, visible when 1+ filters active

**Known duplication**: Filter dropdowns + chips are duplicated in Home (~line 1039) and Discover (~line 1569) sections. TODO: Extract shared `<FilterBar />` component.

### Analytics & Tracking

| Function | Line | Purpose |
|----------|------|---------|
| `initializeGA4()` | ~11 | Load and configure Google Analytics 4 |
| `buildOutboundUrl(url, camp)` | ~75 | Add UTM parameters to booking links |
| `trackOutboundClick(camp)` | ~90 | Fire GA4 camp_booking_click event |
| `handleBookingClick(camp)` | ~104 | Track click and open booking URL |

### Contact & GDPR

| Function | Line | Purpose |
|----------|------|---------|
| `getEmailRouting(type)` | ~121 | Route to correct Cloudflare email |
| `handleContactFormSubmit(e)` | ~135 | Submit via EmailJS |
| `handleCookieAccept()` | ~1496 | Accept cookies, enable analytics |
| `handleCookieReject()` | ~1502 | Reject cookies, stay minimal |

---

## useEffect Hooks (Lines 513-917)

| Purpose | Dependencies | Description |
|---------|--------------|-------------|
| Contact form scroll lock | `[showContactForm]` | Prevent body scroll when modal open |
| Hash change listener | `[]` | Sync activeSection with URL hash |
| GDPR consent check | `[]` | Load saved consent from localStorage |
| GA4 initialization | `[cookieConsent]` | Init GA4 only after consent |
| Scroll navigation | `[showBackToTop, scrollDirection]` | Show button after 300px, track scroll direction (50px mobile / 10px desktop dead zone) |
| Marquee system | `[activeSection]` | Mobile overflow detection & animation |
| Mobile menu close | `[isMenuOpen]` | Close on outside click/escape |

---

## Featured Listing Implementation

Featured camps (€99/year tier) have special treatment:

```javascript
// In camp object
featured: true

// In camp grid - sorting
{[...filteredCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map(...)}

// Card styling
className={camp.featured
  ? 'border-[3px] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)] ring-4 ring-amber-100'
  : 'border-0 shadow-lg'
}

// Featured badge (top-left ribbon)
{camp.featured && (
  <div className="absolute top-0 left-0 z-10">
    <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 ...">
      <Star className="w-4 h-4 fill-white" />
      <span>FEATURED</span>
    </div>
  </div>
)}

// Shows 3 highlights instead of 2
camp.highlights.slice(0, camp.featured ? 3 : 2)
```

---

## Multilingual Search (Lines 223-289)

Supports searching in 6 European languages:

```javascript
const translations = {
  // Country names
  'danmark': 'denmark',
  'norge': 'norway',
  'schweiz': 'switzerland',
  'österreich': 'austria',
  'deutschland': 'germany',
  'sverige': 'sweden',
  // Swedish camp terms
  'sommarläger': 'summer camp',
  'kollo': 'camp',
  'läger': 'camp',
  // Common terms
  'sommer': 'summer',  // German/Danish/Norwegian
  'été': 'summer',     // French
  'verano': 'summer',  // Spanish
  'estate': 'summer',  // Italian
  // ... more
}
```

---

## Email Routing (Lines ~133-145)

Smart routing based on inquiry type:

| Inquiry Type | Routes To |
|--------------|-----------|
| partnership | partnerships@europeansummercamps.com |
| media-inquiry | media@europeansummercamps.com |
| website-issue | info@europeansummercamps.com |
| missing-camp | contact@europeansummercamps.com |
| data-correction | contact@europeansummercamps.com |
| other | hello@europeansummercamps.com |

All forward to sorenthoning@gmail.com via Cloudflare.

---

## CSS Classes (App.css)

### Custom Classes

| Class | Purpose |
|-------|---------|
| `.hero-full-height` | Full viewport hero section |
| `.hero-adaptive-grid` | Responsive hero layout |
| `.hero-fluid-title` | Responsive hero typography |
| `.sticky-header` | Fixed navigation header |
| `.camp-card` | Card hover effects |
| `.camp-price` | Price prominence styling |
| `.touch-target` | 48px minimum touch targets |
| `.btn-primary` | Orange primary button |
| `.btn-secondary` | Blue secondary button |
| `.btn-hero-secondary` | Hero button on dark bg |
| `.section-title` | Responsive section headings |
| `.badge-responsive` | Responsive badge sizing |

### Marquee System

| Class | Purpose |
|-------|---------|
| `.marquee-enabled` | Activates scroll animation |
| `.marquee-content` | Content container |
| `.material-motion` | Android spring physics |

---

## Quick Reference Commands

```bash
# Find camp by ID
grep -n "id: 15" src/data/camps.js

# Find all category assignments
grep -n "category:" src/data/camps.js

# Find country filter handlers
grep -n "handleCountryFilter" src/App.jsx

# Find all useState hooks
grep -n "useState" src/App.jsx

# Count camps
grep -c "id:" src/App.jsx | head -50
```

---

## Modification Guidelines

### Adding a New Camp

1. Open `src/data/camps.js`, find end of allCamps array (~line 1193)
2. Add camp object with next sequential ID
3. Include ALL required fields (see structure above)
4. Test: search, filtering, display
5. Update stats in multiple locations (see DEVELOPMENT_GUIDELINES.md)

### Adding a Featured Listing

1. Add `featured: true` to camp object
2. Optionally add `videoUrl` for video button
3. Verify premium styling displays correctly
4. Update FEATURED_CAMPS.md

### Modifying Filtering Logic

- Filter logic is in `filteredCamps` useMemo (~line 290)
- Filter options defined in `filterOptions` useMemo (~line 326)
- Category handlers: `handleCategoryFilter` (~line 395)
- Country toggle: `toggleCountry` (~line 346)

---

*This document should be updated when significant structural changes are made to App.jsx.*
