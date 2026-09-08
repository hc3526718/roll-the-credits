// 3-Phase GDT-style project development

import { Project, PhaseAllocation, DevelopmentPhase, StaffMember, BudgetTier, ProjectResults, CriticScore } from './types-gdt';
import { getComboRating } from './genre-combos';

// Budget calculations
export function calculateBudget(tier: BudgetTier): number {
  const budgets: Record<BudgetTier, number> = {
    'Micro': 10_000,
    'Low': 50_000,
    'Medium': 200_000,
    'High': 1_000_000,
    'Blockbuster': 10_000_000
  };
  return budgets[tier];
}

// Phase time calculations (weeks per phase)
export function getPhaseTime(phase: DevelopmentPhase, budgetTier: BudgetTier): number {
  const baseTimes: Record<DevelopmentPhase, number> = {
    'phase1': 6,  // Script & Package
    'phase2': 10, // Production Craft
    'phase3': 8   // Finish & Sell
  };
  
  // Bigger budgets take longer
  const tierMultipliers: Record<BudgetTier, number> = {
    'Micro': 0.5,
    'Low': 0.75,
    'Medium': 1.0,
    'High': 1.5,
    'Blockbuster': 2.0
  };
  
  return Math.ceil(baseTimes[phase] * tierMultipliers[budgetTier]);
}

// Calculate phase quality based on allocation + staff
export function calculatePhaseQuality(
  phase: DevelopmentPhase,
  allocation: PhaseAllocation,
  assignedStaff: StaffMember[]
): number {
  let quality = 0;
  let count = 0;
  
  if (phase === 'phase1') {
    // Script & Package: story, script, attachments
    const avgAlloc = (allocation.story + allocation.script + allocation.attachments) / 3;
    
    // Staff contribution (writers, directors have Design stat)
    const writerContrib = assignedStaff
      .filter(s => s.role === 'writer')
      .reduce((sum, s) => sum + s.design * 10, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'writer').length);
    
    const directorContrib = assignedStaff
      .filter(s => s.role === 'director')
      .reduce((sum, s) => sum + s.design * 8, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'director').length);
    
    quality = (avgAlloc * 0.5) + (writerContrib || 0) * 0.3 + (directorContrib || 0) * 0.2;
  }
  
  else if (phase === 'phase2') {
    // Production Craft: direction, cinematography, performance
    const avgAlloc = (allocation.direction + allocation.cinematography + allocation.performance) / 3;
    
    const directorContrib = assignedStaff
      .filter(s => s.role === 'director')
      .reduce((sum, s) => sum + s.design * 10, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'director').length);
    
    quality = (avgAlloc * 0.6) + (directorContrib || 0) * 0.4;
  }
  
  else if (phase === 'phase3') {
    // Finish & Sell: editing, soundVFX, marketing
    const avgAlloc = (allocation.editing + allocation.soundVFX + allocation.marketing) / 3;
    
    const editorContrib = assignedStaff
      .filter(s => s.role === 'editor')
      .reduce((sum, s) => sum + s.tech * 10, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'editor').length);
    
    const vfxContrib = assignedStaff
      .filter(s => s.role === 'vfx-artist')
      .reduce((sum, s) => sum + s.tech * 10, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'vfx-artist').length);
    
    const producerContrib = assignedStaff
      .filter(s => s.role === 'producer')
      .reduce((sum, s) => sum + s.design * 8, 0) / Math.max(1, assignedStaff.filter(s => s.role === 'producer').length);
    
    quality = (avgAlloc * 0.4) + (editorContrib || 0) * 0.25 + (vfxContrib || 0) * 0.2 + (producerContrib || 0) * 0.15;
  }
  
  return Math.min(100, Math.max(0, quality));
}

// Calculate overall project quality
export function calculateOverallQuality(project: Project, assignedStaff: StaffMember[]): number {
  const phase1Quality = calculatePhaseQuality('phase1', project.phaseState.allocation, assignedStaff);
  const phase2Quality = calculatePhaseQuality('phase2', project.phaseState.allocation, assignedStaff);
  const phase3Quality = calculatePhaseQuality('phase3', project.phaseState.allocation, assignedStaff);
  
  // Add scene planner bonus if done
  const scenePlannerBonus = project.scenePlannerDone ? (project.scenePlannerQuality || 0) * 0.15 : 0;
  
  // Genre/tone combo effect
  const comboRating = getComboRating(project.genre, project.tone);
  const comboBonus = comboRating ? comboRating.qualityBoost : 0;
  
  // Weighted average + bonuses
  const baseQuality = (phase1Quality * 0.3 + phase2Quality * 0.4 + phase3Quality * 0.3);
  const finalQuality = baseQuality + comboBonus + scenePlannerBonus;
  
  return Math.min(100, Math.max(0, finalQuality));
}

// Generate critic scores (multiple outlets)
export function generateCriticScores(quality: number, hype: number): CriticScore[] {
  const outlets = [
    'Film Critic Weekly',
    'Cinema Review',
    'The Movie Times',
    'Reel Analysis',
    'Screen Commentary'
  ];
  
  const scores: CriticScore[] = outlets.map(outlet => {
    // Base on quality with some randomness
    const variance = (Math.random() * 20) - 10; // -10 to +10
    const hypeEffect = (hype - 50) * 0.1; // Hype can help/hurt
    const score = quality + variance + hypeEffect;
    
    return {
      outlet,
      score: Math.min(100, Math.max(0, Math.round(score)))
    };
  });
  
  return scores;
}

// Calculate box office over time (not instant)
export function calculateBoxOffice(
  quality: number,
  criticScore: number,
  hype: number,
  fans: number,
  budgetTier: BudgetTier
): { total: number; weekly: { week: number; sales: number }[] } {
  const budgetMultipliers: Record<BudgetTier, number> = {
    'Micro': 0.5,
    'Low': 1.0,
    'Medium': 3.0,
    'High': 10.0,
    'Blockbuster': 50.0
  };
  
  const multiplier = budgetMultipliers[budgetTier];
  
  // Opening week is strongest
  const openingWeek = (quality * 0.4 + criticScore * 0.3 + hype * 0.3) * multiplier * (fans / 100);
  
  // Subsequent weeks decay
  const weekly: { week: number; sales: number }[] = [];
  let total = 0;
  
  for (let week = 1; week <= 12; week++) {
    const decay = Math.pow(0.7, week - 1); // 70% retention each week
    const sales = Math.round(openingWeek * decay);
    
    if (sales < 100) break; // Stop when sales too low
    
    weekly.push({ week, sales });
    total += sales;
  }
  
  return { total, weekly };
}

// Calculate fans gained
export function calculateFansGained(
  quality: number,
  criticScore: number,
  hype: number,
  currentFans: number,
  budgetTier: BudgetTier
): number {
  const comboRating = 0; // Can add genre/tone later
  const comboBonus = 0; // comboRating ? comboRating.audienceBoost : 0;
  
  const baseGain = (quality * 0.4 + criticScore * 0.3 + hype * 0.3 + comboBonus);
  
  // Bigger budgets = more exposure
  const budgetMultipliers: Record<BudgetTier, number> = {
    'Micro': 0.5,
    'Low': 1.0,
    'Medium': 2.0,
    'High': 5.0,
    'Blockbuster': 15.0
  };
  
  const multiplier = budgetMultipliers[budgetTier];
  
  // Diminishing returns as fan base grows
  const fanBaseEffect = 1 + (currentFans / 10000) * 0.5;
  
  return Math.round(baseGain * multiplier * fanBaseEffect);
}

// Calculate reputation change
export function calculateReputationChange(quality: number, criticScore: number): number {
  const avg = (quality + criticScore) / 2;
  
  if (avg >= 80) return 5;
  if (avg >= 60) return 2;
  if (avg >= 40) return 0;
  if (avg >= 20) return -2;
  return -5;
}

// Complete project and generate results
export function completeProject(
  project: Project,
  assignedStaff: StaffMember[],
  studioFans: number
): ProjectResults {
  const overallQuality = calculateOverallQuality(project, assignedStaff);
  const criticScores = generateCriticScores(overallQuality, project.hype);
  const averageCriticScore = Math.round(
    criticScores.reduce((sum, c) => sum + c.score, 0) / criticScores.length
  );
  
  const boxOffice = calculateBoxOffice(
    overallQuality,
    averageCriticScore,
    project.hype,
    studioFans,
    project.budgetTier
  );
  
  const fansGained = calculateFansGained(
    overallQuality,
    averageCriticScore,
    project.hype,
    studioFans,
    project.budgetTier
  );
  
  const reputationChange = calculateReputationChange(overallQuality, averageCriticScore);
  
  // Fan score is quality-weighted + hype
  const fanScore = Math.round(overallQuality * 0.6 + project.hype * 0.4);
  
  return {
    overallQuality,
    criticScores,
    averageCriticScore,
    fanScore,
    boxOffice: boxOffice.total,
    fansGained,
    reputationChange,
    weeklySales: boxOffice.weekly
  };
}
