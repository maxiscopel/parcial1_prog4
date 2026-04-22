import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import Categorias from './pages/Categorias'
import Ingredientes from './pages/Ingredientes'
import Productos from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'

const queryClient = new QueryClient()

function Navbar() {
  const location = useLocation()
  const links = [
    { to: '/categorias', label: 'Categorías' },
    { to: '/ingredientes', label: 'Ingredientes' },
    { to: '/productos', label: 'Productos' },
  ]
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="font-bold text-xl tracking-tight text-blue-400"> ParcialApp</span>
        <div className="flex gap-2 flex-wrap">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                location.pathname.startsWith(link.to)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <main className="p-4 sm:p-6 bg-gray-50 min-h-screen">
          <Routes>
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/ingredientes" element={<Ingredientes />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/" element={<Categorias />} />
          </Routes>
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)