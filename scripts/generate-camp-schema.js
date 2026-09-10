/* global process */
/**
 * Writes the camp directory JSON-LD into index.html, between the CAMP_DIRECTORY_SCHEMA markers.
 *
 * Usage:
 *   node --import ./scripts/register-loader.mjs scripts/generate-camp-schema.js --dry
 *   node --import ./scripts/register-loader.mjs scripts/generate-camp-schema.js
 *
 * --dry prints a summary and the first entry, and writes nothing. Run it first.
 *
 * The block is generated, never hand-edited. scripts/validate-schema.js runs in prebuild and
 * fails the build if index.html and camps.js have drifted apart, so a camp added without
 * regenerating cannot ship. Same contract as validate-faq.js.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { allCamps } from '../src/data/camps.js'
import { buildCampDirectorySchema, renderBlock, START_MARKER, END_MARKER } from './camp-schema.mjs'

const dry = process.argv.includes('--dry')
const htmlPath = new URL('../index.html', import.meta.url)
const html = readFileSync(htmlPath, 'utf8')

const schema = buildCampDirectorySchema(allCamps)
const block = renderBlock(schema)

const start = html.indexOf(START_MARKER)
const end = html.indexOf(END_MARKER)

if (dry) {
  const raw = Buffer.byteLength(block, 'utf8')
  console.log(`camps:          ${schema.numberOfItems}`)
  console.log(`countries:      ${new Set(allCamps.map(c => c.country)).size}`)
  console.log(`with audience:  ${schema.itemListElement.filter(e => e.item.audience).length}`)
  console.log(`with locality:  ${schema.itemListElement.filter(e => e.item.address.addressLocality).length}`)
  console.log(`block raw size: ${(raw / 1024).toFixed(1)} KB`)
  console.log(`markers present in index.html: ${start !== -1 && end !== -1}`)
  console.log('\nfirst entry:\n' + JSON.stringify(schema.itemListElement[0], null, 2))
  console.log('\nlast entry:\n' + JSON.stringify(schema.itemListElement[schema.itemListElement.length - 1], null, 2))
  const noAudience = schema.itemListElement.filter(e => !e.item.audience).map(e => e.item.name)
  console.log(`\nno audience node (ages did not parse to two bounds): ${noAudience.length ? noAudience.join(', ') : 'none'}`)
  process.exit(0)
}

if (start === -1 || end === -1) {
  console.error('ERROR: CAMP_DIRECTORY_SCHEMA markers not found in index.html.')
  console.error('Add both markers where the block should live, then run this again:')
  console.error(`  ${START_MARKER}`)
  console.error(`  ${END_MARKER}`)
  process.exit(1)
}

const updated = html.slice(0, start) + block + html.slice(end + END_MARKER.length)
writeFileSync(htmlPath, updated, 'utf8')
console.log(`index.html updated: ${schema.numberOfItems} camps in the directory ItemList.`)
