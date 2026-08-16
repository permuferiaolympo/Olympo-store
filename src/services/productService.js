import { supabase } from '../lib/supabaseClient'
import { deleteProductImage } from './uploadService.js'

/**
 * Convierte un texto en un slug URL-friendly
 * Ejemplo: "Aventus Creed 100ml" -> "aventus-creed-100ml"
 */
export function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar diacríticos (acentos)
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/[^\w\-]+/g, '') // Eliminar caracteres especiales
    .replace(/\-\-+/g, '-') // Eliminar múltiples guiones
    .replace(/^-+/, '') // Trim inicio
    .replace(/-+$/, '') // Trim final
}

/**
 * Crea un perfume en la tabla 'perfumes'
 * @param {Object} productData 
 * @returns {Promise<Object>} El objeto perfume creado
 */
export async function createProduct(productData) {
  const {
    name,
    brand,
    description,
    characteristics,
    price,
    stock,
    category_id,
    discount_id,
    featured = false,
    new_arrival = false,
    usage_data = null,
  } = productData

  const baseSlug = generateSlug(name)

  const insertData = {
    name,
    slug: baseSlug,
    brand,
    description,
    characteristics,
    price: Number(price),
    stock: Number(stock),
    category_id: category_id || null,
    discount_id: discount_id || null,
    featured,
    new_arrival,
    usage_data: usage_data && Object.keys(usage_data).length > 0 ? usage_data : null,
    is_active: true,
  }

  const { data, error } = await supabase
    .from('perfumes')
    .insert([insertData])
    .select()
    .single()

  if (error) {
    // Si el error es por duplicado de slug (restricción única "perfumes_slug_key" o código 23505)
    if (error.code === '23505' || error.message?.includes('perfumes_slug_key') || error.message?.includes('unique constraint')) {
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
      
      const { data: retryData, error: retryError } = await supabase
        .from('perfumes')
        .insert([{ ...insertData, slug: uniqueSlug }])
        .select()
        .single()

      if (retryError) {
        console.error('Error al crear el producto en el reintento:', retryError)
        throw new Error(`Error en base de datos: ${retryError.message}`)
      }

      return retryData
    }

    console.error('Error al crear el producto:', error)
    throw new Error(`Error en base de datos: ${error.message}`)
  }

  return data
}

export async function updateProduct(productId, productData) {
  const {
    name,
    brand,
    description,
    characteristics,
    price,
    stock,
    category_id,
    discount_id,
    featured = false,
    new_arrival = false,
    usage_data = null,
  } = productData

  const baseSlug = generateSlug(name)
  const { data: currentPerfume, error: fetchError } = await supabase
    .from('perfumes')
    .select('slug')
    .eq('id', productId)
    .single()

  if (fetchError) {
    console.error('Error al obtener el slug actual del producto:', fetchError)
    throw new Error(`Error en base de datos: ${fetchError.message}`)
  }

  const nextSlug = currentPerfume?.slug?.trim() || baseSlug

  const updateData = {
    name,
    slug: nextSlug,
    brand: brand || null,
    description: description || null,
    characteristics: characteristics || null,
    price: Number(price),
    stock: Number(stock),
    category_id: category_id || null,
    discount_id: discount_id || null,
    featured,
    new_arrival,
    usage_data: usage_data && Object.keys(usage_data).length > 0 ? usage_data : null,
  }

  const { data, error } = await supabase
    .from('perfumes')
    .update(updateData)
    .eq('id', productId)
    .select()
    .maybeSingle()

  if (error) {
    if (error.code === '23505' || error.message?.includes('perfumes_slug_key') || error.message?.includes('unique constraint')) {
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`
      const { data: retryData, error: retryError } = await supabase
        .from('perfumes')
        .update({ ...updateData, slug: uniqueSlug })
        .eq('id', productId)
        .select()
        .single()

      if (retryError) {
        console.error('Error al actualizar el producto en el reintento:', retryError)
        throw new Error(`Error en base de datos: ${retryError.message}`)
      }

      return retryData
    }

    console.error('Error al actualizar el producto:', error)
    throw new Error(`Error en base de datos: ${error.message}`)
  }

  return data
}

/**
 * Sincroniza la galería persistida con la galería enviada desde el formulario.
 * Conserva los registros que siguen vigentes, actualiza su orden y elimina tanto
 * los registros como los archivos remotos que ya no pertenecen al producto.
 */
export async function syncProductImages(perfumeId, images) {
  const desiredImages = images
    .filter((image) => image?.url)
    .filter((image, index, all) => all.findIndex((item) => item.url === image.url) === index)

  const { data: existingImages, error: fetchError } = await supabase
    .from('images')
    .select('id, image_url')
    .eq('perfume_id', perfumeId)

  if (fetchError) {
    throw new Error(`Error obteniendo imágenes actuales: ${fetchError.message}`)
  }

  const existingByUrl = new Map()
  for (const image of existingImages || []) {
    const matches = existingByUrl.get(image.image_url) || []
    matches.push(image)
    existingByUrl.set(image.image_url, matches)
  }

  const retainedIds = new Set()

  // Evita tener dos imágenes principales mientras se reordena la galería.
  if ((existingImages || []).length > 0) {
    const { error } = await supabase
      .from('images')
      .update({ is_main: false })
      .eq('perfume_id', perfumeId)

    if (error) throw new Error(`Error preparando la galería: ${error.message}`)
  }

  for (const [sortOrder, image] of desiredImages.entries()) {
    const existing = existingByUrl.get(image.url)?.shift()
    const imageData = {
      image_url: image.url,
      cloudflare_image_id: image.cloudflare_image_id || image.url.split('/').pop() || `img_${Date.now()}`,
      is_main: Boolean(image.is_main),
      sort_order: sortOrder,
      alt: image.alt || 'Imagen de producto',
    }

    if (existing) {
      const { error } = await supabase.from('images').update(imageData).eq('id', existing.id)
      if (error) throw new Error(`Error actualizando imagen: ${error.message}`)
      retainedIds.add(existing.id)
    } else {
      const { error } = await supabase
        .from('images')
        .insert([{ perfume_id: perfumeId, ...imageData }])
      if (error) throw new Error(`Error guardando imagen: ${error.message}`)
    }
  }

  const obsoleteImages = (existingImages || []).filter((image) => !retainedIds.has(image.id))
  if (obsoleteImages.length === 0) return

  const { error: deleteError } = await supabase
    .from('images')
    .delete()
    .in('id', obsoleteImages.map((image) => image.id))

  if (deleteError) throw new Error(`Error eliminando imágenes antiguas: ${deleteError.message}`)

  await Promise.all(
    obsoleteImages.map((image) =>
      deleteProductImage(image.image_url).catch((error) => {
        console.warn(`No se pudo eliminar la imagen remota: ${image.image_url}`, error)
      }),
    ),
  )
}
