// Core game types for Roll the Credits

export type ProjectFormat = 'Feature' | 'Limited Series' | 'Short';
export type Genre = 'Action' | 'Drama' | 'Comedy' | 'Horror' | 'Romance' | 'Thriller' | 'Sci-Fi' | 'Fantasy';
export type BudgetTier = 'Micro' | 'Low' | 'Mid' | 'High';

export type TalentRole = 'Actor' | 'Director' | 'Writer' | 'Cinematographer' | 'Editor';

export interface ChemistryTag {
  tag: string;
  compatible: string[];
  incompatible: string[];
}

export interface Talent {
  id: string;
  name: string;
  role: TalentRole;
  stats: {
    skill: number; // 1-10
    fame: number; // 1-10
    energy: number; // 0-100
  };
  chemistryTags: string[]; // e.g., 'veteran', 'method', 'comedic', 'intense', 'romantic'
  salary: number;
  busy: boolean;
}

export interface Trend {
  id: string;
  name: string;
  genre: Genre;
  strength: number; // 0-100, decays over time
  audienceBoost: number;
  criticPenalty: number;
}

export interface Audience {
  size: number; // total followers
  tasteVector: Record<Genre, number>; // preference weights
  engagementRate: number; // 0-1
}

export type SceneSetting = 'Interior' | 'Exterior-Day' | 'Exterior-Night' | 'Special-Effects';

export interface ScenePanel {
  setting: SceneSetting;
  characters: string[]; // Talent IDs
  position: number; // panel order 0-4
}

export interface StoryOutcome {
  quality: number; // 0-100
  tags: string[]; // e.g., 'romance', 'betrayal', 'twist', 'comedy', 'death'
  audienceAppeal: number; // modifier
  criticAppeal: number; // modifier
}

export type ProductionPhase = 'concept' | 'hiring' | 'scene-planning' | 'production' | 'editing' | 'released';

export interface ProductionDecision {
  id: string;
  text: string;
  options: {
    label: string;
    cost?: number;
    effect: string;
  }[];
}

export interface EditChoice {
  pacing: 'slow' | 'medium' | 'fast';
  coldOpen: boolean;
  cutScenes: number; // 0-2
  titleEnergy: 'subtle' | 'bold' | 'viral';
  thumbnailStyle: 'artistic' | 'dramatic' | 'clickbait';
}

export interface Project {
  id: string;
  name: string;
  format: ProjectFormat;
  genre: Genre;
  budgetTier: BudgetTier;
  budget: number;
  spent: number;
  
  assignedTalent: Talent[];
  scenes: ScenePanel[];
  storyOutcome?: StoryOutcome;
  
  phase: ProductionPhase;
  productionProgress: number; // 0-100
  productionDecisionsMade: string[];
  
  editChoices?: EditChoice;
  
  results?: {
    audienceScore: number; // 0-100
    criticScore: number; // 0-100
    revenue: number;
    followersGained: number;
    reputationChange: number;
  };
  
  createdAt: number;
  releasedAt?: number;
}

export interface Studio {
  name: string;
  cash: number;
  reputation: number; // 0-100
  officeTier: 'garage' | 'small' | 'medium' | 'large';
  
  audience: Audience;
  talentPool: Talent[];
  trends: Trend[];
  
  currentProject?: Project;
  completedProjects: Project[];
  
  daysPassed: number;
}

export interface GameState {
  studio: Studio;
  initialized: boolean;
}
