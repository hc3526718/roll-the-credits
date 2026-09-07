'use client';

import { useEffect, useState } from 'react';
import { Project, ProductionPhase, StageDecision, Studio } from '@/lib/types';
import { generateStageDecision } from '@/lib/stage-decisions';

interface StageScreenProps {
  project: Project;
  studio: Studio;
  stage: ProductionPhase;
  stageName: string;
  onComplete: (updates: Partial<Project>) => void;
  onShowDecision: (decision: StageDecision) => void;
}

const STAGE_DURATIONS: Record<ProductionPhase, number> = {
  'concept': 0,
  'planning': 8,
  'preproduction': 6,
  'filming': 10,
  'postproduction': 8,
  'marketing': 6,
  'released': 0
};

const STAGE_DESCRIPTIONS: Record<ProductionPhase, string> = {
  'concept': '',
  'planning': 'Developing script and creative vision',
  'preproduction': 'Scheduling, locations, and crew preparation',
  'filming': 'Principal photography in progress',
  'postproduction': 'Editing, sound, VFX, and final touches',
  'marketing': 'Building buzz and preparing release',
  'released': ''
};

export default function StageScreen({ project, studio, stage, stageName, onComplete, onShowDecision }: StageScreenProps) {
  const [progress, setProgress] = useState(project.stageProgress.progress);
  const [decisionShown, setDecisionShown] = useState(false);
  
  const totalWeeks = STAGE_DURATIONS[stage];
  const progressPerTick = 100 / (totalWeeks * 5); // 5 ticks per week
  
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => onComplete({}), 1000);
      return;
    }
    
    // Check for decision point
    if (progress >= 45 && progress < 55 && !decisionShown) {
      const decision = generateStageDecision(stage, project, progress);
      if (decision) {
        onShowDecision(decision);
        setDecisionShown(true);
        return; // Pause until decision is made
      }
    }
    
    // Progress automatically
    const interval = setInterval(() => {
      setProgress(p => Math.min(100, p + progressPerTick));
    }, 300);
    
    return () => clearInterval(interval);
  }, [progress, onComplete, decisionShown, stage, project]);
  
  const weeksElapsed = Math.floor((progress / 100) * totalWeeks);
  const cashBurnRate = project.budget * 0.02; // 2% per week during active phases
  const cashSpentThisStage = Math.floor(cashBurnRate * weeksElapsed);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 pixel-text text-center">
            {stageName.toUpperCase()}
          </h1>
          
          <div className="mb-8">
            <div className="bg-slate-900 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4 animate-pulse">
                {stage === 'planning' && '📝'}
                {stage === 'preproduction' && '📋'}
                {stage === 'filming' && '🎬'}
                {stage === 'postproduction' && '✂️'}
                {stage === 'marketing' && '📢'}
              </div>
              <p className="text-xl text-slate-300">{project.name}</p>
              <p className="text-sm text-slate-400 mt-2">{STAGE_DESCRIPTIONS[stage]}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">{stageName} PROGRESS</span>
                <span className="text-sm font-bold text-purple-300">{Math.floor(progress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-6">
                <div 
                  className="bg-purple-600 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                  style={{ width: `${progress}%` }}
                >
                  {progress > 10 && (
                    <span className="text-xs font-bold text-white">{Math.floor(progress)}%</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">TIME ELAPSED</p>
                <p className="text-xl font-bold text-blue-400">{weeksElapsed} / {totalWeeks} weeks</p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">BUDGET REMAINING</p>
                <p className="text-xl font-bold text-green-400">
                  ${project.remainingBudget.toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">CREW</p>
                <p className="text-xl font-bold">{project.assignedTalent.length} members</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-400 text-center">
                {progress < 30 && `🎬 Early ${stageName.toLowerCase()}...`}
                {progress >= 30 && progress < 60 && `⚡ ${stageName} underway...`}
                {progress >= 60 && progress < 90 && `🏁 Final push on ${stageName.toLowerCase()}...`}
                {progress >= 90 && `✨ Wrapping up ${stageName.toLowerCase()}...`}
              </p>
            </div>
            
            {/* Active crew for this stage */}
            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-sm font-bold text-purple-300 mb-3">ACTIVE CREW</h3>
              <div className="grid grid-cols-2 gap-2">
                {project.assignedTalent.slice(0, 6).map(t => (
                  <div key={t.id} className="bg-slate-800 rounded p-2 flex items-center gap-2">
                    <span className="text-lg">
                      {t.role === 'Actor' && '🎭'}
                      {t.role === 'Director' && '🎬'}
                      {t.role === 'Writer' && '✍️'}
                      {t.role === 'Cinematographer' && '📷'}
                      {t.role === 'Editor' && '✂️'}
                      {t.role === 'Sound Designer' && '🔊'}
                      {t.role === 'VFX Artist' && '✨'}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
