import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { FiShoppingBag } from 'react-icons/fi'
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
        <Link to="/catalog" className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] transition hover:text-[#D4AF37]/80">
          Volver al catálogo
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
            <button
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:scale-[1.01] disabled:opacity-50"
              disabled={product.stock <= 0}
            >
              <FiShoppingBag size={18} /> {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
            </button>
            <Link to="/catalog" className="block text-sm uppercase tracking-[0.3em] text-white/70 transition hover:text-[#D4AF37]">
              Volver al catálogo
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
