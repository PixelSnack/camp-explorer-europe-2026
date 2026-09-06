// Regenerates the FAQPage JSON-LD block in index.html from src/data/faq.js.
// scripts/validate-faq.js fails the build when the two differ, so every FAQ edit runs this once.
// Usage: node --import ./scripts/register-loader.mjs scripts/sync-faq-jsonld.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { FAQ_ITEMS } from '../src/data/faq.js'

const path = new URL('../index.html', import.meta.url)
const html = readFileSync(path, 'utf8')
const open = '    <!-- FAQ Structured Data for Rich Snippets -->\n    <script type="application/ld+json">\n'
const close = '\n    </script>'
const start = html.indexOf(open)
if (start === -1) { console.error('FAQ block marker not found in index.html'); process.exit(1) }
const bodyStart = start + open.length
const end = html.indexOf(close, bodyStart)
if (end === -1) { console.error('FAQ block end not found in index.html'); process.exit(1) }

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}
const block = JSON.stringify(faqPage, null, 2).split('\n').map(line => '    ' + line).join('\n')
const next = html.slice(0, bodyStart) + block + html.slice(end)
if (next === html) {
  console.log(`FAQ JSON-LD already in sync (${FAQ_ITEMS.length} questions).`)
} else {
  writeFileSync(path, next, 'utf8')
  console.log(`FAQ JSON-LD regenerated from faq.js (${FAQ_ITEMS.length} questions).`)
}
