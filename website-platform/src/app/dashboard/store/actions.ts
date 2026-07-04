'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addProduct(siteId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Verify site belongs to user
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
    
  if (!site) return { error: 'Site not found or unauthorized' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const stockInput = formData.get('stock') as string
  const stock = stockInput ? parseInt(stockInput, 10) : -1
  const isActive = formData.get('isActive') !== 'false' // default to true
  
  if (!name || isNaN(price)) {
    return { error: 'Name and valid price are required' }
  }

  const { error } = await supabase
    .from('products')
    .insert([
      {
        site_id: siteId,
        name,
        description,
        price,
        image_url: imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
        stock,
        is_active: isActive
      }
    ])

  if (error) {
    console.error('Error adding product:', error)
    return { error: 'Failed to add product' }
  }

  revalidatePath('/dashboard/store')
  return { success: true }
}

export async function updateProduct(productId: string, siteId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Ensure user owns the site
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
    
  if (!site) return { error: 'Unauthorized' }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const imageUrl = formData.get('imageUrl') as string
  const stockInput = formData.get('stock') as string
  const stock = stockInput ? parseInt(stockInput, 10) : -1
  const isActive = formData.get('isActive') !== 'false'

  if (!name || isNaN(price)) {
    return { error: 'Name and valid price are required' }
  }

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description,
      price,
      image_url: imageUrl || 'https://via.placeholder.com/300x300?text=No+Image',
      stock,
      is_active: isActive
    })
    .eq('id', productId)
    .eq('site_id', siteId)

  if (error) {
    console.error('Error updating product:', error)
    return { error: 'Failed to update product' }
  }

  revalidatePath('/dashboard/store')
  return { success: true }
}

export async function deleteProduct(productId: string, siteId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  // Ensure user owns the site the product belongs to
  const { data: site } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
    
  if (!site) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('site_id', siteId)

  if (error) return { error: 'Failed to delete product' }

  revalidatePath('/dashboard/store')
  return { success: true }
}
