'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLikeSite(siteId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be logged in to like a site.' }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('site_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('site_id', siteId)
    .single()

  if (existingLike) {
    // Unlike
    await supabase.from('site_likes').delete().eq('id', existingLike.id)
    // Decrement counter
    await supabase.rpc('decrement_likes', { target_site_id: siteId }) 
    // Fallback if RPC doesn't exist (since we didn't add it to schema, we'll just read and update)
    const { data: site } = await supabase.from('sites').select('likes_count').eq('id', siteId).single()
    if (site) {
      await supabase.from('sites').update({ likes_count: Math.max(0, (site.likes_count || 0) - 1) }).eq('id', siteId)
    }
  } else {
    // Like
    await supabase.from('site_likes').insert([{ user_id: user.id, site_id: siteId }])
    // Increment counter
    const { data: site } = await supabase.from('sites').select('likes_count').eq('id', siteId).single()
    if (site) {
      await supabase.from('sites').update({ likes_count: (site.likes_count || 0) + 1 }).eq('id', siteId)
    }
  }

  revalidatePath('/devspace')
  return { success: true }
}

export async function incrementShare(siteId: string) {
  const supabase = await createClient()
  
  const { data: site } = await supabase.from('sites').select('shares_count').eq('id', siteId).single()
  if (site) {
    await supabase.from('sites').update({ shares_count: (site.shares_count || 0) + 1 }).eq('id', siteId)
  }

  revalidatePath('/devspace')
  return { success: true }
}
