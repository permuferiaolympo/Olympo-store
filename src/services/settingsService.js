import { supabase } from '../lib/supabaseClient'

/**
 * Obtiene la configuración de la tienda.
 * Se espera un solo registro en la tabla settings.
 */
export async function getSettings() {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    return null
  }

  return data
}

/**
 * Actualiza la configuración de la tienda.
 */
export async function updateSettings(id, updates) {
  const { data, error } = await supabase
    .from('settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating settings:', error)
    return null
  }

  return data
}
