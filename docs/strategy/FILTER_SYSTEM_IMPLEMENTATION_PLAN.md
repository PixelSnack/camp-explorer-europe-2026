# Filter System Implementation Plan

**Created:** January 26, 2026
**Status:** Ready for Implementation
**Priority:** High - Major UX Upgrade

---

## Executive Summary

Create a beautiful, intuitive mobile-first filtering system that makes Camp Explorer **the definitive resource** for European summer camps. This is a significant UX upgrade that will differentiate us from basic directories.

**Current Problem:**
A parent looking for "budget camps in Norway for a 10-year-old" currently has to:
1. Scroll through all 45 camps
2. Manually check each one
3. Or know to click the footer country link

**The Solution:**
- Filter bar near the top (dropdowns or chips)
- Multi-select capability (country + price + age)
- Results update after clicking Apply button
- Clear "X results match" indicator

---

## Design Philosophy

| Principle | Description |
|-----------|-------------|
| **Mobile-first** | 70% of our traffic is mobile - design for phones first |
| **Airbnb-quality** | Professional, trustworthy aesthetics |
| **Instant clarity** | Parents understand immediately how to use filters |
| **Fast & snappy** | Filters should feel responsive |
| **First impressions matter** | This is often the first thing visitors interact with |

---

## Architecture Overview

### Mobile Layout (Default - 70% of traffic)

```
┌─────────────────────────────────┐
│  [Search Bar]                   │
├─────────────────────────────────┤
│  [Active Chips: Switzerland ×]  │
├─────────────────────────────────┤
│  Showing 12 camps               │
├─────────────────────────────────┤
│                                 │
│     Camp Cards Grid             │
│                                 │
│                                 │
└─────────────────────────────────┘
                            [FAB 🔍]  ← Floating filter button (bottom-right)
```

### Filter Bottom Sheet (Mobile) - Opens when FAB tapped

```
┌─────────────────────────────────┐
│  ━━━  (drag handle)             │
│  Filter Camps        [Clear all]│
├─────────────────────────────────┤
│  CATEGORY                       │
│  [🏔️ Premium] [📚 Academic]    │
│  [🌍 Language] [⚽ Sports]      │
│  [👨‍👩‍👧 Family] [💰 Budget]     │
│  [🌲 Unique]                    │
├─────────────────────────────────┤
│  COUNTRY                        │
│  [Search countries...]          │
│  [🇨🇭 Switzerland] [🇳🇴 Norway] │
│  [🇬🇧 UK] [🇩🇰 Denmark] ...    │
├─────────────────────────────────┤
│  PRICE RANGE                    │
│  [Budget][Mid][Premium][Luxury] │
│  €500 ────●────●──── €7,000     │
├─────────────────────────────────┤
│  AGE RANGE                      │
│  [3-6] [7-10] [11-14] [15-17]   │
├─────────────────────────────────┤
│  ▼ MORE FILTERS                 │
├─────────────────────────────────┤
│  [    Show 12 Camps    ]        │  ← Orange CTA button
└─────────────────────────────────┘
```

### Desktop Layout (lg breakpoint - 1024px+)

```
┌──────────────┬──────────────────────────────────┐
│  FILTERS     │  [Search Bar]                    │
│  ──────────  │  [Switzerland ×] [Sports ×]      │
│  Category    │  Showing 12 camps                │
│  [Premium]   │  ┌─────────┐ ┌─────────┐ ┌─────┐│
│  [Academic]  │  │ Camp 1  │ │ Camp 2  │ │ ... ││
│  [Language]  │  └─────────┘ └─────────┘ └─────┘│
│  ──────────  │  ┌─────────┐ ┌─────────┐ ┌─────┐│
│  Country     │  │ Camp 4  │ │ Camp 5  │ │ ... ││
│  [Swiss ✓]   │  └─────────┘ └─────────┘ └─────┘│
│  [Norway]    │                                  │
│  ──────────  │                                  │
│  Price       │                                  │
│  €500-€7000  │                                  │
│  ──────────  │                                  │
│  ▼ More      │                                  │
│              │                                  │
│  [Apply]     │                                  │
└──────────────┴──────────────────────────────────┘
```

---

## Filter Hierarchy (Progressive Disclosure)

| Tier | Filters | Why | Visibility |
|------|---------|-----|------------|
| **1 (Always Visible)** | Category, Country | Primary decision factors for parents | Always shown |
| **2 (Secondary)** | Price Range, Age Range | Key constraints for parents | Always shown |
| **3 (Expandable)** | Languages, Activities | Refinement filters | Behind "More Filters" |

---

## New State Management

### Replace Current State

**Current (to be replaced):**
```javascript
const [selectedFilter, setSelectedFilter] = useState('all')
const [searchTerm, setSearchTerm] = useState('')
const [selectedCountry, setSelectedCountry] = useState('all')
```

**New (consolidated filter object):**
```javascript
// Consolidated filter state
const [filters, setFilters] = useState({
  category: 'all',        // Single select: 'all' | 'premium' | 'academic' | etc.
  country: 'all',         // Single select: 'all' | 'Switzerland' | 'Norway' | etc.
  priceRange: [0, 10000], // EUR equivalent [min, max]
  ageRange: [3, 24],      // Years [min, max]
  languages: [],          // Multi-select array: ['English', 'French']
  searchTerm: ''          // Existing search functionality
})

// Bottom sheet open state (mobile)
const [filterSheetOpen, setFilterSheetOpen] = useState(false)
```

### Helper Functions Needed

```javascript
// Parse price from string like "€2,500" or "CHF 4,550" to EUR number
const parseCampPrice = (priceString) => {
  // Extract numeric value
  const match = priceString.match(/[\d,]+/)
  if (!match) return 0
  const value = parseInt(match[0].replace(',', ''))

  // Convert to EUR equivalent
  if (priceString.includes('CHF')) return value * 1.05  // ~1.05 EUR/CHF
  if (priceString.includes('NOK')) return value * 0.085 // ~0.085 EUR/NOK
  if (priceString.includes('DKK')) return value * 0.13  // ~0.13 EUR/DKK
  if (priceString.includes('GBP') || priceString.includes('£')) return value * 1.17
  return value // Assume EUR
}

// Parse age range from string like "6-17 years" to [min, max]
const parseAgeRange = (agesString) => {
  const match = agesString.match(/(\d+)-(\d+)/)
  if (!match) return [0, 99]
  return [parseInt(match[1]), parseInt(match[2])]
}

// Count active filters (for badge on FAB)
const getActiveFilterCount = () => {
  let count = 0
  if (filters.category !== 'all') count++
  if (filters.country !== 'all') count++
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++
  if (filters.ageRange[0] > 3 || filters.ageRange[1] < 24) count++
  if (filters.languages.length > 0) count++
  if (filters.searchTerm) count++
  return count
}
```

---

## Component Design Details

### 1. Filter FAB (Floating Action Button) - Mobile Only

**Purpose:** Entry point to filter sheet on mobile

**Specifications:**
- **Position:** Fixed bottom-right, 24px from edges
- **Size:** 56px diameter (thumb-friendly per Material Design)
- **Style:** Orange gradient matching brand, white filter icon
- **Badge:** Shows active filter count (if > 0)
- **Hidden on desktop:** `md:hidden` class

**Tailwind Classes:**
```jsx
<button
  onClick={() => setFilterSheetOpen(true)}
  className="
    fixed bottom-6 right-6 z-40
    w-14 h-14
    bg-gradient-to-br from-orange-500 to-orange-600
    rounded-full shadow-lg shadow-orange-500/30
    flex items-center justify-center
    active:scale-95 transition-transform
    md:hidden
  "
>
  <SlidersHorizontal className="w-6 h-6 text-white" />
  {getActiveFilterCount() > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
      {getActiveFilterCount()}
    </span>
  )}
</button>
```

**Icon:** Use `SlidersHorizontal` from Lucide (already available)

---

### 2. Bottom Sheet (Mobile Filter Panel)

**Purpose:** Contains all filter controls on mobile

**Implementation:** Use existing `Drawer` component from shadcn/ui (Vaul library)

**Specifications:**
- **Snap points:** 50% and 90% height
- **Swipe-to-dismiss:** Enabled
- **Sticky header:** "Filter Camps" title + "Clear all" link
- **Sticky footer:** "Show X Camps" button

**Structure:**
```jsx
<Drawer open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
  <DrawerContent className="max-h-[90vh]">
    {/* Header */}
    <DrawerHeader className="sticky top-0 bg-white z-10 border-b">
      <div className="flex items-center justify-between">
        <DrawerTitle>Filter Camps</DrawerTitle>
        <button onClick={clearAllFilters} className="text-blue-600 text-sm">
          Clear all
        </button>
      </div>
    </DrawerHeader>

    {/* Scrollable content */}
    <div className="overflow-y-auto px-4 py-4 space-y-6">
      {/* Category section */}
      {/* Country section */}
      {/* Price range section */}
      {/* Age range section */}
      {/* More filters (expandable) */}
    </div>

    {/* Footer */}
    <DrawerFooter className="sticky bottom-0 bg-white border-t">
      <Button
        onClick={applyFilters}
        className="w-full bg-orange-500 hover:bg-orange-600"
      >
        Show {filteredCamps.length} Camps
      </Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

### 3. Category Pills

**Purpose:** Filter by camp category (7 categories)

**Visual Design:**
```
┌─────────────────┐  ┌─────────────────┐
│ 🏔️ Premium     │  │ 📚 Academic     │
│    Alpine       │  │    & STEM       │
└─────────────────┘  └─────────────────┘
```

**Specifications:**
- **Layout:** 2-column grid on mobile
- **Content:** Icon + label for quick scanning
- **Selected state:** Blue border + light blue background
- **Count:** Show camp count in parentheses

**Category Icons:**
| Category | Icon | Emoji Alternative |
|----------|------|-------------------|
| Premium Alpine | `Mountain` | 🏔️ |
| Academic & STEM | `BookOpen` | 📚 |
| Language Immersion | `Globe` | 🌍 |
| Sports Specialty | `Trophy` | ⚽ |
| Family Programs | `Users` | 👨‍👩‍👧 |
| Budget Excellence | `Wallet` | 💰 |
| Unique Experiences | `TreePine` | 🌲 |

**Code:**
```jsx
const categories = [
  { value: 'all', label: 'All Categories', icon: Grid3X3, count: 45 },
  { value: 'premium', label: 'Premium Alpine', icon: Mountain, count: 4 },
  { value: 'academic', label: 'Academic & STEM', icon: BookOpen, count: 5 },
  { value: 'language', label: 'Language Immersion', icon: Globe, count: 6 },
  { value: 'sports', label: 'Sports Specialty', icon: Trophy, count: 6 },
  { value: 'family', label: 'Family Programs', icon: Users, count: 4 },
  { value: 'budget_excellence', label: 'Budget Excellence', icon: Wallet, count: 5 },
  { value: 'unique', label: 'Unique Experiences', icon: TreePine, count: 9 },
]

<div className="grid grid-cols-2 gap-2">
  {categories.map(cat => (
    <button
      key={cat.value}
      onClick={() => setFilters(f => ({ ...f, category: cat.value }))}
      className={`
        p-3 rounded-lg border-2 text-left transition-colors
        ${filters.category === cat.value
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300'}
      `}
    >
      <cat.icon className="w-5 h-5 mb-1 text-gray-600" />
      <div className="text-sm font-medium">{cat.label}</div>
      <div className="text-xs text-gray-500">({cat.count})</div>
    </button>
  ))}
</div>
```

---

### 4. Country Selector

**Purpose:** Filter by country (24 countries)

**Specifications:**
- **Search input:** At top for quick filtering
- **"All Countries" option:** With total count
- **Layout:** 2-column grid of country buttons
- **Content:** Flag emoji + name + camp count
- **Scrollable:** max-h-48 if many countries

**Country Data:**
```javascript
const countries = [
  { code: 'all', name: 'All Countries', flag: '🌍', count: 45 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', count: 4 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', count: 6 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', count: 4 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', count: 4 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', count: 2 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', count: 1 },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', count: 1 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', count: 2 },
  { code: 'FR', name: 'France', flag: '🇫🇷', count: 2 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', count: 1 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', count: 2 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', count: 2 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', count: 2 },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', count: 1 },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', count: 1 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', count: 1 },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', count: 1 },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', count: 1 },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', count: 1 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', count: 1 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', count: 1 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', count: 2 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', count: 1 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', count: 1 },
]
```

**Code:**
```jsx
const [countrySearch, setCountrySearch] = useState('')

const filteredCountries = countries.filter(c =>
  c.name.toLowerCase().includes(countrySearch.toLowerCase())
)

<div className="space-y-3">
  <input
    type="text"
    placeholder="Search countries..."
    value={countrySearch}
    onChange={(e) => setCountrySearch(e.target.value)}
    className="w-full px-3 py-2 border rounded-lg text-sm"
  />
  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
    {filteredCountries.map(country => (
      <button
        key={country.code}
        onClick={() => setFilters(f => ({ ...f, country: country.name }))}
        className={`
          px-3 py-2 rounded-lg border text-left text-sm
          ${filters.country === country.name
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200'}
        `}
      >
        <span className="mr-2">{country.flag}</span>
        {country.name}
        <span className="text-gray-400 ml-1">({country.count})</span>
      </button>
    ))}
  </div>
</div>
```

---

### 5. Price Range Slider

**Purpose:** Filter by camp price

**Specifications:**
- **Quick presets:** Budget / Mid / Premium / Luxury buttons
- **Dual-handle slider:** Using existing Slider component
- **Currency display:** Shows formatted: €2,000 - €4,000
- **Debounce:** 300ms on drag for performance

**Price Ranges:**
| Preset | Range | Label |
|--------|-------|-------|
| Budget | €0 - €1,999 | "Under €2,000" |
| Mid | €2,000 - €3,999 | "€2,000 - €4,000" |
| Premium | €4,000 - €5,999 | "€4,000 - €6,000" |
| Luxury | €6,000+ | "€6,000+" |

**Code:**
```jsx
const pricePresets = [
  { label: 'Budget', range: [0, 1999] },
  { label: 'Mid', range: [2000, 3999] },
  { label: 'Premium', range: [4000, 5999] },
  { label: 'Luxury', range: [6000, 10000] },
]

<div className="space-y-4">
  {/* Preset buttons */}
  <div className="flex gap-2 flex-wrap">
    {pricePresets.map(preset => (
      <button
        key={preset.label}
        onClick={() => setFilters(f => ({ ...f, priceRange: preset.range }))}
        className={`
          px-3 py-1.5 rounded-full text-sm border
          ${JSON.stringify(filters.priceRange) === JSON.stringify(preset.range)
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200'}
        `}
      >
        {preset.label}
      </button>
    ))}
  </div>

  {/* Slider */}
  <Slider
    min={0}
    max={10000}
    step={100}
    value={filters.priceRange}
    onValueChange={(value) => setFilters(f => ({ ...f, priceRange: value }))}
  />

  {/* Display */}
  <div className="flex justify-between text-sm text-gray-600">
    <span>€{filters.priceRange[0].toLocaleString()}</span>
    <span>€{filters.priceRange[1].toLocaleString()}</span>
  </div>
</div>
```

---

### 6. Age Range

**Purpose:** Filter by child age

**Specifications:**
- **Visual age groups:** Buttons for common ranges
- **Description:** Under each group for clarity
- **Optional slider:** For exact range

**Age Groups:**
| Range | Label | Description |
|-------|-------|-------------|
| 3-6 | Tiny Tots | Preschool |
| 7-10 | Juniors | Primary school |
| 11-14 | Pre-Teens | Middle school |
| 15-17 | Teens | High school |
| 18-24 | Young Adults | University age |

**Code:**
```jsx
const ageGroups = [
  { range: [3, 6], label: '3-6', description: 'Tiny Tots' },
  { range: [7, 10], label: '7-10', description: 'Juniors' },
  { range: [11, 14], label: '11-14', description: 'Pre-Teens' },
  { range: [15, 17], label: '15-17', description: 'Teens' },
  { range: [18, 24], label: '18-24', description: 'Young Adults' },
]

<div className="space-y-3">
  <div className="flex gap-2 flex-wrap">
    {ageGroups.map(group => (
      <button
        key={group.label}
        onClick={() => setFilters(f => ({ ...f, ageRange: group.range }))}
        className={`
          flex flex-col items-center px-4 py-2 rounded-lg border
          ${JSON.stringify(filters.ageRange) === JSON.stringify(group.range)
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200'}
        `}
      >
        <span className="font-medium">{group.label}</span>
        <span className="text-xs text-gray-500">{group.description}</span>
      </button>
    ))}
  </div>
</div>
```

---

### 7. Active Filter Chips

**Purpose:** Show currently active filters with quick removal

**Specifications:**
- **Position:** Above results grid
- **Each filter:** Removable chip with × icon
- **Color-coded:** By filter type
- **"Clear all":** Link when 2+ filters active

**Chip Styling:**
```jsx
className="
  px-3 py-1.5 rounded-full
  bg-blue-100 text-blue-700 border border-blue-200
  flex items-center gap-1.5
  hover:bg-blue-200 cursor-pointer
  text-sm font-medium
"
```

**Code:**
```jsx
const ActiveFilterChips = () => {
  const chips = []

  if (filters.category !== 'all') {
    chips.push({
      key: 'category',
      label: categories.find(c => c.value === filters.category)?.label,
      onRemove: () => setFilters(f => ({ ...f, category: 'all' }))
    })
  }

  if (filters.country !== 'all') {
    chips.push({
      key: 'country',
      label: filters.country,
      onRemove: () => setFilters(f => ({ ...f, country: 'all' }))
    })
  }

  // Add more for price, age, etc.

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(chip => (
        <button
          key={chip.key}
          onClick={chip.onRemove}
          className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1.5 text-sm font-medium hover:bg-blue-200"
        >
          {chip.label}
          <X className="w-3.5 h-3.5" />
        </button>
      ))}
      {chips.length >= 2 && (
        <button
          onClick={clearAllFilters}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
```

---

### 8. Desktop Sidebar

**Purpose:** Always-visible filter panel on desktop

**Specifications:**
- **Sticky positioned:** top: 80px for header clearance
- **Width:** 280px (w-72)
- **Background:** White with subtle shadow
- **Always visible:** No toggle needed
- **Apply button:** At bottom for consistency with mobile

**Code:**
```jsx
{/* Desktop Sidebar - hidden on mobile */}
<aside className="hidden lg:block w-72 flex-shrink-0">
  <div className="sticky top-20 bg-white rounded-lg shadow-sm border p-4 space-y-6">
    <h2 className="font-semibold text-lg">Filters</h2>

    {/* Category section */}
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
      {/* Category pills */}
    </div>

    {/* Country section */}
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Country</h3>
      {/* Country selector */}
    </div>

    {/* Price section */}
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
      {/* Price slider */}
    </div>

    {/* Age section */}
    <div>
      <h3 className="text-sm font-medium text-gray-700 mb-2">Age Range</h3>
      {/* Age buttons */}
    </div>

    {/* Apply button */}
    <Button
      onClick={applyFilters}
      className="w-full bg-orange-500 hover:bg-orange-600"
    >
      Apply Filters
    </Button>
  </div>
</aside>
```

---

## Updated Filtering Logic

**Replace the current `filteredCamps` useMemo with:**

```javascript
const filteredCamps = useMemo(() => {
  return allCamps.filter(camp => {
    // Category check
    if (filters.category !== 'all' && camp.category !== filters.category)
      return false

    // Country check
    if (filters.country !== 'all' && camp.country !== filters.country)
      return false

    // Price range check (parse from price string)
    const campPrice = parseCampPrice(camp.price) // Extract numeric value
    if (campPrice < filters.priceRange[0] || campPrice > filters.priceRange[1])
      return false

    // Age range check (parse from "6-17 years")
    const [minAge, maxAge] = parseAgeRange(camp.ages)
    // Camp is included if ANY of its age range overlaps with filter range
    if (maxAge < filters.ageRange[0] || minAge > filters.ageRange[1])
      return false

    // Language check (if any selected)
    if (filters.languages.length > 0) {
      if (!filters.languages.some(lang => camp.languages.includes(lang)))
        return false
    }

    // Search term (existing logic - multilingual)
    if (filters.searchTerm) {
      const terms = getMultilingualSearchTerms(filters.searchTerm)
      const matches = terms.some(term =>
        camp.name.toLowerCase().includes(term) ||
        camp.location.toLowerCase().includes(term) ||
        camp.country.toLowerCase().includes(term)
      )
      if (!matches) return false
    }

    return true
  })
}, [allCamps, filters])
```

---

## Styling (Tailwind Classes)

### Brand Colors
| Purpose | Class |
|---------|-------|
| Primary CTA (Apply button) | `bg-orange-500 hover:bg-orange-600` |
| Selected filter state | `border-blue-500 bg-blue-50` |
| Text primary | `text-gray-900` |
| Text secondary | `text-gray-600` |
| Chip background | `bg-blue-100 text-blue-700 border-blue-200` |

### CSS Additions (App.css)

```css
/* FAB pulse animation */
@keyframes fab-pulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4); }
  50% { box-shadow: 0 4px 25px rgba(249, 115, 22, 0.6); }
}

.fab-button {
  animation: fab-pulse 2s ease-in-out infinite;
}

.fab-button:active {
  animation: none;
}

/* Chip enter animation */
@keyframes chip-enter {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.filter-chip {
  animation: chip-enter 0.2s ease-out;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .fab-button {
    animation: none;
  }
  .filter-chip {
    animation: none;
  }
}
```

---

## Files to Modify

### 1. src/App.jsx (~200-300 lines of changes)

**Changes:**
- Add consolidated filter state (lines ~105-120)
- Add helper functions: `parseCampPrice`, `parseAgeRange`, `getActiveFilterCount`
- Update `filteredCamps` useMemo with new logic
- Add FilterFAB component inline (after main content)
- Add FilterSheet using Drawer (near end of return)
- Add ActiveFilterChips above camp grid
- Update Discover section layout for desktop sidebar

**Location notes:**
- State declarations: After existing useState hooks (~line 105)
- Helper functions: Before return statement
- FilterFAB: Inside main return, after camp grid
- FilterSheet: Inside main return, near other modals

### 2. src/App.css (~50 lines of additions)

**Additions:**
- FAB pulse animation
- Chip enter/exit animations
- Slider thumb hover states
- Reduced motion support

### 3. No new component files

All components will be inline in App.jsx to maintain current architecture.

---

## Implementation Phases

### Phase 1: Core State & Logic
**Goal:** Get filtering working with new state structure

1. Add consolidated `filters` state object
2. Add `filterSheetOpen` state
3. Add helper functions (`parseCampPrice`, `parseAgeRange`, `getActiveFilterCount`)
4. Update `filteredCamps` useMemo with new filter logic
5. **Test:** Filtering should work (even without new UI)

### Phase 2: Mobile Filter UI
**Goal:** Build the mobile bottom sheet

1. Add FilterFAB button (bottom-right, mobile only)
2. Create bottom sheet using existing Drawer component
3. Build category pills (2-column grid with icons)
4. Build country selector with search
5. Build price range with presets + slider
6. Build age range with group buttons
7. Add "Show X Camps" button with dynamic count
8. **Test:** Open sheet, select filters, tap Apply, results update

### Phase 3: Active Filters & UX
**Goal:** Visual feedback for active filters

1. Create ActiveFilterChips component
2. Position above camp grid
3. Implement chip removal (× click)
4. Add result count to Apply button
5. Clear all functionality
6. **Test:** Chips appear, removal works, clear all works

### Phase 4: Desktop Sidebar
**Goal:** Desktop layout with persistent sidebar

1. Add `lg:flex` wrapper for sidebar layout in Discover section
2. Create sticky sidebar component
3. Hide FAB and bottom sheet on desktop (`md:hidden`)
4. Apply button in sidebar
5. **Test:** Sidebar visible on desktop, filters work, responsive breakpoints

### Phase 5: Polish
**Goal:** Professional finish

1. Add CSS transitions (chip animations, button feedback)
2. Accessibility audit (ARIA labels, focus states, keyboard nav)
3. Test on iOS Safari, Android Chrome
4. Performance check (filter responsiveness)
5. **Test:** Animations smooth, accessibility passes, mobile perfect

---

## Verification Checklist

### Mobile Test (Primary - 70% of traffic)
- [ ] Open on phone or Chrome DevTools mobile view
- [ ] FAB visible in bottom-right corner
- [ ] Tap FAB → sheet slides up smoothly
- [ ] Category pills display in 2-column grid
- [ ] Country search filters list
- [ ] Price presets work
- [ ] Age group buttons work
- [ ] "Show X Camps" shows correct count
- [ ] Tap Apply → results update
- [ ] Chips appear above results
- [ ] Tap chip × removes filter
- [ ] Search + filters work together
- [ ] Sheet dismisses on swipe down

### Desktop Test
- [ ] Sidebar visible on left at lg breakpoint
- [ ] All filter controls work
- [ ] Apply button updates results
- [ ] Chips appear above grid
- [ ] FAB is hidden on desktop
- [ ] Responsive transition smooth

### Edge Cases
- [ ] 0 results: "No camps match your filters" message displays
- [ ] All filters cleared: Shows all 45 camps
- [ ] Price parsing: CHF, NOK, DKK, GBP all work correctly
- [ ] Age overlap: Camp "6-17" shows for filter "10-14"
- [ ] Combined filters: Category + Country + Price all work together

### Accessibility
- [ ] FAB has aria-label
- [ ] Filter sheet has proper heading structure
- [ ] Chips are keyboard navigable
- [ ] Screen reader announces filter changes
- [ ] Focus management when sheet opens/closes

### Performance
- [ ] No lag when selecting filters
- [ ] Slider is smooth
- [ ] No excessive re-renders (check React DevTools)
- [ ] Sheet animation is 60fps

---

## Design Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| Apply button vs real-time filtering | **Apply button everywhere** | Prevents excessive re-renders, clearer UX, consistent across mobile/desktop |
| Desktop behavior | Sidebar always visible + Apply button | Consistency with mobile, clear user intent |
| New dependencies | **None needed** | Use existing shadcn/ui Drawer, Slider components |
| Component architecture | Inline in App.jsx | Maintains current monolithic architecture |

---

## Dependencies Already Available

- `Drawer` component from shadcn/ui (Vaul)
- `Slider` component from shadcn/ui
- `Button` component from shadcn/ui
- Lucide icons (SlidersHorizontal, X, Mountain, BookOpen, Globe, Trophy, Users, Wallet, TreePine)

**No new packages needed!**

---

## Next Session Checklist

When resuming work:

1. Read this document
2. Read current App.jsx state management (~line 105)
3. Read current filteredCamps useMemo (~line 1235)
4. Start with Phase 1: Core State & Logic
5. Test each phase before moving to next
6. Commit after each working phase

---

*Document created: January 26, 2026*
*Ready for implementation*
