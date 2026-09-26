'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  Truck, 
  ShoppingBag, 
  Store, 
  Calendar, 
  Briefcase, 
  Radio, 
  Star, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  Search, 
  Smartphone, 
  Phone,
  Sparkles, 
  Bot, 
  CheckCircle2, 
  MapPin, 
  Flame, 
  Coffee, 
  Hammer, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Clock,
  DollarSign,
  User,
  Radio as RadioIcon,
  Car,
  Key
} from 'lucide-react';
import { EFFINGHAM_AREA_BUSINESSES } from '@/lib/local-businesses';
import AdminNfcCardProgrammerModal from '@/components/AdminNfcCardProgrammerModal';

export default function DashboardOverviewPage() {
  const { 
    cards, 
    deliveryOrders, 
    driverTelemetry, 
    driverShift, 
    events, 
    workRequests, 
    storefronts,
    loyaltyWallet,
    currentUser,
    deliveryDrivers,
    toggleDriverStatus
  } = useNfcStore();

  const [isAdminProgrammerOpen, setIsAdminProgrammerOpen] = useState(false);

  const totalStores = EFFINGHAM_AREA_BUSINESSES.length;
  const pendingOrders = deliveryOrders.filter(o => o.status === 'pending' || o.status === 'accepted' || o.status === 'out_for_delivery');
  const activeJobs = workRequests.filter(w => w.status === 'open' || w.status === 'in_progress');
  const upcomingEvents = events.slice(0, 3);
  const onlineDrivers = deliveryDrivers.filter(d => d.isOnline && d.status !== 'off_duty');

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121e] via-[#0d0d15] to-[#070709] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Regional Unity Network • Carroll County, NH
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white leading-tight">
              Uniting Our Towns in <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                One Functional Atmosphere
              </span>
            </h1>

            <p className="text-zinc-300 text-xs md:text-sm font-normal leading-relaxed">
              Bridging Effingham, Ossipee, Freedom, Wakefield, and Conway into a single connected community engine for <b>on-the-go delivery</b>, <b>grocery shopping</b>, <b>verified local shops</b>, <b>community events</b>, and <b>neighborhood contractor jobs</b>.
            </p>
          </div>

          {/* Quick Action Station */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsAdminProgrammerOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>⚡ Program Admin Pass</span>
            </button>

            <Link
              href="/ai-concierge"
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>AI Food Bot</span>
            </Link>

            <Link
              href="/driver"
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Courier Terminal</span>
            </Link>
          </div>
        </div>

        {/* Unified Towns Interconnect Pill Strip */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400/80 mr-1">
            Connected Regional Hubs:
          </span>
          {[
            { name: 'Effingham', emoji: '🌲' },
            { name: 'Center Ossipee', emoji: '🔨' },
            { name: 'Freedom', emoji: '🏡' },
            { name: 'Wakefield / Sanbornville', emoji: '🥪' },
            { name: 'Conway & North Conway', emoji: '🏔️' },
            { name: 'Wolfeboro & Tamworth', emoji: '⛵' }
          ].map(town => (
            <span
              key={town.name}
              className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-white text-[11px] font-semibold flex items-center gap-1 hover:border-amber-400/40 hover:bg-white/10 transition-all"
            >
              <span>{town.emoji}</span>
              <span>{town.name}</span>
            </span>
          ))}
        </div>

        {/* Real-Time Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Active Courier Driver</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-sm font-black text-white">Sean Martin (AWD Outback)</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">100% Committed Stores</span>
            <span className="text-sm font-black text-amber-400 mt-1 block">{totalStores} Verified Local Partners</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Open Local Job Requests</span>
            <span className="text-sm font-black text-indigo-400 mt-1 block">{activeJobs.length} Available Projects</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-400 uppercase block">Upcoming Town Events</span>
            <span className="text-sm font-black text-pink-400 mt-1 block">{events.length} Community Happenings</span>
          </div>
        </div>
      </div>

      {/* 5 CORE PLATFORM PILLARS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">Everything Local In One Place</span>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tight">Core Services & Hubs</h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">5 Essential Pillars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Pillar 1: On-the-Go Delivery & Express Courier */}
          <div className="bg-[#0e0e14] border border-white/10 hover:border-amber-500/40 rounded-3xl p-7 space-y-5 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Truck className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[9px] font-mono font-bold uppercase">
                  AWD Rapid Express
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black italic text-white uppercase group-hover:text-amber-400 transition-colors">
                  On-the-Go Delivery Service
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Hot food delivery, store pickups, and custom errand runs. Call any restaurant (PNB Eats, Pizza Barn, Yankee Smokehouse) or store, and <b>Sean Martin</b> picks it up and delivers to your doorstep or boat dock.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call-ahead store pickup & prepay delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dockside firewood & s'mores for lake rentals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Live GPS tracking of Sean's vehicle</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <Link
                href="/courier"
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center"
              >
                Order Delivery
              </Link>
              <Link
                href="/driver"
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all"
                title="Driver Shift Radar"
              >
                <Radio className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Local Grocery Shopping & Curbside Retrieval */}
          <div className="bg-[#0e0e14] border border-white/10 hover:border-emerald-500/40 rounded-3xl p-7 space-y-5 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-[9px] font-mono font-bold uppercase">
                  Curbside & Pantry
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black italic text-white uppercase group-hover:text-emerald-400 transition-colors">
                  Grocery Shopping & To-Go
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Convenient grocery shopping from <b>Hannaford Supermarket (Route 16)</b>, <b>Lovell Lake Market</b>, and local farm stands. Prepay online or have Sean retrieve your curbside bags.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hannaford To Go curbside express pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Farm fresh produce, eggs & dairy crates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ace Hardware tool & homestead supplies</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <Link
                href="/site/hannaford-to-go"
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center"
              >
                Shop Groceries
              </Link>
              <Link
                href="/eats"
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white rounded-xl transition-all"
              >
                All Menus
              </Link>
            </div>
          </div>

          {/* Pillar 3: Verified Local Marketplace & Directory */}
          <div className="bg-[#0e0e14] border border-white/10 hover:border-indigo-500/40 rounded-3xl p-7 space-y-5 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full text-[9px] font-mono font-bold uppercase">
                  100% Committed
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black italic text-white uppercase group-hover:text-indigo-400 transition-colors">
                  Local Marketplace & Shops
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Discover and support verified independent Carroll County businesses: Smoke World Ossipee, Freedom Village Store, Country Peddler Flea Market, Tramway Artisans, and Zeb's.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Direct 1-tap phone numbers for all stores</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Smoke, vape & glassware catalog</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Artisan pottery, maple syrups & gifts</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <Link
                href="/marketplace"
                className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center shadow-lg shadow-indigo-500/20"
              >
                Browse Marketplace
              </Link>
              <Link
                href="/directory"
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white rounded-xl transition-all"
              >
                Directory
              </Link>
            </div>
          </div>

          {/* Pillar 4: Local Community Events & Happenings */}
          <div className="bg-[#0e0e14] border border-white/10 hover:border-pink-500/40 rounded-3xl p-7 space-y-5 transition-all group relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded-full text-[9px] font-mono font-bold uppercase">
                  Community Radar
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black italic text-white uppercase group-hover:text-pink-400 transition-colors">
                  Local Events & Live Music
                </h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                  Stay updated on weekend live bands, farmers markets, lake boat flotillas, pub trivia, and seasonal harvest fairs. RSVP to earn community reward points.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Live acoustic nights at Pizza Barn patio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Effingham & Tamworth harvest fairs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Auto-Sync of real local calendars</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-2">
              <Link
                href="/events"
                className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center shadow-lg shadow-pink-500/20"
              >
                View Events Radar
              </Link>
            </div>
          </div>

          {/* Pillar 5: Local Work & Contractor Jobs Board */}
          <div className="bg-[#0e0e14] border border-white/10 hover:border-cyan-500/40 rounded-3xl p-7 space-y-5 transition-all group relative overflow-hidden flex flex-col justify-between lg:col-span-2">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded-full text-[9px] font-mono font-bold uppercase">
                  Find Work & Hire Locally
                </span>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black italic text-white uppercase group-hover:text-cyan-400 transition-colors">
                  Local Work & Contractor Jobs Board
                </h3>
                <p className="text-xs md:text-sm text-zinc-400 mt-1.5 leading-relaxed max-w-2xl">
                  Connect directly with verified local trades, contractors, and odd jobs. Homeowners post requests with project photos, and local carpenters, tree crane operators, mechanics, and errand runners get matched instantly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Lakefront composite decking & carpentry (Walt's Woodcraft)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hazardous tree removal & 75ft crane service</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Courier runs, snow shoveling & dock helpers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant SMS lead dispatch directly to contractor phone</span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap sm:flex-nowrap items-center gap-3">
              <Link
                href="/work"
                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all text-center shadow-lg shadow-cyan-500/20"
              >
                Browse & Find Local Work
              </Link>
              <Link
                href="/work#post-job"
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
              >
                Post a Job Request
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ACTIVE ONLINE DELIVERY DRIVERS LIVE TELEMETRY */}
      <div className="bg-[#0c0c14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Regional Driver Telemetry • {onlineDrivers.length} Active On Duty</span>
            </div>
            <h3 className="text-2xl font-black italic text-white uppercase">Active Online Delivery Drivers</h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">
              Verified local residents and drivers on-call across Effingham, Ossipee, Freedom, and Wakefield.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser ? `${currentUser.name.split(' ')[0]} (${currentUser.role})` : 'Sign In'}</span>
            </Link>

            <Link
              href="/drivers"
              className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <span>View Full Roster ({deliveryDrivers.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Driver Roster Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliveryDrivers.map((driver) => {
            const isOnline = driver.isOnline && driver.status !== 'off_duty';
            return (
              <div
                key={driver.id}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isOnline
                    ? 'bg-gradient-to-br from-emerald-950/20 via-[#101018] to-[#0a0a0e] border-emerald-500/30 shadow-lg'
                    : 'bg-[#09090d] border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner relative">
                        {driver.avatar}
                        {isOnline && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#09090d] animate-pulse"></span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{driver.name}</h4>
                        <p className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{driver.town}, NH</span>
                        </p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase ${
                      isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {isOnline ? '🟢 Online' : '🔴 Off Duty'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono space-y-1">
                    <p className="text-zinc-300 font-bold truncate">🚗 {driver.vehicleName}</p>
                    <p className="text-zinc-400 text-[10px]">⭐ {driver.rating.toFixed(1)} ({driver.deliveriesCompleted} runs)</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                  <a
                    href={`tel:${driver.phone.replace(/[^0-9]/g, '')}`}
                    className="flex-1 py-2 bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 rounded-lg text-[11px] font-bold transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3 h-3 text-emerald-400" />
                    <span>Call Driver</span>
                  </a>
                  <Link
                    href="/courier"
                    className="px-3 py-2 bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black uppercase rounded-lg transition-all"
                  >
                    Run
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ACTIVITY & TELEMETRY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Live Orders & Call-Ahead Dispatches */}
        <div className="lg:col-span-2 bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Live Activity</span>
              <h3 className="text-xl font-black italic text-white uppercase">Active Deliveries & Pickups</h3>
            </div>
            <Link
              href="/dashboard/delivery"
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All ({deliveryOrders.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {deliveryOrders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 text-base">
                    {order.serviceType === 'store_pickup' ? '📞' : '🚗'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white leading-snug">
                        Order #{order.orderNumber} • {order.customerName}
                      </p>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                        order.status === 'delivered' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                      📍 {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
                  <span className="text-sm font-black text-amber-400 font-mono">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Links & Vanguard Toolkit */}
        <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Vanguard Toolkit</span>
              <h3 className="text-xl font-black italic text-white uppercase">Quick Controls</h3>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/settings"
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp & Twilio SMS Alerts</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/dashboard/cards"
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-amber-400" />
                  <span>NFC Smart Review Cards ({cards.length})</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/dashboard/town-command"
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>Town Node Command Center</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>

              <Link
                href="/concierge"
                className="p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-between text-xs font-bold text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Lake & Airbnb Concierge</span>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-500" />
              </Link>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 text-xs text-zinc-300 space-y-1">
            <p className="font-bold text-amber-400">💡 Local Dispatch Tip:</p>
            <p className="text-[11px] text-zinc-400 font-light">
              Keep your phone's WhatsApp or Telegram connected in <Link href="/dashboard/settings" className="underline text-amber-400">Settings</Link> to get instant audio pings with 1-tap Google Maps directions!
            </p>
          </div>
        </div>

      </div>

      {/* Admin NFC Card Provisioner Modal */}
      <AdminNfcCardProgrammerModal
        isOpen={isAdminProgrammerOpen}
        onClose={() => setIsAdminProgrammerOpen(false)}
      />

    </div>
  );
}
