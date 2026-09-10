/* global process */
/**
 * Build-time check: the camp directory JSON-LD in index.html must match what
 * scripts/camp-schema.mjs builds from src/data/camps.js, exactly.
 *
 * Drift between structured data and the page it describes is a real spam signal, and a
 * directory that claims camps it no longer lists (or omits ones it does) is the kind of
 * inaccuracy this project exists to avoid. Adding a camp without regenerating now fails
 * the build rather than shipping silently.
 *
 * Usage: node --import ./scripts/register-loader.mjs scripts/validate-schema.js
 * Fix a failure with: npm run generate:schema
 */

import { readFileSync } from 'node:fs'
import { allCamps } from '../src/data/camps.js'
import { buildCampDirectorySchema } from './camp-schema.mjs'

let errors = 0
const fail = (message) => { console.error(`  FAIL: ${message}`); errors++ }

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map(m => m[1])

const parsed = blocks.map((block, i) => {
  try { return JSON.parse(block) }
  catch (err) { fail(`JSON-LD block ${i + 1} in index.html does not parse: ${err.message}`); return null }
})

const expected = buildCampDirectorySchema(allCamps)
const directories = parsed.filter(j => j && j['@type'] === 'ItemList' && j.name === expected.name)

if (directories.length !== 1) {
  fail(`expected exactly one ItemList named "${expected.name}" in index.html, found ${directories.length}. Run: npm run generate:schema`)
} else {
  const actual = directories[0]

  if (actual.numberOfItems !== expected.numberOfItems) {
    fail(`numberOfItems is ${actual.numberOfItems}, camps.js has ${expected.numberOfItems}. Run: npm run generate:schema`)
  }
  if (!Array.isArray(actual.itemListElement) || actual.itemListElement.length !== expected.itemListElement.length) {
    fail(`itemListElement has ${actual.itemListElement?.length} entries, expected ${expected.itemListElement.length}. Run: npm run generate:schema`)
  } else {
    // Deep compare entry by entry so the failure names the camp rather than dumping the tree.
    expected.itemListElement.forEach((want, i) => {
      const got = actual.itemListElement[i]
      const a = JSON.stringify(got)
      const b = JSON.stringify(want)
      if (a !== b) fail(`entry ${i + 1} (${want.item.name}) differs from camps.js. Run: npm run generate:schema`)
    })
  }

  // Guard the rules that make this block safe, so a future edit cannot quietly reintroduce them.
  actual.itemListElement?.forEach((entry, i) => {
    const item = entry.item || {}
    const where = `entry ${i + 1} (${item.name || 'unnamed'})`
    if (item.address?.streetAddress) fail(`${where}: streetAddress must not be emitted. camps.js holds no street addresses and we do not invent them.`)
    if (item.address?.postalCode) fail(`${where}: postalCode must not be emitted. camps.js holds no postcodes.`)
    if (item.offers || item.priceRange) fail(`${where}: no offers or priceRange. Price without a bookable offer on our own domain is a mismatch pattern.`)
    if (item.aggregateRating) fail(`${where}: no aggregateRating. Google prohibits it for directory sites (REVIEW_METHODOLOGY.md).`)
    if (typeof item.url === 'string' && item.url.includes('utm_')) fail(`${where}: url carries UTM parameters. UTM is appended at runtime in App.jsx and must never reach the schema.`)
  })

  // Paid placement must not masquerade as editorial ranking.
  const paidFirst = allCamps.slice().sort((a, b) => a.id - b.id)[0]
  const topName = actual.itemListElement?.[0]?.item?.name
  if (topName && topName !== paidFirst.name) {
    fail(`entry 1 is "${topName}" but id order starts with "${paidFirst.name}". The list must be ordered by id, never by featured status.`)
  }
}

if (errors > 0) {
  console.error(`\nCamp directory schema validation FAILED with ${errors} error(s).`)
  process.exit(1)
}
console.log(`Camp directory schema matches camps.js (${expected.numberOfItems} camps).`)
