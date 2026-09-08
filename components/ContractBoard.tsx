// Contract work board for Roll the Credits v2

'use client';

import { ContractJob, Employee } from '../lib/types';
import { canAcceptContract } from '../lib/contracts';

interface ContractBoardProps {
  availableContracts: ContractJob[];
  activeContracts: ContractJob[];
  employees: Employee[];
  availableRoles: string[];
  onAcceptContract: (contract: ContractJob) => void;
  onCancelContract: (contractId: string) => void;
  onClose: () => void;
}

export default function ContractBoard({
  availableContracts,
  activeContracts,
  employees,
  availableRoles,
  onAcceptContract,
  onCancelContract,
  onClose
}: ContractBoardProps) {
  
  const getContractIcon = (type: string) => {
    switch (type) {
      case 'vfx-contract': return '🎬';
      case 'sound-contract': return '🔊';
      case 'editing-contract': return '✂️';
      case 'sfx-contract': return '💥';
      default: return '📋';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
      <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto pixel-border" style={{ 
        background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'
      }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="pixel-text text-3xl" style={{ color: '#1e293b' }}>Contract Board</h2>
            <button
              onClick={onClose}
              className="pixel-border px-4 py-2 hover:bg-red-100 transition-colors"
              style={{ background: '#fee2e2' }}
            >
              <span className="pixel-text" style={{ color: '#991b1b' }}>✕ Close</span>
            </button>
          </div>
          
          {/* Active Contracts */}
          {activeContracts.length > 0 && (
            <div className="mb-6">
              <h3 className="pixel-text text-xl mb-3" style={{ color: '#475569' }}>Active Contracts</h3>
              <div className="space-y-3">
                {activeContracts.map(contract => (
                  <div key={contract.id} className="pixel-border p-4" style={{ background: '#dbeafe' }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getContractIcon(contract.type)}</span>
                          <span className="pixel-text text-lg" style={{ color: '#1e40af' }}>{contract.title}</span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: '#475569' }}>{contract.description}</p>
                        <div className="flex gap-4 text-sm" style={{ color: '#64748b' }}>
                          <span>💰 ${contract.weeklyPayout.toLocaleString()}/week</span>
                          <span>⏱️ {contract.weeksRemaining} weeks left</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onCancelContract(contract.id)}
                        className="pixel-border px-3 py-1 text-xs hover:bg-red-100"
                        style={{ background: '#fee2e2', color: '#991b1b' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Available Contracts */}
          <div>
            <h3 className="pixel-text text-xl mb-3" style={{ color: '#475569' }}>Available Contracts</h3>
            {availableContracts.length === 0 ? (
              <p className="text-center py-8" style={{ color: '#94a3b8' }}>No contracts available. Check back later!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableContracts.map(contract => {
                  const canAccept = canAcceptContract(contract, availableRoles as any);
                  
                  return (
                    <div 
                      key={contract.id} 
                      className="pixel-border p-4"
                      style={{ 
                        background: canAccept ? '#fff' : '#f1f5f9',
                        opacity: canAccept ? 1 : 0.6
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getContractIcon(contract.type)}</span>
                        <span className="pixel-text" style={{ color: '#1e293b' }}>{contract.title}</span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: '#475569' }}>{contract.description}</p>
                      <div className="space-y-1 text-sm mb-3" style={{ color: '#64748b' }}>
                        <div className="flex justify-between">
                          <span>Total Payout:</span>
                          <span className="font-semibold">${contract.totalPayout.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Week:</span>
                          <span>${contract.weeklyPayout.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{contract.durationWeeks} weeks</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Requires:</span>
                          <span>{contract.requiredRoles.join(', ')}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onAcceptContract(contract)}
                        disabled={!canAccept}
                        className="w-full pixel-border py-2 transition-colors disabled:cursor-not-allowed"
                        style={{
                          background: canAccept ? 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' : '#e2e8f0',
                          color: canAccept ? '#1e40af' : '#94a3b8'
                        }}
                      >
                        <span className="pixel-text text-sm">
                          {canAccept ? 'Accept Contract' : 'Role Locked'}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
