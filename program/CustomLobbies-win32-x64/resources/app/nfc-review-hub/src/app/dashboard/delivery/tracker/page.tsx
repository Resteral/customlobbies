'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryOrder } from '@/lib/types';
import DriverTrackerHUD from '@/components/DriverTrackerHUD';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Truck, ArrowLeft, Navigation, Phone, Compass, 
  MapPin, ShieldCheck, BatteryCharging, Radio, 
  Sparkles, CheckCircle2, ChevronRight, AlertCircle, Volume2
} from 'lucide-react';

export default function DriverCockpitPage() {
  const { 
    deliveryOrders, 
    driverTelemetry, 
    updateOrderStatus, 
    toggleDriverGpsBroadcast,
    playDeliveryChime 
  } = useNfcStore();

  const activeOrders = deliveryOrders.filter(
    o => o.status === 'out_for_delivery' || o.status === 'accepted' || o.status === 'pending'
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeOrders[0]?.id || deliveryOrders[0]?.id || ''
  );

  const currentOrder = deliveryOrders.find(o => o.id === selectedOrderId) || activeOrders[0] || deliveryOrders[0];

  return (
    <div className="min-h-screen bg-[#060609] text-white p-4 md:p-8 space-y-6">
      
      {/* Top Cockpit Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0d14] border border-white/10 rounded-2xl p-4 md:p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/delivery"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-amber-400">
                Oasis Courier Vanguard Cockpit
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h1 className="text-xl md:text-2xl font-black italic tracking-tight uppercase text-white">
              Driver Mission Control
            </h1>
          </div>
        </div>

        {/* Courier Badge & Quick Status */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs">
            <span className="text-lg">🏎️</span>
            <div>
              <p className="font-bold text-white text-[11px]">{driverTelemetry.driverName}</p>
              <p className="text-[9px] font-mono text-zinc-400">{driverTelemetry.vehicle}</p>
            </div>
          </div>

          <button
            onClick={playDeliveryChime}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Test Dispatch Chime"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Chime</span>
          </button>
        </div>
      </div>

      {/* Active Orders Switcher Carousel / Tabs */}
      {activeOrders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Active Assigned Routes ({activeOrders.length})
            </span>
            <span className="text-[9px] font-mono text-amber-400">
              Select order to target navigation
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeOrders.map((order) => {
              const isSelected = order.id === currentOrder?.id;
              return (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl text-left transition-all border ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 shadow-lg shadow-amber-400/10 scale-[1.01]'
                      : 'bg-[#0e0e14] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 animate-pulse' : 'bg-zinc-600'}`} />
                      <span className="text-xs font-black italic text-white">#{order.orderNumber} • {order.customerName}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">{formatCurrency(order.total)}</span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-start gap-1.5 text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="truncate text-[11px]">{order.deliveryAddress}</p>
                    </div>
                    {order.pickupStoreName && (
                      <p className="text-[10px] text-zinc-400 font-mono pl-5">Pickup: {order.pickupStoreName}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Connected HUD */}
      {currentOrder ? (
        <div className="space-y-4">
          <DriverTrackerHUD order={currentOrder} isDriverView={true} />
        </div>
      ) : (
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h2 className="text-xl font-black italic text-white uppercase">All Active Routes Completed</h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No active deliveries in queue. All deliveries have been marked complete and customer alerts dispatched.
          </p>
          <Link
            href="/dashboard/delivery"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-400/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dispatch List</span>
          </Link>
        </div>
      )}

    </div>
  );
}
