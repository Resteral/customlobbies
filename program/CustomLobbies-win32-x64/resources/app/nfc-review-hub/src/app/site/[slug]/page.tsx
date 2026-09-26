'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Star, MapPin, Phone, Clock, 
  Truck, UtensilsCrossed, ShieldCheck, Sparkles, 
  CheckCircle2, Plus, Minus, X, ArrowRight, Share2, 
  QrCode, ExternalLink, Download, Radio, Send,
  ImageIcon, Award, HelpCircle, MessageSquare,
  ChevronDown, ChevronUp, Flame, Heart, Tag,
  Globe, Info, Calendar
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct } from '@/lib/types';
import FoodCustomizerModal from '@/components/FoodCustomizerModal';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function StandaloneBusinessSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { storefronts, placeDeliveryOrder, playDeliveryChime } = useNfcStore();
  const storefront = storefronts.find(sf => sf.slug.toLowerCase() === slug.toLowerCase()) || storefronts[0];

  // Active Main Navigation Tab
  const [activeSiteTab, setActiveSiteTab] = useState<'menu' | 'gallery' | 'story' | 'reviews' | 'hours' | 'faqs'>('menu');

  // Cart State
  const [cartItems, setCartItems] = useState<{ product: StorefrontProduct; quantity: number }[]>([]);
  const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery');
  const [showCheckoutDrawer, setShowCheckoutDrawer] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<StorefrontProduct | null>(null);
  const [tableQrUrl, setTableQrUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);
  const [activeGalleryModalImg, setActiveGalleryModalImg] = useState<any | null>(null);

  // Checkout Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tip, setTip] = useState(5.00);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderCompleteId, setOrderCompleteId] = useState<string | null>(null);

  // Generate Tabletop QR Code on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, {
        width: 380,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
      }).then(url => setTableQrUrl(url));
    }
  }, []);

  if (!storefront) {
    return (
      <div className="min-h-screen pt-32 text-center space-y-4 text-white">
        <h1 className="text-3xl font-black">Storefront Not Found</h1>
        <p className="text-zinc-400 text-sm">The requested business website does not exist or has been unpublished.</p>
        <Link href="/marketplace" className="text-amber-400 font-bold hover:underline">
          Browse Oasis Marketplace
        </Link>
      </div>
    );
  }

  // Dynamic Theme Palette
  const primaryColor = storefront.primaryColor || storefront.accentColor || '#f59e0b';
  const secondaryColor = storefront.secondaryColor || '#ea580c';
  const bgColor = storefront.backgroundColor || '#070709';
  const cardBgColor = storefront.cardBackgroundColor || '#0e0e13';
  const fontClass = storefront.customFont || 'font-sans';

  // Categories
  const categories = ['all', ...Array.from(new Set(storefront.products.map(p => p.category)))];
  const filteredProducts = selectedCategory === 'all'
    ? storefront.products
    : storefront.products.filter(p => p.category === selectedCategory);

  // Cart Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = fulfillmentType === 'delivery' ? storefront.deliveryFee : 0;
  const total = subtotal + deliveryFee + tip;
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (product: StorefrontProduct) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    playDeliveryChime();
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as { product: StorefrontProduct; quantity: number }[];
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0 || !customerName.trim() || !customerPhone.trim()) return;

    setIsOrdering(true);

    const order = await placeDeliveryOrder({
      customerName,
      customerPhone,
      deliveryAddress: fulfillmentType === 'delivery' ? customerAddress : `[PICKUP AT STORE] ${storefront.address}`,
      deliveryInstructions: deliveryInstructions || undefined,
      items: cartItems.map(item => ({
        id: item.product.id,
        name: `${storefront.businessName}: ${item.product.name}`,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      deliveryFee,
      tip,
      total,
      town: `${storefront.town}, ${storefront.state}`,
    });

    setIsOrdering(false);
    setOrderCompleteId(order.id);
    setCartItems([]);
    playDeliveryChime();

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: [primaryColor, secondaryColor, '#10b981'],
    });
  };

  return (
    <div 
      className={`min-h-screen text-white ${fontClass} selection:bg-amber-400 selection:text-black pb-24`}
      style={{ backgroundColor: bgColor }}
    >
      
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      {storefront.enableAnnouncement && storefront.announcementText && (
        <div 
          className="sticky top-0 z-40 py-2 px-4 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2"
          style={{
            backgroundColor: storefront.announcementBgColor || primaryColor,
            color: storefront.announcementTextColor || '#000000'
          }}
        >
          <Flame className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span>{storefront.announcementText}</span>
          {storefront.announcementLink && (
            <a href={storefront.announcementLink} className="underline font-black hover:opacity-80 ml-1">
              Check it out ➔
            </a>
          )}
        </div>
      )}

      {/* 2. BRANDED HERO HEADER */}
      <div className="relative pt-24 pb-12 overflow-hidden border-b border-white/10">
        {/* Cover Wallpaper Background */}
        {storefront.coverImageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={storefront.coverImageUrl} 
              alt={storefront.businessName} 
              className="w-full h-full object-cover opacity-25 filter blur-sm scale-105"
            />
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${bgColor}b3 0%, ${bgColor}f2 60%, ${bgColor} 100%)`
              }}
            />
          </div>
        )}

        <div className="max-w-6xl mx-auto px-6 md:px-10 relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Brand Logo & Title */}
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shrink-0"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  border: `2px solid ${primaryColor}`
                }}
              >
                {storefront.logoEmoji}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                    {storefront.businessName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {storefront.statusMessage || 'Open for Delivery'}
                  </span>
                </div>
                <p className="text-zinc-300 text-xs md:text-sm max-w-xl">
                  {storefront.tagline}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1 flex-wrap">
                  <span className="flex items-center gap-1 font-bold" style={{ color: primaryColor }}>
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{storefront.googleRating}</span>
                    <span className="text-zinc-400 font-normal">({storefront.reviewsCount} Reviews)</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{storefront.town}, {storefront.state}</span>
                  </span>
                  {storefront.foundedYear && (
                    <>
                      <span>•</span>
                      <span className="text-zinc-400 font-mono">Est. {storefront.foundedYear}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Header CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {storefront.googleReviewUrl && (
                <a
                  href={storefront.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 border border-amber-400/20 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg"
                >
                  <Star className="w-3.5 h-3.5" />
                  <span>Review on Google</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              )}

              {/* Custom CTAs if defined */}
              {(storefront.customCtas || []).map((cta) => (
                <a
                  key={cta.id}
                  href={cta.url}
                  className="px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-1.5 text-black hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>{cta.label}</span>
                </a>
              ))}

              <button
                onClick={() => setShowQrModal(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                title="Tabletop QR Menu"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Table QR</span>
              </button>
            </div>

          </div>

          {/* Badges / Highlights Row */}
          {(storefront.badges || []).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {storefront.badges?.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}30`
                  }}
                >
                  <Award className="w-3 h-3" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          )}

          {/* Quick Telemetry Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div 
              className="p-3.5 rounded-2xl border border-white/5 space-y-0.5"
              style={{ backgroundColor: cardBgColor }}
            >
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Truck className="w-3 h-3 text-amber-400" />
                Delivery Fee
              </span>
              <p className="text-sm font-black text-white font-mono">${storefront.deliveryFee.toFixed(2)}</p>
            </div>

            <div 
              className="p-3.5 rounded-2xl border border-white/5 space-y-0.5"
              style={{ backgroundColor: cardBgColor }}
            >
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                Estimated Prep Time
              </span>
              <p className="text-sm font-black text-white font-mono">{storefront.estimatedPrepTime}</p>
            </div>

            <div 
              className="p-3.5 rounded-2xl border border-white/5 space-y-0.5"
              style={{ backgroundColor: cardBgColor }}
            >
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" />
                Phone & Dispatch
              </span>
              <a href={`tel:${storefront.phone}`} className="text-xs font-bold text-zinc-200 font-mono truncate block hover:underline">
                {storefront.phone}
              </a>
            </div>

            <div 
              className="p-3.5 rounded-2xl border border-white/5 space-y-0.5"
              style={{ backgroundColor: cardBgColor }}
            >
              <span className="text-[9px] font-mono uppercase text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Min Order
              </span>
              <p className="text-sm font-black text-white font-mono">${storefront.minOrder.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-SECTION NAVIGATION TABS */}
      <div className="sticky top-12 z-30 bg-[#070709]/90 backdrop-blur-md border-b border-white/10 py-3">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            {[
              { id: 'menu', label: '🍔 Menu & Catalog', count: storefront.products.length },
              { id: 'gallery', label: '🖼️ Photo Showcase', count: storefront.galleryImages?.length || 0 },
              { id: 'story', label: '📖 Our Story & Founder', count: null },
              { id: 'reviews', label: '⭐ Reviews & Praise', count: storefront.testimonials?.length || 0 },
              { id: 'hours', label: '🕒 Hours & Location', count: null },
              { id: 'faqs', label: '❓ FAQs', count: storefront.faqs?.length || 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSiteTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 ${
                  activeSiteTab === tab.id
                    ? 'text-black shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                style={activeSiteTab === tab.id ? { backgroundColor: primaryColor } : {}}
              >
                <span>{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-black/40 text-white font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Floating Cart Trigger */}
          {totalItemCount > 0 && (
            <button
              onClick={() => setShowCheckoutDrawer(true)}
              className="px-5 py-2 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 animate-bounce shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order ({totalItemCount}) • ${total.toFixed(2)}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. MAIN BODY CONTAINER */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-12">

        {/* ========================================================================= */}
        {/* SECTION: MENU & CATALOG */}
        {/* ========================================================================= */}
        {activeSiteTab === 'menu' && (
          <div className="space-y-8" id="catalog">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'text-black shadow-lg shadow-amber-400/20'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                  style={selectedCategory === cat ? { backgroundColor: primaryColor } : {}}
                >
                  {cat === 'all' ? 'All Menu Items' : cat}
                </button>
              ))}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const inCart = cartItems.find(i => i.product.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="border border-white/5 hover:border-amber-400/30 rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all group hover:shadow-2xl"
                    style={{ backgroundColor: cardBgColor }}
                  >
                    {/* Product Image */}
                    {product.imageUrl && (
                      <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-zinc-900">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.badge && (
                          <span 
                            className="absolute top-3 left-3 px-2.5 py-1 text-black text-[9px] font-black uppercase tracking-wider rounded-lg shadow-md"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                          {product.name}
                        </h3>
                        <span 
                          className="text-sm font-black font-mono shrink-0"
                          style={{ color: primaryColor }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Add to Order Controls */}
                    <div className="pt-2 border-t border-white/5">
                      {inCart ? (
                        <div className="flex items-center justify-between bg-white/5 rounded-xl p-1.5 border border-amber-400/30">
                          <button
                            onClick={() => handleUpdateQuantity(product.id, -1)}
                            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-mono font-black" style={{ color: primaryColor }}>
                            {inCart.quantity} in order
                          </span>
                          <button
                            onClick={() => {
                              if (product.optionGroups && product.optionGroups.length > 0) {
                                setCustomizingProduct(product);
                              } else {
                                handleUpdateQuantity(product.id, 1);
                              }
                            }}
                            className="w-8 h-8 rounded-lg text-black flex items-center justify-center text-sm font-black"
                            style={{ backgroundColor: primaryColor }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (product.optionGroups && product.optionGroups.length > 0) {
                              setCustomizingProduct(product);
                            } else {
                              handleAddToCart(product);
                            }
                          }}
                          className="w-full py-3 bg-white/5 hover:text-black text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 group-hover:border-amber-400/40"
                          style={{ 
                            ':hover': { backgroundColor: primaryColor } 
                          } as any}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{product.optionGroups && product.optionGroups.length > 0 ? 'Customize & Add' : 'Add to Order'} • ${product.price.toFixed(2)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: PHOTO & WORK SHOWCASE GALLERY */}
        {/* ========================================================================= */}
        {activeSiteTab === 'gallery' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
                Photo & Craft Showcase
              </h2>
              <p className="text-xs text-zinc-400">
                A glimpse inside {storefront.businessName}’s hearth baking, workshop creations, and local operations.
              </p>
            </div>

            {storefront.galleryImages && storefront.galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {storefront.galleryImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveGalleryModalImg(img)}
                    className="group rounded-3xl overflow-hidden border border-white/10 cursor-pointer relative shadow-xl hover:border-amber-400/50 transition-all"
                    style={{ backgroundColor: cardBgColor }}
                  >
                    <div className="h-60 overflow-hidden relative">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {img.title}
                      </h4>
                      {img.caption && (
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-500 font-mono text-xs">
                No showcase photos added yet. Check back soon!
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: OUR STORY & FOUNDER */}
        {/* ========================================================================= */}
        {activeSiteTab === 'story' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div 
              className="p-8 md:p-12 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl relative overflow-hidden"
              style={{ backgroundColor: cardBgColor }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-widest font-bold" style={{ color: primaryColor }}>
                    About Our Craft & Roots
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tight text-white">
                    {storefront.businessName}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Proudly serving {storefront.town}, New Hampshire and surrounding mountain towns.
                  </p>
                </div>

                {storefront.ownerName && (
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3.5 shrink-0">
                    {storefront.ownerAvatarUrl ? (
                      <img src={storefront.ownerAvatarUrl} alt={storefront.ownerName} className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 flex items-center justify-center text-xl">👑</div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-white">{storefront.ownerName}</p>
                      <p className="text-[10px] font-mono text-amber-400">{storefront.ownerRole || 'Founder'}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm md:text-base text-zinc-300 leading-relaxed space-y-4">
                <p>
                  {storefront.detailedBio || storefront.description}
                </p>
              </div>

              {/* Badges Grid */}
              {(storefront.badges || []).length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                    Verified Badges & Hallmarks:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {storefront.badges?.map((badge, i) => (
                      <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-2.5 text-xs text-white">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-bold">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: TESTIMONIALS & REVIEWS */}
        {/* ========================================================================= */}
        {activeSiteTab === 'reviews' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
                  Customer Praise & Google Reviews
                </h2>
                <p className="text-xs text-zinc-400">
                  Real feedback from local residents, travelers, and dining patrons across Carroll County.
                </p>
              </div>

              {storefront.googleReviewUrl && (
                <a
                  href={storefront.googleReviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-2xl text-black font-black uppercase text-xs tracking-wider transition-all shadow-lg flex items-center gap-2 hover:scale-105 shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Star className="w-4 h-4" />
                  <span>Leave Us a 5-Star Review</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(storefront.testimonials || []).map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-3xl border border-white/10 space-y-4 flex flex-col justify-between shadow-xl"
                  style={{ backgroundColor: cardBgColor }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{t.date}</span>
                    </div>
                    <p className="text-xs text-zinc-200 italic leading-relaxed">
                      "{t.reviewText}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs font-mono">
                    <span className="font-bold text-white">{t.customerName}</span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      {t.source === 'google' ? 'Google Verified' : 'Verified Tap'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: HOURS, OPERATIONS & COURIER HOTLINE */}
        {/* ========================================================================= */}
        {activeSiteTab === 'hours' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div 
              className="p-8 md:p-10 rounded-[2.5rem] border border-white/10 space-y-8 shadow-2xl"
              style={{ backgroundColor: cardBgColor }}
            >
              <div>
                <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
                  Weekly Operating Schedule & Dispatch
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Fresh prep hours, delivery dispatch coverage, and courier emergency hotlines.
                </p>
              </div>

              {/* Schedule Table */}
              <div className="space-y-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                  const dayData = (storefront.operatingHours && storefront.operatingHours[day]) || {
                    open: '08:00 AM',
                    close: '05:00 PM',
                    isClosed: false
                  };

                  return (
                    <div
                      key={day}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-white">{day}</span>
                      {!dayData.isClosed ? (
                        <span className="font-mono text-amber-400 font-bold">
                          {dayData.open} – {dayData.close}
                        </span>
                      ) : (
                        <span className="font-mono text-zinc-500 italic">Closed All Day</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 24/7 Sean Martin 4x4 Emergency Hotline Banner */}
              {storefront.emergencyDispatchActive && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-600/10 to-amber-500/10 border border-amber-400/30 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono font-bold uppercase text-amber-400">
                          24/7 Sean Martin 4x4 Hotline Integration
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Need urgent mountain courier delivery, road assistance, or after-hours express dropoff?
                      </p>
                    </div>

                    <a
                      href={`tel:${storefront.afterHoursEmergencyPhone || '5085070305'}`}
                      className="px-5 py-3 rounded-2xl text-black font-black uppercase text-xs tracking-wider transition-all shadow-lg flex items-center gap-2 hover:scale-105 shrink-0"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Hotline ({storefront.afterHoursEmergencyPhone || '(508) 507-0305'})</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION: FAQS */}
        {/* ========================================================================= */}
        {activeSiteTab === 'faqs' && (
          <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-zinc-400">
                Everything you need to know about ordering, delivery radius, and specialty preparations.
              </p>
            </div>

            <div className="space-y-3">
              {(storefront.faqs || []).map((faq, idx) => {
                const isOpen = activeFaqIndex === idx;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/10 overflow-hidden transition-all"
                    style={{ backgroundColor: cardBgColor }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-sm font-bold text-white">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* CHECKOUT DRAWER / MODAL */}
      {/* ========================================================================= */}
      {showCheckoutDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0a0a0f] border-l border-white/10 w-full max-w-lg h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl">
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      Your Order
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400">
                      Direct from {storefront.businessName}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckoutDrawer(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {orderCompleteId ? (
                /* Order Complete View */
                <div className="py-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black text-white uppercase">
                      Order Dispatched!
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                      Your order has been relayed directly to {storefront.businessName}’s phone. Prep has begun!
                    </p>
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-xs font-mono text-zinc-300 space-y-1">
                    <div>Order Ref: <strong style={{ color: primaryColor }}>{orderCompleteId}</strong></div>
                    <div>Est. Delivery Time: <strong className="text-white">{storefront.estimatedPrepTime}</strong></div>
                  </div>

                  <button
                    onClick={() => {
                      setOrderCompleteId(null);
                      setShowCheckoutDrawer(false);
                    }}
                    className="w-full py-3.5 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Done & Back to Storefront
                  </button>
                </div>
              ) : (
                /* Order Form & Items */
                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  {/* Fulfillment Type Toggle */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        fulfillmentType === 'delivery'
                          ? 'text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      style={fulfillmentType === 'delivery' ? { backgroundColor: primaryColor } : {}}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Delivery</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                        fulfillmentType === 'pickup'
                          ? 'text-black shadow-md'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      style={fulfillmentType === 'pickup' ? { backgroundColor: primaryColor } : {}}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>Pickup</span>
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between gap-3"
                      >
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-white">{item.product.name}</p>
                          <p className="text-[10px] font-mono text-zinc-400">
                            ${item.product.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold" style={{ color: primaryColor }}>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Info Form */}
                  <div className="space-y-3 pt-3 border-t border-white/10">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Marcus Vance"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                        Phone Number for SMS Updates *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(603) 555-0199"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {fulfillmentType === 'delivery' && (
                      <div>
                        <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                          Delivery Street Address / Cabin *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="e.g. 42 Mountain Rd, Effingham, NH"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                        Special Instructions / Gate Code
                      </label>
                      <input
                        type="text"
                        value={deliveryInstructions}
                        onChange={(e) => setDeliveryInstructions(e.target.value)}
                        placeholder="e.g. Leave on front porch, door chime broken"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Tip Selection */}
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                        Driver & Baker Tip ($)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[3.00, 5.00, 8.00, 10.00].map((tipAmt) => (
                          <button
                            key={tipAmt}
                            type="button"
                            onClick={() => setTip(tipAmt)}
                            className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                              tip === tipAmt
                                ? 'text-black shadow-md'
                                : 'bg-white/5 text-zinc-400 hover:text-white'
                            }`}
                            style={tip === tipAmt ? { backgroundColor: primaryColor } : {}}
                          >
                            ${tipAmt.toFixed(2)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Summary Math */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {fulfillmentType === 'delivery' && (
                      <div className="flex justify-between text-zinc-400">
                        <span>Courier Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-400">
                      <span>Tip:</span>
                      <span>${tip.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10 text-sm">
                      <span>Total:</span>
                      <span style={{ color: primaryColor }}>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isOrdering || cartItems.length === 0}
                    className="w-full py-4 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send className="w-4 h-4" />
                    <span>{isOrdering ? 'Dispatching Order...' : `Place Direct Order • $${total.toFixed(2)}`}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TABLETOP QR CODE MODAL */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/15 rounded-3xl w-full max-w-md p-6 md:p-8 space-y-6 text-center shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-xs font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" />
                <span>Tabletop Pass & Menu Stand</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase">
                {storefront.businessName} Tabletop Menu Pass
              </h3>
              <p className="text-xs text-zinc-400">
                Scan with any smartphone camera to open this storefront menu directly.
              </p>
            </div>

            {tableQrUrl && (
              <div className="p-4 bg-white rounded-3xl inline-block shadow-2xl mx-auto">
                <img src={tableQrUrl} alt="Storefront QR" className="w-48 h-48 mx-auto" />
              </div>
            )}

            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href={tableQrUrl}
                download={`${storefront.slug}-table-qr.png`}
                className="px-5 py-3 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-1.5"
                style={{ backgroundColor: primaryColor }}
              >
                <Download className="w-4 h-4" />
                <span>Download Printable PNG Stand</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO GALLERY LIGHTBOX MODAL */}
      {/* ========================================================================= */}
      {activeGalleryModalImg && (
        <div 
          onClick={() => setActiveGalleryModalImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0a0a0f] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-4"
          >
            <div className="h-96 rounded-2xl overflow-hidden relative bg-black">
              <img src={activeGalleryModalImg.url} alt={activeGalleryModalImg.title} className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center justify-between px-2">
              <div>
                <h3 className="text-sm font-bold text-white">{activeGalleryModalImg.title}</h3>
                <p className="text-xs text-zinc-400">{activeGalleryModalImg.caption}</p>
              </div>
              <button
                onClick={() => setActiveGalleryModalImg(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Customizer Modal if needed */}
      {customizingProduct && (
        <FoodCustomizerModal
          product={customizingProduct}
          store={storefront}
          onClose={() => setCustomizingProduct(null)}
          onAdded={() => {
            setCustomizingProduct(null);
            playDeliveryChime();
          }}
        />
      )}

    </div>
  );
}
