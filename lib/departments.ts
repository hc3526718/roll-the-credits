// Department system for Roll the Credits v2

import { Department, DepartmentType, TalentRole } from './types';

export interface DepartmentTemplate {
  type: DepartmentType;
  name: string;
  purchaseCost: number;
  rentalIncome: number;
  requiredForRoles: TalentRole[];
}

export const DEPARTMENT_TEMPLATES: DepartmentTemplate[] = [
  {
    type: 'edit-suite',
    name: 'Editing Suite',
    purchaseCost: 15000,
    rentalIncome: 800,
    requiredForRoles: ['Editor']
  },
  {
    type: 'vfx-bay',
    name: 'VFX Bay',
    purchaseCost: 25000,
    rentalIncome: 1200,
    requiredForRoles: ['VFX Artist']
  },
  {
    type: 'sound-stage',
    name: 'Sound Stage',
    purchaseCost: 20000,
    rentalIncome: 1000,
    requiredForRoles: ['Sound Designer', 'Composer']
  },
  {
    type: 'marketing-office',
    name: 'Marketing Office',
    purchaseCost: 10000,
    rentalIncome: 600,
    requiredForRoles: ['Producer']
  },
  {
    type: 'filming-stage',
    name: 'Filming Stage',
    purchaseCost: 35000,
    rentalIncome: 1500,
    requiredForRoles: ['Director', 'Cinematographer', 'Actor']
  }
];

export function createDepartment(template: DepartmentTemplate): Department {
  return {
    id: `dept-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: template.type,
    name: template.name,
    owned: false,
    purchaseCost: template.purchaseCost,
    rentalIncome: template.rentalIncome,
    rented: false,
    rentWeeksRemaining: 0,
    upgradeLevel: 1,
    requiredForRoles: template.requiredForRoles
  };
}

export function getAvailableDepartments(): Department[] {
  return DEPARTMENT_TEMPLATES.map(createDepartment);
}

export function canPurchaseDepartment(cash: number, debt: number, department: Department): boolean {
  const netCash = cash - debt;
  return netCash >= department.purchaseCost;
}

export function rentOutDepartment(department: Department, weeks: number = 4): Department {
  return {
    ...department,
    rented: true,
    rentWeeksRemaining: weeks
  };
}

export function getDepartmentUpgradeCost(department: Department): number {
  // Each upgrade level costs 50% more than purchase
  return Math.floor(department.purchaseCost * 0.5 * department.upgradeLevel);
}

export function upgradeDepartment(department: Department): Department {
  return {
    ...department,
    upgradeLevel: Math.min(3, department.upgradeLevel + 1),
    rentalIncome: Math.floor(department.rentalIncome * 1.3)
  };
}
