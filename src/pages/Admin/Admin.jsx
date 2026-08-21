import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { signIn } from '../../services/authService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiLock, FiMail, FiLogIn, FiShield } from 'react-icons/fi'

function Admin() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Si ya tiene sesión activa, redirige directamente al dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, authLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return 
    }

    setLoading(true)
    const { user, error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      let message = 'Error al iniciar sesión'
      if (error.message.includes('Invalid login credentials')) {
        message = 'Correo o contraseña incorrectos'
      } else if (error.message.includes('Email not confirmed')) {
        message = 'El correo electrónico no ha sido confirmado'
      } else {
        message = error.message
      }
      toast.error(message)
      return
    }

    if (user) {
      toast.success('¡Bienvenido al panel de administración!')
      navigate('/dashboard')
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12 py-8">
      <div className="mx-auto max-w-lg rounded-[2.5rem] border border-[#D4AF37]/30 bg-black/70 p-8 sm:p-10 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(212,175,55,0.3)]">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <FiShield size={28} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              Correo electrónico
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                id="admin-email"
                type="email"
                required
                placeholder="admin@olympo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
              Contraseña
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                id="admin-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            <FiLogIn size={18} />
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Admin
