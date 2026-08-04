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
