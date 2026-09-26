'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { ShoutoutPost } from '@/lib/types';
import { playChimeSound } from '@/lib/push-notifications';
import { 
  Radio, Video, Eye, Volume2, VolumeX, Maximize2, 
  Sparkles, ExternalLink, Play, X, Zap, Flame, Heart, MessageSquare, Glasses
} from 'lucide-react';

export default function LiveShoutoutStreamerBar() {
  const { shoutouts, reactToShoutout } = useNfcStore();
  const [activeStreamIndex, setActiveStreamIndex] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [selectedStream, setSelectedStream] = useState<ShoutoutPost | null>(null);

  // Filter shoutouts that have live streams or are stream-tagged
  const liveStreams = shoutouts.filter(s => s.isLiveStream || s.tag === 'stream' || s.streamUrl);
  const recentShoutouts = shoutouts.slice(0, 10);

  // Rotate featured stream if multiple exist
  useEffect(() => {
    if (liveStreams.length <= 1) return;
    const interval = setInterval(() => {
      setActiveStreamIndex((prev) => (prev + 1) % liveStreams.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [liveStreams.length]);

  const currentStream = liveStreams[activeStreamIndex] || null;

  const handleWatchStream = (stream: ShoutoutPost) => {
    setSelectedStream(stream);
    if (isAudioEnabled) {
      playChimeSound('bounty');
    }
  };

  const getEmbedUrl = (url?: string, platform?: string) => {
    if (!url) return null;

    // YouTube URLs
    if (platform === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|watch\?.+&v=))([\w-]{11})/);
      const videoId = match ? match[1] : url.split('v=')[1]?.substring(0, 11);
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
      }
    }

    // Twitch Channel or Video
    if (platform === 'twitch' || url.includes('twitch.tv')) {
      const channel = url.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
      if (channel) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        return `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=true`;
      }
    }

    // Kick Stream
    if (platform === 'kick' || url.includes('kick.com')) {
      const channel = url.split('kick.com/')[1]?.split('/')[0]?.split('?')[0];
      if (channel) {
        return `https://player.kick.com/${channel}`;
      }
    }

    return url;
  };

  return (
    <div className="w-full relative z-30">
      {/* Streamer Broadcast Ticker Bar */}
      <div className="bg-gradient-to-r from-[#0d0714] via-[#120e24] to-[#070b16] border-y border-indigo-500/30 text-white shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Neon scanline accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 via-amber-400 to-indigo-500 animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Live Broadcaster Status Indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider animate-pulse shadow-lg ${
              currentStream?.isMetaGlassesPov
                ? 'bg-purple-600/30 border border-purple-500/50 text-purple-300 shadow-purple-500/20'
                : 'bg-red-600/20 border border-red-500/40 text-red-400 shadow-red-500/20'
            }`}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {currentStream?.isMetaGlassesPov ? <Glasses className="w-3.5 h-3.5 text-purple-300" /> : <Radio className="w-3.5 h-3.5" />}
              <span>{currentStream?.isMetaGlassesPov ? '🕶️ GLASSES POV' : 'LIVE STREAMER'}</span>
            </div>

            {currentStream && (
              <button
                onClick={() => handleWatchStream(currentStream)}
                className="flex items-center gap-2 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-bold text-amber-300 transition-all hover:scale-105"
              >
                <span className="text-base">{currentStream.authorAvatar}</span>
                <span className="truncate max-w-[140px] md:max-w-[200px]">{currentStream.streamTitle || currentStream.authorName}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 text-[9px] font-mono flex items-center gap-1">
                  <Eye className="w-2.5 h-2.5" />
                  {currentStream.streamViewerCount || 24}
                </span>
                <Play className="w-3 h-3 text-red-400 fill-red-400 ml-1" />
              </button>
            )}
          </div>

          {/* Center: Live Marquee Shoutouts Stream */}
          <div className="flex-1 w-full overflow-hidden relative mx-2 hidden sm:block">
            <div className="flex items-center gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
              {recentShoutouts.map((post) => (
                <div 
                  key={post.id} 
                  className="inline-flex items-center gap-2 text-xs text-zinc-300 hover:text-white transition-colors cursor-pointer group"
                  onClick={() => post.isLiveStream ? handleWatchStream(post) : null}
                >
                  <span className="text-sm">{post.authorAvatar}</span>
                  <span className="font-bold text-white group-hover:text-amber-400 transition-colors">
                    {post.authorName}:
                  </span>
                  <span className="text-zinc-400 group-hover:text-zinc-200 truncate max-w-[260px]">
                    {post.content}
                  </span>
                  {post.isLiveStream && (
                    <span className="px-1.5 py-0.2 rounded bg-red-500/30 text-red-300 text-[8px] font-mono uppercase font-black border border-red-500/50">
                      🔴 Stream
                    </span>
                  )}
                  <span className="text-zinc-600 text-[10px]">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sound Control & Quick Links */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const next = !isAudioEnabled;
                setIsAudioEnabled(next);
                if (next) playChimeSound('tap');
              }}
              title={isAudioEnabled ? 'Mute Streamer Audio Pings' : 'Enable Streamer Audio Pings'}
              className={`p-1.5 rounded-xl border transition-all ${
                isAudioEnabled 
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300' 
                  : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <Link
              href="/community"
              className="px-3.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Video className="w-3 h-3 text-indigo-300" />
              <span>Broadcast / Wire</span>
            </Link>
          </div>

        </div>
      </div>

      {/* Embedded Live Stream Video Player Modal */}
      {selectedStream && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#0b0b14] border border-red-500/40 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl space-y-4 p-6 relative">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 font-mono font-black text-[10px] rounded-full uppercase flex items-center gap-1.5 animate-pulse text-white ${
                  selectedStream.isMetaGlassesPov 
                    ? 'bg-purple-600 shadow-md shadow-purple-600/30' 
                    : 'bg-red-600'
                }`}>
                  {selectedStream.isMetaGlassesPov ? <Glasses className="w-3 h-3 text-purple-200" /> : <Radio className="w-3 h-3" />}
                  <span>{selectedStream.isMetaGlassesPov ? '🕶️ META GLASSES POV' : 'LIVE TRANSMISSION'}</span>
                </div>
                <div>
                  <h3 className="text-lg font-black italic text-white uppercase leading-tight">
                    {selectedStream.streamTitle || `${selectedStream.authorName}'s Live Broadcast`}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Host: <strong className="text-amber-400">{selectedStream.authorName}</strong> ({selectedStream.authorHandle}) • {selectedStream.povDeviceName || selectedStream.streamPlatform || 'Oasis Live Stream'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStream(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Display Container */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative group">
              {selectedStream.isMetaGlassesPov && (
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/75 backdrop-blur-md rounded-full border border-purple-500/40 text-[9px] font-mono text-purple-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{selectedStream.povTelemetry?.townNode || selectedStream.town || 'Effingham Hub'} • {selectedStream.povTelemetry?.speedMph || 24} MPH</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-mono text-emerald-300">
                    <span>AWD 4x4</span>
                    <span>•</span>
                    <span>5-MIC 360° AUDIO</span>
                  </div>
                </div>
              )}

              {selectedStream.streamUrl ? (
                (() => {
                  const embedUrl = getEmbedUrl(selectedStream.streamUrl, selectedStream.streamPlatform);
                  if (embedUrl?.includes('youtube') || embedUrl?.includes('twitch') || embedUrl?.includes('kick')) {
                    return (
                      <iframe
                        src={embedUrl}
                        title={selectedStream.streamTitle || 'Townraise Live Stream'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    );
                  }

                  // Direct video / audio URL
                  return (
                    <video
                      src={selectedStream.streamUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  );
                })()
              ) : (
                /* Fallback Stream Simulation Screen */
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950/60 via-[#0a0a14] to-black p-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-3xl animate-bounce">
                    {selectedStream.isMetaGlassesPov ? '🕶️' : '📡'}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black italic uppercase text-white">
                      {selectedStream.authorName} {selectedStream.isMetaGlassesPov ? 'Meta Ray-Ban POV Wire' : 'Vanguard Live Dispatch'}
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-md font-mono">
                      {selectedStream.content}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Townraise POV Broadcast Transmitting Live Telemetry
                  </div>
                </div>
              )}
            </div>

            {/* Stream Footer & Interactions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedStream.authorAvatar}</span>
                <div>
                  <p className="text-xs text-zinc-300 line-clamp-1">{selectedStream.content}</p>
                  <p className="text-[10px] font-mono text-zinc-500">📍 {selectedStream.town || 'Carroll County, NH'}</p>
                </div>
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => reactToShoutout(selectedStream.id, 'voltage')}
                  className="px-3 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 rounded-xl text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{selectedStream.reactions.voltage}</span>
                </button>
                <button
                  onClick={() => reactToShoutout(selectedStream.id, 'fire')}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>{selectedStream.reactions.fire}</span>
                </button>
                <button
                  onClick={() => reactToShoutout(selectedStream.id, 'heart')}
                  className="px-3 py-1.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-xl text-pink-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>{selectedStream.reactions.heart}</span>
                </button>
                <Link
                  href="/community"
                  onClick={() => setSelectedStream(null)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1"
                >
                  <span>Chat Wire</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
