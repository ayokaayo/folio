const fs = require('fs');
const content = fs.readFileSync('lib/caseStudies/fast-track-ai.ts', 'utf8');
// Replace straight quotes with typographic quotes in subtitle
const updated = content.replace(
  /subtitle: `"([^"]+)" —/,
  'subtitle: `"$1" —'
);
fs.writeFileSync('lib/caseStudies/fast-track-ai.ts', updated);
console.log('Updated quotes');




