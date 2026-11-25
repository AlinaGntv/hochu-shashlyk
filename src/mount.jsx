import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

export default function mount(Page, props = {}) {
  const root = document.getElementById('root')
  const app = <StrictMode><Page {...props} /></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
