import { readFile, readdir, writeFile } from 'node:fs/promises'
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
  { file: '404.html', module: '/src/pages/NotFoundPage.jsx' },
]

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

let initialMenu
try {
  const savedMenu = await readFile(path.join(root, 'server', 'data', 'menu.json'), 'utf8')
  const parsedMenu = JSON.parse(savedMenu)
  if (Array.isArray(parsedMenu) && parsedMenu.length) initialMenu = parsedMenu
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}

try {
  for (const page of pages) {
    const { default: Component } = await vite.ssrLoadModule(page.module)
    const props = ['index.html', 'menu.html'].includes(page.file) ? { initialMenu } : {}
    const markup = renderToString(React.createElement(Component, props))
    const htmlPath = path.join(root, 'dist', page.file)
    const html = await readFile(htmlPath, 'utf8')
    const menuData = props.initialMenu ? `<script>window.__HS_MENU__=${JSON.stringify(props.initialMenu).replace(/</g, '\\u003c')}</script>` : ''
    const assets = await readdir(path.join(root, 'dist', 'assets'))
    const fixedMarkup = markup.replace(/\/src\/assets\/([^"']+)/g, (sourcePath, filename) => {
      const extension = path.extname(filename)
      const stem = path.basename(filename, extension)
      const builtAsset = assets.find((asset) => asset.startsWith(`${stem}-`) && path.extname(asset) === extension)
      return builtAsset ? `/assets/${builtAsset}` : sourcePath
    })
    const updated = html.replace('<div id="root"></div>', `<div id="root">${fixedMarkup}</div>`).replace('</body>', `${menuData}</body>`)
    if (updated === html) throw new Error(`Could not find the root element in dist/${page.file}`)
    await writeFile(htmlPath, updated)
  }
} finally {
  await vite.close()
}
