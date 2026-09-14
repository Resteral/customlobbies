import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessProfile, CustomerPass, FeedbackItem, ActiveTab } from '../types';
import { PRESET_BUSINESSES } from '../data/presets';
import confetti from 'canvas-confetti';

interface AppContextType {
  businesses: BusinessProfile[];
  currentBusiness: BusinessProfile;
  setCurrentBusiness: (b: BusinessProfile) => void;
  customerPass: CustomerPass;
  customerPasses: CustomerPass[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  feedbacks: FeedbackItem[];
  
  // Actions
  addStamps: (amount?: number, businessPin?: string) => { success: boolean; message: string; unlockedReward: boolean };
  redeemReward: (businessPin?: string) => { success: boolean; message: string };
  resetCustomerCard: () => void;
  updateBusinessProfile: (updated: BusinessProfile) => void;
  submitCustomerFeedback: (rating: number, tags: string[], comment: string, contact?: string) => void;
  resolveFeedbackItem: (id: string) => void;
  lookupPass: (query: string) => CustomerPass | null;
  createNewPassForPhone: (phone: string, name: string) => CustomerPass;
  triggerConfetti: () => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  viewMode: 'desktop' | 'mobile-preview';
  setViewMode: (mode: 'desktop' | 'mobile-preview') => void;
}

const LOCAL_STORAGE_KEY_BUSINESSES = 'perkpulse_businesses_v1';
const LOCAL_STORAGE_KEY_PASSES = 'perkpulse_passes_v1';
const LOCAL_STORAGE_KEY_FEEDBACKS = 'perkpulse_feedbacks_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Businesses
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BUSINESSES);
    return saved ? JSON.parse(saved) : PRESET_BUSINESSES;
  });

  const [currentBusiness, setCurrentBusiness] = useState<BusinessProfile>(businesses[0]);

  // 2. Customer Passes
  const [customerPasses, setCustomerPasses] = useState<CustomerPass[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PASSES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'pass-alex-1',
        businessId: 'artisan-roast',
        customerPhone: '(555) 234-5678',
        customerName: 'Alex Rivera',
        passCode: '4821',
        currentStamps: 7,
        lifetimeStamps: 23,
        rewardsAvailable: 0,
        totalRedeemed: 2,
        lastVisited: new Date().toISOString(),
        reviewPromptSeen: false,
      },
      {
        id: 'pass-sarah-2',
        businessId: 'crown-razor',
        customerPhone: '(555) 890-1234',
        customerName: 'Sarah Jenkins',
        passCode: '1092',
        currentStamps: 5,
        lifetimeStamps: 17,
        rewardsAvailable: 1,
        totalRedeemed: 2,
        lastVisited: new Date().toISOString(),
        reviewPromptSeen: true,
      },
    ];
  });

  // Current active customer pass (defaults to Alex for demo)
  const [customerPass, setCustomerPass] = useState<CustomerPass>(() => {
    return customerPasses[0] || {
      id: 'default-pass',
      businessId: currentBusiness.id,
      customerPhone: '(555) 234-5678',
      customerName: 'Alex Rivera',
      passCode: '4821',
      currentStamps: 7,
      lifetimeStamps: 23,
      rewardsAvailable: 0,
      totalRedeemed: 2,
      lastVisited: new Date().toISOString(),
      reviewPromptSeen: false,
    };
  });

  // 3. Feedbacks
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_FEEDBACKS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'fb-1',
        businessId: 'artisan-roast',
        rating: 3,
        tags: ['Wait Time', 'Seating'],
        comment: 'Coffee was incredible as usual, but the morning line was out the door and there were no clean tables.',
        customerContact: 'mark.t@example.com',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        resolved: false,
      },
      {
        id: 'fb-2',
        businessId: 'artisan-roast',
        rating: 2,
        tags: ['Pastry Selection'],
        comment: 'Almond croissants were sold out by 9:30 AM on a Saturday. Please bake more on weekends!',
        customerContact: '(555) 441-9988',
        createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
        resolved: true,
      },
    ];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('customer-card');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-preview'>('mobile-preview');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BUSINESSES, JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PASSES, JSON.stringify(customerPasses));
  }, [customerPasses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_FEEDBACKS, JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Sync pass when changing business
  useEffect(() => {
    const existing = customerPasses.find(p => p.businessId === currentBusiness.id);
    if (existing) {
      setCustomerPass(existing);
    } else {
      const newPass: CustomerPass = {
        id: `pass-${Date.now()}`,
        businessId: currentBusiness.id,
        customerPhone: '(555) 234-5678',
        customerName: 'Alex Rivera',
        passCode: String(Math.floor(1000 + Math.random() * 9000)),
        currentStamps: Math.min(2, currentBusiness.loyaltyProgram.targetStamps - 1),
        lifetimeStamps: 2,
        rewardsAvailable: 0,
        totalRedeemed: 0,
        lastVisited: new Date().toISOString(),
        reviewPromptSeen: false,
      };
      setCustomerPass(newPass);
      setCustomerPasses(prev => [...prev, newPass]);
    }
  }, [currentBusiness.id]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  // Stamp logic
  const addStamps = (amount = 1, businessPin?: string) => {
    if (businessPin && businessPin !== currentBusiness.cashierPin) {
      return { success: false, message: 'Incorrect Cashier PIN', unlockedReward: false };
    }

    const target = currentBusiness.loyaltyProgram.targetStamps;
    const newStamps = customerPass.currentStamps + amount;
    const unlockedReward = newStamps >= target;
    const remainingStamps = unlockedReward ? newStamps % target : newStamps;
    const addedRewards = unlockedReward ? Math.floor(newStamps / target) : 0;

    const updatedPass: CustomerPass = {
      ...customerPass,
      currentStamps: remainingStamps,
      lifetimeStamps: customerPass.lifetimeStamps + amount,
      rewardsAvailable: customerPass.rewardsAvailable + addedRewards,
      lastVisited: new Date().toISOString(),
    };

    setCustomerPass(updatedPass);
    setCustomerPasses(prev => prev.map(p => (p.id === updatedPass.id ? updatedPass : p)));

    // Update business stats
    setBusinesses(prev =>
      prev.map(b =>
        b.id === currentBusiness.id
          ? {
              ...b,
              stats: {
                ...b.stats,
                stampsIssued: b.stats.stampsIssued + amount,
                estimatedRevenueAdded: b.stats.estimatedRevenueAdded + amount * 7.5,
              },
            }
          : b
      )
    );

    if (unlockedReward) {
      triggerConfetti();
      // Auto open review booster modal at peak moment!
      setTimeout(() => {
        setIsReviewModalOpen(true);
      }, 700);
      return {
        success: true,
        message: `🎉 Reward Unlocked: ${currentBusiness.loyaltyProgram.rewardTitle}!`,
        unlockedReward: true,
      };
    }

    // If they reached target - 1, also celebrate close milestone
    if (remainingStamps === target - 1) {
      return {
        success: true,
        message: `🔥 Just 1 more stamp to earn your ${currentBusiness.loyaltyProgram.rewardTitle}!`,
        unlockedReward: false,
      };
    }

    return {
      success: true,
      message: `Stamp added! (${remainingStamps}/${target})`,
      unlockedReward: false,
    };
  };

  // Redeem Reward
  const redeemReward = (businessPin?: string) => {
    if (businessPin && businessPin !== currentBusiness.cashierPin) {
      return { success: false, message: 'Incorrect Cashier PIN' };
    }

    if (customerPass.rewardsAvailable <= 0) {
      return { success: false, message: 'No rewards available to redeem right now.' };
    }

    const updatedPass: CustomerPass = {
      ...customerPass,
      rewardsAvailable: customerPass.rewardsAvailable - 1,
      totalRedeemed: customerPass.totalRedeemed + 1,
    };

    setCustomerPass(updatedPass);
    setCustomerPasses(prev => prev.map(p => (p.id === updatedPass.id ? updatedPass : p)));

    // Update business stats
    setBusinesses(prev =>
      prev.map(b =>
        b.id === currentBusiness.id
          ? {
              ...b,
              stats: {
                ...b.stats,
                rewardsRedeemed: b.stats.rewardsRedeemed + 1,
              },
            }
          : b
      )
    );

    triggerConfetti();
    setTimeout(() => {
      setIsReviewModalOpen(true);
    }, 600);

    return {
      success: true,
      message: `✅ Successfully redeemed: ${currentBusiness.loyaltyProgram.rewardTitle}!`,
    };
  };

  const resetCustomerCard = () => {
    const updatedPass: CustomerPass = {
      ...customerPass,
      currentStamps: 0,
      rewardsAvailable: 0,
    };
    setCustomerPass(updatedPass);
    setCustomerPasses(prev => prev.map(p => (p.id === updatedPass.id ? updatedPass : p)));
  };

  const updateBusinessProfile = (updated: BusinessProfile) => {
    setCurrentBusiness(updated);
    setBusinesses(prev => prev.map(b => (b.id === updated.id ? updated : b)));
  };

  const submitCustomerFeedback = (rating: number, tags: string[], comment: string, contact?: string) => {
    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      businessId: currentBusiness.id,
      rating,
      tags,
      comment,
      customerContact: contact,
      createdAt: new Date().toISOString(),
      resolved: false,
    };

    setFeedbacks(prev => [newFeedback, ...prev]);

    // Update deflected count in business stats
    setBusinesses(prev =>
      prev.map(b =>
        b.id === currentBusiness.id
          ? {
              ...b,
              stats: {
                ...b.stats,
                privateFeedbackDeflected: b.stats.privateFeedbackDeflected + 1,
              },
            }
          : b
      )
    );
  };

  const resolveFeedbackItem = (id: string) => {
    setFeedbacks(prev => prev.map(f => (f.id === id ? { ...f, resolved: !f.resolved } : f)));
  };

  const lookupPass = (query: string): CustomerPass | null => {
    const clean = query.trim().toLowerCase();
    const found = customerPasses.find(
      p =>
        p.businessId === currentBusiness.id &&
        (p.passCode === clean || p.customerPhone.replace(/\D/g, '').includes(clean.replace(/\D/g, '')) || p.customerName.toLowerCase().includes(clean))
    );
    return found || null;
  };

  const createNewPassForPhone = (phone: string, name: string): CustomerPass => {
    const newPass: CustomerPass = {
      id: `pass-${Date.now()}`,
      businessId: currentBusiness.id,
      customerPhone: phone,
      customerName: name || 'Valued Customer',
      passCode: String(Math.floor(1000 + Math.random() * 9000)),
      currentStamps: 1, // First visit bonus!
      lifetimeStamps: 1,
      rewardsAvailable: 0,
      totalRedeemed: 0,
      lastVisited: new Date().toISOString(),
      reviewPromptSeen: false,
    };

    setCustomerPasses(prev => [...prev, newPass]);
    setCustomerPass(newPass);
    return newPass;
  };

  return (
    <AppContext.Provider
      value={{
        businesses,
        currentBusiness,
        setCurrentBusiness,
        customerPass,
        customerPasses,
        activeTab,
        setActiveTab,
        feedbacks,
        addStamps,
        redeemReward,
        resetCustomerCard,
        updateBusinessProfile,
        submitCustomerFeedback,
        resolveFeedbackItem,
        lookupPass,
        createNewPassForPhone,
        triggerConfetti,
        isReviewModalOpen,
        setIsReviewModalOpen,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
