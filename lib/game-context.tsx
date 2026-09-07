'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Studio, Project, Genre } from './types';
import { generateInitialTalentPool, generateInitialTrends } from './game-data';

interface GameContextType {
  state: GameState;
  initializeGame: (studioName: string) => void;
  saveGame: () => void;
  loadGame: () => boolean;
  updateStudio: (updates: Partial<Studio>) => void;
  setCurrentProject: (project: Project | undefined) => void;
  updateProject: (updates: Partial<Project>) => void;
  completeProject: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'roll-the-credits-save';

function createInitialStudio(name: string): Studio {
  const genres: Genre[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const tasteVector: Record<Genre, number> = {} as any;
  genres.forEach(g => {
    tasteVector[g] = Math.floor(Math.random() * 50) + 50; // 50-100
  });
  
  return {
    name,
    cash: 100000,
    reputation: 50,
    officeTier: 'garage',
    audience: {
      size: 1000,
      tasteVector,
      engagementRate: 0.3
    },
    talentPool: generateInitialTalentPool(),
    trends: generateInitialTrends(),
    completedProjects: [],
    daysPassed: 0
  };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>({
    initialized: false,
    studio: createInitialStudio(''),
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
  
  const initializeGame = (studioName: string) => {
    const studio = createInitialStudio(studioName);
    const newState: GameState = {
      initialized: true,
      studio,
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
  
  return (
    <GameContext.Provider value={{
      state,
      initializeGame,
      saveGame,
      loadGame,
      updateStudio,
      setCurrentProject,
      updateProject,
      completeProject
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
