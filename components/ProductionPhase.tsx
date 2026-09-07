'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/lib/types';

interface ProductionPhaseProps {
  project: Project;
  onComplete: () => void;
}

export default function ProductionPhase({ project, onComplete }: ProductionPhaseProps) {
  const [progress, setProgress] = useState(project.productionProgress || 0);
  const [showDecision, setShowDecision] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => onComplete(), 1000);
      return;
    }
    
    // Check for mid-production decision at 50%
    if (progress >= 50 && progress < 55 && !decisionMade) {
      setShowDecision(true);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(p => Math.min(100, p + 2));
    }, 200);
    
    return () => clearInterval(interval);
  }, [progress, onComplete, decisionMade]);
  
  const handleDecision = (choice: string) => {
    setDecisionMade(true);
    setShowDecision(false);
  };
  
  if (showDecision) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
        <div className="max-w-2xl w-full bg-slate-800 rounded-lg p-8 pixel-border">
          <h2 className="text-2xl font-bold text-purple-300 mb-4">⚠️ PRODUCTION DECISION</h2>
          <p className="text-lg mb-6">
            The lead actor is struggling with a key scene. What do you do?
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => handleDecision('reshoot')}
              className="w-full px-6 py-4 bg-slate-700 hover:bg-purple-600 text-left rounded-lg transition-colors"
            >
              <p className="font-bold">Reshoot the scene</p>
              <p className="text-sm text-slate-400">Cost: $5,000 · Better quality</p>
            </button>
            
            <button
              onClick={() => handleDecision('edit')}
              className="w-full px-6 py-4 bg-slate-700 hover:bg-purple-600 text-left rounded-lg transition-colors"
            >
              <p className="font-bold">Fix it in editing</p>
              <p className="text-sm text-slate-400">Free · Slight quality penalty</p>
            </button>
            
            <button
              onClick={() => handleDecision('accept')}
              className="w-full px-6 py-4 bg-slate-700 hover:bg-purple-600 text-left rounded-lg transition-colors"
            >
              <p className="font-bold">Keep moving forward</p>
              <p className="text-sm text-slate-400">Free · No change</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 pixel-text text-center">
            PRODUCTION IN PROGRESS
          </h1>
          
          <div className="mb-8">
            <div className="bg-slate-900 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4 animate-pulse">🎬</div>
              <p className="text-xl text-slate-300">{project.name}</p>
              <p className="text-sm text-slate-400 mt-2">{project.format} · {project.genre}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">PRODUCTION PROGRESS</span>
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
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">BUDGET SPENT</p>
                <p className="text-xl font-bold text-green-400">
                  ${Math.floor((progress / 100) * project.budget).toLocaleString()}
                </p>
              </div>
              <div className="bg-slate-700 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">CREW</p>
                <p className="text-xl font-bold">{project.assignedTalent.length} members</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-400 text-center">
                {progress < 30 && '📽️ Filming early scenes...'}
                {progress >= 30 && progress < 60 && '🎭 Main production underway...'}
                {progress >= 60 && progress < 90 && '🎬 Shooting final scenes...'}
                {progress >= 90 && '✨ Wrapping up production...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
