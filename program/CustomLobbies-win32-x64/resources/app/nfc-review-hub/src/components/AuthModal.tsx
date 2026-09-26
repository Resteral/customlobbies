'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore, PRESET_USERS } from '@/lib/store';
import { UserProfile, UserRole } from '@/lib/types';
import { 
  X, 
  User, 
  Check, 
  Truck, 
  ShieldCheck, 
  LogOut, 
  Lock,
  KeyRound,
  Store, 
  Hammer, 
  Sparkles, 
  Phone, 
  MapPin, 
  Car, 
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Radio,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    currentUser, 
    loginUser, 
    logoutUser, 
    registerUser, 
    authenticateUser,
    registeredAccounts,
    deliveryDrivers, 
    toggleDriverStatus,
    loyaltyWallet 
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  
  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPin, setLoginPin] = useState('');
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Form State
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
    vehicleName: 'Subaru Outback AWD',
    isDriver: true
  });
  const [showRegisterPin, setShowRegisterPin] = useState(false);

  if (!isOpen) return null;

  const currentDriverRecord = currentUser?.isDriver 
    ? deliveryDrivers.find(d => d.id === currentUser.driverMemberId || d.email === currentUser.email || d.phone === currentUser.phone)
    : null;

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
      setAuthError(result.error || 'Authentication failed. Please check your credentials.');
      return;
    }

    setSuccessMsg(`Welcome back, ${result.user?.name}!`);
    setLoginPin('');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
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
      setAuthError('Please provide your full name and phone number.');
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
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Authentication & Resident Passcode Portal</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tight uppercase text-white">
              {currentUser ? 'Your Profile & Security Status' : 'Sign In or Join Our Towns'}
            </h2>
            <p className="text-xs text-zinc-400 font-light">
              Protected authentication prevents unauthorized account switching. Enter your Security PIN to sign in.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {authError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 animate-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Active Logged In View */}
        {currentUser && (
          <div className="p-5 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner">
                  {currentUser.avatar || '👑'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{currentUser.town}, {currentUser.state} • {currentUser.phone}</span>
                  </p>
                  {currentUser.badge && (
                    <p className="text-[11px] font-mono text-amber-400 font-bold mt-1">
                      ✨ {currentUser.badge}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <Link
                  href="/hunter-profile"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black uppercase tracking-wider transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                >
                  <User className="w-4 h-4" />
                  <span>Hunter Profile</span>
                </Link>

                <button
                  onClick={() => {
                    logoutUser();
                    setSuccessMsg('Logged out successfully.');
                    setTimeout(() => setSuccessMsg(''), 1500);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Driver Duty Shift Switcher */}
            {currentUser.isDriver && (
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Driver Duty Status:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase ${
                      currentDriverRecord?.status === 'online_ready' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                        : currentDriverRecord?.status === 'on_delivery'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-zinc-700/40 text-zinc-400 border border-zinc-600'
                    }`}>
                      {currentDriverRecord?.status === 'online_ready' ? '🟢 Online & Ready for Runs' : currentDriverRecord?.status === 'on_delivery' ? '🟡 On Active Run' : '🔴 Off Duty'}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-light mt-0.5">
                    {currentDriverRecord?.vehicleName || 'AWD Vanguard Vehicle'}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (currentDriverRecord) {
                        toggleDriverStatus(currentDriverRecord.id);
                      }
                    }}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg ${
                      currentDriverRecord?.status === 'online_ready'
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                    }`}
                  >
                    {currentDriverRecord?.status === 'online_ready' ? 'Go Off Duty' : 'Go Online Now'}
                  </button>
                  <Link
                    href="/drivers"
                    onClick={onClose}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 transition-all flex items-center gap-1"
                  >
                    <span>View Roster</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => { setActiveTab('signin'); setAuthError(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'signin'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Secure Sign In (PIN Protected)</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setAuthError(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'register'
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Resident / Driver Account</span>
          </button>
        </div>

        {/* TAB 1: Secure Sign In with PIN */}
        {activeTab === 'signin' && (
          <div className="space-y-5">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phone Number or Email *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="(603) 539-7440 or user@email.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400 placeholder:text-zinc-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Security PIN (4-6 Digits) *</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Protected verification</span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPin ? 'text' : 'password'}
                    required
                    maxLength={8}
                    placeholder="Enter your 4-6 digit PIN"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400 placeholder:text-zinc-600 font-mono tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPin(!showLoginPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
                  >
                    {showLoginPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Verify Credentials & Sign In</span>
              </button>
            </form>

            {/* Verified Account Fast-Fill (Requires PIN Submission) */}
            <div className="pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <span>Verified Resident Test Accounts (Click to Fill & Enter PIN):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_USERS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePreFill(preset)}
                    className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-amber-400/30 text-left transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{preset.avatar}</span>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300">
                          {preset.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          {preset.phone} • {preset.role.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300/80 border border-white/10 group-hover:bg-amber-400 group-hover:text-black">
                      PIN: {preset.pin}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Register New Driver / Member */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Sam Miller"
                  value={registerForm.name}
                  onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Phone (Sign In & SMS) *</label>
                <input 
                  type="tel"
                  required
                  placeholder="(603) 555-0123"
                  value={registerForm.phone}
                  onChange={e => setRegisterForm({...registerForm, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  placeholder="sam@gmail.com"
                  value={registerForm.email}
                  onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Primary Town</label>
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

            {/* PIN Setup for Account Security */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Create Security PIN (4-6 Digits) *</span>
                </label>
                <input
                  type={showRegisterPin ? 'text' : 'password'}
                  required
                  maxLength={8}
                  placeholder="e.g. 4829"
                  value={registerForm.pin}
                  onChange={e => setRegisterForm({...registerForm, pin: e.target.value})}
                  className="w-full px-4 py-2.5 bg-black/40 border border-amber-400/30 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-amber-300 uppercase tracking-wider">
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
                  className="w-full px-4 py-2.5 bg-black/40 border border-amber-400/30 rounded-xl text-white text-xs font-mono tracking-widest focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Account Role</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'driver', label: '🚗 Delivery Driver', desc: 'Accept runs & earn' },
                  { role: 'resident', label: '🌲 Town Resident', desc: 'Order food & groceries' },
                  { role: 'merchant', label: '🥪 Shop Owner', desc: 'List menu & goods' },
                  { role: 'contractor', label: '🔨 Contractor', desc: 'Receive work leads' },
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
                    className={`p-3 rounded-xl border text-left transition-all ${
                      registerForm.role === r.role
                        ? 'bg-amber-400/20 border-amber-400 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold">{r.label}</p>
                    <p className="text-[9px] text-zinc-400 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {registerForm.role === 'driver' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Driver Vehicle & Capabilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    placeholder="Vehicle (e.g. Subaru Outback AWD / Ford F-150)"
                    value={registerForm.vehicleName}
                    onChange={e => setRegisterForm({...registerForm, vehicleName: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-emerald-400"
                  />
                  <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Ready for Hannaford, PNB Eats & Express Runs</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register Account with PIN Protection</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>Townraise Secure Auth v2</span>
          <Link 
            href="/drivers" 
            onClick={onClose} 
            className="text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View Active Online Driver Roster</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
