'use client';

import { Contract } from '@/lib/types-gdt';

interface ContractsBoardProps {
  activeContracts: Contract[];
  availableContracts: Contract[];
  onAccept: (contract: Contract) => void;
  onClose: () => void;
}

export default function ContractsBoard({
  activeContracts,
  availableContracts,
  onAccept,
  onClose
}: ContractsBoardProps) {
  const active = activeContracts.filter(c => c.active);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold pixel-text text-purple-300">CONTRACTS BOARD</h1>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded pixel-text"
            >
              CLOSE
            </button>
          </div>
          
          {/* Active Contracts */}
          {active.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold pixel-text mb-4 text-green-400">Active Contracts</h2>
              <div className="grid grid-cols-2 gap-4">
                {active.map(contract => (
                  <div key={contract.id} className="bg-green-900/20 border-2 border-green-600 p-4 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{contract.title}</h3>
                      <span className="text-xs px-2 py-1 bg-green-900 rounded">{contract.type}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{contract.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Weekly:</span>
                      <span className="font-bold text-green-400">${contract.weeklyPayout.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Remaining:</span>
                      <span className="font-bold">{contract.weeksRemaining} weeks</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Available Contracts */}
          <div>
            <h2 className="text-xl font-bold pixel-text mb-4">Available Contracts</h2>
            {availableContracts.length === 0 ? (
              <p className="text-center text-slate-400 py-8">No contracts available. Check back later.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableContracts.map(contract => (
                  <div key={contract.id} className="pixel-border bg-slate-700 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{contract.title}</h3>
                      <span className="text-xs px-2 py-1 bg-purple-900 rounded capitalize">
                        {contract.type.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-4">{contract.description}</p>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Payout:</span>
                        <span className="font-bold text-green-400">${contract.totalPayout.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Per Week:</span>
                        <span>${contract.weeklyPayout.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span>{contract.durationWeeks} weeks</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onAccept(contract)}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded font-bold text-sm"
                    >
                      ACCEPT CONTRACT
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
