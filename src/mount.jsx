import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

export default function mount(Page) {
  const root = document.getElementById('root')
  const app = <StrictMode><Page /></StrictMode>
  if (root.hasChildNodes()) hydrateRoot(root, app)
  else createRoot(root).render(app)
}
