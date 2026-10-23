// Service worker for the Smart Flooring PWA.
// Goal: once opened, the inspector's form keeps working with a weak or no signal at the job site.
// Bump VERSION when this file's caching logic changes; old caches are deleted on activate.
const VERSION = "v1";
const PAGES = `pages-${VERSION}`;
const ASSETS = `assets-${VERSION}`;

// Pages available offline right after installation.
const PRECACHE = ["/inspection", "/inspection/lines", "/inspection/areas"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== PAGES && k !== ASSETS).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Only this origin: the API lives elsewhere and must never be served from cache.
  if (url.origin !== self.location.origin) return;

  // Pages: network first (always the latest version), cache when offline.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Hashed build files, icons and fonts never change: cache first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:woff2?|png|svg|ico)$/.test(url.pathname)
  ) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(PAGES);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    return cached ?? (await cache.match("/inspection")) ?? Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}
