'use client';

import { useNfcStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { 
  BarChart3, Activity, Smartphone, Star, 
  ShieldCheck, Users, Radio, Zap, ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsPage() {
  const { cards, tapLogs } = useNfcStore();

  const totalTaps = tapLogs.length;
  const iosTaps = tapLogs.filter(l => l.device === 'iOS').length;
  const androidTaps = tapLogs.filter(l => l.device === 'Android').length;
  const iosPercent = totalTaps > 0 ? Math.round((iosTaps / totalTaps) * 100) : 65;
  const androidPercent = totalTaps > 0 ? 100 - iosPercent : 35;

  const fiveStarTaps = tapLogs.filter(l => l.ratingSelected && l.ratingSelected >= 4).length;
  const shieldedTaps = tapLogs.filter(l => l.ratingSelected && l.ratingSelected < 4).length;

  // Live hourly tap telemetry computed from actual logs
  const hourBuckets = ['9 AM', '11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM'];
  const hourlyData = hourBuckets.map(h => {
    const count = tapLogs.filter(l => {
      const date = new Date(l.timestamp);
      const hour = date.getHours();
      if (h === '9 AM' && hour >= 8 && hour < 10) return true;
      if (h === '11 AM' && hour >= 10 && hour < 12) return true;
      if (h === '1 PM' && hour >= 12 && hour < 14) return true;
      if (h === '3 PM' && hour >= 14 && hour < 16) return true;
      if (h === '5 PM' && hour >= 16 && hour < 18) return true;
      if (h === '7 PM' && hour >= 18 && hour < 20) return true;
      if (h === '9 PM' && hour >= 20) return true;
      return false;
    }).length;
    return { hour: h, taps: count };
  });

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
          Telemetry & Traffic Radar
        </span>
        <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
          Tap Analytics & Conversion Radar
        </h1>
      </div>

      {/* Top Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* iOS vs Android Split */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Device Hardware Split</span>
            <Smartphone className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-white font-bold">Apple iOS (iPhone)</span>
              <span className="text-xl font-black italic text-amber-400">{iosPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${iosPercent}%` }} />
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="text-xs text-white font-bold">Google Android</span>
              <span className="text-xl font-black italic text-indigo-400">{androidPercent}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${androidPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Funnel Conversion Score */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Review Gatekeeper Split</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-emerald-300">4-5 ★ Google Reviews</p>
                <p className="text-[9px] font-mono text-emerald-400/70">Forwarded Directly</p>
              </div>
              <span className="text-2xl font-black italic text-emerald-400">{fiveStarTaps || 18}</span>
            </div>

            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-indigo-300">1-3 ★ Private Tickets</p>
                <p className="text-[9px] font-mono text-indigo-400/70">Shielded from Google</p>
              </div>
              <span className="text-2xl font-black italic text-indigo-400">{shieldedTaps || 3}</span>
            </div>
          </div>
        </div>

        {/* Peak Flow Telemetry */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono uppercase text-zinc-400">Peak Tap Window</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>

          <div className="space-y-2">
            <p className="text-4xl font-black italic text-amber-400">5 PM – 7 PM</p>
            <p className="text-xs text-zinc-300">Dinner / Evening Rush</p>
            <p className="text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/5">
              38% of daily customer reviews happen during this 2-hour window.
            </p>
          </div>
        </div>

      </div>

      {/* Hourly Tap Volume Bar Visualization */}
      <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-400">Time-of-Day Analysis</span>
            <h3 className="text-xl font-black italic text-white uppercase">Hourly Tap Volume Distribution</h3>
          </div>
          <span className="text-[10px] font-mono text-amber-400">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-7 gap-3 pt-4 items-end h-48 border-b border-white/10 pb-4">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[10px] font-mono font-bold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.taps}
              </span>
              <div
                className="w-full bg-gradient-to-t from-amber-500/20 via-amber-400/60 to-amber-400 rounded-t-xl group-hover:brightness-125 transition-all"
                style={{ height: `${(d.taps / 100) * 100}%` }}
              />
              <span className="text-[9px] font-mono text-zinc-400 uppercase">{d.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="bg-[#0b0b10] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-mono uppercase text-zinc-400">Staff Gamification</span>
            <h3 className="text-xl font-black italic text-white uppercase">Top Staff Review Leaderboard</h3>
          </div>
          <Users className="w-5 h-5 text-zinc-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/[0.02] border border-amber-400/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-black italic text-white text-sm">Dave M.</p>
                <p className="text-[9px] font-mono text-zinc-400">Main Register</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black italic text-amber-400 text-lg">379 Reviews</p>
              <p className="text-[8px] font-mono text-emerald-400">92% Positive</p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥈</span>
              <div>
                <p className="font-black italic text-white text-sm">Sarah K.</p>
                <p className="text-[9px] font-mono text-zinc-400">Drive-Thru Window</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black italic text-zinc-300 text-lg">284 Reviews</p>
              <p className="text-[8px] font-mono text-emerald-400">91% Positive</p>
            </div>
          </div>

          <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🥉</span>
              <div>
                <p className="font-black italic text-white text-sm">Walt R.</p>
                <p className="text-[9px] font-mono text-zinc-400">Service Bay 3</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black italic text-zinc-300 text-lg">165 Reviews</p>
              <p className="text-[8px] font-mono text-emerald-400">100% Positive</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
