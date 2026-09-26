'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { StoreHuntCircuit, StoreHuntSpot, StoreMysteryPerk } from '@/lib/types';
import { calculateCardProgression } from '@/lib/card-leveling';
import NfcCardLevelWidget from '@/components/NfcCardLevelWidget';
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
  Plus, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  ExternalLink,
  Flame,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function StoreHuntingPage() {
  const { 
    storeHuntCircuits, 
    storeHunterStamps, 
    passportStamps,
    tapInStoreBeacon, 
    enrollMerchantInStoreHunt, 
    loyaltyWallet, 
    currentUser,
    playDeliveryChime 
  } = useNfcStore();

  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [selectedCircuitId, setSelectedCircuitId] = useState<string>(storeHuntCircuits[0]?.id || 'circuit-antiques-thrift');
  const [selectedSpot, setSelectedSpot] = useState<StoreHuntSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTappingBeacon, setIsTappingBeacon] = useState(false);
  const [unlockedPerkData, setUnlockedPerkData] = useState<{ spot: StoreHuntSpot; perk: StoreMysteryPerk; points: number; isCompleted: boolean; isRepeat: boolean } | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  // New Merchant Enrollment Form State
  const [enrollForm, setEnrollForm] = useState({
    storeName: '',
    town: 'Effingham',
    category: 'farmstand' as any,
    categoryLabel: 'Farmstand & Bakery',
    address: '',
    phone: currentUser?.phone || '(603) 539-1234',
    hours: 'Daily: 9:00 AM - 5:00 PM',
    tagline: '',
    description: '',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    ownerName: currentUser?.name || 'Local Shop Owner',
    discountLabel: '15% Off Your Entire In-Store Purchase',
    discountDescription: 'Tap phone at register to redeem instant 15% discount.',
    voucherCode: `OASIS-HUNT-${Math.floor(1000 + Math.random() * 9000)}`,
    minimumSpend: '$15 minimum purchase',
    expiresInDays: 30,
    isCourierAvailable: true,
    courierLeadTime: '30 mins (Sean Martin 4x4)'
  });

  const towns = ['all', 'Effingham', 'Ossipee', 'Freedom', 'Wolfeboro', 'Conway', 'Tamworth'];

  const activeCircuit = storeHuntCircuits.find(c => c.id === selectedCircuitId) || storeHuntCircuits[0];

  const stampedSpotIds = useMemo(() => {
    return new Set(storeHunterStamps.map(s => s.spotId));
  }, [storeHunterStamps]);

  const totalPointsEarnedFromStores = useMemo(() => {
    return storeHunterStamps.reduce((acc, s) => acc + s.pointsEarned, 0);
  }, [storeHunterStamps]);

  const filteredSpots = useMemo(() => {
    if (!activeCircuit) return [];
    return activeCircuit.spots.filter(spot => {
      const matchesTown = selectedTown === 'all' || spot.town.toLowerCase() === selectedTown.toLowerCase();
      const matchesSearch = searchQuery === '' || 
        spot.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        spot.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.mysteryPerk.discountLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTown && matchesSearch;
    });
  }, [activeCircuit, selectedTown, searchQuery]);

  const handleTapBeacon = (spot: StoreHuntSpot, method: 'nfc' | 'qr' | 'in_store_sim' = 'nfc') => {
    setIsTappingBeacon(true);
    setTimeout(() => {
      const result = tapInStoreBeacon(activeCircuit.id, spot.id, method);
      setIsTappingBeacon(false);

      if (result.success) {
        setUnlockedPerkData({
          spot,
          perk: result.perk || spot.mysteryPerk,
          points: result.pointsEarned || 0,
          isCompleted: !!result.isCompleted,
          isRepeat: !!result.alreadyStamped
        });

        confetti({
          particleCount: 130,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    }, 600);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollForm.storeName || !enrollForm.address) {
      alert('Please fill in your store name and address.');
      return;
    }

    enrollMerchantInStoreHunt(activeCircuit.id, {
      storeName: enrollForm.storeName,
      town: enrollForm.town,
      category: enrollForm.category,
      categoryLabel: enrollForm.categoryLabel,
      address: enrollForm.address,
      phone: enrollForm.phone,
      hours: enrollForm.hours,
      tagline: enrollForm.tagline || 'Local artisan and specialty shop.',
      description: enrollForm.description || 'Proud participant in the Carroll County Store Hunting network.',
      coverImage: enrollForm.coverImage,
      ownerName: enrollForm.ownerName,
      isCourierAvailable: enrollForm.isCourierAvailable,
      courierLeadTime: enrollForm.courierLeadTime,
      mysteryPerk: {
        discountLabel: enrollForm.discountLabel,
        discountDescription: enrollForm.discountDescription,
        voucherCode: enrollForm.voucherCode,
        minimumSpend: enrollForm.minimumSpend,
        expiresInDays: enrollForm.expiresInDays
      }
    });

    setIsEnrollModalOpen(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5 }
    });
    alert(`🎉 Congratulations! ${enrollForm.storeName} has been enrolled in the Store Hunt network. Your NFC checkpoint beacon is active!`);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 selection:bg-amber-500 selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            Carroll County Store Hunting & Boutique Treasure Trails
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 uppercase">
            Hunt <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Local Stores</span>, Tap & Win
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6">
            Discover historic antique barns, farmstands, stone-oven bakeries, timber workshops, and country mercantiles across Effingham, Ossipee, Freedom, Wolfeboro, Conway, and Tamworth. Tap in-store NFC counter beacons to reveal secret discounts, claim points, and support local merchants!
          </p>

          {/* User's Own Hunter Profile Link Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 p-2.5 px-4 rounded-2xl bg-white/[0.04] border border-purple-500/30 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-lg">{currentUser?.avatar || '🌲'}</span>
              <span className="font-bold text-white">{currentUser?.name || 'Local Store Hunter'}</span>
              <span className="text-purple-400 font-mono text-[11px]">({storeHunterStamps.length} Stamps • {storeHunterStamps.length} Perks)</span>
            </div>
            <Link
              href="/hunter-profile"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-[11px] uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-purple-500/20"
            >
              <span>👤 Open My Profile & Perks</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Stats Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
              🏬
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Store Trails</p>
              <p className="text-2xl font-black text-white">{storeHuntCircuits.length} Curated Circuits</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xl font-bold">
              🛍️
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Boutiques & Barns</p>
              <p className="text-2xl font-black text-white">
                {storeHuntCircuits.reduce((acc, c) => acc + c.spots.length, 0)} Local Stores
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
              🪙
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Hunter Points</p>
              <p className="text-2xl font-black text-emerald-400">+{totalPointsEarnedFromStores} Pts</p>
            </div>
          </div>

          <div 
            onClick={() => setIsPassportOpen(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center text-xl font-black shadow-lg shadow-amber-500/30">
                🎫
              </div>
              <div>
                <p className="text-xs text-amber-300 uppercase font-bold tracking-wider">Store Passport</p>
                <p className="text-lg font-black text-white">{storeHunterStamps.length} Stamps & Deals</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card Leveling & Store Streak Widget */}
        <div className="mb-8">
          <NfcCardLevelWidget progression={cardProgression} />
        </div>

        {/* Sovereign Society & Milestone Treasure Vault Banner */}
        <div className="mb-10 p-5 rounded-3xl bg-gradient-to-r from-purple-500/15 via-amber-500/15 to-rose-500/15 border border-purple-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-purple-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-400/20 shrink-0">
              💎
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-400/20 text-purple-300 border border-purple-400/30">
                  Townraise Society Vault
                </span>
                <span className="text-[10px] font-mono text-white/50">Store Stamps Count Towards Milestone Chests</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Redeem Tangible Rewards & Custom Physical NFC Keychains Hand-Delivered by Sean Martin
              </h3>
              <p className="text-xs text-white/60">
                Level up your Citizen Smart RFID pass, solve cryptographic riddles for instant discounts, and complete community tap bounties.
              </p>
            </div>
          </div>
          <Link
            href="/society"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
          >
            <span>Enter Sovereign Society</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Circuit Category Pills (Antiques, Farmstands, Woodcraft, Sweets, Mercantiles) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {storeHuntCircuits.map((circuit) => {
            const isSelected = circuit.id === selectedCircuitId;
            const stampedCount = circuit.spots.filter(s => stampedSpotIds.has(s.id)).length;
            const isCompleted = stampedCount === circuit.spots.length && circuit.spots.length > 0;

            return (
              <button
                key={circuit.id}
                onClick={() => setSelectedCircuitId(circuit.id)}
                className={`px-4 py-3 rounded-2xl border transition-all flex items-center gap-2.5 whitespace-nowrap text-xs font-bold uppercase tracking-wider ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 font-black scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{circuit.badgeIcon}</span>
                <span>{circuit.categoryLabel}</span>
                {isCompleted ? (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black">
                    ✓ Done
                  </span>
                ) : stampedCount > 0 ? (
                  <span className="px-1.5 py-0.5 rounded bg-black/30 text-amber-300 text-[9px] font-mono">
                    {stampedCount}/{circuit.spots.length}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar & Town Pills */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {towns.map((town) => (
              <button
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedTown === town
                    ? 'bg-white/20 text-white border border-white/30 font-black'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
              >
                {town === 'all' ? 'All Towns' : town}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shops, deals, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Enroll Storefront CTA Button */}
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Enroll Store
            </button>
          </div>
        </div>

        {/* Active Circuit Overview Banner */}
        {activeCircuit && (
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent border border-white/15 relative overflow-hidden backdrop-blur-2xl mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
                  {activeCircuit.badgeIcon}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                    {activeCircuit.region} • {activeCircuit.theme}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-white">
                    {activeCircuit.title}
                  </h2>
                </div>
              </div>

              {/* Circuit Reward Badge */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center gap-3">
                <Gift className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-[9px] uppercase font-bold text-amber-300 tracking-wider">Trail Bonus Reward</p>
                  <p className="text-xs font-black text-white">{activeCircuit.circuitBonusReward}</p>
                </div>
              </div>
            </div>

            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              {activeCircuit.description}
            </p>
          </div>
        )}

        {/* Store Spots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredSpots.map((spot) => {
            const isStamped = stampedSpotIds.has(spot.id);

            return (
              <div
                key={spot.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                  isStamped 
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-xl shadow-emerald-500/10' 
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                }`}
              >
                {/* Top Row: Town & Category Badges */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {spot.town}, NH
                    </span>

                    {isStamped ? (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Visited & Claimed
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        +{spot.pointsReward} Pts
                      </span>
                    )}
                  </div>

                  {/* Store Thumbnail & Title */}
                  <div className="flex gap-4 items-start mb-4">
                    <div 
                      className="w-20 h-20 rounded-2xl bg-cover bg-center flex-shrink-0 border border-white/10 relative overflow-hidden" 
                      style={{ backgroundImage: `url(${spot.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors truncate">
                        {spot.storeName}
                      </h3>
                      <p className="text-[11px] text-amber-300 font-medium line-clamp-1 mt-0.5">
                        {spot.tagline}
                      </p>
                      <p className="text-[10px] text-white/50 flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-white/40" />
                        {spot.hours}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                    {spot.description}
                  </p>

                  {/* Mystery Perk Teaser Box */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/20 mb-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1">
                        <Gift className="w-3.5 h-3.5" />
                        In-Store Mystery Perk:
                      </span>
                      {isStamped && (
                        <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {spot.mysteryPerk.voucherCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-black text-white">
                      {isStamped ? spot.mysteryPerk.discountLabel : '🔒 Tap In-Store NFC Beacon to Reveal Secret Promo'}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {spot.mysteryPerk.minimumSpend || 'No minimum spend'}
                    </p>
                  </div>

                  {/* Courier & Contact Info */}
                  <div className="flex items-center justify-between text-[11px] text-white/50 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1 text-white/70">
                      <Phone className="w-3 h-3 text-amber-400" />
                      {spot.phone}
                    </span>
                    {spot.isCourierAvailable && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                        <Truck className="w-3 h-3" />
                        4x4 Delivery Ready
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-5">
                  <button
                    onClick={() => {
                      setSelectedSpot(spot);
                      handleTapBeacon(spot, 'nfc');
                    }}
                    className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                      isStamped
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black shadow-amber-500/20 hover:scale-[1.02]'
                    }`}
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    {isStamped ? 'View Unlocked Mystery Voucher' : '1-Tap In-Store Beacon (Reveal Deal)'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mystery Box Reveal Congratulations Dialog */}
        {unlockedPerkData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-amber-500/60 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-400 text-black flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-amber-500/40 animate-bounce">
                🎁
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  {unlockedPerkData.isRepeat ? 'Welcome Back Explorer!' : 'In-Store Mystery Perk Unlocked!'}
                </span>
                <h3 className="text-2xl font-black text-white">
                  {unlockedPerkData.spot.storeName}
                </h3>
                <p className="text-xs text-white/70">
                  {unlockedPerkData.spot.address}
                </p>
              </div>

              {/* Unlocked Voucher Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/40 space-y-3 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Your Exclusive In-Store Perk</span>
                  <p className="text-base font-black text-white">{unlockedPerkData.perk.discountLabel}</p>
                  <p className="text-xs text-white/60 mt-1">{unlockedPerkData.perk.discountDescription}</p>
                </div>

                {/* Promo Code Box */}
                <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-white/40 block">Cashier Promo Code:</span>
                    <span className="text-sm font-black font-mono text-amber-400 tracking-widest">
                      {unlockedPerkData.perk.voucherCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(unlockedPerkData.perk.voucherCode)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="text-[10px] text-white/40 text-center pt-1">
                  Valid for {unlockedPerkData.perk.expiresInDays} days • {unlockedPerkData.perk.minimumSpend || 'No minimum spend'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setUnlockedPerkData(null);
                    setIsPassportOpen(true);
                  }}
                  className="w-full py-3 bg-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30"
                >
                  View in Store Hunter Passport
                </button>
                <button
                  onClick={() => setUnlockedPerkData(null)}
                  className="w-full py-2 text-xs text-white/50 hover:text-white"
                >
                  Continue Store Hunting
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digital Store Hunter Passport Modal */}
        {isPassportOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-2xl w-full p-6 md:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
                    🎫
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">
                      Carroll County Store Hunter Passport
                    </h3>
                    <p className="text-xs text-white/50">
                      Shopper: {currentUser?.name || 'Local Pioneer'} • {storeHunterStamps.length} In-Store Stamps & Mystery Vouchers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPassportOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Stamps Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/40">
                  Unlocked Store Vouchers & Stamps
                </h4>

                {storeHunterStamps.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-white/40 text-xs">
                    No store vouchers unlocked yet. Tap in-store NFC beacons across Carroll County to claim your first discount!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {storeHunterStamps.map((stamp, i) => (
                      <div 
                        key={i}
                        className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/30 flex flex-col justify-between gap-3 relative overflow-hidden"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl flex-shrink-0">
                            {stamp.badgeIcon}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black text-white truncate">
                              {stamp.storeName}
                            </p>
                            <p className="text-[10px] text-amber-400 font-bold">
                              📍 {stamp.town} • +{stamp.pointsEarned} Pts
                            </p>
                          </div>
                        </div>

                        <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                          <p className="text-[11px] font-black text-white">
                            {stamp.unlockedPerk.discountLabel}
                          </p>
                          <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
                            <span className="text-[10px] font-mono text-amber-400 font-bold">
                              {stamp.unlockedPerk.voucherCode}
                            </span>
                            <span className="text-[9px] text-white/40">
                              {new Date(stamp.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wallet Footer */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40">Spendable Wallet Balance</p>
                  <p className="text-xl font-black text-amber-400">{loyaltyWallet.userPoints} Points</p>
                </div>
                <Link
                  href="/rewards"
                  onClick={() => setIsPassportOpen(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                >
                  Spend Points
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Enroll Storefront in Store Hunt Modal */}
        {isEnrollModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-xl w-full p-6 md:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xl font-bold">
                    🏬
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">
                      Enroll Storefront in Store Hunt
                    </h3>
                    <p className="text-xs text-white/50">
                      Attract foot traffic & reward shoppers with in-store NFC treasure taps.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 font-bold uppercase text-[10px]">Store Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ossipee Mountain Pottery"
                      value={enrollForm.storeName}
                      onChange={(e) => setEnrollForm({ ...enrollForm, storeName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/60 font-bold uppercase text-[10px]">Town Municipality *</label>
                    <select
                      value={enrollForm.town}
                      onChange={(e) => setEnrollForm({ ...enrollForm, town: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#15151f] border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Effingham">Effingham, NH</option>
                      <option value="Ossipee">Ossipee, NH</option>
                      <option value="Freedom">Freedom, NH</option>
                      <option value="Wolfeboro">Wolfeboro, NH</option>
                      <option value="Conway">Conway, NH</option>
                      <option value="Tamworth">Tamworth, NH</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/60 font-bold uppercase text-[10px]">Physical Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 14 Main St"
                      value={enrollForm.address}
                      onChange={(e) => setEnrollForm({ ...enrollForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/60 font-bold uppercase text-[10px]">Store Phone Number</label>
                    <input
                      type="text"
                      placeholder="(603) 539-1234"
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/60 font-bold uppercase text-[10px]">Short Tagline</label>
                  <input
                    type="text"
                    placeholder="Handcrafted stoneware pottery and decorative ceramic tiles."
                    value={enrollForm.tagline}
                    onChange={(e) => setEnrollForm({ ...enrollForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Mystery Deal Config */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" />
                    Configure Your In-Store Mystery Deal
                  </h4>

                  <div className="space-y-1">
                    <label className="text-white/60 font-bold uppercase text-[10px]">Mystery Discount Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15% Off Any Handmade Mug or Bowl"
                      value={enrollForm.discountLabel}
                      onChange={(e) => setEnrollForm({ ...enrollForm, discountLabel: e.target.value })}
                      className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-white/60 font-bold uppercase text-[10px]">Custom Promo Code</label>
                      <input
                        type="text"
                        value={enrollForm.voucherCode}
                        onChange={(e) => setEnrollForm({ ...enrollForm, voucherCode: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-white/60 font-bold uppercase text-[10px]">Minimum Spend Rule</label>
                      <input
                        type="text"
                        value={enrollForm.minimumSpend}
                        onChange={(e) => setEnrollForm({ ...enrollForm, minimumSpend: e.target.value })}
                        className="w-full px-3.5 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsEnrollModalOpen(false)}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30"
                  >
                    Activate Store Beacon & Join Trail
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
