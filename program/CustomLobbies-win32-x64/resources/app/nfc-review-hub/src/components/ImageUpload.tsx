'use client';

import { useState, useRef, ChangeEvent, DragEvent, ClipboardEvent } from 'react';
import { Upload, X, Image as ImageIcon, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (base64Url: string) => void;
  label?: string;
  subtitle?: string;
  aspectRatio?: 'square' | 'wide' | 'card' | 'any';
  maxDimension?: number; // max width/height in px for compression
  quality?: number; // 0.1 - 1.0 jpeg/webp compression
  compact?: boolean;
  className?: string;
}

/**
 * Compresses and scales an image File to a base64 Data URL using HTML5 Canvas.
 */
function compressImageFile(file: File, maxDimension = 800, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down maintaining aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP/PNG/JPEG
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  subtitle = 'PNG, JPG, WEBP, or SVG up to 10MB (auto-compressed)',
  aspectRatio = 'square',
  maxDimension = 800,
  quality = 0.85,
  compact = false,
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, maxDimension, quality);
      onChange(compressedDataUrl);
    } catch (err) {
      console.error('Image compression failed:', err);
      // Fallback: direct read
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          processFile(file);
          break;
        }
      }
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[160px]';
      case 'wide':
        return 'aspect-[21/9] w-full';
      case 'card':
        return 'aspect-[1.586/1] max-w-[220px]';
      default:
        return 'min-h-[120px] w-full';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3 h-3 text-amber-400" />
            <span>{label}</span>
          </label>
          {value && (
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Image Loaded
            </span>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        // Preview Box with change/remove actions
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer rounded-2xl overflow-hidden border border-white/20 hover:border-amber-400/60 bg-black/40 transition-all p-1"
        >
          <div className={`relative ${getAspectClass()} mx-auto rounded-xl overflow-hidden flex items-center justify-center bg-zinc-900`}>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Hover overlay with Actions */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="p-2 rounded-xl bg-amber-400 text-black text-xs font-bold hover:bg-amber-300 transition-colors flex items-center gap-1"
                title="Replace image"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-black">Replace</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-400 transition-colors flex items-center gap-1"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase font-black">Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Dropzone
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          tabIndex={0}
          className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all p-4 text-center flex flex-col items-center justify-center space-y-2 select-none ${
            isDragging
              ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
              : 'border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04]'
          } ${compact ? 'py-3' : 'py-6'}`}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono py-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Optimizing image...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-white">
                  Click to upload or drag & drop
                </p>
                {subtitle && (
                  <p className="text-[10px] font-mono text-zinc-500 max-w-xs">
                    {subtitle}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
