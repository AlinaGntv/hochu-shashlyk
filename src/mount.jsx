import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

export default function mount(Page, props = {}) {
  document.addEventListener('wheel', (event) => {
    const input = document.activeElement
    if (input instanceof HTMLInputElement && input.type === 'number' && event.target === input) event.preventDefault()
  }, { capture: true, passive: false })
  const root = document.getElementById('root')
  const app = <StrictMode><Page {...props} /></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
