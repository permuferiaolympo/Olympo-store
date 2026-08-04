import { FiStar, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi'

export default function ProductImageGallery({ images, onSetMain, onDelete, onMove }) {
  if (!images || images.length === 0) return null

  return (
    <div className="space-y-3">
      <h4 className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
        Imágenes del producto ({images.length})
      </h4>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, index) => (
          <div
            key={img.id || img.url || index}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${
              img.is_main
                ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                : 'border-white/10 bg-black/60 hover:border-white/20'
            }`}
          >
            {/* Tag de Imagen Principal */}
            {img.is_main && (
              <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
                <FiStar size={12} className="fill-black" />
                Principal
              </div>
            )}

            {/* Preview de la Imagen */}
            <div className="relative h-44 w-full overflow-hidden bg-black/40 p-2">
              <img
                src={img.url}
                alt={`Vista previa ${index + 1}`}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between border-t border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-1">
                {/* Marcar como Principal */}
                {!img.is_main && (
                  <button
                    type="button"
                    onClick={() => onSetMain(index)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-[#D4AF37]"
                    title="Establecer como imagen principal"
                  >
                    <FiStar size={14} />
                    <span>Hacer Principal</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Reordenar */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => onMove(index, index - 1)}
                    className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                    title="Mover arriba"
                  >
                    <FiArrowUp size={14} />
                  </button>
                )}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => onMove(index, index + 1)}
                    className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
                    title="Mover abajo"
                  >
                    <FiArrowDown size={14} />
                  </button>
                )}

                {/* Eliminar */}
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="rounded-lg p-1.5 text-red-400/70 hover:bg-red-500/20 hover:text-red-400"
                  title="Eliminar imagen"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
