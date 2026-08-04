import { supabase } from '../lib/supabaseClient'

/**
 * Inicia sesión con email y contraseña usando Supabase Auth.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Error signing in:', error)
    return { user: null, error }
  }

  return { user: data.user, error: null }
}

/**
 * Cierra la sesión actual.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Error signing out:', error)
  }

  return { error }
}

/**
 * Obtiene el usuario actualmente autenticado.
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Error getting current user:', error)
    return null
  }

  return user
}

/**
 * Escucha cambios en el estado de autenticación.
 * Retorna una función de limpieza para cancelar la suscripción.
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user || null)
    }
  )

  return () => subscription.unsubscribe()
}
