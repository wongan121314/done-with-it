import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';

// Precache files
precacheAndRoute(self.__WB_MANIFEST);

// Cache API requests (Network First)
registerRoute(
  ({ url }) => url.origin === 'https://localhost:5002',
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 5,
    plugins: []
  })
);

// Cache images & static assets (Cache First)
registerRoute(
  ({ request }) => request.destination === 'image' || request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'assets-cache',
    plugins: []
  })
);
