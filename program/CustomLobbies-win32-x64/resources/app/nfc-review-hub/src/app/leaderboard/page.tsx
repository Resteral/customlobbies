'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { calculateCardProgression, LEVEL_TIERS } from '@/lib/card-leveling';
import NfcCardLevelWidget from '@/components/NfcCardLevelWidget';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Crown, 
  Zap, 
  MapPin, 
  Sparkles, 
  Gift, 
  Radio, 
  Truck, 
  ShoppingBag, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  ArrowRight,
  Star,
  CheckCircle2
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  town: string;
  avatar: string;
  level: number;
  levelTitle: string;
  badgeIcon: string;
  cardSkin: string;
  xp: number;
  multiplier: number;
  storesHunted: number;
  landmarksCleared: number;
  currentStreak: number;
  badges: string[];
}

export default function LeaderboardPage() {
  const { 
    towns, 
    activeTown, 
    deliveryDrivers, 
    storeHunterStamps, 
    passportStamps, 
    storeHuntCircuits, 
    touristHunts,
    currentUser,
    loyaltyWallet,
    awardLoyaltyPoints,
    playDeliveryChime
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'individual' | 'town_cup' | 'loot_chest'>('town_cup');
  const [isOpeningChest, setIsOpeningChest] = useState(false);
  const [unlockedLoot, setUnlockedLoot] = useState<{ title: string; desc: string; icon: string; rarity: string; code: string } | null>(null);

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  // Seeded Community Leaderboard
  const leaderboardUsers: LeaderboardUser[] = useMemo(() => {
    const userItem: LeaderboardUser = {
      id: currentUser?.id || 'user-current',
      name: currentUser?.name || 'Sean Martin (You)',
      town: currentUser?.town || 'Effingham',
      avatar: currentUser?.avatar || '👑',
      level: cardProgression.currentLevel,
      levelTitle: cardProgression.levelTitle,
      badgeIcon: cardProgression.badgeIcon,
      cardSkin: cardProgression.cardSkin,
      xp: cardProgression.currentXp,
      multiplier: cardProgression.multiplier,
      storesHunted: cardProgression.totalStoresVisited,
      landmarksCleared: passportStamps.length,
      currentStreak: cardProgression.storeStreakCount,
      badges: ['Founding Member', 'Vanguard Operator', cardProgression.levelTitle]
    };

    const peerUsers: LeaderboardUser[] = [
      {
        id: 'user-eleanor',
        name: 'Eleanor Vance',
        town: 'Ossipee',
        avatar: '🏺',
        level: 4,
        levelTitle: 'Master Navigator',
        badgeIcon: '💎',
        cardSkin: 'sapphire',
        xp: 1120,
        multiplier: 1.5,
        storesHunted: 14,
        landmarksCleared: 8,
        currentStreak: 2,
        badges: ['Master Antique Hunter', 'Lakes Navigator']
      },
      {
        id: 'user-walter',
        name: 'Walter Henderson',
        town: 'Effingham',
        avatar: '🛠️',
        level: 4,
        levelTitle: 'Master Navigator',
        badgeIcon: '💎',
        cardSkin: 'sapphire',
        xp: 980,
        multiplier: 1.5,
        storesHunted: 11,
        landmarksCleared: 6,
        currentStreak: 1,
        badges: ['Timber Pioneer', 'Valley Scout']
      },
      {
        id: 'user-brenda',
        name: 'Brenda O’Connor',
        town: 'Wolfeboro',
        avatar: '☕',
        level: 3,
        levelTitle: 'Store Hunter Specialist',
        badgeIcon: '⚡',
        cardSkin: 'gold',
        xp: 620,
        multiplier: 1.25,
        storesHunted: 8,
        landmarksCleared: 5,
        currentStreak: 3,
        badges: ['Sweet Tooth Explorer', 'Lake Navigator']
      },
      {
        id: 'user-timothy',
        name: 'Timothy Walsh',
        town: 'Freedom',
        avatar: '🧀',
        level: 3,
        levelTitle: 'Store Hunter Specialist',
        badgeIcon: '⚡',
        cardSkin: 'gold',
        xp: 540,
        multiplier: 1.25,
        storesHunted: 7,
        landmarksCleared: 4,
        currentStreak: 2,
        badges: ['Harvest Connoisseur']
      },
      {
        id: 'user-jackson',
        name: 'Jackson Reid',
        town: 'Conway',
        avatar: '⛰️',
        level: 3,
        levelTitle: 'Store Hunter Specialist',
        badgeIcon: '⚡',
        cardSkin: 'gold',
        xp: 490,
        multiplier: 1.25,
        storesHunted: 6,
        landmarksCleared: 5,
        currentStreak: 1,
        badges: ['Alpine Scout', 'Outfitter Pioneer']
      },
      {
        id: 'user-maya',
        name: 'Maya Greenwood',
        town: 'Tamworth',
        avatar: '🎭',
        level: 2,
        levelTitle: 'Town Scout',
        badgeIcon: '🌲',
        cardSkin: 'emerald',
        xp: 280,
        multiplier: 1.1,
        storesHunted: 4,
        landmarksCleared: 4,
        currentStreak: 1,
        badges: ['Culture Seeker']
      }
    ];

    const list = [userItem, ...peerUsers];
    return list.sort((a, b) => b.xp - a.xp);
  }, [currentUser, cardProgression, passportStamps]);

  // Town Standings Calculation
  const townStandings = useMemo(() => {
    return towns.map(town => {
      const townDrivers = deliveryDrivers.filter(d => d.town.toLowerCase() === town.name.toLowerCase() && d.isOnline);
      const townStores = storeHuntCircuits.flatMap(c => c.spots).filter(s => s.town.toLowerCase().includes(town.name.toLowerCase()));
      const townHunts = touristHunts.filter(h => h.town.toLowerCase().includes(town.name.toLowerCase()));
      
      // Calculate total town pride points
      const basePoints = town.occupancyLattice * 25;
      const driverPoints = townDrivers.length * 50;
      const storePoints = townStores.length * 75;
      const totalPrideScore = basePoints + driverPoints + storePoints;

      return {
        id: town.id,
        name: town.name,
        fullName: town.fullName,
        icon: town.icon,
        accentColor: town.accentColor || '#f59e0b',
        prideScore: totalPrideScore,
        activeDrivers: townDrivers.length,
        partnerStoresCount: townStores.length,
        activeTrailsCount: townHunts.length,
        leadOperator: town.vanguardLead
      };
    }).sort((a, b) => b.prideScore - a.prideScore);
  }, [towns, deliveryDrivers, storeHuntCircuits, touristHunts]);

  const handleOpenLootChest = () => {
    if (loyaltyWallet.userPoints < 25) {
      alert('You need at least 25 loyalty points to crack open a Carroll County Mystery Chest!');
      return;
    }

    setIsOpeningChest(true);
    setTimeout(() => {
      setIsOpeningChest(false);

      const lootPool = [
        {
          title: '💎 Legendary Courier Pass',
          desc: '1-Free 24/7 Sean Martin 4x4 Urgent Delivery or Towing Voucher.',
          icon: '🛻',
          rarity: 'LEGENDARY',
          code: `LOOT-4X4-${Math.floor(1000 + Math.random() * 9000)}`
        },
        {
          title: '🪙 150 Bonus Loyalty Points',
          desc: '+$15.00 spendable store credit added instantly to your wallet.',
          icon: '💎',
          rarity: 'EPIC',
          code: `LOOT-PTS-150`
        },
        {
          title: '🏷️ 20% Off Regional Shopping Spree',
          desc: 'Save 20% across any partner antique barn, farmstand or bakery.',
          icon: '🛍️',
          rarity: 'RARE',
          code: `LOOT-SPREE-20`
        },
        {
          title: '🥖 Artisan Harvest Tasting Token',
          desc: 'Free fresh sourdough pastry or pure maple syrup bottle token.',
          icon: '🍁',
          rarity: 'UNCOMMON',
          code: `LOOT-TASTING-FREE`
        },
        {
          title: '⚡ +50 XP Card Leveling Surge',
          desc: 'Fast-tracks your progress toward the next Card Mastery Tier!',
          icon: '⚡',
          rarity: 'COMMON',
          code: `LOOT-XP-BOOST`
        }
      ];

      const won = lootPool[Math.floor(Math.random() * lootPool.length)];
      setUnlockedLoot(won);

      // Deduct 25 points cost, but if points loot, add 150
      if (won.rarity === 'EPIC') {
        awardLoyaltyPoints(125, 'Won 150 Points from Mystery Loot Chest (-25 entry)');
      } else {
        awardLoyaltyPoints(-25, 'Opened Carroll County Mystery Loot Chest');
      }

      playDeliveryChime();
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 }
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 selection:bg-amber-500 selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            Carroll County Regional Rankings & Pride Arena
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 uppercase">
            Town Pride & <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Card Mastery</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Track which town leads Carroll County in active commerce, courier runs, and tourism. Climb the Card Leveling Ladder by visiting local stores, building same-day store streaks, and opening Mystery Loot Chests!
          </p>
        </div>

        {/* User Card Level Header Widget */}
        <div className="mb-10">
          <NfcCardLevelWidget progression={cardProgression} />
        </div>

        {/* Navigation Tabs (Town Cup vs Pioneer Leaderboard vs Mystery Chest) */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-1">
            <button
              onClick={() => setActiveTab('town_cup')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'town_cup'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Town Pride Cup ({towns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('individual')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'individual'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Pioneers Ladder</span>
            </button>

            <button
              onClick={() => setActiveTab('loot_chest')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'loot_chest'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Gift className="w-4 h-4 text-pink-300 animate-pulse" />
              <span>Mystery Loot Chest</span>
            </button>
          </div>
        </div>

        {/* TAB 1: TOWN PRIDE CUP ARENA */}
        {activeTab === 'town_cup' && (
          <div className="space-y-8">
            {/* Top Champion Crown Card */}
            {townStandings[0] && (
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 relative overflow-hidden backdrop-blur-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center text-4xl font-black shadow-2xl shadow-amber-500/40">
                      👑
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          Current Reigning Champion
                        </span>
                        <span className="text-[10px] text-white/50">• Week 38 Leader</span>
                      </div>
                      <h2 className="text-3xl font-black text-white mt-1">
                        {townStandings[0].name}, NH Node
                      </h2>
                      <p className="text-xs text-white/70 mt-1">
                        Vanguard Lead: <strong>{townStandings[0].leadOperator}</strong> • {townStandings[0].partnerStoresCount} Boutiques • {townStandings[0].activeDrivers} Drivers Online
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-amber-300 uppercase font-bold tracking-wider block">Regional Pride Score</span>
                    <span className="text-4xl font-black text-white font-mono">{townStandings[0].prideScore} PTS</span>
                    <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">🌟 +10% Point Bonus for all town taps</span>
                  </div>
                </div>
              </div>
            )}

            {/* Standings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {townStandings.map((town, idx) => (
                <div
                  key={town.id}
                  className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-xl'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                        idx === 0 ? 'bg-amber-500 text-black font-black' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/60'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                          <span>{town.icon}</span>
                          <span>{town.name}</span>
                        </h3>
                        <p className="text-[10px] text-white/50">{town.leadOperator}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-amber-400 font-mono">{town.prideScore}</span>
                      <span className="text-[9px] text-white/40 block">PTS</span>
                    </div>
                  </div>

                  {/* Town Stats */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 rounded-2xl border border-white/5 text-center text-xs">
                    <div>
                      <span className="text-[9px] text-white/40 block">STORES</span>
                      <strong className="text-white">{town.partnerStoresCount}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">DRIVERS</span>
                      <strong className="text-emerald-400">{town.activeDrivers}</strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 block">TRAILS</span>
                      <strong className="text-cyan-400">{town.activeTrailsCount}</strong>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs">
                    <Link
                      href={`/store-hunting?town=${town.name}`}
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>Hunt in {town.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PIONEERS INDIVIDUAL LEADERBOARD */}
        {activeTab === 'individual' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white/40 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Top Explorers & Cardholders ({leaderboardUsers.length})
              </h3>
              <span className="text-xs text-white/50">
                Ranked by Total Card Experience (XP)
              </span>
            </div>

            <div className="space-y-3">
              {leaderboardUsers.map((user, idx) => {
                const isCurrentUser = user.id === (currentUser?.id || 'user-current');

                return (
                  <div
                    key={user.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isCurrentUser
                        ? 'bg-amber-500/15 border-amber-400 shadow-xl shadow-amber-500/10'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        idx === 0 ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/30' : idx === 1 ? 'bg-zinc-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-white/10 text-white/60'
                      }`}>
                        #{idx + 1}
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0 border border-white/10">
                        {user.avatar}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white">
                            {user.name}
                          </h4>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                              You
                            </span>
                          )}
                          <span className="text-[10px] text-white/50 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {user.town}, NH
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1 text-xs">
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            <span>{user.badgeIcon}</span>
                            <span>Level {user.level}: {user.levelTitle}</span>
                          </span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60">
                            {user.storesHunted} Stores • {user.landmarksCleared} Landmarks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                      {user.currentStreak > 1 && (
                        <span className="px-2.5 py-1 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" />
                          {user.currentStreak}x Streak
                        </span>
                      )}

                      <div className="text-right">
                        <span className="text-base font-black text-white font-mono">{user.xp} XP</span>
                        <span className="text-[9px] text-amber-400 font-mono block">{user.multiplier}x Multiplier</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: MYSTERY LOOT CHEST */}
        {activeTab === 'loot_chest' && (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0e0e16] to-[#07070c] border border-purple-500/30 shadow-2xl relative overflow-hidden space-y-6">
              
              {/* Chest Icon Animation */}
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center mx-auto text-5xl shadow-2xl shadow-purple-500/40 animate-pulse">
                  🎁
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                  Daily Roll & Point Burn Mini-Game
                </span>
                <h3 className="text-3xl font-black text-white uppercase">
                  Crack Open a Mystery Chest
                </h3>
                <p className="text-xs text-white/60 max-w-md mx-auto">
                  Win legendary 4x4 courier vouchers, +150 loyalty points, 20% regional shopping spree codes, and card XP surges!
                </p>
              </div>

              {/* Cost & Wallet */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 inline-flex items-center gap-6 text-xs font-mono">
                <div>
                  <span className="text-white/40 block text-[10px]">CHEST COST</span>
                  <span className="text-amber-400 font-black">25 Points / Roll</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div>
                  <span className="text-white/40 block text-[10px]">YOUR BALANCE</span>
                  <span className="text-white font-black">{loyaltyWallet.userPoints} Points</span>
                </div>
              </div>

              <div>
                <button
                  disabled={isOpeningChest}
                  onClick={handleOpenLootChest}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 hover:from-purple-400 hover:to-amber-300 text-black text-sm font-black uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-purple-500/30 hover:scale-105 disabled:opacity-50"
                >
                  {isOpeningChest ? 'Opening Treasure Chest...' : 'Crack Chest for 25 Pts 🎁'}
                </button>
              </div>
            </div>

            {/* Unlocked Loot Modal */}
            {unlockedLoot && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-[#0e0e14] border border-pink-500/60 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-pink-500 to-amber-400 text-black flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-pink-500/40 animate-bounce">
                    {unlockedLoot.icon}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                      ★ {unlockedLoot.rarity} LOOT DROP ★
                    </span>
                    <h3 className="text-2xl font-black text-white">
                      {unlockedLoot.title}
                    </h3>
                    <p className="text-xs text-white/70">
                      {unlockedLoot.desc}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-xs text-amber-400 font-bold">
                    Voucher: {unlockedLoot.code}
                  </div>

                  <button
                    onClick={() => setUnlockedLoot(null)}
                    className="w-full py-3 bg-pink-500 hover:bg-pink-400 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/30"
                  >
                    Claim Loot to Wallet
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
