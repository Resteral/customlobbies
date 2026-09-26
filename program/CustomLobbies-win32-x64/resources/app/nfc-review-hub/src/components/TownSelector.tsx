'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { TownNode } from '@/lib/types';
import { 
  MapPin, 
  ChevronDown, 
  Check, 
  Plus, 
  Radio, 
  Compass, 
  X, 
  Search, 
  Sparkles,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TownSelector() {
  const { towns, activeTown, setActiveTown, registerTown } = useNfcStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const filteredTowns = useMemo(() => {
    if (!searchFilter.trim()) return towns;
    return towns.filter(t => 
      t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.state.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.tagline.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [towns, searchFilter]);

  const handleSelect = (townId: string) => {
    setActiveTown(townId);
    setIsOpen(false);
    setSearchFilter('');
  };

  // 1-Click Launch Town Node
  const handleQuickLaunchNewTown = () => {
    if (!searchFilter.trim()) return;
    const newName = searchFilter.trim();

    const created = registerTown({
      name: newName,
      state: 'NH',
      fullName: `${newName}, NH`,
      tagline: 'Decentralized Community Node',
      icon: '🌲',
      vanguardLead: `${newName} Vanguard Lead`,
      dispatchPhone: '(508) 507-0305',
      description: `Official Townraise community node for ${newName}, NH connecting local storefronts, reviews, and 4x4 couriers.`,
      accentColor: '#10b981',
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setSearchFilter('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full transition-all text-xs font-mono text-zinc-200 group"
      >
        <span className="text-sm">{activeTown.icon}</span>
        <span className="font-bold text-white group-hover:text-amber-400 transition-colors">{activeTown.name}</span>
        <span className="text-[10px] text-zinc-500 uppercase">{activeTown.state}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-80 bg-[#0c0c14]/98 border border-white/15 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 space-y-3 backdrop-blur-2xl">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                Active Regional Node
              </span>
              <span className="text-[9px] text-zinc-500 font-mono">
                {towns.length} Town Nodes Online Across NH & ME
              </span>
            </div>
            <button
              onClick={() => { setIsOpen(false); setSearchFilter(''); }}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search or type any town in NH..."
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
              autoFocus
            />
          </div>

          {/* List of Towns */}
          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1 scrollbar-none">
            {filteredTowns.map((town) => {
              const isSelected = activeTown.id === town.id;
              return (
                <button
                  key={town.id}
                  onClick={() => handleSelect(town.id)}
                  className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'bg-amber-400/15 border border-amber-400/30 text-white'
                      : 'hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{town.icon}</span>
                    <div>
                      <p className="text-xs font-bold leading-tight">{town.name}, {town.state}</p>
                      <p className="text-[9px] font-mono text-zinc-500 truncate max-w-[170px]">{town.tagline}</p>
                    </div>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-amber-400 stroke-[3]" />}
                </button>
              );
            })}

            {/* If no exact match found, offer 1-click launch */}
            {filteredTowns.length === 0 && searchFilter.trim() && (
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-center space-y-2">
                <div className="text-xs font-bold text-white">
                  "{searchFilter.trim()}" isn't registered yet!
                </div>
                <p className="text-[10px] text-zinc-400">
                  You can launch this town node immediately on the state lattice.
                </p>
                <button
                  onClick={handleQuickLaunchNewTown}
                  className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Launch "{searchFilter.trim()}" Node</span>
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <Link
              href="/towns"
              onClick={() => { setIsOpen(false); setSearchFilter(''); }}
              className="text-zinc-400 hover:text-white uppercase flex items-center gap-1 font-bold"
            >
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full State Radar ({towns.length})</span>
            </Link>

            <Link
              href="/register-town"
              onClick={() => { setIsOpen(false); setSearchFilter(''); }}
              className="text-amber-400 hover:underline uppercase font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom Node Protocol</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
