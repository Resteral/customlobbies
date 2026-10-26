/* CustomLobbies.com - PWA Service Worker Engine v3 */
const CACHE_NAME = 'customlobbies-v3';
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
  '/js/firebase-google.js',
  '/js/party-engine.js',
  '/js/program-client-suite.js',
  '/assets/logo.jpg'
];

self.addEventListener('install', (evt) => {
  self.skipWaiting();
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ CustomLobbies PWA Assets Cached for Standalone App');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.warn('PWA precache partial:', err));
    })
  );
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Purging legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First with Cache fallback: Ensures users always get fresh updates while offline still works
self.addEventListener('fetch', (evt) => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    fetch(evt.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(evt.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(evt.request))
  );
});
