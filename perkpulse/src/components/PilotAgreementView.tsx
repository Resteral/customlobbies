import React from 'react';
import { useApp } from '../context/AppContext';
import { Printer, ShieldCheck, CheckCircle2, ArrowLeft, FileText } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const PilotAgreementView: React.FC<Props> = ({ onBack }) => {
  const { currentBusiness } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Action Header (Hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Pitch Calculator</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            Printable 1-Page Merchant Pilot Contract
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Agreement (PDF)</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE ONE-PAGER AGREEMENT */}
      <div 
        className="printable-stand bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-300 space-y-6"
        style={{ minHeight: '900px' }}
      >
        {/* Document Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 uppercase">PerkPulse</span>
              <span className="text-xs bg-slate-900 text-white font-bold px-2 py-0.5 rounded">PILOT AGREEMENT</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">Local Business Customer Loyalty & Google Review Acceleration Service</p>
          </div>

          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Pilot Duration:</strong> 14 Days (Risk-Free)</div>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="font-bold uppercase text-[10px] text-slate-500 tracking-wider">Service Provider</span>
            <p className="font-bold text-slate-900 mt-1">PerkPulse Growth Solutions</p>
            <p className="text-slate-600">Local Digital Loyalty & Reputation Partner</p>
          </div>
          <div>
            <span className="font-bold uppercase text-[10px] text-slate-500 tracking-wider">Client Business</span>
            <p className="font-bold text-slate-900 mt-1">{currentBusiness.name}</p>
            <p className="text-slate-600">{currentBusiness.address} • {currentBusiness.phone}</p>
          </div>
        </div>

        {/* Pilot Scope */}
        <div className="space-y-3">
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
            1. Scope of 14-Day Risk-Free Pilot
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Provider will furnish Client with a fully customized digital loyalty stamp card platform and Google Review acceleration system for a 14-day evaluation period.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Custom Digital Pass:</strong> Branded digital punch card for smartphones.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Review Booster:</strong> Automatic 4-5★ Google review redirection.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Counter Collateral:</strong> 2 printed acrylic/tent QR stands for checkout.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span><strong>Private Feedback Shield:</strong> Negative sentiment intercepted privately.</span>
            </div>
          </div>
        </div>

        {/* Performance Guarantee & Terms */}
        <div className="space-y-3">
          <h3 className="font-black text-sm text-slate-900 uppercase tracking-wide">
            2. Performance Guarantee & Pricing
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            • <strong>Upfront Cost:</strong> \$0.00 during the initial 14-day pilot period.<br />
            • <strong>Performance Goal:</strong> Client must achieve at least 15 new verified Google Reviews or 40 customer stamp interactions during the pilot.<br />
            • <strong>Ongoing Retainer:</strong> Upon successful completion of the pilot, Client may continue service at a flat rate of <strong>\$69.00 / month</strong> (cancel anytime with 7-day notice). If Client does not wish to continue, no payment is owed.
          </p>
        </div>

        {/* Loyalty Program Specifics */}
        <div className="space-y-2 bg-slate-100 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800">
          <h4 className="font-bold text-slate-900">Agreed Store Campaign Rules:</h4>
          <div>• <strong>Reward Goal:</strong> {currentBusiness.loyaltyProgram.targetStamps} Stamps to unlock <em>"{currentBusiness.loyaltyProgram.rewardTitle}"</em></div>
          <div>• <strong>Staff PIN:</strong> #{currentBusiness.cashierPin}</div>
        </div>

        {/* Signatures */}
        <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-slate-900">
          <div className="space-y-8">
            <div>
              <div className="border-b border-slate-900 pb-1 font-semibold">
                Authorized Provider Signature
              </div>
              <p className="text-[11px] text-slate-500 mt-1">PerkPulse Representative</p>
            </div>
            <div>
              <div className="border-b border-slate-900 pb-1 text-slate-400">
                Date
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="border-b border-slate-900 pb-1 text-slate-400">
                Client Owner / Store Manager Signature
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{currentBusiness.name}</p>
            </div>
            <div>
              <div className="border-b border-slate-900 pb-1 text-slate-400">
                Date
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
