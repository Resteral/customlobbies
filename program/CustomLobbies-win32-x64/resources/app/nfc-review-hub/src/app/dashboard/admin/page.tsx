'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { 
  NfcMenuProduct, NfcHardwareOrder, NfcFormFactor, 
  MerchantStorefront, StorefrontProduct,
  ManagedServicePackage, ClientServiceSubscription, ServiceAutomationBot, ServiceCategory,
  NfcCardConfig, NfcCardProfileType
} from '@/lib/types';
import {
  buildCardTargetUrl,
  generateVCard30,
  generateWifiNdefString,
  formatPayloadForNfcTools,
  exportCardsAsCsv,
  triggerFileDownload,
  writeNfcWithWebNfc,
  scanNfcWithWebNfc
} from '@/lib/nfc-programmer-utils';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  Crown, Cpu, CreditCard, ShoppingBag, Store, Plus, 
  Check, X, Flame, Search, ArrowRight, Radio, ShieldCheck, 
  Trash2, Edit3, ExternalLink, Printer, QrCode, Sparkles, 
  Layers, Package, Truck, DollarSign, Clock, RefreshCw, 
  AlertCircle, ChevronRight, Settings, Eye, EyeOff, Tag,
  Bot, Zap, Play, CheckCircle2, UserCheck, Briefcase, Star,
  Smartphone, MessageSquare, ShieldAlert, Calendar, Users,
  Copy, Download, Share2, FileText, Wifi, Gift, Ticket,
  MapPin, User, Mail, Globe, Building2, HardDrive, Sliders, FileCode,
  Lock, KeyRound
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    currentUser,
    isAdmin,
    authenticateUser,
    cards,
    addCard,
    updateCard,
    deleteCard,
    nfcMenuProducts, 
    nfcHardwareOrders,
    storefronts,
    managedServices,
    clientSubscriptions,
    automationBots,
    addNfcMenuProduct,
    updateNfcMenuProduct,
    deleteNfcMenuProduct,
    toggleNfcMenuProductPublish,
    addNfcHardwareOrder,
    updateNfcHardwareOrderStatus,
    toggleStorefrontProductStock,
    updateStorefrontProductPrice,
    addStorefrontProduct,
    addManagedService,
    updateManagedService,
    deleteManagedService,
    enrollClientSubscription,
    updateClientSubscriptionStatus,
    toggleAutomationBot,
    triggerAutomationBotManual,
    playDeliveryChime,
    userMembership
  } = useNfcStore();

  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'sell_nfc_menus' | 'nfc_writer' | 'hardware_orders' | 'menu_stock_controller' | 'automation_bots' | 'managed_services'
  >('sell_nfc_menus');

  // Filter & Search states
  const [selectedFormFactor, setSelectedFormFactor] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showCreateProductModal, setShowCreateProductModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<NfcMenuProduct | null>(null);
  const [printQrDataUrl, setPrintQrDataUrl] = useState<string>('');
  const [showFlashModal, setShowFlashModal] = useState<NfcMenuProduct | null>(null);
  const [showEnrollClientModal, setShowEnrollClientModal] = useState<boolean>(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState<boolean>(false);

  // Web NFC Flasher State
  const [writerSelectedStore, setWriterSelectedStore] = useState<string>(storefronts[0]?.slug || 'oasis-roastery-bakehouse');
  const [writerTableNumber, setWriterTableNumber] = useState<string>('');
  const [writerCustomUrl, setWriterCustomUrl] = useState<string>('');
  const [isNfcWriting, setIsNfcWriting] = useState<boolean>(false);
  const [nfcWriteSuccess, setNfcWriteSuccess] = useState<boolean>(false);
  const [nfcWriteError, setNfcWriteError] = useState<string | null>(null);
  const [writerQrCodeUrl, setWriterQrCodeUrl] = useState<string>('');

  // Menu Stock Controller State
  const [stockSelectedStoreId, setStockSelectedStoreId] = useState<string>(storefronts[0]?.id || 'sf-oasis-roastery');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState<string>('');
  const [showAddMenuItemModal, setShowAddMenuItemModal] = useState<boolean>(false);

  // Form states for creating new NFC product
  const [newProdTitle, setNewProdTitle] = useState<string>('');
  const [newProdSubtitle, setNewProdSubtitle] = useState<string>('');
  const [newProdDesc, setNewProdDesc] = useState<string>('');
  const [newProdStoreSlug, setNewProdStoreSlug] = useState<string>(storefronts[0]?.slug || 'oasis-roastery-bakehouse');
  const [newProdTable, setNewProdTable] = useState<string>('');
  const [newProdFormFactor, setNewProdFormFactor] = useState<NfcFormFactor>('acrylic_table_stand');
  const [newProdChipType, setNewProdChipType] = useState<'NTAG213' | 'NTAG215' | 'NTAG216'>('NTAG215');
  const [newProdPrice, setNewProdPrice] = useState<string>('24.99');
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<string>('39.99');
  const [newProdInventory, setNewProdInventory] = useState<string>('50');
  const [newProdBadge, setNewProdBadge] = useState<string>('★ New Release');
  const [newProdImage, setNewProdImage] = useState<string>('https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80');
  const [newProdAccent, setNewProdAccent] = useState<string>('#f59e0b');
  const [newProdFeatures, setNewProdFeatures] = useState<string>('Pre-loaded with live menu URL\nHigh-density NFC microchip\nWeatherproof & scratch-resistant\nNo app required for diners');

  // Form states for adding new dish to restaurant
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishDesc, setNewDishDesc] = useState<string>('');
  const [newDishPrice, setNewDishPrice] = useState<string>('14.99');
  const [newDishCategory, setNewDishCategory] = useState<string>('Chef Specials');
  const [newDishImage, setNewDishImage] = useState<string>('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80');
  const [newDishCalories, setNewDishCalories] = useState<string>('650 cal');
  const [newDishBadge, setNewDishBadge] = useState<string>('Chef Special');

  // Form states for enrolling a new client
  const [clientBizName, setClientBizName] = useState<string>('');
  const [clientContactName, setClientContactName] = useState<string>('');
  const [clientContactPhone, setClientContactPhone] = useState<string>('');
  const [clientTown, setClientTown] = useState<string>('Effingham, NH');
  const [clientPackageId, setClientPackageId] = useState<string>(managedServices[0]?.id || 'srv-reputation-engine');
  const [clientCustomFee, setClientCustomFee] = useState<string>('99.00');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Form states for creating a new managed service
  const [newSrvName, setNewSrvName] = useState<string>('');
  const [newSrvTagline, setNewSrvTagline] = useState<string>('');
  const [newSrvDesc, setNewSrvDesc] = useState<string>('');
  const [newSrvCategory, setNewSrvCategory] = useState<ServiceCategory>('reputation_reviews');
  const [newSrvMonthly, setNewSrvMonthly] = useState<string>('99.00');
  const [newSrvSetup, setNewSrvSetup] = useState<string>('49.00');
  const [newSrvDeliverables, setNewSrvDeliverables] = useState<string>('Custom NFC Hardware Included\nAutomated Customer Follow-up SMS\nMonthly Growth Report');
  const [newSrvAutomations, setNewSrvAutomations] = useState<string>('Auto-Review Dispatcher\nNegative Feedback Shield');
  const [newSrvRecommended, setNewSrvRecommended] = useState<string>('Local Retail, Dining & Services');
  const [newSrvEmoji, setNewSrvEmoji] = useState<string>('⚡');

  // =========================================================================
  // NFC CARD FLEET & OFFLINE PROGRAMMER HUB STATE
  // =========================================================================
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');
  const [cardProfileFilter, setCardProfileFilter] = useState<'all' | NfcCardProfileType>('all');
  const [cardTownFilter, setCardTownFilter] = useState<string>('all');
  const [cardFormFactorFilter, setCardFormFactorFilter] = useState<string>('all');

  // Modals for Cards
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<NfcCardConfig | null>(null);
  const [activeOfflineModalCard, setActiveOfflineModalCard] = useState<NfcCardConfig | null>(null);
  const [offlineQrDataUrl, setOfflineQrDataUrl] = useState<string>('');
  const [activeSimulateModalCard, setActiveSimulateModalCard] = useState<NfcCardConfig | null>(null);
  const [activeWebNfcModalCard, setActiveWebNfcModalCard] = useState<NfcCardConfig | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Web NFC Tag Scanner State
  const [isScanningTag, setIsScanningTag] = useState<boolean>(false);
  const [scannedTagResult, setScannedTagResult] = useState<{ serialNumber: string; records: string[] } | null>(null);
  const [scanTagError, setScanTagError] = useState<string | null>(null);

  // Card Form Fields
  const [formProfileType, setFormProfileType] = useState<NfcCardProfileType>('digital_biz_card');
  const [formCardName, setFormCardName] = useState<string>('');
  const [formBusinessName, setFormBusinessName] = useState<string>('');
  const [formTown, setFormTown] = useState<string>('Effingham, NH');
  const [formFormFactor, setFormFormFactor] = useState<NfcCardConfig['hardwareFormFactor']>('pvc_card');
  const [formChipType, setFormChipType] = useState<NfcCardConfig['chipType']>('NTAG215');
  const [formChipUid, setFormChipUid] = useState<string>('');
  const [formBatchId, setFormBatchId] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');

  // Profile-specific inputs
  const [formContactFullName, setFormContactFullName] = useState<string>('');
  const [formContactTitle, setFormContactTitle] = useState<string>('');
  const [formContactCompany, setFormContactCompany] = useState<string>('');
  const [formContactPhone, setFormContactPhone] = useState<string>('');
  const [formContactEmail, setFormContactEmail] = useState<string>('');
  const [formContactWebsite, setFormContactWebsite] = useState<string>('');
  const [formContactAddress, setFormContactAddress] = useState<string>('');
  const [formContactLinkedIn, setFormContactLinkedIn] = useState<string>('');
  const [formContactInstagram, setFormContactInstagram] = useState<string>('');
  const [formContactBio, setFormContactBio] = useState<string>('');

  const [formGoogleReviewUrl, setFormGoogleReviewUrl] = useState<string>('');
  const [formGooglePlaceId, setFormGooglePlaceId] = useState<string>('');
  const [formMode, setFormMode] = useState<NfcCardConfig['mode']>('smart_funnel');
  const [formThresholdStars, setFormThresholdStars] = useState<number>(4);
  const [formCustomHeadline, setFormCustomHeadline] = useState<string>('');

  const [formStorefrontSlug, setFormStorefrontSlug] = useState<string>(storefronts[0]?.slug || 'pnb-eats');
  const [formTableNumber, setFormTableNumber] = useState<string>('');

  const [formLoyaltyWalletId, setFormLoyaltyWalletId] = useState<string>('');
  const [formPointsMultiplier, setFormPointsMultiplier] = useState<number>(2);
  const [formMysteryDiscountCode, setFormMysteryDiscountCode] = useState<string>('LOCALVIP15');

  const [formEventName, setFormEventName] = useState<string>('');
  const [formTicketTier, setFormTicketTier] = useState<NfcCardConfig['ticketTier']>('VIP');
  const [formTicketId, setFormTicketId] = useState<string>('');

  const [formWifiSsid, setFormWifiSsid] = useState<string>('');
  const [formWifiPassword, setFormWifiPassword] = useState<string>('');
  const [formWifiAuthType, setFormWifiAuthType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [formCabinHouseGuideUrl, setFormCabinHouseGuideUrl] = useState<string>('');

  const [formHuntBeaconId, setFormHuntBeaconId] = useState<string>('');
  const [formHuntSecretPerk, setFormHuntSecretPerk] = useState<string>('');

  const [formDirectTargetUrl, setFormDirectTargetUrl] = useState<string>('');
  const [formLogoUrl, setFormLogoUrl] = useState<string>('⚡');
  const [formPrimaryColor, setFormPrimaryColor] = useState<string>('#f59e0b');
  const [formAssignedLocation, setFormAssignedLocation] = useState<string>('');
  const [formAssignedStaff, setFormAssignedStaff] = useState<string>('');

  // Toast feedback helper
  const showCopied = (msg: string) => {
    setCopiedToast(msg);
    setTimeout(() => setCopiedToast(null), 3000);
  };

  // Selected Storefronts helpers
  const currentWriterStore = useMemo(() => {
    return storefronts.find(s => s.slug === writerSelectedStore) || storefronts[0];
  }, [storefronts, writerSelectedStore]);

  const currentStockStore = useMemo(() => {
    return storefronts.find(s => s.id === stockSelectedStoreId) || storefronts[0];
  }, [storefronts, stockSelectedStoreId]);

  // Computed live writer target URL
  const targetLiveUrl = useMemo(() => {
    if (writerCustomUrl.trim()) return writerCustomUrl.trim();
    if (typeof window !== 'undefined') {
      const base = window.location.origin;
      const tableParam = writerTableNumber.trim() ? `?table=${encodeURIComponent(writerTableNumber.trim())}` : '';
      return `${base}/site/${writerSelectedStore}${tableParam}`;
    }
    return `https://townraise.org/site/${writerSelectedStore}`;
  }, [writerSelectedStore, writerTableNumber, writerCustomUrl]);

  // Generate QR for writer
  useEffect(() => {
    QRCode.toDataURL(targetLiveUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    }).then(url => setWriterQrCodeUrl(url)).catch(() => {});
  }, [targetLiveUrl]);

  // Generate QR for printable modal
  useEffect(() => {
    if (showPrintModal && typeof window !== 'undefined') {
      const tentUrl = showPrintModal.menuUrl.startsWith('http') 
        ? showPrintModal.menuUrl 
        : `${window.location.origin}/site/${showPrintModal.targetRestaurantSlug}`;
      QRCode.toDataURL(tentUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => setPrintQrDataUrl(url)).catch(() => {});
    }
  }, [showPrintModal]);

  // Generate QR for offline specs modal
  useEffect(() => {
    if (activeOfflineModalCard && typeof window !== 'undefined') {
      const targetUrl = buildCardTargetUrl(activeOfflineModalCard);
      QRCode.toDataURL(targetUrl, {
        width: 400,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      }).then(url => setOfflineQrDataUrl(url)).catch(() => {});
    }
  }, [activeOfflineModalCard]);

  // Filtered Cards Fleet
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchProfile = cardProfileFilter === 'all' || (card.profileType || 'google_review_booster') === cardProfileFilter;
      const matchTown = cardTownFilter === 'all' || (card.town || 'Effingham, NH').toLowerCase().includes(cardTownFilter.toLowerCase());
      const matchForm = cardFormFactorFilter === 'all' || (card.hardwareFormFactor || 'pvc_card') === cardFormFactorFilter;
      const matchQuery = !cardSearchQuery || 
        card.cardName.toLowerCase().includes(cardSearchQuery.toLowerCase()) ||
        card.businessName.toLowerCase().includes(cardSearchQuery.toLowerCase()) ||
        (card.chipUid && card.chipUid.toLowerCase().includes(cardSearchQuery.toLowerCase())) ||
        (card.assignedStaff && card.assignedStaff.toLowerCase().includes(cardSearchQuery.toLowerCase())) ||
        (card.assignedLocation && card.assignedLocation.toLowerCase().includes(cardSearchQuery.toLowerCase())) ||
        (card.contactFullName && card.contactFullName.toLowerCase().includes(cardSearchQuery.toLowerCase()));
      return matchProfile && matchTown && matchForm && matchQuery;
    });
  }, [cards, cardProfileFilter, cardTownFilter, cardFormFactorFilter, cardSearchQuery]);

  // Card KPI Metrics
  const cardFleetStats = useMemo(() => {
    const totalTaps = cards.reduce((acc, c) => acc + (c.totalTaps || 0), 0);
    const totalConversions = cards.reduce((acc, c) => acc + (c.googleConversions || 0), 0);
    const activeBeacons = cards.filter(c => c.active).length;
    return { totalTaps, totalConversions, activeBeacons };
  }, [cards]);

  // Open Card Modal Handlers
  const openCreateCardModal = (presetType?: NfcCardProfileType) => {
    setEditingCard(null);
    const pType = presetType || 'digital_biz_card';
    setFormProfileType(pType);
    setFormCardName(
      pType === 'digital_biz_card' ? 'Executive Digital NFC Business Card' :
      pType === 'google_review_booster' ? '5-Star Review Counter Beacon' :
      pType === 'menu_tap_to_order' ? 'Tabletop 1 Tap Menu Stand' :
      pType === 'airbnb_wifi_plaque' ? 'Lakehouse Guest 1-Tap Wi-Fi Plaque' :
      pType === 'event_vip_pass' ? 'VIP All-Access Pass 2026' :
      pType === 'scavenger_hunt_beacon' ? 'Store Crawl Secret Perk Beacon' :
      pType === 'loyalty_rewards' ? 'VIP Patron Rewards FOB' :
      'Universal Direct Link Beacon'
    );
    setFormBusinessName('Townraise Merchant Partner');
    setFormTown('Effingham, NH');
    setFormFormFactor(
      pType === 'menu_tap_to_order' || pType === 'google_review_booster' ? 'acrylic_stand' :
      pType === 'airbnb_wifi_plaque' ? 'wood_plaque' :
      pType === 'event_vip_pass' ? 'badge_lanyard' :
      pType === 'loyalty_rewards' ? 'keychain_fob' :
      pType === 'scavenger_hunt_beacon' ? 'disc_sticker' : 'pvc_card'
    );
    setFormChipType('NTAG215');
    setFormChipUid(`04:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:80`);
    setFormBatchId(`BATCH-${new Date().getFullYear()}-01`);
    setFormNotes('Flushed & encoded by Sean Martin in Effingham Programming Lab');
    setFormContactFullName('Sean Martin');
    setFormContactTitle('Lead Operator & Systems Engineer');
    setFormContactCompany('Townraise NH Labs');
    setFormContactPhone('508-507-0305');
    setFormContactEmail('frijj555@gmail.com');
    setFormContactWebsite('https://townraise.org');
    setFormContactAddress('Effingham, NH');
    setFormContactLinkedIn('https://linkedin.com/in/sean-martin-nh');
    setFormContactInstagram('https://instagram.com/townraise_nh');
    setFormContactBio('Building sovereign local economy nodes, decentralized commerce dispatch, and custom programmable NFC hardware across Carroll County.');
    setFormGoogleReviewUrl('https://townraise.org/contact');
    setFormGooglePlaceId('');
    setFormMode('smart_funnel');
    setFormThresholdStars(4);
    setFormCustomHeadline('Tap your phone to connect, review, or order!');
    setFormStorefrontSlug(storefronts[0]?.slug || 'pnb-eats');
    setFormTableNumber('Table 1');
    setFormLoyaltyWalletId(`WALLET-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPointsMultiplier(2);
    setFormMysteryDiscountCode('TOWNVIP15');
    setFormEventName('Carroll County Community Festival');
    setFormTicketTier('VIP');
    setFormTicketId(`PASS-${Math.floor(100 + Math.random() * 900)}`);
    setFormWifiSsid('CabinGuest_WiFi_5G');
    setFormWifiPassword('Ossipee2026!');
    setFormWifiAuthType('WPA');
    setFormCabinHouseGuideUrl('https://townraise.org/courier');
    setFormHuntBeaconId(`beacon-${Math.random().toString(36).substring(2, 7)}`);
    setFormHuntSecretPerk('15% Off Your Next Local Order');
    setFormDirectTargetUrl('https://townraise.org');
    setFormLogoUrl('👑');
    setFormPrimaryColor('#f59e0b');
    setFormAssignedLocation('Main Counter');
    setFormAssignedStaff('Sean Martin');
    setShowCardModal(true);
  };

  const openEditCardModal = (card: NfcCardConfig) => {
    setEditingCard(card);
    setFormProfileType(card.profileType || 'google_review_booster');
    setFormCardName(card.cardName);
    setFormBusinessName(card.businessName);
    setFormTown(card.town || 'Effingham, NH');
    setFormFormFactor(card.hardwareFormFactor || 'pvc_card');
    setFormChipType(card.chipType || 'NTAG215');
    setFormChipUid(card.chipUid || '');
    setFormBatchId(card.batchId || '');
    setFormNotes(card.notes || '');
    setFormContactFullName(card.contactFullName || '');
    setFormContactTitle(card.contactTitle || '');
    setFormContactCompany(card.contactCompany || '');
    setFormContactPhone(card.contactPhone || '');
    setFormContactEmail(card.contactEmail || '');
    setFormContactWebsite(card.contactWebsite || '');
    setFormContactAddress(card.contactAddress || '');
    setFormContactLinkedIn(card.contactLinkedIn || '');
    setFormContactInstagram(card.contactInstagram || '');
    setFormContactBio(card.contactBio || '');
    setFormGoogleReviewUrl(card.googleReviewUrl || '');
    setFormGooglePlaceId(card.googlePlaceId || '');
    setFormMode(card.mode || 'smart_funnel');
    setFormThresholdStars(card.thresholdStars || 4);
    setFormCustomHeadline(card.customHeadline || '');
    setFormStorefrontSlug(card.storefrontSlug || storefronts[0]?.slug || 'pnb-eats');
    setFormTableNumber(card.tableNumber || '');
    setFormLoyaltyWalletId(card.loyaltyWalletId || '');
    setFormPointsMultiplier(card.pointsMultiplier || 1);
    setFormMysteryDiscountCode(card.mysteryDiscountCode || '');
    setFormEventName(card.eventName || '');
    setFormTicketTier(card.ticketTier || 'VIP');
    setFormTicketId(card.ticketId || '');
    setFormWifiSsid(card.wifiSsid || '');
    setFormWifiPassword(card.wifiPassword || '');
    setFormWifiAuthType(card.wifiAuthType || 'WPA');
    setFormCabinHouseGuideUrl(card.cabinHouseGuideUrl || '');
    setFormHuntBeaconId(card.huntBeaconId || '');
    setFormHuntSecretPerk(card.huntSecretPerk || '');
    setFormDirectTargetUrl(card.directTargetUrl || '');
    setFormLogoUrl(card.logoUrl || '⭐');
    setFormPrimaryColor(card.primaryColor || '#f59e0b');
    setFormAssignedLocation(card.assignedLocation || '');
    setFormAssignedStaff(card.assignedStaff || '');
    setShowCardModal(true);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<NfcCardConfig> = {
      cardName: formCardName.trim() || 'Custom Beacon',
      businessName: formBusinessName.trim() || 'Merchant Partner',
      profileType: formProfileType,
      hardwareFormFactor: formFormFactor,
      chipType: formChipType,
      chipUid: formChipUid.trim(),
      batchId: formBatchId.trim(),
      notes: formNotes.trim(),
      town: formTown,
      contactFullName: formContactFullName.trim(),
      contactTitle: formContactTitle.trim(),
      contactCompany: formContactCompany.trim(),
      contactPhone: formContactPhone.trim(),
      contactEmail: formContactEmail.trim(),
      contactWebsite: formContactWebsite.trim(),
      contactAddress: formContactAddress.trim(),
      contactLinkedIn: formContactLinkedIn.trim(),
      contactInstagram: formContactInstagram.trim(),
      contactBio: formContactBio.trim(),
      googleReviewUrl: formGoogleReviewUrl.trim() || 'https://townraise.org',
      googlePlaceId: formGooglePlaceId.trim(),
      mode: formMode,
      thresholdStars: formThresholdStars,
      customHeadline: formCustomHeadline.trim(),
      storefrontSlug: formStorefrontSlug,
      tableNumber: formTableNumber.trim(),
      loyaltyWalletId: formLoyaltyWalletId.trim(),
      pointsMultiplier: formPointsMultiplier,
      mysteryDiscountCode: formMysteryDiscountCode.trim(),
      eventName: formEventName.trim(),
      ticketTier: formTicketTier,
      ticketId: formTicketId.trim(),
      wifiSsid: formWifiSsid.trim(),
      wifiPassword: formWifiPassword.trim(),
      wifiAuthType: formWifiAuthType,
      cabinHouseGuideUrl: formCabinHouseGuideUrl.trim(),
      huntBeaconId: formHuntBeaconId.trim(),
      huntSecretPerk: formHuntSecretPerk.trim(),
      directTargetUrl: formDirectTargetUrl.trim(),
      logoUrl: formLogoUrl.trim() || '⭐',
      primaryColor: formPrimaryColor,
      assignedLocation: formAssignedLocation.trim(),
      assignedStaff: formAssignedStaff.trim(),
    };

    if (editingCard) {
      updateCard(editingCard.id, payload);
      showCopied(`✓ "${payload.cardName}" updated and saved in database!`);
    } else {
      addCard({
        ...payload,
        cardName: payload.cardName!,
        businessName: payload.businessName!,
        googleReviewUrl: payload.googleReviewUrl!,
        mode: payload.mode || 'smart_funnel',
        thresholdStars: payload.thresholdStars || 4,
        active: true,
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      playDeliveryChime();
      showCopied(`✓ New Card "${payload.cardName}" created and stored in fleet!`);
    }
    setShowCardModal(false);
  };

  const handleCloneCard = (card: NfcCardConfig) => {
    addCard({
      ...card,
      cardName: `${card.cardName} (Copy)`,
      chipUid: `04:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:80`,
      active: true,
    });
    showCopied(`✓ Cloned "${card.cardName}" into new profile!`);
    playDeliveryChime();
  };

  const handleDeleteCardItem = (cardId: string, cardName: string) => {
    if (confirm(`Are you sure you want to delete "${cardName}" from your card database?`)) {
      deleteCard(cardId);
      showCopied(`✓ Deleted card from fleet database.`);
    }
  };

  // Offline Exporters & NFC Tools copy
  const handleCopyNfcTools = (card: NfcCardConfig) => {
    const formatted = formatPayloadForNfcTools(card);
    navigator.clipboard.writeText(formatted.payload);
    showCopied(`✓ Copied ${formatted.recordType} payload for NFC Tools app!`);
  };

  const handleDownloadVcf = (card: NfcCardConfig) => {
    const vcard = generateVCard30(card);
    triggerFileDownload(`${(card.contactFullName || card.businessName).replace(/\s+/g, '_')}.vcf`, vcard, 'text/vcard');
    showCopied(`✓ Downloaded .VCF contact file!`);
  };

  const handleDownloadWifi = (card: NfcCardConfig) => {
    const wifi = generateWifiNdefString(card);
    triggerFileDownload(`${(card.wifiSsid || 'Guest_WiFi')}_config.txt`, wifi, 'text/plain');
    showCopied(`✓ Downloaded Wi-Fi configuration!`);
  };

  const handleExportAllCsv = () => {
    const csv = exportCardsAsCsv(cards);
    triggerFileDownload(`townraise-nfc-cards-manifest-${new Date().toISOString().split('T')[0]}.csv`, csv, 'text/csv');
    showCopied(`✓ Exported ${cards.length} cards to CSV manifest!`);
  };

  const handleExportJsonBackup = () => {
    const json = JSON.stringify(cards, null, 2);
    triggerFileDownload(`townraise-nfc-database-backup-${new Date().toISOString().split('T')[0]}.json`, json, 'application/json');
    showCopied(`✓ Downloaded complete database JSON backup!`);
  };

  const handleScanPhysicalTag = async () => {
    setIsScanningTag(true);
    setScanTagError(null);
    setScannedTagResult(null);

    const res = await scanNfcWithWebNfc();
    setIsScanningTag(false);

    if (res.success && res.serialNumber) {
      setScannedTagResult({
        serialNumber: res.serialNumber,
        records: res.records || ['NDEF URI: https://townraise.org']
      });
      playDeliveryChime();
      showCopied(`✓ Scanned Chip UID: ${res.serialNumber}`);
    } else {
      setScanTagError(res.error || 'NFC scanning unavailable or cancelled.');
    }
  };

  // Filtered NFC Menu Products
  const filteredNfcProducts = useMemo(() => {
    return nfcMenuProducts.filter(p => {
      const matchForm = selectedFormFactor === 'all' || p.formFactor === selectedFormFactor;
      const matchQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.targetRestaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchForm && matchQuery;
    });
  }, [nfcMenuProducts, selectedFormFactor, searchQuery]);

  // Calculate High-level Admin KPI Stats
  const totalHardwareSold = useMemo(() => {
    return nfcMenuProducts.reduce((acc, p) => acc + (p.unitsSold || 0), 0);
  }, [nfcMenuProducts]);

  const totalHardwareRevenue = useMemo(() => {
    const fromOrders = nfcHardwareOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const estimatedDirect = nfcMenuProducts.reduce((acc, p) => acc + (p.unitsSold * p.price), 0);
    return Math.max(fromOrders, estimatedDirect);
  }, [nfcMenuProducts, nfcHardwareOrders]);

  const totalInventoryUnits = useMemo(() => {
    return nfcMenuProducts.reduce((acc, p) => acc + (p.inventoryCount || 0), 0);
  }, [nfcMenuProducts]);

  const totalMRR = useMemo(() => {
    return clientSubscriptions
      .filter(s => s.status === 'active')
      .reduce((acc, s) => acc + s.monthlyFee, 0);
  }, [clientSubscriptions]);

  const activeAutomationsCount = useMemo(() => {
    return automationBots.filter(b => b.isActive).length;
  }, [automationBots]);

  // Web NFC Write Handler
  const handleWriteNfc = async (urlToWrite: string) => {
    setIsNfcWriting(true);
    setNfcWriteError(null);
    setNfcWriteSuccess(false);

    const res = await writeNfcWithWebNfc(urlToWrite);
    setIsNfcWriting(false);

    if (res.success) {
      setNfcWriteSuccess(true);
      playDeliveryChime();
      showCopied('✓ NFC Tag Successfully Programmed!');
      setTimeout(() => setNfcWriteSuccess(false), 4000);
    } else {
      setNfcWriteError(res.error || 'NFC Write Failed');
    }
  };

  // Submit Create New NFC Product
  const handleCreateNfcProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle.trim()) return;

    const matchedStore = storefronts.find(s => s.slug === newProdStoreSlug) || storefronts[0];
    const generatedMenuUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/site/${matchedStore.slug}`
      : `https://townraise.org/site/${matchedStore.slug}`;

    const featuresList = newProdFeatures
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    addNfcMenuProduct({
      title: newProdTitle.trim(),
      subtitle: newProdSubtitle.trim() || `Pre-Programmed NFC Stand for ${matchedStore.businessName}`,
      description: newProdDesc.trim() || `Commercial smart table hardware pre-encoded with live digital ordering for ${matchedStore.businessName}.`,
      targetRestaurantSlug: matchedStore.slug,
      targetRestaurantName: matchedStore.businessName,
      menuUrl: generatedMenuUrl,
      tableNumber: newProdTable.trim() || undefined,
      formFactor: newProdFormFactor,
      chipType: newProdChipType,
      price: parseFloat(newProdPrice) || 24.99,
      originalPrice: parseFloat(newProdOriginalPrice) || 39.99,
      inventoryCount: parseInt(newProdInventory) || 50,
      badge: newProdBadge.trim() || undefined,
      coverImageUrl: newProdImage.trim() || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      accentColor: newProdAccent,
      isPublished: true,
      features: featuresList.length > 0 ? featuresList : ['Pre-encoded with live digital menu', 'High-density NFC microchip', 'No app required'],
      dimensions: newProdFormFactor === 'acrylic_table_stand' ? '4" x 6" Free-Standing Base' : '35mm Disc',
      material: newProdFormFactor === 'wood_table_tent' ? 'Solid NH Maple' : 'Shatterproof Acrylic'
    });

    setNewProdTitle('');
    setNewProdSubtitle('');
    setNewProdDesc('');
    setShowCreateProductModal(false);
  };

  // Submit Add New Dish to Restaurant
  const handleAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim() || !currentStockStore) return;

    const newProd: StorefrontProduct = {
      id: `dish-${Date.now().toString(36)}`,
      name: newDishName.trim(),
      description: newDishDesc.trim() || 'Freshly prepared specialty dish made to order.',
      price: parseFloat(newDishPrice) || 12.99,
      category: newDishCategory.trim() || 'Chef Specials',
      imageUrl: newDishImage.trim() || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
      inStock: true,
      badge: newDishBadge.trim() || undefined,
      calories: newDishCalories.trim() || undefined,
    };

    addStorefrontProduct(currentStockStore.id, newProd);
    setNewDishName('');
    setNewDishDesc('');
    setShowAddMenuItemModal(false);
  };

  // Submit Enroll Client in Managed Retainer
  const handleEnrollClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientBizName.trim()) return;

    const pkg = managedServices.find(s => s.id === clientPackageId) || managedServices[0];
    const fee = parseFloat(clientCustomFee) || pkg.monthlyPrice;

    enrollClientSubscription({
      clientBusinessName: clientBizName.trim(),
      contactName: clientContactName.trim() || 'Business Manager',
      contactPhone: clientContactPhone.trim() || '(603) 555-0100',
      town: clientTown.trim() || 'Effingham, NH',
      packageId: pkg.id,
      packageName: pkg.name,
      monthlyFee: fee,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      automationsActive: true,
      notes: clientNotes.trim() || undefined
    });

    setClientBizName('');
    setClientContactName('');
    setClientContactPhone('');
    setShowEnrollClientModal(false);
  };

  // Submit Create New Managed Service Package
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrvName.trim()) return;

    const delivList = newSrvDeliverables.split('\n').map(d => d.trim()).filter(d => d.length > 0);
    const autoList = newSrvAutomations.split('\n').map(a => a.trim()).filter(a => a.length > 0);

    addManagedService({
      name: newSrvName.trim(),
      slug: newSrvName.trim().toLowerCase().replace(/\s+/g, '-'),
      tagline: newSrvTagline.trim() || 'Turnkey Automated Business Growth',
      description: newSrvDesc.trim() || 'Hands-off automated managed service for local Carroll County merchants.',
      category: newSrvCategory,
      monthlyPrice: parseFloat(newSrvMonthly) || 99.00,
      setupFee: parseFloat(newSrvSetup) || 0.00,
      badge: '★ Featured Service',
      includedDeliverables: delivList,
      automationsIncluded: autoList,
      recommendedFor: newSrvRecommended.trim() || 'Local Businesses',
      iconEmoji: newSrvEmoji.trim() || '⚡',
      accentColor: '#f59e0b',
      isPublished: true,
      contractTerm: 'monthly'
    });

    setNewSrvName('');
    setNewSrvTagline('');
    setNewSrvDesc('');
    setShowCreateServiceModal(false);
  };

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPinError('');
    const res = authenticateUser('frijj555@gmail.com', adminPinInput);
    if (!res.success) {
      setAdminPinError(res.error || 'Invalid administrator security PIN.');
      return;
    }
    setAdminPinInput('');
  };

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 space-y-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#18120d] via-[#100e14] to-[#0a0a0f] border border-amber-500/30 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center text-4xl mx-auto shadow-inner shadow-amber-400/20">
            <Crown className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Lead Administrator Access Only</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">
              Sean Martin Administrator Console
            </h2>
            <p className="text-xs text-zinc-400 font-light max-w-md mx-auto leading-relaxed">
              This master operating suite is strictly restricted to Sean Martin (<span className="text-amber-400 font-mono">frijj555@gmail.com</span> / <span className="text-amber-400 font-mono">(508) 507-0305</span>). Enter the Lead Admin Security PIN to unlock.
            </p>
          </div>

          {adminPinError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{adminPinError}</span>
            </div>
          )}

          <form onSubmit={handleAdminUnlock} className="max-w-sm mx-auto space-y-3">
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Security PIN (Sean Martin)</span>
              </label>
              <input
                type="password"
                required
                maxLength={8}
                placeholder="Enter Admin PIN (0305)"
                value={adminPinInput}
                onChange={(e) => { setAdminPinInput(e.target.value); setAdminPinError(''); }}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono tracking-widest text-center focus:outline-none focus:border-amber-400 placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate & Unlock Admin Suite</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-500">
            <Link href="/dashboard" className="hover:text-white flex items-center gap-1">
              <span>← Back to Dashboard Overview</span>
            </Link>
            <Link href="/login" className="text-amber-400 hover:underline flex items-center gap-1">
              <span>Login Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-indigo-600/10 to-amber-500/5 border border-amber-500/20 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest">
              <Crown className="w-3.5 h-3.5" />
              <span>Town Vanguard Master Admin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
              Automation & Managed Services Console
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-medium max-w-2xl">
              Manage sellable automated services ($49–$399/mo), program & sell pre-encoded NFC table stands, trigger automated review/dispatch bots, and control restaurant menu stock in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowEnrollClientModal(true)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <UserCheck className="w-4 h-4" />
              <span>Enroll Paying Client ($/mo)</span>
            </button>

            <button
              onClick={() => setShowCreateProductModal(true)}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Sell NFC Hardware</span>
            </button>

            <Link
              href="/services"
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Services Storefront 💼</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Monthly Recurring Revenue (MRR) */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Client Retainer MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            {formatCurrency(totalMRR)}<span className="text-xs text-zinc-500 font-normal">/mo</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            {clientSubscriptions.filter(s => s.status === 'active').length} Active Merchant Subscriptions
          </div>
        </div>

        {/* Card 2: Active Automation Bots */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Active Automation Bots</span>
            <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">
            {activeAutomationsCount} <span className="text-xs text-zinc-400 font-bold">Bots Live</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            Auto-Reviews, GPS & Scheduler
          </div>
        </div>

        {/* Card 3: NFC Hardware Sold */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Hardware Deployed</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {totalHardwareSold} <span className="text-xs text-amber-400 font-bold">Units</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            {formatCurrency(totalHardwareRevenue)} Gross Sales
          </div>
        </div>

        {/* Card 4: Services Offered */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Turnkey Services</span>
            <Briefcase className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {managedServices.length} <span className="text-xs text-zinc-400 font-bold">Packages</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            $49 to $399/mo Retainers
          </div>
        </div>

        {/* Card 5: Connected Restaurant Menus */}
        <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-2 relative overflow-hidden group col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-mono uppercase tracking-widest">Connected Kitchens</span>
            <Store className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {storefronts.length} <span className="text-xs text-emerald-400 font-bold">Live</span>
          </div>
          <div className="text-[11px] text-zinc-500 font-medium">
            Effingham, Ossipee, Freedom, Conway
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0a0a0f] border border-white/5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('automation_bots')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'automation_bots'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>🤖 Automation Bots ({automationBots.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('managed_services')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'managed_services'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>💼 Managed Client Retainers ({clientSubscriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sell_nfc_menus')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'sell_nfc_menus'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛒 NFC Menu Hardware ({nfcMenuProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('nfc_writer')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'nfc_writer'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>⚡ NFC Card Database & Programmer ({cards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware_orders')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'hardware_orders'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>📦 Hardware Dispatch ({nfcHardwareOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('menu_stock_controller')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
            activeTab === 'menu_stock_controller'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>🍽️ Menu Stock Controller</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB: AUTOMATION BOTS & WORKFLOWS */}
      {/* ========================================================================= */}
      {activeTab === 'automation_bots' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Active Automated Service Bots</span>
              </h3>
              <p className="text-xs text-zinc-400">
                These bots run 24/7 on autopilot to handle customer follow-ups, negative review defense, route telemetry, and recurring monthly client billing.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                ✓ All Bot Triggers Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {automationBots.map((bot) => (
              <div
                key={bot.id}
                className={`p-6 rounded-3xl bg-[#0e0e14] border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                  bot.isActive ? 'border-amber-400/30 shadow-amber-500/5' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{bot.iconEmoji}</span>
                    <button
                      onClick={() => toggleAutomationBot(bot.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        bot.isActive
                          ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${bot.isActive ? 'bg-black animate-ping' : 'bg-zinc-500'}`} />
                      <span>{bot.isActive ? 'Active' : 'Paused'}</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-black text-white">{bot.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{bot.description}</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1.5 text-[11px] font-mono">
                    <div className="text-zinc-400">
                      ⚡ Trigger: <strong className="text-amber-400">{bot.triggerEvent}</strong>
                    </div>
                    <div className="text-zinc-400 truncate">
                      ➔ Action: <span className="text-emerald-400">{bot.actionOutput}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="text-zinc-500 font-mono text-[10px]">
                    Executed <strong>{bot.executionCount}</strong> times
                  </div>

                  <button
                    onClick={() => triggerAutomationBotManual(bot.id)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-amber-400 hover:text-black text-zinc-300 font-bold text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3 h-3" />
                    <span>Test Trigger</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: MANAGED CLIENT RETAINERS & SERVICES MARKETPLACE */}
      {/* ========================================================================= */}
      {activeTab === 'managed_services' && (
        <div className="space-y-8">
          
          {/* Active Subscribed Clients Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e0e14] border border-white/5">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enrolled Business Clients (Active Monthly Retainers)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Local Carroll County businesses paying monthly retainers for automated reputation management, digital menus, courier errands, and Airbnb concierges.
                </p>
              </div>

              <button
                onClick={() => setShowEnrollClientModal(true)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Client</span>
              </button>
            </div>

            <div className="space-y-3">
              {clientSubscriptions.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-black text-white">{client.clientBusinessName}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                        {client.status}
                      </span>
                      <span className="text-xs text-zinc-500">• {client.town}</span>
                    </div>

                    <p className="text-xs text-amber-400/90 font-medium">
                      Plan: {client.packageName}
                    </p>

                    <div className="text-xs text-zinc-400 flex items-center gap-3">
                      <span>Contact: <strong className="text-white">{client.contactName}</strong> ({client.contactPhone})</span>
                      {client.notes && <span className="text-zinc-500 italic truncate max-w-xs">— {client.notes}</span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <div className="text-xl font-black text-emerald-400">
                        {formatCurrency(client.monthlyFee)}<span className="text-xs text-zinc-500 font-normal">/mo</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Next Bill: {client.nextBillingDate}
                      </span>
                    </div>

                    <button
                      onClick={() => updateClientSubscriptionStatus(client.id, client.status === 'active' ? 'paused' : 'active')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        client.status === 'active'
                          ? 'bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      }`}
                    >
                      {client.status === 'active' ? 'Pause Plan' : 'Reactivate Plan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Turnkey Managed Services Catalog */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Turnkey Service Packages Available to Sell ($/mo)</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Ready-to-sell packages with automated delivery workflows. Available directly on your customer storefront.
                </p>
              </div>

              <button
                onClick={() => setShowCreateServiceModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create Service Package</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {managedServices.map((service) => (
                <div
                  key={service.id}
                  className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-5 shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{service.iconEmoji}</span>
                      {service.badge && (
                        <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {service.name}
                      </h4>
                      <p className="text-xs text-amber-400/90 font-medium">{service.tagline}</p>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed pt-1">
                        {service.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5 text-[11px] text-zinc-300">
                      <div className="font-bold text-white text-xs">Included Deliverables:</div>
                      {service.includedDeliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-emerald-400">
                          {formatCurrency(service.monthlyPrice)}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">/month</span>
                      </div>
                      {(service.setupFee ?? 0) > 0 && (
                        <span className="text-[10px] text-zinc-500 font-mono">
                          +{formatCurrency(service.setupFee!)} setup
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setClientPackageId(service.id);
                        setClientCustomFee(service.monthlyPrice.toString());
                        setShowEnrollClientModal(true);
                      }}
                      className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Enroll Client on This Plan ➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: SELL & MANAGE NFC MENU HARDWARE */}
      {/* ========================================================================= */}
      {activeTab === 'sell_nfc_menus' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {[
                { id: 'all', label: 'All Products' },
                { id: 'acrylic_table_stand', label: 'Acrylic Stands' },
                { id: 'wood_table_tent', label: 'Wood Tents' },
                { id: 'pvc_table_disc', label: 'Table Discs' },
                { id: 'waitstaff_badge', label: 'Staff Badges' },
                { id: 'outdoor_drive_thru', label: 'Drive-Thru / Curbside' },
                { id: 'keychain_tag', label: 'Keychains' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFormFactor(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFormFactor === tab.id
                      ? 'bg-white text-black font-black'
                      : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search NFC hardware & menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNfcProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <div>
                  <div className="relative h-48 w-full bg-black/40 overflow-hidden">
                    <img
                      src={product.coverImageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e14] via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Cpu className="w-3 h-3" />
                      <span>{product.formFactor.replace(/_/g, ' ')}</span>
                    </div>

                    {product.badge && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider">
                        {product.badge}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[11px]">
                      <span className="text-zinc-400 truncate max-w-[180px]">
                        Target: <strong className="text-white">{product.targetRestaurantName}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold">
                        {product.chipType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-white">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {product.inventoryCount} units in stock • {product.unitsSold} sold
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleNfcMenuProductPublish(product.id)}
                          title={product.isPublished ? 'Unpublish' : 'Publish'}
                          className={`p-2 rounded-xl border transition-all ${
                            product.isPublished 
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                              : 'bg-zinc-800 border-zinc-700 text-zinc-500'
                          }`}
                        >
                          {product.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => deleteNfcMenuProduct(product.id)}
                          title="Delete Product"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-zinc-400 pt-2">
                      {product.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowFlashModal(product);
                      handleWriteNfc(product.menuUrl);
                    }}
                    className="px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Flash Tag ⚡</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(product)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Table Tent 🖨️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FULL NFC CARD FLEET DATABASE & PROGRAMMING COMMAND */}
      {/* ========================================================================= */}
      {activeTab === 'nfc_writer' && (
        <div className="space-y-8">

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-amber-400/20 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">Stored NFC Fleet</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {cards.length} <span className="text-xs text-zinc-400 font-bold">Cards</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                Active Profiles in Database
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] font-mono uppercase tracking-widest">Active Transmitters</span>
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {cardFleetStats.activeBeacons} <span className="text-xs text-zinc-400 font-bold">Live</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                Broadcasting in Carroll County
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] font-mono uppercase tracking-widest">Customer Taps</span>
                <Smartphone className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">
                {cardFleetStats.totalTaps.toLocaleString()} <span className="text-xs text-zinc-400 font-bold">Taps</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                Lifetime NFC Interactions
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/5 space-y-1 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] font-mono uppercase tracking-widest">Reviews & Conversions</span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {cardFleetStats.totalConversions.toLocaleString()} <span className="text-xs text-amber-400 font-bold">Actions</span>
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                Google 5-Star Reviews & Orders
              </div>
            </div>
          </div>

          {/* Action Toolbar Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e0e14] border border-white/5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <HardDrive className="w-4 h-4" />
                <span>NFC Hardware Provisioning Command</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Stored NFC Cards & Offline Programming Hub
              </h2>
              <p className="text-xs text-zinc-400 max-w-2xl">
                Create and store card profiles for business clients, write directly via Web NFC, or export formatted payloads for <strong>NFC Tools</strong>, standalone desktop encoders, and bulk manufacturing manifests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
              <Link
                href="/creator"
                className="px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95 hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>All-in-One NFC Studio ➔</span>
              </Link>

              <button
                onClick={() => openCreateCardModal('digital_biz_card')}
                className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-amber-400/20 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Create & Store Card</span>
              </button>

              <button
                onClick={handleScanPhysicalTag}
                disabled={isScanningTag}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
              >
                <Cpu className={`w-4 h-4 text-indigo-400 ${isScanningTag ? 'animate-spin' : ''}`} />
                <span>{isScanningTag ? 'Scanning Tag...' : 'Scan Physical Tag'}</span>
              </button>

              <button
                onClick={handleExportAllCsv}
                className="px-3.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Export all cards to CSV for batch burning"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleExportJsonBackup}
                className="px-3.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all"
                title="Backup full database to JSON"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Tag Scan Result Alert */}
          {scannedTagResult && (
            <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-start justify-between gap-3 animate-in fade-in">
              <div className="space-y-1">
                <div className="font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Physical NFC Tag Read Successfully: UID {scannedTagResult.serialNumber}</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-400">
                  Written Payload: {scannedTagResult.records.join(' | ')}
                </div>
              </div>
              <button
                onClick={() => {
                  openCreateCardModal();
                  setFormChipUid(scannedTagResult.serialNumber);
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] uppercase tracking-wider shrink-0"
              >
                Assign to New Card ➔
              </button>
            </div>
          )}

          {scanTagError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{scanTagError}</span>
              </div>
              <button onClick={() => setScanTagError(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search cards by name, business, chip UID, staff, or town..."
                  value={cardSearchQuery}
                  onChange={(e) => setCardSearchQuery(e.target.value)}
                  className="w-full bg-[#0e0e14] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={cardTownFilter}
                  onChange={(e) => setCardTownFilter(e.target.value)}
                  className="bg-[#0e0e14] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Towns</option>
                  <option value="Effingham">Effingham, NH</option>
                  <option value="Ossipee">Ossipee, NH</option>
                  <option value="Freedom">Freedom, NH</option>
                  <option value="Wolfeboro">Wolfeboro, NH</option>
                  <option value="Conway">Conway, NH</option>
                </select>

                <select
                  value={cardFormFactorFilter}
                  onChange={(e) => setCardFormFactorFilter(e.target.value)}
                  className="bg-[#0e0e14] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Hardware Form Factors</option>
                  <option value="pvc_card">PVC Matte Smart Card</option>
                  <option value="acrylic_stand">Acrylic Table Stand</option>
                  <option value="wood_plaque">Hardwood Guest Plaque</option>
                  <option value="keychain_fob">Smart Keychain FOB</option>
                  <option value="badge_lanyard">Wearable VIP Badge</option>
                  <option value="disc_sticker">Weatherproof 3M Disc</option>
                </select>
              </div>
            </div>

            {/* Profile Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { id: 'all', label: `All Hardware (${cards.length})`, emoji: '⚡' },
                { id: 'digital_biz_card', label: '📇 Digital Business Cards', emoji: '📇' },
                { id: 'google_review_booster', label: '⭐ Review Boosters', emoji: '⭐' },
                { id: 'menu_tap_to_order', label: '🍽️ Table Menus', emoji: '🍽️' },
                { id: 'airbnb_wifi_plaque', label: '🏡 Airbnb Wi-Fi', emoji: '🏡' },
                { id: 'event_vip_pass', label: '🎟️ VIP Event Passes', emoji: '🎟️' },
                { id: 'scavenger_hunt_beacon', label: '🗺️ Store Crawl Beacons', emoji: '🗺️' },
                { id: 'loyalty_rewards', label: '🎁 Loyalty FOBs', emoji: '🎁' },
                { id: 'custom_url', label: '🌐 Direct Links', emoji: '🌐' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCardProfileFilter(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    cardProfileFilter === tab.id
                      ? 'bg-amber-400 text-black font-black shadow-md shadow-amber-400/20'
                      : 'bg-[#0e0e14] text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Fleet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => {
              const targetUrl = buildCardTargetUrl(card);
              const formattedTools = formatPayloadForNfcTools(card);

              return (
                <div
                  key={card.id}
                  className="p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-5 shadow-xl relative group"
                >
                  <div className="space-y-4">
                    
                    {/* Top Status & Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{card.logoUrl || '⚡'}</span>
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase tracking-wider block w-max">
                            {card.profileType ? card.profileType.replace(/_/g, ' ') : 'Review Booster'}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {card.hardwareFormFactor ? card.hardwareFormFactor.replace(/_/g, ' ') : 'PVC Card'} • {card.chipType || 'NTAG215'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => updateCard(card.id, { active: !card.active })}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                          card.active
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                        title="Click to toggle active transmitter status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${card.active ? 'bg-emerald-400 animate-ping' : 'bg-zinc-600'}`} />
                        <span>{card.active ? 'Live' : 'Paused'}</span>
                      </button>
                    </div>

                    {/* Card Title & Business */}
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white group-hover:text-amber-400 transition-colors">
                        {card.cardName}
                      </h4>
                      <p className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{card.businessName}</span>
                        <span className="text-zinc-600">• {card.town || 'Effingham, NH'}</span>
                      </p>
                    </div>

                    {/* Profile Specific Summary Pill */}
                    {card.profileType === 'digital_biz_card' && (
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1 text-xs text-zinc-300">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-amber-400" />
                          <span>{card.contactFullName || 'Sean Martin'}</span>
                          {card.contactTitle && <span className="text-zinc-500 font-normal">({card.contactTitle})</span>}
                        </div>
                        {card.contactPhone && (
                          <div className="text-[11px] text-zinc-400 font-mono">
                            📞 {card.contactPhone} • ✉️ {card.contactEmail || 'N/A'}
                          </div>
                        )}
                      </div>
                    )}

                    {card.profileType === 'airbnb_wifi_plaque' && (
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1 text-xs text-zinc-300">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Wifi className="w-3.5 h-3.5 text-sky-400" />
                          <span>SSID: <strong>{card.wifiSsid || 'Guest-WiFi'}</strong></span>
                        </div>
                        <div className="text-[11px] text-zinc-400 font-mono">
                          Password: {card.wifiPassword || 'No Password'}
                        </div>
                      </div>
                    )}

                    {card.profileType === 'menu_tap_to_order' && (
                      <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-1 text-xs text-zinc-300">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-amber-400" />
                          <span>Kitchen: <strong>{card.storefrontSlug}</strong></span>
                        </div>
                        <div className="text-[11px] text-amber-400/90 font-mono">
                          Assigned: {card.tableNumber || 'Main Bar / Counter'}
                        </div>
                      </div>
                    )}

                    {/* Chip UID & Target URL */}
                    <div className="space-y-2 text-xs">
                      {card.chipUid && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[11px] text-zinc-400">
                          <span>UID: <strong className="text-white">{card.chipUid}</strong></span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(card.chipUid || '');
                              showCopied(`✓ Copied Chip UID: ${card.chipUid}`);
                            }}
                            className="p-1 hover:text-white"
                            title="Copy UID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="p-2.5 rounded-xl bg-black/60 border border-white/5 flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] text-amber-400 truncate">
                          {targetUrl}
                        </span>
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-white/5 hover:bg-white/10 text-white shrink-0"
                          title="Open live link"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Tap & Conversion Statistics */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px]">
                      <div className="p-2 rounded-xl bg-white/[0.02] text-center">
                        <div className="text-zinc-500 font-mono uppercase text-[9px]">Total Taps</div>
                        <div className="font-black text-white text-sm">{(card.totalTaps || 0).toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/[0.02] text-center">
                        <div className="text-zinc-500 font-mono uppercase text-[9px]">Conversions</div>
                        <div className="font-black text-emerald-400 text-sm">{(card.googleConversions || 0).toLocaleString()}</div>
                      </div>
                    </div>

                  </div>

                  {/* Card Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setActiveWebNfcModalCard(card);
                          handleWriteNfc(targetUrl);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Flash Tag ⚡</span>
                      </button>

                      <button
                        onClick={() => setActiveOfflineModalCard(card)}
                        className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-400" />
                        <span>Offline Tools 🖨️</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      <button
                        onClick={() => openEditCardModal(card)}
                        className="py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold flex items-center justify-center gap-1 transition-all"
                        title="Edit Card Profile"
                      >
                        <Edit3 className="w-3 h-3 text-zinc-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleCloneCard(card)}
                        className="py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-bold flex items-center justify-center gap-1 transition-all"
                        title="Clone into new profile"
                      >
                        <Copy className="w-3 h-3 text-zinc-400" />
                        <span>Clone</span>
                      </button>

                      <button
                        onClick={() => setActiveSimulateModalCard(card)}
                        className="py-1.5 rounded-lg bg-white/5 hover:bg-indigo-400 hover:text-black text-zinc-300 font-bold flex items-center justify-center gap-1 transition-all"
                        title="Simulate Phone Tap"
                      >
                        <Eye className="w-3 h-3 text-indigo-400" />
                        <span>Test</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCardItem(card.id, card.cardName)}
                        className="py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 font-bold flex items-center justify-center gap-1 transition-all"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Standalone & Off-The-Website Programming Guide */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0e14] border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Universal Hardware Encoding Protocol</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  How to Program Cards Off the Website (Mobile & Desktop Encoders)
                </h3>
                <p className="text-xs text-zinc-400">
                  You can program blank NFC cards, stands, keychains, and stickers offline using free tools like <strong>NFC Tools</strong> (iOS/Android/Mac/PC), <strong>Proxmark</strong>, or desktop USB readers (ACR122U).
                </p>
              </div>

              <button
                onClick={handleExportAllCsv}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Download Batch Manifest (.csv)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">1</span>
                  <span>Export Formatted Payload</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Click <strong>&quot;Offline Tools 🖨️&quot;</strong> on any card above and tap <strong>&quot;Copy for NFC Tools&quot;</strong> or download the direct <strong>.VCF vCard</strong> / Wi-Fi configuration file.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
                  <span>Open NFC Tools / NFC Writer</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Open <strong>NFC Tools</strong> on your phone or PC. Select <strong>Write &gt; Add a record</strong> (Choose <strong>Custom URL</strong>, <strong>Contact / vCard</strong>, or <strong>Wi-Fi Network</strong>) and paste the payload.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="text-amber-400 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center text-[10px]">3</span>
                  <span>Tap Blank Tag & Verify</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Hold your blank NTAG213 / NTAG215 / NTAG216 card against the back of your phone. NFC Tools burns the chip in 0.1 seconds with permanent read locks available.
                </p>
              </div>
            </div>

            {/* Chip Memory Compatibility Chart */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <div className="text-xs font-black uppercase text-zinc-300 tracking-wider">
                Microchip Memory Compatibility & Payload Requirements
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-mono font-bold text-amber-400">NTAG213 (144 Bytes)</div>
                  <p className="text-[11px] text-zinc-400">
                    Perfect for Direct Google Review URLs, Smart Tap redirects, Menu links, and Scavenger beacons.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-mono font-bold text-indigo-400">NTAG215 (504 Bytes)</div>
                  <p className="text-[11px] text-zinc-400">
                    Standard for Executive vCard 3.0 contacts, Wi-Fi pairing credentials, and custom table identifiers.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="font-mono font-bold text-emerald-400">NTAG216 (888 Bytes)</div>
                  <p className="text-[11px] text-zinc-400">
                    Maximum capacity for rich multi-field vCards with full bios, social links, and multiple NDEF records.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HARDWARE ORDERS & FULFILLMENT PIPELINE */}
      {/* ========================================================================= */}
      {activeTab === 'hardware_orders' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div>
              <h3 className="text-base font-black text-white">Merchant Hardware Orders</h3>
              <p className="text-xs text-zinc-400">Manage NFC table hardware fulfillment, programming verification, and courier hand-off.</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-indigo-600/20 text-indigo-400 font-mono text-xs font-bold">
              {nfcHardwareOrders.length} Active Orders
            </span>
          </div>

          <div className="space-y-4">
            {nfcHardwareOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-[#0e0e14] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {order.orderNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                      order.status === 'in_transit' ? 'bg-indigo-500/20 text-indigo-400' :
                      order.status === 'programmed_qa' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-zinc-500">• {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h4 className="text-base font-black text-white">
                    {order.quantity}x {order.productTitle}
                  </h4>

                  <div className="text-xs text-zinc-400 space-y-1">
                    <div>
                      Merchant: <strong className="text-white">{order.buyerBusinessName || order.buyerName}</strong> • {order.buyerPhone}
                    </div>
                    <div>
                      Delivery Address: <span className="text-zinc-300">{order.deliveryAddress}</span>
                    </div>
                    <div className="font-mono text-[11px] text-amber-400/90 truncate">
                      Encoded URL: {order.programmedUrl}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="text-right">
                    <div className="text-xl font-black text-emerald-400">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">
                      {order.paidStatus === 'paid' ? '✓ Paid Online' : '⚡ Cash / Invoice'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'pending_flash' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'programmed_qa')}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Mark Flashed & QA ✓
                      </button>
                    )}

                    {order.status === 'programmed_qa' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'in_transit')}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Dispatch with Sean 🚚
                      </button>
                    )}

                    {order.status === 'in_transit' && (
                      <button
                        onClick={() => updateNfcHardwareOrderStatus(order.id, 'delivered')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all"
                      >
                        Mark Delivered 🏁
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MULTI-RESTAURANT MENU & STOCK CONTROLLER */}
      {/* ========================================================================= */}
      {activeTab === 'menu_stock_controller' && (
        <div className="space-y-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e0e14] border border-white/5">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <label className="text-xs font-mono uppercase text-zinc-400 shrink-0">
                Select Restaurant:
              </label>
              <select
                value={stockSelectedStoreId}
                onChange={(e) => setStockSelectedStoreId(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                {storefronts.map(store => (
                  <option key={store.id} value={store.id} className="bg-zinc-900 text-white">
                    {store.logoEmoji || '🍽️'} {store.businessName} ({store.products.length} items)
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddMenuItemModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dish / Special</span>
            </button>
          </div>

          <div className="space-y-3">
            {currentStockStore?.products.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-[#0e0e14] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  item.inStock ? 'border-white/5' : 'border-red-500/20 opacity-70 bg-red-950/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{item.name}</h4>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-400 text-[9px] font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{item.description}</p>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono">Category: {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  {editingPriceId === item.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.25"
                        value={editingPriceValue}
                        onChange={(e) => setEditingPriceValue(e.target.value)}
                        className="w-20 bg-white/10 border border-amber-400 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                      <button
                        onClick={() => {
                          const val = parseFloat(editingPriceValue);
                          if (!isNaN(val) && val > 0) {
                            updateStorefrontProductPrice(currentStockStore.id, item.id, val);
                          }
                          setEditingPriceId(null);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingPriceId(item.id);
                        setEditingPriceValue(item.price.toString());
                      }}
                      className="cursor-pointer px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-right group"
                      title="Click to edit price"
                    >
                      <span className="text-sm font-black text-emerald-400 block group-hover:text-amber-400 transition-colors">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-[8px] text-zinc-500 font-mono">Click to edit</span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleStorefrontProductStock(currentStockStore.id, item.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      item.inStock
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30'
                    }`}
                  >
                    {item.inStock ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>86'd (Sold Out)</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENROLL PAYING CLIENT */}
      {/* ========================================================================= */}
      {showEnrollClientModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                  <UserCheck className="w-4 h-4" />
                  <span>Client Onboarding</span>
                </div>
                <h3 className="text-xl font-black text-white">Enroll Business in Managed Retainer</h3>
              </div>
              <button onClick={() => setShowEnrollClientModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollClient} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Business / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yankee Smokehouse BBQ or Pine Cove Chalet"
                  value={clientBizName}
                  onChange={(e) => setClientBizName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Owner / Manager Name"
                    value={clientContactName}
                    onChange={(e) => setClientContactName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="(603) 539-XXXX"
                    value={clientContactPhone}
                    onChange={(e) => setClientContactPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Town / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Center Ossipee, NH"
                    value={clientTown}
                    onChange={(e) => setClientTown(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Monthly Rate ($/mo)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={clientCustomFee}
                    onChange={(e) => setClientCustomFee(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Select Managed Retainer Package</label>
                <select
                  value={clientPackageId}
                  onChange={(e) => {
                    setClientPackageId(e.target.value);
                    const sel = managedServices.find(s => s.id === e.target.value);
                    if (sel) setClientCustomFee(sel.monthlyPrice.toString());
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  {managedServices.map(s => (
                    <option key={s.id} value={s.id} className="bg-zinc-900 text-white">
                      {s.iconEmoji} {s.name} ({formatCurrency(s.monthlyPrice)}/mo)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Special Contract Notes / Hardware</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 6 table stands delivered. Negative feedback shield active."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowEnrollClientModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider"
                >
                  Activate Retainer & Automations 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW MANAGED SERVICE PACKAGE */}
      {/* ========================================================================= */}
      {showCreateServiceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Create New Managed Service Package</h3>
                <p className="text-xs text-zinc-400">Offer automated recurring monthly services to local businesses</p>
              </div>
              <button onClick={() => setShowCreateServiceModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Service Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Courier & Supply Run Retainer"
                  value={newSrvName}
                  onChange={(e) => setNewSrvName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Monthly Price ($/mo) *</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newSrvMonthly}
                    onChange={(e) => setNewSrvMonthly(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">One-Time Setup ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={newSrvSetup}
                    onChange={(e) => setNewSrvSetup(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Included Deliverables (1 per line)</label>
                <textarea
                  rows={3}
                  value={newSrvDeliverables}
                  onChange={(e) => setNewSrvDeliverables(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateServiceModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider"
                >
                  Publish Service 💼
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE NEW NFC MENU PRODUCT */}
      {/* ========================================================================= */}
      {showCreateProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <Plus className="w-4 h-4" />
                  <span>Hardware Catalog Manager</span>
                </div>
                <h3 className="text-xl font-black text-white">Create NFC Menu Product for Sale</h3>
              </div>
              <button
                onClick={() => setShowCreateProductModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNfcProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acrylic Dual-Sided Tap-to-Order Stand"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Form Factor</label>
                  <select
                    value={newProdFormFactor}
                    onChange={(e) => setNewProdFormFactor(e.target.value as NfcFormFactor)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="acrylic_table_stand" className="bg-zinc-900">Acrylic Table Stand</option>
                    <option value="wood_table_tent" className="bg-zinc-900">Rustic Wood Table Tent</option>
                    <option value="pvc_table_disc" className="bg-zinc-900">Self-Adhesive PVC Table Disc</option>
                    <option value="waitstaff_badge" className="bg-zinc-900">Waitstaff / Bartender Badge</option>
                    <option value="outdoor_drive_thru" className="bg-zinc-900">Outdoor Drive-Thru / Curbside Tag</option>
                    <option value="keychain_tag" className="bg-zinc-900">VIP Patron Re-Order Keychain</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">NFC Chip Memory</label>
                  <select
                    value={newProdChipType}
                    onChange={(e) => setNewProdChipType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="NTAG213" className="bg-zinc-900">NTAG213 (144 Bytes Standard)</option>
                    <option value="NTAG215" className="bg-zinc-900">NTAG215 (504 Bytes High Density)</option>
                    <option value="NTAG216" className="bg-zinc-900">NTAG216 (888 Bytes Large Capacity)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Pre-Encoded Restaurant Menu</label>
                  <select
                    value={newProdStoreSlug}
                    onChange={(e) => setNewProdStoreSlug(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {storefronts.map(s => (
                      <option key={s.slug} value={s.slug} className="bg-zinc-900">
                        {s.logoEmoji || '🍽️'} {s.businessName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Table Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Table #1"
                    value={newProdTable}
                    onChange={(e) => setNewProdTable(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Selling Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Retail Comparison ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdOriginalPrice}
                    onChange={(e) => setNewProdOriginalPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Initial Stock</label>
                  <input
                    type="number"
                    value={newProdInventory}
                    onChange={(e) => setNewProdInventory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateProductModal(false)}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                >
                  Publish NFC Product 🚀
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PRINTABLE TABLE STAND TENT */}
      {/* ========================================================================= */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-black rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl relative text-center">
            
            <button
              onClick={() => setShowPrintModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>NFC Smart Table Tent</span>
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight text-black">
                {showPrintModal.targetRestaurantName}
              </h3>
              {showPrintModal.tableNumber && (
                <div className="inline-block px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase">
                  {showPrintModal.tableNumber}
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl border-4 border-dashed border-zinc-300 inline-block mx-auto">
              {printQrDataUrl && (
                <img src={printQrDataUrl} alt="Table Tent QR" className="w-52 h-52 mx-auto" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-black uppercase tracking-wider text-zinc-900">
                Tap Phone to Back of Stand or Scan QR
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Browse full food menu, craft drinks, calorie counts & order table delivery
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Table Tent</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD DISH TO RESTAURANT */}
      {/* ========================================================================= */}
      {showAddMenuItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Add Dish to {currentStockStore?.businessName}</h3>
                <p className="text-xs text-zinc-400">Instantly appears on the live digital menu</p>
              </div>
              <button onClick={() => setShowAddMenuItemModal(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDish} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Dish Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maple Smoked Pork Belly Bites"
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Price ($) *</label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-zinc-400">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Appetizers"
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-zinc-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Ingredients, preparation details..."
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowAddMenuItemModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider"
                >
                  Add to Menu 🍽️
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FLOATING TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl shadow-emerald-500/30 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT STORED NFC CARD PROFILE */}
      {/* ========================================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase">
                  <CreditCard className="w-4 h-4" />
                  <span>NFC Profile Architect</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {editingCard ? `Edit Stored Card: ${editingCard.cardName}` : 'Create & Store New NFC Hardware Card'}
                </h3>
              </div>
              <button
                onClick={() => setShowCardModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Type Selector Pills */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-zinc-400">
                1. Select Card Purpose & Target Functionality
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'digital_biz_card', label: 'Digital vCard', emoji: '📇' },
                  { id: 'google_review_booster', label: '5-Star Reviews', emoji: '⭐' },
                  { id: 'menu_tap_to_order', label: 'Tabletop Menu', emoji: '🍽️' },
                  { id: 'airbnb_wifi_plaque', label: 'Airbnb Wi-Fi', emoji: '🏡' },
                  { id: 'event_vip_pass', label: 'VIP Event Pass', emoji: '🎟️' },
                  { id: 'scavenger_hunt_beacon', label: 'Store Crawl', emoji: '🗺️' },
                  { id: 'loyalty_rewards', label: 'Loyalty FOB', emoji: '🎁' },
                  { id: 'custom_url', label: 'Direct Web Link', emoji: '🌐' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setFormProfileType(p.id as any);
                      if (p.id === 'airbnb_wifi_plaque' && !formWifiSsid) setFormWifiSsid('Guest-WiFi-5G');
                    }}
                    className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border transition-all text-left ${
                      formProfileType === p.id
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                        : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-6 pt-2">
              
              {/* General Info */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                  2. General Hardware & Business Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Card / Beacon Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sean Martin Executive Card"
                      value={formCardName}
                      onChange={(e) => setFormCardName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Business / Client Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smoke World Ossipee / Townraise Labs"
                      value={formBusinessName}
                      onChange={(e) => setFormBusinessName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Hardware Form Factor</label>
                    <select
                      value={formFormFactor}
                      onChange={(e) => setFormFormFactor(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="pvc_card" className="bg-zinc-900">PVC Matte Card</option>
                      <option value="acrylic_stand" className="bg-zinc-900">Acrylic Table Stand</option>
                      <option value="wood_plaque" className="bg-zinc-900">Hardwood Guest Plaque</option>
                      <option value="keychain_fob" className="bg-zinc-900">Smart Keychain FOB</option>
                      <option value="badge_lanyard" className="bg-zinc-900">Wearable VIP Badge</option>
                      <option value="disc_sticker" className="bg-zinc-900">Weatherproof 3M Disc</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Microchip Type</label>
                    <select
                      value={formChipType}
                      onChange={(e) => setFormChipType(e.target.value as any)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="NTAG213" className="bg-zinc-900">NTAG213 (144 Bytes)</option>
                      <option value="NTAG215" className="bg-zinc-900">NTAG215 (504 Bytes - Standard)</option>
                      <option value="NTAG216" className="bg-zinc-900">NTAG216 (888 Bytes - High Density)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Physical Chip UID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 04:A2:7B:3E:91:20:80"
                      value={formChipUid}
                      onChange={(e) => setFormChipUid(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Profile Specific Fields */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-4">
                <div className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center gap-2">
                  <span>3. Configuration Fields for</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black font-black text-[10px]">
                    {formProfileType.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Profile: Digital Business Card (vCard) */}
                {formProfileType === 'digital_biz_card' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sean Martin"
                          value={formContactFullName}
                          onChange={(e) => setFormContactFullName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Job Title / Role</label>
                        <input
                          type="text"
                          placeholder="e.g. Lead Operator & Vanguard"
                          value={formContactTitle}
                          onChange={(e) => setFormContactTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Phone Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="508-507-0305"
                          value={formContactPhone}
                          onChange={(e) => setFormContactPhone(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Email Address</label>
                        <input
                          type="email"
                          placeholder="frijj555@gmail.com"
                          value={formContactEmail}
                          onChange={(e) => setFormContactEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Website URL</label>
                        <input
                          type="url"
                          placeholder="https://townraise.org"
                          value={formContactWebsite}
                          onChange={(e) => setFormContactWebsite(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Social Link (LinkedIn / IG / X)</label>
                        <input
                          type="text"
                          placeholder="https://linkedin.com/in/sean-martin-nh"
                          value={formContactLinkedIn}
                          onChange={(e) => setFormContactLinkedIn(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-zinc-400">Bio / Notes</label>
                      <textarea
                        rows={2}
                        placeholder="Short summary or contact note..."
                        value={formContactBio}
                        onChange={(e) => setFormContactBio(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* Profile: Google Review Booster */}
                {formProfileType === 'google_review_booster' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-zinc-400">Google Review URL *</label>
                      <input
                        type="url"
                        required
                        placeholder="https://search.google.com/local/writereview?placeid=..."
                        value={formGoogleReviewUrl}
                        onChange={(e) => setFormGoogleReviewUrl(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Routing Funnel Mode</label>
                        <select
                          value={formMode}
                          onChange={(e) => setFormMode(e.target.value as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value="smart_funnel" className="bg-zinc-900">🛡️ Smart Funnel (4+ to Google, 1-3 to Private)</option>
                          <option value="direct_google" className="bg-zinc-900">⚡ Direct 1-Tap Google Review</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Minimum Star Threshold for Google</label>
                        <select
                          value={formThresholdStars}
                          onChange={(e) => setFormThresholdStars(Number(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value={5} className="bg-zinc-900">5 Stars Only</option>
                          <option value={4} className="bg-zinc-900">4 & 5 Stars (Standard)</option>
                          <option value={3} className="bg-zinc-900">3+ Stars</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-zinc-400">Custom Screen Prompt</label>
                      <input
                        type="text"
                        placeholder="e.g. Love your visit today? Tap to share a 5-star review!"
                        value={formCustomHeadline}
                        onChange={(e) => setFormCustomHeadline(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* Profile: Tabletop Menu Stand */}
                {formProfileType === 'menu_tap_to_order' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Target Kitchen / Storefront</label>
                        <select
                          value={formStorefrontSlug}
                          onChange={(e) => setFormStorefrontSlug(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                        >
                          {storefronts.map(store => (
                            <option key={store.slug} value={store.slug} className="bg-zinc-900 text-white">
                              {store.logoEmoji || '🍽️'} {store.businessName} ({store.town})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Table / Counter ID</label>
                        <input
                          type="text"
                          placeholder="e.g. Table 4, Bar Seat 2, Patio Booth"
                          value={formTableNumber}
                          onChange={(e) => setFormTableNumber(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile: Airbnb Wi-Fi Plaque */}
                {formProfileType === 'airbnb_wifi_plaque' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-mono uppercase text-zinc-400">Wi-Fi Network Name (SSID) *</label>
                        <input
                          type="text"
                          required
                          placeholder="BroadBay_LakeCabin_5G"
                          value={formWifiSsid}
                          onChange={(e) => setFormWifiSsid(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Security Type</label>
                        <select
                          value={formWifiAuthType}
                          onChange={(e) => setFormWifiAuthType(e.target.value as any)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                        >
                          <option value="WPA" className="bg-zinc-900">WPA / WPA2 (Standard)</option>
                          <option value="WEP" className="bg-zinc-900">WEP</option>
                          <option value="nopass" className="bg-zinc-900">No Password (Open)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono uppercase text-zinc-400">Wi-Fi Password</label>
                      <input
                        type="text"
                        placeholder="CabinPassword2026!"
                        value={formWifiPassword}
                        onChange={(e) => setFormWifiPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* Profile: Scavenger Hunt & Mystery Beacon */}
                {formProfileType === 'scavenger_hunt_beacon' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Beacon ID</label>
                        <input
                          type="text"
                          placeholder="beacon-grainery-oss"
                          value={formHuntBeaconId}
                          onChange={(e) => setFormHuntBeaconId(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono uppercase text-zinc-400">Secret Mystery Perk</label>
                        <input
                          type="text"
                          placeholder="15% Off Hand Tools & Free Honey Stick"
                          value={formHuntSecretPerk}
                          onChange={(e) => setFormHuntSecretPerk(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile: Custom URL */}
                {formProfileType === 'custom_url' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-zinc-400">Target Web Link (URL) *</label>
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/custom-promo"
                      value={formDirectTargetUrl}
                      onChange={(e) => setFormDirectTargetUrl(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
                >
                  {editingCard ? 'Update Stored Card 💾' : 'Save to NFC Database 🚀'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: OFFLINE PROGRAMMING TOOLS & SPEC SHEET */}
      {/* ========================================================================= */}
      {activeOfflineModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                  <Cpu className="w-4 h-4" />
                  <span>Offline Hardware Programmer</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  Program &ldquo;{activeOfflineModalCard.cardName}&rdquo; Off the Website
                </h3>
              </div>
              <button
                onClick={() => setActiveOfflineModalCard(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Offline Specs Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              
              <div className="sm:col-span-5 flex flex-col items-center justify-center text-center space-y-3 bg-black/40 p-5 rounded-2xl border border-white/5">
                <div className="bg-white p-3 rounded-2xl shadow-inner inline-block mx-auto">
                  {offlineQrDataUrl ? (
                    <img src={offlineQrDataUrl} alt="Card QR" className="w-36 h-36 mx-auto" />
                  ) : (
                    <div className="w-36 h-36 bg-zinc-200 animate-pulse rounded-xl" />
                  )}
                </div>
                <div className="text-[11px] font-bold text-zinc-300">
                  Dual-Payload Backup QR
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Spec Sheet</span>
                </button>
              </div>

              <div className="sm:col-span-7 space-y-4">
                
                {/* 1-Click NFC Tools Payload Copy */}
                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-amber-400 tracking-wider">
                    NFC Tools App Payload
                  </div>
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 font-mono text-[11px] text-zinc-300 break-all max-h-24 overflow-y-auto">
                    {formatPayloadForNfcTools(activeOfflineModalCard).payload}
                  </div>
                  <button
                    onClick={() => handleCopyNfcTools(activeOfflineModalCard)}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy for NFC Tools App</span>
                  </button>
                </div>

                {/* Direct File Downloads */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {activeOfflineModalCard.profileType === 'digital_biz_card' ? (
                    <button
                      onClick={() => handleDownloadVcf(activeOfflineModalCard)}
                      className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .VCF</span>
                    </button>
                  ) : activeOfflineModalCard.profileType === 'airbnb_wifi_plaque' ? (
                    <button
                      onClick={() => handleDownloadWifi(activeOfflineModalCard)}
                      className="py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      <span>Wi-Fi Config</span>
                    </button>
                  ) : (
                    <a
                      href={buildCardTargetUrl(activeOfflineModalCard)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      <span>Test Target Link</span>
                    </a>
                  )}

                  <a
                    href={offlineQrDataUrl}
                    download={`${activeOfflineModalCard.cardName.replace(/\s+/g, '_')}-qr.png`}
                    className="py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/10"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download QR</span>
                  </a>
                </div>

              </div>

            </div>

            {/* Offline Steps */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5 text-xs text-zinc-400">
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">
                Offline Burning Instructions:
              </div>
              <p>
                1. Tap <strong>&quot;Copy for NFC Tools App&quot;</strong> above.<br />
                2. Open <strong>NFC Tools</strong> on your smartphone or desktop reader.<br />
                3. Go to <strong>Write &gt; Add a record</strong>, select <strong>{formatPayloadForNfcTools(activeOfflineModalCard).recordType}</strong>, and paste.<br />
                4. Tap your blank NFC card/stand against your device to flash.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SIMULATE CUSTOMER PHONE TAP */}
      {/* ========================================================================= */}
      {activeSimulateModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center relative">
            
            <button
              onClick={() => setActiveSimulateModalCard(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>Simulated Customer Phone Tap</span>
              </div>
              <h3 className="text-xl font-black text-white">
                {activeSimulateModalCard.businessName}
              </h3>
              <p className="text-xs text-zinc-400">
                What a customer or guest sees when tapping their phone to this hardware
              </p>
            </div>

            {/* Simulated Mobile Card Container */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900 via-black to-[#0a0a14] border-2 border-amber-400/40 space-y-5 text-left shadow-2xl">
              
              <div className="flex items-center justify-between">
                <span className="text-3xl">{activeSimulateModalCard.logoUrl || '⚡'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">
                  ✓ 0.1s Tap Verified
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-black text-white">
                  {activeSimulateModalCard.contactFullName || activeSimulateModalCard.businessName}
                </h4>
                <p className="text-xs text-zinc-400">
                  {activeSimulateModalCard.customHeadline || 'Welcome! How was your experience today?'}
                </p>
              </div>

              {/* Digital vCard Interactive Action */}
              {activeSimulateModalCard.profileType === 'digital_biz_card' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-white/5 rounded-2xl space-y-1 text-xs text-zinc-300">
                    <div className="font-bold text-white">📞 {activeSimulateModalCard.contactPhone || '508-507-0305'}</div>
                    <div className="text-zinc-400">✉️ {activeSimulateModalCard.contactEmail || 'frijj555@gmail.com'}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadVcf(activeSimulateModalCard)}
                    className="w-full py-3 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Save Contact to Phone Book (1-Tap)</span>
                  </button>
                </div>
              )}

              {/* Google Review Stars Funnel Interactive */}
              {activeSimulateModalCard.profileType === 'google_review_booster' && (
                <div className="space-y-3 pt-2 text-center">
                  <div className="text-xs text-zinc-300 font-bold">Rate your experience:</div>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          if (star >= (activeSimulateModalCard.thresholdStars || 4)) {
                            window.open(activeSimulateModalCard.googleReviewUrl || 'https://google.com', '_blank');
                          } else {
                            alert('Thank you! Routing to private direct manager feedback form to address your concerns.');
                          }
                        }}
                        className="p-2 text-2xl hover:scale-125 transition-transform"
                        title={`${star} Stars`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-500">
                    4-5 Stars directly launches Google Review screen with 5 stars pre-selected.
                  </p>
                </div>
              )}

              {/* Wi-Fi Interactive */}
              {activeSimulateModalCard.profileType === 'airbnb_wifi_plaque' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-2xl space-y-1 text-xs text-sky-300">
                    <div>📶 Network: <strong>{activeSimulateModalCard.wifiSsid || 'BroadBay_Guest_5G'}</strong></div>
                    <div>🔑 Password: <strong>{activeSimulateModalCard.wifiPassword || 'Ossipee2026!'}</strong></div>
                  </div>
                  <a
                    href={activeSimulateModalCard.cabinHouseGuideUrl || '/courier'}
                    className="block w-full py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase tracking-wider text-center"
                  >
                    Open Guest Guide & Order Firewood ➔
                  </a>
                </div>
              )}

              {/* Menu & Store Crawl */}
              {(activeSimulateModalCard.profileType === 'menu_tap_to_order' || activeSimulateModalCard.profileType === 'scavenger_hunt_beacon') && (
                <div className="pt-2">
                  <a
                    href={buildCardTargetUrl(activeSimulateModalCard)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 rounded-2xl bg-amber-400 text-black font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-amber-400/20"
                  >
                    Open Live Destination ➔
                  </a>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DIRECT WEB NFC FLASHER */}
      {/* ========================================================================= */}
      {activeWebNfcModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e0e14] border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-center relative">
            
            <button
              onClick={() => setActiveWebNfcModalCard(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Web NFC Hardware Flasher</span>
              </div>
              <h3 className="text-xl font-black text-white">
                Flashing &ldquo;{activeWebNfcModalCard.cardName}&rdquo;
              </h3>
            </div>

            <div className="p-8 rounded-3xl bg-black/60 border border-white/5 flex flex-col items-center justify-center space-y-4">
              {isNfcWriting ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center animate-pulse">
                    <Radio className="w-10 h-10 text-amber-400 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-black uppercase text-white">Hold Blank NFC Tag to Phone Back</div>
                    <p className="text-xs text-zinc-400">Writing NDEF Record directly to chip memory...</p>
                  </div>
                </>
              ) : nfcWriteSuccess ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                    <Check className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-black uppercase text-emerald-400">NFC Tag Successfully Programmed!</div>
                    <p className="text-xs text-zinc-400">Ready for instant field deployment.</p>
                  </div>
                </>
              ) : nfcWriteError ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-red-400">{nfcWriteError}</div>
                    <p className="text-[11px] text-zinc-500">
                      Use the 1-click NFC Tools exporter or QR companion!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Radio className="w-12 h-12 text-amber-400 animate-pulse" />
                  <div className="text-xs text-zinc-400">Ready to write.</div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleWriteNfc(buildCardTargetUrl(activeWebNfcModalCard))}
                disabled={isNfcWriting}
                className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
              >
                Retry Write Tag ⚡
              </button>
              <button
                onClick={() => {
                  setActiveWebNfcModalCard(null);
                  setActiveOfflineModalCard(activeWebNfcModalCard);
                }}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold"
              >
                Use NFC Tools 🖨️
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
