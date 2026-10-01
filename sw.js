/* =========================================================
   Service Worker — Raka Portfolio
   Provides robust offline caching for core assets, fonts,
   and progressive frame sequence caching.
   ========================================================= */

const CACHE_NAME = 'raka-portfolio-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './favicon.svg',
  './site.webmanifest',
  './projects/como.jpg',
  './projects/flowsuite.jpg',
  './projects/ai_film.jpg',
  './projects/traffic.jpg',
  './projects/kifayati.jpg',
  './projects/disease.jpg'
];

// Install Event: pre-cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached on install:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First for static assets & frame images, Network-First for HTML
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Handle Google Fonts & static CDNs
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle Local Assets (Frames, Projects, Scripts, CSS)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cache frames and images dynamically as they load
          if (url.pathname.includes('/new/') || url.pathname.includes('/projects/')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          // Fallback if offline
          if (request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});
