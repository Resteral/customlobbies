'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { 
  Megaphone, 
  Printer, 
  Share2, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  Smartphone, 
  MessageSquare, 
  Send, 
  Download, 
  Sparkles, 
  Compass, 
  Store, 
  Hammer, 
  Truck, 
  ShieldCheck, 
  Crown, 
  Flame, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Volume2, 
  FileText, 
  Building2, 
  ArrowRight,
  Layers,
  Check,
  Eye,
  Radio
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function SpreadTheWordPage() {
  const { towns, activeTown, currentUser } = useNfcStore();
  const [activeTab, setActiveTab] = useState<'flyers' | 'banners' | 'social' | 'qr_mobile' | 'pitches' | 'press'>('flyers');
  const [selectedTown, setSelectedTown] = useState<string>(activeTown?.fullName || 'Carroll County, NH');
  const [flyerType, setFlyerType] = useState<'general' | 'eats' | 'contractors' | 'scavenger'>('general');
  const [bannerStyle, setBannerStyle] = useState<'roadside_vinyl' | 'vertical_stand' | 'window_marquee'>('roadside_vinyl');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('https://townraise.org');
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentOrigin = window.location.origin;
      setShareUrl(currentOrigin);
      
      // Generate High-Res QR Code
      QRCode.toDataURL(currentOrigin, {
        width: 600,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then((url) => {
        setQrCodeDataUrl(url);
      }).catch((err) => {
        console.error('QR code error:', err);
      });
    }
  }, []);

  const handleCopy = (key: string, text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Social Sharing Actions
  const shareToFacebook = (text: string) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareToTwitter = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=500');
  };

  const shareToReddit = (title: string) => {
    const url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
    window.open(url, '_blank', 'width=800,height=600');
  };

  const shareViaSms = (text: string) => {
    window.location.href = `sms:?body=${encodeURIComponent(`${text} 👉 ${shareUrl}`)}`;
  };

  const shareViaEmail = (subject: string, body: string) => {
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${body}\n\nVisit: ${shareUrl}\nCoordinator: Sean Martin (508) 507-0305`)}`;
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-slate-100 pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-40 right-10 w-96 h-96 bg-amber-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">

        {/* ======================================================== */}
        {/* HERO HEADER */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/10">
            <Megaphone className="w-4 h-4 animate-pulse" />
            <span>Community Movement & Outreach Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase italic">
            Spread The Word <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
              Across Every Town
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Take back our local economy from corporate Silicon Valley middlemen. Print window posters, post town announcements, flash your on-the-road QR badge, and pitch local shop owners with 1-click tools.
          </p>

          {/* Quick Stat Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Middleman Commission
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-amber-400 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" /> Led by Sean Martin & Locals
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-indigo-400 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> 4x4 Mountain Courier Dispatch
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* NAVIGATION TAB CONTROLS */}
        {/* ======================================================== */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('flyers')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'flyers'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>1. Printable Flyers & Posters</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Storefront & Vinyl Banners</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'social'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>3. Social & Group Blasts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr_mobile')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'qr_mobile'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>4. Mobile QR Scanner</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pitches')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'pitches'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>5. 1-Minute Pitch Scripts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('press')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'press'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border border-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>6. Press & Town Notice</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PRINTABLE PHYSICAL FLYERS & POSTERS */}
        {/* ======================================================== */}
        {activeTab === 'flyers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Customizer Controls Bar */}
            <div className="p-6 rounded-3xl bg-[#0b0b12] border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1.5">
                  Select Town for Header:
                </label>
                <select
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="w-full bg-[#14141f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Carroll County & Lakes Region, NH">All Carroll County Towns (Regional)</option>
                  {towns.map((t) => (
                    <option key={t.id} value={t.fullName}>{t.fullName}</option>
                  ))}
                  <option value="Fryeburg & Western Maine">Fryeburg & Western Maine Border</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-amber-400 block mb-1.5">
                  Flyer Campaign Theme:
                </label>
                <select
                  value={flyerType}
                  onChange={(e) => setFlyerType(e.target.value as any)}
                  className="w-full bg-[#14141f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="general">👑 General Movement & Community Takeover</option>
                  <option value="eats">🥪 Local Roadside Diner & Food Courier</option>
                  <option value="contractors">🛠️ Trade Contractors & Local Craftsmen</option>
                  <option value="scavenger">🧭 Scavenger Hunts & Trail Passport</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print 8.5x11 Flyer (1-Click)</span>
                </button>
              </div>
            </div>

            {/* LIVE 8.5x11 PRINTABLE FLYER DISPLAY */}
            <div className="flex justify-center">
              <div 
                id="printable-flyer-area"
                className="w-full max-w-3xl bg-white text-black p-8 sm:p-12 rounded-3xl shadow-2xl border-4 border-black relative overflow-hidden font-sans print:p-0 print:border-0 print:shadow-none print:m-0"
                style={{ minHeight: '800px' }}
              >
                {/* Flyer Top Header Banner */}
                <div className="border-b-4 border-black pb-6 text-center space-y-2">
                  <div className="inline-block px-4 py-1 bg-black text-white text-xs font-black uppercase tracking-[0.3em] rounded-full">
                    Sovereign Local Economy Initiative
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black leading-none pt-1">
                    {flyerType === 'general' && `Keep ${selectedTown.split(',')[0]} Sovereign.`}
                    {flyerType === 'eats' && `Eat Local in ${selectedTown.split(',')[0]}.`}
                    {flyerType === 'contractors' && `Hire Local ${selectedTown.split(',')[0]} Trades.`}
                    {flyerType === 'scavenger' && `Explore ${selectedTown.split(',')[0]} Trails.`}
                  </h2>

                  <p className="text-sm sm:text-base font-bold text-neutral-800 max-w-xl mx-auto leading-tight">
                    {flyerType === 'general' && "Support independent merchants, diners, and craftsmen without mega-corporation cuts. Zero commission local network & courier dispatch."}
                    {flyerType === 'eats' && "Direct online ordering for roadside diners, BBQ smokehouses, and pizzerias. 100% goes to local kitchen staff and drivers."}
                    {flyerType === 'contractors' && "Connect directly with local carpenters, tree surgeons, electricians, and plow operators without middleman fees."}
                    {flyerType === 'scavenger' && "Discover historic hidden checkpoints, solve local riddles, and stamp your digital passport for mystery merchant discounts."}
                  </p>
                </div>

                {/* Main 2-Column Body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 items-center border-b-4 border-black">
                  
                  {/* Left Column: Bullet Points & Info */}
                  <div className="space-y-4">
                    <div className="space-y-3 text-xs sm:text-sm font-semibold text-neutral-900">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                        <div>
                          <strong className="block text-black font-black uppercase">0% Middleman Fees</strong>
                          <span>Local businesses keep 100% of their earnings. No DoorDash/Angi cuts.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                        <div>
                          <strong className="block text-black font-black uppercase">Express 4x4 Mountain Courier</strong>
                          <span>Food, groceries, firewood, and hardware delivered directly to your door.</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                        <div>
                          <strong className="block text-black font-black uppercase">Install Directly on Phone</strong>
                          <span>No app store needed. Instant 1-tap home app with sound chimes and notifications.</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-neutral-100 rounded-2xl border-2 border-black space-y-1 text-xs">
                      <div className="font-black uppercase tracking-wider text-black">Local Vanguard Lead:</div>
                      <div className="font-bold text-neutral-900">Sean Martin • Effingham Base</div>
                      <div className="font-mono text-black font-black">📞 (508) 507-0305 | frijj555@gmail.com</div>
                    </div>
                  </div>

                  {/* Right Column: Massive High-Contrast QR Code */}
                  <div className="flex flex-col items-center justify-center text-center p-4 bg-neutral-100 rounded-3xl border-4 border-black space-y-2">
                    <div className="text-[11px] font-black uppercase tracking-widest text-black">
                      Scan with Phone Camera:
                    </div>
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="Townraise QR Code" 
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-xl border-2 border-black" 
                      />
                    ) : (
                      <div className="w-48 h-48 bg-black flex items-center justify-center text-white">QR Code</div>
                    )}
                    <div className="text-xs font-mono font-black text-black">
                      townraise.org
                    </div>
                  </div>
                </div>

                {/* Bottom Tear-Away Phone Number Tabs */}
                <div className="pt-6">
                  <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">
                    ✂️ Tear Off A Tag To Save Local Courier Number ✂️
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 border-t-2 border-dashed border-black pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="border-l border-dashed border-black pl-1 text-center font-mono py-1 flex flex-col justify-between">
                        <span className="text-[8px] font-black uppercase leading-tight">Townraise</span>
                        <span className="text-[9px] font-black text-black leading-tight">508-507-0305</span>
                        <span className="text-[7px] text-neutral-600">Scan/Call</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRINTABLE STOREFRONT & VINYL BANNERS */}
        {/* ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Banner Controls Bar */}
            <div className="p-6 rounded-3xl bg-[#0b0b12] border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  1. Select Target Town / Area
                </label>
                <select
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {towns.map((t) => (
                    <option key={t.id} value={t.fullName}>
                      {t.fullName}
                    </option>
                  ))}
                  <option value="Carroll County, NH">Carroll County, NH (All Towns)</option>
                  <option value="Western Maine & Lakes">Western Maine & Lakes Region</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  2. Banner Ratio & Style
                </label>
                <select
                  value={bannerStyle}
                  onChange={(e) => setBannerStyle(e.target.value as any)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="roadside_vinyl">Roadside Vinyl Banner (6ft × 2ft Wide)</option>
                  <option value="vertical_stand">Storefront Pull-Up Stand (3ft × 6ft Tall)</option>
                  <option value="window_marquee">Storefront Window Marquee (4ft × 2ft)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-4 md:pt-0">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save Banner PDF</span>
                </button>
              </div>
            </div>

            {/* Banner Canvas Container */}
            <div className="flex justify-center overflow-x-auto p-4 bg-black/40 rounded-3xl border border-white/10">
              
              {/* STYLE A: ROADSIDE 6x2 VINYL BANNER */}
              {bannerStyle === 'roadside_vinyl' && (
                <div 
                  id="printable-banner"
                  className="w-full max-w-5xl bg-[#09090e] border-4 border-amber-400 rounded-2xl p-6 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                  style={{ minHeight: '320px' }}
                >
                  {/* Neon Banner Edge Stripes */}
                  <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-300" />
                  <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-b from-amber-400 via-orange-500 to-amber-300" />

                  {/* Left Column: Huge Headline & Messaging */}
                  <div className="space-y-4 pl-4 flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 text-black font-mono font-black text-xs uppercase tracking-widest rounded-lg">
                      <Truck className="w-4 h-4" />
                      <span>4×4 COURIER & LOCAL FOOD DELIVERY DISPATCH</span>
                    </div>

                    <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                      ORDER LOCAL. <br />
                      <span className="text-amber-400">TOWNRAISE {selectedTown.toUpperCase()}</span>
                    </h2>

                    <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider max-w-xl">
                      0% Commission Local Food, Smoke Shop, Artisan Woodcraft & Hardware Delivery straight to your door.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Hotline / Sean Martin: <strong className="text-amber-400">(603) 986-7104</strong></span>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-white font-bold">{shareUrl.replace('https://', '')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Massive High-Contrast QR Code */}
                  <div className="flex flex-col items-center justify-center p-5 bg-white text-black rounded-2xl shadow-2xl shrink-0 border-2 border-amber-400 text-center space-y-2">
                    {qrCodeDataUrl && (
                      <img
                        src={qrCodeDataUrl}
                        alt="Townraise QR Code"
                        className="w-40 h-40 object-contain rounded-lg"
                      />
                    )}
                    <span className="font-mono font-black text-[11px] uppercase tracking-widest text-black">
                      SCAN TO ORDER & EXPLORE
                    </span>
                  </div>
                </div>
              )}

              {/* STYLE B: VERTICAL STOREFRONT PULL-UP STAND (3x6) */}
              {bannerStyle === 'vertical_stand' && (
                <div 
                  id="printable-banner"
                  className="w-full max-w-md bg-[#09090e] border-4 border-indigo-500 rounded-3xl p-8 text-white shadow-2xl space-y-6 text-center relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black mx-auto shadow-xl">
                    ⚡
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase tracking-widest">
                      SOVEREIGN COMMERCE NODE
                    </span>
                    <h2 className="text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
                      TAP PHONE HERE <br />
                      <span className="text-amber-400">INSTANT LOCAL ACCESS</span>
                    </h2>
                    <p className="text-xs text-zinc-300 font-mono">
                      Serving {selectedTown} • 5★ Google Review Boosters • Restaurant Menus • Scavenger Hunts
                    </p>
                  </div>

                  <div className="p-6 bg-white rounded-2xl text-black inline-block shadow-2xl border-2 border-amber-400">
                    {qrCodeDataUrl && (
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="w-48 h-48 object-contain mx-auto"
                      />
                    )}
                    <p className="font-mono font-black text-xs uppercase tracking-wider mt-2">
                      Scan with Phone Camera
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono space-y-1">
                    <p className="text-amber-400 font-bold">Sean Martin Lead Vanguard Dispatch</p>
                    <p className="text-zinc-400">Phone: (603) 986-7104 • Web: {shareUrl.replace('https://', '')}</p>
                  </div>
                </div>
              )}

              {/* STYLE C: STOREFRONT WINDOW MARQUEE (4x2) */}
              {bannerStyle === 'window_marquee' && (
                <div 
                  id="printable-banner"
                  className="w-full max-w-4xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 text-black p-8 sm:p-12 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border-4 border-black"
                >
                  <div className="space-y-3 flex-1">
                    <span className="px-3 py-1 bg-black text-amber-400 font-mono font-black text-xs uppercase tracking-widest rounded-md">
                      VERIFIED INDEPENDENT MERCHANT
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter leading-none text-black">
                      SUPPORT LOCAL {selectedTown.toUpperCase()}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black/90">
                      0% Commission • Delivered by Local Mountain Drivers • Powered by Townraise
                    </p>
                  </div>

                  <div className="p-4 bg-black text-white rounded-2xl flex flex-col items-center text-center shadow-xl shrink-0 space-y-2">
                    {qrCodeDataUrl && (
                      <img
                        src={qrCodeDataUrl}
                        alt="QR Code"
                        className="w-32 h-32 bg-white p-1.5 rounded-lg"
                      />
                    )}
                    <span className="font-mono font-black text-[10px] text-amber-400 uppercase">
                      SCAN FOR MENU & PASS
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SOCIAL MEDIA & COMMUNITY GROUP BLASTS */}
        {/* ======================================================== */}
        {activeTab === 'social' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0b0b12] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                  1-Click Community Board & Group Blasts
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Post these pre-formatted announcements into your local Facebook Groups (e.g. <em>Ossipee Community, Effingham NH, Carroll County NH News</em>), Nextdoor, and Reddit.
                </p>
              </div>

              {/* Template 1: Carroll County General Announcement */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Facebook & Nextdoor
                    </span>
                    <h4 className="text-xs font-bold text-white">General Local Movement Post</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('t1', `🚀 Big news for Carroll County! We just launched Townraise (https://townraise.org) — a 100% independent, zero-commission network uniting local diners, trade contractors, farm stands, and roadside shops.\n\nUnlike DoorDash or corporate platforms taking 30% cuts, our local network keeps 100% of dollars in our towns. We also have express 4x4 mountain courier delivery and tourist scavenger hunts with real discounts.\n\nCheck out the live town lattice or order delivery straight to your door: https://townraise.org\nQuestions or local business onboarding? Call/text Sean Martin: (508) 507-0305.`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedKey === 't1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 't1' ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06060a] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                  🚀 Big news for Carroll County! We just launched Townraise — a 100% independent, zero-commission network uniting local diners, trade contractors, farm stands, and roadside shops.
                  <br /><br />
                  Unlike DoorDash taking 30% cuts, our local network keeps 100% of dollars in our towns with express 4x4 courier dispatch.
                </div>

                {/* 1-Click Launch Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => shareToFacebook(`🚀 Big news for Carroll County! We launched Townraise (https://townraise.org) — zero-commission local food delivery, trade contractors, and local business directory.`)}
                    className="px-3 py-1.5 rounded-xl bg-[#1877F2] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" /> Share to Facebook
                  </button>

                  <button
                    type="button"
                    onClick={() => shareToReddit(`Townraise: A zero-commission sovereign local network & 4x4 courier dispatch launched for Carroll County, NH`)}
                    className="px-3 py-1.5 rounded-xl bg-[#FF4500] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" /> Post on Reddit
                  </button>

                  <button
                    type="button"
                    onClick={() => shareViaSms(`Hey! Check out Townraise for local Carroll County restaurant delivery, trade contractors, and merchant storefronts:`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3 h-3" /> Send SMS Text
                  </button>
                </div>
              </div>

              {/* Template 2: Local Foodies & Roadside Grills */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      Food & Dining
                    </span>
                    <h4 className="text-xs font-bold text-white">Local Roadside Grills & Eateries Post</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('t2', `🍔 Craving fresh steak & cheese subs, stone-baked pizza, or slow-smoked BBQ in Carroll County? You can now order directly from local favorites like PNB Eats Roadside Grill, Smoke World, and Yankee Smokehouse with direct local courier delivery.\n\nSupport our local restaurant crews without corporate markup:\n👉 https://townraise.org/eats\n\nCourier dispatch by Sean Martin: (508) 507-0305.`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedKey === 't2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 't2' ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06060a] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                  🍔 Craving fresh steak & cheese subs or slow-smoked BBQ in Carroll County? Order direct with local 4x4 courier delivery without corporate DoorDash markup!
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => shareToFacebook(`🍔 Order direct from Carroll County local roadside grills & smokehouse BBQ with express local courier delivery: https://townraise.org/eats`)}
                    className="px-3 py-1.5 rounded-xl bg-[#1877F2] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" /> Share to Facebook
                  </button>

                  <button
                    type="button"
                    onClick={() => shareViaSms(`Check out the local Carroll County food ordering menu on Townraise:`)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3 h-3" /> Send SMS Text
                  </button>
                </div>
              </div>

              {/* Template 3: Trade Contractors & Handymen */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Contractors & Trades
                    </span>
                    <h4 className="text-xs font-bold text-white">Local Tradesmen & Handyman Invitation</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('t3', `Attention Carroll County contractors, carpenters, tree service pros, electricians, and plumbers:\n\nStop paying hundreds for lead fees on Angi or Thumbtack. You can now list your trade services, before/after showcases, and receive direct homeowner job requests on Townraise for 100% free.\n\nRegister your trade profile here: https://townraise.org/work\nDirect contact: Sean Martin (508) 507-0305.`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {copiedKey === 't3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 't3' ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#06060a] border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                  Attention Carroll County contractors: Stop paying lead fees on Angi. List your services and receive direct homeowner requests on Townraise for 100% free: https://townraise.org/work
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ON-THE-ROAD MOBILE QR SCANNER MODE */}
        {/* ======================================================== */}
        {activeTab === 'qr_mobile' && (
          <div className="max-w-xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
            <div className="p-8 rounded-3xl bg-[#0b0b12] border-2 border-amber-500/40 shadow-2xl space-y-6">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>On-The-Road Phone Scanner Mode</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase italic">
                  Show This Screen To Anyone
                </h3>
                <p className="text-xs text-slate-300">
                  Hold up this QR code in person at diners, gas stations, hardware stores, or craft fairs so people can scan it instantly!
                </p>
              </div>

              {/* Giant QR Code Display */}
              <div className="p-6 bg-white rounded-3xl border-4 border-black max-w-xs mx-auto shadow-2xl">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Townraise QR Code" className="w-full h-auto object-contain rounded-xl" />
                ) : (
                  <div className="w-64 h-64 bg-black flex items-center justify-center text-white">QR Code</div>
                )}
                <div className="text-black font-mono font-black text-xs pt-3">
                  townraise.org
                </div>
              </div>

              {/* Direct Info */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs font-mono">
                <div className="text-amber-400 font-bold text-sm">Sean Martin • Oasis Vanguard & Courier</div>
                <div className="text-slate-300">📞 (508) 507-0305 | ✉️ frijj555@gmail.com</div>
                <div className="text-[11px] text-slate-400">Effingham • Ossipee • Freedom • Wolfeboro • Conway</div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleCopy('qrlink', shareUrl)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedKey === 'qrlink' ? 'Link Copied!' : 'Copy Direct Share Link'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: 1-MINUTE ELEVATOR PITCH SCRIPTS */}
        {/* ======================================================== */}
        {activeTab === 'pitches' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0b0b12] border border-white/10 space-y-6">
              
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                  1-Minute Verbal Pitch Scripts For Sean & Local Ambassadors
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Walking into a diner, smoke shop, hardware store, or town meeting? Use these clear, battle-tested talking points.
                </p>
              </div>

              {/* Script 1: For Restaurant & Diner Owners */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm font-bold text-white">Pitching Restaurant & Store Owners (e.g. PNB Eats, Pizza, BBQ)</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('p1', `"Hey, my name is Sean Martin — I live right here in Carroll County. I'm building Townraise, an independent local network for our towns. Unlike DoorDash or UberEats charging you 30% per order, Townraise charges 0% commission. We set you up with custom programmable NFC Google Review stands and table menu ordering, and I personally coordinate 4x4 courier delivery for your customers. It's free to get listed today."`)}
                    className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'p1' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#06060a] border border-white/5 text-xs text-slate-200 leading-relaxed font-sans italic">
                  "Hey! My name is Sean Martin — I live right here in Carroll County. I run Townraise, an independent local ordering & courier network for our towns. Unlike DoorDash charging 30% per order, our system has <strong>zero commission</strong>. We set you up with custom tap-to-order menu stands, boost your 5-star Google reviews, and provide direct 4x4 courier delivery for your customers. It takes 60 seconds to get your menu live."
                </div>
              </div>

              {/* Script 2: For Trade Contractors (Carpenters, Tree Care, Plumbers) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Pitching Trade Contractors & Craftsmen</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('p2', `"Hey, are you taking on any new residential projects around Carroll County? We built Townraise where local homeowners post carpentry, tree clearing, electrical, and plowing jobs. You get listed with verified photo showcases of your past work and receive direct phone requests with zero lead fees. Check it out at townraise.org/work."`)}
                    className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'p2' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#06060a] border border-white/5 text-xs text-slate-200 leading-relaxed font-sans italic">
                  "Are you taking on new residential projects in Carroll County? We created Townraise where local homeowners can browse your before/after project photos and request quotes directly to your phone. <strong>Zero lead fees</strong>, no Angi commissions. You can claim your trade profile today at townraise.org/work."
                </div>
              </div>

              {/* Script 3: For Neighbors & Residents */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-bold text-white">Pitching Neighbors, Campers & Townsfolk</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('p3', `"Have you checked out Townraise on your phone? It lets you order food directly from local roadside diners, get 4x4 mountain delivery (even to lake docks and campsites), hire verified local handymen, and explore tourist scavenger hunts with reward discounts across Carroll County. You can put it right on your phone home screen like an app: townraise.org."`)}
                    className="px-3 py-1 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'p3' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#06060a] border border-white/5 text-xs text-slate-200 leading-relaxed font-sans italic">
                  "Have you installed Townraise on your phone? It lets you order food directly from local diners, get 4x4 mountain delivery to your doorstep or lake dock, hire local contractors, and stamp digital scavenger hunt passports for discounts across Carroll County. Just open townraise.org on your phone!"
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: TOWN HALL & PRESS RELEASE NOTICE */}
        {/* ======================================================== */}
        {activeTab === 'press' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
            <div className="p-6 rounded-3xl bg-[#0b0b12] border border-white/10 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                    Official Press Release & Civic Bulletin Notice
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Send to local newspapers (<em>Conway Daily Sun, Carroll County Independent</em>), Chambers of Commerce, and Town Selectboards.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => shareViaEmail('Townraise: Launch of Independent Carroll County Local Commerce Network', `FOR IMMEDIATE RELEASE:\n\nTownraise Launches Sovereign Local Network & 4x4 Courier Dispatch for Carroll County & Western Maine\n\nEffingham, NH — A new decentralized community platform, Townraise (https://townraise.org), has officially launched to empower independent merchants, roadside diners, trade contractors, and residents across Carroll County.\n\nFounded by local organizer Sean Martin, Townraise provides zero-commission storefronts, physical NFC smart review cards, and direct 4x4 mountain courier dispatch.\n\nLearn more at https://townraise.org or contact Sean Martin at (508) 507-0305 / frijj555@gmail.com.`)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer self-start shrink-0"
                >
                  <Mail className="w-3.5 h-3.5" /> Email Local Papers
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white text-black font-serif text-xs leading-relaxed space-y-3 shadow-inner">
                <div className="font-sans font-black text-xs uppercase tracking-widest text-neutral-600 border-b pb-2">
                  FOR IMMEDIATE RELEASE • CARROLL COUNTY, NH
                </div>
                
                <h4 className="font-sans font-black text-base text-black uppercase">
                  Decentralized Local Commerce & 4x4 Courier Network "Townraise" Launches Across Carroll County & Lakes Region
                </h4>

                <p>
                  <strong>EFFINGHAM, NH</strong> — Today marks the official launch of <strong>Townraise</strong> (<a href="https://townraise.org" className="underline font-bold text-blue-800">townraise.org</a>), a sovereign local commerce lattice designed to unite independent merchants, roadside eateries, carpenters, tree service specialists, and couriers under one unified system.
                </p>

                <p>
                  Built by local founder Sean Martin, Townraise operates on a zero-commission model, enabling diners and shoppers to order takeout and local products without paying 30% markups to out-of-state tech corporations. The platform also equips brick-and-mortar storefronts with programmable NFC Google Review stands to bolster their online reputation.
                </p>

                <p>
                  Residents can also participate in town-by-town scavenger hunts, stamping digital passports at historic covered bridges, bakeries, and artisan shops to earn community rewards.
                </p>

                <div className="border-t pt-3 font-sans text-[11px] text-neutral-700">
                  <strong>Media & Merchant Inquiries:</strong><br />
                  Sean Martin, Founding Vanguard Lead<br />
                  Phone: (508) 507-0305 | Email: frijj555@gmail.com<br />
                  Platform URL: https://townraise.org
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
