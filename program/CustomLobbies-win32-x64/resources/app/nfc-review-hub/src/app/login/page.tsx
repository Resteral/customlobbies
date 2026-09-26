'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNfcStore, PRESET_USERS } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { 
  ShieldCheck, 
  Check, 
  Truck, 
  User, 
  Store, 
  Hammer, 
  ArrowRight, 
  LogOut, 
  MapPin, 
  Phone, 
  Mail, 
  PlusCircle, 
  Radio, 
  Sparkles,
  ChevronRight,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    authenticateUser,
    registeredAccounts,
    deliveryDrivers, 
    toggleDriverStatus 
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [successMsg, setSuccessMsg] = useState('');
  const [authError, setAuthError] = useState('');

  // Sign in state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    pin: '',
    confirmPin: '',
    town: 'Effingham',
    state: 'NH',
    role: 'driver' as UserRole,
    avatar: '🚗',
    vehicleName: 'Silver Subaru Outback AWD',
    isDriver: true
  });
  const [showRegisterPin, setShowRegisterPin] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!loginIdentifier.trim()) {
      setAuthError('Please enter your registered phone number or email.');
      return;
    }
    if (!loginPin.trim()) {
      setAuthError('Please enter your 4-6 digit Security PIN.');
      return;
    }

    const result = authenticateUser(loginIdentifier, loginPin);
    if (!result.success) {
      setAuthError(result.error || 'Authentication failed. Please verify credentials.');
      return;
    }

    setSuccessMsg(`Signed in as ${result.user?.name} (${result.user?.role.toUpperCase()})`);
    setLoginPin('');
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  const handlePreFill = (preset: UserProfile) => {
    setLoginIdentifier(preset.phone || preset.email);
    setLoginPin(preset.pin || '1234');
    setAuthError('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!registerForm.name.trim() || !registerForm.phone.trim()) {
      setAuthError('Please fill out your name and phone number.');
      return;
    }

    if (!registerForm.pin || registerForm.pin.length < 4) {
      setAuthError('Security PIN must be at least 4 digits.');
      return;
    }

    if (registerForm.pin !== registerForm.confirmPin) {
      setAuthError('Security PINs do not match. Please re-enter.');
      return;
    }

    const isDriverRole = registerForm.role === 'driver' || registerForm.isDriver;
    const avatar = isDriverRole ? (registerForm.avatar || '🚗') : (registerForm.role === 'merchant' ? '🥪' : registerForm.role === 'contractor' ? '🔨' : '🌲');

    const newUser = registerUser({
      name: registerForm.name.trim(),
      email: registerForm.email.trim() || `${registerForm.name.toLowerCase().replace(/\s+/g, '.')}@carrollcounty.local`,
      phone: registerForm.phone.trim(),
      pin: registerForm.pin.trim(),
      role: registerForm.role,
      avatar,
      town: registerForm.town,
      state: registerForm.state,
      badge: isDriverRole ? 'Verified Community Courier' : `${registerForm.town} Resident`,
      isDriver: isDriverRole
    });

    setSuccessMsg(`Account created for ${newUser.name}! You are now securely logged in.`);
    setTimeout(() => {
      setSuccessMsg('');
    }, 2500);
  };

  const currentDriverRecord = currentUser?.isDriver 
    ? deliveryDrivers.find(d => d.id === currentUser.driverMemberId || d.email === currentUser.email || d.phone === currentUser.phone)
    : null;

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121f] via-[#0d0d16] to-[#07070a] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Authentication & Resident Account Protection</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white leading-tight">
            Account Portal & <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
              Security PIN Access
            </span>
          </h1>

          <p className="text-zinc-300 text-xs md:text-sm font-light max-w-2xl leading-relaxed">
            All accounts are protected with a unique Security PIN. Sign in securely or register a new resident, merchant, or driver identity.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {authError && (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <Link href="/dashboard" className="underline hover:text-white flex items-center gap-1">
            <span>Go to Portal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Current Active Account Box (if logged in) */}
      {currentUser && (
        <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e16] border border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-4xl shadow-inner">
                {currentUser.avatar || '👑'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">Active Secure Session</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white">{currentUser.name}</h2>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.town}, {currentUser.state} • {currentUser.phone} • {currentUser.email}</span>
                </p>
                {currentUser.badge && (
                  <p className="text-xs font-mono text-amber-400 font-bold mt-1">
                    ✨ {currentUser.badge}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="flex-1 md:flex-initial px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <span>Go to Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => {
                  logoutUser();
                  setSuccessMsg('Logged out successfully.');
                  setTimeout(() => setSuccessMsg(''), 1500);
                }}
                className="flex-1 md:flex-initial px-4 py-3 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-bold rounded-2xl transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* If user is driver: Duty Shift Controls */}
          {currentUser.isDriver && (
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Live Delivery Driver Telemetry</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase inline-flex items-center gap-1.5 ${
                    currentDriverRecord?.status === 'online_ready'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : currentDriverRecord?.status === 'on_delivery'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    {currentDriverRecord?.status === 'online_ready' ? '🟢 Online & Ready for Delivery Runs' : currentDriverRecord?.status === 'on_delivery' ? '🟡 On Active Run' : '🔴 Off Duty'}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {currentDriverRecord?.vehicleName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (currentDriverRecord) toggleDriverStatus(currentDriverRecord.id);
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    currentDriverRecord?.status === 'online_ready'
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  {currentDriverRecord?.status === 'online_ready' ? 'Go Off Duty' : 'Go Online Now'}
                </button>
                <Link
                  href="/drivers"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 transition-all flex items-center gap-1"
                >
                  <span>All Drivers</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => { setActiveTab('signin'); setAuthError(''); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'signin'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Sign In (PIN Verification)</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setAuthError(''); }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register New Member or Driver</span>
          </button>
        </div>

        {/* TAB 1: PIN-Protected Sign In */}
        {activeTab === 'signin' && (
          <div className="space-y-6">
            <form onSubmit={handleSignIn} className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-5">
              <div>
                <h3 className="text-xl font-black italic text-white uppercase">Resident & Merchant Sign In</h3>
                <p className="text-xs text-zinc-400 font-light mt-1">
                  Enter your registered phone number or email and 4-6 digit Security PIN.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Phone Number or Email *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(603) 539-7440 or user@email.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>Security PIN *</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowLoginPin(!showLoginPin)}
                      className="text-[10px] font-mono text-zinc-400 hover:text-white flex items-center gap-1"
                    >
                      {showLoginPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showLoginPin ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    required
                    maxLength={8}
                    placeholder="Enter 4-6 digit PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono tracking-widest font-semibold focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Verify Security PIN & Sign In</span>
              </button>
            </form>

            {/* Verified Account Quick-Fill */}
            <div className="space-y-3">
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                Select a verified local identity (pre-fills credentials with security PIN verification required):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PRESET_USERS.map((preset) => {
                  const isSelected = currentUser?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePreFill(preset)}
                      className={`p-5 rounded-3xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-400/15 via-[#141420] to-[#0c0c12] border-amber-400 shadow-xl shadow-amber-400/10'
                          : 'bg-[#0c0c12] hover:bg-white/[0.04] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                            {preset.avatar}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-white">{preset.name}</h3>
                              {isSelected && (
                                <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-xs font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-zinc-400 font-mono mt-0.5">
                              📍 {preset.town}, {preset.state}
                            </p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase ${
                          preset.role === 'driver' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          preset.role === 'merchant' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          preset.role === 'contractor' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                          'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {preset.role}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-300 font-light space-y-1">
                        <p className="font-bold text-white">{preset.badge}</p>
                        <p className="text-[11px] text-zinc-400 font-mono">
                          Phone: {preset.phone} • PIN: {preset.pin}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                        <span>Click to Pre-fill & Enter PIN →</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Custom Registration Form with PIN Setup */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6">
            <div>
              <h3 className="text-xl font-black italic text-white uppercase">Register Carroll County Member or Driver</h3>
              <p className="text-xs text-zinc-400 font-light mt-1">
                Sign up as an active delivery driver, resident customer, local merchant, or verified contractor with a private Security PIN.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Phone (For Sign-In & SMS Pings) *</label>
                <input 
                  type="tel"
                  required
                  placeholder="(603) 555-0199"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  placeholder="sarah@example.com"
                  value={registerForm.email}
                  onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Primary Town</label>
                <select
                  value={registerForm.town}
                  onChange={e => setRegisterForm({...registerForm, town: e.target.value})}
                  className="w-full px-4 py-3 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                >
                  <option value="Effingham">Effingham, NH</option>
                  <option value="Center Ossipee">Center Ossipee, NH</option>
                  <option value="Freedom">Freedom, NH</option>
                  <option value="Wakefield">Wakefield / Sanbornville, NH</option>
                  <option value="Conway">Conway / North Conway, NH</option>
                  <option value="Wolfeboro">Wolfeboro, NH</option>
                  <option value="Tamworth">Tamworth, NH</option>
                  <option value="Tuftonboro">Tuftonboro, NH</option>
                  <option value="Moultonborough">Moultonborough, NH</option>
                </select>
              </div>
            </div>

            {/* Security PIN Setup */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-amber-400/5 border border-amber-400/20">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Choose Security PIN (4-6 Digits) *</span>
                </label>
                <input
                  type={showRegisterPin ? 'text' : 'password'}
                  required
                  maxLength={8}
                  placeholder="e.g. 5839"
                  value={registerForm.pin}
                  onChange={e => setRegisterForm({...registerForm, pin: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-amber-300 uppercase tracking-wider">
                    Confirm Security PIN *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegisterPin(!showRegisterPin)}
                    className="text-[10px] font-mono text-zinc-400 hover:text-white"
                  >
                    {showRegisterPin ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showRegisterPin ? 'text' : 'password'}
                  required
                  maxLength={8}
                  placeholder="Re-enter PIN"
                  value={registerForm.confirmPin}
                  onChange={e => setRegisterForm({...registerForm, confirmPin: e.target.value})}
                  className="w-full px-4 py-3 bg-black/50 border border-amber-400/30 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Role Switcher in Form */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Select Account Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {[
                  { role: 'driver', label: '🚗 Delivery Driver', desc: 'Accept runs, food takeout & earn flat fares' },
                  { role: 'resident', label: '🌲 Resident / Diner', desc: 'Order food, groceries & lake concierge' },
                  { role: 'merchant', label: '🥪 Merchant / Shop', desc: 'Publish online store & receive orders' },
                  { role: 'contractor', label: '🔨 Master Contractor', desc: 'Get local construction & repair leads' },
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setRegisterForm({
                        ...registerForm, 
                        role: r.role as UserRole,
                        isDriver: r.role === 'driver',
                        avatar: r.role === 'driver' ? '🚗' : r.role === 'merchant' ? '🥪' : r.role === 'contractor' ? '🔨' : '🌲'
                      });
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      registerForm.role === r.role
                        ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-sm font-bold">{r.label}</p>
                    <p className="text-[10px] text-zinc-400 mt-1 font-light">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Driver Vehicle Field */}
            {registerForm.role === 'driver' && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Driver Vehicle Info (AWD / 4x4 Preferred for NH Dirt Roads)</span>
                </div>
                <input 
                  type="text"
                  placeholder="e.g. 2024 Subaru Crosstrek AWD / Chevy Silverado 4x4"
                  value={registerForm.vehicleName}
                  onChange={e => setRegisterForm({...registerForm, vehicleName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Complete Registration & Secure PIN</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
