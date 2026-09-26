'use client';

import { useState } from 'react';
import { CardLevelProgression, LevelTierConfig } from '@/lib/types';
import { LEVEL_TIERS } from '@/lib/card-leveling';
import { 
  Zap, 
  Award, 
  Flame, 
  Crown, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Gift,
  CheckCircle2,
  TrendingUp,
  Info
} from 'lucide-react';

interface Props {
  progression: CardLevelProgression;
  compact?: boolean;
}

export default function NfcCardLevelWidget({ progression, compact = false }: Props) {
  const [showTiersModal, setShowTiersModal] = useState(false);

  const getSkinBadgeStyle = (skin: string) => {
    switch (skin) {
      case 'emerald':
        return 'from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-500/40 text-emerald-300';
      case 'gold':
        return 'from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40 text-amber-300';
      case 'sapphire':
        return 'from-blue-500/20 via-indigo-500/10 to-transparent border-blue-500/40 text-blue-300';
      case 'holographic_diamond':
        return 'from-pink-500/25 via-purple-500/20 to-cyan-500/20 border-pink-400/60 text-pink-200';
      default:
        return 'from-amber-800/20 via-orange-900/10 to-transparent border-amber-700/40 text-amber-200';
    }
  };

  const getCardGlowGradient = (skin: string) => {
    switch (skin) {
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-emerald-500/30';
      case 'gold':
        return 'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-black shadow-amber-500/30';
      case 'sapphire':
        return 'bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300 text-black shadow-blue-500/30';
      case 'holographic_diamond':
        return 'bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 text-black shadow-pink-500/40 animate-pulse';
      default:
        return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-amber-700/30';
    }
  };

  if (compact) {
    return (
      <div 
        onClick={() => setShowTiersModal(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-amber-400/40 cursor-pointer transition-all group"
      >
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shadow-md ${getCardGlowGradient(progression.cardSkin)}`}>
          {progression.badgeIcon}
        </div>
        <div className="text-left">
          <span className="text-[10px] font-black uppercase text-white tracking-wider block group-hover:text-amber-400 transition-colors">
            Lv.{progression.currentLevel} {progression.levelTitle}
          </span>
          <span className="text-[9px] text-amber-400 font-mono font-bold">
            {progression.multiplier}x Multiplier
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`p-5 md:p-6 rounded-3xl bg-gradient-to-br ${getSkinBadgeStyle(progression.cardSkin)} border backdrop-blur-2xl relative overflow-hidden transition-all shadow-xl`}>
        {/* Top Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${getCardGlowGradient(progression.cardSkin)}`}>
              {progression.badgeIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
                  NFC Card Mastery Tier
                </span>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                  Level {progression.currentLevel} / 5
                </span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                {progression.levelTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multiplier Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[9px] font-mono text-white/40 block leading-none">REWARD RATE</span>
                <span className="text-xs font-black text-amber-400 font-mono">{progression.multiplier}x Points</span>
              </div>
            </div>

            {/* Streak Multiplier */}
            {progression.storeStreakCount > 1 && (
              <div className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center gap-1.5 animate-bounce">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <div>
                  <span className="text-[9px] font-mono text-orange-300 block leading-none">CRAWL STREAK</span>
                  <span className="text-xs font-black text-orange-400 font-mono">{progression.storeStreakCount} Stores ({progression.streakMultiplier}x)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-white/60 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-400" />
              Experience: <strong className="text-white">{progression.currentXp} XP</strong>
            </span>
            <span className="text-amber-400 font-bold">
              {progression.xpProgressPercent}% to Next Tier ({progression.xpForNextLevel} XP)
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-black/50 border border-white/10 p-0.5 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 shadow-lg ${getCardGlowGradient(progression.cardSkin)}`}
              style={{ width: `${progression.xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Perks & Tier Details Button */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/70">
            <Gift className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="line-clamp-1">
              <strong className="text-white">Active Perk: </strong>
              {progression.perksUnlocked[0] || 'Base multiplier enabled'}
            </span>
          </div>

          <button
            onClick={() => setShowTiersModal(true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <span>All 5 Tiers & Skins</span>
            <ChevronRight className="w-3 h-3 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Tiers & Skins Modal */}
      {showTiersModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/20 rounded-3xl max-w-2xl w-full p-6 md:p-8 text-white space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center text-2xl font-black shadow-lg shadow-amber-500/20">
                  👑
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    Carroll County Card Leveling Ladder
                  </h3>
                  <p className="text-xs text-white/50">
                    Level up your card by visiting local stores & landmarks across towns.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTiersModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Tiers List */}
            <div className="space-y-3">
              {LEVEL_TIERS.map((tier) => {
                const isCurrent = tier.level === progression.currentLevel;
                const isPassed = tier.level < progression.currentLevel;

                return (
                  <div
                    key={tier.level}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent 
                        ? 'bg-amber-500/15 border-amber-400 shadow-lg shadow-amber-500/10' 
                        : isPassed 
                        ? 'bg-emerald-950/15 border-emerald-500/30 opacity-80' 
                        : 'bg-white/[0.02] border-white/10 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.badgeIcon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">
                              Level {tier.level}: {tier.title}
                            </h4>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                                Current Tier
                              </span>
                            )}
                            {isPassed && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase">
                                ✓ Unlocked
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-mono text-amber-400">
                            {tier.minXp} - {tier.maxXp === 99999 ? '1,500+' : tier.maxXp} XP • {tier.multiplier}x Point Multiplier
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-white/80">
                        {tier.cardSkin.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Perks List */}
                    <ul className="space-y-1 text-xs text-white/70 pl-9">
                      {tier.perks.map((perk, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-white/60">
                <Flame className="w-4 h-4 text-orange-400" />
                <span><strong>Store Crawl Combo:</strong> Visit 2+ stores in 1 day for 1.2x - 1.5x streak multiplier!</span>
              </div>
              <button
                onClick={() => setShowTiersModal(false)}
                className="px-4 py-2 bg-amber-500 text-black rounded-xl font-black text-xs uppercase tracking-wider"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
