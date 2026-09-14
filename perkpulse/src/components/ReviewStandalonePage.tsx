import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ExternalLink, MessageSquare, CheckCircle2, ShieldAlert, Sparkles, Copy, Check, ArrowLeft } from 'lucide-react';

export const ReviewStandalonePage: React.FC = () => {
  const { currentBusiness, submitCustomerFeedback, setActiveTab } = useApp();
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const activeRating = hoveredRating !== null ? hoveredRating : selectedRating;

  const quickTags = [
    'Wait Time',
    'Customer Service',
    'Food / Beverage Quality',
    'Cleanliness',
    'Value / Price',
  ];

  const reviewSnippets = [
    'Best spot in town! Incredible service and top-tier quality every time.',
    'Super friendly staff and delicious food. 5/5 stars!',
    'Always clean, fast, and welcoming. Highly recommend visiting!',
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    submitCustomerFeedback(selectedRating, selectedTags, feedbackComment, contactInfo);
    setFeedbackSubmitted(true);
  };

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      {/* Simulation note */}
      <div className="no-print mb-4 inline-flex items-center gap-2 text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
        <span>📍 Simulating customer scanning table QR code for:</span>
        <strong className="text-white">{currentBusiness.name}</strong>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white space-y-6">
        {/* Business Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-500/30 text-3xl shadow-lg">
            {currentBusiness.logoEmoji}
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">{currentBusiness.name}</h2>
          <p className="text-xs text-slate-400">{currentBusiness.tagline}</p>
        </div>

        {/* Rating Question */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-100">How was your visit today?</h3>
          <p className="text-xs text-slate-400">Tap a star to rate your experience:</p>
        </div>

        {/* Star Rating Bar */}
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/90 rounded-2xl border border-slate-700">
          {[1, 2, 3, 4, 5].map(star => {
            const isFilled = (activeRating ?? 0) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => setSelectedRating(star)}
                className="p-2 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-9 h-9 transition-colors duration-200 ${
                    isFilled ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Branching */}
        {selectedRating && selectedRating >= 4 ? (
          /* 4-5 STARS: GOOGLE MAPS REDIRECT */
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-xs mb-1">
                <Sparkles className="w-4 h-4" /> Thank you so much!
              </div>
              <p className="text-xs text-slate-300">
                Your 5-star review means the world to our team and helps other locals discover us.
              </p>
            </div>

            {/* Snippet copy */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Tap to copy a quick review:
              </span>
              <div className="space-y-1.5">
                {reviewSnippets.map((snippet, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopySnippet(snippet)}
                    className="w-full text-left text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between text-slate-300 transition"
                  >
                    <span className="truncate pr-2 italic">"{snippet}"</span>
                    {copiedSnippet === snippet ? (
                      <span className="flex items-center text-emerald-400 text-[10px] font-semibold gap-1">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Google Maps Review CTA */}
            <a
              href={currentBusiness.googlePlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Leave 5-Star Review on Google</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </a>
          </div>
        ) : (
          /* 1-3 STARS: PRIVATE FEEDBACK SHIELD */
          <div>
            {feedbackSubmitted ? (
              <div className="py-8 text-center space-y-3 bg-slate-800/50 rounded-2xl border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Feedback Received</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Thank you for letting us know. The owner will review your notes immediately to make things right.
                </p>
                <button
                  onClick={() => setFeedbackSubmitted(false)}
                  className="text-xs text-amber-400 hover:underline pt-2 font-medium"
                >
                  Submit another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPrivateFeedback} className="space-y-4">
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200">
                    We want to make this right. Send a private message straight to our general manager.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    What can we improve?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {quickTags.map(tag => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-medium'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={e => setFeedbackComment(e.target.value)}
                    placeholder="Tell us what happened..."
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="Your email or phone (optional)"
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition"
                >
                  Send Private Feedback to Owner
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
