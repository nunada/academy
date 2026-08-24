import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './i18n'
import { StoreProvider } from './app/store'
import './styles.css'

/** The same value Vite built with — `/` normally, `/repo/` on a GitHub Pages
 *  project site. Reading it here rather than hardcoding it means one setting in
 *  the deploy workflow moves both the assets and every route. */
const base = import.meta.env.BASE_URL

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <StoreProvider>
        <BrowserRouter basename={base}>
          <App />
        </BrowserRouter>
      </StoreProvider>
    </I18nProvider>
  </StrictMode>,
)
