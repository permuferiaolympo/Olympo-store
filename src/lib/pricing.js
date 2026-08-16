export function getDiscountPercentage(product) {
  return Math.max(0, Number(product?.discount) || 0)
}

export function getEffectivePrice(product) {
  const price = Number(product?.price) || 0
  return price * (1 - getDiscountPercentage(product) / 100)
}
