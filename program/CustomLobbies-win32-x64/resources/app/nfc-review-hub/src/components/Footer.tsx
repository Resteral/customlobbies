'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, Smartphone, Cpu, Store, Wrench, Compass, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050507] pt-20 pb-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 pb-16 border-b border-white/5">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img 
                src="/townraise-logo.png" 
                alt="Townraise" 
                className="h-9 w-auto object-contain" 
              />
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Empowering local business ownership across Carroll County. Connect storefronts, trade contractors, and couriers under one unified decentralized platform.
            </p>
            <div className="flex flex-col gap-1.5 text-[11px] font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Merchant Shield</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Courier Relay</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-400" /> Dual-Channel Reviews</span>
            </div>
            <div className="pt-2">
              <Link 
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>🔥 Read Founder's Manifesto →</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Business Registration & Ownership */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" /> Business Ownership
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li>
                <Link href="/create-storefront" className="text-amber-300 font-bold hover:text-amber-200 transition-colors flex items-center gap-1">
                  <span>🏪 Register a Storefront</span>
                </Link>
              </li>
              <li>
                <Link href="/work" className="text-emerald-300 font-bold hover:text-emerald-200 transition-colors flex items-center gap-1">
                  <span>🛠️ Register as Contractor</span>
                </Link>
              </li>
              <li><Link href="/menus" className="hover:text-white transition-colors">Digital Menu Ordering</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Managed Business OS</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Merchant Dashboard</Link></li>
              <li><Link href="/directory" className="hover:text-white transition-colors">Carroll County Directory</Link></li>
            </ul>
          </div>

          {/* Col 3: Exploration & Scavenger Trails */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Exploration & Movement
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/about" className="text-amber-300 font-bold hover:text-amber-200 transition-colors flex items-center gap-1.5"><span>🔥 About Us & Manifesto</span></Link></li>
              <li><Link href="/spread" className="text-amber-400 font-black hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>📢 Spread Word & Print Flyers</span></Link></li>
              <li><Link href="/society" className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1.5"><span>🏛️ Sovereign Society & Vault</span></Link></li>
              <li><Link href="/store-hunting" className="text-pink-400 font-bold hover:text-pink-300 transition-colors">🛍️ Store-to-Store Circuits</Link></li>
              <li><Link href="/tourist-hunts" className="hover:text-white transition-colors">🧭 Tourist Scavenger Hunts</Link></li>
              <li><Link href="/leaderboard" className="text-amber-400 hover:text-amber-300 transition-colors">🏆 Town Pride Cup Ladder</Link></li>
              <li><Link href="/claim" className="hover:text-white transition-colors">🎁 Claim Giveaway Pass</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">📅 Live Events & Fairs</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">📢 Community Dispatch Feed</Link></li>
            </ul>
          </div>

          {/* Col 4: Hardware & NFC Fleet */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">NFC Review Hardware</h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li><Link href="/creator" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">⚡ All-in-One NFC Creator</Link></li>
              <li><Link href="/dashboard/admin" className="hover:text-white transition-colors">📇 Admin Card Database</Link></li>
              <li><Link href="/marketplace?cat=cards" className="hover:text-white transition-colors">Obsidian PVC Smart Cards</Link></li>
              <li><Link href="/marketplace?cat=stands" className="hover:text-white transition-colors">Cyber Glass Table Stands</Link></li>
              <li><Link href="/marketplace?cat=cards" className="hover:text-white transition-colors">Eco-Bamboo Laser Cards</Link></li>
              <li><Link href="/marketplace?cat=stickers" className="hover:text-white transition-colors">3M Weatherproof Stickers</Link></li>
            </ul>
          </div>

          {/* Col 5: Dispatch & Contact Lead */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">Courier & Contact</h4>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <div>
                  <div className="font-black text-white text-xs">Sean Martin</div>
                  <div className="text-[10px] text-amber-400 font-mono">Founding Vanguard & Courier</div>
                </div>
              </div>
              <div className="space-y-1.5 pt-1 font-mono text-[11px]">
                <a 
                  href="tel:5085070305" 
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>508-507-0305</span>
                </a>
                <a 
                  href="mailto:frijj555@gmail.com" 
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-400 transition-colors break-all"
                >
                  <span className="text-amber-400 font-bold shrink-0">@</span>
                  <span>frijj555@gmail.com</span>
                </a>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('townraise_install_banner_dismissed');
                      window.location.reload();
                    }
                  }}
                  className="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black text-[10px] font-black uppercase tracking-wider transition-all text-center cursor-pointer shadow-md shadow-amber-500/20"
                >
                  📲 Install to Phone Home Screen
                </button>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30 transition-all text-center"
                >
                  Direct Contact Page →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <p>© 2026 Townraise. Uniting Carroll County Independent Merchants, Contractors & Couriers.</p>
          <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest">
            <span className="text-emerald-400/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 
              <span>Decentralized Regional Network</span>
            </span>
            <span className="text-amber-400">Zero Commission System</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
