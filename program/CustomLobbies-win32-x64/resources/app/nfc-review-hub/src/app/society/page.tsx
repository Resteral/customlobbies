'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  INITIAL_TREASURE_MILESTONES, 
  INITIAL_SOCIETY_BOUNTIES, 
  INITIAL_CIPHER_RIDDLES, 
  PRESET_SOCIETY_MEMBERS 
} from '@/lib/society-data';
import { calculateCardProgression } from '@/lib/card-leveling';
import confetti from 'canvas-confetti';
import { 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Gift, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  MapPin, 
  Radio, 
  Key, 
  Users, 
  Trophy, 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  Download, 
  Search,
  Star,
  Zap,
  Flame,
  QrCode,
  HelpCircle,
  X
} from 'lucide-react';

export default function SocietyTreasureHuntPage() {
  const { 
    storeHunterStamps, 
    passportStamps, 
    currentUser, 
    userMembership, 
    activeTown,
    playDeliveryChime 
  } = useNfcStore();

  // Combined Total Checkpoints Explored
  const totalTaps = (storeHunterStamps?.length || 0) + (passportStamps?.length || 0);

  // Card Progression
  const progression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps || [], passportStamps || []);
  }, [storeHunterStamps, passportStamps]);

  // Milestone claim states
  const [claimedMilestones, setClaimedMilestones] = useState<string[]>([]);
  const [activeRewardModal, setActiveRewardModal] = useState<any | null>(null);

  // Cipher Riddle Solver states
  const [riddleSolutions, setRiddleSolutions] = useState<{ [key: string]: string }>({});
  const [solvedRiddles, setSolvedRiddles] = useState<string[]>([]);
  const [riddleError, setRiddleError] = useState<{ [key: string]: string }>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tab filter
  const [activeTab, setActiveTab] = useState<'vault' | 'pass' | 'ciphers' | 'bounties' | 'leaderboard'>('vault');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaimMilestone = (milestone: any) => {
    if (totalTaps < milestone.requiredCheckpoints) return;
    if (claimedMilestones.includes(milestone.id)) {
      setActiveRewardModal(milestone);
      return;
    }

    setClaimedMilestones(prev => [...prev, milestone.id]);
    setActiveRewardModal(milestone);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
    playDeliveryChime();
    showToast(`🎉 Claimed "${milestone.title}" Reward!`);
  };

  const handleSolveRiddle = (riddle: any) => {
    const entered = (riddleSolutions[riddle.id] || '').trim().toUpperCase();
    if (!entered) return;

    if (entered === riddle.solutionPasscode.toUpperCase()) {
      setSolvedRiddles(prev => [...prev, riddle.id]);
      setRiddleError(prev => ({ ...prev, [riddle.id]: '' }));
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.75 } });
      playDeliveryChime();
      showToast(`🧩 Cipher Decoded: +${riddle.xpReward} Society XP & Reward Unlocked!`);
    } else {
      setRiddleError(prev => ({
        ...prev,
        [riddle.id]: 'Incorrect passcode. Inspect the clue or visit the landmark in person!'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl shadow-amber-400/30 animate-in fade-in slide-in-from-bottom-5">
            <Sparkles className="w-4 h-4 text-black" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header & Hero */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#121220] to-[#0a0a14] border border-amber-400/30 overflow-hidden shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>The Sovereign Order of Carroll County</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl font-black italic tracking-tight uppercase text-white">
                The Townraise Society & Treasure Vault
              </h1>
              
              <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
                An alliance of local explorers, master artisans, roadside kitchens, and cryptographers. Tap physical NFC beacons across Effingham, Ossipee, Freedom, and Conway to solve riddles, unlock local bounties, and climb the Society Ranks.
              </p>
            </div>

            {/* User Level & Passport Quick Widget */}
            <div className="p-6 rounded-3xl bg-black/60 border border-amber-400/40 space-y-4 shrink-0 w-full lg:w-80 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Society Passport</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                  {progression.levelTitle}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-4xl">{progression.badgeIcon}</span>
                <div>
                  <div className="text-xl font-black text-white">Level {progression.currentLevel}</div>
                  <div className="text-xs text-zinc-400">{progression.currentXp} Society XP</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{totalTaps} Checkpoints Tapped</span>
                  <span className="text-amber-400">{progression.xpProgressPercent}% to Lvl {progression.currentLevel + 1}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, progression.xpProgressPercent)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <Link href="/tourist-hunts" className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1">
                  <span>Scenic Trails</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
                <Link href="/store-hunting" className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
                  <span>Store Crawl</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Hub Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-white/10 scrollbar-thin">
            {[
              { id: 'vault', label: '🏆 Treasure Milestone Vaults', count: INITIAL_TREASURE_MILESTONES.length },
              { id: 'pass', label: '📇 Your Smart Society Pass', count: undefined },
              { id: 'ciphers', label: '🧩 Cryptic Riddles & Ciphers', count: INITIAL_CIPHER_RIDDLES.length },
              { id: 'bounties', label: '🌲 Community Co-op Bounties', count: INITIAL_SOCIETY_BOUNTIES.length },
              { id: 'leaderboard', label: '👑 Hall of Fame Leaderboard', count: PRESET_SOCIETY_MEMBERS.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-[#0e0e14] text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono ${
                    activeTab === tab.id ? 'bg-black text-amber-400' : 'bg-white/10 text-zinc-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: TREASURE MILESTONE VAULTS */}
        {/* ========================================================================= */}
        {activeTab === 'vault' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e0e14] border border-white/5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <span>Carroll County Milestone Treasure Chests</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Tap physical NFC beacons across Carroll County to fill your passport meter and unlock guaranteed local vouchers, free meals, and custom hardware.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold shrink-0">
                ⭐ Current Checkpoint Progress: <strong className="text-white text-sm">{totalTaps}</strong> Taps
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {INITIAL_TREASURE_MILESTONES.map((milestone) => {
                const isUnlocked = totalTaps >= milestone.requiredCheckpoints;
                const isClaimed = claimedMilestones.includes(milestone.id);
                const progressPct = Math.min(100, Math.round((totalTaps / milestone.requiredCheckpoints) * 100));

                return (
                  <div
                    key={milestone.id}
                    className={`p-6 rounded-3xl bg-[#0e0e14] border transition-all flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden ${
                      isUnlocked
                        ? 'border-amber-400/50 shadow-amber-500/10'
                        : 'border-white/5 opacity-80'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-4xl">{milestone.iconEmoji}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          isClaimed ? 'bg-emerald-500/20 text-emerald-400' :
                          isUnlocked ? 'bg-amber-400 text-black animate-pulse' :
                          'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isClaimed ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Claimed</span>
                            </>
                          ) : isUnlocked ? (
                            <>
                              <Unlock className="w-3 h-3" />
                              <span>Ready to Open!</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>{milestone.requiredCheckpoints - totalTaps} Taps Left</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                          Requires {milestone.requiredCheckpoints} Checkpoints
                        </span>
                        <h3 className="text-lg font-black text-white">{milestone.title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{milestone.description}</p>
                      </div>

                      <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 space-y-1.5">
                        <div className="text-[10px] font-mono uppercase text-zinc-500">Unlocks Reward:</div>
                        <div className="text-xs font-bold text-amber-300 leading-snug">
                          {milestone.rewardValue}
                        </div>
                      </div>

                      {/* Progress meter */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                          <span>{totalTaps} / {milestone.requiredCheckpoints} Taps</span>
                          <span>{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full bg-amber-400 transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimMilestone(milestone)}
                      disabled={!isUnlocked}
                      className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                        isClaimed
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : isUnlocked
                          ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 active:scale-95'
                          : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      {isClaimed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>View Reward Voucher</span>
                        </>
                      ) : isUnlocked ? (
                        <>
                          <Gift className="w-4 h-4 text-black animate-bounce" />
                          <span>Open Treasure Chest ⚡</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-zinc-600" />
                          <span>Locked ({milestone.requiredCheckpoints} Taps)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Quick Action Discovery Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0e0e14] to-black border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="text-amber-400 font-mono text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Ready to start collecting stamps?</span>
                </div>
                <h3 className="text-2xl font-black text-white">Explore Scenic Lookouts & Local Shops</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Visit the Whittier Covered Bridge, Broad Bay public shore, smokehouse counters, and bakehouse stations. Tap your phone to the NFC medallion to claim points on the spot!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link
                  href="/tourist-hunts"
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                >
                  Browse Scenic Trails 🌲
                </Link>
                <Link
                  href="/store-hunting"
                  className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
                >
                  Store Scavenger Crawl 🛍️
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SMART SOCIETY CITIZEN PASS */}
        {/* ========================================================================= */}
        {activeTab === 'pass' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* The Physical Card Render */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
              <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-[#181824] via-[#0e0e16] to-[#07070a] border-2 border-amber-400/50 shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
                
                {/* Pass Header */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{progression.badgeIcon}</span>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 block">The Townraise Society</span>
                      <h3 className="text-lg font-black text-white tracking-tight uppercase">Citizen RFID Pass</h3>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold">
                    {progression.cardSkin.toUpperCase()} TIER
                  </span>
                </div>

                {/* Member ID & Alias */}
                <div className="p-4 bg-black/60 rounded-2xl border border-white/5 space-y-1 relative z-10">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase">Registered Citizen</div>
                  <div className="text-lg font-black text-white">{currentUser?.name || 'Sean Martin'}</div>
                  <div className="text-xs text-amber-400/90 font-medium">
                    Chapter: <strong>Effingham Vanguard Circle</strong> ({activeTown.fullName})
                  </div>
                </div>

                {/* Level and Multiplier Grid */}
                <div className="grid grid-cols-3 gap-2 text-center relative z-10">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Rank Level</div>
                    <div className="text-lg font-black text-white">Lvl {progression.currentLevel}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">XP Multiplier</div>
                    <div className="text-lg font-black text-emerald-400">{progression.multiplier}x</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="text-[9px] font-mono text-zinc-500 uppercase">Checkpoints</div>
                    <div className="text-lg font-black text-amber-400">{totalTaps}</div>
                  </div>
                </div>

                {/* NFC & QR Pairing Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-10">
                  <div className="font-mono text-[10px] text-zinc-500">
                    ID: OASIS-SOC-{Math.abs(progression.currentXp * 7 + 1042)}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>NFC Transponder Armed</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://townraise.org/society?member=${encodeURIComponent(currentUser?.name || 'sean')}`);
                    showToast('✓ Copied Society Pass URL to clipboard!');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Pass Link</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Pass Card</span>
                </button>
              </div>
            </div>

            {/* Pass Benefits & Unlocked Perks */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-6">
                <div className="space-y-1">
                  <div className="text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                    Tier Privileges & Perks
                  </div>
                  <h3 className="text-xl font-black text-white">
                    What your Society Pass unlocks at local businesses:
                  </h3>
                </div>

                <div className="space-y-3">
                  {progression.perksUnlocked.map((perk, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 font-medium">{perk}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-1">
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Upcoming Level Perk:</div>
                  <div className="text-xs font-bold text-white">
                    {progression.nextPerkPreview}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CRYPTIC CIPHERS & RIDDLES */}
        {/* ========================================================================= */}
        {activeTab === 'ciphers' && (
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-1">
              <div className="text-xs font-mono uppercase text-indigo-400 font-black">
                Carroll County Cryptographic Archive
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Decipher Secret Landmarks & Mystery Beacons
              </h2>
              <p className="text-xs text-zinc-400">
                Each riddle points to a physical location or merchant counter in Carroll County. Enter the passcode engraved on the tag or deciphered from the clue to earn XP and instant vouchers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_CIPHER_RIDDLES.map((riddle) => {
                const isSolved = solvedRiddles.includes(riddle.id);

                return (
                  <div
                    key={riddle.id}
                    className={`p-6 rounded-3xl bg-[#0e0e14] border transition-all flex flex-col justify-between space-y-5 shadow-xl ${
                      isSolved ? 'border-emerald-500/40 shadow-emerald-500/10' : 'border-white/5'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                          {riddle.town}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isSolved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-400/20 text-amber-400'
                        }`}>
                          {isSolved ? '✓ Decoded' : `+${riddle.xpReward} XP`}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-white">{riddle.title}</h3>
                        <p className="text-xs text-zinc-300 italic font-serif leading-relaxed p-4 bg-black/40 rounded-2xl border border-white/5">
                          &ldquo;{riddle.riddle}&rdquo;
                        </p>
                      </div>

                      <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 font-mono text-[11px] text-amber-400/90 truncate">
                        🗝️ Clue: {riddle.encodedClue}
                      </div>

                      <div className="text-xs text-zinc-400">
                        Bounty: <strong className="text-emerald-400">{riddle.bountyRewardText}</strong>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      {isSolved ? (
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Cipher Solved: Passcode &ldquo;{riddle.solutionPasscode}&rdquo; Verified!</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="Enter Solution Passcode (e.g. BEARCAMP1870)"
                              value={riddleSolutions[riddle.id] || ''}
                              onChange={(e) => setRiddleSolutions(prev => ({ ...prev, [riddle.id]: e.target.value }))}
                              className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-400"
                            />
                            <button
                              onClick={() => handleSolveRiddle(riddle)}
                              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider shrink-0"
                            >
                              Submit
                            </button>
                          </div>
                          {riddleError[riddle.id] && (
                            <p className="text-[10px] text-red-400 font-medium">
                              {riddleError[riddle.id]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: COMMUNITY COOPERATIVE BOUNTIES */}
        {/* ========================================================================= */}
        {activeTab === 'bounties' && (
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-1">
              <div className="text-xs font-mono uppercase text-emerald-400 font-black">
                Active Society Bounties & Community Goals
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Collaborative Quests for All Citizens
              </h2>
              <p className="text-xs text-zinc-400">
                Join forces with fellow explorers. When community goals are achieved, town-wide perks like free delivery and baker rewards are unlocked for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INITIAL_SOCIETY_BOUNTIES.map((bounty) => {
                const progressPct = Math.min(100, Math.round((bounty.currentProgress / bounty.targetCount) * 100));

                return (
                  <div
                    key={bounty.id}
                    className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-6 shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{bounty.iconEmoji}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                          {bounty.expiresIn}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-white">{bounty.title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{bounty.description}</p>
                      </div>

                      <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">Community Reward:</div>
                        <div className="text-xs font-bold text-amber-300">{bounty.rewardSummary}</div>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400">Community Progress</span>
                          <span className="text-emerald-400 font-bold">{bounty.currentProgress} / {bounty.targetCount} ({progressPct}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/tourist-hunts"
                      className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
                    >
                      Contribute Taps to Bounty ➔
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: LEADERBOARD & HALL OF FAME */}
        {/* ========================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-1">
              <div className="text-xs font-mono uppercase text-amber-400 font-black">
                Grand Hall of Fame
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Top Society Scouts & Town Vanguards
              </h2>
              <p className="text-xs text-zinc-400">
                The most active citizens discovering Carroll County landmarks, testing NFC beacons, and supporting local merchants.
              </p>
            </div>

            <div className="space-y-4">
              {PRESET_SOCIETY_MEMBERS.map((member, index) => (
                <div
                  key={member.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-lg font-black text-amber-400 shrink-0">
                      #{index + 1}
                    </div>

                    <span className="text-3xl shrink-0">{member.avatarEmoji}</span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-white">{member.alias}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                          {member.rank}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400">{member.chapter}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-400">{member.xp.toLocaleString()} XP</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{member.totalCheckpointsClaimed} Checkpoints</div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap max-w-xs">
                      {member.badges.slice(0, 2).map((b, bi) => (
                        <span key={bi} className="px-2 py-0.5 rounded-lg bg-white/5 text-[10px] text-zinc-300">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CLAIMED REWARD VOUCHER MODAL */}
      {/* ========================================================================= */}
      {activeRewardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-amber-400/50 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center relative">
            
            <button
              onClick={() => setActiveRewardModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-5xl">{activeRewardModal.iconEmoji}</span>
              <div className="text-[10px] font-mono uppercase text-amber-400 font-black tracking-widest">
                Treasure Vault Unlocked!
              </div>
              <h3 className="text-2xl font-black text-white uppercase">{activeRewardModal.title}</h3>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-xs text-zinc-400">Your Official Reward:</div>
              <div className="text-sm font-black text-emerald-400">{activeRewardModal.rewardValue}</div>
              {activeRewardModal.rewardCode && (
                <div className="pt-2 font-mono text-xs text-amber-300 bg-amber-400/10 p-2 rounded-xl border border-amber-400/20">
                  Voucher Code: <strong>{activeRewardModal.rewardCode}</strong>
                </div>
              )}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Show this screen or quote your voucher code at participating Carroll County merchants, or apply it to your online checkout cart!
            </p>

            <button
              onClick={() => setActiveRewardModal(null)}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider"
            >
              Collect & Return to Society Vault
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
