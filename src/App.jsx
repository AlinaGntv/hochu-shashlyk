import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Menu from './components/Menu.jsx'
import { Contacts, Features, Footer, Promo, Reviews } from './components/Sections.jsx'

export default function App({ initialMenu } = {}) {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu initialMenu={initialMenu} />
        <Reviews />
        <Promo />
        <Features />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
