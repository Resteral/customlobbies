'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { TouristHunt, HuntCheckpoint } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Radio, 
  Award, 
  CheckCircle2, 
  Clock, 
  Gift, 
  HelpCircle, 
  Share2, 
  Camera, 
  Navigation, 
  Layers, 
  Tag, 
  ChevronRight, 
  ExternalLink,
  QrCode,
  ShieldCheck,
  Search,
  BookOpen,
  Trophy,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function TouristHuntsPage() {
  const { 
    touristHunts, 
    passportStamps, 
    checkInCheckpoint, 
    activeTown, 
    loyaltyWallet,
    playDeliveryChime,
    currentUser
  } = useNfcStore();

  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeHuntId, setActiveHuntId] = useState<string | null>(touristHunts[0]?.id || null);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<HuntCheckpoint | null>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkInSuccessData, setCheckInSuccessData] = useState<{ message: string; points: number; isCompleted: boolean } | null>(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const towns = ['all', 'Ossipee', 'Effingham & Freedom', 'Wolfeboro', 'Conway', 'Tamworth'];

  const filteredHunts = useMemo(() => {
    return touristHunts.filter(hunt => {
      const matchesTown = selectedTown === 'all' || hunt.town.toLowerCase().includes(selectedTown.toLowerCase()) || (selectedTown === 'Effingham & Freedom' && (hunt.town.includes('Effingham') || hunt.town.includes('Freedom')));
      const matchesSearch = searchQuery === '' || 
        hunt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        hunt.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hunt.checkpoints.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || hunt.checkpoints.some(c => c.category === selectedCategory);
      return matchesTown && matchesSearch && matchesCategory;
    });
  }, [touristHunts, selectedTown, searchQuery, selectedCategory]);

  const activeHunt = touristHunts.find(h => h.id === activeHuntId) || filteredHunts[0] || touristHunts[0];

  const stampedCheckpointIds = useMemo(() => {
    return new Set(passportStamps.map(s => s.checkpointId));
  }, [passportStamps]);

  const totalPointsEarnedFromHunts = useMemo(() => {
    return passportStamps.reduce((acc, s) => acc + s.pointsEarned, 0);
  }, [passportStamps]);

  const handleVerifyCheckIn = (checkpoint: HuntCheckpoint, huntId: string, method: 'nfc' | 'qr' | 'gps_simulator' = 'nfc') => {
    setIsCheckingIn(true);
    setTimeout(() => {
      const result = checkInCheckpoint(huntId, checkpoint.id, method);
      setIsCheckingIn(false);
      
      if (result.success) {
        setCheckInSuccessData({
          message: result.message,
          points: result.pointsEarned || 25,
          isCompleted: !!result.isCompleted
        });
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        alert(result.message);
      }
    }, 600);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'historic': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'scenic': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'bridge': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'food_drink': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'artisan': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 selection:bg-amber-500 selection:text-black">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5 animate-spin text-amber-400" style={{ animationDuration: '12s' }} />
            Carroll County Tourist Hunts & Attraction Quests
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 uppercase">
            Discover <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Landmarks</span>, Tap & Win
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            Embark on curated scavenger trails across Effingham, Ossipee, Freedom, Wolfeboro, Conway, and Tamworth. Tap NFC landmark checkpoints with your phone to collect digital passport stamps, earn loyalty points, and unlock VIP merchant vouchers.
          </p>
        </div>

        {/* Stats & Passport Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold">
              🗺️
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Active Quests</p>
              <p className="text-2xl font-black text-white">{touristHunts.length} Regional Trails</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xl font-bold">
              📍
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Checkpoints</p>
              <p className="text-2xl font-black text-white">
                {touristHunts.reduce((acc, h) => acc + h.checkpoints.length, 0)} Landmarks
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
              🪙
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Points Earned</p>
              <p className="text-2xl font-black text-emerald-400">+{totalPointsEarnedFromHunts} Pts</p>
            </div>
          </div>

          <div 
            onClick={() => setIsPassportOpen(true)}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-xl flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center text-xl font-black shadow-lg shadow-amber-500/30">
                📖
              </div>
              <div>
                <p className="text-xs text-amber-300 uppercase font-bold tracking-wider">Explorer Passport</p>
                <p className="text-lg font-black text-white">{passportStamps.length} Stamps Collected</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Sovereign Society & Treasure Vault Banner Callout */}
        <div className="mb-10 p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-purple-500/15 to-rose-500/15 border border-amber-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl shadow-amber-500/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-400/20 shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Sovereign Society Exclusive
                </span>
                <span className="text-[10px] font-mono text-white/50">4 Unlocked Milestone Vaults</span>
              </div>
              <h3 className="text-base font-black text-white mt-0.5">
                Every Landmark Tap Feeds Into Your Townraise Society Vault & Physical Perks
              </h3>
              <p className="text-xs text-white/60">
                Unlock custom engraved NFC keychains hand-delivered by Sean Martin, up to $100 in regional merchant credits, and collaborative bounties.
              </p>
            </div>
          </div>
          <Link
            href="/society"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <span>Open Vault & Society</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] p-3 rounded-2xl border border-white/5">
          {/* Town Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {towns.map((town) => (
              <button
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedTown === town
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {town === 'all' ? 'All Towns' : town}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search landmarks, trails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        {/* Main 2-Column Grid: Left Hunts List, Right Active Hunt Detail & Checkpoints */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Hunt Trail Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              Available Scavenger Quests ({filteredHunts.length})
            </h2>

            {filteredHunts.map((hunt) => {
              const huntCheckpoints = hunt.checkpoints.map(c => c.id);
              const stampedCount = hunt.checkpoints.filter(c => stampedCheckpointIds.has(c.id)).length;
              const isCompleted = stampedCount === hunt.checkpoints.length && hunt.checkpoints.length > 0;
              const isSelected = hunt.id === activeHunt?.id;

              return (
                <div
                  key={hunt.id}
                  onClick={() => setActiveHuntId(hunt.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white/[0.07] border-amber-500/50 shadow-xl shadow-amber-500/10 scale-[1.01]'
                      : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {hunt.town}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-white/60">
                        ⏱️ {hunt.estimatedDuration}
                      </span>
                      {isCompleted ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Complete
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">
                          {stampedCount}/{hunt.checkpoints.length} Found
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-white/10 relative overflow-hidden" style={{ backgroundImage: `url(${hunt.coverImage})` }}>
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        {hunt.badgeIcon}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                        {hunt.title}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {hunt.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${(stampedCount / hunt.checkpoints.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-amber-400">
                      +{hunt.totalPoints} Pts Total
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Flash your own NFC Landmark tags CTA */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-black border border-indigo-500/20 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">
                Program Landmark NFC Checkpoint Stickers
              </h4>
              <p className="text-xs text-white/60">
                Are you a local shop owner, historian, or trail steward? Use our continuous NFC flasher to write physical checkpoint tags for your attraction.
              </p>
              <Link 
                href="/custom-nfc"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
              >
                Open NFC Tag Flasher
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Selected Hunt Interactive Trail View */}
          {activeHunt && (
            <div className="lg:col-span-7 space-y-6">
              
              {/* Hunt Banner Header */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent border border-white/15 relative overflow-hidden backdrop-blur-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30">
                      {activeHunt.badgeIcon}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                        {activeHunt.region} • {activeHunt.theme}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white">
                        {activeHunt.title}
                      </h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPassportOpen(true)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      View Passport
                    </button>
                  </div>
                </div>

                <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-6">
                  {activeHunt.description}
                </p>

                {/* Reward Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black text-lg">
                      🎁
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Completion Bonus Reward</p>
                      <p className="text-xs font-black text-white">{activeHunt.bonusVoucherTitle}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-500 text-black text-xs font-black rounded-lg uppercase tracking-wider">
                    {activeHunt.bonusVoucherDiscount}
                  </span>
                </div>
              </div>

              {/* Checkpoints Sequence */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Trail Checkpoints ({activeHunt.checkpoints.length} Total)
                  </h3>
                  <span className="text-xs text-white/50">
                    Tap physical NFC sticker or verify on-site
                  </span>
                </div>

                {activeHunt.checkpoints.map((checkpoint, idx) => {
                  const isStamped = stampedCheckpointIds.has(checkpoint.id);

                  return (
                    <div
                      key={checkpoint.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isStamped 
                          ? 'bg-emerald-950/15 border-emerald-500/40' 
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isStamped 
                              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' 
                              : 'bg-white/10 text-white/80'
                          }`}>
                            {isStamped ? '✓' : idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm md:text-base font-black text-white">
                                {checkpoint.name}
                              </h4>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(checkpoint.category)}`}>
                                {checkpoint.category.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                              <Navigation className="w-3 h-3 text-amber-400" />
                              {checkpoint.address}
                            </p>
                          </div>
                        </div>

                        {/* Check In Action Button */}
                        <div>
                          {isStamped ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Stamped (+{checkpoint.pointsReward} Pts)
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedCheckpoint(checkpoint);
                                setIsCheckInModalOpen(true);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                            >
                              <Radio className="w-3.5 h-3.5 animate-pulse" />
                              Tap / Check In
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Clue and Historical Note Box */}
                      <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
                        <div className="p-3 rounded-xl bg-amber-500/[0.05] border border-amber-500/10 text-xs text-amber-200/90 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-400">Scavenger Clue: </span>
                            {checkpoint.clue}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/60 flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-white/80">Heritage Lore: </span>
                            {checkpoint.historicalNote}
                          </div>
                        </div>

                        {checkpoint.sponsorOffer && (
                          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold">
                              <Gift className="w-3.5 h-3.5 text-purple-400" />
                              Perk: {checkpoint.sponsorOffer}
                            </span>
                            <span className="text-[10px] uppercase font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                              {checkpoint.sponsorName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Check-In Modal with Interactive NFC Simulator & QR Verification */}
        {isCheckInModalOpen && selectedCheckpoint && activeHunt && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-md w-full p-6 text-white space-y-6 shadow-2xl relative">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-3xl">
                  {activeHunt.badgeIcon}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Verify Landmark Check-In
                </h3>
                <p className="text-xs text-white/60">
                  {selectedCheckpoint.name} ({selectedCheckpoint.town})
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <p className="text-white/80">
                  <strong className="text-amber-400">NFC Landmark Tag:</strong> {selectedCheckpoint.nfcTagId}
                </p>
                <p className="text-white/80">
                  <strong className="text-amber-400">Reward:</strong> +{selectedCheckpoint.pointsReward} Loyalty Points
                </p>
                <p className="text-white/60 italic">
                  "{selectedCheckpoint.clue}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  disabled={isCheckingIn}
                  onClick={() => handleVerifyCheckIn(selectedCheckpoint, activeHunt.id, 'nfc')}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  {isCheckingIn ? 'Verifying NFC Antenna...' : '1-Tap Verify On-Site NFC / GPS'}
                </button>

                <button
                  onClick={() => {
                    handleVerifyCheckIn(selectedCheckpoint, activeHunt.id, 'qr');
                  }}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  Scan Checkpoint QR Code
                </button>

                <button
                  onClick={() => {
                    setIsCheckInModalOpen(false);
                    setSelectedCheckpoint(null);
                  }}
                  className="w-full py-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Congratulations Dialog */}
        {checkInSuccessData && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-amber-500/50 rounded-3xl max-w-md w-full p-8 text-center space-y-5 shadow-2xl relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black flex items-center justify-center mx-auto text-4xl shadow-xl shadow-amber-500/40 animate-bounce">
                🎉
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Passport Stamp Unlocked!
                </span>
                <h3 className="text-2xl font-black text-white">
                  Landmark Verified!
                </h3>
                <p className="text-xs text-white/70">
                  {checkInSuccessData.message}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs text-amber-300 font-bold">Total Wallet Balance</p>
                <p className="text-2xl font-black text-white">{loyaltyWallet.userPoints} Points</p>
                <p className="text-[10px] text-white/50 mt-1">(\${(loyaltyWallet.userPoints * 0.10).toFixed(2)} value at local Carroll County stores)</p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setCheckInSuccessData(null);
                    setIsCheckInModalOpen(false);
                    setSelectedCheckpoint(null);
                    setIsPassportOpen(true);
                  }}
                  className="w-full py-3 bg-amber-500 text-black text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/30"
                >
                  Open Explorer Passport
                </button>
                <button
                  onClick={() => {
                    setCheckInSuccessData(null);
                    setIsCheckInModalOpen(false);
                    setSelectedCheckpoint(null);
                  }}
                  className="w-full py-2 text-xs text-white/50 hover:text-white"
                >
                  Continue Trail
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Digital Explorer Passport Modal */}
        {isPassportOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-2xl w-full p-6 md:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              {/* Passport Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
                    📖
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight text-white">
                      Carroll County Explorer Passport
                    </h3>
                    <p className="text-xs text-white/50">
                      Explorer: {currentUser?.name || 'Local Pioneer'} • {passportStamps.length} Verified Stamps
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

              {/* Passport Stamps Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-white/40">
                  Collected Ink Stamps
                </h4>

                {passportStamps.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-white/40 text-xs">
                    No stamps collected yet. Pick a scavenger trail and tap your first landmark!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {passportStamps.map((stamp, i) => (
                      <div 
                        key={i}
                        className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-transparent border border-amber-500/30 flex items-center gap-3 relative overflow-hidden"
                      >
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
                          {stamp.badgeIcon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-white truncate">
                            {stamp.checkpointName}
                          </p>
                          <p className="text-[10px] text-amber-400 font-bold mt-0.5">
                            📍 {stamp.town} • +{stamp.pointsEarned} Pts
                          </p>
                          <p className="text-[9px] text-white/40 mt-1">
                            Verified via {stamp.verifiedVia.toUpperCase()} • {new Date(stamp.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rewards Wallet Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40">Spendable Reward Balance</p>
                  <p className="text-xl font-black text-amber-400">{loyaltyWallet.userPoints} Points</p>
                </div>
                <Link
                  href="/rewards"
                  onClick={() => setIsPassportOpen(false)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                >
                  Spend in Rewards Wallet
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
