import { supabase } from '../lib/supabaseClient'

/**
 * Obtiene todas las categorías activas.
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories from Supabase:', error)
    return []
  }

  // Filtrar si existe la propiedad is_active y es explícitamente false
  return (data || []).filter((cat) => cat.is_active !== false)
}

/**
 * Obtiene una categoría por su slug.
 */
export async function getCategoryBySlug(slug) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}
