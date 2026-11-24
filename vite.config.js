import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        menu: resolve(import.meta.dirname, 'menu.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        promos: resolve(import.meta.dirname, 'promos.html'),
      },
    },
  },
})
