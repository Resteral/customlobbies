'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryOrder, ProofOfDelivery } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import DriverTrackerHUD from '@/components/DriverTrackerHUD';
import InstallAppBanner from '@/components/InstallAppBanner';
import ImageUpload from '@/components/ImageUpload';
import confetti from 'canvas-confetti';
import { 
  Truck, Navigation, Phone, MapPin, Store, 
  CheckCircle2, AlertCircle, Compass, Radio, 
  BatteryCharging, Gauge, DollarSign, ArrowRight, 
  Camera, MessageCircle, ExternalLink, ShieldCheck, 
  Volume2, Sparkles, RefreshCw, ChevronRight, Check,
  Smartphone, Wallet, ArrowUpRight, Clock, User, Wrench, Send
} from 'lucide-react';

export default function FoodDeliveryDriverApp() {
  const { 
    deliveryOrders, 
    driverTelemetry, 
    driverShift, 
    toggleDriverOnline, 
    acceptDeliveryJob, 
    updateOrderStatus, 
    completeDeliveryWithProof, 
    cashOutDriverEarnings, 
    playDeliveryChime,
    notificationSettings,
    workRequests,
    incrementWorkRequestQuotes
  } = useNfcStore();

  const [activeTab, setActiveTab] = useState<'active' | 'queue' | 'work_leads' | 'earnings' | 'radar' | 'settings'>('active');

  // Multi-order selection
  const activeOrders = deliveryOrders.filter(
    o => o.status === 'out_for_delivery' || o.status === 'accepted'
  );
  const pendingOrders = deliveryOrders.filter(o => o.status === 'pending');
  const completedOrders = deliveryOrders.filter(o => o.status === 'delivered');

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeOrders[0]?.id || pendingOrders[0]?.id || deliveryOrders[0]?.id || ''
  );

  const currentOrder = deliveryOrders.find(o => o.id === selectedOrderId) || activeOrders[0] || pendingOrders[0] || deliveryOrders[0];

  // Item pickup checklist state
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Proof of delivery state
  const [proofPhoto, setProofPhoto] = useState<string>('');
  const [dropoffType, setDropoffType] = useState<ProofOfDelivery['dropoffLocationType']>('front_door');
  const [dropoffNote, setDropoffNote] = useState<string>('');

  // Cash out modal state
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [cashOutMethod, setCashOutMethod] = useState<'cash_app' | 'venmo' | 'bank'>('cash_app');
  const [cashOutHandle, setCashOutHandle] = useState('$sean');
  const [cashOutSuccess, setCashOutSuccess] = useState(false);

  // Driver Work Lead Quote State
  const [quoteLeadId, setQuoteLeadId] = useState<string | null>(null);
  const [quoteLeadPrice, setQuoteLeadPrice] = useState('');
  const [quoteLeadMessage, setQuoteLeadMessage] = useState('');
  const [quoteLeadSuccess, setQuoteLeadSuccess] = useState(false);

  // Auto-sync selected order
  useEffect(() => {
    if (activeOrders.length > 0 && !activeOrders.some(o => o.id === selectedOrderId)) {
      setSelectedOrderId(activeOrders[0].id);
    }
  }, [deliveryOrders]);

  const handleSendLeadQuote = (reqId: string) => {
    incrementWorkRequestQuotes(reqId);
    setQuoteLeadSuccess(true);
    setTimeout(() => {
      setQuoteLeadSuccess(false);
      setQuoteLeadId(null);
      setQuoteLeadPrice('');
      setQuoteLeadMessage('');
    }, 1800);
  };

  const toggleItemCheck = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleStartTransit = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    playDeliveryChime();
  };

  const handleFinishDelivery = (orderId: string) => {
    const proof: ProofOfDelivery = {
      orderId,
      photoUrl: proofPhoto || undefined,
      dropoffLocationType: dropoffType,
      notes: dropoffNote || 'Package placed safely at doorstep',
      completedAt: new Date().toISOString(),
      gpsCoordinates: {
        lat: driverTelemetry.latitude,
        lng: driverTelemetry.longitude,
      },
    };

    completeDeliveryWithProof(orderId, proof);
    confetti({
      particleCount: 150,
      spread: 120,
      origin: { y: 0.6 },
    });
    setProofPhoto('');
    setDropoffNote('');
  };

  const handleCashOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverShift.totalBalance <= 0) return;
    cashOutDriverEarnings(driverShift.totalBalance);
    setCashOutSuccess(true);
    setTimeout(() => {
      setCashOutSuccess(false);
      setShowCashOutModal(false);
    }, 2000);
  };

  const isAllItemsChecked = currentOrder?.items.every((_, idx) => checkedItems[`${currentOrder.id}-${idx}`]);

  return (
    <div className="min-h-screen bg-[#050508] text-white pb-28 pt-4 px-3 sm:px-6 max-w-5xl mx-auto space-y-5 select-none">
      
      {/* Install App PWA Banner */}
      <InstallAppBanner />

      {/* Top Mobile Driver Header */}
      <div className="bg-[#0b0b12] border border-white/10 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Driver identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-indigo-600 p-0.5 shadow-xl shadow-amber-500/20">
                <div className="w-full h-full bg-[#0e0e18] rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl">
                  {driverTelemetry.avatar}
                </div>
              </div>
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0b0b12] ${
                driverShift.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-black italic text-lg sm:text-xl text-white tracking-tight">
                  {driverTelemetry.driverName}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-mono font-bold uppercase">
                  ★ {driverTelemetry.rating.toFixed(1)} ({driverTelemetry.totalDeliveries}+ Trips)
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                {driverTelemetry.vehicle}
              </p>
            </div>
          </div>

          {/* Shift Online / Offline Toggle Switch */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <button
              onClick={playDeliveryChime}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Test Dispatch Chime"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={toggleDriverOnline}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-xl ${
                driverShift.isOnline
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20 scale-100'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-white/10'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${driverShift.isOnline ? 'bg-black animate-ping' : 'bg-zinc-500'}`} />
              <span>{driverShift.isOnline ? 'ONLINE • ON SHIFT' : 'OFFLINE • ON BREAK'}</span>
            </button>
          </div>
        </div>

        {/* Shift Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-white/5">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400">Shift Earnings</span>
            <p className="text-lg sm:text-xl font-black italic text-emerald-400">{formatCurrency(driverShift.shiftEarningsTotal)}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400">100% Tips Kept</span>
            <p className="text-lg sm:text-xl font-black italic text-amber-400">{formatCurrency(driverShift.shiftTipsTotal)}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
            <span className="text-[9px] font-mono uppercase text-zinc-400">Trips Completed</span>
            <p className="text-lg sm:text-xl font-black italic text-white">{driverShift.shiftDeliveriesCount}</p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase text-zinc-400">Ready Balance</span>
              <p className="text-lg sm:text-xl font-black italic text-white">{formatCurrency(driverShift.totalBalance)}</p>
            </div>
            <button
              onClick={() => setShowCashOutModal(true)}
              className="p-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black shadow-md transition-colors"
              title="Instant Cash Out"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'active', label: 'Active Delivery 🏎️', count: activeOrders.length },
          { id: 'queue', label: 'Order Dispatch Queue 📦', count: pendingOrders.length },
          { id: 'work_leads', label: 'Work & Helper Leads 🛠️', count: workRequests.filter(r => r.status === 'open').length },
          { id: 'radar', label: 'Satellite GPS Radar 🛰️' },
          { id: 'earnings', label: 'Shift Earnings 💰' },
          { id: 'settings', label: 'Driver App Settings ⚙️' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-[#0e0e16] border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                  isActive ? 'bg-black text-amber-400' : 'bg-amber-400/20 text-amber-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACTIVE DELIVERY WORKFLOW (The Courier's Shift Action Loop) */}
      {activeTab === 'active' && (
        <div className="space-y-5">
          {currentOrder ? (
            <div className="space-y-5">
              
              {/* Active Delivery Execution Stepper */}
              <div className="bg-[#0c0c14] border border-white/10 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl">
                
                {/* Order Header Summary */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-5 border-b border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 font-mono font-bold text-xs rounded-full">
                        Order #{currentOrder.orderNumber}
                      </span>
                      {currentOrder.serviceType && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-mono uppercase font-bold">
                          {currentOrder.serviceType === 'store_pickup' ? '📦 Pre-Paid Pickup' : currentOrder.serviceType === 'prepaid_buy' ? '🛒 Prepaid Buy' : '⚡ Errand'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black italic text-white uppercase">
                      Deliver to {currentOrder.customerName}
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      Town: {currentOrder.town || 'Effingham, NH'} • Expected: {currentOrder.estimatedDeliveryTime || '20 mins'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-black/40 border border-white/5 p-3 rounded-2xl">
                    <span className="text-[9px] font-mono text-zinc-400 uppercase">Estimated Courier Payout</span>
                    <p className="text-2xl font-black italic text-emerald-400">
                      {formatCurrency(currentOrder.deliveryFee + currentOrder.tip)}
                    </p>
                    <p className="text-[9px] font-mono text-amber-400">Includes {formatCurrency(currentOrder.tip)} Tip</p>
                  </div>
                </div>

                {/* STAGE 1: RESTAURANT / STORE PICKUP CHECKLIST */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  currentOrder.status === 'accepted' || currentOrder.status === 'pending'
                    ? 'bg-blue-500/[0.04] border-blue-500/30 ring-1 ring-blue-500/20'
                    : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                        1
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Stage 1: Merchant Pickup</span>
                        <h3 className="font-bold text-white text-sm">{currentOrder.pickupStoreName || currentOrder.restaurantName || 'PNB Eats Roadside Grill'}</h3>
                      </div>
                    </div>
                    {currentOrder.pickupOrderCode && (
                      <span className="px-3 py-1 bg-black/80 border border-white/10 rounded-xl font-mono text-xs font-bold text-amber-400">
                        Code: {currentOrder.pickupOrderCode}
                      </span>
                    )}
                  </div>

                  {/* Navigation & Call to Merchant */}
                  <div className="pt-4 flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentOrder.pickupStoreAddress || `${currentOrder.pickupStoreName || 'PNB Eats'} Effingham NH`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GPS to Store (Google Maps)</span>
                    </a>
                    <a
                      href={`https://maps.apple.com/?daddr=${encodeURIComponent(currentOrder.pickupStoreAddress || 'Effingham NH')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <span>Apple Maps</span>
                    </a>
                  </div>

                  {/* Itemized Pickup Checklist */}
                  <div className="mt-4 space-y-2 pt-3 border-t border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400">Verify Bag Contents (Tap to check):</span>
                    {currentOrder.items.map((it, idx) => {
                      const itemKey = `${currentOrder.id}-${idx}`;
                      const isChecked = !!checkedItems[itemKey];
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleItemCheck(itemKey)}
                          className={`w-full p-3 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all border ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through'
                              : 'bg-black/30 border-white/5 text-white hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                              isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-600'
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span>{it.quantity}x {it.name}</span>
                          </div>
                          <span className="text-zinc-500">{formatCurrency(it.price * it.quantity)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Confirm Picked Up Action */}
                  {currentOrder.status === 'accepted' && (
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => handleStartTransit(currentOrder.id)}
                        className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Confirm Bag Picked Up ➔ Start GPS Transit</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* STAGE 2: CUSTOMER TRANSIT & LIVE GPS BROADCAST */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  currentOrder.status === 'out_for_delivery'
                    ? 'bg-indigo-500/[0.04] border-indigo-500/30 ring-1 ring-indigo-500/20'
                    : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                        2
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold">Stage 2: Customer Transit</span>
                        <h3 className="font-bold text-white text-sm">{currentOrder.deliveryAddress}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Customer Instructions Alert */}
                  {currentOrder.deliveryInstructions && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase text-[9px]">Delivery Note:</span>
                        <p>"{currentOrder.deliveryInstructions}"</p>
                      </div>
                    </div>
                  )}

                  {/* 1-Click Navigation & Customer Relays */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentOrder.deliveryAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-md"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>GPS to Customer (Google Maps)</span>
                    </a>
                    <a
                      href={`tel:${currentOrder.customerPhone}`}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Call ({currentOrder.customerPhone})</span>
                    </a>
                    <a
                      href={`sms:${currentOrder.customerPhone}?body=${encodeURIComponent(`Hi ${currentOrder.customerName}! This is Sean Martin with Oasis Courier. I'm on the road with your order from ${currentOrder.pickupStoreName || 'the kitchen'}. See you soon!`)}`}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-indigo-400" />
                      <span>1-Tap "En Route" SMS</span>
                    </a>
                  </div>
                </div>

                {/* STAGE 3: DROPOFF & PROOF OF DELIVERY CAMERA */}
                <div className={`p-5 rounded-2xl border transition-all ${
                  currentOrder.status === 'out_for_delivery'
                    ? 'bg-emerald-500/[0.04] border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/5'
                }`}>
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                      3
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Stage 3: Dropoff & Proof of Delivery</span>
                      <h3 className="font-bold text-white text-sm">Snap Doorstep Photo & Complete</h3>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Dropoff location picker */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">Dropoff Location:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'front_door', label: '🚪 Front Door' },
                          { id: 'porch', label: '🏡 Side Porch' },
                          { id: 'handed_to_customer', label: '🤝 Handed to Recipient' },
                          { id: 'garage', label: '🚗 Garage / Driveway' },
                        ].map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setDropoffType(loc.id as any)}
                            className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${
                              dropoffType === loc.id
                                ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                                : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {loc.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Camera / Image Upload for Proof */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-zinc-400">Proof of Delivery Photo (Optional but Recommended):</span>
                      <ImageUpload
                        label="Dropoff Doorstep Photo"
                        value={proofPhoto}
                        onChange={(url) => setProofPhoto(url)}
                        subtitle="Snap photo of bag placed safely at doorstep"
                        aspectRatio="wide"
                      />
                    </div>

                    {/* Optional Note */}
                    <input
                      type="text"
                      placeholder="Optional dropoff note (e.g. Placed on chair by front door)"
                      value={dropoffNote}
                      onChange={(e) => setDropoffNote(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />

                    {/* Complete Button */}
                    <button
                      onClick={() => handleFinishDelivery(currentOrder.id)}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>Complete Delivery & Collect {formatCurrency(currentOrder.deliveryFee + currentOrder.tip)}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Embedded Live Radar HUD for Active Route */}
              <DriverTrackerHUD order={currentOrder} isDriverView={true} />

            </div>
          ) : (
            <div className="bg-[#0b0b12] border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-3xl">
                ✓
              </div>
              <h2 className="text-xl font-black italic text-white uppercase">All Active Routes Completed</h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto font-mono">
                You're all caught up! Check the Order Queue tab for pending orders or wait for new dispatch requests.
              </p>
              <button
                onClick={() => setActiveTab('queue')}
                className="px-6 py-3 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
              >
                View Available Dispatch Queue ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORDER DISPATCH QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-5">
          {/* Hannaford To Go Courier Hub Header Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/10 border border-emerald-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛒</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                    Hannaford To Go Curbside Dispatch Hub
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-black italic text-white uppercase">
                  Hannaford Supermarket (Ossipee, NH) • Curbside Bay Pickups
                </h3>
                <p className="text-xs text-zinc-300 font-mono">
                  Orders called in by customers to (603) 641-9400. Ready for pickup in Center Ossipee.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="tel:6036419400"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call To Go Desk (603) 641-9400</span>
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=935+Route+16+Center+Ossipee+NH+03864"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>GPS Hannaford</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-black italic uppercase text-white">Pending & Available Orders</h2>
            <span className="text-xs font-mono text-amber-400">{pendingOrders.length} Waiting for Dispatch</span>
          </div>

          {deliveryOrders.map((order) => (
            <div
              key={order.id}
              className={`p-5 rounded-3xl border transition-all space-y-4 ${
                order.status === 'pending'
                  ? 'bg-amber-400/[0.03] border-amber-400/30 ring-1 ring-amber-400/20'
                  : order.status === 'delivered'
                  ? 'bg-white/[0.01] border-white/5 opacity-70'
                  : 'bg-[#0e0e16] border-white/10'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black italic text-white">Order #{order.orderNumber} • {order.customerName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] font-mono font-bold uppercase text-zinc-300">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono pt-0.5">
                    {order.deliveryAddress} • Town: {order.town || 'Effingham'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-black italic text-amber-400">{formatCurrency(order.total)}</span>
                  {order.status === 'pending' && (
                    <button
                      onClick={() => {
                        acceptDeliveryJob(order.id);
                        setSelectedOrderId(order.id);
                        setActiveTab('active');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/20"
                    >
                      Accept Job
                    </button>
                  )}
                  {order.status !== 'pending' && (
                    <button
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setActiveTab('active');
                      }}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl"
                    >
                      Open in HUD
                    </button>
                  )}
                </div>
              </div>

              {order.proofOfDelivery?.photoUrl && (
                <div className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-center gap-3">
                  <img src={order.proofOfDelivery.photoUrl} alt="Proof" className="w-14 h-14 rounded-xl object-cover border border-white/10" />
                  <div className="text-xs font-mono">
                    <span className="text-emerald-400 font-bold uppercase text-[9px]">Proof of Delivery Verified ✓</span>
                    <p className="text-zinc-300 text-[11px]">{order.proofOfDelivery.notes}</p>
                    <p className="text-zinc-500 text-[9px]">{formatDate(order.proofOfDelivery.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB: WORK & HELPER LEADS (CARROLL COUNTY TRADE JOBS & RESIDENT REQUESTS) */}
      {activeTab === 'work_leads' && (
        <div className="space-y-5">
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-500/10 to-transparent border border-amber-500/30 space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛠️</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                    Carroll County Community Work Radar
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black italic text-white uppercase">
                  Homeowner Work & Helper Errands Board
                </h3>
                <p className="text-xs text-zinc-300 font-mono">
                  Browse open resident jobs across Effingham, Freedom, Ossipee, and Wolfeboro. Call homeowners or transmit quick quotes while on shift.
                </p>
              </div>

              <Link
                href="/work"
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-amber-400/20 flex items-center gap-1.5 shrink-0"
              >
                <span>Full Work Hub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#0b0b12] border border-white/10 hover:border-amber-400/40 rounded-3xl p-5 space-y-4 shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[9px] font-mono font-bold uppercase">
                      {req.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      req.urgency === 'emergency_today'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {req.urgency === 'emergency_today' ? '🔥 Urgent' : req.urgency === 'within_few_days' ? '⚡ Few Days' : '📅 Flexible'}
                    </span>
                  </div>

                  <h4 className="font-black italic text-base text-white">{req.title}</h4>

                  {req.beforeImageUrl && (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/50">
                      <img src={req.beforeImageUrl} alt={req.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300">
                        Current Condition
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-zinc-400 font-mono leading-relaxed">{req.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[9px] uppercase">Budget</span>
                      <span className="font-black text-emerald-400">{req.budgetRange}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                      <span className="text-zinc-500 block text-[9px] uppercase">Location</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        {req.town}, NH
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Bar */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Contact: <strong className="text-white">{req.requesterName}</strong></span>
                    <span className="text-amber-400">{req.quotesCount || 0} quotes</span>
                  </div>

                  {quoteLeadId === req.id ? (
                    <div className="p-3 bg-black/60 rounded-2xl border border-indigo-500/40 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-indigo-300">Send Estimate to {req.requesterName}</span>
                        <button onClick={() => setQuoteLeadId(null)} className="text-zinc-400 hover:text-white">✕</button>
                      </div>
                      <input
                        type="text"
                        placeholder="Your estimate (e.g. $250 or $50/hr)"
                        value={quoteLeadPrice}
                        onChange={(e) => setQuoteLeadPrice(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                      <input
                        type="text"
                        placeholder="Availability (e.g. Can do this today after 3pm)"
                        value={quoteLeadMessage}
                        onChange={(e) => setQuoteLeadMessage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-400"
                      />
                      <button
                        onClick={() => handleSendLeadQuote(req.id)}
                        disabled={quoteLeadSuccess}
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        {quoteLeadSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Send className="w-3.5 h-3.5" />}
                        <span>{quoteLeadSuccess ? 'Transmitted!' : 'Transmit Quote'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.requesterPhone}`}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors font-mono"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call {req.requesterPhone}</span>
                      </a>
                      <button
                        onClick={() => setQuoteLeadId(req.id)}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Quote</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SATELLITE GPS RADAR */}
      {activeTab === 'radar' && (
        <div className="space-y-4">
          <DriverTrackerHUD order={currentOrder} isDriverView={true} />
        </div>
      )}

      {/* TAB 4: SHIFT EARNINGS & CASHOUT */}
      {activeTab === 'earnings' && (
        <div className="bg-[#0b0b12] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                Driver Payout Hub
              </span>
              <h2 className="text-2xl font-black italic text-white uppercase">
                Shift Earnings & Instant Payouts
              </h2>
            </div>

            <button
              onClick={() => setShowCashOutModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Cash Out Balance ({formatCurrency(driverShift.totalBalance)})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 uppercase">Total Shift Earnings</span>
              <p className="text-3xl font-black italic text-emerald-400">{formatCurrency(driverShift.shiftEarningsTotal)}</p>
              <p className="text-[10px] text-zinc-500 font-mono">Base fees + 100% Tips</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 uppercase">100% Customer Tips</span>
              <p className="text-3xl font-black italic text-amber-400">{formatCurrency(driverShift.shiftTipsTotal)}</p>
              <p className="text-[10px] text-zinc-500 font-mono">Direct to courier</p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[9px] font-mono text-zinc-400 uppercase">Estimated Route Mileage</span>
              <p className="text-3xl font-black italic text-white">{driverShift.shiftMileageEstimate.toFixed(1)} mi</p>
              <p className="text-[10px] text-zinc-500 font-mono">Carroll County corridor</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DRIVER SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#0b0b12] border border-white/10 rounded-3xl p-6 space-y-6">
          <h2 className="text-xl font-black italic text-white uppercase">Driver & App Configuration</h2>
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">Courier Name</p>
                <p className="text-zinc-400">{driverTelemetry.driverName}</p>
              </div>
              <span className="text-amber-400 font-bold">Sean Martin</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">Assigned Vehicle</p>
                <p className="text-zinc-400">{driverTelemetry.vehicle}</p>
              </div>
              <span className="text-indigo-400 font-bold">Subaru Outback AWD</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <div>
                <p className="font-bold text-white">Phone SMS Relay</p>
                <p className="text-zinc-400">{notificationSettings.phoneNumber || '(508) 507-0305'}</p>
              </div>
              <Link href="/dashboard/settings" className="text-amber-400 underline font-bold">
                Configure
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Instant Cash Out Modal */}
      {showCashOutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e16] border border-white/10 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <h3 className="font-black italic text-white text-lg">Instant Driver Cash Out</h3>
              </div>
              <button
                onClick={() => setShowCashOutModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {cashOutSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="font-black text-white text-base">Payout Dispatched!</h4>
                <p className="text-xs text-zinc-300 font-mono">
                  Transferred to {cashOutMethod === 'cash_app' ? 'Cash App' : cashOutMethod === 'venmo' ? 'Venmo' : 'Bank'} ({cashOutHandle})
                </p>
              </div>
            ) : (
              <form onSubmit={handleCashOutSubmit} className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono uppercase text-zinc-400">Transferable Balance</span>
                  <p className="text-3xl font-black italic text-emerald-400">{formatCurrency(driverShift.totalBalance)}</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Select Payout Method:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cash_app', label: 'Cash App', default: '$sean' },
                      { id: 'venmo', label: 'Venmo', default: '@sean' },
                      { id: 'bank', label: 'Direct Bank', default: 'Ending in ••42' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setCashOutMethod(m.id as any);
                          setCashOutHandle(m.default);
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          cashOutMethod === m.id
                            ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                            : 'bg-black/30 border-white/5 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Account Handle / Tag:</label>
                  <input
                    type="text"
                    value={cashOutHandle}
                    onChange={(e) => setCashOutHandle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={driverShift.totalBalance <= 0}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  Confirm Instant Transfer ({formatCurrency(driverShift.totalBalance)})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Mobile Navigation Dock */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#08080e]/95 border-t border-white/10 backdrop-blur-xl py-2.5 px-4 z-40 flex items-center justify-around max-w-lg mx-auto sm:rounded-t-3xl sm:border-x">
        {[
          { id: 'active', label: 'Active', icon: Truck },
          { id: 'queue', label: 'Queue', icon: Store, badge: pendingOrders.length },
          { id: 'radar', label: 'Radar', icon: Compass },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
        ].map((item) => {
          const isCurrent = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1 relative px-3 py-1 transition-all ${
                isCurrent ? 'text-amber-400 scale-105' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-amber-400 text-black font-mono font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
