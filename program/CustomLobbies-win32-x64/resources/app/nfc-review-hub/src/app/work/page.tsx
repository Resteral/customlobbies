'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { TradeCategory, WorkRequest } from '@/lib/types';
import ImageUpload from '@/components/ImageUpload';
import AuthModal from '@/components/AuthModal';
import { 
  Wrench, Phone, Mail, ExternalLink, 
  MapPin, Clock, DollarSign, PlusCircle, CheckCircle2, 
  Search, Filter, ShieldCheck, Flame, MessageSquare, 
  ArrowRight, ThumbsUp, Send, Briefcase, Star, AlertCircle, RefreshCw, UserCheck,
  Truck, Check
} from 'lucide-react';

const CATEGORY_LABELS: Record<TradeCategory, { label: string; icon: string }> = {
  landscaping: { label: 'Landscaping & Hardscape', icon: '🌿' },
  roofing_siding: { label: 'Roofing & Siding', icon: '🏠' },
  carpentry: { label: 'Carpentry & Decks', icon: '🪓' },
  painting: { label: 'Painting & Staining', icon: '🎨' },
  tree_service: { label: 'Tree Care & Removal', icon: '🌲' },
  masonry: { label: 'Masonry & Stonework', icon: '🧱' },
  auto_repair: { label: 'Automotive & Small Engine', icon: '🔧' },
  handyman: { label: 'Handyman & Repairs', icon: '🔨' },
  plumbing_electrical: { label: 'Plumbing & Electric', icon: '⚡' },
  cleaning: { label: 'Pressure Wash & Cleaning', icon: '✨' },
  other: { label: 'General Trade Services', icon: '🛠️' },
};

export default function WorkAndTradesPage() {
  const { 
    workRequests, 
    addWorkRequest,
    incrementWorkRequestQuotes,
    activeTown,
    towns,
    currentUser
  } = useNfcStore();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'post_job' | 'dispatch'>('jobs');
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory | 'all'>('all');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Contractor Quote Modal State for Job Board
  const [activeQuoteModalRequest, setActiveQuoteModalRequest] = useState<WorkRequest | null>(null);
  const [quoteContractorName, setQuoteContractorName] = useState(currentUser?.name || '');
  const [quoteContractorPhone, setQuoteContractorPhone] = useState(currentUser?.phone || '(603) ');
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteMessage, setQuoteMessage] = useState('');
  const [quoteSubmittedSuccess, setQuoteSubmittedSuccess] = useState(false);

  // Homeowner Post Job Form State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCategory, setNewJobCategory] = useState<TradeCategory>('landscaping');
  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobTown, setNewJobTown] = useState(currentUser?.town || activeTown?.name || 'Effingham');
  const [newJobBudget, setNewJobBudget] = useState('$200 - $500');
  const [newJobUrgency, setNewJobUrgency] = useState<'emergency_today' | 'within_few_days' | 'flexible_this_month'>('within_few_days');
  const [newJobName, setNewJobName] = useState(currentUser?.name || '');
  const [newJobPhone, setNewJobPhone] = useState(currentUser?.phone || '(603) ');
  const [newJobAddress, setNewJobAddress] = useState('');
  const [newJobBeforeImage, setNewJobBeforeImage] = useState('');
  const [jobPostSuccess, setJobPostSuccess] = useState(false);

  // Sync state when currentUser switches
  useEffect(() => {
    if (currentUser) {
      setNewJobName(currentUser.name);
      setNewJobPhone(currentUser.phone);
      if (currentUser.town) setNewJobTown(currentUser.town);

      setQuoteContractorName(currentUser.name);
      setQuoteContractorPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Filtered Work Requests
  const filteredWorkRequests = useMemo(() => {
    return workRequests.filter(req => {
      const matchCat = selectedCategory === 'all' || req.category === selectedCategory;
      const matchTown = selectedTown === 'all' || req.town.toLowerCase().includes(selectedTown.toLowerCase());
      const matchQuery = !searchQuery || 
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTown && matchQuery;
    });
  }, [workRequests, selectedCategory, selectedTown, searchQuery]);

  // Handle Homeowner Post Submit
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobName || !newJobPhone) return;

    addWorkRequest({
      title: newJobTitle,
      category: newJobCategory,
      description: newJobDescription,
      town: newJobTown,
      state: 'NH',
      budgetRange: newJobBudget,
      urgency: newJobUrgency,
      requesterName: newJobName,
      requesterPhone: newJobPhone,
      addressOrNeighborhood: newJobAddress,
      beforeImageUrl: newJobBeforeImage || undefined,
    });

    setJobPostSuccess(true);
    setTimeout(() => {
      setJobPostSuccess(false);
      setActiveTab('jobs');
      setNewJobTitle('');
      setNewJobDescription('');
      setNewJobBeforeImage('');
    }, 1800);
  };

  // Handle Submit Quote
  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuoteModalRequest || !quoteContractorName || !quoteContractorPhone) return;

    incrementWorkRequestQuotes(activeQuoteModalRequest.id);
    setQuoteSubmittedSuccess(true);
    setTimeout(() => {
      setQuoteSubmittedSuccess(false);
      setActiveQuoteModalRequest(null);
      setQuoteContractorName('');
      setQuotePrice('');
      setQuoteMessage('');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-80 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Carroll County Trades & Work Request Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
            Trades & Contractor <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Job Board</span>
          </h1>
          
          <p className="text-base sm:text-lg text-white/60 font-medium leading-relaxed">
            Direct coordination for local Carroll County trade projects, emergency home repairs, timber clearing, landscaping, and contractor dispatch. Post a job in 60 seconds or quote open work requests.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Local Job Board ({workRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('post_job')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'post_job'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-105'
                  : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Work Request</span>
            </button>

            <button
              onClick={() => setActiveTab('dispatch')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === 'dispatch'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Priority Courier & Hauling</span>
            </button>
          </div>
        </div>

        {/* Universal Filter & Search Bar (For Job Board) */}
        {activeTab === 'jobs' && (
          <div className="p-5 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search work requests, trades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Town Selector Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <span className="text-[10px] uppercase font-bold text-white/40 flex items-center gap-1 shrink-0">
                  <MapPin className="w-3 h-3 text-amber-400" /> Town:
                </span>
                <button
                  onClick={() => setSelectedTown('all')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                    selectedTown === 'all'
                      ? 'bg-amber-400 text-black font-black'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  All Towns
                </button>
                {towns.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTown(t.name)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0 ${
                      selectedTown === t.name
                        ? 'bg-amber-400 text-black font-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Chips Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black shadow-md'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>✨</span>
                <span>All Trades</span>
              </button>

              {Object.entries(CATEGORY_LABELS).map(([catKey, data]) => (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey as TradeCategory)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                    selectedCategory === catKey
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span>{data.icon}</span>
                  <span>{data.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 1: LOCAL WORK REQUEST BOARD */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>Homeowner & Business Work Requests</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {filteredWorkRequests.length} Open Jobs
                  </span>
                </h2>
                <p className="text-xs text-white/50">Local Carroll County residents seeking licensed contractors, handymen & trade specialists</p>
              </div>

              <button
                onClick={() => setActiveTab('post_job')}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your Job</span>
              </button>
            </div>

            {filteredWorkRequests.length === 0 ? (
              <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl space-y-4">
                <Briefcase className="w-12 h-12 text-white/20 mx-auto" />
                <h3 className="text-lg font-bold text-white">No active work requests found</h3>
                <p className="text-xs text-white/40 max-w-md mx-auto">
                  Have a repair, tree clearing, deck build, or landscaping task? Post it now and local contractors will contact you with quotes!
                </p>
                <button
                  onClick={() => setActiveTab('post_job')}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider"
                >
                  Post a Work Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-[#0b0c10] border border-white/10 hover:border-indigo-400/40 rounded-3xl p-5 space-y-4 transition-all duration-300 shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Urgency & Category Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                          <span>{CATEGORY_LABELS[req.category]?.icon || '🛠️'}</span>
                          <span>{CATEGORY_LABELS[req.category]?.label || req.category}</span>
                        </span>

                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          req.urgency === 'emergency_today'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                            : req.urgency === 'within_few_days'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        }`}>
                          {req.urgency === 'emergency_today' ? '🔥 Urgent (Today)' : req.urgency === 'within_few_days' ? '⚡ Few Days' : '📅 Flexible'}
                        </span>
                      </div>

                      {/* Job Title */}
                      <h3 className="font-black text-white text-base leading-snug">
                        {req.title}
                      </h3>

                      {/* Photo if uploaded */}
                      {req.beforeImageUrl && (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/50">
                          <img 
                            src={req.beforeImageUrl} 
                            alt={req.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[9px] font-black uppercase tracking-wider text-white border border-white/20">
                            Current Condition
                          </div>
                        </div>
                      )}

                      {/* Job Description */}
                      <p className="text-xs text-white/60 leading-relaxed">
                        {req.description}
                      </p>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="text-white/40 block text-[9px] uppercase font-black">Estimated Budget</span>
                          <span className="font-black text-emerald-400">{req.budgetRange}</span>
                        </div>
                        <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="text-white/40 block text-[9px] uppercase font-black">Town Location</span>
                          <span className="font-bold text-white flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-400" />
                            {req.town}, NH
                          </span>
                        </div>
                      </div>

                      {req.addressOrNeighborhood && (
                        <p className="text-[10px] text-white/40 flex items-center gap-1">
                          <span>📍 Location:</span>
                          <span className="text-white/70 font-medium">{req.addressOrNeighborhood}</span>
                        </p>
                      )}
                    </div>

                    {/* Footer Contact / Quote Action */}
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-white/50">
                        <span>Posted by <strong className="text-white">{req.requesterName}</strong></span>
                        <span className="text-indigo-400 font-bold">{req.quotesCount || 0} quotes received</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${req.requesterPhone}`}
                          className="flex-1 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>Call {req.requesterPhone}</span>
                        </a>

                        <button
                          onClick={() => setActiveQuoteModalRequest(req)}
                          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Quote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POST A WORK REQUEST (HOMEOWNER) */}
        {activeTab === 'post_job' && (
          <div className="max-w-2xl mx-auto bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-wider border border-indigo-500/20">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Homeowner Job Submission</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Post a Work Request
              </h2>
              <p className="text-xs text-white/60">
                Describe the job and upload a current photo. Local Carroll County tradesmen will contact you directly.
              </p>
            </div>

            {/* Poster Account Identity Banner */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xl shadow-inner">
                  {currentUser?.avatar || '👤'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      Posting as: <strong className="text-indigo-400">{currentUser ? currentUser.name : 'Guest Homeowner'}</strong>
                    </span>
                    {currentUser && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-mono font-bold uppercase">
                        {currentUser.role}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 font-mono">
                    {currentUser ? `📍 Phone: ${currentUser.phone} • Node: ${currentUser.town}, NH` : 'Sign in to auto-fill your contact details and track received quotes.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-indigo-400 hover:text-indigo-300 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>{currentUser ? 'Switch Account' : 'Log In / Register'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {jobPostSuccess ? (
              <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-lg font-black text-white">Work Request Published!</h3>
                <p className="text-xs text-white/70">Your job is now live on the Carroll County Work Board.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateJob} className="space-y-5">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-white/70">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clean up winter tree branch debris & stack firewood"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Trade Category *</label>
                    <select
                      value={newJobCategory}
                      onChange={(e) => setNewJobCategory(e.target.value as TradeCategory)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.icon} {v.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Town Location *</label>
                    <select
                      value={newJobTown}
                      onChange={(e) => setNewJobTown(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400"
                    >
                      {towns.map(t => (
                        <option key={t.id} value={t.name}>{t.name}, NH</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-white/70">Description & Details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what needs to be fixed, size of the area, materials needed, access details..."
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                {/* Condition Photo Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-white/70">Current Area Photo (Optional)</label>
                  <ImageUpload
                    value={newJobBeforeImage}
                    onChange={setNewJobBeforeImage}
                    label="Upload Photo of Area / Problem"
                    subtitle="Take or upload a picture so contractors can provide accurate estimates"
                    aspectRatio="wide"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Target Budget Estimate</label>
                    <input
                      type="text"
                      placeholder="e.g. $300 - $600"
                      value={newJobBudget}
                      onChange={(e) => setNewJobBudget(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Urgency Timeline</label>
                    <select
                      value={newJobUrgency}
                      onChange={(e) => setNewJobUrgency(e.target.value as any)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-indigo-400"
                    >
                      <option value="within_few_days">⚡ Within a Few Days</option>
                      <option value="emergency_today">🔥 Emergency / Today</option>
                      <option value="flexible_this_month">📅 Flexible / This Month</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newJobName}
                      onChange={(e) => setNewJobName(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-white/70">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(603) 555-0123"
                      value={newJobPhone}
                      onChange={(e) => setNewJobPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-white/70">Street Address / Neighborhood (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Route 153 / Province Lake Rd"
                    value={newJobAddress}
                    onChange={(e) => setNewJobAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-2xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Work Request</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 3: VANGUARD COURIER & HAULING DISPATCH */}
        {activeTab === 'dispatch' && (
          <div className="max-w-3xl mx-auto bg-[#0b0c10] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/20">
                <Truck className="w-3.5 h-3.5" />
                <span>Regional Logistics & Vanguard Fleet</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                Sean Martin 4x4 Priority Courier & Material Hauling
              </h2>
              <p className="text-xs text-white/60">
                24/7 mountain courier runs, lumber pickups, hardware drops, dock firewood delivery, and emergency equipment transport.
              </p>
            </div>

            {/* Operator Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-white">Sean Martin</h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase border border-amber-400/30">
                        Founding Lead
                      </span>
                    </div>
                    <p className="text-xs text-white/60">Silver Subaru Outback (AWD Vanguard Unit) • Plate: NH-VANGUARD</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black uppercase text-emerald-400">Online & Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Direct Dispatch Line</span>
                  <a href="tel:5085070305" className="text-amber-400 font-black text-sm hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>(508) 507-0305</span>
                  </a>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <span className="text-white/40 block text-[10px] uppercase font-bold">Email Dispatch</span>
                  <a href="mailto:frijj555@gmail.com" className="text-white font-bold hover:underline flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-white/60" />
                    <span>frijj555@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black uppercase text-white/70">Hauling & Errand Capabilities:</h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-white/80">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ace Hardware & Tool Pickups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hannaford Curbside Express</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lakeside Firewood & Dock Drop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Emergency Mountain Run</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="tel:5085070305"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Sean Martin for Immediate Dispatch: (508) 507-0305</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* QUICK QUOTE MODAL */}
      {activeQuoteModalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setActiveQuoteModalRequest(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Submit Contractor Estimate
              </span>
              <h3 className="text-lg font-black text-white">{activeQuoteModalRequest.title}</h3>
              <p className="text-xs text-white/60">
                Sending quote to {activeQuoteModalRequest.requesterName} in {activeQuoteModalRequest.town}, NH
              </p>
            </div>

            {quoteSubmittedSuccess ? (
              <div className="p-6 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-black text-white">Quote Transmitted!</h4>
                <p className="text-xs text-white/70">The requester has been notified with your contact info.</p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-4">
                <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{currentUser?.avatar || '👷'}</span>
                    <span className="text-xs text-white">
                      Quoting as: <strong className="text-indigo-300">{currentUser ? currentUser.name : 'Guest Contractor'}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 underline"
                  >
                    Switch Account
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-white/70">Your Name / Company *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mike from Ossipee Carpentry"
                      value={quoteContractorName}
                      onChange={(e) => setQuoteContractorName(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-white/70">Your Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(603) 539-0000"
                      value={quoteContractorPhone}
                      onChange={(e) => setQuoteContractorPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/70">Estimated Price / Hourly Rate</label>
                  <input
                    type="text"
                    placeholder="e.g. $350 (Materials included) or $65/hr"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/70">Message / Available Start Date</label>
                  <textarea
                    rows={3}
                    placeholder="I have an open slot this Thursday morning. Have trailer and full tools ready..."
                    value={quoteMessage}
                    onChange={(e) => setQuoteMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Quote to Homeowner</span>
                </button>
              </form>
            )}
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
