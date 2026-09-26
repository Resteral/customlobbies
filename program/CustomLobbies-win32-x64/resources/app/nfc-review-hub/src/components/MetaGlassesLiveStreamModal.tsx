'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNfcStore } from '@/lib/store';
import { playChimeSound } from '@/lib/push-notifications';
import { 
  Glasses, 
  Video, 
  Radio, 
  X, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Send, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Flame, 
  Zap, 
  Eye, 
  Play, 
  Maximize2, 
  RefreshCw,
  Sliders,
  Smartphone,
  Info,
  Check
} from 'lucide-react';

interface MetaGlassesLiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStreamStarted?: (streamData: {
    streamTitle: string;
    streamUrl?: string;
    streamPlatform: 'meta_glasses' | 'instagram' | 'facebook' | 'youtube' | 'custom';
    isMetaGlassesPov: boolean;
    povDeviceName: string;
    content: string;
  }) => void;
}

export default function MetaGlassesLiveStreamModal({
  isOpen,
  onClose,
  onStreamStarted
}: MetaGlassesLiveStreamModalProps) {
  const { addShoutout, currentUser, activeTown } = useNfcStore();

  // Mode: 'camera_direct' (WebRTC direct glasses/camera stream) or 'meta_view_link' (Instagram/Facebook/YouTube live URL from Meta View)
  const [streamMode, setStreamMode] = useState<'camera_direct' | 'meta_view_link'>('camera_direct');

  // Form State
  const [streamTitle, setStreamTitle] = useState('Sean Martin • Meta Ray-Ban POV Live Dispatch');
  const [streamNotes, setStreamNotes] = useState('Streaming live first-person POV delivery routes and Carroll County operations directly from Meta Ray-Ban Smart Glasses.');
  const [metaViewUrl, setMetaViewUrl] = useState('');
  const [metaPlatform, setMetaPlatform] = useState<'meta_glasses' | 'instagram' | 'facebook' | 'youtube'>('meta_glasses');

  // WebRTC Camera & Device State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // HUD Simulated Telemetry
  const [speedMph, setSpeedMph] = useState(38);
  const [batteryLevel, setBatteryLevel] = useState(88);
  const [audioPeak, setAudioPeak] = useState(42);

  // Load Video Devices
  useEffect(() => {
    if (!isOpen) return;

    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const vDevices = devices.filter(d => d.kind === 'videoinput');
        setVideoDevices(vDevices);
        if (vDevices.length > 0 && !selectedDeviceId) {
          // Select back camera or glasses camera if available
          const glassesOrBack = vDevices.find(d => 
            d.label.toLowerCase().includes('meta') || 
            d.label.toLowerCase().includes('glasses') || 
            d.label.toLowerCase().includes('back')
          ) || vDevices[0];
          setSelectedDeviceId(glassesOrBack.deviceId);
        }
      }).catch(console.error);
    }
  }, [isOpen, selectedDeviceId]);

  // Start Live Camera Capture
  useEffect(() => {
    if (!isOpen || streamMode !== 'camera_direct') {
      stopMediaStream();
      return;
    }

    let active = true;

    async function startCamera() {
      try {
        setCameraError(null);
        const constraints: MediaStreamConstraints = {
          video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: true
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (active) {
          setMediaStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err: any) {
        console.error('Camera capture error:', err);
        if (active) {
          setCameraError(err.message || 'Could not access camera/glasses video device. Please ensure camera permissions are granted.');
        }
      }
    }

    startCamera();

    return () => {
      active = false;
    };
  }, [isOpen, streamMode, selectedDeviceId]);

  const stopMediaStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  // Simulate realistic telemetry changes
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSpeedMph((prev) => Math.max(25, Math.min(55, prev + (Math.floor(Math.random() * 5) - 2))));
      setAudioPeak(() => Math.floor(Math.random() * 45) + 35);
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleToggleAudio = () => {
    if (mediaStream) {
      mediaStream.getAudioTracks().forEach(t => {
        t.enabled = !t.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const handleStartStream = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAuthor = currentUser?.name || 'Sean Martin • Townraise Vanguard';
    const finalAvatar = currentUser?.avatar || '👑';
    const finalBadge = 'Meta Ray-Ban POV Broadcaster';
    const selectedDeviceName = videoDevices.find(d => d.deviceId === selectedDeviceId)?.label || 'Meta Ray-Ban Smart Glasses (12MP Ultra-Wide)';

    const streamUrlToUse = streamMode === 'meta_view_link' && metaViewUrl.trim() 
      ? metaViewUrl.trim() 
      : `https://www.youtube.com/watch?v=jfKfPfyJRdk`; // Fallback live feed stream

    // Publish to Townraise Shoutout Stream
    addShoutout({
      authorName: finalAuthor,
      authorHandle: `@${finalAuthor.toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: finalAvatar,
      authorBadge: finalBadge,
      content: streamNotes.trim() || `🔴 LIVE: Streaming first-person POV delivery routes and merchant dispatches from Meta Ray-Ban Smart Glasses.`,
      tag: 'stream',
      town: activeTown?.fullName || 'Effingham, NH',
      isLiveStream: true,
      streamPlatform: streamMode === 'meta_view_link' ? metaPlatform : 'meta_glasses',
      streamUrl: streamUrlToUse,
      streamTitle: streamTitle.trim() || `${finalAuthor} Meta Glasses POV Live Stream`,
      streamViewerCount: 38,
      streamStartedAt: new Date().toISOString(),
      isMetaGlassesPov: true,
      povDeviceName: selectedDeviceName,
      povTelemetry: {
        speedMph,
        townNode: activeTown?.fullName || 'Effingham, NH',
        batteryPercent: batteryLevel,
        isAwdActive: true,
        audioLatencyMs: 14,
      }
    });

    playChimeSound('bounty');
    setIsLiveActive(true);

    if (onStreamStarted) {
      onStreamStarted({
        streamTitle,
        streamUrl: streamUrlToUse,
        streamPlatform: streamMode === 'meta_view_link' ? metaPlatform : 'meta_glasses',
        isMetaGlassesPov: true,
        povDeviceName: selectedDeviceName,
        content: streamNotes,
      });
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200">
      
      {/* Modal Card Container */}
      <div className="bg-[#0b0b14] border-2 border-indigo-500/40 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8 relative my-auto">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">
              <Glasses className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  <span>META RAY-BAN POV HUB</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-400">12MP Ultra-Wide & Spatial Audio Stream</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black italic uppercase text-white tracking-tight">
                Live Stream from Meta Smart Glasses
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopMediaStream();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stream Source Mode Selector */}
        <div className="flex gap-2 p-1.5 bg-black/50 rounded-2xl border border-white/10 max-w-md">
          <button
            type="button"
            onClick={() => setStreamMode('camera_direct')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
              streamMode === 'camera_direct'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Direct Camera / Glasses POV</span>
          </button>
          <button
            type="button"
            onClick={() => setStreamMode('meta_view_link')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
              streamMode === 'meta_view_link'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Meta View Live URL</span>
          </button>
        </div>

        {/* VIEW A: DIRECT CAMERA / GLASSES VIEWFINDER */}
        {streamMode === 'camera_direct' && (
          <div className="space-y-4">
            
            {/* Viewfinder Container with HUD Overlay */}
            <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border-2 border-indigo-500/40 shadow-2xl group">
              
              {/* Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isAudioMuted}
                className="w-full h-full object-cover"
              />

              {/* HUD OVERLAY */}
              <div className="absolute inset-0 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
                
                {/* Top HUD Row */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600/90 text-white font-mono font-black text-[10px] rounded-full uppercase flex items-center gap-1.5 shadow-md shadow-red-600/40">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>POV ON-AIR</span>
                    </span>
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-amber-300 font-mono text-[10px] rounded-full">
                      🕶️ Meta Ray-Ban 12MP Ultra-Wide
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-emerald-400 font-mono text-[10px] rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>BATTERY {batteryLevel}%</span>
                    </span>
                    <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] rounded-full flex items-center gap-1">
                      <Eye className="w-3 h-3 text-indigo-400" />
                      <span>38 VIEWERS</span>
                    </span>
                  </div>
                </div>

                {/* Center Crosshair / Horizon Guide */}
                <div className="self-center flex flex-col items-center opacity-40">
                  <div className="w-12 h-12 border border-white/40 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>
                  <span className="text-[9px] font-mono text-white/80 mt-1 uppercase">POV HORIZON LOCK</span>
                </div>

                {/* Bottom HUD Row: Telemetry & Audio Peak Meter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black italic uppercase text-white drop-shadow">
                      {currentUser?.name || 'Sean Martin'} Vanguard Dispatch
                    </p>
                    <p className="text-xs font-mono text-amber-300 flex items-center gap-1.5">
                      <span>📍 {activeTown?.fullName || 'Effingham, NH'}</span>
                      <span>•</span>
                      <span>{speedMph} MPH</span>
                      <span>•</span>
                      <span className="text-emerald-400">AWD 4X4 ACTIVE</span>
                    </p>
                  </div>

                  {/* 5-Mic Spatial Audio Meter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-300 uppercase">5-Mic Spatial:</span>
                    <div className="w-20 h-2 bg-zinc-800 rounded-full overflow-hidden border border-white/20">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-300"
                        style={{ width: `${audioPeak}%` }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Fallback Camera Screen if error or blocked */}
              {cameraError && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center space-y-3">
                  <Glasses className="w-12 h-12 text-amber-400 animate-bounce" />
                  <h4 className="text-base font-bold text-white uppercase">Camera Access Required</h4>
                  <p className="text-xs text-zinc-400 max-w-md font-mono">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => setStreamMode('meta_view_link')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono uppercase"
                  >
                    Switch to Meta View Live Link Mode →
                  </button>
                </div>
              )}

            </div>

            {/* Camera Controls & Device Picker Bar */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Sliders className="w-4 h-4 text-indigo-400 shrink-0" />
                <label className="text-[10px] font-mono uppercase text-zinc-400 shrink-0">POV Camera Device:</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="bg-[#12121c] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-400 w-full sm:w-64 truncate"
                >
                  {videoDevices.map((d, i) => (
                    <option key={d.deviceId || i} value={d.deviceId}>
                      {d.label || `Camera ${i + 1} (Meta Glasses / Phone)`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    isAudioMuted 
                      ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:text-white'
                  }`}
                >
                  {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                  <span>{isAudioMuted ? 'Mic Muted' : 'Spatial Mic Active'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW B: META VIEW LIVE STREAM URL INGEST */}
        {streamMode === 'meta_view_link' && (
          <div className="space-y-4">
            
            {/* 3-Step Setup Instructions Card */}
            <div className="p-5 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400 uppercase">
                <Glasses className="w-4 h-4" />
                <span>How to Stream from Meta Ray-Ban Glasses (3 Steps)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-zinc-300">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block">1. Open Meta View</span>
                  <p className="text-[11px] text-zinc-400">Pair glasses to your phone and tap <strong>Live Video</strong> in the Meta View app.</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block">2. Go Live</span>
                  <p className="text-[11px] text-zinc-400">Select Instagram Live, Facebook Live, or YouTube Live to broadcast your POV camera.</p>
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block">3. Paste Stream Link</span>
                  <p className="text-[11px] text-zinc-400">Paste your live link below — Townraise automatically streams your glasses to all users!</p>
                </div>
              </div>
            </div>

            {/* Stream URL Input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Live Platform</label>
                <select
                  value={metaPlatform}
                  onChange={(e) => setMetaPlatform(e.target.value as any)}
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="meta_glasses">🕶️ Meta Ray-Ban POV Direct Feed</option>
                  <option value="instagram">📸 Instagram Live POV</option>
                  <option value="facebook">👥 Facebook Live Broadcast</option>
                  <option value="youtube">▶️ YouTube Live RTMP Stream</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Meta View Stream URL / Channel Link</label>
                <input
                  type="url"
                  value={metaViewUrl}
                  onChange={(e) => setMetaViewUrl(e.target.value)}
                  placeholder="e.g. https://instagram.com/.../live or https://youtube.com/watch?v=..."
                  className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>

          </div>
        )}

        {/* Broadcast Meta Details Form */}
        <form onSubmit={handleStartStream} className="space-y-4 pt-2 border-t border-white/10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Live Broadcast Title</label>
              <input
                type="text"
                required
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="e.g. Sean Martin • Meta Ray-Ban POV Live Dispatch"
                className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Broadcast Territory</label>
              <input
                type="text"
                disabled
                value={`${activeTown?.fullName || 'Effingham, NH'} • Carroll County Network`}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1 block">Stream Description & Dispatch Notes</label>
            <input
              type="text"
              value={streamNotes}
              onChange={(e) => setStreamNotes(e.target.value)}
              placeholder="Tell viewers what you are showcasing or delivering today..."
              className="w-full bg-[#12121c] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Broadcasting as <strong>{currentUser?.name || 'Sean Martin'}</strong> with verified Vanguard POV Badge</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  stopMediaStream();
                  onClose();
                }}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono uppercase text-zinc-300 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial px-8 py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                <span>🔴 Go Live with Meta Glasses</span>
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  );
}
