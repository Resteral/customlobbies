'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  UtensilsCrossed, Sparkles, Clock, MapPin, Star, 
  ShoppingBag, Truck, ChevronRight, Plus, Check, 
  Search, ShieldCheck, Flame, Heart, Coffee, Pizza, 
  Sandwich, Store, ArrowRight, X, AlertCircle
} from 'lucide-react';
import { StorefrontProduct, MerchantStorefront } from '@/lib/types';
import FoodCustomizerModal from '@/components/FoodCustomizerModal';

const CUISINE_TAGS = [
  { id: 'all', label: 'All Eateries', icon: '🍽️' },
  { id: 'subs', label: 'Hot Subs & Deli', icon: '🥪' },
  { id: 'pizza', label: 'Brick Oven Pizza', icon: '🍕' },
  { id: 'bbq', label: 'Smokehouse BBQ', icon: '🥩' },
  { id: 'coffee', label: 'Coffee & Bakery', icon: '☕' },
  { id: 'breakfast', label: 'Country Breakfast', icon: '🍳' },
  { id: 'pantry', label: 'Maple & Pantry', icon: '🍯' },
];

export default function EatsPage() {
  const router = useRouter();
  const { storefronts, activeTown, userMembership } = useNfcStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  
  // Customizer modal state
  const [customizingProduct, setCustomizingProduct] = useState<{ product: StorefrontProduct; store: MerchantStorefront } | null>(null);

  // Filter storefronts by active town (or show all with matching search)
  const filteredStores = storefronts.filter(store => {
    if (!store.isPublished) return false;
    
    // Search query filter
    const matchesSearch = searchQuery.trim() === '' || 
      store.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.products.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Category tag filter
    if (activeCategory === 'all') return true;
    if (activeCategory === 'subs') return store.products.some(p => p.category.toLowerCase().includes('sub'));
    if (activeCategory === 'pizza') return store.products.some(p => p.category.toLowerCase().includes('pizza'));
    if (activeCategory === 'bbq') return store.products.some(p => p.category.toLowerCase().includes('bbq') || p.description.toLowerCase().includes('smoke'));
    if (activeCategory === 'coffee') return store.products.some(p => p.category.toLowerCase().includes('coffee') || p.category.toLowerCase().includes('bakery'));
    if (activeCategory === 'breakfast') return store.tagline.toLowerCase().includes('breakfast') || store.description.toLowerCase().includes('breakfast');
    if (activeCategory === 'pantry') return store.products.some(p => p.category.toLowerCase().includes('pantry') || p.category.toLowerCase().includes('maple'));

    return true;
  });

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-32 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-10">
        
        {/* Top Header & Delivery/Pickup Switcher */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>DoorDash & UberEats Decentralized Grid</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">
              Oasis <span className="text-amber-400">Eats</span> & Courier Hub
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Fresh hot meals, wood-fired pizzas, specialty morning roasts, and local provisions delivered straight to your door with live GPS tracking.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-[#0e0e14] border border-white/10 shrink-0 shadow-lg">
            <button
              onClick={() => setDeliveryMode('delivery')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                deliveryMode === 'delivery'
                  ? 'bg-amber-400 text-black shadow-md shadow-amber-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Delivery (15-30m)</span>
            </button>
            <button
              onClick={() => setDeliveryMode('pickup')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                deliveryMode === 'pickup'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Pickup (Ready 15m)</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, burgers, pizza, coffee, or restaurants..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs md:text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CUISINE_TAGS.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveCategory(tag.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  activeCategory === tag.id
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Restaurant / Store Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="text-xl font-black italic tracking-tight text-white uppercase flex items-center gap-2">
              <span>Featured Local Eateries in {activeTown.name}</span>
              <span className="text-xs font-mono font-normal text-amber-400">({filteredStores.length} Open)</span>
            </h2>
            <div className="flex items-center gap-3">
              <Link 
                href="/menus"
                className="px-3.5 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold hover:bg-amber-400/20 transition-all flex items-center gap-1.5"
              >
                <span>📖 View All Digital Menus & QR</span>
              </Link>
              <Link 
                href="/create-storefront"
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>List Your Restaurant</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {filteredStores.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl p-8 space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="text-sm font-bold text-zinc-400">No eateries match your selected filter or town.</p>
              <button
                onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                className="text-xs text-amber-400 font-bold underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStores.map(store => {
                const passDiscount = userMembership.active && userMembership.tier !== 'free';
                const effectiveDeliveryFee = passDiscount ? 0 : store.deliveryFee;

                return (
                  <div
                    key={store.id}
                    className="group bg-[#0b0b10] border border-white/10 hover:border-amber-500/30 rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Banner Image & Top Badges */}
                      <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                        <img
                          src={store.coverImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80'}
                          alt={store.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-black/40 to-transparent" />
                        
                        {/* Emoji & Quick Badges */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div className="w-11 h-11 rounded-2xl bg-[#070709]/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-xl">
                            {store.logoEmoji}
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-[#070709]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold uppercase text-white">
                            {store.town}, {store.state}
                          </span>
                        </div>

                        {/* Delivery Time & Pass Badges */}
                        <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
                          <span className="px-3 py-1 rounded-xl bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {store.estimatedPrepTime}
                          </span>
                          {passDiscount ? (
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/90 text-black text-[9px] font-black uppercase tracking-widest shadow-md">
                              $0 Free Delivery Pass
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-zinc-300">
                              ${store.deliveryFee.toFixed(2)} Delivery Fee
                            </span>
                          )}
                        </div>

                        {/* Store Info Bottom Overlay */}
                        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                          <div>
                            <h3 className="text-2xl font-black italic tracking-tight text-white uppercase group-hover:text-amber-400 transition-colors">
                              {store.businessName}
                            </h3>
                            <p className="text-xs text-zinc-300 line-clamp-1 max-w-md">
                              {store.tagline}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded-xl border border-white/10 text-xs font-bold text-white shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{store.googleRating.toFixed(1)}</span>
                            <span className="text-[10px] text-zinc-400">({store.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Featured Menu Items Row (DoorDash style horizontal cards) */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                          <span>Popular Dishes & Specialties</span>
                          <span className="text-amber-400">Min Order: ${store.minOrder.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {store.products.slice(0, 4).map(prod => (
                            <div
                              key={prod.id}
                              onClick={() => setCustomizingProduct({ product: prod, store })}
                              className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-amber-400/30 transition-all cursor-pointer flex items-center justify-between gap-3 group/item"
                            >
                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-xs text-white group-hover/item:text-amber-300 transition-colors truncate">
                                    {prod.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-400 line-clamp-1">{prod.description}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-amber-400">
                                    {formatCurrency(prod.price)}
                                  </span>
                                  {prod.badge && (
                                    <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                      {prod.badge}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 shrink-0">
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity">
                                  <Plus className="w-5 h-5 text-white bg-amber-500 rounded-full p-0.5 shadow-lg" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-4 mt-2">
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{store.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/site/${store.slug}`}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all border border-white/10"
                        >
                          Full Menu
                        </Link>
                        <button
                          onClick={() => {
                            if (store.products.length > 0) {
                              setCustomizingProduct({ product: store.products[0], store });
                            } else {
                              router.push(`/site/${store.slug}`);
                            }
                          }}
                          className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-1"
                        >
                          <span>Order Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Courier Dispatch Banner / Driver Recruitment */}
        <div className="p-8 md:p-10 rounded-[3rem] bg-gradient-to-r from-indigo-950/40 via-[#0b0b12] to-amber-950/30 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 animate-pulse" />
              <span>Direct Courier Dispatch Network</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase text-white">
              Want to Drive & Deliver for <span className="text-amber-400">Oasis Eats</span>?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Earn 100% of delivery fees + 100% of customer tips with direct phone relays dispatched to your phone without huge app commissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20"
            >
              Apply as Local Courier
            </Link>
            <Link
              href="/create-storefront"
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/10"
            >
              Add Restaurant Menu
            </Link>
          </div>
        </div>

      </div>

      {/* Item Customizer Modal */}
      {customizingProduct && (
        <FoodCustomizerModal
          product={customizingProduct.product}
          store={customizingProduct.store}
          onClose={() => setCustomizingProduct(null)}
          onAdded={() => {
            setCustomizingProduct(null);
          }}
        />
      )}
    </div>
  );
}
