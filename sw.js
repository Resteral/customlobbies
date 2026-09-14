/* CustomLobbies.com - PWA Service Worker Engine */
const CACHE_NAME = 'customlobbies-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/overlay.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/elo-engine.js',
  '/js/chat-voice.js',
  '/js/stream-studio.js',
  '/js/widget-builder.js',
  '/js/integrations.js',
  '/js/tournaments-store.js',
  '/js/firebase-google.js'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ CustomLobbies PWA Assets Cached for Standalone App');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((res) => {
      return res || fetch(evt.request);
    })
  );
});
