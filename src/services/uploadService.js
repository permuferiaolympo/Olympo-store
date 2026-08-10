import { supabase } from '../lib/supabaseClient'

/**
 * Sube una imagen de producto a Cloudflare R2.
 * Soporta dos vías:
 * 1. Cloudflare Worker directo (si VITE_WORKER_URL está configurado en .env)
 * 2. Supabase Edge Function ('generate-r2-url')
 *
 * @param {File} file - El archivo a subir
 * @returns {Promise<string>} - La URL pública de la imagen subida
 */
export async function uploadProductImage(file) {
  let workerUrl = import.meta.env.VITE_WORKER_URL || import.meta.env.VITE_CLOUDFLARE_WORKER_URL

  // -----------------------------------------------------------
  // VÍA A: Usar Cloudflare Worker directo (si existe VITE_WORKER_URL en .env)
  // -----------------------------------------------------------
  if (workerUrl) {
    // Asegurar que la URL del Worker empiece con https://
    if (!workerUrl.startsWith('http://') && !workerUrl.startsWith('https://')) {
      workerUrl = `https://${workerUrl}`
    }

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(workerUrl, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`Error en Cloudflare Worker (${response.status}): ${errText}`)
    }

    const data = await response.json()
    const finalUrl = data.url || data.imageUrl || data.publicUrl || data.fileUrl
    
    if (!finalUrl) {
      throw new Error('El Worker no retornó la URL de la imagen (propiedad url/imageUrl no encontrada)')
    }

    return finalUrl
  }

  // -----------------------------------------------------------
  // VÍA B: Usar Supabase Edge Function ('generate-r2-url')
  // -----------------------------------------------------------
  try {
    const { data: signedData, error: signedError } = await supabase.functions.invoke('generate-r2-url', {
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (signedError) {
      throw new Error(
        `No se pudo conectar a la Edge Function de Supabase (${signedError.message}). ` +
        `Si usas Cloudflare Worker, añade VITE_WORKER_URL en tu archivo .env`
      )
    }

    if (signedData.error) {
      throw new Error(`Error de la Edge Function: ${signedData.error}`)
    }

    const { url, fileKey } = signedData

    // Subir el archivo binario directamente a R2 con la presigned URL
    const uploadResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })

    if (!uploadResponse.ok) {
      throw new Error(`Error subiendo archivo a R2: ${uploadResponse.statusText}`)
    }

    const publicDomain = import.meta.env.VITE_CLOUDFLARE_IMAGE_DELIVERY
    if (!publicDomain) {
      throw new Error('No has configurado VITE_CLOUDFLARE_IMAGE_DELIVERY en tu archivo .env')
    }

    const baseUrl = publicDomain.replace(/\/$/, '')
    return `${baseUrl}/${fileKey}`
  } catch (error) {
    console.error('Upload Error:', error)
    throw error
  }
}

/**
 * Elimina una imagen de producto de Cloudflare R2.
 * Envía una solicitud DELETE al Worker con la key del archivo.
 *
 * @param {string} imageUrl - La URL pública de la imagen (ej: https://pub-xxx.r2.dev/filename.jpg)
 * @returns {Promise<boolean>} - true si se eliminó correctamente
 */
export async function deleteProductImage(imageUrl) {
  if (!imageUrl) return false

  // Extraer la key del archivo desde la URL pública
  const publicDomain = import.meta.env.VITE_CLOUDFLARE_IMAGE_DELIVERY || ''
  let fileKey = imageUrl

  if (publicDomain && imageUrl.startsWith(publicDomain)) {
    fileKey = imageUrl.replace(publicDomain.replace(/\/$/, ''), '').replace(/^\//, '')
  } else {
    // Si la URL no coincide con el dominio, extraer solo el path final
    try {
      const urlObj = new URL(imageUrl)
      fileKey = urlObj.pathname.replace(/^\//, '')
    } catch {
      // Si no es una URL válida, usar como está
      fileKey = imageUrl.split('/').pop()
    }
  }

  if (!fileKey) {
    console.warn('No se pudo extraer la key del archivo para eliminar:', imageUrl)
    return false
  }

  let workerUrl = import.meta.env.VITE_WORKER_URL || import.meta.env.VITE_CLOUDFLARE_WORKER_URL

  if (workerUrl) {
    if (!workerUrl.startsWith('http://') && !workerUrl.startsWith('https://')) {
      workerUrl = `https://${workerUrl}`
    }

    try {
      const response = await fetch(`${workerUrl.replace(/\/$/, '')}/${fileKey}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error(`Error eliminando imagen de R2 (${response.status}):`, errText)
        return false
      }

      return true
    } catch (err) {
      console.error('Error al conectar con el Worker para eliminar imagen:', err)
      return false
    }
  }

  console.warn('No se configuró VITE_WORKER_URL, no se puede eliminar la imagen de R2')
  return false
}
