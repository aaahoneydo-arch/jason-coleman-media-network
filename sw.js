// JasonTV Marketplace Service Worker v8 (Network-First Live Storefront & Catalog Sync)
const CACHE_NAME = 'jasontv-storefront-v8';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => caches.delete(k)) // Purge all old caches immediately
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Skip external analytics and shop checkout domains
  if (url.hostname.includes('google-analytics') || url.hostname.includes('gumroad.com') || url.hostname.includes('itch.io') || url.hostname.includes('myspreadshop.com') || url.hostname.includes('printify.me') || url.hostname.includes('zazzle.com') || url.hostname.includes('redbubble.com') || url.hostname.includes('teepublic.com')) {
    return;
  }

  // Network-first for ALL HTML, JSON catalogs, and JS files so price/inventory updates are live immediately
  if (
    e.request.headers.get('accept')?.includes('text/html') ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.js') ||
    url.pathname === '/'
  ) {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(e.request) || caches.match('/index.html'))
    );
    return;
  }

  // Stale-while-revalidate for static image/font assets
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      const fetchPromise = fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
