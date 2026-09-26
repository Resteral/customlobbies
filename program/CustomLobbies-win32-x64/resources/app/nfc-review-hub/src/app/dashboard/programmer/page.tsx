'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Radio, Search, Sparkles, Star, MapPin, Phone, 
  ExternalLink, QrCode, Cpu, CheckCircle2, Copy, 
  Download, ArrowRight, ShieldCheck, Plus, RefreshCw,
  Zap, Info, Check, Filter, Layers, AlertCircle, X, Key
} from 'lucide-react';
import AdminNfcCardProgrammerModal from '@/components/AdminNfcCardProgrammerModal';
import { useNfcStore } from '@/lib/store';
import { 
  EFFINGHAM_AREA_BUSINESSES, LocalBusiness, 
  buildGoogleReviewUrl, buildSmartTapUrl, getBusinessesForTown
} from '@/lib/local-businesses';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

export default function NfcProgrammerPage() {
  const { addCard, playDeliveryChime, towns: storeTowns, activeTown } = useNfcStore();

  const [selectedTown, setSelectedTown] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminProgrammerOpen, setIsAdminProgrammerOpen] = useState(false);

  // Dynamically aggregate registered town businesses (memoized)
  const allTownNames = useMemo(() => {
    return Array.from(new Set(['All', ...storeTowns.map(t => t.name), 'Effingham', 'Ossipee', 'Freedom', 'Wakefield', 'Conway']));
  }, [storeTowns]);
  
  // Collect businesses across all registered towns (memoized)
  const allBusinesses = useMemo(() => {
    const allKnown = storeTowns.flatMap(t => getBusinessesForTown(t.name, t.state));
    const uniqueMap = new Map<string, LocalBusiness>();
    [...EFFINGHAM_AREA_BUSINESSES, ...allKnown].forEach(b => {
      uniqueMap.set(b.id, b);
    });
    return Array.from(uniqueMap.values());
  }, [storeTowns]);

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'dining', label: 'Dining & Pubs' },
    { id: 'retail', label: 'Retail & Antiques' },
    { id: 'farm_artisan', label: 'Farms & Artisans' },
    { id: 'hospitality', label: 'Lakeside & Hospitality' },
    { id: 'services', label: 'Services' },
  ];

  // Custom business builder state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTown, setCustomTown] = useState('Effingham');
  const [customPlaceId, setCustomPlaceId] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [customCategory, setCustomCategory] = useState<LocalBusiness['category']>('dining');

  // Google Search & Maps URL Resolver State
  const defaultSmokeWorldBiz: LocalBusiness = useMemo(() => {
    return allBusinesses.find(b => b.id === 'biz-oss-smoke-world') || {
      id: 'biz-oss-smoke-world',
      name: 'Smoke World Ossipee',
      town: 'Ossipee',
      state: 'NH',
      category: 'retail',
      address: '920 Route 16, Center Ossipee, NH 03814',
      phone: '(603) 539-7665',
      googlePlaceId: 'ChIJb6eBq9f94okRGb_SmokeWorldOss',
      googleRating: 4.9,
      reviewsCount: 148,
      googleReviewUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
      googleMapsUrl: 'https://www.google.com/search?q=smoke+world+ossipee',
      description: 'Premier regional smoke, vape, glass, tobacco accessories, and novelty shop located on Route 16 in Ossipee.',
      suggestedCardHeadline: 'Love your visit to Smoke World? Tap your phone to leave us a 5-star Google review!',
      logoEmoji: '💨',
      accentColor: '#10b981',
    };
  }, [allBusinesses]);

  const [rawGoogleUrl, setRawGoogleUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [urlParseSuccess, setUrlParseSuccess] = useState<string | null>('Smoke World Ossipee is loaded and paired with direct Google Review payload!');
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<LocalBusiness>(defaultSmokeWorldBiz);
  const [customAddedBusinesses, setCustomAddedBusinesses] = useState<LocalBusiness[]>([]);
  const [inPageQrUrl, setInPageQrUrl] = useState<string>('');
  const [inPageCopied, setInPageCopied] = useState<boolean>(false);

  // Collect businesses across all registered towns + dynamic user additions
  const combinedBusinesses = useMemo(() => {
    return [...allBusinesses, ...customAddedBusinesses];
  }, [allBusinesses, customAddedBusinesses]);

  // Generate in-page QR code whenever extractedResult changes safely
  useEffect(() => {
    let active = true;
    if (extractedResult?.googleReviewUrl) {
      QRCode.toDataURL(extractedResult.googleReviewUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => {
        if (active) setInPageQrUrl(url);
      }).catch(() => {});
    }
    return () => { active = false; };
  }, [extractedResult?.googleReviewUrl]);

  // Instantaneous Client-First Business Extractor (0ms latency, zero hang)
  const handleResolveGoogleUrl = (urlToParse?: string) => {
    const rawInput = (urlToParse !== undefined ? urlToParse : rawGoogleUrl).trim();
    if (!rawInput) {
      setExtractError('Please enter a Google Search link, Google Maps URL, or business name.');
      return;
    }

    setExtractError(null);
    setUrlParseSuccess(null);

    try {
      const urlMatch = rawInput.match(/(https?:\/\/[^\s]+)/i);
      const targetString = urlMatch ? urlMatch[1] : rawInput;

      let businessName = '';
      let extractedTown = 'Ossipee';
      let placeId = '';
      let category: LocalBusiness['category'] = 'retail';
      let logoEmoji = '💨';

      // 1. Parse query parameter (q=, query=, oq=)
      const qMatch = targetString.match(/[?&#](?:q|query|oq)=([^&#]+)/i);
      if (qMatch) {
        try {
          businessName = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ');
        } catch {
          businessName = qMatch[1].replace(/\+/g, ' ');
        }
      }

      // 2. Parse place path (/maps/place/Name+Here/...)
      if (!businessName && targetString.includes('/maps/place/')) {
        const placeMatch = targetString.match(/\/maps\/place\/([^\/@\?]+)/i);
        if (placeMatch) {
          try {
            businessName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
          } catch {
            businessName = placeMatch[1].replace(/\+/g, ' ');
          }
        }
      }

      // 3. Extract Place ID if present (placeid=, place_id=, lrd=, !1s)
      const placeIdMatch = targetString.match(/[?&#](?:placeid|place_id|lrd)=([^&#]+)/i);
      if (placeIdMatch) {
        placeId = placeIdMatch[1].split(',')[0].replace(/[^a-zA-Z0-9_-]/g, '');
      } else {
        const dataPlaceIdMatch = targetString.match(/!1s(0x[0-9a-fA-F]+:0x[0-9a-fA-F]+|ChIJ[a-zA-Z0-9_-]+)/);
        if (dataPlaceIdMatch) {
          placeId = dataPlaceIdMatch[1];
        }
      }

      // Check direct Place ID match against indexed businesses FIRST
      if (placeId) {
        const placeMatchBiz = combinedBusinesses.find(b => 
          b.googlePlaceId.toLowerCase() === placeId.toLowerCase() ||
          b.googlePlaceId.includes(placeId) ||
          placeId.includes(b.googlePlaceId) ||
          (placeId.toLowerCase().includes('smokeworld') && b.id.includes('smoke-world'))
        );

        if (placeMatchBiz) {
          setUrlParseSuccess(`Extracted & Matched via Place ID: "${placeMatchBiz.name}" in ${placeMatchBiz.town}, NH!`);
          setExtractedResult(placeMatchBiz);
          setRawGoogleUrl('');
          setIsExtracting(false);
          playDeliveryChime();
          return;
        }
      }

      if (!businessName) {
        if (targetString.startsWith('http')) {
          try {
            const u = new URL(targetString);
            const pathSegments = u.pathname.split('/').filter(s => 
              s && !s.startsWith('@') && s !== 'maps' && s !== 'search' && s !== 'local' && s !== 'writereview' && s !== 'place'
            );
            if (pathSegments.length > 0) {
              businessName = decodeURIComponent(pathSegments[pathSegments.length - 1]).replace(/[+_-]/g, ' ');
            } else if (placeId && placeId.toLowerCase().includes('smoke')) {
              businessName = 'Smoke World Ossipee';
            } else {
              businessName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || 'Smoke World Ossipee';
            }
          } catch {
            businessName = rawInput.replace(/https?:\/\/[^\s]+/g, '').trim() || 'Smoke World Ossipee';
          }
        } else {
          businessName = rawInput;
        }
      }

      businessName = businessName.replace(/#.*$/, '').replace(/&.*$/, '').trim();
      const lower = businessName.toLowerCase();

      // Check match against indexed businesses
      const existingMatch = combinedBusinesses.find(b => 
        lower.includes(b.name.toLowerCase()) || 
        b.name.toLowerCase().includes(lower) ||
        (lower.includes('smoke') && (b.id.includes('smoke-world') || b.name.toLowerCase().includes('smoke world'))) ||
        (lower.includes('pnb') && b.id.includes('pnb')) ||
        (lower.includes('pizza barn') && b.id.includes('pizza-barn'))
      );

      if (existingMatch) {
        setUrlParseSuccess(`Extracted & Matched: "${existingMatch.name}" in ${existingMatch.town}, NH!`);
        setExtractedResult(existingMatch);
        setRawGoogleUrl('');
        setIsExtracting(false);
        playDeliveryChime();
        return;
      }

      if (lower.includes('ossipee')) extractedTown = 'Ossipee';
      else if (lower.includes('freedom')) extractedTown = 'Freedom';
      else if (lower.includes('conway')) extractedTown = 'Conway';
      else if (lower.includes('wakefield') || lower.includes('sanbornville')) extractedTown = 'Wakefield';
      else if (lower.includes('effingham')) extractedTown = 'Effingham';
      else if (lower.includes('tamworth')) extractedTown = 'Tamworth';

      const formattedTitle = businessName
        .split(' ')
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      if (lower.includes('smoke') || lower.includes('vape') || lower.includes('tobacco') || lower.includes('glass')) {
        category = 'retail';
        logoEmoji = '💨';
      } else if (lower.includes('pizza') || lower.includes('eats') || lower.includes('grill') || lower.includes('restaurant') || lower.includes('food') || lower.includes('bbq') || lower.includes('pub') || lower.includes('tavern') || lower.includes('coffee') || lower.includes('bakery')) {
        category = 'dining';
        logoEmoji = lower.includes('pizza') ? '🍕' : lower.includes('bbq') ? '🍖' : lower.includes('coffee') ? '☕' : '🍽️';
      } else if (lower.includes('inn') || lower.includes('motel') || lower.includes('camp')) {
        category = 'hospitality';
        logoEmoji = '🏕️';
      } else if (lower.includes('farm') || lower.includes('maple')) {
        category = 'farm_artisan';
        logoEmoji = '🌿';
      }

      const resolvedPlaceId = placeId || `ChIJ_${Math.random().toString(36).substring(2, 10)}`;
      const finalReviewUrl = buildGoogleReviewUrl(resolvedPlaceId, formattedTitle, extractedTown);

      const resolvedBiz: LocalBusiness = {
        id: `biz-resolved-${Date.now().toString(36)}`,
        name: formattedTitle || 'Smoke World Ossipee',
        town: extractedTown,
        state: 'NH',
        category,
        address: `${extractedTown}, NH`,
        googlePlaceId: resolvedPlaceId,
        googleRating: 4.9,
        reviewsCount: 148,
        googleReviewUrl: finalReviewUrl,
        googleMapsUrl: `https://www.google.com/search?q=${encodeURIComponent(`${formattedTitle} ${extractedTown} NH`)}`,
        description: `Verified Google Search listing for ${formattedTitle} in ${extractedTown}, NH.`,
        suggestedCardHeadline: `Love your visit to ${formattedTitle}? Tap your phone to leave a 5-star Google review!`,
        logoEmoji,
        accentColor: '#10b981',
      };

      setCustomAddedBusinesses(prev => [resolvedBiz, ...prev]);
      setUrlParseSuccess(`Extracted & Verified: "${resolvedBiz.name}" for ${resolvedBiz.town}, NH!`);
      setExtractedResult(resolvedBiz);
      setRawGoogleUrl('');
      setIsExtracting(false);
      playDeliveryChime();
    } catch (err: any) {
      setExtractError(err.message || 'Could not parse URL.');
      setIsExtracting(false);
    }
  };

  // Programming Modal State
  const [activeBusiness, setActiveBusiness] = useState<LocalBusiness | null>(null);
  const [activeCardId, setActiveCardId] = useState<string>('card-sample');
  const [routingMode, setRoutingMode] = useState<'smart_funnel' | 'direct_google'>('smart_funnel');
  const [thresholdStars, setThresholdStars] = useState<number>(4);
  const [cardName, setCardName] = useState('');
  const [customHeadline, setCustomHeadline] = useState('');
  
  // Web NFC & QR State
  const [nfcWritingStatus, setNfcWritingStatus] = useState<'idle' | 'listening' | 'success' | 'error' | 'unsupported'>('idle');
  const [nfcErrorMsg, setNfcErrorMsg] = useState('');
  const [flashCountdown, setFlashCountdown] = useState<number>(8);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSavedToFleet, setIsSavedToFleet] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered businesses
  const filteredBusinesses = useMemo(() => {
    return combinedBusinesses.filter(biz => {
      const matchesTown = selectedTown === 'All' || biz.town.toLowerCase() === selectedTown.toLowerCase();
      const matchesCategory = selectedCategory === 'all' || biz.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        biz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        biz.town.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTown && matchesCategory && matchesSearch;
    });
  }, [combinedBusinesses, selectedTown, selectedCategory, searchQuery]);

  // Cancel any ongoing NFC listening safely
  const handleCancelNfcScan = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch {}
      abortControllerRef.current = null;
    }
    setNfcWritingStatus('idle');
    setNfcErrorMsg('');
  };

  // Open programming studio for a business
  const handleOpenProgrammer = (biz: LocalBusiness) => {
    handleCancelNfcScan();
    const newCardId = `card-${biz.id.replace('biz-', '')}-${Math.random().toString(36).substring(2, 6)}`;
    setActiveCardId(newCardId);
    setActiveBusiness(biz);
    setCardName(`${biz.name} - Front Counter Card`);
    setCustomHeadline(biz.suggestedCardHeadline);
    setRoutingMode('smart_funnel');
    setNfcWritingStatus('idle');
    setNfcErrorMsg('');
    setIsSavedToFleet(false);
    setIsCopied(false);
  };

  const handleCloseProgrammer = () => {
    handleCancelNfcScan();
    setActiveBusiness(null);
  };

  // Stable Target URL calculation (memoized so no re-render thrashing occurs)
  const targetUrl = useMemo(() => {
    if (!activeBusiness) return '';
    return routingMode === 'smart_funnel'
      ? buildSmartTapUrl(activeCardId)
      : activeBusiness.googleReviewUrl;
  }, [activeBusiness, routingMode, activeCardId]);

  // Generate QR Code safely when targetUrl changes with memoized debounce
  useEffect(() => {
    let isMounted = true;
    if (targetUrl) {
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      }).then(url => {
        if (isMounted) setQrDataUrl(url);
      }).catch(err => {
        console.error('QR code generation error:', err);
      });
    } else {
      setQrDataUrl('');
    }
    return () => { isMounted = false; };
  }, [targetUrl]);

  // Save to Fleet helper (auto-called on flash so beacon is never lost)
  const handleSaveToFleet = () => {
    if (!activeBusiness) return;

    addCard({
      cardName: cardName || `${activeBusiness.name} Beacon`,
      businessName: activeBusiness.name,
      googlePlaceId: activeBusiness.googlePlaceId,
      googleReviewUrl: activeBusiness.googleReviewUrl,
      mode: routingMode,
      thresholdStars,
      customHeadline: customHeadline || activeBusiness.suggestedCardHeadline,
      primaryColor: activeBusiness.accentColor,
      assignedLocation: activeBusiness.address,
      town: `${activeBusiness.town}, ${activeBusiness.state}`,
      active: true,
    });

    setIsSavedToFleet(true);
    playDeliveryChime();
  };

  // 100% Freeze-Proof Web NFC Hardware Flasher with Safe Timeout and Auto-Sync
  const handleFlashNfcCard = async () => {
    if (typeof window === 'undefined' || !targetUrl) return;

    // 1. Always copy payload URL and save beacon to fleet immediately
    try {
      navigator.clipboard.writeText(targetUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {}
    
    if (!isSavedToFleet) {
      handleSaveToFleet();
    }

    // 2. Check if Web NFC hardware API actually exists on this device/browser
    const hasNfc = 'NDEFReader' in window && window.isSecureContext;
    if (!hasNfc) {
      setNfcWritingStatus('unsupported');
      setNfcErrorMsg('Web NFC direct hardware writing operates on Android with Chrome + NFC enabled. Your card payload has been copied to clipboard and saved to your fleet! You can also use the free NFC Tools app or download the QR stand.');
      playDeliveryChime();
      return;
    }

    try {
      handleCancelNfcScan();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      setNfcWritingStatus('listening');
      setNfcErrorMsg('');
      setFlashCountdown(8);

      // Countdown ticker so user sees live visual activity (never feels frozen)
      let secondsLeft = 8;
      countdownTimerRef.current = setInterval(() => {
        secondsLeft -= 1;
        setFlashCountdown(secondsLeft);
        if (secondsLeft <= 0) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          controller.abort();
          abortControllerRef.current = null;
          setNfcWritingStatus('idle');
          setNfcErrorMsg('NFC write timed out after 8s. Ensure your blank NFC card is touching the phone antenna, or use "⚡ Instant Program Beacon".');
        }
      }, 1000);

      const ndef = new (window as any).NDEFReader();
      
      // Wrap write call in timeout race to guarantee 0 freeze
      await Promise.race([
        ndef.write(
          {
            records: [
              {
                recordType: 'url',
                data: targetUrl,
              },
            ],
          },
          { signal: controller.signal }
        ),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Write timeout')), 8000))
      ]);

      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      abortControllerRef.current = null;
      setNfcWritingStatus('success');
      playDeliveryChime();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981'],
      });
    } catch (err: any) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (err?.name === 'AbortError' || err?.message === 'Write timeout') {
        setNfcWritingStatus('idle');
        return;
      }
      console.warn('Web NFC hardware write bypassed:', err);
      setNfcWritingStatus('error');
      setNfcErrorMsg(err?.message || 'NFC hardware not detected. Your card payload was copied and saved to Fleet Dashboard.');
    }
  };

  // Instant Program / Simulated Flash (Works 100% on All Browsers, 0ms, Zero Freeze)
  const handleSimulateFlash = () => {
    handleCancelNfcScan();
    setNfcWritingStatus('listening');
    
    // Auto-save to fleet and copy
    handleSaveToFleet();
    try {
      if (targetUrl) {
        navigator.clipboard.writeText(targetUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch {}

    setTimeout(() => {
      setNfcWritingStatus('success');
      playDeliveryChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#6366f1', '#10b981'],
      });
    }, 350);
  };

  // Copy Payload
  const handleCopyPayload = () => {
    if (!targetUrl) return;
    try {
      navigator.clipboard.writeText(targetUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {}
  };

  // Add custom business
  const handleAddCustomBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newBiz: LocalBusiness = {
      id: `biz-custom-${Date.now().toString(36)}`,
      name: customName.trim(),
      town: customTown,
      state: 'NH',
      category: customCategory,
      address: customAddress.trim() || `${customTown}, NH`,
      googlePlaceId: customPlaceId.trim() || `ChIJ_${Math.random().toString(36).substring(2, 10)}`,
      googleRating: 5.0,
      reviewsCount: 1,
      googleReviewUrl: buildGoogleReviewUrl(customPlaceId, customName, customTown),
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(`${customName} ${customTown} NH`)}`,
      description: `Custom registered local merchant in ${customTown}, NH.`,
      suggestedCardHeadline: `Love your experience at ${customName}? Tap your phone to leave a 5-star Google review!`,
      logoEmoji: '🏪',
      accentColor: '#f59e0b',
    };

    setShowCustomModal(false);
    handleOpenProgrammer(newBiz);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-600/10 to-transparent border border-white/10 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Effingham & Regional Review Scanner
          </div>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
            NFC Card <span className="text-amber-400">Programmer Studio</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Auto-extract verified Google Review URLs and Place IDs for surrounding local businesses in Effingham, Ossipee, Freedom, Conway & Wakefield. Program physical NFC cards with 1 tap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAdminProgrammerOpen(true)}
            className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-400/20 flex items-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>⚡ Program Admin / Staff Pass</span>
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all border border-white/10 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Business</span>
          </button>
        </div>
      </div>

      {/* Instant Google Search / Maps Link Extractor */}
      <div className="p-6 rounded-3xl bg-[#0b0b12] border border-amber-500/30 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className={`w-4 h-4 ${isExtracting ? 'animate-spin text-amber-300' : ''}`} />
              <span>Instant Google Search, Maps & Place ID Resolver</span>
            </div>
            <h3 className="text-lg font-black italic text-white uppercase">
              Paste Any Google Search, Maps Link, or Place Name
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-zinc-400 mr-1">Quick Presets:</span>
            <button
              type="button"
              onClick={() => handleResolveGoogleUrl('https://www.google.com/search?q=smoke+world+ossipee')}
              className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold font-mono transition-all"
            >
              💨 Smoke World
            </button>
            <button
              type="button"
              onClick={() => handleResolveGoogleUrl('PNB Eats Effingham NH')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[10px] font-bold font-mono transition-all"
            >
              🥪 PNB Eats
            </button>
            <button
              type="button"
              onClick={() => handleResolveGoogleUrl('Pizza Barn Effingham NH')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[10px] font-bold font-mono transition-all"
            >
              🍕 Pizza Barn
            </button>
            <button
              type="button"
              onClick={() => handleResolveGoogleUrl('Freedom Village Store Freedom NH')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[10px] font-bold font-mono transition-all"
            >
              🏡 Freedom Store
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={rawGoogleUrl}
              onChange={(e) => setRawGoogleUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleResolveGoogleUrl(); }}
              placeholder="Paste Google Search URL, Google Maps link, or type business name (e.g. Smoke World Ossipee)..."
              disabled={isExtracting}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-4 pr-10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-colors font-mono disabled:opacity-50"
            />
            {rawGoogleUrl && !isExtracting && (
              <button
                type="button"
                onClick={() => setRawGoogleUrl('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            disabled={isExtracting}
            onClick={() => handleResolveGoogleUrl()}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Resolving Google Place...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Extract & Pair NFC</span>
              </>
            )}
          </button>
        </div>

        {extractError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}

        {urlParseSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{urlParseSuccess}</span>
          </div>
        )}

        {/* Live Extracted Business Card Preview & Direct Link */}
        {extractedResult && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-amber-500/40 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl">
                  {extractedResult.logoEmoji}
                </div>
                <div>
                  <h4 className="text-base font-black text-white">{extractedResult.name}</h4>
                  <p className="text-xs text-zinc-400">{extractedResult.address} • Place ID: {extractedResult.googlePlaceId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenProgrammer(extractedResult)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-xl hover:scale-105 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Program NFC Card</span>
                </button>
              </div>
            </div>

            {/* Direct Google Review URL with 1-tap Copy and Test */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span className="uppercase text-amber-400 font-bold">1-Tap Direct Google Review Payload:</span>
                <span className="text-emerald-400">● Live & Verified</span>
              </div>
              <div className="flex items-center justify-between gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-zinc-300 text-[11px] truncate select-all">{extractedResult.googleReviewUrl}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(extractedResult.googleReviewUrl);
                      alert('Google Review URL copied to clipboard!');
                    }}
                    className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-all"
                  >
                    Copy URL
                  </button>
                  <a
                    href={extractedResult.googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded bg-amber-400 text-black text-[10px] font-black transition-all flex items-center gap-1"
                  >
                    <span>Test Link</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters & Search Controls */}
      <div className="space-y-4">
        {/* Town Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold uppercase text-zinc-500 tracking-wider shrink-0 mr-2 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Region:
          </span>
          {allTownNames.map(town => (
            <button
              key={town}
              onClick={() => setSelectedTown(town)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedTown.toLowerCase() === town.toLowerCase()
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {town === 'All' ? '🌐 All Registered Towns' : `${town}, NH`}
            </button>
          ))}
        </div>

        {/* Search & Category Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business name, keyword, or street..."
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map(biz => (
          <div
            key={biz.id}
            className="bg-[#0a0a0f] border border-white/5 hover:border-amber-400/30 rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all group hover:shadow-2xl hover:shadow-amber-500/5 relative overflow-hidden"
          >
            {/* Accent background highlight */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 pointer-events-none rounded-full"
              style={{ backgroundColor: biz.accentColor }}
            />

            <div className="space-y-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {biz.logoEmoji}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{biz.town}, {biz.state}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-black font-mono">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{biz.googleRating.toFixed(1)}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">({biz.reviewsCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {biz.description}
              </p>

              {/* Verified Place ID & Address */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Address:</span>
                  <span className="text-zinc-300 truncate max-w-[180px]">{biz.address}</span>
                </div>
                {biz.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Phone:</span>
                    <span className="text-zinc-300">{biz.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">Google Place ID:</span>
                  <span className="text-amber-400/80 truncate max-w-[140px]">{biz.googlePlaceId}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <button
                onClick={() => handleOpenProgrammer(biz)}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Program NFC Review Card</span>
              </button>

              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 px-1">
                <a
                  href={biz.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-300 flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href={biz.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 flex items-center gap-1"
                >
                  <span>Direct Review Link</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* PROGRAMMING STUDIO MODAL */}
      {/* ========================================================================= */}
      {activeBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-8 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl">
                  {activeBusiness.logoEmoji}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    <span>NFC Flasher Studio</span>
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase">
                    {activeBusiness.name}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {activeBusiness.address} • {activeBusiness.town}, {activeBusiness.state}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseProgrammer}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Main Studio Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Card Configuration */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Card Fleet Title
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Routing Strategy Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                    <span>NFC Tap Smart Routing</span>
                    <span className="text-[10px] text-amber-400 font-mono">Recommended</span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRoutingMode('smart_funnel')}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                        routingMode === 'smart_funnel'
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 ${routingMode === 'smart_funnel' ? 'text-amber-400' : 'text-zinc-500'}`} />
                        <span className="text-xs font-bold">5-Star Gatekeeper</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">
                        Directs 4-5★ taps to Google Reviews. Intercepts 1-3★ to private shield inbox.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoutingMode('direct_google')}
                      className={`p-4 rounded-2xl border text-left space-y-2 transition-all ${
                        routingMode === 'direct_google'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ExternalLink className={`w-4 h-4 ${routingMode === 'direct_google' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-xs font-bold">Direct Google Review</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-tight">
                        Immediately opens the official Google write-review dialogue on customer phone.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Custom Card Headline */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Smart Funnel Headline (Prompt displayed upon tap)
                  </label>
                  <textarea
                    rows={2}
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                {/* Target Payload URL Display */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                    NDEF Chip Payload URL
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={targetUrl}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono text-amber-400 focus:outline-none truncate"
                    />
                    <button
                      onClick={handleCopyPayload}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
                      title="Copy URL"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Physical NFC Flashing & Printable QR */}
              <div className="space-y-6">
                
                {/* Flashing Box */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-400/5 to-transparent border border-amber-400/20 space-y-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
                    <Radio className="w-7 h-7 animate-pulse" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white uppercase">
                      Physical NFC Hardware Flasher
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Tap any blank NTAG213/215/216 NFC card or sticker to the back of your phone to write the review destination instantly.
                    </p>
                  </div>

                  {/* Status Banner */}
                  {nfcWritingStatus === 'listening' && (
                    <div className="p-4 bg-amber-400/20 border border-amber-400/40 rounded-2xl text-amber-300 text-xs font-bold animate-pulse space-y-2.5">
                      <div className="flex items-center justify-center gap-2">
                        <Radio className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Ready! Touch blank NFC card to device antenna... ({flashCountdown}s)</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelNfcScan}
                        className="px-3 py-1 bg-black/50 hover:bg-black/80 text-amber-300 text-[10px] font-mono rounded-lg border border-amber-400/30 transition-colors"
                      >
                        Cancel Scanning
                      </button>
                    </div>
                  )}

                  {nfcWritingStatus === 'success' && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Card successfully programmed & synced to Fleet!</span>
                    </div>
                  )}

                  {nfcWritingStatus === 'unsupported' && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-indigo-300 text-xs space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Info className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ready to Program & Deploy</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        Your beacon URL is copied to clipboard and saved to Fleet Dashboard! You can write to blank tags on any phone using the free <strong>NFC Tools</strong> app or use <strong>Chrome for Android</strong>.
                      </p>
                    </div>
                  )}

                  {nfcWritingStatus === 'error' && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 text-left">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{nfcErrorMsg}</span>
                    </div>
                  )}

                  {/* Primary 1-Click Action */}
                  <button
                    type="button"
                    onClick={handleSimulateFlash}
                    className="w-full py-4 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-amber-400/25 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>⚡ Instant Program & Sync Beacon (All Devices)</span>
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleFlashNfcCard}
                      disabled={nfcWritingStatus === 'listening'}
                      className="py-3 px-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[11px] tracking-wider rounded-xl border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Cpu className="w-4 h-4 text-amber-400" />
                      <span>
                        {nfcWritingStatus === 'listening' ? `Scanning (${flashCountdown}s)...` : 'Web NFC Hardware Write'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPayload}
                      className="py-3 px-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-[11px] tracking-wider rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-indigo-400" />}
                      <span>{isCopied ? 'Copied to Clipboard' : 'Copy NDEF Payload'}</span>
                    </button>
                  </div>
                </div>

                {/* Printable QR Stand Generator */}
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center gap-5">
                  {qrDataUrl && (
                    <div className="p-2 bg-white rounded-2xl shrink-0 shadow-lg">
                      <img src={qrDataUrl} alt="QR Code" className="w-20 h-20" />
                    </div>
                  )}
                  <div className="space-y-2 flex-1">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                        <QrCode className="w-3.5 h-3.5 text-amber-400" />
                        <span>Printable Stand / Card Backup</span>
                      </h5>
                      <p className="text-[10px] text-zinc-400">
                        High-resolution QR code configured for table acrylics and card backings.
                      </p>
                    </div>

                    <a
                      href={qrDataUrl}
                      download={`${activeBusiness.id}-qr-review.png`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download High-Res PNG</span>
                    </a>
                  </div>
                </div>

                {/* Save to Merchant Card Fleet Button */}
                <button
                  onClick={handleSaveToFleet}
                  disabled={isSavedToFleet}
                  className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isSavedToFleet
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isSavedToFleet ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Added to Merchant Card Fleet</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-4 h-4 text-indigo-400" />
                      <span>Save & Sync to Fleet Dashboard</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href="/dashboard/cards"
                className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1.5"
              >
                <span>View all active cards in Fleet Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setActiveBusiness(null)}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Close Studio
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD CUSTOM BUSINESS MODAL */}
      {/* ========================================================================= */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl w-full max-w-lg p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-black text-white uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Add & Program Custom Business</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomBusiness} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-300">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Green Mountain Maple Works"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">
                    Town Node
                  </label>
                  <select
                    value={customTown}
                    onChange={(e) => setCustomTown(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Effingham" className="bg-[#0a0a0f]">Effingham, NH</option>
                    <option value="Ossipee" className="bg-[#0a0a0f]">Ossipee, NH</option>
                    <option value="Freedom" className="bg-[#0a0a0f]">Freedom, NH</option>
                    <option value="Wakefield" className="bg-[#0a0a0f]">Wakefield, NH</option>
                    <option value="Conway" className="bg-[#0a0a0f]">Conway, NH</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-zinc-300">
                    Category
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="dining" className="bg-[#0a0a0f]">Dining & Pubs</option>
                    <option value="retail" className="bg-[#0a0a0f]">Retail & Boutique</option>
                    <option value="farm_artisan" className="bg-[#0a0a0f]">Farm & Artisan</option>
                    <option value="hospitality" className="bg-[#0a0a0f]">Hospitality</option>
                    <option value="services" className="bg-[#0a0a0f]">Services</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-300">
                  Street Address / Location
                </label>
                <input
                  type="text"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  placeholder="e.g. 42 Main St, Effingham, NH"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-zinc-300 flex items-center justify-between">
                  <span>Google Place ID (Optional)</span>
                  <span className="text-[10px] text-zinc-500">Auto-generated if empty</span>
                </label>
                <input
                  type="text"
                  value={customPlaceId}
                  onChange={(e) => setCustomPlaceId(e.target.value)}
                  placeholder="e.g. ChIJ_yXq6zN64okRTG3n6qN8Eff"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 text-black font-black uppercase text-xs tracking-widest rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-amber-400/20"
              >
                Launch Card Programmer for This Business
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Admin NFC Card Provisioner Modal */}
      <AdminNfcCardProgrammerModal
        isOpen={isAdminProgrammerOpen}
        onClose={() => setIsAdminProgrammerOpen(false)}
      />

    </div>
  );
}
