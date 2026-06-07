const CACHE_NAME   = 'hop-dash-v1';
const CACHE_ASSETS = [
  './', './index.html', './css/main.css',
  './js/entities.js', './js/renderer.js', './js/shop.js', './js/app.js',
  './manifest.json',
];
self.addEventListener('install',  e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CACHE_ASSETS))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => e.request.destination === 'document' ? caches.match('./index.html') : undefined);
  }));
});
