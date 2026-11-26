import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext({ items: [], count: 0, subtotal: 0, addItem() {}, setQuantity() {}, removeItem() {}, clear() {}, open: false, openCart() {}, closeCart() {} })
const STORAGE_KEY = 'hs-delivery-cart-v2'
const productId = (item) => item.id || item.name.trim().toLocaleLowerCase('ru-RU').replace(/[^a-zа-я0-9]+/gi, '-')

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved)) setItems(saved.filter((item) => item?.id && item?.name && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 50))
    } catch { /* Повреждённую корзину безопасно начинаем заново. */ }
    setReady(true)
  }, [])

  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }, [items, ready])

  const addItem = useCallback((product) => {
    const id = productId(product)
    setItems((current) => {
      const found = current.find((item) => item.id === id)
      if (found) return current.map((item) => item.id === id ? { ...item, quantity: Math.min(50, item.quantity + 1) } : item)
      return [...current, { id, name: product.name, price: Number(product.price), weight: product.weight || '', photo: product.photo || null, quantity: 1 }]
    })
  }, [])
  const setQuantity = useCallback((id, quantity) => setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity: Math.min(50, Math.max(1, quantity)) } : item)), [])
  const removeItem = useCallback((id) => setItems((current) => current.filter((item) => item.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])
  const value = useMemo(() => ({ items, count: items.reduce((n, item) => n + item.quantity, 0), subtotal: items.reduce((n, item) => n + item.price * item.quantity, 0), addItem, setQuantity, removeItem, clear, open, openCart: () => setOpen(true), closeCart: () => setOpen(false) }), [items, addItem, setQuantity, removeItem, clear, open])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() { return useContext(CartContext) }
