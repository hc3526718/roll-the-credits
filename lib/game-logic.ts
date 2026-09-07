// Core game logic and calculations

import { 
  Studio, Project, ScenePanel, StoryOutcome, EditChoice, Talent, Genre 
} from './types';
import { calculateChemistry } from './game-data';

export function calculateBudget(format: Project['format'], tier: Project['budgetTier']): number {
  const base = {
    'Feature': { 'Micro': 50000, 'Low': 200000, 'Mid': 1000000, 'High': 5000000 },
    'Limited Series': { 'Micro': 30000, 'Low': 150000, 'Mid': 750000, 'High': 3000000 },
    'Short': { 'Micro': 10000, 'Low': 30000, 'Mid': 100000, 'High': 300000 }
  };
  
  return base[format][tier];
}

export function analyzeSceneQuality(
  scenes: ScenePanel[], 
  talent: Talent[], 
  genre: Genre
): StoryOutcome {
  let quality = 50;
  const tags: string[] = [];
  let audienceAppeal = 0;
  let criticAppeal = 0;
  
  // Base quality from talent skill
  const avgSkill = talent.reduce((sum, t) => sum + t.stats.skill, 0) / Math.max(talent.length, 1);
  quality += (avgSkill - 5) * 5; // -10 to +25
  
  // Chemistry analysis
  scenes.forEach((scene, idx) => {
    const sceneTalent = scene.characters
      .map(id => talent.find(t => t.id === id))
      .filter(Boolean) as Talent[];
    
    if (sceneTalent.length >= 2) {
      // Calculate chemistry between pairs
      for (let i = 0; i < sceneTalent.length; i++) {
        for (let j = i + 1; j < sceneTalent.length; j++) {
          const chem = calculateChemistry(sceneTalent[i], sceneTalent[j]);
          
          if (chem > 70) {
            quality += 5;
            audienceAppeal += 3;
            tags.push('chemistry');
          } else if (chem < 30) {
            quality -= 8;
            criticAppeal -= 5;
            tags.push('tension');
          }
        }
      }
    }
    
    // Scene order matters - early scenes set tone
    if (idx === 0 && sceneTalent.length > 0) {
      const leadSkill = sceneTalent[0].stats.skill;
      if (leadSkill >= 8) {
        quality += 5;
        criticAppeal += 5;
        tags.push('strong-open');
      }
    }
    
    // Final scene impact
    if (idx === scenes.length - 1 && sceneTalent.length >= 2) {
      tags.push('ensemble-finale');
      audienceAppeal += 5;
    }
  });
  
  // Genre-specific bonuses
  const hasDrama = talent.some(t => t.chemistryTags.includes('dramatic'));
  const hasComedy = talent.some(t => t.chemistryTags.includes('comedic'));
  
  if ((genre === 'Drama' && hasDrama) || (genre === 'Comedy' && hasComedy)) {
    quality += 8;
    criticAppeal += 5;
    tags.push('genre-fit');
  }
  
  // Scene complexity
  const complexScenes = scenes.filter(s => s.characters.length >= 3).length;
  if (complexScenes >= 2) {
    quality += 5;
    criticAppeal += 8;
    tags.push('ambitious');
  }
  
  // Romance detection
  const romanticTalent = talent.filter(t => t.chemistryTags.includes('romantic'));
  if (romanticTalent.length >= 2 && scenes.some(s => 
    s.characters.includes(romanticTalent[0].id) && 
    s.characters.includes(romanticTalent[1].id)
  )) {
    tags.push('romance');
    audienceAppeal += 8;
  }
  
  // Action/intensity
  const intenseTalent = talent.filter(t => 
    t.chemistryTags.includes('action-star') || t.chemistryTags.includes('intense')
  );
  if (intenseTalent.length >= 2 && (genre === 'Action' || genre === 'Thriller')) {
    tags.push('intense');
    audienceAppeal += 10;
  }
  
  return {
    quality: Math.max(0, Math.min(100, quality)),
    tags: [...new Set(tags)],
    audienceAppeal,
    criticAppeal
  };
}

export function calculateEditingImpact(choices: EditChoice, storyOutcome: StoryOutcome): {
  audienceMod: number;
  criticMod: number;
} {
  let audienceMod = 0;
  let criticMod = 0;
  
  // Pacing
  if (choices.pacing === 'fast') {
    audienceMod += 8;
    criticMod -= 3;
  } else if (choices.pacing === 'slow') {
    audienceMod -= 5;
    criticMod += 8;
  }
  
  // Cold open
  if (choices.coldOpen) {
    audienceMod += 5;
  }
  
  // Cutting scenes
  if (choices.cutScenes > 0) {
    criticMod -= choices.cutScenes * 3;
    audienceMod += choices.cutScenes * 2;
  }
  
  // Title energy
  if (choices.titleEnergy === 'viral') {
    audienceMod += 10;
    criticMod -= 5;
  } else if (choices.titleEnergy === 'subtle') {
    audienceMod -= 3;
    criticMod += 5;
  }
  
  // Thumbnail style
  if (choices.thumbnailStyle === 'clickbait') {
    audienceMod += 12;
    criticMod -= 8;
  } else if (choices.thumbnailStyle === 'artistic') {
    audienceMod -= 2;
    criticMod += 10;
  }
  
  return { audienceMod, criticMod };
}

export function calculateProjectResults(
  project: Project,
  studio: Studio
): Project['results'] {
  if (!project.storyOutcome || !project.editChoices) {
    throw new Error('Project not ready for results calculation');
  }
  
  const { storyOutcome, editChoices } = project;
  const { audienceMod, criticMod } = calculateEditingImpact(editChoices, storyOutcome);
  
  // Base scores
  let audienceScore = storyOutcome.quality + storyOutcome.audienceAppeal + audienceMod;
  let criticScore = storyOutcome.quality + storyOutcome.criticAppeal + criticMod;
  
  // Trend bonus
  const matchingTrend = studio.trends.find(t => t.genre === project.genre);
  if (matchingTrend) {
    audienceScore += matchingTrend.audienceBoost * (matchingTrend.strength / 100);
    criticScore -= matchingTrend.criticPenalty;
  }
  
  // Studio reputation affects critic score
  criticScore += (studio.reputation - 50) / 10;
  
  // Clamp scores
  audienceScore = Math.max(0, Math.min(100, audienceScore));
  criticScore = Math.max(0, Math.min(100, criticScore));
  
  // Calculate revenue
  const budgetMultiplier = project.budget / 100000;
  const scoreMultiplier = (audienceScore + criticScore) / 100;
  const revenue = Math.floor(
    project.budget * scoreMultiplier * (0.8 + Math.random() * 0.4)
  );
  
  // Calculate followers gained
  const baseFollowers = Math.floor(audienceScore * 100 * budgetMultiplier);
  const followersGained = Math.floor(baseFollowers * (1 + studio.audience.engagementRate));
  
  // Calculate reputation change
  const reputationChange = Math.floor((criticScore - 60) / 5);
  
  return {
    audienceScore,
    criticScore,
    revenue,
    followersGained,
    reputationChange
  };
}

export function updateTrends(studio: Studio): void {
  // Decay existing trends
  studio.trends.forEach(trend => {
    trend.strength -= Math.floor(Math.random() * 15) + 5;
  });
  
  // Remove dead trends
  studio.trends = studio.trends.filter(t => t.strength > 0);
  
  // Maybe add new trend
  if (Math.random() < 0.3 && studio.trends.length < 5) {
    const { generateTrend } = require('./game-data');
    studio.trends.push(generateTrend(`trend-${Date.now()}`));
  }
}
