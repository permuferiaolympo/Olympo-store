import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

function ProductCard({ product }) {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price

  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_40px_120px_-70px_rgba(0,0,0,0.8)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        {product.discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-2 text-xs uppercase tracking-[0.3em] text-black">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]/80">{product.size}</p>
          <Link
            to={`/product/${product.slug || product.id}`}
            className="mt-2 block text-2xl font-[TrajanPro] uppercase tracking-[0.14em] text-white transition hover:text-[#D4AF37]"
          >
            {product.name}
          </Link>
        </div>
        <p className="text-sm leading-6 text-white/70">{product.description}</p>
        <div className="flex items-center justify-between gap-4 pt-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-white/60">Precio</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-white">${discountedPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <span className="text-sm line-through text-white/40">${product.price}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#D4AF37] text-black transition hover:scale-105"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <FiShoppingBag size={18} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
