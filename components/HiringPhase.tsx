'use client';

import { useState } from 'react';
import { Talent, TalentRole, Studio } from '@/lib/types';

interface HiringPhaseProps {
  studio: Studio;
  budget: number;
  currentlyHired?: Talent[];
  requiredRoles?: TalentRole[];
  stageName?: string;
  onConfirm: (hired: Talent[]) => void;
  onBack: () => void;
}

export default function HiringPhase({ studio, budget, currentlyHired = [], requiredRoles = [], stageName = 'Hiring', onConfirm, onBack }: HiringPhaseProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(currentlyHired.map(t => t.id))
  );
  
  // Show all talent including currently hired ones
  const availableTalent = studio.talentPool.filter(t => 
    !t.busy || currentlyHired.some(h => h.id === t.id)
  );
  
  const selectedTalent = availableTalent.filter(t => selected.has(t.id));
  const totalCost = selectedTalent.reduce((sum, t) => sum + t.salary, 0);
  const canAfford = totalCost <= budget;
  
  const roleEmoji: Record<TalentRole, string> = {
    'Actor': '🎭',
    'Director': '🎬',
    'Writer': '✍️',
    'Cinematographer': '📷',
    'Editor': '✂️',
    'Sound Designer': '🔊',
    'VFX Artist': '✨',
    'Composer': '🎵',
    'Producer': '📋'
  };
  
  const toggleTalent = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };
  
  // Check requirements
  const meetsRequirements = requiredRoles.length === 0 || requiredRoles.every(role => 
    selectedTalent.some(t => t.role === role)
  );
  const canProceed = meetsRequirements && canAfford;
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← BACK
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 pixel-text">HIRE TALENT - {stageName.toUpperCase()}</h1>
          
          {/* Budget Display */}
          <div className="mb-6 p-4 bg-slate-700 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-slate-400">BUDGET REMAINING</p>
              <p className={`text-2xl font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                ${(budget - totalCost).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">SELECTED COST</p>
              <p className="text-2xl font-bold text-white">${totalCost.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Requirements */}
          {requiredRoles.length > 0 && (
            <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Required for this stage:</p>
              <div className="flex flex-wrap gap-4 text-sm">
                {requiredRoles.map(role => {
                  const hasRole = selectedTalent.some(t => t.role === role);
                  return (
                    <span key={role} className={hasRole ? 'text-green-400' : 'text-slate-400'}>
                      {hasRole ? '✓' : '○'} {role}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Talent List */}
          <div className="grid grid-cols-2 gap-4 mb-6 max-h-[500px] overflow-y-auto">
            {availableTalent.map(talent => {
              const isSelected = selected.has(talent.id);
              const wouldExceedBudget = !isSelected && (totalCost + talent.salary > budget);
              
              return (
                <button
                  key={talent.id}
                  onClick={() => !wouldExceedBudget && toggleTalent(talent.id)}
                  disabled={wouldExceedBudget && !isSelected}
                  className={`p-4 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-purple-600 border-2 border-purple-400'
                      : wouldExceedBudget
                      ? 'bg-slate-800 border-2 border-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-slate-700 border-2 border-slate-600 hover:border-purple-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{roleEmoji[talent.role]}</span>
                      <div>
                        <p className="font-bold">{talent.name}</p>
                        <p className="text-xs text-slate-300">{talent.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">${talent.salary.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Skill</span>
                      <span className="font-bold">{talent.stats.skill}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Fame</span>
                      <span className="font-bold">{talent.stats.fame}/10</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {talent.chemistryTags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-slate-800/50 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => canProceed && onConfirm(selectedTalent)}
              disabled={!canProceed}
              className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 font-bold rounded-lg transition-colors"
            >
              CONFIRM HIRING ({selectedTalent.length})
            </button>
            <button
              onClick={onBack}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-lg transition-colors"
            >
              CANCEL
            </button>
          </div>
          
          {!canProceed && (
            <p className="mt-4 text-center text-sm text-slate-400">
              {!meetsRequirements && requiredRoles.length > 0 && `Need: ${requiredRoles.join(', ')}. `}
              {!canAfford && 'Over budget!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
