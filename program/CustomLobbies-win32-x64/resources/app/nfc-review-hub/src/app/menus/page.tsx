'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { StorefrontProduct, MerchantStorefront } from '@/lib/types';
import FoodCustomizerModal from '@/components/FoodCustomizerModal';
import QRCode from 'qrcode';
import { 
  UtensilsCrossed, Sparkles, Clock, MapPin, Star, 
  ShoppingBag, Truck, Plus, Check, Search, Phone, 
  Share2, QrCode, ArrowRight, X, Flame, Coffee, 
  Pizza, Sandwich, ShieldCheck, Download, ExternalLink
} from 'lucide-react';

export default function DigitalMenusPage() {
  const { storefronts, addToCart, playDeliveryChime } = useNfcStore();
  
  // Selected Storefront
  const [selectedStoreSlug, setSelectedStoreSlug] = useState<string>(storefronts[0]?.slug || 'pnb-eats');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Customizer modal state
  const [customizingProduct, setCustomizingProduct] = useState<{ product: StorefrontProduct; store: MerchantStorefront } | null>(null);

  const currentStore = useMemo(() => {
    return storefronts.find(s => s.slug.toLowerCase() === selectedStoreSlug.toLowerCase()) || storefronts[0];
  }, [storefronts, selectedStoreSlug]);

  // Generate QR Code for Current Restaurant Menu on Phone
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStore) {
      const menuUrl = `${window.location.origin}/site/${currentStore.slug}`;
      QRCode.toDataURL(menuUrl, {
        width: 340,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => setQrCodeDataUrl(url)).catch(() => {});
    }
  }, [currentStore]);

  // Categories for current restaurant
  const categories = useMemo(() => {
    if (!currentStore) return ['all'];
    const cats = Array.from(new Set(currentStore.products.map(p => p.category)));
    return ['all', ...cats];
  }, [currentStore]);

  // Filtered menu items
  const filteredProducts = useMemo(() => {
    if (!currentStore) return [];
    return currentStore.products.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchQuery = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [currentStore, selectedCategory, searchQuery]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && currentStore) {
      const url = `${window.location.origin}/site/${currentStore.slug}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Glow Ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-80 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>Digital Menus & Mobile Table Ordering</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            Carroll County <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Digital Menus</span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 font-medium leading-relaxed">
            Browse complete full menus with food photos, sauces, custom sides, and calorie counts from local kitchens in Effingham, Ossipee, Freedom, and Conway. Order for express delivery or scan on your phone!
          </p>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Open on Phone via QR</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>{isCopied ? 'Menu Link Copied!' : 'Share Menu Link'}</span>
            </button>

            <Link
              href="/cart"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart & Checkout</span>
            </Link>
          </div>
        </div>

        {/* Restaurant Selector Tabs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50 px-1">
            <span>Select Restaurant / Eatery:</span>
            <span className="text-amber-400">{storefronts.length} Local Menus Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {storefronts.map((store) => {
              const isSelected = store.slug === selectedStoreSlug;
              return (
                <button
                  key={store.id}
                  onClick={() => {
                    setSelectedStoreSlug(store.slug);
                    setSelectedCategory('all');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-2 relative group ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 shadow-xl shadow-amber-500/10 ring-1 ring-amber-400/30'
                      : 'bg-[#0b0c10] border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{store.logoEmoji || '🍽️'}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-amber-400 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400" />
                      {store.googleRating || 4.9}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-xs font-black leading-tight line-clamp-1 ${
                      isSelected ? 'text-amber-300' : 'text-white'
                    }`}>
                      {store.businessName}
                    </h3>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {store.town}, {store.state}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Restaurant Banner Info */}
        {currentStore && (
          <div className="p-6 bg-[#0c0d14] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl shrink-0">
                {currentStore.logoEmoji || '🍽️'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-black text-white">{currentStore.businessName}</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Open for Delivery & Pickup
                  </span>
                </div>
                <p className="text-xs text-white/60 max-w-xl">{currentStore.description}</p>
                <div className="flex items-center gap-4 text-xs font-mono text-white/40 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-white/70">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> {currentStore.address}
                  </span>
                  <span className="flex items-center gap-1 text-white/70">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> Prep: {currentStore.estimatedPrepTime || '20-30 mins'}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <Truck className="w-3.5 h-3.5" /> Delivery Fee: {formatCurrency(currentStore.deliveryFee || 3.99)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <a
                href={`tel:${currentStore.phone.replace(/[^0-9]/g, '')}`}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {currentStore.phone}</span>
              </a>

              <Link
                href={`/site/${currentStore.slug}`}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all hover:scale-105 shadow-md shadow-amber-400/20"
              >
                <span>Standalone Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Filter and Category Bar */}
        <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? '✨ All Items' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>{selectedCategory === 'all' ? 'Full Digital Menu' : selectedCategory}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                {filteredProducts.length} Items
              </span>
            </h3>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/10 rounded-3xl space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-white/20 mx-auto" />
              <h4 className="text-base font-bold text-white">No menu items match your search</h4>
              <p className="text-xs text-white/40">Try adjusting your search query or switching categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#0b0c10] border border-white/10 hover:border-amber-400/40 rounded-3xl p-5 space-y-4 transition-all duration-300 shadow-xl flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    {/* Food Photo with Badge */}
                    {product.imageUrl && (
                      <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/5 bg-black/40">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {product.badge && (
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider shadow-md">
                            {product.badge}
                          </span>
                        )}
                        {product.calories && (
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-white/70 text-[9px] font-mono">
                            {product.calories}
                          </span>
                        )}
                      </div>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-black text-white text-base group-hover:text-amber-300 transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-base font-black text-amber-400 shrink-0">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed mt-1 line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    {/* Option Groups Indicator if product has customization */}
                    {product.optionGroups && product.optionGroups.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {product.optionGroups.map(og => (
                          <span key={og.id} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 font-bold">
                            + {og.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add / Customize Button */}
                  <button
                    onClick={() => {
                      if (currentStore) {
                        setCustomizingProduct({ product, store: currentStore });
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{product.optionGroups && product.optionGroups.length > 0 ? 'Customize & Add' : 'Add to Order'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* PHONE QR CODE MODAL */}
      {showQrModal && currentStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/15 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/30">
                Instant Mobile Menu
              </span>
              <h3 className="text-lg font-black text-white">{currentStore.businessName}</h3>
              <p className="text-xs text-white/60">
                Scan with any phone camera to view the menu at your table or on the road.
              </p>
            </div>

            {qrCodeDataUrl && (
              <div className="p-3 bg-white rounded-2xl mx-auto inline-block shadow-xl">
                <img src={qrCodeDataUrl} alt="Menu QR Code" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isCopied ? 'Link Copied!' : 'Copy Mobile Menu Link'}</span>
              </button>

              <a
                href={`/site/${currentStore.slug}`}
                className="block w-full py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase tracking-wider transition-colors"
              >
                Open Mobile Web Menu Now ➔
              </a>
            </div>
          </div>
        </div>
      )}

      {/* FOOD CUSTOMIZER MODAL */}
      {customizingProduct && (
        <FoodCustomizerModal
          product={customizingProduct.product}
          store={customizingProduct.store}
          onClose={() => setCustomizingProduct(null)}
          onAdded={() => {
            playDeliveryChime();
            setCustomizingProduct(null);
          }}
        />
      )}

    </div>
  );
}
