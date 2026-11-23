import { useEffect, useState } from 'react'
import { heroSlides } from '../data/site.js'
import { Icon, Photo } from './ui.jsx'

const AUTOPLAY_MS = 7000
const pad = (n) => String(n).padStart(2, '0')

// Искры: позиции фиксированные, чтобы не прыгали между рендерами
const EMBERS = [
  [6, 0, 9], [14, 3, 12], [23, 1, 8], [31, 5, 11], [42, 2, 10], [50, 6, 13],
  [58, 0.5, 9], [66, 4, 12], [74, 2.500, 8], [82, 7, 11], [90, 1.500, 10], [96, 5.500, 13],
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = heroSlides.length
  const slide = heroSlides[index]
  const go = (step) => setIndex((i) => (i + step + total) % total)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS)
    return () => clearTimeout(id)
  }, [index, paused, total])

  return (
    <section
      className="hero"
      id="top"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero__media" key={`m${index}`}>
        <Photo src={slide.photo} alt={slide.title.toLowerCase()} />
      </div>

      <div className="embers" aria-hidden="true">
        {EMBERS.map(([x, delay, dur], i) => (
          <i key={i} style={{ left: `${x}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }} />
        ))}
      </div>

      <div className="container hero__inner">
        <div className="hero__content" key={index}>
          <span className="sticker">{slide.tag}</span>
          <h1 className="hero__title">{slide.title}</h1>
          <span className="sticker sticker--price">{slide.price}</span>
          <p className="hero__text">{slide.text}</p>
          <p className="hero__weight">{slide.weight}</p>
        </div>

        <div className="hero__pager">
          <button onClick={() => go(-1)} aria-label="Предыдущий слайд">
            <Icon name="chevronLeft" size={16} />
          </button>
          <span aria-live="polite">
            {pad(index + 1)} / {pad(total)}
          </span>
          <button onClick={() => go(1)} aria-label="Следующий слайд">
            <Icon name="chevronRight" size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}
