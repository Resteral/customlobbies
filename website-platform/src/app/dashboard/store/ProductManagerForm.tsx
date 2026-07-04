'use client';

import { useState } from 'react';
import { addProduct } from './actions';
import { Loader2 } from 'lucide-react';

export function ProductManagerForm({ sites }: { sites: { id: string, name: string }[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const siteId = formData.get('siteId') as string;
    
    const result = await addProduct(siteId, formData);
    
    if (result.error) {
      alert(result.error);
    } else {
      (e.target as HTMLFormElement).reset();
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Select Website</label>
        <select name="siteId" required className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm">
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input type="text" name="name" required placeholder="e.g., Premium Coffee Beans" className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input type="number" step="0.01" name="price" required placeholder="19.99" className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" rows={3} placeholder="A short description..." className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm resize-none"></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input type="url" name="imageUrl" placeholder="https://..." className="w-full bg-background border border-border/50 rounded-lg px-3 py-2 focus:ring-1 focus:ring-primary outline-none text-sm" />
      </div>
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Product'}
      </button>
    </form>
  );
}
