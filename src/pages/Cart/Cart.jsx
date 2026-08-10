import { useMemo } from 'react'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { useCart } from '../../context/CartContext.jsx'

function Cart() {
  const { cartItems, subtotal, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const hasItems = cartItems.length > 0

  const formattedTotal = useMemo(() => subtotal.toFixed(0), [subtotal])

  return (
    <div className="space-y-14">
      <SectionHeader
        pretitle="Carrito de compras"
        title="Tu selección de fragancias"
        children="Prepara tu pedido premium antes de confirmar la experiencia OLIMPO."
      />

      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          {!hasItems ? (
            <div className="rounded-[2rem] border border-white/10 bg-black/40 p-10 text-center text-white/70">
              <p className="text-lg font-semibold text-white">Tu carrito está vacío</p>
              <p className="mt-3 text-sm">Agrega productos desde su detalle para verlos aquí.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-black/40 p-5 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-28 w-28 rounded-[1.5rem] object-cover" />
                <div className="flex-1">
                  <h3 className="text-xl font-[TrajanPro] uppercase tracking-[0.12em] text-white">{item.name}</h3>
                  <p className="text-sm leading-6 text-white/70">Cantidad</p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      max={item.stock || 99}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value) || 1)}
                      className="w-20 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-center text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-red-300 transition hover:bg-red-500/20"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">${item.unitPrice.toFixed(0)}</p>
                  {item.discount > 0 && (
                    <p className="text-xs line-through text-white/40">${item.originalPrice.toFixed(0)}</p>
                  )}
                  <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">Total ${ (item.unitPrice * item.quantity).toFixed(0) }</p>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Resumen</p>
              <h2 className="mt-3 text-3xl font-[TrajanPro] uppercase tracking-[0.14em] text-white">Orden premium</h2>
            </div>
            <div className="space-y-3 rounded-[2rem] border border-white/10 bg-black/40 p-6 text-white">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Productos</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(0)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Envío</span>
                <span>Premium</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <span className="text-sm uppercase tracking-[0.3em] text-white/70">Total estimado</span>
              <span className="text-2xl font-semibold text-white">${formattedTotal}</span>
            </div>
            <button
              type="button"
              className="w-full rounded-full bg-[#D4AF37] px-6 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!hasItems}
            >
              Confirmar vía WhatsApp
            </button>
            <p className="text-xs leading-6 text-white/60">
              El botón está preparado para iniciar la orden por WhatsApp cuando integramos la lógica de envío.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Cart
