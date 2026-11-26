import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const vite = await createServer({ root, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
try {
  const { menu } = await vite.ssrLoadModule('/src/data/site.js')
  const defaultMenu = menu.map((group) => ({ ...group, items: group.items.map((item) => ({
    ...item,
    id: item.id || item.name.trim().toLocaleLowerCase('ru-RU').replace(/[^a-zа-я0-9]+/gi, '-'),
    photo: item.photo && !item.photo.startsWith('/src/') ? item.photo : null,
    photos: Array.isArray(item.photos) ? [...new Set(item.photos.filter((photo) => typeof photo === 'string' && photo.startsWith('/images/')))] : [],
  })) }))
  await mkdir(path.join(root, 'server'), { recursive: true })
  await writeFile(path.join(root, 'server', 'default-menu.json'), `${JSON.stringify(defaultMenu, null, 2)}\n`)
} finally {
  await vite.close()
}
