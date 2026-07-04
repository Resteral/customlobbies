'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(leadId: string, status: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('crm_leads')
    .update({ status })
    .eq('id', leadId);
    
  if (error) {
    console.error('Error updating lead status:', error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/dashboard/inbox');
  return { success: true };
}
