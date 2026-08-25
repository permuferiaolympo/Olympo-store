import { FiMail, FiMapPin, FiInstagram, FiPhone } from 'react-icons/fi'
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
              <p>Carrera 74 #98-118, barrio Doce de Octubre, Medellín</p>
            </div>
            <div className="flex items-start gap-3">
              <FiMail size={20} className="text-[#D4AF37]" />
              <p>Permuferiaolympo@gmail.com</p>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone size={20} className="text-[#D4AF37]" />
              <p>+57 301 328 5697</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Redes</p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.instagram.com/perfumes_olympo?igsi=a25tcW1hNHgwZGxz" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase tracking-[0.22em] text-white/80 transition hover:border-[#D4AF37]/30 hover:text-[#D4AF37]">
                <FiInstagram /> Instagram
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
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.7513135658546!2d-75.57877772597331!3d6.2963760936927144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442ed669c881af%3A0x1045f043589912b1!2sCra.%2074%20%2398%20118%2C%20La%20Esperanza%2C%20Medell%C3%ADn%2C%20Doce%20de%20Octubre%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1787673121742!5m2!1ses-419!2sco"
              title="Mapa de OLYMPO Perfumería"
              className="mt-4 h-56 w-full rounded-[2rem] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
