import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiChevronLeft, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { formatCopCurrency } from '../../lib/currency.js'

const WHATSAPP_NUMBER = '573043464284'

function Cart() {
  const { cartItems, subtotal, totalItems, updateQuantity, removeItem, validateCartStock } = useCart()
  const hasItems = cartItems.length > 0

  const handleCheckout = async () => {
    try {
      const stockIssues = await validateCartStock()
      if (stockIssues.length > 0) {
        toast.error(`Revisa el inventario de: ${stockIssues.map((item) => item.name).join(', ')}`)
        return
      }

      const items = cartItems
        .map((item) => `• ${item.name} × ${item.quantity} — ${formatCopCurrency(item.unitPrice * item.quantity)}`)
        .join('\n')
      const message = encodeURIComponent(`Hola, quiero confirmar este pedido en OLIMPO:\n\n${items}\n\n*Total: ${formatCopCurrency(subtotal)}*`)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener,noreferrer')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      <SectionHeader
        pretitle="Carrito de compras"
        title="Tu selección de fragancias"
        children="Prepara tu pedido premium antes de confirmar la experiencia OLIMPO."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)] lg:gap-10">
        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)] sm:space-y-5 sm:rounded-[2.5rem] sm:p-8">
          {!hasItems ? (
            <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/40 px-5 py-12 text-center text-white/70 sm:rounded-[2rem] sm:p-12">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]">
                <FiShoppingBag size={24} />
              </div>
              <p className="mt-5 text-lg font-semibold text-white">Tu carrito está vacío</p>
              <p className="mx-auto mt-3 max-w-sm text-sm">Descubre una fragancia que te acompañe y agrégala a tu selección.</p>
              <Link to="/catalog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110">
                Explorar catálogo <FiArrowRight size={15} />
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <article key={item.id} className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-black/40 p-4 transition hover:border-white/20 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:gap-5 sm:rounded-[2rem] sm:p-5">
                <Link to={`/product/${item.slug || item.id}`} className="mx-auto block w-fit sm:mx-0">
                  <img src={item.image} alt={item.name} className="h-28 w-28 rounded-[1.25rem] bg-white/5 object-contain p-1.5 sm:rounded-[1.5rem]" />
                </Link>
                <div className="min-w-0">
                  <Link to={`/product/${item.slug || item.id}`} className="block">
                    <h3 className="line-clamp-2 text-lg font-[TrajanPro] uppercase tracking-[0.08em] text-white transition hover:text-[#D4AF37] sm:text-xl sm:tracking-[0.12em]">{item.name}</h3>
                  </Link>
                  <p className="mt-1 text-xs text-white/55">{item.stock > 0 ? `${item.stock} unidades disponibles` : 'Sin disponibilidad'}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={item.quantity <= 1}
                        aria-label={`Disminuir cantidad de ${item.name}`}
                      >
                        <FiMinus size={14} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stock || 99}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                        className="w-11 bg-transparent px-1 py-1 text-center text-sm font-semibold text-white outline-none"
                        aria-label={`Cantidad de ${item.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={item.quantity >= item.stock}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-xs uppercase tracking-[0.16em] text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                    >
                      <FiTrash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4 text-left sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0 sm:text-right">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">Total</p>
                  <p className="mt-1 text-xl font-semibold text-white">{formatCopCurrency(item.unitPrice * item.quantity)}</p>
                  {item.discount > 0 && (
                    <p className="mt-1 text-xs text-[#D4AF37]/75">Ahorras {formatCopCurrency((item.originalPrice - item.unitPrice) * item.quantity)}</p>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="self-start rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)] sm:rounded-[2.5rem] sm:p-8 lg:sticky lg:top-24">
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#D4AF37]/70 sm:text-xs sm:tracking-[0.35em]">Resumen</p>
              <h2 className="mt-3 text-2xl font-[TrajanPro] uppercase tracking-[0.1em] text-white sm:text-3xl sm:tracking-[0.14em]">Orden premium</h2>
            </div>
            <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-black/40 p-5 text-white sm:rounded-[2rem] sm:p-6">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Productos</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{formatCopCurrency(subtotal)}</span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5 text-white">
              <span className="text-xs uppercase tracking-[0.2em] text-white/70 sm:text-sm sm:tracking-[0.3em]">Total estimado</span>
              <span className="whitespace-nowrap text-2xl font-semibold text-white">{formatCopCurrency(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#D4AF37] px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:scale-[1.01] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm sm:tracking-[0.28em]"
              disabled={!hasItems}
            >
              <FiShoppingBag size={17} /> Confirmar vía WhatsApp
            </button>
            <Link to="/catalog" className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-[#D4AF37]">
              <FiChevronLeft size={15} /> Seguir comprando
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Cart
