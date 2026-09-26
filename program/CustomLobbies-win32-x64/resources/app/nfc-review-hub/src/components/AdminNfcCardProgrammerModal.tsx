'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig, UserRole, UserProfile } from '@/lib/types';
import { playChimeSound } from '@/lib/push-notifications';
import { 
  Key, 
  ShieldCheck, 
  Smartphone, 
  Printer, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  X, 
  Radio, 
  Store, 
  Truck, 
  Hammer, 
  Users, 
  Crown, 
  QrCode, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
  Phone,
  Mail,
  MapPin,
  Flame,
  FileText
} from 'lucide-react';

interface AdminNfcCardProgrammerModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCard?: NfcCardConfig | null;
}

export default function AdminNfcCardProgrammerModal({
  isOpen,
  onClose,
  preselectedCard
}: AdminNfcCardProgrammerModalProps) {
  const { 
    cards, 
    addCard, 
    updateCard, 
    storefronts, 
    towns, 
    activeTown, 
    currentUser, 
    registerUser,
    registeredAccounts
  } = useNfcStore();

  // Wizard Steps: 1: Configure, 2: Program & Issue Pass, 3: Printable Sheet
  const [step, setStep] = useState<'configure' | 'success' | 'print'>('configure');

  // Form State
  const [passTitle, setPassTitle] = useState('Storefront Admin & Management Pass');
  const [recipientName, setRecipientName] = useState('');
  const [role, setRole] = useState<'merchant' | 'driver' | 'contractor' | 'town_coordinator' | 'manager' | 'staff'>('merchant');
  const [businessName, setBusinessName] = useState(storefronts[0]?.businessName || 'Local Merchant');
  const [storefrontSlug, setStorefrontSlug] = useState(storefronts[0]?.slug || 'oasis-smoke-world');
  const [assignedTown, setAssignedTown] = useState(activeTown?.fullName || 'Effingham, NH');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [securityPin, setSecurityPin] = useState(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [magicToken, setMagicToken] = useState(() => `tr_adm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`);
  const [directDashboardUrl, setDirectDashboardUrl] = useState('/dashboard/storefront');
  const [formFactor, setFormFactor] = useState<'pvc_card' | 'badge_lanyard' | 'keychain_fob' | 'acrylic_stand' | 'disc_sticker'>('pvc_card');
  const [instructions, setInstructions] = useState('Tap this card on your phone to instantly log into your Townraise business management hub.');

  // NFC Hardware Programming State
  const [nfcWriting, setNfcWriting] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [nfcError, setNfcError] = useState<string | null>(null);

  // QR Code & Link State
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [createdCard, setCreatedCard] = useState<NfcCardConfig | null>(null);

  // Generate target Magic Tap URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
  const effectiveCardId = createdCard?.id || `card-adm-${Date.now().toString(36)}`;
  const targetMagicUrl = `${origin}/tap/${effectiveCardId}?magicToken=${magicToken}&role=${role}`;

  useEffect(() => {
    if (isOpen) {
      if (preselectedCard) {
        setPassTitle(preselectedCard.cardName);
        setBusinessName(preselectedCard.businessName);
        setRecipientName(preselectedCard.adminProvisionedUser || '');
        setRole(preselectedCard.adminAccessRole as any || 'merchant');
        setStorefrontSlug(preselectedCard.adminAssignedStorefrontSlug || '');
        setAssignedTown(preselectedCard.adminAssignedTown || activeTown?.fullName || 'Effingham, NH');
        setPhone(preselectedCard.adminProvisionedPhone || '');
        setEmail(preselectedCard.adminProvisionedEmail || '');
        setMagicToken(preselectedCard.adminMagicToken || `tr_adm_${Date.now().toString(36)}`);
        setDirectDashboardUrl(preselectedCard.adminDirectDashboardUrl || '/dashboard/storefront');
        setCreatedCard(preselectedCard);
      } else {
        // Fresh Pass
        setMagicToken(`tr_adm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`);
        setSecurityPin(Math.floor(1000 + Math.random() * 9000).toString());
      }
    }
  }, [isOpen, preselectedCard, activeTown]);

  // Update Direct Dashboard URL based on Role selection
  const handleRoleChange = (newRole: typeof role) => {
    setRole(newRole);
    if (newRole === 'merchant') {
      setDirectDashboardUrl('/dashboard/storefront');
      setPassTitle(`${businessName} Storefront Admin Pass`);
    } else if (newRole === 'driver') {
      setDirectDashboardUrl('/driver');
      setPassTitle(`${recipientName || 'Courier'} Driver Dispatch Pass`);
    } else if (newRole === 'contractor') {
      setDirectDashboardUrl('/work');
      setPassTitle(`${recipientName || 'Contractor'} Trade Manager Pass`);
    } else if (newRole === 'town_coordinator') {
      setDirectDashboardUrl('/dashboard/town-command');
      setPassTitle(`${assignedTown} Coordinator Vanguard Pass`);
    } else if (newRole === 'staff') {
      setDirectDashboardUrl('/dashboard/kitchen');
      setPassTitle(`${businessName} Kitchen & Staff Terminal Pass`);
    } else {
      setDirectDashboardUrl('/dashboard');
      setPassTitle(`${recipientName || 'Operations'} Manager Pass`);
    }
  };

  // Generate QR Code on URL change
  useEffect(() => {
    if (targetMagicUrl) {
      QRCode.toDataURL(targetMagicUrl, {
        width: 400,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        }
      }).then((url) => setQrDataUrl(url)).catch(console.error);
    }
  }, [targetMagicUrl]);

  // Save Card & Provision User Profile
  const handleSaveAndProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRecipient = recipientName.trim() || `${businessName} Manager`;
    const finalPhone = phone.trim() || '603-986-7104';
    const finalEmail = email.trim() || `${finalRecipient.toLowerCase().replace(/\s+/g, '')}@townraise.org`;

    const cardPayload: NfcCardConfig = {
      id: effectiveCardId,
      cardName: passTitle,
      businessName: businessName,
      profileType: 'admin_management_pass',
      hardwareFormFactor: formFactor,
      active: true,
      totalTaps: 0,
      googleConversions: 0,
      privateFeedbacksCount: 0,
      thresholdStars: 5,
      mode: 'smart_funnel',
      googleReviewUrl: `https://www.google.com/search?q=${encodeURIComponent(`${businessName} ${assignedTown}`)}`,
      createdAt: new Date().toISOString(),
      town: assignedTown,
      
      // Administrative Provisioning Fields
      adminAccessRole: role,
      adminProvisionedUser: finalRecipient,
      adminProvisionedEmail: finalEmail,
      adminProvisionedPhone: finalPhone,
      adminAssignedStorefrontSlug: storefrontSlug,
      adminAssignedTown: assignedTown,
      adminMagicToken: magicToken,
      adminDirectDashboardUrl: directDashboardUrl,
      adminInstructions: instructions,
      adminPortalPermissions: [
        'manage_storefront',
        'view_orders',
        'update_inventory',
        'post_shoutouts',
        'access_terminal'
      ]
    };

    if (preselectedCard) {
      updateCard(preselectedCard.id, cardPayload);
    } else {
      addCard(cardPayload);
    }

    // Provision User Profile in Store
    const userRoleMapping: UserRole = (role === 'merchant' || role === 'staff')
      ? 'merchant' 
      : role === 'driver' 
      ? 'driver' 
      : role === 'contractor' 
      ? 'contractor' 
      : 'resident';
    
    registerUser({
      name: finalRecipient,
      phone: finalPhone,
      email: finalEmail,
      role: userRoleMapping,
      town: assignedTown.split(',')[0],
      state: 'NH',
      avatar: role === 'merchant' ? '🏪' : role === 'driver' ? '🚐' : role === 'contractor' ? '🔨' : '👑',
      badge: `Verified ${role.replace('_', ' ').toUpperCase()} Node Lead`,
      pin: securityPin,
      isDriver: role === 'driver',
    });

    setCreatedCard(cardPayload);
    setStep('success');
    playChimeSound('bounty');
  };

  // Web NFC Direct Physical Tag Writer
  const handleWriteNfcChip = async () => {
    if (typeof window === 'undefined' || !('NDEFReader' in window)) {
      setNfcError('Web NFC is supported on Android Chrome or compatible NFC writing devices. Use the QR Code or Direct Link below on desktop/iOS.');
      return;
    }

    try {
      setNfcWriting(true);
      setNfcError(null);
      const ndef = new (window as any).NDEFReader();
      await ndef.write({
        records: [
          {
            recordType: 'url',
            data: targetMagicUrl
          }
        ]
      });
      setNfcWriting(false);
      setNfcSuccess(true);
      playChimeSound('tap');
    } catch (err: any) {
      console.error('NFC Write Error:', err);
      setNfcWriting(false);
      setNfcError(err?.message || 'Failed to write NFC chip. Please ensure NFC is enabled in device settings.');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetMagicUrl);
    setCopiedLink(true);
    playChimeSound('tap');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePrintHandout = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-[#0b0b14] border border-amber-400/40 w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8 relative my-auto">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                  MASTER PROVISIONER
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Sean Martin Operator Command</span>
              </div>
              <h2 className="text-xl font-black italic uppercase text-white tracking-tight">
                Program Administrative & Management NFC Card
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CONFIGURE & PROVISION FORM */}
        {step === 'configure' && (
          <form onSubmit={handleSaveAndProgram} className="space-y-6">
            
            {/* Role Selection Grid */}
            <div>
              <label className="text-[10px] font-mono uppercase font-bold text-amber-400 mb-2 block">
                1. Select Administrative Role & Access Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'merchant', label: 'Storefront Owner', icon: <Store className="w-4 h-4" />, desc: 'Manage Menu, Stock, Prices & Reviews' },
                  { id: 'driver', label: 'Courier Driver', icon: <Truck className="w-4 h-4" />, desc: '4x4 Mountain Delivery & GPS Terminal' },
                  { id: 'contractor', label: 'Master Contractor', icon: <Hammer className="w-4 h-4" />, desc: 'Work Quotes & Project Showcases' },
                  { id: 'town_coordinator', label: 'Town Vanguard', icon: <Crown className="w-4 h-4" />, desc: 'Regional Town Nodes & Listings' },
                  { id: 'staff', label: 'Kitchen & Staff', icon: <Users className="w-4 h-4" />, desc: 'Live Order Tickets & Preparation' },
                  { id: 'manager', label: 'Operations Lead', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Full Dashboard & Analytics' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id as any)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      role === r.id
                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-400/10 scale-[1.02]'
                        : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={role === r.id ? 'text-amber-400' : 'text-zinc-400'}>{r.icon}</span>
                      <p className="text-xs font-bold leading-tight">{r.label}</p>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 leading-snug line-clamp-2">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Business Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Recipient Full Name / Manager</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Mike Sullivan, Sarah Jenkins, Dave M."
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Assigned Business / Storefront</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    setPassTitle(`${e.target.value} Management Pass`);
                  }}
                  placeholder="e.g. Smoke World Ossipee, Mountain Peak Woodcraft"
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Assigned Town Territory</label>
                <select
                  value={assignedTown}
                  onChange={(e) => setAssignedTown(e.target.value)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {towns.map((t) => (
                    <option key={t.id} value={t.fullName}>
                      {t.fullName}
                    </option>
                  ))}
                  <option value="Carroll County, NH">Carroll County, NH (All)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Hardware Form Factor</label>
                <select
                  value={formFactor}
                  onChange={(e) => setFormFactor(e.target.value as any)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="pvc_card">💳 Standard PVC NFC Smart Card</option>
                  <option value="badge_lanyard">🪪 Staff Badge / Lanyard Card</option>
                  <option value="keychain_fob">🔑 Keychain NFC Fob</option>
                  <option value="acrylic_stand">💎 Countertop Acrylic Stand</option>
                  <option value="disc_sticker">🏷️ Adhesive Tap Disc Sticker</option>
                </select>
              </div>
            </div>

            {/* Contact & Security Credentials */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-400/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Security & Magic Authentication Credentials</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Pre-Configured Instant Login</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-mono uppercase text-zinc-400 mb-1 block">Recipient Phone (For SMS login)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(603) 555-0199"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase text-zinc-400 mb-1 block">Recipient Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@domain.com"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono uppercase text-zinc-400 mb-1 block">Backup Security PIN</label>
                  <input
                    type="text"
                    required
                    value={securityPin}
                    onChange={(e) => setSecurityPin(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-400 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Direct Landing Dashboard Selector */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">
                Primary Management Dashboard Landing Page (On Tap)
              </label>
              <select
                value={directDashboardUrl}
                onChange={(e) => setDirectDashboardUrl(e.target.value)}
                className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="/dashboard/storefront">🏪 /dashboard/storefront (Storefront Products, Prices & Menu Editor)</option>
                <option value="/dashboard/kitchen">📦 /dashboard/kitchen (Live Kitchen & Takeout Order Terminal)</option>
                <option value="/driver">🚐 /driver (4x4 Courier Delivery Dispatch Terminal)</option>
                <option value="/dashboard/town-command">🏛️ /dashboard/town-command (Town Node Operations & Listings)</option>
                <option value="/work">🔨 /work (Trade Contractor & Job Quotes Manager)</option>
                <option value="/dashboard">📊 /dashboard (Full Merchant Growth & Analytics Terminal)</option>
                <option value="/community">📢 /community (Broadcast Community Shoutouts & Live Streams)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                Authorized By: Master Admin Sean Martin (👑 Sole Admin)
              </span>
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Program & Issue Admin Pass</span>
              </button>
            </div>

          </form>
        )}

        {/* STEP 2: PROVISIONED SUCCESS & ISSUE ACTIONS */}
        {step === 'success' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Success Hero Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-transparent border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-3xl font-black shadow-xl shrink-0">
                  {role === 'merchant' ? '🏪' : role === 'driver' ? '🚐' : role === 'contractor' ? '🔨' : '👑'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase mb-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ADMIN PASS ACTIVATED</span>
                  </div>
                  <h3 className="text-xl font-black italic uppercase text-white">
                    {passTitle}
                  </h3>
                  <p className="text-xs text-zinc-300 font-mono">
                    Issued to: <strong className="text-amber-400">{recipientName}</strong> • {role.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-white/10 sm:pl-4">
                <p className="text-[10px] font-mono text-zinc-400 uppercase">Backup Security PIN</p>
                <p className="text-xl font-mono font-black text-amber-400">{securityPin}</p>
              </div>
            </div>

            {/* Handout Card Preview & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Physical Pass Mockup */}
              <div className="md:col-span-5 bg-gradient-to-br from-[#121020] via-[#090912] to-black border-2 border-amber-400 rounded-3xl p-6 text-white space-y-4 shadow-2xl relative overflow-hidden text-center">
                <div className="flex justify-between items-center text-[10px] font-mono text-amber-400 uppercase font-black border-b border-white/10 pb-2">
                  <span>TOWNRAISE ADMIN PASS</span>
                  <span>{formFactor.toUpperCase()}</span>
                </div>

                {qrDataUrl && (
                  <div className="p-3 bg-white rounded-2xl inline-block shadow-inner mx-auto">
                    <img
                      src={qrDataUrl}
                      alt="Admin QR Code"
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <h4 className="text-base font-black italic uppercase text-white leading-tight">
                    {businessName}
                  </h4>
                  <p className="text-[11px] text-amber-300 font-mono font-bold">{recipientName} ({role.toUpperCase()})</p>
                  <p className="text-[9px] font-mono text-zinc-400">📍 {assignedTown} • Tap to Authenticate</p>
                </div>
              </div>

              {/* Right Column: 3 Ways to Hand Out / Program */}
              <div className="md:col-span-7 space-y-3.5">
                
                {/* Method 1: Web NFC Direct Chip Write */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-white uppercase">1. Write to Physical NFC Card</h4>
                    </div>
                    {nfcSuccess && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-bold">
                        ✓ WRITTEN TO CHIP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Hold an empty NFC card (NTAG213/215/216) against your phone or USB NFC writer.
                  </p>
                  <button
                    type="button"
                    onClick={handleWriteNfcChip}
                    disabled={nfcWriting}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>{nfcWriting ? 'Hold NFC Chip Near Device...' : 'Touch NFC Card to Write'}</span>
                  </button>
                  {nfcError && (
                    <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{nfcError}</span>
                    </p>
                  )}
                </div>

                {/* Method 2: Printable Handout Slip */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-indigo-400" />
                      <h4 className="text-xs font-bold text-white uppercase">2. Print Handout Card Sheet</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Print an 8.5x11 handout pass with QR code, login instructions, and PIN to hand directly to the recipient.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('print')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Printable Handout Pass</span>
                  </button>
                </div>

                {/* Method 3: Copy Magic Link / Send SMS */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Copy className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-bold text-white uppercase">3. Copy Magic Link or SMS</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied Magic Link!' : 'Copy Magic Tap Link'}</span>
                    </button>
                    {phone && (
                      <a
                        href={`sms:${phone}?body=${encodeURIComponent(`Hello ${recipientName}, here is your official Townraise Admin & Management access key for ${businessName}:\n\nTap or click to manage your storefront:\n${targetMagicUrl}\n\nSecurity PIN: ${securityPin}`)}`}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>SMS</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setStep('configure')}
                className="text-xs font-mono text-zinc-400 hover:text-white uppercase font-bold"
              >
                ← Edit Configuration
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Done & Close
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: PRINTABLE HANDOUT SLIP */}
        {step === 'print' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black italic uppercase text-white">Printable Admin Handout Pass</h3>
                <p className="text-xs text-zinc-400 font-mono">Formatted for wallet card cut-out or 8.5x11 paper</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrintHandout}
                  className="px-5 py-2.5 bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep('success')}
                  className="px-4 py-2.5 bg-white/10 text-white text-xs font-mono uppercase rounded-xl hover:bg-white/20"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Printable Pass Container */}
            <div 
              id="printable-admin-pass"
              className="p-8 bg-white text-black rounded-3xl border-4 border-black space-y-6 max-w-xl mx-auto shadow-2xl"
            >
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-black text-amber-400 flex items-center justify-center font-black rounded-xl text-xl">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase tracking-tight leading-none">TOWNRAISE</h3>
                    <p className="text-[10px] font-mono uppercase font-bold text-neutral-600">Sovereign Commerce Lattice</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-black text-white text-[10px] font-mono font-black uppercase rounded">
                    {role.toUpperCase()} PASS
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {qrDataUrl && (
                  <div className="p-2 border-2 border-black rounded-2xl shrink-0 text-center">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="w-36 h-36 object-contain"
                    />
                    <p className="text-[9px] font-mono font-black uppercase mt-1">Scan or Tap Phone</p>
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Authorized Merchant / Node</p>
                    <h4 className="text-xl font-black uppercase leading-tight">{businessName}</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Issued To</p>
                    <p className="text-sm font-bold">{recipientName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase text-neutral-500 font-bold">Territory / Town Node</p>
                    <p className="text-xs font-mono">{assignedTown}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-neutral-100 rounded-xl border border-neutral-300 font-mono text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-600 uppercase font-bold">Security PIN:</span>
                  <span className="font-black text-black">{securityPin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 uppercase font-bold">Direct Portal:</span>
                  <span className="text-neutral-900 font-bold truncate max-w-[240px]">{directDashboardUrl}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-neutral-600 space-y-1 border-t pt-3">
                <p><strong>Instructions:</strong> Tap this NFC smart card or scan the QR code with any smartphone camera to automatically log in and manage orders, inventory, reviews, and courier dispatch.</p>
                <p><strong>Master Administrator:</strong> Sean Martin • (603) 986-7104 • townraise.org</p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
