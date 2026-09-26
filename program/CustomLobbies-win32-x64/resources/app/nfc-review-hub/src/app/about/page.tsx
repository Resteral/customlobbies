'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Users, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Zap, 
  Store, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Quote, 
  Phone, 
  Mail, 
  MapPin, 
  Flame, 
  Layers, 
  Cpu, 
  Crown,
  Handshake,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CARROLL_COUNTY_TOWNS = [
  { name: 'Effingham', role: 'HQ Node & Dispatch Base', desc: 'Historic mountain roads & artisan homesteads' },
  { name: 'Ossipee', role: 'Regional Crossroads Hub', desc: 'Rail trails, mountain lakes & central trade' },
  { name: 'Freedom', role: 'Lakeside Artisan Node', desc: 'Lake Ossipee heritage & village craftsmen' },
  { name: 'Wolfeboro', role: 'Lakes Region Harbor Node', desc: 'America\'s oldest resort town & coastal commerce' },
  { name: 'North Conway', role: 'White Mountain Commercial Gateway', desc: 'Mount Washington valley tourism & high-volume dining' },
  { name: 'Conway Village', role: 'Valley Community Core', desc: 'Local shops, trade contractors & neighborhood staples' },
  { name: 'Tamworth', role: 'Distillery & Creative Enclave', desc: 'Historic village center, arts & local agriculture' },
  { name: 'Madison & Silver Lake', role: 'Heritage Node', desc: 'Boulder landmarks, scenic timberland & lakefront trades' },
  { name: 'Wakefield & Sanbornville', role: 'Southern Gateway Corridor', desc: 'Lakes & railway heritage connecting southern NH & ME' },
  { name: 'Sandwich', role: 'Craft & Agricultural Node', desc: 'Sandwich Fair traditions, guild artisans & forest stewards' },
  { name: 'Tuftonboro', role: 'Winnipesaukee Shore Node', desc: 'Melvin Village harbor & pristine waterfront contractors' },
  { name: 'Bartlett & Jackson', role: 'Notch Mountain Ridge', desc: 'Ski resorts, backcountry couriers & alpine hospitality' }
];

const COMPARISON_POINTS = [
  {
    newAge: 'Extracts 30-40% commission fees from local diners & shops',
    townraise: '0% Middleman Cut — 100% of money stays directly in Carroll County',
  },
  {
    newAge: 'Keeps people glued to algorithms and isolated behind screens',
    townraise: 'Real-world NFC taps & Scavenger circuits that get people into physical stores',
  },
  {
    newAge: 'Treats drivers and gig workers as faceless disposable cogs',
    townraise: 'Direct peer-to-peer 4x4 mountain courier network run by known neighbors',
  },
  {
    newAge: 'Centralized tech monopolies dictated from Silicon Valley',
    townraise: 'Open, decentralized community OS governed by citizen proposals & votes',
  },
  {
    newAge: 'Towns operating in isolated, fragmented silos',
    townraise: 'Uniting 18+ Carroll County towns and neighboring regions into one strong collective',
  },
];

export default function AboutUsPage() {
  const [pledged, setPledged] = useState(false);
  const [pledgeCount, setPledgeCount] = useState(148);
  const [ambassadorName, setAmbassadorName] = useState('');
  const [ambassadorTown, setAmbassadorTown] = useState('Effingham');
  const [ambassadorRole, setAmbassadorRole] = useState('Resident / Supporter');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handlePledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledged) {
      setPledged(true);
      setPledgeCount(prev => prev + 1);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
      setSubmittedMessage(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 pt-24 pb-20 selection:bg-amber-400 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[160px] rounded-full" />
        <div className="absolute top-3/4 left-1/4 w-[600px] h-[400px] bg-indigo-500/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ======================================================== */}
        {/* 1. HERO MANIFESTO BANNER */}
        {/* ======================================================== */}
        <div className="text-center space-y-6 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/20 via-orange-400/15 to-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-500/10 animate-pulse">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>The Townraise Manifesto</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Believing in the <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">People</span> to Get the Job Done.
          </h1>

          <p className="text-lg sm:text-2xl text-zinc-300 max-w-3xl mx-auto font-medium leading-relaxed">
            We are building something designed to <strong className="text-white font-black">break the new age</strong> of digital isolation—uniting towns, neighbors, and local trades into an unstoppable, people-powered network.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 2. FOUNDER'S LETTER / SEAN MARTIN'S VISION */}
        {/* ======================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-amber-500/30 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Founder badge / Avatar */}
            <div className="w-full lg:w-72 shrink-0 flex flex-col items-center text-center p-6 rounded-2xl bg-black/60 border border-white/10 space-y-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-3xl font-black text-amber-400">
                    👑
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 border-2 border-zinc-950 text-white shadow">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-white">Sean Martin</h3>
                <p className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Founder & Lead Vanguard</p>
                <p className="text-[11px] text-zinc-400 mt-1">Effingham, Carroll County, NH</p>
              </div>

              <div className="w-full pt-3 border-t border-white/10 space-y-2 text-xs font-mono text-left">
                <a href="tel:5085070305" className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>508-507-0305</span>
                </a>
                <a href="mailto:frijj555@gmail.com" className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors break-all">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>frijj555@gmail.com</span>
                </a>
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Effingham Node HQ</span>
                </div>
              </div>

              <div className="w-full pt-2">
                <Link
                  href="/contact"
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Message Sean</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Letter Content */}
            <div className="space-y-6 text-zinc-200 leading-relaxed">
              <div className="flex items-center gap-3">
                <Quote className="w-8 h-8 text-amber-400/40" />
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Why I am Doing This: A Letter to Our Towns
                </h2>
              </div>

              <p className="text-base sm:text-lg font-medium text-zinc-300">
                I didn’t build Townraise to create another corporation or another middleman app that sits between you and your neighbors.
              </p>

              <p className="text-base sm:text-lg">
                <strong className="text-amber-300 font-bold">I am doing this because I believe in the people to get the job done.</strong> Look around our towns—whether it's Effingham, Ossipee, Freedom, Wolfeboro, Conway, or Tamworth—the people who keep these communities running aren't Silicon Valley executives or corporate bureaucrats. They are local carpenters, restaurant cooks, farm hands, mechanics, 4x4 drivers, shop owners, and neighbors who show up when a storm knocks out a power line or a neighbor’s truck gets stuck in the snow.
              </p>

              <p className="text-base sm:text-lg">
                The modern "New Age" of technology promised to bring us all together. Instead, it built algorithms that keep us locked behind glass screens, charging local restaurants 30% to deliver a sandwich 2 miles down the road, and hiding small town tradesmen behind paid paywalls and artificial advertising.
              </p>

              <p className="text-base sm:text-lg">
                My hope is that <strong className="text-white font-bold">this platform will bring our community and neighbouring towns closer together</strong>—creating a living, breathing network where neighbors trade with neighbors, discover hidden gems on real-world scavenger trails, support each other’s livelihoods with <span className="text-emerald-400 font-bold">0% middleman extraction</span>, and build a collective resilience that will <strong className="text-amber-400 font-black">break the new age</strong> of digital disconnection once and for all.
              </p>

              <div className="pt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
                  — Sean Martin, Founder of Townraise
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. BREAKING THE NEW AGE: COMPARISON GRID */}
        {/* ======================================================== */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Breaking the New Age
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-sm sm:text-base">
              Why the old corporate tech model is broken, and how Townraise is returning sovereignty and connection back to our towns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old Corporate New-Age Model */}
            <div className="p-8 rounded-3xl bg-red-950/20 border border-red-500/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
                  ✕
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">The "New Age" Extractive Model</h3>
                  <p className="text-xs text-red-300/80 font-mono">Corporate apps & distant monopolies</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-zinc-300">
                {COMPARISON_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-400 font-black shrink-0 mt-0.5">✕</span>
                    <span>{pt.newAge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Townraise People-Powered Model */}
            <div className="p-8 rounded-3xl bg-amber-950/20 border border-amber-500/30 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">The Townraise People's OS</h3>
                  <p className="text-xs text-amber-300 font-mono">Decentralized, sovereign & local</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-zinc-100 font-medium">
                {COMPARISON_POINTS.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt.townraise}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 4. THE 4 FOUNDATIONAL PILLARS */}
        {/* ======================================================== */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Core Principles
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              The 4 Pillars of Our Movement
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">1. Faith in Everyday People</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We believe our neighbors have the skills, grit, and integrity to solve community problems better than any top-down bureaucracy.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-indigo-400/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">2. Uniting Neighboring Towns</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Breaking isolated silos by bridging Carroll County towns and neighboring regions into one unified, collaborative economic engine.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-400/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">3. Zero-Cut Sovereign Commerce</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                No 30% cuts. 100% of revenue stays in the pockets of our local store owners, artisans, trade workers, and couriers.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-rose-400/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">4. Physical Real-World Bond</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Using NFC smart cards and treasure hunts to get people exploring outdoors, visiting stores, and building genuine human connections.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. CONNECTED TOWNS NETWORK */}
        {/* ======================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
                <MapPin className="w-3.5 h-3.5" /> Regional Coverage
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Our Interconnected Town Nodes
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                Connecting Carroll County and expanding into neighboring New Hampshire & Western Maine towns.
              </p>
            </div>

            <Link
              href="/towns"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <span>Explore All Town Hubs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CARROLL_COUNTY_TOWNS.map((town, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-amber-400/30 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {town.name}
                  </h4>
                  <span className="text-[10px] font-mono text-amber-400/90 font-bold">{town.role}</span>
                </div>
                <p className="text-xs text-zinc-400">{town.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6. INTERACTIVE COMMUNITY PLEDGE */}
        {/* ======================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-indigo-500/10 border border-amber-400/30 backdrop-blur-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Handshake className="w-4 h-4" />
              <span>Join the Community Covenant</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Stand with the People. Help Us Break the New Age.
            </h2>

            <p className="text-sm sm:text-base text-zinc-300">
              Add your name to the Carroll County Community Covenant. Whether you’re a local business owner, tradesperson, courier, or resident, your voice shapes the future of our towns.
            </p>
          </div>

          {submittedMessage ? (
            <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 max-w-lg mx-auto space-y-2 animate-in fade-in-50">
              <div className="text-2xl">🎉</div>
              <h4 className="text-base font-black text-white">Thank You for Standing with Our Towns!</h4>
              <p className="text-xs text-emerald-200">
                You are registered as Carroll County Pioneer #{pledgeCount}. Together, we are building something truly special.
              </p>
              <div className="pt-3">
                <Link 
                  href="/hunter-profile" 
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
                >
                  <span>View Your Digital Resident Pass →</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePledge} className="max-w-xl mx-auto space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={ambassadorName}
                    onChange={(e) => setAmbassadorName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">Your Town Node</label>
                  <select
                    value={ambassadorTown}
                    onChange={(e) => setAmbassadorTown(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  >
                    {CARROLL_COUNTY_TOWNS.map((t, i) => (
                      <option key={i} value={t.name}>{t.name}, NH</option>
                    ))}
                    <option value="Other">Neighboring Town / Visitor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">How will you participate?</label>
                <select
                  value={ambassadorRole}
                  onChange={(e) => setAmbassadorRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Resident">Resident / Community Supporter</option>
                  <option value="Merchant">Storefront / Restaurant Owner (0% Fees)</option>
                  <option value="Contractor">Trade Contractor / Craftsman</option>
                  <option value="Courier">4x4 Mountain Courier Driver</option>
                  <option value="Explorer">Treasure Hunter & Trail Explorer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 text-black font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>Pledge to the People's Movement ({pledgeCount} Signed)</span>
              </button>
            </form>
          )}
        </div>

        {/* ======================================================== */}
        {/* 7. BOTTOM QUICK ACTIONS */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <Link
            href="/create-storefront"
            className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all space-y-2 group"
          >
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Store className="w-4 h-4" />
              <span>For Storefronts</span>
            </div>
            <div className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
              Register Your Business (0% Fees) →
            </div>
            <p className="text-xs text-zinc-400">Put your shop or eatery on the map with free online ordering.</p>
          </Link>

          <Link
            href="/store-hunting"
            className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-pink-400/40 transition-all space-y-2 group"
          >
            <div className="text-pink-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>For Explorers</span>
            </div>
            <div className="text-base font-black text-white group-hover:text-pink-400 transition-colors">
              Start Store Hunting Circuit →
            </div>
            <p className="text-xs text-zinc-400">Tap NFC cards at local stores to unlock discounts and reward points.</p>
          </Link>

          <Link
            href="/society"
            className="p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition-all space-y-2 group"
          >
            <div className="text-indigo-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Crown className="w-4 h-4" />
              <span>The People's Vault</span>
            </div>
            <div className="text-base font-black text-white group-hover:text-indigo-400 transition-colors">
              The Sovereign Society & Bounties →
            </div>
            <p className="text-xs text-zinc-400">Solve riddles, take on town bounties, and climb the pride ladder.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
