const CACHE_NAME = 'python-code-lab-v8';
const APP_SHELL = [
  './pythoncopy.html',
  './pythoncopy.css',
  './pythoncopy.js',
  './pythoncopyblocks.js',
  './pythoncopycarousel.html',
  './pythoncopy.webmanifest',
  './python_educator_hero.png',
  './python_blocks_mode.png',
  './python_edit_run_mode.png',
  './python_trace_mode.png',
  './python_variables_trace.png',
  './gist.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (event.request.mode === 'navigate' && requestUrl.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('./pythoncopy.html'))
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(cached => cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }))
  );
});
