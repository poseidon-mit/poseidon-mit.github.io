/**
 * Poseidon.AI Service Worker
 * Implements cache-safe deployment behavior for prototype static hosting.
 */

const CACHE_VERSION = 'poseidon-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Files to precache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
];

// Static deployment strategy:
// - JS/CSS: network-first to reduce stale-bundle risk after deploys
// - media/fonts: cache-first for performance
const NETWORK_FIRST_ASSETS_PATTERN = /\.(js|css)$/i;
const CACHE_FIRST_MEDIA_PATTERN = /\.(woff2?|ttf|otf|svg|png|jpg|jpeg|gif|ico|webp|avif)$/i;

/**
 * Install event: Precache app shell files
 */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Continue even if some files fail to cache
        return Promise.resolve();
      });
    }).then(() => {
      // Skip waiting - immediately activate new version
      return self.skipWaiting();
    })
  );
});

/**
 * Activate event: Clean up old caches
 */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match current version
          if (!cacheName.startsWith(`poseidon-`)) {
            return caches.delete(cacheName);
          }
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/**
 * Fetch event: Route requests based on type and URL
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API calls: network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  const acceptsHTML = request.headers.get('accept')?.includes('text/html');

  // Handle HTML documents: network-first strategy
  if (acceptsHTML) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    return;
  }

  // Handle JS/CSS bundles: network-first strategy for deploy freshness
  if (NETWORK_FIRST_ASSETS_PATTERN.test(url.pathname)) {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Handle static media assets: cache-first strategy
  if (CACHE_FIRST_MEDIA_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Default: stale-while-revalidate strategy
  event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
});

/**
 * Cache-first strategy: Use cache if available, fall back to network
 * Good for: static assets (JS, CSS, images, fonts)
 */
async function cacheFirstStrategy(request, cacheName = STATIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    // Return offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }

    // Return a generic offline response for other requests
    return new Response('Network unavailable', { status: 503 });
  }
}

/**
 * Network-first strategy: Try network first, fall back to cache
 * Good for: API calls, HTML pages
 */
async function networkFirstStrategy(request, cacheName = DYNAMIC_CACHE) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch {
    // Fall back to cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline fallback for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }

    return new Response('Network unavailable', { status: 503 });
  }
}

/**
 * Stale-while-revalidate strategy: Return cache immediately, update in background
 * Good for: non-critical resources
 */
async function staleWhileRevalidateStrategy(request, cacheName = DYNAMIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    // Cache the updated response
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached or offline page
    return cachedResponse || new Response('Offline', { status: 503 });
  });

  return cachedResponse || fetchPromise;
}

/**
 * Handle messages from clients (e.g., skip-waiting command)
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
