import { useState } from 'react'
import { nav } from '../data/site.js'
import { Icon, Logo, Socials } from './ui.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const cart = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className={`header ${open ? 'is-open' : ''}`}>
      <div className="container header__row">
        <nav className="header__nav" aria-label="Основная навигация">
          {nav.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <Logo className="header__logo" />

        <div className="header__right">
          <Socials />
          <button className="header-cart" type="button" onClick={cart.openCart} aria-label={`Корзина, товаров: ${cart.count}`}>
            <Icon name="basket" size={18} /><span>Корзина</span>{cart.count > 0 && <b>{cart.count}</b>}
          </button>
        </div>

        <button className="header-cart header-cart--mobile" type="button" onClick={cart.openCart} aria-label={`Корзина, товаров: ${cart.count}`}>
          <Icon name="basket" size={19} />{cart.count > 0 && <b>{cart.count}</b>}
        </button>

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
