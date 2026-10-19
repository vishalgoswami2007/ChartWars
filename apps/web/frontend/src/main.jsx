import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import './index.css' // यहाँ से Tailwind CSS लोड होगी

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)