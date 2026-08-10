import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FiPlusCircle,
  FiPackage,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiAlertTriangle,
  FiLoader,
  FiEdit2,
  FiStar,
  FiTrendingUp,
  FiEye,
  FiTrash2,
  FiX,
} from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { getAllPerfumesAdmin, deletePerfume } from '../../services/perfumeService.js'

const ITEMS_PER_PAGE = 10

function Dashbard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)

  // Eliminación
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await getAllPerfumesAdmin()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError('Error al cargar los productos.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Categorías únicas
  const categories = useMemo(() => {
    const cats = products
      .map((p) => p.category?.name)
      .filter(Boolean)
    return [...new Set(cats)]
  }, [products])

  // Stats rápidos
  const stats = useMemo(() => {
    const total = products.length
    const active = products.filter((p) => p.stock > 0).length
    const outOfStock = products.filter((p) => p.stock === 0).length
    const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length
    const featured = products.filter((p) => p.featured).length
    return { total, active, outOfStock, lowStock, featured }
  }, [products])

  // Filtrado + ordenamiento
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.brand?.toLowerCase().includes(term) ||
          p.category?.name?.toLowerCase().includes(term)
      )
    }

    // Filtro categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((p) => p.category?.name === categoryFilter)
    }

    // Filtro stock
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter((p) => p.stock > 5)
    } else if (stockFilter === 'low-stock') {
      filtered = filtered.filter((p) => p.stock > 0 && p.stock <= 5)
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter((p) => p.stock === 0)
    }

    // Ordenar
    filtered.sort((a, b) => {
      let valA, valB
      switch (sortField) {
        case 'name':
          valA = (a.name || '').toLowerCase()
          valB = (b.name || '').toLowerCase()
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA)
        case 'price':
          valA = a.price || 0
          valB = b.price || 0
          break
        case 'stock':
          valA = a.stock ?? 0
          valB = b.stock ?? 0
          break
        default:
          valA = new Date(a.created_at || 0).getTime()
          valB = new Date(b.created_at || 0).getTime()
      }
      if (sortField !== 'name') {
        return sortAsc ? valA - valB : valB - valA
      }
      return 0
    })

    return filtered
  }, [products, searchTerm, categoryFilter, stockFilter, sortField, sortAsc])

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter, stockFilter, sortField, sortAsc])

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  function handleSort(field) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await deletePerfume(deleteTarget.id)
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
      alert(err.message || 'Error al eliminar el producto.')
    } finally {
      setDeleting(false)
    }
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <FiChevronDown className="inline ml-1 opacity-30" size={14} />
    return sortAsc ? (
      <FiChevronUp className="inline ml-1 text-[#D4AF37]" size={14} />
    ) : (
      <FiChevronDown className="inline ml-1 text-[#D4AF37]" size={14} />
    )
  }

  function StockBadge({ stock }) {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          Agotado
        </span>
      )
    }
    if (stock <= 5) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Bajo ({stock})
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {stock} uds
      </span>
    )
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-12 pb-8">
      {/* ── Encabezado Panel Administrativo ── */}
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

      {/* ── Stats Cards ── */}
      {!loading && !error && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: 'Total', value: stats.total, icon: FiPackage, color: 'from-white/5 to-white/[0.02]', textColor: 'text-white' },
            { label: 'Con stock', value: stats.active, icon: FiTrendingUp, color: 'from-emerald-500/10 to-emerald-500/[0.02]', textColor: 'text-emerald-400' },
            { label: 'Agotados', value: stats.outOfStock, icon: FiAlertTriangle, color: 'from-red-500/10 to-red-500/[0.02]', textColor: 'text-red-400' },
            { label: 'Stock bajo', value: stats.lowStock, icon: FiAlertTriangle, color: 'from-amber-500/10 to-amber-500/[0.02]', textColor: 'text-amber-400' },
            { label: 'Destacados', value: stats.featured, icon: FiStar, color: 'from-[#D4AF37]/10 to-[#D4AF37]/[0.02]', textColor: 'text-[#D4AF37]' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br ${stat.color} p-5 transition-all duration-300 hover:border-white/10 hover:shadow-lg hover:shadow-black/20`}
            >
              <div className="absolute -right-3 -top-3 opacity-[0.04] transition-opacity group-hover:opacity-[0.08]">
                <stat.icon size={64} />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
              <p className={`mt-1 text-3xl font-bold tracking-tight ${stat.textColor}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabla de Productos ── */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl shadow-black/30">
        {/* Header de la tabla con filtros */}
        <div className="border-b border-white/[0.06] px-6 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <FiPackage className="text-[#D4AF37]" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-wide text-white">Inventario de productos</h3>
                <p className="text-xs text-white/40">
                  {filteredProducts.length} de {products.length} productos
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Búsqueda */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  id="search-products"
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-[#D4AF37]/40 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)] sm:w-64"
                />
              </div>

              {/* Filtro de categoría */}
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-[#D4AF37]/40 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgba(255,255,255,0.3)'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
              >
                <option value="all" className="bg-[#18181b] text-white">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#18181b] text-white">{cat}</option>
                ))}
              </select>

              {/* Filtro de stock */}
              <select
                id="filter-stock"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white/80 outline-none transition-all focus:border-[#D4AF37]/40 cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='rgba(255,255,255,0.3)'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px', paddingRight: '36px' }}
              >
                <option value="all" className="bg-[#18181b] text-white">Todo stock</option>
                <option value="in-stock" className="bg-[#18181b] text-white">En stock</option>
                <option value="low-stock" className="bg-[#18181b] text-white">Stock bajo</option>
                <option value="out-of-stock" className="bg-[#18181b] text-white">Agotado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estado de carga */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <FiLoader className="animate-spin text-[#D4AF37]" size={32} />
            <p className="text-sm text-white/40">Cargando productos...</p>
          </div>
        )}

        {/* Estado de error */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <FiAlertTriangle className="text-red-400" size={32} />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <FiPackage className="text-white/20" size={48} />
            <div className="text-center">
              <p className="text-sm font-medium text-white/60">No se encontraron productos</p>
              <p className="mt-1 text-xs text-white/30">Intenta cambiar los filtros o crea un producto nuevo.</p>
            </div>
            <Link
              to="/dashboard/create-product"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
            >
              <FiPlusCircle size={14} />
              Crear producto
            </Link>
          </div>
        )}

        {/* Tabla */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Producto
                  </th>
                  <th className="hidden px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 md:table-cell">
                    Categoría
                  </th>
                  <th
                    className="cursor-pointer px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 transition hover:text-white/60"
                    onClick={() => handleSort('price')}
                  >
                    Precio <SortIcon field="price" />
                  </th>
                  <th
                    className="cursor-pointer px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 transition hover:text-white/60"
                    onClick={() => handleSort('stock')}
                  >
                    Stock <SortIcon field="stock" />
                  </th>
                  <th className="hidden px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 lg:table-cell">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, idx) => (
                  <tr
                    key={product.id}
                    className={`group border-b border-white/[0.03] transition-colors duration-200 hover:bg-white/[0.03] ${
                      idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                    }`}
                  >
                    {/* Producto */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04]">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <FiPackage className="text-white/20" size={18} />
                            </div>
                          )}
                          {product.discount > 0 && (
                            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                              %
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-white group-hover:text-[#D4AF37] transition-colors duration-200">
                            {product.name}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-white/40">
                            {product.brand || 'Sin marca'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="hidden px-6 py-4 md:table-cell">
                      {product.category?.name ? (
                        <span className="inline-flex rounded-lg bg-white/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60">
                          {product.category.name}
                        </span>
                      ) : (
                        <span className="text-xs text-white/20">—</span>
                      )}
                    </td>

                    {/* Precio */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        {product.discount > 0 ? (
                          <>
                            <span className="text-sm font-semibold text-white">
                              {formatPrice(product.price * (1 - product.discount / 100))}
                            </span>
                            <span className="text-xs text-white/30 line-through">
                              {formatPrice(product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-white">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <StockBadge stock={product.stock ?? 0} />
                    </td>

                    {/* Estado */}
                    <td className="hidden px-6 py-4 lg:table-cell">
                      <div className="flex items-center gap-2">
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
                            <FiStar size={10} />
                            Destacado
                          </span>
                        )}
                        {product.new_arrival && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                            Nuevo
                          </span>
                        )}
                        {!product.featured && !product.new_arrival && (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/dashboard/edit-product/${product.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/50 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                          title="Editar producto"
                        >
                          <FiEdit2 size={15} />
                        </Link>
                        <Link
                          to={`/product/${product.slug}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/50 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                          title="Ver producto"
                        >
                          <FiEye size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/50 transition-all duration-200 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                          title="Eliminar producto"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 border-t border-white/[0.06] px-6 py-4 sm:flex-row sm:justify-between">
              <p className="text-xs text-white/40">
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/50 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Página anterior"
                >
                  <FiChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 7) return true
                    if (page === 1 || page === totalPages) return true
                    if (Math.abs(page - currentPage) <= 1) return true
                    return false
                  })
                  .reduce((acc, page, i, arr) => {
                    if (i > 0 && page - arr[i - 1] > 1) {
                      acc.push('ellipsis-' + page)
                    }
                    acc.push(page)
                    return acc
                  }, [])
                  .map((item) => {
                    if (typeof item === 'string') {
                      return (
                        <span key={item} className="px-1 text-xs text-white/20">
                          ···
                        </span>
                      )
                    }
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCurrentPage(item)}
                        className={`flex h-9 min-w-[36px] items-center justify-center rounded-xl text-xs font-medium transition-all duration-200 ${
                          currentPage === item
                            ? 'border border-[#D4AF37]/40 bg-[#D4AF37]/15 text-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                            : 'border border-white/[0.06] bg-white/[0.04] text-white/50 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-white/50 transition-all duration-200 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Página siguiente"
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* ── Modal de Confirmación de Eliminación ── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1a1a1d] shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                  <FiAlertTriangle className="text-red-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white">Eliminar producto</h3>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.06] hover:text-white/60 disabled:opacity-30"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.04]">
                  {deleteTarget.image ? (
                    <img
                      src={deleteTarget.image}
                      alt={deleteTarget.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FiPackage className="text-white/20" size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{deleteTarget.name}</p>
                  <p className="text-xs text-white/40">{deleteTarget.brand || 'Sin marca'}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/50">
                ¿Estás seguro de que deseas eliminar este producto? Esta acción es <span className="font-semibold text-red-400">irreversible</span> y se eliminarán todas las imágenes asociadas.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/60 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-30"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-500/25 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <FiLoader className="animate-spin" size={14} />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={14} />
                    Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe para la animación del modal */}
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Dashbard
