import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',  // SW updates automatically
      strategies: 'generateSW',    // auto-generate SW
      manifest: {
        name: 'TurnWithIt',
        short_name: 'TurnWithIt',
        description: 'Marketplace to buy and sell items',
        start_url: '/',
        display: 'standalone',
        background_color: '#F8F9FA',
        theme_color: '#4CAF50',
        icons: [
          { src: '/icon.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon.png', sizes: '512x512', type: 'image/png' }
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:5002\/api\/.*$/, // your backend API
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 300 } // 5 minutes
            },
          },
          {
            urlPattern: /^\/.*\.(js|css|png|svg|jpg|jpeg|gif|woff2?)$/i, // static assets
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 } // 1 day
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8000,
    strictPort: true,
      allowedHosts: ['bore.pub', 'rush-ship-chronicle-only.trycloudflare.com','localhost'],
    hmr: { protocol: 'ws', host: 'localhost' },
  },
});
