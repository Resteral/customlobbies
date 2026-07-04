import { createClient } from '@/utils/supabase/server';
import SitesClient from './SitesClient';

export default async function SitesPage() {
  const supabase = await createClient();

  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">My Sites</h1>
        <p className="text-muted-foreground text-sm">Manage your generated websites and connect custom domains.</p>
      </header>
      
      <SitesClient initialSites={sites || []} />
    </div>
  );
}
