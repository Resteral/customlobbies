import { createClient } from '@/utils/supabase/server';
import SupportInboxClient from './SupportInboxClient';

interface Ticket {
  id: string;
  site_id: string;
  visitor_session_id: string;
  visitor_name: string;
  visitor_email: string;
  status: string;
  created_at: string;
  site: {
    name: string;
  };
}

export default async function MerchantSupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch sites owned by user
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name')
    .eq('user_id', user?.id || '');

  let tickets: Ticket[] = [];
  if (sites && sites.length > 0) {
    const siteIds = sites.map(s => s.id);
    
    // Fetch tickets submitted for these sites
    const { data: tix, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        site:sites (
          name
        )
      `)
      .in('site_id', siteIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching support tickets:', error);
    } else if (tix) {
      tickets = tix;
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Live Support Inbox</h1>
        <p className="text-muted-foreground text-sm">Respond to real-time support requests and feedback from your site visitors.</p>
      </header>

      {sites && sites.length > 0 ? (
        <SupportInboxClient initialTickets={tickets} />
      ) : (
        <div className="text-center p-12 border border-dashed border-border/50 rounded-2xl bg-secondary/5 text-muted-foreground">
          You need to generate a website before you can receive live support messages!
        </div>
      )}
    </div>
  );
}
