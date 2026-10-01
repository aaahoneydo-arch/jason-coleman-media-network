document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterChips = document.querySelectorAll('.filter-chip');

  let currentFilter = 'all';
  let searchQuery = '';

  // Update counts on filter chips
  function updateCategoryCounts() {
    const counts = {
      all: PRODUCTS.length,
      engine: 0,
      godot: 0,
      assets: 0,
      game: 0,
      book: 0
    };

    PRODUCTS.forEach(p => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    Object.keys(counts).forEach(cat => {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = counts[cat];
    });
  }

  // Render product cards
  function renderProducts() {
    const query = searchQuery.toLowerCase().trim();

    const filtered = PRODUCTS.filter(product => {
      // Category filter
      const matchesCategory = (currentFilter === 'all') || (product.category === currentFilter);

      // Search query filter
      const matchesSearch = !query ||
        product.title.toLowerCase().includes(query) ||
        product.subtitle.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.badges.some(b => b.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div style="font-size: 3rem; margin-bottom: 16px;">🔍</div>
          <h3 style="font-size: 1.4rem; margin-bottom: 8px;">No matching products found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">Try adjusting your search terms or filter selection.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const badgesHtml = product.badges.map(b => `<span class="badge-tag">${b}</span>`).join('');
      const specsHtml = product.specs.map(s => `<li>${s}</li>`).join('');

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-media">
            <img src="${product.cover}" alt="${product.title}" class="card-image" loading="lazy" onerror="this.src='assets/covers/soitswarthen.jpg'">
            <div class="price-tag">$${product.price.toFixed(2)}</div>
          </div>
          <div class="card-body">
            <div class="card-badges">${badgesHtml}</div>
            <h3 class="card-title">
              <a href="products/${product.id}.html" style="color: inherit; text-decoration: none;">${product.title}</a>
            </h3>
            <div class="card-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-num">5.0</span>
              <span class="review-count">(${product.reviews} verified reviews)</span>
            </div>
            <p class="card-desc">${product.description}</p>
            <ul class="card-specs">${specsHtml}</ul>
            <div class="card-actions">
              <a href="${product.itchUrl}" target="_blank" rel="noopener" class="btn-itch">
                Buy on itch.io
              </a>
              <a href="${product.gumroadUrl}" target="_blank" rel="noopener" class="btn-gumroad">
                Gumroad Store
              </a>
            </div>
            <div style="text-align: center; margin-top: 10px;">
              <a href="products/${product.id}.html" style="color: var(--amber); font-size: 0.85rem; font-weight: 600; text-decoration: none;">
                View Architecture &amp; Specs →
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Filter chips click handling
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      renderProducts();
    });
  });

  // Search input handling
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
    renderProducts();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderProducts();
    searchInput.focus();
  });

  // Initial render
  updateCategoryCounts();
  renderProducts();
});
