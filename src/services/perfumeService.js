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
      discount:discounts(id, name, discount_type, discount_value, active),
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
 * Obtiene los perfumes destacados (featured = true).
 */
export async function getFeaturedPerfumes() {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts(id, name, discount_type, discount_value, active),
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
      discount:discounts(id, name, discount_type, discount_value, active),
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

/**
 * Obtiene perfumes de una categoría específica.
 */
export async function getPerfumesByCategory(categoryId) {
  const { data, error } = await supabase
    .from('perfumes')
    .select(`
      *,
      category:categories(id, name, slug),
      discount:discounts(id, name, discount_type, discount_value, active),
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

  // Calcular descuento efectivo
  let discountPercent = 0
  if (raw.discount && raw.discount.active) {
    if (raw.discount.discount_type === 'percentage') {
      discountPercent = Number(raw.discount.discount_value)
    } else if (raw.discount.discount_type === 'fixed') {
      discountPercent = raw.price > 0
        ? (Number(raw.discount.discount_value) / raw.price) * 100
        : 0
    }
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
    created_at: raw.created_at,
  }
}
