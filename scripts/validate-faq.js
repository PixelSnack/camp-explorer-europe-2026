/* global process */
/**
 * Build-time check: the FAQPage JSON-LD in index.html must mirror src/data/faq.js exactly
 * and carry a complete FAQPage shape. Google retired FAQ rich results in May 2026; the
 * markup stays as the FAQ text non-rendering crawlers can read, and structured-data policy
 * requires it to match the visible content.
 *
 * Usage: node scripts/validate-faq.js
 */

import { readFileSync } from 'node:fs';
import { FAQ_ITEMS } from '../src/data/faq.js';

let errors = 0;
const fail = (message) => { console.error(`  FAIL: ${message}`); errors++; };

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)].map(m => m[1]);
const parsed = blocks.map((block, i) => {
  try { return JSON.parse(block); }
  catch (err) { fail(`JSON-LD block ${i + 1} in index.html does not parse: ${err.message}`); return null; }
});
const faqPages = parsed.filter(j => j && j['@type'] === 'FAQPage');

if (faqPages.length !== 1) {
  fail(`expected exactly one FAQPage JSON-LD block in index.html, found ${faqPages.length}`);
} else {
  const faqPage = faqPages[0];
  const entities = faqPage.mainEntity;
  if (!Array.isArray(entities)) {
    fail('FAQPage.mainEntity must be an array');
  } else {
    if (entities.length !== FAQ_ITEMS.length) fail(`FAQPage has ${entities.length} questions, faq.js has ${FAQ_ITEMS.length}`);
    FAQ_ITEMS.forEach((item, i) => {
      const entity = entities[i];
      if (!entity) return;
      if (entity['@type'] !== 'Question') fail(`entry ${i + 1}: @type must be "Question", got ${entity['@type']}`);
      if (entity.name !== item.question) fail(`question ${i + 1} differs: JSON-LD "${entity.name}" vs faq.js "${item.question}"`);
      if (entity.acceptedAnswer?.['@type'] !== 'Answer') fail(`entry ${i + 1}: acceptedAnswer.@type must be "Answer"`);
      if (entity.acceptedAnswer?.text !== item.answer) fail(`answer ${i + 1} differs from faq.js`);
    });
  }
}

if (errors > 0) {
  console.error(`FAQ VALIDATION FAILED: ${errors} error(s). index.html FAQPage JSON-LD must mirror src/data/faq.js.\n`);
  process.exit(1);
}
console.log(`FAQ in sync: ${FAQ_ITEMS.length} questions match index.html JSON-LD.\n`);
