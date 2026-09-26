'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { DeliveryDriverMember } from '@/lib/types';
import AuthModal from '@/components/AuthModal';
import { 
  Truck, 
  Phone, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CheckCircle2, 
  Car, 
  Flame, 
  ShoppingBag, 
  Wrench, 
  MessageSquare, 
  Clock, 
  Plus, 
  UserCheck, 
  Radio, 
  ArrowRight,
  Filter,
  Sparkles
} from 'lucide-react';

export default function DriversRosterPage() {
  const { 
    deliveryDrivers, 
    currentUser, 
    toggleDriverStatus,
    activeTown
  } = useNfcStore();

  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [dispatchedDriverId, setDispatchedDriverId] = useState<string | null>(null);

  const onlineDrivers = deliveryDrivers.filter(d => d.isOnline && d.status !== 'off_duty');
  const totalCompleted = deliveryDrivers.reduce((acc, d) => acc + d.deliveriesCompleted, 0);

  const filteredDrivers = deliveryDrivers.filter(driver => {
    if (selectedTown !== 'All' && driver.town !== selectedTown && !driver.preferredTowns?.includes(selectedTown)) {
      return false;
    }
    if (filterType === 'online' && (!driver.isOnline || driver.status === 'off_duty')) return false;
    if (filterType === 'food' && !driver.canDeliverFood) return false;
    if (filterType === 'groceries' && !driver.canDeliverGroceries) return false;
    if (filterType === 'hardware' && !driver.canDeliverHardware) return false;
    if (filterType === 'firewood' && !driver.canDeliverFirewood) return false;
    return true;
  });

  const currentLoggedInDriver = currentUser?.isDriver 
    ? deliveryDrivers.find(d => d.id === currentUser.driverMemberId || d.email === currentUser.email || d.phone === currentUser.phone)
    : null;

  const handleQuickDispatch = (driver: DeliveryDriverMember) => {
    setDispatchedDriverId(driver.id);
    setTimeout(() => {
      setDispatchedDriverId(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#131322] via-[#0d0d16] to-[#08080c] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Live Driver Telemetry • {onlineDrivers.length} Active On Duty</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white leading-tight">
              Active Community <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                Delivery Drivers
              </span>
            </h1>

            <p className="text-zinc-300 text-xs md:text-sm font-normal leading-relaxed">
              Real-time directory of verified local drivers in <b>Effingham, Ossipee, Freedom, Wakefield, and Conway</b> equipped with AWD and 4x4 haulers for fast restaurant takeout, Hannaford To Go curbside pickup, hardware tools, and dockside firewood runs.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{currentUser?.isDriver ? 'Manage My Shift' : 'Driver Sign In / Register'}</span>
            </button>

            <Link
              href="/courier"
              className="flex-1 sm:flex-initial px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Book Courier Run</span>
            </Link>
          </div>
        </div>

        {/* Quick Summary Counter Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">🟢 Online Ready</span>
            <span className="text-2xl font-black text-white">{onlineDrivers.length} Drivers</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">📦 Completed Runs</span>
            <span className="text-2xl font-black text-white">{totalCompleted}+</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">⏱️ Avg Response</span>
            <span className="text-2xl font-black text-white">&lt; 15 Mins</span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-3.5">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">🛞 Fleet Capabilities</span>
            <span className="text-2xl font-black text-white">100% AWD/4x4</span>
          </div>
        </div>
      </div>

      {/* Driver Control Deck for Logged-in Driver */}
      {currentLoggedInDriver && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0e1614] to-[#0b100e] border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-3xl">
              {currentLoggedInDriver.avatar || '👑'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Driver Control Deck</span>
                <span className="text-xs text-zinc-400">• Logged In</span>
              </div>
              <h3 className="text-lg font-black text-white">{currentLoggedInDriver.name}</h3>
              <p className="text-xs text-zinc-300 font-mono mt-0.5">
                Vehicle: {currentLoggedInDriver.vehicleName} • Rate: {currentLoggedInDriver.hourlyRateEstimate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => toggleDriverStatus(currentLoggedInDriver.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${
                currentLoggedInDriver.status === 'online_ready'
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black shadow-emerald-500/20'
              }`}
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{currentLoggedInDriver.status === 'online_ready' ? 'Go Off Duty (End Shift)' : 'Go Online & Ready'}</span>
            </button>

            <Link
              href="/driver"
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all flex items-center gap-1.5"
            >
              <span>Driver Radar App</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>
      )}

      {/* Dispatched Notification Toast */}
      {dispatchedDriverId && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>
            Dispatch ping sent! Driver notification relayed via local Carroll County SMS dispatch network.
          </span>
        </div>
      )}

      {/* Town & Capability Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Filter Drivers by Town:</span>
          </div>

          {/* Town Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Effingham', 'Center Ossipee', 'Freedom', 'Wakefield', 'Conway'].map((town) => (
              <button
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTown === town
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {town}
              </button>
            ))}
          </div>
        </div>

        {/* Capability Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mr-2">Specialty:</span>
          {[
            { id: 'all', label: 'All Capabilities' },
            { id: 'online', label: '🟢 Online Only' },
            { id: 'food', label: '🍔 Restaurant Takeout' },
            { id: 'groceries', label: '🛒 Hannaford To Go' },
            { id: 'hardware', label: '🔨 Tools & Hardware' },
            { id: 'firewood', label: '🪵 Dockside Firewood' },
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setFilterType(tag.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono font-medium transition-all ${
                filterType === tag.id
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 border border-white/5'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrivers.map((driver) => {
          const isSeanLead = driver.id === 'driver-sean';
          return (
            <div 
              key={driver.id}
              className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5 ${
                driver.isOnline && driver.status === 'online_ready'
                  ? 'bg-gradient-to-br from-[#101018] to-[#0c0c12] border-emerald-500/30 hover:border-emerald-400 shadow-xl'
                  : driver.status === 'on_delivery'
                  ? 'bg-gradient-to-br from-[#101018] to-[#0c0c12] border-amber-500/30 hover:border-amber-400 shadow-lg'
                  : 'bg-[#0a0a0e] border-white/5 opacity-75'
              }`}
            >
              {/* Top Row: Avatar, Name, Status Badge */}
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-inner relative">
                      {driver.avatar}
                      {driver.isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0e0e14] animate-pulse"></span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white tracking-tight">{driver.name}</h3>
                        {isSeanLead && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-mono font-bold uppercase">
                            Lead Vanguard
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>Based in {driver.town}, {driver.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1.5 ${
                      driver.status === 'online_ready'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : driver.status === 'on_delivery'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        driver.status === 'online_ready' ? 'bg-emerald-400 animate-ping' : driver.status === 'on_delivery' ? 'bg-amber-400' : 'bg-zinc-500'
                      }`}></span>
                      {driver.status === 'online_ready' ? 'Online & Ready' : driver.status === 'on_delivery' ? 'On Active Run' : 'Off Duty'}
                    </span>
                    {driver.activeShiftStart && (
                      <p className="text-[10px] font-mono text-zinc-400 mt-1">
                        Shift: {driver.activeShiftStart}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vehicle Specs & Location */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-200">
                    <span className="flex items-center gap-1.5 text-zinc-400">
                      <Car className="w-3.5 h-3.5 text-amber-400" />
                      <span>Vehicle:</span>
                    </span>
                    <span className="font-bold text-white text-right">{driver.vehicleName}</span>
                  </div>
                  {driver.currentLocation && (
                    <div className="flex items-center justify-between text-zinc-300 text-[11px]">
                      <span className="text-zinc-400">Current Radar:</span>
                      <span className="text-emerald-400 font-bold">{driver.currentLocation}</span>
                    </div>
                  )}
                  {driver.hourlyRateEstimate && (
                    <div className="flex items-center justify-between text-zinc-300 text-[11px]">
                      <span className="text-zinc-400">Base Flat Rate:</span>
                      <span className="text-amber-400 font-bold">{driver.hourlyRateEstimate}</span>
                    </div>
                  )}
                </div>

                {/* Specialties Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Verified Specialties:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {driver.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-zinc-300 text-[10px] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating & Stats Strip */}
                <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{driver.rating.toFixed(1)}</span>
                    <span className="text-zinc-400 font-normal">({driver.reviewsCount} reviews)</span>
                  </div>
                  <div className="text-zinc-400">
                    <span className="text-white font-bold">{driver.deliveriesCompleted}</span> deliveries
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap sm:flex-nowrap items-center gap-2">
                <a
                  href={`tel:${driver.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 py-3 bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call {driver.phone}</span>
                </a>

                <button
                  onClick={() => handleQuickDispatch(driver)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Dispatch Request</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Become a Driver Join Box */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#0e0e1a] to-[#0a0a10] border border-indigo-500/30 p-8 md:p-10 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
              Earn Locally • Keep 100% of Tips
            </span>
            <h3 className="text-2xl md:text-3xl font-black italic text-white uppercase">
              Drive for Carroll County Community Hub
            </h3>
            <p className="text-xs md:text-sm text-zinc-300 font-light leading-relaxed">
              Have an AWD Subaru, 4x4 pickup, or reliable local vehicle? Earn flat-rate dispatch fares plus direct tips taking hot meals from PNB Eats, grocery orders from Hannaford, tools from Ace Hardware, and firewood to lakefront cabins.
            </p>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-6 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Register as a Driver</span>
          </button>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
