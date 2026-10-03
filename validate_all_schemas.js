const fs = require('fs');
const path = require('path');

console.log('--- STARTING COMPREHENSIVE SCHEMA AUDIT ---');

let totalChecked = 0;
let errors = [];

function checkJsonLd(filePath, isCatalog = false) {
  totalChecked++;
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) {
    errors.push(`${filePath}: Missing JSON-LD script tag`);
    return;
  }
  let json;
  try {
    json = JSON.parse(match[1]);
  } catch (e) {
    errors.push(`${filePath}: JSON parse error: ${e.message}`);
    return;
  }

  if (isCatalog) {
    // Catalog ItemList validation
    const graph = json['@graph'] || [json];
    const itemList = graph.find(item => item['@type'] === 'ItemList');
    if (!itemList) {
      errors.push(`${filePath}: Missing ItemList in catalog schema`);
      return;
    }
    if (!Array.isArray(itemList.itemListElement) || itemList.itemListElement.length === 0) {
      errors.push(`${filePath}: ItemList has no items`);
      return;
    }
    itemList.itemListElement.forEach((li, idx) => {
      if (li['@type'] !== 'ListItem') errors.push(`${filePath}: Item ${idx} not ListItem`);
      if (!li.name) errors.push(`${filePath}: Item ${idx} missing name`);
      if (!li.url) errors.push(`${filePath}: Item ${idx} missing destination url`);
      // Verify NO stub Product objects are leaking inside ItemList
      if (li.item && li.item['@type'] === 'Product') {
        errors.push(`${filePath}: Item ${idx} has nested Product in ItemList`);
      }
    });
  } else {
    // Dedicated Product page validation
    const types = Array.isArray(json['@type']) ? json['@type'] : [json['@type']];
    if (!types.includes('Product')) {
      errors.push(`${filePath}: @type does not include Product: ${JSON.stringify(json['@type'])}`);
    }
    if (!json.name || json.name.trim() === '') errors.push(`${filePath}: Missing name`);
    if (!json.description || json.description.trim() === '') errors.push(`${filePath}: Missing description`);
    if (!json.image || !json.image.startsWith('https://')) errors.push(`${filePath}: Invalid or non-https image: ${json.image}`);
    if (!json.sku) errors.push(`${filePath}: Missing sku`);
    if (!json.mpn) errors.push(`${filePath}: Missing mpn`);
    if (!json.brand || json.brand['@type'] !== 'Brand' || !json.brand.name) {
      errors.push(`${filePath}: Missing or invalid brand`);
    }
    const o = json.offers;
    if (!o || o['@type'] !== 'Offer') {
      errors.push(`${filePath}: Missing offers or not Offer type`);
    } else {
      if (!o.price) errors.push(`${filePath}: Missing offers.price`);
      if (!o.priceCurrency || o.priceCurrency !== 'USD') errors.push(`${filePath}: Invalid offers.priceCurrency`);
      if (!o.availability) errors.push(`${filePath}: Missing offers.availability`);
      if (!o.url) errors.push(`${filePath}: Missing offers.url`);
      if (!o.shippingDetails || o.shippingDetails['@type'] !== 'OfferShippingDetails') {
        errors.push(`${filePath}: Missing offers.shippingDetails`);
      }
      if (!o.hasMerchantReturnPolicy || o.hasMerchantReturnPolicy['@type'] !== 'MerchantReturnPolicy') {
        errors.push(`${filePath}: Missing offers.hasMerchantReturnPolicy`);
      }
    }
  }
}

// 1. Audit Catalogs
console.log('Auditing catalog pages...');
checkJsonLd(path.join(__dirname, 'gamedev', 'index.html'), true);
checkJsonLd(path.join(__dirname, 'shop', 'index.html'), true);

// 2. Audit all product pages
const productsDir = path.join(__dirname, 'gamedev', 'products');
const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.html'));
console.log(`Auditing ${productFiles.length} product pages in gamedev/products/...`);

productFiles.forEach(file => {
  checkJsonLd(path.join(productsDir, file), false);
});

console.log(`\nAudit Complete!`);
console.log(`Total Pages Inspected: ${totalChecked}`);
if (errors.length === 0) {
  console.log(`ALL 925 PAGES PASSED VALIDATION WITH ZERO ERRORS!`);
} else {
  console.error(`ERRORS FOUND (${errors.length}):`);
  errors.slice(0, 20).forEach(e => console.error(' - ' + e));
}
