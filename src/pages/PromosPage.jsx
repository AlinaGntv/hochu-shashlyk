import Header from '../components/Header.jsx'
import { Footer } from '../components/Sections.jsx'
import { promo, site } from '../data/site.js'
import { Icon } from '../components/ui.jsx'

const steps = [
  { number: '01', title: 'Собери компанию', text: 'Ассорти рассчитано на компанию от 4 до 14 человек.' },
  { number: '02', title: 'Посмотри меню', text: 'Добавь к большому набору любимые блюда, гарниры и выпечку.' },
  { number: '03', title: 'Уточни детали', text: 'Позвони нам — расскажем о составе, стоимости и заказе.' },
]

function FeastIllustration() {
  return (
    <div className="feast-art" role="img" aria-label="Иллюстрация мясного ассорти на компанию">
      <div className="feast-art__glow" />
      <div className="feast-art__embers" aria-hidden="true">
        {Array.from({ length: 11 }, (_, index) => (
          <i key={index} style={{ left: `${10 + index * 8}%`, animationDelay: `${-index * 0.57}s` }} />
        ))}
      </div>
      <div className="feast-art__plate feast-art__plate--outer" />
      <div className="feast-art__plate feast-art__plate--inner" />
      <div className="feast-art__food feast-art__food--one" />
      <div className="feast-art__food feast-art__food--two" />
      <div className="feast-art__food feast-art__food--three" />
      <div className="feast-art__food feast-art__food--four" />
      <div className="feast-art__sprig feast-art__sprig--one"><Icon name="leaf" size={28} /></div>
      <div className="feast-art__sprig feast-art__sprig--two"><Icon name="leaf" size={22} /></div>
      <div className="feast-art__ribbon">МЯСНОЕ<br /><strong>АССОРТИ</strong></div>
      <div className="feast-art__people"><Icon name="people" size={17} /> {promo.badge.join(' ')}</div>
    </div>
  )
}

export default function PromosPage() {
  return (
    <>
      <Header />
      <main className="offers-page" id="top">
        <div className="offers-page__glow" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a href="/#top">Главная</a>
            <span aria-hidden="true">/</span>
            <span>Акции</span>
          </nav>

          <section className="offers-hero" aria-labelledby="offers-title">
            <div className="offers-hero__copy">
              <span className="catalog-eyebrow"><i /> Когда собираются свои</span>
              <h1 id="offers-title">Повод<br />есть<span>.</span></h1>
              <p>Большие мясные наборы — чтобы за столом хватило места всем и любимому вкусу.</p>
              <a className="btn" href="#company-set">Выбрать набор <Icon name="arrowRight" size={18} /></a>
            </div>
            <div className="offers-hero__stamp" aria-hidden="true">
              <span>БОЛЬШЕ</span><strong>ОГНЯ</strong><span>БОЛЬШЕ СВОИХ</span>
              <Icon name="flameFill" size={28} />
            </div>
          </section>

          <section className="offer-feature" id="company-set" aria-labelledby="offer-title">
            <div className="offer-feature__visual"><FeastIllustration /></div>
            <div className="offer-feature__content">
              <span className="offer-label"><Icon name="crown" size={17} /> Набор для компании</span>
              <h2 id="offer-title">{promo.title}<em>{promo.accent}</em></h2>
              <p>{promo.text}</p>
              <div className="offer-feature__range">
                <div className="offer-range__icon"><Icon name="people" size={25} /></div>
                <div><small>Хватит на компанию</small><strong>{promo.badge[0]} {promo.badge[1]} {promo.badge[2]}</strong></div>
              </div>
              <div className="offer-feature__actions">
                <a className="btn" href={site.phoneHref}>Уточнить состав и цену <Icon name="arrowRight" size={18} /></a>
                <a className="offer-menu-link" href="/menu">Смотреть меню <Icon name="arrowRight" size={16} /></a>
              </div>
              <small className="offer-footnote">Состав и стоимость уточняйте при заказе.</small>
            </div>
          </section>

          <section className="offer-steps" aria-labelledby="offer-steps-title">
            <div className="about-section-heading">
              <span className="catalog-eyebrow"><i /> Просто устроить встречу</span>
              <h2 id="offer-steps-title">Как заказать</h2>
            </div>
            <div className="offer-steps__grid">
              {steps.map((step) => (
                <article className="offer-step" key={step.number}>
                  <span className="offer-step__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <Icon className="offer-step__flame" name="flame" size={22} />
                </article>
              ))}
            </div>
          </section>

          <section className="offers-cta" aria-label="Связаться с нами">
            <span className="offers-cta__icon"><Icon name="phone" size={25} /></span>
            <div><h2>Планируешь встречу?</h2><p>Позвони — поможем сориентироваться по набору.</p></div>
            <a href={site.phoneHref}>{site.phone} <Icon name="arrowRight" size={18} /></a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
