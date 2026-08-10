import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

function calculateEffectivePrice(product) {
  const basePrice = Number(product.price) || 0
  const discount = Number(product.discount) || 0
  const hasDiscount = discount > 0

  if (!hasDiscount) {
    return basePrice
  }

  return basePrice - (basePrice * discount) / 100
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem('olympo_cart')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading carrito desde localStorage:', error)
      return []
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('olympo_cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error guardando carrito en localStorage:', error)
    }
  }, [cartItems])

  const addItem = (product, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1)
    const effectivePrice = calculateEffectivePrice(product)
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + safeQuantity,
                unitPrice: calculateEffectivePrice(product),
              }
            : item,
        )
      }

      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          originalPrice: Number(product.price) || 0,
          discount: Number(product.discount) || 0,
          unitPrice: Number(effectivePrice) || 0,
          quantity: safeQuantity,
          stock: Number(product.stock) || 0,
        },
      ]
    })
  }

  const updateQuantity = (productId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1)
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item,
      ),
    )
  }

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => setCartItems([])

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems],
  )

  const total = subtotal

  const value = {
    cartItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return ctx
}
