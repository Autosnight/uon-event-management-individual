import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import { StateContextProvider } from './context/StateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StateContextProvider><App /></StateContextProvider>
    
  </StrictMode>,
)
