import { Link } from 'react-router-dom'
import { FiPlusCircle, FiPackage, FiShoppingBag, FiUsers, FiSliders, FiStar } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'

function Dashbard() {
  const stats = [
    { label: 'Productos activos', value: '24', icon: FiShoppingBag, accent: 'from-[#D4AF37] to-[#AA7C11]' },
    { label: 'Pedidos recientes', value: '8', icon: FiStar, accent: 'from-[#6d28d9] to-[#2563eb]' },
    { label: 'Usuarios registrados', value: '136', icon: FiUsers, accent: 'from-[#0ea5e9] to-[#14b8a6]' },
  ]

  const quickActions = [
    {
      title: 'Crear producto',
      description: 'Agrega un nuevo perfume al catálogo con todas sus notas e imágenes.',
      href: '/dashboard/create-product',
      icon: FiPlusCircle,
    },
    {
      title: 'Ver catálogo',
      description: 'Revisa los productos actuales y asegúrate de que todo esté activo.',
      href: '/catalog',
      icon: FiPackage,
    },
    {
      title: 'Configuración',
      description: 'Ajusta detalles de la tienda y controla opciones globales.',
      href: '/settings',
      icon: FiSliders,
    },
  ]

  return (
    <div className="space-y-12 pb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SectionHeader
          pretitle="Panel administrativo"
          title="Panel de control"
          children="Gestiona productos, pedidos y ajustes de la tienda desde un mismo lugar."
        />
        <Link
          to="/dashboard/create-product"
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-6 py-4 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(212,175,55,0.2)] transition hover:brightness-110 active:scale-[0.99]"
        >
          <FiPlusCircle size={18} />
          Crear Producto
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]"
            >
              <div className={`inline-flex items-center justify-center rounded-3xl bg-gradient-to-br ${item.accent} p-4 text-black shadow-[0_12px_40px_rgba(0,0,0,0.18)]`}>
                <Icon size={22} />
              </div>
              <p className="mt-6 text-sm uppercase tracking-[0.25em] text-[#D4AF37]/90">{item.label}</p>
              <p className="mt-3 text-4xl font-semibold text-white">{item.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-80px_rgba(0,0,0,0.8)]">
          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/80">Resumen rápido</p>
              <h2 className="mt-4 text-3xl font-[TrajanPro] uppercase tracking-[0.14em] text-white">Estado de la tienda</h2>
            </div>
            <div className="inline-flex items-center rounded-3xl border border-white/10 bg-[#D4AF37]/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#D4AF37]">
              Actualizado ahora
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/80">Ventas pendientes</p>
              <p className="mt-3 text-3xl font-semibold text-white">3</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Revisa las órdenes en espera de confirmación.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-black/60 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37]/80">Productos sin stock</p>
              <p className="mt-3 text-3xl font-semibold text-white">4</p>
              <p className="mt-2 text-sm leading-6 text-white/70">Identifica rápidamente lo que necesita reabastecimiento.</p>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]/80">Comentarios</p>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Aquí podrás añadir notas, instrucciones o datos básicos sobre la siguiente versión del panel administrativo.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group block rounded-[2rem] border border-white/10 bg-white/5 p-6 transition hover:border-[#D4AF37]/30 hover:bg-[#111111]"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-[#D4AF37]/10 text-[#D4AF37] transition group-hover:bg-[#D4AF37] group-hover:text-black">
                  <Icon size={22} />
                </div>
                <h3 className="mt-6 text-xl font-semibold uppercase tracking-[0.14em] text-white transition group-hover:text-[#D4AF37]">
                  {action.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{action.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashbard
