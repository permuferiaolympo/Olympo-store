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
    throw new Error(`Error cargando categorías: ${error.message}`)
  }

  // Filtrar si existe la propiedad is_active y es explícitamente false
  return (data || []).filter((cat) => cat.is_active !== false)
}
