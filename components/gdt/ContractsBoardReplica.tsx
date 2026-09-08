'use client';

import { Contract } from '@/lib/types-gdt';

interface ContractsBoardReplicaProps {
  activeContracts: Contract[];
  availableContracts: Contract[];
  onAccept: (contract: Contract) => void;
  onClose: () => void;
}

export default function ContractsBoardReplica({
  activeContracts,
  availableContracts,
  onAccept,
  onClose
}: ContractsBoardReplicaProps) {
  const getContractIcon = (type: string) => {
    switch(type) {
      case 'vfx-work': return '✨';
      case 'edit-work': return '✂️';
      case 'sound-work': return '🔊';
      case 'consulting': return '💼';
      default: return '📋';
    }
  };
  
  const getContractColor = (type: string) => {
    switch(type) {
      case 'vfx-work': return 'purple';
      case 'edit-work': return 'blue';
      case 'sound-work': return 'green';
      case 'consulting': return 'yellow';
      default: return 'slate';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="bg-gradient-to-r from-slate-800 to-orange-900 border-b-4 border-orange-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold pixel-text text-yellow-300">💼 CONTRACTS BOARD</h1>
            <p className="text-sm text-orange-200 pixel-text">
              Survival income • Side work • Build your reputation
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
        {/* Active Contracts */}
        {activeContracts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold pixel-text mb-4 text-green-300 flex items-center gap-2">
              <span>⏳</span>
              <span>ACTIVE CONTRACTS ({activeContracts.length})</span>
            </h2>
            <div className="space-y-3">
              {activeContracts.map(contract => {
                const color = getContractColor(contract.type);
                const icon = getContractIcon(contract.type);
                const progress = ((contract.durationWeeks - contract.weeksRemaining) / contract.durationWeeks) * 100;
                
                return (
                  <div key={contract.id} className="pixel-border bg-slate-800/90 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`text-4xl bg-${color}-900/50 p-3 rounded-lg`}>
                          {icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-xl text-white">{contract.title}</p>
                          <p className="text-sm text-slate-400 mt-1">{contract.description}</p>
                          
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-400 mb-1 pixel-text">
                              <span>PROGRESS</span>
                              <span>{contract.durationWeeks - contract.weeksRemaining}/{contract.durationWeeks} weeks</span>
                            </div>
                            <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-500 transition-all`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-green-300 pixel-text">WEEKLY PAYOUT</p>
                          <p className="text-2xl font-bold text-green-400 pixel-text">
                            ${contract.weeklyPayout.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {contract.weeksRemaining} weeks left
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Available Contracts */}
        <div>
          <h2 className="text-2xl font-bold pixel-text mb-4 text-orange-300 flex items-center gap-2">
            <span>📋</span>
            <span>AVAILABLE CONTRACTS</span>
          </h2>
          {availableContracts.length === 0 ? (
            <div className="pixel-border bg-slate-800/50 p-12 text-center">
              <p className="text-xl text-slate-400 pixel-text">No contracts available</p>
              <p className="text-sm text-slate-600 mt-2">Check back after advancing weeks</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {availableContracts.map(contract => {
                const color = getContractColor(contract.type);
                const icon = getContractIcon(contract.type);
                const weeklyRate = Math.round(contract.weeklyPayout);
                
                return (
                  <div key={contract.id} className="pixel-border bg-slate-800/90 p-5 hover:bg-slate-700 transition-all">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`text-3xl bg-${color}-900/50 p-3 rounded-lg`}>
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-white">{contract.title}</p>
                        <p className="text-xs text-slate-400 capitalize pixel-text">
                          {contract.type.replace(/-/g, ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-300 mb-4">{contract.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      <div className="bg-slate-900/50 p-2 rounded">
                        <p className="text-[10px] text-slate-400 pixel-text">DURATION</p>
                        <p className="text-sm font-bold text-white">{contract.durationWeeks}w</p>
                      </div>
                      <div className="bg-green-900/50 p-2 rounded">
                        <p className="text-[10px] text-green-300 pixel-text">PER WEEK</p>
                        <p className="text-sm font-bold text-green-400">${weeklyRate.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-900/50 p-2 rounded">
                        <p className="text-[10px] text-blue-300 pixel-text">TOTAL</p>
                        <p className="text-sm font-bold text-blue-400">${contract.totalPayout.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAccept(contract)}
                      className={`w-full py-3 bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 rounded-lg pixel-text font-bold transition-all`}
                    >
                      ✓ ACCEPT CONTRACT
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Info Box */}
        <div className="mt-6 pixel-border bg-gradient-to-r from-orange-900/30 to-yellow-900/30 p-4 border-orange-700">
          <p className="text-sm text-orange-200 pixel-text">
            💡 <strong>Contract Tips:</strong> Accept contracts during downtime between projects. 
            Weekly payouts are automatic. Contracts complete over time as you advance weeks.
          </p>
        </div>
      </div>
    </div>
  );
}
