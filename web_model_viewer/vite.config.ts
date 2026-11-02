import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base ('./') guarantees GitHub Pages compatibility under both
// https://<user>.github.io/<repo>/ and custom root domains.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8090,
    allowedHosts: true,
  },
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});
