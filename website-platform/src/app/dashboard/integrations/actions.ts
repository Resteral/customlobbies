'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveCrmIntegration(siteId: string, provider: string, webhookUrl: string) {
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

  // Upsert chatbot config with CRM details
  const { error } = await supabase
    .from('chatbot_configs')
    .upsert(
      { 
        site_id: siteId,
        crm_provider: provider,
        crm_webhook_url: webhookUrl,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'site_id' }
    )

  if (error) {
    console.error(error)
    return { error: 'Failed to save integration' }
  }

  revalidatePath('/dashboard/integrations')
  return { success: true }
}
