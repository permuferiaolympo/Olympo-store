import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

function Layout() {
  const location = useLocation()

  // Oculta el pie de página en las vistas de administración
  const hideFooterPaths = ['/admin', '/dashboard', '/settings', '/login']
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
    </div>
  )
}

export default Layout

