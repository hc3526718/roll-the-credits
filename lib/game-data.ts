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

export function generateTalent(role: TalentRole, id: string): Talent {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  const skill = Math.floor(Math.random() * 7) + 3; // 3-10
  const fame = Math.floor(Math.random() * 10) + 1; // 1-10
  
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
