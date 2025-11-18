import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',   // ← use your custom SW
      srcDir: 'src',                  // directory where your SW lives
      filename: 'service-worker.js',  // SW output name
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
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'], // only cache essential assets
      },
    }),
  ],
  build: {
    minify: 'esbuild', // optional, Vite build is faster and lighter
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    strictPort: true,
    allowedHosts: ['bore.pub', 'rush-ship-chronicle-only.trycloudflare.com', 'localhost'],
    hmr: { protocol: 'ws', host: 'localhost' },
  },
});
