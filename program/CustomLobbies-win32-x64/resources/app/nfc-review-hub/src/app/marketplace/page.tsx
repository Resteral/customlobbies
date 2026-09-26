'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { ReviewProduct } from '@/lib/types';
import CardCustomizerModal from '@/components/CardCustomizerModal';
import LiveShoutoutStreamerBar from '@/components/LiveShoutoutStreamerBar';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Sparkles, Star, Sliders, ShoppingBag, ShieldCheck, 
  Radio, CheckCircle2, Search, Filter, Cpu, Layers, 
  Users, MessageSquare, ArrowRight, Truck, MapPin, Plus, Play, Video
} from 'lucide-react';

export default function MarketplacePage() {
  const { products, sellers, shoutouts, addToCart } = useNfcStore();
  const [viewMode, setViewMode] = useState<'items' | 'sellers'>('items');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState<ReviewProduct | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Fleet', icon: '✨' },
    { id: 'cards', label: 'NFC Cards', icon: '💳' },
    { id: 'stands', label: 'Tabletop Acrylics', icon: '💎' },
    { id: 'stickers', label: 'Tap Stickers', icon: '🏷️' },
    { id: 'artisan', label: 'Artisan Crafts', icon: '🎨' },
    { id: 'food', label: 'Bakehouse & Eats', icon: '🥐' },
    { id: 'bundles', label: 'Bundles', icon: '📦' },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sellerName && p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const filteredSellers = sellers.filter((s) => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.town.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleQuickAdd = (p: ReviewProduct) => {
    addToCart(p);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1500);
  };

  return (
    <div className="relative min-h-screen pt-20 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[160px] pointer-events-none -z-10" />

      {/* Live Streamer Broadcast Marquee */}
      <div className="mb-6">
        <LiveShoutoutStreamerBar />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-16">
        
        {/* Marketplace Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              The Global Oasis Discovery Network
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white">
            Discover <span className="text-amber-400">Everything.</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Boutiques, artisan treasures, smart NFC hardware, and instant local courier deliveries from the world's most premium independent ecosystem.
          </p>
        </div>

        {/* View Mode Switcher: Items vs Sellers (Matching Oasis Effingham) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-3xl backdrop-blur-xl">
          
          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setViewMode('items')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'items'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛍️ Items Catalog
            </button>
            <button
              onClick={() => setViewMode('sellers')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'sellers'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              👥 Community Sellers ({sellers.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={viewMode === 'items' ? "Search items, crafts..." : "Search sellers, towns..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/csv-importer"
              className="px-4 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
            >
              <span>📄 Bulk CSV Importer</span>
            </Link>

            <Link
              href="/sell"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>List Your Item</span>
            </Link>
          </div>
        </div>

        {/* Categories if in Items View */}
        {viewMode === 'items' && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Grid: Items View vs Sellers View */}
        {viewMode === 'items' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Products Grid */}
            <div className="lg:col-span-8">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 group relative overflow-hidden space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                          />
                          {product.badge && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-black font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                              {product.badge}
                            </span>
                          )}
                          {product.town && (
                            <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-white font-mono text-[8px] uppercase tracking-wider rounded-lg border border-white/10 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-400" /> {product.town}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span className="font-mono text-white text-[11px] font-bold">{product.rating}</span>
                              <span className="text-zinc-500 font-mono text-[10px]">({product.reviewsCount})</span>
                            </div>
                            {product.sellerName && (
                              <span className="text-[10px] font-mono text-indigo-400 font-bold">{product.sellerName}</span>
                            )}
                          </div>

                          <h3 className="text-xl font-black italic text-white tracking-tight leading-snug">
                            {product.name}
                          </h3>

                          <p className="text-xs text-zinc-400 line-clamp-2">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 space-y-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-2xl font-black italic text-amber-400">{formatCurrency(product.price)}</span>
                          <span className="text-[9px] font-mono text-emerald-400 uppercase">Express Courier Ready</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSelectedProductForCustomization(product)}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                          >
                            <Sliders className="w-3.5 h-3.5 text-amber-400" />
                            <span>Customize</span>
                          </button>

                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-1 font-sans"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{justAddedId === product.id ? 'Added! ✓' : 'Add to Cart'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-[#0b0b10] border border-white/10 rounded-[2.5rem] space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                    🛍️
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                      Explore Catalog Ready For Items
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      No products are listed in this category yet. Import products in bulk via CSV, create a merchant storefront, or build custom NFC smart hardware.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Link
                      href="/csv-importer"
                      className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:opacity-95 transition-all shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                      Import CSV Catalog
                    </Link>
                    <Link
                      href="/create-storefront"
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      Register Storefront
                    </Link>
                    <Link
                      href="/creator"
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      NFC Creator
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar: Live Social Pulse & Shoutouts */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-mono uppercase text-indigo-400">Live Pulse</span>
                    <h3 className="text-lg font-black italic uppercase text-white">Global Shoutouts</h3>
                  </div>
                  <Link href="/community" className="text-[10px] font-mono text-amber-400 hover:underline uppercase">
                    View Wire →
                  </Link>
                </div>

                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {shoutouts.slice(0, 4).map((s) => {
                    const isStream = s.isLiveStream || s.tag === 'stream';
                    return (
                      <div
                        key={s.id}
                        className={`p-4 rounded-2xl space-y-2 transition-colors border ${
                          isStream 
                            ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/60' 
                            : 'bg-white/[0.02] border-white/5 hover:border-indigo-400/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{s.authorAvatar}</span>
                            <div>
                              <p className="text-xs font-bold text-white">{s.authorName}</p>
                              <p className="text-[9px] font-mono text-zinc-500">{formatDate(s.timestamp)}</p>
                            </div>
                          </div>
                          <span className={`text-[8px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            isStream 
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' 
                              : 'bg-white/5 text-amber-400'
                          }`}>
                            {isStream ? '🔴 Live Stream' : `#${s.tag}`}
                          </span>
                        </div>
                        {isStream && s.streamTitle && (
                          <p className="text-[11px] font-bold text-amber-300 line-clamp-1">
                            {s.streamTitle}
                          </p>
                        )}
                        <p className="text-xs text-zinc-300 leading-snug line-clamp-3">{s.content}</p>
                        {isStream && (
                          <Link
                            href="/community"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-red-400 hover:text-red-300 uppercase pt-1"
                          >
                            <Play className="w-2.5 h-2.5 fill-red-400" />
                            <span>Watch Stream Wire →</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Onboard node promo card */}
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-6 rounded-3xl text-black space-y-3 shadow-xl">
                  <h4 className="text-lg font-black italic uppercase leading-tight">Scale Your Discovery.</h4>
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    Broadcast your independent boutique or craft across the Oasis network.
                  </p>
                  <Link
                    href="/sell"
                    className="block w-full py-2.5 bg-black text-white text-[10px] font-black uppercase tracking-widest text-center rounded-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Onboard Node
                  </Link>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Sellers Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between hover:border-amber-400/40 transition-all space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {seller.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black italic text-white text-lg">{seller.name}</h3>
                          {seller.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-[10px] font-mono text-indigo-400">{seller.role}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-xs font-mono font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {seller.rating}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{seller.bio}</p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {seller.town}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-amber-400" /> {seller.totalDeliveriesCompleted} Deliveries</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                  <Link
                    href={`/sellers/${seller.id}`}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all"
                  >
                    View Catalog
                  </Link>

                  <Link
                    href="/order"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-md"
                  >
                    Order Courier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Customizer Modal */}
        {selectedProductForCustomization && (
          <CardCustomizerModal
            product={selectedProductForCustomization}
            isOpen={!!selectedProductForCustomization}
            onClose={() => setSelectedProductForCustomization(null)}
          />
        )}
      </div>
    </div>
  );
}
