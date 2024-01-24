import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { GraftProvider, INITIAL_STATE } from './context/GraftProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
window.Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(123456.789)

root.render(
  <React.StrictMode>
    <GraftProvider initialState={INITIAL_STATE}>
      <App />
    </GraftProvider>
  </React.StrictMode>
)
