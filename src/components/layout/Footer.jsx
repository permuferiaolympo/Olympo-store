import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/10 bg-[#070707] py-10 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]/80">OLIMPO PERFUMERÍA</p>
            <h2 className="max-w-xl text-3xl font-[TrajanPro] uppercase tracking-[0.24em] text-white">
              Esencia divina, poder eterno.
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/70">
              Descubre un universo de fragancias premium con atención bespoke y detalles exclusivos para cada entrega.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Navegación</p>
            <div className="space-y-3 text-sm text-white/70">
              <Link to="/">Inicio</Link>
              <Link to="/about">Nosotros</Link>
              <Link to="/contact">Contacto</Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Contacto</p>
            <div className="space-y-2 text-sm text-white/70">
              <p>contacto@olimpo-perfumeria.com</p>
              <p>+52 55 1234 5678</p>
              <p>Polanco, CDMX</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#D4AF37]/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OLIMPO PERFUMERÍA. Todos los derechos reservados.</p>
          <p>Diseño inspirado en el arte del lujo contemporáneo.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
