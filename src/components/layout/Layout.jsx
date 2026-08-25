import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout() {
  const location = useLocation()

  // Oculta el pie de página en las vistas de administración
  const hideFooterPaths = ['/admin', '/dashboard', '/login']
  const hideFooter = hideFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  )

  return (
    <div className="flex min-h-screen flex-col justify-between bg-black text-white">
      <div>
        <Header />
        <main className="relative z-10 mx-auto max-w-[1440px] px-4 pb-24 pt-28 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      {!hideFooter && <Footer />}
      {!hideFooter && (
        <a
          href="https://wa.me/573013285697"
          target="_blank"
          rel="noreferrer"
          aria-label="Escribir por WhatsApp"
          title="Escribir por WhatsApp"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-black sm:bottom-7 sm:right-7"
        >
          <FaWhatsapp aria-hidden="true" size={30} />
        </a>
      )}
    </div>
  )
}

export default Layout

