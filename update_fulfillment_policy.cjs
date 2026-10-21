const fs = require('fs');
const path = require('path');

const productsDir = path.resolve(__dirname, 'products');
console.log('Scanning products in:', productsDir);

const entries = fs.readdirSync(productsDir);
console.log(`Found ${entries.length} product directories.`);

const oldBullets = '<div style="border-top:1px solid #eee;padding-top:15px;color:#666;font-size:0.9rem;"><p>✓ Custom made-to-order (typically 2-4 business days production)</p><p>✓ Standard tracked delivery (3-6 business days after printing)</p><p>✓ 30-day money-back guarantee on defective or misprinted items</p></div>';
const newBullets = '<div style="border-top:1px solid #eee;padding-top:15px;color:#666;font-size:0.9rem;"><p>Made to order. See the seller\'s current delivery estimates and return policy.</p></div>';

const oldDesc1 = 'made to order with vibrant durable print, fast US delivery and 30-day return policy.';
const newDesc1 = 'Made to order. See the seller\'s current delivery estimates and return policy.';

const oldDesc2 = 'made to order with vibrant durable print, fast US delivery and 30-day return policy';
const newDesc2 = 'Made to order. See the seller\'s current delivery estimates and return policy';

let updatedCount = 0;
let unchangedCount = 0;

for (let i = 0; i < entries.length; i++) {
  const dirName = entries[i];
  const file = path.join(productsDir, dirName, 'index.html');
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes(oldBullets)) {
    content = content.replace(oldBullets, newBullets);
    changed = true;
  }

  if (content.includes(oldDesc1)) {
    content = content.replaceAll(oldDesc1, newDesc1);
    changed = true;
  } else if (content.includes(oldDesc2)) {
    content = content.replaceAll(oldDesc2, newDesc2);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    updatedCount++;
  } else {
    unchangedCount++;
  }

  if ((i + 1) % 5000 === 0 || i === entries.length - 1) {
    console.log(`Processed ${i + 1} / ${entries.length} (${updatedCount} updated, ${unchangedCount} unchanged)...`);
  }
}

console.log(`Done! Total updated: ${updatedCount}, Total unchanged: ${unchangedCount}`);
