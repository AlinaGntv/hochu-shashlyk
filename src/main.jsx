import '@fontsource/dela-gothic-one/cyrillic-400.css'
import '@fontsource/dela-gothic-one/latin-400.css'
import '@fontsource-variable/onest'
import './styles.css'
import App from './App.jsx'
import mount from './mount.jsx'

mount(App, { initialMenu: window.__HS_MENU__ })
