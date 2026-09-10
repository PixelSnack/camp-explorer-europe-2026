/**
 * Builds the camp directory JSON-LD from src/data/camps.js.
 *
 * Shared by scripts/generate-camp-schema.js (writes it into index.html) and
 * scripts/validate-schema.js (rebuilds it and fails the build if index.html has drifted).
 * One builder, two consumers, so the file and the data cannot disagree.
 *
 * Why this exists: the site is a client-rendered SPA on one URL. The served HTML body is an
 * empty #root plus a small noscript block, so a crawler that does not execute JavaScript sees
 * no camps at all. Until Phase 2 ships SSG, this block is the only machine-readable statement
 * of what the directory actually contains. It previously named three camps out of 67.
 *
 * Deliberate omissions, each one a rule rather than an oversight:
 * - No streetAddress and no postalCode. camps.js holds neither. Inventing 67 of them would be
 *   fabrication, and one hand-written entry already carried "Verbier Resort Area", which is not
 *   an address.
 * - No offers, no priceRange. Price without a bookable offer on our own domain is a mismatch
 *   pattern, and it would add a second surface to keep in sync with the quarterly price review.
 * - No aggregateRating. Existing policy: Google prohibits it for directory sites.
 * - No areaServed. "International" cannot be verified per camp.
 * - audience only when both age bounds parse to integers. "6+ years" and "All ages" get none.
 */

/** ISO 3166-1 alpha-2 for every country in camps.js. Unmapped countries throw, by design. */
const COUNTRY_CODES = {
  'Austria': 'AT', 'Belgium': 'BE', 'Croatia': 'HR', 'Czech Republic': 'CZ',
  'Denmark': 'DK', 'Finland': 'FI', 'France': 'FR', 'Germany': 'DE',
  'Greece': 'GR', 'Hungary': 'HU', 'Iceland': 'IS', 'Ireland': 'IE',
  'Italy': 'IT', 'Lithuania': 'LT', 'Netherlands': 'NL', 'Norway': 'NO',
  'Poland': 'PL', 'Portugal': 'PT', 'Romania': 'RO', 'Slovenia': 'SI',
  'Spain': 'ES', 'Sweden': 'SE', 'Switzerland': 'CH', 'United Kingdom': 'GB',
}

export const SITE = 'https://www.europeansummercamps.com'

/**
 * The town, taken as the first comma-separated segment of `location`.
 * Every location string ends with a country anchor (enforced by validate-camps.js), so the
 * first segment is the settlement. Returns null when the location names only the country,
 * so we omit addressLocality rather than repeat the country in it.
 */
export const localityFrom = (camp) => {
  const first = String(camp.location).split(',')[0].trim()
  if (!first || first === camp.country) return null
  return first
}

/** Both bounds or nothing. "6-17 years" gives [6, 17]; "6+ years" and "All ages" give null. */
export const ageBounds = (ages) => {
  const m = /^\s*(\d{1,2})\s*-\s*(\d{1,2})\b/.exec(String(ages))
  if (!m) return null
  const min = Number(m[1])
  const max = Number(m[2])
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) return null
  return [min, max]
}

/** A factual one-liner assembled from fields we hold. Never invents a selling point. */
export const describe = (camp) => {
  const base = `${camp.type} in ${camp.location}`
  const bounds = ageBounds(camp.ages)
  if (bounds) return `${base}, for ages ${bounds[0]} to ${bounds[1]}.`
  if (/^\s*(\d{1,2})\s*\+/.test(String(camp.ages))) {
    return `${base}, for ages ${/^\s*(\d{1,2})\s*\+/.exec(String(camp.ages))[1]} and up.`
  }
  return `${base}.`
}

export const buildCampNode = (camp) => {
  const country = COUNTRY_CODES[camp.country]
  if (!country) {
    throw new Error(`camp ${camp.id} (${camp.name}): no ISO country code mapped for "${camp.country}". Add it to COUNTRY_CODES in scripts/camp-schema.mjs.`)
  }

  const address = { '@type': 'PostalAddress', addressCountry: country }
  const locality = localityFrom(camp)
  if (locality) address.addressLocality = locality

  const node = {
    '@type': 'EducationalOrganization',
    // A fragment on our own domain. Two listings run by one operator can share a bookingUrl;
    // without a distinct @id consumers merge them and an entry disappears silently.
    '@id': `${SITE}/#camp-${camp.id}`,
    name: camp.name,
    description: describe(camp),
    url: camp.bookingUrl,
    address,
    serviceType: 'Summer Camp',
  }

  const bounds = ageBounds(camp.ages)
  if (bounds) {
    node.audience = { '@type': 'PeopleAudience', suggestedMinAge: bounds[0], suggestedMaxAge: bounds[1] }
  }
  return node
}

/**
 * Ordered by id ascending, never by `featured`. `featured` means a PAID Premium listing, and
 * ListItem.position implies ranking, so seating paying customers at the top of a
 * machine-readable list would present paid placement as editorial selection.
 */
export const buildCampDirectorySchema = (allCamps) => {
  const camps = [...allCamps].sort((a, b) => a.id - b.id)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'European Summer Camps Directory',
    description: 'Verified residential and day summer camps for children and teenagers across Europe, listed by European Summer Camps.',
    numberOfItems: camps.length,
    itemListElement: camps.map((camp, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: buildCampNode(camp),
    })),
  }
}

export const START_MARKER = '<!-- CAMP_DIRECTORY_SCHEMA:START generated by scripts/generate-camp-schema.js from src/data/camps.js, do not hand-edit -->'
export const END_MARKER = '<!-- CAMP_DIRECTORY_SCHEMA:END -->'

/** The exact text written between the markers, so generator and validator agree byte for byte. */
export const renderBlock = (schema) => {
  const json = JSON.stringify(schema, null, 2).split('\n').map(l => `    ${l}`).join('\n')
  return `${START_MARKER}\n    <script type="application/ld+json">\n${json}\n    </script>\n    ${END_MARKER}`
}
