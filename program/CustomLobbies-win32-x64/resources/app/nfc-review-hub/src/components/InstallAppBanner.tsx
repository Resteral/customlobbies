'use client';

import { useState, useEffect } from 'react';
import { Download, Share2, PlusSquare, Smartphone, X, CheckCircle2 } from 'lucide-react';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed PWA mode
    if (typeof window !== 'undefined') {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      alert('To install: Open your browser menu (⋮ or Share) and select "Install App" or "Add to Home screen".');
    }
  };

  if (isStandalone || isDismissed) return null;

  return (
    <>
      {/* Floating Install Prompt Banner */}
      <div className="bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-amber-500/10 border border-amber-400/30 rounded-2xl p-3.5 backdrop-blur-md flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black shadow-lg shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-white flex items-center gap-1.5">
              <span>Install Food Delivery Driver App</span>
              <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-400 text-[8px] font-mono rounded">PWA</span>
            </p>
            <p className="text-[10px] text-zinc-400">
              Add to phone home screen for instant in-vehicle dash launch & live GPS background tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-400/20 whitespace-nowrap flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Safari Step-by-Step Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0e0e16] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <h3 className="font-black italic text-white text-base">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-white">Tap Safari Share Button</p>
                  <p className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Look for the <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> icon at the bottom of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-white">Select "Add to Home Screen"</p>
                  <p className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>Add to Home Screen</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-white">Launch App from Home Screen</p>
                  <p className="text-zinc-400 text-[11px]">
                    Opens in full-screen standalone driver mode with zero browser address bar!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full py-3 bg-amber-400 text-black font-black uppercase text-xs rounded-xl tracking-wider hover:bg-amber-300 transition-colors"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
