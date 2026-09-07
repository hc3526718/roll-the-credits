'use client';

import { useGame } from '@/lib/game-context';
import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import OfficeView from '@/components/OfficeView';
import ConceptPhase from '@/components/ConceptPhase';
import HiringPhase from '@/components/HiringPhase';
import ScenePlanner from '@/components/ScenePlanner';
import ProductionPhase from '@/components/ProductionPhase';
import EditingPhase from '@/components/EditingPhase';
import ResultsScreen from '@/components/ResultsScreen';
import { Project, Talent, ScenePanel, EditChoice } from '@/lib/types';
import { calculateBudget, analyzeSceneQuality, calculateProjectResults, updateTrends } from '@/lib/game-logic';

type GameScreen = 'start' | 'office' | 'concept' | 'hiring' | 'scene-planning' | 'production' | 'editing' | 'results';

export default function Home() {
  const { state, initializeGame, loadGame, updateStudio, setCurrentProject, updateProject, completeProject } = useGame();
  const [screen, setScreen] = useState<GameScreen>('start');
  const [projectDraft, setProjectDraft] = useState<Partial<Project>>({});
  
  if (!state.initialized && screen !== 'start') {
    return (
      <StartScreen
        onStart={(name) => {
          initializeGame(name);
          setScreen('office');
        }}
        onLoad={() => {
          const loaded = loadGame();
          if (loaded) {
            setScreen('office');
            return true;
          }
          return false;
        }}
      />
    );
  }
  
  if (screen === 'start') {
    return (
      <StartScreen
        onStart={(name) => {
          initializeGame(name);
          setScreen('office');
        }}
        onLoad={() => {
          const loaded = loadGame();
          if (loaded) {
            setScreen('office');
            return true;
          }
          return false;
        }}
      />
    );
  }
  
  const studio = state.studio;
  
  // CONCEPT PHASE
  if (screen === 'concept') {
    return (
      <ConceptPhase
        studio={studio}
        onConfirm={({ name, format, genre, budgetTier }) => {
          const budget = calculateBudget(format, budgetTier);
          
          const project: Project = {
            id: `project-${Date.now()}`,
            name,
            format,
            genre,
            budgetTier,
            budget,
            spent: 0,
            assignedTalent: [],
            scenes: [],
            phase: 'hiring',
            productionProgress: 0,
            productionDecisionsMade: [],
            createdAt: Date.now()
          };
          
          setProjectDraft(project);
          setCurrentProject(project);
          updateStudio({ cash: studio.cash - budget });
          setScreen('hiring');
        }}
        onCancel={() => setScreen('office')}
      />
    );
  }
  
  // HIRING PHASE
  if (screen === 'hiring' && studio.currentProject) {
    return (
      <HiringPhase
        studio={studio}
        budget={studio.currentProject.budget}
        onConfirm={(hired) => {
          const totalSalary = hired.reduce((sum, t) => sum + t.salary, 0);
          
          updateProject({
            assignedTalent: hired,
            spent: totalSalary,
            phase: 'scene-planning'
          });
          
          // Mark talent as busy
          updateStudio({
            talentPool: studio.talentPool.map(t =>
              hired.find(h => h.id === t.id) ? { ...t, busy: true } : t
            )
          });
          
          setScreen('scene-planning');
        }}
        onBack={() => {
          // Refund budget and cancel project
          updateStudio({ cash: studio.cash + studio.currentProject!.budget });
          setCurrentProject(undefined);
          setScreen('office');
        }}
      />
    );
  }
  
  // SCENE PLANNING PHASE
  if (screen === 'scene-planning' && studio.currentProject) {
    return (
      <ScenePlanner
        talent={studio.currentProject.assignedTalent}
        onConfirm={(scenes) => {
          const storyOutcome = analyzeSceneQuality(
            scenes,
            studio.currentProject!.assignedTalent,
            studio.currentProject!.genre
          );
          
          updateProject({
            scenes,
            storyOutcome,
            phase: 'production'
          });
          
          setScreen('production');
        }}
        onBack={() => setScreen('hiring')}
      />
    );
  }
  
  // PRODUCTION PHASE
  if (screen === 'production' && studio.currentProject) {
    return (
      <ProductionPhase
        project={studio.currentProject}
        onComplete={() => {
          updateProject({
            productionProgress: 100,
            phase: 'editing'
          });
          setScreen('editing');
        }}
      />
    );
  }
  
  // EDITING PHASE
  if (screen === 'editing' && studio.currentProject) {
    return (
      <EditingPhase
        onConfirm={(editChoices) => {
          const project = studio.currentProject!;
          const results = calculateProjectResults(
            { ...project, editChoices },
            studio
          );
          
          // Apply results to studio
          const newCash = studio.cash + results.revenue;
          const newReputation = Math.max(0, Math.min(100, studio.reputation + results.reputationChange));
          const newFollowers = studio.audience.size + results.followersGained;
          
          updateProject({
            editChoices,
            results,
            phase: 'released',
            releasedAt: Date.now()
          });
          
          updateStudio({
            cash: newCash,
            reputation: newReputation,
            audience: {
              ...studio.audience,
              size: newFollowers
            },
            daysPassed: studio.daysPassed + 30
          });
          
          // Update trends
          const updatedStudio = {
            ...studio,
            cash: newCash,
            reputation: newReputation,
            audience: { ...studio.audience, size: newFollowers }
          };
          updateTrends(updatedStudio);
          updateStudio({ trends: updatedStudio.trends });
          
          setScreen('results');
        }}
      />
    );
  }
  
  // RESULTS SCREEN
  if (screen === 'results' && studio.currentProject?.results) {
    const currentProject = studio.currentProject;
    return (
      <ResultsScreen
        project={currentProject}
        onContinue={() => {
          // Free up talent
          const freedTalent = currentProject.assignedTalent;
          updateStudio({
            talentPool: studio.talentPool.map(t =>
              freedTalent.find(f => f.id === t.id) ? { ...t, busy: false, stats: { ...t.stats, energy: 100 } } : t
            )
          });
          
          completeProject();
          setScreen('office');
        }}
      />
    );
  }
  
  // OFFICE VIEW (default)
  return (
    <OfficeView
      studio={studio}
      onNewProject={() => setScreen('concept')}
      onContinueProject={() => {
        if (studio.currentProject) {
          setScreen(studio.currentProject.phase as GameScreen);
        }
      }}
    />
  );
}
