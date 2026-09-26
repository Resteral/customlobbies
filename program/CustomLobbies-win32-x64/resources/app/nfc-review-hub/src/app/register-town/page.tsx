'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  Building2, MapPin, Phone, Sparkles, CheckCircle2, 
  ArrowLeft, ArrowRight, Radio, Compass, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TOWN_ICONS = ['🏡', '🌲', '🏔️', '🌊', '🌵', '🌴', '⚡', '💎', '🚀', '🏙️', '🍕', '☕'];
const ACCENT_COLORS = ['#f59e0b', '#6366f1', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

export default function RegisterTownPage() {
  const router = useRouter();
  const { registerTown } = useNfcStore();

  const [townName, setTownName] = useState('');
  const [stateCode, setStateCode] = useState('NH');
  const [tagline, setTagline] = useState('Local Independent Discovery Hub');
  const [selectedIcon, setSelectedIcon] = useState('🏡');
  const [accentColor, setAccentColor] = useState('#f59e0b');
  const [vanguardLead, setVanguardLead] = useState('');
  const [dispatchPhone, setDispatchPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!townName.trim() || !stateCode.trim() || !vanguardLead.trim()) {
      alert('Please fill out the required town name, state, and vanguard lead name.');
      return;
    }

    setIsSubmitting(true);

    const registered = registerTown({
      name: townName.trim(),
      state: stateCode.trim().toUpperCase(),
      fullName: `${townName.trim()}, ${stateCode.trim().toUpperCase()}`,
      tagline: tagline || 'Local Discovery Node',
      icon: selectedIcon,
      vanguardLead: vanguardLead.trim(),
      dispatchPhone: dispatchPhone.trim() || '(603) 555-0199',
      description: description.trim() || `Official Oasis town node for ${townName.trim()}, connecting local independent boutiques, reviews, and express courier delivery.`,
      accentColor,
    });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      router.push(`/dashboard/town-command`);
    }, 1200);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background ambient lights */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-10">
        
        {/* Top Back Link */}
        <Link
          href="/towns"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Regional Radar</span>
        </Link>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Decentralized Node Deployment Protocol</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Launch Your <span className="text-amber-400">Town Node.</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto">
            Establish a local Oasis ecosystem for your town or city. Connect your community's shops, NFC review stations, and express delivery couriers under one unified hub.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#0b0b10] border border-white/10 rounded-[3rem] p-6 md:p-10 space-y-8 shadow-2xl">
          
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Geographic Telemetry</span>
              <h3 className="text-xl font-black italic text-white uppercase">Town Identity & Coordinates</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Town / City Name *</label>
                <input
                  type="text"
                  required
                  value={townName}
                  onChange={(e) => setTownName(e.target.value)}
                  placeholder="e.g. Austin or Conway"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">State / Region Code *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                  placeholder="e.g. TX, NH, CA"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Regional Tagline / Node Hook</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Hill Country Innovation Hub or Mountain Valley Gateway"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Town Overview / Story</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What makes your local community special? (e.g. local cafes, organic farms, craft makers, and courier routes)..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Town Icon & Accent Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-2 block">Choose Town Node Emblem</label>
                <div className="flex flex-wrap gap-2">
                  {TOWN_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`w-10 h-10 rounded-xl border text-lg flex items-center justify-center transition-all ${
                        selectedIcon === icon
                          ? 'bg-amber-400/20 border-amber-400 scale-110 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-2 block">Node Radar Accent Color</label>
                <div className="flex gap-2">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAccentColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        accentColor === c ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Vanguard & Driver Phone Relay */}
          <div className="space-y-6 pt-4 border-t border-white/5">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[9px] font-mono uppercase text-indigo-400 tracking-wider">Local Operations</span>
              <h3 className="text-xl font-black italic text-white uppercase">Vanguard Lead & Dispatch Contact</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Vanguard Lead / Organization *</label>
                <input
                  type="text"
                  required
                  value={vanguardLead}
                  onChange={(e) => setVanguardLead(e.target.value)}
                  placeholder="e.g. Austin Artisan Guild or Dave M."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Courier Dispatch Phone (Delivery Alerts)</label>
                <input
                  type="tel"
                  value={dispatchPhone}
                  onChange={(e) => setDispatchPhone(e.target.value)}
                  placeholder="e.g. (512) 555-0188"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
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
                  Initializing Node Lattice...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Deploy Town Node to Regional Radar</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
