'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { PrivateFeedback } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { 
  ShieldCheck, Star, MessageSquare, Phone, Mail, 
  CheckCircle2, AlertTriangle, Send, Gift, Tag, 
  ArrowRight, Search, Filter, Sparkles, Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MerchantFeedbackCenterPage() {
  const { feedbacks, updateFeedbackStatus, resolveFeedbackWithCoupon } = useNfcStore();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyNotes, setReplyNotes] = useState<{ [id: string]: string }>({});
  const [couponNotice, setCouponNotice] = useState<string | null>(null);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchesStatus = filterStatus === 'all' || fb.status === filterStatus;
    const matchesRating = filterRating === 'all' || fb.rating.toString() === filterRating;
    const matchesSearch = fb.feedbackText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (fb.customerName && fb.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (fb.businessName && fb.businessName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesRating && matchesSearch;
  });

  const totalFeedbacks = feedbacks.length;
  const newTickets = feedbacks.filter(f => f.status === 'new').length;
  const inProgressTickets = feedbacks.filter(f => f.status === 'in_progress').length;
  const resolvedTickets = feedbacks.filter(f => f.status === 'resolved').length;
  const resolutionRate = totalFeedbacks > 0 ? Math.round((resolvedTickets / totalFeedbacks) * 100) : 100;

  const handleSendCoupon = (id: string, customerName: string = 'Guest') => {
    resolveFeedbackWithCoupon(id, 'OASIS15');
    setCouponNotice(`Win-back 15% discount coupon dispatched to ${customerName}!`);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCouponNotice(null), 3000);
  };

  const handleSaveNote = (id: string) => {
    const note = replyNotes[id];
    if (note !== undefined) {
      updateFeedbackStatus(id, 'in_progress', note);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400">
            Rating Shield & Customer Care
          </span>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
            Feedback & Resolution Center
          </h1>
          <p className="text-xs text-zinc-400">
            Intercepted customer complaints from the 1-3 star smart NFC tap shield and community feedback portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/feedback"
            target="_blank"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Public Feedback Portal</span>
          </Link>
        </div>
      </div>

      {couponNotice && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{couponNotice}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Total Shielded Tickets</span>
          <p className="text-4xl font-black italic text-indigo-400">{totalFeedbacks}</p>
          <p className="text-[9px] font-mono text-zinc-500">Prevented from Google Maps</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Unresolved Action Items</span>
          <p className="text-4xl font-black italic text-amber-400">{newTickets}</p>
          <p className="text-[9px] font-mono text-amber-400/80">Requires manager reply</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Resolution Score</span>
          <p className="text-4xl font-black italic text-emerald-400">{resolutionRate}%</p>
          <p className="text-[9px] font-mono text-emerald-300">{resolvedTickets} resolved tickets</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">In Progress</span>
          <p className="text-4xl font-black italic text-white">{inProgressTickets}</p>
          <p className="text-[9px] font-mono text-zinc-500">Actively being handled</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-3xl backdrop-blur-xl">
        {/* Status Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['all', 'new', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Tickets' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Rating Filter & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="bg-[#121218] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
          >
            <option value="all">All Star Ratings</option>
            <option value="1">1 Star Only (Critical)</option>
            <option value="2">2 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="5">5 Stars (Praise)</option>
          </select>

          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feedback..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Feedback Tickets List */}
      <div className="space-y-6">
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center text-zinc-500 font-mono text-xs">
            No customer feedback tickets found matching your filter criteria.
          </div>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className={`bg-[#0e0e14] border rounded-3xl p-6 md:p-8 space-y-6 transition-all shadow-xl ${
                fb.status === 'new'
                  ? 'border-indigo-500/40 bg-indigo-950/10'
                  : fb.status === 'resolved'
                  ? 'border-emerald-500/20'
                  : 'border-white/10'
              }`}
            >
              {/* Ticket Top Bar */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    fb.rating <= 2
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : fb.rating === 3
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {fb.rating} ★
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black italic text-white text-lg">
                        {fb.customerName || 'Anonymous Customer'}
                      </h3>
                      {fb.town && (
                        <span className="text-[9px] font-mono text-zinc-500">({fb.town})</span>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400">
                      Logged for {fb.businessName} • {formatDate(fb.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase border ${
                    fb.status === 'new'
                      ? 'bg-amber-400/20 text-amber-400 border-amber-400/30 animate-pulse'
                      : fb.status === 'in_progress'
                      ? 'bg-blue-400/20 text-blue-300 border-blue-400/30'
                      : 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {fb.status === 'new' ? '● Action Required' : fb.status === 'in_progress' ? '● In Progress' : '✓ Resolved'}
                  </span>
                </div>
              </div>

              {/* Feedback Content Quote */}
              <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1">
                <span className="text-[9px] font-mono uppercase text-zinc-500">Customer Statement</span>
                <p className="text-sm text-zinc-200 italic leading-relaxed">
                  "{fb.feedbackText}"
                </p>
              </div>

              {/* Resolution Action Log if Present */}
              {fb.resolutionAction && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{fb.resolutionAction} (Resolved at {formatDate(fb.resolvedAt || fb.timestamp)})</span>
                </div>
              )}

              {/* Action Toolkit Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                
                {/* Left: Contact Customer Directly */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase text-zinc-500">1-Click Customer Follow-up</span>
                  <div className="flex flex-wrap gap-2">
                    {fb.customerPhone && (
                      <a
                        href={`tel:${fb.customerPhone}`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call ({fb.customerPhone})</span>
                      </a>
                    )}

                    {fb.customerEmail && (
                      <a
                        href={`mailto:${fb.customerEmail}?subject=Regarding your recent visit to ${encodeURIComponent(fb.businessName)}&body=Hi ${encodeURIComponent(fb.customerName || 'there')}, thank you for your private feedback...`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Email Customer</span>
                      </a>
                    )}

                    {!fb.customerPhone && !fb.customerEmail && (
                      <span className="text-xs text-zinc-600 font-mono italic">No contact information provided by customer</span>
                    )}
                  </div>
                </div>

                {/* Right: Win-Back Coupon & Status Management */}
                <div className="space-y-2 text-right md:text-left">
                  <span className="text-[9px] font-mono uppercase text-zinc-500">Resolution Controls</span>
                  <div className="flex flex-wrap gap-2">
                    {fb.status !== 'resolved' && (
                      <button
                        onClick={() => handleSendCoupon(fb.id, fb.customerName)}
                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                      >
                        <Gift className="w-3.5 h-3.5" />
                        <span>Send Win-Back 15% Coupon</span>
                      </button>
                    )}

                    {fb.status !== 'resolved' ? (
                      <button
                        onClick={() => updateFeedbackStatus(fb.id, 'resolved', 'Resolved by store manager')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        Mark Resolved ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => updateFeedbackStatus(fb.id, 'new')}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs rounded-xl transition-all"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Manager Internal Reply Notes Field */}
              <div className="pt-2 border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  placeholder={fb.replyNote || "Add internal manager resolution note..."}
                  value={replyNotes[fb.id] || ''}
                  onChange={(e) => setReplyNotes({ ...replyNotes, [fb.id]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
                />
                {replyNotes[fb.id] && (
                  <button
                    onClick={() => handleSaveNote(fb.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Save Note
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
