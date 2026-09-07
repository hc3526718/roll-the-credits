// Studio progression and unlock system

import { Studio, StudioUnlocks, TalentRole } from './types';

export function calculateStudioLevel(studio: Studio): number {
  // Level based on reputation, completed projects, and cash
  const repPoints = Math.floor(studio.reputation / 10);
  const projectPoints = studio.completedProjects.length;
  const cashPoints = Math.floor(studio.cash / 50000);
  
  return Math.min(10, Math.floor((repPoints + projectPoints + cashPoints) / 3));
}

export function getUnlocksForLevel(level: number, officeTier: Studio['officeTier']): StudioUnlocks {
  const baseUnlocks: StudioUnlocks = {
    maxActors: 3,
    maxSupporting: 1,
    availableRoles: ['Actor', 'Director'],
    marketingUnlocked: false,
    testScreeningsUnlocked: false,
    festivalSubmissionUnlocked: false,
    advancedTrendsUnlocked: false
  };
  
  // Level 1-2: Garage - basics only
  if (level >= 2) {
    baseUnlocks.availableRoles.push('Writer');
    baseUnlocks.maxActors = 4;
  }
  
  // Level 3-4: Small office - expand crew
  if (level >= 3) {
    baseUnlocks.availableRoles.push('Cinematographer', 'Editor');
    baseUnlocks.maxActors = 5;
    baseUnlocks.maxSupporting = 2;
  }
  
  if (level >= 4) {
    baseUnlocks.testScreeningsUnlocked = true;
  }
  
  // Level 5-6: Medium office - advanced roles
  if (level >= 5) {
    baseUnlocks.availableRoles.push('Sound Designer', 'Composer');
    baseUnlocks.maxActors = 6;
    baseUnlocks.advancedTrendsUnlocked = true;
  }
  
  if (level >= 6) {
    baseUnlocks.availableRoles.push('VFX Artist');
    baseUnlocks.marketingUnlocked = true;
    baseUnlocks.maxSupporting = 3;
  }
  
  // Level 7+: Large office - everything
  if (level >= 7) {
    baseUnlocks.availableRoles.push('Producer');
    baseUnlocks.maxActors = 8;
    baseUnlocks.festivalSubmissionUnlocked = true;
  }
  
  // Office tier modifiers
  if (officeTier === 'small') {
    baseUnlocks.maxActors += 1;
  } else if (officeTier === 'medium') {
    baseUnlocks.maxActors += 2;
    baseUnlocks.maxSupporting += 1;
  } else if (officeTier === 'large') {
    baseUnlocks.maxActors += 3;
    baseUnlocks.maxSupporting += 2;
  }
  
  return baseUnlocks;
}

export function canAffordOfficeUpgrade(studio: Studio): { canAfford: boolean; cost: number; nextTier: Studio['officeTier'] | null } {
  const upgradeCosts: Record<Studio['officeTier'], { cost: number; next: Studio['officeTier'] | null }> = {
    'garage': { cost: 150000, next: 'small' },
    'small': { cost: 500000, next: 'medium' },
    'medium': { cost: 1500000, next: 'large' },
    'large': { cost: 0, next: null }
  };
  
  const upgrade = upgradeCosts[studio.officeTier];
  return {
    canAfford: studio.cash >= upgrade.cost,
    cost: upgrade.cost,
    nextTier: upgrade.next
  };
}

export function getRoleUnlockDescription(role: TalentRole): string {
  const descriptions: Record<TalentRole, string> = {
    'Actor': 'Cast members for scenes',
    'Director': 'Oversees entire production',
    'Writer': 'Creates script in Planning stage',
    'Cinematographer': 'Camera work in Pre-production',
    'Editor': 'Cuts film in Post-production',
    'Sound Designer': 'Audio in Post-production',
    'VFX Artist': 'Visual effects in Post-production',
    'Composer': 'Music score (optional)',
    'Producer': 'Budget & logistics (optional)'
  };
  return descriptions[role] || 'Unknown role';
}

export function getRequiredLevelForRole(role: TalentRole): number {
  const requirements: Record<TalentRole, number> = {
    'Actor': 1,
    'Director': 1,
    'Writer': 2,
    'Cinematographer': 3,
    'Editor': 3,
    'Sound Designer': 5,
    'Composer': 5,
    'VFX Artist': 6,
    'Producer': 7
  };
  return requirements[role] || 1;
}
