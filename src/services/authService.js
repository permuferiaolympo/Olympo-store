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
