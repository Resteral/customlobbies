'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Sparkles, 
  Star, 
  Copy, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  Radio, 
  ShieldCheck, 
  Smartphone, 
  Eye, 
  Sliders, 
  ArrowRight,
  Globe,
  Palette
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

type WidgetType = 'floating_badge' | 'star_ribbon' | 'review_carousel' | 'tap_button';

export default function EmbedsStudioPage() {
  const { storefronts, cards } = useNfcStore();
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>(storefronts[0]?.id || 'sf-oasis-roastery');
  const [widgetType, setWidgetType] = useState<WidgetType>('floating_badge');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'gold'>('dark');
  const [accentColor, setAccentColor] = useState<string>('#f59e0b');
  const [showVerifiedShield, setShowVerifiedShield] = useState<boolean>(true);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  const selectedStorefront = storefronts.find(s => s.id === selectedStorefrontId) || storefronts[0];
  const businessName = selectedStorefront?.businessName || 'Oasis Artisan Roastery & Bakehouse';
  const rating = selectedStorefront?.googleRating || 4.9;
  const reviewCount = selectedStorefront?.reviewsCount || 128;

  // Generate embed code snippet
  const embedCodeSnippet = `<!-- Townraise Verified Local Trust Badge for ${businessName} -->
<div id="townraise-badge-container" 
  data-merchant="${selectedStorefront?.id || 'sf-oasis-roastery'}"
  data-theme="${themeMode}"
  data-widget="${widgetType}"
  data-accent="${accentColor}">
</div>
<script src="https://townraise.org/embed/widget.js" async defer></script>
<!-- /Townraise Verified Badge -->`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <Code2 className="w-3.5 h-3.5" />
            Website Embed & Trust Seal Studio
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            Embeddable Review & Trust Badges
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Generate 1-click live Google star ratings, floating trust seals, and direct review widgets to embed on client WordPress, Squarespace, or Shopify sites.
          </p>
        </div>

        <Link
          href="/dashboard/growth-kit"
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start"
        >
          <span>🚀 Printable Growth Kit</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Studio: Controls + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Widget Customizer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              1. Choose Merchant & Style
            </h3>

            {/* Merchant Selector */}
            <div>
              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1.5">
                Target Business
              </label>
              <select
                value={selectedStorefrontId}
                onChange={(e) => setSelectedStorefrontId(e.target.value)}
                className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
              >
                {storefronts.map((sf) => (
                  <option key={sf.id} value={sf.id}>
                    {sf.businessName} ({sf.town})
                  </option>
                ))}
              </select>
            </div>

            {/* Widget Layout Type */}
            <div>
              <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-2">
                Badge Layout Format
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'floating_badge', label: 'Floating Corner Seal', desc: 'Sticks to bottom-right corner' },
                  { id: 'star_ribbon', label: 'Header Star Ribbon', desc: 'Compact top bar banner' },
                  { id: 'review_carousel', label: 'Live Review Card', desc: 'Embedded carousel box' },
                  { id: 'tap_button', label: '1-Tap Review Pill', desc: 'Direct CTA button' },
                ].map((layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setWidgetType(layout.id as WidgetType)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      widgetType === layout.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md shadow-amber-500/10'
                        : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{layout.label}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{layout.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color & Theme Modes */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Theme Preset
                </label>
                <div className="flex items-center gap-2">
                  {(['dark', 'light', 'gold'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setThemeMode(t)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all border ${
                        themeMode === t
                          ? 'bg-white/20 border-white text-white'
                          : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Verified Trust Badge
                </label>
                <button
                  onClick={() => setShowVerifiedShield(!showVerifiedShield)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    showVerifiedShield
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-white/5 border-white/5 text-white/40'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{showVerifiedShield ? 'Shield Enabled' : 'Shield Hidden'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Copy Snippet Box */}
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                HTML Embed Snippet
              </h3>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
              >
                {copiedSnippet ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSnippet ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3 bg-black/60 border border-white/10 rounded-xl text-[11px] font-mono text-amber-200/90 overflow-x-auto leading-relaxed">
              {embedCodeSnippet}
            </pre>
            <p className="text-[10px] text-white/40">
              Compatible with WordPress, Shopify, Squarespace, Webflow, Wix, or custom HTML.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Live Preview (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" />
                Live Website Simulation
              </h3>
              <span className="text-[10px] font-mono text-white/40">Real-time render</span>
            </div>

            {/* Simulated Browser Window */}
            <div className="rounded-2xl border border-white/10 bg-[#12121d] overflow-hidden shadow-2xl relative min-h-[380px] flex flex-col justify-between p-4">
              
              {/* Browser Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-white/40 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                </div>
                <div className="bg-black/40 px-4 py-1 rounded-md text-[10px] font-mono text-white/60">
                  https://www.{businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
                </div>
                <div className="w-12" />
              </div>

              {/* Simulated Client Website Background Content */}
              <div className="space-y-3 opacity-40 select-none pointer-events-none">
                <div className="h-6 w-1/3 bg-white/20 rounded-md" />
                <div className="h-3 w-4/5 bg-white/10 rounded-md" />
                <div className="h-3 w-3/5 bg-white/10 rounded-md" />
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                  <div className="h-20 bg-white/5 rounded-xl border border-white/5" />
                </div>
              </div>

              {/* LIVE WIDGET RENDERING */}
              <div className="pt-6 relative z-10">
                
                {/* 1. Floating Corner Badge */}
                {widgetType === 'floating_badge' && (
                  <div className={`ml-auto max-w-[240px] p-3.5 rounded-2xl shadow-2xl border transition-all ${
                    themeMode === 'light' 
                      ? 'bg-white text-black border-slate-200' 
                      : themeMode === 'gold'
                      ? 'bg-gradient-to-br from-amber-950 to-black text-amber-300 border-amber-500/40'
                      : 'bg-[#0d0d16] text-white border-white/15'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-black">{rating}</span>
                    </div>
                    <div className="text-[11px] font-bold truncate">{businessName}</div>
                    <div className="text-[9px] opacity-60 mt-0.5 flex items-center justify-between">
                      <span>{reviewCount} Google Reviews</span>
                      {showVerifiedShield && (
                        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> Oasis Verified
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. Top Header Ribbon */}
                {widgetType === 'star_ribbon' && (
                  <div className={`w-full p-2.5 rounded-xl border flex items-center justify-between gap-2 shadow-lg ${
                    themeMode === 'light' 
                      ? 'bg-white text-black border-slate-200' 
                      : themeMode === 'gold'
                      ? 'bg-gradient-to-r from-amber-900/60 via-black to-amber-900/60 text-amber-300 border-amber-500/40'
                      : 'bg-[#0e0e18] text-white border-white/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-black">{rating} Rating</span>
                      <span className="text-[10px] opacity-60">• {reviewCount} Verified Reviews</span>
                    </div>

                    <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                      <span>Rate Us on Townraise</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* 3. Review Card Carousel */}
                {widgetType === 'review_carousel' && (
                  <div className={`p-4 rounded-2xl border shadow-xl ${
                    themeMode === 'light' 
                      ? 'bg-white text-black border-slate-200' 
                      : themeMode === 'gold'
                      ? 'bg-[#141008] text-amber-200 border-amber-500/30'
                      : 'bg-[#0d0d16] text-white border-white/15'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] opacity-50">Verified Diner • 2 days ago</span>
                    </div>
                    <p className="text-xs italic leading-relaxed opacity-80 mb-2">
                      "Best steak & cheese and homemade pizza in Carroll County! Tap stand right at our table was super convenient."
                    </p>
                    <div className="text-[10px] font-bold flex items-center justify-between opacity-70">
                      <span>– Sarah M. (Ossipee, NH)</span>
                      {showVerifiedShield && <span className="text-emerald-400 font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Townraise Certified</span>}
                    </div>
                  </div>
                )}

                {/* 4. Tap-To-Review Button */}
                {widgetType === 'tap_button' && (
                  <div className="text-center">
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-amber-500/20 flex items-center gap-2 mx-auto transform hover:scale-105 transition-all">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Leave {businessName} a 5-Star Review ({rating} ★)</span>
                    </button>
                  </div>
                )}

              </div>

              {/* Footer Indicator */}
              <div className="text-center pt-3 text-[9px] text-white/30 font-mono">
                Rendered with Townraise JavaScript Embed Core v2.4
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
