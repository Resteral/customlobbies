import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Plus, 
  UserPlus, 
  Award, 
  Phone, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Store,
  Clock,
  History,
  ShieldCheck
} from 'lucide-react';

export const CashierTerminal: React.FC = () => {
  const { 
    currentBusiness, 
    customerPasses, 
    customerPass, 
    addStamps, 
    redeemReward, 
    createNewPassForPhone 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPass, setSelectedPass] = useState(customerPass);
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [terminalMessage, setTerminalMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const filteredPasses = customerPasses.filter(p => 
    p.businessId === currentBusiness.id && (
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerPhone.includes(searchQuery) ||
      p.passCode.includes(searchQuery)
    )
  );

  const showBanner = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setTerminalMessage({ text, type });
    setTimeout(() => setTerminalMessage(null), 3000);
  };

  const handleTerminalStamp = (count: number) => {
    const res = addStamps(count);
    if (res.success) {
      showBanner(res.message, 'success');
    } else {
      showBanner(res.message, 'error');
    }
  };

  const handleTerminalRedeem = () => {
    const res = redeemReward();
    if (res.success) {
      showBanner(res.message, 'success');
    } else {
      showBanner(res.message, 'error');
    }
  };

  const handleRegisterNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerPhone) return;
    const newPass = createNewPassForPhone(newCustomerPhone, newCustomerName);
    setSelectedPass(newPass);
    setIsRegistering(false);
    setNewCustomerPhone('');
    setNewCustomerName('');
    showBanner(`🎉 Registered ${newPass.customerName}! 1st Bonus Stamp Awarded.`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Terminal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl">
            {currentBusiness.logoEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentBusiness.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Terminal Active
              </span>
            </div>
            <p className="text-xs text-slate-400">Cashier POS Companion • Stamping & Redemption Console</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl text-xs flex items-center gap-2 transition shadow-md"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isRegistering ? 'Back to Search' : 'New Customer (+1 Bonus)'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Status Alert */}
      {terminalMessage && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold text-center border shadow-lg animate-fade-in ${
            terminalMessage.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
              : terminalMessage.type === 'error'
              ? 'bg-rose-950/70 border-rose-500 text-rose-300'
              : 'bg-blue-950/70 border-blue-500 text-blue-300'
          }`}
        >
          {terminalMessage.text}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Customer Selection / Lookup */}
        <div className="md:col-span-5 space-y-4">
          {isRegistering ? (
            /* Quick Register Form */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <UserPlus className="w-4 h-4 text-amber-400" /> Quick Sign-Up (5 Seconds)
              </div>
              <p className="text-xs text-slate-400">
                Type customer phone. They automatically receive a welcome stamp!
              </p>

              <form onSubmit={handleRegisterNewCustomer} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Customer Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(555) 000-0000"
                    value={newCustomerPhone}
                    onChange={e => setNewCustomerPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Customer First Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan"
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl"
                  >
                    Create & Stamp
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Search & Customer List */
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search phone, name, or #pass..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {filteredPasses.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No customers found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredPasses.map(pass => {
                    const isSelected = selectedPass.id === pass.id;
                    const isRewardReady = pass.rewardsAvailable > 0 || pass.currentStamps >= currentBusiness.loyaltyProgram.targetStamps;

                    return (
                      <button
                        key={pass.id}
                        onClick={() => setSelectedPass(pass)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-white'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs">{pass.customerName}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              #{pass.passCode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{pass.customerPhone}</div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-amber-400">
                            {pass.currentStamps}/{currentBusiness.loyaltyProgram.targetStamps} ★
                          </div>
                          {isRewardReady && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                              Reward Ready
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Customer Action Console */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            {/* Active Customer Profile Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-violet-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg">
                  {selectedPass.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    {selectedPass.customerName}
                    <span className="text-xs font-mono font-normal text-amber-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                      Pass #{selectedPass.passCode}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" /> {selectedPass.customerPhone}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Lifetime Visits</span>
                <p className="text-base font-bold font-mono text-white">{selectedPass.lifetimeStamps}</p>
              </div>
            </div>

            {/* Current Stamp Progress Card */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Active Stamp Progress</span>
                <span className="text-amber-400 font-mono text-sm font-bold">
                  {selectedPass.currentStamps} / {currentBusiness.loyaltyProgram.targetStamps} Stamps
                </span>
              </div>

              {/* Visual Stamp Circles */}
              <div className="flex items-center gap-2 justify-center py-2 flex-wrap">
                {Array.from({ length: currentBusiness.loyaltyProgram.targetStamps }).map((_, i) => {
                  const isFilled = i < selectedPass.currentStamps;
                  return (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isFilled
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                          : 'bg-slate-900/90 text-slate-600 border border-slate-700'
                      }`}
                    >
                      {isFilled ? '✓' : i + 1}
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-center text-slate-400">
                Reward: <strong className="text-slate-200">{currentBusiness.loyaltyProgram.rewardTitle}</strong>
              </div>
            </div>

            {/* ACTION PAD */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Cashier Actions
              </span>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleTerminalStamp(1)}
                  className="py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-2xl text-sm shadow-lg shadow-amber-500/20 transition transform active:scale-95 flex flex-col items-center justify-center gap-1"
                >
                  <Plus className="w-5 h-5" />
                  <span>+1 STAMP</span>
                </button>

                <button
                  onClick={() => handleTerminalStamp(2)}
                  className="py-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold rounded-2xl text-sm transition transform active:scale-95 flex flex-col items-center justify-center gap-1"
                >
                  <Plus className="w-5 h-5 text-amber-400" />
                  <span>+2 STAMPS</span>
                </button>

                <button
                  onClick={() => handleTerminalStamp(3)}
                  className="py-4 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white font-bold rounded-2xl text-sm transition transform active:scale-95 flex flex-col items-center justify-center gap-1"
                >
                  <Plus className="w-5 h-5 text-amber-400" />
                  <span>+3 STAMPS</span>
                </button>
              </div>

              {/* Redeem Reward Button */}
              <button
                onClick={handleTerminalRedeem}
                disabled={selectedPass.rewardsAvailable <= 0}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                  selectedPass.rewardsAvailable > 0
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 animate-pulse cursor-pointer'
                    : 'bg-slate-800/50 border border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>
                  Redeem Reward ({selectedPass.rewardsAvailable} Available)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
