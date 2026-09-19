/* CFC WOD Timer: werkt offline. Verhoog VERSION bij elke update, dan halen telefoons de nieuwe versie op. */
const VERSION = 'cfc-timer-v3';
const FILES = [
  "./",
  "./fonts/Anton-400-latin-ext.woff2",
  "./fonts/Anton-400-latin.woff2",
  "./fonts/BarlowCondensed-500-latin-ext.woff2",
  "./fonts/BarlowCondensed-500-latin.woff2",
  "./fonts/BarlowCondensed-600-latin-ext.woff2",
  "./fonts/BarlowCondensed-600-latin.woff2",
  "./fonts/BarlowCondensed-700-latin-ext.woff2",
  "./fonts/BarlowCondensed-700-latin.woff2",
  "./fonts/DMSans-latin-ext.woff2",
  "./fonts/DMSans-latin.woff2",
  "./fonts/fonts.css",
  "./icons/apple-touch-icon.png",
  "./icons/cfc-logo.png",
  "./icons/favicon-32.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./manifest.webmanifest",
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Pagina: eerst netwerk (updates), anders cache. Rest: eerst cache.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put('./', copy)); return r; })
      .catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
