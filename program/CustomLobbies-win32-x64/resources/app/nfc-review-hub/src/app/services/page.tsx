'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Utensils, 
  Home, 
  Wrench, 
  CreditCard,
  Building2,
  Calendar,
  X,
  Radio,
  Truck,
  Layers,
  Check
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { ManagedServicePackage, ServiceCategory } from '@/lib/types';

export default function ServicesStorefrontPage() {
  const { managedServices, enrollClientSubscription, towns, automationBots, triggerAutomationBotManual } = useNfcStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'all'>('all');
  const [activePackageModal, setActivePackageModal] = useState<ManagedServicePackage | null>(null);

  // Enrollment form state
  const [businessName, setBusinessName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedTown, setSelectedTown] = useState(towns[0]?.name ? `${towns[0].name}, ${towns[0].state}` : 'Effingham, NH');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const categories: { label: string; value: ServiceCategory | 'all'; icon: any }[] = [
    { label: 'All Automations', value: 'all', icon: Sparkles },
    { label: 'Reputation & Reviews', value: 'reputation_reviews', icon: ShieldCheck },
    { label: 'Menus & POS Ordering', value: 'digital_menus_ordering', icon: Utensils },
    { label: 'Airbnb & Chalets', value: 'airbnb_concierge', icon: Home },
    { label: 'Contractor Marketing', value: 'contractor_marketing', icon: Wrench },
    { label: 'Courier Retainers', value: 'courier_errand_retainer', icon: Truck },
    { label: 'Master Suite', value: 'custom_automation', icon: Zap },
  ];

  const filteredServices = managedServices.filter(pkg => {
    if (selectedCategory === 'all') return true;
    return pkg.category === selectedCategory;
  });

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackageModal || !businessName || !clientEmail) return;

    const price = billingCycle === 'annual' ? Math.round(activePackageModal.monthlyPrice * 0.8) : activePackageModal.monthlyPrice;

    enrollClientSubscription({
      clientBusinessName: businessName,
      contactName: clientName,
      contactPhone: clientPhone || '(603) 555-0199',
      contactEmail: clientEmail,
      town: selectedTown,
      packageId: activePackageModal.id,
      packageName: activePackageModal.name,
      monthlyFee: price,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      automationsActive: true,
      notes: `Online self-enrollment from Services Storefront (${billingCycle} plan). 24/7 automation pipeline initialized.`
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActivePackageModal(null);
      setBusinessName('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-6">
          <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
          Turnkey Local Business Automation Retainers
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-tight mb-6">
          Put Your Local Business On <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
            Autonomous Pilot
          </span>
        </h1>

        <p className="text-white/60 text-base md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-10">
          We handle your Google reviews, 1-star negative feedback shields, POS kitchen menus, contractor lead relays, and Airbnb guest tap-points — running 24/7 with zero work required from you.
        </p>

        {/* Billing Switcher */}
        <div className="inline-flex items-center bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              billingCycle === 'monthly'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Monthly Retainer
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Annual Plan
            <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-black">SAVE 20%</span>
          </button>
        </div>
      </div>

      {/* Category Filter Badges */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-white text-black font-black scale-105 shadow-xl'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {filteredServices.map((pkg) => {
          const effectivePrice = billingCycle === 'annual' ? Math.round(pkg.monthlyPrice * 0.8) : pkg.monthlyPrice;
          return (
            <div
              key={pkg.id}
              className={`relative bg-[#0d0d12] border rounded-3xl p-7 flex flex-col justify-between transition-all hover:border-amber-400/40 hover:-translate-y-1 ${
                pkg.badge ? 'border-amber-400/50 shadow-2xl shadow-amber-400/10' : 'border-white/10'
              }`}
            >
              {pkg.badge && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg">
                  {pkg.badge}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl">
                    {pkg.iconEmoji || '⚡'}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                      {pkg.category.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-xl font-black text-white leading-snug">{pkg.name}</h3>
                  </div>
                </div>

                <p className="text-white/60 text-xs font-light leading-relaxed mb-6">
                  {pkg.tagline} — {pkg.description}
                </p>

                <div className="mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">${effectivePrice}</span>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-wider">
                      / {billingCycle === 'annual' ? 'mo (billed annually)' : 'month'}
                    </span>
                  </div>
                  {pkg.setupFee && pkg.setupFee > 0 ? (
                    <div className="mt-1 text-[11px] text-white/40 font-mono">
                      Setup fee: ${pkg.setupFee} (waived on annual plans)
                    </div>
                  ) : null}
                  <div className="mt-2 text-xs font-bold text-amber-400/90 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Best for: {pkg.recommendedFor}</span>
                  </div>
                </div>

                <div className="space-y-2.5 mb-6">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
                    Deliverables Included:
                  </span>
                  {pkg.includedDeliverables.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {pkg.automationsIncluded && pkg.automationsIncluded.length > 0 && (
                  <div className="space-y-1.5 mb-6 p-3.5 bg-white/5 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block flex items-center gap-1.5">
                      <Bot className="w-3 h-3" />
                      Automated 24/7 Bots:
                    </span>
                    {pkg.automationsIncluded.map((auto, i) => (
                      <div key={i} className="text-[11px] text-white/70 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                        <span>{auto}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActivePackageModal(pkg)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-2 group"
                >
                  <span>Enroll & Launch Service</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Automation Bots Showcase */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
              <Bot className="w-3.5 h-3.5" />
              Live Bot Fleet
            </div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase">Automated Background Engine</h2>
          </div>
          <Link
            href="/dashboard/admin"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider"
          >
            <span>Open Admin Controller</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automationBots.map((bot) => (
            <div key={bot.id} className="p-6 bg-[#0d0d12] border border-white/10 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{bot.iconEmoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{bot.title}</h4>
                      <span className="text-[10px] font-mono text-white/40">{bot.category}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    bot.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {bot.isActive ? 'Active' : 'Off'}
                  </span>
                </div>

                <p className="text-white/60 text-xs leading-relaxed mb-4">
                  {bot.description}
                </p>

                <div className="space-y-1.5 p-3 bg-black/40 rounded-xl text-[11px] mb-4">
                  <div className="text-white/50 flex items-center justify-between">
                    <span>Trigger:</span>
                    <span className="text-amber-300 font-mono">{bot.triggerEvent}</span>
                  </div>
                  <div className="text-white/50 flex items-center justify-between">
                    <span>Action:</span>
                    <span className="text-emerald-300 font-mono">{bot.actionOutput}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                <span className="text-white/40 font-mono">{bot.executionCount.toLocaleString()} tasks completed</span>
                <button
                  onClick={() => triggerAutomationBotManual(bot.id)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-amber-300 rounded-lg text-[10px] font-bold transition-colors"
                >
                  ⚡ Run Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Automation Blueprint Section */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-white/5 via-[#0d0d12] to-amber-500/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5" />
            Automated Operations Infrastructure
          </div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase">How Our Automation Engine Works</h2>
          <p className="text-white/60 text-sm mt-3">No apps to install. No manual staff effort. Plug in our NFC smart hardware or webhooks, and let our bots handle customer retention and reviews.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-black text-base mb-4">
              01
            </div>
            <h4 className="text-base font-bold text-white mb-2">Hardware Setup & Node Link</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              We ship pre-programmed matte acrylic NFC stands, wooden tap blocks, or vehicle badges paired directly to your Oasis Node.
            </p>
          </div>

          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/10 text-indigo-400 flex items-center justify-center font-black text-base mb-4">
              02
            </div>
            <h4 className="text-base font-bold text-white mb-2">Autonomous 24/7 Bots</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Customer taps filter positive reviews to Google Maps while intercepting negative complaints in private resolution tickets before they go public.
            </p>
          </div>

          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center font-black text-base mb-4">
              03
            </div>
            <h4 className="text-base font-bold text-white mb-2">Monthly ROI & Revenue Report</h4>
            <p className="text-white/60 text-xs leading-relaxed">
              Receive automated monthly digests showing new 5-star reviews captured, customer repeat order rates, and saved ad spending.
            </p>
          </div>
        </div>
      </div>

      {/* Client Self-Enrollment Modal */}
      {activePackageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0d0d12] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setActivePackageModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {submittedSuccess ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">Subscription Active!</h3>
                <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">
                  Your business <span className="text-amber-400 font-bold">{businessName}</span> is now enrolled in <span className="text-white font-bold">{activePackageModal.name}</span>. Our automated bot pipeline is initialized.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl">
                    {activePackageModal.iconEmoji || '⚡'}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Enroll In Retainer</span>
                    <h3 className="text-xl font-black text-white">{activePackageModal.name}</h3>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-white/50 block font-bold uppercase">Plan Price</span>
                    <span className="text-2xl font-black text-white">
                      ${billingCycle === 'annual' ? Math.round(activePackageModal.monthlyPrice * 0.8) : activePackageModal.monthlyPrice}
                      <span className="text-xs text-white/40 font-normal"> / month ({billingCycle})</span>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-amber-400 font-bold block">Deliverables</span>
                    <span className="text-xs text-white/80">{activePackageModal.includedDeliverables.length} Key Services</span>
                  </div>
                </div>

                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Business or Restaurant Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Papa Joe's Pizza or Blue Ridge Cabin"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Owner / Contact Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Gary Collins"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Town / Area *
                      </label>
                      <select
                        value={selectedTown}
                        onChange={(e) => setSelectedTown(e.target.value)}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        {towns.map((t) => (
                          <option key={t.id} value={`${t.name}, ${t.state}`}>{t.name}, {t.state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="owner@business.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                        Phone (for SMS bot triggers)
                      </label>
                      <input
                        type="tel"
                        placeholder="(603) 555-0199"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-400/20 mt-6 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Confirm & Activate Retainer (${billingCycle === 'annual' ? Math.round(activePackageModal.monthlyPrice * 0.8) : activePackageModal.monthlyPrice}/mo)</span>
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
