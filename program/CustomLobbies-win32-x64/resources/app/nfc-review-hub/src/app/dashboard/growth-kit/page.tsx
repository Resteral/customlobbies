'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Megaphone, 
  Sparkles, 
  QrCode, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Smartphone, 
  Printer, 
  Instagram, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function GrowthKitPage() {
  const { cards, storefronts, activeTown } = useNfcStore();
  const [selectedBusiness, setSelectedBusiness] = useState(storefronts[0]?.businessName || 'PNB Eats Roadside Grill');
  const [customPromo, setCustomPromo] = useState('Tap table stand or leave a 5-star Google review for 10% off your next meal!');
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(key);
    setTimeout(() => setCopiedTemplate(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <Megaphone className="w-3.5 h-3.5" />
            Merchant Marketing & Viral Growth Toolkit
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            Local Growth & Promo Generator
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Download printable QR table displays, window stickers, and copy ready-to-send SMS review campaigns.
          </p>
        </div>

        <Link
          href="/dashboard/admin"
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start"
        >
          <span>👑 Admin Automation Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Select Merchant */}
      <div className="p-6 bg-[#0d0d12] border border-white/10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
            Select Your Business Location
          </label>
          <select
            value={selectedBusiness}
            onChange={(e) => setSelectedBusiness(e.target.value)}
            className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          >
            {storefronts.map((s) => (
              <option key={s.id} value={s.businessName}>{s.businessName} ({s.town})</option>
            ))}
            <option value="Pine Cove Waterfront Chalet">Pine Cove Waterfront Chalet (Freedom)</option>
            <option value="Walt's Artisan Woodcraft">Walt&apos;s Artisan Woodcraft (Effingham)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
            Custom Review Incentive Offer
          </label>
          <input
            type="text"
            value={customPromo}
            onChange={(e) => setCustomPromo(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* 3 Growth Tool Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Printable QR Table Tent Preview */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Printer className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black text-white">Printable Table Tent & Display</h3>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-6 font-light">
              Foldable table tent graphic with smart QR code and NFC tap target to place on dining tables, checkouts, or cabin kitchen counters.
            </p>

            {/* Mock Visual Table Tent */}
            <div className="p-6 bg-gradient-to-b from-[#181824] to-[#0d0d18] border border-amber-400/30 rounded-2xl text-center mb-6 shadow-xl relative overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                Touch Phone Here
              </span>
              <h4 className="text-base font-black text-white mt-1 mb-2">{selectedBusiness}</h4>
              <div className="w-24 h-24 bg-white p-2 rounded-xl mx-auto mb-3 shadow-lg flex items-center justify-center">
                <QrCode className="w-full h-full text-black" />
              </div>
              <p className="text-[10px] text-white/70 font-medium max-w-[200px] mx-auto leading-tight">
                {customPromo}
              </p>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download & Print PDF Tent</span>
          </button>
        </div>

        {/* SMS Review Blast Templates */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white">Automated SMS Blast Templates</h3>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-6 font-light">
              High-converting text message copy designed to send to recent pickup diners, catering clients, or guests.
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-white/80 space-y-2">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block">Template A: Post-Delivery Thank You</span>
                <p className="font-mono text-[11px] text-white/70 leading-relaxed">
                  &quot;Hi from {selectedBusiness}! Hope you loved your order today. Tap our 1-click link to leave a 5-star Google review & get $5 off next time: https://townraise.org/tap/{selectedBusiness.toLowerCase().replace(/[^a-z0-9]/g, '')}&quot;
                </p>
                <button
                  onClick={() => handleCopyText('sms-a', `Hi from ${selectedBusiness}! Hope you loved your order today. Tap our 1-click link to leave a 5-star Google review & get $5 off next time: https://townraise.org/directory`)}
                  className="text-[10px] font-bold text-amber-300 flex items-center gap-1 hover:text-amber-200"
                >
                  {copiedTemplate === 'sms-a' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate === 'sms-a' ? 'Copied to Clipboard' : 'Copy SMS Copy'}</span>
                </button>
              </div>

              <div className="p-4 bg-black/40 rounded-2xl border border-white/5 text-xs text-white/80 space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">Template B: Weekend Special VIP</span>
                <p className="font-mono text-[11px] text-white/70 leading-relaxed">
                  &quot;VIP Special from {selectedBusiness}: This weekend only, order takeout on Townraise and receive free delivery + double loyalty points! https://townraise.org/eats&quot;
                </p>
                <button
                  onClick={() => handleCopyText('sms-b', `VIP Special from ${selectedBusiness}: This weekend only, order takeout on Townraise and receive free delivery + double loyalty points! https://townraise.org/eats`)}
                  className="text-[10px] font-bold text-indigo-300 flex items-center gap-1 hover:text-indigo-200"
                >
                  {copiedTemplate === 'sms-b' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate === 'sms-b' ? 'Copied to Clipboard' : 'Copy SMS Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/services"
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
          >
            <span>Activate 24/7 Auto-SMS Bot ➔</span>
          </Link>
        </div>

        {/* Social Media & Instagram Story Badge */}
        <div className="bg-[#0d0d12] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="w-5 h-5 text-pink-400" />
              <h3 className="text-base font-black text-white">Social Media & Story Promo</h3>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-6 font-light">
              Post ready graphics to your Instagram and Facebook stories with swipe-up review links.
            </p>

            <div className="p-6 bg-gradient-to-tr from-pink-900/30 via-[#181824] to-indigo-900/30 border border-pink-500/20 rounded-2xl text-center mb-6 shadow-xl">
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <h4 className="text-sm font-black text-white mb-1">Love our food & service?</h4>
              <p className="text-[11px] text-white/70 max-w-xs mx-auto mb-3">
                Tap our bio link to leave a 5-star Google review & enter our monthly \$50 gift card raffle!
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/30">
                #CarrollCountyLocal #{selectedBusiness.toLowerCase().replace(/[^a-z0-9]/g, '')}
              </div>
            </div>
          </div>

          <button
            onClick={() => handleCopyText('social-post', `Love our food at ${selectedBusiness}? ⭐⭐⭐⭐⭐ Tap our link to leave a Google review and get $5 off your next order: https://townraise.org/directory #CarrollCountyEats`)}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {copiedTemplate === 'social-post' ? <CheckCircle2 className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedTemplate === 'social-post' ? 'Copied Caption!' : 'Copy Instagram Caption'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
