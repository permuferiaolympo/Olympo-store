import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import ProductCard from '../../components/common/ProductCard.jsx'
import { getPerfumes } from '../../services/perfumeService.js'

function Catalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getPerfumes()
        setProducts(data)
      } catch (error) {
        console.error('Error loading catalog:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products

    return products.filter((product) => {
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
  }, [products, search])

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,_rgba(212,175,55,0.14),_rgba(0,0,0,0.25))] p-6 shadow-[0_30px_90px_-60px_rgba(0,0,0,0.95)] sm:p-8 lg:p-10">
        <SectionHeader
          pretitle="Catálogo completo"
          title="Explora nuestra colección"
          children="Encuentra fragancias premium con una experiencia visual limpia, rápida y adaptada a cualquier dispositivo."
        />

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <label htmlFor="catalog-search" className="mb-2 block text-xs uppercase tracking-[0.3em] text-[#D4AF37]/80">
              Buscar perfume
            </label>
            <input
              id="catalog-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busca por nombre, marca o nota"
              className="w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none ring-0 transition focus:border-[#D4AF37]/50"
            />
          </div>
          <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-3 text-sm text-[#D4AF37]">
            {filteredProducts.length} productos
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
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
