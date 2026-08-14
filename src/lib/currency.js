const copFormatter = new Intl.NumberFormat('es-CO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/** Formatea COP sin decimales y redondeado al millar más cercano. */
export function formatCop(value) {
  const amount = Number(value)
  const roundedAmount = Number.isFinite(amount) ? Math.round(amount / 1000) * 1000 : 0
  return copFormatter.format(roundedAmount)
}

export function formatCopCurrency(value) {
  return `$${formatCop(value)}`
}
