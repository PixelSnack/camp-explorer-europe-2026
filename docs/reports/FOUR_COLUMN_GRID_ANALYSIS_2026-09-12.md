# Four cards per row on desktop: what it would take and what it would touch

*Analysis only, 12 September 2026, at the owner's request. Nothing implemented. Measurements taken on the production build with four columns injected through the CDP verify script; screenshots in the session scratchpad.*

## 1. The constraint that decides everything: the grids are capped at 1280 px

All three card grids (Home `App.jsx:1285`, Discover `App.jsx:1864`, Winter `App.jsx:1944`) sit inside a `max-w-7xl` wrapper (1280 px) with 32 px side padding, so the grid is 1216 px wide on every desktop from 1280 px upwards. A 1920 px monitor shows exactly the same 1216 px grid as a 1280 px laptop, with empty margins either side. Eleven sections share that wrapper width.

Consequence: "four columns" inside today's wrapper means 27 percent narrower cards at every desktop size, not just wider screens filling their space.

| Measured on the ILC card | 3 columns (today) | 4 columns, same wrapper |
|---|---|---|
| Card width at 1280 px viewport | 379 px | 276 px |
| Card width at 1920 px viewport | 384 px | 280 px |
| Row height (tallest card in the row) | 1,096 px | 1,208 px |
| ILC name block | 3 lines (84 px) | 4 lines (112 px) |
| Six-highlight block | 200 px | 260 px |

Visible in the injected screenshots: "Les Elfes International" wraps to two lines against the price; "Premium Alpine Adventure Sports" on the Camp Suisse chip runs under the rating badge; the location line on Villars-sur-Ollon wraps to three lines; the chips (`badge-responsive`, sized by viewport width, so largest exactly when the cards are narrowest) push more rows. Nothing breaks, but the cards read cramped and the row is 10 percent taller, which is the opposite of the intent.

## 2. The version that makes sense: four columns only where the screen has room

Gate it on Tailwind's `2xl` breakpoint (1536 px viewport) and widen the three card-grid wrappers at that breakpoint, for example to 1,600 px. Card width then lands at about 360 px, close to today's 384 px, so wrapping stays as it is. Below 1536 px nothing changes; phones (single column below `md`) and tablets are untouched by construction.

Who it reaches, from GA4 desktop sessions 14 June to 11 September 2026 (about 220 sessions, desktop being roughly 30 percent of traffic):

| Screen | Sessions | Viewport at the breakpoint |
|---|---|---|
| 1920x1080 | 81 | Four columns |
| 1536x864 (Windows at 125 percent scaling on a 1920 panel) | 22 | On the edge; the scrollbar takes it below 1536, so three columns |
| 1440x900, 1470x956, 1512x982 | 39 | Three columns |
| 1280x720, 1280x800, 1366x854 | 39 | Three columns |
| 1710x1107, 2560x1440, 1920x1200 | 14 | Four columns |

So the change would reach about 95 of 220 desktop sessions, roughly 43 percent of desktop and 12 to 13 percent of all sessions. The other 57 percent of desktop visitors would see no difference, and 70 percent of visitors are on phones and never see it.

## 3. What the implementation would touch

1. **Three grid class strings** in `App.jsx`: lines 1285 (Home, `lg:grid-cols-3`), 1864 (Discover) and 1944 (Winter). Add `2xl:grid-cols-4`. The other four `lg:grid-cols-3` grids on the page are content sections, not card grids, and stay.
2. **Three wrapper widths**: the `max-w-7xl` on the section container around each of those grids becomes `max-w-7xl 2xl:max-w-[1600px]`. The section heading, the filter bar and the result count sit in the same wrapper and widen with it, which keeps them aligned with the grid. The other eight `max-w-7xl` sections stay at 1280 px, so the page gets a wider band in the card sections only; that is normal on directory sites and acceptable, but it is a visible design choice, not a free one.
3. **Row composition.** With two Premium partners, the first row becomes Les Elfes, ILC and two standard cards; the standard cards stretch to the Premium height and show more empty space above their button. Already true with three columns, slightly more visible with four. The winter grid has 10 cards and would lay out 4, 4, 2.
4. **Chips.** `badge-responsive` scales with viewport width, so at 1920 px chips are at their maximum while the cards are at their narrowest. Worth capping the chip size inside the grid at `2xl`, one CSS rule.
5. **Nothing else moves.** The scroll-navigation button targets the last visible card and is layout-agnostic. The compare tray, filters, drawer and search are untouched. Image loading is unchanged (four lazy images in the first viewport instead of three; the hero remains the LCP element). No DOM change, so no SEO effect. The virtual-scrolling plan (not implemented) assumes rows and would need the column count as an input.
6. **Verification matrix.** 1280, 1440, 1536, 1920 and 2560 px desktop; 390 px phone and 820 px tablet unchanged; a mixed Premium and standard row; the winter grid; a Chrome look on production per the owner rule.

Effort: about an hour including verification, seven class edits and one CSS rule, all in `App.jsx` and `App.css`. Risk: low when gated at `2xl`; the only judgement call is the wider band in the card sections.

## 4. Recommendation

Do not run four columns inside the 1280 px wrapper: measured, it makes every desktop card 27 percent narrower and the rows taller. If four columns are wanted, do it as "four columns from 1536 px with a 1,600 px wrapper", which keeps card width within 6 percent of today, changes nothing below 1536 px or on phones, and reaches about 43 percent of desktop visitors. Decide whether that gain, for 12 to 13 percent of all sessions, is worth a visibly wider band in the card sections; if yes, the build is a small, contained change.
