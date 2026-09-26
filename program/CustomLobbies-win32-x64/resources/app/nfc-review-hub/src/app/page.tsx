'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import HeroTapSimulator from '@/components/HeroTapSimulator';
import CardCustomizerModal from '@/components/CardCustomizerModal';
import LocalConditionsHUD from '@/components/LocalConditionsHUD';
import LiveShoutoutStreamerBar from '@/components/LiveShoutoutStreamerBar';
import { ReviewProduct } from '@/lib/types';
import { 
  Radio, Sparkles, ShieldCheck, Zap, TrendingUp, Star, 
  ArrowRight, CheckCircle2, ChevronRight, Cpu, Activity,
  Sliders, ShoppingBag, Eye, Layers, Compass, Truck, Phone,
  Building2, MessageSquare, Code2, Plus, Check, ShoppingCart, Flame
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const { products, cart, addToCart } = useNfcStore();
  const [selectedCustomProduct, setSelectedCustomProduct] = useState<ReviewProduct | null>(null);
  const [selectedMarketplaceCategory, setSelectedMarketplaceCategory] = useState<string>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  
  // Cart summary
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleQuickAddToCart = (p: ReviewProduct) => {
    addToCart(p);
    setJustAddedId(p.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleInstantBuy = (p: ReviewProduct) => {
    addToCart(p);
    router.push('/cart');
  };

  const marketplaceCategories = [
    { id: 'all', label: 'All Products', icon: '✨' },
    { id: 'cards', label: 'NFC Cards', icon: '💳' },
    { id: 'stands', label: 'Tabletop Acrylics', icon: '💎' },
    { id: 'stickers', label: 'Tap Stickers', icon: '🏷️' },
    { id: 'food', label: 'Bakehouse & Honey', icon: '🍯' },
    { id: 'artisan', label: 'Artisan Woodcraft', icon: '🪵' },
    { id: 'bundles', label: 'Fleet Bundles', icon: '📦' },
  ];

  const filteredMarketplaceProducts = products.filter((p) => {
    if (selectedMarketplaceCategory === 'all') return true;
    return p.category === selectedMarketplaceCategory;
  });
  
  // ROI Calculator State
  const [dailyCustomers, setDailyCustomers] = useState(120);
  const [avgTicket, setAvgTicket] = useState(35);
  
  // Calculate projected ROI
  const estimatedReviewsPerMonth = Math.round(dailyCustomers * 30 * 0.08); // 8% tap conversion
  const newRevenueProjected = Math.round(estimatedReviewsPerMonth * 1.8 * avgTicket);

  return (
    <div className="relative min-h-screen pt-20 pb-32 overflow-hidden">
      
      {/* Hyper-Local Mountain & Lake Conditions HUD */}
      <div className="mb-4">
        <LocalConditionsHUD />
      </div>

      {/* Real-Time Live Shoutouts & Streamer Wire */}
      <div className="mb-6">
        <LiveShoutoutStreamerBar />
      </div>
      
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[5%] w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-36">

        {/* 1. HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                Townraise • People-Powered Town OS
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.95] text-white">
              Powered by the People. <br />
              <span className="text-amber-400">Owned by</span> <span className="text-emerald-400">Our Towns</span>.
            </h1>

            <p className="text-base text-zinc-400 font-medium leading-relaxed max-w-xl">
              Carroll County's decentralized commerce and community operating system. Built by residents, run by local shop owners, trade contractors, and mountain drivers with 0% corporate middleman cuts.
            </p>

            {/* Dual Business Registration Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/create-storefront"
                className="px-7 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <span>🏪 Register Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/work"
                className="px-7 py-4 bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 border border-emerald-400/40 text-emerald-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-400/20 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                <span>🛠️ Register as Contractor</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
              <Link
                href="/marketplace"
                className="px-6 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:border-amber-400/40 transition-all flex items-center gap-2"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>NFC Hardware Fleet</span>
              </Link>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
              <div>
                <p className="text-3xl font-black italic text-white tracking-tight">12.8x</p>
                <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Review Velocity</p>
              </div>
              <div>
                <p className="text-3xl font-black italic text-amber-400 tracking-tight">0% Cut</p>
                <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Zero Commission</p>
              </div>
              <div>
                <p className="text-3xl font-black italic text-emerald-400 tracking-tight">6 Towns</p>
                <p className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Unified Dispatch</p>
              </div>
            </div>
          </div>

          {/* Right Interactive Phone & Card Simulator */}
          <div className="lg:col-span-6">
            <HeroTapSimulator />
          </div>
        </section>

        {/* 1.5 DUAL-TRACK BUSINESS REGISTRATION SPOTLIGHT */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Start & Scale Your Carroll County Operation
            </span>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              Choose Your Business Path
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Whether you run a local diner, smoke shop, cafe, or trade business, Townraise gives you the modern digital tools to dominate your market.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Track 1: Retail Storefront / Restaurant */}
            <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-amber-500/10 via-[#0d0d14] to-[#07070a] border border-amber-500/30 space-y-6 flex flex-col justify-between group hover:border-amber-400 transition-all shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
                    🏪
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Retail & Dining Track
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tight">
                    Retail Storefront, Restaurant & Cafe
                  </h3>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    Designed for diners, pizzerias, boutiques, farmstands, and retail stores in Effingham, Ossipee, Freedom, Wolfeboro, Conway, and Tamworth.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>📱</span> Digital Menu Ordering
                    </div>
                    <p className="text-[10px] text-zinc-400">Mobile-ready menu with modifiers, options, and direct checkout.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>⚡</span> Tabletop Tap Stands
                    </div>
                    <p className="text-[10px] text-zinc-400">Diners tap to view menu or review on Google in 0.1 seconds.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🚚</span> Sean Martin Courier Sync
                    </div>
                    <p className="text-[10px] text-zinc-400">Orders automatically relay to local delivery drivers with GPS.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🛡️</span> 5-Star Feedback Shield
                    </div>
                    <p className="text-[10px] text-zinc-400">Pushes 5-stars to Google, catches unhappy guests privately.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/create-storefront"
                  className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Register Storefront in 60 Seconds</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Track 2: Trade Contractor / Builder */}
            <div className="relative p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-b from-emerald-500/10 via-[#0d0d14] to-[#07070a] border border-emerald-500/30 space-y-6 flex flex-col justify-between group hover:border-emerald-400 transition-all shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">
                    🛠️
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                    Contractor & Trades Track
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tight">
                    Licensed Contractor & Trade Specialist
                  </h3>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                    Designed for carpenters, deck builders, tree services, painters, landscapers, roofers, and mechanics across Carroll County.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>📸</span> Before/After Showcases
                    </div>
                    <p className="text-[10px] text-zinc-400">Interactive split slider showcases your craftsmanship to homeowners.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>📲</span> Instant SMS Job Leads
                    </div>
                    <p className="text-[10px] text-zinc-400">Get texted immediately whenever a resident posts a work request.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>💬</span> 1-Click Quote Dispatch
                    </div>
                    <p className="text-[10px] text-zinc-400">Send estimate quotes and price ranges directly to homeowner phones.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>👑</span> Vanguard Trust Badge
                    </div>
                    <p className="text-[10px] text-zinc-400">Verified regional contractor badge building instant customer trust.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/work"
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                >
                  <span>Register as Contractor & Claim Leads</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 1.8 PEOPLE-POWERED COMMUNITY GOVERNANCE & COMMERCE */}
        <section className="relative p-8 md:p-12 rounded-[3rem] bg-gradient-to-b from-[#0e0e18] via-[#09090f] to-[#060609] border border-amber-500/20 shadow-2xl space-y-10 overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[140px] pointer-events-none" />

          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-8">
            <div className="space-y-2 max-w-2xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[9px] font-mono font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Decentralized & People-Governed</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
                Built by the People. <br />
                <span className="text-amber-400">Run by Our Community.</span>
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
                Townraise removes corporate gatekeepers and closed algorithms. Local commerce, emergency 4x4 mountain delivery, treasure hunt rewards, and community decisions are placed directly into the hands of Carroll County residents.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/community"
                className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Town Square Bulletin</span>
              </Link>
              <Link
                href="/society"
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span>The People's Vault</span>
              </Link>
            </div>
          </div>

          {/* 4 People-Powered Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-400/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xl group-hover:scale-110 transition-transform">
                🗳️
              </div>
              <h3 className="text-base font-black uppercase text-white group-hover:text-amber-300 transition-colors">
                Citizen Proposals & Voting
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Any resident can propose regional initiatives, tourist trails, and local merchant bounties. Every active passholder holds a vote.
              </p>
              <Link href="/community" className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:underline pt-2">
                <span>View Live Proposals</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-rose-400/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <h3 className="text-base font-black uppercase text-white group-hover:text-rose-300 transition-colors">
                The People's Vault
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                A community-backed treasury of milestone rewards, merchant discount vouchers, and cooperative goals that unlock perks for the entire town.
              </p>
              <Link href="/society" className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:underline pt-2">
                <span>Unlock Vault Perks</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-400/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="text-base font-black uppercase text-white group-hover:text-emerald-300 transition-colors">
                0% Middleman Fees
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No third-party app taking 30% from local diners or contractors. 100% of payments go directly to local creators and service providers.
              </p>
              <Link href="/create-storefront" className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline pt-2">
                <span>Self-Service Registration</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-indigo-400/40 transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-xl group-hover:scale-110 transition-transform">
                🛻
              </div>
              <h3 className="text-base font-black uppercase text-white group-hover:text-indigo-300 transition-colors">
                Peer-to-Peer 4x4 Courier
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Neighborhood drivers delivering food, firewood, and recovery to mountain cabins, boat launches, and remote dirt roads.
              </p>
              <Link href="/courier" className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:underline pt-2">
                <span>Direct Driver Hotline</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </section>

        {/* 2. LIVE RADAR / OASIS PULSE */}
        <section className="bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-400">
                <Activity className="w-4 h-4 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quantum Node Radar</span>
              </div>
              <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">
                Live Tap & Review Lattice
              </h2>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-amber-400 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              Open Merchant Radar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">☕</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[8px] font-mono font-bold uppercase border border-emerald-400/20">
                  ● 98% 5-Star Flow
                </span>
              </div>
              <h3 className="text-xl font-black italic text-white uppercase">Oasis Coffee Hub</h3>
              <p className="text-xs text-zinc-400">Effingham Main Gateway</p>
              <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-black italic text-amber-400">428</span>
                  <span className="text-[9px] font-mono text-zinc-500 ml-1.5 uppercase">Taps Logged</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">+46 Reviews this week</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-400/40 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">🏎️</span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-400/10 text-indigo-400 text-[8px] font-mono font-bold uppercase border border-indigo-400/20">
                  ● Fast Transit
                </span>
              </div>
              <h3 className="text-xl font-black italic text-white uppercase">Apex Automotive</h3>
              <p className="text-xs text-zinc-400">Conway Performance Bay</p>
              <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-black italic text-indigo-400">165</span>
                  <span className="text-[9px] font-mono text-zinc-500 ml-1.5 uppercase">Taps Logged</span>
                </div>
                <span className="text-[9px] font-mono text-indigo-300 font-bold">+29 Reviews this week</span>
              </div>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">🍕</span>
                <span className="px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-400 text-[8px] font-mono font-bold uppercase border border-amber-400/20">
                  ● Peak Table Tap
                </span>
              </div>
              <h3 className="text-xl font-black italic text-white uppercase">Rustic Stone Hearth</h3>
              <p className="text-xs text-zinc-400">Ossipee Mountain Hub</p>
              <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-black italic text-amber-400">312</span>
                  <span className="text-[9px] font-mono text-zinc-500 ml-1.5 uppercase">Taps Logged</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold">+38 Reviews this week</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2.5 OASIS EATS & DOORDASH RESTAURANT SHOWCASE */}
        <section className="bg-gradient-to-r from-amber-500/10 via-[#0b0b12] to-indigo-600/10 border border-amber-500/20 rounded-[3rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-white/5 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 animate-pulse" />
                <span>DoorDash & UberEats Decentralized Network</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-white">
                Oasis <span className="text-amber-400">Eats</span> Local Delivery
              </h2>
              <p className="text-xs text-zinc-400 max-w-lg">
                Order directly from Effingham & Carroll County’s top restaurants, bakeries, and smokehouses with live GPS radar tracking.
              </p>
            </div>
            <Link
              href="/eats"
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <span>Explore All Menus (DoorDash Hub)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/eats"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-400/30 transition-all space-y-3"
            >
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80"
                  alt="PNB Eats Sub"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold">
                  20-30 min
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase group-hover:text-amber-400 transition-colors">
                  PNB Eats Roadside Grill
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">Steak & Cheese Subs, 16" Pizzas, Wings</p>
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-amber-400">
                  <span>Effingham, NH</span>
                  <span className="text-zinc-400">4.8 ★ (184)</span>
                </div>
              </div>
            </Link>

            <Link
              href="/eats"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-400/30 transition-all space-y-3"
            >
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
                  alt="Pizza Barn BBQ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold">
                  25-35 min
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase group-hover:text-amber-400 transition-colors">
                  Pizza Barn & Smokehouse
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">Applewood Pulled Pork, Buffalo Pizza</p>
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-amber-400">
                  <span>Ossipee, NH</span>
                  <span className="text-zinc-400">4.9 ★ (312)</span>
                </div>
              </div>
            </Link>

            <Link
              href="/eats"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-400/30 transition-all space-y-3"
            >
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80"
                  alt="Oasis Cold Brew"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold">
                  15-20 min
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase group-hover:text-amber-400 transition-colors">
                  Oasis Roastery & Bakehouse
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">Nitro Cold Brew Growlers, Sourdough</p>
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-amber-400">
                  <span>Effingham, NH</span>
                  <span className="text-zinc-400">5.0 ★ (428)</span>
                </div>
              </div>
            </Link>

            <Link
              href="/eats"
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-amber-400/30 transition-all space-y-3"
            >
              <div className="h-32 rounded-xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80"
                  alt="Freedom Village Scones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-amber-400 text-[9px] font-mono font-bold">
                  15-25 min
                </span>
              </div>
              <div>
                <h4 className="font-black text-white text-sm uppercase group-hover:text-amber-400 transition-colors">
                  Freedom Village Store
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">Blueberry Scones, Maple Syrup, Pantry</p>
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-amber-400">
                  <span>Freedom, NH</span>
                  <span className="text-zinc-400">4.9 ★ (168)</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 3. DIRECT MARKETPLACE SALES & HARDWARE FLEET */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Townraise Marketplace Direct Sales</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
                Shop Hardware & Local Artisan Goods
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl">
                Purchase pre-programmed NFC stands, staff review cards, 3M tap stickers, or local farm-harvested goods directly from the overview.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {cartItemCount > 0 && (
                <Link
                  href="/cart"
                  className="px-5 py-3 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 animate-bounce"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart ({cartItemCount}) • {formatCurrency(cartSubtotal)}</span>
                </Link>
              )}
              <Link
                href="/marketplace"
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <span>Full Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Category Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {marketplaceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMarketplaceCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedMarketplaceCategory === cat.id
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Products Grid with Direct Buy and Add to Cart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMarketplaceProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300 group shadow-xl"
              >
                <div className="space-y-4">
                  {/* Image with badge */}
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-3 py-1 bg-amber-400 text-black font-black text-[9px] uppercase tracking-widest rounded-full shadow-lg">
                        {product.badge}
                      </span>
                    )}
                    {product.sellerName && (
                      <span className="absolute bottom-3 left-3 px-2.5 py-0.5 bg-black/80 backdrop-blur-md border border-white/10 text-white font-mono text-[9px] font-bold rounded-lg">
                        By {product.sellerName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                        <span className="text-zinc-400 font-mono ml-1 text-[11px]">({product.reviewsCount})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                        In Stock
                      </span>
                    </div>

                    <h3 className="text-xl font-black italic text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{product.subtitle}</p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black italic text-amber-400">{formatCurrency(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through ml-2 font-mono">{formatCurrency(product.originalPrice)}</span>
                      )}
                    </div>
                    {product.material && (
                      <span className="text-[10px] font-mono text-zinc-400">{product.material.split(' ')[0]}</span>
                    )}
                  </div>

                  {/* Direct Action Buttons: Quick Add, Instant Buy, Customize */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickAddToCart(product)}
                      className={`py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        justAddedId === product.id
                          ? 'bg-emerald-500 text-black font-black'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                      }`}
                    >
                      {justAddedId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-black" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleInstantBuy(product)}
                      className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-black fill-current" />
                      <span>Instant Buy</span>
                    </button>
                  </div>

                  {product.category === 'cards' || product.category === 'stands' ? (
                    <button
                      onClick={() => setSelectedCustomProduct(product)}
                      className="w-full py-1.5 bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white rounded-lg text-[9px] font-mono uppercase tracking-widest transition-all flex items-center justify-center gap-1"
                    >
                      <Sliders className="w-3 h-3 text-amber-400" />
                      <span>Custom Laser Engraving Options →</span>
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Cart Floating Checkout Bar */}
          {cartItemCount > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#0e0e16] to-emerald-500/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-white">
                    {cartItemCount} item{cartItemCount !== 1 ? 's' : ''} in your Shopping Cart
                  </div>
                  <div className="text-xs text-amber-400 font-mono">
                    Subtotal: {formatCurrency(cartSubtotal)} • Free Express Local Courier Delivery
                  </div>
                </div>
              </div>

              <Link
                href="/cart"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>

        {/* 4. SMART GATEKEEPER / RATING SHIELD ARCHITECTURE */}
        <section className="bg-[#0b0b10] border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
              Smart Review Routing Technology
            </span>
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              Maximize 5-Star Reviews. <br />
              <span className="text-indigo-400">Shield Negative Feedback Privately.</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Traditional paper QR codes send unhappy customers directly to Google where they can damage your 5.0 star reputation. Townraise uses an intelligent dual-channel routing protocol:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Star className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-2xl font-black italic text-emerald-300">4 & 5-Star Ratings: Instant Google Push</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Ecstatic customers are immediately forwarded straight into your official Google Maps review window with 5 stars pre-selected, boosting your local SEO ranking.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold pt-2">
                <CheckCircle2 className="w-4 h-4" /> 100% Verified Google Review Lift
              </div>
            </div>

            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-3xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black italic text-indigo-300">1 to 3-Star Ratings: Private Manager Ticket</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Dissatisfied guests are directed to a private, confidential feedback form sent straight to the owner/store manager before any negative public comment is posted.
              </p>
            </div>
          </div>
        </section>

        {/* 4.5 LOCAL COURIER & PRE-PAID STORE PICKUPS */}
        <section className="bg-gradient-to-r from-emerald-950/20 via-[#0e0e13] to-amber-950/20 border border-emerald-500/20 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
                <Truck className="w-3.5 h-3.5 animate-bounce" />
                <span>Regional Courier & Task Runner • Carroll County, NH</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                Pre-Paid Pickups, <span className="text-amber-400">Buy & Deliver</span>, & Local Errands.
              </h2>

              <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                Need supplies picked up from Ace Hardware, items from Smoke World, dinner from Yankee Smokehouse BBQ, or a package delivered across town? Prepay online via Cash App, Venmo, or Zelle, or pay on delivery—Sean Martin handles the rest with live GPS tracking.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-lg">📦</span>
                  <div className="text-xs font-black text-white">Store Pickups</div>
                  <div className="text-[10px] text-zinc-400">Call store ahead, send order #, courier retrieves it.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-lg">🛒</span>
                  <div className="text-xs font-black text-amber-400">Buy & Deliver</div>
                  <div className="text-[10px] text-zinc-400">Prepay budget, courier shops & delivers receipt.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-lg">⚡</span>
                  <div className="text-xs font-black text-emerald-400">Custom Errands</div>
                  <div className="text-[10px] text-zinc-400">Emergency supplies, firewood runs, local deliveries.</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/courier"
                  className="px-8 py-4 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Request Courier & Pickup</span>
                </Link>
                <Link
                  href="/eats"
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:border-amber-400/40 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2"
                >
                  <span>Explore Local Food Menus</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Instant Upfront Payment</span>
                <span className="text-[9px] font-mono text-zinc-500">Zero Delays</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-emerald-400 font-black text-sm">$</span>
                    <div>
                      <div className="text-xs font-black text-white">Cash App</div>
                      <div className="text-[10px] font-mono text-emerald-400">$frijj555</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-mono">1-Click Pay</span>
                </div>

                <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-cyan-400 font-black text-sm">V</span>
                    <div>
                      <div className="text-xs font-black text-white">Venmo</div>
                      <div className="text-[10px] font-mono text-cyan-400">@Sean-Martin-NH</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[9px] font-mono">Instant Sync</span>
                </div>

                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-purple-400 font-black text-sm">Z</span>
                    <div>
                      <div className="text-xs font-black text-white">Zelle Bank Wire</div>
                      <div className="text-[10px] font-mono text-purple-300">508-507-0305</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 text-[9px] font-mono">Direct Bank</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Driver Contact: Sean Martin • (508) 507-0305</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ROI REVENUE CALCULATOR */}
        <section className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Interactive Revenue Estimator
            </span>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white">
              Calculate Your 5-Star Google Review Lift
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              According to Harvard Business Review, a 1-star increase on Google Maps drives a 5-9% immediate jump in revenue for local brick-and-mortar businesses.
            </p>

            <div className="space-y-6 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">Daily In-Person Customers:</span>
                  <span className="text-amber-400 font-mono">{dailyCustomers} patrons / day</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="1000"
                  step="10"
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">Average Customer Ticket ($):</span>
                  <span className="text-amber-400 font-mono">${avgTicket}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg cursor-pointer h-2"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#0e0e13] border border-amber-400/20 rounded-3xl p-8 space-y-6 shadow-2xl text-center">
            <div className="space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">Estimated Monthly Impact</p>
              <p className="text-5xl md:text-6xl font-black italic text-amber-400 tracking-tight">
                +{estimatedReviewsPerMonth}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider text-white">New Verified Google Reviews / Mo</p>
            </div>

            <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
              <p className="text-[9px] font-mono uppercase text-amber-400">Projected Extra Monthly Revenue</p>
              <p className="text-3xl font-black italic text-emerald-400 tracking-tight">
                +{formatCurrency(newRevenueProjected)} / mo
              </p>
            </div>

            <Link
              href="/marketplace"
              className="block w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg"
            >
              Order NFC Hardware Fleet
            </Link>
          </div>
        </section>

        {/* 5.5 TOURISM CONCIERGE, SMS AUTOMATION & EMBED STUDIO */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">
              Turnkey Hospitality & Automation Engine
            </span>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              Supercharge Carroll County <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-indigo-400">
                Tourism, Guests & Local Sales
              </span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              From automated Airbnb dockside firewood delivery to autonomous 2-way SMS text-back and embeddable website trust badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Lake Concierge */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-emerald-950/40 to-[#0c0c14] border border-emerald-500/20 space-y-4 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase italic text-white">Airbnb Lake Concierge</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Keyless Wi-Fi connect, boat ramp statuses, and 1-tap dockside campfire firewood & s'mores kit delivery for lakehouse guests.
                </p>
              </div>

              <Link
                href="/concierge"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-between"
              >
                <span>Open Lake Concierge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* SMS Automation */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-950/40 to-[#0c0c14] border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase italic text-white">2-Way SMS Automation</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Autonomous missed-call auto-text back, 5-star review boosters, digital table buzzers, and weekend VIP discount broadcasts.
                </p>
              </div>

              <Link
                href="/dashboard/sms-hub"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-between"
              >
                <span>SMS Automation Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Embeddable Widgets */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-[#0c0c14] border border-indigo-500/20 space-y-4 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black uppercase italic text-white">Website Trust Seals</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Copy-paste 1-click HTML review carousels, floating trust seals, and Google rating ribbons onto client WordPress or Shopify sites.
                </p>
              </div>

              <Link
                href="/dashboard/embeds"
                className="px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-between"
              >
                <span>Website Embed Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>

        {/* 6. CALL TO ACTION */}
        <section className="text-center py-16 space-y-6 max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-black flex items-center justify-center mx-auto text-2xl font-black shadow-xl shadow-amber-500/20">
            <Radio className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            Ready to Elevate Your Local Business?
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Join hundreds of Carroll County shopkeepers, restaurateurs, and contractors leveraging Townraise for 5-star Google review growth, digital ordering, and high-budget job leads.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/create-storefront"
              className="px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <span>🏪 Register Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/work"
              className="px-8 py-4 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>🛠️ Register as Contractor</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white/5 border border-white/10 hover:border-amber-400/30 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              Order NFC Hardware Fleet
            </Link>
          </div>
        </section>

      </div>

      {/* Card Customizer Modal */}
      {selectedCustomProduct && (
        <CardCustomizerModal
          product={selectedCustomProduct}
          isOpen={!!selectedCustomProduct}
          onClose={() => setSelectedCustomProduct(null)}
        />
      )}
    </div>
  );
}
