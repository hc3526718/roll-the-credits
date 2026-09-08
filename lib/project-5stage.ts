// 5-Stage Owner Design project logic

import { 
  Project, StageAllocation, DevelopmentStage, StaffMember, BudgetTier, 
  ProjectResults, CriticScore, ProjectTopic, FilmGenre 
} from './types-gdt';

// Budget for Owner Design formats
export function calculateBudget(tier: BudgetTier): number {
  const budgets: Record<BudgetTier, number> = {
    'Micro': 3_000,      // Social videos
    'Low': 10_000,       // Short films, music videos
    'Medium': 30_000,    // Commercials, micro-docs
    'High': 150_000,     // Features (unlock later)
    'Blockbuster': 1_000_000
  };
  return budgets[tier];
}

// Time per stage (weeks)
export function getStageTime(stage: DevelopmentStage, budgetTier: BudgetTier): number {
  const baseTimes: Record<DevelopmentStage, number> = {
    'planning': 2,
    'recruitment': 1,
    'filming': 3,
    'post': 3,
    'marketing': 1
  };
  
  const multipliers: Record<BudgetTier, number> = {
    'Micro': 0.5,
    'Low': 0.75,
    'Medium': 1.0,
    'High': 1.25,
    'Blockbuster': 1.5
  };
  
  return Math.max(1, Math.ceil(baseTimes[stage] * multipliers[budgetTier]));
}

// Get slider keys for a stage
export function getStageSliders(stage: DevelopmentStage): [keyof StageAllocation, keyof StageAllocation, keyof StageAllocation] {
  const sliders: Record<DevelopmentStage, [keyof StageAllocation, keyof StageAllocation, keyof StageAllocation]> = {
    'planning': ['scriptStory', 'storyboardPreviz', 'budgetSchedule'],
    'recruitment': ['casting', 'crew', 'locations'],
    'filming': ['cinematography', 'performance', 'productionDesign'],
    'post': ['editing', 'soundScore', 'vfxGrade'],
    'marketing': ['trailerCampaign', 'press', 'distributionRelease']
  };
  return sliders[stage];
}

// Validate 100-pt pool for a stage
export function validateStagePool(stage: DevelopmentStage, allocation: StageAllocation): boolean {
  const [s1, s2, s3] = getStageSliders(stage);
  const sum = allocation[s1] + allocation[s2] + allocation[s3];
  return Math.abs(sum - 100) < 1; // Allow small rounding errors
}

// Calculate quality for one stage
export function calculateStageQuality(
  stage: DevelopmentStage,
  allocation: StageAllocation,
  assignedStaff: StaffMember[]
): number {
  const [s1, s2, s3] = getStageSliders(stage);
  const avgAlloc = (allocation[s1] + allocation[s2] + allocation[s3]) / 3;
  
  // Staff contribution (average craft + taste)
  const staffQuality = assignedStaff.length > 0
    ? assignedStaff.reduce((sum, s) => sum + ((s.craft + s.taste) / 2), 0) / assignedStaff.length
    : 5; // Default baseline
  
  // 60% allocation, 40% staff
  return Math.min(100, (avgAlloc * 0.6) + (staffQuality * 10 * 0.4));
}

// Overall quality (weighted by stage importance)
export function calculateOverallQuality(project: Project, assignedStaff: StaffMember[]): number {
  const stages: DevelopmentStage[] = ['planning', 'recruitment', 'filming', 'post', 'marketing'];
  const weights = [1, 0.8, 2.5, 2, 1]; // Filming & Post matter most
  
  const qualities = stages.map(stage => calculateStageQuality(stage, project.phaseState.allocation, assignedStaff));
  const weightedSum = qualities.reduce((sum, q, i) => sum + q * weights[i], 0);
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  
  return Math.min(100, weightedSum / totalWeight);
}

// Topic×Genre combo bonus (hidden, taught via reports)
export function getComboBonus(topic: ProjectTopic, genre: FilmGenre): number {
  // Hidden optimal combos - player discovers through reports
  const combos: Record<string, number> = {
    'Technology-Thriller': 15,
    'Technology-SciFi': 12,
    'Nature-Documentary': 18,
    'Urban-Life-Drama': 10,
    'Relationships-Romance': 14,
    'Relationships-Comedy': 8,
    'Adventure-Action': 12,
    'Mystery-Thriller': 15,
    'History-Documentary': 10,
    'Future-SciFi': 16,
    'Art-Drama': 8,
    'Sports-Documentary': 10
  };
  
  const key = `${topic}-${genre.replace(' ', '')}`;
  return combos[key] || 0;
}

// Generate critic scores
export function generateCriticScores(baseQuality: number, comboBonus: number): CriticScore[] {
  const critics = [
    'Film Quarterly',
    'Indie Wire',
    'Variety',
    'The Hollywood Reporter',
    'Screen Daily'
  ];
  
  return critics.map(outlet => {
    const variance = (Math.random() - 0.5) * 25;
    const score = Math.min(100, Math.max(0, baseQuality + comboBonus + variance));
    return { outlet, score: Math.round(score) };
  });
}

// Box office revenue
export function calculateBoxOffice(
  budget: number,
  avgCriticScore: number,
  fanScore: number,
  hype: number,
  studioFans: number
): number {
  const qualityMult = (avgCriticScore / 100) * 0.5 + (fanScore / 100) * 0.5;
  const hypeBoost = 1 + (hype / 100);
  const fanReach = Math.min(5, Math.log10(studioFans + 10) / 2);
  
  return Math.round(budget * qualityMult * hypeBoost * fanReach * (0.8 + Math.random() * 0.4));
}

// Fans gained
export function calculateFansGained(avgCriticScore: number, fanScore: number, budget: number): number {
  const baseGain = (avgCriticScore * 8) + (fanScore * 4);
  const budgetBoost = Math.log10(budget / 1000);
  return Math.max(10, Math.round(baseGain * budgetBoost * (0.6 + Math.random() * 0.8)));
}

// Reputation change
export function calculateReputationChange(avgCriticScore: number, currentRep: number): number {
  const targetRep = avgCriticScore;
  return Math.round((targetRep - currentRep) * 0.15);
}

// Generate post-mortem insights (Owner Design: teach what worked/didn't)
export function generatePostMortem(
  project: Project,
  assignedStaff: StaffMember[],
  results: ProjectResults
): { strengths: string[]; weaknesses: string[]; comboRevealed?: string } {
  const stages: DevelopmentStage[] = ['planning', 'recruitment', 'filming', 'post', 'marketing'];
  const qualities = stages.map(stage => ({
    stage,
    quality: calculateStageQuality(stage, project.phaseState.allocation, assignedStaff)
  }));
  
  const sorted = [...qualities].sort((a, b) => b.quality - a.quality);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Best stage
  if (best.quality > 70) {
    const stageNames = {
      'planning': 'script and planning',
      'recruitment': 'casting and crew selection',
      'filming': 'production and cinematography',
      'post': 'editing and post-production',
      'marketing': 'marketing campaign'
    };
    strengths.push(`Strong ${stageNames[best.stage]} elevated the project`);
  }
  
  // Worst stage
  if (worst.quality < 50) {
    const stageNames = {
      'planning': 'Weak script foundation',
      'recruitment': 'Poor casting choices',
      'filming': 'Rushed production',
      'post': 'Inadequate post-production',
      'marketing': 'Ineffective marketing'
    };
    weaknesses.push(stageNames[worst.stage]);
  }
  
  // Staff quality
  if (assignedStaff.length === 0) {
    weaknesses.push('No staff assigned - founder did everything');
  } else {
    const avgCraft = assignedStaff.reduce((sum, s) => sum + s.craft, 0) / assignedStaff.length;
    if (avgCraft < 5) {
      weaknesses.push('Team lacked technical skills');
    } else if (avgCraft > 7) {
      strengths.push('Skilled team delivered quality work');
    }
  }
  
  // Combo (reveal after first use)
  const comboBonus = getComboBonus(project.topic, project.genre);
  let comboRevealed: string | undefined;
  if (comboBonus > 10) {
    comboRevealed = `${project.topic} × ${project.genre} is a strong combination (+${comboBonus})`;
  } else if (comboBonus === 0) {
    comboRevealed = `${project.topic} × ${project.genre} didn't resonate with audiences`;
  }
  
  return { strengths, weaknesses, comboRevealed };
}

// Complete project
export function completeProject(
  project: Project,
  assignedStaff: StaffMember[],
  studioFans: number
): ProjectResults {
  const overallQuality = calculateOverallQuality(project, assignedStaff);
  const comboBonus = getComboBonus(project.topic, project.genre);
  
  const criticScores = generateCriticScores(overallQuality, comboBonus);
  const avgCriticScore = criticScores.reduce((sum, c) => sum + c.score, 0) / criticScores.length;
  
  const fanScore = Math.min(100, Math.max(0, overallQuality + comboBonus + (Math.random() - 0.5) * 30));
  
  const boxOffice = calculateBoxOffice(project.budget, avgCriticScore, fanScore, project.hype, studioFans);
  const fansGained = calculateFansGained(avgCriticScore, fanScore, project.budget);
  const reputationChange = calculateReputationChange(avgCriticScore, 50);
  
  // Weekly sales curve
  const weeklySales = [];
  let remaining = boxOffice;
  for (let week = 1; week <= 8; week++) {
    const amount = remaining * (0.35 / Math.pow(week, 0.6));
    weeklySales.push({ week, sales: Math.round(amount) });
    remaining -= amount;
  }
  
  return {
    overallQuality,
    criticScores,
    averageCriticScore: avgCriticScore,
    fanScore,
    boxOffice,
    fansGained,
    reputationChange,
    weeklySales
  };
}

// Legacy aliases
export const getPhaseTime = getStageTime;
export const calculatePhaseQuality = calculateStageQuality;
