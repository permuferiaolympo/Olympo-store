import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useCart } from '../../context/CartContext.jsx'
import { formatCopCurrency } from '../../lib/currency.js'

function ProductCard({ product }) {
  const { addItem } = useCart()

  const basePrice = Number(product.price) || 0
  const discountPercent = Math.max(0, Number(product.discount) || 0)
  const hasDiscount = discountPercent > 0
  const discountedPrice = hasDiscount
    ? basePrice - (basePrice * discountPercent) / 100
    : basePrice
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
      className="group mx-auto flex h-full max-w-[360px] flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]"
    >
      <div className="relative overflow-hidden bg-black/5">
        <img
          src={imageSrc}
          alt={product.name || 'Producto'}
          className="h-[280px] w-full object-contain transition duration-500 group-hover:scale-[1.02] sm:h-[310px] md:h-[330px]"
        />
        {hasDiscount && (
          <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-2 text-xs uppercase tracking-[0.3em] text-white shadow-sm">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5 sm:p-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/80">{product.size || product.category?.name || 'Perfume'}</p>
          <Link
            to={`/product/${product.slug || product.id}`}
            className="mt-2 block text-xl font-[TrajanPro] uppercase tracking-[0.12em] text-white transition hover:text-[#D4AF37] sm:text-[1.2rem]"
          >
            {product.name}
          </Link>
        </div>
        <p className="text-sm leading-6 text-white/70">{product.description}</p>
        <div className="mt-auto flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Precio</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-white">{formatCopCurrency(discountedPrice)}</span>
              {hasDiscount && (
                <span className="text-sm line-through text-white/40">{formatCopCurrency(basePrice)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={`/product/${product.slug || product.id}`}
              className="rounded-full border border-[#D4AF37]/20 bg-white/5 px-3 py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] transition hover:border-[#D4AF37]/40 hover:bg-white/10"
            >
              Ver detalle
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37] text-black transition hover:scale-105"
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
