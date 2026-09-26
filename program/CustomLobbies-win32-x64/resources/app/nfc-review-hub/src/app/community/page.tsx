'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { ShoutoutPost } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';
import LiveShoutoutStreamerBar from '@/components/LiveShoutoutStreamerBar';
import { 
  Radio, Sparkles, MessageSquare, Flame, Zap, Heart, 
  Send, Plus, ShoppingBag, Truck, Star, ArrowRight, ShieldCheck, 
  User, UserCheck, CheckCircle2, Video, Eye, Play, Volume2, Maximize2, Glasses
} from 'lucide-react';
import MetaGlassesLiveStreamModal from '@/components/MetaGlassesLiveStreamModal';

export default function CommunityFeedPage() {
  const { shoutouts, sellers, addShoutout, reactToShoutout, currentUser } = useNfcStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Post Form State
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<ShoutoutPost['tag']>('news');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccessNotice, setPostSuccessNotice] = useState(false);

  // Live Streamer Broadcast State
  const [isLiveStream, setIsLiveStream] = useState(false);
  const [streamPlatform, setStreamPlatform] = useState<'youtube' | 'twitch' | 'kick' | 'custom' | 'audio' | 'meta_glasses' | 'instagram' | 'facebook'>('meta_glasses');
  const [streamUrl, setStreamUrl] = useState('');
  const [streamTitle, setStreamTitle] = useState('');
  const [isMetaGlassesModalOpen, setIsMetaGlassesModalOpen] = useState(false);

  const liveStreamsCount = shoutouts.filter(s => s.isLiveStream || s.tag === 'stream' || s.streamUrl).length;

  const tags = [
    { id: 'all', label: 'All Stream', icon: '✨', count: shoutouts.length },
    { id: 'stream', label: '🔴 Live Streams', icon: '📡', count: liveStreamsCount },
    { id: 'drop', label: 'Fresh Drops', icon: '🛍️' },
    { id: 'review', label: '5★ Spotlights', icon: '⭐' },
    { id: 'courier', label: 'Courier Radar', icon: '🚐' },
    { id: 'deal', label: 'Flash Deals', icon: '🔥' },
    { id: 'news', label: 'Community News', icon: '📢' },
  ];

  const filteredShoutouts = shoutouts.filter(s => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'stream') return s.tag === 'stream' || s.isLiveStream || Boolean(s.streamUrl);
    return s.tag === activeFilter;
  });

  const getEmbedUrl = (url?: string, platform?: string) => {
    if (!url) return null;

    if (platform === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|live\/|watch\?.+&v=))([\w-]{11})/);
      const videoId = match ? match[1] : url.split('v=')[1]?.substring(0, 11);
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`;
      }
    }

    if (platform === 'twitch' || url.includes('twitch.tv')) {
      const channel = url.split('twitch.tv/')[1]?.split('/')[0]?.split('?')[0];
      if (channel) {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
        return `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=false`;
      }
    }

    if (platform === 'kick' || url.includes('kick.com')) {
      const channel = url.split('kick.com/')[1]?.split('/')[0]?.split('?')[0];
      if (channel) {
        return `https://player.kick.com/${channel}`;
      }
    }

    return url;
  };

  const handlePostShoutout = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = authorName.trim() || currentUser?.name || 'Local Resident';
    if (!content.trim() && !isLiveStream) return;

    const finalAvatar = currentUser?.avatar || (isLiveStream ? '📡' : selectedTag === 'drop' ? '🛍️' : selectedTag === 'review' ? '⭐' : selectedTag === 'courier' ? '🚐' : '✨');
    const finalBadge = currentUser?.badge || (isLiveStream ? 'Verified Live Streamer' : currentUser?.role === 'driver' ? 'Verified Courier Driver' : currentUser?.role === 'merchant' ? 'Shop Owner' : currentUser?.role === 'contractor' ? 'Master Contractor' : 'Community Member');

    addShoutout({
      authorName: finalAuthor,
      authorHandle: `@${finalAuthor.toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: finalAvatar,
      authorBadge: finalBadge,
      content: content.trim() || (isLiveStream ? `🔴 Started a live broadcast: ${streamTitle || 'Local Live Stream'}` : ''),
      tag: isLiveStream ? 'stream' : selectedTag,
      town: currentUser?.town || 'Effingham',
      isLiveStream: isLiveStream,
      streamPlatform: isLiveStream ? streamPlatform : undefined,
      streamUrl: isLiveStream && streamUrl.trim() ? streamUrl.trim() : undefined,
      streamTitle: isLiveStream && streamTitle.trim() ? streamTitle.trim() : undefined,
      streamViewerCount: isLiveStream ? Math.floor(Math.random() * 20) + 12 : undefined,
      streamStartedAt: isLiveStream ? new Date().toISOString() : undefined,
    });

    setContent('');
    setStreamUrl('');
    setStreamTitle('');
    setIsLiveStream(false);
    setIsPosting(false);
    setPostSuccessNotice(true);
    setTimeout(() => setPostSuccessNotice(false), 3500);
  };

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Background cyber lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/10 blur-[160px] pointer-events-none -z-10" />

      {/* Real-Time Streamer Marquee Ticker */}
      <div className="mb-8">
        <LiveShoutoutStreamerBar />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Live Social Pulse & Streamer Broadcast Wire</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              Community <span className="text-indigo-400">Shoutouts & Streams.</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-400 max-w-xl">
              Real-time feed of live artisan streams, courier radar alerts, verified 5-star customer reviews, and local merchant drops across the Oasis network.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsMetaGlassesModalOpen(true)}
              className="px-6 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-600/30 flex items-center gap-2 border border-purple-400/30 animate-pulse"
            >
              <Glasses className="w-4 h-4 text-purple-200" />
              <span>🕶️ Meta Glasses POV</span>
            </button>
            <button
              onClick={() => {
                if (currentUser) setAuthorName(currentUser.name);
                setIsLiveStream(true);
                setIsPosting(true);
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-500/30 flex items-center gap-2"
            >
              <Video className="w-4 h-4 animate-pulse" />
              <span>Go Live / Stream</span>
            </button>
            <button
              onClick={() => {
                if (currentUser) setAuthorName(currentUser.name);
                setIsLiveStream(false);
                setIsPosting(true);
              }}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Broadcast Shoutout</span>
            </button>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-5 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{currentUser ? `Account: ${currentUser.name.split(' ')[0]}` : 'Sign In / Switch'}</span>
            </button>
            <Link
              href="/sell"
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>List Item for Sale</span>
            </Link>
          </div>
        </div>

        {/* Active Poster Account Banner */}
        <div className="p-4 md:p-5 rounded-3xl bg-[#0b0b12] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-2xl shadow-inner">
              {currentUser?.avatar || '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  Posting as: <strong className="text-amber-400">{currentUser ? currentUser.name : 'Guest User'}</strong>
                </span>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                    {currentUser.role}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                {currentUser ? `📍 Verified Member from ${currentUser.town}, NH • ${currentUser.badge || 'Community Member'}` : 'Log in or pick a role to attach your verified identity & badge to your posts and streams.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-amber-400 hover:text-amber-300 rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>{currentUser ? 'Switch Poster Account' : 'Log In to Post'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Success Notice */}
        {postSuccessNotice && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Your shoutout / live stream was broadcast to the Carroll County wire!</span>
          </div>
        )}

        {/* Modal / Form: Broadcast a Shoutout or Live Stream */}
        {isPosting && (
          <div className="bg-[#0e0e14] border border-amber-400/30 rounded-[2.5rem] p-6 md:p-8 space-y-6 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase text-amber-400">Public Wire Broadcast</span>
                <h3 className="text-xl font-black italic uppercase text-white">
                  {isLiveStream ? '🔴 Broadcast Live Stream to Oasis Wire' : 'Post Shoutout to Community Feed'}
                </h3>
              </div>
              <button
                onClick={() => setIsPosting(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono uppercase"
              >
                Cancel ✕
              </button>
            </div>

            {/* Live Stream / Standard Toggle */}
            <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/10 max-w-md">
              <button
                type="button"
                onClick={() => setIsLiveStream(false)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all ${
                  !isLiveStream ? 'bg-amber-400 text-black shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                💬 Standard Shoutout
              </button>
              <button
                type="button"
                onClick={() => setIsLiveStream(true)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all ${
                  isLiveStream ? 'bg-red-600 text-white shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <span>🔴 Live Stream Broadcast</span>
              </button>
            </div>

            <form onSubmit={handlePostShoutout} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Your Name / Streamer Handle</label>
                  <input
                    type="text"
                    required
                    value={authorName || (currentUser?.name || '')}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Sean Martin, PNB Eats, or Local Resident"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {!isLiveStream ? (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Category Tag</label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value as any)}
                      className="w-full bg-[#121218] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="drop">🛍️ Fresh Product Drop</option>
                      <option value="review">⭐ 5-Star Review Highlight</option>
                      <option value="courier">🚐 Courier Transit Alert</option>
                      <option value="deal">🔥 Flash Deal / Promo</option>
                      <option value="news">📢 Community Announcement</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-mono uppercase text-red-400 mb-1 block">Stream Platform</label>
                    <select
                      value={streamPlatform}
                      onChange={(e) => setStreamPlatform(e.target.value as any)}
                      className="w-full bg-[#121218] border border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-400"
                    >
                      <option value="youtube">▶️ YouTube Live / Video</option>
                      <option value="twitch">🟣 Twitch Stream</option>
                      <option value="kick">🟢 Kick Stream</option>
                      <option value="custom">🎥 Custom MP4 / M3U8 Stream URL</option>
                      <option value="audio">📻 Live Audio Dispatch Wire</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Streamer URL & Title inputs if live stream */}
              {isLiveStream && (
                <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-2xl space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Live Stream Configuration</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Stream Broadcast Title</label>
                      <input
                        type="text"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        placeholder="e.g. Sean Martin Live Carroll County Dispatch & Courier Run"
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Live Stream URL or Channel Link</label>
                      <input
                        type="url"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://twitch.tv/..."
                        className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-400"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-400">
                    💡 Supports YouTube, Twitch, Kick embeds, or custom audio/video streams. Viewers can watch directly in the community feed or streamer bar.
                  </p>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">
                  {isLiveStream ? 'Stream Description / Broadcast Notes' : 'Message Content'}
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={isLiveStream ? "Tell the community what you are showcasing or streaming today..." : "Share a fresh drop, announce an in-person NFC tap station, or post a local shoutout..."}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-mono text-zinc-400">
                  Attached Identity: {currentUser ? `${currentUser.name} (${currentUser.badge})` : 'Guest'}
                </span>
                <button
                  type="submit"
                  className={`px-6 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg flex items-center gap-2 ${
                    isLiveStream 
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30' 
                      : 'bg-amber-400 hover:bg-amber-300 text-black shadow-amber-400/20'
                  }`}
                >
                  {isLiveStream ? <Radio className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
                  <span>{isLiveStream ? 'Publish Live Stream' : 'Publish Shoutout'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 ${
                activeFilter === t.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.count !== undefined && t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-[9px] font-mono">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Two-Column Layout: Main Feed & Sidebar Vanguards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {filteredShoutouts.map((post) => {
              const isStream = post.isLiveStream || post.tag === 'stream' || Boolean(post.streamUrl);
              const embedSrc = getEmbedUrl(post.streamUrl, post.streamPlatform);

              return (
                <div
                  key={post.id}
                  className={`bg-[#0b0b10] border rounded-3xl p-6 md:p-8 space-y-5 transition-all group ${
                    isStream 
                      ? 'border-red-500/40 hover:border-red-500/80 shadow-2xl shadow-red-950/20 bg-gradient-to-b from-[#100714] to-[#0b0b10]' 
                      : 'border-white/10 hover:border-indigo-400/40'
                  }`}
                >
                  {/* Author Bar */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border ${
                        isStream 
                          ? 'bg-red-500/10 border-red-500/30' 
                          : 'bg-white/5 border-white/10'
                      }`}>
                        {post.authorAvatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black italic text-white text-base leading-snug">{post.authorName}</h3>
                          {post.authorBadge && (
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${
                              isStream
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}>
                              {post.authorBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-mono text-zinc-500">{post.authorHandle} • {formatDate(post.timestamp)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.isMetaGlassesPov && (
                        <span className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-[9px] font-mono uppercase font-black tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-600/30 border border-purple-400/40">
                          <Glasses className="w-3 h-3 text-purple-200" />
                          <span>🕶️ META RAY-BAN POV</span>
                        </span>
                      )}
                      {isStream && (
                        <span className="px-2.5 py-1 bg-red-600 text-white rounded-full text-[9px] font-mono uppercase font-black tracking-wider flex items-center gap-1.5 animate-pulse shadow-md shadow-red-600/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>LIVE STREAM</span>
                        </span>
                      )}
                      <span className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-full text-[9px] font-mono uppercase text-zinc-400">
                        #{post.tag}
                      </span>
                    </div>
                  </div>

                  {/* Stream Title & Embedded Player if Live Stream */}
                  {isStream && (
                    <div className="space-y-3 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        {post.streamTitle && (
                          <h4 className="text-base font-black italic uppercase text-amber-300 flex items-center gap-2">
                            <Radio className="w-4 h-4 text-red-400" />
                            <span>{post.streamTitle}</span>
                          </h4>
                        )}
                        <div className="flex items-center gap-2 shrink-0">
                          {post.povDeviceName && (
                            <span className="text-[9px] font-mono text-purple-300 flex items-center gap-1 px-2 py-0.5 bg-purple-950/40 rounded-lg border border-purple-500/30">
                              <Glasses className="w-2.5 h-2.5" />
                              <span>{post.povDeviceName}</span>
                            </span>
                          )}
                          {post.streamViewerCount && (
                            <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 px-2 py-0.5 bg-white/5 rounded-lg border border-white/10">
                              <Eye className="w-3 h-3 text-red-400" />
                              <span>{post.streamViewerCount} watching</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Embedded Player Container */}
                      <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black border border-red-500/30 relative">
                        {embedSrc ? (
                          embedSrc.includes('youtube') || embedSrc.includes('twitch') || embedSrc.includes('kick') ? (
                            <iframe
                              src={embedSrc}
                              title={post.streamTitle || 'Live Stream'}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ) : (
                            <video
                              src={post.streamUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-950/40 via-black to-indigo-950/40 p-6 text-center space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-2xl animate-bounce">
                              {post.isMetaGlassesPov ? '🕶️' : '📡'}
                            </div>
                            <p className="text-sm font-bold text-white uppercase font-mono">
                              {post.isMetaGlassesPov ? 'Meta Glasses POV Stream Channel' : 'Live Stream Broadcaster Channel'}
                            </p>
                            <p className="text-xs text-zinc-400 max-w-sm">
                              {post.isMetaGlassesPov 
                                ? 'Broadcasting live first-person field camera & 5-mic spatial audio from Meta Ray-Ban Smart Glasses.'
                                : 'Host is broadcasting active Carroll County updates and dispatch logs.'}
                            </p>
                          </div>
                        )}

                        {/* Meta Glasses Telemetry Overlay Bar */}
                        {post.isMetaGlassesPov && (
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                            <div className="flex items-center gap-2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full border border-purple-500/40 text-[9px] font-mono text-purple-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                              <span>{post.povTelemetry?.townNode || post.town || 'Effingham Hub'} • {post.povTelemetry?.speedMph || 24} MPH</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full border border-white/20 text-[9px] font-mono text-emerald-300">
                              <span>AWD 4x4</span>
                              <span>•</span>
                              <span>5-MIC 360°</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <p className="text-sm text-zinc-200 leading-relaxed pt-1">
                    {post.content}
                  </p>

                  {/* Reactions Bar */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => reactToShoutout(post.id, 'voltage')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                          post.userReactions?.voltage
                            ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{post.reactions.voltage}</span>
                      </button>

                      <button
                        onClick={() => reactToShoutout(post.id, 'fire')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                          post.userReactions?.fire
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>{post.reactions.fire}</span>
                      </button>

                      <button
                        onClick={() => reactToShoutout(post.id, 'heart')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all border ${
                          post.userReactions?.heart
                            ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                            : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.reactions.heart}</span>
                      </button>
                    </div>

                    <Link
                      href="/order"
                      className="text-[10px] font-mono text-amber-400 hover:text-white uppercase font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>Order Delivery</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar: Verified Vanguards & Sellers */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-6 space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-mono uppercase text-amber-400">Verified Network</span>
                  <h3 className="text-lg font-black italic uppercase text-white">Founding Vanguards</h3>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="space-y-4">
                {sellers.map((seller) => (
                  <Link
                    key={seller.id}
                    href={`/sellers/${seller.id}`}
                    className="block p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">{seller.avatar}</span>
                        <div>
                          <p className="font-bold text-white text-xs leading-snug group-hover:text-amber-400 transition-colors">
                            {seller.name}
                          </p>
                          <p className="text-[9px] font-mono text-indigo-400">{seller.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {seller.rating} ★
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{seller.bio}</p>
                  </Link>
                ))}
              </div>

              <Link
                href="/sell"
                className="block w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest text-center rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
              >
                Join as Local Vanguard
              </Link>
            </div>
          </div>

        </div>

      </div>

      <MetaGlassesLiveStreamModal
        isOpen={isMetaGlassesModalOpen}
        onClose={() => setIsMetaGlassesModalOpen(false)}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
