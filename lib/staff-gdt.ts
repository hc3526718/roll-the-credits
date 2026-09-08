// Staff management (GDT-style Design/Tech stats)

import { StaffMember, StaffRole } from './types-gdt';

const FIRST_NAMES = [
  'Alex', 'Morgan', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake',
  'Charlie', 'Dakota', 'Ellis', 'Finley', 'Harper', 'Jamie', 'Kai', 'Logan'
];

const LAST_NAMES = [
  'Chen', 'Martinez', 'Okafor', 'Patel', 'Silva', 'Kim', 'Johnson', 'Garcia',
  'Williams', 'Brown', 'Davis', 'Miller', 'Lee', 'Thompson', 'White', 'Harris'
];

export function generateStaffMember(role: StaffRole, id: string): StaffMember {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // Role determines stat tendencies
  let design = Math.floor(Math.random() * 6) + 3; // 3-8 base
  let tech = Math.floor(Math.random() * 6) + 3;
  let speed = Math.floor(Math.random() * 6) + 3;
  let research = Math.floor(Math.random() * 5) + 2; // 2-6
  
  // Role bonuses
  if (role === 'writer') {
    design += 2; // Writers are design-focused
  } else if (role === 'director') {
    design += 1;
    tech += 1; // Directors need both
  } else if (role === 'editor' || role === 'vfx-artist') {
    tech += 2; // Technical roles
  } else if (role === 'producer') {
    research += 2; // Producers are good at research/planning
  }
  
  // Cap at 10
  design = Math.min(10, design);
  tech = Math.min(10, tech);
  speed = Math.min(10, speed);
  research = Math.min(10, research);
  
  // Salary based on stats
  const avgStat = (design + tech + speed + research) / 4;
  const baseSalary = 500;
  const salary = Math.round(baseSalary + (avgStat * 100));
  
  return {
    id,
    name: `${firstName} ${lastName}`,
    role,
    design,
    tech,
    speed,
    research,
    level: 1,
    xp: 0,
    salary,
    busy: false,
    burnout: 0
  };
}

export function createFounder(name: string): StaffMember {
  // Founder is a VFX artist (tech-focused)
  return {
    id: 'founder',
    name,
    role: 'founder',
    design: 5,
    tech: 7, // VFX background
    speed: 6,
    research: 5,
    level: 1,
    xp: 0,
    salary: 0, // Founder doesn't take salary
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
