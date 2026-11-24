import Header from '../components/Header.jsx'
import { Footer, MapCard } from '../components/Sections.jsx'
import { site } from '../data/site.js'
import { Icon, Socials } from '../components/ui.jsx'

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="contact-page" id="top">
        <div className="contact-page__glow" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a href="/#top">Главная</a>
            <span aria-hidden="true">/</span>
            <span>Контакты</span>
          </nav>

          <section className="contact-intro" aria-labelledby="contact-title">
            <div>
              <span className="catalog-eyebrow"><i /> Всегда рады гостям</span>
              <h1 id="contact-title">Заглядывай<br />на огонёк<span>.</span></h1>
              <p>Приезжай за любимым шашлыком или позвони, чтобы заказать заранее.</p>
            </div>
            <a className="contact-intro__call" href={site.phoneHref}>
              <span><Icon name="phone" size={23} /></span>
              <small>Позвонить нам</small>
              <strong>{site.phone}</strong>
              <Icon className="contact-intro__arrow" name="arrowRight" size={19} />
            </a>
          </section>

          <section className="contact-layout" aria-label="Адрес и способы связи">
            <div className="contact-info">
              <a className="contact-info__card" href={site.mapUrl} target="_blank" rel="noreferrer">
                <span className="contact-info__icon"><Icon name="pin" size={23} /></span>
                <span className="contact-info__text"><small>Наш адрес</small><strong>{site.address}</strong><em>Открыть маршрут <Icon name="arrowRight" size={14} /></em></span>
              </a>
              <div className="contact-info__card">
                <span className="contact-info__icon"><Icon name="clock" size={23} /></span>
                <span className="contact-info__text"><small>Режим работы</small><strong>{site.hours}</strong><em className="contact-info__open"><i /> Открыты каждый день</em></span>
              </div>
              <a className="contact-info__card" href={site.phoneHref}>
                <span className="contact-info__icon"><Icon name="phone" size={23} /></span>
                <span className="contact-info__text"><small>Заказ и вопросы</small><strong>{site.phone}</strong><em>Нажми, чтобы позвонить <Icon name="arrowRight" size={14} /></em></span>
              </a>

              <div className="contact-info__social">
                <span>Мы в соцсетях</span>
                <Socials variant="square" />
              </div>
            </div>

            <div className="contact-map-wrap">
              <MapCard />
              <div className="contact-map-caption">
                <span className="contact-map-caption__pin"><Icon name="pin" size={19} /></span>
                <span><small>Хочу Шашлык</small><strong>Балашиха · ш. Энтузиастов, 36А</strong></span>
                <a href={site.mapUrl} target="_blank" rel="noreferrer" aria-label="Открыть Яндекс Карты">
                  <Icon name="arrowRight" size={18} />
                </a>
              </div>
            </div>
          </section>

          <section className="contact-bottom" aria-label="Заказ и самовывоз">
            <span className="contact-bottom__flame"><Icon name="flameFill" size={21} /></span>
            <p>Удобнее забрать заказ с собой? <strong>Позвони — подскажем по меню и времени.</strong></p>
            <a href={site.phoneHref}>Связаться <Icon name="arrowRight" size={16} /></a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
