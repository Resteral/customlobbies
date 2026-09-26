'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig, UserProfile } from '@/lib/types';
import { EFFINGHAM_AREA_BUSINESSES } from '@/lib/local-businesses';
import { playChimeSound } from '@/lib/push-notifications';
import confetti from 'canvas-confetti';
import { 
  Star, Radio, ShieldCheck, CheckCircle2, ExternalLink, 
  Sparkles, MessageSquare, ArrowRight, Heart, ThumbsUp,
  Key, Store, Truck, Hammer, Crown, Users, Smartphone,
  Layers, Lock, Unlock, Phone, Mail, MapPin, Check
} from 'lucide-react';

export default function TapRouterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardId = (params?.id as string) || 'card-oasis-main';
  const magicTokenFromUrl = searchParams?.get('magicToken');

  const { 
    cards, 
    storefronts, 
    recordTap, 
    submitFeedback, 
    currentUser, 
    loginUser, 
    registeredAccounts 
  } = useNfcStore();

  const [card, setCard] = useState<NfcCardConfig | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Administrative Pass State
  const [isAdminPassAuthenticated, setIsAdminPassAuthenticated] = useState(false);

  const getSafeReviewUrl = (c: NfcCardConfig | null) => {
    if (!c) return 'https://www.google.com/search?q=Oasis+Coffee+Bakery+Effingham+NH';
    if (c.googleReviewUrl && !c.googleReviewUrl.includes('search.google.com/local/writereview?placeid=ChIJ_') && !c.googleReviewUrl.includes('SmokeWorld') && !c.googleReviewUrl.includes('12345678')) {
      return c.googleReviewUrl;
    }
    const cleanName = (c.businessName || 'Local Business').trim();
    const cleanTown = (c.town || 'Effingham, NH').trim();
    return `https://www.google.com/search?q=${encodeURIComponent(`${cleanName} ${cleanTown}`)}`;
  };

  useEffect(() => {
    // Find matching card or fallback
    const foundCard = cards.find(c => c.id === cardId) || cards[0];
    if (foundCard) {
      setCard(foundCard);

      // Check if this card is an Administrative Management Pass
      const isAdminPass = foundCard.profileType === 'admin_management_pass' || Boolean(foundCard.adminMagicToken) || Boolean(magicTokenFromUrl);

      if (isAdminPass) {
        setIsAdminPassAuthenticated(true);
        recordTap(foundCard.id, 'admin_pass_tap' as any);
        playChimeSound('bounty');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Automatically log in as provisioned user if not already matching
        if (foundCard.adminProvisionedUser) {
          const matchingRegistered = registeredAccounts.find(
            u => u.name.toLowerCase() === foundCard.adminProvisionedUser?.toLowerCase() ||
                 (foundCard.adminProvisionedPhone && u.phone === foundCard.adminProvisionedPhone)
          );

          if (matchingRegistered) {
            loginUser(matchingRegistered);
          } else {
            // Provision instant session
            const newAdminUser: UserProfile = {
              id: `user-${foundCard.id}`,
              name: foundCard.adminProvisionedUser,
              phone: foundCard.adminProvisionedPhone || '(603) 986-7104',
              email: foundCard.adminProvisionedEmail || `${foundCard.adminProvisionedUser.toLowerCase().replace(/\s+/g, '')}@townraise.org`,
              role: foundCard.adminAccessRole === 'driver' ? 'driver' : foundCard.adminAccessRole === 'contractor' ? 'contractor' : 'merchant',
              town: (foundCard.adminAssignedTown || 'Effingham').split(',')[0],
              state: 'NH',
              avatar: foundCard.adminAccessRole === 'merchant' ? '🏪' : foundCard.adminAccessRole === 'driver' ? '🚐' : foundCard.adminAccessRole === 'contractor' ? '🔨' : '👑',
              badge: `Verified ${foundCard.adminAccessRole?.toUpperCase() || 'NODE'} Pass Lead`,
              createdAt: new Date().toISOString().split('T')[0],
              isDriver: foundCard.adminAccessRole === 'driver',
            };
            loginUser(newAdminUser);
          }
        }
        return;
      }

      // If direct mode, redirect after a moment
      if (foundCard.mode === 'direct_google') {
        setIsRedirecting(true);
        recordTap(foundCard.id, 'direct_redirect');
        const timer = setTimeout(() => {
          const target = getSafeReviewUrl(foundCard);
          window.location.href = target;
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [cardId, cards, magicTokenFromUrl]);

  const handleRate = (stars: number) => {
    if (!card) return;
    setSelectedRating(stars);

    if (stars >= (card.thresholdStars || 4)) {
      // 4-5 Stars: Direct to Google
      recordTap(card.id, 'google_redirect', stars);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      setIsRedirecting(true);

      setTimeout(() => {
        const target = getSafeReviewUrl(card);
        window.location.href = target;
      }, 1400);
    } else {
      // 1-3 Stars: Negative Shield / Feedback
      recordTap(card.id, 'private_feedback', stars);
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!card || !feedbackText.trim()) return;

    submitFeedback(card.id, selectedRating || 3, feedbackText, {
      name: customerName,
      phone: customerContact.includes('@') ? undefined : customerContact,
      email: customerContact.includes('@') ? customerContact : undefined,
    });
    setFeedbackSent(true);
  };

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070709] text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400">Locating NFC Beacon...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE A: ADMINISTRATIVE MANAGEMENT PASS ACTIVATED VIEW
  // =========================================================================
  if (isAdminPassAuthenticated || card.profileType === 'admin_management_pass') {
    const roleTitle = card.adminAccessRole === 'merchant' 
      ? 'Storefront Owner & Menu Manager'
      : card.adminAccessRole === 'driver'
      ? 'Verified Courier Driver'
      : card.adminAccessRole === 'contractor'
      ? 'Master Contractor & Tradesman'
      : card.adminAccessRole === 'town_coordinator'
      ? 'Regional Town Vanguard Lead'
      : card.adminAccessRole === 'staff'
      ? 'Kitchen & Staff Terminal'
      : 'Operations Manager';

    const directUrl = card.adminDirectDashboardUrl || '/dashboard/storefront';

    return (
      <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-96 bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="w-full max-w-lg bg-[#0c0c14] border-2 border-amber-400/50 rounded-[3rem] p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 animate-in zoom-in-95 duration-500">
          
          {/* Top Status Badge */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black mx-auto shadow-xl shadow-amber-400/20 animate-bounce">
              {card.adminAccessRole === 'merchant' ? '🏪' : card.adminAccessRole === 'driver' ? '🚐' : card.adminAccessRole === 'contractor' ? '🔨' : '👑'}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NFC AUTHENTICATED: {roleTitle.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white leading-tight">
                {card.businessName}
              </h1>
              <p className="text-xs text-amber-300 font-mono">
                Welcome, <strong>{card.adminProvisionedUser || 'Node Lead'}</strong>! You are securely logged in.
              </p>
            </div>
          </div>

          {/* Provisioned Node Credentials Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-zinc-400 uppercase text-[10px]">Territory / Town:</span>
              <span className="text-white font-bold">{card.adminAssignedTown || card.town || 'Carroll County, NH'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-zinc-400 uppercase text-[10px]">Provisioned Email:</span>
              <span className="text-white truncate max-w-[200px]">{card.adminProvisionedEmail || 'Registered'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400 uppercase text-[10px]">Session Status:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Active Administrative Session
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <Link
            href={directUrl}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black font-black text-sm uppercase tracking-widest text-center rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <span>Open {card.businessName} Management Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Quick Management Shortcuts */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
              Direct Administrative Hubs:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <Link
                href="/dashboard/storefront"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-zinc-200 hover:text-amber-300 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Storefront Hub</span>
              </Link>
              <Link
                href="/dashboard/kitchen"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-zinc-200 hover:text-amber-300 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="truncate">Live Orders</span>
              </Link>
              <Link
                href="/driver"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-zinc-200 hover:text-amber-300 transition-colors"
              >
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">Courier Terminal</span>
              </Link>
              <Link
                href="/community"
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center gap-2 text-zinc-200 hover:text-amber-300 transition-colors"
              >
                <Radio className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">Live Wire Stream</span>
              </Link>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] font-mono text-zinc-300 space-y-1">
            <p className="text-indigo-300 font-bold">💡 Tip: Add to Phone Home Screen</p>
            <p className="text-zinc-400 leading-relaxed">
              Open your browser menu and tap <strong>"Add to Home Screen"</strong> to install your node terminal app for instant push notifications and synthesized order chimes.
            </p>
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-zinc-500">
            <span>TOWNRAISE SECURE NFC AUTH</span>
            <span>CARD ID: {card.id}</span>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // CASE B: STANDARD GOOGLE REVIEW & STOREFRONT TAP FUNNEL
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070709] flex flex-col items-center justify-center p-4 selection:bg-amber-400 selection:text-black relative overflow-hidden">
      
      {/* Background glow tailored to card color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 blur-[140px] opacity-40 pointer-events-none rounded-full"
        style={{ backgroundColor: card.primaryColor || '#f59e0b' }}
      />

      <div className="w-full max-w-md bg-[#0f0f15] border border-white/10 rounded-[3rem] p-6 md:p-8 shadow-2xl relative z-10 space-y-8 animate-in zoom-in-95 duration-500">
        
        {/* Top Header: Business Logo & Verification badge */}
        <div className="text-center space-y-3">
          <div 
            className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-xl border border-white/10"
            style={{ backgroundColor: `${card.primaryColor || '#f59e0b'}25` }}
          >
            {card.logoUrl || '⭐'}
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono font-bold text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Google Review Node</span>
            </div>
            <h1 className="text-2xl font-black italic tracking-tight text-white uppercase">{card.businessName}</h1>
            {card.assignedStaff && (
              <p className="text-xs text-amber-400 font-medium">Served with pride by {card.assignedStaff}</p>
            )}
          </div>
        </div>

        {/* Dynamic Card State */}
        {card.mode === 'direct_google' || isRedirecting ? (
          /* Direct Redirect / Success Loading Screen */
          <div className="text-center space-y-6 py-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🎉
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black italic text-white">Opening Google Reviews...</h2>
              <p className="text-xs text-zinc-400">
                Forwarding your review directly to Google Maps.
              </p>
            </div>
            <div className="w-32 h-1.5 bg-zinc-800 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-amber-400 animate-pulse" />
            </div>
            <a
              href={card.googleReviewUrl}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-mono"
            >
              <span>Click here if not redirected</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : selectedRating === null ? (
          /* Rating Selector Screen */
          <div className="space-y-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 text-center space-y-4">
              <p className="text-sm font-bold text-zinc-200">
                {card.customHeadline || 'How was your experience today?'}
              </p>

              {/* 5 Stars Buttons */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHighlighted = (hoveredRating !== null ? star <= hoveredRating : false);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => handleRate(star)}
                      className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400 hover:bg-amber-400/20 hover:scale-125 active:scale-95 transition-all text-zinc-600 hover:text-amber-400 group"
                    >
                      <Star className={`w-7 h-7 fill-current ${isHighlighted ? 'text-amber-400' : ''}`} />
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">Tap a star to submit review</p>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center items-center gap-4 text-[9px] font-mono text-zinc-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verified Patron</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Tap Submission</span>
            </div>
          </div>
        ) : selectedRating < (card.thresholdStars || 4) && !feedbackSent ? (
          /* Private Rating Shield / Manager Feedback Form */
          <form onSubmit={handleFeedbackSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-xs font-bold">Direct Manager Escalation</p>
                <p className="text-[10px] text-indigo-200/70">Your thoughts go straight to the business owner privately.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  Phone or Email (Optional for followup)
                </label>
                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  placeholder="e.g. (603) 555-0199"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1 block">
                  How can we improve? *
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Let the store manager know what we could have done better..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"
              >
                Send Private Note to Manager
              </button>
            </div>
          </form>
        ) : (
          /* Private Feedback Success State */
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black italic text-white uppercase">Thank You</h3>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Your message has been dispatched directly to the store manager. We appreciate you helping us improve!
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE STORE MENU & FEATURED CATALOG */}
        {/* ========================================================================= */}
        {(() => {
          // Find matching local business or storefront
          const matchedBiz = EFFINGHAM_AREA_BUSINESSES.find(
            (b: any) => b.name.toLowerCase() === card.businessName.toLowerCase() ||
                 b.id.toLowerCase() === card.businessName.toLowerCase()
          );
          const matchedStorefront = storefronts.find(
            sf => sf.businessName.toLowerCase() === card.businessName.toLowerCase() ||
                  sf.slug.toLowerCase() === card.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')
          );

          const menuItems = matchedBiz?.menuItems || matchedStorefront?.products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: `$${p.price.toFixed(2)}`,
            category: p.category,
            popular: !!p.badge,
            imageEmoji: '🍽️'
          })) || [];

          if (menuItems.length === 0) return null;

          return (
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-400 font-mono tracking-wider flex items-center gap-1.5">
                  <span>🍽️</span>
                  <span>{matchedBiz?.menuTitle || 'Featured Store Menu'}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500 font-bold">{menuItems.length} Items</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {menuItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white truncate">{item.name}</span>
                        {item.popular && (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 line-clamp-1">{item.description}</p>
                    </div>
                    <span className="text-xs font-mono font-black text-amber-400 shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                {matchedStorefront ? (
                  <a
                    href={`/site/${matchedStorefront.slug}`}
                    className="flex-1 py-2.5 bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 hover:bg-amber-300"
                  >
                    <span>Order Online & Full Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href="/menus"
                    className="flex-1 py-2.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Browse All Local Digital Menus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })()}

        {/* Footer info */}
        <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-zinc-600">
          <span>TOWNRAISE PROTOCOL</span>
          <span>NODE ID: {card.id}</span>
        </div>
      </div>
    </div>
  );
}
