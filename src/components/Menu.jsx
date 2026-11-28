import { useCallback, useEffect, useRef, useState } from 'react'
import useMenu from '../hooks/useMenu.js'
import { Icon } from './ui.jsx'
import PhotoGallery from './PhotoGallery.jsx'
import { useCart } from '../context/CartContext.jsx'

const BADGES = { hit: 'Хит', new: 'New' }

export default function Menu({ initialMenu } = {}) {
  const menu = useMenu(initialMenu)
  const cart = useCart()
  const [tab, setTab] = useState(menu[0].id)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const track = useRef(null)
  const items = menu.find((c) => c.id === tab)?.items || []

  useEffect(() => { if (!menu.some((group) => group.id === tab)) setTab(menu[0].id) }, [menu, tab])

  const getMetrics = () => {
    const el = track.current
    const card = el?.querySelector('.card')
    if (!el || !card) return { pageCount: 1, pageSize: 1, step: 0 }
    const gap = Number.parseFloat(window.getComputedStyle(el).columnGap) || 0
    const step = card.getBoundingClientRect().width + gap
    const pageSize = Math.max(1, Math.floor((el.clientWidth + gap) / step))
    return { pageCount: Math.max(1, Math.ceil(items.length / pageSize)), pageSize, step }
  }

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    const { pageCount, pageSize, step } = getMetrics()
    setPages(pageCount)
    setPage(step ? Math.min(pageCount - 1, Math.round(el.scrollLeft / (step * pageSize))) : 0)
  }, [items.length])

  useEffect(() => {
    if (track.current) track.current.scrollLeft = 0
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [tab, measure])

  const scrollToPage = (p) => {
    const el = track.current
    const { pageSize, step } = getMetrics()
    el.scrollTo({ left: p * pageSize * step, behavior: 'smooth' })
  }

  return (
    <section className="menu section" id="menu">
      <div className="container">
        <div className="menu__head">
          <div className="tabs" role="tablist" aria-label="Категории меню">
            {menu.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={c.id === tab}
                className={c.id === tab ? 'is-active' : ''}
                onClick={() => setTab(c.id)}
              >
                {c.title}
              </button>
            ))}
          </div>
          <a className="link-more" href="/menu">
            Всё меню <Icon name="arrowRight" size={16} />
          </a>
        </div>

        {items.length ? <div className="carousel">
          <button
            className="carousel__arrow carousel__arrow--prev"
            onClick={() => scrollToPage(page - 1)}
            disabled={page === 0}
            aria-label="Назад"
          >
            <Icon name="chevronLeft" size={20} />
          </button>

          <ul className="carousel__track" ref={track} onScroll={measure}>
            {items.map((item) => (
              <li className="card" key={item.name}>
                <div className="card__photo">
                  <PhotoGallery item={item} alt={item.name.toLowerCase()} />
                  {item.badge && (
                    <span className={`badge badge--${item.badge}`}>{BADGES[item.badge]}</span>
                  )}
                </div>
                <div className="card__body">
                  <h3>{item.name}</h3>
                  <p>{item.text}{item.ingredients && <span className="card__ingredients">Состав: {item.ingredients}</span>}</p>
                  <div className="card__foot">
                    <span className="card__price">{item.price.toLocaleString('ru-RU')} ₽</span>
                    <span className="card__weight">{item.weight}</span>
                    <button className="card__add" onClick={() => cart.addItem(item)} aria-label={`Добавить «${item.name}»`}>
                      <Icon name="plus" size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            className="carousel__arrow carousel__arrow--next"
            onClick={() => scrollToPage(page + 1)}
            disabled={page >= pages - 1}
            aria-label="Вперёд"
          >
            <Icon name="chevronRight" size={20} />
          </button>
        </div> : (
          <div className="menu-empty">
            <Icon name="flame" size={24} />
            <div><strong>Раздел «Хлеб и выпечка» скоро пополнится</strong><p>Добавим сюда армянский лаваш, лепёшки, хачапури и другие позиции.</p></div>
          </div>
        )}

        {pages > 1 && (
          <div className="dots">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                className={i === page ? 'is-active' : ''}
                onClick={() => scrollToPage(i)}
                aria-label={`Страница ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
