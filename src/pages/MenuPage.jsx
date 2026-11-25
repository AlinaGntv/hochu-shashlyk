import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header.jsx'
import { Footer } from '../components/Sections.jsx'
import { site } from '../data/site.js'
import useMenu from '../hooks/useMenu.js'
import { Icon, Photo } from '../components/ui.jsx'
import Pagination from '../components/Pagination.jsx'

const PRODUCTS_PER_PAGE = 9

const BADGES = { hit: 'Хит', new: 'Новинка' }

function dishCount(count) {
  const lastTwo = count % 100
  const last = count % 10
  if (last === 1 && lastTwo !== 11) return `${count} блюдо`
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} блюда`
  return `${count} блюд`
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4.3 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ProductCard({ item, index, onOrder }) {
  return (
    <article
      className="catalog-card"
      style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
    >
      <div className="catalog-card__photo">
        <Photo src={item.photo} alt={item.name.toLowerCase()} />
        {item.badge && (
          <span className={`badge badge--${item.badge}`}>{BADGES[item.badge]}</span>
        )}
      </div>
      <div className="catalog-card__body">
        <div className="catalog-card__details">
          <h3>{item.name}</h3>
          <p>{item.text}{item.ingredients && <span className="catalog-card__ingredients">Состав: {item.ingredients}</span>}</p>
        </div>
        <div className="catalog-card__foot">
          <div>
            <strong>{item.price.toLocaleString('ru-RU')} ₽</strong>
            <span>{item.weight}</span>
          </div>
          <button className="catalog-card__order" type="button" onClick={() => onOrder(item.name)} aria-label={`Заказать: ${item.name}`}>
            Заказать <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export default function MenuPage() {
  const menu = useMenu()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('popular')
  const [page, setPage] = useState(1)
  const [requestDish, setRequestDish] = useState('')
  const [requestStatus, setRequestStatus] = useState('')
  const [requestBusy, setRequestBusy] = useState(false)

  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru-RU')
    const uniqueItems = new Map()
    menu
      .filter((group) => category === 'all' || group.id === category)
      .forEach((group) => {
        group.items.forEach((item) => {
          const previous = uniqueItems.get(item.name)
          if (!previous || (previous.category === 'Новинки' && group.id !== 'new')) {
            uniqueItems.set(item.name, { ...item, category: group.title })
          }
        })
      })
    const source = [...uniqueItems.values()].filter((item) =>
        `${item.name} ${item.text} ${item.category}`.toLocaleLowerCase('ru-RU').includes(normalizedQuery),
      )

    if (sort === 'price-up') return source.sort((a, b) => a.price - b.price)
    if (sort === 'price-down') return source.sort((a, b) => b.price - a.price)
    return source.sort((a, b) => Number(b.badge === 'hit') - Number(a.badge === 'hit'))
  }, [category, query, sort])
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const pageStart = (page - 1) * PRODUCTS_PER_PAGE
  const visibleProducts = products.slice(pageStart, pageStart + PRODUCTS_PER_PAGE)
  useEffect(() => { setPage((current) => Math.min(current, Math.max(1, totalPages))) }, [totalPages])

  return (
    <>
      <Header />
      <main className="catalog-page" id="top">
        <div className="catalog-page__glow" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a href="/#top">Главная</a>
            <span aria-hidden="true">/</span>
            <span>Меню</span>
          </nav>

          <section className="catalog-intro" aria-labelledby="catalog-title">
            <div className="catalog-intro__copy">
              <span className="catalog-eyebrow"><i /> С мангала — с жаром</span>
              <h1 id="catalog-title">Меню<span>.</span></h1>
              <p>Мясо, рыба и овощи на углях. Выбирай любимое — приготовим прямо к заказу.</p>
            </div>
            <a className="catalog-call" href={site.phoneHref}>
              <span className="catalog-call__icon"><Icon name="phone" size={22} /></span>
              <span><small>Заказ по телефону</small><strong>{site.phone}</strong></span>
              <Icon name="arrowRight" size={18} />
            </a>
          </section>

          <section className="catalog-controls" aria-label="Поиск и фильтры меню">
            <div className="category-pills" role="group" aria-label="Категории блюд">
              <button
                type="button"
                className={category === 'all' ? 'is-active' : ''}
                aria-pressed={category === 'all'}
                onClick={() => { setCategory('all'); setPage(1) }}
              >
                Всё меню
              </button>
              {menu.map((group) => (
                <button
                  type="button"
                  key={group.id}
                  className={category === group.id ? 'is-active' : ''}
                  aria-pressed={category === group.id}
                  onClick={() => { setCategory(group.id); setPage(1) }}
                >
                  {group.title}
                </button>
              ))}
            </div>

            <div className="catalog-tools">
              <label className="catalog-search">
                <SearchIcon />
                <span className="visually-hidden">Найти блюдо</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); setPage(1) }}
                  placeholder="Найти блюдо"
                />
              </label>
              <label className="catalog-sort">
                <span>Сортировка</span>
                <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1) }}>
                  <option value="popular">Сначала популярное</option>
                  <option value="price-up">Сначала дешевле</option>
                  <option value="price-down">Сначала дороже</option>
                </select>
              </label>
            </div>
          </section>

          <section className="catalog-results" aria-live="polite" aria-label="Блюда меню">
            <div className="catalog-results__heading">
              <h2>{category === 'all' ? 'Всё самое вкусное' : menu.find((group) => group.id === category)?.title}</h2>
              <span>{dishCount(products.length)}</span>
            </div>

            {products.length ? (
              <>
                <div className="catalog-grid">
                  {visibleProducts.map((item, index) => (
                    <ProductCard key={`${item.category}-${item.name}`} item={item} index={index} onOrder={setRequestDish} />
                  ))}
                </div>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} label="Страницы меню" />
              </>
            ) : (
              <div className="catalog-empty">
                <Icon name="flame" size={28} />
                <h3>Такого блюда пока не нашли</h3>
                <p>Попробуй изменить запрос или выбрать другую категорию.</p>
                <button type="button" onClick={() => { setQuery(''); setCategory('all'); setPage(1) }}>Сбросить фильтры</button>
              </div>
            )}
          </section>

          <aside className="catalog-note">
            <span className="catalog-note__spark"><Icon name="flameFill" size={19} /></span>
            <p>Все блюда готовим после заказа. <strong>Вес и цена указаны в меню.</strong></p>
            <a href={site.phoneHref}>Позвонить <Icon name="arrowRight" size={15} /></a>
          </aside>
        </div>
      </main>
      {requestDish && <div className="request-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) { setRequestDish(''); setRequestStatus('') } }}><form className="request-dialog" onSubmit={async (e) => {
        e.preventDefault(); setRequestBusy(true); setRequestStatus('')
        const formElement = e.currentTarget
        const form = new FormData(formElement)
        try { const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), dish: requestDish, note: form.get('note'), consent: form.get('consent') === 'on' }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Не удалось отправить заявку.'); setRequestStatus('Заявка отправлена! Мы скоро позвоним.'); formElement.reset() }
        catch (error) { setRequestStatus(error.message) }
        finally { setRequestBusy(false) }
      }}>
        <button type="button" className="request-dialog__close" onClick={() => { setRequestDish(''); setRequestStatus('') }} aria-label="Закрыть">×</button>
        <span className="catalog-eyebrow"><i /> Заказ</span><h2>Оставить заявку</h2><p>Вы выбрали: <strong>{requestDish}</strong>. Оставь номер — мы уточним детали по телефону.</p>
        <label>Как к вам обращаться<input name="name" autoComplete="name" required minLength="2" placeholder="Ваше имя" /></label>
        <label>Номер телефона<input name="phone" autoComplete="tel" type="tel" required placeholder="+7 (___) ___-__-__" /></label>
        <label>Комментарий <textarea name="note" rows="3" placeholder="Количество порций, время самовывоза…" /></label>
        <label className="request-consent"><input type="checkbox" name="consent" required /><span>Я даю отдельное согласие на обработку персональных данных. <a href="/personal-data-consent.html" target="_blank" rel="noreferrer">Прочитать текст согласия</a>.</span></label>
        <p className="request-privacy-note">Политика обработки персональных данных: <a href="/privacy.html" target="_blank" rel="noreferrer">ознакомиться</a>.</p>
        {requestStatus && <div className="request-status" role="status">{requestStatus}</div>}
        <button className="btn" disabled={requestBusy}>{requestBusy ? 'Отправляем…' : 'Отправить заявку'}</button>
      </form></div>}
      <Footer />
    </>
  )
}
