import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Award, 
  DollarSign, 
  Star, 
  ShieldCheck, 
  Settings, 
  MessageSquare, 
  TrendingUp, 
  Save, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  PlusCircle
} from 'lucide-react';
import { BusinessCategory, StampIconType } from '../types';
import { CreateBusinessModal } from './CreateBusinessModal';

export const MerchantDashboard: React.FC = () => {
  const { currentBusiness, updateBusinessProfile, feedbacks, resolveFeedbackItem, businesses, setCurrentBusiness } = useApp();
  
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'feedback'>('overview');
  const [formData, setFormData] = useState(currentBusiness);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isNewBusinessModalOpen, setIsNewBusinessModalOpen] = useState(false);

  // Sync form if current business changes
  React.useEffect(() => {
    setFormData(currentBusiness);
  }, [currentBusiness]);

  const businessFeedbacks = feedbacks.filter(f => f.businessId === currentBusiness.id);
  const unresolvedFeedbackCount = businessFeedbacks.filter(f => !f.resolved).length;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner with Business Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-500/30 flex items-center justify-center text-3xl shadow-lg">
            {currentBusiness.logoEmoji}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              {currentBusiness.name}
              <span className="text-xs font-normal text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                {currentBusiness.category.toUpperCase()}
              </span>
            </h1>
            <p className="text-xs text-slate-400">{currentBusiness.address} • {currentBusiness.phone}</p>
          </div>
        </div>

        {/* Quick Business Switcher + Add Client */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Store:</label>
            <select
              value={currentBusiness.id}
              onChange={e => {
                const selected = businesses.find(b => b.id === e.target.value);
                if (selected) setCurrentBusiness(selected);
              }}
              className="bg-slate-800 border border-slate-700 text-xs text-white rounded-xl p-2.5 focus:outline-none focus:border-amber-500 font-semibold"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.logoEmoji} {b.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsNewBusinessModalOpen(true)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'overview'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Live Performance & KPIs</span>
        </button>

        <button
          onClick={() => setActiveSubTab('feedback')}
          className={`relative px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'feedback'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Private Feedback Inbox</span>
          {unresolvedFeedbackCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-black">
              {unresolvedFeedbackCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeSubTab === 'settings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Program & Campaign Rules</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Estimated Added Revenue */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Estimated Added Rev</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                ${currentBusiness.stats.estimatedRevenueAdded.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +24% Repeat Visit Lift
              </p>
            </div>

            {/* KPI 2: Total Customers */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Members</span>
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {currentBusiness.stats.totalCustomers}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentBusiness.stats.stampsIssued} total stamps punched
              </p>
            </div>

            {/* KPI 3: Google 5-Star Reviews Multiplied */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Google Reviews Boosted</span>
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                +{currentBusiness.stats.googleReviewsRedirected}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Direct 4-5★ redirects to Google Maps
              </p>
            </div>

            {/* KPI 4: Bad Reviews Deflected */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Public Flaws Deflected</span>
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-2xl font-black text-teal-400 font-mono">
                {currentBusiness.stats.privateFeedbackDeflected}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Intercepted & sent privately to owner
              </p>
            </div>
          </div>

          {/* Quick Value Prop Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-3xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Active Loyalty Campaign
              </h3>
              <div className="p-4 bg-slate-800/80 rounded-2xl space-y-1.5 border border-slate-700/60">
                <div className="text-xs font-bold text-amber-300">
                  {currentBusiness.loyaltyProgram.targetStamps} Stamps = {currentBusiness.loyaltyProgram.rewardTitle}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {currentBusiness.loyaltyProgram.terms}
                </p>
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-3xl space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Google Review Integration
              </h3>
              <div className="p-4 bg-slate-800/80 rounded-2xl space-y-2 border border-slate-700/60">
                <div className="text-xs text-slate-300 font-mono truncate">
                  {currentBusiness.googlePlaceUrl}
                </div>
                <a
                  href={currentBusiness.googlePlaceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <span>Test Google Maps Deep Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRIVATE FEEDBACK INBOX */}
      {activeSubTab === 'feedback' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Private Customer Feedback Shield
            </h3>
            <span className="text-xs text-slate-400">
              These ratings (1-3 stars) were stopped from hitting Google Maps!
            </span>
          </div>

          {businessFeedbacks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
              No private feedback received yet. All customer interactions have been positive!
            </div>
          ) : (
            <div className="space-y-3">
              {businessFeedbacks.map(fb => (
                <div
                  key={fb.id}
                  className={`p-5 rounded-3xl border transition ${
                    fb.resolved
                      ? 'bg-slate-900/50 border-slate-800 opacity-60'
                      : 'bg-slate-900 border-amber-500/30 shadow-lg'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      {/* Star Display */}
                      <div className="flex items-center text-amber-400 font-bold text-xs">
                        {Array.from({ length: fb.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                        <span className="ml-1.5 font-mono text-white">({fb.rating}/5)</span>
                      </div>

                      {/* Issue Tags */}
                      <div className="flex flex-wrap gap-1">
                        {fb.tags.map(t => (
                          <span key={t} className="text-[10px] bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      <button
                        onClick={() => resolveFeedbackItem(fb.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                          fb.resolved
                            ? 'bg-slate-800 text-slate-400'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{fb.resolved ? 'Resolved' : 'Mark as Fixed'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 pt-3 leading-relaxed">
                    "{fb.comment}"
                  </p>

                  {fb.customerContact && (
                    <div className="mt-3 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl inline-block">
                      Contact for Follow-up: <strong>{fb.customerContact}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SETTINGS / PROGRAM CONFIG */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Store & Loyalty Settings</h3>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full animate-bounce">
                ✓ Changes Saved Successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name & Emoji */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Logo Emoji</label>
                  <input
                    type="text"
                    value={formData.logoEmoji}
                    onChange={e => setFormData({ ...formData, logoEmoji: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-center text-lg text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Cashier Staff PIN</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.cashierPin}
                    onChange={e => setFormData({ ...formData, cashierPin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-center font-mono font-bold text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Loyalty Rules */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Stamps to Reward</label>
                  <input
                    type="number"
                    min={3}
                    max={12}
                    value={formData.loyaltyProgram.targetStamps}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        loyaltyProgram: {
                          ...formData.loyaltyProgram,
                          targetStamps: parseInt(e.target.value) || 8,
                        },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Reward Value Est. ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.loyaltyProgram.estimatedRewardValue}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        loyaltyProgram: {
                          ...formData.loyaltyProgram,
                          estimatedRewardValue: parseFloat(e.target.value) || 5,
                        },
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Reward Title</label>
                <input
                  type="text"
                  value={formData.loyaltyProgram.rewardTitle}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      loyaltyProgram: {
                        ...formData.loyaltyProgram,
                        rewardTitle: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Google Maps Review Deep Link</label>
                <input
                  type="url"
                  value={formData.googlePlaceUrl}
                  onChange={e => setFormData({ ...formData, googlePlaceUrl: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Create Business Modal */}
      <CreateBusinessModal
        isOpen={isNewBusinessModalOpen}
        onClose={() => setIsNewBusinessModalOpen(false)}
      />
    </div>
  );
};
