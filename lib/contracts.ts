// Contract work system for Roll the Credits v2

import { ContractJob, ContractType, TalentRole } from './types';

export function generateContractJob(type: ContractType): ContractJob {
  const contracts = {
    'vfx-contract': [
      {
        title: 'VFX Cleanup for Ad Agency',
        description: 'Remove wires and tracking markers from a commercial shoot.',
        totalPayout: 8000,
        durationWeeks: 2,
        requiredRoles: ['VFX Artist' as TalentRole]
      },
      {
        title: 'Simple CGI Environment',
        description: 'Create a basic 3D environment for an indie music video.',
        totalPayout: 12000,
        durationWeeks: 3,
        requiredRoles: ['VFX Artist' as TalentRole]
      },
      {
        title: 'Green Screen Compositing',
        description: 'Composite actors into stock backgrounds for a web series.',
        totalPayout: 6000,
        durationWeeks: 2,
        requiredRoles: ['VFX Artist' as TalentRole]
      }
    ],
    'sound-contract': [
      {
        title: 'Podcast Audio Cleanup',
        description: 'Clean and master audio for a 10-episode podcast series.',
        totalPayout: 4000,
        durationWeeks: 2,
        requiredRoles: ['Sound Designer' as TalentRole]
      },
      {
        title: 'Foley for Indie Game',
        description: 'Create sound effects library for a small game studio.',
        totalPayout: 7000,
        durationWeeks: 3,
        requiredRoles: ['Sound Designer' as TalentRole]
      }
    ],
    'editing-contract': [
      {
        title: 'Corporate Training Videos',
        description: 'Edit 5 training videos for a tech company.',
        totalPayout: 5000,
        durationWeeks: 2,
        requiredRoles: ['Editor' as TalentRole]
      },
      {
        title: 'YouTube Series Edit',
        description: 'Edit and color grade a 6-episode documentary series.',
        totalPayout: 9000,
        durationWeeks: 3,
        requiredRoles: ['Editor' as TalentRole]
      }
    ],
    'sfx-contract': [
      {
        title: 'Stage Combat Sound Design',
        description: 'Design impact and weapon sounds for a theater production.',
        totalPayout: 3000,
        durationWeeks: 1,
        requiredRoles: ['Sound Designer' as TalentRole]
      }
    ]
  };

  const options = contracts[type];
  const template = options[Math.floor(Math.random() * options.length)];

  return {
    id: `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title: template.title,
    description: template.description,
    totalPayout: template.totalPayout,
    durationWeeks: template.durationWeeks,
    weeksRemaining: template.durationWeeks,
    weeklyPayout: Math.floor(template.totalPayout / template.durationWeeks),
    requiredRoles: template.requiredRoles,
    assignedEmployees: [],
    active: false
  };
}

export function generateContractBoard(): ContractJob[] {
  const types: ContractType[] = ['vfx-contract', 'sound-contract', 'editing-contract', 'sfx-contract'];
  
  // Generate 3-5 random contracts
  const count = Math.floor(Math.random() * 3) + 3;
  const contracts: ContractJob[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    contracts.push(generateContractJob(type));
  }
  
  return contracts;
}

export function canAcceptContract(contract: ContractJob, availableRoles: TalentRole[]): boolean {
  return contract.requiredRoles.every(role => availableRoles.includes(role));
}

export function calculateContractTotalPayout(contract: ContractJob): number {
  return contract.weeklyPayout * contract.durationWeeks;
}
