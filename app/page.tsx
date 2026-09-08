'use client';

import { useGame } from '@/lib/game-context-gdt';
import { useState } from 'react';
import { Project, PhaseAllocation, StaffMember, Contract } from '@/lib/types-gdt';
import { calculateBudget, completeProject as calculateResults, getPhaseTime } from '@/lib/project-gdt';

// Screens
import TitleScreen from '@/components/gdt/TitleScreen';
import OfficeView from '@/components/gdt/OfficeView';
import NewProjectScreen from '@/components/gdt/NewProjectScreen';
import PhaseDevScreen from '@/components/gdt/PhaseDevScreen';
import HiringScreen from '@/components/gdt/HiringScreen';
import ResearchScreen from '@/components/gdt/ResearchScreen';
import ReleaseScreen from '@/components/gdt/ReleaseScreen';
import ContractsBoard from '@/components/gdt/ContractsBoard';

// Generate some contract offerings
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
  | 'new-project'
  | 'phase-dev'
  | 'hiring'
  | 'research'
  | 'release'
  | 'contracts';

export default function Home() {
  const { state, initializeGame, loadGame, updateStudio, advanceWeek, startResearch, addProject, updateProject, completeProject: completeProjectInStudio, acceptContract, saveGame } = useGame();
  
  const [screen, setScreen] = useState<Screen>('title');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  
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
        onConfirm={({ name, genre, tone, format, budgetTier }) => {
          const budget = calculateBudget(budgetTier);
          
          const project: Project = {
            id: `project-${Date.now()}`,
            name,
            genre,
            tone,
            format,
            budgetTier,
            budget,
            phaseState: {
              currentPhase: 'phase1',
              phase1Complete: false,
              phase2Complete: false,
              phase3Complete: false,
              timeInCurrentPhase: 0,
              allocation: {
                story: 50, script: 50, attachments: 50,
                direction: 50, cinematography: 50, performance: 50,
                editing: 50, soundVFX: 50, marketing: 50
              }
            },
            assignedStaff: studio.staff.map(s => s.id), // Assign all staff
            scenePlannerDone: false,
            hype: 50,
            expectedFans: 100,
            released: false,
            createdAt: Date.now(),
            weeksElapsed: 0
          };
          
          addProject(project);
          updateStudio({ cash: studio.cash - budget });
          setCurrentProjectId(project.id);
          setScreen('phase-dev');
        }}
        onCancel={() => setScreen('office')}
      />
    );
  }
  
  // PHASE DEVELOPMENT
  if (screen === 'phase-dev' && currentProject) {
    return (
      <PhaseDevScreen
        project={currentProject}
        staff={studio.staff}
        onPhaseComplete={(allocation) => {
          const phase = currentProject.phaseState.currentPhase;
          const newAllocation = { ...currentProject.phaseState.allocation, ...allocation };
          
          // Mark phase complete and advance
          if (phase === 'phase1') {
            updateProject(currentProject.id, {
              phaseState: {
                ...currentProject.phaseState,
                phase1Complete: true,
                currentPhase: 'phase2',
                allocation: newAllocation
              },
              weeksElapsed: currentProject.weeksElapsed + getPhaseTime('phase1', currentProject.budgetTier)
            });
            advanceWeek();
          } else if (phase === 'phase2') {
            updateProject(currentProject.id, {
              phaseState: {
                ...currentProject.phaseState,
                phase2Complete: true,
                currentPhase: 'phase3',
                allocation: newAllocation
              },
              weeksElapsed: currentProject.weeksElapsed + getPhaseTime('phase2', currentProject.budgetTier)
            });
            advanceWeek();
          } else if (phase === 'phase3') {
            // Complete project - calculate results
            const updatedProject = {
              ...currentProject,
              phaseState: {
                ...currentProject.phaseState,
                phase3Complete: true,
                allocation: newAllocation
              },
              weeksElapsed: currentProject.weeksElapsed + getPhaseTime('phase3', currentProject.budgetTier)
            };
            
            const assignedStaff = studio.staff.filter(s => currentProject.assignedStaff.includes(s.id));
            const results = calculateResults(updatedProject, assignedStaff, studio.fans);
            
            updateProject(currentProject.id, {
              ...updatedProject,
              released: true,
              releaseDate: Date.now(),
              results
            });
            
            // Update studio
            updateStudio({
              cash: studio.cash + results.boxOffice,
              fans: studio.fans + results.fansGained,
              reputation: Math.max(0, Math.min(100, studio.reputation + results.reputationChange))
            });
            
            setScreen('release');
          }
        }}
        onShowScenePlanner={() => {
          // Simple scene planner - just mark as done with random quality
          const quality = 60 + Math.random() * 30;
          updateProject(currentProject.id, {
            scenePlannerDone: true,
            scenePlannerQuality: quality
          });
        }}
      />
    );
  }
  
  // RELEASE
  if (screen === 'release' && currentProject?.results) {
    return (
      <ReleaseScreen
        projectName={currentProject.name}
        results={currentProject.results}
        onContinue={() => {
          completeProjectInStudio(currentProject.id);
          setCurrentProjectId(null);
          setScreen('office');
        }}
      />
    );
  }
  
  // HIRING
  if (screen === 'hiring') {
    const tierData = require('@/lib/office-tiers').OFFICE_TIERS[studio.officeTier];
    return (
      <HiringScreen
        currentStaff={studio.staff}
        maxStaff={tierData.maxStaff}
        cash={studio.cash}
        onHire={(newStaff) => {
          updateStudio({
            staff: [...studio.staff, newStaff]
          });
          setScreen('office');
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  // RESEARCH
  if (screen === 'research') {
    const tierData = require('@/lib/office-tiers').OFFICE_TIERS[studio.officeTier];
    return (
      <ResearchScreen
        researchTree={studio.researchTree}
        activeResearch={studio.activeResearch}
        hasCreativeLab={tierData.hasCreativeLab}
        onStartResearch={(id) => {
          startResearch(id);
          setScreen('office');
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  // CONTRACTS
  if (screen === 'contracts') {
    return (
      <ContractsBoard
        activeContracts={studio.activeContracts}
        availableContracts={availableContracts.filter(c => !studio.activeContracts.find(ac => ac.id === c.id))}
        onAccept={(contract) => {
          acceptContract(contract);
          setAvailableContracts(prev => prev.filter(c => c.id !== contract.id));
          setScreen('office');
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  return null;
}
