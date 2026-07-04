import { Activity, Globe, MessageSquare, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server';

export default async function DashboardOverview() {
  const supabase = await createClient();
  
  // Fetch user's sites
  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch real leads count
  const { count: leadsCount } = await supabase
    .from('crm_leads')
    .select('*', { count: 'exact', head: true });

  // Fetch real analytics count
  const { data: analytics } = await supabase
    .from('site_analytics')
    .select('page_views, unique_visitors');

  const totalViews = analytics?.reduce((acc, curr) => acc + (curr.page_views || 0), 0) || 0;
  
  // Also get likes count from sites
  const totalLikes = sites?.reduce((acc, site) => acc + (site.likes_count || 0), 0) || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground text-sm">Here's what's happening with your websites today.</p>
        </div>
        <Link href="/dashboard/generate" className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create New Site
        </Link>
      </header>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Sites" value={(sites?.length || 0).toString()} icon={<Globe className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Total Visitors" value={totalViews.toString()} icon={<Activity className="w-5 h-5 text-green-500" />} />
        <StatCard title="CRM Leads Captured" value={(leadsCount || 0).toString()} icon={<MessageSquare className="w-5 h-5 text-purple-500" />} />
        <StatCard title="Total DevSpace Likes" value={totalLikes.toString()} icon={<TrendingUp className="w-5 h-5 text-orange-500" />} />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Active Sites */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Active Sites</h2>
            <Link href="/dashboard/sites" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          <div className="grid gap-4">
            {sites && sites.length > 0 ? (
              sites.map((site) => (
                <SiteOverviewCard key={site.id} name={site.name} url={site.url || ''} status={site.status || 'Draft'} visitors="0" />
              ))
            ) : (
              <div className="p-8 border border-dashed border-border/50 rounded-2xl text-center bg-secondary/5">
                <Globe className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold mb-1">No sites yet</h3>
                <p className="text-sm text-muted-foreground mb-4">You haven't generated any websites yet.</p>
                <Link href="/dashboard/generate" className="text-primary font-medium hover:underline">Generate your first site</Link>
              </div>
            )}
          </div>
        </div>

        {/* Marketing / Ad Space Quick Action */}
        <div>
          <h2 className="text-xl font-bold mb-6">Marketing Tools</h2>
          <div className="bg-secondary/20 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <h3 className="font-bold mb-2 text-lg">Boost Your Traffic</h3>
            <p className="text-sm text-muted-foreground mb-6">Purchase ad space on the DevSpace marketplace to get thousands of new visitors.</p>
            <Link href="/checkout?plan=ad-space" className="w-full block text-center bg-primary text-white py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
              Buy Ad Space
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-secondary/10 border border-border/50 rounded-2xl p-6 flex flex-col hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="p-2 bg-secondary/50 rounded-lg">{icon}</div>
      </div>
      <div className="text-2xl font-bold mt-auto">{value}</div>
    </div>
  );
}

function SiteOverviewCard({ name, url, status, visitors }: { name: string, url: string, status: string, visitors: string }) {
  return (
    <div className="flex items-center justify-between p-5 border border-border/50 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold">
          {name.substring(0, 1)}
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <a href={`https://${url}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{url}</a>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm font-bold">{visitors}</div>
          <div className="text-xs text-muted-foreground">Visitors</div>
        </div>
        <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold border border-green-500/20">
          {status}
        </div>
      </div>
    </div>
  );
}
