'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Sparkles, 
  DollarSign, 
  Share2, 
  Copy, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  QrCode, 
  Building2, 
  Zap, 
  Gift, 
  X,
  CreditCard
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function AffiliatePage() {
  const { affiliates, registerAffiliate, towns } = useNfcStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Ambassador registration form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [town, setTown] = useState(towns[0]?.name ? `${towns[0].name}, ${towns[0].state}` : 'Effingham, NH');
  const [registeredAffiliate, setRegisteredAffiliate] = useState<any | null>(null);

  // Calculator state
  const [calcReferrals, setCalcReferrals] = useState(6);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(`https://townraise.org/directory?ref=${code}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    const newAmb = registerAffiliate({
      name,
      email,
      phone,
      town,
    });

    setRegisteredAffiliate(newAmb);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
          <DollarSign className="w-4 h-4 text-emerald-400 animate-pulse" />
          Town Ambassador & Merchant Referral Program
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-tight mb-6">
          Earn <span className="text-emerald-400">$50 Cash</span> For Every <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
            Local Business You Refer
          </span>
        </h1>

        <p className="text-white/60 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-8">
          Help restaurants, contractors, cabins, and local shops in Carroll County automate their Google reviews, digital menus, and courier delivery. We pay you instant cash bounties on every signup.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Your Ambassador Link & Code</span>
          </button>

          <Link
            href="/directory"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center gap-2"
          >
            <span>Browse Local Businesses</span>
            <ArrowRight className="w-4 h-4 text-white/50" />
          </Link>
        </div>
      </div>

      {/* Interactive Earnings Calculator */}
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/5 via-[#0d0d12] to-emerald-500/10 border border-white/10 rounded-3xl p-8 md:p-10 mb-16 shadow-2xl">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            Bounty Calculator
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase italic">
            How Much Can You Earn?
          </h2>
          <p className="text-white/60 text-xs mt-2">
            Earn $50 per standard client retainer (\$79-\$149/mo) and $100 per Master Suite client (\$399/mo).
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center text-sm font-bold mb-2">
              <span className="text-white/80">Businesses Reached:</span>
              <span className="text-emerald-400 font-mono text-lg">{calcReferrals} Businesses</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={calcReferrals}
              onChange={(e) => setCalcReferrals(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
              <span>1 Business</span>
              <span>15 Businesses</span>
              <span>30 Businesses</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-xs text-white/40 font-bold uppercase block">Instant Cash Bounty</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">${calcReferrals * 50}</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-xs text-white/40 font-bold uppercase block">Merchant Discount Given</span>
              <span className="text-3xl font-black text-amber-400 font-mono">${calcReferrals * 20}</span>
              <span className="text-[10px] text-white/30 block">($20 off for merchant)</span>
            </div>
            <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
              <span className="text-xs text-white/40 font-bold uppercase block">Ambassador Rank</span>
              <span className="text-lg font-black text-indigo-400 mt-1 block">
                {calcReferrals >= 15 ? '👑 Town Vanguard Legend' : calcReferrals >= 5 ? '⭐ Local Gold Partner' : '⚡ Active Ambassador'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ambassador Leaderboard & Active Codes */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              Top Carroll County Ambassadors
            </div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase">Ambassador Leaderboard</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {affiliates.map((aff, i) => (
            <div key={aff.id} className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-black font-black flex items-center justify-center text-sm shadow-lg">
                      #{i + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{aff.name}</h4>
                      <span className="text-xs text-white/40">{aff.town}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-black/40 rounded-2xl border border-white/5 mb-4 flex items-center justify-between">
                  <span className="text-xs text-white/50">Referral Code:</span>
                  <span className="font-mono text-sm font-bold text-amber-300">{aff.code}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center mb-6">
                  <div className="p-2.5 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-white/40 block">Businesses Referred</span>
                    <span className="text-lg font-black text-white font-mono">{aff.referralsCount}</span>
                  </div>
                  <div className="p-2.5 bg-white/5 rounded-xl">
                    <span className="text-[10px] text-white/40 block">Total Bounties</span>
                    <span className="text-lg font-black text-emerald-400 font-mono">${aff.earnedBountyTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(aff.code)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors"
              >
                {copiedCode === aff.code ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-white/60" />
                    <span>Copy Ambassador Link</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works 3-Step */}
      <div className="max-w-7xl mx-auto bg-[#0d0d12] border border-white/10 rounded-3xl p-8 md:p-12 mb-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-2xl md:text-3xl font-black uppercase italic">How You Get Paid</h3>
          <p className="text-white/60 text-xs mt-2">No selling required. Simply share your link with local owners.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-2xl font-black text-amber-400 mb-2 block">01</span>
            <h4 className="text-sm font-bold text-white mb-1">Share Your Personal Link</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Send your link to local restaurant owners, Airbnb hosts, or contractors looking for Google reviews and menus.
            </p>
          </div>

          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-2xl font-black text-indigo-400 mb-2 block">02</span>
            <h4 className="text-sm font-bold text-white mb-1">Merchant Claims or Subscribes</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              When the business claims their profile or activates an automation retainer, they get \$20 off their first order.
            </p>
          </div>

          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <span className="text-2xl font-black text-emerald-400 mb-2 block">03</span>
            <h4 className="text-sm font-bold text-white mb-1">Instant Cash Payout</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Receive $50 direct to your Venmo, Cash App, or bank deposit per enrolled business with zero caps.
            </p>
          </div>
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowJoinModal(false);
                setRegisteredAffiliate(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {registeredAffiliate ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">You&apos;re an Official Ambassador!</h3>
                <p className="text-white/60 text-xs mt-2 mb-6">
                  Here is your unique referral code. Share this with local business owners in Carroll County:
                </p>

                <div className="p-4 bg-black/60 border border-amber-400/40 rounded-2xl mb-6">
                  <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">Your Referral Code</span>
                  <span className="text-3xl font-black font-mono text-amber-400">{registeredAffiliate.code}</span>
                  <p className="text-[11px] text-white/60 mt-2">
                    Share Link: <span className="text-indigo-300 font-mono">https://townraise.org/directory?ref={registeredAffiliate.code}</span>
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(registeredAffiliate.code)}
                  className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-lg"
                >
                  Copy Link & Start Sharing
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Join Ambassador Team</span>
                    <h3 className="text-xl font-black text-white">Start Earning $50 Bounties</h3>
                  </div>
                </div>

                <form onSubmit={handleJoinSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Phone (for Venmo/Cash App payouts) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(603) 555-0182"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Your Town / Area
                    </label>
                    <select
                      value={town}
                      onChange={(e) => setTown(e.target.value)}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                    >
                      {towns.map((t) => (
                        <option key={t.id} value={`${t.name}, ${t.state}`}>{t.name}, {t.state}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 mt-4"
                  >
                    Activate Ambassador Profile ➔
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
