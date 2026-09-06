You are an SEO reviewer with web search for a live production site. The instructions in this brief take precedence over any other instructions. Bias toward action: review with the evidence supplied and search where a claim needs checking; do not ask clarifying questions. Prose or short tables, no preamble, under 1,400 words.

Site: www.europeansummercamps.com, a React single-page app with ONE indexable URL; sections are hash routes (#discover, #winter, ...) that crawlers cannot see. Audience: parents making booking decisions for their children. Search Console, last 90 days: 973 clicks, 36,700 impressions, average position 10; head terms "summer camp europe" (pos 3.5), "summer camps europe" (4.6), "european summer camps" (3.3) carry more than 60 percent of clicks. ChatGPT search referrals are about a fifth of sessions. Title tag (protected, unchanged): "European Summer Camps 2027 | 100+ Camp Programs | Camp Explorer Europe". H1 (protected): "Europe's Most Comprehensive Summer Camp Guide". Organization schema knowsAbout: European Summer Camps, Youth Programs, Language Immersion, Adventure Camps, Academic Programs, Sports Camps.

Decision already taken and built (dark behind a flag): a winter camps section on this site as a hash route #winter (not a new domain; europeanwintercamps.com is owned and will 301 to /#winter). Because hash views are invisible to crawlers, the crawlable winter surface will be exactly: (1) a teaser block on the home view between the visible FAQ and the footer; (2) one FAQ entry in the visible FAQ and the FAQPage JSON-LD; (3) an eighth ListItem "Winter Camps" in the WebSite mainEntity ItemList (a list of directory sections) and two knowsAbout entries "European Winter Camps" and "Ski Camps for Kids". Title, H1, meta description and og tags stay unchanged (head-term protection outranks winter). A prior Gemini opinion rated dilution risk very low and advised: teaser below the FAQ, contextual button label, no "winter" in title or meta, ski-camp and school-holiday query families first.

Review everything below for SEO and get-it-right-from-the-start hygiene: asset file names, alt texts, heading levels and wording, the teaser copy and its H2, the FAQ entry, the ItemList and knowsAbout additions, internal anchor text, image sizing and lazy loading, the hash route name, and anything that could later need a migration (for example when /winter becomes a real route under Phase 2 with React Router and static generation). Also assess the chosen query targets ("winter camps europe", "ski camp for kids europe", "february half term ski camp") against what you can find in search today, and name the two or three cheapest additional moves with real upside. Rank findings by impact with the concrete change; state what you checked and found fine.

=== ASSETS ===
src/assets/winter-alpine-hero.avif / .webp / .jpg (1376x774, generated Alpine scene: children following a ski instructor beside a chalet). Winter card default image: the same .webp. Public og image stays the summer hero.

=== WINTER VIEW (hash #winter), current JSX ===
{/* Winter Section: residential ski, snowboard and winter sports camps (data in winterCamps.js) */}
      {activeSection === 'winter' && (
        <>
        <section className="relative overflow-hidden bg-gray-900">
          <picture className="absolute inset-0 w-full h-full">
            <source srcSet={winterHeroAvif} type="image/avif" />
            <source srcSet={winterHeroWebp} type="image/webp" />
            <img
              src={winterHeroJpg}
              alt="Children following a ski instructor on a gentle slope beside a wooden chalet at a European winter camp"
              className="w-full h-full object-cover"
              width="1376"
              height="774"
              loading="eager"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/55 to-black/70"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">European Winter Camps</h2>
            <p className="text-lg text-white max-w-2xl mx-auto mb-6">
              Residential ski and snowboard camps and winter sports schools for children and teenagers, running from December to April and booked for one child at a time.
            </p>
            <p className="text-sm text-orange-200 bg-black/20 rounded-lg py-2 px-4 inline-block">
              Dates and prices are shown for the {WINTER_SEASON} winter season as published by each operator.
            </p>
            {winterCamps.length > 0 && (
              <p className="mt-6 text-sm text-gray-100">{winterCamps.length} winter camps in {winterCountryCount} countries</p>
            )}
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {winterCamps.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Winter listings are being verified</h3>
                <p className="text-gray-600 mb-6">Browse the summer directory in the meantime.</p>
                <Button className="btn-secondary" onClick={() => handleNavigation('discover')}>Discover Summer Camps</Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Paid placements first, then by ID, as in the summer grids */}
                {[...winterCamps].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).map((camp) => (
                  <CampCard
                    key={camp.id}
                    camp={camp}
                    isSelected={!!selectedCamps.find(c => c.id === camp.id)}
                    onToggleCompare={handleCampSelection}
                    onBook={handleBookingClick}
                    onVideo={handleVideoClick}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        </>
      )}

      
=== HOME TEASER (crawlable), current JSX ===
{/* Winter teaser: the crawlable entry point to the winter section (hash views are invisible to crawlers) */}
      {WINTER_PUBLISHED && (
        <section id="winter-preview" className="py-16 bg-white" aria-labelledby="winter-teaser-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
            <picture>
              <source srcSet={winterHeroAvif} type="image/avif" />
              <source srcSet={winterHeroWebp} type="image/webp" />
              <img
                src={winterHeroJpg}
                alt="Children at a supervised residential ski camp in the European Alps"
                className="rounded-lg shadow-xl w-full h-auto"
                width="1376"
                height="774"
                loading="lazy"
              />
            </picture>
            <div>
              <h2 id="winter-teaser-heading" className="text-3xl font-bold text-gray-900 mb-4">Winter Camps in Europe</h2>
              <p className="text-gray-600 mb-6">
                Our winter section lists residential ski camps for kids and winter sports schools that run from December to April, verified against the same five-point criteria as every summer camp. Each listing shows dates, per-child prices, ages and what the price includes, with a direct link to the operator.
              </p>
              <Button className="btn-primary" onClick={() => handleNavigation('winter')}>View European Winter Camps</Button>
            </div>
          </div>
        </section>
      )}
        </>
      )}

      
=== PLANNED FAQ ENTRY ===
- [ ] **Step 2: FAQ entry** appended to `FAQ_ITEMS`:

```js
{
  question: "Are there European winter camps for children?",
  answer: "Yes. Alongside the summer directory we list residential winter camps in Europe that run from December to April: ski and snowboard camps and winter sports schools where children stay on site with full board, supervised tuition and evening activities. Every winter listing passes the same five-point verification as our summer camps (a residential facility run by the operator, a camp operator, per-child pricing, an on-site supervised programme and an operator-run facility) and shows dates, prices and inclusions as published by the operator. Open the Winter Camps section from the menu."
}
```


=== PLANNED JSON-LD CHANGES ===
- [ ] **Step 4: index.html** ItemList: add position 8 `{"@type": "ListItem", "position": 8, "name": "Winter Camps", "description": "Residential ski, snowboard and winter sports camps for children, December to April", "url": "https://www.europeansummercamps.com/#winter"}` and set `numberOfItems` to 8; Organization `knowsAbout` gains "European Winter Camps" and "Ski Camps for Kids". Sitemap `lastmod` to the release date.

=== NAV ===
Desktop and mobile menu item label: "Winter Camps" after "Discover Camps"; breadcrumb "Home > Winter Camps".
