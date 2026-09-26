'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryItem, PaymentMethod } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  Truck, Phone, MapPin, Navigation, ShoppingBag, 
  Plus, Minus, Sparkles, CheckCircle2, ShieldCheck, 
  Clock, DollarSign, ArrowRight, MessageSquare,
  CreditCard, Smartphone, Package, ExternalLink, Copy, Check
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'm-pnb-sub', name: 'Big Mountain Steak & Cheese Sub (PNB Eats)', price: 13.99, category: 'Food', icon: '🥪' },
  { id: 'm-pnb-pizza', name: 'Effingham Rustic Supreme Pizza 16" (PNB Eats)', price: 19.50, category: 'Food', icon: '🍕' },
  { id: 'm-pb-bbq', name: 'Smoked Pulled Pork Platter (Pizza Barn)', price: 16.50, category: 'Food', icon: '🥩' },
  { id: 'm-1', name: 'Cold Brew Growler 64oz (Oasis Roastery)', price: 18.00, category: 'Beverage', icon: '☕' },
  { id: 'm-2', name: 'Artisan Wood-Fired Sourdough Loaf (Oasis)', price: 8.50, category: 'Bakery', icon: '🍞' },
  { id: 'm-fvs-scone', name: 'Freedom Blueberry Crumb Scones 2-Pack', price: 6.50, category: 'Bakery', icon: '🫐' },
  { id: 'm-4', name: 'Stealth Obsidian NFC Review Card (Hand Delivered)', price: 29.99, category: 'Hardware', icon: '💳' },
  { id: 'm-5', name: 'Cyber Glass Tabletop Tap Stand', price: 49.99, category: 'Hardware', icon: '💎' },
];

export default function DeliveryOrderPage() {
  const router = useRouter();
  const { placeDeliveryOrder, notificationSettings } = useNfcStore();

  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    'm-1': 1,
    'm-2': 1,
  });
  const [customItemText, setCustomItemText] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('15.00');

  // Customer Delivery Info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(5.00);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_app');
  const [paymentReference, setPaymentReference] = useState('');
  const [copiedHandle, setCopiedHandle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = 4.99;

  // Calculate Subtotal
  const standardSubtotal = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = MENU_ITEMS.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const customPriceNum = customItemText.trim() ? parseFloat(customItemPrice) || 0 : 0;
  const subtotal = standardSubtotal + customPriceNum;
  const total = subtotal + deliveryFee + selectedTip;

  const handleUpdateQty = (id: string, delta: number) => {
    setSelectedItems(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !deliveryAddress) {
      alert('Please fill out your name, phone number, and delivery address.');
      return;
    }

    const orderItems: DeliveryItem[] = [];
    Object.entries(selectedItems).forEach(([id, qty]) => {
      const item = MENU_ITEMS.find(m => m.id === id);
      if (item && qty > 0) {
        orderItems.push({
          id: item.id,
          name: item.name,
          quantity: qty,
          price: item.price,
        });
      }
    });

    if (customItemText.trim()) {
      orderItems.push({
        id: `custom-${Date.now()}`,
        name: `Custom Request: ${customItemText}`,
        quantity: 1,
        price: customPriceNum,
      });
    }

    if (orderItems.length === 0) {
      alert('Please select at least one item or enter a custom delivery request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const paymentStatus = paymentMethod === 'cash_on_delivery' ? 'pay_on_delivery' : (paymentReference.trim() ? 'prepaid' : 'pending_verification');

      const newOrder = await placeDeliveryOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        deliveryInstructions,
        serviceType: 'standard_delivery',
        paymentMethod,
        paymentStatus,
        paymentReference: paymentReference.trim() || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        tip: selectedTip,
        total,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        router.push(`/order/${newOrder.id}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(true);
    setTimeout(() => setCopiedHandle(false), 2000);
  };

  return (
    <div className="min-h-screen pt-28 pb-32">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-10">
        
        {/* Header Banner */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Direct Phone Dispatch Live • 20-35 Min Delivery</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Express <span className="text-amber-400">Local Delivery.</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 max-w-lg mx-auto">
            Order artisan food, fresh coffee, or pre-encoded NFC cards. Your order is pushed straight to our mobile driver with instant route navigation.
          </p>
        </div>

        {/* Courier & Pre-paid Store Pickup Banner */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-400/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span>Need Pre-Paid Store Pickup or Buy & Deliver?</span>
                <span className="px-2 py-0.5 bg-amber-400 text-black text-[9px] font-black rounded-full">NEW</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Pre-pay for pickups from Ace Hardware, Smoke World, Yankee Smokehouse, grocery stores, or custom errands.
              </p>
            </div>
          </div>
          <Link
            href="/courier"
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
          >
            <span>Open Courier Dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/eats"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider transition-all shadow-lg"
          >
            <span>🍔 Browse Full Oasis Eats Restaurant Menus & Customizers →</span>
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Menu Items & Custom Request */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Delivery Menu */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Fast Courier Menu</span>
                  <h3 className="text-xl font-black italic text-white uppercase">Select Delivery Items</h3>
                </div>
                <Truck className="w-5 h-5 text-amber-400" />
              </div>

              <div className="space-y-3">
                {MENU_ITEMS.map((item) => {
                  const qty = selectedItems[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        qty > 0
                          ? 'bg-amber-400/[0.03] border-amber-400/30'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-bold text-white text-xs md:text-sm leading-snug">{item.name}</p>
                          <p className="text-[10px] font-mono text-amber-400 font-bold">{formatCurrency(item.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-2">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="p-1 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Delivery Request Box */}
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Custom Courier Request</span>
              </div>
              <h3 className="text-lg font-black italic text-white uppercase">Need Something Specific Delivered?</h3>
              <p className="text-xs text-zinc-400">
                Type any custom item or pickup instruction and enter an agreed price.
              </p>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={customItemText}
                  onChange={(e) => setCustomItemText(e.target.value)}
                  placeholder="e.g. 2 Iced Vanilla Lattes with Oat Milk & Extra Shot"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400"
                />
                {customItemText && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-mono">Custom Item Cost ($):</span>
                    <input
                      type="number"
                      step="0.50"
                      min="1"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="w-28 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Address, Phone & Notification Dispatch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl">
              
              <div className="space-y-1 border-b border-white/5 pb-4">
                <span className="text-[9px] font-mono uppercase text-amber-400 tracking-wider">Courier Destination</span>
                <h3 className="text-xl font-black italic text-white uppercase">Delivery Details</h3>
              </div>

              {/* Input Fields */}
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
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Mobile Phone (For Driver Updates) *</span>
                    <Phone className="w-3 h-3 text-amber-400" />
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. (603) 555-0142"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 flex items-center justify-between">
                    <span>Delivery Street Address *</span>
                    <MapPin className="w-3 h-3 text-emerald-400" />
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. 42 Pine Hill Rd, Effingham, NH"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">
                    Dropoff Instructions / Gate Code
                  </label>
                  <textarea
                    rows={2}
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    placeholder="e.g. Leave on front porch table, gate code #4412"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Driver Tip Selection */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
                    <span>Courier Driver Tip</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(selectedTip)}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 5, 8, 12].map((tipVal) => (
                      <button
                        key={tipVal}
                        type="button"
                        onClick={() => setSelectedTip(tipVal)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          selectedTip === tipVal
                            ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        ${tipVal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                      Payment Method
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">Upfront or On Delivery</span>
                  </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'cash_app', name: 'Cash App', badge: '$frijj555', color: 'emerald' },
                        { id: 'venmo', name: 'Venmo', badge: '@Sean-Martin-NH', color: 'cyan' },
                        { id: 'paypal', name: 'PayPal', badge: 'seanhse97@gmail.com', color: 'blue' },
                        { id: 'zelle', name: 'Zelle', badge: '508-507-0305', color: 'purple' },
                        { id: 'card', name: 'Card / Apple Pay', badge: 'Online Reader', color: 'amber' },
                        { id: 'cash_on_delivery', name: 'Cash On Hand', badge: 'At Door', color: 'zinc' },
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            paymentMethod === pm.id
                              ? 'bg-white/10 border-amber-400 shadow-lg shadow-amber-500/10'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{pm.name}</span>
                            {paymentMethod === pm.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">{pm.badge}</span>
                        </button>
                      ))}
                    </div>

                    {/* Payment Details Drawer */}
                    {paymentMethod === 'paypal' && (
                      <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-black text-blue-400 block">🅿️ PayPal: seanhse97@gmail.com</span>
                            <span className="text-[10px] text-zinc-400 font-mono">paypal.me/seanhse97</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard('seanhse97@gmail.com')}
                              className="px-2 py-1 bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 text-[10px] font-mono rounded-lg transition-colors flex items-center gap-1"
                            >
                              {copiedHandle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedHandle ? 'Copied' : 'Copy'}</span>
                            </button>
                            <a
                              href={`https://paypal.me/seanhse97/${total.toFixed(2)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-blue-500 text-white text-[10px] font-black rounded-lg hover:bg-blue-400 transition-colors flex items-center gap-1 shadow-md"
                            >
                              <span>Pay via PayPal (${total.toFixed(2)})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="Your PayPal Name / Email / Transaction note"
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 font-mono"
                        />
                      </div>
                    )}

                    {paymentMethod === 'cash_app' && (
                      <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-400">Cash App: $frijj555</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard('$frijj555')}
                              className="px-2 py-1 bg-emerald-400/20 hover:bg-emerald-400/30 text-emerald-300 text-[10px] font-mono rounded-lg transition-colors flex items-center gap-1"
                            >
                              {copiedHandle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedHandle ? 'Copied' : 'Copy'}</span>
                            </button>
                            <a
                              href={`https://cash.app/$frijj555/${total.toFixed(2)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-emerald-400 text-black text-[10px] font-black rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-1"
                            >
                              <span>Open Cash App (${total.toFixed(2)})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={paymentReference}
                          onChange={(e) => setPaymentReference(e.target.value)}
                          placeholder="Your CashTag / Note (optional)"
                          className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 font-mono"
                        />
                      </div>
                    )}

                  {paymentMethod === 'venmo' && (
                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-cyan-400">Venmo: @Sean-Martin-NH</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => copyToClipboard('@Sean-Martin-NH')}
                            className="px-2 py-1 bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 text-[10px] font-mono rounded-lg transition-colors flex items-center gap-1"
                          >
                            {copiedHandle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedHandle ? 'Copied' : 'Copy'}</span>
                          </button>
                          <a
                            href={`https://venmo.com/Sean-Martin-NH?txn=pay&amount=${total.toFixed(2)}&note=Oasis%20Delivery%20Order`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-cyan-400 text-black text-[10px] font-black rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-1"
                          >
                            <span>Open Venmo (${total.toFixed(2)})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Your Venmo handle / Note (optional)"
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 font-mono"
                      />
                    </div>
                  )}

                  {paymentMethod === 'zelle' && (
                    <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-black text-purple-300 block">Zelle: (508) 507-0305</span>
                          <span className="text-[10px] text-zinc-400 font-mono">frijj555@gmail.com</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('5085070305')}
                          className="px-2.5 py-1 bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 text-[10px] font-mono rounded-lg transition-colors flex items-center gap-1"
                        >
                          {copiedHandle ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHandle ? 'Copied' : 'Copy #'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="Sender Name or Zelle confirmation note"
                        className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Order Cost Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-white/5 font-mono text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Items Subtotal:</span>
                  <span className="text-white font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Express Courier Fee:</span>
                  <span className="text-white font-bold">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Driver Tip:</span>
                  <span className="text-amber-400 font-bold">{formatCurrency(selectedTip)}</span>
                </div>
                <div className="flex justify-between text-base font-sans font-black italic text-white pt-2 border-t border-white/5">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-amber-400">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting || subtotal <= 0}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Paging Driver & Relaying to Phone...
                    </span>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Place Delivery Order • {formatCurrency(total)}</span>
                    </>
                  )}
                </button>

                <p className="text-[8px] font-mono text-center text-zinc-500 flex items-center justify-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" />
                  <span>Instant notification is dispatched directly to merchant's phone upon submission</span>
                </p>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
