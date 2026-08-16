import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#18181b',
                color: '#fff',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                borderRadius: '1rem',
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App


