import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import CategoryCard from '../../components/common/CategoryCard.jsx'
import ProductCard from '../../components/common/ProductCard.jsx'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import BrandChip from '../../components/common/BrandChip.jsx'
import TestimonialCard from '../../components/common/TestimonialCard.jsx'
import { getFeaturedPerfumes } from '../../services/perfumeService.js'
import { getCategories } from '../../services/categoryService.js'
import { benefits, brands, testimonials } from '../../constants/mockData.jsx'

function Home() {
  const [perfumes, setPerfumes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [perfumesData, categoriesData] = await Promise.all([
          getFeaturedPerfumes(),
          getCategories(),
        ])
        setPerfumes(perfumesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error loading home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-24">
      <section className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_45%),_linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(13,13,13,0.95))] px-6 py-20 shadow-[0_40px_130px_-80px_rgba(0,0,0,0.9)] sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.45em] text-[#D4AF37]/80">OLIMPO PERFUMERÍA</p>
          <h1 className="mb-6 text-5xl font-[TrajanPro] uppercase tracking-[0.18em] text-white sm:text-6xl lg:text-7xl">
            Esencia divina, poder eterno.
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            Descubre fragancias premium diseñadas para quienes buscan presencia inolvidable, sofisticación máxima y estilo atemporal.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/about"
              className="inline-flex rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-4 text-sm uppercase tracking-[0.28em] text-black transition hover:scale-[1.01] hover:bg-opacity-90"
            >
              Conocer Más
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm uppercase tracking-[0.28em] text-white transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            >
              Contacto
            </Link>
          </div>
        </motion.div>
      </section>

      {categories.length > 0 && (
        <section className="space-y-12">
          <SectionHeader
            pretitle="Colecciones exclusivas"
            title="Nuestras categorías"
            children="Tres universos olfativos que combinan tradición, noche y pureza en un solo escaparate premium."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} title={category.name} description={category.description} />
            ))}
          </div>
        </section>
      )}

      {perfumes.length > 0 && (
        <section className="space-y-12">
          <SectionHeader
            pretitle="Perfumes destacados"
            title="Elegancia con cada nota"
            children="Explora fragancias seleccionadas por su carácter noble, texturas complejas y acabado impecable."
          />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {perfumes.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-[2.5rem] border border-[#D4AF37]/10 bg-white/5 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.75)] sm:p-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Oferta especial</p>
            <h2 className="mt-3 text-4xl font-[TrajanPro] uppercase tracking-[0.16em] text-white sm:text-5xl">
              Un viaje sensorial a tu medida
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-8 text-white/70">
              Disfruta de envío premium, empaques exclusivos y una presentación que realza el efecto de cada perfume.
            </p>
          </div>
          <div className="space-y-4 rounded-[2rem] border border-white/10 bg-black/70 p-8 text-white">
            <p className="text-sm uppercase tracking-[0.33em] text-[#D4AF37]/80">Beneficio</p>
            <p className="text-lg leading-8 text-white/80">
              En OLIMPO, cada paquete está preparado como un obsequio único para preservar la experiencia desde el primer momento.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <SectionHeader
          pretitle="Por qué elegir OLIMPO"
          title="Beneficios exclusivos"
          children="Siente la diferencia de una marca que combina lujo atento con perfumes que elevan tu identidad."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((item) => (
            <div key={item.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-white shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
              <h3 className="mb-4 text-xl font-[TrajanPro] uppercase tracking-[0.16em] text-white">{item.title}</h3>
              <p className="text-sm leading-7 text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <SectionHeader
          pretitle="Marcas del atelier"
          title="Firmas selectas"
          children="Un portfolio de nombres que comparten refinamiento, carácter y un diseño olfativo exclusivo."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((brand) => (
            <BrandChip key={brand.id} label={brand.label} />
          ))}
        </div>
      </section>

      <section className="space-y-12">
        <SectionHeader
          pretitle="Voces del lujo"
          title="Testimonios"
          children="Descubre qué sienten quienes ya forman parte de la experiencia OLIMPO."
        />
        <div className="grid gap-6 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
