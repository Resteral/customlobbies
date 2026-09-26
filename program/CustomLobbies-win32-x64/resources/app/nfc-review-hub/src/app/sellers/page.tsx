'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  ShieldCheck, Star, Truck, MapPin, 
  ArrowRight, Sparkles, ShoppingBag, Plus, Phone 
} from 'lucide-react';

export default function SellersDirectoryPage() {
  const { sellers, products } = useNfcStore();
  const [selectedTown, setSelectedTown] = useState<string>('all');

  const towns = ['all', 'Effingham, NH', 'Freedom, NH', 'Ossipee, NH'];

  const filteredSellers = sellers.filter(s => {
    if (selectedTown === 'all') return true;
    return s.town.toLowerCase().includes(selectedTown.toLowerCase().split(',')[0]);
  });

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Artisan & Merchant Network</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              Community <span className="text-amber-400">Sellers.</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Meet the independent craftsmen, bakeries, coffee roasters, and couriers powering the local Oasis ecosystem.
            </p>
          </div>

          <Link
            href="/sell"
            className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard as Seller</span>
          </Link>
        </div>

        {/* Town Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {towns.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTown(t)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedTown === t
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {t === 'all' ? '✨ All Regional Nodes' : `📍 ${t}`}
            </button>
          ))}
        </div>

        {/* Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSellers.map((seller) => {
            const sellerProducts = products.filter(p => p.sellerId === seller.id || p.sellerName === seller.name);
            return (
              <div
                key={seller.id}
                className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {seller.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black italic text-white text-lg leading-snug">{seller.name}</h3>
                          {seller.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-indigo-400">{seller.role}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {seller.rating}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {seller.bio}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> {seller.town}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-amber-400" /> {seller.totalDeliveriesCompleted} Deliveries</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                    <span>Active Marketplace Items:</span>
                    <span className="text-white font-bold">{sellerProducts.length} Items</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/sellers/${seller.id}`}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1"
                    >
                      <span>View Profile</span>
                    </Link>

                    <Link
                      href="/order"
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-[10px] font-black uppercase tracking-widest text-center transition-all shadow-md shadow-amber-400/20 flex items-center justify-center gap-1"
                    >
                      <span>Order Direct</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
