import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import ProductCard from '../../components/common/ProductCard.jsx'
import { getPerfumes } from '../../services/perfumeService.js'

const ITEMS_PER_PAGE = 10
const CATEGORY_FILTERS = [
  { value: 'all', label: 'Todos' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'hombre', label: 'Hombre' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'preparadas', label: 'Preparadas' },
]

const normalizeCategory = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()

function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getPerfumes()
        setProducts(data)
      } catch (error) {
        console.error('Error loading catalog:', error)
        setError('No fue posible cargar el catálogo. Intenta nuevamente más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Reset to first page when searching or changing category
  useEffect(() => {
    setCurrentPage(1)
  }, [search, categoryFilter])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const productCategory = normalizeCategory(product.category?.name)
      const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter
      if (!matchesCategory) return false
      if (!query) return true

      const haystack = [
        product.name,
        product.brand,
        product.description,
        product.category?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [products, search, categoryFilter])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 200, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(212,175,55,0.14),_rgba(0,0,0,0.25))] p-5 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.95)] sm:rounded-[2rem] sm:p-8 lg:p-10">
        <div className="text-center">
          <SectionHeader
            pretitle="Catálogo completo"
            title="Explora nuestra colección"
          />
        </div>

        <div className="mt-6">
          <label htmlFor="catalog-search" className="mb-2 block text-center text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
            Buscar perfume
          </label>
          <input
            id="catalog-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Busca por nombre, marca o descripción"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#D4AF37]/50 sm:rounded-full"
          />
        </div>

        <div className="mt-6">
          <p className="mb-6 text-center text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">Filtrar por categoría</p>
          <div className="mx-auto grid max-w-[280px] grid-cols-2 gap-2.5 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center">
            {CATEGORY_FILTERS.map((filter) => {
              const isActive = categoryFilter === filter.value

              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setCategoryFilter(filter.value)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-2 py-2 text-[9px] uppercase tracking-[0.14em] transition sm:px-4 sm:text-[10px] sm:tracking-[0.2em] ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.2)]'
                      : 'border-white/10 bg-white/5 text-white/65 hover:border-[#D4AF37]/50 hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-10 text-center text-white/70">
          <p className="text-lg text-white">{error}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="space-y-10">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
          >
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDescription={false} />
            ))}
          </motion.div>

          {/* Controls bar & Pagination buttons */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md sm:flex-row sm:justify-between sm:p-6 sm:text-left">
              <p className="text-xs uppercase tracking-[0.16em] text-white/50 sm:tracking-[0.2em]">
                Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} de {filteredProducts.length} productos
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Página anterior"
                >
                  <FiChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`h-10 min-w-10 rounded-full px-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Página siguiente"
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center text-white/70">
          <p className="text-lg text-white">No encontramos perfumes con ese criterio.</p>
          <p className="mt-2 text-sm">Prueba con otra palabra o vuelve más tarde.</p>
        </div>
      )}
    </div>
  )
}

export default Catalog

