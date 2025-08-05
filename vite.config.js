import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // Ensures relative paths
  build: {
    outDir: 'build', // Azure prefers 'build' over 'dist'
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Only applies in dev
    },
  },
})
