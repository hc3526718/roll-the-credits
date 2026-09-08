'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Studio, Project, Genre, TutorialProgress, TutorialStep } from './types';
import { generateInitialTalentPool, generateInitialTrends } from './game-data';

interface GameContextType {
  state: GameState;
  initializeGame: (studioName: string, founderName: string, skipTutorial?: boolean) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  updateStudio: (updates: Partial<Studio>) => void;
  setCurrentProject: (project: Project | undefined) => void;
  updateProject: (updates: Partial<Project>) => void;
  completeProject: () => void;
  updateTutorialProgress: (step: TutorialStep) => void;
  advanceWeek: () => void; // v2: Time progression
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'roll-the-credits-save';

function createInitialStudio(name: string, founderName?: string): Studio {
  const genres: Genre[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const tasteVector: Record<Genre, number> = {} as any;
  genres.forEach(g => {
    tasteVector[g] = Math.floor(Math.random() * 50) + 50; // 50-100
  });
  
  return {
    name,
    founder: {
      name: founderName || 'You',
      backstory: 'A VFX artist who couldn\'t break into the big studios and decided to start their own.'
    },
    cash: 25000, // v2: Lower starting cash, tutorial will guide through contracts first
    debt: 0,
    reputation: 10, // v2: Start with very low reputation
    calendar: {
      year: 2024,
      month: 1,
      week: 1
    },
    studioTier: 'garage',
    level: 1,
    audience: {
      size: 100, // v2: Very small initial audience
      tasteVector,
      engagementRate: 0.15 // v2: Lower initial engagement
    },
    talentPool: generateInitialTalentPool(),
    employees: [], // v2: No employees yet, tutorial will guide hiring
    trends: generateInitialTrends(),
    unlocks: {
      maxActors: 2, // v2: Start with just 2 actors (friends)
      maxSupporting: 1,
      availableRoles: ['Actor', 'VFX Artist'], // v2: Start with VFX (founder's skill)
      marketingUnlocked: false,
      testScreeningsUnlocked: false,
      festivalSubmissionUnlocked: false,
      advancedTrendsUnlocked: false
    },
    departments: [], // v2: No departments yet
    activeContracts: [], // v2: Will be introduced in tutorial
    activeEvents: [],
    completedProjects: [],
    daysPassed: 0,
    weeksPassed: 0
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    initialized: false,
    studio: createInitialStudio(''),
    tutorialProgress: {
      active: false,
      currentStep: 'welcome',
      completedSteps: []
    }
  });
  
  useEffect(() => {
    // Try to load save on mount
    const loaded = loadGameFromStorage();
    if (loaded) {
      setState(loaded);
    }
  }, []);
  
  const loadGameFromStorage = (): GameState | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const parsed = JSON.parse(saved);
      return parsed;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  };
  
  const initializeGame = (studioName: string, founderName: string, skipTutorial: boolean = false) => {
    const studio = createInitialStudio(studioName, founderName);
    const newState: GameState = {
      initialized: true,
      studio,
      tutorialProgress: {
        active: !skipTutorial,
        currentStep: skipTutorial ? 'complete' : 'welcome',
        completedSteps: skipTutorial ? ['welcome', 'name-founder', 'explain-calendar', 'show-contracts', 'first-contract', 'explain-projects', 'first-project', 'scene-planner', 'release-results', 'complete'] : []
      }
    };
    setState(newState);
    
    // Auto-save
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }
  };
  
  const saveGame = () => {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save game:', e);
    }
  };
  
  const loadGame = (): boolean => {
    const loaded = loadGameFromStorage();
    if (loaded) {
      setState(loaded);
      return true;
    }
    return false;
  };
  
  const updateStudio = (updates: Partial<Studio>) => {
    setState(prev => ({
      ...prev,
      studio: { ...prev.studio, ...updates }
    }));
    
    // Auto-save after updates
    setTimeout(saveGame, 100);
  };
  
  const setCurrentProject = (project: Project | undefined) => {
    setState(prev => ({
      ...prev,
      studio: { ...prev.studio, currentProject: project }
    }));
    setTimeout(saveGame, 100);
  };
  
  const updateProject = (updates: Partial<Project>) => {
    setState(prev => {
      if (!prev.studio.currentProject) return prev;
      
      return {
        ...prev,
        studio: {
          ...prev.studio,
          currentProject: {
            ...prev.studio.currentProject,
            ...updates
          }
        }
      };
    });
    setTimeout(saveGame, 100);
  };
  
  const completeProject = () => {
    setState(prev => {
      if (!prev.studio.currentProject) return prev;
      
      const completed = prev.studio.currentProject;
      return {
        ...prev,
        studio: {
          ...prev.studio,
          currentProject: undefined,
          completedProjects: [...prev.studio.completedProjects, completed]
        }
      };
    });
    setTimeout(saveGame, 100);
  };
  
  const updateTutorialProgress = (step: TutorialStep) => {
    setState(prev => ({
      ...prev,
      tutorialProgress: {
        ...prev.tutorialProgress,
        currentStep: step,
        completedSteps: [...prev.tutorialProgress.completedSteps, step]
      }
    }));
    setTimeout(saveGame, 100);
  };
  
  const advanceWeek = () => {
    setState(prev => {
      const { calendar, activeContracts } = prev.studio;
      
      // Calculate new calendar
      let { year, month, week } = calendar;
      week += 1;
      if (week > 4) {
        week = 1;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
      
      // Process contract payouts
      const updatedContracts = activeContracts.map(contract => {
        if (!contract.active) return contract;
        
        const weeksRemaining = contract.weeksRemaining - 1;
        const active = weeksRemaining > 0;
        
        return {
          ...contract,
          weeksRemaining,
          active
        };
      });
      
      // Calculate weekly income from contracts and rentals
      let weeklyIncome = 0;
      
      // Contract payouts
      activeContracts.forEach(contract => {
        if (contract.active) {
          weeklyIncome += contract.weeklyPayout;
        }
      });
      
      // Department rentals
      prev.studio.departments.forEach(dept => {
        if (dept.rented && dept.rentWeeksRemaining > 0) {
          weeklyIncome += dept.rentalIncome;
        }
      });
      
      // Update department rental status
      const updatedDepartments = prev.studio.departments.map(dept => {
        if (dept.rented) {
          const rentWeeksRemaining = Math.max(0, dept.rentWeeksRemaining - 1);
          return {
            ...dept,
            rentWeeksRemaining,
            rented: rentWeeksRemaining > 0
          };
        }
        return dept;
      });
      
      return {
        ...prev,
        studio: {
          ...prev.studio,
          calendar: { year, month, week },
          weeksPassed: prev.studio.weeksPassed + 1,
          daysPassed: prev.studio.daysPassed + 7,
          cash: prev.studio.cash + weeklyIncome,
          activeContracts: updatedContracts,
          departments: updatedDepartments
        }
      };
    });
    setTimeout(saveGame, 100);
  };
  
  return (
    <GameContext.Provider value={{
      state,
      initializeGame,
      saveGame,
      loadGame,
      updateStudio,
      setCurrentProject,
      updateProject,
      completeProject,
      updateTutorialProgress,
      advanceWeek
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
