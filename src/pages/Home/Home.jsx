import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  FiStar,
  FiArrowRight,
  FiTruck,
  FiAward,
  FiCompass,
  FiShoppingBag,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import ProductCard from '../../components/common/ProductCard.jsx'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { getFeaturedPerfumes, getPerfumes } from '../../services/perfumeService.js'

// Fisher-Yates array randomizer
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function Home() {
  const [perfumes, setPerfumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [visibleCount, setVisibleCount] = useState(4)

  // Fetch and randomize perfumes
  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      let perfumesData = await getFeaturedPerfumes()
      // Fallback if no products are flagged as featured in database
      if (!perfumesData || perfumesData.length === 0) {
        perfumesData = await getPerfumes()
      }
      setPerfumes(shuffleArray(perfumesData || []))
      setCurrentIndex(0)
    } catch (err) {
      console.error('Error loading home data:', err)
      setError('No fue posible cargar las fragancias destacadas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Responsive items count for carousel
  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth < 640) {
        setVisibleCount(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2)
      } else if (window.innerWidth < 1280) {
        setVisibleCount(3)
      } else {
        setVisibleCount(4)
      }
    }
    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)
    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  // Max index allowed in carousel
  const maxIndex = Math.max(0, perfumes.length - visibleCount)

  // Auto-play carousel slider (cada 30 segundos)
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 40000)
    return () => clearInterval(interval)
  }, [isPaused, maxIndex, perfumes.length])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-[#D4AF37]/40" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 animate-pulse">
          Cargando Fragancias Olimpo...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-24 md:space-y-32">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.22)_0%,_rgba(20,20,20,0.8)_50%,_rgba(10,10,10,0.98)_100%)] px-6 py-16 shadow-[0_50px_140px_-90px_rgba(0,0,0,0.95)] sm:px-12 lg:px-20 lg:py-24">
        {/* Decorative Glow Elements */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative z-10 mx-auto max-w-4xl text-center space-y-8"
        >
          {/* Top Pill Badge */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2 text-xs font-medium uppercase tracking-[0.35em] text-[#D4AF37] backdrop-blur-md shadow-[0_0_25px_rgba(212,175,55,0.15)]">
              <FiStar className="text-sm animate-spin" style={{ animationDuration: '6s' }} />
              OLIMPO PERFUMERÍA DE LUXE
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-[TrajanPro] uppercase tracking-[0.16em] leading-tight text-white sm:text-6xl lg:text-7xl">
            Esencia Divina,{' '}
            <span className="bg-gradient-to-r from-white via-[#F5E0A3] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
              Poder Eterno
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base leading-8 text-white/70 sm:text-lg font-light">
            Descubre nuestra exclusiva selección de fragancias de alta gama. Acordes nobles, estelas memorables y el sello atemporal de la elegancia.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-3 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-9 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-all duration-300 hover:scale-[1.03] hover:bg-[#e2bd46] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              Explorar Catálogo
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/10 hover:text-[#D4AF37]"
            >
              <FiCompass className="text-base" />
              Asesoría VIP
            </Link>
          </div>

          {/* Hero Trust Indicators Bar */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-6">
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <FiTruck className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">Envío Rápido</span>
              <span className="text-[11px] text-white/50">Empaque Protegido</span>
            </div>
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <FiAward className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">Calidad Premium</span>
              <span className="text-[11px] text-white/50">Fijación Prolongada</span>
            </div>
            <div className="flex flex-col items-center space-y-1.5 p-2">
              <FiStar className="h-6 w-6 text-[#D4AF37]" />
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/90">Atención VIP</span>
              <span className="text-[11px] text-white/50">Asesoría Directa</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED PERFUMES AUTO-SLIDING CAROUSEL */}
      <section className="space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            pretitle="Selección Exclusiva"
            title="Fragancias Destacadas"
            children="Explora nuestro catálogo de perfumes seleccionados al azar. Desliza para descubrir más."
          />
        </div>

        {/* Carousel Container */}
        {perfumes.length > 0 ? (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Prev / Next Navigation Controls */}
            {maxIndex > 0 && (
              <div className="absolute -top-14 right-0 hidden items-center gap-2 md:flex">
                <button
                  onClick={handlePrev}
                  className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                  aria-label="Anterior"
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="rounded-full border border-white/20 bg-black/60 p-2.5 text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                  aria-label="Siguiente"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Overflow viewport */}
            <div className="overflow-hidden rounded-3xl py-3">
              <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
              >
                {perfumes.map((product) => (
                  <div
                    key={product.id}
                    className="w-full flex-shrink-0 px-3 sm:w-1/2 lg:w-1/3 xl:w-1/4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controls bar on mobile & Pagination Dots */}
            {maxIndex > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? 'w-7 bg-[#D4AF37]'
                          : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Ir al slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                  <button
                    onClick={handlePrev}
                    className="rounded-full border border-white/20 bg-white/5 p-2 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="rounded-full border border-white/20 bg-white/5 p-2 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    <FiChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center space-y-4">
            <FiShoppingBag className="h-10 w-10 text-[#D4AF37]/60" />
            <p className="text-sm text-white/70">
              {error || 'No hay perfumes disponibles por el momento.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default Home



