// JasonTV Marketplace Service Worker v4 (Real Items & Top Scroll Showcase)
const CACHE_NAME = 'jasontv-storefront-v4';

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
  if (url.hostname.includes('google-analytics') || url.hostname.includes('gumroad.com') || url.hostname.includes('itch.io') || url.hostname.includes('fourthwall.com') || url.hostname.includes('myspreadshop.com')) {
    return;
  }

  // Network-first for ALL HTML pages so updates are live immediately
  if (e.request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.html') || url.pathname === '/') {
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

  // Stale-while-revalidate for assets
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
