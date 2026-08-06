import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag } from 'react-icons/fi'

function ProductCard({ product }) {
  const discountedPrice = product.discount
    ? product.price - (product.price * product.discount) / 100
    : product.price

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.85)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[250px] md:h-[240px]"
        />
        {product.discount > 0 && (
          <div className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-2 text-xs uppercase tracking-[0.3em] text-black">
            -{product.discount}%
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
              <span className="text-xl font-semibold text-white">${discountedPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <span className="text-sm line-through text-white/40">${product.price}</span>
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
