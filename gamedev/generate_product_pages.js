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

const productsDir = path.join(__dirname, 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

let sitemapUrls = [
  '  <url>',
  '    <loc>https://jasoncoleman-gamedev.surge.sh/</loc>',
  '    <lastmod>2026-10-01</lastmod>',
  '    <changefreq>daily</changefreq>',
  '    <priority>1.0</priority>',
  '  </url>'
];

products.forEach(p => {
  const filename = `${p.id}.html`;
  const filepath = path.join(productsDir, filename);
  const canonicalUrl = `https://jasoncoleman-gamedev.surge.sh/products/${filename}`;
  const coverRelative = `../${p.cover}`;
  const coverAbsolute = `https://jasoncoleman-gamedev.surge.sh/${p.cover}`;

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
  {
    "@context": "https://schema.org",
    "@type": "${p.category === 'engine' || p.category === 'godot' ? 'SoftwareApplication' : 'Product'}",
    "name": "${p.title}",
    "description": "${p.description.replace(/"/g, '\\"')}",
    "image": "${coverAbsolute}",
    "brand": {
      "@type": "Brand",
      "name": "Jason Coleman Game Studios"
    },
    "offers": {
      "@type": "Offer",
      "price": "${p.price}",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "${p.itchUrl}"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${p.rating}",
      "reviewCount": "${p.reviews}"
    }
  }
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
  </main>
</body>
</html>`;

  fs.writeFileSync(filepath, html, 'utf-8');
  console.log(`Generated: products/${filename}`);

  sitemapUrls.push('  <url>');
  sitemapUrls.push(`    <loc>${canonicalUrl}</loc>`);
  sitemapUrls.push('    <lastmod>2026-10-01</lastmod>');
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
