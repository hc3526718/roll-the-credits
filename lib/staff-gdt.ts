// Staff management (GDT-style Design/Tech stats)

import { StaffMember, StaffRole } from './types-gdt';

const FIRST_NAMES = [
  'Alex', 'Morgan', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake',
  'Charlie', 'Dakota', 'Ellis', 'Finley', 'Harper', 'Jamie', 'Kai', 'Logan',
  'Taylor', 'Cameron', 'Reese', 'Sage', 'River', 'Phoenix', 'Rowan', 'Skylar'
];

const LAST_NAMES = [
  'Chen', 'Martinez', 'Okafor', 'Patel', 'Silva', 'Kim', 'Johnson', 'Garcia',
  'Williams', 'Brown', 'Davis', 'Miller', 'Lee', 'Thompson', 'White', 'Harris',
  'Rodriguez', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'Martin'
];

// Track used names to ensure uniqueness
const usedNames = new Set<string>();

export function generateStaffMember(role: StaffRole, id: string): StaffMember {
  let firstName, lastName, fullName;
  let attempts = 0;
  
  // Generate unique name (try up to 100 times)
  do {
    firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    fullName = `${firstName} ${lastName}`;
    attempts++;
    
    // Fallback: append number if we can't find unique combination
    if (attempts > 100) {
      fullName = `${firstName} ${lastName} ${Math.floor(Math.random() * 999)}`;
      break;
    }
  } while (usedNames.has(fullName));
  
  usedNames.add(fullName);
  
  // Owner Design attributes (3-8 base)
  let craft = Math.floor(Math.random() * 6) + 3;
  let taste = Math.floor(Math.random() * 6) + 3;
  let speed = Math.floor(Math.random() * 6) + 3;
  let reliability = Math.floor(Math.random() * 6) + 3;
  let network = Math.floor(Math.random() * 5) + 2; // 2-6
  let rep = Math.floor(Math.random() * 5) + 2;
  let research = Math.floor(Math.random() * 5) + 2;
  
  // Role bonuses
  if (role === 'writer' || role === 'director') {
    taste += 2; // Creative roles
    craft += 1;
  } else if (role === 'editor' || role === 'vfx-artist') {
    craft += 2; // Technical roles
    taste += 1;
  } else if (role === 'producer') {
    network += 2;
    reliability += 1;
    research += 2;
  }
  
  // Cap at 10
  craft = Math.min(10, craft);
  taste = Math.min(10, taste);
  speed = Math.min(10, speed);
  reliability = Math.min(10, reliability);
  network = Math.min(10, network);
  rep = Math.min(10, rep);
  research = Math.min(10, research);
  
  // Legacy GDT stats
  const design = Math.floor((craft + taste) / 2);
  const tech = craft;
  
  // Cost based on stats and rep
  const avgStat = (craft + taste + speed + reliability + network + rep) / 6;
  const baseCost = 500;
  const cost = Math.round(baseCost + (avgStat * 150) + (rep * 200));
  
  return {
    id,
    name: fullName,
    role,
    craft,
    taste,
    speed,
    reliability,
    network,
    rep,
    cost,
    design,
    tech,
    research,
    level: 1,
    xp: 0,
    salary: cost,
    busy: false,
    burnout: 0
  };
}

export function createFounder(name: string): StaffMember {
  // Founder is a VFX artist (craft-focused per Owner Design)
  return {
    id: 'founder',
    name,
    role: 'founder',
    craft: 7,        // VFX artist = strong craft
    taste: 5,        // Decent creative sense
    speed: 6,        // Good pace
    reliability: 8,  // Founder is committed
    network: 3,      // Just starting out
    rep: 2,          // Unknown
    cost: 0,         // Founder doesn't take salary
    design: 6,       // Legacy: (craft + taste) / 2
    tech: 7,         // Legacy: = craft
    research: 5,
    level: 1,
    xp: 0,
    salary: 0,
    busy: false,
    burnout: 0
  };
}

export function getXPForLevel(level: number): number {
  // XP needed for next level
  return 100 * level;
}

export function addXP(staff: StaffMember, xp: number): StaffMember {
  let newXP = staff.xp + xp;
  let newLevel = staff.level;
  
  // Check for level up (max level 5)
  while (newLevel < 5 && newXP >= getXPForLevel(newLevel)) {
    newXP -= getXPForLevel(newLevel);
    newLevel += 1;
  }
  
  // Level up stat bonuses
  let newDesign = staff.design;
  let newTech = staff.tech;
  let newSpeed = staff.speed;
  let newResearch = staff.research;
  
  if (newLevel > staff.level) {
    // On level up, boost primary stat(s)
    if (staff.role === 'writer') {
      newDesign = Math.min(10, newDesign + 1);
    } else if (staff.role === 'director') {
      newDesign = Math.min(10, newDesign + 1);
      newTech = Math.min(10, newTech + 1);
    } else if (staff.role === 'editor' || staff.role === 'vfx-artist') {
      newTech = Math.min(10, newTech + 1);
    } else if (staff.role === 'producer') {
      newResearch = Math.min(10, newResearch + 1);
    }
    
    newSpeed = Math.min(10, newSpeed + 1);
  }
  
  return {
    ...staff,
    xp: newXP,
    level: newLevel,
    design: newDesign,
    tech: newTech,
    speed: newSpeed,
    research: newResearch
  };
}

export function addBurnout(staff: StaffMember, amount: number): StaffMember {
  return {
    ...staff,
    burnout: Math.min(100, Math.max(0, staff.burnout + amount))
  };
}

export function reduceBurnout(staff: StaffMember, amount: number): StaffMember {
  return addBurnout(staff, -amount);
}

export function needsVacation(staff: StaffMember): boolean {
  return staff.burnout >= 80;
}

export function canSpecialize(staff: StaffMember, studioCanHireSpecialists: boolean): boolean {
  return studioCanHireSpecialists && staff.level >= 3 && !staff.specialization;
}

export function specializeStaff(
  staff: StaffMember,
  specialization: 'Story' | 'Visuals' | 'Sound' | 'Marketing' | 'Research'
): StaffMember {
  const updated = { ...staff, specialization };
  
  // Specialization boosts relevant stat by 2
  switch (specialization) {
    case 'Story':
      updated.design = Math.min(10, updated.design + 2);
      break;
    case 'Visuals':
      updated.tech = Math.min(10, updated.tech + 2);
      break;
    case 'Sound':
      updated.tech = Math.min(10, updated.tech + 1);
      updated.design = Math.min(10, updated.design + 1);
      break;
    case 'Marketing':
      updated.design = Math.min(10, updated.design + 1);
      updated.research = Math.min(10, updated.research + 1);
      break;
    case 'Research':
      updated.research = Math.min(10, updated.research + 3);
      break;
  }
  
  return updated;
}

export function calculateWeeklyCost(staff: StaffMember[]): number {
  return staff.reduce((sum, s) => sum + (s.role === 'founder' ? 0 : s.salary), 0);
}

export function getAvailableStaff(staff: StaffMember[]): StaffMember[] {
  return staff.filter(s => !s.busy && s.burnout < 80);
}
