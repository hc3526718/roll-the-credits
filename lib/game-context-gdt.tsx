'use client';

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { GameState, Studio, Project, StaffMember, Contract, ResearchItem, FilmGenre, FilmTone, ProjectFormat } from './types-gdt';
import { createFounder } from './staff-gdt';
import { RESEARCH_TREE } from './research-tree';
import { OFFICE_TIERS } from './office-tiers';

interface GameContextType {
  state: GameState;
  initializeGame: (studioName: string, founderName: string) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  updateStudio: (updates: Partial<Studio>) => void;
  advanceWeek: () => void;
  startResearch: (researchId: string) => void;
  addProject: (project: Project) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  completeProject: (projectId: string) => void;
  acceptContract: (contract: Contract) => void;
  pauseTime: () => void;
  resumeTime: () => void;
  isPaused: boolean;
}

const TICK_DURATION_MS = 3000; // 3 seconds per tick
const TICKS_PER_WEEK = 4;

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'roll-the-credits-gdt-save';

function createInitialStudio(name: string, founderName: string): Studio {
  const founder = createFounder(founderName);
  
  return {
    name,
    founderName,
    officeTier: 'garage',
    cash: 25_000, // Starting cash
    debt: 0,
    reputation: 10,
    fans: 100,
    calendar: {
      year: 2024,
      month: 1,
      week: 1,
      totalWeeks: 0
    },
    currentTick: 0,
    staff: [founder],
    researchTree: RESEARCH_TREE.map(r => ({ ...r, unlocked: false, completed: false, currentProgress: 0 })),
    activeResearch: null,
    activeProjects: [],
    completedProjects: [],
    activeContracts: [],
    // Starting unlocks (basic genres/tones only)
    unlockedGenres: ['Action', 'Drama', 'Thriller'],
    unlockedTones: ['Gritty', 'Serious', 'Modern', 'Classic'],
    unlockedFormats: ['Short', 'Feature'],
    unlockedFeatures: new Set()
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    initialized: false,
    studio: createInitialStudio('', ''),
    tutorialComplete: false
  });
  
  const [isPaused, setIsPaused] = useState(true); // Start paused (on title screen)
  const tickTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Try to load save on mount
    const loaded = loadGameFromStorage();
    if (loaded) {
      setState(loaded);
      setIsPaused(false); // Resume time when loading game
    }
  }, []);
  
  const loadGameFromStorage = (): GameState | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const parsed = JSON.parse(saved);
      // Convert Set back from array
      if (parsed.studio?.unlockedFeatures) {
        parsed.studio.unlockedFeatures = new Set(parsed.studio.unlockedFeatures);
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load game:', e);
      return null;
    }
  };
  
  const initializeGame = (studioName: string, founderName: string) => {
    const studio = createInitialStudio(studioName, founderName);
    const newState: GameState = {
      initialized: true,
      studio,
      tutorialComplete: false
    };
    setState(newState);
    
    // Auto-save
    if (typeof window !== 'undefined') {
      const toSave = {
        ...newState,
        studio: {
          ...newState.studio,
          unlockedFeatures: Array.from(newState.studio.unlockedFeatures)
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  };
  
  const saveGame = () => {
    if (typeof window === 'undefined') return;
    
    try {
      const toSave = {
        ...state,
        studio: {
          ...state.studio,
          unlockedFeatures: Array.from(state.studio.unlockedFeatures)
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
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
    setTimeout(saveGame, 100);
  };
  
  const advanceWeek = () => {
    setState(prev => {
      const { calendar, activeContracts, activeResearch, researchTree, staff } = prev.studio;
      
      // Advance calendar
      let { year, month, week, totalWeeks } = calendar;
      week += 1;
      totalWeeks += 1;
      if (week > 4) {
        week = 1;
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }
      
      // Process contracts
      const updatedContracts = activeContracts.map(c => {
        if (!c.active) return c;
        const weeksRemaining = c.weeksRemaining - 1;
        return {
          ...c,
          weeksRemaining,
          active: weeksRemaining > 0
        };
      });
      
      // Calculate weekly income/expenses
      let weeklyIncome = 0;
      activeContracts.forEach(c => {
        if (c.active) weeklyIncome += c.weeklyPayout;
      });
      
      let weeklyCost = 0;
      staff.forEach(s => {
        if (s.role !== 'founder') weeklyCost += s.salary;
      });
      
      const netWeekly = weeklyIncome - weeklyCost;
      const newCash = prev.studio.cash + netWeekly;
      
      // Process research
      let updatedResearch = activeResearch;
      let updatedResearchTree = [...researchTree];
      let completedResearch: ResearchItem | undefined = undefined;
      
      if (activeResearch) {
        const tierData = OFFICE_TIERS[prev.studio.officeTier];
        const researchSpeed = tierData.researchSpeed;
        
        // Calculate research points from staff
        const researchPoints = staff.reduce((sum, s) => {
          if (!s.busy) return sum + (s.research * researchSpeed);
          return sum;
        }, 0);
        
        updatedResearchTree = researchTree.map(r => {
          if (r.id === activeResearch) {
            const newProgress = r.currentProgress + researchPoints;
            if (newProgress >= r.researchPoints) {
              const completed = { ...r, completed: true, currentProgress: r.researchPoints };
              completedResearch = completed;
              updatedResearch = null;
              return completed;
            }
            return { ...r, currentProgress: newProgress };
          }
          return r;
        });
      }
      
      // Reduce staff burnout slightly each week
      const updatedStaff = staff.map(s => ({
        ...s,
        burnout: Math.max(0, s.burnout - 2)
      }));
      
      // Apply research effects if completed
      let studioUpdates: Partial<Studio> = {
        calendar: { year, month, week, totalWeeks },
        cash: newCash,
        activeContracts: updatedContracts,
        activeResearch: updatedResearch,
        researchTree: updatedResearchTree,
        staff: updatedStaff
      };
      
      // TODO: Apply research effects when completed
      // TypeScript inference issue - will fix in next iteration
      // if (completedResearch) { ... }
      
      return {
        ...prev,
        studio: { ...prev.studio, ...studioUpdates }
      };
    });
    setTimeout(saveGame, 100);
  };
  
  const startResearch = (researchId: string) => {
    setState(prev => ({
      ...prev,
      studio: {
        ...prev.studio,
        activeResearch: researchId
      }
    }));
    setTimeout(saveGame, 100);
  };
  
  const addProject = (project: Project) => {
    setState(prev => ({
      ...prev,
      studio: {
        ...prev.studio,
        activeProjects: [...prev.studio.activeProjects, project]
      }
    }));
    setTimeout(saveGame, 100);
  };
  
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      studio: {
        ...prev.studio,
        activeProjects: prev.studio.activeProjects.map(p =>
          p.id === projectId ? { ...p, ...updates } : p
        )
      }
    }));
    setTimeout(saveGame, 100);
  };
  
  const completeProject = (projectId: string) => {
    setState(prev => {
      const project = prev.studio.activeProjects.find(p => p.id === projectId);
      if (!project) return prev;
      
      return {
        ...prev,
        studio: {
          ...prev.studio,
          activeProjects: prev.studio.activeProjects.filter(p => p.id !== projectId),
          completedProjects: [...prev.studio.completedProjects, project]
        }
      };
    });
    setTimeout(saveGame, 100);
  };
  
  const acceptContract = (contract: Contract) => {
    setState(prev => ({
      ...prev,
      studio: {
        ...prev.studio,
        activeContracts: [...prev.studio.activeContracts, { ...contract, active: true }]
      }
    }));
    setTimeout(saveGame, 100);
  };
  
  const pauseTime = () => {
    setIsPaused(true);
    if (tickTimerRef.current) {
      clearTimeout(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  };
  
  const resumeTime = () => {
    setIsPaused(false);
  };
  
  // Auto-tick system: 4 ticks = 1 week
  useEffect(() => {
    if (!state.initialized || isPaused) {
      return;
    }
    
    const tick = () => {
      setState(prev => {
        const newTick = prev.studio.currentTick + 1;
        
        if (newTick >= TICKS_PER_WEEK) {
          // Week complete, advance week
          return prev; // advanceWeek will be called separately
        }
        
        return {
          ...prev,
          studio: {
            ...prev.studio,
            currentTick: newTick
          }
        };
      });
    };
    
    tickTimerRef.current = setTimeout(tick, TICK_DURATION_MS);
    
    return () => {
      if (tickTimerRef.current) {
        clearTimeout(tickTimerRef.current);
      }
    };
  }, [state.studio.currentTick, state.initialized, isPaused]);
  
  // Auto-advance week when 4 ticks complete
  useEffect(() => {
    if (state.studio.currentTick >= TICKS_PER_WEEK && !isPaused) {
      advanceWeek();
      setState(prev => ({
        ...prev,
        studio: {
          ...prev.studio,
          currentTick: 0
        }
      }));
    }
  }, [state.studio.currentTick, isPaused]);
  
  return (
    <GameContext.Provider value={{
      state,
      initializeGame,
      saveGame,
      loadGame,
      updateStudio,
      advanceWeek,
      startResearch,
      addProject,
      updateProject,
      completeProject,
      acceptContract,
      pauseTime,
      resumeTime,
      isPaused
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
