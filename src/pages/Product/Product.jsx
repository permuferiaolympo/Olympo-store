import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { FiShoppingBag, FiCloudSnow, FiUmbrella, FiWind, FiSunrise, FiSun, FiMoon } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { getPerfumeBySlug, getPerfumesByCategory } from '../../services/perfumeService.js'

function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const perfume = await getPerfumeBySlug(slug)
        setProduct(perfume)

        // Obtener relacionados de la misma categoría
        if (perfume?.category?.id) {
          const categoryPerfumes = await getPerfumesByCategory(perfume.category.id)
          setRelated(categoryPerfumes.filter((p) => p.id !== perfume.id))
        }
      } catch (err) {
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-xl text-white/60">Perfume no encontrado</p>
        <Link to="/" className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] transition hover:text-[#D4AF37]/80">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price

  return (
    <div className="space-y-14">
      <SectionHeader
        pretitle="Detalle del perfume"
        title={product.name}
        children={product.description}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          {product.gallery.length > 0 ? (
            <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="rounded-[2rem]">
              {product.gallery.map((image, index) => (
                <SwiperSlide key={`${product.id}-${index}`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="h-[420px] w-full rounded-[2rem] object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex h-[420px] items-center justify-center rounded-[2rem] bg-white/5">
              <p className="text-white/40">Sin imágenes disponibles</p>
            </div>
          )}
        </div>

        <div className="space-y-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="space-y-5">
            {product.brand && (
              <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#D4AF37]/90">
                {product.brand}
              </div>
            )}
            {product.characteristics && (
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">Características</p>
                <p className="text-sm leading-7 text-white/70">{product.characteristics}</p>
              </div>
            )}
            {product.category && (
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">Categoría</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                  {product.category.name}
                </span>
              </div>
            )}
            {product.notes?.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">Notas olfativas</p>
                    <p className="text-sm leading-7 text-white/70">Descubre los acordes que componen esta fragancia.</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {product.notes.map((note, index) => {
                    const noteName = typeof note === 'string' ? note : note.name || 'Nota'
                    const noteType = typeof note === 'string' ? '' : note.type || ''
                    return (
                      <div key={`${noteName}-${index}`} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70">{noteType || 'Nota'}</p>
                        <p className="mt-2 text-sm font-semibold text-white">{noteName}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">Precio</p>
              <div className="flex items-center gap-4">
                <span className="text-4xl font-semibold text-white">${discountedPrice.toFixed(0)}</span>
                {product.discount > 0 && (
                  <span className="text-sm line-through text-white/40">${product.price}</span>
                )}
              </div>
            </div>
            {product.stock !== undefined && (
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">
                {product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}
              </p>
            )}
          </div>
          <div className="space-y-5">
            <p className="text-sm leading-7 text-white/70">
              Perfume diseñado para quienes valoran la sofisticación en cada instante. Un equilibrio entre fuerza, elegancia y vigencia.
            </p>
            {product.usageData && Object.keys(product.usageData).length > 0 && (
              <div className="space-y-6 rounded-[2rem] border border-white/10 bg-black/20 p-5">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-[#D4AF37]/70">Uso recomendado</p>
                  <p className="text-sm leading-7 text-white/70">Intensidad y momentos del día con barras de progreso animadas.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'winter', label: 'Invierno', icon: FiCloudSnow, color: 'from-sky-400 to-blue-600' },
                    { key: 'spring', label: 'Primavera', icon: FiSunrise, color: 'from-emerald-400 to-lime-500' },
                    { key: 'summer', label: 'Verano', icon: FiUmbrella, color: 'from-orange-400 to-amber-500' },
                    { key: 'autumn', label: 'Otoño', icon: FiWind, color: 'from-amber-500 to-orange-600' },
                    { key: 'day', label: 'Día', icon: FiSun, color: 'from-yellow-400 to-orange-500' },
                    { key: 'night', label: 'Noche', icon: FiMoon, color: 'from-indigo-500 to-violet-600' },
                  ].map(({ key, label, icon: UsageIcon, color }) => {
                    const value = Number(product.usageData[key] ?? 0)
                    return (
                      <div key={key} className="space-y-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-[#D4AF37]">
                            <UsageIcon size={18} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]/70">{label}</p>
                            <p className="text-sm font-semibold text-white">{value}%</p>
                          </div>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                            style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <button
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:scale-[1.01] disabled:opacity-50"
              disabled={product.stock <= 0}
            >
              <FiShoppingBag size={18} /> {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
            <Link to="/" className="block text-sm uppercase tracking-[0.3em] text-white/70 transition hover:text-[#D4AF37]">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-8">
          <SectionHeader
            pretitle="También te puede interesar"
            title="Perfumes relacionados"
            children="Sugerencias cuidadas basadas en la intensidad y el carácter de tu elección."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {related.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/product/${item.slug}`} className="group">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-white transition group-hover:border-[#D4AF37]/20">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="mb-5 h-64 w-full rounded-[1.75rem] object-cover" />
                  )}
                  <h3 className="mb-3 text-2xl font-[TrajanPro] uppercase tracking-[0.14em] text-white">{item.name}</h3>
                  <p className="text-sm leading-7 text-white/70">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Product
