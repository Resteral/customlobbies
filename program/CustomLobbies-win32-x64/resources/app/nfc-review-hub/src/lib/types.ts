export interface TownNode {
  id: string;
  name: string;
  state: string;
  fullName: string;
  tagline: string;
  icon: string;
  status: 'peak_flow' | 'stable' | 'launching';
  boutiquesCount: number;
  routesCount: number;
  occupancyLattice: number;
  vanguardLead: string;
  dispatchPhone: string;
  description: string;
  accentColor?: string;
  joinedDate: string;
}

export interface ReviewProduct {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  category: 'cards' | 'stands' | 'stickers' | 'bundles' | 'artisan' | 'food' | 'services';
  material?: string;
  colorOptions?: string[];
  features: string[];
  imageUrl: string;
  inStock: boolean;
  isBestSeller?: boolean;
  sellerId?: string;
  sellerName?: string;
  sellerPhone?: string;
  town?: string;
}

export interface SellerProfile {
  id: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  town: string;
  rating: number;
  reviewsCount: number;
  avatar: string;
  badge: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  totalProductsCount: number;
  totalDeliveriesCompleted: number;
  joinedDate: string;
}

export interface ShoutoutPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  tag: 'drop' | 'review' | 'news' | 'deal' | 'courier' | 'stream';
  reactions: {
    voltage: number;
    fire: number;
    heart: number;
  };
  userReactions?: { [type: string]: boolean };
  timestamp: string;
  imageUrl?: string;
  sellerId?: string;
  productLink?: string;
  town?: string;

  // Live Streamer Broadcaster Capabilities
  isLiveStream?: boolean;
  streamPlatform?: 'youtube' | 'twitch' | 'kick' | 'custom' | 'audio' | 'meta_glasses' | 'instagram' | 'facebook';
  streamUrl?: string;
  streamTitle?: string;
  streamViewerCount?: number;
  streamStartedAt?: string;
  isMetaGlassesPov?: boolean;
  povDeviceName?: string;
  povTelemetry?: {
    speedMph?: number;
    townNode?: string;
    batteryPercent?: number;
    isAwdActive?: boolean;
    audioLatencyMs?: number;
  };
}

export type NfcCardProfileType = 
  | 'digital_biz_card'
  | 'google_review_booster'
  | 'menu_tap_to_order'
  | 'loyalty_rewards'
  | 'event_vip_pass'
  | 'airbnb_wifi_plaque'
  | 'scavenger_hunt_beacon'
  | 'admin_management_pass'
  | 'custom_url';

export interface NfcCardConfig {
  id: string;
  cardName: string;
  businessName: string;
  profileType?: NfcCardProfileType;
  hardwareFormFactor?: 'pvc_card' | 'acrylic_stand' | 'keychain_fob' | 'badge_lanyard' | 'disc_sticker' | 'wood_plaque' | 'counter_mat' | 'metal_card';
  chipType?: 'NTAG213' | 'NTAG215' | 'NTAG216' | 'MifareUltralight';
  chipUid?: string;
  batchId?: string;
  notes?: string;

  // Administrative & Merchant Management Provisioning Pass
  adminAccessRole?: 'merchant' | 'driver' | 'contractor' | 'town_coordinator' | 'manager' | 'staff' | 'admin';
  adminProvisionedUser?: string;
  adminProvisionedEmail?: string;
  adminProvisionedPhone?: string;
  adminAssignedStorefrontSlug?: string;
  adminAssignedTown?: string;
  adminMagicToken?: string;
  adminPortalPermissions?: string[];
  adminDirectDashboardUrl?: string;
  adminInstructions?: string;

  // Google Review Booster
  googlePlaceId?: string;
  googleReviewUrl: string;
  yelpUrl?: string;
  tripAdvisorUrl?: string;
  mode: 'smart_funnel' | 'direct_google' | 'multi_hub';
  thresholdStars: number;

  // Digital Business Card (vCard)
  contactFullName?: string;
  contactTitle?: string;
  contactCompany?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  contactAddress?: string;
  contactLinkedIn?: string;
  contactInstagram?: string;
  contactFacebook?: string;
  contactBio?: string;

  // Restaurant / Bar Tap-to-Order Menu
  storefrontSlug?: string;
  tableNumber?: string;
  tipLinkUrl?: string;

  // Loyalty & Rewards
  loyaltyWalletId?: string;
  pointsMultiplier?: number;
  mysteryDiscountCode?: string;

  // Event & Festival VIP Pass
  eventName?: string;
  ticketTier?: 'VIP' | 'General' | 'Artist' | 'Staff' | 'All_Access';
  ticketId?: string;

  // Lakehouse & Airbnb Wi-Fi
  wifiSsid?: string;
  wifiPassword?: string;
  wifiAuthType?: 'WPA' | 'WEP' | 'nopass';
  cabinHouseGuideUrl?: string;

  // Scavenger Hunt & Mystery Beacons
  huntBeaconId?: string;
  huntSecretPerk?: string;

  // Custom Direct Target URL
  directTargetUrl?: string;
  customDestinationUrl?: string;

  // Presentation & Operations
  customHeadline?: string;
  logoUrl?: string;
  primaryColor?: string;
  assignedLocation?: string;
  assignedStaff?: string;
  active: boolean;
  totalTaps: number;
  tapsCount?: number;
  googleConversions: number;
  privateFeedbacksCount: number;
  createdAt: string;
  town?: string;
}

export interface TapLog {
  id: string;
  cardId: string;
  businessName: string;
  timestamp: string;
  device: 'iOS' | 'Android' | 'Desktop' | 'Other';
  action: 'google_redirect' | 'private_feedback' | 'multi_hub_view' | 'direct_redirect';
  ratingSelected?: number;
  location?: string;
}

export interface PrivateFeedback {
  id: string;
  cardId?: string;
  businessName: string;
  timestamp: string;
  rating: number;
  category?: 'experience' | 'courier' | 'product' | 'suggestion' | 'praise';
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  feedbackText: string;
  status: 'new' | 'in_progress' | 'resolved';
  replyNote?: string;
  resolutionAction?: string;
  resolvedAt?: string;
  town?: string;
}

export interface CartItem {
  product: ReviewProduct;
  quantity: number;
  selectedColor?: string;
  customBusinessName?: string;
  customLogoUrl?: string;
}

export interface ProductOptionChoice {
  id: string;
  name: string;
  priceDelta: number;
}

export interface ProductOptionGroup {
  id: string;
  title: string;
  required?: boolean;
  type: 'single' | 'multiple';
  choices: ProductOptionChoice[];
}

export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  badge?: string;
  calories?: string;
  dietaryTags?: string[];
  optionGroups?: ProductOptionGroup[];
}

export interface SelectedOption {
  groupTitle: string;
  choiceName: string;
  priceDelta: number;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  selectedOptions?: SelectedOption[];
  storeName?: string;
}

export type OrderServiceType = 'standard_delivery' | 'store_pickup' | 'prepaid_buy' | 'custom_errand';
export type PaymentMethod = 'cash_app' | 'venmo' | 'zelle' | 'paypal' | 'card' | 'cash_on_delivery';
export type PaymentStatus = 'prepaid' | 'pending_verification' | 'pay_on_delivery';

export interface DeliveryDriverInfo {
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  rating: number;
  totalDeliveries: number;
}

export interface DriverTelemetry {
  driverId: string;
  driverName: string;
  driverPhone: string;
  avatar: string;
  vehicle: string;
  rating: number;
  totalDeliveries: number;
  status: 'available' | 'en_route_store' | 'at_store' | 'in_transit' | 'arrived' | 'offline';
  latitude: number;
  longitude: number;
  heading: number; // 0-360 degrees
  speedMph: number;
  altitudeFeet: number;
  batteryPercent: number;
  isBroadcastingGps: boolean;
  lastPingTimestamp: string;
  currentRoad: string;
  activeOrderId?: string;
  deviceTrackingActive?: boolean;
}

export interface ProofOfDelivery {
  orderId: string;
  photoUrl?: string;
  dropoffLocationType: 'front_door' | 'porch' | 'handed_to_customer' | 'garage' | 'mailroom' | 'other';
  notes?: string;
  completedAt: string;
  gpsCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface DriverShiftSummary {
  isOnline: boolean;
  shiftStartTime?: string;
  shiftDeliveriesCount: number;
  shiftEarningsTotal: number;
  shiftTipsTotal: number;
  shiftMileageEstimate: number;
  totalBalance: number;
}

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  items: DeliveryItem[];
  subtotal: number;
  deliveryFee: number;
  tip: number;
  total: number;
  status: 'pending' | 'accepted' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveredAt?: string;
  notifiedPhone: boolean;
  notificationLog?: string;
  town?: string;
  restaurantName?: string;
  restaurantAddress?: string;
  orderType?: 'delivery' | 'pickup';
  serviceType?: OrderServiceType;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
  pickupStoreName?: string;
  pickupStoreAddress?: string;
  pickupOrderCode?: string;
  estimatedItemCost?: number;
  driver?: DeliveryDriverInfo;
  proofOfDelivery?: ProofOfDelivery;
}

export interface NotificationSettings {
  phoneNumber: string;
  enableSms: boolean;
  enableTwilio?: boolean;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  enableWhatsApp?: boolean;
  whatsappPhone?: string;
  whatsappApiKey?: string;
  enableTelegram: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  enableDiscord: boolean;
  discordWebhookUrl?: string;
  enableSoundChime: boolean;
}

export type MembershipTier = 'free' | 'citizen' | 'merchant_pro' | 'vanguard_master';

export interface UserMembership {
  tier: MembershipTier;
  tierName: string;
  active: boolean;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberTown: string;
  joinedDate: string;
  renewsAt: string;
  billingCycle: 'monthly' | 'annual';
  price: number;
  perks: string[];
  avatarEmoji?: string;
  customBadge?: string;
}

export type StorefrontThemePreset = 
  | 'emerald_nature' 
  | 'cyber_neon' 
  | 'amber_gold' 
  | 'rustic_artisan' 
  | 'sunset_flame' 
  | 'ocean_deep' 
  | 'minimal_slate' 
  | 'custom';

export type StorefrontHeroStyle = 
  | 'banner_cover' 
  | 'split_minimal' 
  | 'cyber_card' 
  | 'fullscreen_showcase' 
  | 'clean_header';

export interface StorefrontGalleryImage {
  id: string;
  url: string;
  title: string;
  caption?: string;
  category?: string;
}

export interface StorefrontTestimonial {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  date: string;
  source: 'google' | 'verified_tap' | 'direct';
  customerAvatar?: string;
}

export interface StorefrontFaq {
  id: string;
  question: string;
  answer: string;
}

export interface StorefrontCustomCta {
  id: string;
  label: string;
  url: string;
  icon?: string;
  style: 'primary' | 'secondary' | 'outline' | 'amber' | 'emerald' | 'courier';
}

export interface OperatingDayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface MerchantStorefront {
  id: string;
  slug: string;
  businessName: string;
  tagline: string;
  description: string;
  logoEmoji: string;
  customLogoUrl?: string;
  coverImageUrl?: string;
  phone: string;
  email?: string;
  address: string;
  town: string;
  state: string;
  accentColor: string;
  deliveryFee: number;
  minOrder: number;
  estimatedPrepTime: string;
  googlePlaceId?: string;
  googleRating: number;
  reviewsCount: number;
  googleReviewUrl?: string;
  enablePickup: boolean;
  enableDelivery: boolean;
  listOnMarketplace: boolean;
  products: StorefrontProduct[];
  isPublished: boolean;
  createdAt: string;

  // Extreme Profile Customization Fields
  themePreset?: StorefrontThemePreset;
  heroStyle?: StorefrontHeroStyle;
  customFont?: 'font-sans' | 'font-serif' | 'font-mono' | 'font-heading';
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  textColor?: string;

  // Identity & Storytelling
  foundedYear?: string;
  detailedBio?: string;
  ownerName?: string;
  ownerRole?: string;
  ownerAvatarUrl?: string;
  badges?: string[];

  // Announcement Bar
  enableAnnouncement?: boolean;
  announcementText?: string;
  announcementBgColor?: string;
  announcementTextColor?: string;
  announcementLink?: string;

  // Operating Schedule
  operatingHours?: { [day: string]: OperatingDayHours };
  statusMessage?: string;
  emergencyDispatchActive?: boolean;
  afterHoursEmergencyPhone?: string;

  // Showcase & Socials
  galleryImages?: StorefrontGalleryImage[];
  testimonials?: StorefrontTestimonial[];
  faqs?: StorefrontFaq[];
  customCtas?: StorefrontCustomCta[];

  // Social & Web Links
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  whatsappPhone?: string;
  yelpUrl?: string;
  tripAdvisorUrl?: string;

  // Coverage & Courier Operations
  serviceRadiusMiles?: number;
  coveredTowns?: string[];
  isCourierDeliveryAvailable?: boolean;
  courierNotes?: string;
  linkedNfcCardId?: string;
}

export type TradeCategory = 
  | 'landscaping'
  | 'roofing_siding'
  | 'carpentry'
  | 'painting'
  | 'cleaning'
  | 'auto_repair'
  | 'handyman'
  | 'tree_service'
  | 'masonry'
  | 'plumbing_electrical'
  | 'other';

export interface BeforeAfterShowcase {
  id: string;
  businessName: string;
  businessCategory: TradeCategory;
  projectTitle: string;
  description: string;
  town: string;
  state: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeCaption?: string;
  afterCaption?: string;
  costOrBudgetEstimate?: string;
  timeToComplete?: string;
  contactPhone: string;
  contactEmail?: string;
  websiteUrl?: string;
  googleReviewUrl?: string;
  rating?: number;
  specialOffer?: string;
  createdAt: string;
  featured?: boolean;
  likesCount?: number;
  userLiked?: boolean;
}

export interface WorkRequest {
  id: string;
  title: string;
  category: TradeCategory;
  description: string;
  town: string;
  state: string;
  budgetRange: string;
  urgency: 'emergency_today' | 'within_few_days' | 'flexible_this_month';
  requesterName: string;
  requesterPhone: string;
  requesterEmail?: string;
  addressOrNeighborhood?: string;
  beforeImageUrl?: string;
  status: 'open' | 'quotes_received' | 'in_progress' | 'completed';
  quotesCount: number;
  createdAt: string;
}

export interface ContractorQuote {
  id: string;
  requestId: string;
  contractorName: string;
  contractorPhone: string;
  estimatedPrice: number;
  message: string;
  earliestStartDate?: string;
  createdAt: string;
}

export type NfcFormFactor = 
  | 'acrylic_table_stand' 
  | 'wood_table_tent' 
  | 'pvc_table_disc' 
  | 'waitstaff_badge' 
  | 'keychain_tag' 
  | 'outdoor_drive_thru'
  | 'bar_counter_mat'
  | 'custom';

export interface NfcMenuProduct {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetRestaurantSlug: string;
  targetRestaurantName: string;
  menuUrl: string;
  tableNumber?: string;
  formFactor: NfcFormFactor;
  chipType: 'NTAG213' | 'NTAG215' | 'NTAG216';
  price: number;
  originalPrice?: number;
  inventoryCount: number;
  unitsSold: number;
  badge?: string;
  coverImageUrl: string;
  accentColor: string;
  isPublished: boolean;
  features: string[];
  dimensions?: string;
  material?: string;
  includesStandTent?: boolean;
  createdAt: string;
}

export interface NfcHardwareOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail?: string;
  buyerBusinessName?: string;
  deliveryAddress: string;
  productId: string;
  productTitle: string;
  formFactor: NfcFormFactor;
  targetRestaurantName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'pending_flash' | 'programmed_qa' | 'in_transit' | 'delivered';
  programmedUrl: string;
  tableAssignments?: string[];
  chipType: 'NTAG213' | 'NTAG215' | 'NTAG216';
  createdAt: string;
  paidStatus: 'paid' | 'pay_on_delivery';
}

export type ServiceCategory = 
  | 'reputation_reviews' 
  | 'digital_menus_ordering' 
  | 'airbnb_concierge' 
  | 'courier_errand_retainer' 
  | 'contractor_marketing' 
  | 'hardware_management' 
  | 'custom_automation';

export interface ManagedServicePackage {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ServiceCategory;
  monthlyPrice: number;
  setupFee?: number;
  badge?: string;
  popular?: boolean;
  includedDeliverables: string[];
  automationsIncluded: string[];
  recommendedFor: string;
  iconEmoji: string;
  accentColor: string;
  activeSubscribersCount: number;
  isPublished: boolean;
  contractTerm: 'monthly' | 'quarterly' | 'annual';
}

export interface ClientServiceSubscription {
  id: string;
  clientBusinessName: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  town: string;
  packageId: string;
  packageName: string;
  monthlyFee: number;
  status: 'active' | 'trial' | 'paused' | 'cancelled';
  nextBillingDate: string;
  startedDate: string;
  automationsActive: boolean;
  notes?: string;
  totalRevenueGenerated: number;
}

export interface ServiceAutomationBot {
  id: string;
  title: string;
  category: ServiceCategory;
  description: string;
  triggerEvent: string;
  actionOutput: string;
  isActive: boolean;
  executionCount: number;
  lastExecutedAt?: string;
  iconEmoji: string;
}

export type DirectoryCategory = 
  | 'dining_bars' 
  | 'trades_contractors' 
  | 'lodging_cabins' 
  | 'auto_marine' 
  | 'health_wellness' 
  | 'retail_artisan' 
  | 'professional_services';

export interface DirectoryListing {
  id: string;
  name: string;
  slug: string;
  category: DirectoryCategory;
  categoryLabel: string;
  town: string;
  state: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  googleRating: number;
  reviewCount: number;
  isClaimed: boolean;
  claimedBy?: string;
  verifiedBadge: boolean;
  nfcEnabled: boolean;
  offersDelivery: boolean;
  coverImage: string;
  description: string;
  featuredDeal?: string;
  viewsCount: number;
  tapsCount: number;
  nfcCardId?: string;
  tags: string[];
}

export interface AffiliateAmbassador {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  town: string;
  referralsCount: number;
  earnedBountyTotal: number;
  pendingPayout: number;
  joinedDate: string;
  status: 'active' | 'pending_review';
}

export interface TownLoyaltyReward {
  id: string;
  title: string;
  businessName: string;
  town: string;
  pointsCost: number;
  valueText: string;
  description: string;
  iconEmoji: string;
  claimedCount: number;
  category: 'food' | 'discount' | 'perk' | 'vip';
}

export interface UserLoyaltyWallet {
  userPoints: number;
  lifetimeTaps: number;
  reviewsWritten: number;
  level: string;
  tierNumber: number;
  redeemedRewards: {
    rewardId: string;
    rewardTitle: string;
    code: string;
    redeemedAt: string;
  }[];
}

export interface TownEvent {
  id: string;
  title: string;
  organizer: string;
  town: string;
  venueAddress: string;
  date: string;
  time: string;
  category: 'live_music' | 'market_fair' | 'food_drink' | 'community' | 'outdoors';
  categoryLabel: string;
  description: string;
  coverImage: string;
  attendeesCount: number;
  isUserRsvpd?: boolean;
  nfcPassActive: boolean;
  pointsReward: number;
  priceText: string;
  ticketLink?: string;
  tags: string[];
}

export interface DineInTableTicket {
  id: string;
  tableNumber: string;
  restaurantId: string;
  restaurantName: string;
  customerName: string;
  customerPhone?: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    notes?: string;
  }[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: 'new_order' | 'in_kitchen' | 'served' | 'paid_closed';
  paidStatus: 'paid_card' | 'pay_at_table';
  orderedAt: string;
  kitchenNotes?: string;
}

export interface LocalConditionsReport {
  town: string;
  temperatureF: number;
  condition: string;
  iconEmoji: string;
  lakeOssipeeTempF: number;
  lakeStatus: string;
  mountainForecast: string;
  courierRoadStatus: 'roads_clear_rapid' | 'light_traffic' | 'winter_caution';
  activeDriverCount: number;
  lastUpdated: string;
}

export type SmsWorkflowCategory = 
  | 'missed_call_textback' 
  | 'review_booster' 
  | 'table_ready' 
  | 'airbnb_checkin' 
  | 'vip_broadcast' 
  | 'appointment_reminder' 
  | 'contractor_lead';

export interface SmsAutomationWorkflow {
  id: string;
  name: string;
  category: SmsWorkflowCategory;
  categoryLabel: string;
  description: string;
  triggerEvent: string;
  smsTemplate: string;
  isActive: boolean;
  sentCount: number;
  replyCount: number;
  targetBusinessId?: string;
  targetBusinessName: string;
  delayMinutes: number;
  iconEmoji: string;
  monthlyValueToMerchant: number;
}

export interface SmsLogMessage {
  id: string;
  workflowId?: string;
  workflowName: string;
  recipientPhone: string;
  recipientName: string;
  businessName: string;
  messageBody: string;
  status: 'delivered' | 'queued' | 'replied' | 'failed';
  timestamp: string;
  direction: 'outbound' | 'inbound';
  cost: number;
}

export interface SmsSubscriberContact {
  id: string;
  phone: string;
  name: string;
  town: string;
  optInSource: 'nfc_tap' | 'online_checkout' | 'website_vip_club' | 'in_store';
  subscribedDate: string;
  isActive: boolean;
  tags: string[];
}

export type UserRole = 'driver' | 'resident' | 'merchant' | 'contractor' | 'admin';

export interface DeliveryDriverMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  town: string;
  state: string;
  vehicleName: string;
  vehiclePlate?: string;
  isOnline: boolean;
  status: 'online_ready' | 'on_delivery' | 'off_duty';
  specialties: string[];
  rating: number;
  reviewsCount: number;
  deliveriesCompleted: number;
  joinedDate: string;
  preferredTowns: string[];
  activeShiftStart?: string;
  hourlyRateEstimate?: string;
  currentLocation?: string;
  canDeliverFood: boolean;
  canDeliverGroceries: boolean;
  canDeliverHardware: boolean;
  canDeliverFirewood: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin?: string;
  role: UserRole;
  avatar: string;
  town: string;
  state: string;
  badge: string;
  isDriver: boolean;
  driverMemberId?: string;
  createdAt: string;
}

export interface AuthSession {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
}

export interface HuntCheckpoint {
  id: string;
  name: string;
  town: string;
  category: 'historic' | 'scenic' | 'food_drink' | 'bridge' | 'nature' | 'artisan';
  description: string;
  historicalNote: string;
  clue: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  pointsReward: number;
  nfcTagId: string;
  qrPayloadUrl: string;
  photoUrl: string;
  sponsorName?: string;
  sponsorOffer?: string;
}

export interface TouristHunt {
  id: string;
  title: string;
  slug: string;
  town: string;
  region: string;
  badgeName: string;
  badgeIcon: string;
  difficulty: 'Easy' | 'Moderate' | 'Adventurous';
  estimatedDuration: string;
  description: string;
  theme: string;
  coverImage: string;
  totalPoints: number;
  bonusVoucherTitle: string;
  bonusVoucherCode: string;
  bonusVoucherDiscount: string;
  checkpoints: HuntCheckpoint[];
  participatingCount: number;
  completedCount: number;
}

export interface PassportStamp {
  checkpointId: string;
  checkpointName: string;
  huntId: string;
  town: string;
  timestamp: string;
  badgeIcon: string;
  pointsEarned: number;
  verifiedVia: 'nfc' | 'qr' | 'gps_simulator';
}

export interface StoreMysteryPerk {
  discountLabel: string;
  discountDescription: string;
  voucherCode: string;
  minimumSpend?: string;
  expiresInDays: number;
}

export interface StoreHuntSpot {
  id: string;
  storeName: string;
  town: string;
  category: 'antiques' | 'farmstand' | 'bakery' | 'crafts' | 'outfitter' | 'cafe' | 'mercantile';
  categoryLabel: string;
  address: string;
  phone: string;
  hours: string;
  tagline: string;
  description: string;
  coverImage: string;
  nfcTagId: string;
  qrPayloadUrl: string;
  mysteryPerk: StoreMysteryPerk;
  pointsReward: number;
  isCourierAvailable: boolean;
  courierLeadTime?: string;
  ownerName: string;
}

export interface StoreHuntCircuit {
  id: string;
  title: string;
  slug: string;
  category: 'antiques' | 'farmstands' | 'trades_outfitters' | 'sweets_coffee' | 'mercantile';
  categoryLabel: string;
  region: string;
  townsCovered: string[];
  badgeName: string;
  badgeIcon: string;
  description: string;
  theme: string;
  coverImage: string;
  totalPoints: number;
  circuitBonusReward: string;
  circuitBonusCode: string;
  circuitBonusDiscount: string;
  spots: StoreHuntSpot[];
  activeHuntersCount: number;
  completedHuntersCount: number;
}

export interface StoreHunterStamp {
  spotId: string;
  storeName: string;
  circuitId: string;
  town: string;
  timestamp: string;
  badgeIcon: string;
  pointsEarned: number;
  unlockedPerk: StoreMysteryPerk;
  verifiedVia: 'nfc' | 'qr' | 'in_store_sim';
}

export interface CardLevelProgression {
  currentLevel: number;
  levelTitle: string;
  badgeIcon: string;
  currentXp: number;
  xpForNextLevel: number;
  xpProgressPercent: number;
  multiplier: number;
  cardSkin: 'bronze' | 'emerald' | 'gold' | 'sapphire' | 'holographic_diamond';
  tierColor: string;
  perksUnlocked: string[];
  nextPerkPreview: string;
  storeStreakCount: number;
  streakMultiplier: number;
  totalStoresVisited: number;
  townsVisited: string[];
}

export interface LevelTierConfig {
  level: number;
  title: string;
  badgeIcon: string;
  minXp: number;
  maxXp: number;
  multiplier: number;
  cardSkin: 'bronze' | 'emerald' | 'gold' | 'sapphire' | 'holographic_diamond';
  tierColor: string;
  perks: string[];
}

export interface TreasureMilestoneReward {
  id: string;
  requiredCheckpoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'master_sovereign';
  title: string;
  description: string;
  rewardType: 'voucher' | 'xp' | 'bounty_credit' | 'physical_fob' | 'society_relic';
  rewardValue: string;
  rewardCode?: string;
  iconEmoji: string;
  isClaimed?: boolean;
}

export interface SocietyMemberProfile {
  id: string;
  alias: string;
  chapter: string;
  rank: 'Novice Scout' | 'Trail Pioneer' | 'Town Vanguard' | 'Master Cryptographer' | 'Grand Sovereign';
  rankLevel: number;
  xp: number;
  totalCheckpointsClaimed: number;
  bountiesEarnedTotal: number;
  badges: string[];
  joinedDate: string;
  avatarEmoji: string;
  nfcPassId: string;
}

export interface SocietyCommunityBounty {
  id: string;
  title: string;
  category: 'community_coop' | 'secret_cipher' | 'speedrun' | 'artisan_patron';
  description: string;
  targetCount: number;
  currentProgress: number;
  rewardSummary: string;
  expiresIn: string;
  iconEmoji: string;
  isCompleted: boolean;
}

export interface SocietyCipherRiddle {
  id: string;
  title: string;
  town: string;
  riddle: string;
  encodedClue: string;
  locationHint: string;
  solutionPasscode: string;
  associatedBeaconTagId: string;
  xpReward: number;
  bountyRewardText: string;
  isSolved?: boolean;
}
