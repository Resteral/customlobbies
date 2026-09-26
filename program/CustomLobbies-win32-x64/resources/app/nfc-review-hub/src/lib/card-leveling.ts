import { CardLevelProgression, LevelTierConfig, StoreHunterStamp, PassportStamp } from './types';

export const LEVEL_TIERS: LevelTierConfig[] = [
  {
    level: 1,
    title: 'Novice Pioneer',
    badgeIcon: '🥉',
    minXp: 0,
    maxXp: 99,
    multiplier: 1.0,
    cardSkin: 'bronze',
    tierColor: '#cd7f32',
    perks: [
      'Base 1.0x Point Earning on all taps',
      'Carroll County Town Nodes discovery access',
      'Digital Explorer & Store Passport'
    ]
  },
  {
    level: 2,
    title: 'Town Scout',
    badgeIcon: '🌲',
    minXp: 100,
    maxXp: 299,
    multiplier: 1.1,
    cardSkin: 'emerald',
    tierColor: '#10b981',
    perks: [
      '+10% Bonus Points on all store & landmark taps (1.1x)',
      'Free local honey/maple tastings at partner farmstands',
      '5% Off Sean Martin 4x4 Courier Delivery runs'
    ]
  },
  {
    level: 3,
    title: 'Store Hunter Specialist',
    badgeIcon: '⚡',
    minXp: 300,
    maxXp: 699,
    multiplier: 1.25,
    cardSkin: 'gold',
    tierColor: '#f59e0b',
    perks: [
      '+25% Bonus Points on all taps (1.25x)',
      'Extra 5% discount stack on all in-store mystery vouchers',
      'Store Crawl Streak Multiplier (up to 1.5x on same-day store hops)',
      'Custom gold card trim & badge'
    ]
  },
  {
    level: 4,
    title: 'Master Navigator',
    badgeIcon: '💎',
    minXp: 700,
    maxXp: 1499,
    multiplier: 1.5,
    cardSkin: 'sapphire',
    tierColor: '#3b82f6',
    perks: [
      '+50% Bonus Points on all taps (1.5x)',
      'Direct 24/7 Sean Martin 4x4 Courier Hotline Priority Access',
      'VIP Fast-Track RSVP & Free Entry to Carroll County Festivals',
      'Sapphire pulse digital card skin'
    ]
  },
  {
    level: 5,
    title: 'Carroll County Legend',
    badgeIcon: '👑',
    minXp: 1500,
    maxXp: 99999,
    multiplier: 2.0,
    cardSkin: 'holographic_diamond',
    tierColor: '#ec4899',
    perks: [
      'DOUBLE Points (2.0x Multiplier) across all regional merchants!',
      'Free Town Courier Delivery Pass',
      'Exclusive Merchant Grab-Bag Gifts upon tap',
      'Custom Laser Holographic Diamond physical & digital card finish',
      'Hall of Fame name listing in Town Command'
    ]
  }
];

export function calculateCardProgression(
  storeStamps: StoreHunterStamp[] = [],
  landmarkStamps: PassportStamp[] = [],
  baseXp: number = 0
): CardLevelProgression {
  // Store stamp = 35 XP, Landmark stamp = 25 XP
  const storeXp = storeStamps.reduce((acc, s) => acc + (s.pointsEarned || 35), 0);
  const landmarkXp = landmarkStamps.reduce((acc, s) => acc + (s.pointsEarned || 25), 0);
  const totalXp = baseXp + storeXp + landmarkXp;

  // Find matching tier
  const currentTier = LEVEL_TIERS.find(t => totalXp >= t.minXp && totalXp <= t.maxXp) || LEVEL_TIERS[LEVEL_TIERS.length - 1];
  const nextTier = LEVEL_TIERS.find(t => t.level === currentTier.level + 1) || currentTier;

  const xpIntoCurrentLevel = totalXp - currentTier.minXp;
  const levelXpSpan = nextTier.level === currentTier.level ? 1000 : (currentTier.maxXp - currentTier.minXp + 1);
  const xpProgressPercent = Math.min(100, Math.max(5, Math.round((xpIntoCurrentLevel / levelXpSpan) * 100)));

  // Store streak calculation (stores visited in last 24h)
  const now = new Date().getTime();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const recentStoreStamps = storeStamps.filter(s => new Date(s.timestamp).getTime() > dayAgo);
  const storeStreakCount = recentStoreStamps.length;

  let streakMultiplier = 1.0;
  if (storeStreakCount >= 3) streakMultiplier = 1.5;
  else if (storeStreakCount >= 2) streakMultiplier = 1.2;

  // Unique towns visited
  const allTowns = new Set([
    ...storeStamps.map(s => s.town),
    ...landmarkStamps.map(s => s.town)
  ]);

  return {
    currentLevel: currentTier.level,
    levelTitle: currentTier.title,
    badgeIcon: currentTier.badgeIcon,
    currentXp: totalXp,
    xpForNextLevel: nextTier.level === currentTier.level ? totalXp : (currentTier.maxXp + 1),
    xpProgressPercent,
    multiplier: parseFloat((currentTier.multiplier * streakMultiplier).toFixed(2)),
    cardSkin: currentTier.cardSkin,
    tierColor: currentTier.tierColor,
    perksUnlocked: currentTier.perks,
    nextPerkPreview: nextTier.level === currentTier.level ? 'Max Mastery Achieved!' : nextTier.perks[0],
    storeStreakCount,
    streakMultiplier,
    totalStoresVisited: storeStamps.length,
    townsVisited: Array.from(allTowns)
  };
}
