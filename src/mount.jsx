import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { CartProvider } from './context/CartContext.jsx'
import CartDrawer from './components/CartDrawer.jsx'

export default function mount(Page, props = {}) {
  document.addEventListener('wheel', (event) => {
    const input = document.activeElement
    if (input instanceof HTMLInputElement && input.type === 'number' && event.target === input) event.preventDefault()
  }, { capture: true, passive: false })
  const root = document.getElementById('root')
  const app = <StrictMode><CartProvider><Page {...props} /><CartDrawer /></CartProvider></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
