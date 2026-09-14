import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, X, CheckCircle, ExternalLink, MessageSquare, ThumbsUp, ShieldAlert, Sparkles, Copy, Check } from 'lucide-react';

export const ReviewGateModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, currentBusiness, submitCustomerFeedback } = useApp();
  const [selectedRating, setSelectedRating] = useState<number | null>(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  
  // Feedback form state for 1-3 stars
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isReviewModalOpen) return null;

  const activeRating = hoveredRating !== null ? hoveredRating : selectedRating;

  const quickTags = [
    'Wait Time',
    'Order Accuracy',
    'Customer Service',
    'Quality & Taste',
    'Pricing',
    'Atmosphere / Cleanliness',
  ];

  const reviewSnippets = [
    'Amazing service and friendly team! My favorite local spot.',
    'Always consistent quality and fast service. Highly recommend!',
    'The loyalty program is awesome and the staff is top-notch.',
  ];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  };

  const handleSubmitPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) return;
    submitCustomerFeedback(selectedRating, selectedTags, feedbackComment, contactInfo);
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setIsReviewModalOpen(false);
      setSelectedRating(5);
      setFeedbackComment('');
      setSelectedTags([]);
      setContactInfo('');
    }, 2200);
  };

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Business Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-500/30 text-3xl mb-3 shadow-lg">
            {currentBusiness.logoEmoji}
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">{currentBusiness.name}</h3>
          <p className="text-sm text-slate-400 mt-1">How was your experience with us today?</p>
        </div>

        {/* Star Rating Bar */}
        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 mb-6">
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
                  className={`w-8 h-8 transition-colors duration-200 ${
                    isFilled ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Dynamic Funnel based on rating */}
        {selectedRating && selectedRating >= 4 ? (
          /* POSITIVE FLOW: 4-5 STARS -> GOOGLE REVIEW */
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-sm mb-1">
                <Sparkles className="w-4 h-4" /> That's what we love to hear!
              </div>
              <p className="text-xs text-slate-300">
                Reviews on Google help our local business survive and reach new neighbors. Would you leave a quick 5-star rating?
              </p>
            </div>

            {/* Quick Copy Snippets */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Need inspiration? Tap to copy:
              </p>
              <div className="space-y-1.5">
                {reviewSnippets.map((snippet, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCopySnippet(snippet)}
                    className="w-full text-left text-xs bg-slate-800 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500/40 rounded-xl p-2.5 flex items-center justify-between text-slate-300 transition group"
                  >
                    <span className="truncate pr-2 italic">"{snippet}"</span>
                    {copiedSnippet === snippet ? (
                      <span className="flex items-center text-emerald-400 text-[10px] font-semibold gap-1">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Google Review Button */}
            <a
              href={currentBusiness.googlePlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="text-lg">⭐</span>
              <span>Post 5-Star Review on Google</span>
              <ExternalLink className="w-4 h-4 ml-auto" />
            </a>

            <p className="text-[11px] text-center text-slate-500">
              Opens Google Maps in a new tab. Takes less than 15 seconds!
            </p>
          </div>
        ) : (
          /* CONSTRUCTIVE FLOW: 1-3 STARS -> PRIVATE FEEDBACK SHIELD */
          <div>
            {feedbackSubmitted ? (
              <div className="py-8 text-center space-y-3 bg-slate-800/50 rounded-2xl border border-emerald-500/30">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Thank You for Your Honesty</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Your message was routed directly to management. We appreciate your feedback and will work to make it right!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitPrivateFeedback} className="space-y-4">
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200">
                    We're sorry we didn't meet your standards today. Tell our owner directly so we can fix it immediately.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                    What could have been better?
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
                    placeholder="Tell us what happened... (management reads every note)"
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={contactInfo}
                    onChange={e => setContactInfo(e.target.value)}
                    placeholder="Optional: Your email or phone if you'd like a follow-up"
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Send Directly to Store Owner</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
