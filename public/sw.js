const CACHE_NAME = 'wedding-static-v4';
const STATIC_ASSETS = [
  '/audio/mangalye.mp3',
  '/photos/wedding-photo.jpeg',
];

// Install: only cache heavy static assets (audio/photos)
globalThis.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  globalThis.skipWaiting();
});

// Activate: delete old caches, claim all clients, force reload
globalThis.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => globalThis.clients.claim())
      .then(() =>
        globalThis.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => client.navigate(client.url));
        })
      )
  );
});

// Fetch: network-first for HTML/JS/CSS, cache-first for audio/images
globalThis.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  const isStaticAsset =
    url.pathname.startsWith('/audio/') ||
    url.pathname.startsWith('/photos/') ||
    url.pathname.startsWith('/icons/');

  if (isStaticAsset) {
    // Cache-first for heavy static assets
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
  } else {
    // Network-first for everything else (HTML, JS, CSS)
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
