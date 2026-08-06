import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FiArrowLeft, FiPackage, FiDollarSign, FiCheck, FiImage, FiUploadCloud, FiTrash2, FiStar } from 'react-icons/fi'
import SectionHeader from '../../components/common/SectionHeader.jsx'
import { uploadProductImage } from '../../services/uploadService.js'
import { getCategories } from '../../services/categoryService.js'
import { createProduct, saveProductImage } from '../../services/productService.js'

// ─── Componente de Slot de Imagen Individual ────────────────────────────────────
function ImageSlot({ label, sublabel, image, onUpload, onRemove, isMain, large }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) await processFile(e.dataTransfer.files[0])
  }

  const handleChange = async (e) => {
    e.preventDefault()
    if (e.target.files?.[0]) await processFile(e.target.files[0])
  }

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecciona una imagen válida (jpg, png, webp)')
      return
    }
    setUploading(true)
    const loadingToast = toast.loading('Subiendo imagen a Cloudflare R2...')
    try {
      const url = await uploadProductImage(file)
      toast.success('¡Imagen subida con éxito!', { id: loadingToast })
      onUpload(url)
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: loadingToast })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Label */}
      <div className="flex items-center gap-2">
        {isMain && <FiStar size={14} className="text-[#D4AF37] fill-[#D4AF37]" />}
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium">{label}</span>
        {sublabel && <span className="text-[10px] text-white/40">{sublabel}</span>}
      </div>

      {/* Slot */}
      {image ? (
        /* ── Preview con imagen subida ── */
        <div
          className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
            isMain
              ? 'border-[#D4AF37]/60 shadow-[0_0_30px_rgba(212,175,55,0.15)]'
              : 'border-white/15 hover:border-white/25'
          }`}
          style={{ height: large ? '280px' : '180px' }}
        >
          <img
            src={image}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay con acciones */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/50 group-hover:opacity-100">
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 rounded-full bg-red-500/90 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-red-500 hover:scale-105 active:scale-95"
            >
              <FiTrash2 size={14} />
              Eliminar
            </button>
          </div>

          {/* Badge principal */}
          {isMain && (
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-md">
              <FiStar size={11} className="fill-black" />
              Principal
            </div>
          )}
        </div>
      ) : (
        /* ── Zona de upload vacía ── */
        <div
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
              : isMain
                ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10'
                : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
          }`}
          style={{ height: large ? '280px' : '180px' }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={uploading}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-white/10 border-t-[#D4AF37]" />
              <p className="text-[11px] font-medium uppercase tracking-widest text-[#D4AF37]">Subiendo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className={`flex items-center justify-center rounded-full ${
                isMain ? 'h-14 w-14 bg-[#D4AF37]/15 text-[#D4AF37]' : 'h-11 w-11 bg-white/10 text-white/50'
              }`}>
                <FiUploadCloud size={large ? 26 : 22} />
              </div>
              <p className={`text-xs font-medium uppercase tracking-widest ${isMain ? 'text-[#D4AF37]' : 'text-white/70'}`}>
                {large ? 'Sube la foto principal' : 'Sube una foto'}
              </p>
              <p className="text-[10px] text-white/40 leading-tight">
                Arrastra o haz clic
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Componente Principal ────────────────────────────────────────────────────────
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
    usage_day: '',
    usage_night: '',
    usage_autumn: '',
    usage_spring: '',
    usage_summer: '',
    usage_winter: '',
    featured: false,
    new_arrival: false,
  })

  // Categorías de Supabase
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Imágenes: 3 slots (principal + 2 adicionales)
  const [mainImage, setMainImage] = useState(null)    // string URL o null
  const [extraImage1, setExtraImage1] = useState(null) // string URL o null
  const [extraImage2, setExtraImage2] = useState(null) // string URL o null

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

  // Contar cuántas imágenes hay
  const imageCount = [mainImage, extraImage1, extraImage2].filter(Boolean).length

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
      const {
        usage_day,
        usage_night,
        usage_autumn,
        usage_spring,
        usage_summer,
        usage_winter,
        ...payloadBase
      } = formData

      const usageData = {}
      if (usage_day !== '') {
        const value = Number(usage_day)
        if (!Number.isNaN(value) && value >= 0) usageData.day = value
      }
      if (usage_night !== '') {
        const value = Number(usage_night)
        if (!Number.isNaN(value) && value >= 0) usageData.night = value
      }
      if (usage_autumn !== '') {
        const value = Number(usage_autumn)
        if (!Number.isNaN(value) && value >= 0) usageData.autumn = value
      }
      if (usage_spring !== '') {
        const value = Number(usage_spring)
        if (!Number.isNaN(value) && value >= 0) usageData.spring = value
      }
      if (usage_summer !== '') {
        const value = Number(usage_summer)
        if (!Number.isNaN(value) && value >= 0) usageData.summer = value
      }
      if (usage_winter !== '') {
        const value = Number(usage_winter)
        if (!Number.isNaN(value) && value >= 0) usageData.winter = value
      }

      const perfume = await createProduct({
        ...payloadBase,
        usage_data: Object.keys(usageData).length > 0 ? usageData : null,
      })

      // 2. Guardar las imágenes asociadas
      const imagesToSave = [
        mainImage && { url: mainImage, is_main: true, sort_order: 0, label: 'Principal' },
        extraImage1 && { url: extraImage1, is_main: false, sort_order: 1, label: 'Adicional 1' },
        extraImage2 && { url: extraImage2, is_main: false, sort_order: 2, label: 'Adicional 2' },
      ].filter(Boolean)

      for (const img of imagesToSave) {
        await saveProductImage({
          perfume_id: perfume.id,
          image_url: img.url,
          is_main: img.is_main,
          sort_order: img.sort_order,
          alt: `${perfume.name} - ${img.label}`,
        })
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

              {/* Uso recomendado */}
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                  Usos recomendados
                </h4>
                <p className="mb-4 text-xs text-white/60">
                  Completa solo los porcentajes que correspondan. Los íconos solo aparecerán en el detalle si hay valores.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { key: 'usage_winter', label: 'Invierno' },
                    { key: 'usage_spring', label: 'Primavera' },
                    { key: 'usage_summer', label: 'Verano' },
                    { key: 'usage_autumn', label: 'Otoño' },
                    { key: 'usage_day', label: 'Día' },
                    { key: 'usage_night', label: 'Noche' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
                        {label}
                      </label>
                      <input
                        type="number"
                        name={key}
                        min="0"
                        max="100"
                        placeholder="0"
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-white outline-none transition focus:border-[#D4AF37]/60 focus:ring-2 focus:ring-[#D4AF37]/20"
                      />
                    </div>
                  ))}
                </div>
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

          {/* Columna Derecha: Galería de 3 Imágenes */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[2.5rem] border border-[#D4AF37]/30 bg-black/70 p-6 sm:p-8 backdrop-blur-xl shadow-[0_40px_120px_-60px_rgba(212,175,55,0.2)] space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="flex items-center gap-2 text-lg font-[TrajanPro] uppercase tracking-[0.14em] text-white">
                  <FiImage className="text-[#D4AF37]" />
                  Fotos del Producto
                </h3>
                <span className="text-xs text-white/40 tabular-nums">{imageCount}/3</span>
              </div>

              {/* Slot 1 — Imagen Principal (grande) */}
              <ImageSlot
                label="Imagen Principal"
                sublabel="Requerida"
                image={mainImage}
                onUpload={(url) => setMainImage(url)}
                onRemove={() => setMainImage(null)}
                isMain={true}
                large={true}
              />

              {/* Slots 2 y 3 — Imágenes Adicionales (lado a lado) */}
              <div className="grid grid-cols-2 gap-4">
                <ImageSlot
                  label="Adicional 1"
                  sublabel="Opcional"
                  image={extraImage1}
                  onUpload={(url) => setExtraImage1(url)}
                  onRemove={() => setExtraImage1(null)}
                  isMain={false}
                  large={false}
                />
                <ImageSlot
                  label="Adicional 2"
                  sublabel="Opcional"
                  image={extraImage2}
                  onUpload={(url) => setExtraImage2(url)}
                  onRemove={() => setExtraImage2(null)}
                  isMain={false}
                  large={false}
                />
              </div>

              {/* Tip */}
              <p className="text-[11px] leading-relaxed text-white/30 text-center">
                La imagen principal se mostrará como portada del producto. Las adicionales se verán en la galería de detalle.
              </p>
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
