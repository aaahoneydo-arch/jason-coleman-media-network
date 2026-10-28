#!/usr/bin/env node
/**
 * scripts/sync-amazon-books.cjs
 * Automatically syncs Jason Coleman's published Amazon KDP books (Author ID: B0HHYS2BHM),
 * updates books-catalog.json, and regenerates:
 *   - books.html (All 18+ Live Published Books + Weekly KDP Release Queue + Rich Schema)
 *   - books/index.html & books/<slug>/index.html (18 Dedicated Book SEO Landing Pages + 12 Theme-Matched 5-Store Merch Items)
 *   - index.html (#books section, STATIC_BOOKS search index, and nav badges)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const BOOKS_CATALOG_PATH = path.join(ROOT, 'books-catalog.json');
const PRODUCTS_CATALOG_PATH = path.join(ROOT, 'shop', 'products-catalog.json');

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fetchUrl(url, timeoutMs = 6000) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        timeout: timeoutMs
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }
    );
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: '' });
    });
  });
}

async function checkAmazonAuthorStore(booksCatalog) {
  const authorId = booksCatalog.author?.authorId || 'B0HHYS2BHM';
  const urls = [
    `https://www.amazon.com/stores/Jason-Coleman/author/${authorId}/allbooks`,
    `https://www.amazon.com/s?i=stripbooks&rh=p_27%3AJason+Coleman&s=date-desc-rank`
  ];
  const knownAsins = new Set();
  for (const b of booksCatalog.books) {
    if (b.primaryAsin) knownAsins.add(b.primaryAsin);
    if (b.kindleAsin) knownAsins.add(b.kindleAsin);
    if (b.paperbackAsin) knownAsins.add(b.paperbackAsin);
    if (b.hardcoverAsin) knownAsins.add(b.hardcoverAsin);
    if (b.audiobookAsin) knownAsins.add(b.audiobookAsin);
  }

  let discoveredCount = 0;
  for (const u of urls) {
    const res = await fetchUrl(u, 4500);
    if (res.status === 200 && res.body) {
      const asinMatches = res.body.match(/\/dp\/(B0[A-Z0-9]{8})/g) || [];
      for (const m of asinMatches) {
        const asin = m.replace('/dp/', '');
        if (!knownAsins.has(asin)) {
          discoveredCount++;
        }
      }
    }
  }
  booksCatalog.lastSyncedAt = new Date().toISOString();
  fs.writeFileSync(BOOKS_CATALOG_PATH, JSON.stringify(booksCatalog, null, 2) + '\n', 'utf8');
  console.log(`[sync-amazon-books] Checked Amazon Author Store (${authorId}); catalog has ${booksCatalog.books.length} verified live books and ${booksCatalog.upcomingPipeline.length} upcoming pipeline titles.`);
}

function selectThemeMatchedMerch(book, allProducts, count = 12) {
  const themes = (book.themes || []).map((t) => t.toLowerCase());
  const titleWords = (book.title + ' ' + book.genre)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 3 && !['book', 'novel', 'series', 'from', 'with', 'that', 'this', 'into'].includes(w));

  const keywords = [...new Set([...themes, ...titleWords])];
  const byStore = { Spreadshop: [], Printify: [], Zazzle: [], Redbubble: [], TeePublic: [] };

  for (let i = 0; i < allProducts.length; i++) {
    const p = allProducts[i];
    const hay = `${p.title} ${p.design || ''} ${p.cat || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (hay.includes(kw)) score += 2;
    }
    if (score > 0 && byStore[p.store] && byStore[p.store].length < 40) {
      byStore[p.store].push({ p, score });
    }
  }

  for (const s of Object.keys(byStore)) {
    byStore[s].sort((a, b) => b.score - a.score);
  }

  const picked = [];
  const usedIds = new Set();
  const stores = ['Spreadshop', 'Printify', 'Zazzle', 'Redbubble', 'TeePublic'];
  let round = 0;
  while (picked.length < count && round < 20) {
    for (const s of stores) {
      if (picked.length >= count) break;
      const list = byStore[s];
      if (list && list[round] && !usedIds.has(list[round].p.id)) {
        picked.push(list[round].p);
        usedIds.add(list[round].p.id);
      }
    }
    round++;
  }

  // Fallback fill if needed
  let idx = 0;
  while (picked.length < count && idx < allProducts.length) {
    const p = allProducts[idx++];
    if (!usedIds.has(p.id)) {
      picked.push(p);
      usedIds.add(p.id);
    }
  }
  return picked;
}

function renderFormatButtons(book, prefixPath = '') {
  const btns = [];
  if (book.kindleAsin) {
    btns.push(
      `<a class="button primary" href="https://www.amazon.com/dp/${book.kindleAsin}" target="_blank" rel="noopener" style="background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;font-weight:800;border:none;">📱 Kindle ($${book.price || '4.99'}${book.kindleUnlimited ? ' • KU Free' : ''}) ↗</a>`
    );
  }
  if (book.paperbackAsin) {
    btns.push(
      `<a class="button" href="https://www.amazon.com/dp/${book.paperbackAsin}" target="_blank" rel="noopener" style="background:rgba(255,153,0,0.14);border:1px solid rgba(255,153,0,0.45);color:#ffbb33;font-weight:700;">📖 Paperback${book.paperbackPrice ? ' ($' + book.paperbackPrice + ')' : ''} ↗</a>`
    );
  }
  if (book.hardcoverAsin) {
    btns.push(
      `<a class="button" href="https://www.amazon.com/dp/${book.hardcoverAsin}" target="_blank" rel="noopener" style="background:rgba(0,210,211,0.14);border:1px solid rgba(0,210,211,0.45);color:#00d2d3;font-weight:700;">📕 Hardcover${book.hardcoverPrice ? ' ($' + book.hardcoverPrice + ')' : ''} ↗</a>`
    );
  }
  if (book.audiobookAsin) {
    btns.push(
      `<a class="button" href="https://www.amazon.com/dp/${book.audiobookAsin}" target="_blank" rel="noopener" style="background:rgba(168,85,247,0.18);border:1px solid rgba(168,85,247,0.5);color:#d8b4fe;font-weight:700;">🎧 Audible Audiobook ↗</a>`
    );
  }
  if (book.trailerUrl) {
    btns.push(
      `<a class="button" href="${esc(book.trailerUrl)}" target="_blank" rel="noopener" style="background:rgba(254,44,85,0.15);border:1px solid rgba(254,44,85,0.45);color:#ff6b81;font-weight:700;">▶ Watch Video Trailer ↗</a>`
    );
  }
  btns.push(
    `<a class="button" href="${prefixPath}books/${book.slug}/" style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.2);color:#e2e8f0;font-weight:700;">🔍 Book Page &amp; Merch &rarr;</a>`
  );
  return btns.join('\n          ');
}

function buildBookSchemaItem(book, pos) {
  const offers = [];
  const addOffer = (asin, price, formatName) => {
    if (!asin) return;
    offers.push({
      '@type': 'Offer',
      name: `${book.title} (${formatName})`,
      sku: asin,
      price: String(price || book.price || '4.99'),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.amazon.com/dp/${asin}`,
      seller: { '@type': 'Organization', name: 'Amazon.com' }
    });
  };
  addOffer(book.kindleAsin, book.price || '4.99', 'Kindle Edition');
  addOffer(book.paperbackAsin, book.paperbackPrice || book.price || '9.99', 'Paperback');
  addOffer(book.hardcoverAsin, book.hardcoverPrice || '14.99', 'Hardcover');
  addOffer(book.audiobookAsin, book.price || '14.99', 'Audible Audiobook');

  return {
    '@type': 'ListItem',
    position: pos,
    item: {
      '@type': 'Book',
      '@id': `https://jasontvmarketplace.com/books/${book.slug}/#book`,
      name: book.title,
      alternativeHeadline: book.subtitle,
      author: {
        '@type': 'Person',
        name: 'Jason Coleman',
        url: 'https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks'
      },
      url: `https://jasontvmarketplace.com/books/${book.slug}/`,
      sameAs: `https://www.amazon.com/dp/${book.primaryAsin}`,
      genre: book.genre,
      image: book.cover,
      description: book.description,
      offers: offers.length === 1 ? offers[0] : offers
    }
  };
}

function generateBooksHubHtml(booksCatalog, isSubdir = false) {
  const prefix = isSubdir ? '../' : '';
  const canonical = isSubdir ? 'https://jasontvmarketplace.com/books/' : 'https://jasontvmarketplace.com/books.html';
  const books = booksCatalog.books;
  const pipeline = booksCatalog.upcomingPipeline || [];

  const schemaObj = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Books by Jason Coleman — Official 18-Book Amazon KDP Library',
    description: 'Explore all 18 live published books by author Jason Coleman across post-apocalyptic survival, espionage thrillers, dark vampire fantasy, cyberpunk sci-fi, philosophy, military history, graphic novels, and children\'s coloring books. 2 new books published every week on Amazon KDP.',
    url: canonical,
    numberOfItems: books.length,
    itemListElement: books.map((b, i) => buildBookSchemaItem(b, i + 1))
  };

  const newReleases = books.slice(0, 2); // Dixon's Journal Book One & A Beautiful Alibi

  const spotlightHtml = newReleases
    .map(
      (b) => `
      <article class="spotlight-book-card">
        <div class="spotlight-cover-wrap">
          <span class="release-pill">🔥 ${esc(b.badge)}</span>
          <a href="${prefix}books/${b.slug}/">
            <img src="${esc(b.cover)}" alt="${esc(b.title)} by Jason Coleman" loading="eager">
          </a>
        </div>
        <div class="spotlight-body">
          <div class="book-series-tag">${esc(b.series)} &bull; ${esc(b.genre)}</div>
          <h2><a href="${prefix}books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h2>
          <p class="book-subtitle">${esc(b.subtitle)}</p>
          <p class="book-desc">${esc(b.description)}</p>
          <div class="asin-pills">
            ${b.kindleAsin ? `<span>Kindle ASIN: <strong>${b.kindleAsin}</strong></span>` : ''}
            ${b.paperbackAsin ? `<span>Paperback ASIN: <strong>${b.paperbackAsin}</strong></span>` : ''}
            ${b.hardcoverAsin ? `<span>Hardcover ASIN: <strong>${b.hardcoverAsin}</strong></span>` : ''}
            ${b.kindleUnlimited ? `<span class="ku-tag">✓ Kindle Unlimited Eligible</span>` : ''}
          </div>
          <div class="book-actions">
            ${renderFormatButtons(b, prefix)}
          </div>
        </div>
      </article>`
    )
    .join('\n');

  const gridHtml = books
    .map(
      (b, idx) => `
      <article class="tile book" id="${esc(b.slug)}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <span class="book-badge">${esc(b.badge || b.genre)}</span>
          ${b.kindleUnlimited ? '<span style="font-size:0.7rem;font-weight:800;color:#00d2d3;background:rgba(0,210,211,0.12);padding:2px 7px;border-radius:4px;border:1px solid rgba(0,210,211,0.3);">Kindle Unlimited</span>' : ''}
        </div>
        <a href="${prefix}books/${b.slug}/" style="display:block;text-align:center;background:#070b14;padding:14px;border-radius:10px;margin-bottom:12px;border:1px solid rgba(255,255,255,0.06);">
          <img src="${esc(b.cover)}" alt="${esc(b.title)} book cover" loading="${idx < 4 ? 'eager' : 'lazy'}" decoding="async" style="max-height:290px;width:auto;max-width:100%;margin:0 auto;border-radius:6px;box-shadow:0 10px 25px rgba(0,0,0,0.65);">
        </a>
        <div style="font-size:0.75rem;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">${esc(b.series)}</div>
        <h2 style="font-size:1.22rem;margin:0 0 6px;"><a href="${prefix}books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h2>
        <p style="font-size:0.86rem;color:#cbd5e1;font-style:italic;margin:0 0 10px;">${esc(b.subtitle)}</p>
        <p style="font-size:0.9rem;color:#94a3b8;line-height:1.55;">${esc(b.description)}</p>
        <div class="book-actions">
          ${renderFormatButtons(b, prefix)}
        </div>
      </article>`
    )
    .join('\n');

  const pipelineHtml = pipeline
    .map(
      (item, idx) => `
      <div class="pipeline-card">
        <div class="pipeline-num">Queue #${idx + 1}</div>
        <h3>${esc(item.title)}</h3>
        <div class="pipeline-genre">${esc(item.genre)}</div>
        <div class="pipeline-status">⏳ ${esc(item.status)}</div>
      </div>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jason Coleman Books | All 18 Live Published Amazon Novels, Graphic Novels &amp; Weekly KDP Schedule</title>
  <meta name="description" content="Explore all 18 live published books by author Jason Coleman on Amazon: Dixon's Journal: Book One — A House Beneath The Ash, A Beautiful Alibi, Draevan Books 1 &amp; 2, TIFF Books 1 &amp; 2, The Shattered Crown, The Real Americana, and more. 2 new KDP books released every week!">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index,follow,max-image-preview:large">

  <meta property="og:type" content="website">
  <meta property="og:title" content="Jason Coleman Books | All 18 Published Amazon Books &amp; Weekly KDP Releases">
  <meta property="og:description" content="Shop all 18 live Amazon books by Jason Coleman in Kindle Unlimited, Paperback, Hardcover &amp; Audible Audiobook, including today's new releases Dixon's Journal: Book One and A Beautiful Alibi.">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://m.media-amazon.com/images/I/81JCH1wM8sL._SL1000_.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Jason Coleman Books | 18 Published Amazon Titles + 2 New Books Weekly">
  <meta name="twitter:description" content="Kindle Unlimited, Paperback, Hardcover &amp; Audible editions by author Jason Coleman.">
  <meta name="twitter:image" content="https://m.media-amazon.com/images/I/81JCH1wM8sL._SL1000_.jpg">

  <link rel="icon" type="image/svg+xml" href="${prefix}favicon.svg">
  <link rel="icon" type="image/png" sizes="192x192" href="${prefix}icon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${prefix}apple-touch-icon.png">
  <link rel="manifest" href="${prefix}manifest.json">
  <meta name="theme-color" content="#0a0f1d">

  <link rel="stylesheet" href="${prefix}discovery.css">
  <style>
    .book-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255, 200, 117, 0.15);
      color: var(--accent);
    }
    .book-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: auto;
      padding-top: 14px;
    }
    .book-actions .button {
      font-size: 0.82rem;
      padding: 8px 12px;
      border-radius: 6px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .nav-gold {
      color: var(--accent) !important;
      font-weight: 700;
    }
    .spotlight-section {
      margin: 2rem 0 3rem;
      padding: 1.75rem;
      background: linear-gradient(145deg, rgba(20, 28, 48, 0.95), rgba(10, 15, 28, 0.98));
      border: 1.5px solid rgba(255, 170, 0, 0.45);
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    }
    .spotlight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.75rem;
      margin-top: 1.25rem;
    }
    .spotlight-book-card {
      display: flex;
      gap: 1.25rem;
      background: rgba(8, 12, 22, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.25rem;
      flex-wrap: wrap;
    }
    .spotlight-cover-wrap {
      flex: 0 0 170px;
      text-align: center;
    }
    .spotlight-cover-wrap img {
      width: 100%;
      max-width: 170px;
      border-radius: 8px;
      box-shadow: 0 12px 28px rgba(0,0,0,0.7);
    }
    .release-pill {
      display: inline-block;
      background: linear-gradient(135deg, #ff9900, #ff5500);
      color: #000;
      font-weight: 900;
      font-size: 0.7rem;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }
    .spotlight-body {
      flex: 1;
      min-width: 240px;
      display: flex;
      flex-direction: column;
    }
    .book-series-tag {
      font-size: 0.76rem;
      font-weight: 800;
      color: #00d2d3;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .book-subtitle {
      font-size: 0.92rem;
      color: #ffbb33;
      font-style: italic;
      margin: 4px 0 10px;
    }
    .book-desc {
      font-size: 0.9rem;
      color: #cbd5e1;
      line-height: 1.55;
      margin-bottom: 10px;
    }
    .asin-pills {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .asin-pills span {
      background: rgba(255,255,255,0.05);
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .ku-tag {
      color: #00d2d3 !important;
      border-color: rgba(0,210,211,0.35) !important;
      font-weight: 700;
    }
    .pipeline-section {
      margin: 3.5rem 0;
      padding: 2rem;
      background: linear-gradient(145deg, rgba(13, 22, 38, 0.95), rgba(8, 13, 24, 0.98));
      border: 1px solid rgba(0, 210, 211, 0.35);
      border-radius: 16px;
    }
    .pipeline-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .pipeline-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 1rem 1.15rem;
    }
    .pipeline-num {
      font-size: 0.72rem;
      font-weight: 800;
      color: #ffaa00;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .pipeline-card h3 {
      font-size: 1.02rem;
      color: #fff;
      margin: 6px 0;
    }
    .pipeline-genre {
      font-size: 0.83rem;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .pipeline-status {
      font-size: 0.76rem;
      font-weight: 700;
      color: #00d2d3;
    }
  </style>

  <!-- Google Structured Data: ItemList of All 18 Live Books -->
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <header>
    <div class="wrap">
      <a class="brand" href="${prefix}index.html">JASONTV MARKETPLACE</a>
      <nav aria-label="Main navigation">
        <a href="${prefix}index.html">Hub</a>
        <a href="${prefix}shop/index.html" class="nav-gold">🛍️ Merch Shop (18,622)</a>
        <a href="${prefix}books.html" style="color:#fff;font-weight:800;">📚 Books (18 Live)</a>
        <a href="${prefix}guides/index.html" style="color:#00d2d3;font-weight:700;">🎁 Gift Guides (15)</a>
        <a href="${prefix}gamedev/index.html">⚡ Game Studios (122)</a>
        <a href="${prefix}watch.html">Watch Cinema</a>
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Store ↗</a>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap">
    <span class="eyebrow">Official Amazon Author Library &bull; 18 Live Titles + 2 New Releases Every Week</span>
    <h1>Books by Jason Coleman (All 18 Published Amazon Works)</h1>
    <p class="lead">Explore the complete 18-book catalog by author Jason Coleman (Jason Ray Coleman) on Amazon—spanning post-apocalyptic survival fiction (<em>Dixon's Journal</em>), near-future espionage thrillers (<em>A Beautiful Alibi</em>), supernatural vampire sagas (<em>Draevan Books 1 &amp; 2</em>), cybernetic AI thrillers (<em>TIFF Books 1 &amp; 2</em>), epic fantasy (<em>The Shattered Crown</em>), true-inspired heartland fiction (<em>The Real Americana</em>), illustrated graphic novels, philosophy, military history, and children's interactive coloring books.</p>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:1.25rem 0 2rem;">
      <a class="button primary" href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener" style="background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;font-weight:900;">🛒 Shop All 18 Books on Amazon Author Central ↗</a>
      <a class="button" href="#weekly-kdp-schedule" style="border-color:#00d2d3;color:#00d2d3;font-weight:700;">📅 Weekly KDP Release Queue (2 New Books/Week) &darr;</a>
      <a class="button" href="${prefix}guides/index.html" style="border-color:#ffaa00;color:#ffaa00;font-weight:700;">🎁 Browse 15 Book &amp; Merch Gift Guides &rarr;</a>
      <a class="button" href="${prefix}shop/index.html">👕 Shop 18,622 Matching Creator Merch Items &rarr;</a>
    </div>

    <!-- Spotlight: Today's Brand-New Oct 28 Releases -->
    <section class="spotlight-section" aria-label="Brand New Releases">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <div>
          <span style="font-size:0.76rem;font-weight:900;color:#ffaa00;text-transform:uppercase;letter-spacing:0.08em;">🚨 New Releases Live on Amazon Today (Oct 28)</span>
          <h2 style="margin:4px 0 0;font-size:1.6rem;color:#fff;">Featured Latest Releases: Kindle, Paperback &amp; Hardcover</h2>
        </div>
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener" style="color:#ffaa00;font-weight:800;font-size:0.9rem;">Follow Jason Coleman on Amazon ↗</a>
      </div>
      <div class="spotlight-grid">
        ${spotlightHtml}
      </div>
    </section>

    <!-- Complete 18 Published Books Grid -->
    <h2 style="font-size:1.65rem;margin:2.5rem 0 0.5rem;">📚 Complete 18-Book Published Catalog (All Formats)</h2>
    <p style="color:#94a3b8;margin-bottom:1.5rem;">Click any format button to buy directly on Amazon, or open the dedicated book page to explore theme-matched graphic tees, hoodies, mugs, and journals.</p>

    <div class="grid">
      ${gridHtml}
    </div>

    <!-- Weekly KDP Release Schedule Pipeline Section -->
    <section class="pipeline-section" id="weekly-kdp-schedule">
      <span class="book-badge" style="background:rgba(0,210,211,0.18);color:#00d2d3;">📅 Automated Weekly KDP Publishing Pipeline</span>
      <h2 style="font-size:1.6rem;color:#fff;margin:6px 0 8px;">Weekly KDP Release Schedule (2 New Books Added Every Week)</h2>
      <p style="color:#cbd5e1;line-height:1.6;margin:0 0 1rem;">Jason Coleman publishes <strong>2 brand-new books every week</strong> on Amazon Kindle Direct Publishing (KDP) across Kindle eBook, Paperback, and Hardcover editions. Here is the upcoming production queue currently preparing to drop on Amazon Author Central:</p>
      <div class="pipeline-grid">
        ${pipelineHtml}
      </div>
      <div style="margin-top:1.5rem;display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <a class="button primary" href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener" style="background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;font-weight:900;">🔔 Follow Author Page on Amazon for Weekly Drops ↗</a>
        <a class="button" href="${prefix}guides/index.html">🎁 Explore 15 Curated Reader &amp; Merch Gift Guides &rarr;</a>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <strong>JasonTV Marketplace</strong> &bull; Jason Coleman &bull;
      <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Page (18+ Books)</a> &bull;
      <a href="${prefix}shop/index.html">5-Store Merch Catalog (18,622 Items)</a> &bull;
      <a href="${prefix}guides/index.html">15 Buyer's Guides</a> &bull;
      <a href="https://jasonc101.itch.io/" target="_blank" rel="noopener">itch.io Store (122 Live)</a> &bull;
      <a href="${prefix}index.html">Main Hub</a>
    </div>
  </footer>
</body>
</html>`;
}

function generateSingleBookPageHtml(book, booksCatalog, allProducts) {
  const matchedMerch = selectThemeMatchedMerch(book, allProducts, 12);
  const otherBooks = booksCatalog.books.filter((b) => b.slug !== book.slug).slice(0, 6);

  const offers = [];
  if (book.kindleAsin) {
    offers.push({
      '@type': 'Offer',
      name: `${book.title} - Kindle Edition`,
      sku: book.kindleAsin,
      price: String(book.price || '4.99'),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.amazon.com/dp/${book.kindleAsin}`,
      seller: { '@type': 'Organization', name: 'Amazon.com' }
    });
  }
  if (book.paperbackAsin) {
    offers.push({
      '@type': 'Offer',
      name: `${book.title} - Paperback`,
      sku: book.paperbackAsin,
      price: String(book.paperbackPrice || book.price || '9.99'),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.amazon.com/dp/${book.paperbackAsin}`,
      seller: { '@type': 'Organization', name: 'Amazon.com' }
    });
  }
  if (book.hardcoverAsin) {
    offers.push({
      '@type': 'Offer',
      name: `${book.title} - Hardcover`,
      sku: book.hardcoverAsin,
      price: String(book.hardcoverPrice || '14.99'),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.amazon.com/dp/${book.hardcoverAsin}`,
      seller: { '@type': 'Organization', name: 'Amazon.com' }
    });
  }
  if (book.audiobookAsin) {
    offers.push({
      '@type': 'Offer',
      name: `${book.title} - Audible Audiobook`,
      sku: book.audiobookAsin,
      price: String(book.price || '14.99'),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.amazon.com/dp/${book.audiobookAsin}`,
      seller: { '@type': 'Organization', name: 'Amazon.com' }
    });
  }

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jasontvmarketplace.com/' },
          { '@type': 'ListItem', position: 2, name: 'Books by Jason Coleman', item: 'https://jasontvmarketplace.com/books.html' },
          { '@type': 'ListItem', position: 3, name: book.title, item: `https://jasontvmarketplace.com/books/${book.slug}/` }
        ]
      },
      {
        '@type': ['Book', 'Product'],
        '@id': `https://jasontvmarketplace.com/books/${book.slug}/#book`,
        name: book.title,
        headline: book.title,
        alternativeHeadline: book.subtitle,
        sku: book.primaryAsin,
        productID: `ASIN:${book.primaryAsin}`,
        image: [book.cover],
        description: book.description,
        genre: book.genre,
        inLanguage: 'en',
        author: {
          '@type': 'Person',
          name: 'Jason Coleman',
          alternateName: 'Jason Ray Coleman',
          url: 'https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks'
        },
        brand: {
          '@type': 'Brand',
          name: 'Jason Coleman Books'
        },
        url: `https://jasontvmarketplace.com/books/${book.slug}/`,
        sameAs: `https://www.amazon.com/dp/${book.primaryAsin}`,
        offers: offers
      }
    ]
  };

  const merchCardsHtml = matchedMerch
    .map(
      (p) => `
      <article class="merch-card">
        <a href="../../products/${esc(p.id)}/" class="merch-img-wrap">
          <span class="store-pill">${esc(p.store)}</span>
          <img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy" decoding="async">
        </a>
        <div class="merch-body">
          <div class="merch-cat">${esc(p.cat || p.productType)}</div>
          <h3><a href="../../products/${esc(p.id)}/">${esc(p.title)}</a></h3>
          <div class="merch-price-row">
            <span class="merch-price">${esc(p.price)}</span>
            <a href="../../products/${esc(p.id)}/" class="merch-details-link">Details</a>
          </div>
          <a href="${esc(p.url)}" target="_blank" rel="noopener" class="merch-buy-btn">Buy on ${esc(p.store)} ↗</a>
        </div>
      </article>`
    )
    .join('\n');

  const otherBooksHtml = otherBooks
    .map(
      (ob) => `
      <article class="related-book-card">
        <a href="../${esc(ob.slug)}/"><img src="${esc(ob.cover)}" alt="${esc(ob.title)}" loading="lazy"></a>
        <div>
          <span class="rel-genre">${esc(ob.genre)}</span>
          <h4><a href="../${esc(ob.slug)}/">${esc(ob.title)}</a></h4>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px;">
            <a href="https://www.amazon.com/dp/${ob.primaryAsin}" target="_blank" rel="noopener" class="rel-amz-btn">Amazon ↗</a>
            <a href="../${esc(ob.slug)}/" class="rel-page-btn">Book Page &rarr;</a>
          </div>
        </div>
      </article>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(book.title)} by Jason Coleman | Official Amazon Book &amp; Theme Merch</title>
  <meta name="description" content="${esc(book.description)} Available on Amazon in Kindle, Paperback, and Hardcover (${esc(book.primaryAsin)}). Shop official companion merch.">
  <meta name="keywords" content="${esc((book.keywords || []).join(', '))}, Jason Coleman books, Amazon KDP">
  <link rel="canonical" href="https://jasontvmarketplace.com/books/${book.slug}/">
  <meta name="robots" content="index,follow,max-image-preview:large">

  <meta property="og:type" content="book">
  <meta property="og:title" content="${esc(book.title)} — Official Book by Jason Coleman">
  <meta property="og:description" content="${esc(book.subtitle)} — ${esc(book.description)}">
  <meta property="og:url" content="https://jasontvmarketplace.com/books/${book.slug}/">
  <meta property="og:image" content="${esc(book.cover)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(book.title)} | Jason Coleman">
  <meta name="twitter:description" content="${esc(book.subtitle)}">
  <meta name="twitter:image" content="${esc(book.cover)}">

  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <link rel="stylesheet" href="../../discovery.css">
  <style>
    .book-hero {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2.25rem;
      background: linear-gradient(145deg, rgba(16, 24, 42, 0.96), rgba(9, 13, 24, 0.99));
      border: 1px solid rgba(255, 170, 0, 0.35);
      border-radius: 18px;
      padding: 2rem;
      margin: 1.5rem 0 2.5rem;
      box-shadow: 0 20px 50px rgba(0,0,0,0.65);
    }
    @media (max-width: 760px) {
      .book-hero { grid-template-columns: 1fr; text-align: center; }
    }
    .book-hero-cover img {
      width: 100%;
      max-width: 260px;
      border-radius: 10px;
      box-shadow: 0 16px 38px rgba(0,0,0,0.8);
    }
    .format-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
      gap: 0.85rem;
      margin: 1.35rem 0;
    }
    .format-box {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 0.9rem 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .format-box strong { color: #fff; font-size: 0.95rem; }
    .format-asin { font-size: 0.74rem; color: #94a3b8; margin: 3px 0 8px; }
    .format-cta {
      display: inline-block;
      text-align: center;
      background: linear-gradient(135deg, #ff9900, #e68a00);
      color: #000 !important;
      font-weight: 800;
      font-size: 0.84rem;
      padding: 8px 12px;
      border-radius: 6px;
      text-decoration: none;
    }
    .merch-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 1.25rem;
      margin: 1.5rem 0 3rem;
    }
    .merch-card {
      background: rgba(14, 21, 36, 0.9);
      border: 1px solid rgba(255,255,255,0.09);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .merch-img-wrap {
      position: relative;
      height: 220px;
      background: #080c15;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .merch-img-wrap img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .store-pill {
      position: absolute;
      top: 8px;
      left: 8px;
      background: rgba(0, 210, 211, 0.2);
      border: 1px solid rgba(0, 210, 211, 0.5);
      color: #00d2d3;
      font-size: 0.68rem;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .merch-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .merch-cat { font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .merch-body h3 { font-size: 0.94rem; margin: 5px 0 10px; line-height: 1.35; }
    .merch-body h3 a { color: #fff; text-decoration: none; }
    .merch-price-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; margin-bottom: 10px; }
    .merch-price { font-weight: 900; color: #ffaa00; font-size: 1rem; }
    .merch-details-link { font-size: 0.78rem; color: #94a3b8; }
    .merch-buy-btn {
      display: block;
      text-align: center;
      background: linear-gradient(135deg, #00d2d3, #0984e3);
      color: #fff !important;
      font-weight: 800;
      font-size: 0.84rem;
      padding: 9px 12px;
      border-radius: 6px;
      text-decoration: none;
    }
    .related-books-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.15rem;
      margin: 1.25rem 0 2.5rem;
    }
    .related-book-card {
      display: flex;
      gap: 1rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 0.9rem;
      align-items: center;
    }
    .related-book-card img { width: 72px; height: auto; border-radius: 5px; }
    .rel-genre { font-size: 0.7rem; color: #00d2d3; font-weight: 800; text-transform: uppercase; }
    .related-book-card h4 { margin: 4px 0; font-size: 0.95rem; }
    .related-book-card h4 a { color: #fff; text-decoration: none; }
    .rel-amz-btn { background: #ff9900; color: #000 !important; font-weight: 800; font-size: 0.75rem; padding: 4px 9px; border-radius: 4px; text-decoration: none; }
    .rel-page-btn { background: rgba(255,255,255,0.08); color: #e2e8f0 !important; font-size: 0.75rem; padding: 4px 9px; border-radius: 4px; text-decoration: none; }
  </style>
  <script type="application/ld+json">
${JSON.stringify(schemaGraph, null, 2)}
  </script>
</head>
<body>
  <header>
    <div class="wrap">
      <a class="brand" href="../../index.html">JASONTV MARKETPLACE</a>
      <nav aria-label="Main navigation">
        <a href="../../index.html">Hub</a>
        <a href="../../books.html" style="color:#ffaa00;font-weight:800;">📚 All 18 Books</a>
        <a href="../../guides/index.html" style="color:#00d2d3;font-weight:700;">🎁 Gift Guides (15)</a>
        <a href="../../shop/index.html">🛍️ Merch Shop (18.6k)</a>
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Central ↗</a>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap">
    <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:0.5rem;">
      <a href="../../index.html">Home</a> &rsaquo; <a href="../../books.html">Books by Jason Coleman</a> &rsaquo; <strong style="color:#fff;">${esc(book.title)}</strong>
    </p>

    <section class="book-hero">
      <div class="book-hero-cover">
        <a href="https://www.amazon.com/dp/${book.primaryAsin}" target="_blank" rel="noopener">
          <img src="${esc(book.cover)}" alt="${esc(book.title)} by Jason Coleman">
        </a>
      </div>
      <div>
        <span style="display:inline-block;background:rgba(255,170,0,0.18);color:#ffaa00;font-weight:800;font-size:0.75rem;padding:4px 10px;border-radius:4px;text-transform:uppercase;margin-bottom:8px;">
          ${esc(book.badge)} &bull; ${esc(book.series)}
        </span>
        <h1 style="margin:0 0 8px;font-size:2rem;color:#fff;">${esc(book.title)}</h1>
        <p style="font-size:1.08rem;color:#ffbb33;font-style:italic;margin:0 0 14px;">${esc(book.subtitle)}</p>
        <p style="font-size:1rem;color:#e2e8f0;line-height:1.65;margin-bottom:16px;">${esc(book.description)}</p>
        <p style="font-size:0.86rem;color:#94a3b8;"><strong>Author:</strong> Jason Coleman &bull; <strong>Genre:</strong> ${esc(book.genre)} ${book.kindleUnlimited ? '&bull; <strong style="color:#00d2d3;">Read Free with Kindle Unlimited</strong>' : ''}</p>

        <div class="format-grid">
          ${
            book.kindleAsin
              ? `<div class="format-box">
            <div>
              <strong>📱 Kindle eBook</strong>
              <div class="format-asin">ASIN: ${book.kindleAsin} &bull; $${book.price || '4.99'}</div>
            </div>
            <a class="format-cta" href="https://www.amazon.com/dp/${book.kindleAsin}" target="_blank" rel="noopener">Buy Kindle on Amazon ↗</a>
          </div>`
              : ''
          }
          ${
            book.paperbackAsin
              ? `<div class="format-box">
            <div>
              <strong>📖 Paperback Edition</strong>
              <div class="format-asin">ASIN: ${book.paperbackAsin}${book.paperbackPrice ? ' &bull; $' + book.paperbackPrice : ''}</div>
            </div>
            <a class="format-cta" href="https://www.amazon.com/dp/${book.paperbackAsin}" target="_blank" rel="noopener">Buy Paperback on Amazon ↗</a>
          </div>`
              : ''
          }
          ${
            book.hardcoverAsin
              ? `<div class="format-box">
            <div>
              <strong>📕 Collector's Hardcover</strong>
              <div class="format-asin">ASIN: ${book.hardcoverAsin}${book.hardcoverPrice ? ' &bull; $' + book.hardcoverPrice : ''}</div>
            </div>
            <a class="format-cta" href="https://www.amazon.com/dp/${book.hardcoverAsin}" target="_blank" rel="noopener">Buy Hardcover on Amazon ↗</a>
          </div>`
              : ''
          }
          ${
            book.audiobookAsin
              ? `<div class="format-box">
            <div>
              <strong>🎧 Audible Audiobook</strong>
              <div class="format-asin">ASIN: ${book.audiobookAsin}</div>
            </div>
            <a class="format-cta" href="https://www.amazon.com/dp/${book.audiobookAsin}" target="_blank" rel="noopener">Listen on Audible/Amazon ↗</a>
          </div>`
              : ''
          }
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <a class="button" href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Browse All 18 Books on Amazon Author Central ↗</a>
          ${book.trailerUrl ? `<a class="button" href="${esc(book.trailerUrl)}" target="_blank" rel="noopener" style="color:#ff6b81;border-color:rgba(255,107,129,0.4);">▶ Watch Official Book Trailer ↗</a>` : ''}
        </div>
      </div>
    </section>

    <!-- 12 Theme-Matched Official Merch Products -->
    <section aria-label="Companion Merchandise">
      <span class="eyebrow">Official Companion Apparel, Hoodies, Mugs &amp; Gear</span>
      <h2 style="font-size:1.6rem;margin:4px 0 6px;">👕 Pair <em>${esc(book.title)}</em> With Theme-Matched Official Merch</h2>
      <p style="color:#94a3b8;margin-bottom:1.25rem;">Curated from our 18,622-item 5-store catalog across Spreadshop, Printify, Zazzle, Redbubble, and TeePublic. Every button goes straight to the verified partner store product page.</p>
      <div class="merch-grid">
        ${merchCardsHtml}
      </div>
    </section>

    <!-- More Books by Jason Coleman -->
    <section aria-label="More Books by Jason Coleman">
      <h2 style="font-size:1.5rem;margin-bottom:0.75rem;">📚 More Published Books by Jason Coleman</h2>
      <div class="related-books-grid">
        ${otherBooksHtml}
      </div>
      <div style="margin-top:1rem;">
        <a class="button primary" href="../../books.html">View All 18 Published Books &amp; Weekly KDP Release Schedule &rarr;</a>
        <a class="button" href="../../guides/index.html">Explore 15 Reader &amp; Merch Gift Guides &rarr;</a>
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <strong>JasonTV Marketplace</strong> &bull; Jason Coleman &bull;
      <a href="../../books.html">All 18 Books</a> &bull;
      <a href="../../guides/index.html">15 Gift Guides</a> &bull;
      <a href="../../shop/index.html">Full Merch Shop</a> &bull;
      <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Store ↗</a>
    </div>
  </footer>
</body>
</html>`;
}

function updateIndexHtmlBooks(booksCatalog) {
  const idxPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(idxPath, 'utf8');

  // 1. Clean any lingering "fourthwall" CSS class names so zero mentions exist
  html = html
    .replace(/FOURTHWALL & VAULT DROPS SHOWCASE STYLES/g, 'PARTNER STORES & VAULT DROPS SHOWCASE STYLES')
    .replace(/hero-shop-pill-fourthwall/g, 'hero-shop-pill-partner')
    .replace(/portal-fourthwall/g, 'portal-partner')
    .replace(/btn-fourthwall/g, 'btn-partner');

  // 2. Update nav bar Books (9) -> Books (18+) and add Gift Guides link if not present
  html = html.replace(
    /<li><a href="#books"[^>]*>📚 Books \(\d+\+?\)<\/a><\/li>/,
    '<li><a href="#books" style="color:#c084fc; font-weight:800; font-size:0.95rem;">📚 Books (18+)</a></li>\n        <li><a href="guides/index.html" style="color:#ffaa00; font-weight:800; font-size:0.92rem;">🎁 Gift Guides (15)</a></li>'
  );

  // 3. Build upgraded #books section with all 18 live books + Weekly KDP Release Queue
  const books = booksCatalog.books;
  const topSpotlights = books.slice(0, 2); // Dixon's Journal Book One & A Beautiful Alibi
  const remainingBooks = books.slice(2);

  const spotlightCardsHtml = topSpotlights
    .map(
      (b, i) => `
        <div class="book-featured-card${i === 1 ? ' americana' : ''}">
          <div class="book-cover-stage">
            <a href="books/${b.slug}/">
              <img src="${esc(b.cover)}" alt="${esc(b.title)} by Jason Coleman" class="book-cover-3d" loading="lazy" decoding="async">
            </a>
          </div>
          <div class="book-info">
            <span class="card-tag tag-books" style="background:rgba(255,153,0,0.2);color:#ffaa00;font-weight:900;">🔥 ${esc(b.badge)} &bull; ${esc(b.series)}</span>
            <h3><a href="books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h3>
            <p style="color:#ffbb33;font-style:italic;font-size:0.88rem;margin-bottom:0.45rem;">${esc(b.subtitle)}</p>
            <p>${esc(b.description)}</p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.65rem;">
              ${b.kindleAsin ? `<a href="https://www.amazon.com/dp/${b.kindleAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_kindle">📱 Kindle ($${b.price}) &rarr;</a>` : ''}
              ${b.paperbackAsin ? `<a href="https://www.amazon.com/dp/${b.paperbackAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_paperback">📖 Paperback &rarr;</a>` : ''}
              ${b.hardcoverAsin ? `<a href="https://www.amazon.com/dp/${b.hardcoverAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_hardcover">📕 Hardcover &rarr;</a>` : ''}
              <a href="books/${b.slug}/" class="card-cta track-click" style="background:rgba(0,210,211,0.18);color:#00d2d3;border:1px solid rgba(0,210,211,0.45);">Book Page &amp; Merch &rarr;</a>
            </div>
          </div>
        </div>`
    )
    .join('\n');

  const gridBooksHtml = remainingBooks
    .map(
      (b) => `
        <article class="card">
          <div class="book-cover-stage">
            <a href="books/${b.slug}/">
              <img src="${esc(b.cover)}" alt="${esc(b.title)} by Jason Coleman" class="book-cover-3d" loading="lazy" decoding="async">
            </a>
          </div>
          <div class="card-body">
            <div>
              <span class="card-tag tag-books">${esc(b.badge || b.genre)}</span>
              <h3><a href="books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h3>
              <p>${esc(b.description)}</p>
            </div>
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap; margin-top:auto;">
              ${b.kindleAsin ? `<a href="https://www.amazon.com/dp/${b.kindleAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_kindle">Kindle &rarr;</a>` : ''}
              ${b.paperbackAsin ? `<a href="https://www.amazon.com/dp/${b.paperbackAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_pb">Paperback &rarr;</a>` : ''}
              ${b.hardcoverAsin ? `<a href="https://www.amazon.com/dp/${b.hardcoverAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_hc">Hardcover &rarr;</a>` : ''}
              ${b.audiobookAsin ? `<a href="https://www.amazon.com/dp/${b.audiobookAsin}" target="_blank" rel="noopener" class="card-cta btn-amz track-click" data-target="buy_${b.slug}_audio">🎧 Audible &rarr;</a>` : ''}
              <a href="books/${b.slug}/" class="card-cta" style="background:rgba(255,255,255,0.08);color:#e2e8f0;">Details &amp; Merch &rarr;</a>
            </div>
          </div>
        </article>`
    )
    .join('\n');

  const newBooksSection = `<section class="container" id="books">
      <h2 class="section-title">📚 Official Published Books by Jason Coleman (18 Live Amazon Titles • 2 New Books Every Week)</h2>
      <p class="section-sub">Explore all 18 live published books on Amazon—including today's brand-new Oct 28 releases <em>Dixon's Journal: Book One — A House Beneath The Ash</em> and <em>A Beautiful Alibi</em>—plus our Weekly KDP Release Schedule (2 new titles published every week across Kindle Unlimited, Paperback, Hardcover &amp; Audible).</p>

      <!-- Top 2 Brand-New Release Spotlights -->
      <div class="books-showcase-grid">
${spotlightCardsHtml}
      </div>

      <!-- Complete 16 Additional Live Titles Grid -->
      <div class="grid">
${gridBooksHtml}
      </div>

      <!-- Weekly KDP Release Pipeline Callout -->
      <div style="margin-top:2rem;padding:1.5rem;background:rgba(14,22,38,0.92);border:1px solid rgba(0,210,211,0.35);border-radius:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <span style="font-size:0.75rem;font-weight:900;color:#00d2d3;text-transform:uppercase;letter-spacing:0.06em;">📅 Weekly KDP Release Queue • 2 New Books Every Week</span>
            <h3 style="color:#fff;margin:4px 0;font-size:1.25rem;">Upcoming Releases: <em>Dixon's Journal Books 2–8</em>, <em>Blood and Starlight</em>, <em>Stormborn Tales</em>, <em>What Are The Odds</em>, <em>Chase</em> &amp; <em>Cops on Patrol</em></h3>
          </div>
          <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
            <a href="books.html" class="btn-large" style="background:linear-gradient(135deg,#00d2d3,#0984e3);color:#fff;padding:0.7rem 1.25rem;border-radius:8px;font-weight:800;text-decoration:none;">📖 View Full 18-Book Hub &amp; Schedule &rarr;</a>
            <a href="guides/index.html" class="btn-large" style="background:rgba(255,170,0,0.18);border:1px solid rgba(255,170,0,0.5);color:#ffaa00;padding:0.7rem 1.25rem;border-radius:8px;font-weight:800;text-decoration:none;">🎁 15 Book &amp; Merch Gift Guides &rarr;</a>
          </div>
        </div>
      </div>

      <!-- Official Amazon Store Link -->
      <div style="text-align:center; margin-top:2rem; display:flex; justify-content:center; gap:1rem; flex-wrap:wrap;">
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener" class="btn-large amz track-click" data-target="view_full_amazon_store">🛒 Browse All 18 Titles on Amazon Author Central &rarr;</a>
        <a href="books/index.html" class="btn-large" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:0.85rem 1.6rem;border-radius:10px;font-weight:800;text-decoration:none;">📚 Individual Book Pages &amp; Companion Merch &rarr;</a>
      </div>
    </section>`;

  html = html.replace(/<section class="container" id="books">[\s\S]*?<\/section>/, newBooksSection);

  // 4. Update STATIC_BOOKS in index.html
  const staticBooksArr = books.map((b) => ({
    title: b.title,
    cat: `Book (${b.genre})`,
    link: `https://www.amazon.com/dp/${b.primaryAsin}`,
    price: `Amazon ($${b.price || '4.99'})`,
    img: b.cover,
    desc: b.description
  }));
  html = html.replace(
    /const STATIC_BOOKS = \[[\s\S]*?\];/,
    `const STATIC_BOOKS = ${JSON.stringify(staticBooksArr, null, 6)};`
  );

  fs.writeFileSync(idxPath, html, 'utf8');
  console.log(`[sync-amazon-books] Updated index.html with all ${books.length} books and STATIC_BOOKS search entries.`);
}

async function main() {
  const booksCatalog = JSON.parse(fs.readFileSync(BOOKS_CATALOG_PATH, 'utf8'));
  const allProducts = JSON.parse(fs.readFileSync(PRODUCTS_CATALOG_PATH, 'utf8'));

  await checkAmazonAuthorStore(booksCatalog);

  // Write books.html
  const booksHtml = generateBooksHubHtml(booksCatalog, false);
  fs.writeFileSync(path.join(ROOT, 'books.html'), booksHtml, 'utf8');

  // Write books/index.html
  const booksDir = path.join(ROOT, 'books');
  fs.mkdirSync(booksDir, { recursive: true });
  fs.writeFileSync(path.join(booksDir, 'index.html'), generateBooksHubHtml(booksCatalog, true), 'utf8');

  // Write all 18 books/<slug>/index.html
  for (const book of booksCatalog.books) {
    const slugDir = path.join(booksDir, book.slug);
    fs.mkdirSync(slugDir, { recursive: true });
    const pageHtml = generateSingleBookPageHtml(book, booksCatalog, allProducts);
    fs.writeFileSync(path.join(slugDir, 'index.html'), pageHtml, 'utf8');
  }
  console.log(`[sync-amazon-books] Generated books.html, books/index.html, and ${booksCatalog.books.length} dedicated /books/<slug>/index.html pages.`);

  // Update index.html
  updateIndexHtmlBooks(booksCatalog);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
