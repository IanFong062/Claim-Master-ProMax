// 每次改完 index.html，記得一定要改呢個版本號！(例如 v1 -> v2 -> v3)
const CACHE_NAME = 'claim-master-v8.1'; 

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.mini.min.js'
];

// 安裝 Service Worker
self.addEventListener('install', (e) => {
  // 強制跳過等待，讓新 Service Worker 即時生效
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 激活 Service Worker (清理舊緩存)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // 如果緩存名稱唔同 (即係版本舊咗)，就刪除佢
          if (key !== CACHE_NAME) {
            console.log('刪除舊緩存:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // 讓 Service Worker 立即接管頁面
  return self.clients.claim();
});

// 攔截請求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果緩存有，就用緩存；否則上網拎
      return response || fetch(e.request);
    })
  );
});