'use client';

import { ResearchItem } from '@/lib/types-gdt';
import { OFFICE_TIERS } from '@/lib/office-tiers';

interface ResearchScreenReplicaProps {
  researchTree: ResearchItem[];
  activeResearch: string | null;
  hasCreativeLab: boolean;
  officeTier: string;
  onStartResearch: (id: string) => void;
  onClose: () => void;
}

export default function ResearchScreenReplica({
  researchTree,
  activeResearch,
  hasCreativeLab,
  officeTier,
  onStartResearch,
  onClose
}: ResearchScreenReplicaProps) {
  const tierData = OFFICE_TIERS[officeTier as keyof typeof OFFICE_TIERS];
  
  const activeItem = researchTree.find(r => r.id === activeResearch);
  const availableResearch = researchTree.filter(r => 
    !r.completed && 
    r.unlocked && 
    !activeResearch &&
    (!r.requiresCreativeLab || hasCreativeLab) &&
    (r.prerequisites.length === 0 || r.prerequisites.every(prereqId => 
      researchTree.find(item => item.id === prereqId)?.completed
    ))
  );
  const completedResearch = researchTree.filter(r => r.completed);
  const lockedResearch = researchTree.filter(r => !r.unlocked && !r.completed);
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'genre': return '🎭';
      case 'tone': return '🎨';
      case 'format': return '📺';
      case 'feature': return '✨';
      default: return '🔬';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="bg-gradient-to-r from-slate-800 to-purple-900 border-b-4 border-purple-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold pixel-text text-yellow-300">🔬 RESEARCH & DEVELOPMENT</h1>
            <p className="text-sm text-purple-200 pixel-text">
              {tierData.displayName} • Research Speed: {tierData.researchSpeed}x
              {hasCreativeLab && <span className="ml-2 text-pink-300">• Creative Lab Active ✨</span>}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg pixel-text font-bold"
          >
            ← BACK
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Active Research */}
        {activeItem && (
          <div className="pixel-border bg-gradient-to-r from-purple-900 to-pink-900 p-6 mb-6">
            <h2 className="text-2xl font-bold pixel-text mb-3 text-white flex items-center gap-2">
              <span>⏳</span>
              <span>RESEARCH IN PROGRESS</span>
            </h2>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <p className="text-xl font-bold text-yellow-300 pixel-text">{activeItem.name}</p>
                <p className="text-sm text-purple-200 mt-1">{activeItem.description}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-purple-200 mb-1 pixel-text">
                    <span>PROGRESS</span>
                    <span>{activeItem.currentProgress}/{activeItem.researchPoints} points</span>
                  </div>
                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{ width: `${(activeItem.currentProgress / activeItem.researchPoints) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-6xl animate-pulse">🔬</div>
            </div>
          </div>
        )}
        
        {/* Available Research */}
        {availableResearch.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold pixel-text mb-4 text-green-300 flex items-center gap-2">
              <span>✅</span>
              <span>AVAILABLE RESEARCH</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {availableResearch.map(item => (
                <div key={item.id} className="pixel-border bg-slate-800/90 p-4 hover:bg-slate-700 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(item.category)}</span>
                      <div>
                        <p className="font-bold text-lg text-white">{item.name}</p>
                        <p className="text-xs text-slate-400 capitalize pixel-text">{item.category}</p>
                      </div>
                    </div>
                    {item.requiresCreativeLab && (
                      <span className="text-xs bg-pink-900 text-pink-300 px-2 py-1 rounded pixel-text">
                        LAB
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-purple-400 pixel-text">
                      ⏱ {item.researchPoints} points
                    </span>
                    <button
                      onClick={() => onStartResearch(item.id)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg pixel-text font-bold text-sm"
                    >
                      START RESEARCH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Completed Research */}
        {completedResearch.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold pixel-text mb-4 text-blue-300 flex items-center gap-2">
              <span>✓</span>
              <span>COMPLETED RESEARCH ({completedResearch.length})</span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {completedResearch.map(item => (
                <div key={item.id} className="pixel-border bg-slate-900/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{getCategoryIcon(item.category)}</span>
                    <p className="font-bold text-sm text-green-400">{item.name}</p>
                  </div>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Locked Research (Preview) */}
        {lockedResearch.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold pixel-text mb-4 text-slate-500 flex items-center gap-2">
              <span>🔒</span>
              <span>LOCKED RESEARCH</span>
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {lockedResearch.slice(0, 6).map(item => (
                <div key={item.id} className="pixel-border bg-slate-900/30 p-3 opacity-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl grayscale">{getCategoryIcon(item.category)}</span>
                    <p className="font-bold text-sm text-slate-600">{item.name}</p>
                  </div>
                  <p className="text-xs text-slate-700">{item.description}</p>
                  {item.prerequisites.length > 0 && (
                    <p className="text-[10px] text-slate-600 mt-1 pixel-text">
                      Requires: {item.prerequisites.length} prerequisite(s)
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!hasCreativeLab && (
          <div className="mt-6 pixel-border bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-4 border-pink-700">
            <p className="text-sm text-pink-300 pixel-text">
              🔬 <strong>Creative Lab</strong> unlocks advanced research. Upgrade to Large Studio Lot to access it!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
