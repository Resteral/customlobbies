import { createClient } from '@/utils/supabase/server';
import InboxClient from './InboxClient';

export default async function InboxPage() {
  const supabase = await createClient();

  // Fetch all leads where the user owns the site
  const { data: leads, error } = await supabase
    .from('crm_leads')
    .select(`
      *,
      site:sites (
        name,
        url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
  }

  return (
    <div className="flex h-full flex-col">
      <header className="p-8 pb-4">
        <h1 className="text-3xl font-bold mb-2">Unified CRM Inbox</h1>
        <p className="text-muted-foreground text-sm">Manage all leads captured by your AI chatbots across all sites.</p>
      </header>

      <div className="flex-grow overflow-hidden px-8 pb-8">
        <InboxClient initialLeads={leads || []} />
      </div>
    </div>
  );
}
