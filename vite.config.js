import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
          alias: {
                  "@": path.resolve(__dirname, "./src"),
          },
    },
    // Configure for GitHub Pages deployment
    base: process.env.NODE_ENV === 'production' ? '/camp-explorer-europe-2026/' : '/',
    build: {
          outDir: 'dist',
          assetsDir: 'assets',
          sourcemap: false,
          rollupOptions: {
                  output: {
                            manualChunks: {
                                        vendor: ['react', 'react-dom'],
                                        ui: ['lucide-react']
                            }
                  }
          }
    },
    server: {
          host: '0.0.0.0',
          port: 5173
    }
})
