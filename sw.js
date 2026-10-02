// JasonTV Marketplace Service Worker
const CACHE_NAME = 'jasontv-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/gamedev/',
  '/gamedev/index.html',
  '/gamedev/style.css',
  '/gamedev/app.js',
  '/gamedev/products.js',
  '/books.html',
  '/watch.html',
  '/discovery.css',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Only handle GET requests for our origin or fonts
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // Skip analytics or external checkout APIs
  if (url.hostname.includes('google-analytics') || url.hostname.includes('gumroad.com') || url.hostname.includes('itch.io')) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // Network-first for HTML pages so fresh updates arrive immediately
      if (e.request.headers.get('accept')?.includes('text/html')) {
        return fetch(e.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse || caches.match('/index.html'));
      }

      // Stale-while-revalidate for assets
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
