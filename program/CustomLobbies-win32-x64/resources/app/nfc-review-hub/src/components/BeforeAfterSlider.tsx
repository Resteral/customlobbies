'use client';

import { useState, useRef, useCallback, useEffect, MouseEvent, TouchEvent } from 'react';
import { Eye, Columns, Maximize2, Sparkles, Check } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: 'video' | 'square' | 'photo' | 'wide';
  className?: string;
  interactive?: boolean;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  aspectRatio = 'photo',
  className = '',
  interactive = true,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'side_by_side'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    const pos = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(pos);
  }, []);

  const handleTouchMove = useCallback((e: globalThis.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const ratioClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'wide' ? 'aspect-[21/9]' : 'aspect-[4/3] sm:aspect-[16/10]';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Top Toggle Controls */}
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-[10px] text-zinc-400 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Visual Transformation</span>
        </span>

        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
              viewMode === 'slider'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>Slider</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('side_by_side')}
            className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1 ${
              viewMode === 'side_by_side'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns className="w-3 h-3" />
            <span>Side-by-Side</span>
          </button>
        </div>
      </div>

      {viewMode === 'side_by_side' ? (
        /* Side by Side Mode */
        <div className="grid grid-cols-2 gap-2">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group">
            <img src={beforeImage} alt={beforeLabel} className={`w-full ${ratioClass} object-cover`} />
            <span className="absolute top-2 left-2 px-2.5 py-1 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-md tracking-wider shadow-lg">
              {beforeLabel}
            </span>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black group">
            <img src={afterImage} alt={afterLabel} className={`w-full ${ratioClass} object-cover`} />
            <span className="absolute top-2 right-2 px-2.5 py-1 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase rounded-md tracking-wider shadow-lg">
              {afterLabel}
            </span>
          </div>
        </div>
      ) : (
        /* Interactive Split Slider Mode */
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onClick={(e) => handleMove(e.clientX)}
          className={`relative w-full ${ratioClass} rounded-2xl overflow-hidden border border-white/10 bg-black cursor-ew-resize select-none shadow-xl`}
        >
          {/* AFTER Image (Background Layer) */}
          <img
            src={afterImage}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* BEFORE Image (Clipped Top Layer) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeImage}
              alt={beforeLabel}
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
                maxWidth: 'none',
              }}
              className="absolute inset-0 h-full object-cover pointer-events-none"
            />
          </div>

          {/* Before & After Badges */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-md text-red-400 border border-red-500/30 text-[9px] font-black uppercase rounded-lg tracking-widest pointer-events-none shadow-lg">
            {beforeLabel}
          </span>
          <span className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase rounded-lg tracking-widest pointer-events-none shadow-lg">
            {afterLabel}
          </span>

          {/* Draggable Divider Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            {/* Center Circle Grip Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-black font-black text-[10px] flex items-center justify-center shadow-2xl border-2 border-amber-400 ring-4 ring-black/40">
              <span className="flex items-center gap-0.5">
                <span>◂</span>
                <span>▸</span>
              </span>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[8px] font-mono text-zinc-300 pointer-events-none uppercase tracking-wider">
            Drag handle left / right to compare
          </div>
        </div>
      )}
    </div>
  );
}
