'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useNfcStore } from '@/lib/store';
import { NfcCardConfig, ReviewProduct } from '@/lib/types';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import ImageUpload from '@/components/ImageUpload';
import { 
  Radio, 
  Sparkles, 
  Cpu, 
  Scan, 
  CheckCircle2, 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Share2, 
  Smartphone, 
  Palette, 
  Layers, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Wifi, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Utensils, 
  Truck, 
  MessageSquare, 
  Compass, 
  ExternalLink, 
  ShoppingBag, 
  Plus, 
  ArrowRight, 
  Zap, 
  HelpCircle,
  FileCode,
  Tag,
  DollarSign,
  Award,
  Ticket,
  Wrench,
  MapPin,
  Flame,
  Info,
  Play,
  Pause,
  Printer,
  ListFilter,
  CheckCircle,
  AlertTriangle,
  Edit2,
  Trash2,
  Save,
  Search,
  Eye,
  CreditCard,
  SlidersHorizontal,
  Key,
  ChevronDown,
  ChevronUp,
  X,
  FileText
} from 'lucide-react';

export type NfcActionType = 
  | 'google_review' 
  | 'menu' 
  | 'driver_dispatch' 
  | 'vcard' 
  | 'paypal_pay' 
  | 'social_hub' 
  | 'loyalty_pass' 
  | 'event_ticket' 
  | 'work_quote' 
  | 'wifi' 
  | 'sms' 
  | 'pet_tag' 
  | 'shortcuts' 
  | 'town_node' 
  | 'url';

export type NfcFormFactorType = 'card' | 'sticker' | 'stand' | 'wood_puck' | 'keychain';

export interface BatchCardItem {
  id: number;
  serialNumber: string;
  uid?: string;
  status: 'pending' | 'flashing' | 'completed' | 'failed';
  payloadUrl: string;
  cardType: string;
  flashedAt?: string;
  qrDataUrl?: string;
}

export interface NfcCapabilityItem {
  id: NfcActionType;
  title: string;
  category: 'growth' | 'contact' | 'courier' | 'cashless' | 'trades' | 'automation' | 'community';
  categoryLabel: string;
  badge: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  howItWorks: string;
  bestHardware: string;
  chipRecommendation: string;
  sampleHeadline: string;
  realWorldExample: string;
  defaultPayload: string;
}

export const ALL_NFC_CAPABILITIES: NfcCapabilityItem[] = [
  {
    id: 'google_review',
    title: 'Smart 5-Star Google & Yelp Review Booster',
    category: 'growth',
    categoryLabel: 'Business Growth & Reputation',
    badge: '★ Most Popular',
    icon: '⭐',
    shortDesc: 'Filter 5-star reviews to Google Maps while intercepting lower ratings into private owner feedback.',
    fullDesc: 'Place this counter stand or card at your checkout register. When satisfied customers tap their phone, it instantly opens the Google Maps 5-star review dialog with pre-filled 5 stars. If a customer rates 1-3 stars, it privately routes their complaint directly to your phone so you can resolve it before it goes public.',
    howItWorks: 'Taps trigger an intelligent review funnel webapp that checks user sentiment and opens Google Maps Write Review.',
    bestHardware: 'Acrylic Countertop Stand or Double-Sided Table Tent',
    chipRecommendation: 'NTAG213 / NTAG215 (NDEF URL)',
    sampleHeadline: 'Tap phone to review us on Google & Yelp!',
    realWorldExample: 'Smoke World Ossipee & PNB Eats counter checkouts.',
    defaultPayload: 'https://search.google.com/local/writereview?placeid=ChIJb6eBq9f94okRGb_SmokeWorldOss'
  },
  {
    id: 'menu',
    title: 'Table-Side Digital Menu & Contactless Ordering',
    category: 'growth',
    categoryLabel: 'Hospitality & Dining',
    badge: '🍔 Contactless Dining',
    icon: '🍽️',
    shortDesc: 'Let diners tap the table wood puck to browse live food menus, customize orders, and buzz kitchen staff.',
    fullDesc: 'Mount waterproof NFC tags or laser-engraved maple wood pucks to patio tables and bar seating. Customers instantly access full digital menus with allergen tags, daily chef specials, and direct checkout without waiting for servers or touching sticky paper menus.',
    howItWorks: 'NFC encodes unique table IDs (e.g., /site/pnb-eats?table=4) so orders are instantly routed to the kitchen display.',
    bestHardware: 'Engraved Maple Wood Puck or 30mm Waterproof Epoxy Table Sticker',
    chipRecommendation: 'NTAG213 (Compact URL)',
    sampleHeadline: 'Tap table to browse live menu & order!',
    realWorldExample: 'PNB Eats Roadside Grill & Patio (Route 25, Effingham).',
    defaultPayload: 'https://townraise.org/site/pnb-eats'
  },
  {
    id: 'driver_dispatch',
    title: '1-Tap Emergency Courier & 4x4 Driver Dispatch',
    category: 'courier',
    categoryLabel: 'On-The-Go & Transportation',
    badge: '🛻 Express Transit',
    icon: '🚗',
    shortDesc: 'Instant roadside assistance, courier delivery booking, or 1-tap phone dispatch to local drivers.',
    fullDesc: 'Stick an NFC tag inside vehicle consoles, loading docks, or store backrooms. With one tap, staff or stranded motorists can dispatch Sean Martin 4x4 Vanguard courier fleet for winter towing, lumber hauling, grocery pickup, or emergency hot-shot parcels.',
    howItWorks: 'Encodes direct telephone dispatch URI (tel:5085070305) or the live GPS courier booking portal.',
    bestHardware: 'Heavy-Duty Key Fob or Automotive Dashboard Epoxy Sticker',
    chipRecommendation: 'NTAG213 / NTAG216',
    sampleHeadline: 'Tap phone to dispatch 4x4 courier & towing!',
    realWorldExample: 'Sean Martin Vanguard Fleet & Carroll County 4x4 Dispatch.',
    defaultPayload: 'tel:5085070305'
  },
  {
    id: 'vcard',
    title: 'Digital Business Card (vCard) & Instant Contact Save',
    category: 'contact',
    categoryLabel: 'Networking & Executive Identity',
    badge: '📇 Paperless Networking',
    icon: '📱',
    shortDesc: '1-tap saves your name, phone, email, company, and bio directly into Apple Contacts or Google Contacts.',
    fullDesc: 'Never run out of business cards again. Tap your matte black NFC smart card to anyone’s smartphone to instantly prompt them with "Add Contact". It transfers full name, phone number, email, town node, job title, and website without typing.',
    howItWorks: 'Encodes standard NDEF vCard 3.0 electronic business card records recognized natively by iOS and Android.',
    bestHardware: 'Matte Jet Black Smart PVC Card or Brushed Metal NFC Card',
    chipRecommendation: 'NTAG215 / NTAG216 (High Storage for Contact Records)',
    sampleHeadline: 'Tap phone to save my contact info & card!',
    realWorldExample: 'Walt Henderson (Walt’s Woodcraft) & Sean Martin (Townraise Lead).',
    defaultPayload: 'BEGIN:VCARD\nVERSION:3.0\nFN:Sean Martin\nORG:Townraise Network\nTEL:(508) 507-0305\nEMAIL:frijj555@gmail.com\nADR:;;Effingham;NH;;03882;\nEND:VCARD'
  },
  {
    id: 'paypal_pay',
    title: 'Cashless PayPal Payments, Checkout & Driver Tip Jar',
    category: 'cashless',
    categoryLabel: 'Cashless Payments & Tipping',
    badge: '💳 Instant Settlement',
    icon: '💵',
    shortDesc: '1-tap opens PayPal (frijj555@gmail.com / paypal.me/seanhse97) for instant payment or contactless tipping.',
    fullDesc: 'Perfect for roadside vendors, pop-up craft markets, food trucks, and courier delivery drivers. Customers tap the card or stand to instantly open PayPal, Venmo, or Apple Pay pre-filled to your verified recipient account with custom amounts.',
    howItWorks: 'Directly triggers PayPal / PayPal.me deep links with pre-configured recipient addresses for instant friction-free settlement.',
    bestHardware: 'Countertop Tip Jar Stand or Driver Lanyard Badge',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap phone to pay or tip via PayPal!',
    realWorldExample: 'Sean Martin Delivery & Carroll County Artisan Market Tipping.',
    defaultPayload: 'https://paypal.me/seanhse97'
  },
  {
    id: 'social_hub',
    title: 'Multi-Link Social Hub & Brand Linktree',
    category: 'growth',
    categoryLabel: 'Social Media & Marketing',
    badge: '🌐 Viral Growth',
    icon: '🔗',
    shortDesc: 'Consolidate Instagram, TikTok, Facebook, YouTube, Spotify, and your store website into 1 seamless tap.',
    fullDesc: 'Turn physical foot traffic into loyal online followers. Tap the NFC card to bring customers directly to your branded bio link hub showcasing your latest posts, video reels, seasonal discounts, and social handles.',
    howItWorks: 'Encodes your consolidated link tree URL with embedded analytics to track which physical locations generate the most clicks.',
    bestHardware: 'Branded Acrylic Window / Register Stand',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to follow our Instagram, TikTok & Facebook!',
    realWorldExample: 'Local boutiques, barber shops, coffee roasters, and artists in Carroll County.',
    defaultPayload: 'https://instagram.com/townraise'
  },
  {
    id: 'loyalty_pass',
    title: 'Townraise Regional Loyalty Passport (+35 Pts per Tap)',
    category: 'community',
    categoryLabel: 'Loyalty & Gamification',
    badge: '🏆 Earn Rewards',
    icon: '🎁',
    shortDesc: 'Reward recurring local customers with instant loyalty reward points and unlock secret community perks.',
    fullDesc: 'Unite surrounding towns into one functional rewards economy. When customers tap the in-store Townraise Loyalty Tag, +25 to +50 points are credited to their regional digital pass. Points can be redeemed for delivery discounts, free coffees, or marketplace coupons.',
    howItWorks: 'Connects to the Townraise Gamification Engine to authenticate customer wallets and increment town points.',
    bestHardware: 'In-Store Wooden NFC Beacon or Register Tap Disc',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to check in & earn +35 Townraise Loyalty Points!',
    realWorldExample: 'All participating merchants across Effingham, Ossipee, Freedom, and Tamworth.',
    defaultPayload: 'https://townraise.org/rewards?checkin=store-loyalty'
  },
  {
    id: 'event_ticket',
    title: 'Community Event RSVP & Fast-Track Door Ticket Pass',
    category: 'community',
    categoryLabel: 'Events & Entertainment',
    badge: '🎟️ Door Pass',
    icon: '🎪',
    shortDesc: '1-tap event check-in for live music patio nights, autumn craft fairs, brewery tastings, and town meetings.',
    fullDesc: 'Eliminate paper ticket lines and check-in bottlenecks. Attendees tap their NFC Townraise wristband, keychain, or pass at the entrance to verify their RSVP, unlock VIP access, and collect community attendance badges.',
    howItWorks: 'Encodes secure event check-in tokens that authenticate with the live community event calendar.',
    bestHardware: 'Waterproof NFC Silicone Wristband or VIP Badge',
    chipRecommendation: 'NTAG213 / NTAG215',
    sampleHeadline: 'Tap to check-in with your Townraise Event Pass!',
    realWorldExample: 'Tamworth Distillers Craft Spirits Tasting & North Conway Foliage Craft Fair.',
    defaultPayload: 'https://townraise.org/events'
  },
  {
    id: 'work_quote',
    title: 'Contractor Transformation Proof & Instant Work Quote',
    category: 'trades',
    categoryLabel: 'Trades & Home Improvement',
    badge: '🔨 Contractor Proof',
    icon: '🪓',
    shortDesc: 'Showcase interactive Before & After craftsmanship proof and let homeowners request instant project quotes.',
    fullDesc: 'Leave behind an NFC magnet or card with homeowners after finishing a job. Neighbors and visitors tap the tag to see high-resolution Before & After transformation photos (roofing, decks, tree removal, stonework) and submit quote requests with one tap.',
    howItWorks: 'Links directly to the contractor’s visual portfolio and pre-filled estimate request form on the Townraise Work Board.',
    bestHardware: 'Magnetic NFC Job Site Plaque or Smart Business Card',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to view Before & After transformations & get quote!',
    realWorldExample: 'Walt Henderson Carpentry, Ossipee Valley Tree Works & Carroll County Trades.',
    defaultPayload: 'https://townraise.org/work?tab=gallery'
  },
  {
    id: 'wifi',
    title: 'Instant Guest Wi-Fi Auto-Connect (Zero Password Typing)',
    category: 'automation',
    categoryLabel: 'Connectivity & Hospitality',
    badge: '📶 Zero Password',
    icon: '⚡',
    shortDesc: 'Guests tap the card with their phone and are instantly connected to your secure Wi-Fi network.',
    fullDesc: 'Stop spelling out complex Wi-Fi passwords to Airbnb guests, coffee shop patrons, or customers. A single NFC tap automatically configures their phone’s network settings and logs them onto the high-speed guest network securely.',
    howItWorks: 'Uses standard Wi-Fi Simple Configuration protocol (WIFI:S:SSID;T:WPA;P:Password;;) recognized natively by iOS & Android.',
    bestHardware: 'Lakeside Cabin Wall Plaque or Tabletop Wooden Stand',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap phone to connect to Guest Wi-Fi instantly!',
    realWorldExample: 'Lakes Region Cottages, Airbnb rentals, and local coffee shops.',
    defaultPayload: 'WIFI:S:CarrollCounty-Guest-WiFi;T:WPA2;P:LakesRegion2026!;;'
  },
  {
    id: 'sms',
    title: 'Pre-Composed SMS & WhatsApp Emergency Dispatch',
    category: 'automation',
    categoryLabel: 'Direct Communications',
    badge: '💬 1-Tap Text',
    icon: '✉️',
    shortDesc: 'Tapping automatically opens the phone’s messaging app with recipient phone number and pre-written message.',
    fullDesc: 'Ideal for emergency service calls, customer service feedback, or roadside 4x4 help. When tapped, the customer’s default messaging app opens with your phone number and pre-formatted text (e.g. "I need an urgent 4x4 tow in Effingham NH").',
    howItWorks: 'Encodes standard URI scheme (sms:+15085070305?body=...) for instant message sending.',
    bestHardware: 'Equipment Sticker or Fleet Vehicle Decal',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to send pre-formatted courier text!',
    realWorldExample: 'Hot-shot delivery pings and emergency vehicle recovery in Carroll County.',
    defaultPayload: 'sms:5085070305?body=Hi%20Sean!%20I%20need%20a%20courier%20run%20in%20Carroll%20County.'
  },
  {
    id: 'pet_tag',
    title: 'Smart Pet Collar ID & Lost Property Recovery Beacon',
    category: 'community',
    categoryLabel: 'Pet & Asset Protection',
    badge: '🐾 Smart Finder',
    icon: '🐕',
    shortDesc: 'Pet collar tag displaying owner phone number, home address, medical notes, and reward info upon tap.',
    fullDesc: 'Attach a durable, waterproof NFC pendant to your dog or cat’s collar, or to toolboxes and luggage. If lost, anyone with a smartphone can tap the tag to immediately see your direct phone number, pet medical needs, and reward details without needing a chip scanner.',
    howItWorks: 'Directly opens an emergency contact page or triggers a phone call to the owner.',
    bestHardware: 'Epoxy Waterproof Pet Collar Pendant or Metal Keyring Tag',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to see pet owner contact info & medical details!',
    realWorldExample: 'Carroll County family pets, hunting dogs, and contractor toolkits.',
    defaultPayload: 'https://townraise.org/contact?item=pet-tag-max'
  },
  {
    id: 'shortcuts',
    title: 'Apple Shortcuts & Smart Vehicle Automation Triggers',
    category: 'automation',
    categoryLabel: 'Smart Automation & IoT',
    badge: '⚡ Apple Shortcuts',
    icon: '🚀',
    shortDesc: 'Trigger automated iOS Shortcuts (open garage, start GPS route, play driving playlist, adjust lights).',
    fullDesc: 'Mount NFC chips in your delivery truck phone mount, bedside table, or workshop bench. Tapping with an iPhone instantly executes custom Apple Shortcuts: launching turn-by-turn navigation to the next delivery stop, opening gate codes, or toggling shop power.',
    howItWorks: 'Uses iOS native NFC Background Tag Reading to trigger personal or home automation workflows.',
    bestHardware: 'Dashboard 3M Adhesive Disc or Keychain',
    chipRecommendation: 'NTAG213 / NTAG215',
    sampleHeadline: 'Tap phone to trigger automated delivery route workflow!',
    realWorldExample: 'Courier delivery route automation and smart garage opening.',
    defaultPayload: 'shortcuts://run-shortcut?name=CourierDispatch'
  },
  {
    id: 'town_node',
    title: 'Carroll County Town Node Hub & Live Community Wire',
    category: 'community',
    categoryLabel: 'Regional Town Unification',
    badge: '🌲 Regional Node',
    icon: '🏛️',
    shortDesc: 'Instantly launch the unified local hub for Effingham, Ossipee, Freedom, Wolfeboro, Conway, or Tamworth.',
    fullDesc: 'Part of the mission to unite surrounding towns in one functional atmosphere. Tapping this tag instantly takes residents and tourists to their town’s live pulse: active couriers, neighborhood feed shoutouts, open restaurants, and local event schedules.',
    howItWorks: 'Routes to the town command dashboard pre-filtered to the chosen municipality.',
    bestHardware: 'Town Hall Wall Plaque or Community Bulletin Stand',
    chipRecommendation: 'NTAG213',
    sampleHeadline: 'Tap to enter the live Carroll County Town Node!',
    realWorldExample: 'Effingham, Ossipee, Freedom, and Conway town welcome kiosks.',
    defaultPayload: 'https://townraise.org/towns?town=Effingham'
  },
  {
    id: 'url',
    title: 'Custom Deep Link & Dynamic Web Redirect',
    category: 'growth',
    categoryLabel: 'Custom & Enterprise',
    badge: '🌐 Universal Link',
    icon: '🔮',
    shortDesc: 'Encode any custom website URL, Shopify checkout, PDF catalog, or dynamic web application.',
    fullDesc: 'Total flexibility. Program your NFC tag to point to any online destination: booking pages, real estate virtual 3D walkthroughs, downloadable PDF guides, product registration pages, or private app webhooks.',
    howItWorks: 'Encodes standard NDEF URI record pointing to any valid HTTPS URL.',
    bestHardware: 'Universal Smart PVC Card, Table Stand, or Sticker',
    chipRecommendation: 'NTAG213 / NTAG215 / NTAG216',
    sampleHeadline: 'Tap phone to launch custom experience!',
    realWorldExample: 'Custom brand campaigns and real estate virtual tours.',
    defaultPayload: 'https://townraise.org'
  }
];

interface ScannedTagData {
  uid: string;
  chipType: string;
  capacityBytes: number;
  usedBytes: number;
  isLocked: boolean;
  technology: string;
  records: {
    type: string;
    payload: string;
    description: string;
    actionUrl?: string;
  }[];
  timestamp: string;
}

const PRESET_SIMULATED_TAGS: { name: string; desc: string; data: ScannedTagData }[] = [
  {
    name: 'Smoke World Ossipee Smart Review Stand',
    desc: 'NTAG213 • 144 Bytes • Google Review 5-Star Filter',
    data: {
      uid: '04:7B:3A:89:FE:12:80',
      chipType: 'NXP NTAG213 (ISO/IEC 14443-3A)',
      capacityBytes: 144,
      usedBytes: 86,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag • 13.56 MHz',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'https://townraise.org/tap/card-oasis-smoke-world',
          description: 'Smart Google Review Funnel for Smoke World Ossipee',
          actionUrl: 'https://townraise.org/tap/card-oasis-smoke-world'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Sean Martin Express Courier Tip & PayPal Stand',
    desc: 'NTAG213 • 144 Bytes • Instant PayPal (seanhse97@gmail.com)',
    data: {
      uid: '04:99:EE:41:2B:67:88',
      chipType: 'NXP NTAG213 (Cashless Tip Jar)',
      capacityBytes: 144,
      usedBytes: 52,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'https://paypal.me/seanhse97',
          description: 'Instant Cashless Payment / Tip to Sean Martin (seanhse97@gmail.com)',
          actionUrl: 'https://paypal.me/seanhse97'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'PNB Eats Roadside Table #4 Stand',
    desc: 'NTAG215 • 504 Bytes • Dine-in Mobile Ordering',
    data: {
      uid: '04:1C:88:52:90:3A:81',
      chipType: 'NXP NTAG215 (High Capacity)',
      capacityBytes: 504,
      usedBytes: 132,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag • 13.56 MHz',
      records: [
        {
          type: 'URI (NDEF Record #1)',
          payload: 'https://townraise.org/site/pnb-eats?table=4',
          description: 'PNB Eats Table #4 Dine-In Menu & Instant Ticket',
          actionUrl: 'https://townraise.org/site/pnb-eats?table=4'
        },
        {
          type: 'Text (NDEF Record #2)',
          payload: 'Table 4 • Roadside Grill • Effingham NH',
          description: 'Location Metadata'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Walt\'s Woodcraft Contractor vCard & Proofs',
    desc: 'NTAG216 • 888 Bytes • Master Carpenter Contact vCard',
    data: {
      uid: '04:33:AA:19:D4:55:82',
      chipType: 'NXP NTAG216 (High Storage)',
      capacityBytes: 888,
      usedBytes: 240,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag',
      records: [
        {
          type: 'Text/vCard',
          payload: 'BEGIN:VCARD\nVERSION:3.0\nFN:Walter Henderson\nORG:Walt\'s Woodcraft\nTITLE:Master Carpenter\nTEL:(603)539-8120\nEMAIL:walt@woodcraft.local\nADR:;;Effingham;NH;;03882;\nEND:VCARD',
          description: 'Walter Henderson - Walt\'s Woodcraft (Effingham NH)',
          actionUrl: 'tel:6035398120'
        },
        {
          type: 'URI (NDEF Record #2)',
          payload: 'https://townraise.org/work?tab=gallery',
          description: 'Interactive Before & After Project Portfolio',
          actionUrl: 'https://townraise.org/work?tab=gallery'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Carroll County Lakeside Guest Wi-Fi Tag',
    desc: 'NTAG213 • 144 Bytes • Instant Auto-Connect Wi-Fi',
    data: {
      uid: '04:F8:11:55:22:90:31',
      chipType: 'NXP NTAG213',
      capacityBytes: 144,
      usedBytes: 74,
      isLocked: true,
      technology: 'NFC Forum Type 2 Tag',
      records: [
        {
          type: 'Wi-Fi Configuration',
          payload: 'WIFI:S:CarrollCounty-Guest-WiFi;T:WPA2;P:LakesRegion2026!;;',
          description: 'Auto-Connects iOS & Android to Guest High-Speed Wi-Fi'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  },
  {
    name: 'Lost Pet & Emergency Recovery Beacon (Max)',
    desc: 'NTAG213 • 144 Bytes • Pet Collar Waterproof Tag',
    data: {
      uid: '04:EE:33:88:12:44:99',
      chipType: 'NXP NTAG213 Epoxy Pendant',
      capacityBytes: 144,
      usedBytes: 88,
      isLocked: false,
      technology: 'NFC Forum Type 2 Tag',
      records: [
        {
          type: 'URI (Emergency Pet Record)',
          payload: 'https://townraise.org/contact?item=pet-tag-max',
          description: 'Max (Golden Retriever) • Owner Phone: (508) 507-0305 • Reward Offered',
          actionUrl: 'tel:5085070305'
        }
      ],
      timestamp: 'Just now (Simulated NFC Tap)'
    }
  }
];

export default function NfcTagReaderCustomizer() {
  const { cards, addCard, updateCard, deleteCard, playDeliveryChime, products, addToCart, currentUser } = useNfcStore();

  // Active Main Tab: Quick 1-Tap Programmer vs Fleet vs Customizer vs Batch vs Capabilities vs Reader vs Export
  const [activeTab, setActiveTab] = useState<'quick' | 'fleet' | 'customizer' | 'batch' | 'capabilities' | 'reader' | 'export'>('quick');
  const [capabilitiesFilter, setCapabilitiesFilter] = useState<'all' | 'growth' | 'contact' | 'courier' | 'cashless' | 'trades' | 'automation' | 'community'>('all');
  const [showIosGuide, setShowIosGuide] = useState(false);

  // --- CARD EDITING & FLEET STATE ---
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');
  const [activeQrModalCard, setActiveQrModalCard] = useState<NfcCardConfig | null>(null);
  const [activeCardQrDataUrl, setActiveCardQrDataUrl] = useState<string | null>(null);

  // --- NFC READER STATE ---
  const [isWebNfcScanning, setIsWebNfcScanning] = useState(false);
  const [scanStatusMessage, setScanStatusMessage] = useState<string | null>(null);
  const [scannedTag, setScannedTag] = useState<ScannedTagData | null>(PRESET_SIMULATED_TAGS[0].data);
  const [isSimulatingTap, setIsSimulatingTap] = useState(false);
  const [hasWebNfcSupport, setHasWebNfcSupport] = useState<boolean>(false);
  const [manualPastePayload, setManualPastePayload] = useState('');
  const [showManualImportModal, setShowManualImportModal] = useState(false);

  // Check Web NFC support on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setHasWebNfcSupport(true);
    }
  }, []);

  // --- CUSTOMIZER STATE ---
  const [actionType, setActionType] = useState<NfcActionType>('loyalty_pass');
  const [formFactor, setFormFactor] = useState<NfcFormFactorType>('card');

  // Payload Content State
  const [businessName, setBusinessName] = useState(currentUser?.name ? `${currentUser.name}'s Oasis Community Pass` : 'Oasis Carroll County Regional Pass');
  const [headline, setHeadline] = useState('Tap phone for instant Carroll County perks & 1-tap courier dispatch!');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4');
  const [customUrl, setCustomUrl] = useState('https://townraise.org');
  const [paypalUsername, setPaypalUsername] = useState('seanhse97');
  const [paypalEmail, setPaypalEmail] = useState('seanhse97@gmail.com');
  const [socialUrl, setSocialUrl] = useState('https://instagram.com/townraise');
  const [vCardData, setVCardData] = useState({
    name: currentUser?.name || 'Sean Martin',
    title: 'Lead Courier & Vanguard Operator',
    phone: currentUser?.phone || '(508) 507-0305',
    email: currentUser?.email || 'seanhse97@gmail.com',
    town: currentUser?.town ? `${currentUser.town}, NH` : 'Effingham, NH',
  });
  const [wifiData, setWifiData] = useState({
    ssid: 'CarrollCounty-Guest-WiFi',
    password: 'LakesRegion2026!',
    encryption: 'WPA2'
  });
  const [smsData, setSmsData] = useState({
    phone: currentUser?.phone || '(508) 507-0305',
    message: 'Hi Sean! I need a fast courier run in Carroll County.'
  });
  const [petData, setPetData] = useState({
    petName: 'Max (Golden Retriever)',
    ownerPhone: currentUser?.phone || '(508) 507-0305',
    medicalInfo: 'Friendly, microchipped, allergic to chicken',
    rewardText: '★ Reward offered if found!'
  });
  const [shortcutName, setShortcutName] = useState('CourierDispatch');
  const [selectedTownNode, setSelectedTownNode] = useState(currentUser?.town || 'Effingham');

  // Visual Customization State
  const [selectedColor, setSelectedColor] = useState('#0f172a');
  const [selectedTexture, setSelectedTexture] = useState<'matte' | 'carbon' | 'metal' | 'cyber' | 'holo'>('cyber');
  const [selectedEmoji, setSelectedEmoji] = useState('🌲');
  const [customLogoUrl, setCustomLogoUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [writeSuccessMsg, setWriteSuccessMsg] = useState<string | null>(null);
  const [isWritingNfc, setIsWritingNfc] = useState(false);
  const [generatedQrDataUrl, setGeneratedQrDataUrl] = useState<string>('');

  // ========================================================
  // BATCH 100-CARD PROGRAMMER STATE
  // ========================================================
  const [batchTargetCount, setBatchTargetCount] = useState<number>(100);
  const [batchPreset, setBatchPreset] = useState<'oasis_community' | 'courier_lifeline' | 'biz_review_sample' | 'event_door_pass' | 'tourist_landmark' | 'store_hunt_beacon' | 'custom_sequence'>('oasis_community');
  const [batchPrefix, setBatchPrefix] = useState('OASIS-PASS-');
  const [batchCustomBaseUrl, setBatchCustomBaseUrl] = useState('https://townraise.org/claim?pass=');
  const [isBatchConveyorActive, setIsBatchConveyorActive] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isAutoTurboFlashing, setIsAutoTurboFlashing] = useState(false);
  const [batchCards, setBatchCards] = useState<BatchCardItem[]>([]);
  const [showPrintLabelModal, setShowPrintLabelModal] = useState(false);

  // Initialize or re-generate batch cards list
  const initializeBatchCards = (count: number, preset: string, prefix: string, baseUrl: string) => {
    const list: BatchCardItem[] = [];
    for (let i = 1; i <= count; i++) {
      const serial = `${prefix}${String(i).padStart(3, '0')}`;
      let payload = '';
      let typeLabel = '';

      if (preset === 'oasis_community') {
        payload = `https://townraise.org/claim?pass=${serial}&welcome=50`;
        typeLabel = 'Oasis Rewards for Applying Pass (+50 Pts)';
      } else if (preset === 'courier_lifeline') {
        payload = `https://townraise.org/courier?card=${serial}&directPhone=5085070305&paypal=seanhse97`;
        typeLabel = 'Sean Martin 4x4 Hotline & Lifeline';
      } else if (preset === 'biz_review_sample') {
        payload = `https://townraise.org/tap/trial-${serial}`;
        typeLabel = 'Merchant 5-Star Review Sample';
      } else if (preset === 'event_door_pass') {
        payload = `https://townraise.org/events?ticket=${serial}`;
        typeLabel = 'Carroll County Event VIP Pass';
      } else if (preset === 'tourist_landmark') {
        payload = `https://townraise.org/tourist-hunts?checkin=${serial}`;
        typeLabel = 'Tourist Attraction Landmark Tag';
      } else if (preset === 'store_hunt_beacon') {
        payload = `https://townraise.org/store-hunting?spot=${serial}`;
        typeLabel = 'In-Store Mystery Perk NFC Beacon';
      } else {
        payload = `${baseUrl}${serial}`;
        typeLabel = 'Custom Serial Sequence';
      }

      list.push({
        id: i,
        serialNumber: serial,
        status: 'pending',
        payloadUrl: payload,
        cardType: typeLabel,
      });
    }
    setBatchCards(list);
    setCurrentBatchIndex(0);
  };

  // Run on initial mount
  useEffect(() => {
    initializeBatchCards(batchTargetCount, batchPreset, batchPrefix, batchCustomBaseUrl);
  }, []);

  // Recalculate when preset or target count changes
  const handlePresetChange = (newPreset: typeof batchPreset) => {
    setBatchPreset(newPreset);
    let pfx = 'OASIS-PASS-';
    let base = 'https://townraise.org/claim?pass=';
    if (newPreset === 'courier_lifeline') {
      pfx = 'SEAN-4X4-';
      base = 'https://townraise.org/courier?card=';
    } else if (newPreset === 'biz_review_sample') {
      pfx = 'REVIEW-';
      base = 'https://townraise.org/tap/trial-';
    } else if (newPreset === 'event_door_pass') {
      pfx = 'VIP-DOOR-';
      base = 'https://townraise.org/events?ticket=';
    } else if (newPreset === 'tourist_landmark') {
      pfx = 'LANDMARK-NH-';
      base = 'https://townraise.org/tourist-hunts?checkin=';
    } else if (newPreset === 'store_hunt_beacon') {
      pfx = 'STORE-HUNT-';
      base = 'https://townraise.org/store-hunting?spot=';
    }
    setBatchPrefix(pfx);
    setBatchCustomBaseUrl(base);
    initializeBatchCards(batchTargetCount, newPreset, pfx, base);
  };

  const handleTargetCountChange = (count: number) => {
    setBatchTargetCount(count);
    initializeBatchCards(count, batchPreset, batchPrefix, batchCustomBaseUrl);
  };

  // Flash single card in batch (physical or simulated)
  const flashCardAtIndex = (index: number, simulatedUid?: string) => {
    if (index >= batchCards.length) {
      setIsBatchConveyorActive(false);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
      playDeliveryChime();
      setWriteSuccessMsg(`🎉 All ${batchCards.length} Giveaway Cards have been successfully programmed and logged!`);
      return;
    }

    const card = batchCards[index];
    const uid = simulatedUid || `04:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`;
    
    // Register in fleet store
    addCard({
      cardName: `${card.serialNumber} (${card.cardType})`,
      businessName: businessName || 'Oasis Regional Giveaway Pass',
      googleReviewUrl: card.payloadUrl,
      mode: 'smart_funnel',
      thresholdStars: 4,
      customHeadline: headline,
      logoUrl: customLogoUrl || selectedEmoji,
      primaryColor: selectedColor,
      active: true,
      assignedLocation: `Giveaway Batch #${card.id}`
    });

    setBatchCards(prev => prev.map((c, i) => i === index ? {
      ...c,
      status: 'completed',
      uid,
      flashedAt: new Date().toLocaleTimeString(),
    } : c));

    setCurrentBatchIndex(index + 1);
    playDeliveryChime();

    if (index + 1 === batchCards.length) {
      setIsBatchConveyorActive(false);
      setIsAutoTurboFlashing(false);
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
      setWriteSuccessMsg(`🏆 BATCH COMPLETE! 100% of ${batchCards.length} Giveaway Cards are programmed & active in your Fleet.`);
    }
  };

  // Turbo Auto-Flash Simulation for Demoing 100 Cards
  const handleTurboSimulateAll = () => {
    setIsAutoTurboFlashing(true);
    let idx = currentBatchIndex;
    const interval = setInterval(() => {
      if (idx >= batchCards.length) {
        clearInterval(interval);
        setIsAutoTurboFlashing(false);
        return;
      }
      flashCardAtIndex(idx);
      idx++;
    }, 70);
  };

  // Continuous Physical Web NFC Batch Conveyor Loop
  const handleTogglePhysicalBatchConveyor = async () => {
    if (!('NDEFReader' in window)) {
      alert('Physical Web NFC batch flashing requires Chrome on Android or a Web NFC enabled device. You can test the conveyor belt with "Simulate Card Flash" or Turbo Auto-Flash!');
      return;
    }

    if (isBatchConveyorActive) {
      setIsBatchConveyorActive(false);
      setScanStatusMessage('Batch Conveyor Paused.');
      return;
    }

    try {
      setIsBatchConveyorActive(true);
      setScanStatusMessage(`📡 Conveyor Armed! Touch Card #${currentBatchIndex + 1} against antenna...`);
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = async (event: any) => {
        const nextIdx = currentBatchIndex;
        if (nextIdx >= batchCards.length) {
          setIsBatchConveyorActive(false);
          return;
        }

        const cardToFlash = batchCards[nextIdx];
        const chipUid = event.serialNumber || '04:XX:XX:XX:XX:XX:XX';

        try {
          // Write payload to physical card
          await ndef.write({
            records: [{ recordType: 'url', data: cardToFlash.payloadUrl }]
          });

          flashCardAtIndex(nextIdx, chipUid);
          setScanStatusMessage(`✅ Flashed Card #${nextIdx + 1} (${cardToFlash.serialNumber})! Touch Card #${nextIdx + 2}...`);
          confetti({ particleCount: 20, spread: 40 });
        } catch (err: any) {
          setScanStatusMessage(`⚠️ Error flashing card #${nextIdx + 1}: ${err.message}. Retrying...`);
        }
      };
    } catch (err: any) {
      setIsBatchConveyorActive(false);
      alert(`Could not start batch NFC antenna: ${err.message || err}`);
    }
  };

  // Export Batch CSV
  const handleExportBatchCsv = () => {
    let csv = 'Card ID,Serial Number,Card Type,Assigned UID,Status,Target Payload URL,Flashed Timestamp\n';
    batchCards.forEach(c => {
      csv += `"${c.id}","${c.serialNumber}","${c.cardType}","${c.uid || 'N/A'}","${c.status}","${c.payloadUrl}","${c.flashedAt || 'Pending'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `oasis-batch-100-cards-${batchPreset}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate target payload string based on active actionType
  const getComputedPayloadUrl = () => {
    switch (actionType) {
      case 'google_review':
        return googleReviewUrl || 'https://search.google.com/local/writereview';
      case 'menu':
        return `https://townraise.org/site/pnb-eats`;
      case 'driver_dispatch':
        return `tel:${smsData.phone.replace(/[^0-9]/g, '')}`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nN:${vCardData.name}\nFN:${vCardData.name}\nORG:${businessName}\nTITLE:${vCardData.title}\nTEL:${vCardData.phone}\nEMAIL:${vCardData.email}\nADR:;;${vCardData.town};;;;\nEND:VCARD`;
      case 'paypal_pay':
        return `https://paypal.me/${paypalUsername || 'seanhse97'}`;
      case 'social_hub':
        return socialUrl || 'https://instagram.com/townraise';
      case 'loyalty_pass':
        return `https://townraise.org/rewards?checkin=${encodeURIComponent(businessName)}`;
      case 'event_ticket':
        return `https://townraise.org/events`;
      case 'work_quote':
        return `https://townraise.org/work?tab=gallery`;
      case 'wifi':
        return `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};;`;
      case 'sms':
        return `sms:${smsData.phone.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(smsData.message)}`;
      case 'pet_tag':
        return `tel:${petData.ownerPhone.replace(/[^0-9]/g, '')}`;
      case 'shortcuts':
        return `shortcuts://run-shortcut?name=${encodeURIComponent(shortcutName)}`;
      case 'town_node':
        return `https://townraise.org/towns?town=${encodeURIComponent(selectedTownNode)}`;
      case 'url':
      default:
        return customUrl || 'https://townraise.org';
    }
  };

  // Update QR Code whenever payload changes
  useEffect(() => {
    const payload = getComputedPayloadUrl();
    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    }).then(url => setGeneratedQrDataUrl(url)).catch(() => {});
  }, [
    actionType, 
    googleReviewUrl, 
    customUrl, 
    paypalUsername, 
    socialUrl, 
    vCardData, 
    wifiData, 
    smsData, 
    petData, 
    shortcutName, 
    selectedTownNode, 
    businessName
  ]);

  // Load a Capability into Customizer Studio
  const handleLoadCapability = (cap: NfcCapabilityItem) => {
    setActionType(cap.id);
    setHeadline(cap.sampleHeadline);
    if (cap.id === 'google_review') setGoogleReviewUrl(cap.defaultPayload);
    if (cap.id === 'paypal_pay') setPaypalUsername('seanhse97');
    if (cap.id === 'url') setCustomUrl(cap.defaultPayload);
    if (cap.id === 'menu') setBusinessName('PNB Eats Roadside Grill');
    if (cap.id === 'driver_dispatch') setBusinessName('Sean Martin 4x4 Courier');
    if (cap.id === 'work_quote') setBusinessName('Walt\'s Woodcraft Carpentry');

    setActiveTab('customizer');
    setWriteSuccessMsg(`Loaded "${cap.title}" into Customizer Canvas!`);
    playDeliveryChime();
    confetti({ particleCount: 40, spread: 60 });
    setTimeout(() => setWriteSuccessMsg(null), 3500);
  };

  // Handle Real Web NFC Scanning with direct optional auto-import into website
  const handleStartWebNfcScan = async (autoImportToFleet?: boolean | React.SyntheticEvent) => {
    const shouldAutoImport = autoImportToFleet === true;
    if (!('NDEFReader' in window)) {
      setScanStatusMessage('Web NFC is not supported on this browser. Try Chrome on Android or paste raw payload below.');
      return;
    }

    try {
      setIsWebNfcScanning(true);
      setScanStatusMessage('📡 Ready! Hold physical NFC tag against your phone or reader antenna...');
      const ndef = new (window as any).NDEFReader();
      await ndef.scan();

      ndef.onreading = (event: any) => {
        const serialNumber = event.serialNumber || '04:XX:XX:XX:XX:XX:XX';
        const records = Array.from(event.message.records || []).map((r: any, idx: number) => {
          let text = '';
          try {
            const decoder = new TextDecoder(r.encoding || 'utf-8');
            text = decoder.decode(r.data);
          } catch {
            text = 'Raw NDEF Binary Content';
          }
          return {
            type: r.recordType || `Record #${idx + 1}`,
            payload: text,
            description: `Physical NDEF record of type ${r.recordType}`,
            actionUrl: text.startsWith('http') || text.startsWith('tel:') ? text : undefined
          };
        });

        const newTagData: ScannedTagData = {
          uid: serialNumber,
          chipType: 'Physical NFC Chip (Read via Web NFC API)',
          capacityBytes: 504,
          usedBytes: event.message.records ? event.message.records.length * 64 : 128,
          isLocked: false,
          technology: 'NFC Forum Type 2 / 4 Compatible',
          records: records.length > 0 ? records : [
            { type: 'NDEF Payload', payload: 'Physical tag detected successfully!', description: 'Scanned tag record' }
          ],
          timestamp: new Date().toLocaleTimeString()
        };

        setScannedTag(newTagData);
        setIsWebNfcScanning(false);
        setScanStatusMessage('✅ NFC Tag Scanned & Decoded Successfully!');
        playDeliveryChime();
        confetti({ particleCount: 30, spread: 60 });

        if (shouldAutoImport) {
          handleDirectImportTagToWebsite(newTagData);
        }
      };

      ndef.onreadingerror = () => {
        setScanStatusMessage('⚠️ Could not read NFC tag. Make sure the chip is not locked or damaged.');
        setIsWebNfcScanning(false);
      };
    } catch (err: any) {
      setIsWebNfcScanning(false);
      setScanStatusMessage(`Error starting NFC reader: ${err.message || err}`);
    }
  };

  // Handle Simulated NFC Tap
  const handleSimulateTap = (presetIndex: number) => {
    setIsSimulatingTap(true);
    playDeliveryChime();
    setTimeout(() => {
      setScannedTag(PRESET_SIMULATED_TAGS[presetIndex].data);
      setIsSimulatingTap(false);
      setScanStatusMessage(`✅ Tag tapped: ${PRESET_SIMULATED_TAGS[presetIndex].name}`);
      confetti({ particleCount: 25, spread: 50 });
    }, 400);
  };

  // Smart Direct Importer: Parses raw or scanned NFC tag data and adds directly to Website Fleet
  const handleDirectImportTagToWebsite = (tagData?: ScannedTagData) => {
    const activeTag = tagData || scannedTag;
    if (!activeTag || activeTag.records.length === 0) {
      alert('No scanned NFC tag data found. Please scan a tag first.');
      return;
    }

    const firstRec = activeTag.records[0];
    const payload = firstRec.payload || '';
    const uid = activeTag.uid || `04:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`;

    let cardTitle = 'Imported NFC Card';
    let bizName = 'Imported Business';
    let profileType: NfcCardConfig['profileType'] = 'custom_url';
    let targetDest = payload;
    let icon = '💳';
    let color = '#0f172a';
    let formFactorType: NfcCardConfig['hardwareFormFactor'] = 'pvc_card';
    let contactName = '';
    let contactPhone = '';
    let contactEmail = '';
    let contactTitle = '';
    let contactTown = 'Effingham, NH';
    let customHeadlineText = 'Tap with phone for instant info!';
    let reviewLink = '';

    // 1. vCard parser
    if (payload.includes('BEGIN:VCARD')) {
      profileType = 'digital_biz_card';
      icon = '👤';
      color = '#064e3b';
      const fnMatch = payload.match(/FN:(.+)/i);
      const orgMatch = payload.match(/ORG:(.+)/i);
      const titleMatch = payload.match(/TITLE:(.+)/i);
      const telMatch = payload.match(/TEL:(.+)/i);
      const emailMatch = payload.match(/EMAIL:(.+)/i);
      const adrMatch = payload.match(/ADR:(.+)/i);

      contactName = fnMatch ? fnMatch[1].trim() : 'Contact';
      bizName = orgMatch ? orgMatch[1].trim() : `${contactName}'s vCard`;
      contactTitle = titleMatch ? titleMatch[1].trim() : '';
      contactPhone = telMatch ? telMatch[1].trim() : '';
      contactEmail = emailMatch ? emailMatch[1].trim() : '';
      contactTown = adrMatch ? adrMatch[1].replace(/;/g, ' ').trim() : 'Effingham, NH';
      cardTitle = `${contactName} (vCard)`;
      customHeadlineText = `Tap to save ${contactName}'s contact info to your phone!`;
      targetDest = firstRec.actionUrl || `tel:${contactPhone.replace(/[^0-9]/g, '')}`;
    }
    // 2. Wi-Fi parser
    else if (payload.startsWith('WIFI:')) {
      profileType = 'airbnb_wifi_plaque';
      icon = '📡';
      color = '#0f766e';
      const ssidMatch = payload.match(/S:([^;]+)/i);
      const ssid = ssidMatch ? ssidMatch[1] : 'Guest Wi-Fi';
      bizName = `${ssid} Guest Wi-Fi`;
      cardTitle = `${ssid} (Wi-Fi Plaque)`;
      customHeadlineText = `Tap to instantly auto-connect to ${ssid}!`;
      targetDest = payload;
    }
    // 3. Google Review Link parser
    else if (payload.includes('search.google.com/local/writereview') || payload.includes('google.com/maps') || payload.includes('placeid=')) {
      profileType = 'google_review_booster';
      icon = '⭐';
      color = '#1e1b4b';
      bizName = 'Google 5-Star Review Booster';
      cardTitle = 'Google Review Card';
      reviewLink = payload;
      targetDest = payload;
      customHeadlineText = 'Love your experience? Tap to leave us a 5-star Google review!';
    }
    // 4. PayPal Tip / Pay parser
    else if (payload.includes('paypal.me/')) {
      profileType = 'custom_url';
      icon = '💵';
      color = '#1e3a8a';
      const user = payload.split('paypal.me/')[1]?.split('?')[0] || 'merchant';
      bizName = `PayPal: ${user}`;
      cardTitle = `PayPal Tip Card (${user})`;
      customHeadlineText = 'Tap to send instant payment or tip!';
      targetDest = payload;
    }
    // 5. Telephone / SMS Courier Dispatch parser
    else if (payload.startsWith('tel:') || payload.startsWith('sms:')) {
      profileType = 'custom_url';
      icon = '🛻';
      color = '#312e81';
      bizName = 'Courier & Hotline Lifeline';
      cardTitle = '4x4 Hotline Card';
      customHeadlineText = 'Tap phone for instant 24/7 hotline dispatch!';
      targetDest = payload;
    }
    // 6. Townraise Tap Endpoint parser
    else if (payload.includes('/tap/')) {
      profileType = 'custom_url';
      icon = '🌲';
      color = '#0f172a';
      bizName = 'Townraise Dynamic Beacon';
      cardTitle = 'Imported Townraise Tag';
      customHeadlineText = 'Tap phone to connect with local services!';
      targetDest = payload;
    }
    // 7. General Web Link / Text
    else {
      profileType = 'custom_url';
      icon = '🌐';
      color = '#18181b';
      try {
        if (payload.startsWith('http')) {
          const urlObj = new URL(payload);
          bizName = urlObj.hostname.replace('www.', '');
          cardTitle = `${bizName} Link`;
        } else {
          bizName = payload.substring(0, 30);
          cardTitle = 'Custom Scanned Tag';
        }
      } catch {
        bizName = 'Custom NFC Tag';
        cardTitle = 'Imported Tag';
      }
      targetDest = payload;
    }

    // Add to Fleet store
    const importedCard = addCard({
      cardName: cardTitle,
      businessName: bizName,
      googleReviewUrl: reviewLink || targetDest,
      customDestinationUrl: targetDest,
      directTargetUrl: targetDest,
      customHeadline: customHeadlineText,
      mode: 'smart_funnel',
      thresholdStars: 4,
      logoUrl: icon,
      primaryColor: color,
      hardwareFormFactor: formFactorType,
      profileType,
      chipUid: uid,
      notes: `Imported via NFC Tag Scanner on ${new Date().toLocaleDateString()}`,
      contactFullName: contactName || undefined,
      contactTitle: contactTitle || undefined,
      contactPhone: contactPhone || undefined,
      contactEmail: contactEmail || undefined,
      contactAddress: contactTown || undefined,
      active: true,
      assignedLocation: 'Scanned Card Import'
    });

    setEditingCardId(importedCard.id);
    playDeliveryChime();
    confetti({ particleCount: 70, spread: 80 });
    setWriteSuccessMsg(`🎉 Successfully scanned & imported "${cardTitle}" into your Website Fleet!`);
    setActiveTab('fleet');
    setTimeout(() => setWriteSuccessMsg(null), 5000);
  };

  // Manual Raw Payload Importer
  const handleManualPasteImport = (payloadString?: string) => {
    const raw = (payloadString !== undefined ? payloadString : manualPastePayload).trim();
    if (!raw) {
      alert('Please enter or paste a URL, vCard, or NFC payload to import.');
      return;
    }

    const manualTag: ScannedTagData = {
      uid: `04:MANUAL:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      chipType: 'Manual Import NDEF String',
      capacityBytes: 504,
      usedBytes: raw.length,
      isLocked: false,
      technology: 'NDEF Formatted String',
      records: [
        {
          type: raw.startsWith('http') ? 'URI' : raw.startsWith('WIFI:') ? 'Wi-Fi Configuration' : raw.includes('VCARD') ? 'Text/vCard' : 'Text',
          payload: raw,
          description: 'Manually imported payload string',
          actionUrl: raw.startsWith('http') || raw.startsWith('tel:') ? raw : undefined
        }
      ],
      timestamp: new Date().toLocaleTimeString()
    };

    setScannedTag(manualTag);
    setShowManualImportModal(false);
    setManualPastePayload('');
    handleDirectImportTagToWebsite(manualTag);
  };

  // Import Scanned Tag payload into the Customizer Canvas
  const handleImportScannedTag = () => {
    if (!scannedTag || scannedTag.records.length === 0) return;
    const firstRec = scannedTag.records[0];
    if (firstRec.actionUrl?.startsWith('http')) {
      setActionType('url');
      setCustomUrl(firstRec.actionUrl);
    } else if (firstRec.payload.includes('VCARD')) {
      setActionType('vcard');
    } else if (firstRec.payload.includes('paypal.me')) {
      setActionType('paypal_pay');
    } else {
      setActionType('url');
      setCustomUrl(firstRec.payload);
    }
    setActiveTab('customizer');
    setWriteSuccessMsg('Scanned NFC payload imported into Customizer!');
    setTimeout(() => setWriteSuccessMsg(null), 3000);
  };

  // Physical Web NFC Write
  const handleWritePhysicalTag = async () => {
    if (!('NDEFReader' in window)) {
      alert('Web NFC writing requires Chrome on Android or a compatible Web NFC browser. You can export the NDEF payload or order a pre-flashed physical tag below!');
      return;
    }

    try {
      setIsWritingNfc(true);
      const ndef = new (window as any).NDEFReader();
      const payload = getComputedPayloadUrl();
      await ndef.write({
        records: [
          { recordType: actionType === 'url' || actionType === 'google_review' || actionType === 'paypal_pay' ? 'url' : 'text', data: payload }
        ]
      });
      setIsWritingNfc(false);
      setWriteSuccessMsg('🎉 Successfully encoded and flashed physical NFC tag!');
      playDeliveryChime();
      confetti({ particleCount: 60, spread: 80 });
    } catch (err: any) {
      setIsWritingNfc(false);
      alert(`NFC Write Error: ${err.message || err}. Make sure NFC is enabled in your Android settings.`);
    }
  };

  // Load existing card from Fleet for live editing
  const handleEditCard = (card: NfcCardConfig) => {
    setEditingCardId(card.id);
    setBusinessName(card.businessName || '');
    setHeadline(card.customHeadline || 'Tap phone for instant Carroll County perks!');
    if (card.googleReviewUrl) setGoogleReviewUrl(card.googleReviewUrl);
    if (card.customDestinationUrl) setCustomUrl(card.customDestinationUrl);
    
    setVCardData({
      name: card.contactFullName || card.businessName || '',
      title: card.contactTitle || 'Lead Operator',
      phone: card.contactPhone || '(508) 507-0305',
      email: card.contactEmail || 'frijj555@gmail.com',
      town: card.contactAddress || card.town || 'Effingham, NH'
    });

    if (card.primaryColor) setSelectedColor(card.primaryColor);
    if (card.logoUrl) {
      if (card.logoUrl.startsWith('http') || card.logoUrl.startsWith('data:')) {
        setCustomLogoUrl(card.logoUrl);
      } else {
        setSelectedEmoji(card.logoUrl);
        setCustomLogoUrl('');
      }
    }

    if (card.hardwareFormFactor) {
      if (card.hardwareFormFactor === 'acrylic_stand') setFormFactor('stand');
      else if (card.hardwareFormFactor === 'disc_sticker') setFormFactor('sticker');
      else if (card.hardwareFormFactor === 'wood_plaque') setFormFactor('wood_puck');
      else if (card.hardwareFormFactor === 'keychain_fob') setFormFactor('keychain');
      else setFormFactor('card');
    }

    if (card.profileType) {
      if (card.profileType === 'google_review_booster') setActionType('google_review');
      else if (card.profileType === 'menu_tap_to_order') setActionType('menu');
      else if (card.profileType === 'digital_biz_card') setActionType('vcard');
      else if (card.profileType === 'loyalty_rewards') setActionType('loyalty_pass');
      else if (card.profileType === 'event_vip_pass') setActionType('event_ticket');
      else if (card.profileType === 'airbnb_wifi_plaque') setActionType('wifi');
      else setActionType('url');
    }

    setActiveTab('customizer');
    setWriteSuccessMsg(`Loaded card "${card.cardName}" for live editing!`);
    playDeliveryChime();
    setTimeout(() => setWriteSuccessMsg(null), 3000);
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setWriteSuccessMsg('Switched to creating a new card.');
    setTimeout(() => setWriteSuccessMsg(null), 2000);
  };

  const handleDuplicateCard = () => {
    const hardwareMap: Record<NfcFormFactorType, NfcCardConfig['hardwareFormFactor']> = {
      card: 'pvc_card',
      stand: 'acrylic_stand',
      sticker: 'disc_sticker',
      wood_puck: 'wood_plaque',
      keychain: 'keychain_fob'
    };

    const profileMap: Partial<Record<NfcActionType, NfcCardConfig['profileType']>> = {
      google_review: 'google_review_booster',
      menu: 'menu_tap_to_order',
      vcard: 'digital_biz_card',
      loyalty_pass: 'loyalty_rewards',
      event_ticket: 'event_vip_pass',
      wifi: 'airbnb_wifi_plaque'
    };

    const newCard = addCard({
      cardName: `${businessName} (Copy - ${formFactor.toUpperCase()})`,
      businessName,
      googleReviewUrl: actionType === 'google_review' ? googleReviewUrl : getComputedPayloadUrl(),
      mode: 'smart_funnel',
      thresholdStars: 4,
      customHeadline: headline,
      customDestinationUrl: getComputedPayloadUrl(),
      logoUrl: customLogoUrl || selectedEmoji,
      primaryColor: selectedColor,
      active: true,
      assignedLocation: 'Main Counter',
      contactFullName: vCardData.name,
      contactTitle: vCardData.title,
      contactPhone: vCardData.phone,
      contactEmail: vCardData.email,
      contactAddress: vCardData.town,
      hardwareFormFactor: hardwareMap[formFactor],
      profileType: profileMap[actionType] || 'custom_url',
    });

    setEditingCardId(newCard.id);
    playDeliveryChime();
    confetti({ particleCount: 50, spread: 70 });
    setWriteSuccessMsg(`Duplicated as new Card! Tap ID: ${newCard.id}`);
    setTimeout(() => setWriteSuccessMsg(null), 4000);
  };

  // Open QR modal for any card in the fleet
  const handleOpenCardQrModal = async (card: NfcCardConfig) => {
    setActiveQrModalCard(card);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://townraise.org';
    const tapUrl = `${origin}/tap/${card.id}`;
    try {
      const qrUrl = await QRCode.toDataURL(tapUrl, {
        width: 320,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' }
      });
      setActiveCardQrDataUrl(qrUrl);
    } catch {
      setActiveCardQrDataUrl(null);
    }
  };

  // Save or Update Card in store
  const handleSaveToFleet = () => {
    const hardwareMap: Record<NfcFormFactorType, NfcCardConfig['hardwareFormFactor']> = {
      card: 'pvc_card',
      stand: 'acrylic_stand',
      sticker: 'disc_sticker',
      wood_puck: 'wood_plaque',
      keychain: 'keychain_fob'
    };

    const profileMap: Partial<Record<NfcActionType, NfcCardConfig['profileType']>> = {
      google_review: 'google_review_booster',
      menu: 'menu_tap_to_order',
      vcard: 'digital_biz_card',
      loyalty_pass: 'loyalty_rewards',
      event_ticket: 'event_vip_pass',
      wifi: 'airbnb_wifi_plaque'
    };

    if (editingCardId) {
      updateCard(editingCardId, {
        cardName: `${businessName} (${formFactor.toUpperCase()})`,
        businessName,
        googleReviewUrl: actionType === 'google_review' ? googleReviewUrl : getComputedPayloadUrl(),
        customHeadline: headline,
        customDestinationUrl: getComputedPayloadUrl(),
        logoUrl: customLogoUrl || selectedEmoji,
        primaryColor: selectedColor,
        contactFullName: vCardData.name,
        contactTitle: vCardData.title,
        contactPhone: vCardData.phone,
        contactEmail: vCardData.email,
        contactAddress: vCardData.town,
        hardwareFormFactor: hardwareMap[formFactor],
        profileType: profileMap[actionType] || 'custom_url',
      });

      playDeliveryChime();
      confetti({ particleCount: 50, spread: 70 });
      setWriteSuccessMsg(`Updated card "${businessName}" successfully!`);
      setTimeout(() => setWriteSuccessMsg(null), 4000);
    } else {
      const newBeacon = addCard({
        cardName: `${businessName} (${formFactor.toUpperCase()})`,
        businessName,
        googleReviewUrl: actionType === 'google_review' ? googleReviewUrl : getComputedPayloadUrl(),
        mode: 'smart_funnel',
        thresholdStars: 4,
        customHeadline: headline,
        customDestinationUrl: getComputedPayloadUrl(),
        logoUrl: customLogoUrl || selectedEmoji,
        primaryColor: selectedColor,
        active: true,
        assignedLocation: 'Main Counter',
        contactFullName: vCardData.name,
        contactTitle: vCardData.title,
        contactPhone: vCardData.phone,
        contactEmail: vCardData.email,
        contactAddress: vCardData.town,
        hardwareFormFactor: hardwareMap[formFactor],
        profileType: profileMap[actionType] || 'custom_url',
      });

      setEditingCardId(newBeacon.id);
      playDeliveryChime();
      confetti({ particleCount: 50, spread: 70 });
      setWriteSuccessMsg(`Saved "${businessName}" to your active Beacon Fleet! Tap ID: ${newBeacon.id}`);
      setTimeout(() => setWriteSuccessMsg(null), 4000);
    }
  };

  // Add custom physical hardware order to Cart
  const handleOrderPhysicalTag = () => {
    const matchingProduct = products.find(p => p.category === (formFactor === 'stand' ? 'stands' : formFactor === 'sticker' ? 'stickers' : 'cards')) || products[0];
    addToCart(matchingProduct, {
      color: selectedColor,
      businessName,
      logoUrl: customLogoUrl || selectedEmoji
    });
    setWriteSuccessMsg(`Added custom ${formFactor.toUpperCase()} hardware to your Cart!`);
    playDeliveryChime();
    setTimeout(() => setWriteSuccessMsg(null), 3000);
  };

  // Quick Preset Selector for simplified 1-tap fast programmer
  const handleSelectQuickPreset = (presetKey: string) => {
    if (presetKey === 'google_review') {
      setActionType('google_review');
      setSelectedEmoji('⭐');
      setSelectedColor('#0f172a');
      setBusinessName(currentUser?.name ? `${currentUser.name}'s Business` : 'Smoke World Ossipee');
      setHeadline('Love your visit? Tap phone for instant 5-star Google review!');
      setGoogleReviewUrl('https://search.google.com/local/writereview?placeid=ChIJb6eBq9f94okRGb_SmokeWorldOss');
    } else if (presetKey === 'vcard') {
      setActionType('vcard');
      setSelectedEmoji('👤');
      setSelectedColor('#064e3b');
      setBusinessName(currentUser?.name ? `${currentUser.name} (Contact)` : 'Sean Martin');
      setHeadline('Tap phone to save full digital vCard & contact details!');
      setVCardData({
        name: currentUser?.name || 'Sean Martin',
        title: 'Lead Courier & Vanguard Operator',
        phone: currentUser?.phone || '(508) 507-0305',
        email: currentUser?.email || 'seanhse97@gmail.com',
        town: currentUser?.town ? `${currentUser.town}, NH` : 'Effingham, NH'
      });
    } else if (presetKey === 'courier') {
      setActionType('driver_dispatch');
      setSelectedEmoji('🛻');
      setSelectedColor('#1e1b4b');
      setBusinessName('Sean Martin 4x4 Emergency Lifeline');
      setHeadline('Tap phone for 24/7 towing, emergency pulls & courier run dispatch!');
      setSmsData({
        phone: '(508) 507-0305',
        message: 'Hi Sean! I need immediate 4x4 recovery or emergency courier delivery.'
      });
    } else if (presetKey === 'admin') {
      setActionType('url');
      setSelectedEmoji('🔑');
      setSelectedColor('#312e81');
      setBusinessName('Storefront Admin Login Key');
      setHeadline('Tap to instantly log in and manage your Townraise business storefront.');
      setCustomUrl(`https://townraise.org/tap/admin-key-${Date.now().toString(36)}?magicToken=tr_adm_${Date.now().toString(36)}&role=merchant`);
    } else if (presetKey === 'menu') {
      setActionType('menu');
      setSelectedEmoji('🍔');
      setSelectedColor('#78350f');
      setBusinessName('PNB Eats & Local Dining');
      setHeadline('Tap phone to view live menu & order directly from your table!');
      setCustomUrl('https://townraise.org/site/pnb-eats');
    } else if (presetKey === 'wifi') {
      setActionType('wifi');
      setSelectedEmoji('📡');
      setSelectedColor('#0f766e');
      setBusinessName('Guest High-Speed Wi-Fi');
      setHeadline('Tap phone to automatically connect to private guest Wi-Fi network!');
      setWifiData({
        ssid: 'CarrollCounty-Guest-WiFi',
        password: 'LakesRegion2026!',
        encryption: 'WPA2'
      });
    } else if (presetKey === 'loyalty') {
      setActionType('loyalty_pass');
      setSelectedEmoji('🎁');
      setSelectedColor('#831843');
      setBusinessName('Oasis VIP Rewards Pass');
      setHeadline('Tap phone to claim +50 Welcome Reward Points & local discounts!');
      setCustomUrl('https://townraise.org/rewards?checkin=Oasis+VIP');
    } else if (presetKey === 'url') {
      setActionType('url');
      setSelectedEmoji('🔗');
      setSelectedColor('#18181b');
      setBusinessName('Smart NFC Link Beacon');
      setHeadline('Tap phone to visit official website!');
      setCustomUrl('https://townraise.org');
    }
    playDeliveryChime();
    confetti({ particleCount: 35, spread: 50 });
  };

  // Copy NDEF Payload text
  const handleCopyPayload = () => {
    navigator.clipboard.writeText(getComputedPayloadUrl());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download Flipper Zero / NDEF File
  const handleDownloadNdefJson = () => {
    const payload = getComputedPayloadUrl();
    const data = {
      name: businessName,
      formFactor,
      actionType,
      chipCompatibility: 'NTAG213 / NTAG215 / NTAG216',
      ndefRecords: [
        {
          type: actionType === 'url' ? 'URI' : 'Text',
          payload
        }
      ],
      qrBackupUrl: generatedQrDataUrl,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nfc-${businessName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-payload.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Capabilities
  const filteredCapabilities = ALL_NFC_CAPABILITIES.filter(cap => {
    if (capabilitiesFilter === 'all') return true;
    return cap.category === capabilitiesFilter;
  });

  const completedBatchCount = batchCards.filter(c => c.status === 'completed').length;
  const progressPercent = Math.round((completedBatchCount / (batchCards.length || 1)) * 100);

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121220] via-[#0d0d16] to-[#08080c] border border-white/10 p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>13.56MHz Bulk Batch Flasher & Giveaway Studio</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white leading-tight">
              Program 100 NFC Cards <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-indigo-400 bg-clip-text text-transparent">
                For Community Giveaways
              </span>
            </h1>

            <p className="text-zinc-300 text-xs md:text-sm font-normal leading-relaxed">
              Batch-program your 100 blank NFC cards on a continuous <b>"Tap & Flash" conveyor belt</b>. Turn them into <b>Oasis Community VIP Passes (+50 Pts)</b>, <b>Sean Martin 4x4 Hotline Cards</b>, <b>Local Merchant Review Trials</b>, or <b>Event Door Passes</b>.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'quick'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 scale-105'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ 1-Tap Fast Flash</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-black/40 text-amber-300">
                Simple
              </span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'fleet'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>My Fleet</span>
              {cards && cards.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === 'fleet' ? 'bg-black text-amber-400' : 'bg-white/10 text-zinc-300'
                }`}>
                  {cards.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customizer')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'customizer'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Full Studio</span>
              {editingCardId && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'batch'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Batch 100</span>
            </button>

            <button
              onClick={() => setActiveTab('capabilities')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'capabilities'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>15 Modes</span>
            </button>

            <button
              onClick={() => setActiveTab('reader')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'reader'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Reader</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'export'
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>NDEF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {writeSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{writeSuccessMsg}</span>
          </div>
          <Link href="/dashboard/cards" className="underline hover:text-white flex items-center gap-1">
            <span>Manage Beacon Fleet ({batchCards.filter(c => c.status === 'completed').length} active)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: 1-TAP FAST FLASHER (SIMPLIFIED NFC PROGRAMMER)     */}
      {/* ======================================================== */}
      {activeTab === 'quick' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Antenna Status & Device Capability Banner */}
          <div className="p-4 rounded-3xl bg-[#0c0d14] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${hasWebNfcSupport ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
              <div>
                <span className="text-xs font-black text-white uppercase tracking-tight flex items-center gap-1.5">
                  {hasWebNfcSupport ? (
                    <>
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <span>Web NFC Antenna Ready • Direct 1-Touch Hardware Burning</span>
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 text-amber-400" />
                      <span>Universal Dual-Mode • Instant QR, Dynamic Tap Funnel & NFC Tools Helper</span>
                    </>
                  )}
                </span>
                <p className="text-[10px] font-mono text-zinc-400">
                  {hasWebNfcSupport 
                    ? 'Chrome on Android detected. Simply tap any blank 13.56 MHz NTAG213/215 tag against your device.'
                    : 'Works with any phone! Hold camera over QR code, copy link for NFC Tools app, or order pre-burned physical tags.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleStartWebNfcScan(true)}
                className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                title="Hold NFC card to phone antenna to scan and import directly into website"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>📡 Scan Tag to Import</span>
              </button>

              <button
                onClick={() => setShowManualImportModal(true)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                title="Paste raw URL, vCard, or Wi-Fi string to import"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>📋 Paste & Import</span>
              </button>

              <button
                onClick={() => setShowIosGuide(!showIosGuide)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{showIosGuide ? 'Hide App Guide' : 'iPhone Guide'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible iPhone / NFC Tools 2-Step Guide */}
          {showIosGuide && (
            <div className="p-6 rounded-3xl bg-indigo-950/20 border border-indigo-500/30 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                  <span>📱 How to Program NFC Cards on iPhone / iOS in 2 Taps</span>
                </h4>
                <button onClick={() => setShowIosGuide(false)} className="text-zinc-400 hover:text-white text-xs font-mono">✕ Close</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-300">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block text-sm">Step 1. Copy URL</span>
                  <p className="text-zinc-400">Click <b>"Copy URL"</b> below to put this card's dynamic tap payload link onto your clipboard.</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block text-sm">Step 2. Open NFC Tools</span>
                  <p className="text-zinc-400">Open the free <b>NFC Tools</b> app (App Store). Tap <b>Write → Add a record → URL / URI</b> and paste the link.</p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                  <span className="text-amber-400 font-bold block text-sm">Step 3. Touch Card</span>
                  <p className="text-zinc-400">Tap <b>Write / [Bytes]</b> and touch your blank card to the top edge of your iPhone. Card is instantly programmed!</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: SELECT PURPOSE (8 INSTANT PRESETS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[11px] font-black">1</span>
                <span>Step 1: Choose Card Purpose (1-Click Preset):</span>
              </label>
              <span className="text-[10px] font-mono text-zinc-400">Instant Pre-Configuration</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'google_review', label: 'Google 5-Star Reviews', icon: '⭐', desc: 'Boost local Google rating' },
                { id: 'vcard', label: 'Digital Business Card', icon: '👤', desc: '1-tap save contact to phone' },
                { id: 'courier', label: 'Sean Martin 4x4 Hotline', icon: '🛻', desc: '24/7 towing & courier dispatch' },
                { id: 'admin', label: 'Admin Login Pass', icon: '🔑', desc: '1-tap login to manage site' },
                { id: 'menu', label: 'Dine-In Menu & Order', icon: '🍔', desc: 'Contactless food & drink menu' },
                { id: 'wifi', label: 'Guest Wi-Fi Auto-Connect', icon: '📡', desc: 'Zero-typing password connect' },
                { id: 'loyalty', label: 'Oasis Loyalty Pass (+50 pts)', icon: '🎁', desc: 'Community welcome reward' },
                { id: 'url', label: 'Any Website Link', icon: '🔗', desc: 'Direct URL destination' },
              ].map(preset => {
                const isSelected = 
                  (preset.id === 'google_review' && actionType === 'google_review') ||
                  (preset.id === 'vcard' && actionType === 'vcard') ||
                  (preset.id === 'courier' && actionType === 'driver_dispatch') ||
                  (preset.id === 'menu' && actionType === 'menu') ||
                  (preset.id === 'wifi' && actionType === 'wifi') ||
                  (preset.id === 'loyalty' && actionType === 'loyalty_pass') ||
                  (preset.id === 'admin' && selectedEmoji === '🔑') ||
                  (preset.id === 'url' && actionType === 'url' && selectedEmoji !== '🔑');

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectQuickPreset(preset.id)}
                    className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 shadow-xl shadow-amber-500/10 scale-[1.02]'
                        : 'bg-[#0e0f14] border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl group-hover:scale-110 transition-transform">{preset.icon}</span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-white leading-snug">{preset.label}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{preset.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2 & 3: QUICK INPUTS + LIVE CARD & GIANT FLASH BURNER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 6 Cols: Super Clean Streamlined Inputs */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 md:p-8 rounded-3xl bg-[#0e0f14] border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center text-[11px] font-black">2</span>
                    <span>Step 2: Quick Card Details:</span>
                  </label>
                  <span className="text-[10px] font-mono text-zinc-400">Zero Clutter</span>
                </div>

                {/* Business / Card Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Card / Business Title</span>
                    <span className="text-[10px] font-mono text-zinc-400">Shown on card</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Smoke World Ossipee, Sean Martin 4x4, Oasis Roastery..."
                    className="w-full px-4 py-3 bg-black/60 border border-white/15 rounded-2xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* Form Factor Quick Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>NFC Hardware Form Factor</span>
                    <span className="text-[10px] font-mono text-zinc-400">13.56 MHz Standard</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'card', label: 'PVC Card', icon: '💳' },
                      { id: 'stand', label: 'Stand', icon: '🏛️' },
                      { id: 'sticker', label: 'Disc Sticker', icon: '🏷️' },
                      { id: 'wood_puck', label: 'Wood Plaque', icon: '🪵' },
                      { id: 'keychain', label: 'Key Fob', icon: '🛡️' },
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormFactor(f.id as NfcFormFactorType)}
                        className={`p-2 rounded-2xl border text-center transition-all ${
                          formFactor === f.id
                            ? 'bg-amber-400 text-black font-bold border-amber-300'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-base block">{f.icon}</span>
                        <span className="text-[10px] font-mono truncate block">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional Fields based on actionType */}
                {actionType === 'google_review' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Google Place ID or Google Review Link</span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">5-Star Booster</span>
                      </label>
                      <input
                        type="text"
                        value={googleReviewUrl}
                        onChange={e => setGoogleReviewUrl(e.target.value)}
                        placeholder="https://search.google.com/local/writereview?placeid=..."
                        className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                    <p className="text-[10px] font-mono text-zinc-400">
                      💡 Tapping this programmed tag automatically opens the 5-star review modal directly on iOS & Android phones!
                    </p>
                  </div>
                )}

                {actionType === 'vcard' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-emerald-400/5 border border-emerald-400/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Contact Full Name</span>
                        <input
                          type="text"
                          value={vCardData.name}
                          onChange={e => setVCardData({ ...vCardData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Phone Number</span>
                        <input
                          type="text"
                          value={vCardData.phone}
                          onChange={e => setVCardData({ ...vCardData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Email Address</span>
                        <input
                          type="email"
                          value={vCardData.email}
                          onChange={e => setVCardData({ ...vCardData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Title / Company</span>
                        <input
                          type="text"
                          value={vCardData.title}
                          onChange={e => setVCardData({ ...vCardData, title: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {actionType === 'driver_dispatch' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-blue-400/5 border border-blue-400/20">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Emergency Hotline / Towing Phone Number</span>
                        <span className="text-[10px] font-mono text-blue-400 font-bold">24/7 Hotline</span>
                      </label>
                      <input
                        type="text"
                        value={smsData.phone}
                        onChange={e => setSmsData({ ...smsData, phone: e.target.value })}
                        placeholder="(508) 507-0305"
                        className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {actionType === 'wifi' && (
                  <div className="space-y-3 p-4 rounded-2xl bg-cyan-400/5 border border-cyan-400/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Wi-Fi Network Name (SSID)</span>
                        <input
                          type="text"
                          value={wifiData.ssid}
                          onChange={e => setWifiData({ ...wifiData, ssid: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-zinc-400">Wi-Fi Password</span>
                        <input
                          type="text"
                          value={wifiData.password}
                          onChange={e => setWifiData({ ...wifiData, password: e.target.value })}
                          className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(actionType === 'url' || actionType === 'loyalty_pass' || actionType === 'menu') && (
                  <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Target Web Destination Link</span>
                        <span className="text-[10px] font-mono text-zinc-400">Universal Dynamic Funnel</span>
                      </label>
                      <input
                        type="text"
                        value={customUrl}
                        onChange={e => setCustomUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Prompt Headline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Card Instruction Prompt</span>
                    <span className="text-[10px] font-mono text-zinc-400">Printed or displayed</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Tap phone with back of device for instant perks!"
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

              </div>
            </div>

            {/* Right 6 Cols: Visual Card Preview & Giant 1-Touch Burner */}
            <div className="lg:col-span-6 space-y-4 sticky top-28">
              
              {/* Visual Card Canvas Preview */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#0b0b10] border border-white/10 space-y-5 text-center">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-Time Output Preview</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 text-[10px] uppercase font-bold">
                    {formFactor.toUpperCase()} • 13.56 MHz
                  </span>
                </div>

                {/* CARD PREVIEW */}
                <div 
                  className="relative mx-auto w-full max-w-md aspect-[1.586/1] rounded-[2rem] p-6 shadow-2xl border flex flex-col justify-between overflow-hidden transition-all duration-500 group select-none text-left"
                  style={{
                    backgroundColor: selectedColor,
                    borderColor: 'rgba(255,255,255,0.18)',
                    boxShadow: `0 25px 60px -15px ${selectedColor}90`
                  }}
                >
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                        {selectedEmoji}
                      </div>
                      <div>
                        <h4 className="font-black italic text-white text-base tracking-tight leading-tight line-clamp-1">{businessName}</h4>
                        <p className="text-[9px] font-mono uppercase text-white/60 tracking-wider">
                          {actionType === 'google_review' ? 'Google 5-Star NFC Beacon' : 
                           actionType === 'driver_dispatch' ? 'Express Courier NFC' : 
                           actionType === 'vcard' ? 'Digital vCard NFC' : 
                           actionType === 'wifi' ? 'Guest Wi-Fi Auto-Connect' : 
                           actionType === 'loyalty_pass' ? 'Oasis Loyalty Pass' : 
                           'Smart Contactless Tag'}
                        </p>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
                      <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                  </div>

                  <div className="relative z-10 my-auto space-y-1">
                    {actionType === 'google_review' && (
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (<span key={i} className="text-sm">★</span>))}
                        <span className="text-[10px] font-mono text-white/80 font-bold ml-1">5.0 RATING</span>
                      </div>
                    )}
                    {actionType === 'vcard' && (
                      <p className="text-xs font-mono text-zinc-300">
                        👤 {vCardData.name} • {vCardData.phone}
                      </p>
                    )}
                    <p className="text-sm font-black italic text-white tracking-wide leading-snug">
                      {headline}
                    </p>
                  </div>

                  <div className="relative z-10 flex justify-between items-end pt-3 border-t border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        OASIS<span className="text-amber-400">TAP</span>
                      </span>
                      <p className="text-[8px] font-mono text-white/40">STANDARDIZED NFC 13.56MHz • NTAG213</p>
                    </div>
                    {generatedQrDataUrl && (
                      <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-lg">
                        <img src={generatedQrDataUrl} alt="QR" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {/* STEP 3: GIANT 1-TOUCH FLASH BURNER BUTTON */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={async () => {
                      if (!('NDEFReader' in window)) {
                        navigator.clipboard.writeText(getComputedPayloadUrl());
                        handleSaveToFleet();
                        setShowIosGuide(true);
                        playDeliveryChime();
                        confetti({ particleCount: 40, spread: 60 });
                        setWriteSuccessMsg('Copied Tap URL to clipboard & Saved to Fleet! (See iPhone guide below)');
                        setTimeout(() => setWriteSuccessMsg(null), 4000);
                        return;
                      }

                      try {
                        setIsWritingNfc(true);
                        const ndef = new (window as any).NDEFReader();
                        const payload = getComputedPayloadUrl();
                        await ndef.write({
                          records: [{
                            recordType: actionType === 'url' || actionType === 'google_review' || actionType === 'paypal_pay' ? 'url' : 'text',
                            data: payload
                          }]
                        });
                        setIsWritingNfc(false);
                        handleSaveToFleet();
                        playDeliveryChime();
                        confetti({ particleCount: 80, spread: 80 });
                        setWriteSuccessMsg(`🎉 Successfully programmed and flashed physical NFC tag for "${businessName}"!`);
                        setTimeout(() => setWriteSuccessMsg(null), 5000);
                      } catch (err: any) {
                        setIsWritingNfc(false);
                        alert(`NFC Writing error: ${err.message || err}. Ensure your NFC antenna is enabled.`);
                      }
                    }}
                    disabled={isWritingNfc}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isWritingNfc ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>📡 Touch Blank NFC Tag to Antenna Now...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 fill-black" />
                        <span>⚡ Step 3: Touch Card to Phone to Program</span>
                      </>
                    )}
                  </button>

                  {/* Quick Action Utility Buttons */}
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getComputedPayloadUrl());
                        setIsCopied(true);
                        setWriteSuccessMsg('Copied payload URL to clipboard!');
                        setTimeout(() => {
                          setIsCopied(false);
                          setWriteSuccessMsg(null);
                        }, 3000);
                      }}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                      <span>{isCopied ? 'Copied!' : 'Copy URL'}</span>
                    </button>

                    <button
                      onClick={handleSaveToFleet}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Save to Fleet</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('customizer')}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-white rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Full Studio</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 0: MY CARDS FLEET & LIVE CARD EDITOR                */}
      {/* ======================================================== */}
      {activeTab === 'fleet' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* Fleet Header & Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#0e0f15] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Total Fleet Cards</span>
                <span className="text-2xl font-black text-white">{cards?.length || 0}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0e0f15] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Active Tappable</span>
                <span className="text-2xl font-black text-emerald-400">
                  {cards?.filter(c => c.active !== false).length || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#0e0f15] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Total Taps Logged</span>
                <span className="text-2xl font-black text-indigo-400">
                  {cards?.reduce((acc, c) => acc + (c.tapsCount || 0), 0) || 0}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-400/10 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                <Scan className="w-5 h-5" />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider block">Ready to Create?</span>
                <button
                  onClick={() => {
                    handleCancelEdit();
                    setActiveTab('customizer');
                  }}
                  className="mt-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Design New Card</span>
                </button>
              </div>
              <Sparkles className="w-7 h-7 text-amber-400 opacity-80" />
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="p-4 rounded-3xl bg-[#0c0c12] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cardSearchQuery}
                onChange={e => setCardSearchQuery(e.target.value)}
                placeholder="Search cards by name, business, location, or tag URL..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
              {cardSearchQuery && (
                <button
                  onClick={() => setCardSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-mono"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleStartWebNfcScan(true)}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/10"
                title="Scan physical NFC tag to import directly into fleet"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>📡 Scan Tag to Import</span>
              </button>

              <button
                onClick={() => setShowManualImportModal(true)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                title="Paste raw payload or link to import"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Paste & Import</span>
              </button>

              <span className="text-[11px] font-mono text-zinc-400 ml-2 hidden md:inline-block">
                {
                  (cards || []).filter(c => {
                    if (!cardSearchQuery.trim()) return true;
                    const q = cardSearchQuery.toLowerCase();
                    return (
                      c.cardName?.toLowerCase().includes(q) ||
                      c.businessName?.toLowerCase().includes(q) ||
                      c.assignedLocation?.toLowerCase().includes(q) ||
                      c.contactFullName?.toLowerCase().includes(q) ||
                      c.profileType?.toLowerCase().includes(q) ||
                      c.customDestinationUrl?.toLowerCase().includes(q) ||
                      c.googleReviewUrl?.toLowerCase().includes(q)
                    );
                  }).length
                } / {cards?.length || 0} Cards
              </span>
            </div>
          </div>

          {/* Cards Fleet Grid */}
          {(!cards || cards.length === 0) ? (
            <div className="p-12 rounded-3xl bg-[#0c0c12] border border-white/10 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl mx-auto">
                📇
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-black text-white uppercase italic">Your NFC Card Fleet is Empty</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Create your first custom business card, Google Review booster, or 4x4 dispatch beacon to start managing and flashing physical tags.
                </p>
              </div>
              <button
                onClick={() => {
                  handleCancelEdit();
                  setActiveTab('customizer');
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First NFC Card</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(cards || [])
                .filter(c => {
                  if (!cardSearchQuery.trim()) return true;
                  const q = cardSearchQuery.toLowerCase();
                  return (
                    c.cardName?.toLowerCase().includes(q) ||
                    c.businessName?.toLowerCase().includes(q) ||
                    c.assignedLocation?.toLowerCase().includes(q) ||
                    c.contactFullName?.toLowerCase().includes(q) ||
                    c.profileType?.toLowerCase().includes(q) ||
                    c.customDestinationUrl?.toLowerCase().includes(q) ||
                    c.googleReviewUrl?.toLowerCase().includes(q)
                  );
                })
                .map((card) => {
                  const formFactorLabels: Record<string, { label: string; icon: string }> = {
                    pvc_card: { label: 'PVC Card', icon: '💳' },
                    acrylic_stand: { label: 'Acrylic Stand', icon: '🏛️' },
                    disc_sticker: { label: 'Disc Sticker', icon: '🏷️' },
                    wood_plaque: { label: 'Wood Plaque', icon: '🪵' },
                    keychain_fob: { label: 'Keychain Fob', icon: '🛡️' }
                  };

                  const profileLabels: Record<string, { label: string; badgeColor: string }> = {
                    google_review_booster: { label: '⭐ Google Reviews', badgeColor: 'bg-amber-400/10 text-amber-300 border-amber-400/30' },
                    digital_biz_card: { label: '📇 Digital vCard', badgeColor: 'bg-blue-400/10 text-blue-300 border-blue-400/30' },
                    menu_tap_to_order: { label: '🍔 Menu Tap-to-Order', badgeColor: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30' },
                    loyalty_rewards: { label: '🎁 Loyalty Rewards', badgeColor: 'bg-purple-400/10 text-purple-300 border-purple-400/30' },
                    event_vip_pass: { label: '🎟️ Event VIP Pass', badgeColor: 'bg-pink-400/10 text-pink-300 border-pink-400/30' },
                    airbnb_wifi_plaque: { label: '📡 Wi-Fi Auto-Connect', badgeColor: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/30' },
                    custom_url: { label: '🔗 Custom URL', badgeColor: 'bg-zinc-400/10 text-zinc-300 border-zinc-400/30' }
                  };

                  const ffInfo = formFactorLabels[card.hardwareFormFactor || 'pvc_card'] || { label: 'NFC Card', icon: '💳' };
                  const pfInfo = profileLabels[card.profileType || 'custom_url'] || { label: 'Custom URL', badgeColor: 'bg-white/10 text-white border-white/10' };
                  const isCurrentlyEditing = editingCardId === card.id;

                  return (
                    <div
                      key={card.id}
                      className={`relative rounded-3xl p-5 bg-[#0e0f14] border transition-all duration-300 flex flex-col justify-between space-y-4 group hover:shadow-2xl hover:shadow-amber-500/10 ${
                        isCurrentlyEditing
                          ? 'border-amber-400 ring-2 ring-amber-400/30 bg-amber-500/[0.03]'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Top Bar with Form Factor & Active Status Toggle */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{ffInfo.icon}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-zinc-300 uppercase">
                            {ffInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCard(card.id, { active: card.active === false ? true : false })}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 border ${
                              card.active !== false
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            }`}
                            title="Toggle active status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${card.active !== false ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`}></span>
                            <span>{card.active !== false ? 'Active' : 'Paused'}</span>
                          </button>

                          {isCurrentlyEditing && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
                              Editing
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Mini Preview Banner */}
                      <div 
                        className="rounded-2xl p-4 border flex items-center justify-between gap-3 relative overflow-hidden transition-all group-hover:scale-[1.01]"
                        style={{
                          backgroundColor: card.primaryColor || '#0f172a',
                          borderColor: 'rgba(255,255,255,0.15)'
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 z-10">
                          {card.logoUrl && card.logoUrl.startsWith('http') ? (
                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-black/40 border border-white/20 shrink-0">
                              <img src={card.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shrink-0">
                              {card.logoUrl || '🌲'}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-white font-black italic text-sm tracking-tight truncate">
                              {card.businessName || card.cardName}
                            </h4>
                            <p className="text-[10px] text-white/70 font-mono truncate">
                              {card.assignedLocation || 'Main Terminal'}
                            </p>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 z-10">
                          <Radio className="w-4 h-4 text-amber-400" />
                        </div>

                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                      </div>

                      {/* Profile Type & Payload Target */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${pfInfo.badgeColor}`}>
                            {pfInfo.label}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            <strong>{card.tapsCount || 0}</strong> taps logged
                          </span>
                        </div>

                        {card.customHeadline && (
                          <p className="text-xs text-zinc-300 line-clamp-1 italic font-medium">
                            "{card.customHeadline}"
                          </p>
                        )}

                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-zinc-400 truncate">
                          <span className="text-amber-400 font-bold">Target: </span>
                          <span className="text-zinc-300">
                            {card.customDestinationUrl || card.googleReviewUrl || `https://townraise.org/tap/${card.id}`}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons for this Card */}
                      <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleEditCard(card)}
                          className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                            isCurrentlyEditing
                              ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                              : 'bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40'
                          }`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isCurrentlyEditing ? 'Now Editing' : 'Edit in Studio'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenCardQrModal(card)}
                          className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-400" />
                          <span>QR & Tap</span>
                        </button>

                        <button
                          onClick={async () => {
                            if (!('NDEFReader' in window)) {
                              alert(`Web NFC requires Chrome on Android. You can test or copy payload link: https://townraise.org/tap/${card.id}`);
                              return;
                            }
                            try {
                              const ndef = new (window as any).NDEFReader();
                              await ndef.write({
                                records: [{ recordType: 'url', data: `https://townraise.org/tap/${card.id}` }]
                              });
                              playDeliveryChime();
                              confetti({ particleCount: 30, spread: 50 });
                              setWriteSuccessMsg(`✅ Physical tag flashed for "${card.cardName}"!`);
                              setTimeout(() => setWriteSuccessMsg(null), 4000);
                            } catch (err: any) {
                              alert(`NFC write error: ${err.message || err}`);
                            }
                          }}
                          className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <Radio className="w-3 h-3 text-emerald-400" />
                          <span>Flash Tag</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete card "${card.cardName || card.businessName}" from your fleet?`)) {
                              deleteCard(card.id);
                              if (editingCardId === card.id) {
                                setEditingCardId(null);
                              }
                              setWriteSuccessMsg(`Deleted card from fleet.`);
                              setTimeout(() => setWriteSuccessMsg(null), 3000);
                            }
                          }}
                          className="py-2 px-3 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 border border-white/5 hover:border-red-500/30 rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB: BATCH 100-CARD BULK PROGRAMMER                     */}
      {/* ======================================================== */}
      {activeTab === 'batch' && (
        <div className="space-y-8">
          
          {/* Top Configuration & Conveyor Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 5 Cols: Batch Setup & Campaign Selector */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-5">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    Giveaway Setup
                  </span>
                  <h3 className="text-xl font-black italic text-white uppercase">
                    1. Choose Giveaway Campaign
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Select how you want to configure your 100 physical giveaway cards:
                  </p>
                </div>

                {/* Giveaway Presets */}
                <div className="space-y-2.5">
                  {[
                    {
                      id: 'oasis_community',
                      title: 'Oasis Rewards for Applying Pass (+50 Loyalty Points)',
                      desc: 'Brings anyone who taps to the dedicated rewards application page to unlock +50 welcome points, $5 credit & local perks.',
                      icon: '🎁',
                      badge: 'Instant Rewards for Applying',
                      sampleUrl: 'https://townraise.org/claim?pass=OASIS-PASS-001'
                    },
                    {
                      id: 'courier_lifeline',
                      title: 'Sean Martin 4x4 Hotline & Lifeline Pass',
                      desc: 'Give to local drivers & motorists for 1-tap 24/7 towing (508-507-0305) & PayPal tipping.',
                      icon: '🛻',
                      badge: 'Emergency Recovery',
                      sampleUrl: 'https://townraise.org/courier?card=SEAN-4X4-001'
                    },
                    {
                      id: 'biz_review_sample',
                      title: 'Local Business 5-Star Review Trial Card',
                      desc: 'Give free samples to shop owners in Effingham, Ossipee, Freedom & Conway.',
                      icon: '⭐',
                      badge: 'Merchant Onboarding',
                      sampleUrl: 'https://townraise.org/tap/trial-REVIEW-001'
                    },
                    {
                      id: 'event_door_pass',
                      title: 'Carroll County Live Music & Event VIP Pass',
                      desc: 'Fast-track door pass for concert nights, craft fairs & brewery tastings.',
                      icon: '🎟️',
                      badge: 'Event Check-In',
                      sampleUrl: 'https://townraise.org/events?ticket=VIP-001'
                    },
                    {
                      id: 'tourist_landmark',
                      title: 'Tourist Attraction & Scavenger Checkpoint Tag',
                      desc: 'Flash waterproof NFC stickers for covered bridges, historic depots, scenic trailheads & local breweries.',
                      icon: '🧭',
                      badge: 'Tourist Hunt Checkpoint',
                      sampleUrl: 'https://townraise.org/tourist-hunts?checkin=LANDMARK-NH-001'
                    },
                    {
                      id: 'store_hunt_beacon',
                      title: 'In-Store Treasure Hunt & Mystery Discount Beacon',
                      desc: 'Program checkout counter NFC stands to reveal secret in-store discounts, free tastings & store stamps.',
                      icon: '🛍️',
                      badge: 'Store Hunting Beacon',
                      sampleUrl: 'https://townraise.org/store-hunting?spot=STORE-HUNT-001'
                    },
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetChange(preset.id as any)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                        batchPreset === preset.id
                          ? 'bg-amber-400/15 border-amber-400 text-white shadow-xl shadow-amber-500/10'
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{preset.icon}</span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white">{preset.title}</h4>
                          <span className="text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                            {preset.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-300 font-light leading-snug">{preset.desc}</p>
                        <p className="text-[9px] font-mono text-amber-400 truncate">{preset.sampleUrl}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Batch Size Selector */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-zinc-400 uppercase font-bold">Total Batch Size:</span>
                    <span className="text-amber-400 font-black">{batchTargetCount} Physical Cards</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 250].map(count => (
                      <button
                        key={count}
                        onClick={() => handleTargetCountChange(count)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                          batchTargetCount === count
                            ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {count} Cards
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Right 7 Cols: Conveyor Belt Flasher & Action Deck */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Live Conveyor Station Card */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#121220] via-[#0d0d16] to-[#07070b] border border-amber-400/30 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Top Status Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                      Automated Conveyor Mode
                    </span>
                    <h3 className="text-2xl font-black italic uppercase text-white">
                      {isBatchConveyorActive ? '🟢 Conveyor Armed & Listening' : '⚡ Multi-Card Flasher'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-amber-400">
                      {completedBatchCount} / {batchCards.length}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 block">CARDS PROGRAMMED</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                    <span>Batch Progress:</span>
                    <span className="text-white font-bold">{progressPercent}% Completed</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden p-0.5 border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Large Interactive NFC Touch Target */}
                <div className="p-8 rounded-3xl bg-black/60 border border-white/10 text-center space-y-4 relative">
                  <div className="w-20 h-20 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20">
                    <Radio className={`w-10 h-10 ${isBatchConveyorActive || isAutoTurboFlashing ? 'animate-ping text-amber-300' : 'animate-pulse'}`} />
                  </div>

                  <div>
                    {currentBatchIndex < batchCards.length ? (
                      <>
                        <h4 className="text-lg font-black text-white uppercase italic">
                          {isBatchConveyorActive 
                            ? `Touch Card #${currentBatchIndex + 1} (${batchCards[currentBatchIndex]?.serialNumber})` 
                            : `Ready to Flash Card #${currentBatchIndex + 1} (${batchCards[currentBatchIndex]?.serialNumber})`}
                        </h4>
                        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                          Hold your physical NFC card against the back of your phone. The system will encode it, advance to the next card, and chime automatically!
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                        <h4 className="text-lg font-black text-emerald-400 uppercase italic mt-2">
                          All {batchCards.length} Cards Programmed!
                        </h4>
                        <p className="text-xs text-zinc-300">
                          Your complete 100-card batch is now active, registered in your Fleet, and ready to hand out across Carroll County.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Primary Flashing Buttons */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2">
                    <button
                      onClick={handleTogglePhysicalBatchConveyor}
                      className={`flex-1 py-4 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
                        isBatchConveyorActive
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20'
                          : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-amber-500/25'
                      }`}
                    >
                      {isBatchConveyorActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pause Physical Conveyor</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Start Physical Auto-Conveyor</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => flashCardAtIndex(currentBatchIndex)}
                      disabled={currentBatchIndex >= batchCards.length}
                      className="px-5 py-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-40"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Flash Next Card (Simulate)</span>
                    </button>
                  </div>

                  {/* Turbo Auto-Simulate Button */}
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={handleTurboSimulateAll}
                      disabled={isAutoTurboFlashing || currentBatchIndex >= batchCards.length}
                      className="text-xs font-mono text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAutoTurboFlashing ? 'Turbo Auto-Flashing in progress...' : `🚀 Turbo-Flash All Remaining (${batchCards.length - currentBatchIndex} Cards)`}</span>
                    </button>
                    <span className="text-zinc-600">•</span>
                    <button
                      onClick={() => initializeBatchCards(batchTargetCount, batchPreset, batchPrefix, batchCustomBaseUrl)}
                      className="text-xs font-mono text-zinc-400 hover:text-white underline"
                    >
                      Reset Batch
                    </button>
                  </div>
                </div>

                {/* Export / Print Tools Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportBatchCsv}
                      className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-400" />
                      <span>Download Batch CSV Log</span>
                    </button>

                    <button
                      onClick={() => setShowPrintLabelModal(true)}
                      className="px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white rounded-xl font-bold transition-all flex items-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print QR Sticker Sheet</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-zinc-400">
                    Chip Spec: <b>NTAG213 / 144B</b>
                  </span>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Section: Card-by-Card Live Audit Table */}
          <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Live Flashing Audit Trail
                </span>
                <h3 className="text-xl font-black italic text-white uppercase">
                  Batch Card Manifest ({completedBatchCount} / {batchCards.length} Verified)
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {completedBatchCount} Flashed
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                  {batchCards.length - completedBatchCount} Pending
                </span>
              </div>
            </div>

            {/* Manifest List Table */}
            <div className="max-h-96 overflow-y-auto rounded-2xl border border-white/5 divide-y divide-white/5 text-xs font-mono">
              {batchCards.map((card, idx) => (
                <div 
                  key={card.id}
                  className={`p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                    card.status === 'completed' 
                      ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]' 
                      : idx === currentBatchIndex 
                      ? 'bg-amber-400/10 border-l-4 border-l-amber-400' 
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      card.status === 'completed'
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                        : idx === currentBatchIndex
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                        : 'bg-white/5 text-zinc-500 border border-white/5'
                    }`}>
                      #{card.id}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">{card.serialNumber}</span>
                        <span className="text-[10px] text-zinc-400 font-light">• {card.cardType}</span>
                      </div>
                      <p className="text-[10px] text-amber-400/80 truncate max-w-md">
                        {card.payloadUrl}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {card.uid && (
                      <span className="text-[10px] text-zinc-400">
                        UID: <strong className="text-zinc-200">{card.uid}</strong>
                      </span>
                    )}

                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
                      card.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : idx === currentBatchIndex
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-white/5 text-zinc-500 border border-white/5'
                    }`}>
                      {card.status === 'completed' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Flashed ({card.flashedAt || 'Active'})</span>
                        </>
                      ) : idx === currentBatchIndex ? (
                        <>
                          <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>Next in Queue</span>
                        </>
                      ) : (
                        <span>Pending Touch</span>
                      )}
                    </span>

                    {card.status !== 'completed' && (
                      <button
                        onClick={() => flashCardAtIndex(idx)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-white rounded-lg text-[10px] font-bold"
                      >
                        Flash
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: ALL THINGS YOU CAN DO (NFC CAPABILITIES MATRIX)  */}
      {/* ======================================================== */}
      {activeTab === 'capabilities' && (
        <div className="space-y-8">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All 15 Capabilities', icon: '✨' },
              { id: 'growth', label: 'Business Growth & Menus', icon: '⭐' },
              { id: 'cashless', label: 'PayPal & Cashless Tips', icon: '💵' },
              { id: 'courier', label: 'Courier & 4x4 Transit', icon: '🛻' },
              { id: 'contact', label: 'vCards & Networking', icon: '📇' },
              { id: 'trades', label: 'Contractor Visual Proofs', icon: '🔨' },
              { id: 'automation', label: 'Wi-Fi & Apple Shortcuts', icon: '⚡' },
              { id: 'community', label: 'Loyalty & Town Passports', icon: '🌲' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCapabilitiesFilter(cat.id as any)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center gap-2 border ${
                  capabilitiesFilter === cat.id
                    ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/20 scale-105'
                    : 'bg-white/5 text-white/70 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapabilities.map(cap => (
              <div 
                key={cap.id}
                className="bg-[#0c0c12] border border-white/10 hover:border-amber-400/50 rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all duration-300 group hover:shadow-2xl hover:shadow-amber-500/10"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                      {cap.icon}
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-white/5 text-amber-300 border border-white/10 text-[9px] font-mono font-bold uppercase">
                      {cap.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      {cap.categoryLabel}
                    </span>
                    <h3 className="text-lg font-black italic tracking-tight text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {cap.title}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-300 font-normal leading-relaxed">
                    {cap.fullDesc}
                  </p>

                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5 text-[11px] font-mono">
                    <div className="text-zinc-400 flex items-center gap-1">
                      <span className="text-amber-400 font-bold">Recommended Hardware:</span>
                      <span className="text-white truncate">{cap.bestHardware}</span>
                    </div>
                    <div className="text-zinc-400 flex items-center gap-1">
                      <span className="text-amber-400 font-bold">Target Chip:</span>
                      <span className="text-zinc-300">{cap.chipRecommendation}</span>
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-emerald-400 font-bold">Carroll County Node: </span>
                      <span className="text-zinc-300">{cap.realWorldExample}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => handleLoadCapability(cap)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Load into Canvas</span>
                  </button>

                  <button
                    onClick={() => {
                      const matchingPreset = PRESET_SIMULATED_TAGS.find(p => p.name.toLowerCase().includes(cap.id.replace('_', ' '))) || PRESET_SIMULATED_TAGS[0];
                      setScannedTag(matchingPreset.data);
                      setActiveTab('reader');
                    }}
                    className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all"
                    title="Simulate Mobile Tap"
                  >
                    <Smartphone className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CUSTOMIZER & VISUAL CARD CANVAS                  */}
      {/* ======================================================== */}
      {activeTab === 'customizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
          
          {/* Left 6 Cols: Live Interactive Visualizer Canvas */}
          <div className="lg:col-span-6 space-y-4 sticky top-28">

            {/* Quick Card Fleet Switcher & New Button */}
            {cards && cards.length > 0 && (
              <div className="p-3 bg-[#0e0f14] border border-white/10 rounded-2xl flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 shrink-0">
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-400 text-[11px] font-bold uppercase">Card:</span>
                </div>
                <select
                  value={editingCardId || 'new'}
                  onChange={(e) => {
                    if (e.target.value === 'new') {
                      handleCancelEdit();
                    } else {
                      const target = cards.find(c => c.id === e.target.value);
                      if (target) handleEditCard(target);
                    }
                  }}
                  className="bg-black/60 text-white border border-white/15 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 w-full truncate"
                >
                  <option value="new">➕ + Create New Card</option>
                  {cards.map(c => (
                    <option key={c.id} value={c.id}>
                      📇 {c.cardName || c.businessName} ({c.hardwareFormFactor?.toUpperCase() || 'PVC'})
                    </option>
                  ))}
                </select>
                {editingCardId && (
                  <button
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-[11px] font-bold shrink-0 transition-all"
                    title="Start fresh with a new blank card"
                  >
                    + New
                  </button>
                )}
              </div>
            )}

            {/* Active Edit Mode Banner */}
            {editingCardId && (
              <div className="p-4 rounded-2xl bg-amber-400/15 border border-amber-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in zoom-in-95 duration-200 shadow-lg shadow-amber-500/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                      Active Live Editing Mode
                    </span>
                    <p className="text-xs font-black text-white line-clamp-1">
                      {businessName} ({formFactor.toUpperCase()})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={handleSaveToFleet}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleDuplicateCard}
                    className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-zinc-200 text-[11px] font-bold rounded-xl transition-all"
                    title="Duplicate as new card"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2.5 py-1.5 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 text-[11px] font-bold rounded-xl transition-all"
                    title="Exit editing mode"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 rounded-3xl bg-[#0b0b10] border border-white/10 space-y-6 text-center">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Real-Time Hardware Canvas</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 text-[10px] uppercase font-bold">
                  {formFactor.toUpperCase()} • 13.56 MHz
                </span>
              </div>

              {/* CARD PREVIEW CANVAS */}
              <div className="relative mx-auto w-full max-w-md aspect-[1.586/1] rounded-[2rem] p-6 shadow-2xl border flex flex-col justify-between overflow-hidden transition-all duration-500 group select-none"
                   style={{
                     backgroundColor: selectedColor,
                     borderColor: 'rgba(255,255,255,0.18)',
                     boxShadow: `0 25px 60px -15px ${selectedColor}90`
                   }}>
                
                {/* Textures / Overlay */}
                {selectedTexture === 'cyber' && (
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />
                )}
                {selectedTexture === 'carbon' && (
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,#00000030_25%,transparent_25%,transparent_75%,#00000030_75%,#00000030),linear-gradient(45deg,#00000030_25%,transparent_25%,transparent_75%,#00000030_75%,#00000030)] [background-size:10px_10px] pointer-events-none opacity-40" />
                )}
                {selectedTexture === 'holo' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-cyan-500/20 to-amber-500/20 pointer-events-none opacity-80" />
                )}
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Card Row */}
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {customLogoUrl ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/30 bg-black/40 flex items-center justify-center shrink-0 shadow-lg">
                        <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                        {selectedEmoji}
                      </div>
                    )}
                    <div className="text-left">
                      <h4 className="font-black italic text-white text-base tracking-tight leading-tight line-clamp-1">{businessName}</h4>
                      <p className="text-[9px] font-mono uppercase text-white/60 tracking-wider">
                        {actionType === 'google_review' ? 'Google 5-Star NFC Beacon' : 
                         actionType === 'driver_dispatch' ? 'Express Courier NFC' : 
                         actionType === 'vcard' ? 'Digital vCard NFC' : 
                         actionType === 'paypal_pay' ? 'PayPal Instant Pay & Tip' : 
                         actionType === 'wifi' ? 'Guest Wi-Fi Auto-Connect' : 
                         actionType === 'loyalty_pass' ? 'Oasis Loyalty Pass' : 
                         'Smart Contactless Tag'}
                      </p>
                    </div>
                  </div>

                  <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
                  </div>
                </div>

                {/* Middle Content */}
                <div className="relative z-10 my-auto text-left space-y-1">
                  {actionType === 'google_review' && (
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-sm">★</span>
                      ))}
                      <span className="text-[10px] font-mono text-white/80 font-bold ml-1">5.0 RATING</span>
                    </div>
                  )}
                  {actionType === 'driver_dispatch' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold uppercase">
                      <Truck className="w-3 h-3" />
                      <span>Instant AWD / 4x4 Dispatch</span>
                    </div>
                  )}
                  {actionType === 'paypal_pay' && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[9px] font-mono font-bold uppercase">
                      <DollarSign className="w-3 h-3 text-blue-400" />
                      <span>PayPal Direct: {paypalUsername}</span>
                    </div>
                  )}
                  {actionType === 'vcard' && (
                    <p className="text-xs font-mono text-zinc-300">
                      👤 {vCardData.name} • {vCardData.title}
                    </p>
                  )}
                  <p className="text-sm font-black italic text-white tracking-wide leading-snug">
                    {headline}
                  </p>
                </div>

                {/* Bottom Card Row */}
                <div className="relative z-10 flex justify-between items-end pt-3 border-t border-white/10 text-left">
                  <div className="space-y-0.5">
                    {actionType === 'google_review' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-blue-400">G</span>
                        <span className="text-[11px] font-bold text-red-400">o</span>
                        <span className="text-[11px] font-bold text-yellow-400">o</span>
                        <span className="text-[11px] font-bold text-blue-400">g</span>
                        <span className="text-[11px] font-bold text-green-400">l</span>
                        <span className="text-[11px] font-bold text-red-400">e</span>
                        <span className="text-[10px] font-bold text-white ml-1">Reviews</span>
                      </div>
                    ) : actionType === 'paypal_pay' ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-black italic text-blue-400">Pay</span>
                        <span className="text-[11px] font-black italic text-cyan-300">Pal</span>
                        <span className="text-[9px] font-mono text-white/60 ml-1">seanhse97@gmail.com</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-wider text-white">
                        OASIS<span className="text-amber-400">TAP</span>
                      </span>
                    )}
                    <p className="text-[8px] font-mono text-white/40">STANDARDIZED NFC 13.56MHz • NTAG213</p>
                  </div>

                  {/* Dual-Mode QR Backup Box */}
                  {generatedQrDataUrl ? (
                    <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shadow-lg">
                      <img src={generatedQrDataUrl} alt="QR Backup" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <QrCode className="w-5 h-5 text-white/40" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons underneath preview */}
              <div className="pt-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
                {editingCardId ? (
                  <>
                    <button
                      onClick={handleSaveToFleet}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes to Card</span>
                    </button>

                    <button
                      onClick={handleDuplicateCard}
                      className="py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                      title="Duplicate card as a new copy in fleet"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Duplicate</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleSaveToFleet}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save to Active Fleet</span>
                  </button>
                )}

                <button
                  onClick={handleOrderPhysicalTag}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Order Physical ($19.99)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Customization Controls Form */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Form Factor Selector */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>1. Select Hardware Form Factor:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'card', label: 'Smart PVC Card', desc: 'CR80 Matte Card', icon: '💳' },
                  { id: 'stand', label: 'Counter Stand', desc: 'Acrylic Table Stand', icon: '🏛️' },
                  { id: 'sticker', label: 'Epoxy Sticker', desc: '30mm Waterproof', icon: '🏷️' },
                  { id: 'wood_puck', label: 'Lakeside Puck', desc: 'Engraved Maple', icon: '🪵' },
                  { id: 'keychain', label: 'Driver Key Fob', desc: 'Heavy Duty Fob', icon: '🛡️' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFormFactor(item.id as NfcFormFactorType)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      formFactor === item.id
                        ? 'bg-amber-400/15 border-amber-400 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <p className="text-xs font-bold text-white mt-1">{item.label}</p>
                    <p className="text-[9px] text-zinc-400 font-mono">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Action / Payload Selector (All 15 Actions) */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>2. Choose NFC Tap Trigger Action (15 Modes):</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                {[
                  { id: 'google_review', label: 'Google Review', icon: '⭐' },
                  { id: 'menu', label: 'Dine-In Menu', icon: '🍔' },
                  { id: 'driver_dispatch', label: 'Driver Dispatch', icon: '🚗' },
                  { id: 'paypal_pay', label: 'PayPal / Tip', icon: '💵' },
                  { id: 'vcard', label: 'Digital vCard', icon: '📱' },
                  { id: 'social_hub', label: 'Social Hub', icon: '🔗' },
                  { id: 'loyalty_pass', label: 'Loyalty Pass', icon: '🎁' },
                  { id: 'event_ticket', label: 'Event Pass', icon: '🎟️' },
                  { id: 'work_quote', label: 'Work Quotes', icon: '🔨' },
                  { id: 'wifi', label: 'Wi-Fi Connect', icon: '📶' },
                  { id: 'sms', label: 'SMS Ping', icon: '💬' },
                  { id: 'pet_tag', label: 'Pet Collar ID', icon: '🐕' },
                  { id: 'shortcuts', label: 'Apple Shortcut', icon: '⚡' },
                  { id: 'town_node', label: 'Town Node', icon: '🌲' },
                  { id: 'url', label: 'Custom URL', icon: '🌐' },
                ].map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      setActionType(act.id as NfcActionType);
                      if (act.id === 'google_review') setHeadline('Tap phone to review us on Google!');
                      if (act.id === 'menu') setHeadline('Tap to view live menu & order!');
                      if (act.id === 'driver_dispatch') setHeadline('Tap phone to dispatch local courier!');
                      if (act.id === 'paypal_pay') setHeadline('Tap phone to pay or tip via PayPal!');
                      if (act.id === 'vcard') setHeadline('Tap phone to save my contact info!');
                      if (act.id === 'social_hub') setHeadline('Tap to follow our Instagram & TikTok!');
                      if (act.id === 'loyalty_pass') setHeadline('Tap to earn +35 Loyalty Points!');
                      if (act.id === 'event_ticket') setHeadline('Tap to check in with Event Pass!');
                      if (act.id === 'work_quote') setHeadline('Tap to view transformations & get quote!');
                      if (act.id === 'wifi') setHeadline('Tap to join Guest High-Speed Wi-Fi!');
                      if (act.id === 'sms') setHeadline('Tap to send instant SMS message!');
                      if (act.id === 'pet_tag') setHeadline('Tap for emergency pet owner contact!');
                      if (act.id === 'shortcuts') setHeadline('Tap phone to trigger automated workflow!');
                      if (act.id === 'town_node') setHeadline(`Tap to explore ${selectedTownNode} Community Wire!`);
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      actionType === act.id
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base block">{act.icon}</span>
                    <span className="text-[10px] font-semibold block mt-0.5 truncate">{act.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payload Form Fields */}
              <div className="pt-3 border-t border-white/10 space-y-3">
                {actionType === 'google_review' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Google Review URL or Place ID
                    </label>
                    <input
                      type="url"
                      value={googleReviewUrl}
                      onChange={e => setGoogleReviewUrl(e.target.value)}
                      placeholder="https://search.google.com/local/writereview?placeid=..."
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'paypal_pay' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">PayPal.me Username</label>
                      <input
                        type="text"
                        placeholder="seanhse97"
                        value={paypalUsername}
                        onChange={e => setPaypalUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Verified PayPal Email</label>
                      <input
                        type="email"
                        placeholder="seanhse97@gmail.com"
                        value={paypalEmail}
                        onChange={e => setPaypalEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {actionType === 'social_hub' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Social Media Hub URL</label>
                    <input
                      type="url"
                      value={socialUrl}
                      onChange={e => setSocialUrl(e.target.value)}
                      placeholder="https://instagram.com/mybusiness"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'vcard' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={vCardData.name}
                      onChange={e => setVCardData({...vCardData, name: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={vCardData.title}
                      onChange={e => setVCardData({...vCardData, title: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={vCardData.phone}
                      onChange={e => setVCardData({...vCardData, phone: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={vCardData.email}
                      onChange={e => setVCardData({...vCardData, email: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'wifi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Wi-Fi SSID Network Name"
                      value={wifiData.ssid}
                      onChange={e => setWifiData({...wifiData, ssid: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      placeholder="Wi-Fi Password"
                      value={wifiData.password}
                      onChange={e => setWifiData({...wifiData, password: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'sms' && (
                  <div className="space-y-2">
                    <input
                      type="tel"
                      placeholder="Recipient Phone Number"
                      value={smsData.phone}
                      onChange={e => setSmsData({...smsData, phone: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <textarea
                      placeholder="Pre-filled Message Content"
                      value={smsData.message}
                      onChange={e => setSmsData({...smsData, message: e.target.value})}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 h-16"
                    />
                  </div>
                )}

                {actionType === 'pet_tag' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Pet Name (e.g. Max)"
                      value={petData.petName}
                      onChange={e => setPetData({...petData, petName: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      placeholder="Owner Phone"
                      value={petData.ownerPhone}
                      onChange={e => setPetData({...petData, ownerPhone: e.target.value})}
                      className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'shortcuts' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">iOS Shortcut Name</label>
                    <input
                      type="text"
                      value={shortcutName}
                      onChange={e => setShortcutName(e.target.value)}
                      placeholder="CourierDispatch"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}

                {actionType === 'town_node' && (
                  <select
                    value={selectedTownNode}
                    onChange={e => setSelectedTownNode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#15151f] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="Effingham">Effingham, NH Node</option>
                    <option value="Ossipee">Center Ossipee, NH Node</option>
                    <option value="Freedom">Freedom, NH Node</option>
                    <option value="Wolfeboro">Wolfeboro, NH Node</option>
                    <option value="Tamworth">Tamworth, NH Node</option>
                    <option value="Conway">Conway / North Conway, NH Node</option>
                  </select>
                )}

                {actionType === 'url' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Target Web URL</label>
                    <input
                      type="url"
                      value={customUrl}
                      onChange={e => setCustomUrl(e.target.value)}
                      placeholder="https://mywebsite.com"
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. Text & Branding Customization */}
            <div className="p-6 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-4">
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>3. Physical Artwork & Appearance:</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Card Header Title</span>
                  <input
                    type="text"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="e.g. Smoke World Ossipee"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400">Instruction Prompt</span>
                  <input
                    type="text"
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Tap with phone to review!"
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Card Color Theme:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { color: '#0f172a', name: 'Midnight Cyber' },
                    { color: '#064e3b', name: 'Carroll Emerald' },
                    { color: '#78350f', name: 'Gold Oak' },
                    { color: '#312e81', name: 'Indigo Pulse' },
                    { color: '#881337', name: 'Crimson Smoke' },
                    { color: '#000000', name: 'Matte Jet Black' },
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-8 h-8 rounded-xl border transition-all ${
                        selectedColor === c.color ? 'border-amber-400 scale-110 shadow-lg' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Texture Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Texture & Finish:</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'cyber', label: 'Cyber Dots' },
                    { id: 'carbon', label: 'Carbon Fiber' },
                    { id: 'holo', label: 'Holographic' },
                    { id: 'matte', label: 'Matte Soft' },
                    { id: 'metal', label: 'Clean Glass' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTexture(t.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-mono transition-all ${
                        selectedTexture === t.id
                          ? 'bg-amber-400 text-black font-bold'
                          : 'bg-white/5 text-zinc-400 border border-white/5'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji / Avatar picker */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400">Logo Emoji Icon:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['💨', '⭐', '🍔', '💵', '📱', '🔗', '🎁', '🎟️', '🚗', '🛻', '🌲', '🔨', '🐕', '☕', '✨'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setSelectedEmoji(em);
                        setCustomLogoUrl('');
                      }}
                      className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                        selectedEmoji === em && !customLogoUrl ? 'bg-amber-400 text-black scale-110' : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Logo Upload */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-zinc-400 block mb-1">Or Upload Custom Logo / Photo:</span>
                <ImageUpload
                  value={customLogoUrl}
                  onChange={url => setCustomLogoUrl(url)}
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: REAL & SIMULATED NFC TAG READER / INSPECTOR       */}
      {/* ======================================================== */}
      {activeTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 6 Cols: Hardware Scanning Deck */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                    Physical & Virtual NFC Antenna
                  </span>
                  <h3 className="text-xl font-black italic text-white uppercase">NFC Tag Reader</h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                  hasWebNfcSupport ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {hasWebNfcSupport ? '🟢 Web NFC Active' : '🟡 Simulator Ready'}
                </span>
              </div>

              {/* Web NFC Scan Button */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-[#141420] to-[#0d0d12] border border-amber-500/20 space-y-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-3xl shadow-inner">
                  <Radio className={`w-8 h-8 text-amber-400 ${isWebNfcScanning ? 'animate-ping' : 'animate-pulse'}`} />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {isWebNfcScanning ? 'Listening for NFC Signal...' : 'Physical Web NFC Reader'}
                  </h4>
                  <p className="text-xs text-zinc-400 font-light mt-0.5">
                    Hold any standard NTAG213, NTAG215, Mifare, or contactless review card to your device antenna.
                  </p>
                </div>

                <button
                  onClick={handleStartWebNfcScan}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Scan className="w-4 h-4" />
                  <span>{isWebNfcScanning ? 'Scanning Active (Hold Near Chip)' : 'Start Physical NFC Scan'}</span>
                </button>

                {scanStatusMessage && (
                  <p className="text-[11px] font-mono text-zinc-300 pt-1">
                    {scanStatusMessage}
                  </p>
                )}
              </div>

              {/* Direct Manual Paste Box */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                    <Copy className="w-3.5 h-3.5" />
                    <span>Manual Payload / NFC String Import:</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualPastePayload}
                    onChange={e => setManualPastePayload(e.target.value)}
                    placeholder="Paste URL, vCard, Wi-Fi config, or text..."
                    className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    onClick={() => handleManualPasteImport()}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shrink-0"
                  >
                    Import
                  </button>
                </div>
              </div>

              {/* Interactive Virtual NFC Tap Simulator */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Interactive Chip Simulator ({PRESET_SIMULATED_TAGS.length} Presets):
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Click any tag to tap</span>
                </div>

                <div className="space-y-2">
                  {PRESET_SIMULATED_TAGS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSimulateTap(idx)}
                      disabled={isSimulatingTap}
                      className="w-full p-3.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/40 rounded-2xl text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            {preset.name}
                          </p>
                          <p className="text-[10px] font-mono text-zinc-400">
                            {preset.desc}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                        Tap →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Decoded NFC Tag Telemetry & Memory Map */}
          <div className="lg:col-span-6 space-y-6">
            {scannedTag ? (
              <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                      Decoded Telemetry
                    </span>
                    <h3 className="text-xl font-black italic text-white uppercase">Chip Inspection</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Valid NDEF Tag</span>
                  </span>
                </div>

                {/* Technical Specs Table */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Unique ID (UID):</span>
                    <p className="font-bold text-white">{scannedTag.uid}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">IC Type:</span>
                    <p className="font-bold text-amber-400">{scannedTag.chipType}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Lock Status:</span>
                    <p className={`font-bold flex items-center gap-1 ${scannedTag.isLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                      {scannedTag.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{scannedTag.isLocked ? 'Locked (Read Only)' : 'Unlocked (Read/Write)'}</span>
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase">Protocol:</span>
                    <p className="font-bold text-zinc-200">{scannedTag.technology}</p>
                  </div>
                </div>

                {/* Memory Capacity Gauge */}
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>Memory Usage:</span>
                    <span className="text-white font-bold">{scannedTag.usedBytes} / {scannedTag.capacityBytes} Bytes ({Math.round((scannedTag.usedBytes / scannedTag.capacityBytes) * 100)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${(scannedTag.usedBytes / scannedTag.capacityBytes) * 100}%` }}
                    />
                  </div>
                </div>

                {/* NDEF Records List */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    Decoded NDEF Records ({scannedTag.records.length}):
                  </span>

                  {scannedTag.records.map((rec, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-mono font-bold uppercase">
                          {rec.type}
                        </span>
                        {rec.actionUrl && (
                          <a
                            href={rec.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                          >
                            <span>Test Action</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs font-mono text-white font-bold break-all bg-black/40 p-2.5 rounded-xl border border-white/5">
                        {rec.payload}
                      </p>

                      <p className="text-[11px] text-zinc-400 font-light">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Direct Import Action Controls */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => handleDirectImportTagToWebsite()}
                    className="w-full py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 hover:from-emerald-300 hover:to-teal-200 text-black font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>📥 Import & Add Directly to Website Fleet</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleImportScannedTag}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      <Palette className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit in Studio Canvas</span>
                    </button>

                    <button
                      onClick={() => {
                        if (scannedTag.records[0]?.actionUrl || scannedTag.records[0]?.payload) {
                          const payloadToCopy = scannedTag.records[0]?.actionUrl || scannedTag.records[0]?.payload;
                          navigator.clipboard.writeText(payloadToCopy);
                          setWriteSuccessMsg('Copied tag payload to clipboard!');
                          setTimeout(() => setWriteSuccessMsg(null), 3000);
                        }
                      }}
                      className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono"
                    >
                      <Copy className="w-3.5 h-3.5 text-blue-400" />
                      <span>Copy Raw Payload</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-[#0c0c12] border border-white/10 text-center space-y-4">
                <Radio className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                <h4 className="text-base font-bold text-zinc-400">No NFC Tag Scanned Yet</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Click "Start Physical NFC Scan" with an Android device, or select any of the simulated presets to test tag decoding.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ENCODING & FLASHING WORKSTATION                  */}
      {/* ======================================================== */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left 6 Cols: Encoding Action Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0e0e14] border border-white/10 space-y-6">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Universal Encoding Station
                </span>
                <h3 className="text-xl font-black italic text-white uppercase">Flash & Program NFC Chips</h3>
                <p className="text-xs text-zinc-400 font-light mt-1">
                  Target: <b>{businessName}</b> ({actionType.toUpperCase()})
                </p>
              </div>

              {/* Method 1: Web NFC Physical Write */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-[#101814] to-[#0a100d] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 1: Direct 1-Tap Web NFC Write</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Chrome Android / Web NFC Supported Browsers</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-light leading-relaxed">
                  Hold a blank NTAG213 / NTAG215 / NTAG216 card against the back of your phone to permanently write this custom payload.
                </p>

                <button
                  onClick={handleWritePhysicalTag}
                  disabled={isWritingNfc}
                  className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isWritingNfc ? 'Encoding Tag (Hold Phone Near Chip)...' : 'Write to Physical NFC Tag'}</span>
                </button>
              </div>

              {/* Method 2: Save to Townraise Fleet */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 2: Save to Active Beacon Fleet</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Generates instant live /tap test link</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-light">
                  Save this configuration to your Carroll County review hub with real-time tap telemetry and 5-star filtering.
                </p>

                <button
                  onClick={handleSaveToFleet}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save to Fleet</span>
                </button>
              </div>

              {/* Method 3: JSON / NDEF / Flipper Zero Export */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-400/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Method 3: Export NDEF Specification File</h4>
                    <p className="text-[10px] font-mono text-zinc-400">Compatible with NFC Tools & Flipper Zero</p>
                  </div>
                </div>

                <button
                  onClick={handleDownloadNdefJson}
                  className="w-full py-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download NDEF .JSON Payload</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right 6 Cols: Dual-Mode QR & Payload Inspector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-[#0c0c12] border border-white/10 space-y-6 text-center">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Dual-Mode Visual Output
                </span>
                <h3 className="text-xl font-black italic text-white uppercase">Printable QR & Payload</h3>
              </div>

              {/* QR Image */}
              {generatedQrDataUrl && (
                <div className="p-4 rounded-3xl bg-white border border-white/20 inline-block shadow-2xl">
                  <img src={generatedQrDataUrl} alt="Dual Mode QR" className="w-48 h-48 mx-auto object-contain" />
                </div>
              )}

              {/* Raw Payload Box */}
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Compiled NDEF String:</span>
                <div className="p-3.5 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-amber-400 break-all flex items-center justify-between gap-3">
                  <span className="truncate">{getComputedPayloadUrl()}</span>
                  <button
                    onClick={handleCopyPayload}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all shrink-0"
                    title="Copy Payload String"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Order Physical Tag Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#15151f] to-transparent border border-amber-500/20 text-left space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Need Pre-Printed Physical NFC Hardware?</h4>
                    <p className="text-xs text-zinc-400 font-light">
                      Custom laser-printed & pre-encoded with your business branding.
                    </p>
                  </div>
                  <span className="text-lg font-black text-amber-400 font-mono">$19.99</span>
                </div>

                <button
                  onClick={handleOrderPhysicalTag}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Physical {formFactor.toUpperCase()}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PRINTABLE QR STICKER SHEET MODAL */}
      {showPrintLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] flex flex-col justify-between space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white uppercase italic">
                  Printable Giveaway Label Sheet ({batchCards.length} Labels)
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Ready to print on standard Avery 2"x1" stickers or card backing sleeves.
                </p>
              </div>
              <button
                onClick={() => setShowPrintLabelModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-bold font-mono"
              >
                ✕ Close
              </button>
            </div>

            {/* Label Grid Preview */}
            <div className="overflow-y-auto max-h-[60vh] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
              {batchCards.map(card => (
                <div key={card.id} className="p-3 bg-white text-black rounded-xl text-center space-y-1 shadow-md border border-zinc-200">
                  <div className="flex justify-between items-center text-[8px] font-mono font-bold text-zinc-600">
                    <span>OASIS PASS</span>
                    <span>#{card.id}</span>
                  </div>
                  <div className="w-16 h-16 mx-auto bg-black rounded p-0.5">
                    {generatedQrDataUrl && (
                      <img src={generatedQrDataUrl} alt="QR" className="w-full h-full object-contain invert" />
                    )}
                  </div>
                  <p className="text-[9px] font-black tracking-tight leading-none text-zinc-900">{card.serialNumber}</p>
                  <p className="text-[7px] font-mono text-zinc-500 truncate">13.56 MHz NFC Standard</p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setShowPrintLabelModal(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-mono font-bold"
              >
                Done
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Sticker Labels</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD QR CODE & TAP FUNNEL MODAL */}
      {activeQrModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0e0f14] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full flex flex-col justify-between space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-start pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl border shadow-inner"
                  style={{
                    backgroundColor: activeQrModalCard.primaryColor || '#0f172a',
                    borderColor: 'rgba(255,255,255,0.2)'
                  }}
                >
                  {activeQrModalCard.logoUrl && activeQrModalCard.logoUrl.startsWith('http') ? (
                    <img src={activeQrModalCard.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    activeQrModalCard.logoUrl || '🌲'
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase italic leading-tight">
                    {activeQrModalCard.businessName || activeQrModalCard.cardName}
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    NFC Hardware: {activeQrModalCard.hardwareFormFactor?.toUpperCase() || 'PVC CARD'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveQrModalCard(null);
                  setActiveCardQrDataUrl(null);
                }}
                className="text-zinc-400 hover:text-white text-sm font-mono px-2 py-1 rounded-lg hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            {/* QR Code Canvas Display */}
            <div className="p-6 bg-white rounded-3xl text-center shadow-inner max-w-xs mx-auto w-full space-y-3">
              <div className="w-48 h-48 mx-auto flex items-center justify-center">
                {activeCardQrDataUrl ? (
                  <img src={activeCardQrDataUrl} alt="NFC QR" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-2xl text-zinc-400 font-mono text-xs">
                    Generating QR...
                  </div>
                )}
              </div>
              <div className="border-t border-zinc-200 pt-2">
                <p className="text-[10px] font-mono font-bold text-zinc-600 uppercase">
                  Instant Dual-Mode Tap & Scan
                </p>
                <p className="text-xs font-black tracking-tight text-zinc-900 truncate">
                  /tap/{activeQrModalCard.id}
                </p>
              </div>
            </div>

            {/* Target & Tap Link Info */}
            <div className="space-y-2 p-3 bg-white/5 rounded-2xl border border-white/5 text-xs font-mono">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-[10px] uppercase font-bold text-amber-400">Tap Endpoint URL:</span>
                <span className="text-[10px] text-zinc-400">Universal Dynamic Funnel</span>
              </div>
              <p className="text-white font-bold truncate">
                https://townraise.org/tap/{activeQrModalCard.id}
              </p>
              {activeQrModalCard.customDestinationUrl && (
                <div className="pt-1 border-t border-white/5 text-[11px] text-zinc-400 truncate">
                  <span className="text-zinc-500">Redirects to: </span>
                  <span className="text-zinc-300">{activeQrModalCard.customDestinationUrl}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://townraise.org/tap/${activeQrModalCard.id}`);
                  setWriteSuccessMsg('Copied Tap URL to clipboard!');
                  setTimeout(() => setWriteSuccessMsg(null), 3000);
                }}
                className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Copy Tap Link</span>
              </button>

              <a
                href={`/tap/${activeQrModalCard.id}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Test Live Tap</span>
              </a>

              <button
                onClick={() => {
                  handleEditCard(activeQrModalCard);
                  setActiveQrModalCard(null);
                }}
                className="col-span-2 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Open in Visual Customizer to Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Tag Paste & Direct Import Modal */}
      {showManualImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Direct NFC Card Importer
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Paste raw NDEF text, vCard, Wi-Fi config, or review URL
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowManualImportModal(false)}
                className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                NDEF Payload / Content
              </label>
              <textarea
                rows={5}
                value={manualPastePayload}
                onChange={(e) => setManualPastePayload(e.target.value)}
                placeholder="Paste URL (e.g. https://g.page/r/..., /tap/card_...), vCard (BEGIN:VCARD...), Wi-Fi string (WIFI:S:MyNetwork;P:pass;;), or any contact text..."
                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              />
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-3.5 space-y-1.5 text-xs text-zinc-300">
              <p className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Supported Tag Formats:
              </p>
              <ul className="list-disc list-inside text-[11px] text-zinc-400 space-y-0.5">
                <li><strong className="text-zinc-200">vCard 3.0:</strong> Contact cards (`BEGIN:VCARD...`)</li>
                <li><strong className="text-zinc-200">Wi-Fi Configs:</strong> QR / NDEF standard (`WIFI:S:...;P:...;;`)</li>
                <li><strong className="text-zinc-200">Google Reviews / Maps:</strong> Direct link or place ID URLs</li>
                <li><strong className="text-zinc-200">Payment & Dispatch:</strong> PayPal.me, courier phone/SMS triggers</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowManualImportModal(false);
                  setManualPastePayload('');
                }}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleManualPasteImport()}
                disabled={!manualPastePayload.trim()}
                className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:pointer-events-none text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import & Save Directly to Website</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
