import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Lets the frontend call /api/... directly in dev without CORS headaches,
      // in addition to the VITE_API_URL-based axios baseURL.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
