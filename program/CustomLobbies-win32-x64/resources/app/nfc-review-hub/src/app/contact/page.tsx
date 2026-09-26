'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, Mail, MessageSquare, ShieldCheck, Zap, 
  MapPin, Send, CheckCircle2, User, Sparkles, Building2, Radio
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function ContactPage() {
  const { activeTown, submitGeneralFeedback } = useNfcStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<'town_takeover' | 'nfc_cards' | 'business_storefront' | 'delivery_dispatch' | 'other'>('town_takeover');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    submitGeneralFeedback({
      businessName: topic === 'business_storefront' ? 'Storefront Inquiry' : 'Oasis Node Dispatch',
      rating: 5,
      category: 'suggestion',
      customerName: name || 'Anonymous Node Citizen',
      customerPhone: phone || undefined,
      customerEmail: email || undefined,
      feedbackText: `[Topic: ${topic.toUpperCase()}] ${message}`,
      town: activeTown.fullName,
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-20 px-6 md:px-10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-indigo-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Direct Node Communications</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tight uppercase">
            Contact <span className="text-amber-400">Sean Martin</span> & Node Support
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            Need NFC review cards programmed for your town, want to launch a town node, set up your business storefront, or dispatch local deliveries? Reach out directly.
          </p>
        </div>

        {/* Lead Vanguard Card + Direct Channels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Vanguard Profile Card */}
          <div className="lg:col-span-1 p-8 rounded-3xl bg-white/[0.03] border border-amber-500/30 backdrop-blur-xl relative overflow-hidden space-y-6 flex flex-col justify-between shadow-2xl shadow-amber-500/5">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20">
                  <div className="w-full h-full bg-[#0d0d12] rounded-[14px] flex items-center justify-center text-3xl">
                    👑
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Sean Martin</h2>
                  <p className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">Founding Vanguard Lead</p>
                  <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    Effingham & Regional Hub, NH
                  </p>
                </div>
              </div>

              {/* Bio description */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                Direct coordinator for physical-to-digital Google Review NFC deployment, decentralized town takeover onboarding, merchant storefront creation, and express phone notification relays.
              </p>

              {/* Quick direct contact links */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:5085070305"
                  className="flex items-center justify-between p-4 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-white group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-black">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-amber-300 uppercase font-bold">Direct Phone / SMS</div>
                      <div className="text-sm font-bold tracking-tight">508-507-0305</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 group-hover:translate-x-1 transition-transform font-bold">Call →</span>
                </a>

                <a
                  href="mailto:frijj555@gmail.com"
                  className="flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-white group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-indigo-300 uppercase font-bold">Direct Email</div>
                      <div className="text-sm font-bold tracking-tight break-all">frijj555@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform font-bold">Email →</span>
                </a>
              </div>
            </div>

            {/* Live Service Guarantee Badges */}
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-amber-400 font-black text-sm">&lt; 15 Mins</div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Response Time</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-emerald-400 font-black text-sm">Active Node</div>
                <div className="text-[9px] text-zinc-500 uppercase font-mono">Effingham Hub</div>
              </div>
            </div>
          </div>

          {/* Inquiry / Message Dispatch Form */}
          <div className="lg:col-span-2 p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant In-App Dispatch</span>
              </div>
              <h2 className="text-2xl font-black italic tracking-tight text-white uppercase">Send Direct Message / Request</h2>
              <p className="text-xs text-zinc-400">
                Submit an inquiry below and it will be routed straight to Sean Martin’s notification center and feedback radar.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">Transmission Dispatched!</h3>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Your request has been logged and sent to Sean Martin ({`(508) 507-0305`} / {`frijj555@gmail.com`}). You can expect a response shortly!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Walt Henderson"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Phone Number (Optional for SMS Reply)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (603) 555-0142"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. merchant@localbusiness.com"
                        className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                      Inquiry Topic
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as any)}
                      className="w-full bg-[#0e0e14] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="town_takeover">🚩 Launch / Take Over Town Node</option>
                      <option value="nfc_cards">💳 Program Google Review NFC Cards</option>
                      <option value="business_storefront">🏪 Create Custom Business Website</option>
                      <option value="delivery_dispatch">🚚 Delivery & Dispatch Setup</option>
                      <option value="other">💬 General Question / Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">
                    Your Message / Business Details <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell Sean what you need: your business name, town location, or how you'd like to collaborate..."
                    className="w-full bg-[#0e0e14] border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors leading-relaxed"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transmitted to {activeTown.fullName} Vanguard Node</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Transmission</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* SEAN MARTIN'S PURCHASEABLE & PROGRAMMABLE NFC HARDWARE SUITE */}
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sean Martin Hardware Lab • Pre-Programmed & Shipped</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tight text-white uppercase">
              Purchaseable & Custom Programmed <span className="text-amber-400">NFC Smart Tech</span>
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Every smart NFC unit is custom-encoded, laser engraved, and quality tested by Sean Martin. Ready to use out-of-the-box with any modern iPhone or Android—no apps required.
            </p>
          </div>

          {/* 6 Core Programmable Archetypes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Digital Business Cards */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-2xl font-black">
                    🪪
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-mono font-bold">$29.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-amber-300 transition-colors">
                  Digital NFC Business Cards
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  1-tap transfers your vCard, phone number, portfolio website, and social profiles directly into the customer's contacts.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ Instant iPhone & Android Sync</div>
                  <div>✓ Update Links Anytime in Cloud</div>
                </div>
              </div>
              <Link
                href="/marketplace"
                className="w-full py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-amber-400/20"
              >
                Order Business Card →
              </Link>
            </div>

            {/* 2. Restaurant & Bar Menus */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-2xl font-black">
                    🍽️
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-mono font-bold">$34.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-amber-300 transition-colors">
                  Tap-to-Order Digital Menus
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Heavyweight acrylic stands & waterproof table discs. Diners tap to browse menus, order food, and tip waitstaff.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ Table Number Pre-Encoded</div>
                  <div>✓ Alcohol & Spill Resistant</div>
                </div>
              </div>
              <Link
                href="/menus"
                className="w-full py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-amber-400/20"
              >
                Order Table Stands →
              </Link>
            </div>

            {/* 3. Loyalty & Rewards Systems */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-2xl font-black">
                    🎁
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-mono font-bold">$14.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-amber-300 transition-colors">
                  VIP Rewards & Loyalty Keychains
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Pocket-sized leatherette & alloy FOB keychains. Customers tap in-store to earn bonus points and unlock secret mystery discounts.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ Level Multipliers & Combos</div>
                  <div>✓ Re-Order Favorites Instantly</div>
                </div>
              </div>
              <Link
                href="/rewards"
                className="w-full py-2.5 rounded-xl bg-amber-400/10 hover:bg-amber-400 hover:text-black text-amber-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-amber-400/20"
              >
                Explore Loyalty FOBs →
              </Link>
            </div>

            {/* 4. Live Events & Festival VIP Passes */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl font-black">
                    🎟️
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[9px] font-mono font-bold">$19.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-pink-300 transition-colors">
                  Event & Festival VIP Passes
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Wearable lanyard smart cards pre-encoded for rapid 0.1s door check-in, festival schedule view, and backstage access.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ Includes Soft-Touch Lanyard</div>
                  <div>✓ Reusable for Future Events</div>
                </div>
              </div>
              <Link
                href="/events"
                className="w-full py-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500 hover:text-black text-pink-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-pink-500/20"
              >
                Order Event Passes →
              </Link>
            </div>

            {/* 5. 5-Star Google Reviews & Shields */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-2xl font-black">
                    ⭐
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[9px] font-mono font-bold">$49.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-indigo-300 transition-colors">
                  5-Star Google Review Stands
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Dual-channel smart funnel. Forwards 4 & 5-star diners directly into Google Maps while diverting negative ratings to private manager inbox.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ 12.8x Review Acceleration</div>
                  <div>✓ Zero Monthly Software Fees</div>
                </div>
              </div>
              <Link
                href="/marketplace?cat=stands"
                className="w-full py-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 hover:text-white text-indigo-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-indigo-500/20"
              >
                Order Review Stand →
              </Link>
            </div>

            {/* 6. Airbnb & Lakehouse Wi-Fi Plaques */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 flex flex-col justify-between group shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl font-black">
                    🏡
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold">$39.99</span>
                </div>
                <h3 className="font-black text-white text-lg uppercase group-hover:text-emerald-300 transition-colors">
                  Airbnb & Lakehouse Wi-Fi Plaques
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Custom wooden plaque allowing cabin guests to tap for 1-second passwordless Wi-Fi connect, house rules, and dockside firewood delivery.
                </p>
                <div className="text-[10px] font-mono text-zinc-400 space-y-1 pt-1">
                  <div>✓ 1-Tap Passwordless Connect</div>
                  <div>✓ Sean Martin Food/Firewood Relay</div>
                </div>
              </div>
              <Link
                href="/concierge"
                className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-300 text-[10px] font-black uppercase tracking-wider transition-all text-center block border border-emerald-500/20"
              >
                Order Airbnb Plaque →
              </Link>
            </div>

          </div>

          {/* 100-Card Batch Flashing Station Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#0e0e16] to-indigo-600/15 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>100-Card Promotional Giveaway Pack</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white tracking-tight">
                Need 100 Cards Pre-Programmed for Giveaways?
              </h3>
              <p className="text-xs text-zinc-300 max-w-xl">
                Get a bulk crate of 100 sequentially coded cards pre-programmed with your business links, review prompts, or event passes. Free delivery across Carroll County.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/custom-nfc"
                className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Batch Flashing Station</span>
                <Radio className="w-4 h-4 text-black" />
              </Link>
              <a
                href="tel:5085070305"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest transition-all border border-white/10"
              >
                Call Sean (508) 507-0305
              </a>
            </div>
          </div>
        </div>

        {/* Quick Access Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Create a Business Website</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Launch a standalone branded website with online ordering and automatic marketplace catalog syncing.
            </p>
            <Link href="/create-storefront" className="text-xs text-amber-400 hover:underline font-bold inline-block">
              Launch Site Builder →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Program Review Cards</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan surrounding businesses in Effingham and neighboring towns, extract Place IDs, and flash NFC cards.
            </p>
            <Link href="/custom-nfc" className="text-xs text-indigo-400 hover:underline font-bold inline-block">
              Open NFC Programmer →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Town Takeover Command</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Become the official Vanguard Lead for your town, onboard merchants, and run decentralized delivery networks.
            </p>
            <Link href="/dashboard/town-command" className="text-xs text-emerald-400 hover:underline font-bold inline-block">
              Open Town Command →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
