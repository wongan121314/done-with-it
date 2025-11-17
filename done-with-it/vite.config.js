// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // listen on all interfaces
    port: 8000,
    strictPort: true,      // ensures Vite fails if 8000 is taken
    allowedHosts: 'all',   // allow any host (Bore, Cloudflared, etc.)
    hmr: {
      protocol: 'ws',      // use websocket for hot reload
      host: 'localhost',   // HMR connects through localhost
    },
  },
});
