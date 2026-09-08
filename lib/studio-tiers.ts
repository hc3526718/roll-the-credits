// Studio tier upgrade system for Roll the Credits v2

import { StudioTier, StudioTierName } from './types';

export const STUDIO_TIERS: Record<StudioTierName, StudioTier> = {
  'garage': {
    name: 'garage',
    displayName: 'Garage',
    purchaseCost: 0, // Starting tier
    capacity: 1,
    departmentSlots: 2
  },
  'small-lot': {
    name: 'small-lot',
    displayName: 'Small Lot',
    purchaseCost: 50000,
    capacity: 2,
    departmentSlots: 4
  },
  'mid-studio': {
    name: 'mid-studio',
    displayName: 'Mid Studio',
    purchaseCost: 150000,
    capacity: 3,
    departmentSlots: 6
  },
  'soundstage-campus': {
    name: 'soundstage-campus',
    displayName: 'Soundstage Campus',
    purchaseCost: 500000,
    capacity: 5,
    departmentSlots: 10
  }
};

export const TIER_ORDER: StudioTierName[] = ['garage', 'small-lot', 'mid-studio', 'soundstage-campus'];

export function getNextTier(currentTier: StudioTierName): StudioTierName | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex === -1 || currentIndex >= TIER_ORDER.length - 1) {
    return null;
  }
  return TIER_ORDER[currentIndex + 1];
}

export function canUpgradeTier(cash: number, debt: number, currentTier: StudioTierName): boolean {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return false;
  
  const netCash = cash - debt;
  const upgradeCost = STUDIO_TIERS[nextTier].purchaseCost;
  
  return netCash >= upgradeCost;
}

export function getTierUpgradeCost(currentTier: StudioTierName): number | null {
  const nextTier = getNextTier(currentTier);
  if (!nextTier) return null;
  
  return STUDIO_TIERS[nextTier].purchaseCost;
}

export function getTierInfo(tier: StudioTierName): StudioTier {
  return STUDIO_TIERS[tier];
}
