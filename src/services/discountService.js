import { supabase } from '../lib/supabaseClient'

export async function getDiscounts() {
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching discounts from Supabase:', error)
    return []
  }

  return (data || []).filter((discount) => discount.active !== false)
}

export async function createDiscount(discountData) {
  const { name, discount_type, discount_value, start_date, end_date, active = true } = discountData

  const { data, error } = await supabase
    .from('discounts')
    .insert([
      {
        name,
        discount_type,
        discount_value: Number(discount_value),
        start_date: start_date || null,
        end_date: end_date || null,
        active,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating discount in Supabase:', error)
    throw new Error(error.message)
  }

  return data
}

export async function updateDiscount(discountId, discountData) {
  const { name, discount_type, discount_value, start_date, end_date, active = true } = discountData

  const { data, error } = await supabase
    .from('discounts')
    .update({
      name,
      discount_type,
      discount_value: Number(discount_value),
      start_date: start_date || null,
      end_date: end_date || null,
      active,
    })
    .eq('id', discountId)
    .select()
    .single()

  if (error) {
    console.error('Error updating discount in Supabase:', error)
    throw new Error(error.message)
  }

  return data
}
