import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Sparkles, Star, Smartphone, Copy, Check, LayoutTemplate } from 'lucide-react';

export const QRStudio: React.FC = () => {
  const { currentBusiness } = useApp();
  const [templateType, setTemplateType] = useState<'counter-stand' | 'table-tent' | 'window-sticker' | 'review-only'>('counter-stand');
  const [customHeadline, setCustomHeadline] = useState('Scan to Join Loyalty & Unlock Free Rewards!');
  const [customSubtext, setCustomSubtext] = useState('Collect stamps on every visit directly from your phone — no app download required.');
  const [copiedLink, setCopiedLink] = useState(false);

  const customerPassUrl = `https://perkpulse.app/p/${currentBusiness.slug}`;
  const reviewDirectUrl = currentBusiness.googlePlaceUrl;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customerPassUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Studio Header (hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-amber-400" />
            Printable QR Counter Stand Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate acrylic counter signs, table tents, and window stickers for <strong className="text-white">{currentBusiness.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-semibold rounded-2xl text-xs flex items-center gap-2 transition"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Web Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Stand</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls (hidden in print) */}
      <div className="no-print grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-3xl">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Format Style</label>
          <div className="space-y-1.5">
            {[
              { id: 'counter-stand', label: 'Acrylic Counter Sign (5x7)' },
              { id: 'table-tent', label: 'Dining Table Tent (4x6)' },
              { id: 'review-only', label: 'Google Review Booster Stand' },
              { id: 'window-sticker', label: 'Store Window Decal' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTemplateType(f.id as any)}
                className={`w-full text-left text-xs p-2.5 rounded-xl border transition ${
                  templateType === f.id
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Headline Text</label>
            <input
              type="text"
              value={customHeadline}
              onChange={e => setCustomHeadline(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle / Instructions</label>
            <input
              type="text"
              value={customSubtext}
              onChange={e => setCustomSubtext(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* PRINTABLE PREVIEW CANVAS */}
      <div className="flex justify-center p-4">
        <div 
          className="printable-stand w-full max-w-sm bg-white text-slate-900 rounded-3xl shadow-2xl p-8 border-4 border-slate-900 text-center space-y-6"
          style={{ minHeight: '520px' }}
        >
          {/* Top Brand Banner */}
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl mx-auto shadow-sm">
              {currentBusiness.logoEmoji}
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
              {currentBusiness.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {currentBusiness.tagline}
            </p>
          </div>

          {/* Dynamic Badge */}
          {templateType === 'review-only' ? (
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 font-bold px-4 py-1.5 rounded-full text-xs">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>LOVE YOUR VISIT? RATE US!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-950 font-bold px-4 py-1.5 rounded-full text-xs">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>DIGITAL LOYALTY REWARDS</span>
            </div>
          )}

          {/* Large High-Contrast QR Code */}
          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-200 inline-block shadow-inner">
            <QRCodeSVG
              value={templateType === 'review-only' ? reviewDirectUrl : customerPassUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Action Callout */}
          <div className="space-y-1.5 px-2">
            <h3 className="font-extrabold text-sm text-slate-900">
              {templateType === 'review-only' ? 'Scan to Leave a 5-Star Review' : customHeadline}
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {templateType === 'review-only' 
                ? 'Your feedback helps our local family business grow. Takes only 15 seconds!'
                : customSubtext}
            </p>
          </div>

          {/* Bottom Footer Note */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <span>Powered by PerkPulse</span>
            <span>📱 Point Phone Camera Here</span>
          </div>
        </div>
      </div>
    </div>
  );
};
