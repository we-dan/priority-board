import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

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