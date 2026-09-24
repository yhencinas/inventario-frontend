import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

console.log('========== INVENTARIO FRONTEND ==========')
console.log('PROD:', import.meta.env.PROD)
console.log('DEV:', import.meta.env.DEV)
console.log('MODE:', import.meta.env.MODE)

const apiUrl = import.meta.env.PROD
  ? 'https://inventario-backend-xqi2.onrender.com'
  : 'http://localhost:8082'

console.log('API URL:', apiUrl)
console.log('========================================')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      
      <App />
    </HashRouter>
  </StrictMode>,
)
