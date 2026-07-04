'use client';

import { useState } from 'react';
import { ProductManagerForm } from './ProductManagerForm';
import { ProductList } from './ProductList';

interface Product {
  id: string;
  name: string;
  price: number;
  site_id: string;
  description?: string;
  image_url?: string;
  stock?: number;
  is_active?: boolean;
}

interface Site {
  id: string;
  name: string;
}

export function StoreManagerClient({ 
  initialProducts, 
  sites 
}: { 
  initialProducts: Product[], 
  sites: Site[] 
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-secondary/10 border border-border/50 rounded-2xl p-6 self-start">
        <h3 className="font-bold text-lg mb-6">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <ProductManagerForm 
          key={editingProduct ? editingProduct.id : 'new'}
          sites={sites} 
          editingProduct={editingProduct} 
          onCancelEdit={() => setEditingProduct(null)} 
        />
      </div>
      
      <div className="md:col-span-2">
        <h3 className="font-bold text-lg mb-6">Your Inventory</h3>
        <ProductList 
          products={initialProducts} 
          sites={sites} 
          onEditProduct={(p) => setEditingProduct(p)} 
        />
      </div>
    </div>
  );
}
