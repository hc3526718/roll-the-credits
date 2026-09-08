// Research tree (GDT-style time-gated unlocks)

import { ResearchItem, FilmGenre, FilmTone, ProjectFormat } from './types-gdt';

export const RESEARCH_TREE: ResearchItem[] = [
  // ===== EARLY RESEARCH (First Studio) =====
  {
    id: 'target-audience',
    category: 'audiences',
    name: 'Target Audience',
    description: 'Learn to identify and target specific demographics.',
    researchPoints: 80,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: [],
    effects: { unlocksFeature: 'Target-Audience', boostFans: 10 }
  },
  
  {
    id: 'marketing-basics',
    category: 'marketing',
    name: 'Marketing Basics',
    description: 'Understand basic promotional strategies.',
    researchPoints: 100,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: [],
    effects: { unlocksFeature: 'Marketing', boostFans: 15 }
  },
  
  {
    id: 'comedy-genre',
    category: 'genres',
    name: 'Comedy Films',
    description: 'Learn to make audiences laugh.',
    researchPoints: 60,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: [],
    effects: { unlocksGenre: 'Comedy' }
  },
  
  {
    id: 'horror-genre',
    category: 'genres',
    name: 'Horror Films',
    description: 'Master the art of fear and suspense.',
    researchPoints: 80,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: [],
    effects: { unlocksGenre: 'Horror' }
  },
  
  {
    id: 'romance-genre',
    category: 'genres',
    name: 'Romance Films',
    description: 'Tell heartfelt love stories.',
    researchPoints: 70,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: [],
    effects: { unlocksGenre: 'Romance' }
  },
  
  // ===== MID-TIER RESEARCH =====
  {
    id: 'limited-series',
    category: 'production',
    name: 'Limited Series',
    description: 'Produce episodic content.',
    researchPoints: 120,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['target-audience'],
    effects: { unlocksFormat: 'Limited-Series' }
  },
  
  {
    id: 'sequels-franchises',
    category: 'franchises',
    name: 'Sequels & Franchises',
    description: 'Build cinematic universes and follow-ups.',
    researchPoints: 150,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['marketing-basics'],
    effects: { unlocksFeature: 'Sequels', unlocksFormat: 'Franchise-Film' }
  },
  
  {
    id: 'scifi-genre',
    category: 'genres',
    name: 'Sci-Fi Films',
    description: 'Explore futuristic and speculative stories.',
    researchPoints: 140,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['comedy-genre', 'horror-genre'],
    effects: { unlocksGenre: 'Sci-Fi' }
  },
  
  {
    id: 'fantasy-genre',
    category: 'genres',
    name: 'Fantasy Films',
    description: 'Create magical worlds.',
    researchPoints: 150,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['comedy-genre', 'horror-genre'],
    effects: { unlocksGenre: 'Fantasy' }
  },
  
  {
    id: 'documentary',
    category: 'genres',
    name: 'Documentaries',
    description: 'Non-fiction storytelling.',
    researchPoints: 100,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['target-audience'],
    effects: { unlocksGenre: 'Documentary' }
  },
  
  {
    id: 'festival-circuit',
    category: 'distribution',
    name: 'Festival Circuit',
    description: 'Access prestigious film festivals.',
    researchPoints: 180,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['marketing-basics'],
    effects: { unlocksFeature: 'Festivals', boostQuality: 10 }
  },
  
  {
    id: 'multi-genre',
    category: 'genres',
    name: 'Genre-Bending',
    description: 'Mix multiple genres in one project.',
    researchPoints: 200,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['scifi-genre', 'fantasy-genre'],
    effects: { unlocksFeature: 'Multi-Genre' }
  },
  
  // ===== CREATIVE LAB RESEARCH (Requires Large Lot) =====
  {
    id: 'virtual-production',
    category: 'creative-lab',
    name: 'Virtual Production',
    description: 'LED volumes and real-time rendering.',
    researchPoints: 300,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['scifi-genre'],
    requiresCreativeLab: true,
    effects: { unlocksFeature: 'Virtual-Production', boostQuality: 20 }
  },
  
  {
    id: 'advanced-vfx',
    category: 'creative-lab',
    name: 'Advanced VFX Pipeline',
    description: 'Cutting-edge visual effects.',
    researchPoints: 350,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['virtual-production'],
    requiresCreativeLab: true,
    effects: { unlocksFeature: 'Advanced-VFX', boostQuality: 25 }
  },
  
  {
    id: 'streaming-deals',
    category: 'distribution',
    name: 'Streaming Platforms',
    description: 'Direct-to-streaming distribution.',
    researchPoints: 250,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['festival-circuit', 'limited-series'],
    requiresCreativeLab: true,
    effects: { unlocksFeature: 'Streaming', boostFans: 30 }
  },
  
  {
    id: 'musical-genre',
    category: 'genres',
    name: 'Musical Films',
    description: 'Song and dance spectacles.',
    researchPoints: 280,
    currentProgress: 0,
    unlocked: false,
    completed: false,
    prerequisites: ['fantasy-genre'],
    requiresCreativeLab: true,
    effects: { unlocksGenre: 'Musical' }
  }
];

export function getAvailableResearch(
  completedIds: string[],
  hasCreativeLab: boolean
): ResearchItem[] {
  return RESEARCH_TREE.filter(item => {
    // Already completed
    if (completedIds.includes(item.id)) return false;
    
    // Needs Creative Lab but don't have it
    if (item.requiresCreativeLab && !hasCreativeLab) return false;
    
    // Check prerequisites
    const prereqsMet = item.prerequisites.every(prereqId => 
      completedIds.includes(prereqId)
    );
    
    return prereqsMet;
  });
}

export function canStartResearch(
  researchId: string,
  completedIds: string[],
  hasCreativeLab: boolean,
  activeResearchId: string | null
): boolean {
  if (activeResearchId) return false; // Already researching something
  
  const item = RESEARCH_TREE.find(r => r.id === researchId);
  if (!item) return false;
  
  if (item.requiresCreativeLab && !hasCreativeLab) return false;
  
  return item.prerequisites.every(prereqId => completedIds.includes(prereqId));
}

export function applyResearchEffects(
  research: ResearchItem,
  studio: any // Will type properly when integrating
): any {
  const updates: any = {};
  
  if (research.effects.unlocksGenre) {
    updates.unlockedGenres = [...(studio.unlockedGenres || []), research.effects.unlocksGenre];
  }
  
  if (research.effects.unlocksTone) {
    updates.unlockedTones = [...(studio.unlockedTones || []), research.effects.unlocksTone];
  }
  
  if (research.effects.unlocksFormat) {
    updates.unlockedFormats = [...(studio.unlockedFormats || []), research.effects.unlocksFormat];
  }
  
  if (research.effects.unlocksFeature) {
    updates.unlockedFeatures = new Set([...(studio.unlockedFeatures || []), research.effects.unlocksFeature]);
  }
  
  if (research.effects.boostFans) {
    updates.fans = (studio.fans || 0) + research.effects.boostFans;
  }
  
  return updates;
}
