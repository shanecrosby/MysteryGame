import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Default Vite port
    strictPort: false, // Use next available port if 5173 is taken
    // Allow requests from Nginx proxy manager
    allowedHosts: [
      'webdev.shanecrosby.com',
      '.shanecrosby.com', // Allow all subdomains
      'localhost'
    ],
    cors: true,
    // Configure allowed origins for proxied requests
    proxy: {
      // Add any API proxy configurations if needed
    },
    // WebSocket configuration for HMR through proxy
    hmr: {
      host: 'webdev.shanecrosby.com', // Use your domain for HMR
      protocol: 'wss', // Use secure websocket for HTTPS
      clientPort: 443 // If using SSL through nginx, otherwise use 80
    }
  }
})
