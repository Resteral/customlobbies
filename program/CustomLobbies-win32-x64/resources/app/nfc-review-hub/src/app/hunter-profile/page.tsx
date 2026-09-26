'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { calculateCardProgression } from '@/lib/card-leveling';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  MapPin, 
  Sparkles, 
  Radio, 
  Gift, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Truck, 
  Tag, 
  Store, 
  Compass, 
  QrCode, 
  Copy, 
  Check, 
  Search, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  Zap,
  TrendingUp,
  User,
  Edit3,
  Download,
  Share2,
  Navigation,
  Calendar,
  Ticket,
  Printer,
  Coins
} from 'lucide-react';

import LocalStatsHUD from '@/components/LocalStatsHUD';

export default function HunterProfilePage() {
  const { 
    currentUser, 
    loginUser,
    storeHunterStamps, 
    passportStamps, 
    storeHuntCircuits, 
    tapInStoreBeacon, 
    loyaltyWallet,
    loyaltyRewards,
    redeemLoyaltyReward,
    awardLoyaltyPoints,
    playDeliveryChime
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'local_stats' | 'perks' | 'rewards_vault' | 'stamps' | 'pass'>('local_stats');
  const [copiedVoucherCode, setCopiedVoucherCode] = useState<string | null>(null);
  const [copiedProfileId, setCopiedProfileId] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingInSim, setIsCheckingInSim] = useState(false);
  const [quickCheckInSuccess, setQuickCheckInSuccess] = useState<string | null>(null);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || 'Local Store Hunter');
  const [profileTown, setProfileTown] = useState(currentUser?.town || 'Effingham');
  const [profileAvatar, setProfileAvatar] = useState(currentUser?.avatar || '🌲');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '(603) 539-1234');

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  // Aggregate unlocked store perks
  const unlockedPerks = useMemo(() => {
    return storeHunterStamps.map(stamp => ({
      ...stamp.unlockedPerk,
      storeName: stamp.storeName,
      town: stamp.town,
      stampedAt: stamp.timestamp,
      spotId: stamp.spotId,
      pointsEarned: stamp.pointsEarned,
      verifiedVia: stamp.verifiedVia
    }));
  }, [storeHunterStamps]);

  const filteredPerks = useMemo(() => {
    if (!searchQuery.trim()) return unlockedPerks;
    return unlockedPerks.filter(p => 
      p.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.discountLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.town.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.voucherCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [unlockedPerks, searchQuery]);

  const handleCopyVoucher = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucherCode(code);
    setTimeout(() => setCopiedVoucherCode(null), 2000);
  };

  const handleCopyHunterId = () => {
    const hunterId = `TR-HUNT-${currentUser?.id ? currentUser.id.slice(-6).toUpperCase() : '847291'}`;
    navigator.clipboard.writeText(hunterId);
    setCopiedProfileId(true);
    setTimeout(() => setCopiedProfileId(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      loginUser({
        ...currentUser,
        name: profileName,
        town: profileTown,
        avatar: profileAvatar,
        phone: profilePhone
      });
    }
    setIsEditingProfile(false);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleRedeemRewardFromProfile = (rewardId: string, title: string) => {
    const success = redeemLoyaltyReward(rewardId);
    if (success) {
      setRedeemSuccessMsg(`✓ Successfully redeemed "${title}"! Voucher code added to your wallet.`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => setRedeemSuccessMsg(null), 4000);
    } else {
      setRedeemSuccessMsg('⚠️ Insufficient account points. Visit and tap more local shops to earn points!');
      setTimeout(() => setRedeemSuccessMsg(null), 3500);
    }
  };

  // Quick Demo Check-In Simulator for first unvisited store
  const unvisitedSpots = useMemo(() => {
    const visitedSet = new Set(storeHunterStamps.map(s => s.spotId));
    const list: { circuitId: string; spot: any }[] = [];
    storeHuntCircuits.forEach(c => {
      c.spots.forEach(s => {
        if (!visitedSet.has(s.id)) {
          list.push({ circuitId: c.id, spot: s });
        }
      });
    });
    return list;
  }, [storeHuntCircuits, storeHunterStamps]);

  const handleQuickCheckIn = (circuitId: string, spot: any) => {
    setIsCheckingInSim(true);
    setTimeout(() => {
      const res = tapInStoreBeacon(circuitId, spot.id, 'nfc');
      setIsCheckingInSim(false);
      if (res.success) {
        setQuickCheckInSuccess(`✓ Checked in at ${spot.storeName}! Earned +${res.pointsEarned} Pts for your account!`);
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => setQuickCheckInSuccess(null), 4000);
      }
    }, 600);
  };

  const hunterId = `TR-HUNT-${currentUser?.id ? currentUser.id.slice(-6).toUpperCase() : '847291'}`;

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[400px] bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        
        {/* Top Navigation Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Link
              href="/store-hunting"
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-purple-400 transition-colors flex items-center gap-1.5"
            >
              <span>← Store Circuits</span>
            </Link>
            <Link
              href="/rewards"
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-mono font-bold text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <span>🎁 Rewards Hub</span>
            </Link>
            <Link
              href="/society"
              className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-mono font-bold text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <span>🏛️ Sovereign Vault</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{loyaltyWallet.userPoints} Account Points</span>
            </span>
          </div>
        </div>

        {/* Hunter Identity & Card Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#12111a] via-[#0e0d16] to-[#0a0a0f] border border-purple-500/20 shadow-2xl relative overflow-hidden">
          {/* Subtle background circuit watermark */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            {/* Avatar & User Details */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 p-0.5 shadow-xl shadow-purple-500/20">
                  <div className="w-full h-full rounded-[22px] bg-[#070709] flex items-center justify-center text-4xl sm:text-5xl">
                    {currentUser?.avatar || '🌲'}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white border border-black shadow-lg transition-transform hover:scale-110"
                  title="Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {cardProgression.levelTitle}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {currentUser?.town || 'Effingham'}, NH
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    ⚡ {cardProgression.multiplier}x Multiplier
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{currentUser?.name || 'Local Store Hunter'}</span>
                </h1>

                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <button 
                    onClick={handleCopyHunterId}
                    className="flex items-center gap-1.5 text-zinc-300 hover:text-purple-300 transition-colors"
                    title="Click to copy Hunter ID"
                  >
                    <span className="text-purple-400 font-bold">{hunterId}</span>
                    {copiedProfileId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
                  </button>
                  <span>•</span>
                  <span className="text-amber-400 font-bold">{loyaltyWallet.level}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Badges */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center min-w-[90px]">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Stamps</div>
                <div className="text-xl sm:text-2xl font-black text-purple-400">{storeHunterStamps.length}</div>
                <div className="text-[9px] text-zinc-500 font-mono">Shops Visited</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center min-w-[90px]">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Perks</div>
                <div className="text-xl sm:text-2xl font-black text-pink-400">{unlockedPerks.length}</div>
                <div className="text-[9px] text-zinc-500 font-mono">Discounts Won</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-center min-w-[90px]">
                <div className="text-[10px] uppercase font-mono text-zinc-400">Account Pts</div>
                <div className="text-xl sm:text-2xl font-black text-amber-400">
                  {loyaltyWallet.userPoints}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono">Redeemable</div>
              </div>
            </div>
          </div>

          {/* Level Progress Bar inside Header */}
          <div className="mt-6 pt-6 border-t border-white/5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-zinc-300 font-bold flex items-center gap-1.5">
                <span>{cardProgression.badgeIcon} Level {cardProgression.currentLevel}: {cardProgression.levelTitle}</span>
              </span>
              <span className="text-purple-400 font-black">
                {cardProgression.currentXp} / {cardProgression.xpForNextLevel} XP ({Math.round(cardProgression.xpProgressPercent)}%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5 p-0.5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-700 shadow-md shadow-purple-500/30"
                style={{ width: `${Math.min(100, Math.max(8, cardProgression.xpProgressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Check-In Alert Toast */}
        {quickCheckInSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{quickCheckInSuccess}</span>
            </div>
            <Link
              href="/rewards"
              className="text-[11px] font-black uppercase text-amber-300 hover:text-amber-200 underline"
            >
              Redeem Rewards ➔
            </Link>
          </div>
        )}

        {redeemSuccessMsg && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold">{redeemSuccessMsg}</span>
            </div>
          </div>
        )}

        {/* Profile Edit Drawer (Collapsible) */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-[#12111a] border border-purple-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" />
                <span>Customize Your Account & Hunter Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="text-xs text-zinc-400 hover:text-white font-mono"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Hunter Display Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Home Town Node</label>
                <select
                  value={profileTown}
                  onChange={(e) => setProfileTown(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Effingham">Effingham, NH</option>
                  <option value="Ossipee">Ossipee, NH</option>
                  <option value="Freedom">Freedom, NH</option>
                  <option value="Wolfeboro">Wolfeboro, NH</option>
                  <option value="Conway">Conway, NH</option>
                  <option value="Tamworth">Tamworth, NH</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Avatar Emoji Icon</label>
                <input
                  type="text"
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 text-center text-lg"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-[10px] font-mono uppercase mb-1">Courier Contact Phone</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
          <button
            onClick={() => setActiveTab('local_stats')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'local_stats'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 text-black shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>📊 Live Local Stats & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('perks')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'perks'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Store Perks & Vouchers ({unlockedPerks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards_vault')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'rewards_vault'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg shadow-amber-400/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Account Rewards Vault ({loyaltyWallet.userPoints} Pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('stamps')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'stamps'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Store Stamp Passport ({storeHunterStamps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pass')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === 'pass'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Digital Smart RFID Pass</span>
          </button>
        </div>

        {/* TAB 0: LIVE LOCAL STATS & TELEMETRY */}
        {activeTab === 'local_stats' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <LocalStatsHUD />
          </div>
        )}

        {/* TAB 1: UNLOCKED PERKS & VOUCHERS WALLET */}
        {activeTab === 'perks' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Search & Counter Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white">
                  Active In-Store Discount Vouchers ({unlockedPerks.length})
                </h3>
                <p className="text-xs text-zinc-400">
                  Show these barcodes or voucher codes at checkout to claim your secret store discounts.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter unlocked deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {filteredPerks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-3xl mx-auto">
                  🛍️
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">No Store Perks Unlocked Yet</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Visit any participating shop in Effingham, Ossipee, Freedom, or Wolfeboro and tap the NFC counter beacon to unlock secret merchant discounts.
                  </p>
                </div>

                {/* Quick Demo Tap Button for Unvisited Spot */}
                {unvisitedSpots.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={() => handleQuickCheckIn(unvisitedSpots[0].circuitId, unvisitedSpots[0].spot)}
                      disabled={isCheckingInSim}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto"
                    >
                      <Radio className={`w-3.5 h-3.5 ${isCheckingInSim ? 'animate-spin' : ''}`} />
                      <span>{isCheckingInSim ? 'Simulating Tap...' : `Simulate 1st Tap at ${unvisitedSpots[0].spot.storeName}`}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPerks.map((perk, idx) => (
                  <div
                    key={`${perk.voucherCode}-${idx}`}
                    className="p-5 rounded-3xl bg-[#0e0d16] border border-purple-500/20 hover:border-purple-500/40 transition-all space-y-4 shadow-xl relative overflow-hidden group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {perk.town}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Stamped {perk.stampedAt ? new Date(perk.stampedAt).toLocaleDateString() : 'Today'}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white">{perk.storeName}</h4>
                      </div>

                      <div className="text-2xl">🎁</div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-sm font-black text-pink-400">{perk.discountLabel}</div>
                      <p className="text-xs text-zinc-400">{perk.discountDescription}</p>
                      {perk.minimumSpend && (
                        <div className="text-[10px] font-mono text-amber-400 pt-0.5">{perk.minimumSpend}</div>
                      )}
                    </div>

                    {/* Voucher Code Box & Quick Copy */}
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                      <div>
                        <div className="text-[9px] uppercase font-mono text-zinc-500">In-Store Voucher Code</div>
                        <div className="font-mono font-black text-sm text-white tracking-wider">{perk.voucherCode}</div>
                      </div>

                      <button
                        onClick={() => handleCopyVoucher(perk.voucherCode)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                      >
                        {copiedVoucherCode === perk.voucherCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Actions: View Store & Courier Order */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <Link
                        href={`/store-hunting`}
                        className="text-zinc-400 hover:text-white font-medium flex items-center gap-1"
                      >
                        <span>View Store Location</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <Link
                        href={`/courier?store=${encodeURIComponent(perk.storeName)}`}
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Order via Courier</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ACCOUNT REWARDS VAULT & TOWN PERKS */}
        {activeTab === 'rewards_vault' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Rewards Balance Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Your Account Point Balance</span>
                </div>
                <div className="text-3xl font-black text-white flex items-baseline gap-2">
                  <span className="text-amber-400 font-mono">{loyaltyWallet.userPoints}</span>
                  <span className="text-xs text-zinc-400 font-normal">Points Available for Redemption</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Earned by tapping NFC check-in beacons, reviewing local merchants, and completing tourist hunts.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/rewards"
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all"
                >
                  Full Catalog Hub ➔
                </Link>
              </div>
            </div>

            {/* Redeemed Vouchers Section */}
            {loyaltyWallet.redeemedRewards.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <span>Your Redeemed Account Rewards ({loyaltyWallet.redeemedRewards.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loyaltyWallet.redeemedRewards.map((item, idx) => (
                    <div
                      key={`${item.code}-${idx}`}
                      className="p-4 rounded-2xl bg-[#0e0d16] border border-emerald-500/30 flex items-center justify-between gap-3 shadow-lg"
                    >
                      <div>
                        <div className="text-xs font-black text-white">{item.rewardTitle}</div>
                        <div className="text-[10px] font-mono text-zinc-500">Redeemed {item.redeemedAt}</div>
                        <div className="text-xs font-mono font-black text-emerald-400 mt-1">{item.code}</div>
                      </div>

                      <button
                        onClick={() => handleCopyVoucher(item.code)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        {copiedVoucherCode === item.code ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedVoucherCode === item.code ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Town Rewards to Redeem */}
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Available Regional Merchant Rewards</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loyaltyRewards.map((reward) => {
                  const canAfford = loyaltyWallet.userPoints >= reward.pointsCost;
                  return (
                    <div
                      key={reward.id}
                      className="p-5 rounded-3xl bg-[#0e0d16] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between gap-4 shadow-xl"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{reward.iconEmoji}</span>
                            <div>
                              <div className="text-[10px] font-mono text-amber-400 uppercase">{reward.businessName} • {reward.town}</div>
                              <h4 className="text-sm font-black text-white">{reward.title}</h4>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-amber-300 text-[10px] font-black font-mono">
                            {reward.valueText}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{reward.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-sm font-black text-amber-400 font-mono">
                          {reward.pointsCost} <span className="text-[10px] text-zinc-500">PTS</span>
                        </span>

                        <button
                          onClick={() => handleRedeemRewardFromProfile(reward.id, reward.title)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-md shadow-amber-400/20 active:scale-95'
                              : 'bg-white/5 text-zinc-600 cursor-not-allowed border border-white/5'
                          }`}
                        >
                          {canAfford ? 'Redeem with Points' : 'Need More Points'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STAMP PASSPORT COLLECTION */}
        {activeTab === 'stamps' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  Your Digital Store Passport ({storeHunterStamps.length} Stamps)
                </h3>
                <p className="text-xs text-zinc-400">
                  Every in-store beacon tap earns +25 to +35 Pts and pushes your ranking towards Milestone Chests.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-mono"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Passport</span>
              </button>
            </div>

            {storeHunterStamps.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="text-4xl">🎫</div>
                <h4 className="text-base font-black text-white">Passport Empty</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Start your trail across Carroll County shops to fill your digital passport with authenticated stamps.
                </p>
                <Link
                  href="/store-hunting"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-wider"
                >
                  <span>Explore Store Trails</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {storeHunterStamps.map((stamp, idx) => (
                  <div
                    key={`${stamp.spotId}-${idx}`}
                    className="p-4 rounded-2xl bg-[#0e0d16] border border-purple-500/20 text-center space-y-2 hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl mx-auto shadow-inner">
                      {stamp.badgeIcon || '🏬'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white truncate">{stamp.storeName}</div>
                      <div className="text-[10px] text-zinc-400 font-mono">{stamp.town}</div>
                    </div>

                    <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span className="text-emerald-400 font-bold">+{stamp.pointsEarned} Pts</span>
                      <span>{stamp.verifiedVia.toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SMART RFID CITIZEN PASS PREVIEW */}
        {activeTab === 'pass' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-w-md mx-auto space-y-4">
              {/* 3D Visual Pass Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
                
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-base">
                      {currentUser?.avatar || '🌲'}
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-purple-400">Townraise Citizen Pass</div>
                      <div className="text-xs font-bold text-white">{currentUser?.town || 'Effingham'} Node</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span className="text-[9px] font-mono">13.56 MHz</span>
                  </div>
                </div>

                <div className="space-y-1 text-center py-2">
                  <div className="text-xl font-black text-white tracking-wider">{currentUser?.name || 'Local Store Hunter'}</div>
                  <div className="text-xs font-mono text-purple-300 uppercase tracking-widest">{cardProgression.levelTitle}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{hunterId}</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Multiplier</div>
                    <div className="text-amber-400 font-bold">{cardProgression.multiplier}x XP</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Points</div>
                    <div className="text-white font-bold">{loyaltyWallet.userPoints} Pts</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">Status</div>
                    <div className="text-emerald-400 font-bold">Verified</div>
                  </div>
                </div>

                <div className="text-[9px] font-mono text-zinc-600 text-center uppercase tracking-widest">
                  Encrypted Carroll County Merchant Circuit Pass
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyHunterId}
                  className="flex-1 py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedProfileId ? 'Copied ID!' : 'Copy Pass ID'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-xs uppercase tracking-wider transition-opacity hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
