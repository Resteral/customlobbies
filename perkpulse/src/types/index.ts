export type BusinessCategory = 'cafe' | 'barber' | 'restaurant' | 'spa' | 'retail' | 'fitness' | 'other';

export type StampIconType = 'coffee' | 'star' | 'scissors' | 'pizza' | 'sparkle' | 'heart' | 'flame' | 'gift';

export interface LoyaltyProgram {
  targetStamps: number;
  rewardTitle: string;
  stampIcon: StampIconType;
  terms: string;
  estimatedRewardValue: number; // e.g. $6.50
}

export interface BusinessProfile {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: BusinessCategory;
  logoEmoji: string;
  brandColor: string; // Hex e.g. #3b82f6
  accentColor: string; // Hex
  gradient: string; // Tailwind gradient classes
  googlePlaceUrl: string;
  googlePlaceName: string;
  phone: string;
  address: string;
  cashierPin: string; // 4-digit PIN for staff validation
  loyaltyProgram: LoyaltyProgram;
  stats: {
    totalCustomers: number;
    stampsIssued: number;
    rewardsRedeemed: number;
    googleReviewsRedirected: number;
    privateFeedbackDeflected: number;
    estimatedRevenueAdded: number;
  };
}

export interface CustomerPass {
  id: string;
  businessId: string;
  customerPhone: string;
  customerName: string;
  passCode: string; // 4-digit customer pass code
  currentStamps: number;
  lifetimeStamps: number;
  rewardsAvailable: number;
  totalRedeemed: number;
  lastVisited: string;
  reviewPromptSeen: boolean;
}

export interface FeedbackItem {
  id: string;
  businessId: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  customerContact?: string;
  createdAt: string;
  resolved: boolean;
}

export type ActiveTab = 'customer-card' | 'review-qr' | 'cashier-terminal' | 'dashboard' | 'qr-studio' | 'pitch-calculator';
