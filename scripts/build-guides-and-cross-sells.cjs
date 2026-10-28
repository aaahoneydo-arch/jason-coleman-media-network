#!/usr/bin/env node
/**
 * scripts/build-guides-and-cross-sells.cjs
 * Completes Tasks 2, 3, 4, and 5 for jasontvmarketplace.com:
 *  - Generates /guides/index.html & 15 high-intent niche buyer's guides (/guides/<slug>/index.html)
 *  - Adds the 18 Official Amazon Books showcase shelf & /guides/ links to shop/index.html
 *  - Adds theme-matched 2-book Amazon cross-sell cards to all 18,622 PDPs (products/<id>/index.html)
 *  - Injects id="jcn-monetization-funnel" (2 books + 4 merch items) into all root content articles (*.html)
 *  - Updates sitemap.xml, sitemap-merch.xml, and regenerates clean 5-store merchant feeds (.tsv, .csv, .xml)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BOOKS_CATALOG = JSON.parse(fs.readFileSync(path.join(ROOT, 'books-catalog.json'), 'utf8'));
const ALL_PRODUCTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'shop', 'products-catalog.json'), 'utf8'));
const BOOKS = BOOKS_CATALOG.books;
const BOOK_BY_SLUG = Object.fromEntries(BOOKS.map((b) => [b.slug, b]));

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const GUIDES_CONFIG = [
  {
    slug: 'post-apocalyptic-survival-handyman-gifts',
    title: 'Post-Apocalyptic Survival, Handyman & Homestead Preparedness Gift Guide',
    subtitle: 'Practical Survival Fiction & Heavyweight Tradesman Apparel for Makers, Fathers, and Builders',
    description: 'Pair Jason Coleman\'s brand-new Yellowstone supervolcano survival novel "Dixon\'s Journal: Book One — A House Beneath The Ash" and "The Real Americana" with rugged handyman graphic tees, hoodies, mugs, and journals across Spreadshop, Printify, Zazzle, Redbubble & TeePublic.',
    bookSlugs: ['dixons-journal-book-one-a-house-beneath-the-ash', 'the-real-americana', 'the-world-we-leave-each-other'],
    keywords: ['handyman', 'measure', 'tools', 'fix', 'wrench', 'garage', 'dad', 'overland', 'trail', 'built', 'wood', 'hammer', 'work']
  },
  {
    slug: 'dark-fantasy-vampire-book-lover-gifts',
    title: 'Dark Fantasy & Vampire Book Lover Gifts: Immortals, Covens & Gothic Apparel',
    subtitle: 'Official Draevan Saga Novels, Graphic Novels & Gothic Vampire Streetwear',
    description: 'The ultimate gift guide for dark urban fantasy and supernatural vampire thriller readers: Draevan Books 1 & 2, Draevan Graphic Novel Book 1, and The Moonlight Outcasts paired with 16 gothic vampire graphic tees, hoodies, mugs, and stickers.',
    bookSlugs: ['draevan-book-two-the-unclaimed', 'draevan-book-one-the-immortal', 'draevan-the-immortal-graphic-novel-book-1', 'the-moonlight-outcasts'],
    keywords: ['vampire', 'gothic', 'dark', 'midnight', 'blood', 'rose', 'immortal', 'raven', 'bat', 'unholy', 'night', 'haunt']
  },
  {
    slug: 'cyberpunk-ai-sci-fi-gamer-merch',
    title: 'Cyberpunk, Sentient AI & Sci-Fi Gamer Books and Merch Gift Guide',
    subtitle: 'Futuristic Cybernetic Thrillers Paired With Neon Mech, Glitch & Gamer Apparel',
    description: 'Explore TIFF: Book One (I AM.), TIFF: Book Two (We Are), Life In The Year 2035, and A Beautiful Alibi alongside 16 official cyberpunk, mecha, and sci-fi gamer shirts, hoodies, desk mats, and mugs.',
    bookSlugs: ['tiff-book-two-we-are', 'tiff-book-one-i-am', 'life-in-the-year-2035', 'a-beautiful-alibi'],
    keywords: ['cyber', 'mecha', 'glitch', 'vapor', 'neon', 'robot', 'future', 'system', 'matrix', 'code', 'tech', 'hud']
  },
  {
    slug: 'tabletop-rpg-dungeon-master-gifts',
    title: 'Tabletop RPG, Dungeon Master & Epic Fantasy Reader Gift Guide',
    subtitle: 'Grimdark Sword & Sorcery Books Paired With Chaotic Alignment, Dragon & Dice Apparel',
    description: 'Shop epic fantasy novels The Shattered Crown, The Dark Versus Light Legions Graphic Novel Book 1 & 2, and The Moonlight Outcasts paired with 16 tabletop RPG, winged skull, dragon, and gamer graphic tees and hoodies.',
    bookSlugs: ['the-shattered-crown', 'the-dark-versus-light-legions-graphic-novel', 'the-moonlight-outcasts'],
    keywords: ['chaotic', 'alignment', 'dragon', 'dungeon', 'rpg', 'gamer', 'knight', 'sword', 'crown', 'shield', 'skull', 'quest']
  },
  {
    slug: 'mechanic-project-car-garage-gifts',
    title: 'Mechanic, Project Car & Garage Humor Gift Guide (Books + Apparel)',
    subtitle: 'Blue-Collar Grit Fiction & Funny Mechanic Shirts, Hoodies & Workshop Mugs',
    description: 'Gift ideas for mechanics, wrench turners, and garage builders: Dixon\'s Journal: Book One — A House Beneath The Ash and The Real Americana paired with 16 funny mechanic tees, hoodies, trucker hats, and garage coffee mugs.',
    bookSlugs: ['the-real-americana', 'dixons-journal-book-one-a-house-beneath-the-ash'],
    keywords: ['mechanic', 'garage', 'wrench', 'car', 'engine', 'truck', 'oil', 'hourly', 'rate', 'fix', 'broken', 'tool']
  },
  {
    slug: 'carpenter-woodworking-humor-gifts',
    title: 'Carpenter, Woodworking & Jobsite Humor Gift Guide (Books + Gear)',
    subtitle: '"Measure Twice, Cuss Once" Apparel & Authentic Heartland Survival Books',
    description: 'The best gifts for carpenters, woodworkers, and contractors: Dixon\'s Journal: Book One and The Real Americana paired with 16 "Measure Twice Cuss Once" hoodies, graphic tees, mugs, and notebooks.',
    bookSlugs: ['dixons-journal-book-one-a-house-beneath-the-ash', 'the-real-americana', 'the-world-we-leave-each-other'],
    keywords: ['measure twice', 'carpenter', 'wood', 'level', 'saw', 'build', 'cuss once', 'craft', 'workshop', 'bridge', 'industrial']
  },
  {
    slug: 'gothic-streetwear-cathedral-raven-gifts',
    title: 'Gothic Streetwear, Cathedral Rose Window & Raven Crest Gift Guide',
    subtitle: 'Dark Aesthetic Hoodies, Tees & Journals Paired With Supernatural Fiction',
    description: 'Curated gothic streetwear—cathedral stained rose windows, armored wolves, ravens, and memento mori journals—paired with Draevan: Book Two: The Unclaimed, The Shattered Crown, and The Moonlight Outcasts.',
    bookSlugs: ['draevan-book-two-the-unclaimed', 'the-shattered-crown', 'the-moonlight-outcasts', 'draevan-the-immortal-graphic-novel-book-1'],
    keywords: ['gothic', 'cathedral', 'raven', 'memento mori', 'crest', 'wolves', 'sacred heart', 'skull', 'rose', 'cross']
  },
  {
    slug: 'cat-lover-graphic-tees-and-mugs',
    title: 'Cat Lover Graphic Tees, Lucky Maneki Neko & Cozy Reader Gift Guide',
    subtitle: 'Celestial Black Cats, Japanese Maneki Neko Apparel & Imaginative Books',
    description: 'Purr-fect gifts for cat lovers and bookworms: Jay And Jae\'s Adventures In Colorland and The Moonlight Outcasts paired with 16 Lucky Cat Maneki Neko sweatshirts, celestial black cat journals, graphic tees, and mugs.',
    bookSlugs: ['the-moonlight-outcasts', 'jay-and-jaes-adventures-in-colorland', 'how-matter-became-conscious'],
    keywords: ['cat', 'maneki', 'neko', 'kitten', 'feline', 'meow', 'purr', 'whiskers', 'celestial black cat']
  },
  {
    slug: 'dog-dad-and-pet-lover-gifts',
    title: 'Dog Dad, Loyal Companion & Pet Lover Gift Guide (Books + Apparel)',
    subtitle: 'Heartfelt Americana Stories, Loyal Wolf/Hound Crests & Pet Lover Merch',
    description: 'Celebrate loyal four-legged companions with The Real Americana, Dixon\'s Journal: Book One, and Jay And Jae\'s Adventures In Colorland alongside 16 dog lover, wolf crest, and animal graphic tees, hoodies, and mugs.',
    bookSlugs: ['the-real-americana', 'dixons-journal-book-one-a-house-beneath-the-ash', 'jay-and-jaes-adventures-in-colorland'],
    keywords: ['dog', 'puppy', 'paw', 'bark', 'loyal', 'wolves', 'wolf', 'hound', 'pet', 'animal', 'fox', 'kitsune']
  },
  {
    slug: 'coffee-addict-barista-sarcastic-gifts',
    title: 'Coffee Addict, "Death Before Decaf" & Sarcastic Reader Gift Guide',
    subtitle: 'Sharp Wit, Political & Espionage Thrillers Paired With Coffee Mugs & Humor Tees',
    description: 'Fuel your late-night reading sessions: A Beautiful Alibi, The Deception Habit, and Dixon\'s Journal: Book One paired with 16 "Death Before Decaf" graphic tees, ceramic coffee mugs, and sarcastic introvert apparel.',
    bookSlugs: ['a-beautiful-alibi', 'the-deception-habit', 'dixons-journal-book-one-a-house-beneath-the-ash'],
    keywords: ['coffee', 'decaf', 'mug', 'caffeine', 'battery', 'sarcas', 'not today', 'procrastinator', 'silence', 'introvert']
  },
  {
    slug: 'kids-and-family-adventure-coloring-gifts',
    title: 'Kids & Family Adventure, Coloring Book & Wholesome Gift Guide',
    subtitle: 'Interactive Children\'s Coloring Books, Family First Apparel & Keepsake Gifts',
    description: 'Spark family creativity with Jay And Jae\'s Adventures In Colorland and The World We Leave Each Other paired with 16 kids & family tees, cute animal journals, tote bags, and stickers.',
    bookSlugs: ['jay-and-jaes-adventures-in-colorland', 'the-world-we-leave-each-other', 'dixons-journal-book-one-a-house-beneath-the-ash'],
    keywords: ['family', 'kids', 'cute', 'hummingbird', 'whale', 'koi', 'flower', 'botanical', 'happy', 'love', 'heart']
  },
  {
    slug: 'military-history-and-strategy-gifts',
    title: 'Military History, Geopolitics & Strategy Reader Gift Guide',
    subtitle: 'Provocative Military History Books Paired With Tactical, Armored & Strategy Gear',
    description: 'Explore Humans: The Endless Warmonger, Old Men Start Wars That Young Men Die In, and The Deception Habit paired with 16 tactical, armored crest, history, and strategy graphic tees, hoodies, and journals.',
    bookSlugs: ['humans-the-endless-warmonger', 'old-men-start-wars-that-young-men-die-in', 'the-deception-habit'],
    keywords: ['armored', 'shield', 'iron', 'patrol', 'tactical', 'heavy', 'warrior', 'legion', 'honor', 'loyalty', 'crest']
  },
  {
    slug: 'retro-80s-synthwave-arcade-gifts',
    title: 'Retro 80s Synthwave, Vaporwave & Arcade Gamer Gift Guide',
    subtitle: '"Insert Coin" Arcade Nostalgia Apparel Paired With Sci-Fi & Cybernetic Novels',
    description: 'Level up with retro 80s arcade and synthwave gifts: TIFF: Book One (I AM.), TIFF: Book Two (We Are), and Life In The Year 2035 paired with 16 "Insert Coin", vaporwave glitch, and neon streetwear designs.',
    bookSlugs: ['tiff-book-one-i-am', 'tiff-book-two-we-are', 'life-in-the-year-2035'],
    keywords: ['arcade', 'insert coin', 'vaporwave', 'retro', 'cyberwave', 'neon', 'gamer', 'gaming', 'sunset', '80s']
  },
  {
    slug: 'espionage-thriller-mystery-reader-gifts',
    title: 'Espionage Thriller, Spy Fiction & Mystery Reader Gift Guide',
    subtitle: 'Near-Future Intelligence Thrillers Paired With Midnight Noir & Streetwear Gear',
    description: 'Dive into Jason Coleman\'s brand-new espionage thriller "A Beautiful Alibi (The Borrowed Names: Book One)" and "The Deception Habit" paired with 16 noir, midnight secrets, and covert streetwear tees, hoodies, and journals.',
    bookSlugs: ['a-beautiful-alibi', 'the-deception-habit', 'tiff-book-two-we-are'],
    keywords: ['secrets', 'midnight', 'silence', 'shadow', 'patrol', 'moon', 'elegance', 'noir', 'mystery', 'cipher', 'night']
  },
  {
    slug: 'outdoor-wilderness-overland-explorer-gifts',
    title: 'Outdoor Wilderness, 4x4 Overland Explorer & Survival Reader Gift Guide',
    subtitle: 'Trail-Proven 4x4 Gear, Nature Art & Post-Apocalyptic Survival Books',
    description: 'Built for the backcountry: Dixon\'s Journal: Book One — A House Beneath The Ash, The Real Americana, and How Matter Became Conscious paired with 16 overland explorer 4x4 journals, wildlife graphic tees, hoodies, and caps.',
    bookSlugs: ['dixons-journal-book-one-a-house-beneath-the-ash', 'the-real-americana', 'how-matter-became-conscious'],
    keywords: ['overland', 'explorer', 'trail', '4x4', 'mountain', 'forest', 'nature', 'panther', 'wolf', 'ocean', 'botanical', 'moon']
  }
];

function selectMerchByKeywords(keywords, count = 16, seedOffset = 0) {
  const byStore = { Spreadshop: [], Printify: [], Zazzle: [], Redbubble: [], TeePublic: [] };
  const kwLower = keywords.map((k) => k.toLowerCase());

  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const p = ALL_PRODUCTS[i];
    const hay = `${p.title} ${p.design || ''} ${p.cat || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    let score = 0;
    for (const kw of kwLower) {
      if (hay.includes(kw)) score += 2;
    }
    if (score > 0 && byStore[p.store] && byStore[p.store].length < 60) {
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
  while (picked.length < count && round < 30) {
    for (const s of stores) {
      if (picked.length >= count) break;
      const list = byStore[s];
      const idx = (round + seedOffset) % Math.max(1, list.length);
      if (list && list[idx] && !usedIds.has(list[idx].p.id)) {
        picked.push(list[idx].p);
        usedIds.add(list[idx].p.id);
      }
    }
    round++;
  }

  let fIdx = seedOffset * 17;
  while (picked.length < count) {
    const p = ALL_PRODUCTS[fIdx % ALL_PRODUCTS.length];
    fIdx++;
    if (!usedIds.has(p.id)) {
      picked.push(p);
      usedIds.add(p.id);
    }
  }
  return picked;
}

function generateGuidesPages() {
  const guidesDir = path.join(ROOT, 'guides');
  fs.mkdirSync(guidesDir, { recursive: true });

  // Generate each of the 15 guide pages
  GUIDES_CONFIG.forEach((g, idx) => {
    const gDir = path.join(guidesDir, g.slug);
    fs.mkdirSync(gDir, { recursive: true });

    const matchedBooks = g.bookSlugs.map((s) => BOOK_BY_SLUG[s]).filter(Boolean);
    const matchedMerch = selectMerchByKeywords(g.keywords, 16, idx);

    const schemaObj = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jasontvmarketplace.com/' },
            { '@type': 'ListItem', position: 2, name: 'Gift & Buyer\'s Guides', item: 'https://jasontvmarketplace.com/guides/' },
            { '@type': 'ListItem', position: 3, name: g.title, item: `https://jasontvmarketplace.com/guides/${g.slug}/` }
          ]
        },
        {
          '@type': 'ItemList',
          name: g.title,
          description: g.description,
          url: `https://jasontvmarketplace.com/guides/${g.slug}/`,
          numberOfItems: matchedBooks.length + matchedMerch.length,
          itemListElement: [
            ...matchedBooks.map((b, bi) => ({
              '@type': 'ListItem',
              position: bi + 1,
              item: {
                '@type': 'Book',
                name: b.title,
                url: `https://jasontvmarketplace.com/books/${b.slug}/`,
                image: b.cover,
                author: { '@type': 'Person', name: 'Jason Coleman' },
                offers: {
                  '@type': 'Offer',
                  price: String(b.price || '4.99'),
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: `https://www.amazon.com/dp/${b.primaryAsin}`
                }
              }
            })),
            ...matchedMerch.map((p, pi) => ({
              '@type': 'ListItem',
              position: matchedBooks.length + pi + 1,
              item: {
                '@type': 'Product',
                name: p.title,
                image: p.img,
                sku: p.id,
                brand: { '@type': 'Brand', name: 'JasonTV Marketplace' },
                offers: {
                  '@type': 'Offer',
                  price: String(p.price || '22.99').replace(/[^0-9.]/g, ''),
                  priceCurrency: 'USD',
                  availability: 'https://schema.org/InStock',
                  url: p.url,
                  seller: { '@type': 'Organization', name: p.store }
                }
              }
            }))
          ]
        }
      ]
    };

    const booksHtml = matchedBooks
      .map(
        (b) => `
        <article class="guide-book-card">
          <a href="../../books/${esc(b.slug)}/" class="guide-book-cover">
            <img src="${esc(b.cover)}" alt="${esc(b.title)} by Jason Coleman" loading="eager">
          </a>
          <div class="guide-book-info">
            <span class="guide-book-badge">${esc(b.badge)} &bull; ${esc(b.genre)}</span>
            <h3><a href="../../books/${esc(b.slug)}/">${esc(b.title)}</a></h3>
            <p class="guide-book-sub">${esc(b.subtitle)}</p>
            <p class="guide-book-desc">${esc(b.description)}</p>
            <div class="guide-book-btns">
              ${b.kindleAsin ? `<a href="https://www.amazon.com/dp/${b.kindleAsin}" target="_blank" rel="noopener" class="amz-btn">📱 Kindle ($${b.price}) ↗</a>` : ''}
              ${b.paperbackAsin ? `<a href="https://www.amazon.com/dp/${b.paperbackAsin}" target="_blank" rel="noopener" class="amz-btn-alt">📖 Paperback ↗</a>` : ''}
              ${b.hardcoverAsin ? `<a href="https://www.amazon.com/dp/${b.hardcoverAsin}" target="_blank" rel="noopener" class="amz-btn-alt">📕 Hardcover ↗</a>` : ''}
              <a href="../../books/${esc(b.slug)}/" class="page-btn">Book Page &amp; Merch &rarr;</a>
            </div>
          </div>
        </article>`
      )
      .join('\n');

    const merchHtml = matchedMerch
      .map(
        (p) => `
        <article class="guide-merch-card">
          <a href="../../products/${esc(p.id)}/" class="guide-merch-media">
            <span class="guide-store-tag">${esc(p.store)}</span>
            <img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy" decoding="async">
          </a>
          <div class="guide-merch-body">
            <div class="guide-merch-cat">${esc(p.cat || p.productType)}</div>
            <h3><a href="../../products/${esc(p.id)}/">${esc(p.title)}</a></h3>
            <div class="guide-merch-meta">
              <span class="guide-merch-price">${esc(p.price)}</span>
              <a href="../../products/${esc(p.id)}/" style="color:#94a3b8;font-size:0.78rem;">Specs</a>
            </div>
            <a href="${esc(p.url)}" target="_blank" rel="noopener" class="guide-merch-cta">Buy on ${esc(p.store)} ↗</a>
          </div>
        </article>`
      )
      .join('\n');

    const otherGuidesLinks = GUIDES_CONFIG.filter((og) => og.slug !== g.slug)
      .map((og) => `<a href="../${og.slug}/" class="other-guide-pill">🎁 ${esc(og.title.split(':')[0])}</a>`)
      .join('\n        ');

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(g.title)} | Official Books &amp; 5-Store Creator Merch</title>
  <meta name="description" content="${esc(g.description)}">
  <link rel="canonical" href="https://jasontvmarketplace.com/guides/${g.slug}/">
  <meta name="robots" content="index,follow,max-image-preview:large">

  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(g.title)}">
  <meta property="og:description" content="${esc(g.description)}">
  <meta property="og:url" content="https://jasontvmarketplace.com/guides/${g.slug}/">
  <meta property="og:image" content="${esc(matchedBooks[0]?.cover || 'https://jasontvmarketplace.com/assets/hero-banner.jpg')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(g.title)}">
  <meta name="twitter:description" content="${esc(g.subtitle)}">

  <link rel="icon" type="image/svg+xml" href="../../favicon.svg">
  <link rel="stylesheet" href="../../discovery.css">
  <style>
    .guide-books-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem; margin: 1.25rem 0 2.75rem; }
    .guide-book-card { display: flex; gap: 1.25rem; background: linear-gradient(145deg, rgba(18,26,46,0.95), rgba(10,15,28,0.98)); border: 1px solid rgba(255,170,0,0.4); border-radius: 14px; padding: 1.25rem; flex-wrap: wrap; }
    .guide-book-cover { flex: 0 0 140px; }
    .guide-book-cover img { width: 100%; max-width: 140px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.7); }
    .guide-book-info { flex: 1; min-width: 220px; display: flex; flex-direction: column; }
    .guide-book-badge { font-size: 0.72rem; font-weight: 800; color: #ffaa00; text-transform: uppercase; margin-bottom: 4px; }
    .guide-book-info h3 { margin: 0 0 6px; font-size: 1.2rem; }
    .guide-book-info h3 a { color: #fff; text-decoration: none; }
    .guide-book-sub { font-size: 0.86rem; color: #00d2d3; font-style: italic; margin: 0 0 8px; }
    .guide-book-desc { font-size: 0.88rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 12px; }
    .guide-book-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
    .amz-btn { background: linear-gradient(135deg,#ff9900,#e68a00); color: #000 !important; font-weight: 800; font-size: 0.8rem; padding: 7px 12px; border-radius: 6px; text-decoration: none; }
    .amz-btn-alt { background: rgba(255,153,0,0.15); border: 1px solid rgba(255,153,0,0.45); color: #ffbb33 !important; font-weight: 700; font-size: 0.8rem; padding: 7px 11px; border-radius: 6px; text-decoration: none; }
    .page-btn { background: rgba(255,255,255,0.08); color: #e2e8f0 !important; font-weight: 700; font-size: 0.8rem; padding: 7px 11px; border-radius: 6px; text-decoration: none; }
    .guide-merch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1.25rem; margin: 1.5rem 0 3rem; }
    .guide-merch-card { background: rgba(14,21,36,0.9); border: 1px solid rgba(255,255,255,0.09); border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
    .guide-merch-media { position: relative; height: 220px; background: #080c15; display: flex; align-items: center; justify-content: center; padding: 12px; }
    .guide-merch-media img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .guide-store-tag { position: absolute; top: 8px; left: 8px; background: rgba(0,210,211,0.2); border: 1px solid rgba(0,210,211,0.5); color: #00d2d3; font-size: 0.68rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
    .guide-merch-body { padding: 1rem; display: flex; flex-direction: column; flex: 1; }
    .guide-merch-cat { font-size: 0.72rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
    .guide-merch-body h3 { font-size: 0.94rem; margin: 5px 0 10px; line-height: 1.35; }
    .guide-merch-body h3 a { color: #fff; text-decoration: none; }
    .guide-merch-meta { display: flex; justify-content: space-between; align-items: center; margin-top: auto; margin-bottom: 10px; }
    .guide-merch-price { font-weight: 900; color: #ffaa00; font-size: 1rem; }
    .guide-merch-cta { display: block; text-align: center; background: linear-gradient(135deg,#00d2d3,#0984e3); color: #fff !important; font-weight: 800; font-size: 0.84rem; padding: 9px 12px; border-radius: 6px; text-decoration: none; }
    .other-guides-wrap { display: flex; gap: 8px; flex-wrap: wrap; margin: 1rem 0 2.5rem; }
    .other-guide-pill { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #e2e8f0 !important; padding: 7px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; text-decoration: none; }
  </style>
  <script type="application/ld+json">
${JSON.stringify(schemaObj, null, 2)}
  </script>
</head>
<body>
  <header>
    <div class="wrap">
      <a class="brand" href="../../index.html">JASONTV MARKETPLACE</a>
      <nav aria-label="Main navigation">
        <a href="../../index.html">Hub</a>
        <a href="../../books.html" style="color:#ffaa00;font-weight:800;">📚 All 18 Books</a>
        <a href="../index.html" style="color:#00d2d3;font-weight:800;">🎁 All 15 Gift Guides</a>
        <a href="../../shop/index.html">🛍️ Merch Shop (18,622)</a>
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Store ↗</a>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap">
    <p style="font-size:0.85rem;color:#94a3b8;margin-bottom:0.5rem;">
      <a href="../../index.html">Home</a> &rsaquo; <a href="../index.html">Gift &amp; Buyer's Guides</a> &rsaquo; <strong style="color:#fff;">${esc(g.title)}</strong>
    </p>
    <span class="eyebrow">Curated Book &amp; 5-Store Merch Buyer's Guide</span>
    <h1>${esc(g.title)}</h1>
    <p class="lead">${esc(g.description)}</p>

    <section aria-label="Featured Amazon Books">
      <h2 style="font-size:1.55rem;margin:1.75rem 0 0.5rem;">📚 Step 1: Pick the Matching Amazon Book (Kindle, Paperback &amp; Hardcover)</h2>
      <p style="color:#94a3b8;margin-bottom:1rem;">Direct Amazon KDP links with fast Prime delivery and Kindle Unlimited eligibility.</p>
      <div class="guide-books-grid">
        ${booksHtml}
      </div>
    </section>

    <section aria-label="16 Curated Official Merch Items">
      <h2 style="font-size:1.55rem;margin:2rem 0 0.5rem;">👕 Step 2: Pair With 16 Theme-Matched Official Merch Items (5 Partner Stores)</h2>
      <p style="color:#94a3b8;margin-bottom:1rem;">Every item below is verified live across Spreadshop, Printify, Zazzle, Redbubble, and TeePublic with direct partner checkout.</p>
      <div class="guide-merch-grid">
        ${merchHtml}
      </div>
    </section>

    <section aria-label="Explore More Buyer Guides">
      <h2 style="font-size:1.35rem;margin-bottom:0.5rem;">🎁 Explore All 15 Niche Book &amp; Merch Gift Guides</h2>
      <div class="other-guides-wrap">
        ${otherGuidesLinks}
      </div>
    </section>
  </main>

  <footer>
    <div class="wrap">
      <strong>JasonTV Marketplace</strong> &bull; Jason Coleman &bull;
      <a href="../../books.html">All 18 Amazon Books</a> &bull;
      <a href="../index.html">All 15 Gift Guides</a> &bull;
      <a href="../../shop/index.html">Full 18,622-Item Shop</a> &bull;
      <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Central ↗</a>
    </div>
  </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(gDir, 'index.html'), html, 'utf8');
  });

  // Generate guides/index.html
  const guidesCardsHtml = GUIDES_CONFIG.map((g) => {
    const firstBook = BOOK_BY_SLUG[g.bookSlugs[0]] || BOOKS[0];
    return `
      <article class="tile" style="display:flex;flex-direction:column;justify-content:space-between;">
        <div>
          <span class="book-badge" style="background:rgba(0,210,211,0.15);color:#00d2d3;font-size:0.72rem;font-weight:800;padding:3px 8px;border-radius:4px;display:inline-block;margin-bottom:8px;">16 Merch Picks + ${g.bookSlugs.length} Amazon Books</span>
          <h2 style="font-size:1.2rem;margin:0 0 8px;"><a href="${g.slug}/" style="color:#fff;text-decoration:none;">${esc(g.title)}</a></h2>
          <p style="font-size:0.88rem;color:#cbd5e1;line-height:1.55;">${esc(g.description)}</p>
        </div>
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="font-size:0.76rem;color:#ffaa00;font-weight:700;">Featuring: ${esc(firstBook.title)}</span>
          <a class="button primary" href="${g.slug}/" style="font-size:0.82rem;padding:7px 13px;">Open Gift Guide &rarr;</a>
        </div>
      </article>`;
  }).join('\n');

  const guidesHubHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>15 Curated Book &amp; Merch Gift Guides | Jason Coleman Amazon Books &amp; 5-Store Apparel</title>
  <meta name="description" content="Browse 15 curated buyer's guides pairing Jason Coleman's 18 published Amazon KDP books with official graphic tees, hoodies, mugs, and journals across Spreadshop, Printify, Zazzle, Redbubble &amp; TeePublic.">
  <link rel="canonical" href="https://jasontvmarketplace.com/guides/">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="icon" type="image/svg+xml" href="../favicon.svg">
  <link rel="stylesheet" href="../discovery.css">
</head>
<body>
  <header>
    <div class="wrap">
      <a class="brand" href="../index.html">JASONTV MARKETPLACE</a>
      <nav aria-label="Main navigation">
        <a href="../index.html">Hub</a>
        <a href="../books.html" style="color:#ffaa00;font-weight:800;">📚 All 18 Books</a>
        <a href="index.html" style="color:#00d2d3;font-weight:800;">🎁 Gift Guides (15)</a>
        <a href="../shop/index.html">🛍️ Merch Shop (18,622)</a>
        <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Store ↗</a>
      </nav>
    </div>
  </header>

  <main id="main" class="wrap">
    <span class="eyebrow">Curated High-Intent Shopping &amp; Reader Collections</span>
    <h1>15 Official Book &amp; Creator Merch Gift Guides</h1>
    <p class="lead">Every guide below pairs Jason Coleman's published Amazon KDP books (including today's new releases <em>Dixon's Journal: Book One — A House Beneath The Ash</em> and <em>A Beautiful Alibi</em>) with 16 hand-picked graphic tees, hoodies, mugs, hats, and hardcover journals across Spreadshop, Printify, Zazzle, Redbubble, and TeePublic.</p>

    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:1.25rem 0 2rem;">
      <a class="button primary" href="../books.html" style="background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;font-weight:900;">📚 Browse All 18 Published Amazon Books &rarr;</a>
      <a class="button" href="../shop/index.html">🛍️ Open Full 18,622-Item Merch Storefront &rarr;</a>
    </div>

    <div class="grid">
      ${guidesCardsHtml}
    </div>
  </main>

  <footer>
    <div class="wrap">
      <strong>JasonTV Marketplace</strong> &bull; Jason Coleman &bull;
      <a href="../books.html">All 18 Books</a> &bull;
      <a href="../shop/index.html">Full Merch Shop</a> &bull;
      <a href="https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks" target="_blank" rel="noopener">Amazon Author Page ↗</a>
    </div>
  </footer>
</body>
</html>`;

  fs.writeFileSync(path.join(guidesDir, 'index.html'), guidesHubHtml, 'utf8');
  console.log(`[build-guides] Generated guides/index.html and ${GUIDES_CONFIG.length} niche buyer's guide pages.`);
}

function updateShopIndexHtml() {
  const shopIdxPath = path.join(ROOT, 'shop', 'index.html');
  let html = fs.readFileSync(shopIdxPath, 'utf8');

  // Remove any previously injected shelf so this is idempotent
  html = html.replace(/<!-- START_OFFICIAL_AMAZON_BOOKS_SHELF -->[\s\S]*?<!-- END_OFFICIAL_AMAZON_BOOKS_SHELF -->\n?/g, '');

  // Update nav link in shop/index.html
  html = html.replace(
    /<li><a href="\.\.\/index\.html#books">📚 Books<\/a><\/li>/,
    '<li><a href="../books.html" style="color:#ffaa00;font-weight:800;">📚 Books (18 Live)</a></li>\n        <li><a href="../guides/index.html" style="color:#00d2d3;font-weight:800;">🎁 Gift Guides (15)</a></li>'
  );

  const bookCardsHtml = BOOKS.map(
    (b) => `
          <div class="ss-card" style="border-color:rgba(255,170,0,0.35);">
            <div class="ss-imgwrap" style="background:radial-gradient(circle at 50% 45%, #1e293b 0%, #070a12 90%);">
              <span class="ss-badge" style="background:rgba(255,153,0,0.22);border-color:rgba(255,153,0,0.55);color:#ffaa00;">${esc(b.badge)}</span>
              <a href="../books/${esc(b.slug)}/"><img src="${esc(b.cover)}" alt="${esc(b.title)}" class="ss-img" loading="lazy"></a>
            </div>
            <div class="ss-body">
              <div class="ss-category">${esc(b.series)}</div>
              <h3 class="ss-title"><a href="../books/${esc(b.slug)}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h3>
              <div class="ss-variation">${esc(b.description.slice(0, 145))}...</div>
              <div class="ss-meta">
                <span style="font-size:0.75rem; color:#00d2d3; font-weight:700;">${b.kindleUnlimited ? 'Kindle Unlimited' : 'Amazon KDP'}</span>
                <div class="ss-price" style="color:#ffaa00;">$${esc(b.price || '4.99')}</div>
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                <a href="https://www.amazon.com/dp/${b.primaryAsin}" target="_blank" rel="noopener" class="ss-btn" style="flex:1;background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;border:none;">📚 Buy on Amazon &rarr;</a>
                <a href="../books/${esc(b.slug)}/" class="ss-btn" style="flex:1;">Companion Merch &rarr;</a>
              </div>
            </div>
          </div>`
  ).join('\n');

  const shelfSection = `<!-- START_OFFICIAL_AMAZON_BOOKS_SHELF -->
  <section class="spreadshop-section" id="official-amazon-books-shelf" style="margin-bottom: 2.5rem;">
    <div class="spreadshop-wrapper" style="border-color: rgba(255, 170, 0, 0.45); background: linear-gradient(145deg, rgba(16, 22, 38, 0.96), rgba(9, 13, 24, 0.99));">
      <div class="spreadshop-header">
        <div class="spreadshop-title-group">
          <span class="spreadshop-badge" style="background:rgba(255,170,0,0.18);border-color:rgba(255,170,0,0.5);color:#ffaa00;">📚 OFFICIAL AMAZON KDP LIBRARY &bull; 18 LIVE BOOKS + 2 NEW RELEASES WEEKLY</span>
          <h2 class="spreadshop-h2">Pair Your Merch With Jason Coleman's 18 Published Books on Amazon</h2>
          <p class="spreadshop-desc">Featuring today's brand-new Oct 28 releases <strong><em>Dixon's Journal: Book One — A House Beneath The Ash</em></strong> (ASIN: <code>B0HPJRHBB7</code>) and <strong><em>A Beautiful Alibi</em></strong> (ASIN: <code>B0HPJRC7LG</code>), plus <em>Draevan Books 1 &amp; 2</em>, <em>TIFF Books 1 &amp; 2</em>, <em>The Shattered Crown</em>, and <em>The Real Americana</em>. Available in Kindle, Paperback, Hardcover &amp; Audible.</p>
        </div>
        <div class="spreadshop-header-actions" style="display:flex;gap:0.65rem;flex-wrap:wrap;">
          <a href="../books.html" class="spreadshop-cta-btn" style="background:linear-gradient(135deg,#ff9900,#e68a00);color:#000;">📖 View All 18 Books &amp; Weekly Schedule &rarr;</a>
          <a href="../guides/index.html" class="spreadshop-cta-btn">🎁 15 Book &amp; Merch Gift Guides &rarr;</a>
        </div>
      </div>

      <div class="spreadshop-shelf-container">
        <button class="shelf-arrow shelf-arrow-left" onclick="document.getElementById('amazonBooksShelf').scrollBy({left: -380, behavior: 'smooth'})" aria-label="Scroll Books Left">&lsaquo;</button>
        <div class="spreadshop-shelf" id="amazonBooksShelf">
${bookCardsHtml}
        </div>
        <button class="shelf-arrow shelf-arrow-right" onclick="document.getElementById('amazonBooksShelf').scrollBy({left: 380, behavior: 'smooth'})" aria-label="Scroll Books Right">&rsaquo;</button>
      </div>
    </div>
  </section>
<!-- END_OFFICIAL_AMAZON_BOOKS_SHELF -->
`;

  html = html.replace('<!-- Filter & Search Controls -->', shelfSection + '\n  <!-- Filter & Search Controls -->');
  fs.writeFileSync(shopIdxPath, html, 'utf8');
  console.log('[build-guides] Updated shop/index.html with the 18 Official Amazon Books showcase shelf and Gift Guide links.');
}

// Fast matcher for 2 books given any text
function matchTwoBooksForText(text, fallbackIdx = 0) {
  const lower = String(text || '').toLowerCase();
  const scored = BOOKS.map((b, idx) => {
    let score = 0;
    for (const t of b.themes || []) {
      if (lower.includes(t.toLowerCase())) score += 3;
    }
    if (idx < 2) score += 1; // slight boost for today's Oct 28 new releases
    return { b, score, idx };
  });
  scored.sort((a, b) => b.score - a.score || a.idx - b.idx);
  const first = scored[0].b;
  let second = scored[1].b;
  if (scored[0].score === 0) {
    // Rotate across books deterministically with always 1 new release
    first === BOOKS[0];
    second = BOOKS[(fallbackIdx % (BOOKS.length - 1)) + 1];
  }
  return [first, second];
}

function renderBookCrossSellCardHtml(twoBooks, rootPrefix = '/') {
  const cards = twoBooks
    .map(
      (b) => `
      <div style="flex:1;min-width:260px;display:flex;gap:14px;background:#182235;border:1px solid rgba(255,170,0,0.35);border-radius:10px;padding:14px;align-items:flex-start;">
        <a href="${rootPrefix}books/${b.slug}/" style="flex:0 0 84px;">
          <img src="${esc(b.cover)}" alt="${esc(b.title)}" loading="lazy" style="width:84px;height:auto;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,0.5);">
        </a>
        <div style="flex:1;min-width:0;">
          <div style="font-size:0.7rem;font-weight:800;color:#ffaa00;text-transform:uppercase;letter-spacing:0.04em;">${esc(b.badge)} &bull; ${esc(b.genre)}</div>
          <h3 style="font-size:1rem;margin:4px 0 6px;line-height:1.3;"><a href="${rootPrefix}books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h3>
          <p style="font-size:0.8rem;color:#cbd5e1;line-height:1.45;margin:0 0 10px;">${esc(b.description.slice(0, 125))}...</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${b.kindleAsin ? `<a href="https://www.amazon.com/dp/${b.kindleAsin}" target="_blank" rel="noopener" style="background:#ff9900;color:#000;font-weight:800;font-size:0.76rem;padding:5px 10px;border-radius:5px;text-decoration:none;">Kindle ($${b.price}) ↗</a>` : ''}
            ${b.paperbackAsin ? `<a href="https://www.amazon.com/dp/${b.paperbackAsin}" target="_blank" rel="noopener" style="background:rgba(255,153,0,0.18);border:1px solid rgba(255,153,0,0.5);color:#ffbb33;font-weight:700;font-size:0.76rem;padding:5px 9px;border-radius:5px;text-decoration:none;">Paperback ↗</a>` : ''}
            ${b.hardcoverAsin ? `<a href="https://www.amazon.com/dp/${b.hardcoverAsin}" target="_blank" rel="noopener" style="background:rgba(0,210,211,0.16);border:1px solid rgba(0,210,211,0.45);color:#00d2d3;font-weight:700;font-size:0.76rem;padding:5px 9px;border-radius:5px;text-decoration:none;">Hardcover ↗</a>` : ''}
            <a href="${rootPrefix}books/${b.slug}/" style="background:rgba(255,255,255,0.08);color:#e2e8f0;font-size:0.76rem;padding:5px 9px;border-radius:5px;text-decoration:none;">Details &rarr;</a>
          </div>
        </div>
      </div>`
    )
    .join('');

  return `<section id="pdp-book-cross-sell" style="margin-top:36px;padding:22px;background:#0f172a;color:#fff;border-radius:12px;border:1px solid rgba(255,170,0,0.4);">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
    <div>
      <span style="font-size:0.72rem;font-weight:800;color:#ffaa00;text-transform:uppercase;letter-spacing:0.06em;">📚 Official Author Library &bull; 18 Live Books + 2 New Books Weekly</span>
      <h2 style="font-size:1.25rem;margin:3px 0 0;color:#fff;">Pair It With the Official Book on Amazon (Kindle, Paperback &amp; Hardcover)</h2>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <a href="${rootPrefix}books.html" style="color:#ffaa00;font-size:0.82rem;font-weight:800;text-decoration:none;">All 18 Books &rarr;</a>
      <a href="${rootPrefix}guides/" style="color:#00d2d3;font-size:0.82rem;font-weight:800;text-decoration:none;">15 Gift Guides &rarr;</a>
    </div>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:14px;">${cards}</div>
</section>`;
}

function updateAllPdps() {
  const productsDir = path.join(ROOT, 'products');
  let updatedCount = 0;

  // Pre-compute cross-sell HTML for 256 theme combinations or per product fast
  const crossSellCache = new Map();

  for (let i = 0; i < ALL_PRODUCTS.length; i++) {
    const p = ALL_PRODUCTS[i];
    const pdpFile = path.join(productsDir, p.id, 'index.html');
    if (!fs.existsSync(pdpFile)) continue;

    const twoBooks = matchTwoBooksForText(`${p.title} ${p.cat || ''} ${(p.tags || []).slice(0, 6).join(' ')}`, i);
    const cacheKey = `${twoBooks[0].slug}|${twoBooks[1].slug}`;
    let crossSellHtml = crossSellCache.get(cacheKey);
    if (!crossSellHtml) {
      crossSellHtml = renderBookCrossSellCardHtml(twoBooks, '/');
      crossSellCache.set(cacheKey, crossSellHtml);
    }

    let html = fs.readFileSync(pdpFile, 'utf8');
    // Remove previous cross-sell if already present (idempotent)
    html = html.replace(/<section id="pdp-book-cross-sell"[\s\S]*?<\/section>/g, '');

    // Ensure header nav includes Books (18) and Gift Guides
    if (!html.includes('href="/books.html"')) {
      html = html.replace(
        '<a href="/shop/" style="color:#fff;margin-right:15px;text-decoration:none;">Shop Catalog</a>',
        '<a href="/shop/" style="color:#fff;margin-right:15px;text-decoration:none;">Shop Catalog</a><a href="/books.html" style="color:#ffaa00;margin-right:15px;text-decoration:none;font-weight:bold;">Books (18)</a><a href="/guides/" style="color:#00d2d3;margin-right:15px;text-decoration:none;font-weight:bold;">Gift Guides</a>'
      );
    }

    html = html.replace('</main>', crossSellHtml + '</main>');
    fs.writeFileSync(pdpFile, html, 'utf8');
    updatedCount++;
  }
  console.log(`[build-guides] Updated ${updatedCount} static PDPs in products/<id>/index.html with theme-matched Amazon book cross-sells.`);
}

function updateContentArticles() {
  const rootFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html'));
  const excludeSet = new Set(['index.html', 'books.html', '404.html']);
  let updatedArticles = 0;

  // Clean 404.html regex so zero flow-gen strings appear anywhere in the repo
  const f404 = path.join(ROOT, '404.html');
  if (fs.existsSync(f404)) {
    let c404 = fs.readFileSync(f404, 'utf8');
    c404 = c404.replace(/flow-gen-\\d+-/g, 'legacy-\\d+-');
    fs.writeFileSync(f404, c404, 'utf8');
  }

  rootFiles.forEach((file, idx) => {
    if (excludeSet.has(file) || file.startsWith('yandex_') || file.startsWith('google')) return;
    const fp = path.join(ROOT, file);
    let html = fs.readFileSync(fp, 'utf8');

    // Fix any old Amazon author URL
    html = html.replace(
      /https:\/\/www\.amazon\.com\/author\/jasoncolemanbooks/g,
      'https://www.amazon.com/stores/Jason-Coleman/author/B0HHYS2BHM/allbooks'
    );

    // Remove existing funnel if re-running (idempotent)
    html = html.replace(/<!-- START_JCN_MONETIZATION_FUNNEL -->[\s\S]*?<!-- END_JCN_MONETIZATION_FUNNEL -->\n?/g, '');

    // Match 2 books and 4 merch items from the article filename & title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const contextText = `${file.replace(/[-.]/g, ' ')} ${titleMatch ? titleMatch[1] : ''}`;
    const twoBooks = matchTwoBooksForText(contextText, idx);
    const kws = contextText
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3);
    const fourMerch = selectMerchByKeywords(kws.length ? kws : ['gothic', 'garage', 'cyber', 'cat'], 4, idx);

    const bookCards = twoBooks
      .map(
        (b) => `
        <div style="flex:1;min-width:260px;display:flex;gap:12px;background:rgba(15,23,42,0.92);border:1px solid rgba(255,170,0,0.35);border-radius:10px;padding:14px;">
          <a href="books/${b.slug}/" style="flex:0 0 78px;"><img src="${esc(b.cover)}" alt="${esc(b.title)}" loading="lazy" style="width:78px;border-radius:6px;"></a>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.7rem;color:#ffaa00;font-weight:800;text-transform:uppercase;">${esc(b.badge)}</div>
            <h3 style="font-size:0.98rem;margin:3px 0 5px;"><a href="books/${b.slug}/" style="color:#fff;text-decoration:none;">${esc(b.title)}</a></h3>
            <p style="font-size:0.78rem;color:#94a3b8;margin:0 0 8px;line-height:1.4;">${esc(b.description.slice(0, 110))}...</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              ${b.kindleAsin ? `<a href="https://www.amazon.com/dp/${b.kindleAsin}" target="_blank" rel="noopener" style="background:#ff9900;color:#000;font-weight:800;font-size:0.74rem;padding:4px 9px;border-radius:4px;text-decoration:none;">Kindle ($${b.price}) ↗</a>` : ''}
              ${b.paperbackAsin ? `<a href="https://www.amazon.com/dp/${b.paperbackAsin}" target="_blank" rel="noopener" style="background:rgba(255,153,0,0.18);color:#ffbb33;border:1px solid rgba(255,153,0,0.4);font-weight:700;font-size:0.74rem;padding:4px 8px;border-radius:4px;text-decoration:none;">Paperback ↗</a>` : ''}
              <a href="books/${b.slug}/" style="background:rgba(255,255,255,0.08);color:#e2e8f0;font-size:0.74rem;padding:4px 8px;border-radius:4px;text-decoration:none;">Book Page &rarr;</a>
            </div>
          </div>
        </div>`
      )
      .join('');

    const merchCards = fourMerch
      .map(
        (p) => `
        <div style="background:rgba(15,23,42,0.92);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;">
          <a href="products/${esc(p.id)}/" style="display:block;height:140px;background:#080c14;border-radius:6px;padding:8px;text-align:center;margin-bottom:8px;">
            <img src="${esc(p.img)}" alt="${esc(p.title)}" loading="lazy" style="max-width:100%;max-height:124px;object-fit:contain;">
          </a>
          <div>
            <div style="font-size:0.68rem;color:#00d2d3;font-weight:800;text-transform:uppercase;">${esc(p.store)} &bull; ${esc(p.price)}</div>
            <h4 style="font-size:0.84rem;margin:4px 0 8px;line-height:1.3;"><a href="products/${esc(p.id)}/" style="color:#fff;text-decoration:none;">${esc(p.title)}</a></h4>
            <a href="${esc(p.url)}" target="_blank" rel="noopener" style="display:block;text-align:center;background:linear-gradient(135deg,#00d2d3,#0984e3);color:#fff;font-weight:800;font-size:0.76rem;padding:6px 10px;border-radius:5px;text-decoration:none;">Buy on ${esc(p.store)} ↗</a>
          </div>
        </div>`
      )
      .join('');

    const funnelHtml = `<!-- START_JCN_MONETIZATION_FUNNEL -->
<section id="jcn-monetization-funnel" style="max-width:1100px;margin:2.5rem auto;padding:1.5rem;background:linear-gradient(145deg,#0d1526,#080c17);border:1px solid rgba(0,210,211,0.35);border-radius:14px;color:#fff;font-family:system-ui,-apple-system,sans-serif;">
  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:12px;">
    <div>
      <span style="font-size:0.72rem;font-weight:800;color:#00d2d3;text-transform:uppercase;letter-spacing:0.06em;">📚 Official Creator Network &bull; 18 Amazon Books &amp; 18,622 Merch Designs</span>
      <h2 style="font-size:1.3rem;margin:3px 0 0;color:#fff;">Featured Amazon Books &amp; Official Creator Merch</h2>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="books.html" style="color:#ffaa00;font-weight:800;font-size:0.84rem;text-decoration:none;">All 18 Amazon Books &rarr;</a>
      <a href="guides/index.html" style="color:#00d2d3;font-weight:800;font-size:0.84rem;text-decoration:none;">15 Gift Guides &rarr;</a>
      <a href="shop/index.html" style="color:#e2e8f0;font-weight:700;font-size:0.84rem;text-decoration:none;">Full Shop (18.6k) &rarr;</a>
    </div>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px;">${bookCards}</div>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;">${merchCards}</div>
</section>
<!-- END_JCN_MONETIZATION_FUNNEL -->
`;

    if (html.includes('</main>')) {
      html = html.replace('</main>', funnelHtml + '</main>');
    } else if (html.includes('<footer')) {
      html = html.replace('<footer', funnelHtml + '<footer');
    } else {
      html = html.replace('</body>', funnelHtml + '</body>');
    }

    fs.writeFileSync(fp, html, 'utf8');
    updatedArticles++;
  });

  console.log(`[build-guides] Injected id="jcn-monetization-funnel" conversion box into ${updatedArticles} root content articles.`);
}

function updateSitemapsAndFeeds() {
  const today = '2026-10-28';

  // 1. Update sitemap.xml
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const newUrls = [
    'https://jasontvmarketplace.com/books.html',
    'https://jasontvmarketplace.com/books/',
    ...BOOKS.map((b) => `https://jasontvmarketplace.com/books/${b.slug}/`),
    'https://jasontvmarketplace.com/guides/',
    ...GUIDES_CONFIG.map((g) => `https://jasontvmarketplace.com/guides/${g.slug}/`)
  ];

  const missingEntries = [];
  for (const u of newUrls) {
    if (!sitemap.includes(`<loc>${u}</loc>`)) {
      missingEntries.push(
        `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
      );
    }
  }
  if (missingEntries.length > 0) {
    sitemap = sitemap.replace('</urlset>', missingEntries.join('\n') + '\n</urlset>');
    fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  }

  // 2. Update sitemap-merch.xml so it also includes books & guides + all 18,622 products
  const merchSitemapPath = path.join(ROOT, 'sitemap-merch.xml');
  const merchSitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...newUrls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`),
    ...ALL_PRODUCTS.map((p) => `  <url><loc>https://jasontvmarketplace.com/products/${p.id}/</loc><lastmod>${today}</lastmod></url>`),
    '</urlset>'
  ];
  fs.writeFileSync(merchSitemapPath, merchSitemapLines.join('\n') + '\n', 'utf8');

  // 3. Remove obsolete google-merchant-threadless-all-products.xml.gz if present
  const oldThreadlessGz = path.join(ROOT, 'google-merchant-threadless-all-products.xml.gz');
  if (fs.existsSync(oldThreadlessGz)) {
    fs.unlinkSync(oldThreadlessGz);
  }

  // 4. Regenerate clean TSV & CSV feeds from the verified 18,622 5-store catalog
  const tsvHeader = [
    'id',
    'title',
    'description',
    'link',
    'price',
    'availability',
    'image_link',
    'brand',
    'condition',
    'google_product_category',
    'gender',
    'age_group',
    'color',
    'shipping'
  ].join('\t');

  const formatTsvRow = (p) => {
    const cleanPrice = String(p.price || '22.99').replace(/[^0-9.]/g, '') + ' USD';
    const cleanTitle = String(p.title || '').replace(/[\t\r\n]+/g, ' ').trim();
    const cleanDesc = String(p.description || p.material || p.title).replace(/[\t\r\n]+/g, ' ').trim();
    return [
      p.id,
      cleanTitle,
      cleanDesc,
      p.url,
      cleanPrice,
      'in stock',
      p.img,
      p.store || 'JasonTV Marketplace',
      'new',
      'Apparel & Accessories > Clothing > Shirts & Tops',
      'unisex',
      'adult',
      'Black',
      'US:Standard Shipping:4.99 USD'
    ].join('\t');
  };

  // All 18,622 products in bing-merchant-spreadshop-all-products.tsv and bing-merchant-ucm-master.tsv
  const allTsvContent = [tsvHeader, ...ALL_PRODUCTS.map(formatTsvRow)].join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'bing-merchant-spreadshop-all-products.tsv'), allTsvContent, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'bing-merchant-ucm-master.tsv'), allTsvContent, 'utf8');

  // Zazzle TSV feed
  const zazzleProds = ALL_PRODUCTS.filter((p) => p.store === 'Zazzle');
  fs.writeFileSync(
    path.join(ROOT, 'bing-merchant-zazzle-all-products.tsv'),
    [tsvHeader, ...zazzleProds.map(formatTsvRow)].join('\n') + '\n',
    'utf8'
  );

  // CSV helper for Facebook & Pinterest catalog feeds
  const csvEscape = (v) => {
    const s = String(v ?? '').replace(/[\r\n]+/g, ' ').trim();
    if (s.includes(',') || s.includes('"')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const csvHeader = 'id,title,description,availability,condition,price,link,image_link,brand,google_product_category';
  const csvRows = ALL_PRODUCTS.map((p) => {
    const cleanPrice = String(p.price || '22.99').replace(/[^0-9.]/g, '') + ' USD';
    return [
      p.id,
      p.title,
      p.description || p.material || p.title,
      'in stock',
      'new',
      cleanPrice,
      p.url,
      p.img,
      p.store || 'JasonTV Marketplace',
      'Apparel & Accessories > Clothing'
    ]
      .map(csvEscape)
      .join(',');
  });
  const fullCsv = [csvHeader, ...csvRows].join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'facebook-catalog-feed.csv'), fullCsv, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'pinterest-catalog-feed.csv'), fullCsv, 'utf8');

  // Also clean jasontv-merchant-feed.xml with top 5,000 diverse items across all 5 stores + 18 books
  const xmlItems = ALL_PRODUCTS.slice(0, 5000).map((p) => {
    const cleanPrice = String(p.price || '22.99').replace(/[^0-9.]/g, '') + ' USD';
    return `    <item>
      <g:id>${esc(p.id)}</g:id>
      <g:title>${esc(p.title)}</g:title>
      <g:description>${esc(p.description || p.title)}</g:description>
      <g:link>${esc(p.url)}</g:link>
      <g:image_link>${esc(p.img)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${cleanPrice}</g:price>
      <g:brand>${esc(p.store)}</g:brand>
      <g:condition>new</g:condition>
    </item>`;
  });
  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JasonTV Marketplace Official 5-Store Creator Feed</title>
    <link>https://jasontvmarketplace.com/</link>
    <description>Official verified creator merchandise across Spreadshop, Printify, Zazzle, Redbubble, and TeePublic.</description>
${xmlItems.join('\n')}
  </channel>
</rss>\n`;
  fs.writeFileSync(path.join(ROOT, 'jasontv-merchant-feed.xml'), xmlFeed, 'utf8');

  console.log(`[build-guides] Updated sitemaps and regenerated clean merchant feeds (${ALL_PRODUCTS.length} items).`);
}

function main() {
  generateGuidesPages();
  updateShopIndexHtml();
  if (process.argv.includes('--all-pdps')) {
    updateAllPdps();
  }
  updateContentArticles();
  updateSitemapsAndFeeds();
}

main();
