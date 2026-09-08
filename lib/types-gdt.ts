// Roll the Credits - GDT Spine Types

// ===== CALENDAR & TIME =====
export interface GameCalendar {
  year: number;
  month: number; // 1-12
  week: number; // 1-4
  totalWeeks: number; // Total weeks since start
}

// ===== OFFICE TIERS (GDT-style progression) =====
export type OfficeTier = 'garage' | 'first-studio' | 'upgraded-studio' | 'large-lot' | 'late-game';

export interface OfficeTierData {
  tier: OfficeTier;
  displayName: string;
  unlockCash: number; // Cash requirement
  unlockWeeks?: number; // Time gate (optional, some tiers have it)
  unlockStaffCount?: number; // Staff count requirement
  maxStaff: number;
  maxProjects: number; // Concurrent projects
  researchSpeed: number; // Multiplier
  canResearch: boolean;
  canHireSpecialists: boolean;
  hasCreativeLab: boolean;
}

// ===== GENRE & TOPIC COMBOS (GDT-style) =====
export type FilmGenre = 
  | 'Action' | 'Drama' | 'Comedy' | 'Horror' | 'Thriller' 
  | 'Romance' | 'Sci-Fi' | 'Fantasy' | 'Documentary' | 'Musical';

export type FilmTone = 
  | 'Gritty' | 'Uplifting' | 'Dark' | 'Whimsical' | 'Serious' 
  | 'Satirical' | 'Nostalgic' | 'Experimental' | 'Classic' | 'Modern';

export interface GenreTopping {
  genre: FilmGenre;
  tone: FilmTone;
  compatibility: 'great' | 'good' | 'neutral' | 'poor'; // Affects scores
  unlocked: boolean;
}

// ===== PROJECT FORMAT (Owner Design early formats) =====
export type ProjectFormat = 
  | 'Social-Video'      // Early: Short-form social content
  | 'Short-Film'        // Early: Traditional short film
  | 'Music-Video'       // Early: Music video production
  | 'Commercial'        // Early: Advertising content
  | 'Micro-Doc'         // Early: Short documentary
  | 'Feature'           // Unlock later
  | 'Limited-Series'    // Unlock later
  | 'Franchise-Film';   // Unlock later

export type BudgetTier = 'Micro' | 'Low' | 'Medium' | 'High' | 'Blockbuster';

// ===== PROJECT TOPIC (Owner Design: hidden combos) =====
export type ProjectTopic = 
  | 'Technology' | 'Nature' | 'Urban-Life' | 'Relationships' | 'Adventure'
  | 'Mystery' | 'History' | 'Future' | 'Art' | 'Sports';

// ===== 5-STAGE DEVELOPMENT (Owner Design) =====
export type DevelopmentStage = 'planning' | 'recruitment' | 'filming' | 'post' | 'marketing';

export interface StageAllocation {
  // Planning (3 sliders, 100-pt pool)
  scriptStory: number;
  storyboardPreviz: number;
  budgetSchedule: number;
  
  // Recruitment (3 sliders, 100-pt pool)
  casting: number;
  crew: number;
  locations: number;
  
  // Filming (3 sliders, 100-pt pool)
  cinematography: number;
  performance: number;
  productionDesign: number;
  
  // Post (3 sliders, 100-pt pool)
  editing: number;
  soundScore: number;
  vfxGrade: number;
  
  // Marketing (3 sliders, 100-pt pool)
  trailerCampaign: number;
  press: number;
  distributionRelease: number;
}

export interface ProjectStageState {
  currentStage: DevelopmentStage;
  planningComplete: boolean;
  recruitmentComplete: boolean;
  filmingComplete: boolean;
  postComplete: boolean;
  marketingComplete: boolean;
  timeInCurrentStage: number;
  allocation: StageAllocation;
}

// Legacy aliases for backward compatibility during migration
export type DevelopmentPhase = DevelopmentStage;
export type PhaseAllocation = StageAllocation;
export type ProjectPhaseState = ProjectStageState;

// ===== RESEARCH TREE (GDT-style) =====
export type ResearchCategory = 
  | 'audiences' | 'marketing' | 'franchises' | 'genres' 
  | 'production' | 'distribution' | 'creative-lab';

export interface ResearchItem {
  id: string;
  category: ResearchCategory;
  name: string;
  description: string;
  researchPoints: number; // Time to complete
  currentProgress: number;
  unlocked: boolean;
  completed: boolean;
  prerequisites: string[]; // Other research IDs
  requiresCreativeLab?: boolean;
  effects: {
    unlocksGenre?: FilmGenre;
    unlocksTone?: FilmTone;
    unlocksFormat?: ProjectFormat;
    unlocksFeature?: string; // e.g., "Sequels", "Target-Audience"
    boostFans?: number;
    boostQuality?: number;
  };
}

// ===== STAFF (GDT Design/Tech split) =====
export type StaffRole = 'founder' | 'writer' | 'director' | 'editor' | 'vfx-artist' | 'producer';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  
  // Owner Design attributes
  craft: number;        // Technical skill (1-10)
  taste: number;        // Creative sense (1-10)
  speed: number;        // Work speed (1-10)
  reliability: number;  // Consistency (1-10)
  network: number;      // Connections (1-10)
  rep: number;          // Reputation (1-10)
  cost: number;         // Salary/rate
  
  // Legacy GDT stats (for compatibility)
  design: number;       // Story/Art (maps to taste)
  tech: number;         // Craft/VFX (maps to craft)
  research: number;     // Research contribution (1-10)
  
  level: number; // 1-5
  xp: number;
  salary: number; // Per week (alias for cost)
  
  // State
  busy: boolean;
  assignedTo?: string; // Project ID
  burnout: number; // 0-100 (high = needs vacation)
  
  // Specialization (unlocked at higher studio tiers)
  specialization?: 'Story' | 'Visuals' | 'Sound' | 'Marketing' | 'Research';
}

// ===== PROJECT =====
export interface Project {
  id: string;
  name: string;
  format: ProjectFormat;
  topic: ProjectTopic;  // Owner Design: Topic × Genre combos
  genre: FilmGenre;
  tone: FilmTone;
  budgetTier: BudgetTier;
  budget: number;
  
  // Development state
  phaseState: ProjectPhaseState; // Using legacy alias
  assignedStaff: string[]; // Staff IDs
  
  // Scene planner integration (ONE beat in filming stage)
  scenePlannerDone: boolean;
  scenePlannerQuality?: number; // 0-100
  
  // Pre-release
  hype: number; // 0-100
  expectedFans: number;
  
  // Results (after release)
  released: boolean;
  releaseDate?: number; // timestamp
  results?: ProjectResults;
  
  createdAt: number;
  weeksElapsed: number;
}

export interface ProjectResults {
  overallQuality: number; // 0-100
  criticScores: CriticScore[];
  averageCriticScore: number;
  fanScore: number; // 0-100
  
  boxOffice: number; // Total revenue
  fansGained: number;
  reputationChange: number;
  
  // Sales over time (not instant)
  weeklySales: { week: number; sales: number }[];
}

export interface CriticScore {
  outlet: string;
  score: number; // 0-100
}

// ===== CONTRACTS (kept from v2, simplified) =====
export type ContractType = 'vfx-work' | 'edit-work' | 'sound-work' | 'consulting';

export interface Contract {
  id: string;
  type: ContractType;
  title: string;
  description: string;
  totalPayout: number;
  durationWeeks: number;
  weeksRemaining: number;
  weeklyPayout: number;
  active: boolean;
}

// ===== STUDIO STATE =====
export interface Studio {
  name: string;
  founderName: string;
  
  // Meta progression
  officeTier: OfficeTier;
  cash: number;
  debt: number;
  reputation: number; // 0-100
  fans: number; // Total fanbase
  
  // Time
  calendar: GameCalendar;
  currentTick: number; // 0-3, auto-advances every ~3 seconds
  
  // Staff
  staff: StaffMember[];
  
  // Research
  researchTree: ResearchItem[];
  activeResearch: string | null; // Current research ID
  
  // Projects
  activeProjects: Project[];
  completedProjects: Project[];
  
  // Contracts
  activeContracts: Contract[];
  
  // Unlocks (from research)
  unlockedTopics: ProjectTopic[];   // Owner Design
  unlockedGenres: FilmGenre[];
  unlockedTones: FilmTone[];
  unlockedFormats: ProjectFormat[];
  unlockedFeatures: Set<string>; // e.g., "Sequels", "Multi-genre"
}

// ===== GAME STATE =====
export interface GameState {
  studio: Studio;
  initialized: boolean;
  tutorialComplete: boolean;
}

// ===== COMBO DATA =====
export interface ComboRating {
  genre: FilmGenre;
  tone: FilmTone;
  rating: 'great' | 'good' | 'neutral' | 'poor';
  audienceBoost: number;
  qualityBoost: number;
}
