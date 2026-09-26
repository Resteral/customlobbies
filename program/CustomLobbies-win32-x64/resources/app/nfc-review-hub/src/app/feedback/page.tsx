'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Star, MessageSquare, ShieldCheck, HeartHandshake, 
  Send, Sparkles, AlertTriangle, ArrowRight, CheckCircle2,
  Tag, MapPin, Phone, Mail, Award, ThumbsUp
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import confetti from 'canvas-confetti';

export default function PublicFeedbackPage() {
  const { submitGeneralFeedback, activeTown, towns } = useNfcStore();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [category, setCategory] = useState<'delivery' | 'product' | 'service' | 'hardware' | 'town_general'>('service');
  const [selectedTown, setSelectedTown] = useState(activeTown.fullName);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRating, setSubmittedRating] = useState(5);

  const categories = [
    { id: 'service', label: 'Customer Service & Staff', icon: HeartHandshake },
    { id: 'delivery', label: 'Express Delivery & Courier', icon: ThumbsUp },
    { id: 'product', label: 'Artisan & Product Quality', icon: Tag },
    { id: 'hardware', label: 'NFC Beacon & Card Hardware', icon: Award },
    { id: 'town_general', label: 'Town Node Suggestion', icon: MapPin },
  ] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    submitGeneralFeedback({
      businessName: `${selectedTown} Central Node`,
      rating,
      category: category === 'delivery' ? 'courier' : category === 'product' ? 'product' : category === 'town_general' ? 'suggestion' : category === 'hardware' ? 'experience' : 'experience',
      feedbackText: comment,
      customerName: customerName.trim() || 'Anonymous Patron',
      customerPhone: customerPhone.trim() || undefined,
      customerEmail: customerEmail.trim() || undefined,
      town: selectedTown,
    });

    setSubmittedRating(rating);
    setIsSubmitted(true);

    if (rating >= 4) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981'],
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setRating(5);
    setComment('');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-10 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          Direct Feedback & Customer Care Center
        </div>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
          Your Voice Shapes <span className="text-amber-400">Our Community</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
          Whether you had a phenomenal 5-star experience or faced an issue with your delivery, staff, or artisan purchase—we review every single submission immediately.
        </p>
      </div>

      {isSubmitted ? (
        /* Submission Success Card */
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Feedback Received & Logged!
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {submittedRating >= 4 ? (
                <span>Thank you for the wonderful {submittedRating}-star rating! Your positive feedback inspires our local artisans, couriers, and staff.</span>
              ) : (
                <span>We deeply apologize for falling short of 5 stars. Our management team has received your ticket and will personally review it to make things right.</span>
              )}
            </p>
          </div>

          {submittedRating >= 4 ? (
            /* 5-Star Google Review Forwarding CTA */
            <div className="bg-amber-400/5 border border-amber-400/20 rounded-2xl p-6 max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Share your experience on Google Reviews</span>
              </div>
              <p className="text-xs text-zinc-400">
                Would you mind copying your praise to our public Google business profile? It takes under 10 seconds!
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20"
              >
                <span>Post on Google Reviews</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            /* Low Rating Resolution Guarantee Box */
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-6 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Private Shield Activated</span>
              </div>
              <p className="text-xs text-zinc-400">
                Your feedback remains private with management. We will follow up via your contact info with a resolution and our courtesy <strong className="text-white">OASIS15</strong> voucher.
              </p>
            </div>
          )}

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
            >
              Submit Another Response
            </button>
            <Link
              href="/marketplace"
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-amber-400/20"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      ) : (
        /* Feedback Submission Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Guarantees & Info */}
          <div className="space-y-6">
            <div className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 space-y-5">
              <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Our Resolution Pledge</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We believe that every piece of feedback is an opportunity to elevate our service quality across all town nodes.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">1</div>
                  <p><strong className="text-white">Direct Management Review:</strong> No automated bots—your message is read directly by local operators.</p>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-indigo-400/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">2</div>
                  <p><strong className="text-white">Negative Review Shield:</strong> Low ratings are isolated to private resolution before public escalation.</p>
                </div>
                <div className="flex items-start gap-3 text-xs text-zinc-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-400/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">3</div>
                  <p><strong className="text-white">Win-Back Guarantee:</strong> Honest complaints receive direct follow-up plus courtesy compensation.</p>
                </div>
              </div>
            </div>

            {/* Merchant Access Tip */}
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
              <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Are you a merchant?</span>
              <p className="text-xs text-zinc-400">
                Log into your dashboard to manage your private feedback inbox and dispatch resolution coupons.
              </p>
              <Link
                href="/dashboard/feedback"
                className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline pt-1"
              >
                <span>Go to Feedback Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Active Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#0a0a0f] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              {/* Star Rating Selector */}
              <div className="space-y-3 text-center py-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-300">
                  How was your overall experience?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none transition-transform hover:scale-125"
                      >
                        <Star
                          className={`w-9 h-9 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                              : 'text-zinc-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs font-mono font-bold text-amber-400">
                  {rating === 5 && '★★★★★ Outstanding / 5 Stars'}
                  {rating === 4 && '★★★★☆ Great / 4 Stars'}
                  {rating === 3 && '★★★☆☆ Neutral / 3 Stars'}
                  {rating === 2 && '★★☆☆☆ Disappointing / 2 Stars'}
                  {rating === 1 && '★☆☆☆☆ Needs Immediate Attention / 1 Star'}
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400/40 text-white'
                            : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                        <span className="text-[11px] font-bold leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Town Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Associated Town Node</span>
                </label>
                <select
                  value={selectedTown}
                  onChange={(e) => setSelectedTown(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {towns.map((t) => (
                    <option key={t.id} value={t.fullName} className="bg-[#0a0a0f] text-white">
                      {t.icon} {t.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Comments Textarea */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Detailed Feedback & Comments</span>
                  <span className="text-[10px] text-zinc-500 font-mono">Required</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what went well or how we can improve your experience..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Optional Contact Fields */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Contact Information (Optional for Follow-Up)
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">For resolution & vouchers</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone (603-555-0199)"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Email Address"
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!comment.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-amber-400/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Confidential Feedback</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
