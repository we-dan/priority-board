import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// ES module compatibility - __dirname is not available in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    // HMR configuration for WebContainer environment
    hmr: {
      // Use polling for file change detection in WebContainer
      protocol: 'ws',
      timeout: 30000,
    },
    // Watch configuration optimized for WebContainer
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
});