import { useCallback, useEffect, useRef, useState } from 'react'
import { menu } from '../data/site.js'
import { Icon, Photo } from './ui.jsx'

const BADGES = { hit: 'Хит', new: 'New' }

export default function Menu() {
  const [tab, setTab] = useState(menu[0].id)
  const [page, setPage] = useState(0)
  const [pages, setPages] = useState(1)
  const track = useRef(null)
  const items = menu.find((c) => c.id === tab).items

  const measure = useCallback(() => {
    const el = track.current
    if (!el) return
    setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)))
    setPage(Math.round(el.scrollLeft / el.clientWidth))
  }, [])

  useEffect(() => {
    track.current.scrollLeft = 0
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [tab, measure])

  const scrollToPage = (p) => {
    const el = track.current
    el.scrollTo({ left: p * el.clientWidth, behavior: 'smooth' })
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
          <a className="link-more" href="/menu.html">
            Всё меню <Icon name="arrowRight" size={16} />
          </a>
        </div>

        <div className="carousel">
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
                  <Photo src={item.photo} alt={item.name.toLowerCase()} />
                  {item.badge && (
                    <span className={`badge badge--${item.badge}`}>{BADGES[item.badge]}</span>
                  )}
                </div>
                <div className="card__body">
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                  <div className="card__foot">
                    <span className="card__price">{item.price.toLocaleString('ru-RU')} ₽</span>
                    <span className="card__weight">{item.weight}</span>
                    <button className="card__add" aria-label={`Добавить «${item.name}»`}>
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
        </div>

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
