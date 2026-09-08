'use client';

import { ResearchItem } from '@/lib/types-gdt';
import { getAvailableResearch } from '@/lib/research-tree';

interface ResearchScreenProps {
  researchTree: ResearchItem[];
  activeResearch: string | null;
  hasCreativeLab: boolean;
  onStartResearch: (id: string) => void;
  onClose: () => void;
}

export default function ResearchScreen({
  researchTree,
  activeResearch,
  hasCreativeLab,
  onStartResearch,
  onClose
}: ResearchScreenProps) {
  const completedIds = researchTree.filter(r => r.completed).map(r => r.id);
  const available = getAvailableResearch(completedIds, hasCreativeLab);
  const inProgress = researchTree.find(r => r.id === activeResearch);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold pixel-text text-purple-300">RESEARCH</h1>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded pixel-text"
            >
              CLOSE
            </button>
          </div>
          
          {/* Active Research */}
          {inProgress && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 rounded border-2 border-purple-600 mb-6">
              <p className="text-sm text-purple-300 mb-1">RESEARCHING</p>
              <p className="font-bold text-lg">{inProgress.name}</p>
              <div className="mt-3 bg-slate-900 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all"
                  style={{ width: `${(inProgress.currentProgress / inProgress.researchPoints) * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                {Math.round(inProgress.currentProgress)}/{inProgress.researchPoints} points
              </p>
            </div>
          )}
          
          {/* Available Research */}
          <div>
            <h2 className="text-xl font-bold pixel-text mb-4">Available Research</h2>
            {available.length === 0 ? (
              <p className="text-slate-400 text-center py-8">
                No research available. {!hasCreativeLab && 'Upgrade to Large Lot to unlock Creative Lab research.'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {available.map(item => (
                  <div key={item.id} className="pixel-border bg-slate-700 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{item.name}</h3>
                      <span className="text-xs px-2 py-1 bg-purple-900 rounded">{item.category}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{item.description}</p>
                    <p className="text-xs text-slate-400 mb-3">Time: {item.researchPoints} points</p>
                    
                    {item.effects && (
                      <div className="text-xs text-green-400 mb-3">
                        {item.effects.unlocksGenre && `Unlocks: ${item.effects.unlocksGenre}`}
                        {item.effects.unlocksFeature && `Unlocks: ${item.effects.unlocksFeature}`}
                        {item.effects.boostFans && `Fans: +${item.effects.boostFans}`}
                      </div>
                    )}
                    
                    <button
                      onClick={() => onStartResearch(item.id)}
                      disabled={!!activeResearch}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded font-bold text-sm"
                    >
                      {activeResearch ? 'BUSY' : 'START RESEARCH'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Completed */}
          <div className="mt-8">
            <h2 className="text-lg font-bold pixel-text mb-3 text-green-400">Completed ({completedIds.length})</h2>
            <div className="flex flex-wrap gap-2">
              {researchTree.filter(r => r.completed).map(r => (
                <span key={r.id} className="px-3 py-1 bg-green-900/30 border border-green-600 rounded text-xs">
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
