import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheckCircle, FiShoppingBag, FiCloudSnow, FiUmbrella, FiWind, FiSunrise, FiSun, FiMoon, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { getPerfumeBySlug, getPerfumesByCategory } from '../../services/perfumeService.js'
import { formatCopCurrency } from '../../lib/currency.js'
import { getDiscountPercentage, getEffectivePrice } from '../../lib/pricing.js'

function groupOlfactiveNotes(notes) {
  const groups = [
    { key: 'top', label: 'Salida', notes: [] },
    { key: 'heart', label: 'Corazón', notes: [] },
    { key: 'base', label: 'Fondo', notes: [] },
    { key: 'other', label: 'Otros', notes: [] },
  ]
  let currentGroup = groups[3]

  for (const rawNote of notes) {
    const note = String(rawNote || '').trim()
    if (!note) continue

    const sectionMatch = note.match(/^(salida|corazon|corazón|fondo)\s*:\s*(.*)$/i)
    if (sectionMatch) {
      const section = sectionMatch[1].toLowerCase()
      currentGroup = section === 'salida'
        ? groups[0]
        : section === 'fondo'
          ? groups[2]
          : groups[1]
      if (sectionMatch[2].trim()) currentGroup.notes.push(sectionMatch[2].trim())
      continue
    }

    currentGroup.notes.push(note)
  }

  return groups.filter((group) => group.notes.length > 0)
}

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
  const olfactiveNoteGroups = groupOlfactiveNotes(product.notes || [])

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
    <div className="space-y-8 sm:space-y-12">
      <div className="space-y-5">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D4AF37]"
        >
          <FiArrowLeft size={15} /> Volver al catálogo
        </Link>
        <SectionHeader pretitle="Detalle del perfume" title={product.name}>
          Conoce todos los detalles de esta fragancia y elige la cantidad ideal para tu pedido.
        </SectionHeader>
        <div className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent" />
      </div>

      <div className="grid gap-5 sm:gap-8 lg:grid-cols-12 lg:items-start">
        {/* Columna de Galería / Imagen (5 cols) */}
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.14),_rgba(0,0,0,0.7)_62%)] p-3 sm:rounded-[2.5rem] sm:p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
            {hasGallery ? (
              <div className="relative flex h-[260px] w-full items-center justify-center sm:h-[380px]">
                <img
                  src={currentImage}
                  alt={`${product.name} - Imagen ${selectedImageIndex + 1}`}
                  className="h-full w-full rounded-2xl object-contain p-2 transition-all duration-300 hover:scale-[1.02]"
                />
                {product.images?.[selectedImageIndex]?.is_main && (
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
                    <FiStar size={11} className="fill-black" />
                    Principal
                  </div>
                )}
                {product.gallery.length > 1 && (
                  <span className="absolute bottom-2 right-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
                    {selectedImageIndex + 1} / {product.gallery.length}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex h-[260px] items-center justify-center rounded-[1.5rem] bg-white/5 sm:h-[380px] sm:rounded-[2rem]">
                <p className="text-white/40">Sin imágenes disponibles</p>
              </div>
            )}
          </div>

          {/* Selector de Miniaturas (Thumbnails) */}
          {hasGallery && product.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {product.gallery.map((imgUrl, idx) => (
                <button
                  key={`${product.id}-thumb-${idx}`}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`group relative h-20 overflow-hidden rounded-xl border transition-all duration-300 sm:h-24 sm:rounded-2xl ${
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
        <div className="space-y-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:space-y-8 sm:rounded-[2.5rem] sm:p-10 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {product.brand ? (
              <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/90 sm:text-xs sm:tracking-[0.35em]">
                {product.brand}
              </div>
            ) : <span />}
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${product.stock > 0 ? 'bg-emerald-400/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
              <FiCheckCircle size={13} /> {product.stock > 0 ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <div className="space-y-5">

            {/* Precio */}
            <div className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Precio</p>
                {hasDiscount && (
                  <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-red-300">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-3xl font-bold text-white sm:text-4xl">{formatCopCurrency(discountedPrice)}</span>
                {hasDiscount && (
                  <span className="text-base line-through text-white/40">{formatCopCurrency(product.price)}</span>
                )}
              </div>
              {product.stock !== undefined && (
                <p className="pt-2 text-xs uppercase tracking-[0.2em] text-white/50 sm:tracking-[0.25em]">
                  {product.stock > 0 ? `${product.stock} unidades en stock` : 'Agotado'}
                </p>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]/80">Descripción</p>
                {product.category && (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/65">
                    {product.category.name}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                {product.description || 'La descripción de esta fragancia estará disponible próximamente.'}
              </p>
              {product.notes?.length > 0 && (
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]/60">Notas olfativas</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {olfactiveNoteGroups.map((group) => (
                      <div key={group.key} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                          {group.label}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {group.notes.map((note, index) => (
                            <li key={`${group.key}-${note}-${index}`} className="flex items-start gap-2 text-sm text-white/75">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4AF37]" />
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-white/10">
            {Object.keys(usage).length > 0 && (
              <div className="space-y-5 rounded-[2rem] border border-white/10 bg-black/30 p-5">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70 font-semibold">Uso recomendado</p>
                  <p className="text-xs text-white/60">Intensidad y momentos del día.</p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
              <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/40 px-4 py-3">
                <label className="text-xs uppercase tracking-[0.18em] text-white/60 sm:tracking-[0.25em]">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  aria-label="Cantidad del producto"
                />
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex w-full flex-1 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 sm:w-auto sm:px-8 sm:tracking-[0.28em]"
                  disabled={product.stock <= 0}
                >
                  <FiShoppingBag size={18} /> {product.stock > 0 ? 'Agregar al carrito' : 'Agotado'}
                </button>
                <Link
                  to="/catalog"
                  className="text-center text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D4AF37] sm:text-left sm:tracking-[0.25em]"
                >
                  Seguir explorando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-6 pt-4 sm:space-y-8 sm:pt-8">
          <SectionHeader pretitle="También te puede interesar" title="Perfumes relacionados">
            Sugerencias cuidadas basadas en la categoría de tu elección.
          </SectionHeader>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {related.slice(0, 3).map((item) => (
              <Link key={item.id} to={`/product/${item.slug}`} className="group">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-white transition group-hover:border-[#D4AF37]/20 sm:rounded-[2rem] sm:p-6">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="mb-5 h-56 w-full rounded-[1.75rem] object-contain bg-black/30 p-2" />
                  )}
                  <h3 className="mb-3 line-clamp-2 text-lg font-[TrajanPro] uppercase tracking-[0.1em] text-white sm:text-xl sm:tracking-[0.14em]">{item.name}</h3>
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
