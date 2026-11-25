import Header from '../components/Header.jsx'
import { Footer } from '../components/Sections.jsx'
import { Icon } from '../components/ui.jsx'

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main className="not-found" id="top">
        <div className="not-found__glow" aria-hidden="true" />
        <div className="container not-found__content">
          <span className="not-found__eyebrow"><i /> Кажется, уголь прогорел</span>
          <div className="not-found__number" aria-hidden="true">404</div>
          <h1>Такой страницы нет<span>.</span></h1>
          <p>Похоже, ссылка устарела или адрес введён с ошибкой. Давайте вернёмся к меню и найдём что-нибудь вкусное.</p>
          <div className="not-found__actions">
            <a className="btn" href="/">На главную <Icon name="arrowRight" size={17} /></a>
            <a className="not-found__menu" href="/menu">Открыть меню <Icon name="arrowRight" size={16} /></a>
          </div>
          <span className="not-found__flame" aria-hidden="true"><Icon name="flameFill" size={28} /></span>
        </div>
      </main>
      <Footer />
    </>
  )
}
