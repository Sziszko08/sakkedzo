import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

registerSW({
  immediate: true,
  onNeedRefresh() {
    // Ensure phones / installed PWA pick up the new build promptly.
    location.reload()
  },
  onOfflineReady() {
    // no-op — app is ready offline
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
