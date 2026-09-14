import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessProfile, BusinessCategory, StampIconType } from '../types';
import { Plus, X, Sparkles, Building2, Star, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBusinessModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { businesses, updateBusinessProfile, setCurrentBusiness } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('cafe');
  const [logoEmoji, setLogoEmoji] = useState('☕');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [googlePlaceUrl, setGooglePlaceUrl] = useState('');
  const [targetStamps, setTargetStamps] = useState(8);
  const [rewardTitle, setRewardTitle] = useState('Free Signature Item');
  const [stampIcon, setStampIcon] = useState<StampIconType>('coffee');
  const [estimatedValue, setEstimatedValue] = useState(6.5);
  const [cashierPin, setCashierPin] = useState('1234');

  if (!isOpen) return null;

  const categoryPresets: Record<BusinessCategory, { emoji: string; icon: StampIconType; reward: string; color: string }> = {
    cafe: { emoji: '☕', icon: 'coffee', reward: 'Free Signature Latte or Pastry', color: '#8b5cf6' },
    barber: { emoji: '💈', icon: 'scissors', reward: '50% Off Deluxe Haircut / Beard Trim', color: '#2563eb' },
    restaurant: { emoji: '🍕', icon: 'pizza', reward: 'Free Appetizer or Dessert with Entree', color: '#dc2626' },
    spa: { emoji: '💅', icon: 'sparkle', reward: 'Free Deluxe Polish Upgrade or Treatment', color: '#ec4899' },
    fitness: { emoji: '⚡', icon: 'flame', reward: 'Free Protein Smoothie or Guest Pass', color: '#ea580c' },
    retail: { emoji: '🛍️', icon: 'gift', reward: '$10 Off Any Purchase of $40+', color: '#10b981' },
    other: { emoji: '⭐', icon: 'star', reward: 'Special VIP Surprise Gift', color: '#6366f1' },
  };

  const handleCategoryChange = (cat: BusinessCategory) => {
    setCategory(cat);
    const preset = categoryPresets[cat];
    if (preset) {
      setLogoEmoji(preset.emoji);
      setStampIcon(preset.icon);
      setRewardTitle(preset.reward);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newBusiness: BusinessProfile = {
      id: `biz-${Date.now()}`,
      slug: slug || `shop-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Locally Owned & Operated',
      category,
      logoEmoji: logoEmoji || '⭐',
      brandColor: categoryPresets[category]?.color || '#8b5cf6',
      accentColor: '#f59e0b',
      gradient: 'from-slate-900 via-indigo-950 to-neutral-900',
      googlePlaceName: name.trim(),
      googlePlaceUrl: googlePlaceUrl.trim() || 'https://maps.google.com',
      phone: phone.trim() || '(555) 000-0000',
      address: address.trim() || 'Local Store Location',
      cashierPin: cashierPin || '1234',
      loyaltyProgram: {
        targetStamps,
        rewardTitle,
        stampIcon,
        terms: `Collect ${targetStamps} stamps to unlock ${rewardTitle}. Valid for in-store visits.`,
        estimatedRewardValue: estimatedValue,
      },
      stats: {
        totalCustomers: 1,
        stampsIssued: 1,
        rewardsRedeemed: 0,
        googleReviewsRedirected: 0,
        privateFeedbackDeflected: 0,
        estimatedRevenueAdded: 15,
      },
    };

    // Save and switch context
    updateBusinessProfile(newBusiness);
    setCurrentBusiness(newBusiness);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Add New Local Client</h2>
            <p className="text-xs text-slate-400">
              Set up a custom loyalty card & Google review funnel for any local store in 30 seconds.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Business Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(categoryPresets) as BusinessCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition ${
                    category === cat
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-base">{categoryPresets[cat].emoji}</span>
                  <span className="capitalize">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Business Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Blue Harbor Coffee Co."
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tagline / Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Specialty Roasts & Artisanal Pastries"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Store Address / Neighborhood</label>
              <input
                type="text"
                placeholder="e.g. 742 Evergreen Terrace"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="(555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Loyalty & Review Setup */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Loyalty Card & Review Settings
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Stamps to Unlock</label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={targetStamps}
                  onChange={e => setTargetStamps(parseInt(e.target.value) || 8)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Reward Description</label>
                <input
                  type="text"
                  value={rewardTitle}
                  onChange={e => setRewardTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Google Maps Review URL (or Place link)</label>
                <input
                  type="url"
                  placeholder="https://search.google.com/local/writereview?..."
                  value={googlePlaceUrl}
                  onChange={e => setGooglePlaceUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Cashier Staff 4-Digit PIN</label>
                <input
                  type="text"
                  maxLength={4}
                  value={cashierPin}
                  onChange={e => setCashierPin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-mono font-bold text-center"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Store & Generate Cards</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
