import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Star, 
  Users, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Send,
  MessageSquare,
  FileText
} from 'lucide-react';
import { PilotAgreementView } from './PilotAgreementView';

export const PitchCalculator: React.FC = () => {
  const [dailyCustomers, setDailyCustomers] = useState(60);
  const [averageCheck, setAverageCheck] = useState(12);
  const [monthlySubscription, setMonthlySubscription] = useState(69);
  const [showAgreement, setShowAgreement] = useState(false);

  // Calculations
  // Estimated 20% enroll in digital stamp card
  const enrolledMembers = Math.round(dailyCustomers * 30 * 0.20);
  
  // Loyalty members visit an average of 1.4x more often per month (0.4 additional visits)
  const additionalMonthlyVisits = Math.round(enrolledMembers * 0.4);
  const additionalMonthlyRevenue = Math.round(additionalMonthlyVisits * averageCheck);
  
  // Estimated 5-star Google Reviews generated per month (approx 8% of loyal stamps)
  const estimatedReviewsPerMonth = Math.round(enrolledMembers * 0.12);
  
  // Net merchant ROI
  const netMonthlyProfit = additionalMonthlyRevenue - monthlySubscription;
  const roiMultiplier = (additionalMonthlyRevenue / monthlySubscription).toFixed(1);

  if (showAgreement) {
    return <PilotAgreementView onBack={() => setShowAgreement(false)} />;
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles className="w-4 h-4" /> B2B Client Closing Toolkit
          </div>

          <button
            onClick={() => setShowAgreement(true)}
            className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <FileText className="w-4 h-4" />
            <span>View 1-Page Pilot Agreement Contract</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Client ROI Calculator & Live Pitch Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Use this interactive model when presenting PerkPulse to local business owners. Prove exact financial ROI before asking for a \$49–\$99/mo subscription.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Interactive Sliders */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            Store Traffic & Economics
          </h3>

          <div className="space-y-5">
            {/* Slider 1: Daily Customers */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Average Daily Customers</span>
                <span className="text-amber-400 font-mono text-sm">{dailyCustomers} customers / day</span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={dailyCustomers}
                onChange={e => setDailyCustomers(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>15 (Small Boutique)</span>
                <span>250+ (Busy Cafe/Barber)</span>
              </div>
            </div>

            {/* Slider 2: Average Check Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Average Customer Spend ($)</span>
                <span className="text-amber-400 font-mono text-sm">${averageCheck}.00</span>
              </div>
              <input
                type="range"
                min="4"
                max="80"
                step="1"
                value={averageCheck}
                onChange={e => setAverageCheck(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$4 (Coffee)</span>
                <span>$80 (Full Salon / Auto Detail)</span>
              </div>
            </div>

            {/* Slider 3: Proposed Software Fee */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Your Monthly SaaS Fee to Owner</span>
                <span className="text-emerald-400 font-mono text-sm">${monthlySubscription} / month</span>
              </div>
              <input
                type="range"
                min="29"
                max="149"
                step="10"
                value={monthlySubscription}
                onChange={e => setMonthlySubscription(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>$29/mo (Starter)</span>
                <span>$149/mo (Pro Multi-terminal)</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Financial ROI Projections */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Projected Owner Returns</h3>
            <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
              {roiMultiplier}x Net ROI
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Added Revenue */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">New Monthly Revenue</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                +${additionalMonthlyRevenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400">+{additionalMonthlyVisits} extra repeat visits/mo</p>
            </div>

            {/* Google Reviews */}
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">New 5★ Google Reviews</span>
              <div className="text-2xl font-black text-amber-400 font-mono">
                +{estimatedReviewsPerMonth}
              </div>
              <p className="text-[10px] text-slate-400">Organic Maps rank boost</p>
            </div>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl space-y-1 text-center">
            <span className="text-xs font-bold text-emerald-300">
              Net Profit to Merchant after your ${monthlySubscription}/mo fee:
            </span>
            <div className="text-3xl font-black text-white font-mono">
              +${netMonthlyProfit.toLocaleString()} / month
            </div>
            <p className="text-[11px] text-slate-300">
              Every $1 they pay you returns <strong className="text-emerald-400">${roiMultiplier}</strong> in measurable extra revenue.
            </p>
          </div>
        </div>
      </div>

      {/* 3-STEP LOCAL CLOSING PLAYBOOK */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-400" />
          The Exact 3-Step Walk-In Pitch Script
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-800/60 border border-slate-700/70 p-5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="font-bold text-white text-sm">The 10-Second Demo</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Walk in during slow hours (2–4 PM). Pull up the <strong>Customer Card</strong> on your phone and hand it to the owner: <em>"Tap '+1 Stamp' on this card—see how easy that is for regulars?"</em>
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/60 border border-slate-700/70 p-5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="font-bold text-white text-sm">The Review Multiplier</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Trigger the reward: <em>"When your customer unlocks a free reward, it instantly asks for a 5-star Google review. If they're unhappy, it routes to your private inbox instead of Google Maps."</em>
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/60 border border-slate-700/70 p-5 rounded-2xl space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="font-bold text-white text-sm">The Zero-Risk Offer</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              <em>"I'll set up your QR counter stand for free today and give you 14 days free. If you get fewer than 15 new reviews and 50 stamps, you pay nothing."</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
