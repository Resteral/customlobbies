import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Coffee, 
  Scissors, 
  Flame, 
  Sparkles, 
  Star, 
  Gift, 
  Heart, 
  RotateCw, 
  CheckCircle2, 
  Share2, 
  QrCode, 
  KeyRound, 
  Award,
  Smartphone,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const CustomerCardView: React.FC = () => {
  const { 
    currentBusiness, 
    customerPass, 
    addStamps, 
    redeemReward, 
    setIsReviewModalOpen,
    resetCustomerCard 
  } = useApp();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [cashierPin, setCashierPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const target = currentBusiness.loyaltyProgram.targetStamps;
  const current = customerPass.currentStamps;
  const progressPercent = Math.min(100, Math.round((current / target) * 100));
  const isRewardReady = customerPass.rewardsAvailable > 0 || current >= target;

  const getStampIcon = (type: string, isFilled: boolean, index: number) => {
    const className = `w-6 h-6 transition-all duration-300 ${
      isFilled 
        ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-110' 
        : 'text-slate-600 opacity-40'
    }`;

    switch (type) {
      case 'coffee': return <Coffee className={className} />;
      case 'scissors': return <Scissors className={className} />;
      case 'flame': return <Flame className={className} />;
      case 'sparkle': return <Sparkles className={className} />;
      case 'heart': return <Heart className={className} />;
      case 'gift': return <Gift className={className} />;
      default: return <Star className={className} />;
    }
  };

  const notify = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  const handleDemoQuickStamp = () => {
    const res = addStamps(1);
    notify(res.message);
  };

  const handleStaffPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addStamps(1, cashierPin);
    if (!res.success) {
      setPinError(res.message);
    } else {
      setShowPinModal(false);
      setCashierPin('');
      setPinError('');
      notify(res.message);
    }
  };

  const handleRedeem = () => {
    const res = redeemReward();
    notify(res.message);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-6 w-full max-w-lg mx-auto">
      {/* Top Banner Alert for demo */}
      {statusNotification && (
        <div className="w-full mb-4 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold p-3 rounded-2xl text-center shadow-lg backdrop-blur-sm animate-bounce">
          {statusNotification}
        </div>
      )}

      {/* Flip Card Container */}
      <div className="w-full perspective-1000">
        <div 
          className={`relative w-full rounded-3xl transition-transform duration-700 transform-style-3d shadow-2xl border border-slate-700/60 overflow-hidden ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            background: `linear-gradient(145deg, #1e293b 0%, #0f172a 100%)`,
          }}
        >
          {/* Top Decorative Header Accent */}
          <div className={`h-2.5 w-full bg-gradient-to-r ${currentBusiness.gradient}`} />

          {/* FRONT SIDE */}
          {!isFlipped ? (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                    {currentBusiness.logoEmoji}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                      {currentBusiness.name}
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">{currentBusiness.tagline}</p>
                  </div>
                </div>

                {/* Flip Info Toggle */}
                <button
                  onClick={() => setIsFlipped(true)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition"
                  title="Card Details & QR"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar & Milestone Text */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">
                    {current >= target ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Award className="w-4 h-4" /> Reward Ready to Redeem!
                      </span>
                    ) : (
                      <span>
                        <span className="text-white font-bold">{target - current}</span> stamp{target - current > 1 ? 's' : ''} until your next reward
                      </span>
                    )}
                  </span>
                  <span className="text-amber-400 font-mono">
                    {current} / {target}
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-700/50">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Reward: <strong className="text-slate-200">{currentBusiness.loyaltyProgram.rewardTitle}</strong></span>
                  <span className="text-emerald-400 font-medium">~${currentBusiness.loyaltyProgram.estimatedRewardValue.toFixed(2)} value</span>
                </div>
              </div>

              {/* STAMP GRID */}
              <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-inner">
                <div className="grid grid-cols-4 sm:grid-cols-4 gap-3.5 sm:gap-4 justify-items-center">
                  {Array.from({ length: target }).map((_, index) => {
                    const isFilled = index < current;
                    const isLastTarget = index === target - 1;

                    return (
                      <div
                        key={index}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                          isFilled
                            ? 'bg-amber-500/15 border-2 border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.25)] stamp-animated'
                            : isLastTarget
                            ? 'bg-amber-950/20 border-2 border-dashed border-amber-500/50'
                            : 'bg-slate-800/40 border border-dashed border-slate-700/70'
                        }`}
                      >
                        {/* Stamp Icon */}
                        {isLastTarget && !isFilled ? (
                          <Gift className="w-6 h-6 text-amber-500/60 animate-pulse" />
                        ) : (
                          getStampIcon(currentBusiness.loyaltyProgram.stampIcon, isFilled, index)
                        )}

                        <span className={`text-[10px] font-mono mt-0.5 font-bold ${isFilled ? 'text-amber-300' : 'text-slate-600'}`}>
                          #{index + 1}
                        </span>

                        {isFilled && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold shadow">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unlocked Reward Banner */}
              {customerPass.rewardsAvailable > 0 && (
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border-2 border-amber-400/80 rounded-2xl p-4 text-center space-y-2 reward-glow">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
                    <Sparkles className="w-5 h-5" />
                    <span>{customerPass.rewardsAvailable} Reward{customerPass.rewardsAvailable > 1 ? 's' : ''} Available!</span>
                  </div>
                  <p className="text-xs text-slate-300">{currentBusiness.loyaltyProgram.rewardTitle}</p>
                  <button
                    onClick={handleRedeem}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
                  >
                    Redeem in Person with Cashier
                  </button>
                </div>
              )}

              {/* Action Buttons & Cashier Stamping */}
              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Quick Demo Stamp Button */}
                  <button
                    onClick={handleDemoQuickStamp}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 px-3 rounded-2xl text-xs shadow-md transition transform active:scale-95"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>+1 Stamp (Demo)</span>
                  </button>

                  {/* Cashier PIN Stamp */}
                  <button
                    onClick={() => setShowPinModal(true)}
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold py-3 px-3 rounded-2xl text-xs transition"
                  >
                    <KeyRound className="w-4 h-4 text-slate-400" />
                    <span>Staff PIN Stamp</span>
                  </button>
                </div>

                {/* Review Gate Trigger */}
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-medium py-2.5 px-4 rounded-xl text-xs transition hover:text-amber-400"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Rate on Google & Give Feedback</span>
                </button>
              </div>

              {/* Footer Pass Info */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 font-mono">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Pass: #{customerPass.passCode}</span>
                </div>
                <span>{customerPass.customerName}</span>
                <button 
                  onClick={resetCustomerCard}
                  className="text-slate-500 hover:text-rose-400 transition"
                  title="Reset Card for Testing"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            /* BACK SIDE: QR Code & Business Terms */
            <div className="p-6 sm:p-8 space-y-6 text-center">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-white text-sm">Customer Pass Details</h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700 text-xs flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> Flip to Card
                </button>
              </div>

              {/* QR Code for Cashier Scanner */}
              <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto">
                <QRCodeSVG
                  value={`perkpulse://stamp?pass=${customerPass.passCode}&biz=${currentBusiness.id}`}
                  size={160}
                  level="H"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-slate-200">
                  Scan to Stamp at Cashier
                </p>
                <p className="text-[11px] text-slate-400">
                  Show this QR code at checkout or give code <strong className="text-amber-400 font-mono text-xs">{customerPass.passCode}</strong>
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 text-left space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                  <Info className="w-3.5 h-3.5 text-amber-400" /> Terms & Info
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {currentBusiness.loyaltyProgram.terms}
                </p>
                <div className="pt-2 text-[10px] text-slate-500 space-y-0.5 border-t border-slate-800/80">
                  <div>📍 {currentBusiness.address}</div>
                  <div>📞 {currentBusiness.phone}</div>
                </div>
              </div>

              <button
                onClick={() => setIsFlipped(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                Back to Stamp Card
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Staff PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base">Cashier Staff PIN</h4>
              <p className="text-xs text-slate-400 mt-1">Enter your 4-digit store PIN to stamp (Default demo PIN: <strong className="text-amber-400">{currentBusiness.cashierPin}</strong>)</p>
            </div>

            <form onSubmit={handleStaffPinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={4}
                value={cashierPin}
                onChange={e => setCashierPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-400 text-center font-medium">{pinError}</p>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setCashierPin('');
                    setPinError('');
                  }}
                  className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                >
                  Confirm Stamp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
