'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, Radio, Sparkles, MapPin, Phone, 
  Layers, CheckCircle2, QrCode, Printer, Users, 
  ArrowRight, ShieldCheck, Zap, Plus, FileText,
  Sliders, Award, Store, Edit3
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { getBusinessesForTown, LocalBusiness } from '@/lib/local-businesses';
import confetti from 'canvas-confetti';

export default function TownCommandPage() {
  const { 
    towns, activeTown, activeTownId, setActiveTown, 
    addCard, cards, playDeliveryChime 
  } = useNfcStore();

  const [selectedTownId, setSelectedTownId] = useState(activeTownId);
  const currentTown = towns.find(t => t.id === selectedTownId) || activeTown;
  
  // Scanned businesses for current town
  const [townBusinesses, setTownBusinesses] = useState<LocalBusiness[]>(
    getBusinessesForTown(currentTown.name, currentTown.state)
  );

  const [isBatchAdding, setIsBatchAdding] = useState(false);
  const [batchSuccessMsg, setBatchSuccessMsg] = useState('');
  const [showPitchModal, setShowPitchModal] = useState(false);

  const [expandedMenuBizId, setExpandedMenuBizId] = useState<string | null>(null);

  // Update town businesses when town selection changes
  const handleSelectTown = (townId: string) => {
    setSelectedTownId(townId);
    setActiveTown(townId);
    const targetTown = towns.find(t => t.id === townId) || activeTown;
    setTownBusinesses(getBusinessesForTown(targetTown.name, targetTown.state));
    setBatchSuccessMsg('');
    setExpandedMenuBizId(null);
  };

  // 1-Click Batch Add All Town Businesses to Merchant Fleet
  const handleBatchGenerateCards = () => {
    setIsBatchAdding(true);

    townBusinesses.forEach((biz) => {
      // Check if already in fleet
      const exists = cards.some(c => c.businessName.toLowerCase() === biz.name.toLowerCase());
      if (!exists) {
        addCard({
          cardName: `${biz.name} - Front Stand`,
          businessName: biz.name,
          googlePlaceId: biz.googlePlaceId,
          googleReviewUrl: biz.googleReviewUrl,
          mode: 'smart_funnel',
          thresholdStars: 4,
          customHeadline: biz.suggestedCardHeadline,
          primaryColor: biz.accentColor || currentTown.accentColor,
          assignedLocation: biz.address,
          town: `${biz.town}, ${biz.state}`,
          active: true,
        });
      }
    });

    setIsBatchAdding(false);
    setBatchSuccessMsg(`Successfully generated and synced ${townBusinesses.length} NFC cards into your active fleet!`);
    playDeliveryChime();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981'],
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      
      {/* Vanguard Territory Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-600/15 to-transparent border border-white/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Town Node Vanguard Command
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentTown.icon}</span>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
                {currentTown.fullName} <span className="text-amber-400">Territory</span>
              </h1>
            </div>
            <p className="text-zinc-400 text-sm max-w-2xl">
              {currentTown.tagline} • Lead Vanguard: <strong className="text-white">{currentTown.vanguardLead}</strong>
            </p>
          </div>

          {/* Town Selector Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <select
              value={selectedTownId}
              onChange={(e) => handleSelectTown(e.target.value)}
              className="bg-[#0a0a0f] border border-white/15 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {towns.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0a0a0f] text-white">
                  {t.icon} {t.fullName}
                </option>
              ))}
            </select>

            <Link
              href="/register-town"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Launch New Town</span>
            </Link>
          </div>
        </div>

        {/* Territory Live Telemetry Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Lattice Occupancy</span>
            <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <span>{currentTown.occupancyLattice}%</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Local Shops Scanned</span>
            <div className="text-xl font-black text-white font-mono">{townBusinesses.length} Shops</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Courier Phone Relay</span>
            <div className="text-xs font-bold text-zinc-300 font-mono truncate">{currentTown.dispatchPhone}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase text-zinc-500">Node Status</span>
            <div className="text-xs font-bold uppercase text-emerald-400 font-mono tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Peak Flow</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Town Management Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Pitch Kit */}
        <div className="space-y-6">
          
          {/* Batch Generator Action Card */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center text-amber-400 font-black">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase">
                  Batch NFC Card Engine
                </h3>
                <p className="text-xs text-zinc-400">
                  Arm all {currentTown.name} businesses at once
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Auto-generate customized 5-star Google Review NFC cards, Place IDs, and smart filter funnels for every discovered shop in <strong className="text-white">{currentTown.fullName}</strong>.
            </p>

            {batchSuccessMsg && (
              <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{batchSuccessMsg}</span>
              </div>
            )}

            <button
              onClick={handleBatchGenerateCards}
              disabled={isBatchAdding}
              className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Batch Generate {townBusinesses.length} Town Cards</span>
            </button>
          </div>

          {/* Printable Merchant Pitch Kit */}
          <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white uppercase">
                  Merchant Onboarding Kit
                </h3>
                <p className="text-xs text-zinc-400">
                  Ready-to-print flyers for shopkeepers
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Print our high-converting 1-page pitch flyer to hand out to local storefronts in {currentTown.name}, showing them how NFC review cards 10x their Google ratings.
            </p>

            <button
              onClick={() => setShowPitchModal(true)}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Preview & Print Pitch Flyer</span>
            </button>
          </div>

          {/* Fast Link to Programmer */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-transparent border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <Zap className="w-4 h-4" />
              <span>Hardware Flasher Ready</span>
            </div>
            <p className="text-xs text-zinc-400">
              Need to write physical NTAG213 chips right now from your phone? Open the NFC Studio.
            </p>
            <Link
              href="/dashboard/programmer"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
            >
              <span>Launch NFC Card Programmer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Right Column: Scanned Town Businesses Lattice */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase">
                {currentTown.name} Business Discovery Lattice
              </h3>
              <p className="text-xs text-zinc-400">
                Verified local merchants & automated Google Review links
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full text-[10px] font-mono font-bold">
              {townBusinesses.length} Shops Active
            </span>
          </div>

          <div className="space-y-3">
            {townBusinesses.map((biz) => {
              const isFlashed = cards.some(c => c.businessName.toLowerCase() === biz.name.toLowerCase());
              const isMenuOpen = expandedMenuBizId === biz.id;
              const hasMenu = biz.menuItems && biz.menuItems.length > 0;

              return (
                <div
                  key={biz.id}
                  className="rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-amber-400/30 transition-all overflow-hidden group"
                >
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {biz.logoEmoji}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors">
                            {biz.name}
                          </h4>
                          <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                            {biz.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate max-w-sm">
                          {biz.description}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 pt-0.5">
                          <span className="text-amber-400 font-bold">⭐ {biz.googleRating} ({biz.reviewsCount} reviews)</span>
                          <span>•</span>
                          <span className="truncate max-w-[160px]">{biz.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasMenu && (
                        <button
                          onClick={() => setExpandedMenuBizId(isMenuOpen ? null : biz.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            isMenuOpen
                              ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                              : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
                          }`}
                        >
                          <span>🍽️ {isMenuOpen ? 'Hide Menu' : 'View Menu'}</span>
                        </button>
                      )}

                      {isFlashed ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In Fleet</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            addCard({
                              cardName: `${biz.name} Beacon`,
                              businessName: biz.name,
                              googlePlaceId: biz.googlePlaceId,
                              googleReviewUrl: biz.googleReviewUrl,
                              mode: 'smart_funnel',
                              thresholdStars: 4,
                              customHeadline: biz.suggestedCardHeadline,
                              primaryColor: biz.accentColor,
                              assignedLocation: biz.address,
                              town: `${biz.town}, ${biz.state}`,
                              active: true,
                            });
                            playDeliveryChime();
                            setBatchSuccessMsg(`Added ${biz.name} to your Fleet!`);
                          }}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/10"
                        >
                          Add to Fleet
                        </button>
                      )}

                      <Link
                        href="/dashboard/programmer"
                        className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl transition-colors"
                        title="Open in Flasher"
                      >
                        <Radio className="w-4 h-4 text-amber-400" />
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Menu Drawer */}
                  {isMenuOpen && hasMenu && (
                    <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-black/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between text-xs font-mono uppercase text-amber-400 font-bold">
                        <span>{biz.menuTitle || 'Store Catalog & Menu'}</span>
                        <span className="text-[10px] text-zinc-500">{biz.menuItems?.length} items listed</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {biz.menuItems?.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3"
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-bold text-white">{item.name}</span>
                                {item.popular && (
                                  <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                                    Popular
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-zinc-400 line-clamp-2">{item.description}</p>
                            </div>
                            <span className="text-xs font-mono font-black text-amber-400 shrink-0">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE PITCH FLYER MODAL */}
      {/* ========================================================================= */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Printer className="w-4 h-4" />
                <span>Printable Merchant Onboarding Pitch Sheet</span>
              </div>
              <button
                onClick={() => setShowPitchModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Printable Sheet Preview */}
            <div className="p-8 bg-zinc-950 border border-white/15 rounded-2xl space-y-6 text-white text-left font-sans shadow-inner">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{currentTown.icon}</span>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">
                      {currentTown.fullName} Local Business Network
                    </h2>
                    <p className="text-xs text-amber-400 font-mono font-bold">
                      Powered by Townraise Physical-to-Digital Infrastructure
                    </p>
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-zinc-400">
                  <span>TOWN VANGUARD INITIATIVE</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-black text-white">
                  Turn Everyday Customers into Verified 5-Star Google Reviews
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Join fellow local merchants across {currentTown.name} in equipping your checkout counters with smart NFC tap cards and acrylic tabletop review stands.
                </p>

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-amber-400">⚡ 0.1s Tap-to-Review</span>
                    <p className="text-[11px] text-zinc-400">Customers tap their phone to instantly open your Google Review page.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                    <span className="text-xs font-bold text-emerald-400">🛡️ Negative Rating Shield</span>
                    <p className="text-[11px] text-zinc-400">1-3 star feedback is filtered to your private inbox before hurting your public score.</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-2">
                  <span className="text-xs font-bold text-white uppercase">Express Phone Delivery Dispatch Included</span>
                  <p className="text-xs text-zinc-300">
                    Town residents can order your products directly on our community marketplace with instant phone notification relay.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <div>
                  <span className="text-white font-bold">Contact Town Vanguard: </span>
                  <span>{currentTown.dispatchPhone}</span>
                </div>
                <span className="text-amber-400 font-bold">No Monthly Subscriptions</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pitch Flyer</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
