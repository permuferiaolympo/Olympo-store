import { Link } from 'react-router-dom'
import { FiPlusCircle, FiPackage } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'

function Dashbard() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          pretitle="Panel administrativo"
          title="Gestión de Tienda"
          children="Administra tus productos, imágenes y configuración general de la tienda."
        />
        <div>
          <Link
            to="/dashboard/create-product"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.99]"
          >
            <FiPlusCircle size={18} />
            Crear Producto
          </Link>
        </div>
      </div>
      
      {/* TARJETA DESTACADA: CREAR NUEVO PRODUCTO */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-[2.5rem] border border-[#D4AF37]/40 bg-gradient-to-r from-black/90 via-[#18181b] to-black/90 p-8 sm:p-10 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(212,175,55,0.3)]">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-3 py-1 text-xs text-[#D4AF37] uppercase tracking-widest border border-[#D4AF37]/20">
            <FiPackage size={14} />
            Gestión de Inventario
          </div>
          <h3 className="text-2xl font-[TrajanPro] uppercase tracking-[0.14em] text-white">¿Nuevo perfume en el catálogo?</h3>
          <p className="text-sm text-white/70 max-w-xl">
            Sube la imagen directamente a Cloudflare R2, asigna precio, categoría y guarda la referencia en la base de datos de Supabase.
          </p>
        </div>
        <Link
          to="/dashboard/create-product"
          className="flex-shrink-0 flex items-center gap-3 rounded-full bg-[#D4AF37] px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-[#e2bd47]"
        >
          <FiPlusCircle size={18} />
          Agregar Producto
        </Link>
      </div>
    </div>
  )
}

export default Dashbard
