const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const output = execSync('git diff-tree --no-commit-id --name-status -r 8fb124514', {
  cwd: 'C:/Users/aaaho/.gemini/antigravity-ide/scratch/jason-coleman-network',
  maxBuffer: 100 * 1024 * 1024,
  encoding: 'utf8'
});

const lines = output.split('\n');
const deletedSlugs = [];
for (const line of lines) {
  if (!line.trim()) continue;
  const [status, filePath] = line.split('\t');
  if (status === 'D' && filePath.startsWith('products/')) {
    const slug = filePath.split('/')[1];
    deletedSlugs.push(slug);
  }
}

console.log(`Total deleted product slugs: ${deletedSlugs.length}`);

// Test pattern: extract trailing ID e.g. "rkjv3907r3cp-773" or number
let mappedToSpreadshop = 0;
let mappedToOther = 0;
let unmapped = 0;

const mappingTable = {};

for (const slug of deletedSlugs) {
  // Pattern 1: ends with Spreadshop ID: e.g. "rkjv3907r3cp-773" or similar
  const match = slug.match(/([a-z0-9]+-\d+)$/i);
  if (match) {
    const id = match[1];
    const candidateSpreadshop = `spreadshop-${id}`;
    if (fs.existsSync(path.join('products', candidateSpreadshop, 'index.html'))) {
      mappedToSpreadshop++;
      mappingTable[slug] = `/products/${candidateSpreadshop}/`;
      continue;
    }
    const candidatePrintify = `printify-${id}`;
    if (fs.existsSync(path.join('products', candidatePrintify, 'index.html'))) {
      mappedToOther++;
      mappingTable[slug] = `/products/${candidatePrintify}/`;
      continue;
    }
  }

  // Pattern 2: numeric ID at end
  const numMatch = slug.match(/(\d{6,})$/);
  if (numMatch) {
    const id = numMatch[1];
    for (const prefix of ['printify-', 'zazzle-', 'redbubble-', 'teepublic-']) {
      if (fs.existsSync(path.join('products', prefix + id, 'index.html'))) {
        mappedToOther++;
        mappingTable[slug] = `/products/${prefix + id}/`;
        break;
      }
    }
    if (mappingTable[slug]) continue;
  }

  unmapped++;
}

console.log(`Mapping results:`);
console.log(`  Directly mapped to Spreadshop: ${mappedToSpreadshop}`);
console.log(`  Directly mapped to other channels: ${mappedToOther}`);
console.log(`  Unmapped: ${unmapped}`);
console.log(`Total successfully mapped: ${mappedToSpreadshop + mappedToOther} / ${deletedSlugs.length} (${((mappedToSpreadshop + mappedToOther) / deletedSlugs.length * 100).toFixed(2)}%)`);

// Save mapping table to legacy_redirect_map.json
fs.writeFileSync('legacy_redirect_map.json', JSON.stringify(mappingTable));
console.log('Saved legacy_redirect_map.json with', Object.keys(mappingTable).length, 'exact redirects!');
