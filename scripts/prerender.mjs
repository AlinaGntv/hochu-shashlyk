import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pages = [
  { file: 'index.html', module: '/src/App.jsx' },
  { file: 'menu.html', module: '/src/pages/MenuPage.jsx' },
  { file: 'about.html', module: '/src/pages/AboutPage.jsx' },
  { file: 'promos.html', module: '/src/pages/PromosPage.jsx' },
  { file: 'contacts.html', module: '/src/pages/ContactsPage.jsx' },
]

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

try {
  for (const page of pages) {
    const { default: Component } = await vite.ssrLoadModule(page.module)
    const markup = renderToString(React.createElement(Component))
    const htmlPath = path.join(root, 'dist', page.file)
    const html = await readFile(htmlPath, 'utf8')
    const updated = html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
    if (updated === html) throw new Error(`Could not find the root element in dist/${page.file}`)
    await writeFile(htmlPath, updated)
  }
} finally {
  await vite.close()
}
