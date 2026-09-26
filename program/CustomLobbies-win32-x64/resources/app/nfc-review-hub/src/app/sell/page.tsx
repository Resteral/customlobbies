'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';
import { 
  ShoppingBag, Sparkles, Building2, Phone, MapPin, 
  Tag, Image as ImageIcon, DollarSign, CheckCircle2, ArrowRight, UserCheck, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ImageUpload from '@/components/ImageUpload';

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Artisan Woodcraft', url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80' },
  { label: 'Artisan Bakery / Sourdough', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
  { label: 'Organic Foraged Tea / Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
  { label: 'Specialty Coffee / Cold Brew', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Smart NFC Hardware', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80' },
];

export default function SellPage() {
  const router = useRouter();
  const { addCommunityProduct, addSeller, sellers, currentUser } = useNfcStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Item form fields
  const [productName, setProductName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'artisan' | 'food' | 'cards' | 'stands' | 'services'>('artisan');
  const [material, setMaterial] = useState('');
  const [featuresText, setFeaturesText] = useState('Locally crafted in Carroll County, Express courier delivery available, 100% Quality guaranteed');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGE_PRESETS[0].url);

  // Seller info
  const [sellerName, setSellerName] = useState(currentUser?.name || sellers[0]?.name || "Walt's Artisan Workshop");
  const [sellerPhone, setSellerPhone] = useState(currentUser?.phone || '(603) 555-0144');
  const [town, setTown] = useState(currentUser?.town ? `${currentUser.town}, NH` : 'Effingham, NH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with currentUser when changed
  useEffect(() => {
    if (currentUser) {
      setSellerName(currentUser.name);
      setSellerPhone(currentUser.phone);
      setTown(`${currentUser.town}, NH`);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !price || !sellerName) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);

    const featuresArray = featuresText.split(',').map(f => f.trim()).filter(Boolean);

    addCommunityProduct({
      name: productName,
      slug: productName.toLowerCase().replace(/\s+/g, '-'),
      subtitle: subtitle || `Handcrafted local treasure by ${sellerName}`,
      description: description || `Authentic independent goods made with pride in ${town}.`,
      price: parseFloat(price) || 25.00,
      badge: 'Fresh Community Drop',
      category,
      material: material || 'Artisan Small-Batch Craft',
      features: featuresArray,
      imageUrl,
      sellerName,
      sellerPhone,
      town,
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      router.push('/marketplace');
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Scale Your Discovery • Onboard Community Node</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            List Your Item on <span className="text-amber-400">Marketplace.</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            Broadcast your independent crafts, bakehouse treats, or services across the unified Oasis regional network.
          </p>
        </div>

        {/* Poster Account Identity Card */}
        <div className="p-5 rounded-3xl bg-[#0e0e14] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-2xl shadow-inner">
              {currentUser?.avatar || '🏷️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Listing as: <strong className="text-amber-400">{currentUser ? currentUser.name : 'Guest Merchant'}</strong>
                </span>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                    {currentUser.role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {currentUser ? `📍 Phone for order relays: ${currentUser.phone} • Town: ${currentUser.town}, NH` : 'Sign in with your account to auto-fill your merchant name, phone, and town location.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>{currentUser ? 'Switch Account' : 'Log In / Switch Role'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Listing Form */}
        <form onSubmit={handleSubmit} className="bg-[#0b0b10] border border-white/10 rounded-[3rem] p-6 md:p-10 space-y-8 shadow-2xl">
          
          {/* Section 1: Item Info */}
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Item Specifications</span>
              <h3 className="text-xl font-black italic text-white uppercase">Product Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Product / Item Title *</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Maple Glazed Sourdough Cinnamon Roll"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Price ($ USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 18.50"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="artisan">🎨 Artisan Wood & Craft</option>
                  <option value="food">🥐 Food & Bakehouse</option>
                  <option value="cards">💳 Smart NFC Review Cards</option>
                  <option value="stands">💎 Tabletop Acrylic Stands</option>
                  <option value="services">🚐 Courier & Local Services</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Material / Craft Finish</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. 100% Organic Local Grains"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Short Subtitle / Hook</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Stone-milled sourdough made with local NH maple syrup"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Full Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your craft, flavors, origin, or why customers love it..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Photo Upload & Presets */}
            <div className="space-y-3">
              <ImageUpload
                value={imageUrl}
                onChange={(url) => setImageUrl(url)}
                label="Item Product Photo *"
                subtitle="Upload high-resolution photo of your craft, food, or item (PNG, JPG, WEBP)"
                aspectRatio="card"
              />

              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-mono uppercase text-zinc-500 block">Or Choose Preset Stock Image:</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all border ${
                        imageUrl === preset.url
                          ? 'bg-amber-400 text-black border-amber-400 font-bold'
                          : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Seller Profile & Delivery Phone */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider">Merchant Profile</span>
              <h3 className="text-xl font-black italic text-white uppercase">Seller & Phone Relay Setup</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Seller / Brand Name *</label>
                <input
                  type="text"
                  required
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  placeholder="e.g. Walt's Artisan Workshop"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Phone (For Delivery Relays) *</label>
                <input
                  type="tel"
                  required
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  placeholder="e.g. (603) 555-0144"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Town / Location *</label>
                <input
                  type="text"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  placeholder="e.g. Effingham, NH"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Broadcasting Node to Marketplace...
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Item to Marketplace & Broadcast Shoutout</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
