import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

function userHasAdminRole(user) {
  const roles = [
    user?.app_metadata?.role,
    ...(Array.isArray(user?.app_metadata?.roles) ? user.app_metadata.roles : []),
  ]

  return roles.some((role) => typeof role === 'string' && role.toLowerCase() === 'admin')
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  useEffect(() => {
    // Consulta el usuario en Supabase para no conservar metadata de rol obsoleta
    // que pueda estar almacenada en la sesión local del navegador.
    async function loadCurrentUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      setUser(error ? null : user)
      setLoading(false)
    }

    loadCurrentUser()

    // Escucha cambios en tiempo real (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const openLoginModal = () => setIsLoginModalOpen(true)
  const closeLoginModal = () => setIsLoginModalOpen(false)

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: userHasAdminRole(user),
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para consumir el contexto
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
