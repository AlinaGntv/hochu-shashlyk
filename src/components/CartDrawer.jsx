import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { site } from '../data/site.js'

const money = (value) => `${Number(value).toLocaleString('ru-RU')} ₽`

export default function CartDrawer() {
  const cart = useCart()
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)
  const closeDrawer = () => { setStatus(null); cart.closeCart() }
  useEffect(() => {
    if (!cart.open) return undefined
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => { if (event.key === 'Escape') closeDrawer() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown) }
  }, [cart.open])
  if (!cart.open) return null

  async function checkout(event) {
    event.preventDefault()
    if (!cart.items.length) return
    setBusy(true); setStatus(null)
    const form = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.get('name'), phone: form.get('phone'), address: form.get('address'), note: form.get('note'), items: cart.items.map(({ id, quantity }) => ({ id, quantity })), consent: form.get('consent') === 'on' }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Не удалось отправить заказ.')
      setStatus({ orderId: data.orderId, total: data.total })
      cart.clear()
    } catch (error) { setStatus({ error: error.message }) }
    finally { setBusy(false) }
  }

  return <div className="cart-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDrawer() }}>
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <header className="cart-drawer__head"><div><span className="catalog-eyebrow"><i /> Ваш заказ</span><h2 id="cart-title">Корзина</h2></div><button type="button" className="request-dialog__close" onClick={closeDrawer} aria-label="Закрыть корзину">×</button></header>
      {status?.orderId ? <div className="cart-success"><span className="cart-success__icon">✓</span><h3>Заказ отправлен</h3><p>Номер заказа <strong>#{status.orderId.slice(0, 8).toUpperCase()}</strong>. Мы позвоним, подтвердим наличие блюд, стоимость доставки и время.</p><p>Предварительная сумма блюд: <strong>{money(status.total)}</strong>. Оплата — картой через терминал курьера при получении.</p><button className="btn" type="button" onClick={closeDrawer}>Продолжить покупки</button></div> : <>
        {cart.items.length ? <ul className="cart-items">{cart.items.map((item) => <li className="cart-item" key={item.id}>
          <div className="cart-item__info"><strong>{item.name}</strong><span>{money(item.price)}{item.weight ? ` · ${item.weight}` : ''}</span></div>
          <div className="cart-item__controls"><button type="button" aria-label={`Уменьшить количество: ${item.name}`} onClick={() => cart.setQuantity(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button type="button" aria-label={`Увеличить количество: ${item.name}`} onClick={() => cart.setQuantity(item.id, item.quantity + 1)}>+</button><strong>{money(item.price * item.quantity)}</strong><button className="cart-item__remove" type="button" onClick={() => cart.removeItem(item.id)} aria-label={`Убрать ${item.name}`}>×</button></div>
        </li>)}</ul> : <div className="cart-empty"><span>Корзина пока пуста</span><a href="/menu" onClick={cart.closeCart}>Перейти в меню →</a></div>}
        {!!cart.items.length && <>
          <div className="cart-subtotal"><span>Сумма блюд</span><strong>{money(cart.subtotal)}</strong></div>
          <p className="cart-delivery-hint">Стоимость и возможность доставки по вашему адресу подтвердим по телефону. Оплата — банковской картой через терминал курьера при получении.</p>
          <form className="cart-checkout" onSubmit={checkout}>
            <h3>Доставка</h3>
            <label>Имя<input name="name" autoComplete="name" required minLength="2" maxLength="80" placeholder="Как к вам обращаться" /></label>
            <label>Телефон<input name="phone" autoComplete="tel" type="tel" required placeholder="+7 (___) ___-__-__" /></label>
            <label>Адрес доставки<input name="address" autoComplete="street-address" required minLength="5" maxLength="250" placeholder="Город, улица, дом, квартира" /></label>
            <label>Комментарий к заказу<textarea name="note" rows="2" maxLength="500" placeholder="Подъезд, этаж, домофон, пожелания" /></label>
            <p className="cart-payment"><strong>Оплата:</strong> банковской картой через терминал курьера при получении. Онлайн-оплата недоступна.</p>
            <label className="request-consent"><input type="checkbox" name="consent" required /><span>Я даю отдельное согласие на обработку данных для оформления и доставки заказа. <a href="/personal-data-consent" target="_blank" rel="noreferrer">Текст согласия</a>. Политика: <a href="/privacy" target="_blank" rel="noreferrer">прочитать</a>.</span></label>
            {status?.error && <div className="request-status" role="alert">{status.error}</div>}
            <button className="btn" disabled={busy}>{busy ? 'Отправляем…' : 'Оформить заказ · ' + money(cart.subtotal)}</button>
            <small>Отправка заказа — запрос на подтверждение. Заказ будет принят после звонка сотрудника.</small>
          </form>
        </>}
      </>}
    </aside>
  </div>
}
