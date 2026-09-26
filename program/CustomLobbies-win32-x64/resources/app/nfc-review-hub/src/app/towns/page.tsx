'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNfcStore } from '@/lib/store';
import { TownNode } from '@/lib/types';
import { 
  Radio, 
  Compass, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  ArrowRight, 
  Plus, 
  CheckCircle2, 
  Search, 
  Activity, 
  Sparkles,
  Globe,
  Layers,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';

type RegionFilter = 'all' | 'carroll' | 'lakes' | 'mountains' | 'seacoast' | 'merrimack' | 'maine';

export default function TownsRadarPage() {
  const router = useRouter();
  const { towns, activeTown, setActiveTown, registerTown, directoryListings } = useNfcStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionFilter>('all');

  const REGION_CATEGORIES = [
    { id: 'all', label: 'All State Nodes', count: towns.length },
    { id: 'carroll', label: 'Carroll County Heartland', count: towns.filter(t => ['Effingham', 'Ossipee', 'Freedom', 'Wolfeboro', 'Tamworth', 'Wakefield', 'Madison', 'Sandwich', 'Tuftonboro', 'Moultonborough', 'Jackson', 'Conway & North Conway'].some(n => t.name.includes(n) || t.fullName.includes(n))).length },
    { id: 'lakes', label: 'Lakes Region & Belknap', count: towns.filter(t => ['Wolfeboro', 'Laconia', 'Meredith', 'Tuftonboro', 'Moultonborough'].some(n => t.name.includes(n))).length },
    { id: 'mountains', label: 'White Mountains & Grafton', count: towns.filter(t => ['Conway', 'Jackson', 'Bartlett', 'Plymouth', 'Littleton'].some(n => t.name.includes(n))).length },
    { id: 'seacoast', label: 'Seacoast & Strafford', count: towns.filter(t => ['Portsmouth', 'Dover', 'Rochester', 'Exeter'].some(n => t.name.includes(n))).length },
    { id: 'merrimack', label: 'Merrimack & Monadnock', count: towns.filter(t => ['Concord', 'Manchester', 'Nashua', 'Keene'].some(n => t.name.includes(n))).length },
    { id: 'maine', label: 'Western Maine Border', count: towns.filter(t => t.state === 'ME').length },
  ];

  const filteredTowns = useMemo(() => {
    return towns.filter(t => {
      const matchesSearch = 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedRegion === 'all') return true;
      if (selectedRegion === 'maine') return t.state === 'ME';
      if (selectedRegion === 'carroll') {
        return ['Effingham', 'Ossipee', 'Freedom', 'Wolfeboro', 'Tamworth', 'Wakefield', 'Madison', 'Sandwich', 'Tuftonboro', 'Moultonborough', 'Jackson', 'Conway'].some(n => t.name.includes(n));
      }
      if (selectedRegion === 'lakes') {
        return ['Wolfeboro', 'Laconia', 'Meredith', 'Tuftonboro', 'Moultonborough', 'Ossipee'].some(n => t.name.includes(n));
      }
      if (selectedRegion === 'mountains') {
        return ['Conway', 'Jackson', 'Bartlett', 'Plymouth', 'Littleton'].some(n => t.name.includes(n));
      }
      if (selectedRegion === 'seacoast') {
        return ['Portsmouth', 'Dover', 'Rochester', 'Exeter'].some(n => t.name.includes(n));
      }
      if (selectedRegion === 'merrimack') {
        return ['Concord', 'Manchester', 'Nashua', 'Keene'].some(n => t.name.includes(n));
      }
      return true;
    });
  }, [towns, searchQuery, selectedRegion]);

  const handleSelectTown = (town: TownNode) => {
    setActiveTown(town.id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    router.push(`/marketplace?town=${encodeURIComponent(town.name)}`);
  };

  // 1-Click Launch from search
  const handleQuickLaunch = () => {
    if (!searchQuery.trim()) return;
    const name = searchQuery.trim();
    const created = registerTown({
      name,
      state: 'NH',
      fullName: `${name}, NH`,
      tagline: 'Decentralized Community Node',
      icon: '🌲',
      vanguardLead: `${name} Vanguard Lead`,
      dispatchPhone: '(508) 507-0305',
      description: `Official Townraise community node for ${name}, connecting local shops, NFC review stations, and couriers.`,
      accentColor: '#10b981',
    });

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 }
    });

    setSearchQuery('');
    setActiveTown(created.id);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 blur-[180px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[180px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Decentralized Regional Node Radar • {towns.length} State Nodes Online</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              Unified <span className="text-amber-400">Town Nodes.</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Uniting communities and towns across New Hampshire and Western Maine into one sovereign network. Connect shops, digital menus, review beacons, and 4x4 mountain courier dispatch with 0% middleman fees.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Scan or type any NH/ME town..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>

            <Link
              href="/register-town"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Node Protocol</span>
            </Link>
          </div>
        </div>

        {/* Regional Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {REGION_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedRegion(cat.id as RegionFilter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedRegion === cat.id
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedRegion === cat.id ? 'bg-black/20 text-black font-black' : 'bg-white/10 text-zinc-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Currently Active Town Indicator */}
        <div className="p-6 bg-[#0e0e14] border border-amber-400/30 rounded-3xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{activeTown.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase text-zinc-400">Current Selected Node:</span>
                <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold rounded-full border border-amber-400/30">
                  {activeTown.fullName}
                </span>
              </div>
              <p className="text-base font-black italic text-white mt-0.5">{activeTown.tagline} • Led by {activeTown.vanguardLead}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/directory?town=${encodeURIComponent(activeTown.name)}`}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeTown.name} Directory</span>
            </Link>

            <Link
              href={`/marketplace?town=${encodeURIComponent(activeTown.name)}`}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
            >
              <span>Marketplace →</span>
            </Link>
          </div>
        </div>

        {/* If no matches found in search */}
        {filteredTowns.length === 0 && searchQuery.trim() && (
          <div className="p-10 rounded-[2.5rem] bg-amber-400/10 border border-amber-400/30 text-center space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto text-2xl font-black">
              🌲
            </div>
            <h3 className="text-xl font-black text-white">
              "{searchQuery.trim()}" Node Not Found Yet!
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Townraise is designed to expand across every town in New Hampshire. You can launch "{searchQuery.trim()}" as a live node right now with 1 click.
            </p>
            <button
              onClick={handleQuickLaunch}
              className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Launch "{searchQuery.trim()}" Node Now</span>
            </button>
          </div>
        )}

        {/* Town Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTowns.map((town) => {
            const isSelected = activeTown.id === town.id;
            return (
              <div
                key={town.id}
                className={`group relative bg-white/[0.03] border rounded-[2.5rem] p-7 sm:p-8 hover:bg-white/[0.06] transition-all overflow-hidden flex flex-col justify-between min-h-[340px] ${
                  isSelected ? 'border-amber-400/60 shadow-2xl shadow-amber-400/15 bg-amber-400/[0.02]' : 'border-white/10'
                }`}
              >
                {/* Background Ambient Glow */}
                <div
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-15 transition-all duration-1000 group-hover:scale-150 pointer-events-none"
                  style={{ backgroundColor: town.accentColor || '#f59e0b' }}
                />

                {/* Top Section */}
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {town.icon}
                    </span>

                    <div className={`px-3 py-1 rounded-full text-[8px] font-mono font-bold uppercase tracking-widest border ${
                      town.status === 'peak_flow'
                        ? 'bg-amber-400/20 text-amber-400 border-amber-400/30 animate-pulse'
                        : town.status === 'stable'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {town.status === 'peak_flow' ? '● PEAK FLOW' : town.status === 'stable' ? '○ STABLE' : '🚀 LAUNCHING'}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase text-white leading-none">
                      {town.name}
                    </h3>
                    <p className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest font-mono">
                      {town.tagline} • {town.state}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {town.description}
                  </p>
                </div>

                {/* Middle Stats Grid */}
                <div className="pt-4 grid grid-cols-2 gap-4 relative z-10 border-t border-white/5 font-mono">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Boutiques</p>
                    <p className="text-xl font-black italic text-white leading-none">{town.boutiquesCount}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400">Routes</p>
                    <p className="text-xl font-black italic text-indigo-400 leading-none">{town.routesCount}</p>
                  </div>
                </div>

                {/* Bottom Lattice & Switch Button */}
                <div className="pt-5 relative z-10 flex items-center justify-between">
                  <button
                    onClick={() => handleSelectTown(town)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'bg-white/10 hover:bg-amber-400 hover:text-black text-white'
                    }`}
                  >
                    {isSelected ? 'Active Node ✓' : 'Switch to Node'}
                  </button>

                  <div className="text-right">
                    <p className="text-2xl font-black italic tracking-tighter text-white/30 group-hover:text-amber-400/90 transition-colors">
                      {town.occupancyLattice}%
                    </p>
                    <p className="text-[7px] font-mono uppercase tracking-widest text-white/30 italic">Lattice</p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Launch Node Callout */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 p-8 md:p-12 rounded-[3rem] text-black flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl md:text-3xl font-black italic tracking-tight uppercase">
              Don't See Your Town Listed?
            </h3>
            <p className="text-xs md:text-sm font-bold opacity-90 leading-relaxed">
              Launch a community Town Node in 60 seconds anywhere across New Hampshire or Western Maine. Connect local businesses, digital menus, and neighbor couriers under your town's sovereign hub!
            </p>
          </div>

          <Link
            href="/register-town"
            className="px-8 py-4 bg-black hover:bg-zinc-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl whitespace-nowrap"
          >
            Launch Your Town Node Now →
          </Link>
        </div>

      </div>
    </div>
  );
}
