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
        contacts: resolve(import.meta.dirname, 'contacts.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
        privacy: resolve(import.meta.dirname, 'privacy.html'),
        consent: resolve(import.meta.dirname, 'personal-data-consent.html'),
        orderDelivery: resolve(import.meta.dirname, 'order-delivery.html'),
        requisites: resolve(import.meta.dirname, 'requisites.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
