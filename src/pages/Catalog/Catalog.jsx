import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../../components/common/ProductCard.jsx'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { getPerfumes } from '../../services/perfumeService.js'
import { getCategories } from '../../services/categoryService.js'

function Catalog() {
  const [perfumes, setPerfumes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [perfumesData, categoriesData] = await Promise.all([
          getPerfumes(),
          getCategories(),
        ])
        setPerfumes(perfumesData)
        setCategories(categoriesData)
      } catch (err) {
        console.error('Error loading catalog:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredPerfumes = selectedCategory
    ? perfumes.filter((p) => p.category?.id === selectedCategory)
    : perfumes

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-16">
      <SectionHeader
        pretitle="Catálogo completo"
        title="Explora fragancias"
        children="Descubre todas nuestras creaciones premium con presencia impecable y notas definidas."
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        <button
          type="button"
          onClick={() => setSelectedCategory(null)}
          className={`rounded-[2rem] border p-8 text-left transition ${
            !selectedCategory
              ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10'
              : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/20'
          }`}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Filtro</p>
          <h3 className="mt-3 text-2xl font-[TrajanPro] uppercase tracking-[0.16em] text-white">Todos</h3>
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`rounded-[2rem] border p-8 text-left transition ${
              selectedCategory === category.id
                ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10'
                : 'border-white/10 bg-white/5 hover:border-[#D4AF37]/20'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]/70">Categoría</p>
            <h3 className="mt-3 text-2xl font-[TrajanPro] uppercase tracking-[0.16em] text-white">{category.name}</h3>
          </button>
        ))}
      </motion.div>

      {filteredPerfumes.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {filteredPerfumes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-lg text-white/60">No hay perfumes en esta categoría aún.</p>
        </div>
      )}
    </div>
  )
}

export default Catalog
