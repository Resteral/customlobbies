'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  ShieldCheck, Truck, Sparkles, CheckCircle2, ArrowLeft 
} from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQuantity, clearCart } = useNfcStore();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * appliedDiscount);
  const total = Math.max(0, subtotal - discountAmount);

  const handleApplyDiscount = () => {
    if (discountCode.trim().toUpperCase() === 'OASIS10' || discountCode.trim().toUpperCase() === 'GOOGLE5') {
      setAppliedDiscount(0.15); // 15% off
    } else {
      alert('Invalid coupon code. Try: OASIS10');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderCompleted(true);
      const generatedId = `OASIS-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1500);
  };

  if (orderCompleted) {
    return (
      <div className="min-h-screen pt-36 pb-32 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#0b0b10] border border-emerald-500/30 rounded-[3rem] p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl">
            🎉
          </div>
          <div className="space-y-2">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400">Order Confirmed</span>
            <h2 className="text-3xl font-black italic text-white uppercase tracking-tight">Fleet Initialized!</h2>
            <p className="text-xs text-zinc-400">
              Order #{orderId}. Your smart NFC cards are queued for laser encoding and high-precision laser logo etching.
            </p>
          </div>

          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left space-y-2 font-mono text-[11px]">
            <div className="flex justify-between text-zinc-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-bold">Encoding Microchips</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Est. Delivery:</span>
              <span className="text-white">2-3 Business Days (Expedited)</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/dashboard"
              className="block w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20"
            >
              Configure Google Links in Dashboard
            </Link>
            <Link
              href="/"
              className="block w-full py-3 bg-white/5 text-zinc-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32">
      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-12">
        
        <div className="flex items-center gap-4">
          <Link href="/marketplace" className="p-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase text-white">Your Hardware Cart</h1>
            <p className="text-xs text-zinc-400">Review selected NFC cards, tabletop stands, and custom branding.</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-16 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-600">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic text-white uppercase">Your Cart is Empty</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Explore our smart NFC review fleet to begin accelerating your in-person 5-star ratings.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-lg"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-zinc-900 border border-white/5 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-black italic text-white text-base leading-snug">{item.product.name}</h4>
                      <p className="text-xs text-amber-400 font-bold">{formatCurrency(item.product.price)} each</p>
                      
                      {/* Customization Details */}
                      {(item.customBusinessName || item.selectedColor) && (
                        <div className="flex flex-wrap gap-2 pt-1 text-[9px] font-mono text-zinc-400">
                          {item.customBusinessName && (
                            <span className="px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                              Brand: {item.customBusinessName} {item.customLogoUrl}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-md border border-white/10">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor }} />
                              Custom Finish
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-black italic text-white text-base">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => updateCartQuantity(index, 0)}
                        className="text-[10px] text-red-400 hover:text-red-300 font-mono underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Checkout Box */}
            <div className="lg:col-span-5 bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white">Order Summary</h3>

              {/* Promo code input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon: OASIS10"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono uppercase"
                />
                <button
                  onClick={handleApplyDiscount}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="space-y-3 font-mono text-xs border-y border-white/5 py-4">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">{formatCurrency(subtotal)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (15% off):</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Expedited Shipping:</span>
                  <span className="text-emerald-400 font-bold">FREE ($0.00)</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Laser Custom Engraving:</span>
                  <span className="text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between text-base font-sans font-black italic text-white pt-2 border-t border-white/5">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-amber-400">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Processing Secured Payment...
                    </span>
                  ) : (
                    <span>Complete Order & Instant Provision • {formatCurrency(total)}</span>
                  )}
                </button>

                <p className="text-[9px] font-mono text-center text-zinc-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Checkout • 30-Day Money-Back Guarantee
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
