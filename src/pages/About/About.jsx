import SectionHeader from '../../components/common/SectionHeader.jsx'

function About() {
  return (
    <div className="space-y-16">
      <SectionHeader
        pretitle="Nuestra esencia"
        title="Historia de OLYMPO"
        children="Una casa de perfumes creada para quienes buscan una experiencia sensorial de lujo sin precedentes."
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div className="space-y-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <p className="text-sm leading-8 text-white/70">
            OLYMPO PERFUMERÍA nació como un refugio para las fragancias más exclusivas, donde cada creación se perfila con una filosofía de nobleza, sutileza y poder. Nuestro propósito es ofrecer perfumes que actúen como un amuleto exquisito de identidad.
          </p>
          <p className="text-sm leading-8 text-white/70">
            Inspirados en nombres icónicos del lujo y en los rituales de belleza más refinados, desarrollamos piezas olfativas con ingredientes nobles, envases minimalistas y presentaciones que evocan un lenguaje de distinción.
          </p>
          <p className="text-sm leading-8 text-white/70">
            Cada cliente de OLYMPO es parte de una experiencia curated: asesoría personalizada, selección cuidada de fragancias y un servicio de entrega diseñado para preservar ese momento de descubrimiento.
          </p>
        </div>

        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-black/40 p-10 text-white shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Nuestra promesa</p>
            <h3 className="mt-3 text-3xl font-[TrajanPro] uppercase tracking-[0.16em] text-white">Lujo que trasciende tendencias</h3>
          </div>
          <ul className="space-y-4 text-sm leading-7 text-white/70">
            <li>Ingredientes de origen selecto.</li>
            <li>Diseño minimalista con presencia escultural.</li>
            <li>Atención personalizada para tu firma olfativa.</li>
            <li>Entrega premium con empaque elevado.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default About
