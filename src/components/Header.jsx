import { useState } from 'react'
import { nav } from '../data/site.js'
import { Logo, Socials } from './ui.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const left = nav.slice(0, 3)
  const right = nav.slice(3)

  return (
    <header className={`header ${open ? 'is-open' : ''}`}>
      <div className="container header__row">
        <nav className="header__nav" aria-label="Основная навигация">
          {left.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <Logo className="header__logo" />

        <div className="header__right">
          {right.map((l) => (
            <a key={l.href} href={l.href} className="header__contacts">
              {l.label}
            </a>
          ))}
          <Socials />
        </div>

        <button
          className="burger"
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="mobile-menu" hidden={!open}>
        <nav className="container" aria-label="Мобильная навигация">
          {nav.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Socials />
        </nav>
      </div>
    </header>
  )
}
