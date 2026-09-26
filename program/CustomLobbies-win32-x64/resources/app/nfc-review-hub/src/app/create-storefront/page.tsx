'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Store, Sparkles, Plus, Trash2, Globe, Truck, 
  Phone, MapPin, CheckCircle2, ArrowRight, ArrowLeft,
  DollarSign, Clock, ShieldCheck, QrCode, ExternalLink,
  Layers, Utensils, Image as ImageIcon, Check
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct } from '@/lib/types';
import confetti from 'canvas-confetti';
import ImageUpload from '@/components/ImageUpload';

export default function CreateStorefrontPage() {
  const router = useRouter();
  const { towns, activeTown, createStorefront, playDeliveryChime } = useNfcStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Auto-fill from Google state
  const [googleUrlInput, setGoogleUrlInput] = useState('');
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState<string | null>(null);

  // Step 1: Business Identity
  const [businessName, setBusinessName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [logoEmoji, setLogoEmoji] = useState('☕');
  const [phone, setPhone] = useState('(603) 555-0199');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [town, setTown] = useState(activeTown.name);
  const [state, setState] = useState(activeTown.state);
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [coverImageUrl, setCoverImageUrl] = useState('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80');

  const handleAutoFillFromGoogle = (presetQuery?: string) => {
    const query = (presetQuery !== undefined ? presetQuery : googleUrlInput).trim();
    if (!query) return;

    setIsAutoFilling(true);
    setAutoFillSuccess(null);

    try {
      let name = query;
      let townName = 'Ossipee';
      let phoneNum = '(603) 539-7665';
      let emoji = '🏪';

      // Parse query string if URL
      const qMatch = query.match(/[?&#](?:q|query|oq)=([^&#]+)/i);
      if (qMatch) {
        try {
          name = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ');
        } catch {
          name = qMatch[1].replace(/\+/g, ' ');
        }
      }

      name = name.replace(/https?:\/\/[^\s]+/g, '').replace(/#.*$/, '').replace(/&.*$/, '').trim();
      if (!name) name = 'Smoke World Ossipee';

      const lower = name.toLowerCase();
      if (lower.includes('smoke')) {
        emoji = '💨';
        townName = 'Ossipee';
        phoneNum = '(603) 539-7665';
      } else if (lower.includes('pizza') || lower.includes('eats') || lower.includes('grill') || lower.includes('pub') || lower.includes('bbq')) {
        emoji = lower.includes('pizza') ? '🍕' : '🍔';
        townName = lower.includes('effingham') ? 'Effingham' : 'Ossipee';
        phoneNum = '(603) 539-2200';
      } else if (lower.includes('village') || lower.includes('store') || lower.includes('general')) {
        emoji = '🏡';
        townName = 'Freedom';
        phoneNum = '(603) 539-7988';
      }

      const formatted = name.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

      setBusinessName(formatted);
      setSlug(formatted.toLowerCase().replace(/[^a-z0-9]/g, '-'));
      setTagline(`Official Online Storefront for ${formatted} in ${townName}, NH`);
      setDescription(`${formatted} offers premium local goods & foods with express delivery across ${townName}.`);
      setLogoEmoji(emoji);
      setPhone(phoneNum);
      setAddress(`${townName}, NH`);
      setTown(townName);
      setState('NH');
      setAccentColor('#f59e0b');
      setAutoFillSuccess(`Auto-filled details for "${formatted}"!`);
      playDeliveryChime();
    } catch (err) {
      console.warn('Auto-fill error:', err);
    } finally {
      setIsAutoFilling(false);
    }
  };

  // Step 2: Products / Menu Catalog
  const [products, setProducts] = useState<StorefrontProduct[]>([
    {
      id: 'prod-sample-1',
      name: 'Signature House Special',
      description: 'Handcrafted with fresh local ingredients and artisan seasoning.',
      price: 14.50,
      category: 'Main Menu',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      inStock: true,
      badge: 'House Special',
    },
    {
      id: 'prod-sample-2',
      name: 'Artisan Drink / Brew',
      description: 'Refreshing cold-pressed craft beverage made in-house daily.',
      price: 5.50,
      category: 'Beverages',
      imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
      inStock: true,
    },
  ]);

  // New Item Temporary State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Entrees');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  // Step 3: Delivery & Deployment Settings
  const [deliveryFee, setDeliveryFee] = useState(3.99);
  const [minOrder, setMinOrder] = useState(12.00);
  const [estimatedPrepTime, setEstimatedPrepTime] = useState('20-30 mins');
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [enablePickup, setEnablePickup] = useState(true);
  const [listOnMarketplace, setListOnMarketplace] = useState(true);

  // Success State
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  // Auto-generate slug when name changes
  const handleNameChange = (val: string) => {
    setBusinessName(val);
    if (!slug || slug === businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const newProd: StorefrontProduct = {
      id: `prod-${Date.now().toString(36)}`,
      name: newItemName.trim(),
      price: parseFloat(newItemPrice) || 9.99,
      category: newItemCategory.trim() || 'Menu',
      description: newItemDesc.trim() || 'Freshly prepared upon order.',
      badge: newItemBadge.trim() || undefined,
      imageUrl: newItemImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      inStock: true,
    };

    setProducts(prev => [...prev, newProd]);
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setNewItemBadge('');
    setNewItemImage('');
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleFinalSubmit = () => {
    if (!businessName.trim() || products.length === 0) return;

    const cleanSlug = slug.trim() || businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    createStorefront({
      slug: cleanSlug,
      businessName: businessName.trim(),
      tagline: tagline.trim() || `Local Favorite in ${town}, ${state}`,
      description: description.trim() || `${businessName} serves fresh local favorites with express delivery across ${town}.`,
      logoEmoji,
      coverImageUrl,
      phone,
      email: email || undefined,
      address: address || `${town}, ${state}`,
      town,
      state,
      accentColor,
      deliveryFee: Number(deliveryFee),
      minOrder: Number(minOrder),
      estimatedPrepTime,
      googleRating: 5.0,
      reviewsCount: 1,
      googleReviewUrl: `https://maps.google.com/?q=${encodeURIComponent(`${businessName} ${town} ${state}`)}`,
      enableDelivery,
      enablePickup,
      listOnMarketplace,
      products,
      isPublished: true,
    });

    setCreatedSlug(cleanSlug);
    playDeliveryChime();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981'],
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 md:px-10 max-w-5xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
          <Store className="w-3.5 h-3.5 text-amber-400" />
          Instant Business Website & Marketplace Creator
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
          Build Your <span className="text-amber-400">Delivery Storefront</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto">
          Create a standalone branded delivery website for your business in 60 seconds or plug directly into the Oasis Town Marketplace with instant phone notification relay.
        </p>

        {/* Stepper Tabs */}
        {!createdSlug && (
          <div className="pt-6 flex items-center justify-center gap-3">
            {[
              { num: 1, label: '1. Brand Identity' },
              { num: 2, label: '2. Menu & Products' },
              { num: 3, label: '3. Delivery & Launch' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {createdSlug ? (
        /* Success Screen */
        <div className="bg-[#0a0a0f] border border-emerald-500/30 rounded-[3rem] p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              Website & Storefront Deployed!
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              <strong className="text-white">{businessName}</strong> is now live. Customers can browse your menu and order delivery with instant notifications pushed directly to your phone.
            </p>
          </div>

          {/* Live Link Box */}
          <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl max-w-md mx-auto space-y-3 text-left">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Your Public Website URL:</span>
            <div className="flex items-center justify-between bg-black/50 p-3 rounded-xl border border-white/5">
              <span className="text-xs font-mono text-amber-400 truncate">
                https://townraise.org/site/{createdSlug}
              </span>
              <Link
                href={`/site/${createdSlug}`}
                target="_blank"
                className="text-xs font-bold text-white hover:text-amber-400 flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Visit Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/site/${createdSlug}`}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
            >
              <span>Open My Standalone Website</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard/storefront"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all"
            >
              Manage in Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* Wizard Steps */
        <div className="bg-[#0a0a0f] border border-white/10 rounded-[3rem] p-6 md:p-10 shadow-2xl space-y-8">
          
          {/* STEP 1: BRAND IDENTITY */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono uppercase text-amber-400">Step 1 of 3</span>
                <h2 className="text-2xl font-black text-white uppercase">Business Brand & Identity</h2>
              </div>

              {/* Instant Auto-Fill from Google Search / Maps */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill from Google Business Profile or Maps Link</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAutoFillFromGoogle('Smoke World Ossipee')}
                      className="text-[10px] text-amber-300 hover:text-white bg-white/5 px-2 py-0.5 rounded"
                    >
                      💨 Smoke World
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutoFillFromGoogle('Pizza Barn Effingham')}
                      className="text-[10px] text-amber-300 hover:text-white bg-white/5 px-2 py-0.5 rounded"
                    >
                      🍕 Pizza Barn
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={googleUrlInput}
                    onChange={(e) => setGoogleUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAutoFillFromGoogle(); }}
                    placeholder="Paste Google Search link, Maps URL, or business name..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleAutoFillFromGoogle()}
                    disabled={isAutoFilling}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase rounded-xl transition-all disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                  >
                    <span>{isAutoFilling ? 'Extracting...' : 'Auto-Fill'}</span>
                  </button>
                </div>

                {autoFillSuccess && (
                  <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{autoFillSuccess}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-zinc-300">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Green Mountain Bakery & Roastery"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Website URL Slug *</label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs">
                    <span className="text-zinc-500 font-mono">townraise.org/site/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="green-mountain-bakery"
                      className="bg-transparent text-amber-400 font-mono font-bold focus:outline-none flex-1 ml-1"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Order Dispatch Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(603) 555-0199"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-zinc-300">Short Catchphrase / Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Artisanal Sourdough & Specialty Coffee Roasted in Carroll County"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-zinc-300">Town Node</label>
                    <select
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {towns.map((t) => (
                        <option key={t.id} value={t.name} className="bg-[#0a0a0f]">
                          {t.icon} {t.fullName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-zinc-300">Logo Emoji / Icon</label>
                    <input
                      type="text"
                      value={logoEmoji}
                      onChange={(e) => setLogoEmoji(e.target.value)}
                      placeholder="☕ or 🍕"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-lg text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 14 Elm Street, Effingham, NH"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <ImageUpload
                    value={coverImageUrl}
                    onChange={(url) => setCoverImageUrl(url)}
                    label="Storefront Header Cover Banner"
                    subtitle="High-resolution panoramic banner photo of your storefront, restaurant, or products"
                    aspectRatio="wide"
                    maxDimension={1200}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!businessName.trim()}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Next: Add Products & Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCTS / MENU BUILDER */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400">Step 2 of 3</span>
                  <h2 className="text-2xl font-black text-white uppercase">Menu & Product Catalog</h2>
                </div>
                <span className="text-xs font-mono text-zinc-400">{products.length} Items Configured</span>
              </div>

              {/* Add New Item Form */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add Product or Menu Item</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="Item Name (e.g. Sourdough Loaf)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />

                  <input
                    type="number"
                    step="0.50"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    placeholder="Price ($) (e.g. 8.50)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />

                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="Category (e.g. Bakery, Subs, Drinks)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    placeholder="Description / Ingredients..."
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />

                  <input
                    type="text"
                    value={newItemBadge}
                    onChange={(e) => setNewItemBadge(e.target.value)}
                    placeholder="Optional Badge (e.g. Best Seller, Organic)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <ImageUpload
                  value={newItemImage}
                  onChange={(url) => setNewItemImage(url)}
                  label="Product Photo (Optional)"
                  subtitle="Upload an appetizing photo of this dish or item"
                  aspectRatio="card"
                  compact={true}
                />

                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!newItemName.trim() || !newItemPrice}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item to Menu</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase text-zinc-400">Current Catalog Items:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-xs">{p.name}</h4>
                          <span className="text-amber-400 font-mono font-black text-xs">${p.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">{p.description}</p>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">{p.category}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveProduct(p.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={products.length === 0}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <span>Next: Delivery & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DELIVERY & LAUNCH */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono uppercase text-amber-400">Step 3 of 3</span>
                <h2 className="text-2xl font-black text-white uppercase">Delivery & Launch Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Minimum Order ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={minOrder}
                    onChange={(e) => setMinOrder(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">Estimated Prep Time</label>
                  <input
                    type="text"
                    value={estimatedPrepTime}
                    onChange={(e) => setEstimatedPrepTime(e.target.value)}
                    placeholder="20-30 mins"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Deployment Modes Checkboxes */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase text-zinc-400">Where to Deploy:</span>
                
                <label className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5 cursor-pointer hover:border-amber-400/40 transition-all">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 mt-0.5 rounded accent-amber-400"
                  />
                  <div>
                    <strong className="text-white text-xs block">1. Standalone Branded Website (`/site/{slug || 'my-business'}`)</strong>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      Your own dedicated ordering page with custom cover banner, logo, Google review badge, and tabletop QR menu.
                    </p>
                  </div>
                </label>

                <label className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-start gap-3.5 cursor-pointer hover:border-amber-400/40 transition-all">
                  <input
                    type="checkbox"
                    checked={listOnMarketplace}
                    onChange={(e) => setListOnMarketplace(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded accent-amber-400"
                  />
                  <div>
                    <strong className="text-white text-xs block">2. List Products on Oasis Town Marketplace (`/marketplace`)</strong>
                    <p className="text-[11px] text-zinc-400 leading-tight">
                      Allows town residents browsing the community catalog to discover your items and order delivery.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish My Website & Storefront</span>
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
