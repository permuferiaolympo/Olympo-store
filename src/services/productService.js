import { supabase } from '../lib/supabaseClient'

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

/**
 * Guarda el registro de una imagen en la tabla 'images' de Supabase
 * @param {Object} imageData 
 */
export async function saveProductImage({ perfume_id, image_url, cloudflare_image_id, is_main = false, sort_order = 0, alt = '' }) {
  // Extraer nombre del archivo de la URL o usar el ID proveído para no violar la restricción NOT NULL
  const imageId = cloudflare_image_id || image_url.split('/').pop() || `img_${Date.now()}`

  const { data, error } = await supabase
    .from('images')
    .insert([
      {
        perfume_id,
        image_url,
        cloudflare_image_id: imageId,
        is_main,
        sort_order,
        alt: alt || 'Imagen de producto',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error al guardar la imagen en Supabase:', error)
    throw new Error(`Error guardando imagen: ${error.message}`)
  }

  return data
}
