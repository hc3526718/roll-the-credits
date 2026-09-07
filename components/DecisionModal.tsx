'use client';

import { StageDecision } from '@/lib/types';

interface DecisionModalProps {
  decision: StageDecision;
  remainingBudget: number;
  onChoose: (choiceId: string) => void;
}

export default function DecisionModal({ decision, remainingBudget, onChoose }: DecisionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
      <div className="max-w-3xl w-full bg-slate-800 rounded-lg p-8 pixel-border">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-purple-300 mb-2">⚠️ DECISION POINT</h2>
          <p className="text-xl text-white font-bold">{decision.text}</p>
          <p className="text-slate-400 mt-2">{decision.description}</p>
        </div>
        
        <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
          <p className="text-sm text-slate-400">BUDGET REMAINING: <span className="font-bold text-green-400">${remainingBudget.toLocaleString()}</span></p>
        </div>
        
        <div className="space-y-3">
          {decision.options.map(option => {
            const canAfford = !option.cost || option.cost <= remainingBudget;
            const riskColor = {
              'low': 'text-green-400',
              'medium': 'text-yellow-400',
              'high': 'text-red-400'
            }[option.riskLevel || 'low'];
            
            return (
              <button
                key={option.id}
                onClick={() => canAfford && onChoose(option.id)}
                disabled={!canAfford}
                className={`w-full px-6 py-4 rounded-lg text-left transition-colors ${
                  canAfford
                    ? 'bg-slate-700 hover:bg-purple-600 border-2 border-slate-600 hover:border-purple-400'
                    : 'bg-slate-800 border-2 border-slate-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-lg">{option.label}</p>
                  {option.riskLevel && (
                    <span className={`text-xs px-2 py-1 rounded ${riskColor} bg-slate-800`}>
                      {option.riskLevel.toUpperCase()} RISK
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-300 mb-3">{option.description}</p>
                
                <div className="flex flex-wrap gap-3 text-xs">
                  {option.cost && (
                    <span className={canAfford ? 'text-green-400' : 'text-red-400'}>
                      💰 ${option.cost.toLocaleString()}
                    </span>
                  )}
                  {option.timeWeeks && (
                    <span className="text-blue-400">
                      ⏱️ +{option.timeWeeks} weeks
                    </span>
                  )}
                  {option.qualityMod && (
                    <span className={option.qualityMod > 0 ? 'text-purple-400' : 'text-slate-400'}>
                      ⭐ {option.qualityMod > 0 ? '+' : ''}{option.qualityMod} quality
                    </span>
                  )}
                  {option.audienceMod && (
                    <span className={option.audienceMod > 0 ? 'text-blue-400' : 'text-slate-400'}>
                      👥 {option.audienceMod > 0 ? '+' : ''}{option.audienceMod} audience
                    </span>
                  )}
                  {option.criticMod && (
                    <span className={option.criticMod > 0 ? 'text-yellow-400' : 'text-slate-400'}>
                      ⭐ {option.criticMod > 0 ? '+' : ''}{option.criticMod} critic
                    </span>
                  )}
                </div>
                
                {!canAfford && (
                  <p className="text-xs text-red-400 mt-2">⚠️ Insufficient budget</p>
                )}
              </button>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-purple-900/20 border border-purple-600 rounded-lg text-sm text-purple-200">
          <p className="font-bold mb-1">💡 Decision Impact:</p>
          <p className="text-xs text-purple-300">
            Your choice will affect quality, budget, time, and audience/critic appeal. 
            Consider your goals and remaining resources.
          </p>
        </div>
      </div>
    </div>
  );
}
