import { supabase } from '../lib/supabaseClient'

/**
 * Obtiene todos los perfumes activos con sus relaciones.
 * Incluye: categoría, descuento e imagen principal.
 */
export async function getPerfumes() {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching perfumes:', error)
    return []
  }

  return data.map(normalizePerfume)
}

/**
 * Obtiene TODOS los perfumes (activos e inactivos) para el panel de administración.
 * Incluye: categoría, descuento e imagen principal.
 */
export async function getAllPerfumesAdmin() {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all perfumes (admin):', error)
    return []
  }

  return data.map(normalizePerfume)
}

/**
 * Obtiene los perfumes destacados (featured = true).
 */
export async function getFeaturedPerfumes() {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .eq('is_active', true)
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured perfumes:', error)
    return []
  }

  return data.map(normalizePerfume)
}

/**
 * Obtiene un perfume por su slug, con galería completa de imágenes.
 */
export async function getPerfumeBySlug(slug) {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      status:status(id, name, color),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching perfume by slug:', error)
    return null
  }

  return normalizePerfume(data)
}

export async function getPerfumeById(id) {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      status:status(id, name, color),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching perfume by id:', error)
    return null
  }

  return normalizePerfume(data)
}

/**
 * Obtiene perfumes de una categoría específica.
 */
export async function getPerfumesByCategory(categoryId) {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts!perfumes_discount_id_fkey(id, name, discount_type, discount_value, active, start_date, end_date),
      images(id, cloudflare_image_id, image_url, alt, is_main, sort_order)
    `)
    .eq('is_active', true)
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching perfumes by category:', error)
    return []
  }

  return data.map(normalizePerfume)
}

/**
 * Normaliza un perfume de Supabase al formato que esperan los componentes.
 * Mapea las relaciones (imágenes, descuento) a campos planos.
 */
function normalizePerfume(raw) {
  const images = (raw.images || []).sort((a, b) => a.sort_order - b.sort_order)
  const mainImage = images.find((img) => img.is_main) || images[0]
  const normalizedPrice = Number(raw.price) || 0

  // Calcular descuento efectivo de forma robusta
  let discountPercent = 0
  const discountRelation = Array.isArray(raw.discount) ? raw.discount[0] : raw.discount
  const directDiscountValue = raw.discount_value ?? raw.discount_percent ?? raw.discount
  const discount = discountRelation || (directDiscountValue != null ? { discount_type: raw.discount_type || 'percentage', discount_value: directDiscountValue, active: true } : null)
  const now = new Date()
  const isDiscountActive = discount
    ? (discount.active ?? discount.is_active ?? true)
    : false
  const isDiscountValid = isDiscountActive &&
    (!discount.start_date || new Date(discount.start_date) <= now) &&
    (!discount.end_date || new Date(discount.end_date) >= now)

  if (isDiscountValid) {
    const discountType = discount.discount_type || 'percentage'
    const discountValue = Number(discount.discount_value ?? directDiscountValue ?? 0)

    if (discountType === 'percentage') {
      discountPercent = discountValue
    } else if (discountType === 'fixed') {
      discountPercent = normalizedPrice > 0
        ? (discountValue / normalizedPrice) * 100
        : 0
    }
  }

  if (!Number.isFinite(discountPercent) || discountPercent < 0) {
    discountPercent = 0
  }

  const parseJsonField = (value, fallback) => {
    if (value == null || value === '') return fallback
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
      } catch (err) {
        return fallback
      }
    }
    return value
  }

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    brand: raw.brand,
    description: raw.description,
    characteristics: raw.characteristics,
    price: Number(raw.price),
    stock: raw.stock,
    featured: raw.featured,
    new_arrival: raw.new_arrival,
    discount: discountPercent,
    discountRaw: raw.discount,
    category: raw.category,
    status: raw.status || null,
    image: mainImage?.image_url || '',
    gallery: images.map((img) => img.image_url),
    images,
    notes: Array.isArray(parseJsonField(raw.notes, []))
      ? parseJsonField(raw.notes, [])
      : [],
    usageData: parseJsonField(raw.usage_data, {}),
    created_at: raw.created_at,
  }
}
