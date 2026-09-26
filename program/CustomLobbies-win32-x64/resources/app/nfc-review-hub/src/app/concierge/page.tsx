'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Wifi, 
  Key, 
  Flame, 
  Truck, 
  Anchor, 
  Compass, 
  PhoneCall, 
  MapPin, 
  Sun, 
  Waves, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Coffee,
  Utensils,
  Beer,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function ConciergePage() {
  const { localConditions, storefronts, placeDeliveryOrder, playDeliveryChime } = useNfcStore();
  const [copiedKeypad, setCopiedKeypad] = useState<boolean>(false);
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);
  const [serviceFeedback, setServiceFeedback] = useState<string | null>(null);

  // Quick Dockside Order State
  const [cabinName, setCabinName] = useState<string>('Pine Cove Waterfront Chalet - Dock 3');
  const [guestPhone, setGuestPhone] = useState<string>('(603) 555-8912');

  const handleCopy = (text: string, type: 'wifi' | 'keypad') => {
    navigator.clipboard.writeText(text);
    if (type === 'wifi') {
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    } else {
      setCopiedKeypad(true);
      setTimeout(() => setCopiedKeypad(false), 2000);
    }
  };

  const handleOrderFirewood = async () => {
    await placeDeliveryOrder({
      customerName: 'Lakefront Guest (Dock Delivery)',
      customerPhone: guestPhone,
      deliveryAddress: cabinName,
      deliveryInstructions: 'Leave at lakeside firepit or boat dock. Text upon delivery.',
      serviceType: 'custom_errand',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pay_on_delivery',
      restaurantName: 'Pine Cove Campfire & Provisioning',
      restaurantAddress: 'Freedom / Ossipee Lake, NH',
      town: 'Freedom',
      items: [
        {
          id: 'item-firewood',
          name: 'Seasoned NH Hardwood Firewood Bundle (Kiln Dried) + Kindling',
          price: 24.99,
          quantity: 2,
        },
        {
          id: 'item-smores',
          name: 'Campfire S\'mores Deluxe Kit (Hershey\'s, Grahams, Marshmallows)',
          price: 16.50,
          quantity: 1,
        }
      ],
      subtotal: 66.48,
      deliveryFee: 4.99,
      tip: 5.00,
      total: 76.47,
    });
    setServiceFeedback('🔥 Dockside Firewood & S\'mores delivery dispatched! Courier will arrive in ~25-35 mins.');
    setTimeout(() => setServiceFeedback(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/80 via-[#0e0e1a] to-emerald-950/50 shadow-2xl">
          <div className="absolute -right-16 -top-16 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-widest">
              <Building2 className="w-3.5 h-3.5" />
              Lake Winnipesaukee & Ossipee Lake Guest Portal
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase leading-tight">
              Carroll County <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400">
                Airbnb & Lake Concierge
              </span>
            </h1>

            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Welcome to the Lakes & Mountains region! Connect to high-speed fiber Wi-Fi, dispatch dockside firewood & food delivery, check boat ramp conditions, and explore verified local spots.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <Waves className="w-4 h-4" />
                <span>Lake Ossipee: {localConditions?.lakeOssipeeTempF || 71}°F ({localConditions?.lakeStatus || 'Calm Water'})</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center gap-2 text-xs font-bold text-amber-300">
                <Sun className="w-4 h-4" />
                <span>{localConditions?.temperatureF || 68}°F • {localConditions?.condition || 'Clear Mountain Air'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback alert */}
        {serviceFeedback && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-sm font-bold flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{serviceFeedback}</span>
          </div>
        )}

        {/* Guest Keyless Entry & Wi-Fi Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Smart Lock Keypad */}
          <div className="p-6 bg-[#0c0c14] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Smart Lock Keyless Entry</h3>
                  <p className="text-[11px] text-white/50">Your automated keypad code for check-in</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active 3 PM Check-In
              </span>
            </div>

            <div className="p-4 bg-[#141422] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Front Door Code</span>
                <span className="text-2xl font-black font-mono text-amber-400 tracking-widest">4892#</span>
              </div>
              <button
                onClick={() => handleCopy('4892#', 'keypad')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedKeypad ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
                <span>{copiedKeypad ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <p className="text-[11px] text-white/50 italic">
              💡 Touch keypad screen with palm to wake, enter code, and press checkmark/lock to unlock.
            </p>
          </div>

          {/* High-Speed Wi-Fi */}
          <div className="p-6 bg-[#0c0c14] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Guest High-Speed Wi-Fi</h3>
                  <p className="text-[11px] text-white/50">1 Gigabit Fiber Optic Internet</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                1000 Mbps Fiber
              </span>
            </div>

            <div className="p-4 bg-[#141422] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Network: <strong className="text-white">OasisLakehouse_5G</strong></span>
                <span className="text-lg font-black font-mono text-indigo-300 tracking-wider">pinecove2026!</span>
              </div>
              <button
                onClick={() => handleCopy('pinecove2026!', 'wifi')}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copiedWifi ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white/70" />}
                <span>{copiedWifi ? 'Copied!' : 'Copy Wi-Fi'}</span>
              </button>
            </div>
            <p className="text-[11px] text-white/50 italic">
              📶 Tap your phone against the acrylic NFC puck on the coffee table to auto-connect with 0 typing.
            </p>
          </div>

        </div>

        {/* Campfire & Dockside Provisioning Dispatch */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-amber-950/40 via-[#0e0e18] to-orange-950/30 border border-amber-500/20 rounded-3xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-2">
                <Flame className="w-3.5 h-3.5" />
                Dockside & Lakehouse Courier Express
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
                Dispatch Campfire Firewood & S'mores Kit to Your Dock
              </h2>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                Need kiln-dried NH hardwood for tonight's firepit or fresh s'mores ingredients? Our local couriers deliver straight to your waterfront dock or cabin porch in ~30 minutes.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleOrderFirewood}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>1-Tap Order Firewood + S'mores ($66.48)</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
              <div className="font-bold text-white text-xs">2x Kiln-Dried Hardwood Bundles</div>
              <div className="text-[11px] text-white/50">Birch, maple, oak with cedar kindling</div>
            </div>
            <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
              <div className="font-bold text-white text-xs">Campfire S'mores Deluxe Kit</div>
              <div className="text-[11px] text-white/50">Hershey's bars, Honey Maid grahams, skewers</div>
            </div>
            <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl">
              <div className="font-bold text-white text-xs">Fast Dockside Delivery</div>
              <div className="text-[11px] text-emerald-400 font-semibold">Courier on duty in Carroll County</div>
            </div>
          </div>
        </div>

        {/* Local Highlights & Lake Activities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase italic tracking-tight text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              Verified Local Attractions & Activities
            </h2>
            <Link href="/directory" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-bold">
              <span>View Full Carroll County Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Food & Dining */}
            <div className="p-5 bg-[#0c0c14] border border-white/5 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white uppercase">Roadside Eats & Pizza</h3>
              <p className="text-xs text-white/60">
                Order wood-fired pizza from <strong>Pizza Barn</strong> or giant steak & cheese subs from <strong>PNB Eats</strong> with fast delivery.
              </p>
              <Link href="/order" className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 pt-1">
                <span>Browse Takeout & Delivery</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Boat Ramps & Lake Access */}
            <div className="p-5 bg-[#0c0c14] border border-white/5 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Anchor className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white uppercase">Ossipee Lake Boat Ramp</h3>
              <p className="text-xs text-white/60">
                Public ramp at Pine Cove. Concrete ramp with trailer parking, kayak launch dock, and fuel dock nearby at Freedom Marina.
              </p>
              <a 
                href="https://maps.google.com/?q=Ossipee+Lake+Public+Boat+Launch+NH" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Coffee & Morning Bakery */}
            <div className="p-5 bg-[#0c0c14] border border-white/5 rounded-2xl space-y-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-white uppercase">Morning Coffee & Brioche</h3>
              <p className="text-xs text-white/60">
                Visit <strong>Oasis Artisan Roastery</strong> for single-origin espresso, cider donuts, and fresh wood-fired sourdough loaves.
              </p>
              <Link href="/eats" className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 pt-1">
                <span>View Morning Bakery Menu</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

        {/* 24/7 Local Emergency & Services Directory */}
        <div className="p-6 bg-[#0c0c14] border border-white/5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              24/7 Carroll County Lake Emergency & Local Contacts
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[10px] text-white/40 uppercase font-bold block">Life Safety / Police / Fire</span>
              <div className="text-base font-black text-red-400 mt-0.5">911</div>
              <div className="text-[10px] text-white/50">Carroll County Dispatch</div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[10px] text-white/40 uppercase font-bold block">NH Marine Patrol (Boating)</span>
              <div className="text-sm font-bold text-white mt-0.5">(603) 293-2037</div>
              <div className="text-[10px] text-white/50">Lake Winnipesaukee & Ossipee</div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[10px] text-white/40 uppercase font-bold block">24/7 Mobile Towing & Mechanic</span>
              <div className="text-sm font-bold text-white mt-0.5">(603) 539-7721</div>
              <div className="text-[10px] text-white/50">North Country Auto & Marine</div>
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <span className="text-[10px] text-white/40 uppercase font-bold block">Emergency Veterinary Hospital</span>
              <div className="text-sm font-bold text-white mt-0.5">(603) 447-3773</div>
              <div className="text-[10px] text-white/50">Conway Area Pet Emergency</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
