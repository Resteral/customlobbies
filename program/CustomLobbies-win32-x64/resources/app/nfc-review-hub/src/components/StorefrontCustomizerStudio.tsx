'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Store, Palette, Sparkles, Image as ImageIcon, 
  Clock, MapPin, Phone, Star, ShieldCheck, 
  Plus, Trash2, Edit3, CheckCircle2, ArrowRight, 
  QrCode, ExternalLink, Download, Layers, 
  HelpCircle, MessageSquare, Eye, Save, 
  Globe, Share2, Truck, RefreshCw, Undo2,
  Camera, Check, ChevronDown, ChevronUp,
  Flame, Heart, Tag, Award
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { 
  MerchantStorefront, 
  StorefrontThemePreset, 
  StorefrontHeroStyle,
  StorefrontGalleryImage,
  StorefrontTestimonial,
  StorefrontFaq,
  StorefrontCustomCta,
  StorefrontProduct,
  OperatingDayHours
} from '@/lib/types';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import ImageUpload from '@/components/ImageUpload';

const THEME_PRESETS: {
  id: StorefrontThemePreset;
  name: string;
  emoji: string;
  primary: string;
  secondary: string;
  bg: string;
  cardBg: string;
  text: string;
  description: string;
}[] = [
  {
    id: 'amber_gold',
    name: 'Vanguard Amber Gold',
    emoji: '👑',
    primary: '#f59e0b',
    secondary: '#ea580c',
    bg: '#070709',
    cardBg: '#0e0e13',
    text: '#ffffff',
    description: 'Rich dark obsidian with warm radiant amber & gold highlights.'
  },
  {
    id: 'emerald_nature',
    name: 'White Mountain Emerald',
    emoji: '🌲',
    primary: '#10b981',
    secondary: '#059669',
    bg: '#04130d',
    cardBg: '#072419',
    text: '#f0fdf4',
    description: 'Deep lush forest green with crisp botanical emerald accents.'
  },
  {
    id: 'cyber_neon',
    name: 'Cyberpunk Neon Matrix',
    emoji: '⚡',
    primary: '#06b6d4',
    secondary: '#8b5cf6',
    bg: '#090514',
    cardBg: '#130d29',
    text: '#ffffff',
    description: 'Electric cyan & neon ultraviolet glow on pitch-black canvas.'
  },
  {
    id: 'sunset_flame',
    name: 'Sunset Smokehouse & BBQ',
    emoji: '🔥',
    primary: '#f97316',
    secondary: '#ef4444',
    bg: '#120504',
    cardBg: '#210b08',
    text: '#fff7ed',
    description: 'Warm campfire embers, bold terracotta, and spicy crimson.'
  },
  {
    id: 'ocean_deep',
    name: 'Lake Ossipee Deep Water',
    emoji: '🌊',
    primary: '#38bdf8',
    secondary: '#2563eb',
    bg: '#030b17',
    cardBg: '#08172c',
    text: '#f0f9ff',
    description: 'Serene lakeside blues with crisp aquatic reflections.'
  },
  {
    id: 'rustic_artisan',
    name: 'Rustic Hearth & Timber',
    emoji: '🪵',
    primary: '#d97706',
    secondary: '#78350f',
    bg: '#140c07',
    cardBg: '#24170e',
    text: '#fef3c7',
    description: 'Earthy woodcraft tones, warm sourdough wheat, and rich leather.'
  },
  {
    id: 'minimal_slate',
    name: 'Clean Modern Slate',
    emoji: '🏢',
    primary: '#94a3b8',
    secondary: '#475569',
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    description: 'Sleek executive slate with understated silver accents.'
  }
];

const PRESET_WALLPAPERS = [
  { label: 'Artisan Cafe & Bakery', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Wood-Fired Kitchen & Hearth', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Mountain Timber & Forests', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Smoky BBQ & Steakhouse', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Modern Gourmet Bistro', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Carroll County Lake Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StorefrontCustomizerStudio({
  initialStorefrontId
}: {
  initialStorefrontId?: string;
}) {
  const { storefronts, updateStorefront, playDeliveryChime } = useNfcStore();

  const [activeSfId, setActiveSfId] = useState<string>(
    initialStorefrontId || (storefronts[0]?.id || '')
  );

  const activeStorefront = storefronts.find(sf => sf.id === activeSfId) || storefronts[0];

  // Studio Active Tab
  const [studioTab, setStudioTab] = useState<
    'theme' | 'identity' | 'hours' | 'gallery' | 'reviews' | 'faqs' | 'menu' | 'qr'
  >('theme');

  // Preview Mode
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // QR Code Generation
  const [tableQrUrl, setTableQrUrl] = useState<string>('');

  // Local Form Working State
  const [formData, setFormData] = useState<MerchantStorefront>(activeStorefront);

  // Sync formData whenever activeStorefront changes
  useEffect(() => {
    if (activeStorefront) {
      setFormData(activeStorefront);
    }
  }, [activeStorefront]);

  // Generate Table QR
  useEffect(() => {
    if (typeof window !== 'undefined' && formData?.slug) {
      const siteUrl = `${window.location.origin}/site/${formData.slug}`;
      QRCode.toDataURL(siteUrl, {
        width: 380,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).then(url => setTableQrUrl(url)).catch(() => {});
    }
  }, [formData?.slug]);

  if (!activeStorefront) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-zinc-400">No storefronts available. Please create a storefront first.</p>
        <Link href="/create-storefront" className="mt-4 inline-block text-amber-400 font-bold underline">
          Create New Storefront
        </Link>
      </div>
    );
  }

  // Handle Save
  const handleSaveAllChanges = () => {
    updateStorefront(formData.id, formData);
    playDeliveryChime();
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSaveSuccessMsg(`✅ All customizations for "${formData.businessName}" saved & published live!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Apply Theme Preset
  const handleApplyThemePreset = (presetId: StorefrontThemePreset) => {
    const preset = THEME_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      themePreset: presetId,
      accentColor: preset.primary,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      backgroundColor: preset.bg,
      cardBackgroundColor: preset.cardBg,
      textColor: preset.text
    }));
    playDeliveryChime();
  };

  // Badges Management
  const handleAddBadge = (newBadgeText: string) => {
    if (!newBadgeText.trim()) return;
    const current = formData.badges || [];
    setFormData(prev => ({
      ...prev,
      badges: [...current, newBadgeText.trim()]
    }));
  };

  const handleRemoveBadge = (index: number) => {
    const current = formData.badges || [];
    setFormData(prev => ({
      ...prev,
      badges: current.filter((_, i) => i !== index)
    }));
  };

  // Hours Management
  const handleUpdateDayHours = (day: string, updates: Partial<OperatingDayHours>) => {
    const currentHours = formData.operatingHours || {};
    const defaultDay = currentHours[day] || { open: '08:00 AM', close: '05:00 PM', isClosed: false };
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...currentHours,
        [day]: { ...defaultDay, ...updates }
      }
    }));
  };

  // Gallery Management
  const handleAddGalleryImage = (img: Omit<StorefrontGalleryImage, 'id'>) => {
    const current = formData.galleryImages || [];
    const newImg: StorefrontGalleryImage = {
      ...img,
      id: `gal-${Date.now()}`
    };
    setFormData(prev => ({
      ...prev,
      galleryImages: [...current, newImg]
    }));
  };

  const handleRemoveGalleryImage = (imgId: string) => {
    const current = formData.galleryImages || [];
    setFormData(prev => ({
      ...prev,
      galleryImages: current.filter(g => g.id !== imgId)
    }));
  };

  // Testimonials Management
  const handleAddTestimonial = (test: Omit<StorefrontTestimonial, 'id'>) => {
    const current = formData.testimonials || [];
    const newTest: StorefrontTestimonial = {
      ...test,
      id: `test-${Date.now()}`
    };
    setFormData(prev => ({
      ...prev,
      testimonials: [...current, newTest]
    }));
  };

  const handleRemoveTestimonial = (testId: string) => {
    const current = formData.testimonials || [];
    setFormData(prev => ({
      ...prev,
      testimonials: current.filter(t => t.id !== testId)
    }));
  };

  // FAQ Management
  const handleAddFaq = (question: string, answer: string) => {
    if (!question.trim() || !answer.trim()) return;
    const current = formData.faqs || [];
    setFormData(prev => ({
      ...prev,
      faqs: [...current, { id: `faq-${Date.now()}`, question: question.trim(), answer: answer.trim() }]
    }));
  };

  const handleRemoveFaq = (faqId: string) => {
    const current = formData.faqs || [];
    setFormData(prev => ({
      ...prev,
      faqs: current.filter(f => f.id !== faqId)
    }));
  };

  // Custom CTA Management
  const handleAddCustomCta = (cta: Omit<StorefrontCustomCta, 'id'>) => {
    const current = formData.customCtas || [];
    setFormData(prev => ({
      ...prev,
      customCtas: [...current, { ...cta, id: `cta-${Date.now()}` }]
    }));
  };

  const handleRemoveCustomCta = (ctaId: string) => {
    const current = formData.customCtas || [];
    setFormData(prev => ({
      ...prev,
      customCtas: current.filter(c => c.id !== ctaId)
    }));
  };

  // Product Management Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('9.99');
  const [prodCategory, setProdCategory] = useState('Main Menu');
  const [prodDesc, setProdDesc] = useState('');
  const [prodBadge, setProdBadge] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodInStock, setProdInStock] = useState(true);

  const handleOpenNewProductModal = () => {
    setEditingProductId(null);
    setProdName('');
    setProdPrice('9.99');
    setProdCategory('Main Menu');
    setProdDesc('');
    setProdBadge('');
    setProdImage('');
    setProdInStock(true);
    setShowProductModal(true);
  };

  const handleOpenEditProductModal = (p: StorefrontProduct) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdPrice(p.price.toString());
    setProdCategory(p.category);
    setProdDesc(p.description);
    setProdBadge(p.badge || '');
    setProdImage(p.imageUrl || '');
    setProdInStock(p.inStock);
    setShowProductModal(true);
  };

  const handleSaveProductModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProductId) {
      setFormData(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === editingProductId ? {
          ...p,
          name: prodName.trim(),
          price: parseFloat(prodPrice) || 9.99,
          category: prodCategory.trim() || 'Main Menu',
          description: prodDesc.trim(),
          badge: prodBadge.trim() || undefined,
          imageUrl: prodImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          inStock: prodInStock
        } : p)
      }));
    } else {
      const newProd: StorefrontProduct = {
        id: `prod-${Date.now().toString(36)}`,
        name: prodName.trim(),
        price: parseFloat(prodPrice) || 9.99,
        category: prodCategory.trim() || 'Main Menu',
        description: prodDesc.trim() || 'Fresh artisan preparation.',
        badge: prodBadge.trim() || undefined,
        imageUrl: prodImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        inStock: prodInStock
      };
      setFormData(prev => ({
        ...prev,
        products: [newProd, ...prev.products]
      }));
    }

    setShowProductModal(false);
    playDeliveryChime();
  };

  const handleToggleProductStock = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p)
    }));
  };

  const handleDeleteProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }));
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Studio Banner & Storefront Selector */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-600/10 to-transparent border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Palette className="w-3.5 h-3.5" />
            Extreme Online Business Profile Customizer Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
            Customize <span className="text-amber-400">{formData.businessName}</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl">
            Deep visual branding, color palettes, custom photo galleries, weekly schedules, verified badges, FAQs, and 1-tap tabletop NFC passes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Storefront Switcher */}
          {storefronts.length > 1 && (
            <select
              value={activeSfId}
              onChange={(e) => setActiveSfId(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              {storefronts.map(sf => (
                <option key={sf.id} value={sf.id} className="bg-zinc-900 text-white">
                  {sf.logoEmoji} {sf.businessName}
                </option>
              ))}
            </select>
          )}

          <a
            href={`/site/${formData.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>

          <button
            onClick={handleSaveAllChanges}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'theme', label: '🎨 1. Theme & Aesthetics', count: null },
          { id: 'identity', label: '🏷️ 2. Identity & Badges', count: formData.badges?.length || 0 },
          { id: 'hours', label: '🕒 3. Hours & Operations', count: null },
          { id: 'gallery', label: '🖼️ 4. Photo Gallery', count: formData.galleryImages?.length || 0 },
          { id: 'reviews', label: '⭐ 5. Testimonials & Google', count: formData.testimonials?.length || 0 },
          { id: 'faqs', label: '❓ 6. FAQs & CTAs', count: (formData.faqs?.length || 0) + (formData.customCtas?.length || 0) },
          { id: 'menu', label: '🍔 7. Catalog & Products', count: formData.products.length },
          { id: 'qr', label: '📡 8. NFC Pass & Tabletop QR', count: null }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStudioTab(tab.id as any)}
            className={`px-4 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all shrink-0 flex items-center gap-2 ${
              studioTab === tab.id
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                studioTab === tab.id ? 'bg-black text-amber-400' : 'bg-white/10 text-zinc-300'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Studio Split Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Customizer Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: THEME & AESTHETICS */}
          {/* ========================================================================= */}
          {studioTab === 'theme' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-8">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Palette className="w-5 h-5 text-amber-400" />
                  Color Palettes & Visual Theme Presets
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Choose a signature look or fine-tune exact hex codes, hero styles, and typography.
                </p>
              </div>

              {/* 1-Click Theme Preset Cards */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  1-Click Signature Themes:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {THEME_PRESETS.map((preset) => {
                    const isSelected = formData.themePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyThemePreset(preset.id)}
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                          isSelected
                            ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{preset.emoji}</span>
                            <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors">
                              {preset.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: preset.primary }} />
                            <div className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: preset.secondary }} />
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                          {preset.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Granular Color Pickers */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Custom Hex Color Codes:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Primary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor || formData.accentColor || '#f59e0b'}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value, accentColor: e.target.value }))}
                        className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/10"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor || formData.accentColor || '#f59e0b'}
                        onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value, accentColor: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Secondary Accent</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondaryColor || '#ea580c'}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/10"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor || '#ea580c'}
                        onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Background Tone</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.backgroundColor || '#070709'}
                        onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/10"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor || '#070709'}
                        onChange={(e) => setFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        className="w-full px-2.5 py-1.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Banner Style & Wallpaper Selector */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Hero Header Style:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'banner_cover', label: 'Panoramic Banner', desc: 'Large cinematic photo cover' },
                    { id: 'split_minimal', label: 'Split Modern', desc: 'Compact logo with info grid' },
                    { id: 'cyber_card', label: 'Cyber Glass Card', desc: 'High-tech translucent frame' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, heroStyle: style.id as StorefrontHeroStyle }))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        (formData.heroStyle || 'banner_cover') === style.id
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{style.label}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{style.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-mono uppercase text-zinc-400">
                    Preset Hero Wallpaper Banners:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_WALLPAPERS.map((wp, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImageUrl: wp.url }))}
                        className="group relative h-16 rounded-xl overflow-hidden border border-white/10 hover:border-amber-400 transition-all text-left"
                      >
                        <img src={wp.url} alt={wp.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/20 transition-colors flex items-end p-1.5">
                          <span className="text-[9px] font-black text-white truncate drop-shadow">{wp.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="text-[10px] font-mono text-zinc-400">Or Upload / Custom Cover Image URL:</label>
                    <ImageUpload
                      value={formData.coverImageUrl || ''}
                      onChange={(url) => setFormData(prev => ({ ...prev, coverImageUrl: url }))}
                      label="Storefront Cover Banner"
                      subtitle="Upload high-res cover banner image"
                    />
                  </div>
                </div>
              </div>

              {/* Typography Selector */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Typography Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'font-sans', label: 'Modern Clean Sans', preview: 'Inter / Modern Sans' },
                    { id: 'font-serif', label: 'Heritage Serif', preview: 'Editorial / Classic' },
                    { id: 'font-mono', label: 'Cyber Tech Mono', preview: 'High-Tech / Telemetry' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, customFont: font.id as any }))}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        (formData.customFont || 'font-sans') === font.id
                          ? 'border-amber-400 bg-amber-400/10'
                          : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{font.label}</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{font.preview}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: IDENTITY, BIO & BADGES */}
          {/* ========================================================================= */}
          {studioTab === 'identity' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Tag className="w-5 h-5 text-amber-400" />
                  Business Identity, Story & Verified Badges
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Establish brand credibility with rich storytelling, founder cards, and verified badge tags.
                </p>
              </div>

              {/* Core Business Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Business Name</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">URL Slug (/site/[slug])</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Hero Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Detailed Story & Founder Craft (Bio)</label>
                  <textarea
                    rows={4}
                    value={formData.detailedBio || formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, detailedBio: e.target.value, description: e.target.value }))}
                    placeholder="Tell your customers about your baking fermentation, craft woodworking, coffee bean sourcing, or courier background..."
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Founder / Owner Profile */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Founder / Master Artisan Card
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Founder Name</label>
                    <input
                      type="text"
                      value={formData.ownerName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                      placeholder="e.g. Sean Martin"
                      className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Founder Title / Role</label>
                    <input
                      type="text"
                      value={formData.ownerRole || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, ownerRole: e.target.value }))}
                      placeholder="e.g. Master Baker & Founder"
                      className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400">Founded Year</label>
                    <input
                      type="text"
                      value={formData.foundedYear || '2023'}
                      onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                      placeholder="e.g. 2023"
                      className="w-full mt-1 px-3 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Verified Highlight Badges Manager */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Profile Badges & Credential Tags:
                  </label>
                  <span className="text-[10px] font-mono text-zinc-500">{(formData.badges || []).length} active</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(formData.badges || []).map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-bold text-white flex items-center gap-2 group hover:border-red-500/50 transition-all"
                    >
                      <span>{badge}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBadge(idx)}
                        className="text-zinc-500 group-hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Quick Add Presets */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1.5">Quick Add Badge Suggestions:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '👑 Founding Vanguard Hub',
                      '🍞 100% Hearth Sourdough',
                      '☕ Direct Trade Single-Origin',
                      '🛻 4x4 Express Courier Delivery',
                      '⭐ 5-Star Top Rated Business',
                      '🌿 100% Organic & Local',
                      '🇺🇸 Veteran Owned & Operated',
                      '🛡️ Licensed & Insured Master'
                    ].map((badgeSuggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddBadge(badgeSuggestion)}
                        className="px-2.5 py-1 bg-white/[0.03] hover:bg-amber-400/20 hover:text-amber-300 border border-white/5 rounded-lg text-[10px] font-mono text-zinc-400 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{badgeSuggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Announcement Banner Setup */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4" />
                    Top Announcement / Flash Deal Banner
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableAnnouncement || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, enableAnnouncement: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {formData.enableAnnouncement && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="text"
                      value={formData.announcementText || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, announcementText: e.target.value }))}
                      placeholder="e.g. 🔥 Fresh Sourdough & Cinnamon Rolls just came out of the oven! Tap to order express delivery."
                      className="w-full px-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Banner Background</label>
                        <input
                          type="color"
                          value={formData.announcementBgColor || '#f59e0b'}
                          onChange={(e) => setFormData(prev => ({ ...prev, announcementBgColor: e.target.value }))}
                          className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Text Color</label>
                        <input
                          type="color"
                          value={formData.announcementTextColor || '#000000'}
                          onChange={(e) => setFormData(prev => ({ ...prev, announcementTextColor: e.target.value }))}
                          className="w-full h-8 rounded-lg cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HOURS & OPERATIONS */}
          {/* ========================================================================= */}
          {studioTab === 'hours' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" />
                  Operating Hours, Delivery Radius & Hotline
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Manage weekly open hours, delivery prep windows, delivery fees, and 24/7 emergency dispatch.
                </p>
              </div>

              {/* Weekly Schedule Builder */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Weekly Operating Schedule:
                </label>
                <div className="space-y-2">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayHours = (formData.operatingHours && formData.operatingHours[day]) || {
                      open: '08:00 AM',
                      close: '05:00 PM',
                      isClosed: false
                    };

                    return (
                      <div
                        key={day}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                          dayHours.isClosed
                            ? 'bg-white/[0.01] border-white/5 opacity-60'
                            : 'bg-white/[0.03] border-white/10'
                        }`}
                      >
                        <div className="w-24">
                          <span className="text-xs font-bold text-white">{day}</span>
                        </div>

                        {!dayHours.isClosed ? (
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <input
                              type="text"
                              value={dayHours.open}
                              onChange={(e) => handleUpdateDayHours(day, { open: e.target.value })}
                              className="w-20 px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-center text-white"
                            />
                            <span className="text-zinc-500">to</span>
                            <input
                              type="text"
                              value={dayHours.close}
                              onChange={(e) => handleUpdateDayHours(day, { close: e.target.value })}
                              className="w-20 px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-center text-white"
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-zinc-500 italic">Closed All Day</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleUpdateDayHours(day, { isClosed: !dayHours.isClosed })}
                          className={`px-3 py-1 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
                            dayHours.isClosed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {dayHours.isClosed ? 'Open Day' : 'Mark Closed'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Operations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={formData.deliveryFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) || 0 }))}
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Min Order ($)</label>
                  <input
                    type="number"
                    step="1.00"
                    value={formData.minOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrder: parseFloat(e.target.value) || 0 }))}
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-zinc-400 font-bold">Prep Window</label>
                  <input
                    type="text"
                    value={formData.estimatedPrepTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedPrepTime: e.target.value }))}
                    placeholder="e.g. 15-20 mins"
                    className="w-full mt-1 px-4 py-3 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Emergency Hotline Toggle */}
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
                    <Truck className="w-4 h-4" />
                    24/7 Sean Martin 4x4 Hotline Integration
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.emergencyDispatchActive || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, emergencyDispatchActive: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Enables 1-tap call direct courier dispatch button on customer profile for immediate after-hours emergencies or express deliveries.
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PHOTO & PROJECT GALLERY */}
          {/* ========================================================================= */}
          {studioTab === 'gallery' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    Photo & Work Showcase Gallery
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Upload photos of your wood-fired baking, dining space, carpentry work, or fleet.
                  </p>
                </div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {(formData.galleryImages || []).length} Photos
                </span>
              </div>

              {/* Existing Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(formData.galleryImages || []).map((img) => (
                  <div
                    key={img.id}
                    className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2 relative group overflow-hidden"
                  >
                    <div className="h-36 rounded-xl overflow-hidden relative bg-zinc-900">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate">{img.title}</p>
                      {img.caption && (
                        <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5">{img.caption}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Gallery Item Form */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <label className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Add Photo to Showcase
                </label>
                <div className="space-y-2">
                  <ImageUpload
                    value=""
                    onChange={(url) => {
                      if (url) {
                        handleAddGalleryImage({
                          url,
                          title: 'New Showcase Photo',
                          caption: 'Fresh photo captured from Carroll County operations.'
                        });
                      }
                    }}
                    label="Upload or Paste Showcase Image URL"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: TESTIMONIALS & REVIEWS */}
          {/* ========================================================================= */}
          {studioTab === 'reviews' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Testimonials & Google Review Booster
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Highlight glowing customer testimonials and pair your Google 5-Star review link.
                </p>
              </div>

              {/* Google Reviews Place URL */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                <label className="text-[11px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Google Place Review URL
                </label>
                <input
                  type="text"
                  value={formData.googleReviewUrl || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, googleReviewUrl: e.target.value }))}
                  placeholder="https://search.google.com/local/writereview?placeid=..."
                  className="w-full px-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white"
                />
              </div>

              {/* Testimonials List */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Featured Customer Praise:
                </label>
                <div className="space-y-3">
                  {(formData.testimonials || []).map((test) => (
                    <div
                      key={test.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center text-amber-400">
                            {[...Array(test.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-white">{test.customerName}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono text-zinc-400">
                            {test.source === 'google' ? 'Google Review' : 'Verified NFC Tap'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTestimonial(test.id)}
                          className="text-zinc-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-300 italic leading-relaxed">
                        "{test.reviewText}"
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick Add Testimonial */}
                <button
                  type="button"
                  onClick={() => {
                    handleAddTestimonial({
                      customerName: 'Local Customer',
                      rating: 5,
                      reviewText: 'Outstanding quality and express delivery in Carroll County. Highly recommend!',
                      date: 'Just now',
                      source: 'verified_tap'
                    });
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add New Testimonial</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: FAQS & CTAS */}
          {/* ========================================================================= */}
          {studioTab === 'faqs' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  Frequently Asked Questions & Custom Action Buttons
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Answer common customer questions and configure custom Call-To-Action buttons.
                </p>
              </div>

              {/* FAQs Manager */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Frequently Asked Questions (FAQ Accordion):
                </label>
                <div className="space-y-3">
                  {(formData.faqs || []).map((faq) => (
                    <div
                      key={faq.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{faq.question}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(faq.id)}
                          className="text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const q = prompt('Enter FAQ Question (e.g. Do you deliver in winter weather?):');
                    if (!q) return;
                    const a = prompt('Enter FAQ Answer:');
                    if (!a) return;
                    handleAddFaq(q, a);
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add New FAQ Item</span>
                </button>
              </div>

              {/* Custom Action CTAs */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-xs font-mono uppercase text-zinc-400 font-bold">
                  Custom Header Call-To-Action (CTA) Buttons:
                </label>
                <div className="space-y-2">
                  {(formData.customCtas || []).map((cta) => (
                    <div
                      key={cta.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span>{cta.label}</span>
                        <span className="text-[10px] font-mono text-zinc-500 font-normal">({cta.url})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomCta(cta.id)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const label = prompt('Enter CTA Button Label (e.g. 📋 Book Catering):');
                    if (!label) return;
                    const url = prompt('Enter Destination URL or tel: number:');
                    if (!url) return;
                    handleAddCustomCta({
                      label,
                      url,
                      style: 'amber'
                    });
                  }}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add Custom Action Button</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: MENU & CATALOG */}
          {/* ========================================================================= */}
          {studioTab === 'menu' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-400" />
                    Product & Menu Catalog
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage active products, prices, categories, and stock availability.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenNewProductModal}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4 group hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">🍔</div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {prod.name}
                          </h4>
                          {prod.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                              {prod.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {prod.category} • <strong className="text-white">${prod.price.toFixed(2)}</strong>
                        </p>
                        {prod.description && (
                          <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                            {prod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleToggleProductStock(prod.id)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase transition-all ${
                          prod.inStock 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        }`}
                      >
                        {prod.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditProductModal(prod)}
                        className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                        title="Edit Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: NFC & TABLETOP QR */}
          {/* ========================================================================= */}
          {studioTab === 'qr' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-amber-400" />
                  Tabletop QR Stands & 1-Tap NFC Passes
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Generate branded acrylic tabletop QR codes and program physical NFC cards for instant table ordering.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                {tableQrUrl && (
                  <div className="p-4 bg-white rounded-2xl shadow-xl">
                    <img src={tableQrUrl} alt="Tabletop QR" className="w-56 h-56 object-contain" />
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase">
                    {formData.businessName} Tabletop QR Code
                  </h4>
                  <p className="text-xs font-mono text-zinc-400">
                    Points to: https://townraise.org/site/{formData.slug}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={tableQrUrl}
                    download={`${formData.slug}-tabletop-qr.png`}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PNG Stand</span>
                  </a>

                  <Link
                    href="/dashboard/cards"
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Burn to Physical NFC Card</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Instant Live Profile Preview Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Live Interactive Website Preview
            </span>
            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${
                  previewDevice === 'desktop' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase ${
                  previewDevice === 'mobile' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Device Mockup Canvas */}
          <div
            className={`rounded-3xl border border-white/15 overflow-hidden shadow-2xl transition-all ${
              previewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
            }`}
            style={{
              backgroundColor: formData.backgroundColor || '#070709',
              color: formData.textColor || '#ffffff'
            }}
          >
            {/* Mock Announcement Bar */}
            {formData.enableAnnouncement && formData.announcementText && (
              <div
                className="py-1.5 px-3 text-center text-[10px] font-bold truncate"
                style={{
                  backgroundColor: formData.announcementBgColor || '#f59e0b',
                  color: formData.announcementTextColor || '#000000'
                }}
              >
                {formData.announcementText}
              </div>
            )}

            {/* Mock Hero Header */}
            <div className="relative p-6 space-y-4 border-b border-white/10 overflow-hidden">
              {formData.coverImageUrl && (
                <div className="absolute inset-0 z-0 opacity-25">
                  <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover filter blur-[2px]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#070709]" />
                </div>
              )}

              <div className="relative z-10 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl shrink-0"
                    style={{ backgroundColor: `${formData.primaryColor || '#f59e0b'}20`, border: `2px solid ${formData.primaryColor || '#f59e0b'}` }}
                  >
                    {formData.logoEmoji}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black uppercase italic tracking-tight text-white leading-tight">
                      {formData.businessName}
                    </h3>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      {formData.tagline}
                    </p>
                  </div>
                </div>

                {/* Badges preview */}
                {(formData.badges || []).length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(formData.badges || []).slice(0, 3).map((b, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                        style={{
                          backgroundColor: `${formData.primaryColor || '#f59e0b'}20`,
                          color: formData.primaryColor || '#f59e0b',
                          border: `1px solid ${formData.primaryColor || '#f59e0b'}40`
                        }}
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mock Products Grid */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-zinc-400 uppercase">Featured Menu</span>
                <span style={{ color: formData.primaryColor || '#f59e0b' }}>
                  {formData.products.length} items
                </span>
              </div>

              <div className="space-y-2">
                {formData.products.slice(0, 3).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-xl flex items-center justify-between gap-2 border border-white/5"
                    style={{ backgroundColor: formData.cardBackgroundColor || '#0e0e13' }}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">{prod.name}</p>
                      <p className="text-[10px] text-zinc-400">${prod.price.toFixed(2)}</p>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase text-black"
                      style={{ backgroundColor: formData.primaryColor || '#f59e0b' }}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Product Create / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <Store className="w-4 h-4" />
                <span>{editingProductId ? 'Edit Menu / Product Item' : 'Add New Menu Item'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Item / Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Nitro Cold Brew Growler (64oz)"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    placeholder="e.g. Coffee, Bakery, Main Menu"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Description & Ingredients
                </label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  placeholder="Describe your artisan preparation, fresh organic ingredients, fermentation, or craft notes..."
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                    Highlight Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={prodBadge}
                    onChange={(e) => setProdBadge(e.target.value)}
                    placeholder="e.g. Hearth Baked, Chef Special"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                    Availability
                  </label>
                  <button
                    type="button"
                    onClick={() => setProdInStock(!prodInStock)}
                    className={`w-full py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                      prodInStock
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {prodInStock ? '✓ In Stock (Available)' : '✕ Out of Stock'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Product Photo (URL or Upload)
                </label>
                <ImageUpload
                  value={prodImage}
                  onChange={(url) => setProdImage(url)}
                  label="Upload Item Image"
                  subtitle="Square or card photo of the dish or product"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProductId ? 'Update Item' : 'Add to Menu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
