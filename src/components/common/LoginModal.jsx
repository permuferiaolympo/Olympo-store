import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiX, FiMail, FiLock, FiLogIn, FiShield } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'
import { signIn } from '../../services/authService.js'

function LoginModal() {
  const { isLoginModalOpen, closeLoginModal } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

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
      closeLoginModal()
      setEmail('')
      setPassword('')
      navigate('/dashboard')
    }
  }

  return (
    <AnimatePresence>
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con desenfoque de fondo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Ventana Modal / Componente flotante */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.5rem] border border-[#D4AF37]/30 bg-[#0d0d0d] p-8 shadow-[0_20px_80px_rgba(212,175,55,0.2)] sm:p-10"
          >
            {/* Botón para cerrar */}
            <button
              type="button"
              onClick={closeLoginModal}
              className="absolute right-6 top-6 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-[#D4AF37]/40 hover:bg-white/10 hover:text-[#D4AF37]"
              aria-label="Cerrar modal"
            >
              <FiX size={18} />
            </button>

            {/* Cabecera del Modal */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <FiShield size={24} />
              </div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">Acceso Privado</p>
              <h2 className="mt-1 text-2xl font-[TrajanPro] uppercase tracking-[0.15em] text-white">
                Login Administrador
              </h2>
            </div>

            {/* Formulario de Inicio de Sesión */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="modal-email" className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]/90">
                  Correo electrónico
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    id="modal-email"
                    type="email"
                    required
                    placeholder="admin@olimpo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-password" className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]/90">
                  Contraseña
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                  <input
                    id="modal-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-3.5 text-sm text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-6 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
              >
                <FiLogIn size={18} />
                {loading ? 'Ingresando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default LoginModal
