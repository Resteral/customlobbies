'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Check, ShieldCheck, Zap, Crown, 
  Radio, CreditCard, ArrowRight, CheckCircle2, 
  Star, Lock, Award, HeartHandshake, Compass, 
  Smartphone, QrCode, Download, RefreshCw
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { MembershipTier } from '@/lib/types';
import confetti from 'canvas-confetti';

export default function MembershipPage() {
  const { 
    userMembership, subscribeMembership, cancelMembership, 
    activeTown, towns, playDeliveryChime 
  } = useNfcStore();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedTier, setSelectedTier] = useState<MembershipTier>('merchant_pro');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutTier, setCheckoutTier] = useState<MembershipTier>('merchant_pro');

  // Checkout Form State
  const [name, setName] = useState(userMembership.memberName !== 'Oasis Guest' ? userMembership.memberName : '');
  const [email, setEmail] = useState('');
  const [townName, setTownName] = useState(activeTown.fullName);
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'card' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const tiers = [
    {
      id: 'citizen' as MembershipTier,
      name: 'Town Citizen Pass',
      tagline: 'For local patrons, foodies & community supporters',
      monthlyPrice: 9,
      annualPrice: 86,
      badge: 'Verified Citizen',
      emoji: '🌟',
      accentColor: '#10b981',
      popular: false,
      features: [
        '10% off all marketplace delivery orders',
        'Verified Citizen Badge on Community Wire',
        'Early access to limited artisan product drops',
        'Direct feedback priority with local shop owners',
        'Digital NFC Citizen Membership Pass',
      ],
    },
    {
      id: 'merchant_pro' as MembershipTier,
      name: 'Merchant Pro Node',
      tagline: 'For local storefronts, cafes, artisans & restaurants',
      monthlyPrice: 29,
      annualPrice: 278,
      badge: 'Pro Merchant',
      emoji: '⚡',
      accentColor: '#f59e0b',
      popular: true,
      features: [
        'Unlimited NFC Google Review Cards & Tabletop Stands',
        'Smart 5-Star Gatekeeper (Negative Review Shield)',
        'Instant Phone, Telegram & SMS Delivery Relay',
        'Printable Vector & PNG QR Code Backings',
        'Priority Local Courier Dispatch Network',
        'Zero per-transaction merchant processing markups',
      ],
    },
    {
      id: 'vanguard_master' as MembershipTier,
      name: 'Town Vanguard Master',
      tagline: 'For community leaders & regional node operators',
      monthlyPrice: 79,
      annualPrice: 758,
      badge: 'Vanguard Master',
      emoji: '👑',
      accentColor: '#6366f1',
      popular: false,
      features: [
        'Official Town Node Territory Rights & Leadership',
        'Multi-Shop Batch Google Review Scanner & Flasher',
        'Printable Merchant Onboarding Kits & Pitch Sheets',
        'Revenue share on regional courier deliveries',
        'Decentralized governance voting on network upgrades',
        'Dedicated 24/7 Node Support & Hardware Concierge',
      ],
    },
  ];

  const handleOpenCheckout = (tier: MembershipTier) => {
    setCheckoutTier(tier);
    setShowCheckoutModal(true);
    setIsCompleted(false);
  };

  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      subscribeMembership(
        checkoutTier,
        billingCycle,
        name,
        townName,
        email
      );

      setIsProcessing(false);
      setIsCompleted(true);
      playDeliveryChime();

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981'],
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-28 pb-32 px-6 md:px-10 max-w-7xl mx-auto space-y-16">
      
      {/* Top Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
          <Crown className="w-4 h-4 text-amber-400" />
          Decentralized Town Membership & Node Passes
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase">
          Empower Your Town. <span className="text-amber-400">Unlock Pro Perks.</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Join thousands of local citizens, shopkeepers, and Town Vanguards. Supercharge your local review rating, get 10% delivery discounts, and arm your storefront with physical NFC tap hardware.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-8 bg-zinc-800 border border-white/10 rounded-full p-1 transition-colors relative"
          >
            <div
              className={`w-6 h-6 rounded-full bg-amber-400 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-amber-400' : 'text-zinc-500'}`}>
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 text-[9px] font-mono font-black">
              SAVE 20%
            </span>
          </span>
        </div>
      </div>

      {/* Active Membership Status Alert (if subscribed) */}
      {userMembership.active && userMembership.tier !== 'free' && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-indigo-600/10 to-transparent border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl">
              {userMembership.avatarEmoji || '🌟'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400">
                  Active Subscription
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[9px] font-mono font-bold">
                  {userMembership.customBadge}
                </span>
              </div>
              <h3 className="text-xl font-black text-white uppercase">
                {userMembership.tierName} • {userMembership.memberName}
              </h3>
              <p className="text-xs text-zinc-400">
                Member ID: <span className="font-mono text-amber-400">{userMembership.memberId}</span> • Renews on {userMembership.renewsAt} ({userMembership.billingCycle})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cancelMembership}
              className="px-4 py-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 text-zinc-400 rounded-xl text-xs font-bold transition-all"
            >
              Cancel Membership
            </button>
            <Link
              href="/dashboard/cards"
              className="px-5 py-2.5 bg-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-amber-400/20"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Pricing Tier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => {
          const isCurrentTier = userMembership.active && userMembership.tier === tier.id;
          const displayPrice = billingCycle === 'monthly' ? tier.monthlyPrice : Math.round(tier.annualPrice / 12);

          return (
            <div
              key={tier.id}
              className={`rounded-[2.5rem] p-8 flex flex-col justify-between transition-all relative overflow-hidden ${
                tier.popular
                  ? 'bg-[#0e0e16] border-2 border-amber-400/60 shadow-2xl shadow-amber-500/10 lg:-translate-y-2'
                  : 'bg-[#0a0a0f] border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-l from-amber-400 to-amber-500 text-black font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{tier.emoji}</span>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      {tier.name}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed min-h-[32px]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                      ${displayPrice}
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase">
                      / month
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <p className="text-[10px] text-amber-400 font-mono">
                      Billed annually (${tier.annualPrice}/yr) • Save 20%
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    Included Capabilities
                  </span>
                  <ul className="space-y-2.5">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <div className="w-4 h-4 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrentTier ? (
                  <button
                    disabled
                    className="w-full py-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Your Current Plan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenCheckout(tier.id)}
                    className={`w-full py-4 font-black uppercase text-xs tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black hover:scale-105 active:scale-95 shadow-xl shadow-amber-400/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>Subscribe to {tier.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* DIGITAL NFC MEMBERSHIP PASS PREVIEW SECTION */}
      {/* ========================================================================= */}
      <div className="p-8 md:p-12 rounded-[3rem] bg-[#0a0a0f] border border-white/10 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-widest">
            Hardware-Backed Digital Pass
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">
            Your Digital Holographic <span className="text-amber-400">NFC Pass</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Every subscription issues an authenticated digital NFC membership card with encrypted ID, instant tap capabilities, and verified status.
          </p>
        </div>

        {/* 3D Holographic Card Rendering */}
        <div className="max-w-md mx-auto">
          <div className="w-full aspect-[1.586/1] rounded-3xl p-6 bg-gradient-to-br from-zinc-900 via-[#13131c] to-black border border-white/20 shadow-2xl relative overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform">
            {/* Holographic light shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-indigo-500/15 pointer-events-none" />
            
            {/* Top row */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center text-black font-black">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight text-white uppercase">
                    Oasis<span className="text-amber-400">Tap</span>
                  </h4>
                  <span className="text-[8px] font-mono text-zinc-400 uppercase tracking-widest">
                    Town Node Pass
                  </span>
                </div>
              </div>

              {/* NFC Holographic Chip Icon */}
              <div className="w-10 h-8 rounded-lg bg-gradient-to-tr from-amber-400/80 via-amber-200 to-amber-500 p-0.5 shadow-md">
                <div className="w-full h-full bg-black/70 rounded-[6px] flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Middle: Member Name & Town */}
            <div className="space-y-1 relative z-10">
              <div className="text-[9px] font-mono uppercase text-amber-400 font-bold tracking-widest">
                {userMembership.customBadge || 'Official Pass'}
              </div>
              <div className="text-xl font-black tracking-tight text-white uppercase truncate">
                {userMembership.memberName !== 'Oasis Guest' ? userMembership.memberName : 'Citizen Patron'}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {userMembership.memberTown}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10 text-[10px] font-mono">
              <div>
                <span className="text-zinc-500 block text-[8px] uppercase">Member Token</span>
                <span className="text-zinc-300 font-bold">{userMembership.memberId}</span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block text-[8px] uppercase">Network Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT MODAL */}
      {/* ========================================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Membership Activation</span>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {isCompleted ? (
              /* Success State */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase">
                    Welcome to the Network!
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    Your <strong className="text-amber-400">{checkoutTier.replace('_', ' ').toUpperCase()}</strong> subscription has been activated. Your digital pass and perks are live immediately.
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20"
                  >
                    Done & View Perks
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500">Selected Plan</span>
                    <div className="text-sm font-black text-white uppercase">
                      {checkoutTier === 'citizen' && '🌟 Town Citizen Pass ($9/mo)'}
                      {checkoutTier === 'merchant_pro' && '⚡ Merchant Pro Node ($29/mo)'}
                      {checkoutTier === 'vanguard_master' && '👑 Town Vanguard Master ($79/mo)'}
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {billingCycle}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">
                    Your Name / Store Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins or Green Mountain Bakery"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">
                    Email Address (For Invoices & Pass Sync)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">
                    Associated Town Node
                  </label>
                  <select
                    value={townName}
                    onChange={(e) => setTownName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {towns.map((t) => (
                      <option key={t.id} value={t.fullName} className="bg-[#0a0a0f]">
                        {t.icon} {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Simulated Payment Methods */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold uppercase text-zinc-400">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <span className="text-[10px] font-bold block">Credit Card</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'apple_pay'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                      <span className="text-[10px] font-bold block">Apple / GPay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        paymentMethod === 'crypto'
                          ? 'bg-emerald-500/20 border-emerald-500 text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      <Radio className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                      <span className="text-[10px] font-bold block">Web3 Crypto</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Activating Digital Pass...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Activate Membership Pass</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
