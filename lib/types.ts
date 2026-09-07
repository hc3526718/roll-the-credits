// Core game types for Roll the Credits

export type ProjectFormat = 'Feature' | 'Limited Series' | 'Short';
export type Genre = 'Action' | 'Drama' | 'Comedy' | 'Horror' | 'Romance' | 'Thriller' | 'Sci-Fi' | 'Fantasy';
export type BudgetTier = 'Micro' | 'Low' | 'Mid' | 'High';

export type TalentRole = 'Actor' | 'Director' | 'Writer' | 'Cinematographer' | 'Editor' | 'Sound Designer' | 'VFX Artist' | 'Composer' | 'Producer';

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
  id: string;
  setting: SceneSetting;
  characters: string[]; // Talent IDs - can appear in multiple scenes
  position: number; // panel order 0-4
  importance: 'key' | 'supporting' | 'transition'; // Scene weight
}

export interface StoryOutcome {
  quality: number; // 0-100
  tags: string[]; // e.g., 'romance', 'betrayal', 'twist', 'comedy', 'death'
  audienceAppeal: number; // modifier
  criticAppeal: number; // modifier
}

export type ProductionPhase = 
  | 'concept' 
  | 'planning'        // Development - Writer, script decisions
  | 'preproduction'   // Pre-vis - Cinematographer, schedule
  | 'filming'         // Production - Scene planner, filming decisions
  | 'postproduction'  // Post - Editor, Sound, VFX
  | 'marketing'       // Distribution - Campaign strategy
  | 'released';

export interface StageDecision {
  id: string;
  stage: ProductionPhase;
  text: string;
  description: string;
  options: {
    id: string;
    label: string;
    description: string;
    cost?: number;
    timeWeeks?: number;
    qualityMod?: number;
    audienceMod?: number;
    criticMod?: number;
    riskLevel?: 'low' | 'medium' | 'high';
  }[];
}

export interface StageProgress {
  stage: ProductionPhase;
  progress: number; // 0-100
  weeksElapsed: number;
  decisionsMade: string[];
  currentDecision?: StageDecision;
}

export interface EditChoice {
  pacing: 'slow' | 'medium' | 'fast';
  coldOpen: boolean;
  cutScenes: number; // 0-2
  titleEnergy: 'subtle' | 'bold' | 'viral';
  thumbnailStyle: 'artistic' | 'dramatic' | 'clickbait';
}

export interface ProjectResults {
  audienceScore: number; // 0-100
  criticScore: number; // 0-100
  revenue: number;
  followersGained: number;
  reputationChange: number;
}

export interface Project {
  id: string;
  name: string;
  format: ProjectFormat;
  genre: Genre;
  budgetTier: BudgetTier;
  budget: number;
  spent: number;
  remainingBudget: number;
  
  assignedTalent: Talent[]; // All crew across all stages
  scenes: ScenePanel[];
  storyOutcome?: StoryOutcome;
  
  phase: ProductionPhase;
  stageProgress: StageProgress;
  allDecisionsMade: { stage: ProductionPhase; decisionId: string; choiceId: string }[];
  
  // Stage-specific data
  scriptQuality?: number;
  cinematographyQuality?: number;
  editingQuality?: number;
  soundQuality?: number;
  vfxQuality?: number;
  marketingReach?: number;
  
  editChoices?: EditChoice;
  
  results?: ProjectResults;
  
  weeksElapsed: number;
  createdAt: number;
  releasedAt?: number;
}

export type IndustryEventType = 
  | 'writer-strike'
  | 'actor-burnout'
  | 'union-action'
  | 'festival-invite'
  | 'streaming-war'
  | 'weather-delay'
  | 'test-screening-leak'
  | 'awards-buzz';

export interface IndustryEvent {
  id: string;
  type: IndustryEventType;
  name: string;
  description: string;
  startDay: number;
  duration: number; // days
  effects: {
    blockedRoles?: TalentRole[];
    salaryModifier?: number;
    audienceBoost?: number;
    criticBoost?: number;
    reputationChange?: number;
  };
}

export interface StudioUnlocks {
  maxActors: number;
  maxSupporting: number;
  availableRoles: TalentRole[];
  marketingUnlocked: boolean;
  testScreeningsUnlocked: boolean;
  festivalSubmissionUnlocked: boolean;
  advancedTrendsUnlocked: boolean;
}

export interface Studio {
  name: string;
  cash: number;
  reputation: number; // 0-100
  officeTier: 'garage' | 'small' | 'medium' | 'large';
  level: number; // Studio level for progression
  
  audience: Audience;
  talentPool: Talent[];
  trends: Trend[];
  unlocks: StudioUnlocks;
  activeEvents: IndustryEvent[];
  
  currentProject?: Project;
  completedProjects: Project[];
  
  daysPassed: number;
  weeksPassed: number;
}

export interface GameState {
  studio: Studio;
  initialized: boolean;
}
