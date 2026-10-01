import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { VolutSerca } from './VolutSerca'
import { AuthProvider } from './auth/context/AuthProvider'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
        <VolutSerca/>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
