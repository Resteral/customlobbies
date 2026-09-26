'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Store, Plus, ExternalLink, QrCode, Edit3, 
  Trash2, Globe, Truck, CheckCircle2, Clock, 
  MapPin, Phone, ArrowRight, Download, Sparkles,
  Palette, LayoutGrid
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import StorefrontCustomizerStudio from '@/components/StorefrontCustomizerStudio';
import QRCode from 'qrcode';

export default function MerchantStorefrontDashboardPage() {
  const { storefronts, towns } = useNfcStore();

  const [viewMode, setViewMode] = useState<'customizer' | 'grid'>('customizer');
  const [selectedStorefrontId, setSelectedStorefrontId] = useState<string>(storefronts[0]?.id || '');
  const [activeQrModalStorefront, setActiveQrModalStorefront] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState('');

  const handleOpenQrModal = async (sf: any) => {
    setActiveQrModalStorefront(sf);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
    const siteUrl = `${origin}/site/${sf.slug}`;
    const url = await QRCode.toDataURL(siteUrl, {
      width: 380,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });
    setQrDataUrl(url);
  };

  const handleOpenCustomizer = (sfId: string) => {
    setSelectedStorefrontId(sfId);
    setViewMode('customizer');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top View Mode Switcher */}
      <div className="flex items-center justify-between gap-4 p-2 bg-white/5 border border-white/10 rounded-2xl flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('customizer')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === 'customizer'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 Live Visual Profile Customizer</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === 'grid'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>📋 All Business Websites ({storefronts.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/create-storefront"
            className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch New Website</span>
          </Link>
        </div>
      </div>

      {/* Render Customizer Studio */}
      {viewMode === 'customizer' ? (
        <StorefrontCustomizerStudio initialStorefrontId={selectedStorefrontId} />
      ) : (
        /* Render Grid View */
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-600/10 to-transparent border border-white/10 relative overflow-hidden">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Merchant Microsite & Storefront Manager
              </div>
              <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
                My Business <span className="text-amber-400">Websites & Menus</span>
              </h1>
              <p className="text-zinc-400 text-sm max-w-2xl">
                Manage your standalone branded delivery websites, menu catalogs, delivery prep times, and in-store tabletop QR codes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/csv-importer"
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-2xl text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>📄 Bulk CSV Importer</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {storefronts.map((sf) => (
              <div
                key={sf.id}
                className="bg-[#0a0a0f] border border-white/5 hover:border-amber-400/30 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all group hover:shadow-2xl shadow-lg relative overflow-hidden"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shrink-0">
                        {sf.logoEmoji}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                            {sf.businessName}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold uppercase">
                            Live Site
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{sf.town}, {sf.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-amber-400 font-bold">
                      {sf.products.length} Products
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {sf.tagline}
                  </p>

                  {/* Badges preview */}
                  {(sf.badges || []).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(sf.badges || []).slice(0, 3).map((badge, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-zinc-300">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Public Subdomain URL */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500 truncate">townraise.org/site/{sf.slug}</span>
                    <Link
                      href={`/site/${sf.slug}`}
                      target="_blank"
                      className="text-amber-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Telemetry Row */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="p-2.5 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Delivery Fee</span>
                      <span className="font-bold text-white">${sf.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Prep Time</span>
                      <span className="font-bold text-white truncate block">{sf.estimatedPrepTime}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-zinc-500 uppercase block">Min Order</span>
                      <span className="font-bold text-white">${sf.minOrder.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenCustomizer(sf.id)}
                      className="px-3.5 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Customize</span>
                    </button>

                    <button
                      onClick={() => handleOpenQrModal(sf)}
                      className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-amber-400" />
                      <span>Table QR</span>
                    </button>
                  </div>

                  <Link
                    href={`/site/${sf.slug}`}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
                  >
                    <span>Visit Site</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabletop QR Code Modal */}
      {activeQrModalStorefront && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 text-center shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>In-Store Tabletop Menu Stand</span>
              </div>
              <button
                onClick={() => setActiveQrModalStorefront(null)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase">
                {activeQrModalStorefront.businessName}
              </h3>
              <p className="text-xs text-zinc-400">
                Place on counters or tables so customers can scan with any phone to view the menu & order delivery.
              </p>
            </div>

            {qrDataUrl && (
              <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto">
                <img src={qrDataUrl} alt="Storefront QR" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={qrDataUrl}
                download={`${activeQrModalStorefront.slug}-table-qr.png`}
                className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Printable PNG Stand</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

