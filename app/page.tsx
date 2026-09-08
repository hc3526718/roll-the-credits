'use client';

import { useGame } from '@/lib/game-context';
import { useState } from 'react';
import StartScreen from '@/components/StartScreen';
import OfficeViewCompact from '@/components/OfficeViewCompact';
import TutorialScreen from '@/components/TutorialScreen';
import ContractBoard from '@/components/ContractBoard';
import ConceptPhase from '@/components/ConceptPhase';
import HiringPhase from '@/components/HiringPhase';
import ScenePlanner from '@/components/ScenePlanner';
import StageScreen from '@/components/StageScreen';
import DecisionModal from '@/components/DecisionModal';
import EditingPhase from '@/components/EditingPhase';
import ResultsScreen from '@/components/ResultsScreen';
import { Project, Talent, ScenePanel, EditChoice, StageDecision, ProductionPhase, TalentRole, ContractJob, TutorialStep } from '@/lib/types';
import { calculateBudget, analyzeSceneQuality, calculateProjectResults, updateTrends, calculateRoleContribution } from '@/lib/game-logic';
import { updateActiveEvents } from '@/lib/industry-events';
import { calculateStudioLevel, getUnlocksForLevel } from '@/lib/progression';
import { generateContractBoard } from '@/lib/contracts';
import { getAccessibleTalent, generateInitialFriendTalent } from '@/lib/game-data';

type GameScreen = 'start' | 'tutorial' | 'office' | 'contracts' | 'concept' | 'stage' | 'hiring' | 'scene-planning' | 'editing' | 'results';

export default function Home() {
  const { state, initializeGame, loadGame, updateStudio, setCurrentProject, updateProject, completeProject, saveGame, updateTutorialProgress, advanceWeek } = useGame();
  const [screen, setScreen] = useState<GameScreen>('start');
  const [currentDecision, setCurrentDecision] = useState<StageDecision | null>(null);
  const [hiringFor, setHiringFor] = useState<ProductionPhase>('planning');
  const [debtWarning, setDebtWarning] = useState<string | null>(null);
  
  if (!state.initialized && screen !== 'start') {
    return (
      <StartScreen
        onStart={(studioName, founderName, skipTutorial) => {
          initializeGame(studioName, founderName, skipTutorial);
          
          // v2: Add friend talent to pool for early game
          const friendTalent = generateInitialFriendTalent();
          updateStudio({
            talentPool: [...state.studio.talentPool, ...friendTalent]
          });
          
          if (skipTutorial) {
            setScreen('office');
          } else {
            setScreen('tutorial');
          }
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
        onStart={(studioName, founderName, skipTutorial) => {
          initializeGame(studioName, founderName, skipTutorial);
          
          // v2: Add friend talent to pool for early game
          const friendTalent = generateInitialFriendTalent();
          updateStudio({
            talentPool: [...state.studio.talentPool, ...friendTalent]
          });
          
          if (skipTutorial) {
            setScreen('office');
          } else {
            setScreen('tutorial');
          }
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
  
  // v2: Tutorial screen
  if (screen === 'tutorial' && state.tutorialProgress.active) {
    return (
      <TutorialScreen
        currentStep={state.tutorialProgress.currentStep}
        onNext={() => {
          const steps: TutorialStep[] = [
            'welcome', 'name-founder', 'explain-calendar', 'show-contracts', 
            'first-contract', 'explain-projects', 'first-project', 
            'scene-planner', 'release-results', 'complete'
          ];
          const currentIndex = steps.indexOf(state.tutorialProgress.currentStep);
          
          if (currentIndex < steps.length - 1) {
            const nextStep = steps[currentIndex + 1];
            
            // Special handling for certain steps
            if (nextStep === 'show-contracts') {
              const contracts = generateContractBoard();
              updateStudio({ activeContracts: contracts });
              setScreen('contracts');
            } else if (nextStep === 'complete') {
              updateTutorialProgress('complete');
              setScreen('office');
            } else {
              updateTutorialProgress(nextStep);
            }
          } else {
            setScreen('office');
          }
        }}
        onSkip={() => {
          updateTutorialProgress('complete');
          setScreen('office');
        }}
      />
    );
  }
  
  // v2: Contract Board screen
  if (screen === 'contracts') {
    const availableContracts = studio.activeContracts.filter(c => !c.active);
    const activeContracts = studio.activeContracts.filter(c => c.active);
    
    return (
      <ContractBoard
        availableContracts={availableContracts}
        activeContracts={activeContracts}
        employees={studio.employees}
        availableRoles={studio.unlocks.availableRoles}
        onAcceptContract={(contract) => {
          const updatedContracts = studio.activeContracts.map(c =>
            c.id === contract.id ? { ...c, active: true, weeksRemaining: c.durationWeeks } : c
          );
          updateStudio({ activeContracts: updatedContracts });
          
          // Tutorial progression
          if (state.tutorialProgress.active && state.tutorialProgress.currentStep === 'first-contract') {
            updateTutorialProgress('explain-projects');
          }
        }}
        onCancelContract={(contractId) => {
          const updatedContracts = studio.activeContracts.map(c =>
            c.id === contractId ? { ...c, active: false } : c
          );
          updateStudio({ activeContracts: updatedContracts });
        }}
        onClose={() => setScreen('office')}
      />
    );
  }
  
  // Update studio level and unlocks
  const currentLevel = calculateStudioLevel(studio);
  if (currentLevel !== studio.level) {
    const newUnlocks = getUnlocksForLevel(currentLevel, studio.studioTier);
    updateStudio({ level: currentLevel, unlocks: newUnlocks });
  }
  
  // CONCEPT PHASE
  if (screen === 'concept') {
    return (
      <ConceptPhase
        studio={studio}
        onConfirm={({ name, format, genre, budgetTier }) => {
          const budget = calculateBudget(format, budgetTier);
          
          // v2: Debt warning if going over budget
          const netCash = studio.cash - studio.debt;
          if (netCash < budget) {
            const shortfall = budget - netCash;
            const goingIntoDebt = netCash < 0 || shortfall > netCash;
            
            if (goingIntoDebt && !confirm(
              `⚠️ BUDGET WARNING\n\n` +
              `This project costs $${budget.toLocaleString()} but you only have $${netCash.toLocaleString()} available.\n\n` +
              `This will put you $${shortfall.toLocaleString()} in debt. You'll need contract work or box office success to recover.\n\n` +
              `Proceed anyway?`
            )) {
              return; // Cancel if they don't want to risk debt
            }
          }
          
          const project: Project = {
            id: `project-${Date.now()}`,
            name,
            format,
            genre,
            budgetTier,
            budget,
            spent: 0,
            remainingBudget: budget,
            assignedTalent: [],
            scenes: [],
            phase: 'planning',
            stageProgress: {
              stage: 'planning',
              progress: 0,
              weeksElapsed: 0,
              decisionsMade: [],
              currentDecision: undefined
            },
            allDecisionsMade: [],
            weeksElapsed: 0,
            createdAt: Date.now()
          };
          
          setCurrentProject(project);
          
          // v2: Update cash and debt
          const newCash = studio.cash - budget;
          if (newCash < 0) {
            updateStudio({ 
              cash: 0,
              debt: studio.debt + Math.abs(newCash)
            });
          } else {
            updateStudio({ cash: newCash });
          }
          
          setHiringFor('planning');
          setScreen('hiring');
        }}
        onCancel={() => setScreen('office')}
      />
    );
  }
  
  // HIRING PHASE (for different stages)
  if (screen === 'hiring' && studio.currentProject) {
    const requiredRoles: Record<ProductionPhase, TalentRole[]> = {
      'concept': [],
      'planning': ['Writer', 'Director'],
      'preproduction': ['Cinematographer', 'Actor'],
      'filming': [],
      'postproduction': ['Editor', 'Sound Designer', 'VFX Artist'],
      'marketing': [],
      'released': []
    };
    
    const required = requiredRoles[hiringFor] || [];
    const availableRoles = studio.unlocks.availableRoles;
    const filteredRequired = required.filter(r => availableRoles.includes(r));
    
    // v2: Filter talent by reputation (gating system)
    const accessibleTalent = getAccessibleTalent(studio.talentPool, studio.reputation);
    const gatedStudio = { ...studio, talentPool: accessibleTalent };
    
    return (
      <HiringPhase
        studio={gatedStudio}
        budget={studio.currentProject.remainingBudget}
        currentlyHired={studio.currentProject.assignedTalent}
        requiredRoles={filteredRequired}
        stageName={hiringFor}
        onConfirm={(hired) => {
          const totalSalary = hired.reduce((sum, t) => sum + t.salary, 0);
          const previouslyHired = studio.currentProject!.assignedTalent;
          const toFree = previouslyHired.filter(p => !hired.find(h => h.id === p.id));
          
          updateProject({
            assignedTalent: hired,
            spent: studio.currentProject!.spent + totalSalary,
            remainingBudget: studio.currentProject!.remainingBudget - totalSalary
          });
          
          updateStudio({
            talentPool: studio.talentPool.map(t => {
              if (hired.find(h => h.id === t.id)) return { ...t, busy: true };
              if (toFree.find(f => f.id === t.id)) return { ...t, busy: false };
              return t;
            })
          });
          
          // Move to next appropriate phase
          if (hiringFor === 'planning') {
            // Calculate script quality from writer
            const scriptQuality = calculateRoleContribution(hired, 'Writer');
            updateProject({ 
              scriptQuality,
              phase: 'preproduction',
              stageProgress: {
                stage: 'preproduction',
                progress: 0,
                weeksElapsed: 0,
                decisionsMade: [],
                currentDecision: undefined
              }
            });
            setHiringFor('preproduction');
            setScreen('hiring');
          } else if (hiringFor === 'preproduction') {
            const cinematographyQuality = calculateRoleContribution(hired, 'Cinematographer');
            updateProject({ 
              cinematographyQuality,
              phase: 'filming',
              stageProgress: {
                stage: 'filming',
                progress: 0,
                weeksElapsed: 0,
                decisionsMade: [],
                currentDecision: undefined
              }
            });
            setScreen('scene-planning');
          } else if (hiringFor === 'postproduction') {
            const editingQuality = calculateRoleContribution(hired, 'Editor');
            const soundQuality = calculateRoleContribution(hired, 'Sound Designer');
            const vfxQuality = calculateRoleContribution(hired, 'VFX Artist');
            updateProject({ editingQuality, soundQuality, vfxQuality });
            setScreen('stage');
          }
        }}
        onBack={() => {
          if (hiringFor === 'planning') {
            setScreen('concept');
          } else {
            setScreen('stage');
          }
        }}
      />
    );
  }
  
  // SCENE PLANNING PHASE (during filming)
  if (screen === 'scene-planning' && studio.currentProject) {
    return (
      <ScenePlanner
        talent={studio.currentProject.assignedTalent}
        existingScenes={studio.currentProject.scenes}
        onConfirm={(scenes) => {
          const storyOutcome = analyzeSceneQuality(
            scenes,
            studio.currentProject!.assignedTalent,
            studio.currentProject!.genre
          );
          
          updateProject({
            scenes,
            storyOutcome
          });
          
          setScreen('stage');
        }}
        onBack={() => {
          setHiringFor('preproduction');
          setScreen('hiring');
        }}
      />
    );
  }
  
  // STAGE SCREEN (Planning, Preproduction, Filming, Postproduction, Marketing)
  if (screen === 'stage' && studio.currentProject) {
    const project = studio.currentProject;
    const stageNames: Record<ProductionPhase, string> = {
      'concept': 'Concept',
      'planning': 'Planning & Development',
      'preproduction': 'Pre-Production',
      'filming': 'Principal Photography',
      'postproduction': 'Post-Production',
      'marketing': 'Marketing & Distribution',
      'released': 'Released'
    };
    
    return (
      <>
        <StageScreen
          project={project}
          studio={studio}
          stage={project.stageProgress.stage}
          stageName={stageNames[project.stageProgress.stage]}
          onComplete={(updates) => {
            const currentStage = project.stageProgress.stage;
            
            // Update time and events
            const weeksElapsed = project.weeksElapsed + project.stageProgress.weeksElapsed;
            const daysElapsed = studio.daysPassed + (project.stageProgress.weeksElapsed * 7);
            updateStudio({ 
              daysPassed: daysElapsed,
              weeksPassed: studio.weeksPassed + project.stageProgress.weeksElapsed
            });
            
            // Update events
            const updatedStudio = updateActiveEvents(studio);
            updateStudio({ activeEvents: updatedStudio.activeEvents });
            
            updateProject({ weeksElapsed, ...updates });
            
            // Determine next phase
            if (currentStage === 'planning') {
              setHiringFor('preproduction');
              setScreen('hiring');
            } else if (currentStage === 'preproduction') {
              setScreen('scene-planning');
            } else if (currentStage === 'filming') {
              setHiringFor('postproduction');
              setScreen('hiring');
            } else if (currentStage === 'postproduction') {
              updateProject({
                phase: 'marketing',
                stageProgress: {
                  stage: 'marketing',
                  progress: 0,
                  weeksElapsed: 0,
                  decisionsMade: [],
                  currentDecision: undefined
                }
              });
              setScreen('stage');
            } else if (currentStage === 'marketing') {
              const marketingReach = calculateRoleContribution(project.assignedTalent, 'Producer') || 50;
              updateProject({ 
                marketingReach
              });
              setScreen('editing');
            }
          }}
          onShowDecision={(decision) => {
            setCurrentDecision(decision);
          }}
        />
        
        {currentDecision && (
          <DecisionModal
            decision={currentDecision}
            remainingBudget={project.remainingBudget}
            onChoose={(choiceId) => {
              const choice = currentDecision.options.find(o => o.id === choiceId);
              if (!choice) return;
              
              // Apply decision effects
              const newRemaining = project.remainingBudget - (choice.cost || 0);
              const newProgress = project.stageProgress.progress + (choice.timeWeeks || 0) * 10;
              
              updateProject({
                remainingBudget: newRemaining,
                stageProgress: {
                  ...project.stageProgress,
                  decisionsMade: [...project.stageProgress.decisionsMade, choiceId]
                },
                allDecisionsMade: [
                  ...project.allDecisionsMade,
                  { stage: currentDecision.stage, decisionId: currentDecision.id, choiceId }
                ]
              });
              
              // Store quality modifiers for later
              if (choice.qualityMod) {
                const currentQuality = project.storyOutcome?.quality || 50;
                updateProject({
                  storyOutcome: {
                    ...project.storyOutcome,
                    quality: currentQuality + choice.qualityMod,
                    tags: project.storyOutcome?.tags || [],
                    audienceAppeal: (project.storyOutcome?.audienceAppeal || 0) + (choice.audienceMod || 0),
                    criticAppeal: (project.storyOutcome?.criticAppeal || 0) + (choice.criticMod || 0)
                  }
                });
              }
              
              setCurrentDecision(null);
            }}
          />
        )}
      </>
    );
  }
  
  // EDITING PHASE (Final touches before release)
  if (screen === 'editing' && studio.currentProject) {
    return (
      <EditingPhase
        onConfirm={(editChoices) => {
          const project = studio.currentProject!;
          
          // Ensure storyOutcome exists
          if (!project.storyOutcome) {
            updateProject({
              storyOutcome: {
                quality: 50,
                tags: [],
                audienceAppeal: 0,
                criticAppeal: 0
              }
            });
          }
          
          const results = calculateProjectResults(
            { ...project, editChoices, storyOutcome: project.storyOutcome || { quality: 50, tags: [], audienceAppeal: 0, criticAppeal: 0 } },
            studio
          );
          
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
            }
          });
          
          const updatedStudio = { ...studio, cash: newCash, reputation: newReputation };
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
  
  // OFFICE VIEW (default) - v2: Compact version
  return (
    <OfficeViewCompact
      studio={studio}
      onNewProject={() => {
        // Tutorial progression
        if (state.tutorialProgress.active && state.tutorialProgress.currentStep === 'first-project') {
          updateTutorialProgress('scene-planner');
        }
        setScreen('concept');
      }}
      onContinueProject={() => {
        if (studio.currentProject) {
          const phase = studio.currentProject.phase;
          if (phase === 'planning' || phase === 'preproduction' || phase === 'filming' || phase === 'postproduction' || phase === 'marketing') {
            setScreen('stage');
          } else {
            setScreen('editing');
          }
        }
      }}
      onViewContracts={() => {
        // Generate new contracts if board is empty
        if (studio.activeContracts.length === 0) {
          const contracts = generateContractBoard();
          updateStudio({ activeContracts: contracts });
        }
        setScreen('contracts');
      }}
      onAdvanceWeek={() => {
        advanceWeek();
        saveGame();
      }}
    />
  );
}
