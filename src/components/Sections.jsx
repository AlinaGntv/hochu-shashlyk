import { features, nav, promo, site } from '../data/site.js'
import { Icon, Logo, Photo, Socials } from './ui.jsx'

export function Promo() {
  return (
    <section className="promo" id="sets">
      <div className="promo__media">
        <Photo src={promo.photo} alt="ассорти на компанию" />
      </div>
      <div className="container promo__inner">
        <div className="promo__content">
          <h2 className="promo__title">
            {promo.title}
            <em>{promo.accent}</em>
          </h2>
          <p>{promo.text}</p>
          <a className="btn" href="#menu">
            {promo.button} <Icon name="arrowRight" size={18} />
          </a>
        </div>
        <div className="promo__badge">
          <Icon name="crown" size={30} className="promo__crown" />
          {promo.badge.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Features() {
  return (
    <section className="features" id="about">
      <ul className="container features__list">
        {features.map((f) => (
          <li key={f.text}>
            <Icon name={f.icon} size={34} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

const yandexReviews = [
  {
    author: 'Елена Буракова',
    text: 'Всё очень вкусно, порции большие, всё свежайшее. Очень хороший персонал, внимательные и отзывчивые ребята.',
  },
]

export function Reviews() {
  return (
    <section className="reviews section" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews__head">
          <div>
            <span className="reviews__eyebrow"><i /> Отзывы на Яндекс Картах</span>
            <h2 className="heading" id="reviews-title">Гости о нас</h2>
            <p className="reviews__lead">Настоящие отзывы о «Хочу шашлык» на шоссе Энтузиастов, 36А.</p>
          </div>
          <div className="reviews__rating" aria-label="Рейтинг 4,5 из 5 на Яндекс Картах">
            <strong>4,5</strong><span><b aria-hidden="true">★ из 5</b><small>рейтинг в Яндекс Картах</small></span>
          </div>
        </div>
        <div className="reviews__grid">
          {yandexReviews.map((review) => (
            <article className="review-card" key={review.author}>
              <div className="review-card__source"><span className="review-card__mark">Я</span><span>Яндекс Карты</span></div>
              <blockquote>«{review.text}»</blockquote>
              <span className="review-card__author">{review.author}</span>
            </article>
          ))}
        </div>
        <a className="reviews__link" href={site.reviewsUrl} target="_blank" rel="noreferrer">
          Смотреть отзывы и оставить свой <Icon name="arrowRight" size={17} />
        </a>
      </div>
    </section>
  )
}

// Стилизованная карта-заглушка; по клику открывает Яндекс Карты.
export function MapCard() {
  return (
    <a className="map" href={site.mapUrl} target="_blank" rel="noreferrer" aria-label="Открыть на карте">
      <svg viewBox="0 0 520 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="520" height="260" fill="#141312" />
        <g stroke="#201e1c" strokeWidth="10" fill="none">
          <path d="M-10 60 L540 20M-10 230 L540 190M90 -10 L60 270M400 -10 L440 270M250 -10 L230 110" />
        </g>
        <g stroke="#2e2b28" strokeWidth="5" fill="none">
          <path d="M150 -10 L215 270" />
          <path d="M-10 195 Q200 180 300 150 T540 105" />
        </g>
        <path d="M-10 195 Q200 180 300 150 T540 105" stroke="#3a3531" strokeWidth="1" fill="none" />
        <text x="120" y="172" fill="#b9b3ab" fontSize="15">Балашиха</text>
        <text x="330" y="128" fill="#8d877f" fontSize="10" transform="rotate(-13 330 128)">
          ш. Энтузиастов
        </text>
        <circle cx="268" cy="160" r="5" fill="#ff8a1f" opacity=".5" />
      </svg>
      <span className="map__pin">
        <Icon name="flameFill" size={22} />
      </span>
    </a>
  )
}

export function Contacts() {
  return (
    <section className="contacts section" id="contacts">
      <div className="container contacts__grid">
        <div>
          <h2 className="heading">Контакты</h2>
          <ul className="contacts__list">
            <li>
              <Icon name="pin" size={22} />
              <a href={site.mapUrl} target="_blank" rel="noreferrer">
                {site.address}
              </a>
            </li>
            <li>
              <Icon name="clock" size={22} />
              {site.hours}
            </li>
            <li>
              <Icon name="phone" size={22} />
              <a href={site.phoneHref}>{site.phone}</a>
            </li>
          </ul>
          <Socials variant="square" />
        </div>
        <MapCard />
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <Logo />
        <nav aria-label="Навигация в подвале">
          <h4>Навигация</h4>
          {nav.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <div>
          <h4>Мы в соцсетях</h4>
          <Socials />
        </div>
      </div>
      <p className="container footer__copy">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <a className="footer__credit" href="https://chadmetrix.ru" target="_blank" rel="noreferrer">Разработано в <strong>AVE</strong><span aria-hidden="true"> ↗</span></a>
      </p>
    </footer>
  )
}
