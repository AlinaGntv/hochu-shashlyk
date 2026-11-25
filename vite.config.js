import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

const friendlyRoutes = {
  '/menu': '/menu.html',
  '/about': '/about.html',
  '/promo': '/promos.html',
  '/promos': '/promos.html',
  '/contacts': '/contacts.html',
  '/admin': '/admin.html',
  '/privacy': '/privacy.html',
  '/personal-data-consent': '/personal-data-consent.html',
  '/order-delivery': '/order-delivery.html',
  '/requisites': '/requisites.html',
}

function friendlyUrlDevelopment() {
  return {
    name: 'friendly-url-development',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (!request.url) return next()
        const separator = request.url.indexOf('?')
        const pathname = (separator < 0 ? request.url : request.url.slice(0, separator)).replace(/\/$/, '') || '/'
        const html = friendlyRoutes[pathname]
        if (html) request.url = `${html}${separator < 0 ? '' : request.url.slice(separator)}`
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), friendlyUrlDevelopment()],
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
