'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  Award, 
  Radio, 
  Star, 
  Truck, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Tag, 
  Zap,
  Clock,
  Ticket
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function RewardsPage() {
  const { loyaltyRewards, loyaltyWallet, redeemLoyaltyReward, awardLoyaltyPoints, currentUser } = useNfcStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'vouchers' | 'earn'>('catalog');
  const [redemptionFeedback, setRedemptionFeedback] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = (rewardId: string, title: string) => {
    const success = redeemLoyaltyReward(rewardId);
    if (success) {
      setRedemptionFeedback(`Redeemed "${title}"! Voucher code created.`);
      setTimeout(() => setRedemptionFeedback(null), 3500);
    } else {
      setRedemptionFeedback('Insufficient loyalty points. Tap more NFC nodes to earn!');
      setTimeout(() => setRedemptionFeedback(null), 3000);
    }
  };

  // Tier progress calculation
  const nextTierPoints = loyaltyWallet.userPoints >= 1000 ? 1000 : loyaltyWallet.userPoints >= 500 ? 1000 : loyaltyWallet.userPoints >= 200 ? 500 : 200;
  const progressPercent = Math.min(100, Math.round((loyaltyWallet.userPoints / nextTierPoints) * 100));

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Hero Header & Wallet Card */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
            <Gift className="w-4 h-4 text-amber-400 animate-pulse" />
            Townraise Citizen Loyalty Pass & Rewards Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">
            Earn Points Every Time You <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
              Tap, Review & Dine Local
            </span>
          </h1>

          {/* Connected Account Bar */}
          <div className="mt-4 inline-flex items-center gap-3 p-2 px-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <span className="text-base">{currentUser?.avatar || '👤'}</span>
            <span className="text-zinc-300">Logged in as <strong className="text-white">{currentUser?.name || 'Local Resident'}</strong></span>
            <span className="text-amber-400 font-mono font-bold">• {loyaltyWallet.userPoints} Points</span>
            <Link
              href="/hunter-profile"
              className="ml-2 px-3 py-1 rounded-xl bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider hover:scale-105 transition-transform"
            >
              My Profile & Pass ➔
            </Link>
          </div>
        </div>

        {/* Digital Pass HUD Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#12121c] via-[#1a1a2e] to-[#0d0d18] border border-amber-400/30 p-8 md:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black font-black flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
                {currentUser?.avatar || '⭐'}
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  Official Town Pass Holder: {currentUser?.name || 'Citizen'}
                </span>
                <h3 className="text-2xl font-black text-white">{loyaltyWallet.level}</h3>
                <span className="text-xs text-white/50">Tier {loyaltyWallet.tierNumber} • {currentUser?.town || 'Effingham'}, NH Resident</span>
              </div>
            </div>

            <div className="text-left md:text-right">
              <span className="text-xs text-white/50 font-bold uppercase block">Available Balance</span>
              <div className="flex items-baseline md:justify-end gap-1.5">
                <span className="text-5xl font-black text-amber-400 font-mono">{loyaltyWallet.userPoints}</span>
                <span className="text-xs text-white/60 font-bold uppercase tracking-wider">Points</span>
              </div>
            </div>
          </div>

          {/* Progress to Next Rank */}
          <div className="space-y-2 relative z-10 mb-6">
            <div className="flex justify-between text-xs text-white/60 font-bold">
              <span>Tier Progress</span>
              <span>{loyaltyWallet.userPoints} / {nextTierPoints} Points to Next Rank</span>
            </div>
            <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500 shadow-lg shadow-amber-400/50"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 relative z-10 pt-4 border-t border-white/10 text-center">
            <div className="p-3 bg-white/5 rounded-2xl">
              <span className="text-[10px] text-white/40 block">Lifetime NFC Taps</span>
              <span className="text-lg font-black text-white font-mono">{loyaltyWallet.lifetimeTaps}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
              <span className="text-[10px] text-white/40 block">Reviews Written</span>
              <span className="text-lg font-black text-white font-mono">{loyaltyWallet.reviewsWritten}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-2xl">
              <span className="text-[10px] text-white/40 block">Redeemed Vouchers</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{loyaltyWallet.redeemedRewards.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert / Toast Feedback */}
      {redemptionFeedback && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{redemptionFeedback}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Rewards Catalog ({loyaltyRewards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'vouchers'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>My Active Vouchers ({loyaltyWallet.redeemedRewards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('earn')}
          className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'earn'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>How to Earn Points</span>
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {loyaltyRewards.map((reward) => {
            const canAfford = loyaltyWallet.userPoints >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-2xl flex items-center justify-center">
                        {reward.iconEmoji}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                          {reward.businessName}
                        </span>
                        <h4 className="text-lg font-black text-white">{reward.title}</h4>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black font-mono text-amber-300">
                      {reward.valueText}
                    </span>
                  </div>

                  <p className="text-white/60 text-xs leading-relaxed mb-6 font-light">
                    {reward.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-amber-400 font-mono">{reward.pointsCost}</span>
                    <span className="text-xs text-white/40 uppercase font-bold">PTS</span>
                  </div>

                  <button
                    onClick={() => handleRedeem(reward.id, reward.title)}
                    disabled={!canAfford}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black shadow-lg shadow-amber-400/20 active:scale-95'
                        : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {canAfford ? 'Redeem Voucher ➔' : `Need ${reward.pointsCost - loyaltyWallet.userPoints} More Pts`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Vouchers */}
      {activeTab === 'vouchers' && (
        <div className="max-w-3xl mx-auto space-y-4 mb-16">
          {loyaltyWallet.redeemedRewards.length === 0 ? (
            <div className="text-center py-12 bg-[#0d0d12] border border-white/10 rounded-3xl p-8">
              <Ticket className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h4 className="text-lg font-black text-white">No active vouchers yet</h4>
              <p className="text-xs text-white/50 mt-1 mb-4">Redeem your loyalty points from the catalog to generate digital discount codes.</p>
              <button
                onClick={() => setActiveTab('catalog')}
                className="px-6 py-2.5 bg-amber-400 text-black text-xs font-black uppercase rounded-xl"
              >
                Browse Rewards Catalog
              </button>
            </div>
          ) : (
            loyaltyWallet.redeemedRewards.map((v, idx) => (
              <div
                key={idx}
                className="p-6 bg-[#0d0d12] border border-amber-400/30 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">{v.rewardTitle}</h4>
                    <span className="text-xs text-white/40 font-mono">Redeemed: {v.redeemedAt} • Show to staff at checkout</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="px-4 py-2 bg-black/60 border border-amber-400/40 rounded-xl font-mono text-sm font-black text-amber-300 tracking-wider">
                    {v.code}
                  </div>
                  <button
                    onClick={() => handleCopy(v.code)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/60 hover:text-white transition-colors"
                    title="Copy Code"
                  >
                    {copiedCode === v.code ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Ways to Earn */}
      {activeTab === 'earn' && (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl mb-3">
              📱
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-black text-white">Tap Any In-Person NFC Stand</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-mono text-xs font-black">+10 PTS</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Tap your smartphone against acrylic review stands at PNB Eats, Pizza Barn, or local Airbnbs.
            </p>
            <button
              onClick={() => awardLoyaltyPoints(10, 'Simulated NFC Node Tap')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-amber-300 rounded-xl text-xs font-bold border border-white/10 transition-all"
            >
              ⚡ Simulate NFC Table Tap
            </button>
          </div>

          <div className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl mb-3">
              ⭐
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-black text-white">Write a Verified Google Review</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-mono text-xs font-black">+50 PTS</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Leave genuine 5-star reviews on Google Maps for local Carroll County shops and restaurants.
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold border border-white/10"
            >
              <span>Explore Businesses to Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xl mb-3">
              🚚
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-black text-white">Order Town Food / Courier Delivery</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-mono text-xs font-black">+25 PTS</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Order takeout, hardware items, or grocery errands through our Carroll County courier dispatch.
            </p>
            <Link
              href="/eats"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30"
            >
              <span>Order Food Takeout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center text-xl mb-3">
              👑
            </div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-base font-black text-white">Refer a Local Merchant Friend</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/10 text-indigo-400 font-mono text-xs font-black">+500 PTS + $50</span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Get local business owners on board with our automation retainers or NFC hardware packages.
            </p>
            <Link
              href="/affiliate"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl text-xs font-bold border border-indigo-500/30"
            >
              <span>Ambassador Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
