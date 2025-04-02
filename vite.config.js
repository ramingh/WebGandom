import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  base: '/',
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://gis.gandomcs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '/@modules/': resolve(__dirname, 'node_modules')
    }
  },
  optimizeDeps: {
    include: ['jquery', 'bootstrap', 'leaflet']
  }
}); 