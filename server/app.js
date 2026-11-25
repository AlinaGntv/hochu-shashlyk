import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import multer from 'multer'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const dataDir = process.env.DATA_DIR || path.join(here, 'data')
const uploadsDir = process.env.UPLOADS_DIR || path.join(here, 'uploads')
const menuFile = path.join(dataDir, 'menu.json')
const requestsFile = path.join(dataDir, 'requests.json')
const defaultMenu = JSON.parse(readFileSync(path.join(here, 'default-menu.json'), 'utf8'))
let sessionKey = process.env.ADMIN_PASSWORD || ''
if (!sessionKey) {
  try { sessionKey = readFileSync(path.join(here, '.admin-password'), 'utf8').trim() }
  catch (error) { if (error.code !== 'ENOENT') throw error }
}
const COOKIE = 'hs_admin'
let requestWrites = Promise.resolve()

app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))
app.use('/uploads', express.static(uploadsDir, { maxAge: '30d', immutable: true }))

async function readJson(file, fallback) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')) }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error }
}
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true })
  const temp = `${file}.${process.pid}.tmp`
  await fs.writeFile(temp, JSON.stringify(value, null, 2))
  await fs.rename(temp, file)
}
function token() { return crypto.createHmac('sha256', sessionKey || 'not-configured').update('admin-session').digest('hex') }
function cookieOptions(maxAge) {
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
}
function authorized(req) {
  const cookie = req.headers.cookie?.split(';').map((x) => x.trim()).find((x) => x.startsWith(`${COOKIE}=`))
  const value = cookie?.slice(COOKIE.length + 1) || ''
  const expected = token()
  return value.length === expected.length && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(expected))
}
function requireAdmin(req, res, next) {
  if (!sessionKey) return res.status(503).json({ error: 'Добавьте ADMIN_PASSWORD в переменные окружения сервера.' })
  if (!authorized(req)) return res.status(401).json({ error: 'Нужно войти в админ-панель.' })
  next()
}
const imageUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 12 * 1024 * 1024 }, fileFilter: (_req, file, done) => {
  if (/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype)) done(null, true)
  else done(new Error('Можно загрузить изображение JPG, PNG, WebP или AVIF.'))
} })

app.get('/api/menu', async (_req, res, next) => {
  try { res.json(await readJson(menuFile, defaultMenu)) }
  catch (e) { next(e) }
})
app.post('/api/admin/login', (req, res) => {
  if (!sessionKey) return res.status(503).json({ error: 'Администратор ещё не настроен на сервере.' })
  const pass = typeof req.body?.password === 'string' ? req.body.password : ''
  const a = Buffer.from(pass); const b = Buffer.from(sessionKey)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Неверный пароль.' })
  res.setHeader('Set-Cookie', `${COOKIE}=${token()}; ${cookieOptions(60 * 60 * 24 * 7)}`)
  res.json({ ok: true })
})
app.post('/api/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieOptions(0)}`)
  res.json({ ok: true })
})
app.get('/api/admin/session', requireAdmin, (_req, res) => res.json({ ok: true }))
app.get('/api/admin/menu', requireAdmin, async (_req, res, next) => {
  try { res.json(await readJson(menuFile, null)) }
  catch (e) { next(e) }
})
app.put('/api/admin/menu', requireAdmin, async (req, res, next) => {
  try {
    const groups = req.body
    if (!Array.isArray(groups) || groups.some((g) => !g.id || !g.title || !Array.isArray(g.items))) return res.status(400).json({ error: 'Проверьте категории меню.' })
    for (const group of groups) for (const item of group.items) {
      if (!item.id || !item.name?.trim() || !Number.isFinite(Number(item.price)) || Number(item.price) < 0) return res.status(400).json({ error: 'У каждого блюда должны быть название и цена.' })
      item.name = item.name.trim(); item.text = String(item.text || '').trim(); item.ingredients = String(item.ingredients || '').trim()
      item.price = Number(item.price); item.weight = String(item.weight || '').trim()
    }
    await writeJson(menuFile, groups)
    res.json({ ok: true })
  } catch (e) { next(e) }
})
app.post('/api/admin/upload', requireAdmin, imageUpload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Выберите изображение.' })
    await fs.mkdir(uploadsDir, { recursive: true })
    const filename = `${crypto.randomUUID()}.webp`
    await sharp(req.file.buffer).rotate().resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(path.join(uploadsDir, filename))
    res.json({ url: `/uploads/${filename}` })
  } catch (e) { next(e) }
})
app.post('/api/requests', async (req, res, next) => {
  try {
    if (req.body?.consent !== true) return res.status(400).json({ error: 'Для отправки заявки необходимо дать согласие на обработку персональных данных.' })
    const name = String(req.body?.name || '').trim().slice(0, 80)
    const phone = String(req.body?.phone || '').trim().slice(0, 40)
    if (name.length < 2 || phone.replace(/\D/g, '').length < 10) return res.status(400).json({ error: 'Проверьте имя и номер телефона.' })
    const operation = requestWrites.then(async () => {
      const requests = await readJson(requestsFile, [])
      requests.unshift({ id: crypto.randomUUID(), name, phone, dish: String(req.body?.dish || '').trim().slice(0, 120), note: String(req.body?.note || '').trim().slice(0, 500), consentGiven: true, consentVersion: '2026-11-25', consentAt: new Date().toISOString(), status: 'request', createdAt: new Date().toISOString() })
      await writeJson(requestsFile, requests.slice(0, 2000))
    })
    requestWrites = operation.catch(() => {})
    await operation
    res.status(201).json({ ok: true })
  } catch (e) { next(e) }
})
app.post('/api/orders', async (req, res, next) => {
  try {
    if (req.body?.consent !== true) return res.status(400).json({ error: 'Для оформления заказа необходимо дать согласие на обработку персональных данных.' })
    const name = String(req.body?.name || '').trim().slice(0, 80)
    const phone = String(req.body?.phone || '').trim().slice(0, 40)
    const address = String(req.body?.address || '').trim().slice(0, 250)
    const note = String(req.body?.note || '').trim().slice(0, 500)
    if (name.length < 2 || phone.replace(/\D/g, '').length < 10 || address.length < 5) return res.status(400).json({ error: 'Проверьте имя, телефон и адрес доставки.' })
    if (!Array.isArray(req.body?.items) || req.body.items.length < 1 || req.body.items.length > 50) return res.status(400).json({ error: 'Корзина пуста или содержит слишком много позиций.' })

    const groups = await readJson(menuFile, defaultMenu)
    const catalog = new Map()
    for (const group of groups) for (const item of group.items || []) catalog.set(String(item.id || item.name.trim().toLocaleLowerCase('ru-RU').replace(/[^a-zа-я0-9]+/gi, '-')), item)
    const quantities = new Map()
    for (const line of req.body.items) {
      const id = String(line?.id || '')
      const quantity = Number(line?.quantity)
      if (!catalog.has(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return res.status(400).json({ error: 'Некоторые блюда уже изменились. Обновите меню и проверьте корзину.' })
      quantities.set(id, (quantities.get(id) || 0) + quantity)
      if (quantities.get(id) > 50) return res.status(400).json({ error: 'Количество одного блюда не может превышать 50.' })
    }
    const items = [...quantities].map(([id, quantity]) => {
      const dish = catalog.get(id)
      const price = Number(dish.price)
      return { id, name: String(dish.name).slice(0, 120), quantity, unitPrice: price, weight: String(dish.weight || '').slice(0, 40), lineTotal: price * quantity }
    })
    if (items.some((item) => !Number.isFinite(item.unitPrice) || item.unitPrice < 0)) return res.status(503).json({ error: 'Не удалось проверить цены. Позвоните, пожалуйста, для заказа.' })
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0)
    const orderId = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const order = { id: orderId, type: 'order', name, phone, address, note, items, dish: items.map((item) => `${item.name} × ${item.quantity}`).join(', '), subtotal, deliveryFee: null, total: subtotal, paymentMethod: 'courier_terminal', consentGiven: true, consentVersion: '2026-11-25-delivery-v2', consentAt: createdAt, status: 'request', createdAt }
    const operation = requestWrites.then(async () => {
      const requests = await readJson(requestsFile, [])
      requests.unshift(order)
      await writeJson(requestsFile, requests.slice(0, 2000))
    })
    requestWrites = operation.catch(() => {})
    await operation
    res.status(201).json({ ok: true, orderId, total: subtotal })
  } catch (e) { next(e) }
})
app.get('/api/admin/requests', requireAdmin, async (_req, res, next) => {
  try { res.json(await readJson(requestsFile, [])) }
  catch (e) { next(e) }
})
app.patch('/api/admin/requests/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!['request', 'order', 'done'].includes(req.body?.status)) return res.status(400).json({ error: 'Неизвестный статус.' })
    const requests = await readJson(requestsFile, [])
    const row = requests.find((item) => item.id === req.params.id)
    if (!row) return res.status(404).json({ error: 'Заявка не найдена.' })
    row.status = req.body.status
    await writeJson(requestsFile, requests)
    res.json(row)
  } catch (e) { next(e) }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  const status = error instanceof multer.MulterError ? 400 : 500
  res.status(status).json({ error: status === 400 ? error.message : 'Не удалось выполнить запрос. Попробуйте ещё раз.' })
})

if (process.env.PORT) app.listen(Number(process.env.PORT))
else app.listen()
