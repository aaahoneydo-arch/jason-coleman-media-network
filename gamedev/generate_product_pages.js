const fs = require('fs');
const path = require('path');

// Read products.js
const productsFile = fs.readFileSync(path.join(__dirname, 'products.js'), 'utf-8');
const vm = require('vm');
const context = {};
vm.createContext(context);
vm.runInContext(productsFile + '; this.PRODUCTS = PRODUCTS;', context);
const products = context.PRODUCTS;

console.log(`Loaded ${products.length} products to generate SEO landing pages.`);

// Load itch games catalog to match numeric IDs for custom covers and screenshots
let itchCatalog = [];
try {
  const catalogPath = path.join(__dirname, '..', '..', 'itch_games_catalog.json');
  if (fs.existsSync(catalogPath)) {
    itchCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  }
} catch(e) {}

const productsDir = path.join(__dirname, 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

let sitemapUrls = [
  '  <url>',
  '    <loc>https://jasontvmarketplace.com/gamedev/</loc>',
  '    <lastmod>2026-10-03</lastmod>',
  '    <changefreq>daily</changefreq>',
  '    <priority>1.0</priority>',
  '  </url>'
];

products.forEach(p => {
  const filename = `${p.id}.html`;
  const filepath = path.join(productsDir, filename);
  const canonicalUrl = `https://jasontvmarketplace.com/gamedev/products/${filename}`;

  // Match itch catalog for numeric ID
  const catalogMatch = itchCatalog.find(c => c.viewUrl && (c.viewUrl === p.itchUrl || c.viewUrl.split('/').pop() === p.id || c.title.toLowerCase() === p.title.toLowerCase()));
  const numId = catalogMatch ? catalogMatch.id : null;

  let coverRelative = `../${p.cover}`;
  let coverAbsolute = `https://jasontvmarketplace.com/gamedev/${p.cover}`;
  const coversDirPath = path.join(__dirname, 'assets', 'covers');

  if (numId && fs.existsSync(path.join(coversDirPath, `cover_${numId}.jpg`))) {
    coverRelative = `../assets/covers/cover_${numId}.jpg`;
    coverAbsolute = `https://jasontvmarketplace.com/gamedev/assets/covers/cover_${numId}.jpg`;
  }

  // Check for screenshots
  let screensHtml = '';
  if (numId && fs.existsSync(path.join(coversDirPath, `screen_${numId}_1.jpg`)) && fs.existsSync(path.join(coversDirPath, `screen_${numId}_2.jpg`))) {
    screensHtml = `
    <!-- In-Engine & Terminal Visual Previews -->
    <section class="product-gallery-section" style="margin-top: 40px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px;">
        <h2 style="font-family:'Cinzel',serif; font-size:1.5rem; color:#fff; margin:0;">In-Engine Screenshots &amp; Technical Inspection</h2>
        <span style="color:var(--cyan); font-weight:700; font-size:0.85rem; text-transform:uppercase; letter-spacing:1px;">2 Technical Views</span>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; overflow:hidden; padding:12px;">
          <img src="../assets/covers/screen_${numId}_1.jpg" alt="${p.title} Live CLI Execution &amp; Runtime Metrics" style="width:100%; border-radius:8px; display:block;" loading="lazy">
          <p style="font-size:0.82rem; color:var(--text-dim); margin-top:8px; text-align:center;">Interactive CLI Execution &amp; Benchmark Profiling</p>
        </div>
        <div style="background:var(--card-bg); border:1px solid var(--border-color); border-radius:12px; overflow:hidden; padding:12px;">
          <img src="../assets/covers/screen_${numId}_2.jpg" alt="${p.title} Architecture Data Structure &amp; Specifications" style="width:100%; border-radius:8px; display:block;" loading="lazy">
          <p style="font-size:0.82rem; color:var(--text-dim); margin-top:8px; text-align:center;">Data Structure Matrix &amp; Specification Reference</p>
        </div>
      </div>
    </section>`;
  }

  const isSoftware = (p.category === 'engine' || p.category === 'godot');
  const cleanSku = (p.id && p.id.length > 28)
    ? ('GDEV-' + (numId || p.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)).toUpperCase())
    : (p.id || 'GDEV-APP');

  const schemaData = {
    "@context": "https://schema.org",
    "@type": isSoftware ? ["Product", "SoftwareApplication"] : "Product",
    "name": p.title,
    "description": p.description,
    "image": coverAbsolute,
    "sku": cleanSku,
    "mpn": cleanSku,
    "brand": {
      "@type": "Brand",
      "name": "Jason Coleman Game Studios"
    },
    ...(isSoftware ? {
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Windows, macOS, Linux"
    } : {}),
    "offers": {
      "@type": "Offer",
      "price": p.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "url": p.itchUrl,
      "seller": {
        "@type": "Organization",
        "name": "Jason Coleman Game Studios",
        "url": "https://jasontvmarketplace.com/gamedev/"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0.00",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
        "merchantReturnLink": "https://jasontvmarketplace.com/gamedev/"
      }
    }
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.title} | Jason Coleman Game Studios</title>
  
  <!-- SEO & Search Discovery Meta Tags -->
  <meta name="description" content="${p.subtitle} Full commercial royalty-free license with instant direct download on itch.io.">
  <meta name="keywords" content="${p.badges.join(', ')}, ${p.title}, game development, indie game assets, game engine, Jason Coleman">
  <meta name="author" content="Jason Coleman">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- OpenGraph / Social Sharing -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${p.title}">
  <meta property="og:description" content="${p.subtitle}">
  <meta property="og:image" content="${coverAbsolute}">
  <meta property="product:price:amount" content="${p.price}">
  <meta property="product:price:currency" content="USD">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.title}">
  <meta name="twitter:description" content="${p.subtitle}">
  <meta name="twitter:image" content="${coverAbsolute}">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="../style.css">

  <!-- Schema.org JSON-LD Structured Data for Google Rich Results -->
  <script type="application/ld+json">
  ${JSON.stringify(schemaData, null, 2)}
  </script>
  <style>
    .product-detail-container {
      max-width: 1100px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .back-nav {
      margin-bottom: 24px;
    }
    .back-nav a {
      color: var(--amber);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .product-detail-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 32px;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .product-detail-cover {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.1);
    }
    .detail-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .detail-title {
      font-family: 'Cinzel', serif;
      font-size: 1.8rem;
      color: #fff;
      line-height: 1.25;
    }
    .detail-sub {
      color: var(--text-dim);
      font-size: 1.05rem;
      line-height: 1.5;
    }
    .detail-price-box {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding: 16px 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }
    .detail-price {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--amber);
    }
    .detail-license {
      color: var(--cyan);
      font-weight: 600;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .detail-desc {
      color: var(--text-main);
      font-size: 0.95rem;
      line-height: 1.65;
    }
    .detail-specs {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .detail-specs li {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-dim);
      font-size: 0.9rem;
    }
    .detail-specs li::before {
      content: "✓";
      color: var(--amber);
      font-weight: bold;
    }
    .detail-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    .btn-buy-itch {
      flex: 1;
      background: linear-gradient(135deg, #fa5c5c, #e03b3b);
      color: #fff;
      text-align: center;
      padding: 14px 20px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(250,92,92,0.3);
      transition: all 0.2s ease;
    }
    .btn-buy-itch:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(250,92,92,0.5);
    }
    .btn-buy-gumroad {
      flex: 1;
      background: linear-gradient(135deg, #ff90e8, #ff60d0);
      color: #000;
      text-align: center;
      padding: 14px 20px;
      border-radius: 8px;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(255,144,232,0.3);
      transition: all 0.2s ease;
    }
    .btn-buy-gumroad:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255,144,232,0.5);
    }
    @media(max-width: 800px) {
      .product-detail-layout {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <!-- Main Navigation -->
  <header class="site-header">
    <div class="container header-inner">
      <a href="../index.html" class="brand-logo">
        <div class="brand-icon">⚡</div>
        <div class="brand-text">
          <span class="brand-name">JASON COLEMAN</span>
          <span class="brand-tagline">GAME STUDIOS & ASSET VAULT</span>
        </div>
      </a>
      <nav class="nav-menu">
        <a href="../index.html#catalog" class="nav-link">Catalog (31)</a>
        <a href="${p.itchUrl}" target="_blank" rel="noopener" class="nav-btn-primary">
          <span>Buy on itch.io ($${p.price})</span>
        </a>
      </nav>
    </div>
  </header>

  <main class="product-detail-container">
    <div class="back-nav">
      <a href="../index.html#catalog">← Back to Full Catalog</a>
    </div>

    <article class="product-detail-layout">
      <div>
        <img src="${coverRelative}" alt="${p.title}" class="product-detail-cover" />
      </div>
      <div class="detail-info">
        <div class="card-badges">
          ${p.badges.map(b => `<span class="badge badge-tech">${b}</span>`).join('')}
        </div>
        <h1 class="detail-title">${p.title}</h1>
        <p class="detail-sub">${p.subtitle}</p>
        
        <div class="detail-price-box">
          <span class="detail-price">$${p.price}</span>
          <span class="detail-license">100% Royalty-Free Commercial License</span>
        </div>

        <p class="detail-desc">${p.description}</p>

        <ul class="detail-specs">
          ${p.specs.map(s => `<li>${s}</li>`).join('')}
        </ul>

        <div class="detail-actions">
          <a href="${p.itchUrl}" target="_blank" rel="noopener" class="btn-buy-itch">
            Buy on itch.io ($${p.price}) →
          </a>
          <a href="${p.gumroadUrl}" target="_blank" rel="noopener" class="btn-buy-gumroad">
            Shop Gumroad →
          </a>
        </div>
      </div>
    </article>

    ${screensHtml}
  </main>
</body>
</html>`;

  fs.writeFileSync(filepath, html, 'utf-8');
  console.log(`Generated: products/${filename}`);

  sitemapUrls.push('  <url>');
  sitemapUrls.push(`    <loc>${canonicalUrl}</loc>`);
  sitemapUrls.push('    <lastmod>2026-10-03</lastmod>');
  sitemapUrls.push('    <changefreq>weekly</changefreq>');
  sitemapUrls.push('    <priority>0.8</priority>');
  sitemapUrls.push('    <image:image>');
  sitemapUrls.push(`      <image:loc>${coverAbsolute}</image:loc>`);
  sitemapUrls.push(`      <image:title>${p.title.replace(/&/g, '&amp;')}</image:title>`);
  sitemapUrls.push('    </image:image>');
  sitemapUrls.push('  </url>');
});

// Update sitemap.xml
const fullSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), fullSitemap, 'utf-8');
console.log(`Updated sitemap.xml with ${sitemapUrls.length} entries!`);
