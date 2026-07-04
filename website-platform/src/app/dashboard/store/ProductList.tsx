'use client';

import { deleteProduct } from './actions';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function ProductList({ products, sites }: { products: any[], sites: any[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (productId: string, siteId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    setDeletingId(productId);
    await deleteProduct(productId, siteId);
    setDeletingId(null);
  };

  const getSiteName = (siteId: string) => {
    return sites.find(s => s.id === siteId)?.name || 'Unknown Site';
  };

  if (products.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed border-border/50 rounded-xl bg-secondary/5 text-muted-foreground">
        No products added yet. Add your first product to start selling!
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {products.map(product => (
        <div key={product.id} className="border border-border/50 rounded-xl overflow-hidden bg-background flex flex-col group">
          <div className="h-40 w-full bg-secondary/30 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image' }}
            />
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded">
              {getSiteName(product.site_id)}
            </div>
            <button 
              onClick={() => handleDelete(product.id, product.site_id)}
              disabled={deletingId === product.id}
              className="absolute top-2 right-2 bg-rose-500/90 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600 disabled:opacity-50"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-bold">{product.name}</h4>
              <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {product.description || 'No description provided.'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
