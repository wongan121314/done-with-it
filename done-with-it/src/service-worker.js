self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated!');
});

self.addEventListener('fetch', (event) => {
  // Example: network first, fallback to cache
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
