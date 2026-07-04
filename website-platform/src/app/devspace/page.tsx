import { TrendingUp, Star, Search, PlusCircle, Megaphone } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server';
import { DevSpaceSiteCard } from "@/components/DevSpaceSiteCard";

export default async function DevSpace() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch real sites from DB
  const { data: sites } = await supabase
    .from('sites')
    .select('*')
    .order('likes_count', { ascending: false });

  // Get user's liked sites
  const userLikes = new Set<string>();
  if (user) {
    const { data: likes } = await supabase
      .from('site_likes')
      .select('site_id')
      .eq('user_id', user.id);
    
    if (likes) {
      likes.forEach(like => userLikes.add(like.site_id));
    }
  }

  const showcaseSites = sites || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="border-b border-border/50 bg-secondary/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
            <span className="text-primary">DevSpace</span> Marketplace
          </Link>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              My Dashboard
            </Link>
            <button className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              Advertise
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Hero Section for DevSpace */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between mb-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Discover & Market Your AI Sites
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Explore top websites built on Resolve.bet. Want more traffic? Purchase ad space to feature your site at the top of the marketplace.
            </p>
            <div className="flex gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search websites, categories..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                />
              </div>
              <Link href="/dashboard/generate" className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Submit Site
              </Link>
            </div>
          </div>
          
          {/* Ad Space CTA */}
          <div className="w-full md:w-80 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30 p-6 shadow-2xl shadow-primary/10">
            <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
              <TrendingUp className="w-5 h-5" />
              Boost Your Traffic
            </div>
            <h3 className="text-xl font-bold mb-2">Buy Ad Space</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get featured on the homepage and at the top of DevSpace. Starting at just $49/week.
            </p>
            <Link href="/checkout?plan=ad-space" className="block text-center w-full py-2 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg font-medium transition-colors">
              View Ad Packages
            </Link>
          </div>
        </div>

        {/* Featured Sites (Ads) */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-2xl font-bold">Featured / Sponsored</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseSites.slice(0, 3).map((site) => (
              <DevSpaceSiteCard key={site.id} site={site} sponsored isLikedByMe={userLikes.has(site.id)} />
            ))}
            
            {/* Empty Ad Slot */}
            <div className="rounded-2xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center p-8 text-center text-muted-foreground hover:bg-secondary/30 hover:border-primary/50 hover:text-primary transition-colors cursor-pointer min-h-[300px]">
              <Megaphone className="w-8 h-8 mb-3 opacity-50" />
              <span className="font-medium">Advertise Here</span>
              <span className="text-xs mt-1">Reach 10,000+ daily visitors</span>
            </div>
          </div>
        </div>

        {/* Trending / All Sites */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Trending Sites</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {showcaseSites.length > 0 ? (
              showcaseSites.map((site) => (
                <DevSpaceSiteCard key={site.id} site={site} isLikedByMe={userLikes.has(site.id)} />
              ))
            ) : (
              <div className="col-span-4 p-12 text-center text-muted-foreground bg-secondary/10 rounded-2xl border border-border/50">
                No sites have been published to DevSpace yet. Be the first!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
