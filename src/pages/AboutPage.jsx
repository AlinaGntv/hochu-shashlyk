import Header from '../components/Header.jsx'
import { Footer } from '../components/Sections.jsx'
import { features, site } from '../data/site.js'
import { Icon } from '../components/ui.jsx'

const principles = [
  {
    number: '01',
    icon: 'flame',
    title: 'Живой огонь',
    text: 'Готовим на углях — так раскрывается вкус мяса, рыбы и овощей.',
  },
  {
    number: '02',
    icon: 'leaf',
    title: 'Просто и сытно',
    text: 'В меню — понятные блюда, гарниры и выпечка к ним.',
  },
  {
    number: '03',
    icon: 'people',
    title: 'Для своих',
    text: 'Можно взять что-нибудь к обеду или собрать стол для компании.',
  },
]

function EmberArtwork() {
  return (
    <div className="about-art" role="img" aria-label="Иллюстрация огня и углей">
      <div className="about-art__halo" />
      <div className="about-art__ring about-art__ring--one" />
      <div className="about-art__ring about-art__ring--two" />
      <div className="about-art__embers" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <i
            key={index}
            style={{ left: `${15 + index * 6}%`, animationDelay: `${-index * 0.43}s` }}
          />
        ))}
      </div>
      <div className="about-art__flame"><Icon name="flameFill" size={104} /></div>
      <div className="about-art__wordmark"><span>ВКУС</span><strong>ОГНЯ</strong></div>
      <span className="about-art__caption">ХОЧУ ШАШЛЫК · БАЛАШИХА</span>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="about-page" id="top">
        <div className="about-page__glow" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <a href="/#top">Главная</a>
            <span aria-hidden="true">/</span>
            <span>О нас</span>
          </nav>

          <section className="about-hero" aria-labelledby="about-title">
            <div className="about-hero__copy">
              <span className="catalog-eyebrow"><i /> Вкус, который собирает вместе</span>
              <h1 id="about-title">Ближе<br />к <em>огню.</em></h1>
              <p>
                «Хочу Шашлык» — место для тех, кто любит простую еду с характером:
                мясо, рыбу и овощи, приготовленные на углях.
              </p>
              <div className="about-hero__actions">
                <a className="btn" href="/menu">Смотреть меню <Icon name="arrowRight" size={18} /></a>
                <a className="about-text-link" href={site.phoneHref}><Icon name="phone" size={17} /> Заказать по телефону</a>
              </div>
            </div>
            <EmberArtwork />
          </section>

          <div className="about-facts" aria-label="О заведении">
            {features.map((feature) => (
              <div className="about-fact" key={feature.text}>
                <Icon name={feature.icon} size={27} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          <section className="about-story" aria-labelledby="about-story-title">
            <div className="about-story__label"><span>Наша идея</span><i /></div>
            <div className="about-story__content">
              <h2 id="about-story-title">Когда пахнет углями —<br /><em>значит, пора собираться.</em></h2>
              <p>
                Мы верим, что хорошая еда не нуждается в сложных объяснениях. Выбирай любимое
                блюдо, добавляй гарнир и зови тех, с кем хочется разделить этот вечер.
              </p>
              <p>
                В меню есть шашлык, люля-кебаб, рыба, шаурма, овощи и выпечка — всё, чтобы
                найти свой вкус и взять с собой.
              </p>
            </div>
          </section>

          <section className="about-principles" aria-labelledby="about-principles-title">
            <div className="about-section-heading">
              <span className="catalog-eyebrow"><i /> Просто о главном</span>
              <h2 id="about-principles-title">За что нас любят</h2>
            </div>
            <div className="about-principles__grid">
              {principles.map((item) => (
                <article className="about-principle" key={item.number}>
                  <div className="about-principle__top">
                    <span>{item.number}</span>
                    <Icon name={item.icon} size={30} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="about-principle__line" />
                </article>
              ))}
            </div>
          </section>

          <section className="about-visit" aria-labelledby="about-visit-title">
            <div className="about-visit__copy">
              <span className="catalog-eyebrow"><i /> Будем рады видеть</span>
              <h2 id="about-visit-title">Заглядывай<br />на огонёк</h2>
              <p>Заходи за шашлыком или заказывай заранее — приготовим, чтобы было удобно забрать.</p>
              <a className="btn" href={site.phoneHref}>Позвонить <Icon name="arrowRight" size={18} /></a>
            </div>
            <div className="about-visit__details">
              <a className="about-visit__detail" href={site.mapUrl} target="_blank" rel="noreferrer">
                <span><Icon name="pin" size={22} /></span>
                <div><small>Наш адрес</small><strong>{site.address}</strong></div>
                <Icon className="about-visit__arrow" name="arrowRight" size={17} />
              </a>
              <div className="about-visit__detail">
                <span><Icon name="clock" size={22} /></span>
                <div><small>Ждём каждый день</small><strong>{site.hours}</strong></div>
              </div>
              <a className="about-visit__detail" href={site.phoneHref}>
                <span><Icon name="phone" size={22} /></span>
                <div><small>Звоните</small><strong>{site.phone}</strong></div>
                <Icon className="about-visit__arrow" name="arrowRight" size={17} />
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
