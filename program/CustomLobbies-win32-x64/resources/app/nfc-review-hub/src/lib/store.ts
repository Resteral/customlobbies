'use client';

import { useState, useEffect } from 'react';
import { 
  ReviewProduct, NfcCardConfig, TapLog, PrivateFeedback, 
  CartItem, DeliveryOrder, NotificationSettings, DeliveryItem,
  SellerProfile, ShoutoutPost, TownNode, UserMembership, MembershipTier,
  MerchantStorefront, StorefrontProduct, DriverTelemetry, ProofOfDelivery, DriverShiftSummary,
  BeforeAfterShowcase, WorkRequest, ContractorQuote,
  NfcMenuProduct, NfcHardwareOrder, NfcFormFactor,
  ManagedServicePackage, ClientServiceSubscription, ServiceAutomationBot, ServiceCategory,
  DirectoryListing, DirectoryCategory, AffiliateAmbassador, TownLoyaltyReward, UserLoyaltyWallet,
  TownEvent, DineInTableTicket, LocalConditionsReport,
  SmsAutomationWorkflow, SmsLogMessage, SmsSubscriberContact, SmsWorkflowCategory,
  UserProfile, DeliveryDriverMember, AuthSession, UserRole,
  TouristHunt, PassportStamp, HuntCheckpoint,
  StoreHuntCircuit, StoreHuntSpot, StoreHunterStamp, StoreMysteryPerk
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_CARDS, INITIAL_TAP_LOGS, 
  INITIAL_FEEDBACKS, INITIAL_SELLERS, INITIAL_SHOUTOUTS, INITIAL_TOWNS,
  INITIAL_BEFORE_AFTER_SHOWCASES, INITIAL_WORK_REQUESTS,
  INITIAL_NFC_MENU_PRODUCTS, INITIAL_NFC_HARDWARE_ORDERS,
  INITIAL_MANAGED_SERVICES, INITIAL_CLIENT_SUBSCRIPTIONS, INITIAL_AUTOMATION_BOTS,
  INITIAL_DIRECTORY_LISTINGS, INITIAL_AFFILIATES, INITIAL_LOYALTY_REWARDS, DEFAULT_USER_LOYALTY_WALLET,
  INITIAL_EVENTS, INITIAL_TABLE_TICKETS, DEFAULT_LOCAL_CONDITIONS,
  INITIAL_SMS_WORKFLOWS, INITIAL_SMS_LOGS, INITIAL_SMS_SUBSCRIBERS
} from './mock-data';
import { INITIAL_TOURIST_HUNTS, INITIAL_USER_STAMPS } from './tourist-hunts-data';
import { INITIAL_STORE_CIRCUITS, INITIAL_STORE_HUNTER_STAMPS } from './store-hunting-data';
import { sendAppNotification } from './push-notifications';

const STORAGE_KEYS = {
  CARDS: 'pulpulse_cards_v3',
  LOGS: 'pulpulse_logs_v1',
  FEEDBACKS: 'pulpulse_feedbacks_v1',
  CART: 'pulpulse_cart_v1',
  DELIVERY_ORDERS: 'pulpulse_delivery_orders_v1',
  NOTIFICATION_SETTINGS: 'pulpulse_notifications_v1',
  SELLERS: 'pulpulse_sellers_v3',
  SHOUTOUTS: 'pulpulse_shoutouts_v1',
  PRODUCTS: 'pulpulse_products_v1',
  TOWNS: 'pulpulse_towns_v1',
  ACTIVE_TOWN_ID: 'pulpulse_active_town_id_v1',
  MEMBERSHIP: 'pulpulse_membership_v1',
  STOREFRONTS: 'pulpulse_storefronts_v3',
  DRIVER_TELEMETRY: 'pulpulse_driver_telemetry_v1',
  DRIVER_SHIFT: 'pulpulse_driver_shift_v1',
  BEFORE_AFTER_SHOWCASES: 'pulpulse_showcases_v3',
  WORK_REQUESTS: 'pulpulse_work_requests_v1',
  NFC_MENU_PRODUCTS: 'pulpulse_nfc_menu_products_v1',
  NFC_HARDWARE_ORDERS: 'pulpulse_nfc_hardware_orders_v1',
  MANAGED_SERVICES: 'pulpulse_managed_services_v1',
  CLIENT_SUBSCRIPTIONS: 'pulpulse_client_subscriptions_v1',
  AUTOMATION_BOTS: 'pulpulse_automation_bots_v1',
  DIRECTORY_LISTINGS: 'pulpulse_directory_listings_v3',
  AFFILIATES: 'pulpulse_affiliates_v1',
  LOYALTY_REWARDS: 'pulpulse_loyalty_rewards_v1',
  LOYALTY_WALLET: 'pulpulse_loyalty_wallet_v1',
  EVENTS: 'pulpulse_events_v1',
  TABLE_TICKETS: 'pulpulse_table_tickets_v1',
  LOCAL_CONDITIONS: 'pulpulse_local_conditions_v1',
  SMS_WORKFLOWS: 'pulpulse_sms_workflows_v1',
  SMS_LOGS: 'pulpulse_sms_logs_v1',
  SMS_SUBSCRIBERS: 'pulpulse_sms_subscribers_v1',
  AUTH_USER: 'pulpulse_auth_user_v3',
  REGISTERED_ACCOUNTS: 'pulpulse_registered_accounts_v3',
  DELIVERY_DRIVERS: 'pulpulse_delivery_drivers_v3',
  TOURIST_HUNTS: 'pulpulse_tourist_hunts_v1',
  PASSPORT_STAMPS: 'pulpulse_passport_stamps_v1',
  STORE_CIRCUITS: 'pulpulse_store_circuits_v1',
  STORE_HUNTER_STAMPS: 'pulpulse_store_hunter_stamps_v1',
};

export const INITIAL_DELIVERY_DRIVERS: DeliveryDriverMember[] = [
  {
    id: 'driver-sean',
    name: 'Sean Martin',
    phone: '(508) 507-0305',
    email: 'frijj555@gmail.com',
    avatar: '👑',
    town: 'Effingham',
    state: 'NH',
    vehicleName: 'Silver Subaru Outback (AWD Vanguard Unit)',
    vehiclePlate: 'NH-VANGUARD',
    isOnline: true,
    status: 'online_ready',
    specialties: ['Express Food Delivery', 'Lake Dockside Firewood', 'Ace Hardware & Tools', 'Hannaford Curbside', 'Emergency Errand Runs'],
    rating: 5.0,
    reviewsCount: 156,
    deliveriesCompleted: 342,
    joinedDate: '2026-01-01',
    preferredTowns: ['Effingham', 'Center Ossipee', 'Freedom', 'Wakefield', 'Conway'],
    activeShiftStart: 'Today at 7:30 AM',
    hourlyRateEstimate: '$9.99 flat base + $1.50/mi',
    currentLocation: 'Route 25 & 153 Corridor',
    canDeliverFood: true,
    canDeliverGroceries: true,
    canDeliverHardware: true,
    canDeliverFirewood: true
  }
];

export const isUserAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  const isSeanEmail = Boolean(user.email && user.email.trim().toLowerCase() === 'frijj555@gmail.com');
  const isSeanPhone = Boolean(user.phone && user.phone.replace(/\D/g, '') === '5085070305');
  const isSeanId = user.id === 'user-sean';
  return isSeanId || isSeanEmail || isSeanPhone;
};

export const PRESET_USERS: UserProfile[] = [
  {
    id: 'user-sean',
    name: 'Sean Martin',
    email: 'frijj555@gmail.com',
    phone: '(508) 507-0305',
    pin: '0305',
    role: 'admin',
    avatar: '👑',
    town: 'Effingham',
    state: 'NH',
    badge: 'Founding Vanguard & Platform Lead Admin',
    isDriver: true,
    driverMemberId: 'driver-sean',
    createdAt: '2026-01-01'
  }
];

const DEFAULT_DRIVER_SHIFT: DriverShiftSummary = {
  isOnline: true,
  shiftStartTime: new Date().toISOString(),
  shiftDeliveriesCount: 0,
  shiftEarningsTotal: 0,
  shiftTipsTotal: 0,
  shiftMileageEstimate: 0,
  totalBalance: 0,
};

const DEFAULT_DRIVER_TELEMETRY: DriverTelemetry = {
  driverId: 'driver-sean-martin',
  driverName: 'Sean Martin',
  driverPhone: '508-507-0305',
  avatar: '👑',
  vehicle: 'Silver Subaru Outback (AWD Vanguard Unit)',
  rating: 5.0,
  totalDeliveries: 342,
  status: 'available',
  latitude: 43.7258,
  longitude: -71.1215,
  heading: 42,
  speedMph: 28,
  altitudeFeet: 680,
  batteryPercent: 94,
  isBroadcastingGps: true,
  lastPingTimestamp: new Date().toISOString(),
  currentRoad: 'Route 25 / White Mountain Hwy',
  deviceTrackingActive: false,
};

const INITIAL_STOREFRONTS: MerchantStorefront[] = [
  {
    id: 'sf-oasis-roastery',
    slug: 'oasis-roastery-bakehouse',
    businessName: 'Oasis Artisan Roastery & Bakehouse',
    tagline: 'Single-Origin Nitro Cold Brews, Hearth Sourdough & Morning Brioche',
    description: 'Effingham’s flagship specialty cafe featuring hearth-baked sourdough bread, single-origin espressos, and artisan brunch boxes.',
    logoEmoji: '☕',
    customLogoUrl: '',
    coverImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
    phone: '(508) 507-0305',
    email: 'frijj555@gmail.com',
    address: 'Historic Route 153, Effingham, NH 03882',
    town: 'Effingham',
    state: 'NH',
    accentColor: '#f59e0b',
    deliveryFee: 2.99,
    minOrder: 10.00,
    estimatedPrepTime: '15-20 mins',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    googleRating: 5.0,
    reviewsCount: 428,
    googleReviewUrl: 'https://www.google.com/search?q=Oasis+Artisan+Roastery+Effingham+NH',
    enablePickup: true,
    enableDelivery: true,
    listOnMarketplace: true,
    isPublished: true,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),

    // Extreme Customization Fields
    themePreset: 'amber_gold',
    heroStyle: 'banner_cover',
    customFont: 'font-sans',
    primaryColor: '#f59e0b',
    secondaryColor: '#ea580c',
    backgroundColor: '#070709',
    cardBackgroundColor: '#0e0e13',
    textColor: '#ffffff',

    foundedYear: '2023',
    detailedBio: 'Founded in the foothills of Carroll County, Oasis Artisan Roastery & Bakehouse combines old-world hearth baking with precision specialty coffee roasting. Every loaf of sourdough undergoes a 36-hour natural fermentation, and every batch of single-origin coffee is roasted in small batches to preserve its distinct origin notes.',
    ownerName: 'Sean Martin',
    ownerRole: 'Founder & Master Baker',
    ownerAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    badges: [
      '👑 Founding Vanguard Hub',
      '🍞 100% Hearth Sourdough',
      '☕ Direct Trade Single-Origin',
      '🛻 4x4 Express Courier Delivery',
      '⭐ 5-Star Top Rated Business'
    ],

    enableAnnouncement: true,
    announcementText: '🔥 Fresh Morning Sourdough & Hot Brioche Cinnamon Rolls just came out of the wood-fired hearth! Tap to order express delivery.',
    announcementBgColor: '#f59e0b',
    announcementTextColor: '#000000',
    announcementLink: '#catalog',

    operatingHours: {
      Monday: { open: '07:00 AM', close: '04:00 PM', isClosed: false },
      Tuesday: { open: '07:00 AM', close: '04:00 PM', isClosed: false },
      Wednesday: { open: '07:00 AM', close: '04:00 PM', isClosed: false },
      Thursday: { open: '07:00 AM', close: '05:00 PM', isClosed: false },
      Friday: { open: '07:00 AM', close: '06:00 PM', isClosed: false },
      Saturday: { open: '07:00 AM', close: '06:00 PM', isClosed: false },
      Sunday: { open: '08:00 AM', close: '03:00 PM', isClosed: false }
    },
    statusMessage: 'Open Today • Fresh Baking All Day',
    emergencyDispatchActive: true,
    afterHoursEmergencyPhone: '(508) 507-0305',

    galleryImages: [
      {
        id: 'gal-1',
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
        title: 'Artisan Espresso Bar & Roastery',
        caption: 'Handcrafted espresso pulls and nitro cold brew taps in Effingham.'
      },
      {
        id: 'gal-2',
        url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
        title: 'Hearth Wood-Fired Sourdough',
        caption: 'Blistered artisan crusts baked fresh every single morning.'
      },
      {
        id: 'gal-3',
        url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
        title: 'Farmhouse Avocado & Poached Egg Toast',
        caption: 'Topped with local pasture eggs, heirloom tomatoes, and microgreens.'
      },
      {
        id: 'gal-4',
        url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
        title: 'Nitro Cold Brew Growlers',
        caption: 'Steeped for 24 hours with dark chocolate and hazelnut notes.'
      }
    ],

    testimonials: [
      {
        id: 'test-1',
        customerName: 'Sarah Jenkins',
        rating: 5,
        reviewText: 'The best sourdough bread in New Hampshire hands down! The nitro cold brew growler delivered right to my cabin made my whole weekend.',
        date: '2 days ago',
        source: 'google'
      },
      {
        id: 'test-2',
        customerName: 'Marcus Vance',
        rating: 5,
        reviewText: 'Sean Martin delivered my morning brunch box and hot coffee in under 20 minutes in the snow. Extraordinary service and quality!',
        date: '1 week ago',
        source: 'verified_tap'
      },
      {
        id: 'test-3',
        customerName: 'Elena Rostova',
        rating: 5,
        reviewText: 'I tap my NFC card at the table and my order comes out hot and fresh. The maple cinnamon rolls are out of this world.',
        date: '2 weeks ago',
        source: 'google'
      }
    ],

    faqs: [
      {
        id: 'faq-1',
        question: 'How fast is local courier delivery in Carroll County?',
        answer: 'Our dedicated 4x4 courier courier Sean Martin delivers anywhere in Effingham, Ossipee, Freedom, and surrounding towns usually within 15 to 30 minutes of oven prep.'
      },
      {
        id: 'faq-2',
        question: 'Do you offer gluten-sensitive or vegan options?',
        answer: 'Yes! We have certified vegan organic parfaits, oat/almond milk specialty drinks, and avocado toasts.'
      },
      {
        id: 'faq-3',
        question: 'Can I pre-order catering or weekend brunch boxes in bulk?',
        answer: 'Absolutely! You can order directly through this website or call/text (508) 507-0305 24 hours in advance for custom brunch setups.'
      }
    ],

    customCtas: [
      {
        id: 'cta-courier',
        label: '🛻 Book 4x4 Courier Hotline',
        url: 'tel:5085070305',
        style: 'courier'
      },
      {
        id: 'cta-catering',
        label: '📋 Request Custom Catering',
        url: '/contact',
        style: 'amber'
      }
    ],

    instagramUrl: 'https://instagram.com/townraise',
    facebookUrl: 'https://facebook.com/townraise',
    websiteUrl: 'https://townraise.org',
    serviceRadiusMiles: 25,
    coveredTowns: ['Effingham', 'Ossipee', 'Freedom', 'Tamworth', 'Wakefield', 'Wolfeboro'],
    isCourierDeliveryAvailable: true,
    courierNotes: '4x4 AWD Vanguard Unit equipped for all weather and mountain road delivery.',

    products: [
      {
        id: 'oas-prod-1',
        name: 'Nitro Cold Brew Growler (64oz Fresh Pour)',
        description: 'Signature cold brew steeped for 24 hours with notes of dark chocolate and toasted hazelnuts.',
        price: 18.00,
        category: 'Coffee & Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Customer Pick',
        optionGroups: [
          {
            id: 'coldbrew-flavor',
            title: 'Syrup / Flavor Shot',
            type: 'single',
            choices: [
              { id: 'fl-none', name: 'Black / Pure Brew', priceDelta: 0 },
              { id: 'fl-vanilla', name: 'Madagascar Vanilla Bean', priceDelta: 1.00 },
              { id: 'fl-maple', name: 'Local NH Smoked Maple Syrup', priceDelta: 1.25 },
              { id: 'fl-caramel', name: 'Salted Butter Caramel', priceDelta: 1.00 }
            ]
          }
        ]
      },
      {
        id: 'oas-prod-macchiato',
        name: 'White Mountain Iced Caramel Macchiato',
        description: 'Double shot of signature espresso over cold milk, vanilla syrup, and heavy caramel drizzle.',
        price: 5.75,
        category: 'Coffee & Drinks',
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '220 cal',
        optionGroups: [
          {
            id: 'macc-milk',
            title: 'Milk Selection',
            type: 'single',
            choices: [
              { id: 'm-whole', name: 'Farm Whole Milk', priceDelta: 0 },
              { id: 'm-oat', name: 'Creamy Oat Milk', priceDelta: 0.75 },
              { id: 'm-almond', name: 'Almond Milk', priceDelta: 0.75 }
            ]
          }
        ]
      },
      {
        id: 'oas-prod-2',
        name: 'Artisan Wood-Fired Country Sourdough Loaf',
        description: 'Naturally fermented 36-hour sourdough boule with crisp blistered crust and soft airy crumb.',
        price: 8.50,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Hearth Baked'
      },
      {
        id: 'oas-prod-avotoast',
        name: 'Avocado & Soft-Poached Egg Sourdough Toast',
        description: 'Toasted artisan sourdough slice topped with crushed Haas avocado, farm-poached egg, heirloom cherry tomatoes, microgreens, and everything seasoning.',
        price: 12.50,
        category: 'Brunch & Eats',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        calories: '440 cal'
      },
      {
        id: 'oas-prod-3',
        name: 'Maple Glazed Brioche Cinnamon Roll (4-Pack)',
        description: 'Warm fluffy brioche rolls swirled with Saigon cinnamon and drenched in pure maple cream cheese frosting.',
        price: 16.00,
        category: 'Bakery',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true
      },
      {
        id: 'oas-prod-brunch-box',
        name: 'Effingham Morning Artisan Brunch Box',
        description: 'Includes 2 flaky French butter croissants, 2 maple cinnamon rolls, organic berry Greek yogurt parfait with granola, and fresh seasonal orchard fruit.',
        price: 28.00,
        category: 'Brunch & Eats',
        imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        inStock: true,
        badge: 'Brunch Special'
      }
    ]
  }
];

const DEFAULT_MEMBERSHIP: UserMembership = {
  tier: 'vanguard_master',
  tierName: 'Town Vanguard Master',
  active: true,
  memberId: 'MEM-SEAN-001',
  memberName: 'Sean Martin',
  memberEmail: 'frijj555@gmail.com',
  memberTown: 'Effingham, NH',
  joinedDate: new Date().toISOString().split('T')[0],
  renewsAt: '2027-01-01',
  billingCycle: 'annual',
  price: 758,
  perks: [
    'Official Town Node territory rights',
    'Multi-shop batch review scanner & flasher',
    'Printable merchant onboarding kits',
    'Revenue share on local deliveries',
    'Master Vanguard Badge'
  ],
  avatarEmoji: '👑',
  customBadge: 'Founding Vanguard',
};

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  phoneNumber: '(508) 507-0305',
  enableSms: true,
  enableTelegram: false,
  telegramBotToken: '',
  telegramChatId: '',
  enableDiscord: false,
  discordWebhookUrl: '',
  enableSoundChime: true,
};

const INITIAL_DELIVERY_ORDERS: DeliveryOrder[] = [];

export function useNfcStore() {
  const [towns, setTowns] = useState<TownNode[]>(INITIAL_TOWNS);
  const [activeTownId, setActiveTownId] = useState<string>('town-effingham');
  const [products, setProducts] = useState<ReviewProduct[]>(INITIAL_PRODUCTS);
  const [sellers, setSellers] = useState<SellerProfile[]>(INITIAL_SELLERS);
  const [shoutouts, setShoutouts] = useState<ShoutoutPost[]>(INITIAL_SHOUTOUTS);
  const [cards, setCards] = useState<NfcCardConfig[]>(INITIAL_CARDS);
  const [tapLogs, setTapLogs] = useState<TapLog[]>(INITIAL_TAP_LOGS);
  const [feedbacks, setFeedbacks] = useState<PrivateFeedback[]>(INITIAL_FEEDBACKS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(INITIAL_DELIVERY_ORDERS);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [userMembership, setUserMembership] = useState<UserMembership>(DEFAULT_MEMBERSHIP);
  const [storefronts, setStorefronts] = useState<MerchantStorefront[]>(INITIAL_STOREFRONTS);
  const [driverTelemetry, setDriverTelemetry] = useState<DriverTelemetry>(DEFAULT_DRIVER_TELEMETRY);
  const [driverShift, setDriverShift] = useState<DriverShiftSummary>(DEFAULT_DRIVER_SHIFT);
  const [beforeAfterShowcases, setBeforeAfterShowcases] = useState<BeforeAfterShowcase[]>(INITIAL_BEFORE_AFTER_SHOWCASES);
  const [workRequests, setWorkRequests] = useState<WorkRequest[]>(INITIAL_WORK_REQUESTS);
  const [nfcMenuProducts, setNfcMenuProducts] = useState<NfcMenuProduct[]>(INITIAL_NFC_MENU_PRODUCTS);
  const [nfcHardwareOrders, setNfcHardwareOrders] = useState<NfcHardwareOrder[]>(INITIAL_NFC_HARDWARE_ORDERS);
  const [managedServices, setManagedServices] = useState<ManagedServicePackage[]>(INITIAL_MANAGED_SERVICES);
  const [clientSubscriptions, setClientSubscriptions] = useState<ClientServiceSubscription[]>(INITIAL_CLIENT_SUBSCRIPTIONS);
  const [automationBots, setAutomationBots] = useState<ServiceAutomationBot[]>(INITIAL_AUTOMATION_BOTS);
  const [directoryListings, setDirectoryListings] = useState<DirectoryListing[]>(INITIAL_DIRECTORY_LISTINGS);
  const [affiliates, setAffiliates] = useState<AffiliateAmbassador[]>(INITIAL_AFFILIATES);
  const [loyaltyRewards, setLoyaltyRewards] = useState<TownLoyaltyReward[]>(INITIAL_LOYALTY_REWARDS);
  const [loyaltyWallet, setLoyaltyWallet] = useState<UserLoyaltyWallet>(DEFAULT_USER_LOYALTY_WALLET);
  const [events, setEvents] = useState<TownEvent[]>(INITIAL_EVENTS);
  const [tableTickets, setTableTickets] = useState<DineInTableTicket[]>(INITIAL_TABLE_TICKETS);
  const [localConditions, setLocalConditions] = useState<LocalConditionsReport>(DEFAULT_LOCAL_CONDITIONS);
  const [smsWorkflows, setSmsWorkflows] = useState<SmsAutomationWorkflow[]>(INITIAL_SMS_WORKFLOWS);
  const [smsLogs, setSmsLogs] = useState<SmsLogMessage[]>(INITIAL_SMS_LOGS);
  const [smsSubscribers, setSmsSubscribers] = useState<SmsSubscriberContact[]>(INITIAL_SMS_SUBSCRIBERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(PRESET_USERS[0]);
  const [registeredAccounts, setRegisteredAccounts] = useState<UserProfile[]>(PRESET_USERS);
  const [deliveryDrivers, setDeliveryDrivers] = useState<DeliveryDriverMember[]>(INITIAL_DELIVERY_DRIVERS);
  const [touristHunts, setTouristHunts] = useState<TouristHunt[]>(INITIAL_TOURIST_HUNTS);
  const [passportStamps, setPassportStamps] = useState<PassportStamp[]>(INITIAL_USER_STAMPS);
  const [storeHuntCircuits, setStoreHuntCircuits] = useState<StoreHuntCircuit[]>(INITIAL_STORE_CIRCUITS);
  const [storeHunterStamps, setStoreHunterStamps] = useState<StoreHunterStamp[]>(INITIAL_STORE_HUNTER_STAMPS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCircuits = localStorage.getItem(STORAGE_KEYS.STORE_CIRCUITS);
      if (storedCircuits) {
        const parsed: StoreHuntCircuit[] = JSON.parse(storedCircuits);
        const existingIds = new Set(parsed.map(c => c.id));
        setStoreHuntCircuits([...parsed, ...INITIAL_STORE_CIRCUITS.filter(c => !existingIds.has(c.id))]);
      } else {
        setStoreHuntCircuits(INITIAL_STORE_CIRCUITS);
      }

      const storedStoreStamps = localStorage.getItem(STORAGE_KEYS.STORE_HUNTER_STAMPS);
      if (storedStoreStamps) {
        setStoreHunterStamps(JSON.parse(storedStoreStamps));
      } else {
        setStoreHunterStamps(INITIAL_STORE_HUNTER_STAMPS);
      }

      const storedHunts = localStorage.getItem(STORAGE_KEYS.TOURIST_HUNTS);
      if (storedHunts) {
        const parsed: TouristHunt[] = JSON.parse(storedHunts);
        const existingIds = new Set(parsed.map(h => h.id));
        setTouristHunts([...parsed, ...INITIAL_TOURIST_HUNTS.filter(h => !existingIds.has(h.id))]);
      } else {
        setTouristHunts(INITIAL_TOURIST_HUNTS);
      }

      const storedStamps = localStorage.getItem(STORAGE_KEYS.PASSPORT_STAMPS);
      if (storedStamps) {
        setPassportStamps(JSON.parse(storedStamps));
      } else {
        setPassportStamps(INITIAL_USER_STAMPS);
      }

      const storedAccounts = localStorage.getItem(STORAGE_KEYS.REGISTERED_ACCOUNTS);
      let loadedAccounts = PRESET_USERS;
      if (storedAccounts) {
        const parsed: UserProfile[] = JSON.parse(storedAccounts);
        const existingIds = new Set(parsed.map(u => u.id));
        loadedAccounts = [...parsed, ...PRESET_USERS.filter(u => !existingIds.has(u.id))];
        setRegisteredAccounts(loadedAccounts);
      } else {
        setRegisteredAccounts(PRESET_USERS);
      }

      const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(PRESET_USERS[0]);
      }

      const storedDrivers = localStorage.getItem(STORAGE_KEYS.DELIVERY_DRIVERS);
      if (storedDrivers) {
        const parsed: DeliveryDriverMember[] = JSON.parse(storedDrivers);
        const cleaned = parsed.filter(d => d.id !== 'driver-jake' && d.id !== 'driver-amanda' && d.id !== 'driver-dave');
        const existingIds = new Set(cleaned.map(d => d.id));
        setDeliveryDrivers([...cleaned, ...INITIAL_DELIVERY_DRIVERS.filter(d => !existingIds.has(d.id))]);
      } else {
        setDeliveryDrivers(INITIAL_DELIVERY_DRIVERS);
      }

      const storedTowns = localStorage.getItem(STORAGE_KEYS.TOWNS);
      if (storedTowns) setTowns(JSON.parse(storedTowns));

      const storedTownId = localStorage.getItem(STORAGE_KEYS.ACTIVE_TOWN_ID);
      if (storedTownId) setActiveTownId(storedTownId);

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const legacyMockSfIds = new Set([
        'sf-pnb-eats', 'sf-pizza-barn', 'sf-freedom-village-store', 'sf-smoke-world',
        'sf-yankee-smokehouse', 'sf-hobbs-tavern', 'sf-jakes-seafood', 'sf-poor-peoples-pub',
        'sf-flatbread', 'sf-hannaford-togo', 'sf-sweeties-icecream'
      ]);

      const legacyMockSellerIds = new Set([
        'seller-pnb-eats', 'seller-smoke-world', 'seller-yankee-smokehouse', 'seller-hobbs-tavern', 'seller-jakes-seafood'
      ]);

      const storedSellers = localStorage.getItem(STORAGE_KEYS.SELLERS);
      if (storedSellers) {
        const parsed: SellerProfile[] = JSON.parse(storedSellers);
        const cleaned = parsed.filter(s => !legacyMockSellerIds.has(s.id));
        setSellers(cleaned.length > 0 ? cleaned : INITIAL_SELLERS);
      } else {
        setSellers(INITIAL_SELLERS);
      }

      const storedShoutouts = localStorage.getItem(STORAGE_KEYS.SHOUTOUTS);
      if (storedShoutouts) setShoutouts(JSON.parse(storedShoutouts));

      const storedCards = localStorage.getItem(STORAGE_KEYS.CARDS);
      if (storedCards) setCards(JSON.parse(storedCards));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (storedLogs) setTapLogs(JSON.parse(storedLogs));

      const storedFeedbacks = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      if (storedFeedbacks) setFeedbacks(JSON.parse(storedFeedbacks));

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.DELIVERY_ORDERS);
      if (storedOrders) {
        const parsed: DeliveryOrder[] = JSON.parse(storedOrders);
        const existingIds = new Set(parsed.map(o => o.id));
        const merged = [...parsed, ...INITIAL_DELIVERY_ORDERS.filter(o => !existingIds.has(o.id))];
        setDeliveryOrders(merged);
      } else {
        setDeliveryOrders(INITIAL_DELIVERY_ORDERS);
      }

      const storedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (storedNotifications) setNotificationSettings(JSON.parse(storedNotifications));

      const storedMembership = localStorage.getItem(STORAGE_KEYS.MEMBERSHIP);
      if (storedMembership) setUserMembership(JSON.parse(storedMembership));

      const storedTelemetry = localStorage.getItem(STORAGE_KEYS.DRIVER_TELEMETRY);
      if (storedTelemetry) setDriverTelemetry(JSON.parse(storedTelemetry));

      const storedShift = localStorage.getItem(STORAGE_KEYS.DRIVER_SHIFT);
      if (storedShift) setDriverShift(JSON.parse(storedShift));

      const storedStorefronts = localStorage.getItem(STORAGE_KEYS.STOREFRONTS);
      if (storedStorefronts) {
        const parsed: MerchantStorefront[] = JSON.parse(storedStorefronts);
        const filtered = parsed.filter(s => !legacyMockSfIds.has(s.id));
        const initialMap = new Map(INITIAL_STOREFRONTS.map(s => [s.id, s]));
        const merged = filtered.map(s => {
          const initSf = initialMap.get(s.id);
          if (initSf) {
            return {
              ...initSf,
              ...s,
              products: initSf.products
            };
          }
          return s;
        });
        const existingIds = new Set(filtered.map(s => s.id));
        const finalMerged = [...merged, ...INITIAL_STOREFRONTS.filter(s => !existingIds.has(s.id))];
        setStorefronts(finalMerged);
      } else {
        setStorefronts(INITIAL_STOREFRONTS);
      }

      const storedShowcases = localStorage.getItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES);
      if (storedShowcases) {
        const parsed: BeforeAfterShowcase[] = JSON.parse(storedShowcases);
        const existingIds = new Set(parsed.map(s => s.id));
        const merged = [...parsed, ...INITIAL_BEFORE_AFTER_SHOWCASES.filter(s => !existingIds.has(s.id))];
        setBeforeAfterShowcases(merged);
      } else {
        setBeforeAfterShowcases(INITIAL_BEFORE_AFTER_SHOWCASES);
      }

      const storedRequests = localStorage.getItem(STORAGE_KEYS.WORK_REQUESTS);
      const storedNfcProducts = localStorage.getItem(STORAGE_KEYS.NFC_MENU_PRODUCTS);
      if (storedNfcProducts) {
        const parsed: NfcMenuProduct[] = JSON.parse(storedNfcProducts);
        const existingIds = new Set(parsed.map(p => p.id));
        const merged = [...parsed, ...INITIAL_NFC_MENU_PRODUCTS.filter(p => !existingIds.has(p.id))];
        setNfcMenuProducts(merged);
      } else {
        setNfcMenuProducts(INITIAL_NFC_MENU_PRODUCTS);
      }

      const storedHardwareOrders = localStorage.getItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS);
      const storedServices = localStorage.getItem(STORAGE_KEYS.MANAGED_SERVICES);
      if (storedServices) {
        const parsed: ManagedServicePackage[] = JSON.parse(storedServices);
        const existingIds = new Set(parsed.map(s => s.id));
        setManagedServices([...parsed, ...INITIAL_MANAGED_SERVICES.filter(s => !existingIds.has(s.id))]);
      } else {
        setManagedServices(INITIAL_MANAGED_SERVICES);
      }

      const storedSubs = localStorage.getItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS);
      if (storedSubs) {
        const parsed: ClientServiceSubscription[] = JSON.parse(storedSubs);
        const existingIds = new Set(parsed.map(s => s.id));
        setClientSubscriptions([...parsed, ...INITIAL_CLIENT_SUBSCRIPTIONS.filter(s => !existingIds.has(s.id))]);
      } else {
        setClientSubscriptions(INITIAL_CLIENT_SUBSCRIPTIONS);
      }

      const storedBots = localStorage.getItem(STORAGE_KEYS.AUTOMATION_BOTS);
      if (storedBots) {
        const parsed: ServiceAutomationBot[] = JSON.parse(storedBots);
        const existingIds = new Set(parsed.map(b => b.id));
        setAutomationBots([...parsed, ...INITIAL_AUTOMATION_BOTS.filter(b => !existingIds.has(b.id))]);
      } else {
        setAutomationBots(INITIAL_AUTOMATION_BOTS);
      }

      const legacyMockDirIds = new Set([
        'dir-pnb-eats', 'dir-pizza-barn', 'dir-freedom-village-store', 'dir-yankee-smokehouse',
        'dir-hobbs-tavern', 'dir-jakes-seafood', 'dir-poor-peoples-pub', 'dir-flatbread',
        'dir-sweeties', 'dir-hannaford'
      ]);

      const storedDirectory = localStorage.getItem(STORAGE_KEYS.DIRECTORY_LISTINGS);
      if (storedDirectory) {
        const parsed: DirectoryListing[] = JSON.parse(storedDirectory);
        const cleaned = parsed.filter(d => !legacyMockDirIds.has(d.id));
        const existingIds = new Set(cleaned.map(d => d.id));
        setDirectoryListings([...cleaned, ...INITIAL_DIRECTORY_LISTINGS.filter(d => !existingIds.has(d.id))]);
      } else {
        setDirectoryListings(INITIAL_DIRECTORY_LISTINGS);
      }

      const storedAffiliates = localStorage.getItem(STORAGE_KEYS.AFFILIATES);
      if (storedAffiliates) {
        const parsed: AffiliateAmbassador[] = JSON.parse(storedAffiliates);
        const existingIds = new Set(parsed.map(a => a.id));
        setAffiliates([...parsed, ...INITIAL_AFFILIATES.filter(a => !existingIds.has(a.id))]);
      } else {
        setAffiliates(INITIAL_AFFILIATES);
      }

      const storedRewards = localStorage.getItem(STORAGE_KEYS.LOYALTY_REWARDS);
      if (storedRewards) {
        const parsed: TownLoyaltyReward[] = JSON.parse(storedRewards);
        const existingIds = new Set(parsed.map(r => r.id));
        setLoyaltyRewards([...parsed, ...INITIAL_LOYALTY_REWARDS.filter(r => !existingIds.has(r.id))]);
      } else {
        setLoyaltyRewards(INITIAL_LOYALTY_REWARDS);
      }

      const storedWallet = localStorage.getItem(STORAGE_KEYS.LOYALTY_WALLET);
      if (storedWallet) {
        setLoyaltyWallet(JSON.parse(storedWallet));
      } else {
        setLoyaltyWallet(DEFAULT_USER_LOYALTY_WALLET);
      }

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) {
        const parsed: TownEvent[] = JSON.parse(storedEvents);
        const existingIds = new Set(parsed.map(e => e.id));
        setEvents([...parsed, ...INITIAL_EVENTS.filter(e => !existingIds.has(e.id))]);
      } else {
        setEvents(INITIAL_EVENTS);
      }

      const storedTickets = localStorage.getItem(STORAGE_KEYS.TABLE_TICKETS);
      if (storedTickets) {
        const parsed: DineInTableTicket[] = JSON.parse(storedTickets);
        const existingIds = new Set(parsed.map(t => t.id));
        setTableTickets([...parsed, ...INITIAL_TABLE_TICKETS.filter(t => !existingIds.has(t.id))]);
      } else {
        setTableTickets(INITIAL_TABLE_TICKETS);
      }

      const storedConditions = localStorage.getItem(STORAGE_KEYS.LOCAL_CONDITIONS);
      if (storedConditions) {
        setLocalConditions(JSON.parse(storedConditions));
      } else {
        setLocalConditions(DEFAULT_LOCAL_CONDITIONS);
      }

      const storedSmsWorkflows = localStorage.getItem(STORAGE_KEYS.SMS_WORKFLOWS);
      if (storedSmsWorkflows) {
        const parsed: SmsAutomationWorkflow[] = JSON.parse(storedSmsWorkflows);
        const existingIds = new Set(parsed.map(w => w.id));
        setSmsWorkflows([...parsed, ...INITIAL_SMS_WORKFLOWS.filter(w => !existingIds.has(w.id))]);
      } else {
        setSmsWorkflows(INITIAL_SMS_WORKFLOWS);
      }

      const storedSmsLogs = localStorage.getItem(STORAGE_KEYS.SMS_LOGS);
      if (storedSmsLogs) {
        const parsed: SmsLogMessage[] = JSON.parse(storedSmsLogs);
        const existingIds = new Set(parsed.map(l => l.id));
        setSmsLogs([...parsed, ...INITIAL_SMS_LOGS.filter(l => !existingIds.has(l.id))]);
      } else {
        setSmsLogs(INITIAL_SMS_LOGS);
      }

      const storedSmsSubscribers = localStorage.getItem(STORAGE_KEYS.SMS_SUBSCRIBERS);
      if (storedSmsSubscribers) {
        const parsed: SmsSubscriberContact[] = JSON.parse(storedSmsSubscribers);
        const existingIds = new Set(parsed.map(s => s.id));
        setSmsSubscribers([...parsed, ...INITIAL_SMS_SUBSCRIBERS.filter(s => !existingIds.has(s.id))]);
      } else {
        setSmsSubscribers(INITIAL_SMS_SUBSCRIBERS);
      }

      if (storedHardwareOrders) {
        const parsed: NfcHardwareOrder[] = JSON.parse(storedHardwareOrders);
        const existingIds = new Set(parsed.map(o => o.id));
        const merged = [...parsed, ...INITIAL_NFC_HARDWARE_ORDERS.filter(o => !existingIds.has(o.id))];
        setNfcHardwareOrders(merged);
      } else {
        setNfcHardwareOrders(INITIAL_NFC_HARDWARE_ORDERS);
      }

      if (storedRequests) {
        const parsed: WorkRequest[] = JSON.parse(storedRequests);
        const existingIds = new Set(parsed.map(r => r.id));
        const merged = [...parsed, ...INITIAL_WORK_REQUESTS.filter(r => !existingIds.has(r.id))];
        setWorkRequests(merged);
      } else {
        setWorkRequests(INITIAL_WORK_REQUESTS);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const activeTown = towns.find(t => t.id === activeTownId) || towns[0] || INITIAL_TOWNS[0];

  const setActiveTown = (townId: string) => {
    setActiveTownId(townId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TOWN_ID, townId);
  };

  const registerTown = (townData: Omit<TownNode, 'id' | 'status' | 'boutiquesCount' | 'routesCount' | 'occupancyLattice' | 'joinedDate'>) => {
    const townSlug = townData.name.toLowerCase().replace(/\s+/g, '-');
    const newTown: TownNode = {
      ...townData,
      id: `town-${townSlug}-${Date.now().toString(36)}`,
      status: 'launching',
      boutiquesCount: 1,
      routesCount: 2,
      occupancyLattice: 25,
      joinedDate: new Date().toISOString().split('T')[0],
      accentColor: townData.accentColor || '#f59e0b',
    };

    const updatedTowns = [newTown, ...towns];
    setTowns(updatedTowns);
    setActiveTown(newTown.id);
    localStorage.setItem(STORAGE_KEYS.TOWNS, JSON.stringify(updatedTowns));

    addShoutout({
      authorName: newTown.vanguardLead || `${newTown.name} Node Vanguard`,
      authorHandle: `@${townSlug}_vanguard`,
      authorAvatar: newTown.icon || '🏡',
      authorBadge: 'Town Node Launched',
      content: `🚀 New Town Node Initialized: ${newTown.fullName}! Local discovery lattice and express phone delivery dispatch are now live for ${newTown.name}.`,
      tag: 'news',
      town: newTown.fullName,
    });

    return newTown;
  };

  // Audio Chime Player
  const playDeliveryChime = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.15);
      osc.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.30);

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch (e) {
      console.log('Audio chime error:', e);
    }
  };

  // Feedback Center Handlers
  const updateFeedbackStatus = (feedbackId: string, status: PrivateFeedback['status'], replyNote?: string) => {
    const updated = feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          status,
          replyNote: replyNote !== undefined ? replyNote : fb.replyNote,
          resolvedAt: status === 'resolved' ? new Date().toISOString() : fb.resolvedAt,
        };
      }
      return fb;
    });
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  };

  const resolveFeedbackWithCoupon = (feedbackId: string, couponCode: string = 'OASIS15') => {
    const updated = feedbacks.map(fb => {
      if (fb.id === feedbackId) {
        return {
          ...fb,
          status: 'resolved' as const,
          resolutionAction: `Dispatched Win-Back ${couponCode} (15% Off) to customer contact`,
          resolvedAt: new Date().toISOString(),
        };
      }
      return fb;
    });
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
  };

  const submitGeneralFeedback = (data: Omit<PrivateFeedback, 'id' | 'timestamp' | 'status'>) => {
    const newFeedback: PrivateFeedback = {
      ...data,
      id: `fb-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      status: 'new',
      town: data.town || activeTown.fullName,
    };
    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));

    sendAppNotification({
      title: `💬 Private Customer Feedback (${data.rating}★)`,
      body: `"${data.feedbackText}" - ${data.businessName || 'Business'} (${newFeedback.town})`,
      url: `/dashboard/feedback`,
      tag: `feedback-${newFeedback.id}`,
      soundType: 'feedback'
    });

    return newFeedback;
  };

  // Social Shoutouts Handlers
  const addShoutout = (post: Omit<ShoutoutPost, 'id' | 'timestamp' | 'reactions' | 'userReactions'>) => {
    const newShoutout: ShoutoutPost = {
      ...post,
      id: `shout-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      reactions: { voltage: 1, fire: 1, heart: 1 },
      userReactions: { voltage: true },
      town: post.town || activeTown.fullName,
    };
    const updated = [newShoutout, ...shoutouts];
    setShoutouts(updated);
    localStorage.setItem(STORAGE_KEYS.SHOUTOUTS, JSON.stringify(updated));
    return newShoutout;
  };

  const reactToShoutout = (shoutoutId: string, reactionType: 'voltage' | 'fire' | 'heart') => {
    const updated = shoutouts.map(shout => {
      if (shout.id === shoutoutId) {
        const isReacted = shout.userReactions?.[reactionType];
        const newCount = (shout.reactions[reactionType] || 0) + (isReacted ? -1 : 1);
        return {
          ...shout,
          reactions: {
            ...shout.reactions,
            [reactionType]: Math.max(0, newCount),
          },
          userReactions: {
            ...shout.userReactions,
            [reactionType]: !isReacted,
          },
        };
      }
      return shout;
    });
    setShoutouts(updated);
    localStorage.setItem(STORAGE_KEYS.SHOUTOUTS, JSON.stringify(updated));
  };

  // Community Product Listing Handlers
  const addCommunityProduct = (productData: Omit<ReviewProduct, 'id' | 'rating' | 'reviewsCount' | 'inStock'>) => {
    const newProduct: ReviewProduct = {
      ...productData,
      id: `prod-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      town: productData.town || activeTown.fullName,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));

    addShoutout({
      authorName: productData.sellerName || 'Community Artisan',
      authorHandle: `@${(productData.sellerName || 'artisan').toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: '✨',
      authorBadge: 'Fresh Drop',
      content: `🎉 New Arrival dropped on Marketplace: "${productData.name}" for $${productData.price.toFixed(2)} in ${newProduct.town}! Available for express local delivery.`,
      tag: 'drop',
      town: newProduct.town,
    });

    return newProduct;
  };

  const addSeller = (sellerData: Omit<SellerProfile, 'id' | 'rating' | 'reviewsCount' | 'totalProductsCount' | 'totalDeliveriesCompleted' | 'joinedDate'>) => {
    const newSeller: SellerProfile = {
      ...sellerData,
      id: `seller-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewsCount: 1,
      totalProductsCount: 1,
      totalDeliveriesCompleted: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      town: sellerData.town || activeTown.fullName,
    };
    const updated = [newSeller, ...sellers];
    setSellers(updated);
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(updated));
    return newSeller;
  };

  // Card Handlers
  const saveCards = (newCards: NfcCardConfig[]) => {
    setCards(newCards);
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(newCards));
  };

  const addCard = (card: Omit<NfcCardConfig, 'id' | 'totalTaps' | 'googleConversions' | 'privateFeedbacksCount' | 'createdAt'>) => {
    const newCard: NfcCardConfig = {
      ...card,
      id: `card-${Date.now().toString(36)}`,
      totalTaps: 0,
      googleConversions: 0,
      privateFeedbacksCount: 0,
      createdAt: new Date().toISOString(),
      town: card.town || activeTown.fullName,
    };
    const updated = [newCard, ...cards];
    saveCards(updated);
    return newCard;
  };

  const updateCard = (id: string, updates: Partial<NfcCardConfig>) => {
    const updated = cards.map(c => c.id === id ? { ...c, ...updates } : c);
    saveCards(updated);
  };

  const deleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    saveCards(updated);
  };

  // Tap & Feedback Handlers
  const recordTap = (cardId: string, action: TapLog['action'], ratingSelected?: number) => {
    const card = cards.find(c => c.id === cardId);
    const newLog: TapLog = {
      id: `tap-${Date.now().toString(36)}`,
      cardId,
      businessName: card?.businessName || 'Demo Business',
      timestamp: new Date().toISOString(),
      device: typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'iOS' : 'Android',
      action,
      ratingSelected,
      location: card?.town || activeTown.fullName || 'Local Customer Beacon'
    };

    const updatedLogs = [newLog, ...tapLogs];
    setTapLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updatedLogs));

    if (card) {
      const updatedCard: NfcCardConfig = {
        ...card,
        totalTaps: (card.totalTaps || 0) + 1,
        googleConversions: action === 'google_redirect' || action === 'direct_redirect' ? (card.googleConversions || 0) + 1 : card.googleConversions,
        privateFeedbacksCount: action === 'private_feedback' ? (card.privateFeedbacksCount || 0) + 1 : card.privateFeedbacksCount,
      };
      updateCard(cardId, updatedCard);

      if (action === 'google_redirect' || action === 'direct_redirect') {
        sendAppNotification({
          title: `⚡ 5-Star Google Review Boost!`,
          body: `${card.businessName} converted a 5-star tap to Google Reviews in ${card.assignedLocation || card.town}!`,
          url: `/dashboard/analytics`,
          tag: `tap-${cardId}`,
          soundType: 'tap'
        });
      }
    }
  };

  const submitFeedback = (cardId: string, rating: number, feedbackText: string, customerInfo?: { name?: string; phone?: string; email?: string }) => {
    const card = cards.find(c => c.id === cardId);
    const newFeedback: PrivateFeedback = {
      id: `fb-${Date.now().toString(36)}`,
      cardId,
      businessName: card?.businessName || 'Demo Business',
      timestamp: new Date().toISOString(),
      rating,
      category: 'experience',
      customerName: customerInfo?.name,
      customerPhone: customerInfo?.phone,
      customerEmail: customerInfo?.email,
      feedbackText,
      status: 'new',
      town: card?.town || activeTown.fullName,
    };

    const updated = [newFeedback, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(updated));
    recordTap(cardId, 'private_feedback', rating);

    sendAppNotification({
      title: `💬 New Customer Feedback (${rating}★)`,
      body: `"${feedbackText}" - ${card?.businessName || 'Store'}`,
      url: `/dashboard/feedback`,
      tag: `feedback-${newFeedback.id}`,
      soundType: 'feedback'
    });
  };

  // Cart Handlers
  const addToCart = (product: ReviewProduct, options?: { color?: string; businessName?: string; logoUrl?: string }) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.selectedColor === options?.color && item.customBusinessName === options?.businessName);
      let nextCart;
      if (existing) {
        nextCart = prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        nextCart = [...prev, {
          product,
          quantity: 1,
          selectedColor: options?.color || product.colorOptions?.[0],
          customBusinessName: options?.businessName,
          customLogoUrl: options?.logoUrl
        }];
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
      return nextCart;
    });
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    setCart(prev => {
      let nextCart;
      if (quantity <= 0) {
        nextCart = prev.filter((_, i) => i !== index);
      } else {
        nextCart = prev.map((item, i) => i === index ? { ...item, quantity } : item);
      }
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(nextCart));
      return nextCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  };

  // Delivery & Notification Handlers
  const updateNotificationSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...notificationSettings, ...newSettings };
    setNotificationSettings(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(updated));
  };

  const placeDeliveryOrder = async (orderData: Omit<DeliveryOrder, 'id' | 'orderNumber' | 'createdAt' | 'status' | 'notifiedPhone' | 'notificationLog'>) => {
    const orderNumber = Math.floor(100 + Math.random() * 900).toString();
    const newOrder: DeliveryOrder = {
      ...orderData,
      id: `ord-${orderNumber}`,
      orderNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '25-35 mins',
      notifiedPhone: true,
      notificationLog: 'Relayed to merchant phone & dispatch network',
      town: orderData.town || activeTown.fullName,
    };

    const updated = [newOrder, ...deliveryOrders];
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));

    if (notificationSettings.enableSoundChime) {
      playDeliveryChime();
    }

    sendAppNotification({
      title: `🚚 New Delivery Order #${newOrder.orderNumber}!`,
      body: `${newOrder.customerName} ordered from ${newOrder.restaurantName || newOrder.pickupStoreName || 'Local Store'} ($${newOrder.total.toFixed(2)}) - ${newOrder.town || 'Carroll County'}`,
      url: `/dashboard/delivery`,
      tag: `order-${newOrder.id}`,
      soundType: 'order'
    });

    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder, settings: notificationSettings }),
      });
    } catch (e) {
      console.error('Failed to notify backend', e);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: DeliveryOrder['status']) => {
    const updated = deliveryOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status,
          deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt,
        };
      }
      return order;
    });
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));
  };

  const subscribeMembership = (
    tier: MembershipTier,
    billingCycle: 'monthly' | 'annual',
    memberName: string,
    memberTown: string,
    memberEmail?: string
  ): UserMembership => {
    const priceMap: Record<MembershipTier, { monthly: number; annual: number; name: string; perks: string[]; badge: string; emoji: string }> = {
      free: {
        monthly: 0,
        annual: 0,
        name: 'Guest Citizen',
        perks: ['Browse public marketplace', 'View community shoutouts'],
        badge: 'Guest',
        emoji: '🌱',
      },
      citizen: {
        monthly: 9,
        annual: 86,
        name: 'Town Citizen Pass',
        perks: ['10% Off all marketplace orders', 'Verified Citizen badge on community wire', 'Exclusive town drops access', 'Support local couriers'],
        badge: 'Verified Citizen',
        emoji: '🌟',
      },
      merchant_pro: {
        monthly: 29,
        annual: 278,
        name: 'Merchant Pro Beacon',
        perks: ['Unlimited NFC card beacon fleet', 'Direct Phone & Telegram delivery notification relay', 'Negative review shield protection', 'Printable high-res QR stands', 'Priority courier dispatch'],
        badge: 'Pro Merchant',
        emoji: '⚡',
      },
      vanguard_master: {
        monthly: 79,
        annual: 758,
        name: 'Town Vanguard Master',
        perks: ['Official Town Node territory rights', 'Multi-shop batch review scanner & flasher', 'Printable merchant onboarding kits', 'Revenue share on local deliveries', 'Master Vanguard Badge'],
        badge: 'Vanguard Master',
        emoji: '👑',
      },
    };

    const details = priceMap[tier];
    const renewDate = new Date();
    if (billingCycle === 'monthly') {
      renewDate.setMonth(renewDate.getMonth() + 1);
    } else {
      renewDate.setFullYear(renewDate.getFullYear() + 1);
    }

    const newMembership: UserMembership = {
      tier,
      tierName: details.name,
      active: true,
      memberId: `OASIS-${tier.toUpperCase().substring(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      memberName: memberName.trim() || 'Town Member',
      memberEmail: memberEmail?.trim(),
      memberTown: memberTown || activeTown.fullName,
      joinedDate: new Date().toISOString().split('T')[0],
      renewsAt: renewDate.toISOString().split('T')[0],
      billingCycle,
      price: billingCycle === 'monthly' ? details.monthly : details.annual,
      perks: details.perks,
      avatarEmoji: details.emoji,
      customBadge: details.badge,
    };

    setUserMembership(newMembership);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(newMembership));

    addShoutout({
      authorName: newMembership.memberName,
      authorHandle: `@${newMembership.memberName.toLowerCase().replace(/\s+/g, '_')}`,
      authorAvatar: newMembership.avatarEmoji || '🌟',
      authorBadge: newMembership.customBadge,
      content: `🎉 Just subscribed to the ${newMembership.tierName} for ${newMembership.memberTown}! Excited to support our local decentralized node network.`,
      tag: 'news',
      town: newMembership.memberTown,
    });

    return newMembership;
  };

  const cancelMembership = () => {
    const cancelled: UserMembership = {
      ...userMembership,
      active: false,
      tier: 'free',
      tierName: 'Guest Citizen',
    };
    setUserMembership(cancelled);
    localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(cancelled));
  };

  // Storefront & Business Website Methods
  const createStorefront = (data: Omit<MerchantStorefront, 'id' | 'createdAt'>): MerchantStorefront => {
    const newStorefront: MerchantStorefront = {
      ...data,
      id: `sf-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    const updatedStorefronts = [newStorefront, ...storefronts];
    setStorefronts(updatedStorefronts);
    localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(updatedStorefronts));

    // If listing on marketplace, auto-sync products and seller profile
    if (newStorefront.listOnMarketplace) {
      // 1. Add Seller Profile
      const newSeller: SellerProfile = {
        id: `seller-${newStorefront.slug}`,
        name: newStorefront.businessName,
        handle: `@${newStorefront.slug.replace(/-/g, '_')}`,
        role: newStorefront.tagline,
        bio: newStorefront.description,
        town: `${newStorefront.town}, ${newStorefront.state}`,
        rating: newStorefront.googleRating || 5.0,
        reviewsCount: newStorefront.reviewsCount || 1,
        avatar: newStorefront.logoEmoji || '🏪',
        badge: 'Verified Merchant',
        phone: newStorefront.phone,
        email: newStorefront.email,
        isVerified: true,
        totalProductsCount: newStorefront.products.length,
        totalDeliveriesCompleted: 0,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setSellers(prev => [newSeller, ...prev]);

      // 2. Add products
      const newReviewProducts: ReviewProduct[] = newStorefront.products.map(p => ({
        id: `prod-${p.id}`,
        name: p.name,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        subtitle: p.description.substring(0, 50),
        description: p.description,
        price: p.price,
        rating: 5.0,
        reviewsCount: 1,
        category: 'food',
        features: ['Fresh Prep', 'Local Delivery Eligible', '100% Quality Guaranteed'],
        imageUrl: p.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
        inStock: p.inStock,
        sellerId: newSeller.id,
        sellerName: newStorefront.businessName,
        sellerPhone: newStorefront.phone,
        town: `${newStorefront.town}, ${newStorefront.state}`,
        badge: p.badge,
      }));
      setProducts(prev => [...newReviewProducts, ...prev]);

      // 3. Post social wire shoutout
      addShoutout({
        authorName: newStorefront.businessName,
        authorHandle: `@${newStorefront.slug.replace(/-/g, '_')}`,
        authorAvatar: newStorefront.logoEmoji || '🏪',
        authorBadge: 'New Storefront Live',
        content: `🎉 ${newStorefront.businessName} just launched their standalone delivery website & marketplace storefront in ${newStorefront.town}! Order delivery directly to your phone.`,
        tag: 'drop',
        town: `${newStorefront.town}, ${newStorefront.state}`,
      });
    }

    return newStorefront;
  };

  const updateStorefront = (id: string, updates: Partial<MerchantStorefront>) => {
    const updated = storefronts.map(sf => {
      if (sf.id === id) {
        return { ...sf, ...updates };
      }
      return sf;
    });
    setStorefronts(updated);
    localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(updated));
  };

  // Driver Tracking & Telemetry Handlers
  const updateDriverTelemetry = (updates: Partial<DriverTelemetry>) => {
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        ...updates,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const toggleDriverGpsBroadcast = () => {
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        isBroadcastingGps: !prev.isBroadcastingGps,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const setDriverActiveOrder = (activeOrderId: string | null) => {
    updateDriverTelemetry({ activeOrderId: activeOrderId || undefined });
  };

  const syncDeviceGeolocation = (coords: { latitude: number; longitude: number; speedMph?: number; heading?: number; altitude?: number }) => {
    updateDriverTelemetry({
      latitude: coords.latitude,
      longitude: coords.longitude,
      speedMph: coords.speedMph !== undefined ? coords.speedMph : driverTelemetry.speedMph,
      heading: coords.heading !== undefined ? coords.heading : driverTelemetry.heading,
      altitudeFeet: coords.altitude !== undefined ? Math.round(coords.altitude * 3.28084) : driverTelemetry.altitudeFeet,
      deviceTrackingActive: true,
      isBroadcastingGps: true,
      lastPingTimestamp: new Date().toISOString(),
    });
  };

  const toggleDriverOnline = () => {
    setDriverShift(prev => {
      const next = { ...prev, isOnline: !prev.isOnline };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });
    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        status: prev.status === 'offline' ? 'available' : 'offline',
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });
  };

  const acceptDeliveryJob = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    setDriverActiveOrder(orderId);
    updateDriverTelemetry({ status: 'en_route_store' });
    playDeliveryChime();
  };

  const completeDeliveryWithProof = (orderId: string, proof: ProofOfDelivery) => {
    const order = deliveryOrders.find(o => o.id === orderId);
    const earnedFee = order?.deliveryFee || 4.50;
    const earnedTip = order?.tip || 0;
    const totalEarned = earnedFee + earnedTip;

    const updated = deliveryOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered' as const,
          deliveredAt: new Date().toISOString(),
          proofOfDelivery: proof,
        };
      }
      return o;
    });
    setDeliveryOrders(updated);
    localStorage.setItem(STORAGE_KEYS.DELIVERY_ORDERS, JSON.stringify(updated));

    setDriverShift(prev => {
      const next = {
        ...prev,
        shiftDeliveriesCount: prev.shiftDeliveriesCount + 1,
        shiftEarningsTotal: prev.shiftEarningsTotal + totalEarned,
        shiftTipsTotal: prev.shiftTipsTotal + earnedTip,
        shiftMileageEstimate: prev.shiftMileageEstimate + 3.8,
        totalBalance: prev.totalBalance + totalEarned,
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });

    setDriverTelemetry(prev => {
      const next: DriverTelemetry = {
        ...prev,
        status: 'available',
        totalDeliveries: (prev.totalDeliveries || 0) + 1,
        activeOrderId: undefined,
        lastPingTimestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_TELEMETRY, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
  };

  const cashOutDriverEarnings = (amount: number) => {
    setDriverShift(prev => {
      const cashOutAmt = Math.min(prev.totalBalance, Math.max(0, amount));
      const next = {
        ...prev,
        totalBalance: Math.max(0, Number((prev.totalBalance - cashOutAmt).toFixed(2))),
      };
      localStorage.setItem(STORAGE_KEYS.DRIVER_SHIFT, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const addBeforeAfterShowcase = (showcaseData: Omit<BeforeAfterShowcase, 'id' | 'createdAt' | 'likesCount' | 'userLiked'>) => {
    const newShowcase: BeforeAfterShowcase = {
      ...showcaseData,
      id: `showcase-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      likesCount: 1,
      userLiked: true,
      featured: true,
    };

    setBeforeAfterShowcases(prev => {
      const next = [newShowcase, ...prev];
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newShowcase;
  };

  const likeShowcase = (id: string) => {
    setBeforeAfterShowcases(prev => {
      const next = prev.map(s => {
        if (s.id !== id) return s;
        const userLiked = !s.userLiked;
        const likesCount = (s.likesCount || 0) + (userLiked ? 1 : -1);
        return {
          ...s,
          userLiked,
          likesCount: Math.max(0, likesCount),
        };
      });
      localStorage.setItem(STORAGE_KEYS.BEFORE_AFTER_SHOWCASES, JSON.stringify(next));
      return next;
    });
  };

  const addWorkRequest = (requestData: Omit<WorkRequest, 'id' | 'createdAt' | 'quotesCount' | 'status'>) => {
    const newReq: WorkRequest = {
      ...requestData,
      id: `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      status: 'open',
      quotesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setWorkRequests(prev => {
      const next = [newReq, ...prev];
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newReq;
  };

  const updateWorkRequestStatus = (id: string, status: WorkRequest['status']) => {
    setWorkRequests(prev => {
      const next = prev.map(r => r.id === id ? { ...r, status } : r);
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });
  };

  
  // --- ADMIN NFC MENU HARDWARE METHODS ---
  const addNfcMenuProduct = (productData: Omit<NfcMenuProduct, 'id' | 'createdAt' | 'unitsSold'>) => {
    const newProd: NfcMenuProduct = {
      ...productData,
      id: `nfc-menu-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      unitsSold: 0,
      createdAt: new Date().toISOString()
    };
    setNfcMenuProducts(prev => {
      const next = [newProd, ...prev];
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newProd;
  };

  const updateNfcMenuProduct = (id: string, updates: Partial<NfcMenuProduct>) => {
    setNfcMenuProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const deleteNfcMenuProduct = (id: string) => {
    setNfcMenuProducts(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const toggleNfcMenuProductPublish = (id: string) => {
    setNfcMenuProducts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p);
      localStorage.setItem(STORAGE_KEYS.NFC_MENU_PRODUCTS, JSON.stringify(next));
      return next;
    });
  };

  const addNfcHardwareOrder = (orderData: Omit<NfcHardwareOrder, 'id' | 'createdAt'>) => {
    const newOrd: NfcHardwareOrder = {
      ...orderData,
      id: `hord-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString()
    };
    setNfcHardwareOrders(prev => {
      const next = [newOrd, ...prev];
      localStorage.setItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newOrd;
  };

  const updateNfcHardwareOrderStatus = (id: string, status: NfcHardwareOrder['status']) => {
    setNfcHardwareOrders(prev => {
      const next = prev.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem(STORAGE_KEYS.NFC_HARDWARE_ORDERS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const toggleStorefrontProductStock = (storefrontId: string, productId: string) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: sf.products.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p)
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
  };

  const updateStorefrontProductPrice = (storefrontId: string, productId: string, newPrice: number) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: sf.products.map(p => p.id === productId ? { ...p, price: Number(newPrice) } : p)
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
  };

  
  // --- MANAGED SERVICES & AUTOMATION HANDLERS ---
  const addManagedService = (pkgData: Omit<ManagedServicePackage, 'id' | 'activeSubscribersCount'>) => {
    const newPkg: ManagedServicePackage = {
      ...pkgData,
      id: `srv-${Date.now().toString(36)}`,
      activeSubscribersCount: 0,
    };
    setManagedServices(prev => {
      const next = [newPkg, ...prev];
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newPkg;
  };

  const updateManagedService = (id: string, updates: Partial<ManagedServicePackage>) => {
    setManagedServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const deleteManagedService = (id: string) => {
    setManagedServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });
  };

  const enrollClientSubscription = (subData: Omit<ClientServiceSubscription, 'id' | 'startedDate' | 'totalRevenueGenerated'>) => {
    const newSub: ClientServiceSubscription = {
      ...subData,
      id: `sub-${Date.now().toString(36)}`,
      startedDate: new Date().toISOString().split('T')[0],
      totalRevenueGenerated: subData.monthlyFee,
    };
    setClientSubscriptions(prev => {
      const next = [newSub, ...prev];
      localStorage.setItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS, JSON.stringify(next));
      return next;
    });

    // Increment package subscriber count
    setManagedServices(prev => {
      const next = prev.map(pkg => pkg.id === subData.packageId ? { ...pkg, activeSubscribersCount: (pkg.activeSubscribersCount || 0) + 1 } : pkg);
      localStorage.setItem(STORAGE_KEYS.MANAGED_SERVICES, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newSub;
  };

  const updateClientSubscriptionStatus = (id: string, status: ClientServiceSubscription['status']) => {
    setClientSubscriptions(prev => {
      const next = prev.map(s => s.id === id ? { ...s, status } : s);
      localStorage.setItem(STORAGE_KEYS.CLIENT_SUBSCRIPTIONS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const toggleAutomationBot = (id: string) => {
    setAutomationBots(prev => {
      const next = prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
      localStorage.setItem(STORAGE_KEYS.AUTOMATION_BOTS, JSON.stringify(next));
      return next;
    });
  };

  const triggerAutomationBotManual = (id: string) => {
    setAutomationBots(prev => {
      const next = prev.map(b => b.id === id ? { 
        ...b, 
        executionCount: b.executionCount + 1,
        lastExecutedAt: new Date().toISOString()
      } : b);
      localStorage.setItem(STORAGE_KEYS.AUTOMATION_BOTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const addStorefrontProduct = (storefrontId: string, product: StorefrontProduct) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: [product, ...sf.products]
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const incrementWorkRequestQuotes = (id: string) => {
    setWorkRequests(prev => {
      const next: WorkRequest[] = prev.map(r => r.id === id ? { ...r, quotesCount: (r.quotesCount || 0) + 1, status: 'quotes_received' as const } : r);
      localStorage.setItem(STORAGE_KEYS.WORK_REQUESTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const claimDirectoryListing = (id: string, claimant: { ownerName: string; email: string; phone: string }) => {
    setDirectoryListings(prev => {
      const next = prev.map(d => {
        if (d.id === id) {
          return {
            ...d,
            isClaimed: true,
            claimedBy: claimant.ownerName,
            email: claimant.email,
            phone: claimant.phone,
            verifiedBadge: true,
          };
        }
        return d;
      });
      localStorage.setItem(STORAGE_KEYS.DIRECTORY_LISTINGS, JSON.stringify(next));
      return next;
    });

    // Award bonus loyalty points for claiming
    awardLoyaltyPoints(100, `Claimed business listing: ${claimant.ownerName}`);
    playDeliveryChime();
  };

  const addDirectoryListing = (listing: Omit<DirectoryListing, 'id' | 'slug' | 'viewsCount' | 'tapsCount'>) => {
    const slug = listing.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newListing: DirectoryListing = {
      ...listing,
      id: `dir-${Date.now().toString(36)}`,
      slug,
      viewsCount: 1,
      tapsCount: 0,
    };
    setDirectoryListings(prev => {
      const next = [newListing, ...prev];
      localStorage.setItem(STORAGE_KEYS.DIRECTORY_LISTINGS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newListing;
  };

  const bulkImportDirectoryListings = (listings: Omit<DirectoryListing, 'id' | 'slug' | 'viewsCount' | 'tapsCount'>[]) => {
    const formatted: DirectoryListing[] = listings.map((l, index) => {
      const baseSlug = l.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `listing-${index}`;
      return {
        ...l,
        id: `dir-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${index}`,
        slug: `${baseSlug}-${Math.random().toString(36).slice(2, 5)}`,
        viewsCount: 1,
        tapsCount: 0,
      };
    });

    setDirectoryListings(prev => {
      const next = [...formatted, ...prev];
      localStorage.setItem(STORAGE_KEYS.DIRECTORY_LISTINGS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return formatted;
  };

  const bulkImportStorefrontProducts = (storefrontId: string, productsList: Omit<StorefrontProduct, 'id'>[]) => {
    const newProducts: StorefrontProduct[] = productsList.map((p, index) => ({
      ...p,
      id: `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${index}`,
    }));

    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === storefrontId) {
          return {
            ...sf,
            products: [...newProducts, ...sf.products],
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newProducts;
  };

  const bulkImportMarketplaceProducts = (productsList: Omit<ReviewProduct, 'id' | 'slug'>[]) => {
    const newProducts: ReviewProduct[] = productsList.map((p, index) => {
      const baseSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `item-${index}`;
      return {
        ...p,
        id: `market-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${index}`,
        slug: `${baseSlug}-${Math.random().toString(36).slice(2, 5)}`,
      };
    });

    setProducts(prev => {
      const next = [...newProducts, ...prev];
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newProducts;
  };

  const registerAffiliate = (ambassador: Omit<AffiliateAmbassador, 'id' | 'code' | 'referralsCount' | 'earnedBountyTotal' | 'pendingPayout' | 'joinedDate' | 'status'>) => {
    const code = `${ambassador.name.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5)}${Math.floor(10 + Math.random() * 90)}`;
    const newAffiliate: AffiliateAmbassador = {
      ...ambassador,
      id: `aff-${Date.now().toString(36)}`,
      code,
      referralsCount: 0,
      earnedBountyTotal: 0,
      pendingPayout: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    setAffiliates(prev => {
      const next = [newAffiliate, ...prev];
      localStorage.setItem(STORAGE_KEYS.AFFILIATES, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
    return newAffiliate;
  };

  const redeemLoyaltyReward = (rewardId: string): boolean => {
    const reward = loyaltyRewards.find(r => r.id === rewardId);
    if (!reward || loyaltyWallet.userPoints < reward.pointsCost) return false;

    const redeemCode = `REWARD-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newWallet: UserLoyaltyWallet = {
      ...loyaltyWallet,
      userPoints: loyaltyWallet.userPoints - reward.pointsCost,
      redeemedRewards: [
        {
          rewardId,
          rewardTitle: reward.title,
          code: redeemCode,
          redeemedAt: new Date().toISOString().split('T')[0],
        },
        ...loyaltyWallet.redeemedRewards,
      ]
    };

    setLoyaltyWallet(newWallet);
    localStorage.setItem(STORAGE_KEYS.LOYALTY_WALLET, JSON.stringify(newWallet));

    // Increment reward claim count
    setLoyaltyRewards(prev => {
      const next = prev.map(r => r.id === rewardId ? { ...r, claimedCount: r.claimedCount + 1 } : r);
      localStorage.setItem(STORAGE_KEYS.LOYALTY_REWARDS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return true;
  };

  const awardLoyaltyPoints = (amount: number, reason?: string) => {
    setLoyaltyWallet(prev => {
      const nextPoints = prev.userPoints + amount;
      const nextTaps = prev.lifetimeTaps + 1;
      let nextLevel = prev.level;
      let tierNum = prev.tierNumber;

      if (nextPoints >= 1000) {
        nextLevel = 'Carroll County Legend 👑';
        tierNum = 4;
      } else if (nextPoints >= 500) {
        nextLevel = 'Town Vanguard Master ⚡';
        tierNum = 3;
      } else if (nextPoints >= 200) {
        nextLevel = 'Town Vanguard Insider ⭐';
        tierNum = 2;
      }

      const nextWallet: UserLoyaltyWallet = {
        ...prev,
        userPoints: nextPoints,
        lifetimeTaps: nextTaps,
        level: nextLevel,
        tierNumber: tierNum,
      };
      localStorage.setItem(STORAGE_KEYS.LOYALTY_WALLET, JSON.stringify(nextWallet));
      return nextWallet;
    });
  };

  const rsvpToEvent = (eventId: string) => {
    setEvents(prev => {
      const next = prev.map(e => {
        if (e.id === eventId) {
          const isNowRsvpd = !e.isUserRsvpd;
          return {
            ...e,
            isUserRsvpd: isNowRsvpd,
            attendeesCount: isNowRsvpd ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1)
          };
        }
        return e;
      });
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(next));
      return next;
    });

    awardLoyaltyPoints(25, 'RSVP to Community Event');
    playDeliveryChime();
  };

  const addTownEvent = (eventData: Omit<TownEvent, 'id' | 'attendeesCount' | 'isUserRsvpd'>) => {
    const newEvent: TownEvent = {
      ...eventData,
      id: `evt-${Date.now().toString(36)}`,
      attendeesCount: 1,
      isUserRsvpd: true,
    };
    setEvents(prev => {
      const next = [newEvent, ...prev];
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(next));
      return next;
    });
    awardLoyaltyPoints(50, 'Submitted new town event');
    playDeliveryChime();
    return newEvent;
  };

  const submitDineInTableOrder = (ticketData: Omit<DineInTableTicket, 'id' | 'orderedAt' | 'status'>) => {
    const newTicket: DineInTableTicket = {
      ...ticketData,
      id: `tkt-${Date.now().toString(36)}`,
      orderedAt: new Date().toISOString(),
      status: 'new_order',
    };
    setTableTickets(prev => {
      const next = [newTicket, ...prev];
      localStorage.setItem(STORAGE_KEYS.TABLE_TICKETS, JSON.stringify(next));
      return next;
    });

    awardLoyaltyPoints(20, `Dine-In Table Order at ${ticketData.restaurantName}`);
    playDeliveryChime();
    return newTicket;
  };

  const updateTableTicketStatus = (ticketId: string, status: DineInTableTicket['status']) => {
    setTableTickets(prev => {
      const next = prev.map(t => t.id === ticketId ? { ...t, status } : t);
      localStorage.setItem(STORAGE_KEYS.TABLE_TICKETS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const importAiScannedMenu = (restaurantId: string, parsedProducts: StorefrontProduct[]) => {
    setStorefronts(prev => {
      const next = prev.map(sf => {
        if (sf.id === restaurantId) {
          return {
            ...sf,
            products: [...parsedProducts, ...sf.products]
          };
        }
        return sf;
      });
      localStorage.setItem(STORAGE_KEYS.STOREFRONTS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const toggleSmsWorkflow = (id: string) => {
    setSmsWorkflows(prev => {
      const next = prev.map(w => w.id === id ? { ...w, isActive: !w.isActive } : w);
      localStorage.setItem(STORAGE_KEYS.SMS_WORKFLOWS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const updateSmsWorkflowTemplate = (id: string, newTemplate: string) => {
    setSmsWorkflows(prev => {
      const next = prev.map(w => w.id === id ? { ...w, smsTemplate: newTemplate } : w);
      localStorage.setItem(STORAGE_KEYS.SMS_WORKFLOWS, JSON.stringify(next));
      return next;
    });
  };

  const sendManualSms = (recipientPhone: string, recipientName: string, businessName: string, messageBody: string, workflowName?: string) => {
    const newLog: SmsLogMessage = {
      id: `sms-${Date.now().toString(36)}`,
      workflowName: workflowName || 'Direct Merchant SMS',
      recipientPhone,
      recipientName,
      businessName,
      messageBody,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      cost: 0.0079,
    };
    setSmsLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(next));
      return next;
    });

    // Increment workflow count if matched
    if (workflowName) {
      setSmsWorkflows(prev => {
        const next = prev.map(w => w.name === workflowName ? { ...w, sentCount: w.sentCount + 1 } : w);
        localStorage.setItem(STORAGE_KEYS.SMS_WORKFLOWS, JSON.stringify(next));
        return next;
      });
    }

    playDeliveryChime();
    return newLog;
  };

  const broadcastSmsCampaign = (businessName: string, messageBody: string, targetTown?: string) => {
    const eligibleSubscribers = smsSubscribers.filter(s => {
      if (!s.isActive) return false;
      if (targetTown && targetTown !== 'all' && !s.town.toLowerCase().includes(targetTown.toLowerCase())) return false;
      return true;
    });

    const newLogs: SmsLogMessage[] = eligibleSubscribers.map(sub => ({
      id: `sms-blast-${Date.now().toString(36)}-${sub.id}`,
      workflowName: 'VIP SMS Broadcast Blast',
      recipientPhone: sub.phone,
      recipientName: sub.name,
      businessName,
      messageBody,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      direction: 'outbound',
      cost: 0.0079
    }));

    setSmsLogs(prev => {
      const next = [...newLogs, ...prev];
      localStorage.setItem(STORAGE_KEYS.SMS_LOGS, JSON.stringify(next));
      return next;
    });

    playDeliveryChime();
    return newLogs.length;
  };

  const addSmsSubscriber = (phone: string, name: string, town: string, source: SmsSubscriberContact['optInSource'] = 'website_vip_club') => {
    const newSub: SmsSubscriberContact = {
      id: `sub-c-${Date.now().toString(36)}`,
      phone,
      name,
      town,
      optInSource: source,
      subscribedDate: new Date().toISOString().split('T')[0],
      isActive: true,
      tags: ['VIP Member', town]
    };
    setSmsSubscribers(prev => {
      const next = [newSub, ...prev];
      localStorage.setItem(STORAGE_KEYS.SMS_SUBSCRIBERS, JSON.stringify(next));
      return next;
    });

    awardLoyaltyPoints(50, 'Joined Carroll County VIP SMS Club');
    playDeliveryChime();
    return newSub;
  };

  const loginUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    playDeliveryChime();
    return user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  };

  const authenticateUser = (identifier: string, enteredPin: string): { success: boolean; user?: UserProfile; error?: string } => {
    const cleanIdent = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');
    const cleanPin = enteredPin.trim();

    if (!cleanIdent) {
      return { success: false, error: 'Please enter your phone number or email.' };
    }
    if (!cleanPin) {
      return { success: false, error: 'Please enter your 4-6 digit Security PIN.' };
    }

    const allAccounts = [...registeredAccounts, ...PRESET_USERS];
    const foundUser = allAccounts.find(u => {
      const userDigits = u.phone.replace(/\D/g, '');
      const emailMatch = Boolean(u.email && u.email.toLowerCase() === cleanIdent);
      const phoneMatch = Boolean(cleanDigits.length >= 7 && (userDigits.includes(cleanDigits) || cleanDigits.includes(userDigits)));
      const nameMatch = Boolean(u.name.toLowerCase() === cleanIdent);
      const idMatch = Boolean(u.id.toLowerCase() === cleanIdent);
      return emailMatch || phoneMatch || nameMatch || idMatch;
    });

    if (!foundUser) {
      return { success: false, error: 'No account found matching this phone or email. Please check spelling or create a new account.' };
    }

    const expectedPin = foundUser.pin || '1234';
    if (cleanPin !== expectedPin) {
      return { success: false, error: 'Incorrect Security PIN. Unauthorized access prevented.' };
    }

    loginUser(foundUser);
    return { success: true, user: foundUser };
  };

  const registerUser = (userData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const isSean = Boolean(
      (userData.email && userData.email.trim().toLowerCase() === 'frijj555@gmail.com') ||
      (userData.phone && userData.phone.replace(/\D/g, '') === '5085070305')
    );
    const sanitizedRole: UserRole = (userData.role === 'admin' && !isSean) 
      ? 'resident' 
      : (isSean ? 'admin' : userData.role);

    const newUser: UserProfile = {
      ...userData,
      role: sanitizedRole,
      id: isSean ? 'user-sean' : `user-${Date.now().toString(36)}`,
      pin: userData.pin || (isSean ? '0305' : '1234'),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));

    setRegisteredAccounts(prev => {
      const next = [newUser, ...prev.filter(u => u.id !== newUser.id && u.phone !== newUser.phone)];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_ACCOUNTS, JSON.stringify(next));
      return next;
    });

    if (newUser.isDriver) {
      const newDriver: DeliveryDriverMember = {
        id: `driver-${Date.now().toString(36)}`,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        avatar: newUser.avatar || '🚗',
        town: newUser.town,
        state: newUser.state,
        vehicleName: 'Personal Vehicle',
        isOnline: true,
        status: 'online_ready',
        specialties: ['Express Town Delivery', 'Errand Runs'],
        rating: 5.0,
        reviewsCount: 1,
        deliveriesCompleted: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        preferredTowns: [newUser.town],
        activeShiftStart: 'Just joined today',
        hourlyRateEstimate: '$9.99 flat base',
        currentLocation: `${newUser.town}, NH`,
        canDeliverFood: true,
        canDeliverGroceries: true,
        canDeliverHardware: false,
        canDeliverFirewood: false
      };
      setDeliveryDrivers(prev => {
        const next = [newDriver, ...prev];
        localStorage.setItem(STORAGE_KEYS.DELIVERY_DRIVERS, JSON.stringify(next));
        return next;
      });
      newUser.driverMemberId = newDriver.id;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
    }

    awardLoyaltyPoints(100, 'Welcome Bonus: Joined Carroll County Hub');
    playDeliveryChime();
    return newUser;
  };

  const toggleDriverStatus = (driverId: string, customStatus?: DeliveryDriverMember['status']) => {
    setDeliveryDrivers(prev => {
      const next = prev.map(driver => {
        if (driver.id === driverId) {
          const newStatus = customStatus || (driver.status === 'online_ready' ? 'off_duty' : 'online_ready');
          const isOnline = newStatus !== 'off_duty';
          return {
            ...driver,
            status: newStatus,
            isOnline,
            activeShiftStart: isOnline ? (driver.activeShiftStart || 'Just started') : undefined
          };
        }
        return driver;
      });
      localStorage.setItem(STORAGE_KEYS.DELIVERY_DRIVERS, JSON.stringify(next));
      return next;
    });
    playDeliveryChime();
  };

  const registerAsDriver = (driverData: Omit<DeliveryDriverMember, 'id' | 'rating' | 'reviewsCount' | 'deliveriesCompleted' | 'joinedDate'>) => {
    const newDriver: DeliveryDriverMember = {
      ...driverData,
      id: `driver-${Date.now().toString(36)}`,
      rating: 5.0,
      reviewsCount: 1,
      deliveriesCompleted: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      isOnline: true,
      status: 'online_ready'
    };
    setDeliveryDrivers(prev => {
      const next = [newDriver, ...prev];
      localStorage.setItem(STORAGE_KEYS.DELIVERY_DRIVERS, JSON.stringify(next));
      return next;
    });
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        isDriver: true,
        driverMemberId: newDriver.id,
        role: 'driver'
      };
      setCurrentUser(updatedUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(updatedUser));
    }
    awardLoyaltyPoints(150, 'Registered as Verified Carroll County Delivery Driver');
    playDeliveryChime();
    return newDriver;
  };

  const checkInCheckpoint = (huntId: string, checkpointId: string, method: 'nfc' | 'qr' | 'gps_simulator' = 'nfc') => {
    const hunt = touristHunts.find(h => h.id === huntId);
    if (!hunt) return { success: false, message: 'Hunt not found' };

    const checkpoint = hunt.checkpoints.find(c => c.id === checkpointId);
    if (!checkpoint) return { success: false, message: 'Checkpoint not found' };

    const alreadyStamped = passportStamps.some(s => s.checkpointId === checkpointId);
    if (alreadyStamped) {
      return { success: false, message: 'Already stamped in your Explorer Passport!', alreadyStamped: true };
    }

    const newStamp: PassportStamp = {
      checkpointId: checkpoint.id,
      checkpointName: checkpoint.name,
      huntId: hunt.id,
      town: checkpoint.town,
      timestamp: new Date().toISOString(),
      badgeIcon: hunt.badgeIcon,
      pointsEarned: checkpoint.pointsReward,
      verifiedVia: method,
    };

    const updatedStamps = [newStamp, ...passportStamps];
    setPassportStamps(updatedStamps);
    localStorage.setItem(STORAGE_KEYS.PASSPORT_STAMPS, JSON.stringify(updatedStamps));

    // Award loyalty points
    awardLoyaltyPoints(checkpoint.pointsReward, `Explorer Check-in: ${checkpoint.name} (${checkpoint.town})`);
    playDeliveryChime();

    // Check if entire hunt completed
    const huntCheckpoints = hunt.checkpoints.map(c => c.id);
    const checkedCheckpoints = updatedStamps.filter(s => s.huntId === huntId).map(s => s.checkpointId);
    const isCompleted = huntCheckpoints.every(id => checkedCheckpoints.includes(id));

    if (isCompleted) {
      const updatedHunts = touristHunts.map(h => {
        if (h.id === huntId) {
          return { ...h, completedCount: h.completedCount + 1 };
        }
        return h;
      });
      setTouristHunts(updatedHunts);
      localStorage.setItem(STORAGE_KEYS.TOURIST_HUNTS, JSON.stringify(updatedHunts));
      awardLoyaltyPoints(100, `Completed Quest: ${hunt.title}! (+100 Bonus Points)`);
    }

    return { 
      success: true, 
      message: `Verified at ${checkpoint.name}! +${checkpoint.pointsReward} Points Earned.`,
      isCompleted,
      pointsEarned: checkpoint.pointsReward
    };
  };

  const addTouristHunt = (huntData: Omit<TouristHunt, 'id' | 'participatingCount' | 'completedCount'>) => {
    const newHunt: TouristHunt = {
      ...huntData,
      id: `hunt-${Date.now()}`,
      participatingCount: 1,
      completedCount: 0,
    };
    const updated = [newHunt, ...touristHunts];
    setTouristHunts(updated);
    localStorage.setItem(STORAGE_KEYS.TOURIST_HUNTS, JSON.stringify(updated));
    return newHunt;
  };

  const tapInStoreBeacon = (circuitId: string, spotId: string, method: 'nfc' | 'qr' | 'in_store_sim' = 'nfc') => {
    const circuit = storeHuntCircuits.find(c => c.id === circuitId);
    if (!circuit) return { success: false, message: 'Store circuit not found' };

    const spot = circuit.spots.find(s => s.id === spotId);
    if (!spot) return { success: false, message: 'Store spot not found' };

    const alreadyStamped = storeHunterStamps.some(s => s.spotId === spotId);
    if (alreadyStamped) {
      return { 
        success: true, 
        alreadyStamped: true, 
        message: `Already visited ${spot.storeName}! Mystery deal: ${spot.mysteryPerk.discountLabel}`,
        perk: spot.mysteryPerk,
        pointsEarned: 0
      };
    }

    const newStamp: StoreHunterStamp = {
      spotId: spot.id,
      storeName: spot.storeName,
      circuitId: circuit.id,
      town: spot.town,
      timestamp: new Date().toISOString(),
      badgeIcon: circuit.badgeIcon,
      pointsEarned: spot.pointsReward,
      unlockedPerk: spot.mysteryPerk,
      verifiedVia: method,
    };

    const updatedStamps = [newStamp, ...storeHunterStamps];
    setStoreHunterStamps(updatedStamps);
    localStorage.setItem(STORAGE_KEYS.STORE_HUNTER_STAMPS, JSON.stringify(updatedStamps));

    // Award loyalty points
    awardLoyaltyPoints(spot.pointsReward, `Store Hunter In-Store Beacon: ${spot.storeName} (${spot.town})`);
    playDeliveryChime();

    // Check if entire circuit completed
    const circuitSpotIds = circuit.spots.map(s => s.id);
    const checkedSpotIds = updatedStamps.filter(s => s.circuitId === circuitId).map(s => s.spotId);
    const isCompleted = circuitSpotIds.every(id => checkedSpotIds.includes(id));

    if (isCompleted) {
      const updatedCircuits = storeHuntCircuits.map(c => {
        if (c.id === circuitId) {
          return { ...c, completedHuntersCount: c.completedHuntersCount + 1 };
        }
        return c;
      });
      setStoreHuntCircuits(updatedCircuits);
      localStorage.setItem(STORAGE_KEYS.STORE_CIRCUITS, JSON.stringify(updatedCircuits));
      awardLoyaltyPoints(100, `Completed Store Trail: ${circuit.title}! (+100 Bonus Points)`);
    }

    return {
      success: true,
      alreadyStamped: false,
      message: `Mystery Deal Unlocked at ${spot.storeName}! +${spot.pointsReward} Points Earned.`,
      perk: spot.mysteryPerk,
      isCompleted,
      pointsEarned: spot.pointsReward
    };
  };

  const enrollMerchantInStoreHunt = (circuitId: string, spotData: Omit<StoreHuntSpot, 'id' | 'nfcTagId' | 'qrPayloadUrl' | 'pointsReward'>) => {
    const spotId = `spot-${Date.now()}`;
    const nfcTagId = `NFC-STORE-${Date.now()}`;
    const newSpot: StoreHuntSpot = {
      ...spotData,
      id: spotId,
      nfcTagId,
      qrPayloadUrl: `https://townraise.org/store-hunting?circuit=${circuitId}&spot=${spotId}`,
      pointsReward: 35
    };

    const updated = storeHuntCircuits.map(c => {
      if (c.id === circuitId) {
        return {
          ...c,
          spots: [...c.spots, newSpot],
          activeHuntersCount: c.activeHuntersCount + 1
        };
      }
      return c;
    });

    setStoreHuntCircuits(updated);
    localStorage.setItem(STORAGE_KEYS.STORE_CIRCUITS, JSON.stringify(updated));
    awardLoyaltyPoints(50, `Enrolled ${newSpot.storeName} in Carroll County Store Hunt Network`);
    playDeliveryChime();
    return newSpot;
  };

  return {
    towns,
    activeTown,
    activeTownId,
    setActiveTown,
    registerTown,
    products,
    sellers,
    shoutouts,
    cards,
    tapLogs,
    feedbacks,
    cart,
    deliveryOrders,
    notificationSettings,
    userMembership,
    storefronts,
    driverTelemetry,
    driverShift,
    beforeAfterShowcases,
    workRequests,
    nfcMenuProducts,
    nfcHardwareOrders,
    managedServices,
    clientSubscriptions,
    automationBots,
    directoryListings,
    affiliates,
    loyaltyRewards,
    loyaltyWallet,
    events,
    tableTickets,
    localConditions,
    smsWorkflows,
    smsLogs,
    smsSubscribers,
    currentUser,
    isAdmin: isUserAdmin(currentUser),
    registeredAccounts,
    deliveryDrivers,
    touristHunts,
    passportStamps,
    storeHuntCircuits,
    storeHunterStamps,
    isLoaded,
    addShoutout,
    reactToShoutout,
    addCommunityProduct,
    addSeller,
    addCard,
    updateCard,
    deleteCard,
    recordTap,
    submitFeedback,
    updateFeedbackStatus,
    resolveFeedbackWithCoupon,
    submitGeneralFeedback,
    addToCart,
    updateCartQuantity,
    clearCart,
    updateNotificationSettings,
    placeDeliveryOrder,
    updateOrderStatus,
    playDeliveryChime,
    subscribeMembership,
    cancelMembership,
    createStorefront,
    updateStorefront,
    updateDriverTelemetry,
    toggleDriverGpsBroadcast,
    setDriverActiveOrder,
    syncDeviceGeolocation,
    toggleDriverOnline,
    acceptDeliveryJob,
    completeDeliveryWithProof,
    cashOutDriverEarnings,
    addBeforeAfterShowcase,
    likeShowcase,
    addWorkRequest,
    updateWorkRequestStatus,
    incrementWorkRequestQuotes,
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
    claimDirectoryListing,
    addDirectoryListing,
    bulkImportDirectoryListings,
    bulkImportStorefrontProducts,
    bulkImportMarketplaceProducts,
    registerAffiliate,
    redeemLoyaltyReward,
    awardLoyaltyPoints,
    rsvpToEvent,
    addTownEvent,
    submitDineInTableOrder,
    updateTableTicketStatus,
    importAiScannedMenu,
    toggleSmsWorkflow,
    updateSmsWorkflowTemplate,
    sendManualSms,
    broadcastSmsCampaign,
    addSmsSubscriber,
    loginUser,
    logoutUser,
    registerUser,
    authenticateUser,
    toggleDriverStatus,
    registerAsDriver,
    checkInCheckpoint,
    addTouristHunt,
    tapInStoreBeacon,
    enrollMerchantInStoreHunt,
  };
}
