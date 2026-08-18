import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPerfumes } from '../../services/perfumeService.js'

const aromaOptions = [
  'Dulce',
  'Fresco',
  'Cítrico',
  'Amaderado',
  'Floral',
  'No tengo preferencia',
]

const occasionOptions = [
  'Uso diario',
  'Trabajo / estudio',
  'Cita / ocasión especial',
  'Fiesta / noche',
  'Cualquier ocasión',
]

const timeOptions = ['Día', 'Noche', 'Ambos']

function normalizeText(value = '') {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function scorePerfume(perfume, aromaPreference, occasionPreference, timePreference) {
  const description = `${perfume.description || ''} ${perfume.characteristics || ''}`.toLowerCase()
  const usageData = perfume.usageData || {}

  let score = 0
  const aromaKey = normalizeText(aromaPreference)

  if (aromaKey !== 'no tengo preferencia') {
    const aromaMatches = [
      ['dulce', ['dulce', 'vainilla', 'caramelo', 'cremoso', 'ambar', 'azucarado']],
      ['fresco', ['fresco', 'acqua', 'agua', 'aqua', 'clean', 'lavanda', 'musgo', 'verde']],
      ['cítrico', ['cítrico', 'citricos', 'limón', 'naranja', 'bergamota', 'mandarina', 'agrio']],
      ['amaderado', ['amaderado', 'madera', 'sándalo', 'sandalwood', 'cedro', 'tabaco', 'incenso']],
      ['floral', ['floral', 'flor', 'rosa', 'jazmín', 'jasmín', 'violeta', 'tuberosa']],
    ]

    const matchSet = aromaMatches.find(([key]) => normalizeText(key) === aromaKey)
    if (matchSet) {
      const keywords = matchSet[1]
      if (keywords.some((keyword) => description.includes(keyword) || String(perfume.name || '').toLowerCase().includes(keyword))) {
        score += 35
      } else {
        score += 10
      }
    }
  } else {
    score += 5
  }

  const occasionKey = normalizeText(occasionPreference)
  const occasionText = description + ' ' + (perfume.name || '') + ' ' + (perfume.brand || '')

  if (occasionKey === 'uso diario' && /diario|cotidiano|fresh|clean|versatile|elegante|sofisticado|fresco|clásico/.test(occasionText)) {
    score += 18
  }
  if (occasionKey === 'trabajo / estudio' && /trabajo|estudio|oficina|elegante|fresco|limpio|clásico|sutil|profesional/.test(occasionText)) {
    score += 18
  }
  if (occasionKey === 'cita / ocasión especial' && /especial|romántico|seductor|noble|elegante|intenso|afirmativo|luxury|sofisticado|encanto/.test(occasionText)) {
    score += 18
  }
  if (occasionKey === 'fiesta / noche' && /noche|fiesta|intenso|seductor|amaderado|oriental|especiado|picante|musk|luxury|potente/.test(occasionText)) {
    score += 18
  }
  if (occasionKey === 'cualquier ocasión') {
    score += 12
  }

  if (timePreference === 'Día') {
    score += Number(usageData.day || 0) * 0.35
  } else if (timePreference === 'Noche') {
    score += Number(usageData.night || 0) * 0.35
  } else {
    score += (Number(usageData.day || 0) + Number(usageData.night || 0)) * 0.18
  }

  if (timePreference === 'Día' && /día|diurno|matinal|fresco|citrico|floral|verde/.test(description)) {
    score += 10
  }
  if (timePreference === 'Noche' && /noche|intenso|amaderado|oriental|especiado|seductor|musk|boisé|luxury/.test(description)) {
    score += 10
  }
  if (timePreference === 'Ambos') {
    score += 8
  }

  return score
}

function VipConsultation() {
  const [step, setStep] = useState(1)
  const [aroma, setAroma] = useState('')
  const [occasion, setOccasion] = useState('')
  const [time, setTime] = useState('')
  const [perfumes, setPerfumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchPerfumes() {
      try {
        const data = await getPerfumes()
        const valid = (data || []).filter((product) => product && product.is_active !== false && product.stock > 0)
        setPerfumes(valid)
      } catch (err) {
        console.error('Error loading perfumes for VIP consultation:', err)
        setError('No fue posible cargar los perfumes disponibles ahora mismo.')
      } finally {
        setLoading(false)
      }
    }

    fetchPerfumes()
  }, [])

  const recommendations = useMemo(() => {
    if (!aroma || !occasion || !time || perfumes.length === 0) return []

    return [...perfumes]
      .map((perfume) => ({ perfume, score: scorePerfume(perfume, aroma, occasion, time) }))
      .filter(({ perfume }) => perfume && perfume.is_active !== false)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ perfume, score }) => ({ ...perfume, recommendationScore: score }))
  }, [aroma, occasion, perfumes, time])

  const nextStep = () => {
    if (step < 3) setStep((prev) => prev + 1)
  }

  const handleSubmit = () => {
    if (!aroma || !occasion || !time) return
    setStep(4)
  }

  const showChoices = step === 1 ? aromaOptions : step === 2 ? occasionOptions : timeOptions

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-12">
      <div className="rounded-[2rem] border border-[#D4AF37]/20 bg-white/5 p-8 shadow-[0_30px_120px_-80px_rgba(0,0,0,0.9)]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70">Asesoría VIP</p>
          <span className="rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
            {step}/3
          </span>
        </div>

        {loading ? (
          <div className="py-10 text-center text-white/70">Cargando nuestras fragancias...</div>
        ) : error ? (
          <div className="py-10 text-center text-red-300">{error}</div>
        ) : step <= 3 ? (
          <>
            <h2 className="mb-6 text-2xl font-semibold text-white">
              {step === 1 && '¿Qué tipo de aroma prefieres?'}
              {step === 2 && '¿Para qué ocasión lo buscas?'}
              {step === 3 && '¿Cuándo lo usarías principalmente?'}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {showChoices.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    if (step === 1) setAroma(option)
                    if (step === 2) setOccasion(option)
                    if (step === 3) setTime(option)
                    if (step < 3) nextStep()
                    if (step === 3) handleSubmit()
                  }}
                  className={`rounded-2xl border px-5 py-4 text-left text-sm transition ${
                    (step === 1 && aroma === option) ||
                    (step === 2 && occasion === option) ||
                    (step === 3 && time === option)
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#F5E0A3]'
                      : 'border-white/10 bg-black/20 text-white/80 hover:border-[#D4AF37]/40 hover:text-[#F5E0A3]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]/70">Tu perfil</p>
              <p className="text-white/75">
                Aroma: <span className="text-[#F5E0A3]">{aroma}</span> · Ocasión:{' '}
                <span className="text-[#F5E0A3]">{occasion}</span> · Momento:{' '}
                <span className="text-[#F5E0A3]">{time}</span>
              </p>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {recommendations.map((perfume) => (
                  <div key={perfume.id} className="rounded-[1.6rem] border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                      {perfume.image ? (
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          className="h-28 w-28 rounded-2xl object-cover border border-[#D4AF37]/20 bg-white/5"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-white/5 text-xs uppercase tracking-[0.25em] text-[#D4AF37]/70">
                          Aroma
                        </div>
                      )}

                      <div className="flex-1">
                        <p className="text-sm uppercase tracking-[0.25em] text-[#D4AF37]/70">Nombre:</p>
                        <p className="mt-1 text-xl font-semibold text-white">{perfume.name}</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#D4AF37]/70">Marca:</p>
                        <p className="mt-1 text-white/85">{perfume.brand}</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#D4AF37]/70">Precio:</p>
                        <p className="mt-1 text-white/85">${Number(perfume.price).toLocaleString('es-MX')}</p>
                        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-[#D4AF37]/70">¿Por qué te lo recomiendo?:</p>
                        <p className="mt-1 text-sm leading-6 text-white/75">
                          {(() => {
                            const description = `${perfume.description || ''} ${perfume.characteristics || ''}`.toLowerCase()
                            const reasons = []

                            if (aroma !== 'No tengo preferencia') {
                              reasons.push(`se ajusta a tu preferencia por aromas ${aroma.toLowerCase()}`)
                            }
                            if (/(cita|ocasión especial|romántico|seductor|elegante|noble|luxury|intenso)/.test(description) && occasion === 'Cita / ocasión especial') {
                              reasons.push('encaja muy bien para una cita o evento especial')
                            }
                            if (/(diario|fresco|clean|versátil|clásico|elegante)/.test(description) && occasion === 'Uso diario') {
                              reasons.push('funciona bien para el uso diario')
                            }
                            if (/(fiesta|noche|intenso|potente|sexi|amaderado|oriental)/.test(description) && occasion === 'Fiesta / noche') {
                              reasons.push('tiene un perfil apropiado para salir por la noche')
                            }
                            if (time === 'Día' && (Number(perfume.usageData?.day || 0) > Number(perfume.usageData?.night || 0))) {
                              reasons.push('mantiene mejor afinidad para el día')
                            }
                            if (time === 'Noche' && (Number(perfume.usageData?.night || 0) > Number(perfume.usageData?.day || 0))) {
                              reasons.push('lleva una mejor afinidad para la noche')
                            }
                            if (reasons.length === 0) {
                              reasons.push('es una de las opciones más compatibles con tu perfil')
                            }

                            return reasons.slice(0, 2).join(' y ')
                          })()}.
                        </p>

                        <div className="mt-4">
                          <Link
                            to={`/product/${perfume.slug}`}
                            className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#F5E0A3] transition hover:border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
                          >
                            Ver detalle
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-white/10 bg-black/20 p-6 text-white/75">
                No hubo una coincidencia clara con tu perfil, pero estas son las opciones más cercanas disponibles:
                <div className="mt-4 space-y-3">
                  {(perfumes.slice(0, 3) || []).map((perfume) => (
                    <div key={perfume.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      {perfume.image ? (
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          className="mb-3 h-20 w-20 rounded-xl object-cover border border-[#D4AF37]/20"
                        />
                      ) : null}
                      <p className="font-semibold text-white">{perfume.name}</p>
                      <p className="text-sm text-white/70">{perfume.brand}</p>
                      <p className="mt-2 text-sm text-white/70">
                        Es una alternativa compatible por su perfil y uso, aunque no es la coincidencia exacta ideal.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VipConsultation
