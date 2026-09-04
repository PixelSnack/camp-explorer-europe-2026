/* global process */
/**
 * Build-time check: the FAQPage JSON-LD in index.html must mirror src/data/faq.js exactly.
 * Google requires FAQ structured data to describe content visible on the page; keeping one
 * source for both is how that stays true.
 *
 * Usage: node scripts/validate-faq.js
 */

import { readFileSync } from 'node:fs';
import { FAQ_ITEMS } from '../src/data/faq.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map(m => m[1]);
const faqPage = blocks.map(b => JSON.parse(b)).find(j => j['@type'] === 'FAQPage');

let errors = 0;
const fail = (message) => { console.error(`  FAIL: ${message}`); errors++; };

if (!faqPage) {
  fail('no FAQPage JSON-LD block found in index.html');
} else {
  const entities = faqPage.mainEntity ?? [];
  if (entities.length !== FAQ_ITEMS.length) {
    fail(`FAQPage has ${entities.length} questions, faq.js has ${FAQ_ITEMS.length}`);
  }
  FAQ_ITEMS.forEach((item, i) => {
    const entity = entities[i];
    if (!entity) return;
    if (entity.name !== item.question) fail(`question ${i + 1} differs: JSON-LD "${entity.name}" vs faq.js "${item.question}"`);
    if (entity.acceptedAnswer?.text !== item.answer) fail(`answer ${i + 1} differs from faq.js`);
  });
}

if (errors > 0) {
  console.error(`FAQ VALIDATION FAILED: ${errors} error(s). index.html FAQPage JSON-LD must mirror src/data/faq.js.\n`);
  process.exit(1);
}
console.log(`FAQ in sync: ${FAQ_ITEMS.length} questions match index.html JSON-LD.\n`);
