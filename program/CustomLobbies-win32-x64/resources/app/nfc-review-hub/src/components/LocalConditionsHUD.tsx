'use client';

import React, { useState } from 'react';
import { 
  CloudSun, 
  Waves, 
  Mountain, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Radio,
  ExternalLink
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function LocalConditionsHUD() {
  const { localConditions } = useNfcStore();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#0e0e14] border-y border-white/5 py-2.5 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Main Status Strip */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          {/* Town Weather */}
          <div className="flex items-center gap-1.5 text-white/80 font-bold">
            <span className="text-base">{localConditions.iconEmoji}</span>
            <span>{localConditions.temperatureF}°F {localConditions.town}</span>
            <span className="text-white/40 font-normal">({localConditions.condition})</span>
          </div>

          <span className="text-white/20 hidden md:inline">•</span>

          {/* Lake Ossipee Water Temp */}
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Waves className="w-3.5 h-3.5" />
            <span>Ossipee Lake: {localConditions.lakeOssipeeTempF}°F</span>
            <span className="text-white/40 font-normal">({localConditions.lakeStatus})</span>
          </div>

          <span className="text-white/20 hidden md:inline">•</span>

          {/* Courier Road Status */}
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>Courier Dispatch: Rapid Flow (Rte 25/16 Clear)</span>
          </div>
        </div>

        {/* Right Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
          >
            <span>{isExpanded ? 'Hide Recreation Radar' : 'View Mountain & Lake Radar'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Expanded Recreation Radar HUD */}
      {isExpanded && (
        <div className="max-w-7xl mx-auto pt-4 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 mt-2.5">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
              <Waves className="w-4 h-4" />
              <span>Ossipee Lake & Waterways</span>
            </div>
            <p className="text-[11px] text-white/60">
              Water temp 71°F. Public ramps open in Freedom & Ossipee. Boat takeout delivery active on water.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
              <Mountain className="w-4 h-4" />
              <span>White Mountains & Trails</span>
            </div>
            <p className="text-[11px] text-white/60">
              {localConditions.mountainForecast}. Foliage tracking node live. Hiking trails dry.
            </p>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Vanguard Driver Fleet</span>
            </div>
            <p className="text-[11px] text-white/60">
              Sean Martin on duty with AWD Outback. Average food delivery ETA: 22 minutes across Carroll County.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
