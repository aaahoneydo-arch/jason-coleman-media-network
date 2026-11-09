self.addEventListener('install', e => e.waitUntil(self.skipWaiting()));
self.addEventListener('activate', e => e.waitUntil((async()=>{for(const n of await caches.keys())if(n.startsWith('jasontv-storefront-'))await caches.delete(n);await self.clients.claim();await self.registration.unregister();})()));
