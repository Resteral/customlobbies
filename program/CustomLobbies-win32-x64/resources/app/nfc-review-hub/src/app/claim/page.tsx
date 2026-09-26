'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Truck, 
  Utensils, 
  Ticket, 
  Wrench, 
  DollarSign, 
  Award, 
  Copy, 
  Check, 
  UserCheck,
  Heart,
  Phone,
  MapPin,
  Flame,
  Zap
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import confetti from 'canvas-confetti';

function ClaimPassContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { awardLoyaltyPoints, playDeliveryChime, currentUser, registerUser, towns, loyaltyWallet } = useNfcStore();

  const passId = searchParams.get('pass') || searchParams.get('code') || 'OASIS-PASS-001';
  const bonusParam = parseInt(searchParams.get('welcome') || searchParams.get('points') || '50', 10);

  // Application / Claim Form State
  const [applicantName, setApplicantName] = useState(currentUser?.name || '');
  const [applicantPhone, setApplicantPhone] = useState(currentUser?.phone || '(603) ');
  const [applicantTown, setApplicantTown] = useState(currentUser?.town || 'Effingham');
  const [applicantRole, setApplicantRole] = useState<'resident' | 'merchant' | 'contractor' | 'driver'>('resident');
  const [isClaimed, setIsClaimed] = useState(false);
  const [claimedCode, setClaimedCode] = useState<string | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const perksList = [
    {
      icon: '🎁',
      title: '+50 Instant Loyalty Points',
      desc: 'Deposited directly into your digital pass wallet upon activation.',
      value: '$5.00 Value',
      highlight: true,
    },
    {
      icon: '🍔',
      title: '10% Off First Marketplace Order',
      desc: 'Valid on roadside diner food, baked sourdough, artisan honey & crafts.',
      value: 'Instant Voucher',
      highlight: false,
    },
    {
      icon: '🛻',
      title: 'Sean Martin 24/7 4x4 Hotline Access',
      desc: 'Direct priority emergency towing, winter recovery & express courier delivery.',
      value: 'VIP Dispatch',
      highlight: true,
    },
    {
      icon: '🎟️',
      title: 'Fast-Track Event RSVP & Door Pass',
      desc: 'VIP entry to live music patio nights, craft fairs & autumn distillery tastings.',
      value: 'Free Entry',
      highlight: false,
    },
    {
      icon: '🔨',
      title: 'Local Trade & Contractor Discount',
      desc: 'Exclusive 10% off verified local carpentry, tree work, siding & landscaping.',
      value: 'Save $100+',
      highlight: false,
    },
    {
      icon: '⭐',
      title: 'Merchant Review Stand Sample',
      desc: 'Are you a shop owner? Unlock a free sample 5-star Google review funnel.',
      value: 'Free Setup',
      highlight: false,
    }
  ];

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantPhone) {
      alert('Please provide your name and phone number to activate your rewards pass.');
      return;
    }

    // Award loyalty points to store
    awardLoyaltyPoints(bonusParam, `Welcome Reward for Activating Pass ${passId}`);

    // Register user profile in store
    registerUser({
      name: applicantName,
      phone: applicantPhone,
      email: currentUser?.email || `${applicantName.toLowerCase().replace(/\s+/g, '')}@oasis.local`,
      town: applicantTown,
      state: 'NH',
      role: applicantRole as any,
      avatar: applicantRole === 'driver' ? '🛻' : applicantRole === 'merchant' ? '🏬' : applicantRole === 'contractor' ? '🛠️' : '🌟',
      badge: applicantRole === 'driver' ? 'AWD Courier' : applicantRole === 'merchant' ? 'Local Merchant' : applicantRole === 'contractor' ? 'Verified Trade' : 'Community Member',
      isDriver: applicantRole === 'driver'
    });

    const newVoucherCode = `OASIS-WELCOME-${Math.floor(1000 + Math.random() * 9000)}`;
    setClaimedCode(newVoucherCode);
    setIsClaimed(true);

    playDeliveryChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleCopyVoucher = () => {
    if (claimedCode) {
      navigator.clipboard.writeText(claimedCode);
      setCopiedVoucher(true);
      setTimeout(() => setCopiedVoucher(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      {/* Background Cyber Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-80 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Top NFC Tag Detection Badge */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest animate-pulse">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>NFC Pass Detected • Serial #{passId}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight italic">
            You Found a Special <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-500 bg-clip-text text-transparent">
              Oasis Community Pass!
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Welcome to the unified regional network connecting Effingham, Ossipee, Freedom, Wolfeboro, Conway, and Tamworth. Apply below to activate your card and claim your instant welcome rewards.
          </p>
        </div>

        {/* Claim Status Card */}
        {isClaimed ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-[#0e1612] to-[#070d0a] border border-emerald-500/40 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center mx-auto text-4xl shadow-inner">
              🎉
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Pass Activated & Verified
              </span>
              <h2 className="text-3xl font-black text-white uppercase italic">
                Welcome to Oasis, {applicantName}!
              </h2>
              <p className="text-xs text-zinc-300 max-w-md mx-auto">
                Your card <strong>#{passId}</strong> is now active. We’ve credited your digital pass wallet with <strong>+{bonusParam} Loyalty Points</strong>!
              </p>
            </div>

            {/* Voucher Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
                <span>Your 10% Welcome Voucher:</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-base font-black text-amber-400">
                <span>{claimedCode}</span>
                <button
                  onClick={handleCopyVoucher}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all flex items-center gap-1"
                >
                  {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVoucher ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-zinc-400">
                Use this voucher code on any food, coffee, or artisan product at checkout.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/rewards"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>View My Rewards Wallet ({loyaltyWallet.userPoints} Pts)</span>
              </Link>

              <Link
                href="/marketplace"
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Browse Local Marketplace</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Cols: Rewards & Perks for Applying */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                    Unlockable Member Benefits
                  </span>
                  <h3 className="text-2xl font-black italic uppercase text-white">
                    Rewards For Applying
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Here is everything unlocked when you activate your physical NFC pass:
                  </p>
                </div>

                <div className="space-y-3">
                  {perksList.map((perk, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        perk.highlight 
                          ? 'bg-amber-400/10 border-amber-400/40 text-white' 
                          : 'bg-white/[0.03] border-white/5 text-zinc-300'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{perk.icon}</span>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white">{perk.title}</h4>
                          <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                            {perk.value}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-snug">{perk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-[#10101c] to-transparent border border-indigo-500/20 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-indigo-400 shrink-0" />
                  <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
                    <b>100% Free Community Initiative</b> created to unite Carroll County businesses, couriers, and residents in one functional atmosphere.
                  </p>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Application & Claim Form */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121220] via-[#0d0d16] to-[#07070b] border border-amber-400/30 space-y-6 shadow-2xl">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-400/20 mb-2">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Instant 10-Second Activation</span>
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white">
                    Apply & Claim Rewards
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Enter your contact info to link card <strong>#{passId}</strong> to your digital rewards wallet.
                  </p>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(603) 555-0123"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                        Town / Area Node *
                      </label>
                      <select
                        value={applicantTown}
                        onChange={(e) => setApplicantTown(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                      >
                        {towns.map(t => (
                          <option key={t.id} value={t.name}>{t.name}, NH</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                      Your Community Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'resident', label: 'Local Resident / Shopper', icon: '🏡' },
                        { id: 'merchant', label: 'Store / Restaurant Owner', icon: '🏬' },
                        { id: 'contractor', label: 'Tradesman / Contractor', icon: '🛠️' },
                        { id: 'driver', label: 'Delivery / Tow Driver', icon: '🛻' },
                      ].map(r => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setApplicantRole(r.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            applicantRole === r.id
                              ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-md'
                              : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{r.icon}</span>
                          <span className="text-[10px] block mt-0.5">{r.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/20 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Bonus Points Included:
                    </span>
                    <p className="text-[11px] text-zinc-300">
                      Activating card <strong>#{passId}</strong> instantly credits <strong>+{bonusParam} Loyalty Points</strong> to your wallet.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    <Gift className="w-4 h-4 text-black" />
                    <span>Activate Card & Claim Rewards (+{bonusParam} Pts)</span>
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-zinc-400">Loading NFC Rewards Pass...</p>
        </div>
      </div>
    }>
      <ClaimPassContent />
    </Suspense>
  );
}
