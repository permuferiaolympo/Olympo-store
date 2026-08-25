import { FiHeart, FiMail, FiMapPin, FiPhone, FiShield, FiStar } from 'react-icons/fi'

function Footer() {
  return (
    <footer className="border-t border-[#D4AF37]/20 bg-[#070707] py-12 text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr_0.9fr] lg:gap-16">
          <div className="space-y-5">
            <p className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-[#D4AF37]/80">
              <FiStar className="text-[#D4AF37]" /> OLYMPO PERFUMERÍA
            </p>
            <h2 className="max-w-xl text-3xl font-[TrajanPro] uppercase tracking-[0.2em] text-white">
              Esencia divina, poder eterno
            </h2>
            <p className="max-w-md text-sm leading-7 text-white/60">
              Fragancias seleccionadas para expresar tu esencia y acompañar cada momento especial.
            </p>
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">La experiencia OLYMPO</p>
            <div className="grid gap-4 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <FiShield className="shrink-0 text-xl text-[#D4AF37]" />
                <span><strong className="font-medium text-white">Envíos seguros</strong><br />Tu compra protegida hasta llegar a tus manos.</span>
              </div>
              <div className="flex items-center gap-3">
                <FiHeart className="shrink-0 text-xl text-[#D4AF37]" />
                <span><strong className="font-medium text-white">Asesoría personalizada</strong><br />Encuentra la fragancia ideal para ti.</span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Visítanos</p>
            <div className="space-y-4 text-sm leading-6 text-white/70">
              <p className="flex items-start gap-3"><FiMapPin className="mt-1 shrink-0 text-lg text-[#D4AF37]" />Carrera 74 #98-118, barrio Doce de Octubre, Medellín</p>
              <a href="mailto:Permuferiaolympo@gmail.com" className="flex items-center gap-3 transition hover:text-[#D4AF37]"><FiMail className="shrink-0 text-lg text-[#D4AF37]" />Permuferiaolympo@gmail.com</a>
              <a href="https://wa.me/573013285697" target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-[#D4AF37]"><FiPhone className="shrink-0 text-lg text-[#D4AF37]" />+57 301 328 5697</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#D4AF37]/10 pt-6 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OLYMPO PERFUMERÍA. Todos los derechos reservados.</p>
          <a href="/admin" className="text-[#D4AF37] transition hover:text-[#F4D77B] hover:underline">
            Acceder
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
