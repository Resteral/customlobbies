'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  ArrowRight, 
  Utensils, 
  Wrench, 
  Sparkles, 
  Building2, 
  Calendar, 
  Bot, 
  Gift, 
  Crown,
  Compass,
  CornerDownLeft
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function SpotlightSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { storefronts, directoryListings, events, managedServices, towns } = useNfcStore();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  // Aggregate searchable items
  const menuItems = storefronts.flatMap(sf => 
    sf.products.map(p => ({
      type: 'Food / Menu',
      title: p.name,
      subtitle: `${sf.businessName} • $${p.price.toFixed(2)}`,
      href: `/eats`,
      icon: Utensils,
      color: 'text-amber-400'
    }))
  );

  const businessItems = directoryListings.map(d => ({
    type: 'Directory Business',
    title: d.name,
    subtitle: `${d.categoryLabel} • ${d.town}, NH`,
    href: `/directory`,
    icon: Building2,
    color: 'text-indigo-400'
  }));

  const eventItems = events.map(e => ({
    type: 'Community Event',
    title: e.title,
    subtitle: `${e.date} • ${e.town}`,
    href: `/events`,
    icon: Calendar,
    color: 'text-emerald-400'
  }));

  const serviceItems = managedServices.map(s => ({
    type: 'Automation Retainer',
    title: s.name,
    subtitle: `$${s.monthlyPrice}/mo • ${s.recommendedFor}`,
    href: `/services`,
    icon: Bot,
    color: 'text-yellow-400'
  }));

  const quickLinks = [
    { type: 'Quick Navigation', title: 'Local Business Directory', subtitle: 'Browse all Carroll County shops & claim free NFC', href: '/directory', icon: Building2, color: 'text-amber-400' },
    { type: 'Quick Navigation', title: 'Town Loyalty Pass & Rewards', subtitle: 'Check points balance & redeem $5 vouchers', href: '/rewards', icon: Gift, color: 'text-amber-400' },
    { type: 'Quick Navigation', title: '$50 Ambassador Bounties', subtitle: 'Earn $50 per referred merchant', href: '/affiliate', icon: Sparkles, color: 'text-emerald-400' },
    { type: 'Quick Navigation', title: 'Carroll County Events Radar', subtitle: 'Live music, festivals & lake meetups', href: '/events', icon: Calendar, color: 'text-pink-400' },
    { type: 'Quick Navigation', title: 'Admin & Automation Bot Suite', subtitle: 'Master operating control panel', href: '/dashboard/admin', icon: Crown, color: 'text-amber-400' },
  ];

  const allItems = [...quickLinks, ...menuItems, ...businessItems, ...eventItems, ...serviceItems];

  const filteredResults = query.trim() === ''
    ? quickLinks
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4">
      <div className="relative w-full max-w-2xl bg-[#0d0d12] border border-amber-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search menus, pizza, contractors, events, rewards, or towns... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-base placeholder:text-white/30 focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-[420px] overflow-y-auto space-y-1 scrollbar-none">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-xs">
              No results found for &quot;{query}&quot;. Try searching for &quot;pizza&quot;, &quot;deck&quot;, &quot;rewards&quot;, or &quot;events&quot;.
            </div>
          ) : (
            filteredResults.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(item.href)}
                  className="w-full text-left p-3.5 rounded-2xl hover:bg-white/5 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/5">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{item.subtitle}</p>
                    </div>
                  </div>

                  <CornerDownLeft className="w-4 h-4 text-white/20 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-6 py-2.5 bg-black/40 border-t border-white/5 text-[10px] text-white/40 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>Navigation: <strong>↑↓</strong></span>
            <span>Select: <strong>Enter</strong></span>
            <span>Close: <strong>Esc</strong></span>
          </div>
          <span className="text-amber-400">Oasis Universal Spotlight</span>
        </div>
      </div>
    </div>
  );
}
