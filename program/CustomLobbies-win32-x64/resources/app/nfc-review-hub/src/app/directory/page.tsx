'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Star, 
  Radio, 
  CheckCircle2, 
  Search, 
  Filter, 
  ArrowRight, 
  Truck, 
  Utensils, 
  Wrench, 
  Home, 
  Car, 
  ShoppingBag, 
  Briefcase,
  X,
  ExternalLink,
  Gift
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { DirectoryCategory, DirectoryListing } from '@/lib/types';

export default function DirectoryPage() {
  const { directoryListings, claimDirectoryListing, addDirectoryListing, towns, awardLoyaltyPoints } = useNfcStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<DirectoryCategory | 'all'>('all');

  // Claim modal state
  const [claimingListing, setClaimingListing] = useState<DirectoryListing | null>(null);
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  // Add listing modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBizName, setNewBizName] = useState('');
  const [newCategory, setNewCategory] = useState<DirectoryCategory>('dining_bars');
  const [newCategoryLabel, setNewCategoryLabel] = useState('Restaurant & Dining');
  const [newTown, setNewTown] = useState('Effingham');
  const [newAddress, setNewAddress] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeal, setNewDeal] = useState('');

  const categories: { label: string; value: DirectoryCategory | 'all'; icon: any }[] = [
    { label: 'All Businesses', value: 'all', icon: Building2 },
    { label: 'Dining & Bars', value: 'dining_bars', icon: Utensils },
    { label: 'Trades & Contractors', value: 'trades_contractors', icon: Wrench },
    { label: 'Cabins & Lodging', value: 'lodging_cabins', icon: Home },
    { label: 'Auto & Marine', value: 'auto_marine', icon: Car },
    { label: 'Retail & Artisan', value: 'retail_artisan', icon: ShoppingBag },
    { label: 'Professional Services', value: 'professional_services', icon: Briefcase },
  ];

  const filteredListings = directoryListings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTown = selectedTown === 'all' || item.town.toLowerCase() === selectedTown.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesTown && matchesCategory;
  });

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingListing || !ownerName || !ownerEmail) return;

    claimDirectoryListing(claimingListing.id, {
      ownerName,
      email: ownerEmail,
      phone: ownerPhone || '(603) 555-0199',
    });

    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setClaimingListing(null);
      setOwnerName('');
      setOwnerEmail('');
      setOwnerPhone('');
    }, 2500);
  };

  const handleAddListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName || !newPhone) return;

    addDirectoryListing({
      name: newBizName,
      category: newCategory,
      categoryLabel: newCategoryLabel,
      town: newTown,
      state: 'NH',
      address: newAddress || 'Carroll County, NH',
      phone: newPhone,
      googleRating: 5.0,
      reviewCount: 1,
      isClaimed: true,
      claimedBy: 'New Merchant Submission',
      verifiedBadge: true,
      nfcEnabled: true,
      offersDelivery: false,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
      description: newDescription || 'Local independent business serving Carroll County, NH.',
      featuredDeal: newDeal || undefined,
      tags: ['Local Business', newTown, newCategoryLabel],
    });

    setShowAddModal(false);
    setNewBizName('');
    setNewPhone('');
    setNewAddress('');
    setNewDescription('');
    setNewDeal('');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-black uppercase tracking-widest mb-6">
          <Building2 className="w-4 h-4 text-amber-400 animate-pulse" />
          Carroll County Verified Town Directory
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-tight mb-4">
          Discover & Support <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
            Local Town Businesses
          </span>
        </h1>

        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          Explore verified restaurants, trades contractors, lakefront cabins, and shops equipped with instant NFC tap-to-order and smart Google review points.
        </p>

        {/* Free Claim Promo Banner */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-amber-500/20 border border-amber-400/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black flex-shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Own a business in Carroll County?</h4>
              <p className="text-xs text-white/60">Claim your free profile today & receive a free programmed NFC Smart Review Card.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/csv-importer"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all border border-white/15 flex items-center gap-1.5"
            >
              <span>📄 Bulk CSV Import</span>
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex-shrink-0"
            >
              + Add / Claim Listing
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-7xl mx-auto mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search by business name, specialty, service, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTown}
              onChange={(e) => setSelectedTown(e.target.value)}
              className="bg-[#181820] border border-white/10 rounded-2xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              <option value="all">📍 All Towns (Carroll County)</option>
              {towns.map((t) => (
                <option key={t.id} value={t.name}>{t.name}, {t.state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-400/20 scale-105'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Listings Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-[#0d0d12] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-amber-400/40 transition-all hover:-translate-y-1 group"
          >
            <div>
              {/* Cover Image Header */}
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={listing.coverImage}
                  alt={listing.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-black/40"></div>

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {listing.categoryLabel}
                  </span>
                  {listing.verifiedBadge && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 backdrop-blur-md text-black text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Node
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  {listing.isClaimed ? (
                    <span className="px-2 py-0.5 rounded-full bg-black/70 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                      ✓ Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => setClaimingListing(listing)}
                      className="px-2.5 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-[9px] font-black uppercase tracking-wider transition-all shadow-md animate-pulse"
                    >
                      👑 Claim Listing
                    </button>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="text-white/80 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {listing.town}, {listing.state}
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-black text-white">{listing.googleRating.toFixed(1)}</span>
                    <span className="text-white/40 text-[10px]">({listing.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors mb-2">
                  {listing.name}
                </h3>

                <p className="text-white/60 text-xs leading-relaxed font-light mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {listing.featuredDeal && (
                  <div className="mb-4 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 font-bold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{listing.featuredDeal}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {listing.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/60 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 pt-0 border-t border-white/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-white/50 pt-3">
                <span className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3 h-3 text-amber-400" />
                  {listing.phone}
                </span>
                {listing.nfcEnabled && (
                  <span className="text-indigo-400 font-bold flex items-center gap-1 text-[10px]">
                    <Radio className="w-3 h-3 animate-pulse" />
                    Smart Tap Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {listing.offersDelivery ? (
                  <Link
                    href="/eats"
                    className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Order Delivery</span>
                  </Link>
                ) : (
                  <a
                    href={`tel:${listing.phone.replace(/[^0-9]/g, '')}`}
                    className="py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Store</span>
                  </a>
                )}

                <Link
                  href="/menus"
                  className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 text-white/40" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Business Listing Modal */}
      {claimingListing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setClaimingListing(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {claimSuccess ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase">Listing Claimed!</h3>
                <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto">
                  Welcome aboard, <span className="text-amber-400 font-bold">{ownerName}</span>! Your profile for <span className="text-white font-bold">{claimingListing.name}</span> is now verified. We earned you +100 Oasis Loyalty Points!
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Free Business Verification</span>
                    <h3 className="text-xl font-black text-white">{claimingListing.name}</h3>
                  </div>
                </div>

                <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl mb-6 flex items-start gap-3">
                  <Gift className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/90 leading-relaxed">
                    Claiming this listing unlocks your verified badge, direct customer reviews management, and qualifies your location for a <strong>Free Programmed NFC Review Tap Card</strong> shipped to your business address.
                  </div>
                </div>

                <form onSubmit={handleClaimSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Your Full Name (Owner / Manager) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gary Collins"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@business.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                      Phone Number (for SMS & Verification) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(603) 555-0199"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-400/20 mt-4 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Claim Free Profile</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Business Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0d0d12] border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">New Listing</span>
                <h3 className="text-xl font-black text-white">Add Your Business to Carroll County</h3>
              </div>
            </div>

            <form onSubmit={handleAddListingSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ossipee Lake Bakery"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as DirectoryCategory;
                      setNewCategory(cat);
                      const matched = categories.find(c => c.value === cat);
                      if (matched) setNewCategoryLabel(matched.label);
                    }}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="dining_bars">Dining & Bars</option>
                    <option value="trades_contractors">Trades & Contractors</option>
                    <option value="lodging_cabins">Cabins & Lodging</option>
                    <option value="auto_marine">Auto & Marine</option>
                    <option value="retail_artisan">Retail & Artisan</option>
                    <option value="professional_services">Professional Services</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Town *
                  </label>
                  <select
                    value={newTown}
                    onChange={(e) => setNewTown(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {towns.map((t) => (
                      <option key={t.id} value={t.name}>{t.name}, {t.state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(603) 555-0100"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="Route 25, Effingham"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Business Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell locals what you specialize in..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-1.5">
                  Special Local Deal / Promo (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10% off your first order or free estimate"
                  value={newDeal}
                  onChange={(e) => setNewDeal(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-amber-400/20 mt-4"
              >
                Publish Listing to Directory ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
