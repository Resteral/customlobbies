'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryOrder } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import DriverTrackerHUD from '@/components/DriverTrackerHUD';
import { 
  Truck, Phone, MapPin, Navigation, CheckCircle2, 
  Clock, AlertCircle, Sparkles, ExternalLink, ArrowRight, ShieldCheck, Compass, Radio 
} from 'lucide-react';

export default function DeliveryDispatchPage() {
  const { deliveryOrders, updateOrderStatus, notificationSettings, driverTelemetry } = useNfcStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = deliveryOrders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const pendingCount = deliveryOrders.filter(o => o.status === 'pending').length;
  const activeDeliveryCount = deliveryOrders.filter(o => o.status === 'accepted' || o.status === 'out_for_delivery').length;
  const totalTips = deliveryOrders.reduce((sum, o) => sum + (o.tip || 0), 0);
  const totalRevenue = deliveryOrders.reduce((sum, o) => sum + o.total, 0);

  // Active in-transit order for driver HUD
  const activeOrder = deliveryOrders.find(o => o.status === 'out_for_delivery') 
    || deliveryOrders.find(o => o.status === 'accepted') 
    || deliveryOrders.find(o => o.status === 'pending')
    || deliveryOrders[0];

  const getStatusBadge = (status: DeliveryOrder['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/30 rounded-full text-[9px] font-mono font-bold uppercase animate-pulse">● Pending Dispatch</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/30 rounded-full text-[9px] font-mono font-bold uppercase">● Accepted / Packing</span>;
      case 'out_for_delivery':
        return <span className="px-3 py-1 bg-indigo-400/10 text-indigo-400 border border-indigo-400/30 rounded-full text-[9px] font-mono font-bold uppercase animate-pulse">● In Transit</span>;
      case 'delivered':
        return <span className="px-3 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 rounded-full text-[9px] font-mono font-bold uppercase">✓ Delivered</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-400/10 text-red-400 border border-red-400/30 rounded-full text-[9px] font-mono font-bold uppercase">✕ Cancelled</span>;
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
              Live GPS Driver Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
            Delivery Dispatch Radar
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/dashboard/delivery/tracker"
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 animate-spin" />
            <span>Driver GPS Cockpit 🛰️</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-amber-400" />
            <span>SMS Relays: {notificationSettings.phoneNumber || 'Active'}</span>
          </Link>
          <Link
            href="/eats"
            target="_blank"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Oasis Eats Grid 🍔</span>
          </Link>
        </div>
      </div>

      {/* Live Driver Telemetry & Radar Cockpit HUD */}
      {activeOrder && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Active Courier Telemetry & Navigation Cockpit</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Driver: {driverTelemetry.driverName} • {driverTelemetry.vehicle}
            </span>
          </div>
          <DriverTrackerHUD order={activeOrder} isDriverView={true} />
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Pending Orders</span>
          <p className="text-4xl font-black italic text-amber-400">{pendingCount}</p>
          <p className="text-[9px] font-mono text-zinc-500">Requires driver pickup</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Active In-Transit</span>
          <p className="text-4xl font-black italic text-indigo-400">{activeDeliveryCount}</p>
          <p className="text-[9px] font-mono text-zinc-500">On the road now</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Driver Tips Collected</span>
          <p className="text-4xl font-black italic text-emerald-400">{formatCurrency(totalTips)}</p>
          <p className="text-[9px] font-mono text-emerald-300">100% to courier</p>
        </div>

        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-2">
          <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">Total Delivery Volume</span>
          <p className="text-4xl font-black italic text-white">{formatCurrency(totalRevenue)}</p>
          <p className="text-[9px] font-mono text-zinc-500">{deliveryOrders.length} orders total</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['all', 'pending', 'accepted', 'out_for_delivery', 'delivered'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              filterStatus === st
                ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center text-zinc-500 font-mono text-xs">
            No delivery orders found under this status.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`;
            return (
              <div
                key={order.id}
                className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 hover:border-amber-400/30 transition-all shadow-xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-black">
                      #{order.orderNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black italic text-white text-lg">{order.customerName}</h3>
                        {order.serviceType && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-mono font-bold uppercase">
                            {order.serviceType === 'store_pickup' ? '📦 Pre-Paid Pickup' : order.serviceType === 'prepaid_buy' ? '🛒 Prepaid Buy & Deliver' : '⚡ Custom Errand'}
                          </span>
                        )}
                        {order.paymentMethod && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
                            Paid via {order.paymentMethod === 'cash_app' ? 'Cash App' : order.paymentMethod === 'venmo' ? 'Venmo' : order.paymentMethod === 'zelle' ? 'Zelle' : order.paymentMethod === 'card' ? 'Card' : 'COD'}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400">Ordered at {formatDate(order.createdAt)} • Town: {order.town || 'Effingham'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-xl font-black italic text-amber-400">{formatCurrency(order.total)}</span>
                  </div>
                </div>

                {/* Pickup Store Info if available */}
                {(order.pickupStoreName || order.restaurantName) && (
                  <div className="p-3.5 rounded-2xl bg-amber-400/[0.04] border border-amber-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🏪</span>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-amber-400 font-bold">Pickup Merchant</span>
                        <p className="font-black text-white">{order.pickupStoreName || order.restaurantName}</p>
                        {order.pickupStoreAddress && (
                          <p className="text-[10px] text-zinc-400 font-mono">{order.pickupStoreAddress}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.pickupOrderCode && (
                        <span className="px-3 py-1 bg-black/60 border border-white/10 rounded-xl text-xs font-mono font-bold text-amber-400">
                          Code: {order.pickupOrderCode}
                        </span>
                      )}
                      {order.pickupStoreAddress && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.pickupStoreName} ${order.pickupStoreAddress}`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-amber-400 text-black font-bold text-[10px] uppercase rounded-xl hover:bg-amber-300 transition-colors flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>GPS Store</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Payment Reference & Note */}
                {order.paymentReference && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono flex items-center gap-2 text-zinc-300">
                    <span className="text-emerald-400 font-bold">💳 Customer Payment Note:</span>
                    <span className="text-white bg-black/40 px-2 py-0.5 rounded border border-white/5">{order.paymentReference}</span>
                  </div>
                )}

                {/* Customer Address & Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address & Instructions */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Delivery Address</span>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-white leading-snug">{order.deliveryAddress}</p>
                        {order.deliveryInstructions && (
                          <p className="text-[11px] text-zinc-400 pt-1 italic bg-black/40 p-2 rounded-lg border border-white/5 mt-1">
                            "{order.deliveryInstructions}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Phone & 1-Click Navigation */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono uppercase text-zinc-500">Driver 1-Click Shortcuts</span>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-400" />
                        <span>Call Customer ({order.customerPhone})</span>
                      </a>

                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Open in Google Maps GPS</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Itemized Order List */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-zinc-400 text-[10px] uppercase font-bold border-b border-white/5 pb-1">
                    <span>Item</span>
                    <span>Price</span>
                  </div>
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-zinc-200">
                      <span>{it.quantity}x {it.name}</span>
                      <span>{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-white/5 flex justify-between text-zinc-400 text-[11px]">
                    <span>Driver Tip Included:</span>
                    <span className="text-amber-400 font-bold">{formatCurrency(order.tip)}</span>
                  </div>
                </div>

                {/* Status Action Buttons */}
                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[9px] font-mono text-zinc-500">
                    STATUS CONTROLLER:
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                      >
                        Accept Order & Begin Prep
                      </button>
                    )}

                    {(order.status === 'pending' || order.status === 'accepted') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Mark Out for Delivery</span>
                      </button>
                    )}

                    {order.status === 'out_for_delivery' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Delivered ✓</span>
                      </button>
                    )}

                    <Link
                      href={`/order/${order.id}`}
                      target="_blank"
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl text-xs transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Customer Tracking View</span>
                    </Link>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
