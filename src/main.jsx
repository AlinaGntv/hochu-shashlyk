import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/dela-gothic-one/cyrillic-400.css'
import '@fontsource/dela-gothic-one/latin-400.css'
import '@fontsource-variable/onest'
import './styles.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
