// Stage-specific decision generation

import { StageDecision, Project, ProductionPhase, Genre, BudgetTier } from './types';

// v2: Scale decision costs by project budget tier
function getBudgetScaleFactor(budgetTier: BudgetTier): number {
  const scales: Record<BudgetTier, number> = {
    'Micro': 0.1,  // Micro budget: costs are 10% of base
    'Low': 0.35,   // Low budget: costs are 35% of base
    'Mid': 1.0,    // Mid budget: base costs
    'High': 2.5    // High budget: costs are 2.5x base
  };
  return scales[budgetTier];
}

function scaleDecisionCosts(decision: StageDecision, scaleFactor: number): StageDecision {
  return {
    ...decision,
    options: decision.options.map(option => ({
      ...option,
      cost: option.cost ? Math.floor(option.cost * scaleFactor) : 0
    }))
  };
}

export function generateStageDecision(stage: ProductionPhase, project: Project, progress: number): StageDecision | null {
  // Generate decision at 50% progress
  if (progress < 45 || progress > 55) return null;
  
  let decision: StageDecision | null = null;
  
  switch (stage) {
    case 'planning':
      decision = generatePlanningDecision(project);
      break;
    case 'preproduction':
      decision = generatePreproductionDecision(project);
      break;
    case 'filming':
      decision = generateFilmingDecision(project);
      break;
    case 'postproduction':
      decision = generatePostproductionDecision(project);
      break;
    case 'marketing':
      decision = generateMarketingDecision(project);
      break;
    default:
      return null;
  }
  
  // v2: Scale costs by budget tier
  if (decision) {
    const scaleFactor = getBudgetScaleFactor(project.budgetTier);
    decision = scaleDecisionCosts(decision, scaleFactor);
  }
  
  return decision;
}

function generatePlanningDecision(project: Project): StageDecision {
  const decisions: StageDecision[] = [
    {
      id: 'script-depth',
      stage: 'planning',
      text: 'Script Development Approach',
      description: 'The writer needs guidance on script depth and revisions.',
      options: [
        {
          id: 'deep-revision',
          label: 'Deep Character Work',
          description: 'Multiple rewrites focusing on character depth',
          cost: 15000,
          timeWeeks: 4,
          qualityMod: 15,
          criticMod: 10,
          audienceMod: -3,
          riskLevel: 'low'
        },
        {
          id: 'balanced',
          label: 'Balanced Approach',
          description: 'Standard development process',
          cost: 8000,
          timeWeeks: 2,
          qualityMod: 5,
          riskLevel: 'low'
        },
        {
          id: 'fast-draft',
          label: 'Fast-Track Draft',
          description: 'Minimal revisions, get to production quickly',
          cost: 3000,
          timeWeeks: 1,
          qualityMod: -5,
          audienceMod: 5,
          criticMod: -8,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'source-material',
      stage: 'planning',
      text: 'Source Material Decision',
      description: 'Adapt from existing IP or create original story?',
      options: [
        {
          id: 'hot-ip',
          label: 'Adapt Hot IP',
          description: 'License popular book/comic - built-in audience',
          cost: 50000,
          timeWeeks: 2,
          audienceMod: 15,
          criticMod: -5,
          riskLevel: 'low'
        },
        {
          id: 'original',
          label: 'Original Story',
          description: 'Create something new - more critical respect',
          cost: 5000,
          timeWeeks: 3,
          criticMod: 10,
          audienceMod: -5,
          qualityMod: 8,
          riskLevel: 'medium'
        },
        {
          id: 'public-domain',
          label: 'Public Domain Remix',
          description: 'Fresh take on classic story',
          cost: 2000,
          timeWeeks: 2,
          qualityMod: 3,
          riskLevel: 'medium'
        }
      ]
    }
  ];
  
  return decisions[Math.floor(Math.random() * decisions.length)];
}

function generatePreproductionDecision(project: Project): StageDecision {
  return {
    id: 'production-plan',
    stage: 'preproduction',
    text: 'Production Schedule',
    description: 'Balance speed vs quality in your filming plan.',
    options: [
      {
        id: 'practical-heavy',
        label: 'Practical Effects Focus',
        description: 'Build real sets, minimize VFX - takes longer',
        cost: 30000,
        timeWeeks: 6,
        qualityMod: 10,
        criticMod: 8,
        audienceMod: -2,
        riskLevel: 'low'
      },
      {
        id: 'vfx-plan',
        label: 'VFX-Heavy Plan',
        description: 'Green screen & post-production magic',
        cost: 50000,
        timeWeeks: 3,
        qualityMod: 5,
        audienceMod: 10,
        criticMod: -5,
        riskLevel: 'medium'
      },
      {
        id: 'compressed',
        label: 'Compressed Schedule',
        description: 'Tight timeline, save money',
        cost: 10000,
        timeWeeks: 2,
        qualityMod: -8,
        riskLevel: 'high'
      },
      {
        id: 'location-scout',
        label: 'Premium Locations',
        description: 'Expensive but stunning real locations',
        cost: 40000,
        timeWeeks: 4,
        qualityMod: 12,
        criticMod: 10,
        audienceMod: 5,
        riskLevel: 'low'
      }
    ]
  };
}

function generateFilmingDecision(project: Project): StageDecision {
  const decisions: StageDecision[] = [
    {
      id: 'filming-challenge',
      stage: 'filming',
      text: 'On-Set Challenge',
      description: 'A key scene isn\'t working. Do you push through?',
      options: [
        {
          id: 'overtime',
          label: 'Shoot Overtime',
          description: 'Pay crew extra to perfect the scene',
          cost: 20000,
          timeWeeks: 1,
          qualityMod: 10,
          riskLevel: 'low'
        },
        {
          id: 'move-on',
          label: 'Move On',
          description: 'Accept what you got, stay on schedule',
          cost: 0,
          timeWeeks: 0,
          qualityMod: -5,
          riskLevel: 'low'
        },
        {
          id: 'reshoot-later',
          label: 'Schedule Reshoot',
          description: 'Come back after wrap for pickups',
          cost: 35000,
          timeWeeks: 3,
          qualityMod: 15,
          criticMod: 8,
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'actor-issue',
      stage: 'filming',
      text: 'Actor Conflict',
      description: 'Lead actor is difficult. Replace or accommodate?',
      options: [
        {
          id: 'replace',
          label: 'Replace Actor',
          description: 'Costly but may improve chemistry',
          cost: 50000,
          timeWeeks: 4,
          qualityMod: -10,
          audienceMod: -15,
          riskLevel: 'high'
        },
        {
          id: 'accommodate',
          label: 'Accommodate Demands',
          description: 'Keep peace, adjust to their style',
          cost: 15000,
          timeWeeks: 1,
          qualityMod: 5,
          riskLevel: 'low'
        },
        {
          id: 'director-handle',
          label: 'Let Director Handle',
          description: 'Trust your director to manage it',
          cost: 5000,
          timeWeeks: 0,
          qualityMod: 3,
          riskLevel: 'medium'
        }
      ]
    }
  ];
  
  return decisions[Math.floor(Math.random() * decisions.length)];
}

function generatePostproductionDecision(project: Project): StageDecision {
  return {
    id: 'post-focus',
    stage: 'postproduction',
    text: 'Post-Production Focus',
    description: 'Where to invest your remaining post budget?',
    options: [
      {
        id: 'vfx-shots',
        label: 'More VFX Shots',
        description: 'Add spectacular visual effects',
        cost: 40000,
        timeWeeks: 4,
        qualityMod: 8,
        audienceMod: 12,
        criticMod: -3,
        riskLevel: 'low'
      },
      {
        id: 'sound-design',
        label: 'Premium Sound',
        description: 'Immersive audio experience',
        cost: 25000,
        timeWeeks: 3,
        qualityMod: 10,
        criticMod: 8,
        audienceMod: 3,
        riskLevel: 'low'
      },
      {
        id: 'editor-time',
        label: 'Extra Edit Time',
        description: 'Perfectionist cutting room',
        cost: 15000,
        timeWeeks: 3,
        qualityMod: 12,
        criticMod: 10,
        audienceMod: -2,
        riskLevel: 'low'
      },
      {
        id: 'balanced-post',
        label: 'Balanced Finish',
        description: 'Standard post across all departments',
        cost: 20000,
        timeWeeks: 2,
        qualityMod: 5,
        riskLevel: 'low'
      }
    ]
  };
}

function generateMarketingDecision(project: Project): StageDecision {
  return {
    id: 'marketing-strategy',
    stage: 'marketing',
    text: 'Marketing Strategy',
    description: 'How to position your film for release?',
    options: [
      {
        id: 'festival-premiere',
        label: 'Festival Premiere',
        description: 'Prestige platform, slower rollout',
        cost: 30000,
        timeWeeks: 6,
        criticMod: 15,
        audienceMod: -5,
        riskLevel: 'low'
      },
      {
        id: 'viral-campaign',
        label: 'Viral Marketing',
        description: 'Social media blitz, memes, influencers',
        cost: 50000,
        timeWeeks: 3,
        audienceMod: 20,
        criticMod: -10,
        riskLevel: 'medium'
      },
      {
        id: 'traditional',
        label: 'Traditional Campaign',
        description: 'TV spots, billboards, press junket',
        cost: 40000,
        timeWeeks: 4,
        audienceMod: 10,
        criticMod: 3,
        qualityMod: 5,
        riskLevel: 'low'
      },
      {
        id: 'limited-release',
        label: 'Limited Platform Release',
        description: 'Small rollout, build word-of-mouth',
        cost: 15000,
        timeWeeks: 8,
        criticMod: 8,
        audienceMod: 5,
        qualityMod: 3,
        riskLevel: 'medium'
      }
    ]
  };
}
