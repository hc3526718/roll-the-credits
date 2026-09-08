// Procedural game data generation

import { Talent, TalentRole, Trend, Genre, ChemistryTag } from './types';

const FIRST_NAMES = [
  'Alex', 'Morgan', 'Jordan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake',
  'Charlie', 'Dakota', 'Ellis', 'Finley', 'Harper', 'Indigo', 'Jamie', 'Kai',
  'Logan', 'Marley', 'Nico', 'Parker', 'Reese', 'Sage', 'Taylor', 'Val'
];

const LAST_NAMES = [
  'Chen', 'Martinez', 'Okafor', 'Patel', 'Silva', 'Kim', 'Johnson', 'Garcia',
  'Williams', 'Brown', 'Davis', 'Miller', 'Rodriguez', 'Lee', 'Thompson', 'White',
  'Harris', 'Martin', 'Jackson', 'Clark', 'Lewis', 'Walker', 'Hall', 'Young'
];

const CHEMISTRY_TAGS = [
  'veteran', 'method', 'comedic', 'intense', 'romantic', 'action-star',
  'indie-darling', 'blockbuster', 'experimental', 'classical', 'quirky', 'dramatic'
];

const TREND_NAMES = [
  'Multiverse Mania', 'Slow Cinema', 'Folk Horror', 'Heist Crews', 
  'AI Thriller', 'Period Drama', 'Dark Comedy', 'Found Footage',
  'Elevated Genre', 'Anthology', 'Biopic Buzz', 'Space Opera'
];

export function generateTalent(role: TalentRole, id: string, forceSkillRange?: { min: number; max: number }, forceFameRange?: { min: number; max: number }): Talent {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // v2: Allow forced ranges for reputation-based talent gating
  const skillRange = forceSkillRange || { min: 3, max: 10 };
  const fameRange = forceFameRange || { min: 1, max: 10 };
  
  const skill = Math.floor(Math.random() * (skillRange.max - skillRange.min + 1)) + skillRange.min;
  const fame = Math.floor(Math.random() * (fameRange.max - fameRange.min + 1)) + fameRange.min;
  
  const numTags = Math.floor(Math.random() * 3) + 1;
  const chemistryTags = Array.from(
    { length: numTags },
    () => CHEMISTRY_TAGS[Math.floor(Math.random() * CHEMISTRY_TAGS.length)]
  ).filter((tag, idx, arr) => arr.indexOf(tag) === idx);
  
  const salaryBase: Record<TalentRole, number> = {
    'Actor': 5000,
    'Director': 8000,
    'Writer': 4000,
    'Cinematographer': 4500,
    'Editor': 3500,
    'Sound Designer': 3000,
    'VFX Artist': 4000,
    'Composer': 3500,
    'Producer': 6000
  };
  const baseSalary = salaryBase[role] || 3000;
  const salary = Math.floor(baseSalary * (skill / 5) * (fame / 5));
  
  return {
    id,
    name: `${firstName} ${lastName}`,
    role,
    stats: {
      skill,
      fame,
      energy: 100
    },
    chemistryTags,
    salary,
    busy: false
  };
}

export function generateInitialTalentPool(): Talent[] {
  const pool: Talent[] = [];
  let id = 0;
  
  // Generate talent distribution - start with basics, more unlock later
  const roles: TalentRole[] = ['Actor', 'Director', 'Writer', 'Cinematographer', 'Editor', 'Sound Designer', 'VFX Artist', 'Composer', 'Producer'];
  const counts: Partial<Record<TalentRole, number>> = {
    'Actor': 12,
    'Director': 5,
    'Writer': 5,
    'Cinematographer': 4,
    'Editor': 4,
    'Sound Designer': 3,
    'VFX Artist': 3,
    'Composer': 2,
    'Producer': 2
  };
  
  roles.forEach(role => {
    const count = counts[role] || 0;
    for (let i = 0; i < count; i++) {
      pool.push(generateTalent(role, `talent-${id++}`));
    }
  });
  
  return pool;
}

export function generateTrend(id: string): Trend {
  const genres: Genre[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const name = TREND_NAMES[Math.floor(Math.random() * TREND_NAMES.length)];
  
  return {
    id,
    name,
    genre,
    strength: Math.floor(Math.random() * 60) + 40, // 40-100
    audienceBoost: Math.floor(Math.random() * 20) + 10,
    criticPenalty: Math.floor(Math.random() * 10)
  };
}

export function generateInitialTrends(): Trend[] {
  return Array.from({ length: 4 }, (_, i) => generateTrend(`trend-${i}`));
}

// Chemistry compatibility rules
export const CHEMISTRY_RULES: Record<string, { compatible: string[], incompatible: string[] }> = {
  'method': { compatible: ['dramatic', 'intense', 'indie-darling'], incompatible: ['comedic', 'quirky'] },
  'comedic': { compatible: ['quirky', 'romantic'], incompatible: ['method', 'intense'] },
  'action-star': { compatible: ['blockbuster', 'intense'], incompatible: ['indie-darling', 'slow'] },
  'indie-darling': { compatible: ['experimental', 'dramatic'], incompatible: ['blockbuster', 'action-star'] },
  'romantic': { compatible: ['comedic', 'dramatic'], incompatible: [] },
  'veteran': { compatible: ['classical', 'dramatic'], incompatible: ['experimental'] },
  'experimental': { compatible: ['indie-darling', 'quirky'], incompatible: ['classical', 'veteran'] }
};

export function calculateChemistry(talent1: Talent, talent2: Talent): number {
  let score = 50; // base chemistry
  
  talent1.chemistryTags.forEach(tag1 => {
    const rules = CHEMISTRY_RULES[tag1];
    if (!rules) return;
    
    talent2.chemistryTags.forEach(tag2 => {
      if (rules.compatible.includes(tag2)) score += 15;
      if (rules.incompatible.includes(tag2)) score -= 20;
    });
  });
  
  return Math.max(0, Math.min(100, score));
}

// v2: Talent gating by reputation
export function generateFriendTalent(role: TalentRole, id: string): Talent {
  // Friends are low-skill, low-fame, but cheap
  return generateTalent(role, id, { min: 2, max: 4 }, { min: 1, max: 2 });
}

export function getAccessibleTalent(allTalent: Talent[], reputation: number): Talent[] {
  // v2: Gate talent by reputation
  // reputation 0-20: only friends (skill 2-4, fame 1-2)
  // reputation 21-40: + low-mid tier (skill 3-6, fame 1-5)
  // reputation 41-70: + mid-high tier (skill 5-8, fame 4-8)
  // reputation 71+: everyone (skill 3-10, fame 1-10)
  
  return allTalent.filter(talent => {
    const talentTier = talent.stats.skill + talent.stats.fame;
    
    if (reputation <= 20) {
      // Only friends: skill 2-4, fame 1-2 (tier 3-6)
      return talentTier <= 6;
    } else if (reputation <= 40) {
      // + low-mid: tier up to 11
      return talentTier <= 11;
    } else if (reputation <= 70) {
      // + mid-high: tier up to 16
      return talentTier <= 16;
    }
    
    // All talent accessible
    return true;
  });
}

export function generateInitialFriendTalent(): Talent[] {
  // v2: Generate 3-4 "friend" actors for the early game
  const pool: Talent[] = [];
  const count = Math.floor(Math.random() * 2) + 3; // 3-4 friends
  
  for (let i = 0; i < count; i++) {
    pool.push(generateFriendTalent('Actor', `friend-${i}`));
  }
  
  return pool;
}
