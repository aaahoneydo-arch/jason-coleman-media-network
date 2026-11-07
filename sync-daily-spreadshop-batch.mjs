import fs from "node:fs";
import path from "node:path";
import { normalize, TYPES } from "./catalog-model.mjs";

const ROOT = "C:\\Users\\aaaho\\.gemini\\antigravity-ide\\scratch\\jason-coleman-network";
const UCM_ROOT = "C:\\Users\\aaaho\\Documents\\Codex\\2026-10-08\\what\\work\\urban-clothes-market";

const TODAY_TITLES = [
  "Self Made Gothic Crowned Phoenix and Forge Anvil",
  "Pride Gothic Prismatic Winged Pegasus Crest",
  "Family Gothic Direwolves and Silver Tree of Life",
  "Love Gothic Ruby Heart Chalice and Thorns",
  "Famous Gothic Crowned Turntable and Winged Mic",
  "Diva Gothic Diamond Crowned Opera Mask and Mirror",
  "Anime Ninja Gothic Nine-Tailed Kitsune and Katana",
  "New York City Gothic Gargoyle and Cathedral Spire",
  "Los Angeles Gothic Tarot Sun Lowrider and Palms",
  "Loyalty Gothic Armored Rottweiler and Chain Shield"
];

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createCardElement(p) {
  const storeClass = p.store !== "Spreadshop" ? "badge-store" : "badge-shop";
  const btnClass = p.store !== "Spreadshop" ? "btn-partner" : "btn-spreadshop";
  const cleanTitle = escapeHtml(p.title);
  const specText = escapeHtml(p.material || "Official creator merchandise printed to order with tracked shipping.");
  const ctaText = "Buy Now on " + p.store + " →";

  return `    <article class="real-prod-card" data-id="${escapeHtml(p.id)}" data-category="${escapeHtml(p.cat)}" data-store="${escapeHtml(p.store)}" data-title="${cleanTitle}">
      <div class="real-prod-media"><span class="real-prod-store-badge ${storeClass}">${escapeHtml(p.storeBadge)}</span><span class="real-prod-price-badge">${escapeHtml(p.price)}</span><span class="real-prod-cat-badge">${escapeHtml(p.cat)}</span><img src="${escapeHtml(p.img)}" alt="${cleanTitle}" loading="lazy" decoding="async" class="real-prod-img"></div>
      <div class="real-prod-details"><h4 class="real-prod-title" title="${cleanTitle}">${cleanTitle}</h4><div class="real-prod-spec">${specText}</div><div class="real-prod-meta"><span class="real-prod-status">● Live in Store</span><span class="real-prod-direct-tag">Exact Product Page</span></div><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener" class="real-prod-cta ${btnClass}">${ctaText}</a></div>
    </article>`;
}

function createShelfCard(p) {
  const cleanTitle = escapeHtml(p.title);
  const cleanDesign = escapeHtml(p.design || p.title.split(" - ")[0]);
  const cleanPt = escapeHtml(p.productType || "Men's Premium Hoodie");
  const cleanSpec = escapeHtml(p.material || p.description || "");
  return `          <div class="ss-card">
            <div class="ss-imgwrap">
              <span class="ss-badge">${cleanPt}</span>
              <img src="${escapeHtml(p.img)}" alt="${cleanTitle}" class="ss-img" loading="lazy">
            </div>
            <div class="ss-body">
              <div class="ss-category">${cleanDesign}</div>
              <h3 class="ss-title">${cleanPt}</h3>
              <div class="ss-variation">${cleanSpec}</div>
              <div class="ss-meta">
                <span style="font-size:0.75rem; color:#94a3b8; font-weight:700;">Official Spreadshop</span>
                <div class="ss-price">${escapeHtml(p.price)}</div>
              </div>
              <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener" class="ss-btn">🛍️ Buy Now on Spreadshop &rarr;</a>
            </div>
          </div>`;
}

// 1. Read UCM catalog-additions.json (6,290 records) and normalize for JCN
const ucmAdditions = JSON.parse(fs.readFileSync(path.join(UCM_ROOT, "data", "catalog-additions.json"), "utf8"));
const jcnExistingAdditions = JSON.parse(fs.readFileSync(path.join(ROOT, "catalog-additions.json"), "utf8"));
const typeLabels = Object.fromEntries(TYPES.map(([id, label]) => [id, label]));

// Merge UCM additions + JCN existing additions (deduplicated by id)
const mergedRawMap = new Map();
for (const r of ucmAdditions) {
  mergedRawMap.set(r.id, r);
}
for (const r of jcnExistingAdditions) {
  if (!mergedRawMap.has(r.id)) mergedRawMap.set(r.id, r);
}
const mergedRaw = [...mergedRawMap.values()];
const normalizedAdditions = normalize(mergedRaw).map((n) => {
  const isFourthwall = String(n.store).toLowerCase() === "fourthwall";
  const storeName = isFourthwall ? "Fourthwall" : "Spreadshop";
  const priceStr = typeof n.price === "number" ? `$${n.price.toFixed(2)}` : String(n.price);
  const desc = n.description || `Shop the official "${n.design}" ${n.productType}, fulfilled and shipped directly via our official ${storeName} storefront.`;
  return {
    ...n,
    price: priceStr,
    store: storeName,
    storeLabel: storeName,
    storeBadge: `Official ${storeName}`,
    title: n.name,
    cat: typeLabels[n.category] || "Tees & Tanks",
    department: n.category,
    material: desc,
    cta: `Buy Now on ${storeName} →`
  };
});

// Sort normalizedAdditions so today's 10 Hero Hoodies (-20) are first, then today's featured items, then everything else
const todayHeroHoodies = [];
const todayFeaturedItems = [];
const otherAdditions = [];
const perDesignCount = new Map();

for (const item of normalizedAdditions) {
  const isToday = TODAY_TITLES.includes(item.design);
  if (isToday && item.id.endsWith("-20")) {
    todayHeroHoodies.push(item);
  } else if (isToday && (item.id.endsWith("-210") || item.id.endsWith("-31") || item.id.endsWith("-1459"))) {
    const c = perDesignCount.get(item.design) || 0;
    if (c < 2) {
      perDesignCount.set(item.design, c + 1);
      todayFeaturedItems.push(item);
    } else {
      otherAdditions.push(item);
    }
  } else {
    otherAdditions.push(item);
  }
}

todayHeroHoodies.sort((a, b) => TODAY_TITLES.indexOf(a.design) - TODAY_TITLES.indexOf(b.design));

const finalAdditions = [
  ...todayHeroHoodies,
  ...todayFeaturedItems,
  ...otherAdditions
];

fs.writeFileSync(path.join(ROOT, "catalog-additions.json"), JSON.stringify(finalAdditions) + "\n");
console.log(`Updated catalog-additions.json with ${finalAdditions.length} verified records (${todayHeroHoodies.length} Today Hero Hoodies first).`);

// 2. Update spreadshop.html in JCN with all 40 featured Gothic hoodies
const allGothicFeatured = JSON.parse(fs.readFileSync(path.join(UCM_ROOT, "data", "gothic-launch-verified.json"), "utf8"));
let spHtml = fs.readFileSync(path.join(ROOT, "spreadshop.html"), "utf8");
const articlesHtml = allGothicFeatured.map((p) => {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  return `<article><a href="${esc(p.url)}" target="_blank" rel="noopener"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="600" height="600"></a><h3>${esc(p.name)}</h3><p>${esc(p.price)} USD · Direct Spreadshop Checkout</p><a class="launch-buy" href="${esc(p.url)}" target="_blank" rel="noopener">Buy Now on Spreadshop →</a></article>`;
}).join("");

spHtml = spHtml.replace(
  /<section class="launch-collection">[\s\S]*?<\/section>/,
  () => `<section class="launch-collection"><h2>New Daily Gothic Streetwear Drops (Live on Spreadshop)</h2><p>Featuring today's 10 brand-new Gothic designs (6,230+ total new product variations published in Spreadshop). Every Buy Now button below links directly to its Spreadshop checkout page.</p><div class="launch-grid">${articlesHtml}</div><p style="margin-top:20px"><a class="launch-buy" href="https://urbanclothesmarket.myspreadshop.com/all" target="_blank" rel="noopener">Browse all Spreadshop products and styles →</a></p></section>`
);
fs.writeFileSync(path.join(ROOT, "spreadshop.html"), spHtml);
console.log(`Updated spreadshop.html with ${allGothicFeatured.length} featured Gothic hoodies.`);

// 3. Compute total counts across base catalog + additions
const baseCatalog = JSON.parse(fs.readFileSync(path.join(ROOT, "real_products_catalog.json"), "utf8"));
const additionIds = new Set(finalAdditions.map((a) => a.id));
const dedupedBase = baseCatalog.filter((p) => !additionIds.has(p.id));
const totalCatalogCount = finalAdditions.length + dedupedBase.length;
const totalSpreadshopCount =
  finalAdditions.filter((p) => p.store === "Spreadshop").length +
  dedupedBase.filter((p) => p.store === "Spreadshop").length;

const totalFormatted = totalCatalogCount.toLocaleString("en-US");
const spreadshopFormatted = totalSpreadshopCount.toLocaleString("en-US");
console.log(`Total JCN Catalog: ${totalFormatted} (${spreadshopFormatted} Spreadshop)`);

// 4. Update index.html
let indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const initialEmbeddedIndex = [
  ...todayHeroHoodies,
  ...dedupedBase.slice(0, 38)
].map((item, idx) => ({ ...item, displayOrder: idx + 1 }));

indexHtml = indexHtml.replace(
  /let REAL_PRODUCTS_DATA = \[.*?\];/s,
  () => `let REAL_PRODUCTS_DATA = ${JSON.stringify(initialEmbeddedIndex)};`
);

const gridStartMarker = '<div class="real-catalog-grid" id="realCatalogGrid">';
const gStartIdx = indexHtml.indexOf(gridStartMarker);
if (gStartIdx !== -1) {
  const afterGridStart = gStartIdx + gridStartMarker.length;
  const targetEnd = indexHtml.indexOf('<div id="catalogScrollSentinel" style="grid-column: 1 / -1;', afterGridStart);
  if (targetEnd !== -1) {
    const cleanCardsHtml = initialEmbeddedIndex.map((p) => createCardElement(p)).join("\n");
    indexHtml = indexHtml.slice(0, afterGridStart) + "\n" + cleanCardsHtml + "\n    " + indexHtml.slice(targetEnd);
    console.log("Updated #realCatalogGrid in index.html with clean cards and today's 10 new Gothic designs first.");
  }
}

const remainingInitial = (totalCatalogCount - initialEmbeddedIndex.length).toLocaleString("en-US");
indexHtml = indexHtml
  .replaceAll("18,682", totalFormatted)
  .replaceAll("18,622", totalFormatted)
  .replaceAll("18,574", remainingInitial)
  .replaceAll("15,845", spreadshopFormatted)
  .replaceAll("15,835", spreadshopFormatted)
  .replaceAll("catalog-additions.json?v=20261103", "catalog-additions.json?v=20261107")
  .replaceAll("catalog-model.mjs?v=20261103", "catalog-model.mjs?v=20261107");

fs.writeFileSync(path.join(ROOT, "index.html"), indexHtml);

// 5. Update shop/index.html
let shopHtml = fs.readFileSync(path.join(ROOT, "shop", "index.html"), "utf8");
const shelfMarker = '<div class="spreadshop-shelf" id="spreadshopShelf">';
const shelfIdx = shopHtml.indexOf(shelfMarker);
if (shelfIdx !== -1) {
  const shelfItems = [...todayHeroHoodies, ...todayFeaturedItems.slice(0, 10)];
  const shelfCardsHtml = "\n" + shelfItems.map((p) => createShelfCard(p)).join("\n\n") + "\n";
  if (!shopHtml.includes(todayHeroHoodies[0].url)) {
    shopHtml = shopHtml.slice(0, shelfIdx + shelfMarker.length) + shelfCardsHtml + shopHtml.slice(shelfIdx + shelfMarker.length);
    console.log("Prepended 20 new daily Gothic Spreadshop cards to #spreadshopShelf in shop/index.html.");
  }
}

const initialEmbeddedShop = [
  ...todayHeroHoodies,
  ...todayFeaturedItems.slice(0, 10),
  ...dedupedBase.slice(0, 76)
].map((item, idx) => ({ ...item, displayOrder: idx + 1 }));

shopHtml = shopHtml.replace(
  /let ALL_PRODUCTS = \[.*?\];/s,
  () => `let ALL_PRODUCTS = ${JSON.stringify(initialEmbeddedShop)};`
);

shopHtml = shopHtml
  .replaceAll("18,682", totalFormatted)
  .replaceAll("18,622", totalFormatted)
  .replaceAll("15,845", spreadshopFormatted)
  .replaceAll("15,835", spreadshopFormatted)
  .replaceAll("catalog-additions.json?v=20261103", "catalog-additions.json?v=20261107")
  .replaceAll("catalog-model.mjs?v=20261103", "catalog-model.mjs?v=20261107");

fs.writeFileSync(path.join(ROOT, "shop", "index.html"), shopHtml);
console.log("Successfully synced Domain 2 (jasontvmarketplace.com)!");
