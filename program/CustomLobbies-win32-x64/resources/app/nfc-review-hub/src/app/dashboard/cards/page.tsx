'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig } from '@/lib/types';
import { 
  CreditCard, Plus, Edit2, Trash2, QrCode, ExternalLink, 
  Radio, CheckCircle2, ShieldCheck, Download, Sparkles, X, Save, Image as ImageIcon
} from 'lucide-react';
import QRCode from 'qrcode';
import ImageUpload from '@/components/ImageUpload';
import AdminNfcCardProgrammerModal from '@/components/AdminNfcCardProgrammerModal';
import { Key } from 'lucide-react';

export default function CardsFleetPage() {
  const { cards, addCard, updateCard, deleteCard } = useNfcStore();
  const [editingCard, setEditingCard] = useState<NfcCardConfig | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAdminProgrammerOpen, setIsAdminProgrammerOpen] = useState(false);
  const [selectedAdminCard, setSelectedAdminCard] = useState<NfcCardConfig | null>(null);
  const [activeQrModalCard, setActiveQrModalCard] = useState<NfcCardConfig | null>(null);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string | null>(null);

  // Form State
  const [cardName, setCardName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [mode, setMode] = useState<NfcCardConfig['mode']>('smart_funnel');
  const [thresholdStars, setThresholdStars] = useState(4);
  const [assignedStaff, setAssignedStaff] = useState('');
  const [assignedLocation, setAssignedLocation] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  const [logoUrl, setLogoUrl] = useState('⭐');

  const openCreateModal = () => {
    setIsCreating(true);
    setEditingCard(null);
    setCardName('Counter Stand Beacon');
    setBusinessName(cards[0]?.businessName || 'Oasis Specialty Store');
    setGoogleReviewUrl(cards[0]?.googleReviewUrl || 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4');
    setMode('smart_funnel');
    setThresholdStars(4);
    setAssignedStaff('Dave M.');
    setAssignedLocation('Main Register');
    setCustomHeadline('How was your experience today?');
    setLogoUrl('⭐');
  };

  const openEditModal = (c: NfcCardConfig) => {
    setEditingCard(c);
    setIsCreating(false);
    setCardName(c.cardName);
    setBusinessName(c.businessName);
    setGoogleReviewUrl(c.googleReviewUrl);
    setMode(c.mode);
    setThresholdStars(c.thresholdStars);
    setAssignedStaff(c.assignedStaff || '');
    setAssignedLocation(c.assignedLocation || '');
    setCustomHeadline(c.customHeadline || '');
    setLogoUrl(c.logoUrl || '⭐');
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCard) {
      updateCard(editingCard.id, {
        cardName,
        businessName,
        googleReviewUrl,
        mode,
        thresholdStars,
        assignedStaff,
        assignedLocation,
        customHeadline,
        logoUrl
      });
      setEditingCard(null);
    } else {
      addCard({
        cardName,
        businessName,
        googleReviewUrl,
        mode,
        thresholdStars,
        assignedStaff,
        assignedLocation,
        customHeadline,
        logoUrl,
        active: true,
      });
      setIsCreating(false);
    }
  };

  const handleOpenQr = async (card: NfcCardConfig) => {
    setActiveQrModalCard(card);
    const tapUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tap/${card.id}`;
    try {
      const url = await QRCode.toDataURL(tapUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setGeneratedQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
            Hardware Beacon Management
          </span>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
            NFC Card & Stand Fleet
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedAdminCard(null);
              setIsAdminProgrammerOpen(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Key className="w-4 h-4" />
            <span>⚡ Program Admin / Staff Pass</span>
          </button>
          <Link
            href="/custom-nfc"
            className="px-5 py-3 bg-gradient-to-r from-amber-400/20 to-orange-500/20 hover:bg-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-2xl border border-amber-400/40 transition-all flex items-center gap-2"
          >
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>NFC Studio</span>
          </Link>
          <Link
            href="/dashboard/programmer"
            className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-white/10 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Town Programmer</span>
          </Link>
          <button
            onClick={openCreateModal}
            className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Beacon</span>
          </button>
        </div>
      </div>

      {/* All Things You Can Do Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#121220] to-[#0a0a14] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>15+ Hardware Super-Capabilities</span>
          </div>
          <h2 className="text-xl font-black italic uppercase text-white">
            What All Can You Do With Your NFC Cards?
          </h2>
          <p className="text-xs text-zinc-300 font-light max-w-2xl">
            From 5-star Google review funnels, contactless dine-in menus, 1-tap courier dispatch, and cashless PayPal payments (<span className="text-amber-400 font-mono">seanhse97@gmail.com</span>) to instant guest Wi-Fi auto-connect and pet collar finders.
          </p>
        </div>

        <Link
          href="/custom-nfc"
          className="px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <span>Explore All 15 Capabilities & Studio</span>
          <Radio className="w-4 h-4 text-black animate-pulse" />
        </Link>
      </div>

      {/* Cards Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-400/40 transition-all space-y-6 group"
          >
            {/* Top Card Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                    {card.logoUrl || '⭐'}
                  </div>
                  <div>
                    <h3 className="font-black italic text-white text-base leading-snug">{card.cardName}</h3>
                    <p className="text-[10px] font-mono text-zinc-400">{card.businessName}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[8px] font-mono font-bold uppercase border ${
                  card.active
                    ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}>
                  {card.active ? '● Active' : '○ Paused'}
                </span>
              </div>

              {/* Mode & Staff Tag */}
              <div className="flex flex-wrap gap-2 text-[9px] font-mono">
                <span className={`px-2.5 py-1 rounded-lg border ${
                  card.mode === 'smart_funnel'
                    ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    : 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                }`}>
                  {card.mode === 'smart_funnel' ? 'Smart 5★ Funnel' : 'Direct Google Link'}
                </span>

                {card.assignedStaff && (
                  <span className="px-2.5 py-1 bg-white/5 text-zinc-300 rounded-lg border border-white/5">
                    Staff: {card.assignedStaff}
                  </span>
                )}

                {card.assignedLocation && (
                  <span className="px-2.5 py-1 bg-white/5 text-zinc-300 rounded-lg border border-white/5">
                    Location: {card.assignedLocation}
                  </span>
                )}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-2xl text-center font-mono">
                <div>
                  <p className="text-[8px] uppercase text-zinc-500">Taps</p>
                  <p className="text-lg font-black italic text-white">{card.totalTaps || 0}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-zinc-500">Google</p>
                  <p className="text-lg font-black italic text-amber-400">{card.googleConversions || 0}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase text-zinc-500">Shielded</p>
                  <p className="text-lg font-black italic text-indigo-400">{card.privateFeedbacksCount || 0}</p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(card)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-xs transition-colors"
                  title="Edit Card"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenQr(card)}
                  className="p-2 bg-white/5 hover:bg-amber-400 hover:text-black text-amber-400 rounded-xl text-xs transition-colors"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <Link
                  href={`/tap/${card.id}`}
                  target="_blank"
                  className="p-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-xs transition-colors"
                  title="Open Tap Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {cards.length > 1 && (
                <button
                  onClick={() => deleteCard(card.id)}
                  className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                  title="Delete Card"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {(editingCard || isCreating) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setEditingCard(null); setIsCreating(false); }}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400">
                {isCreating ? 'Provision Beacon' : 'Edit Configuration'}
              </span>
              <h3 className="text-2xl font-black italic uppercase text-white">
                {isCreating ? 'Add NFC Beacon' : 'Update Card Settings'}
              </h3>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Card Name / Nickname</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Google Review URL</label>
                <input
                  type="url"
                  required
                  value={googleReviewUrl}
                  onChange={(e) => setGoogleReviewUrl(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Routing Protocol</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className="w-full bg-[#121218] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="smart_funnel">Smart 5★ Funnel</option>
                    <option value="direct_google">Direct Google Redirect</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Assigned Staff</label>
                  <input
                    type="text"
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    placeholder="e.g. Dave"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Custom Headline</label>
                <input
                  type="text"
                  value={customHeadline}
                  onChange={(e) => setCustomHeadline(e.target.value)}
                  placeholder="How was your experience today?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <ImageUpload
                  value={logoUrl?.startsWith('data:') || logoUrl?.startsWith('http') ? logoUrl : ''}
                  onChange={(url) => setLogoUrl(url || '⭐')}
                  label="Beacon Logo / Emblem"
                  subtitle="Upload custom icon or brand logo (PNG, JPG, SVG)"
                  aspectRatio="square"
                  compact={true}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 pt-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Beacon Configuration</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Viewer Modal */}
      {activeQrModalCard && generatedQrDataUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
          <div className="relative w-full max-w-sm bg-[#0d0d12] border border-white/10 rounded-[2.5rem] p-8 space-y-6 text-center shadow-2xl">
            <button
              onClick={() => setActiveQrModalCard(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400">Printable QR Beacon</span>
              <h3 className="text-xl font-black italic uppercase text-white">{activeQrModalCard.cardName}</h3>
              <p className="text-xs text-zinc-400">{activeQrModalCard.businessName}</p>
            </div>

            <div className="p-4 bg-white rounded-3xl mx-auto inline-block shadow-2xl">
              <img src={generatedQrDataUrl} alt="NFC QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <p className="text-[10px] font-mono text-zinc-500">
              Print this QR code on table tents, receipts, or door flyers as an optical backup for non-NFC phones.
            </p>

            <a
              href={generatedQrDataUrl}
              download={`${activeQrModalCard.cardName.toLowerCase().replace(/\s+/g, '-')}-qr.png`}
              className="block w-full py-3.5 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-400/20"
            >
              Download PNG Image
            </a>
          </div>
        </div>
      )}

      {/* Admin NFC Card Provisioner Modal */}
      <AdminNfcCardProgrammerModal
        isOpen={isAdminProgrammerOpen}
        onClose={() => {
          setIsAdminProgrammerOpen(false);
          setSelectedAdminCard(null);
        }}
        preselectedCard={selectedAdminCard}
      />

    </div>
  );
}
