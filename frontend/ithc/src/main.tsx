import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { VolutSerca } from './VolutSerca'
import { AuthProvider } from './auth/context/AuthProvider'
import { AnunciosProvider } from './anuncios/context/AnunciosProvider'
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
        <AnunciosProvider>
          <VolutSerca/>
        </AnunciosProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
