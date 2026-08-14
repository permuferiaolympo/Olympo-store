import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent"></div>
          <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]/80">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <h1 className="text-xl font-semibold text-white">Acceso restringido</h1>
          <p className="mt-3 text-sm leading-6 text-white/70">
            Tu cuenta inició sesión correctamente, pero no tiene permisos de administrador.
          </p>
          <Link to="/" className="mt-6 inline-block text-sm text-[#D4AF37] hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default ProtectedRoute
