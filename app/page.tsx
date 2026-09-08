'use client';

import { useGame } from '@/lib/game-context-gdt';
import { useState, useEffect } from 'react';
import { Project, PhaseAllocation, Contract } from '@/lib/types-gdt';
import { calculateBudget, completeProject as calculateResults } from '@/lib/project-gdt';

// Replica Screens
import TitleScreen from '@/components/gdt/TitleScreen';
import OfficeView from '@/components/gdt/OfficeView';
import SettingsPanel from '@/components/gdt/SettingsPanel';
import NewProjectScreen from '@/components/gdt/NewProjectScreen';
import PhaseDevScreenReplica from '@/components/gdt/PhaseDevScreenReplica';
import HiringScreenReplica from '@/components/gdt/HiringScreenReplica';
import ResearchScreenReplica from '@/components/gdt/ResearchScreenReplica';
import ReleaseScreenReplica from '@/components/gdt/ReleaseScreenReplica';
import ContractsBoardReplica from '@/components/gdt/ContractsBoardReplica';

// Generate contract offerings
function generateContracts(): Contract[] {
  const types: Array<'vfx-work' | 'edit-work' | 'sound-work' | 'consulting'> = ['vfx-work', 'edit-work', 'sound-work'];
  return types.map((type, i) => ({
    id: `contract-${Date.now()}-${i}`,
    type,
    title: type === 'vfx-work' ? 'VFX for Commercial' : 
           type === 'edit-work' ? 'Edit Web Series' :
           'Sound Design for Podcast',
    description: `Short-term ${type.replace('-', ' ')} gig for extra income.`,
    totalPayout: 6000 + Math.random() * 6000,
    durationWeeks: 2 + Math.floor(Math.random() * 2),
    weeksRemaining: 2,
    weeklyPayout: 3000,
    active: false
  })).map(c => ({
    ...c,
    weeklyPayout: Math.floor(c.totalPayout / c.durationWeeks)
  }));
}

type Screen = 
  | 'title'
  | 'office'
  | 'settings'
  | 'new-project'
  | 'phase-dev'
  | 'hiring'
  | 'research'
  | 'release'
  | 'contracts';

export default function Home() {
  const { 
    state, 
    initializeGame, 
    loadGame, 
    updateStudio, 
    advanceWeek, 
    startResearch, 
    addProject, 
    updateProject, 
    completeProject: completeProjectInStudio, 
    acceptContract, 
    saveGame,
    pauseTime,
    resumeTime,
    isPaused
  } = useGame();
  
  const [screen, setScreen] = useState<Screen>('title');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  const [releaseResults, setReleaseResults] = useState<any>(null);
  
  // Auto-pause/resume based on screen - MUST be before any returns
  useEffect(() => {
    if (!state.initialized) return; // Safe early exit inside effect
    
    if (screen === 'office') {
      resumeTime(); // Resume on office screen
    } else if (screen !== 'title') {
      pauseTime(); // Pause on all other screens
    }
  }, [screen, state.initialized, resumeTime, pauseTime]);
  
  if (!state.initialized) {
    return (
      <TitleScreen
        onNewGame={(studioName, founderName) => {
          initializeGame(studioName, founderName);
          setAvailableContracts(generateContracts());
          setScreen('office');
        }}
        onContinue={() => {
          const loaded = loadGame();
          if (loaded) {
            if (availableContracts.length === 0) {
              setAvailableContracts(generateContracts());
            }
            setScreen('office');
            return true;
          }
          return false;
        }}
        onReset={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('roll-the-credits-gdt-save');
          }
          window.location.reload();
        }}
      />
    );
  }
  
  const studio = state.studio;
  const currentProject = studio.activeProjects.find(p => p.id === currentProjectId);
  
  // SETTINGS
  if (screen === 'settings') {
    return (
      <SettingsPanel
        onClose={() => setScreen('office')}
        onReset={() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('roll-the-credits-gdt-save');
          }
          window.location.reload();
        }}
      />
    );
  }
  
  // OFFICE VIEW
  if (screen === 'office') {
    return (
      <OfficeView
        studio={studio}
        onNewProject={() => setScreen('new-project')}
        onContinueProject={(id) => {
          setCurrentProjectId(id);
          setScreen('phase-dev');
        }}
        onAdvanceWeek={() => {
          advanceWeek();
          saveGame();
        }}
        onViewContracts={() => setScreen('contracts')}
        onViewResearch={() => setScreen('research')}
        onHireStaff={() => setScreen('hiring')}
        onSettings={() => setScreen('settings')}
      />
    );
  }
  
  // NEW PROJECT
  if (screen === 'new-project') {
    return (
      <NewProjectScreen
        availableGenres={studio.unlockedGenres}
        availableTones={studio.unlockedTones}
        availableFormats={studio.unlockedFormats}
        onConfirm={(projectData) => {
          const budget = calculateBudget(projectData.budgetTier);
          const project: Project = {
            ...projectData,
            budget,
            id: `project-${Date.now()}`,
            assignedStaff: [],
            phaseState: {
              currentPhase: 'phase1',
              phase1Complete: false,
              phase2Complete: false,
              phase3Complete: false,
              timeInCurrentPhase: 0,
              allocation: {
                story: 50,
                script: 50,
                attachments: 50,
                direction: 50,
                cinematography: 50,
                performance: 50,
                editing: 50,
                soundVFX: 50,
                marketing: 50
              }
            },
            scenePlannerDone: false,
            scenePlannerQuality: 0,
            hype: 0,
            expectedFans: 0,
            released: false,
            createdAt: Date.now(),
            weeksElapsed: 0
          };
          addProject(project);
          setCurrentProjectId(project.id);
          saveGame();
          setScreen('phase-dev');
        }}
        onCancel={() => setScreen('office')}
      />
    );
  }
  
  // PHASE DEVELOPMENT
  if (screen === 'phase-dev' && currentProject) {
    return (
      <PhaseDevScreenReplica
        project={currentProject}
        staff={studio.staff}
        onPhaseComplete={(allocation) => {
          // Update project with new allocation
          const updatedAllocation = { ...currentProject.phaseState.allocation, ...allocation };
          updateProject(currentProject.id, { 
            phaseState: { ...currentProject.phaseState, allocation: updatedAllocation }
          });
          
          if (currentProject.phaseState.currentPhase === 'phase3') {
            // Complete project
            const updatedProject = { 
              ...currentProject, 
              phaseState: { ...currentProject.phaseState, allocation: updatedAllocation, phase3Complete: true } 
            };
            const results = calculateResults(
              updatedProject,
              studio.staff.filter(s => currentProject.assignedStaff.includes(s.id)),
              studio.fans
            );
            
            completeProjectInStudio(currentProject.id);
            updateStudio({
              cash: studio.cash + results.boxOffice,
              fans: studio.fans + results.fansGained,
              reputation: Math.min(100, studio.reputation + results.reputationChange)
            });
            setReleaseResults({ ...results, projectName: currentProject.name, genre: currentProject.genre, tone: currentProject.tone });
            saveGame();
            setScreen('release');
          } else {
            // Advance to next phase
            const nextPhase = currentProject.phaseState.currentPhase === 'phase1' ? 'phase2' : 'phase3';
            updateProject(currentProject.id, { 
              phaseState: { 
                ...currentProject.phaseState, 
                currentPhase: nextPhase,
                allocation: updatedAllocation,
                phase1Complete: currentProject.phaseState.currentPhase === 'phase1',
                phase2Complete: currentProject.phaseState.currentPhase === 'phase2'
              }
            });
            saveGame();
          }
        }}
        onShowScenePlanner={() => {
          // Scene planner placeholder
          updateProject(currentProject.id, {
            scenePlannerDone: true,
            scenePlannerQuality: 70 + Math.random() * 20
          });
          saveGame();
        }}
        onBack={() => setScreen('office')}
      />
    );
  }
  
  // HIRING
  if (screen === 'hiring') {
    const { OFFICE_TIERS } = require('@/lib/office-tiers');
    const tierData = OFFICE_TIERS[studio.officeTier];
    
    return (
      <HiringScreenReplica
        currentStaff={studio.staff}
        maxStaff={tierData.maxStaff}
        cash={studio.cash}
        onHire={(newStaff) => {
          updateStudio({ 
            staff: [...studio.staff, newStaff],
            cash: studio.cash - (newStaff.salary * 4)
          });
          saveGame();
          setScreen('office');
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  // RESEARCH
  if (screen === 'research') {
    const { OFFICE_TIERS } = require('@/lib/office-tiers');
    const tierData = OFFICE_TIERS[studio.officeTier];
    
    return (
      <ResearchScreenReplica
        researchTree={studio.researchTree}
        activeResearch={studio.activeResearch}
        hasCreativeLab={tierData.hasCreativeLab}
        officeTier={studio.officeTier}
        onStartResearch={(id) => {
          startResearch(id);
          saveGame();
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  // RELEASE
  if (screen === 'release' && releaseResults) {
    return (
      <ReleaseScreenReplica
        projectName={releaseResults.projectName}
        genre={releaseResults.genre}
        tone={releaseResults.tone}
        results={releaseResults}
        onContinue={() => {
          setReleaseResults(null);
          setCurrentProjectId(null);
          setScreen('office');
        }}
      />
    );
  }
  
  // CONTRACTS
  if (screen === 'contracts') {
    const activeContracts = studio.activeContracts.filter(c => c.active);
    const availableForAcceptance = availableContracts.filter(c => !c.active);
    
    return (
      <ContractsBoardReplica
        activeContracts={activeContracts}
        availableContracts={availableForAcceptance}
        onAccept={(contract) => {
          acceptContract(contract);
          setAvailableContracts(prev => prev.filter(c => c.id !== contract.id));
          saveGame();
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
}
