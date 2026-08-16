import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { getEffectivePrice } from '../lib/pricing.js'

const CartContext = createContext(null)

function clampQuantity(quantity, stock) {
  const requested = Math.max(1, Number(quantity) || 1)
  const available = Math.max(0, Number(stock) || 0)
  return Math.min(requested, available)
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
    const safeQuantity = clampQuantity(quantity, product.stock)
    const effectivePrice = getEffectivePrice(product)
    setCartItems((prev) => {
      if (safeQuantity === 0) return prev

      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: Number(product.stock) || 0,
                quantity: clampQuantity(item.quantity + safeQuantity, product.stock),
                unitPrice: getEffectivePrice(product),
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
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.id !== productId) return [item]

        const nextQuantity = clampQuantity(quantity, item.stock)
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : []
      }),
    )
  }

  const removeItem = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const clearCart = () => setCartItems([])

  const validateCartStock = async () => {
    if (cartItems.length === 0) return []

    const ids = cartItems.map((item) => item.id)
    const { data, error } = await supabase
      .from('perfumes')
      .select('id, name, stock, is_active')
      .in('id', ids)

    if (error) throw new Error(`No fue posible verificar el inventario: ${error.message}`)

    const currentProducts = new Map((data || []).map((product) => [product.id, product]))
    const issues = cartItems.flatMap((item) => {
      const product = currentProducts.get(item.id)
      const available = Number(product?.stock) || 0

      if (!product || !product.is_active || available < item.quantity) {
        return [{
          productId: item.id,
          name: item.name,
          available,
          requested: item.quantity,
        }]
      }
      return []
    })

    setCartItems((prev) => prev.flatMap((item) => {
      const product = currentProducts.get(item.id)
      const available = Number(product?.stock) || 0

      if (!product || !product.is_active || available <= 0) return []

      return [{
        ...item,
        stock: available,
        quantity: Math.min(item.quantity, available),
      }]
    }))

    return issues
  }

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
    validateCartStock,
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
