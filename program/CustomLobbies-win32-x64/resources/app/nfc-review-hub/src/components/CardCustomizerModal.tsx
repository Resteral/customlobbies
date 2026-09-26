'use client';

import { useState } from 'react';
import { ReviewProduct } from '@/lib/types';
import { useNfcStore } from '@/lib/store';
import { X, Sparkles, ShoppingBag, Radio, Check, Palette, Building2, Type, Image as ImageIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import ImageUpload from '@/components/ImageUpload';

interface Props {
  product: ReviewProduct;
  isOpen: boolean;
  onClose: () => void;
}

export default function CardCustomizerModal({ product, isOpen, onClose }: Props) {
  const { addToCart } = useNfcStore();
  const [businessName, setBusinessName] = useState('Oasis Specialty Cafe');
  const [headline, setHeadline] = useState('Tap with Phone to Review');
  const [selectedColor, setSelectedColor] = useState(product.colorOptions?.[0] || '#0f172a');
  const [selectedIcon, setSelectedIcon] = useState('⭐');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, {
      color: selectedColor,
      businessName,
      logoUrl: customLogoUrl || selectedIcon
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const icons = ['⭐', '☕', '🍕', '💈', '🚗', '🏨', '🔨', '✨', '🐾', '💨', '🍔', '🦞'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#0d0d12] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Col: Live Card Visualizer */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">Live Hardware Renderer</span>
            <h3 className="text-xl font-black italic tracking-tight text-white">{product.name}</h3>
          </div>

          {/* Interactive Card Canvas Preview */}
          <div className="relative w-full max-w-sm aspect-[1.586/1] rounded-3xl p-6 shadow-2xl border flex flex-col justify-between overflow-hidden transition-all duration-500 animate-float"
               style={{
                 backgroundColor: selectedColor,
                 borderColor: 'rgba(255,255,255,0.15)',
                 boxShadow: `0 20px 50px -10px ${selectedColor}80`
               }}>
            
            {/* Background cyber pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top Bar */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                {customLogoUrl ? (
                  <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/30 bg-black/40 flex items-center justify-center shrink-0">
                    <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span className="text-2xl">{selectedIcon}</span>
                )}
                <div>
                  <h4 className="font-black italic text-white text-sm tracking-tight line-clamp-1">{businessName}</h4>
                  <p className="text-[8px] font-mono uppercase text-white/50 tracking-wider">Smart Review Card</p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
            </div>

            {/* Middle Prompt */}
            <div className="relative z-10 my-auto text-left">
              <div className="flex items-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xs">★</span>
                ))}
              </div>
              <p className="text-xs font-bold text-white tracking-wide">{headline}</p>
            </div>

            {/* Bottom Bar: NFC + Google Logo + QR simulation */}
            <div className="relative z-10 flex justify-between items-end pt-2 border-t border-white/10">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-blue-400">G</span>
                  <span className="text-[10px] font-bold text-red-400">o</span>
                  <span className="text-[10px] font-bold text-yellow-400">o</span>
                  <span className="text-[10px] font-bold text-blue-400">g</span>
                  <span className="text-[10px] font-bold text-green-400">l</span>
                  <span className="text-[10px] font-bold text-red-400">e</span>
                  <span className="text-[9px] font-bold text-white ml-1">Reviews</span>
                </div>
                <p className="text-[7px] font-mono text-white/40">STANDARDIZED NFC 13.56MHz</p>
              </div>

              {/* QR Backup Box */}
              <div className="w-10 h-10 bg-white rounded-lg p-1 flex items-center justify-center shadow-lg">
                <div className="w-full h-full border border-black grid grid-cols-3 gap-0.5 p-0.5">
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-transparent" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                  <div className="bg-black" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Free laser printing & NFC pre-encoding included
          </p>
        </div>

        {/* Right Col: Customization Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black italic text-amber-400">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through">{formatCurrency(product.originalPrice)}</span>
              )}
            </div>
            <p className="text-xs text-zinc-400">{product.subtitle}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Business / Brand Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                maxLength={36}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" /> Card Review Headline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                maxLength={45}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 mb-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" /> Finish / Shade
              </label>
              <div className="flex gap-2">
                {(product.colorOptions || ['#0f172a', '#1e1b4b', '#18181b']).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === c ? 'border-amber-400 scale-110' : 'border-white/20'
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {selectedColor === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Logo Image Upload & Preset Icons */}
            <div className="space-y-3 pt-1">
              <ImageUpload
                value={customLogoUrl}
                onChange={(url) => setCustomLogoUrl(url)}
                label="Custom Brand Logo / Emblem Image"
                subtitle="Upload PNG, JPG, or SVG to engrave directly on card"
                aspectRatio="square"
                compact={true}
              />

              {!customLogoUrl && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1.5 block">
                    Or Choose Preset Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`w-9 h-9 rounded-xl border text-sm flex items-center justify-center transition-all ${
                          selectedIcon === icon ? 'bg-amber-400/20 border-amber-400 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action CTA */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Hardware Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Confirm & Add to Cart • {formatCurrency(product.price)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
