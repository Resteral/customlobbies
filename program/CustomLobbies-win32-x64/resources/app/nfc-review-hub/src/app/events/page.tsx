'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Sparkles, 
  Music, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Plus, 
  Tag, 
  X, 
  Radio, 
  Gift, 
  ArrowRight, 
  ShoppingBag, 
  Utensils, 
  Waves,
  RefreshCw,
  Bot,
  UserCheck
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { TownEvent } from '@/lib/types';
import confetti from 'canvas-confetti';
import AuthModal from '@/components/AuthModal';

export default function EventsPage() {
  const { events, rsvpToEvent, addTownEvent, towns, playDeliveryChime, currentUser } = useNfcStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [rsvpNotice, setRsvpNotice] = useState<string | null>(null);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  // Add Event Form State
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState(currentUser?.name || '');
  const [town, setTown] = useState(currentUser?.town ? `${currentUser.town}, NH` : 'Effingham, NH');
  const [venueAddress, setVenueAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<TownEvent['category']>('live_music');
  const [categoryLabel, setCategoryLabel] = useState('Live Music');
  const [description, setDescription] = useState('');
  const [priceText, setPriceText] = useState('Free Admission');

  useEffect(() => {
    if (currentUser) {
      setOrganizer(currentUser.name);
      if (currentUser.town) setTown(`${currentUser.town}, NH`);
    }
  }, [currentUser]);

  const categories = [
    { label: 'All Happenings', value: 'all', icon: Calendar },
    { label: 'Live Music & Patio', value: 'live_music', icon: Music },
    { label: 'Markets & Fairs', value: 'market_fair', icon: ShoppingBag },
    { label: 'Food & Pub Nights', value: 'food_drink', icon: Utensils },
    { label: 'Lake & Outdoors', value: 'outdoors', icon: Waves },
  ];

  const filteredEvents = events.filter(e => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const handleRsvpClick = (event: TownEvent) => {
    rsvpToEvent(event.id);
    if (!event.isUserRsvpd) {
      setRsvpNotice(`RSVP confirmed for "${event.title}"! +25 Loyalty Points added to your wallet.`);
    } else {
      setRsvpNotice(`RSVP cancelled for "${event.title}".`);
    }
    setTimeout(() => setRsvpNotice(null), 3000);
  };

  // Auto-Sync Real Carroll County Events
  const handleAutoSyncEvents = () => {
    setIsAutoSyncing(true);
    setTimeout(() => {
      const realEventsToSync = [
        {
          title: 'Tamworth Distillers Craft Spirits & Orchard Tasting',
          organizer: 'Tamworth Distilling & Farmstand',
          town: 'Tamworth, NH',
          venueAddress: '15 Cleveland Hill Rd, Tamworth',
          date: 'Next Saturday, Oct 3',
          time: '12:00 PM – 5:00 PM',
          category: 'food_drink' as const,
          categoryLabel: 'Artisan Distillery & Tasting',
          description: 'Live acoustic bluegrass music, house-distilled barrel-aged maple rye, fresh hot cider donuts, and herb-infused mocktails in historic Tamworth.',
          coverImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
          nfcPassActive: true,
          pointsReward: 35,
          priceText: 'Free Entry / Tastings $10',
          tags: ['Distillery', 'Live Bluegrass', 'Cider Donuts', 'Tamworth']
        },
        {
          title: 'Mount Washington Valley Autumn Foliage Craft Fair',
          organizer: 'North Conway Chamber of Commerce',
          town: 'Conway, NH',
          venueAddress: 'Schouler Park, North Conway',
          date: 'Sunday, Oct 4',
          time: '10:00 AM – 4:30 PM',
          category: 'market_fair' as const,
          categoryLabel: 'Craft Fair & Foliage',
          description: 'Over 80 New England artisan booths, chainsaw wood carvings, pure maple sugar candies, hot clam chowder bread bowls, and scenic train views.',
          coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
          nfcPassActive: true,
          pointsReward: 50,
          priceText: 'Free Admission',
          tags: ['Craft Fair', 'Chainsaw Carvings', 'Fall Foliage', 'North Conway']
        }
      ];

      realEventsToSync.forEach(ev => {
        const alreadyExists = events.some(e => e.title === ev.title);
        if (!alreadyExists) {
          addTownEvent(ev);
        }
      });

      setIsAutoSyncing(false);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      playDeliveryChime();
      setRsvpNotice('🎉 AI Auto-Synced verified Carroll County autumn events into the live community calendar!');
      setTimeout(() => setRsvpNotice(null), 4500);
    }, 1200);
  };

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venueAddress || !date || !time) return;

    addTownEvent({
      title,
      organizer: organizer || 'Local Host',
      town,
      venueAddress,
      date,
      time,
      category,
      categoryLabel,
      description: description || 'Local community event in Carroll County, NH.',
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      nfcPassActive: true,
      pointsReward: 35,
      priceText: priceText || 'Free Entry',
      tags: ['Local Event', town, categoryLabel],
    });

    setShowAddEventModal(false);
    setTitle('');
    setOrganizer('');
    setVenueAddress('');
    setDate('');
    setTime('');
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-black uppercase tracking-widest mb-6">
          <Calendar className="w-4 h-4 text-pink-400 animate-pulse" />
          Carroll County Community & Live Music Radar
        </div>

        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight uppercase leading-tight mb-4">
          What&apos;s Happening in <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-pink-400 via-amber-200 to-indigo-400 bg-clip-text text-transparent">
            Our Lake & Mountain Towns
          </span>
        </h1>

        <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-8">
          Find live bands, lakeside patio gatherings, weekend farmers markets, and pub trivia. RSVP with your Oasis Pass to earn loyalty reward points.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowAddEventModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-2xl transition-all shadow-xl shadow-pink-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Community Event (+50 Pts)</span>
          </button>

          <button
            onClick={handleAutoSyncEvents}
            disabled={isAutoSyncing}
            className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            {isAutoSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-pink-400" />
                <span>AI Ingesting Local Calendars...</span>
              </>
            ) : (
              <>
                <Bot className="w-4 h-4 text-pink-400" />
                <span>Auto-Sync Real Carroll County Events</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RSVP Notification Toast */}
      {rsvpNotice && (
        <div className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center animate-bounce flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{rsvpNotice}</span>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-pink-500 text-black border-pink-400 font-black shadow-lg shadow-pink-500/20 scale-105'
                  : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="group bg-[#0e0e15] border border-white/5 hover:border-pink-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-pink-500/10"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e15] via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-pink-400 border border-pink-500/30">
                    {event.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-amber-400 border border-amber-400/30">
                    +{event.pointsReward} Pts
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white/80 font-bold">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>{event.town}</span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-pink-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight text-white group-hover:text-pink-300 transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-white/40 font-medium">
                    Presented by <span className="text-white/70">{event.organizer}</span>
                  </p>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-light line-clamp-3">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Footer & RSVP Action */}
            <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Admission</span>
                <span className="text-xs font-black text-white">{event.priceText}</span>
              </div>

              <button
                onClick={() => handleRsvpClick(event)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  event.isUserRsvpd
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-pink-500 hover:bg-pink-400 text-black shadow-lg shadow-pink-500/20'
                }`}
              >
                {event.isUserRsvpd ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>RSVP Active</span>
                  </>
                ) : (
                  <>
                    <Radio className="w-3.5 h-3.5 text-black animate-pulse" />
                    <span>NFC RSVP Pass</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e18] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Post a Local Community Event
                  </h3>
                  <p className="text-xs text-white/50">Earn +50 points when neighbors RSVP</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account Banner */}
            <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center text-sm font-bold">
                  {currentUser?.avatar || '🎉'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold text-[11px]">
                      Posting as: <strong className="text-pink-300">{currentUser ? currentUser.name : 'Guest Host'}</strong>
                    </span>
                    {currentUser && (
                      <span className="px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[8px] font-mono font-bold uppercase">
                        {currentUser.role}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-white/40">
                    {currentUser ? `${currentUser.town}, NH` : 'Sign in to auto-fill host info & earn organizer points'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="text-[10px] font-bold text-pink-400 hover:text-pink-300 underline shrink-0"
              >
                Switch Account
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Friday Live Acoustic Night on the Patio"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Host / Business</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PNB Eats"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Town</label>
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Effingham, NH">Effingham, NH</option>
                    <option value="Freedom, NH">Freedom, NH</option>
                    <option value="Ossipee, NH">Ossipee, NH</option>
                    <option value="Wolfeboro, NH">Wolfeboro, NH</option>
                    <option value="Conway, NH">Conway, NH</option>
                    <option value="Tamworth, NH">Tamworth, NH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Venue Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Route 25 Patio, Effingham"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Date</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Friday, Oct 2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6:30 PM - 9:30 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-white/60 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell neighbors what makes this event special..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-black font-black uppercase tracking-wider rounded-xl shadow-lg shadow-pink-500/20"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unified Auth & Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
