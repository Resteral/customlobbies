'use client';

import { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  X, 
  CheckCircle2, 
  Bell,
  BellRing,
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Volume2
} from 'lucide-react';
import { 
  isNotificationSupported, 
  getNotificationPermissionStatus, 
  requestNotificationPermission, 
  sendAppNotification,
  playChimeSound,
  triggerVibration
} from '@/lib/push-notifications';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InAppToast {
  id: string;
  title: string;
  body: string;
  icon?: string;
  url?: string;
  timestamp: string;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [activeToast, setActiveToast] = useState<InAppToast | null>(null);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
          (registration) => {
            console.log('Townraise Service Worker registered successfully:', registration.scope);
          },
          (err) => {
            console.warn('Townraise Service Worker registration failed:', err);
          }
        );
      });
    }

    // 2. Check Permission Status
    const perm = getNotificationPermissionStatus();
    setNotifPermission(perm);
    if (perm === 'default') {
      const dismissed = sessionStorage.getItem('townraise_notif_prompt_dismissed');
      if (!dismissed) {
        setShowNotifPrompt(true);
      }
    }

    // 3. Listen for in-app custom notification broadcasts
    const handleInAppToast = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        const toast: InAppToast = {
          id: `toast-${Date.now()}`,
          title: custom.detail.title,
          body: custom.detail.body,
          icon: custom.detail.icon,
          url: custom.detail.url,
          timestamp: custom.detail.timestamp,
        };
        setActiveToast(toast);
        setTimeout(() => {
          setActiveToast(null);
        }, 5000);
      }
    };

    window.addEventListener('townraise_in_app_notification', handleInAppToast);

    // 4. Check Standalone / PWA Mode
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    setIsStandalone(Boolean(isStandaloneMode));
    if (isStandaloneMode) {
      setIsInstalled(true);
    }

    // 5. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setIsIos(isIosDevice);
    setIsAndroid(isAndroidDevice);

    // 6. Capture native beforeinstallprompt (Android / Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem('townraise_install_banner_dismissed');
      if (!dismissed && !isStandaloneMode) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (isIosDevice && !isStandaloneMode) {
      const dismissed = sessionStorage.getItem('townraise_install_banner_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 2500);
        return () => clearTimeout(timer);
      }
    }

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('Townraise installed to home screen!');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('townraise_in_app_notification', handleInAppToast);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Installation error:', err);
      }
    } else {
      setShowIosModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('townraise_install_banner_dismissed', 'true');
  };

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
    setShowNotifPrompt(false);
    sessionStorage.setItem('townraise_notif_prompt_dismissed', 'true');

    if (res === 'granted') {
      sendAppNotification({
        title: '🔔 Phone Notifications Activated!',
        body: 'You will now receive instant push alerts for incoming courier delivery orders, customer reviews, and tap beacons.',
        url: '/',
        tag: 'welcome-notification',
        soundType: 'bounty'
      });
    }
  };

  const handleSendTestNotification = () => {
    sendAppNotification({
      title: '🚚 [Test Alert] New Courier Order #ORD-842',
      body: 'Sean Martin: Steak & Cheese sub from PNB Eats Roadside Grill ($24.50) ready for express dispatch!',
      url: '/dashboard/delivery',
      tag: 'test-order-alert',
      soundType: 'order'
    });
  };

  return (
    <>
      {/* ======================================================== */}
      {/* 1. TOP LIVE IN-APP TOAST ALERT (Foreground HUD) */}
      {/* ======================================================== */}
      {activeToast && (
        <aside 
          aria-label="Live Notification Toast"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-[#0e0e18]/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] ring-1 ring-amber-500/30 animate-in fade-in slide-in-from-top-4 duration-300 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 font-bold">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-white truncate flex items-center gap-1.5">
                {activeToast.title}
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {activeToast.body}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {activeToast.url && (
              <a
                href={activeToast.url}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider hover:opacity-90 transition-all"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 2. NOTIFICATION PERMISSION ACTIVATION BANNER */}
      {/* ======================================================== */}
      {showNotifPrompt && notifPermission === 'default' && (
        <aside
          aria-label="Notification Permission Banner"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm bg-[#09090f]/95 backdrop-blur-2xl border border-indigo-500/40 rounded-2xl p-3.5 shadow-2xl ring-1 ring-indigo-500/20 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                Enable Phone Notifications
              </h5>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                Get sound chimes & instant push alerts when new delivery orders or taps arrive.
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  type="button"
                  onClick={handleEnableNotifications}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[11px] shadow-sm transition-all cursor-pointer"
                >
                  Allow Notifications
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifPrompt(false);
                    sessionStorage.setItem('townraise_notif_prompt_dismissed', 'true');
                  }}
                  className="px-2 py-1.5 text-[11px] text-slate-400 hover:text-white"
                >
                  Not Now
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowNotifPrompt(false);
                sessionStorage.setItem('townraise_notif_prompt_dismissed', 'true');
              }}
              className="text-slate-500 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 3. FLOATING BOTTOM INSTALL PROMPT BANNER */}
      {/* ======================================================== */}
      {showBanner && !isStandalone && (
        <aside
          aria-label="Install App Prompt"
          className="fixed bottom-20 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 max-w-md bg-[#0a0a10]/95 backdrop-blur-2xl border border-amber-500/40 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-amber-500/20 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-700 p-0.5 shrink-0 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center overflow-hidden">
                <img 
                  src="/townraise-logo.png" 
                  alt="Townraise Icon" 
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  Install Townraise App
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Home App
                  </span>
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Add Townraise to your phone home screen for 1-tap full-screen access and instant delivery notifications.
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-bold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isIos ? 'Add to Home Screen' : 'Install App (1-Tap)'}
                </button>
                <button
                  type="button"
                  onClick={handleDismissBanner}
                  className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  Later
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismissBanner}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* ======================================================== */}
      {/* 4. iOS / ADD-TO-HOME & NOTIFICATIONS STEP-BY-STEP MODAL */}
      {/* ======================================================== */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0d0d14] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(0,0,0,0.9)] text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <div className="w-full h-full bg-[#09090e] rounded-[14px] flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-tight">
                    Add Townraise & Get Notifications
                  </h3>
                  <p className="text-xs text-slate-400">
                    Standalone app speed with real-time push alerts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Instructions Steps */}
            <div className="space-y-3 relative z-10">
              
              {/* Step 1 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  1
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Tap the Safari Share button</span>
                  <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                    Look for the square icon with an arrow <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> at the bottom of Safari.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  2
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Select "Add to Home Screen"</span>
                  <p className="text-slate-400 mt-0.5 flex items-center gap-1.5">
                    Scroll down in the menu and tap <PlusSquare className="w-3.5 h-3.5 text-amber-400 inline" /> <strong className="text-slate-200">"Add to Home Screen"</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0">
                  3
                </div>
                <div className="flex-1 text-xs">
                  <span className="text-white font-bold">Open Home App & Allow Notifications</span>
                  <p className="text-slate-400 mt-0.5">
                    Open Townraise from your home screen. When prompted, tap <strong>Allow Notifications</strong> to receive live sound chimes and delivery orders.
                  </p>
                </div>
              </div>

            </div>

            {/* Test Notification Trigger */}
            <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-amber-500/30 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white">Test Notification & Audio Chime</h6>
                  <p className="text-[10px] text-slate-400">Hear the delivery bell sound & trigger a live test</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleSendTestNotification}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Test Sound & Alert
              </button>
            </div>

            {/* Close / Got it */}
            <div className="mt-5 relative z-10">
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Got It, Ready to Install
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
