import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/figma-api': {
        target: 'https://api.figma.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/figma-api/, ''),
      },
    },
  },
  preview: {
    proxy: {
      '/figma-api': {
        target: 'https://api.figma.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/figma-api/, ''),
      },
    },
  },
});
