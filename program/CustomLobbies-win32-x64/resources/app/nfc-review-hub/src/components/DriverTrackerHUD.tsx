'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryOrder, DriverTelemetry } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { 
  Truck, Navigation, MapPin, Store, Phone, 
  MessageSquare, Compass, Gauge, BatteryCharging, 
  Radio, CheckCircle2, Sparkles, ExternalLink, 
  Volume2, ShieldCheck, Clock, RefreshCw, AlertCircle
} from 'lucide-react';

interface DriverTrackerHUDProps {
  order?: DeliveryOrder;
  isDriverView?: boolean; // True when viewed by driver in dashboard, false when viewed by customer
  className?: string;
}

export default function DriverTrackerHUD({
  order,
  isDriverView = false,
  className = '',
}: DriverTrackerHUDProps) {
  const { 
    driverTelemetry, 
    updateDriverTelemetry, 
    toggleDriverGpsBroadcast, 
    syncDeviceGeolocation, 
    updateOrderStatus,
    playDeliveryChime 
  } = useNfcStore();

  const [deviceGpsError, setDeviceGpsError] = useState<string | null>(null);
  const [isWatchingGps, setIsWatchingGps] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // Simulated GPS Progress for map animation
  const [gpsRouteProgress, setGpsRouteProgress] = useState(45);

  useEffect(() => {
    if (!order) {
      setGpsRouteProgress(50);
      return;
    }
    if (order.status === 'pending') {
      setGpsRouteProgress(15);
    } else if (order.status === 'accepted') {
      setGpsRouteProgress(40);
    } else if (order.status === 'out_for_delivery') {
      setGpsRouteProgress(75);
    } else if (order.status === 'delivered') {
      setGpsRouteProgress(100);
    }
  }, [order?.status]);

  // Handle Real Device Geolocation Tracking
  const toggleDeviceLocationWatcher = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setDeviceGpsError('Geolocation is not supported by your browser.');
      return;
    }

    if (isWatchingGps) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsWatchingGps(false);
      updateDriverTelemetry({ deviceTrackingActive: false });
    } else {
      setDeviceGpsError(null);
      setIsWatchingGps(true);

      const id = navigator.geolocation.watchPosition(
        (position) => {
          const speedMph = position.coords.speed !== null ? Math.round(position.coords.speed * 2.23694) : 28;
          const heading = position.coords.heading !== null ? Math.round(position.coords.heading) : 42;
          syncDeviceGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            speedMph,
            heading,
            altitude: position.coords.altitude || undefined,
          });
        },
        (error) => {
          console.warn('Device GPS Watch Error:', error);
          setDeviceGpsError(error.message || 'GPS Signal Lost');
          setIsWatchingGps(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );
      watchIdRef.current = id;
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const handleAdvanceStatus = (nextStatus: DeliveryOrder['status']) => {
    if (!order) return;
    updateOrderStatus(order.id, nextStatus);
    playDeliveryChime();

    if (nextStatus === 'out_for_delivery') {
      updateDriverTelemetry({ status: 'in_transit' });
    } else if (nextStatus === 'delivered') {
      updateDriverTelemetry({ status: 'available' });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  const storeLocationName = order?.pickupStoreName || order?.restaurantName || 'Oasis Central Hub';
  const destinationAddress = order?.deliveryAddress || 'Carroll County, NH';

  // Navigation Links
  const googleNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;
  const appleNavUrl = `https://maps.apple.com/?daddr=${encodeURIComponent(destinationAddress)}`;
  const wazeNavUrl = `https://waze.com/ul?q=${encodeURIComponent(destinationAddress)}`;

  // SMS Quick Templates
  const smsEnRoute = `sms:${order?.customerPhone || '5085070305'}?body=${encodeURIComponent(
    `Hi ${order?.customerName || 'there'}! Sean Martin here from Oasis Courier. I've picked up your order from ${storeLocationName} and am heading to your address now!`
  )}`;
  const smsArriving = `sms:${order?.customerPhone || '5085070305'}?body=${encodeURIComponent(
    `Hi ${order?.customerName || 'there'}! I'm about 3-5 minutes away with your delivery.`
  )}`;
  const smsDelivered = `sms:${order?.customerPhone || '5085070305'}?body=${encodeURIComponent(
    `Hi ${order?.customerName || 'there'}! Your delivery from ${storeLocationName} has arrived at your door. Thank you for supporting local NH business!`
  )}`;

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 1. TOP TELEMETRY HUD BAR */}
      <div className="p-4 md:p-6 bg-gradient-to-r from-[#0d0f17] via-[#090b10] to-[#0d0f17] border border-amber-400/20 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Driver ID & Vehicle */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-xl">
                {driverTelemetry.avatar}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white">{driverTelemetry.driverName}</span>
                <span className="px-2 py-0.5 bg-amber-400/20 border border-amber-400/30 text-amber-400 text-[9px] font-mono font-bold uppercase rounded-full">
                  Lead Courier
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {driverTelemetry.isBroadcastingGps ? 'GPS Broadcast Live' : 'GPS Standby'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                {driverTelemetry.vehicle} • {driverTelemetry.rating} ★ ({driverTelemetry.totalDeliveries}+ runs)
              </p>
            </div>
          </div>

          {/* Telemetry Gauge Strip */}
          <div className="grid grid-cols-4 gap-3 text-center font-mono w-full md:w-auto">
            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[8px] uppercase text-zinc-500 block flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-amber-400" /> Speed
              </span>
              <span className="text-xs font-black text-white">{driverTelemetry.speedMph} <span className="text-[9px] text-zinc-400">mph</span></span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[8px] uppercase text-zinc-500 block flex items-center justify-center gap-1">
                <Compass className="w-3 h-3 text-indigo-400" /> Heading
              </span>
              <span className="text-xs font-black text-white">{driverTelemetry.heading}° <span className="text-[9px] text-zinc-400">NE</span></span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[8px] uppercase text-zinc-500 block flex items-center justify-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-400" /> Batt
              </span>
              <span className="text-xs font-black text-emerald-400">{driverTelemetry.batteryPercent}%</span>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <span className="text-[8px] uppercase text-zinc-500 block flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> ETA
              </span>
              <span className="text-xs font-black text-amber-400">
                {order?.status === 'delivered' ? '0m' : order?.status === 'out_for_delivery' ? '6-10m' : '15-25m'}
              </span>
            </div>
          </div>

        </div>

        {/* Live Road Tracker Banner */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Active Corridor: <strong className="text-white">{driverTelemetry.currentRoad}</strong></span>
          </div>
          <div className="text-[10px] text-zinc-500">
            GPS Lat: {driverTelemetry.latitude.toFixed(4)} • Lng: {driverTelemetry.longitude.toFixed(4)}
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE SATELLITE RADAR ROUTE MAP */}
      <div className="relative h-72 md:h-80 w-full bg-[#070a12] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Radar grid styling */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:28px_28px]" />
        
        {/* Ambient Map Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Simulated Road Polyline */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d="M 70 210 Q 220 50 450 150 T 800 90"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M 70 210 Q 220 50 450 150 T 800 90"
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            strokeDasharray="8 6"
            className="animate-pulse"
          />
        </svg>

        {/* Waypoint 1: Store / Pickup Location */}
        <div className="absolute left-8 bottom-10 flex flex-col items-center gap-1.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/50 border border-indigo-400">
            <Store className="w-6 h-6" />
          </div>
          <div className="bg-black/90 px-3 py-1 rounded-xl text-center border border-indigo-500/40 shadow-lg">
            <p className="text-[8px] font-mono uppercase text-indigo-300 font-bold">Origin / Store</p>
            <p className="text-[10px] font-black text-white max-w-[120px] truncate">{storeLocationName}</p>
          </div>
        </div>

        {/* Waypoint 2: Live Courier Vehicle Pin with Dynamic Motion */}
        <div 
          className="absolute transition-all duration-1000 ease-out flex flex-col items-center gap-1.5 z-20"
          style={{
            left: `${Math.min(84, Math.max(16, gpsRouteProgress))}%`,
            top: `${Math.sin(gpsRouteProgress / 14) * 35 + 110}px`,
          }}
        >
          <div className="relative">
            <span className="absolute -inset-3 bg-amber-400/40 rounded-full animate-ping pointer-events-none" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-black flex items-center justify-center shadow-2xl shadow-amber-500/70 border-2 border-amber-200">
              <Truck className="w-7 h-7" />
            </div>
          </div>
          <div className="bg-black/95 px-3 py-1 rounded-xl text-center border border-amber-400/50 shadow-2xl whitespace-nowrap">
            <p className="text-[8px] font-mono uppercase text-amber-300 font-black">● LIVE DRIVER RADAR</p>
            <p className="text-[10px] font-black text-white">{driverTelemetry.driverName} • {driverTelemetry.speedMph} mph</p>
          </div>
        </div>

        {/* Waypoint 3: Customer Dropoff Destination */}
        <div className="absolute right-8 top-10 flex flex-col items-center gap-1.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-2xl shadow-emerald-500/50 border border-emerald-300">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="bg-black/90 px-3 py-1 rounded-xl text-center border border-emerald-500/40 shadow-lg">
            <p className="text-[8px] font-mono uppercase text-emerald-400 font-bold">Customer Doorstep</p>
            <p className="text-[10px] font-black text-white max-w-[120px] truncate">{order?.customerName || 'Destination'}</p>
          </div>
        </div>

      </div>

      {/* 3. DRIVER COMMAND CONTROLS & NAVIGATION (Shown for drivers & dispatchers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Navigation Launchpad */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click External Turn-by-Turn GPS</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-500">Google / Apple / Waze</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href={googleNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 hover:border-amber-400/40"
            >
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </a>

            <a
              href={appleNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 hover:border-indigo-400/40"
            >
              <span>Apple Maps</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>

            <a
              href={wazeNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 hover:border-emerald-400/40"
            >
              <span>Waze GPS</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          </div>

          {/* Real Phone Geolocation Syncer */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={toggleDeviceLocationWatcher}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                isWatchingGps
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isWatchingGps ? 'animate-pulse text-emerald-400' : 'text-zinc-500'}`} />
              <span>{isWatchingGps ? 'Syncing Mobile Phone GPS...' : 'Use Mobile Device GPS'}</span>
            </button>

            <button
              type="button"
              onClick={toggleDriverGpsBroadcast}
              className="text-[10px] font-mono text-zinc-400 hover:text-white underline"
            >
              {driverTelemetry.isBroadcastingGps ? 'Pause Broadcast' : 'Resume Broadcast'}
            </button>
          </div>
          {deviceGpsError && (
            <p className="text-[10px] font-mono text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {deviceGpsError}
            </p>
          )}
        </div>

        {/* One-Touch Customer SMS Templates */}
        <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>1-Tap Customer SMS Dispatch</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-500">Auto-formatted</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <a
              href={smsEnRoute}
              className="py-2.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 rounded-xl text-center text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1"
            >
              <span>🚗 "En Route"</span>
            </a>

            <a
              href={smsArriving}
              className="py-2.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 rounded-xl text-center text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1"
            >
              <span>⚡ "5 Mins Away"</span>
            </a>

            <a
              href={smsDelivered}
              className="py-2.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 rounded-xl text-center text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1"
            >
              <span>📦 "At Door"</span>
            </a>
          </div>

          {/* Quick Call Button */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <a
              href={`tel:${order?.customerPhone || '5085070305'}`}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>Direct Call Customer ({order?.customerPhone || 'Phone'})</span>
            </a>
          </div>
        </div>

      </div>

      {/* 4. DRIVER STEP-BY-STEP ORDER ADVANCER (When an active order is selected) */}
      {order && isDriverView && (
        <div className="p-5 rounded-3xl bg-amber-400/[0.04] border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Active Courier Action</span>
            <p className="text-xs font-bold text-white">
              Order #{order.orderNumber} for {order.customerName} ({order.status.replace(/_/g, ' ')})
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {order.status === 'pending' && (
              <button
                onClick={() => handleAdvanceStatus('accepted')}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Accept & Start Pickup
              </button>
            )}

            {(order.status === 'pending' || order.status === 'accepted') && (
              <button
                onClick={() => handleAdvanceStatus('out_for_delivery')}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
              >
                Order Picked Up • Start Delivery
              </button>
            )}

            {order.status === 'out_for_delivery' && (
              <button
                onClick={() => handleAdvanceStatus('delivered')}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Delivered at Door</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
