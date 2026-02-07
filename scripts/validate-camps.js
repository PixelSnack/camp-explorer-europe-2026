/* global process */
/**
 * Build-time validation for camp data integrity.
 * Runs as prebuild hook: validates review data, ratings, and source keys.
 * Exit code 1 blocks the build on any validation failure.
 *
 * Usage: node --import ./scripts/register-loader.mjs scripts/validate-camps.js
 */

import { allCamps, REVIEW_SOURCES } from '../src/data/camps.js';

const validSourceKeys = new Set(Object.keys(REVIEW_SOURCES));
let errors = 0;

function fail(campId, campName, message) {
  console.error(`  FAIL [ID ${campId}] ${campName}: ${message}`);
  errors++;
}

console.log(`Validating ${allCamps.length} camps...\n`);

for (const camp of allCamps) {
  // Basic field checks
  if (camp.rating !== null && (typeof camp.rating !== 'number' || camp.rating < 1.0 || camp.rating > 5.0)) {
    fail(camp.id, camp.name, `rating must be null or number 1.0-5.0, got: ${camp.rating}`);
  }

  if (typeof camp.reviews !== 'number' || camp.reviews < 0 || !Number.isInteger(camp.reviews)) {
    fail(camp.id, camp.name, `reviews must be non-negative integer, got: ${camp.reviews}`);
  }

  // If rating is null, reviews must be 0
  if (camp.rating === null && camp.reviews !== 0) {
    fail(camp.id, camp.name, `rating is null but reviews is ${camp.reviews} (should be 0)`);
  }

  // If reviews is 0, rating must be null
  if (camp.reviews === 0 && camp.rating !== null) {
    fail(camp.id, camp.name, `reviews is 0 but rating is ${camp.rating} (should be null)`);
  }

  // Validate reviewData if present
  if (camp.reviewData) {
    const rd = camp.reviewData;

    // lastVerified format check
    if (!rd.lastVerified || !/^\d{4}-\d{2}$/.test(rd.lastVerified)) {
      fail(camp.id, camp.name, `reviewData.lastVerified must be YYYY-MM format, got: ${rd.lastVerified}`);
    }

    // sources validation
    if (!rd.sources || typeof rd.sources !== 'object') {
      fail(camp.id, camp.name, 'reviewData.sources must be an object');
    } else {
      let totalCount = 0;
      let weightedSum = 0;
      let weightSum = 0;

      for (const [key, source] of Object.entries(rd.sources)) {
        // Valid source key
        if (!validSourceKeys.has(key)) {
          fail(camp.id, camp.name, `unknown source key "${key}" — must be one of: ${[...validSourceKeys].join(', ')}`);
          continue;
        }

        // Rating range
        if (typeof source.rating !== 'number' || source.rating < 1.0 || source.rating > 5.0) {
          fail(camp.id, camp.name, `source "${key}" rating must be 1.0-5.0, got: ${source.rating}`);
        }

        // Count must be positive integer
        if (typeof source.count !== 'number' || source.count < 1 || !Number.isInteger(source.count)) {
          fail(camp.id, camp.name, `source "${key}" count must be integer >= 1, got: ${source.count}`);
        }

        const weight = REVIEW_SOURCES[key].weight;
        totalCount += source.count;
        weightedSum += source.rating * weight * source.count;
        weightSum += weight * source.count;
      }

      // Verify total reviews matches sum of source counts
      if (totalCount !== camp.reviews) {
        fail(camp.id, camp.name, `reviews (${camp.reviews}) does not equal sum of source counts (${totalCount})`);
      }

      // Verify weighted average matches rating (within 0.1 tolerance)
      if (Object.keys(rd.sources).length > 0 && weightSum > 0) {
        const expectedRating = Math.round((weightedSum / weightSum) * 10) / 10;
        if (camp.rating === null) {
          fail(camp.id, camp.name, `has review sources but rating is null (expected ${expectedRating})`);
        } else if (Math.abs(camp.rating - expectedRating) > 0.1) {
          fail(camp.id, camp.name, `rating (${camp.rating}) does not match weighted average (${expectedRating})`);
        }
      }
    }
  }
}

console.log('');
if (errors > 0) {
  console.error(`VALIDATION FAILED: ${errors} error(s) found. Fix before building.\n`);
  process.exit(1);
} else {
  console.log(`All ${allCamps.length} camps passed validation.\n`);
}
