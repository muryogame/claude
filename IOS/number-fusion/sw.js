// Service Worker — オフライン対応 & キャッシュ戦略
// Play Store TWA 要件: Service Worker が必須
const CACHE_NAME    = 'number-fusion-v1';
const CACHE_ASSETS  = [
  './',
  './index.html',
  './css/main.css',
  './js/constants.js',
  './js/game.js',
  './js/render.js',
  './js/daily.js',
  './js/app.js',
  './manifest.json',
];

// インストール: 全アセットをキャッシュ
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_ASSETS))
  );
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// フェッチ: Cache First (ゲームアセット) → Network Fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // 成功したレスポンスだけキャッシュ
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return response;
      }).catch(() => {
        // オフライン時はトップページを返す
        if (e.request.destination === 'document') return caches.match('./index.html');
      });
    })
  );
});
