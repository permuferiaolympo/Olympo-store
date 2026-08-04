import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPlusCircle, FiPackage, FiDollarSign, FiTag, FiFileText, FiCheck, FiImage } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import ImageUploader from '../../components/common/ImageUploader.jsx'
import ProductImageGallery from '../../components/common/ProductImageGallery.jsx'
import { getCategories } from '../../services/categoryService.js'
import { createProduct, saveProductImage } from '../../services/productService.js'

export default function CreateProduct() {
  const navigate = useNavigate()

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '1',
    category_id: '',
    description: '',
    characteristics: '',
    featured: false,
    new_arrival: false,
  })

  // Categorías de Supabase
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Imágenes subidas
  const [images, setImages] = useState([]) // Array de { url, is_main }

  // Estado de guardado
  const [saving, setSaving] = useState(false)

  // Cargar categorías al montar
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
        if (data && data.length > 0) {
          setFormData((prev) => ({ ...prev, category_id: prev.category_id || data[0].id }))
        }
      } catch (err) {
        console.error(err)
        toast.error('Error cargando categorías')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Manejar cambios en campos de texto/select/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Callback al subir una imagen a R2
  const handleUploadComplete = (url) => {
    setImages((prev) => {
      const isFirst = prev.length === 0
      return [...prev, { url, is_main: isFirst }]
    })
    toast.success('Imagen agregada a la galería')
  }

  // Cambiar imagen principal
  const handleSetMain = (index) => {
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        is_main: i === index,
      }))
    )
  }

  // Eliminar imagen
  const handleDeleteImage = (index) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index)
      // Si eliminamos la principal, hacer la primera como principal si queda alguna
      if (next.length > 0 && !next.some((img) => img.is_main)) {
        next[0].is_main = true
      }
      return next
    })
  }

  // Reordenar imágenes
  const handleMoveImage = (fromIndex, toIndex) => {
    setImages((prev) => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('El nombre del perfume es obligatorio')
      return
    }

    if (!formData.price || Number(formData.price) <= 0) {
      toast.error('Ingresa un precio válido')
      return
    }

    setSaving(true)
    const saveToast = toast.loading('Guardando producto en Supabase...')

    try {
      // 1. Crear registro del perfume en la tabla 'perfumes'
      const perfume = await createProduct(formData)

      // 2. Guardar las imágenes asociadas si hay alguna subida
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const img = images[i]
          await saveProductImage({
            perfume_id: perfume.id,
            image_url: img.url,
            is_main: img.is_main,
            sort_order: i,
            alt: `${perfume.name} - Imagen ${i + 1}`,
          })
        }
      }

      toast.success('¡Producto creado exitosamente!', { id: saveToast })
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error(`Error guardando producto: ${error.message}`, { id: saveToast })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Botón Volver & Encabezado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#D4AF37] hover:underline"
        >
          <FiArrowLeft size={16} />
          Volver al Dashboard
        </button>
      </div>

      <SectionHeader
        pretitle="Administración de Catálogo"
        title="Crear Nuevo Producto"
        children="Completa la información del perfume y sube sus imágenes a Cloudflare R2."
      />

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Columna Izquierda: Información del producto */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-[2.5rem] border border-[#D4AF37]/30 bg-black/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(212,175,55,0.2)] space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-[TrajanPro] uppercase tracking-[0.14em] text-white border-b border-white/10 pb-4">
                <FiPackage className="text-[#D4AF37]" />
                Detalles Principales
              </h3>

              {/* Nombre del perfume */}
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Nombre del perfume *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Ej. Black Orchid Imperial"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>

              {/* Marca y Categoría */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    Marca
                  </label>
                  <input
                    type="text"
                    name="brand"
                    placeholder="Ej. OLIMPO"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    Categoría
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    className="w-full rounded-2xl border border-white/10 bg-[#18181b] px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  >
                    {loadingCategories ? (
                      <option value="">Cargando categorías...</option>
                    ) : categories.length === 0 ? (
                      <option value="">Sin categorías encontradas en Supabase</option>
                    ) : (
                      <>
                        <option value="">-- Selecciona una categoría --</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Precio y Stock */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    Precio ($ COP) *
                  </label>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="500"
                      placeholder="120000"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                    Stock disponible
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Descripción del perfume
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Una fragancia cautivadora que combina notas amaderadas y especias orientales..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>

              {/* Características / Olfativas */}
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-[#D4AF37]">
                  Notas Olfativas / Características
                </label>
                <textarea
                  name="characteristics"
                  rows={3}
                  placeholder="Notas de salida: Bergamota. Notas de corazón: Ámbar. Notas de fondo: Cedro."
                  value={formData.characteristics}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>

              {/* Opciones adicionales: Destacado / Nuevo */}
              <div className="flex flex-wrap gap-6 pt-2 border-t border-white/10">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#D4AF37] rounded"
                  />
                  <span className="text-sm font-medium text-white">Destacado en el inicio</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="new_arrival"
                    checked={formData.new_arrival}
                    onChange={handleChange}
                    className="h-5 w-5 accent-[#D4AF37] rounded"
                  />
                  <span className="text-sm font-medium text-white">Marcar como novedad</span>
                </label>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Subida e Galería de Imágenes */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[2.5rem] border border-[#D4AF37]/30 bg-black/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(212,175,55,0.2)] space-y-6">
              <h3 className="flex items-center gap-2 text-lg font-[TrajanPro] uppercase tracking-[0.14em] text-white border-b border-white/10 pb-4">
                <FiImage className="text-[#D4AF37]" />
                Galería de Imágenes (Opcional)
              </h3>

              {/* Uploader */}
              <ImageUploader onUploadComplete={handleUploadComplete} autoReset={true} />

              {/* Lista/Galería de imágenes agregadas */}
              <ProductImageGallery
                images={images}
                onSetMain={handleSetMain}
                onDelete={handleDeleteImage}
                onMove={handleMoveImage}
              />
            </div>
          </div>
        </div>

        {/* Botón de Enviar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] px-10 py-5 text-sm font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_40px_rgba(212,175,55,0.3)] transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <FiCheck size={20} />
                <span>Crear Producto</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
