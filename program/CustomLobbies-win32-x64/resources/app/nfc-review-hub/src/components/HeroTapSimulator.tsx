'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useNfcStore, PRESET_USERS } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { calculateCardProgression } from '@/lib/card-leveling';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  User, 
  Check, 
  Store, 
  Hammer, 
  Truck, 
  Gift, 
  Compass, 
  Trophy, 
  LogOut, 
  PlusCircle, 
  MapPin, 
  Phone,
  LayoutDashboard,
  Coins,
  Crown,
  Radio,
  ExternalLink,
  Lock,
  KeyRound,
  AlertCircle
} from 'lucide-react';

export default function HeroTapSimulator() {
  const { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    authenticateUser,
    loyaltyWallet,
    storeHunterStamps, 
    passportStamps,
    activeTown
  } = useNfcStore();

  const [isSwitching, setIsSwitching] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Sign in state
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPin, setSignInPin] = useState('');
  
  // Custom register state
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customPin, setCustomPin] = useState('');
  const [customTown, setCustomTown] = useState(activeTown?.name || 'Effingham');
  const [customRole, setCustomRole] = useState<UserRole>('resident');
  
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const cardProgression = useMemo(() => {
    return calculateCardProgression(storeHunterStamps, passportStamps);
  }, [storeHunterStamps, passportStamps]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const res = authenticateUser(signInIdentifier, signInPin);
    if (!res.success) {
      setAuthError(res.error || 'Authentication failed. Please verify credentials.');
      return;
    }

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setFeedbackMsg(`Welcome back, ${res.user?.name}!`);
    setIsSwitching(false);
    setSignInPin('');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handlePreFillAccount = (user: UserProfile) => {
    setSignInIdentifier(user.phone || user.email);
    setSignInPin(user.pin || '1234');
    setAuthError(null);
  };

  const handleCustomRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!customName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    if (!customPhone.trim()) {
      setAuthError('Please enter your phone number.');
      return;
    }
    if (!customPin.trim() || customPin.length < 4) {
      setAuthError('Please create a 4-6 digit Security PIN.');
      return;
    }

    const isDriverRole = customRole === 'driver';
    const avatar = isDriverRole ? '🚗' : (customRole === 'merchant' ? '🥪' : customRole === 'contractor' ? '🔨' : '🌲');

    const newUser = registerUser({
      name: customName.trim(),
      email: `${customName.toLowerCase().replace(/\s+/g, '.')}@townraise.org`,
      phone: customPhone.trim(),
      pin: customPin.trim(),
      role: customRole,
      avatar,
      town: customTown,
      state: 'NH',
      badge: isDriverRole ? 'Verified Community Courier' : `${customTown} Resident`,
      isDriver: isDriverRole
    });

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setFeedbackMsg(`Account created for ${newUser.name}! +100 Welcome Points added.`);
    setIsSwitching(false);
    setCustomName('');
    setCustomPhone('');
    setCustomPin('');
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Outer ambient glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-emerald-500/20 blur-3xl rounded-[3rem] opacity-70 -z-10 animate-pulse-slow" />

      {/* Simulator Device Frame */}
      <div className="bg-[#0b0b10] border-2 border-white/10 rounded-[2.5rem] p-4 sm:p-5 shadow-2xl shadow-black/80">
        <div className="relative bg-[#050508] border border-white/10 rounded-[2rem] p-5 sm:p-6 min-h-[560px] flex flex-col justify-between overflow-hidden">
          
          {/* Top Notch & Telemetry Bar */}
          <div className="flex justify-between items-center pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
                Townraise Member Hub
              </span>
            </div>
            <div className="w-16 h-3 bg-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-1 bg-zinc-800 rounded-full" />
            </div>
            <span className="text-[9px] font-mono text-amber-400 font-bold">Carroll County, NH</span>
          </div>

          {/* Toast Notification */}
          {feedbackMsg && (
            <div className="p-3 my-2 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3 my-2 bg-red-500/15 border border-red-500/30 rounded-xl text-red-300 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 py-4 flex flex-col justify-center">
            
            {/* STATE 1: User Logged In & Active Digital Pass */}
            {currentUser && !isSwitching ? (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
                
                {/* Resident Digital Pass Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#12121a] to-[#0a0a0f] border border-amber-400/30 shadow-xl relative overflow-hidden space-y-4">
                  
                  {/* Decorative background watermark */}
                  <div className="absolute top-2 right-3 opacity-10 text-5xl font-black font-mono select-none pointer-events-none">
                    NH
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                        {currentUser.avatar || '👤'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-black text-white">{currentUser.name}</h4>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] font-mono font-bold uppercase">
                            Active Pass
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{currentUser.town || 'Effingham'}, NH • {currentUser.badge || 'Verified Resident'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Live Stats Row */}
                  <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-white/10">
                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Points</span>
                      <span className="text-xs font-black font-mono text-amber-400">
                        {loyaltyWallet?.userPoints || 0}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Tier</span>
                      <span className="text-xs font-black text-purple-300 truncate block">
                        Lv.{cardProgression.currentLevel}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Taps</span>
                      <span className="text-xs font-black font-mono text-cyan-300">
                        {(storeHunterStamps?.length || 0) + (passportStamps?.length || 0)}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8px] font-mono text-zinc-400 uppercase block">Multi</span>
                      <span className="text-xs font-black font-mono text-indigo-300">
                        {cardProgression.multiplier}x
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 text-left pl-1">
                    Quick Account Shortcuts:
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/hunter-profile"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>My Profile & Pass</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/rewards"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-400" />
                        <span>Redeem Rewards</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-pink-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/store-hunting"
                      className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-purple-400" />
                        <span>Store Hunting</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    <Link
                      href="/dashboard"
                      className="p-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-between group transition-all text-xs font-bold"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4 text-amber-400" />
                        <span>Dashboard Portal</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </div>
                </div>

                {/* Switch Role Button */}
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => { setIsSwitching(true); setAuthError(null); }}
                    className="text-amber-400 hover:underline flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Switch Account (PIN Protected)</span>
                  </button>

                  <button
                    onClick={() => logoutUser()}
                    className="text-zinc-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            ) : (
              /* STATE 2: Log In / Switch Account Form with PIN Verification */
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                
                <div className="text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[9px] font-mono font-bold uppercase">
                    <Lock className="w-3 h-3" /> Secure Access Only
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tight">
                    Resident & Member Sign In
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Accounts are protected with a Security PIN to prevent unauthorized identity switching.
                  </p>
                </div>

                {/* Tabs: Sign In vs Create Account */}
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => { setActiveTab('signin'); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'signin' 
                        ? 'bg-amber-400 text-black shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>Sign In (PIN)</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('register'); setAuthError(null); }}
                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === 'register' 
                        ? 'bg-amber-400 text-black shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Create Account</span>
                  </button>
                </div>

                {/* Tab 1: Sign In with Phone/Email + PIN */}
                {activeTab === 'signin' && (
                  <form onSubmit={handleSignIn} className="space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Phone or Email *</label>
                      <input
                        type="text"
                        required
                        value={signInIdentifier}
                        onChange={(e) => setSignInIdentifier(e.target.value)}
                        placeholder="(603) 539-7440 or email"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Security PIN *</label>
                      <input
                        type="password"
                        required
                        maxLength={8}
                        value={signInPin}
                        onChange={(e) => setSignInPin(e.target.value)}
                        placeholder="Enter 4-6 digit PIN"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Verify PIN & Sign In</span>
                    </button>

                    {/* Pre-fill Preset Helper List */}
                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <span className="text-[9px] font-mono uppercase text-zinc-500">Quick Test Personas:</span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {PRESET_USERS.slice(0, 4).map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => handlePreFillAccount(u)}
                            className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-left text-[10px] flex items-center justify-between"
                          >
                            <span className="truncate text-zinc-300 font-bold">{u.avatar} {u.name.split(' ')[0]}</span>
                            <span className="text-[8px] font-mono text-amber-400">PIN:{u.pin}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </form>
                )}

                {/* Tab 2: Register New Account Form */}
                {activeTab === 'register' && (
                  <form onSubmit={handleCustomRegister} className="space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase text-zinc-400">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          placeholder="(603) 555-0199"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Security PIN *</label>
                        <input
                          type="password"
                          required
                          maxLength={8}
                          value={customPin}
                          onChange={(e) => setCustomPin(e.target.value)}
                          placeholder="4-digit PIN"
                          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono tracking-widest placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Town Node</label>
                        <select
                          value={customTown}
                          onChange={(e) => setCustomTown(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="Effingham">Effingham, NH</option>
                          <option value="Ossipee">Ossipee, NH</option>
                          <option value="Freedom">Freedom, NH</option>
                          <option value="Wolfeboro">Wolfeboro, NH</option>
                          <option value="Conway">Conway, NH</option>
                          <option value="Tamworth">Tamworth, NH</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase text-zinc-400">Role</label>
                        <select
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="resident">🌲 Resident</option>
                          <option value="merchant">🏪 Merchant</option>
                          <option value="contractor">🛠️ Contractor</option>
                          <option value="driver">🚚 Driver (4x4)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create Account & Log In</span>
                    </button>
                  </form>
                )}

                {currentUser && (
                  <button
                    onClick={() => { setIsSwitching(false); setAuthError(null); }}
                    className="w-full py-1.5 text-center text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    ← Back to Active Profile ({currentUser.name})
                  </button>
                )}

              </div>
            )}

          </div>

          {/* Device Footer Information */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-zinc-500">
            <span>TOWNRAISE SECURE IDENTITY</span>
            <span className="text-amber-400/80 font-bold">PIN VERIFIED</span>
          </div>

        </div>
      </div>
    </div>
  );
}
