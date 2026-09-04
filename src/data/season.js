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
