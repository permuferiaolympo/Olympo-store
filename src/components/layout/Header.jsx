import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiShield, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext.jsx'
import { signOut } from '../../services/authService.js'
import toast from 'react-hot-toast'
import logoImage from '../../assets/logo/logo.jpeg'

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Catálogo', path: '/catalog' },
  { label: 'Contacto', path: '/contact' },
]

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, openLoginModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleLogout() {
    await signOut()
    toast.success('Sesión cerrada correctamente')
    navigate('/')
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-[#D4AF37]/10 bg-black/80 backdrop-blur-xl transition duration-300 ${
        scrolled ? 'shadow-[0_20px_80px_-40px_rgba(0,0,0,0.7)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-white">
          <img
            src={logoImage}
            alt="Olympo Perfumería"
            className="h-12 w-12 rounded-full border border-[#D4AF37]/40 object-cover shadow-[0_0_24px_rgba(212,175,55,0.18)]"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">OLYMPO</p>
            <p className="text-sm font-[Montserrat] uppercase tracking-[0.2em] text-white/90">Perfumería</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm uppercase tracking-[0.28em] transition ${
                  isActive ? 'text-[#D4AF37]' : 'text-white/70 hover:text-[#D4AF37]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="Buscar"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#D4AF37]/20 bg-white/5 text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-white/10"
          >
            <FiSearch size={18} />
          </button>
          <Link
            to="/cart"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#D4AF37]/20 bg-white/5 text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-white/10"
            aria-label="Carrito"
          >
            <FiShoppingBag size={18} />
          </Link>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
              >
                <FiShield size={14} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="grid h-11 w-11 place-items-center rounded-full border border-red-500/20 bg-red-500/10 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20"
              >
                <FiLogOut size={16} />
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#D4AF37]/20 bg-white/5 text-[#D4AF37] md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Menú móvil"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-[#D4AF37]/10 bg-black/95 pb-6 text-white md:hidden"
          >
            <div className="space-y-4 px-6 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className="block rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-base uppercase tracking-[0.25em] text-white/85 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="grid gap-3">
                <Link
                  to="/cart"
                  onClick={() => setOpen(false)}
                  className="rounded-3xl border border-[#D4AF37]/20 bg-white/5 px-4 py-3 text-left text-sm uppercase tracking-[0.22em] text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-white/10"
                >
                  Carrito
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-3xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#D4AF37]"
                    >
                      <FiShield size={16} />
                      Dashboard Admin
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false)
                        handleLogout()
                      }}
                      className="flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-red-400"
                    >
                      <FiLogOut size={16} />
                      Cerrar sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header