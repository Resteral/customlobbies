'use client';

import { useState } from 'react';
import { addProduct, updateProduct } from './actions';
import { Loader2 } from 'lucide-react';

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

export function ProductManagerForm({ 
  sites,
  editingProduct = null,
  onCancelEdit
}: { 
  sites: { id: string, name: string }[],
  editingProduct?: Product | null,
  onCancelEdit?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState(editingProduct?.name || '');
  const [price, setPrice] = useState(editingProduct?.price.toString() || '');
  const [description, setDescription] = useState(editingProduct?.description || '');
  const [imageUrl, setImageUrl] = useState(editingProduct?.image_url || '');
  const [stock, setStock] = useState(editingProduct?.stock !== undefined ? editingProduct.stock.toString() : '-1');
  const [isActive, setIsActive] = useState(editingProduct?.is_active !== false);
  const [siteId, setSiteId] = useState(editingProduct?.site_id || (sites.length > 0 ? sites[0].id : ''));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('imageUrl', imageUrl);
    formData.append('stock', stock);
    formData.append('isActive', isActive.toString());
    
    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, editingProduct.site_id, formData);
    } else {
      result = await addProduct(siteId, formData);
    }
    
    if (result.error) {
      alert(result.error);
    } else {
      if (!editingProduct) {
        setName('');
        setPrice('');
        setDescription('');
        setImageUrl('');
        setStock('-1');
        setIsActive(true);
      } else if (onCancelEdit) {
        onCancelEdit();
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Website</label>
        <select 
          name="siteId" 
          required 
          value={siteId}
          onChange={(e) => setSiteId(e.target.value)}
          disabled={!!editingProduct}
          className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm disabled:opacity-50"
        >
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input 
          type="text" 
          name="name" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Premium Coffee Beans" 
          className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Price ($)</label>
          <input 
            type="number" 
            step="0.01" 
            name="price" 
            required 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="19.99" 
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Stock Level</label>
          <input 
            type="number" 
            name="stock" 
            required 
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="-1 for infinite" 
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" 
          />
        </div>
      </div>

      <div className="flex items-center gap-2 py-1">
        <input 
          type="checkbox" 
          id="isActive" 
          checked={isActive} 
          onChange={(e) => setIsActive(e.target.checked)}
          className="rounded border-border text-primary focus:ring-primary h-4 w-4"
        />
        <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
          Product is for sale (active)
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea 
          name="description" 
          rows={3} 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short description..." 
          className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input 
          type="url" 
          name="imageUrl" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..." 
          className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" 
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        {editingProduct && (
          <button 
            type="button" 
            onClick={onCancelEdit}
            className="flex-1 bg-secondary text-foreground py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors text-center text-sm"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-grow bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 text-sm"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingProduct ? 'Save Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
}
