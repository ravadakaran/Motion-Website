/* =========================================================
   Service Worker — Raka Portfolio
   Provides robust offline caching for core assets, fonts,
   and progressive frame sequence caching.
   ========================================================= */

const CACHE_NAME = 'raka-portfolio-v2';
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

// Install Event: pre-cache critical shell assets & skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Some assets could not be pre-cached on install:', err);
      });
    })
  );
});

// Activate Event: clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Network-First for HTML/CSS/JS so new deployments are immediate; Cache-First for frames & images
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Handle Google Fonts & static CDNs (Cache-First)
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

  // Handle Local Assets
  if (url.origin === self.location.origin) {
    const isCodeAsset = url.pathname.endsWith('.html') ||
                        url.pathname.endsWith('.css') ||
                        url.pathname.endsWith('.js') ||
                        url.pathname === '/' ||
                        url.pathname.endsWith('/');

    if (isCodeAsset) {
      // Network-First: Always fetch latest deployed code; fall back to cache when offline
      event.respondWith(
        fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match('./index.html');
          });
        })
      );
      return;
    }

    // Media & Frame Sequence: Cache-First for instant 60fps performance
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          if (url.pathname.includes('/new/') || url.pathname.includes('/projects/')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          if (request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});
