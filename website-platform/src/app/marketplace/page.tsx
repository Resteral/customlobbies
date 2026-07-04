import { createClient } from '@/utils/supabase/server';
import MarketplaceClient from './MarketplaceClient';

export default async function MarketplacePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; location?: string }> 
}) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const location = resolvedSearchParams.location || 'Seattle, WA';

  // Fetch all active products
  let dbQuery = supabase
    .from('products')
    .select(`
      *,
      site:sites (
        id,
        name,
        url,
        location
      )
    `)
    .eq('is_active', true);

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`);
  }

  const { data: products, error } = await dbQuery;

  if (error) {
    console.error('Error fetching marketplace products:', error);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <MarketplaceClient 
        initialProducts={products || []} 
        initialQuery={query}
        initialLocation={location}
      />
    </div>
  );
}
