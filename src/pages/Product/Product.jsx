import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiShoppingBag, FiCloudSnow, FiUmbrella, FiWind, FiSunrise, FiSun, FiMoon, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { getPerfumeBySlug, getPerfumesByCategory } from '../../services/perfumeService.js'
import { formatCopCurrency } from '../../lib/currency.js'
import { getDiscountPercentage, getEffectivePrice } from '../../lib/pricing.js'

function Product() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      setError(null)
      try {
        const perfume = await getPerfumeBySlug(slug)
        setProduct(perfume)
        setSelectedImageIndex(0)

        // Obtener relacionados de la misma categoría
        if (perfume?.category?.id) {
          const categoryPerfumes = await getPerfumesByCategory(perfume.category.id)
          setRelated(categoryPerfumes.filter((p) => p.id !== perfume.id))
        }
      } catch (err) {
        console.error('Error loading product:', err)
        setError('No fue posible cargar este perfume. Intenta nuevamente más tarde.')
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
        <p className="text-xl text-white/60">{error || 'Perfume no encontrado'}</p>
        <Link to="/" className="text-sm uppercase tracking-[0.3em] text-[#D4AF37] transition hover:text-[#D4AF37]/80">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const discountPercentage = getDiscountPercentage(product)
  const discountedPrice = getEffectivePrice(product)
  const hasDiscount = discountPercentage > 0

  const hasGallery = Array.isArray(product.gallery) && product.gallery.length > 0
  const currentImage = hasGallery
    ? product.gallery[selectedImageIndex] || product.gallery[0]
    : product.image || null

  const safeQuantity = Math.max(1, Math.min(quantity, product.stock || 999))

  // Normalize usage data here in case it's stored as a JSON string in the DB
  const usage = (() => {
    if (!product?.usageData) return {}
    if (typeof product.usageData === 'string') {
      try {
        return JSON.parse(product.usageData)
      } catch (err) {
        return {}
      }
    }
    return product.usageData || {}
  })()

  const handleAddToCart = () => {
    addItem(product, safeQuantity)
    toast.success(`Se agregó ${safeQuantity} unidad${safeQuantity > 1 ? 'es' : ''} de ${product.name} al carrito`)
  }

  return (
    <div className="space-y-12">
      <SectionHeader
        pretitle="Detalle del perfume"
        title={product.name}
        children={product.description}
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        {/* Columna de Galería / Imagen (5 cols) */}
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-black/60 p-4 sm:p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
            {hasGallery ? (
              <div className="relative flex h-[320px] sm:h-[380px] w-full items-center justify-center">
                <img
                  src={currentImage}
                  alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                  className="h-full w-full object-contain rounded-2xl transition-all duration-300"
                />
                {product.images?.[selectedImageIndex]?.is_main && (
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                    <FiStar size={11} className="fill-black" />
                    Principal
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-[320px] sm:h-[380px] items-center justify-center rounded-[2rem] bg-white/5">
                <p className="text-white/40">Sin imágenes disponibles</p>
              </div>
            )}
          </div>

          {/* Selector de Miniaturas (Thumbnails) */}
          {hasGallery && product.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`group relative h-24 overflow-hidden rounded-2xl border transition-all duration-300 ${
                    selectedImageIndex === idx
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 ring-2 ring-[#D4AF37]/40 scale-[1.02]'
                      : 'border-white/10 bg-black/40 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Vista previa ${idx + 1}`}
                    className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.images?.[idx]?.is_main && (
                    <span className="absolute right-1.5 top-1.5 rounded-full bg-[#D4AF37] p-1 text-black">
                      <FiStar size={9} className="fill-black" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna de Información del Producto (7 cols) */}
        <div className="space-y-8 rounded-[2.5rem] border border-white/10 bg-white/5 p-6 sm:p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)] lg:col-span-7">
          <div className="space-y-5">
            {product.brand && (
              <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#D4AF37]/90">
                {product.brand}
              </div>
            )}

            {/* Precio */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Precio</p>
                {hasDiscount && (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-red-300">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">{formatCopCurrency(discountedPrice)}</span>
                {hasDiscount && (
                  <span className="text-base line-through text-white/40">{formatCopCurrency(product.price)}</span>
                )}
              </div>
              {product.stock !== undefined && (
                <p className="pt-1 text-xs uppercase tracking-[0.25em] text-white/50">
                  {product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}
                </p>
              )}
            </div>

            {/* Categoría */}
            {product.category && (
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Categoría</p>
                <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-white/70">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Características */}
            {product.characteristics && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Notas Olfativas / Características</p>
                <p className="text-sm leading-7 text-white/80">{product.characteristics}</p>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-4 border-t border-white/10">
            {Object.keys(usage).length > 0 && (
              <div className="space-y-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Uso recomendado</p>
                  <p className="text-xs text-white/60">Intensidad y momentos del día.</p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {[
                    { key: 'winter', label: 'Invierno', icon: FiCloudSnow, color: 'from-sky-400 to-blue-600' },
                    { key: 'spring', label: 'Primavera', icon: FiSunrise, color: 'from-emerald-400 to-lime-500' },
                    { key: 'summer', label: 'Verano', icon: FiUmbrella, color: 'from-orange-400 to-amber-500' },
                    { key: 'autumn', label: 'Otoño', icon: FiWind, color: 'from-amber-500 to-orange-600' },
                    { key: 'day', label: 'Día', icon: FiSun, color: 'from-yellow-400 to-orange-500' },
                    { key: 'night', label: 'Noche', icon: FiMoon, color: 'from-indigo-500 to-violet-600' },
                  ].map(({ key, label, icon: UsageIcon, color }) => {
                    const value = Number(usage[key] ?? 0)
                    if (!value) return null

                    return (
                      <div key={key} className="flex flex-col items-center gap-2 rounded-[1rem] bg-white/5 py-3 px-2 text-center">
                        <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 text-[#D4AF37]"><UsageIcon size={20} /></div>
                        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#D4AF37]/80">{label}</p>

                        <div className="mt-2 w-full">
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                              style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
                            />
                          </div>
                          <p className="mt-2 text-sm font-semibold text-white">{value}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/40 px-4 py-3">
                <label className="text-xs uppercase tracking-[0.25em] text-white/60">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-8 py-4 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
                  disabled={product.stock <= 0}
                >
                  <FiShoppingBag size={18} /> {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>
                <Link
                  to="/"
                  className="text-xs uppercase tracking-[0.25em] text-white/60 transition hover:text-[#D4AF37]"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-8 pt-8">
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
                    <img src={item.image} alt={item.name} className="mb-5 h-56 w-full rounded-[1.75rem] object-contain bg-black/30 p-2" />
                  )}
                  <h3 className="mb-3 text-xl font-[TrajanPro] uppercase tracking-[0.14em] text-white">{item.name}</h3>
                  <p className="text-xs leading-6 text-white/70 line-clamp-2">{item.description}</p>
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
