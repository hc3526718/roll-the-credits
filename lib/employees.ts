// Employee system for Roll the Credits v2

import { Employee, Talent, TalentRole } from './types';

export function convertToEmployee(talent: Talent, weeklyWage: number): Employee {
  return {
    ...talent,
    xp: 0,
    level: 1,
    employmentType: 'employee',
    weeklyWage,
    assignedTo: undefined
  };
}

export function createFreelancer(talent: Talent): Employee {
  return {
    ...talent,
    xp: 0,
    level: Math.floor(talent.stats.skill / 2), // Freelancers start with level based on skill
    employmentType: 'freelancer',
    assignedTo: undefined
  };
}

export function calculateXPGain(projectBudget: number, projectQuality: number): number {
  // XP scales with budget tier and quality
  const budgetFactor = projectBudget / 10000; // Normalize
  const qualityFactor = projectQuality / 100;
  
  return Math.floor(100 * budgetFactor * qualityFactor);
}

export function getXPForLevel(level: number): number {
  // Each level requires more XP: 100, 250, 450, 700, 1000, etc.
  return 100 * level + 50 * level * (level - 1);
}

export function addXP(employee: Employee, xp: number): Employee {
  let newXP = employee.xp + xp;
  let newLevel = employee.level;
  let newSkill = employee.stats.skill;
  
  // Check for level up
  while (newXP >= getXPForLevel(newLevel + 1) && newLevel < 10) {
    newXP -= getXPForLevel(newLevel + 1);
    newLevel += 1;
    
    // Increase skill on level up (cap at 10)
    if (newSkill < 10) {
      newSkill = Math.min(10, newSkill + 1);
    }
  }
  
  return {
    ...employee,
    xp: newXP,
    level: newLevel,
    stats: {
      ...employee.stats,
      skill: newSkill
    }
  };
}

export function getWeeklyCostForEmployee(employee: Employee): number {
  if (employee.employmentType === 'freelancer') {
    return 0; // Freelancers paid per project
  }
  return employee.weeklyWage || 0;
}

export function getTotalWeeklyCost(employees: Employee[]): number {
  return employees.reduce((sum, emp) => sum + getWeeklyCostForEmployee(emp), 0);
}

export function isEmployeeBusy(employee: Employee): boolean {
  return employee.assignedTo !== undefined;
}

export function assignEmployee(employee: Employee, projectOrContractId: string): Employee {
  return {
    ...employee,
    assignedTo: projectOrContractId,
    busy: true
  };
}

export function unassignEmployee(employee: Employee): Employee {
  return {
    ...employee,
    assignedTo: undefined,
    busy: false
  };
}

// Calculate suggested weekly wage based on role and skill
export function calculateWeeklyWage(role: TalentRole, skill: number): number {
  const baseWages: Record<TalentRole, number> = {
    'Actor': 800,
    'Director': 1200,
    'Writer': 900,
    'Cinematographer': 1000,
    'Editor': 700,
    'Sound Designer': 650,
    'VFX Artist': 850,
    'Composer': 700,
    'Producer': 1100
  };
  
  const base = baseWages[role] || 600;
  const skillMultiplier = 1 + (skill - 5) * 0.15; // +/-15% per skill point from 5
  
  return Math.floor(base * skillMultiplier);
}
