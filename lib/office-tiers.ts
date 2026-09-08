// Office tier progression (GDT-style)

import { OfficeTier, OfficeTierData } from './types-gdt';

export const OFFICE_TIERS: Record<OfficeTier, OfficeTierData> = {
  'garage': {
    tier: 'garage',
    displayName: 'Garage',
    unlockCash: 0,
    maxStaff: 1, // Solo founder
    maxProjects: 1,
    researchSpeed: 0.5,
    canResearch: false, // No research yet, learn by doing
    canHireSpecialists: false,
    hasCreativeLab: false
  },
  
  'first-studio': {
    tier: 'first-studio',
    displayName: 'First Studio',
    unlockCash: 250_000, // Hit this milestone to move
    maxStaff: 5,
    maxProjects: 2,
    researchSpeed: 1.0,
    canResearch: true, // Research begins!
    canHireSpecialists: false,
    hasCreativeLab: false
  },
  
  'upgraded-studio': {
    tier: 'upgraded-studio',
    displayName: 'Upgraded Studio',
    unlockCash: 1_000_000,
    unlockWeeks: 104, // ~2 years in-game (time gate like GDT Y11)
    unlockStaffCount: 4, // Must have hired people
    maxStaff: 10,
    maxProjects: 3,
    researchSpeed: 1.5,
    canResearch: true,
    canHireSpecialists: true, // Specialization unlocked
    hasCreativeLab: false
  },
  
  'large-lot': {
    tier: 'large-lot',
    displayName: 'Large Studio Lot',
    unlockCash: 5_000_000,
    unlockWeeks: 260, // ~5 years
    unlockStaffCount: 8,
    maxStaff: 20,
    maxProjects: 5,
    researchSpeed: 2.0,
    canResearch: true,
    canHireSpecialists: true,
    hasCreativeLab: true // Creative Lab for advanced research
  },
  
  'late-game': {
    tier: 'late-game',
    displayName: 'Entertainment Empire',
    unlockCash: 20_000_000,
    unlockWeeks: 520, // ~10 years
    unlockStaffCount: 15,
    maxStaff: 50,
    maxProjects: 10,
    researchSpeed: 3.0,
    canResearch: true,
    canHireSpecialists: true,
    hasCreativeLab: true
  }
};

export function canUpgradeOffice(
  currentTier: OfficeTier,
  cash: number,
  totalWeeks: number,
  staffCount: number
): { canUpgrade: boolean; nextTier: OfficeTier | null; reason?: string } {
  const tiers: OfficeTier[] = ['garage', 'first-studio', 'upgraded-studio', 'large-lot', 'late-game'];
  const currentIndex = tiers.indexOf(currentTier);
  
  if (currentIndex >= tiers.length - 1) {
    return { canUpgrade: false, nextTier: null, reason: 'Already at max tier' };
  }
  
  const nextTier = tiers[currentIndex + 1];
  const requirements = OFFICE_TIERS[nextTier];
  
  // Check cash
  if (cash < requirements.unlockCash) {
    return { 
      canUpgrade: false, 
      nextTier, 
      reason: `Need $${requirements.unlockCash.toLocaleString()} (have $${cash.toLocaleString()})` 
    };
  }
  
  // Check time gate
  if (requirements.unlockWeeks && totalWeeks < requirements.unlockWeeks) {
    const weeksNeeded = requirements.unlockWeeks - totalWeeks;
    const yearsNeeded = (weeksNeeded / 52).toFixed(1);
    return { 
      canUpgrade: false, 
      nextTier, 
      reason: `Need ${yearsNeeded} more years in business` 
    };
  }
  
  // Check staff count
  if (requirements.unlockStaffCount && staffCount < requirements.unlockStaffCount) {
    return { 
      canUpgrade: false, 
      nextTier, 
      reason: `Need ${requirements.unlockStaffCount} staff (have ${staffCount})` 
    };
  }
  
  return { canUpgrade: true, nextTier };
}

export function getOfficeTierData(tier: OfficeTier): OfficeTierData {
  return OFFICE_TIERS[tier];
}

export function getUpgradeCost(tier: OfficeTier): number {
  return OFFICE_TIERS[tier].unlockCash;
}
