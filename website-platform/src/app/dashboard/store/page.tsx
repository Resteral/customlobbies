import { createClient } from '@/utils/supabase/server';
import { ProductManagerForm } from './ProductManagerForm';
import { ProductList } from './ProductList';
import { ShoppingCart } from 'lucide-react';

export default async function StorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's sites
  const { data: sites } = await supabase
    .from('sites')
    .select('id, name')
    .eq('user_id', user?.id || '');

  // Fetch all products for these sites
  let products = [];
  if (sites && sites.length > 0) {
    const siteIds = sites.map(s => s.id);
    const { data: siteProducts } = await supabase
      .from('products')
      .select('*')
      .in('site_id', siteIds)
      .order('created_at', { ascending: false });
      
    if (siteProducts) products = siteProducts;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight">E-Commerce Store</h1>
          </div>
          <p className="text-muted-foreground">Manage products for your generated websites.</p>
        </div>
      </header>

      {sites && sites.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-secondary/10 border border-border/50 rounded-2xl p-6 self-start">
            <h3 className="font-bold text-lg mb-6">Add New Product</h3>
            <ProductManagerForm sites={sites} />
          </div>
          
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg mb-6">Your Inventory</h3>
            <ProductList products={products} sites={sites} />
          </div>
        </div>
      ) : (
        <div className="text-center p-12 border border-dashed border-border/50 rounded-2xl bg-secondary/5 text-muted-foreground">
          You need to generate a website before you can add products to it!
        </div>
      )}
    </div>
  );
}
