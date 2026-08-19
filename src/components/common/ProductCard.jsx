import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext.jsx'
import { formatCopCurrency } from '../../lib/currency.js'
import { getDiscountPercentage, getEffectivePrice } from '../../lib/pricing.js'

function ProductCard({ product, showDescription = true }) {
  const { addItem } = useCart()

  const basePrice = Number(product.price) || 0
  const discountPercent = getDiscountPercentage(product)
  const hasDiscount = discountPercent > 0
  const discountedPrice = getEffectivePrice(product)
  const imageSrc = product.image && typeof product.image === 'string' && product.image.trim()
    ? product.image
    : 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"%3E%3Crect width="600" height="600" fill="%23111111"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="32" fill="%23D4AF37"%3EImagen no disponible%3C/text%3E%3C/svg%3E'

  const handleAddToCart = () => {
    addItem(product, 1)
    toast.success(`Se agregó ${product.name} al carrito`)
  }

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="group mx-auto flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]"
    >
      <div className="relative overflow-hidden bg-black/5">
        <img
          src={imageSrc}
          alt={product.name || 'Producto'}
          className="h-[180px] w-full object-contain p-2 transition duration-500 group-hover:scale-[1.02] sm:h-[290px] sm:p-3 lg:h-[320px]"
        />
        {hasDiscount && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-3 sm:p-6">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37]/80 sm:text-[10px] sm:tracking-[0.28em]">{product.size || product.category?.name || 'Perfume'}</p>
          <Link
            to={`/product/${product.slug || product.id}`}
            className="mt-2 block line-clamp-2 text-sm font-[TrajanPro] uppercase tracking-[0.06em] text-white transition hover:text-[#D4AF37] sm:text-xl sm:tracking-[0.12em]"
          >
            {product.name}
          </Link>
        </div>
        {showDescription && (
          <p className="min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-white/70">
            {product.description || 'Descripción disponible al ver el detalle del producto.'}
          </p>
        )}
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-white/60 sm:text-[11px] sm:tracking-[0.22em]">Precio</p>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white sm:text-xl">{formatCopCurrency(discountedPrice)}</span>
              {hasDiscount && (
                <span className="text-xs line-through text-white/40 sm:text-sm">{formatCopCurrency(basePrice)}</span>
              )}
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:gap-3">
            <Link
              to={`/product/${product.slug || product.id}`}
              className="flex-1 whitespace-nowrap rounded-full border border-[#D4AF37]/20 bg-white/5 px-2 py-2.5 text-center text-[8px] uppercase tracking-[0.12em] text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-white/10 sm:px-3 sm:text-[10px] sm:tracking-[0.2em]"
            >
              Ver detalle
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37] text-black transition hover:scale-105 sm:h-10 sm:w-10"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <FiShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
