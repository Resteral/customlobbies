'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSupportTicket(siteId: string, visitorSessionId: string, name?: string, email?: string) {
  const supabase = await createClient();

  // Check if ticket already exists for this visitor session and site
  const { data: existingTicket } = await supabase
    .from('support_tickets')
    .select('id')
    .eq('site_id', siteId)
    .eq('visitor_session_id', visitorSessionId)
    .eq('status', 'open')
    .single();

  if (existingTicket) {
    return { success: true, ticketId: existingTicket.id };
  }

  // Create new ticket
  const { data: newTicket, error } = await supabase
    .from('support_tickets')
    .insert([
      {
        site_id: siteId,
        visitor_session_id: visitorSessionId,
        visitor_name: name || 'Anonymous Guest',
        visitor_email: email || ''
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating support ticket:', error);
    return { success: false, error: error.message };
  }

  return { success: true, ticketId: newTicket.id };
}

export async function sendSupportMessage(ticketId: string, sender: 'visitor' | 'agent', content: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('support_messages')
    .insert([
      {
        ticket_id: ticketId,
        sender,
        content
      }
    ]);

  if (error) {
    console.error('Error sending support message:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/support');
  return { success: true };
}

export async function fetchSupportMessages(ticketId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('support_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching support messages:', error);
    return [];
  }

  return data || [];
}

export async function toggleTicketStatus(ticketId: string, currentStatus: string) {
  const supabase = await createClient();
  const nextStatus = currentStatus === 'open' ? 'resolved' : 'open';

  const { error } = await supabase
    .from('support_tickets')
    .update({ status: nextStatus })
    .eq('id', ticketId);

  if (error) {
    console.error('Error toggling ticket status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/support');
  return { success: true };
}
