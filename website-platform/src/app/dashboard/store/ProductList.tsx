'use client';

import { deleteProduct } from './actions';
import { Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

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

export function ProductList({ 
  products, 
  sites,
  onEditProduct
}: { 
  products: Product[], 
  sites: Site[],
  onEditProduct?: (product: Product) => void
}) {
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
        <div key={product.id} className="border border-border/50 rounded-xl overflow-hidden bg-background flex flex-col group relative">
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
            
            {/* Controls */}
            <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEditProduct && (
                <button 
                  onClick={() => onEditProduct(product)}
                  className="bg-primary text-white p-1.5 rounded hover:bg-primary/95 transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => handleDelete(product.id, product.site_id)}
                disabled={deletingId === product.id}
                className="bg-rose-500 text-white p-1.5 rounded hover:bg-rose-600 disabled:opacity-50 transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1 gap-2">
              <h4 className="font-bold truncate">{product.name}</h4>
              <span className="font-medium text-primary shrink-0">${product.price.toFixed(2)}</span>
            </div>
            
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-grow">
              {product.description || 'No description provided.'}
            </p>
            
            {/* Stock & Active Indicators */}
            <div className="mt-4 pt-3 border-t border-border/50 flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  product.is_active !== false ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-muted-foreground">
                  {product.is_active !== false ? 'Active (For Sale)' : 'Inactive'}
                </span>
              </div>
              
              <div className="text-muted-foreground font-medium">
                {product.stock === undefined || product.stock === -1 ? (
                  <span className="text-green-600 font-semibold">In Stock (∞)</span>
                ) : product.stock === 0 ? (
                  <span className="text-rose-500 font-semibold">Out of Stock</span>
                ) : (
                  <span>Stock: {product.stock}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
