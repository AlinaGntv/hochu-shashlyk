import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Menu from './components/Menu.jsx'
import { Contacts, Features, Footer, Promo } from './components/Sections.jsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Menu />
        <Promo />
        <Features />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
