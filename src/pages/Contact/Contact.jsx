import { FiMail, FiMapPin, FiPhone, FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'

function Contact() {
  return (
    <div className="space-y-16">
      <SectionHeader
        pretitle="Contacto"
        title="Conecta con OLYMPO"
        children="Envía un mensaje, reserva una consulta privada o descubre nuestra casa de fragancias."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Detalles</p>
            <h2 className="text-3xl font-[TrajanPro] uppercase tracking-[0.16em] text-white">Información de contacto</h2>
          </div>
          <div className="space-y-4 text-sm text-white/70">
            <div className="flex items-start gap-3">
              <FiMapPin size={20} className="text-[#D4AF37]" />
              <p>Polanco, Ciudad de México. Espacio diseñado para encuentros privados.</p>
            </div>
            <div className="flex items-start gap-3">
              <FiMail size={20} className="text-[#D4AF37]" />
              <p>contacto@olympo-perfumeria.com</p>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone size={20} className="text-[#D4AF37]" />
              <p>+52 55 1234 5678</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Redes</p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-white/80 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]">
                <FiInstagram /> Instagram
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-white/80 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]">
                <FiFacebook /> Facebook
              </a>
              <a href="#" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-white/80 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]">
                <FiTwitter /> Twitter
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <form className="space-y-6">
            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-[#D4AF37]/70">Nombre</label>
              <input type="text" placeholder="Tu nombre completo" className="w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10" />
            </div>
            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-[#D4AF37]/70">Correo</label>
              <input type="email" placeholder="tu@correo.com" className="w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10" />
            </div>
            <div>
              <label className="mb-2 block text-sm uppercase tracking-[0.25em] text-[#D4AF37]/70">Mensaje</label>
              <textarea rows="5" placeholder="Cuéntanos tu consulta" className="w-full rounded-3xl border border-white/10 bg-black/50 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/10"></textarea>
            </div>
            <button type="button" className="w-full rounded-full bg-[#D4AF37] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:scale-[1.01]">
              Enviar mensaje
            </button>
          </form>
          <div className="mt-10 rounded-[2rem] border border-[#D4AF37]/10 bg-black/40 p-6 text-white/70">
            <p className="text-sm uppercase tracking-[0.35em] text-[#D4AF37]/70">Ubicación</p>
            <div className="mt-4 h-56 rounded-[2rem] bg-white/5 p-5 text-sm leading-7 text-white/60">
              Mapa preparado para integrarse con tu servicio preferido cuando agreguemos la lógica de geolocalización.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
