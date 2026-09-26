'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { 
  Megaphone, 
  Truck, 
  Radio, 
  Smartphone, 
  ChevronRight, 
  X, 
  Sparkles, 
  MapPin, 
  Phone,
  Flame,
  Volume2
} from 'lucide-react';
import { playChimeSound } from '@/lib/push-notifications';

export default function GlobalAnnouncementBanner() {
  const { activeTown, shoutouts } = useNfcStore();
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const liveStreams = shoutouts.filter(s => s.isLiveStream || s.tag === 'stream' || Boolean(s.streamUrl));

  const announcements = [
    {
      id: 'courier-dispatch',
      badge: 'VANGUARD COURIER',
      badgeColor: 'bg-amber-400 text-black',
      icon: <Truck className="w-3.5 h-3.5 text-amber-400" />,
      text: `🚀 Local Delivery & Courier Dispatch is LIVE across ${activeTown?.fullName || 'Carroll County, NH'}! Sean Martin Lead Operator:`,
      highlight: '(603) 986-7104',
      linkText: 'Order Delivery',
      href: '/order',
      isPhone: true,
      phoneNumber: '6039867104'
    },
    {
      id: 'live-stream',
      badge: 'LIVE STREAM WIRE',
      badgeColor: 'bg-red-600 text-white animate-pulse',
      icon: <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />,
      text: liveStreams.length > 0
        ? `🔴 Active Stream: ${liveStreams[0].streamTitle || `${liveStreams[0].authorName} Live Dispatch`}`
        : '🔴 Townraise Community Wire: Watch live artisan streams, courier updates & instant shoutouts.',
      highlight: liveStreams.length > 0 ? `${liveStreams[0].streamViewerCount || 24} Watching` : 'Join Wire',
      linkText: 'Watch Streams',
      href: '/community',
    },
    {
      id: 'pwa-install',
      badge: 'MOBILE HOME APP',
      badgeColor: 'bg-indigo-600 text-white',
      icon: <Smartphone className="w-3.5 h-3.5 text-indigo-400" />,
      text: '📲 Add Townraise to your iPhone or Android Home Screen for instant synthesized order chimes & push alerts.',
      highlight: '100% Free PWA',
      linkText: 'Spread & Install',
      href: '/spread',
    }
  ];

  // Rotate banner message every 9 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (isDismissed) return null;

  const current = announcements[currentIndex];

  return (
    <div className="w-full bg-gradient-to-r from-[#120a02] via-[#090b14] to-[#140608] border-b border-amber-500/20 text-white relative z-40 transition-all">
      {/* Subtle top scanline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500 via-indigo-500 to-red-500 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Badge and rotating message */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1">
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase tracking-wider shrink-0 ${current.badgeColor}`}>
            {current.badge}
          </span>

          <div className="flex items-center gap-1.5 truncate">
            <span className="shrink-0">{current.icon}</span>
            <span className="text-zinc-300 truncate font-medium">
              {current.text}{' '}
              {current.isPhone ? (
                <a 
                  href={`tel:${current.phoneNumber}`} 
                  className="text-amber-400 font-bold hover:underline ml-1"
                >
                  {current.highlight}
                </a>
              ) : (
                <strong className="text-amber-400 font-bold ml-1">{current.highlight}</strong>
              )}
            </span>
          </div>
        </div>

        {/* Right: CTA Link & Dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={current.href}
            onClick={() => playChimeSound('tap')}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-all shadow-sm"
          >
            <span>{current.linkText}</span>
            <ChevronRight className="w-3 h-3" />
          </Link>

          {/* Dismiss Button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
