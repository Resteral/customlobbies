'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import TownSelector from '@/components/TownSelector';
import SpotlightSearch from '@/components/SpotlightSearch';
import AuthModal from '@/components/AuthModal';
import { 
  Sparkles, 
  ShoppingBag, 
  LayoutDashboard, 
  Truck, 
  Compass, 
  Crown, 
  Search,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Store,
  Hammer,
  Gift,
  Trophy,
  MapPin,
  Calendar,
  Utensils,
  Bot,
  Cpu,
  Layers,
  Flame,
  Key,
  ArrowRight,
  Plus,
  Megaphone
} from 'lucide-react';
import { calculateCardProgression } from '@/lib/card-leveling';
import NfcCardLevelWidget from '@/components/NfcCardLevelWidget';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, userMembership, currentUser, deliveryDrivers, storeHunterStamps, passportStamps } = useNfcStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const onlineDrivers = deliveryDrivers.filter(d => d.isOnline && d.status !== 'off_duty');

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  // Close dropdown on outside click or route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  if (pathname?.startsWith('/tap/')) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#06060a]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 lg:gap-6" ref={navRef}>
          
          {/* ======================================================== */}
          {/* LEFT: Logo & Town Node Badge */}
          {/* ======================================================== */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img 
                src="/townraise-logo.png" 
                alt="Townraise" 
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="hidden 2xl:flex flex-col text-left">
                <span className="text-[10px] font-black tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                  Townraise
                </span>
                <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                  Carroll County Node
                </span>
              </div>
            </Link>
          </div>

          {/* ======================================================== */}
          {/* CENTER: Grouped Dropdown Navigation */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            
            {/* Overview */}
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                pathname === '/' 
                  ? 'text-amber-400 bg-amber-400/10 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              Overview
            </Link>

            {/* About Us / Manifesto */}
            <Link
              href="/about"
              className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                pathname === '/about' 
                  ? 'text-amber-400 bg-amber-400/10 shadow-sm' 
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              About
            </Link>

            {/* 1. Explore Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('explore')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  ['/directory', '/towns', '/eats', '/marketplace', '/events', '/about'].some(p => pathname?.startsWith(p)) || activeDropdown === 'explore'
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Explore</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`} />
              </button>

              {activeDropdown === 'explore' && (
                <div className="absolute top-full left-0 mt-1 w-76 p-2 rounded-2xl bg-[#0a0a12]/98 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-1 animate-in fade-in-50 slide-in-from-top-2 z-50">
                  <Link
                    href="/directory"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Business Directory</div>
                      <div className="text-[10px] text-zinc-400">100+ Verified Carroll County shops & eateries</div>
                    </div>
                  </Link>

                  <Link
                    href="/towns"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Town Hubs</div>
                      <div className="text-[10px] text-zinc-400">Effingham, Ossipee, Freedom, Wolfeboro, Conway</div>
                    </div>
                  </Link>

                  <Link
                    href="/eats"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">Eats & Menus</div>
                      <div className="text-[10px] text-zinc-400">Local restaurants, pizzerias & digital menus</div>
                    </div>
                  </Link>

                  <Link
                    href="/marketplace"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Marketplace & NFC Goods</div>
                      <div className="text-[10px] text-zinc-400">NFC cards, tabletop stands, maple syrup & craft goods</div>
                    </div>
                  </Link>

                  <Link
                    href="/events"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-pink-400 transition-colors">Events & Festivals</div>
                      <div className="text-[10px] text-zinc-400">Live concerts, craft fairs & community gatherings</div>
                    </div>
                  </Link>

                  <div className="pt-1 mt-1 border-t border-white/5">
                    <Link
                      href="/about"
                      className="p-2.5 rounded-xl hover:bg-amber-400/10 flex items-start gap-3 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-amber-300 group-hover:text-amber-200 transition-colors">About Us & Manifesto</div>
                        <div className="text-[10px] text-zinc-400">Believing in the people to break the new age</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Hunts & Vault Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('hunts')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'hunts' ? null : 'hunts')}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  ['/store-hunting', '/tourist-hunts', '/society', '/leaderboard', '/rewards'].some(p => pathname?.startsWith(p)) || activeDropdown === 'hunts'
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Hunts & Vault</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'hunts' ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`} />
              </button>

              {activeDropdown === 'hunts' && (
                <div className="absolute top-full left-0 mt-1 w-80 p-2 rounded-2xl bg-[#0a0a12]/98 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-1 animate-in fade-in-50 slide-in-from-top-2 z-50">
                  <Link
                    href="/store-hunting"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        <span>Store Hunting</span>
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[8px] font-mono font-bold">Mystery Perks</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">Tap counter stands at local shops for secret discounts</div>
                    </div>
                  </Link>

                  <Link
                    href="/tourist-hunts"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <span>Tourist Hunts</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono font-bold">5 Historic Circuits</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">Covered bridges, mountain overlooks & depots</div>
                    </div>
                  </Link>

                  <Link
                    href="/society"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-2">
                        <span>Society & Vault</span>
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[8px] font-mono font-bold">VIP</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">Unlock community vault, member perks & secret drops</div>
                    </div>
                  </Link>

                  <Link
                    href="/rewards"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Rewards Hub</div>
                      <div className="text-[10px] text-zinc-400">Redeem hunt points for free food, coffee & store vouchers</div>
                    </div>
                  </Link>

                  <Link
                    href="/leaderboard"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-yellow-400 transition-colors">Hunter Leaderboard</div>
                      <div className="text-[10px] text-zinc-400">Rankings, card levels & pioneer badge standings</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  ['/work', '/courier', '/ai-concierge', '/drivers', '/concierge'].some(p => pathname?.startsWith(p)) || activeDropdown === 'services'
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`} />
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-1 w-80 p-2 rounded-2xl bg-[#0a0a12]/98 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-1 animate-in fade-in-50 slide-in-from-top-2 z-50">
                  <Link
                    href="/work"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Hammer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">Trades & Contractors</div>
                      <div className="text-[10px] text-zinc-400">Local work requests, trade jobs & quote dispatch</div>
                    </div>
                  </Link>

                  <Link
                    href="/courier"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">Sean Martin 4x4 Courier</div>
                      <div className="text-[10px] text-zinc-400">24/7 mountain delivery & roadside recovery (508-507-0305)</div>
                    </div>
                  </Link>

                  <Link
                    href="/ai-concierge"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">AI Lake Concierge</div>
                      <div className="text-[10px] text-zinc-400">24/7 smart assistant for recommendations & boat orders</div>
                    </div>
                  </Link>

                  <Link
                    href="/drivers"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span>Active Courier Roster</span>
                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-mono font-bold">Live</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">View real-time online drivers across Carroll County</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. NFC Studio Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('studio')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'studio' ? null : 'studio')}
                className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                  ['/creator', '/nfc-creator', '/custom-nfc'].some(p => pathname?.startsWith(p)) || activeDropdown === 'studio'
                    ? 'text-amber-400 bg-amber-400/10' 
                    : 'text-zinc-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span>NFC Studio</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'studio' ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`} />
              </button>

              {activeDropdown === 'studio' && (
                <div className="absolute top-full left-0 mt-1 w-80 p-2 rounded-2xl bg-[#0a0a12]/98 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-1 animate-in fade-in-50 slide-in-from-top-2 z-50">
                  <Link
                    href="/creator"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-2">
                        <span>All-in-One NFC Creator</span>
                        <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[8px] font-mono font-bold">Studio</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">Program cards for menus, reviews, vCards, Wi-Fi & perks</div>
                    </div>
                  </Link>

                  <Link
                    href="/marketplace"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">Physical NFC Hardware Fleet</div>
                      <div className="text-[10px] text-zinc-400">Tabletop acrylic stands, smart metal cards & tap keyfobs</div>
                    </div>
                  </Link>

                  <Link
                    href="/csv-importer"
                    className="p-2.5 rounded-xl hover:bg-white/5 flex items-start gap-3 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span>CSV Bulk Extractor & Importer</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[8px] font-mono font-bold">New</span>
                      </div>
                      <div className="text-[10px] text-zinc-400">Import restaurants, menus & artisan inventory in bulk</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Register Business Button */}
            <Link
              href="/create-storefront"
              className="ml-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400/15 to-orange-500/15 hover:from-amber-400/25 hover:to-orange-500/25 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Register Business</span>
            </Link>

          </nav>

          {/* ======================================================== */}
          {/* RIGHT: Status, Search, Level, Cart, User & Dashboard */}
          {/* ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Live Drivers Status Pill */}
            <Link
              href="/drivers"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/20 transition-all"
              title={`${onlineDrivers.length} Live Drivers Online in Carroll County`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{onlineDrivers.length} Online</span>
            </Link>

            {/* Spotlight Search Trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
              }}
              className="p-2 sm:px-3 sm:py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full text-xs font-mono text-zinc-400 hover:text-white transition-all flex items-center gap-1.5"
              title="Search (Cmd+K)"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline px-1 py-0.2 rounded bg-white/10 text-[8px] font-mono">⌘K</kbd>
            </button>

            {/* Town Selector */}
            <div className="hidden md:block">
              <TownSelector />
            </div>

            {/* Hunter Progression Badge */}
            <div className="hidden xl:block">
              <NfcCardLevelWidget progression={cardProgression} compact={true} />
            </div>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative p-2 sm:p-2.5 bg-white/[0.04] border border-white/10 rounded-full hover:bg-white/[0.08] transition-all text-white flex items-center justify-center"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-black flex items-center justify-center shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Auth Switcher */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-1 sm:px-3 sm:py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full text-white transition-all flex items-center gap-2 group"
              title="Account / Sign In"
            >
              <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-xs shadow-inner">
                {currentUser?.avatar || '👤'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-[70px]">
                  {currentUser?.name.split(' ')[0] || 'Sign In'}
                </span>
              </div>
            </button>

            {/* Spread The Word CTA */}
            <Link
              href="/spread"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/10"
              title="Spread the Word across towns with printable flyers and social blasts"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Spread Word</span>
            </Link>

            {/* Portal / Dashboard CTA */}
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-full text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] border border-white/10 text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* ======================================================== */}
        {/* MOBILE MENU DRAWER */}
        {/* ======================================================== */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#07070d]/98 border-t border-white/10 backdrop-blur-3xl px-5 py-6 space-y-5 max-h-[85vh] overflow-y-auto animate-in fade-in-50 slide-in-from-top-4">
            
            {/* Mobile Town Selector */}
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-400 uppercase">Select Town Node:</span>
              <TownSelector />
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/about"
                className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-400/20 via-orange-400/15 to-transparent border border-amber-400/40 text-white flex items-center justify-between hover:bg-amber-400/25 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-amber-300 block">About Us & Manifesto</span>
                    <span className="text-[10px] text-zinc-300">Believing in the people to break the new age</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>

              <Link
                href="/directory"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Store className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Directory</span>
                <span className="text-[9px] text-zinc-400">100+ Local Shops</span>
              </Link>

              <Link
                href="/eats"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Utensils className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold">Eats & Menus</span>
                <span className="text-[9px] text-zinc-400">Food & Takeout</span>
              </Link>

              <Link
                href="/store-hunting"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">Store Hunting</span>
                <span className="text-[9px] text-zinc-400">Mystery Perks</span>
              </Link>

              <Link
                href="/tourist-hunts"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Tourist Hunts</span>
                <span className="text-[9px] text-zinc-400">5 Circuits</span>
              </Link>

              <Link
                href="/work"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Hammer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Trades & Work</span>
                <span className="text-[9px] text-zinc-400">Contractor Quotes</span>
              </Link>

              <Link
                href="/creator"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold">NFC Creator</span>
                <span className="text-[9px] text-zinc-400">All-in-One Studio</span>
              </Link>

              <Link
                href="/society"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Flame className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-bold">Society & Vault</span>
                <span className="text-[9px] text-zinc-400">Secret Drops</span>
              </Link>

              <Link
                href="/rewards"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Rewards Hub</span>
                <span className="text-[9px] text-zinc-400">Redeem Points</span>
              </Link>

              <Link
                href="/marketplace"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">Marketplace</span>
                <span className="text-[9px] text-zinc-400">NFC Stands & Local</span>
              </Link>

              <Link
                href="/courier"
                className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white flex flex-col gap-1 hover:bg-white/10 transition-colors"
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">4x4 Courier</span>
                <span className="text-[9px] text-zinc-400">508-507-0305</span>
              </Link>
            </div>

            {/* Business Onboarding CTAs */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <Link
                href="/spread"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Megaphone className="w-4 h-4 text-black animate-pulse" />
                <span>📢 Spread Word Across Towns</span>
              </Link>

              <Link
                href="/csv-importer"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bulk CSV Extractor & Importer</span>
              </Link>

              <Link
                href="/create-storefront"
                className="w-full py-2.5 bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg"
              >
                <Store className="w-4 h-4" />
                <span>Register Storefront</span>
              </Link>

              <Link
                href="/work"
                className="w-full py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
              >
                <Hammer className="w-4 h-4" />
                <span>Register as Trade Contractor</span>
              </Link>
            </div>

          </div>
        )}

        <SpotlightSearch />
      </header>

      {/* Auth Modal popup */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

