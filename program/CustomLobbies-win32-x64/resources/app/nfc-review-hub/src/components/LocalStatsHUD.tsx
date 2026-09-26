'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { calculateCardProgression } from '@/lib/card-leveling';
import { downloadCsvFile, generateCsvString } from '@/lib/csv-parser';
import confetti from 'canvas-confetti';
import { 
  Coins, 
  Zap, 
  MapPin, 
  Gift, 
  Compass, 
  ShoppingBag, 
  Truck, 
  Store, 
  CheckCircle2, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Download, 
  Database, 
  RefreshCw, 
  Layers, 
  Award, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface LocalStatsHUDProps {
  className?: string;
  showExportControls?: boolean;
}

export default function LocalStatsHUD({ className = '', showExportControls = true }: LocalStatsHUDProps) {
  const { 
    currentUser, 
    loyaltyWallet, 
    storeHunterStamps, 
    passportStamps, 
    storeHuntCircuits, 
    touristHunts,
    deliveryOrders, 
    driverShift, 
    storefronts, 
    directoryListings,
    products,
    cart,
    awardLoyaltyPoints,
    playDeliveryChime
  } = useNfcStore();

  const [bonusAdded, setBonusAdded] = useState(false);

  // Card Progression
  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  // Total NFC Taps / Checkpoints explored
  const totalTaps = (storeHunterStamps?.length || 0) + (passportStamps?.length || 0);

  // Total Orders & Spend
  const totalOrdersCount = deliveryOrders?.length || 0;
  const totalOrdersSpent = (deliveryOrders || []).reduce((acc, o) => acc + (o.total || 0), 0);

  // Unlocked Perks count
  const unlockedPerksCount = storeHunterStamps?.length || 0;

  // Circuit breakdown
  const circuitBreakdown = useMemo(() => {
    const visitedSpotIds = new Set(storeHunterStamps.map(s => s.spotId));
    return storeHuntCircuits.map(c => {
      const totalSpots = c.spots.length;
      const visitedCount = c.spots.filter(s => visitedSpotIds.has(s.id)).length;
      const percent = totalSpots > 0 ? Math.round((visitedCount / totalSpots) * 100) : 0;
      return {
        id: c.id,
        name: c.title,
        town: c.townsCovered.join(', '),
        totalSpots,
        visitedCount,
        percent,
        rewardBounty: c.circuitBonusReward
      };
    });
  }, [storeHuntCircuits, storeHunterStamps]);

  // Handle Export Local Stats as JSON
  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user: currentUser,
      loyaltyWallet,
      cardProgression,
      totalTaps,
      storeHunterStamps,
      passportStamps,
      deliveryOrders,
      driverShift,
      myStorefronts: storefronts.filter(s => s.phone === currentUser?.phone || s.town === currentUser?.town),
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `townraise_local_stats_${currentUser?.name.toLowerCase().replace(/\s+/g, '_') || 'resident'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playDeliveryChime();
  };

  // Handle Export Local Stats as CSV
  const handleExportCsv = () => {
    const flatStats = [
      { Metric: 'Resident Name', Value: currentUser?.name || 'Local Resident' },
      { Metric: 'Primary Role', Value: currentUser?.role || 'Resident Pioneer' },
      { Metric: 'Town Node', Value: `${currentUser?.town || 'Effingham'}, NH` },
      { Metric: 'Account Points Balance', Value: loyaltyWallet.userPoints },
      { Metric: 'Lifetime Reviews & Taps', Value: `${loyaltyWallet.lifetimeTaps} Taps / ${loyaltyWallet.reviewsWritten} Reviews` },
      { Metric: 'Spend / Hunt Multiplier', Value: `${cardProgression.multiplier}x` },
      { Metric: 'Card Level Tier', Value: `Lv.${cardProgression.currentLevel} ${cardProgression.levelTitle}` },
      { Metric: 'Current Level XP', Value: `${cardProgression.currentXp} / ${cardProgression.xpForNextLevel}` },
      { Metric: 'Total NFC Physical Taps', Value: totalTaps },
      { Metric: 'Store Hunting Stamps', Value: storeHunterStamps.length },
      { Metric: 'Tourist Landmark Stamps', Value: passportStamps.length },
      { Metric: 'Unlocked Secret Perks', Value: unlockedPerksCount },
      { Metric: 'Total Local Orders Placed', Value: totalOrdersCount },
      { Metric: 'Total Local Delivery Spend', Value: `$${totalOrdersSpent.toFixed(2)}` },
      { Metric: 'Active Cart Items', Value: cart.reduce((acc, i) => acc + i.quantity, 0) },
      { Metric: 'Driver Shift Balance', Value: `$${driverShift.totalBalance.toFixed(2)}` },
      { Metric: 'Driver Deliveries Completed', Value: driverShift.shiftDeliveriesCount },
    ];

    downloadCsvFile(generateCsvString(flatStats), `townraise_stats_${currentUser?.name.toLowerCase().replace(/\s+/g, '_') || 'resident'}.csv`);
    playDeliveryChime();
  };

  // Quick Bonus Points Generator
  const handleClaimLocalBonus = () => {
    awardLoyaltyPoints(50, 'Local Pioneer Check-In Bonus');
    setBonusAdded(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setBonusAdded(false), 3000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Top Banner: Local Identity & Telemetry Status */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-400/30 relative overflow-hidden backdrop-blur-xl shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          {/* User Identity Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-[14px] bg-[#09090f] flex items-center justify-center text-3xl">
                {currentUser?.avatar || '🌲'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black text-white">{currentUser?.name || 'Local Resident'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-bold">
                  {currentUser?.role || 'Resident Pioneer'}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {currentUser?.town || 'Effingham'}, NH
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Local Storage Active (Synced)
                </span>
                <span>•</span>
                <span>Pass UID: <strong className="text-white">TR-{currentUser?.id?.slice(-6).toUpperCase() || '847291'}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Bonus & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleClaimLocalBonus}
              disabled={bonusAdded}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{bonusAdded ? '+50 Points Awarded!' : 'Daily Check-In (+50 Pts)'}</span>
            </button>

            {showExportControls && (
              <>
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Export local stats to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleExportJson}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                  title="Export local stats to JSON"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export JSON</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. THE 6 PRIMARY LOCAL STATS TILES */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Stat 1: Reward Points */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Account Points</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight">
            {loyaltyWallet.userPoints}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            {loyaltyWallet.lifetimeTaps} Lifetime Taps
          </div>
        </div>

        {/* Stat 2: Card Tier & Level */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-purple-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Card Tier</span>
            <span className="text-base">{cardProgression.badgeIcon}</span>
          </div>
          <div className="text-2xl font-black text-purple-300 tracking-tight">
            Lv.{cardProgression.currentLevel}
          </div>
          <div className="text-[10px] font-mono text-zinc-400 truncate">
            {cardProgression.levelTitle}
          </div>
        </div>

        {/* Stat 3: Points Multiplier */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-yellow-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Multiplier</span>
            <Zap className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-yellow-300 tracking-tight">
            {cardProgression.multiplier}x
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Earn Rate Bonus
          </div>
        </div>

        {/* Stat 4: Total NFC Physical Taps */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Total Taps</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 tracking-tight">
            {totalTaps}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Checkpoints Visited
          </div>
        </div>

        {/* Stat 5: Store Discounts & Perks */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-pink-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Perks Won</span>
            <Gift className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-pink-300 tracking-tight">
            {unlockedPerksCount}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            Active Discount Codes
          </div>
        </div>

        {/* Stat 6: Local Orders */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-emerald-400/40 transition-all space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300 tracking-tight">
            {totalOrdersCount}
          </div>
          <div className="text-[10px] font-mono text-zinc-500">
            ${totalOrdersSpent.toFixed(2)} Local Spend
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. LEVEL PROGRESSION XP METER */}
      {/* ======================================================== */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold">
              Level Progression: {cardProgression.currentLevel} ({cardProgression.levelTitle})
            </span>
          </div>
          <div className="text-zinc-400">
            <span>{cardProgression.currentXp} XP / {cardProgression.xpForNextLevel} XP to Next Tier</span>
            <span className="text-purple-400 font-bold ml-2">({Math.round(cardProgression.xpProgressPercent)}%)</span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/5 p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-700 shadow-md shadow-purple-500/20"
            style={{ width: `${Math.min(100, Math.max(6, cardProgression.xpProgressPercent))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Current Skin: <strong className="text-zinc-300 capitalize">{cardProgression.cardSkin.replace('_', ' ')}</strong></span>
          <span>Next Perk: <strong className="text-amber-300">{cardProgression.nextPerkPreview}</strong></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. CARROLL COUNTY STORE CIRCUITS PROGRESSION */}
      {/* ======================================================== */}
      <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Store Hunting Circuit Completion Stats</span>
          </h4>
          <Link 
            href="/store-hunting" 
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Explore Circuits</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {circuitBreakdown.map((circuit) => (
            <div 
              key={circuit.id}
              className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-amber-400/30 transition-all"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-white truncate">{circuit.name}</span>
                <span className="text-amber-400 font-mono text-[11px]">{circuit.percent}%</span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${circuit.percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>{circuit.visitedCount} / {circuit.totalSpots} Shops Tapped</span>
                <span className="text-purple-300 font-bold">{circuit.rewardBounty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. DRIVER / MERCHANT CONDITIONAL TELEMETRY */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Driver Shift Stats */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Courier Dispatch Telemetry</span>
            </div>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
              driverShift.isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
            }`}>
              {driverShift.isOnline ? 'Online Ready' : 'Off-Duty'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Deliveries</div>
              <div className="text-lg font-black text-white">{driverShift.shiftDeliveriesCount}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Balance</div>
              <div className="text-lg font-black text-emerald-400">${driverShift.totalBalance.toFixed(2)}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Shift Earnings</div>
              <div className="text-lg font-black text-amber-300">${driverShift.shiftEarningsTotal.toFixed(2)}</div>
            </div>
          </div>

          <Link
            href="/courier"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300"
          >
            <span>Open Courier Dispatch Dashboard →</span>
          </Link>
        </div>

        {/* Merchant & Storefront Stats */}
        <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Storefront & Merchant Stats</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              {storefronts.length} Active Storefronts
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Storefronts</div>
              <div className="text-lg font-black text-white">{storefronts.length}</div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Menu Dishes</div>
              <div className="text-lg font-black text-orange-400">
                {storefronts.reduce((acc, sf) => acc + sf.products.length, 0)}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-white/[0.02]">
              <div className="text-[10px] font-mono text-zinc-500">Reviews / Taps</div>
              <div className="text-lg font-black text-amber-300">
                {directoryListings.reduce((acc, d) => acc + d.reviewCount, 0)}
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/storefront"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Manage Storefronts & Menus →</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
