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
      // Configure for Vercel deployment
      base: '/',
      build: {
              outDir: 'dist',
              assetsDir: 'assets',
              sourcemap: false,
              minify: 'esbuild',
              cssMinify: true,
              rollupOptions: {
                        output: {
                                    manualChunks: {
                                                  vendor: ['react', 'react-dom'],
                                                  ui: ['lucide-react']
                                    }
                        }
              },
              esbuild: {
                        drop: ['console', 'debugger']
              }
      },
      server: {
              host: '0.0.0.0',
              port: 5173
      }
})
