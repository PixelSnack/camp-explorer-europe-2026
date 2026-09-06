/**
 * Editorial season facts. These are the only dated values the UI reads.
 * Roll them every September together with the <title> and descriptions in index.html;
 * scripts/validate-camps.js fails the build if the title and SEASON_YEAR disagree.
 * Checklist: docs/reports/WAVE1_ROLLOVER_PLAN_2026-09-03.md
 */

/** The season parents are planning for. */
export const SEASON_YEAR = 2027

/** Month of the last directory-wide data re-verification, shown in the hero. */
export const DIRECTORY_UPDATED = 'September 2026'

/** Winter season label shown on the winter view. Roll every September together with SEASON_YEAR. */
export const WINTER_SEASON = '2026-27'

/**
 * Gates every promotional entry point of the winter section together (menu item, home teaser).
 * The #winter hash renders regardless so the view can be tested dark.
 * Flip to true only when at least four winter camps are verified STRONG on all five points.
 */
export const WINTER_PUBLISHED = false
