/* global process */
/**
 * Build-time validation for camp data integrity.
 * Runs as prebuild hook: validates review data, ratings, source keys, required card fields,
 * the winter vocabulary, cross-array invariants and the static claims in index.html and the sitemap.
 * Exit code 1 blocks the build on any validation failure.
 *
 * Usage: node --import ./scripts/register-loader.mjs scripts/validate-camps.js
 */

import { readFileSync } from 'node:fs';
import { allCamps, REVIEW_SOURCES, parseAges, AGE_SPAN } from '../src/data/camps.js';
import { winterCamps } from '../src/data/winterCamps.js';
import { SEASON_YEAR } from '../src/data/season.js';
import { FAQ_ITEMS } from '../src/data/faq.js';

const validSourceKeys = new Set(Object.keys(REVIEW_SOURCES));
const PRICE_RANGES = new Set(['budget', 'mid', 'premium', 'luxury']);
const REQUIRED_TEXT = ['name', 'location', 'country', 'ages', 'price', 'dates', 'type'];
const REQUIRED_ARRAYS = ['activities', 'highlights', 'languages'];
const FEATURED_CAP_PER_CATEGORY = 3;
let errors = 0;

function fail(campId, campName, message) {
  console.error(`  FAIL [ID ${campId}] ${campName}: ${message}`);
  errors++;
}
const staticFail = (where, message) => { console.error(`  FAIL [${where}]: ${message}`); errors++; };

console.log(`Validating ${allCamps.length} summer and ${winterCamps.length} winter camps...\n`);

/**
 * Per-camp checks shared by the summer and winter arrays.
 * @param {object} camp
 * @param {'summer'|'winter'} season which array the row belongs to
 */
function validateCamp(camp, season) {
  // URL safety: booking links open via window.open, so they must be https and parseable;
  // video links must point at YouTube (the only host the video button is designed for)
  if (typeof camp.bookingUrl !== 'string' || !/^https:\/\//i.test(camp.bookingUrl)) {
    fail(camp.id, camp.name, `bookingUrl must be an https URL, got: ${camp.bookingUrl}`);
  } else {
    try { new URL(camp.bookingUrl); } catch { fail(camp.id, camp.name, `bookingUrl is not a valid URL: ${camp.bookingUrl}`); }
  }
  if (camp.videoUrl !== undefined && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(camp.videoUrl)) {
    fail(camp.id, camp.name, `videoUrl must be an https YouTube URL, got: ${camp.videoUrl}`);
  }

  // Fields the card renders directly
  for (const key of REQUIRED_TEXT) {
    if (typeof camp[key] !== 'string' || camp[key].trim() === '') {
      fail(camp.id, camp.name, `${key} must be a non-empty string, got: ${camp[key]}`);
    }
  }
  for (const key of REQUIRED_ARRAYS) {
    if (!Array.isArray(camp[key]) || camp[key].length === 0) {
      fail(camp.id, camp.name, `${key} must be a non-empty array`);
    } else if (camp[key].some(item => typeof item !== 'string' || item.trim() === '')) {
      fail(camp.id, camp.name, `${key} must contain only non-empty strings (the card renders each one)`);
    }
  }
  if (typeof camp.image !== 'string' || camp.image === '') fail(camp.id, camp.name, 'image must be an imported asset (resolves to a URL string)');
  if (!PRICE_RANGES.has(camp.priceRange)) {
    fail(camp.id, camp.name, `priceRange must be budget, mid, premium or luxury, got: ${camp.priceRange}`);
  }

  // Fields the UI derives numbers or badges from
  const ages = parseAges(camp.ages);
  if (ages === null) {
    fail(camp.id, camp.name, `ages must read like "6-17 years", "6+ years (families)" or "All ages (families)", got: ${camp.ages}`);
  } else if (ages.min !== null && ages.min < 1) {
    fail(camp.id, camp.name, `ages minimum must be at least 1, got: ${camp.ages}`);
  } else if (ages.max !== null && ages.max <= ages.min) {
    fail(camp.id, camp.name, `ages range must increase, got: ${camp.ages}`);
  }

  // bookingStatus is an enum the UI renders verbatim: "open", "not yet open" or "<SEASON_YEAR> dates published"
  if (camp.bookingStatus !== undefined) {
    const status = typeof camp.bookingStatus === 'string' ? camp.bookingStatus.trim() : '';
    const published = /^(\d{4}) dates published$/.exec(status);
    if (!status) {
      fail(camp.id, camp.name, 'bookingStatus, when present, must be a non-empty string');
    } else if (season === 'winter' && status !== 'open') {
      fail(camp.id, camp.name, `winter bookingStatus may only be "open" (verified) or absent, got: "${status}"`);
    } else if (status !== 'open' && status !== 'not yet open' && !published) {
      fail(camp.id, camp.name, `bookingStatus must be "open", "not yet open" or "<year> dates published", got: "${status}"`);
    } else if (published && Number(published[1]) !== SEASON_YEAR) {
      fail(camp.id, camp.name, `bookingStatus year ${published[1]} does not match SEASON_YEAR ${SEASON_YEAR} in src/data/season.js`);
    }
  }

  // Season discriminator: winter rows carry it, summer rows never do
  if (season === 'winter') {
    if (camp.season !== 'winter') fail(camp.id, camp.name, 'winter rows must carry season: "winter"');
    if (camp.category !== 'winter') fail(camp.id, camp.name, `winter rows must carry category: "winter", got: ${camp.category}`);
    if (typeof camp.dates === 'string' && camp.dates.length > 40) {
      fail(camp.id, camp.name, `dates must be 40 characters or fewer on winter rows (card chip on phones), got ${camp.dates.length}`);
    }
    if (camp.reviews > 0 && !camp.reviewData) fail(camp.id, camp.name, 'winter rows with reviews must carry reviewData');
    // The card shows the text before the first slash as the price and the text after it as the unit
    if (typeof camp.price === 'string' && !/^(From )?[^/]+\/[^/]+$/.test(camp.price)) {
      fail(camp.id, camp.name, `winter price must read "<amount>/<unit>" with exactly one slash, got: ${camp.price}`);
    }
  } else if (camp.season !== undefined) {
    fail(camp.id, camp.name, `summer rows must not carry a season field, got: ${camp.season}`);
  }

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

for (const camp of allCamps) validateCamp(camp, 'summer');
for (const camp of winterCamps) validateCamp(camp, 'winter');

// Cross-array invariants: one ID space, and the paid-placement cap per category
const seenIds = new Set();
const featuredByCategory = {};
for (const camp of [...allCamps, ...winterCamps]) {
  if (!Number.isInteger(camp.id) || camp.id < 1) fail(camp.id, camp.name, 'id must be a positive integer');
  if (seenIds.has(camp.id)) fail(camp.id, camp.name, 'duplicate id across the summer and winter arrays');
  seenIds.add(camp.id);
  if (camp.featured) featuredByCategory[camp.category] = (featuredByCategory[camp.category] || 0) + 1;
}
for (const [category, count] of Object.entries(featuredByCategory)) {
  if (count > FEATURED_CAP_PER_CATEGORY) {
    staticFail('paid slots', `category "${category}" has ${count} featured rows; the cap is ${FEATURED_CAP_PER_CATEGORY}`);
  }
}

// Static claims that no build step generates must agree with the data
const countryCount = new Set(allCamps.map(camp => camp.country.trim())).size;
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');

// Protected metadata: exact snapshots so no other work can drift the head-term titles
const expectedTitle = `European Summer Camps ${SEASON_YEAR} | 100+ Camp Programs | Camp Explorer Europe`;
const expectedShortTitle = `European Summer Camps ${SEASON_YEAR} | 100+ Camp Programs`;
const title = (html.match(/<title>(.*?)<\/title>/) || [])[1] || '';
const ogTitle = (html.match(/<meta property="og:title" content="(.*?)"/) || [])[1] || '';
const twitterTitle = (html.match(/<meta name="twitter:title" content="(.*?)"/) || [])[1] || '';
if (title !== expectedTitle) {
  staticFail('index.html', `<title> must be exactly "${expectedTitle}" (SEASON_YEAR in season.js), got: "${title}"`);
}
if (ogTitle !== expectedTitle) {
  staticFail('index.html', `og:title must be exactly "${expectedTitle}", got: "${ogTitle}"`);
}
if (twitterTitle !== expectedShortTitle) {
  staticFail('index.html', `twitter:title must be exactly "${expectedShortTitle}", got: "${twitterTitle}"`);
}
if (!html.includes(`across ${countryCount} countries`)) {
  staticFail('index.html', `descriptions and noscript must say "across ${countryCount} countries" (data has ${countryCount})`);
}
if (!sitemap.includes(`${allCamps.length} verified camp organizations`) || !sitemap.includes(`across ${countryCount} countries`)) {
  staticFail('public/sitemap.xml', `image caption must say "${allCamps.length} verified camp organizations" and "across ${countryCount} countries"`);
}
const ageClaim = `spans ages ${AGE_SPAN.replace('-', ' to ')}`;
if (!FAQ_ITEMS.some(item => item.answer.includes(ageClaim))) {
  staticFail('src/data/faq.js', `an answer must state "${ageClaim}" (AGE_SPAN is ${AGE_SPAN})`);
}
const countryClaim = `covers ${countryCount} countries`;
if (!FAQ_ITEMS.some(item => item.answer.includes(countryClaim))) {
  staticFail('src/data/faq.js', `an answer must state "${countryClaim}" (data has ${countryCount})`);
}

console.log('');
if (errors > 0) {
  console.error(`VALIDATION FAILED: ${errors} error(s) found. Fix before building.\n`);
  process.exit(1);
} else {
  console.log(`All ${allCamps.length} summer and ${winterCamps.length} winter camps passed validation.\n`);
}
