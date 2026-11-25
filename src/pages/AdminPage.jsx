import { useEffect, useMemo, useState } from 'react'
import { menu as seedMenu } from '../data/site.js'
import Pagination from '../components/Pagination.jsx'

const DISHES_PER_PAGE = 6
const REQUESTS_PER_PAGE = 10

const statusNames = { request: 'Заявка', order: 'Заказ', done: 'Завершено' }
const idFor = (name) => name.toLocaleLowerCase('ru-RU').replace(/[^a-zа-я0-9]+/gi, '-').replace(/^-|-$/g, '') || crypto.randomUUID()
const clone = (value) => JSON.parse(JSON.stringify(value))

async function api(url, options = {}) {
  const response = await fetch(url, { credentials: 'same-origin', ...options })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Ошибка соединения с сервером.')
  return data
}

function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('')
    try { await api('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); onLogin() }
    catch (e) { setError(e.message) }
    finally { setBusy(false) }
  }
  return <main className="admin-login"><form className="admin-login__card" onSubmit={submit}>
    <a className="admin-back" href="/">← На сайт</a><span className="admin-kicker">Управление сайтом</span>
    <h1>Админ-панель</h1><p>Войди, чтобы редактировать меню и смотреть заявки.</p>
    <label>Пароль<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
    {error && <div className="admin-error">{error}</div>}<button className="btn" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button>
  </form></main>
}

function DishEditor({ groups, setGroups, onSave, saving }) {
  const [selected, setSelected] = useState(0)
  const [page, setPage] = useState(1)
  const [busyImage, setBusyImage] = useState(false)
  const [message, setMessage] = useState('')
  const dishes = groups[selected]?.items || []
  const totalPages = Math.ceil(dishes.length / DISHES_PER_PAGE)
  const pageStart = (page - 1) * DISHES_PER_PAGE
  const visibleDishes = dishes.slice(pageStart, pageStart + DISHES_PER_PAGE)
  useEffect(() => { setPage((current) => Math.min(current, Math.max(1, totalPages))) }, [totalPages])
  function changeDish(index, key, value) {
    const next = clone(groups); const dish = next[selected].items[index]
    const previousId = dish.id
    const renamedId = key === 'name' && previousId === idFor(dish.name) ? idFor(value) : previousId
    // Одна позиция может отображаться в нескольких категориях, как в исходном меню.
    for (const group of next) for (const item of group.items) if (item.id === previousId) {
      item[key] = value
      if (renamedId !== previousId) item.id = renamedId
    }
    setGroups(next)
  }
  function addDish() {
    const next = clone(groups); next[selected].items.push({ id: crypto.randomUUID(), name: '', text: '', ingredients: '', price: 0, weight: '', badge: '', photo: null }); setGroups(next); setPage(Math.ceil(next[selected].items.length / DISHES_PER_PAGE))
  }
  function removeDish(index) {
    const dish = dishes[index]; setGroups(groups.map((group) => ({ ...group, items: group.items.filter((item) => item.id !== dish.id) })))
  }
  async function upload(index, file) {
    if (!file) return
    setBusyImage(true); setMessage('Конвертируем фото в WebP…')
    try {
      const form = new FormData(); form.append('photo', file)
      const { url } = await api('/api/admin/upload', { method: 'POST', body: form })
      changeDish(index, 'photo', url); setMessage('Фото готово: загружено в WebP.')
    } catch (e) { setMessage(e.message) }
    finally { setBusyImage(false) }
  }
  return <section className="admin-panel">
    <div className="admin-section-head"><div><span className="admin-kicker">Каталог</span><h2>Блюда меню</h2></div><button className="admin-button admin-button--bright" onClick={addDish}>＋ Добавить блюдо</button></div>
    <div className="admin-tabs">{groups.map((group, index) => <button key={group.id} className={selected === index ? 'is-active' : ''} onClick={() => { setSelected(index); setPage(1) }}>{group.title}</button>)}</div>
    <div className="admin-dishes">{visibleDishes.map((item, index) => { const dishIndex = pageStart + index; return <article className="admin-dish" key={item.id}>
      <label className="admin-photo">{item.photo ? <img src={item.photo} alt="" /> : <span>＋<small>Фото</small></span>}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(e) => upload(dishIndex, e.target.files?.[0])} disabled={busyImage} /></label>
      <div className="admin-dish__fields">
        <label>Название<input value={item.name} onChange={(e) => changeDish(dishIndex, 'name', e.target.value)} /></label>
        <label>Описание<input value={item.text || ''} onChange={(e) => changeDish(dishIndex, 'text', e.target.value)} /></label>
        <label>Состав<input value={item.ingredients || ''} onChange={(e) => changeDish(dishIndex, 'ingredients', e.target.value)} placeholder="Например: свинина, лук, специи" /></label>
        <div className="admin-inline-fields"><label>Цена, ₽<input type="number" min="0" value={item.price} onChange={(e) => changeDish(dishIndex, 'price', Number(e.target.value))} /></label><label>Вес<input value={item.weight || ''} onChange={(e) => changeDish(dishIndex, 'weight', e.target.value)} /></label><label>Метка<select value={item.badge || ''} onChange={(e) => changeDish(dishIndex, 'badge', e.target.value)}><option value="">Нет</option><option value="hit">Хит</option><option value="new">Новинка</option></select></label></div>
      </div><button className="admin-delete" onClick={() => removeDish(dishIndex)} aria-label={`Удалить ${item.name || 'блюдо'}`}>×</button>
    </article>})}</div>
    {dishes.length > 0 && <div className="admin-list-meta">Показано {pageStart + 1}–{Math.min(pageStart + DISHES_PER_PAGE, dishes.length)} из {dishes.length} блюд</div>}
    <Pagination page={page} totalPages={totalPages} onChange={setPage} label="Страницы блюд" />
    <div className="admin-save-row"><span>{message || 'Фотографии автоматически уменьшаются и сохраняются в WebP.'}</span><button className="btn" onClick={onSave} disabled={saving || busyImage}>{saving ? 'Сохраняем…' : 'Сохранить меню'}</button></div>
  </section>
}

function RequestStats({ requests, setRequests }) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(requests.length / REQUESTS_PER_PAGE)
  const pageStart = (page - 1) * REQUESTS_PER_PAGE
  const visibleRequests = requests.slice(pageStart, pageStart + REQUESTS_PER_PAGE)
  useEffect(() => { setPage((current) => Math.min(current, Math.max(1, totalPages))) }, [totalPages])
  const stats = useMemo(() => {
    const month = new Date(); const monthRows = requests.filter((r) => { const d = new Date(r.createdAt); return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear() })
    return { total: monthRows.length, orders: monthRows.filter((r) => r.status === 'order' || r.status === 'done').length, new: requests.filter((r) => r.status === 'request').length }
  }, [requests])
  async function setStatus(row, status) {
    try { const updated = await api(`/api/admin/requests/${row.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }); setRequests((old) => old.map((r) => r.id === row.id ? updated : r)) }
    catch (e) { window.alert(e.message) }
  }
  return <section className="admin-panel">
    <div className="admin-section-head"><div><span className="admin-kicker">Заказы и обращения</span><h2>Заказы и заявки</h2></div><span className="admin-period">За текущий месяц</span></div>
    <div className="admin-stats"><article><span>Всего заказов и заявок</span><strong>{stats.total}</strong></article><article><span>Подтверждено заказов</span><strong>{stats.orders}</strong></article><article><span>Ожидают ответа</span><strong>{stats.new}</strong></article></div>
    <div className="admin-request-list">{requests.length ? visibleRequests.map((row) => <article className="admin-request" key={row.id}><div><strong>{row.type === 'order' ? `Заказ · ${row.name}` : row.name}</strong><a href={`tel:${row.phone.replace(/[^+\d]/g, '')}`}>{row.phone}</a><span>{row.dish || 'Без выбранного блюда'}{row.address ? ` · Доставка: ${row.address}` : ''}{row.note ? ` · ${row.note}` : ''}{row.subtotal != null ? ` · ${Number(row.subtotal).toLocaleString('ru-RU')} ₽ за блюда` : ''}{row.type === 'order' ? ' · Оплата картой через терминал курьера' : ''}</span></div><time>{new Date(row.createdAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })}</time><select aria-label="Статус заказа или заявки" value={row.status} onChange={(e) => setStatus(row, e.target.value)}>{Object.entries(statusNames).map(([key, title]) => <option value={key} key={key}>{title}</option>)}</select></article>) : <p className="admin-empty">Заказов и заявок пока нет. Новые обращения с сайта появятся здесь.</p>}</div>
    {requests.length > 0 && <div className="admin-list-meta">Показано {pageStart + 1}–{Math.min(pageStart + REQUESTS_PER_PAGE, requests.length)} из {requests.length} заявок</div>}
    <Pagination page={page} totalPages={totalPages} onChange={setPage} label="Страницы заявок" />
    <p className="admin-footnote">Здесь отображаются заказы с сайта и заявки на обратный звонок. Стоимость доставки оператор подтверждает отдельно.</p>
  </section>
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const [requests, setRequests] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { api('/api/admin/session').then(() => setAuthenticated(true)).catch(() => {}).finally(() => setLoading(false)) }, [])
  useEffect(() => {
    if (!authenticated) return
    Promise.all([api('/api/admin/menu'), api('/api/admin/requests')]).then(([savedMenu, savedRequests]) => { setGroups(savedMenu || clone(seedMenu).map((g) => ({ ...g, items: g.items.map((item) => ({ ...item, id: idFor(item.name), ingredients: item.ingredients || '' })) }))); setRequests(savedRequests) }).catch((e) => setError(e.message))
  }, [authenticated])
  async function saveMenu() {
    setSaving(true); setError('')
    try { await api('/api/admin/menu', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(groups) }); setError('Меню сохранено.') }
    catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }
  async function logout() { await api('/api/admin/logout', { method: 'POST' }).catch(() => {}); setAuthenticated(false) }
  if (loading) return <main className="admin-login"><span>Загружаем панель…</span></main>
  if (!authenticated) return <Login onLogin={() => setAuthenticated(true)} />
  return <main className="admin-page"><div className="admin-container">
    <header className="admin-top"><div><a className="admin-back" href="/">← На сайт</a><span className="admin-kicker">Хочу Шашлык</span><h1>Админ-панель</h1></div><button className="admin-button" onClick={logout}>Выйти</button></header>
    {error && <div className="admin-notice">{error}</div>}
    {groups.length ? <DishEditor groups={groups} setGroups={setGroups} onSave={saveMenu} saving={saving} /> : <div className="admin-panel">Подключаем меню…</div>}
    <RequestStats requests={requests} setRequests={setRequests} />
  </div></main>
}
