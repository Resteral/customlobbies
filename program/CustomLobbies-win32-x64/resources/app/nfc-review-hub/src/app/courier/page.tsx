'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { OrderServiceType, PaymentMethod } from '@/lib/types';
import confetti from 'canvas-confetti';
import { 
  Truck, ShoppingBag, Package, Store, MapPin, 
  Phone, DollarSign, CheckCircle2, ShieldCheck, 
  Sparkles, ArrowRight, Zap, Copy, ExternalLink,
  CreditCard, Wallet, Clock, Info, Check, Image as ImageIcon
} from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const POPULAR_LOCAL_STORES = [
  { name: 'Hannaford Supermarket & Hannaford To Go', town: 'Center Ossipee, NH', address: '935 Route 16, Center Ossipee, NH', phone: '(603) 641-9400', icon: '🛒' },
  { name: 'Smoke World Ossipee', town: 'Ossipee, NH', address: '870 Route 16, Ossipee, NH', icon: '💨' },
  { name: 'Mountain Grainery Ace Hardware', town: 'Ossipee, NH', address: 'Route 16, Center Ossipee, NH', icon: '🔨' },
  { name: 'Yankee Smokehouse BBQ', town: 'West Ossipee, NH', address: 'Jct Rte 16 & 25, West Ossipee, NH', icon: '🍖' },
  { name: 'Hobbs Tavern & Brewing Co.', town: 'West Ossipee, NH', address: '2415 White Mountain Hwy, West Ossipee, NH', icon: '🍺' },
  { name: "Jake's Seafood & Grill", town: 'Center Ossipee, NH', address: '2055 Route 16, Center Ossipee, NH', icon: '🦞' },
  { name: 'PNB Eats', town: 'Effingham, NH', address: 'NH-25, Effingham, NH', icon: '🥪' },
  { name: 'Pizza Barn & Pub', town: 'Effingham, NH', address: 'Route 153, Effingham, NH', icon: '🍕' },
  { name: 'Freedom Village Store', town: 'Freedom, NH', address: 'Elm Street, Freedom, NH', icon: '🏡' },
  { name: "Poor People's Pub", town: 'Sanbornville, NH', address: '28 Meadow St, Sanbornville, NH', icon: '🍻' },
];

export default function CourierErrandsPage() {
  const router = useRouter();
  const { placeDeliveryOrder, notificationSettings, userMembership } = useNfcStore();

  const [serviceType, setServiceType] = useState<OrderServiceType>('prepaid_buy');
  
  // Store / Pickup Details
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [orderPickupCode, setOrderPickupCode] = useState('');
  const [itemsToBuyDescription, setItemsToBuyDescription] = useState('');
  const [estimatedItemCost, setEstimatedItemCost] = useState<string>('25.00');
  const [receiptPhotoUrl, setReceiptPhotoUrl] = useState<string>('');

  // Customer & Delivery Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [tip, setTip] = useState<number>(5.00);

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_app');
  const [paymentReference, setPaymentReference] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pricing calculations
  const parsedItemCost = serviceType === 'prepaid_buy' ? Math.max(0, parseFloat(estimatedItemCost) || 0) : 0;
  const baseCourierFee = serviceType === 'store_pickup' ? 7.99 : serviceType === 'prepaid_buy' ? 9.99 : 8.99;
  const passDiscount = userMembership.active && userMembership.tier !== 'free';
  const effectiveCourierFee = passDiscount ? Math.max(3.99, baseCourierFee - 4.00) : baseCourierFee;
  const total = parsedItemCost + effectiveCourierFee + tip;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSelectQuickStore = (store: typeof POPULAR_LOCAL_STORES[0]) => {
    setStoreName(store.name);
    setStoreAddress(store.address);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim() || !storeName.trim()) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderTitle = serviceType === 'store_pickup'
        ? `Pre-Paid Pickup from ${storeName} (Code: ${orderPickupCode || 'Under Name'})`
        : serviceType === 'prepaid_buy'
        ? `Prepaid Buy & Deliver from ${storeName}: ${itemsToBuyDescription || 'Store Items'}`
        : `Custom Errand from ${storeName}: ${itemsToBuyDescription}`;

      const newOrder = await placeDeliveryOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryInstructions: deliveryInstructions || undefined,
        items: [
          {
            id: `errand-${Date.now()}`,
            name: orderTitle,
            quantity: 1,
            price: parsedItemCost > 0 ? parsedItemCost : effectiveCourierFee,
            storeName,
          }
        ],
        subtotal: parsedItemCost,
        deliveryFee: effectiveCourierFee,
        tip,
        total,
        restaurantName: storeName,
        restaurantAddress: storeAddress || undefined,
        orderType: 'delivery',
        serviceType,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pay_on_delivery' : 'prepaid',
        paymentReference: paymentReference.trim() || undefined,
        pickupStoreName: storeName,
        pickupStoreAddress: storeAddress || undefined,
        pickupOrderCode: orderPickupCode || undefined,
        estimatedItemCost: parsedItemCost > 0 ? parsedItemCost : undefined,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#6366f1']
      });

      setTimeout(() => {
        router.push(`/order/${newOrder.id}`);
      }, 1000);
    } catch (err) {
      console.error('Errand dispatch failed', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-28 pb-32 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[450px] h-[450px] bg-amber-500/15 blur-[160px] rounded-full" />
        <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] bg-indigo-600/15 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-400 text-[10px] font-mono font-black uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Oasis Personal Courier • Direct Driver Dispatch</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
            Pay Me to <span className="text-amber-400">Pick Up & Deliver</span> Anything.
          </h1>
          
          <p className="text-xs md:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Need items picked up from a local store, restaurant, hardware shop, or smoke shop? Prepay upfront via <strong className="text-white">Cash App, Venmo, Zelle, or Card</strong> and I'll buy/pick it up and bring it straight to your doorstep.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-mono text-zinc-400 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Verified Local Driver: Sean Martin
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Phone className="w-3.5 h-3.5" />
              (508) 507-0305
            </span>
          </div>
        </div>

        {/* 3-Mode Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setServiceType('prepaid_buy')}
            className={`p-5 rounded-3xl border text-left transition-all space-y-2 relative overflow-hidden ${
              serviceType === 'prepaid_buy'
                ? 'bg-amber-400/[0.08] border-amber-400 shadow-xl shadow-amber-500/10'
                : 'bg-[#0e0e14] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center text-xl">
                🛒
              </div>
              {serviceType === 'prepaid_buy' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                  Selected
                </span>
              )}
            </div>
            <h3 className="font-black text-sm uppercase text-white">1. Buy & Deliver for Me</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Prepay item budget + courier fee. I will visit the store, buy your items, and deliver to you.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setServiceType('store_pickup')}
            className={`p-5 rounded-3xl border text-left transition-all space-y-2 relative overflow-hidden ${
              serviceType === 'store_pickup'
                ? 'bg-amber-400/[0.08] border-amber-400 shadow-xl shadow-amber-500/10'
                : 'bg-[#0e0e14] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
                📦
              </div>
              {serviceType === 'store_pickup' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                  Selected
                </span>
              )}
            </div>
            <h3 className="font-black text-sm uppercase text-white">2. Pre-Paid Store Pickup</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              You already ordered/called in at the store. I pick it up using your name/order # and deliver.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setServiceType('custom_errand')}
            className={`p-5 rounded-3xl border text-left transition-all space-y-2 relative overflow-hidden ${
              serviceType === 'custom_errand'
                ? 'bg-amber-400/[0.08] border-amber-400 shadow-xl shadow-amber-500/10'
                : 'bg-[#0e0e14] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                ⚡
              </div>
              {serviceType === 'custom_errand' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase">
                  Selected
                </span>
              )}
            </div>
            <h3 className="font-black text-sm uppercase text-white">3. Custom Errand / Task</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Hardware runs, package dropoffs, firewood bundles, campsite runs, or specialty tasks.
            </p>
          </button>
        </div>

        {/* Hannaford To Go Call-In Grocery Notice Box */}
        <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-amber-500/10 to-emerald-500/10 border border-emerald-500/30 space-y-3 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                  Hannaford To Go Grocery Curbside Pickup Service
                </span>
              </div>
              <h3 className="text-lg font-black italic text-white uppercase">
                Need Groceries? Call To-Go at (603) 641-9400 to Order!
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                For groceries, call Hannaford To Go directly at <strong className="text-white">(603) 641-9400</strong> to place and pay for your grocery order. Once you receive your pickup code or confirmation name, submit this form below so <strong>Sean Martin</strong> can drive to Hannaford, pick up your bags curbside, and deliver them straight to your door!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <a
                href="tel:6036419400"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call (603) 641-9400</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setServiceType('store_pickup');
                  setStoreName('Hannaford Supermarket & Hannaford To Go');
                  setStoreAddress('935 Route 16, Center Ossipee, NH 03864');
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all hover:bg-amber-300 shadow-md shadow-amber-400/20 flex items-center gap-1.5"
              >
                <span>Select Hannaford ➔</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Form Form */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Pickup Store & Items Specification */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Store & Items Box */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
              
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Step 1: Store & Items</span>
                <h3 className="text-xl font-black italic text-white uppercase">
                  {serviceType === 'store_pickup' ? 'Where is Your Pre-Paid Order?' : 'What Store & What Items?'}
                </h3>
              </div>

              {/* Quick Pick Local Merchants */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400">1-Click Quick Select Common Shops:</span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_LOCAL_STORES.slice(0, 6).map((store) => (
                    <button
                      key={store.name}
                      type="button"
                      onClick={() => handleSelectQuickStore(store)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>{store.icon}</span>
                      <span>{store.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                    Store / Merchant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Smoke World Ossipee, Mountain Grainery Ace Hardware, Hannaford, etc."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                    Store Street Address or Town (Optional)
                  </label>
                  <input
                    type="text"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    placeholder="e.g. 870 Route 16, Ossipee, NH"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {serviceType === 'store_pickup' ? (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                      Order Pickup Name or Confirmation Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={orderPickupCode}
                      onChange={(e) => setOrderPickupCode(e.target.value)}
                      placeholder="e.g. Ordered under 'Sean M.' or Order #4481"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
                    />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                        Detailed Items to Buy & Brand Preferences *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={itemsToBuyDescription}
                        onChange={(e) => setItemsToBuyDescription(e.target.value)}
                        placeholder="e.g. 1x Geek Bar Pulse Frozen Cherry, 1x pack of Raw King Size cones, and 2 bottles of iced tea..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-400/[0.04] border border-amber-400/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-amber-300">
                          Estimated Items Total Cost ($) *
                        </label>
                        <span className="text-[10px] font-mono text-zinc-400">You prepay this upfront</span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-mono font-bold">$</span>
                        <input
                          type="number"
                          step="1.00"
                          min="1"
                          required
                          value={estimatedItemCost}
                          onChange={(e) => setEstimatedItemCost(e.target.value)}
                          className="w-full bg-black/50 border border-white/15 rounded-xl py-2.5 pl-8 pr-4 text-sm text-white font-mono font-bold focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        * If the exact store receipt is slightly less, change is refunded. If more, you can settle on dropoff.
                      </p>
                    </div>
                  </>
                )}

                {/* Optional Receipt or Item Photo Upload */}
                <div className="pt-2 border-t border-white/5">
                  <ImageUpload
                    value={receiptPhotoUrl}
                    onChange={(url) => setReceiptPhotoUrl(url)}
                    label="Attach Photo of Receipt, Order Barcode, or Items (Optional)"
                    subtitle="Upload a screenshot or camera photo of your store order code or items"
                    aspectRatio="card"
                    compact={true}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Customer Contact & Dropoff Destination */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-4">
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Step 2: Destination</span>
                <h3 className="text-xl font-black italic text-white uppercase">Your Delivery Address</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Alex Henderson"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Mobile Phone (For Driver Updates & Photos) *</span>
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. (603) 555-0199"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Dropoff Street Address (House/Cabin/Campsite) *</span>
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 118 Lakeview Way, Effingham, NH"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                    Delivery Instructions / Gate Code
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Leave on side porch table under the light..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Prepayment Method & Checkout */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Payment Method Selector */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl">
              
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Step 3: Upfront Payment</span>
                <h3 className="text-xl font-black italic text-white uppercase">Choose How to Pay</h3>
              </div>

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Cash App */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_app')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'cash_app'
                      ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">🟩</span>
                    {paymentMethod === 'cash_app' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="font-black text-xs text-white">Cash App</div>
                  <div className="text-[9px] font-mono text-emerald-400">$frijj555</div>
                </button>

                {/* Venmo */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('venmo')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'venmo'
                      ? 'bg-blue-500/15 border-blue-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">🟦</span>
                    {paymentMethod === 'venmo' && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="font-black text-xs text-white">Venmo</div>
                  <div className="text-[9px] font-mono text-blue-300">@Sean-Martin-NH</div>
                </button>

                {/* PayPal */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-blue-600/20 border-blue-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">🅿️</span>
                    {paymentMethod === 'paypal' && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className="font-black text-xs text-white">PayPal</div>
                  <div className="text-[9px] font-mono text-blue-300">seanhse97@gmail.com</div>
                </button>

                {/* Zelle */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('zelle')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'zelle'
                      ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-lg">🟪</span>
                    {paymentMethod === 'zelle' && <Check className="w-4 h-4 text-purple-400" />}
                  </div>
                  <div className="font-black text-xs text-white">Zelle</div>
                  <div className="text-[9px] font-mono text-purple-300">508-507-0305</div>
                </button>

                {/* Card or COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="font-black text-xs text-white">Card / Apple Pay</div>
                  <div className="text-[9px] font-mono text-amber-300">Instant Checkout</div>
                </button>

              </div>

              {/* Interactive Prepayment Details Box */}
              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <span>🅿️</span> PayPal Direct Transfer
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('seanhse97@gmail.com', 'paypal')}
                      className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'paypal' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'paypal' ? 'Copied!' : 'Copy Email'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Send <strong className="text-white">${total.toFixed(2)}</strong> to <strong className="text-blue-300">paypal.me/seanhse97</strong> or <strong className="text-white">seanhse97@gmail.com</strong>.
                  </p>
                  <a
                    href={`https://paypal.me/seanhse97/${total.toFixed(2)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-black uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Open PayPal to Pay ${total.toFixed(2)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {paymentMethod === 'cash_app' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <span>🟩</span> Cash App Prepayment
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('$frijj555', 'cashapp')}
                      className="text-[10px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'cashapp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cashapp' ? 'Copied!' : 'Copy Cashtag'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Send <strong className="text-white">${total.toFixed(2)}</strong> to <strong className="text-emerald-400">$frijj555</strong> with note "{customerName || 'Courier Order'}".
                  </p>
                  <a
                    href={`https://cash.app/$frijj555/${total.toFixed(2)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Open Cash App to Pay ${total.toFixed(2)}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {paymentMethod === 'venmo' && (
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                      <span>🟦</span> Venmo Prepayment
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy('@Sean-Martin-NH', 'venmo')}
                      className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'venmo' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'venmo' ? 'Copied!' : 'Copy Handle'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-snug">
                    Send <strong className="text-white">${total.toFixed(2)}</strong> to <strong className="text-blue-300">@Sean-Martin-NH</strong> on Venmo.
                  </p>
                </div>
              )}

              {paymentMethod === 'zelle' && (
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-3 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <span>🟪</span> Zelle Direct Bank Transfer
                  </span>
                  <div className="space-y-1 text-xs font-mono text-zinc-300">
                    <div>Phone: <strong className="text-white">(508) 507-0305</strong></div>
                    <div>Email: <strong className="text-white">frijj555@gmail.com</strong></div>
                    <div>Name: <strong className="text-white">Sean Martin</strong></div>
                  </div>
                </div>
              )}

              {/* Payment Reference Input */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                  Your Payment Note / Handle (For Instant Driver Verification)
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="e.g. Sent from $JohnDoe on Cash App or Cash on Arrival"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {/* Driver Tip Selection */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-zinc-400">
                  <span>Courier Driver Tip</span>
                  <span className="text-amber-400 font-bold">${tip.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 8, 12].map((tipVal) => (
                    <button
                      key={tipVal}
                      type="button"
                      onClick={() => setTip(tipVal)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                        tip === tipVal
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      ${tipVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 font-mono text-xs">
                {parsedItemCost > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Estimated Store Items:</span>
                    <span className="text-white">${parsedItemCost.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Courier Errand & Delivery:</span>
                  <span className="text-white">${effectiveCourierFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Driver Tip:</span>
                  <span className="text-amber-400">${tip.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-sans font-black italic text-white pt-2 border-t border-white/5">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Dispatching to Sean's Phone...
                  </span>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>Dispatch Courier Run • ${total.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="text-center space-y-1 pt-1">
                <p className="text-[9px] font-mono text-zinc-500 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Instant SMS & phone relay sent directly to Sean Martin</span>
                </p>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
