import { useState } from 'react'
import toast from 'react-hot-toast'
import { uploadProductImage } from '../../services/uploadService.js'
import { FiUploadCloud, FiImage, FiCheckCircle } from 'react-icons/fi'

function ImageUploader({ onUploadComplete, autoReset = false }) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0])
    }
  }

  const processUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (jpg, png, webp)')
      return
    }

    setIsUploading(true)
    setUploadedUrl(null)

    const loadingToast = toast.loading('Subiendo imagen a Cloudflare R2...')

    try {
      const url = await uploadProductImage(file)
      toast.success('¡Imagen subida con éxito!', { id: loadingToast })
      if (onUploadComplete) {
        onUploadComplete(url)
      }
      if (autoReset) {
        setUploadedUrl(null)
      } else {
        setUploadedUrl(url)
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: loadingToast })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full max-w-xl">
      <div 
        className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 transition-all duration-300 ${
          dragActive 
            ? 'border-[#D4AF37] bg-[#D4AF37]/10' 
            : 'border-white/20 bg-white/5 hover:border-[#D4AF37]/50 hover:bg-white/10'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleChange}
          disabled={isUploading}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#D4AF37]"></div>
            <p className="text-sm font-medium uppercase tracking-widest text-[#D4AF37]">Subiendo imagen...</p>
          </div>
        ) : uploadedUrl ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400">
              <FiCheckCircle size={32} />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-white">Subida completada</p>
              <a 
                href={uploadedUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 block text-xs text-[#D4AF37] hover:underline"
              >
                Ver imagen pública
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-white/60">
              <FiUploadCloud size={32} />
            </div>
            <p className="text-sm font-medium uppercase tracking-widest text-white">
              Sube una imagen
            </p>
            <p className="text-xs text-white/50">
              Arrastra y suelta tu archivo aquí, o haz clic para buscar
            </p>
          </div>
        )}
      </div>

      {uploadedUrl && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
          <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
            <FiImage className="text-[#D4AF37]" />
            <span className="text-xs font-medium uppercase tracking-widest text-white">Vista Previa</span>
          </div>
          <div className="p-4">
            <img 
              src={uploadedUrl} 
              alt="Preview" 
              className="max-h-[300px] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
