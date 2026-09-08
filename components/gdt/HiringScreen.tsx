'use client';

import { useState } from 'react';
import { StaffMember, StaffRole } from '@/lib/types-gdt';
import { generateStaffMember } from '@/lib/staff-gdt';

interface HiringScreenProps {
  currentStaff: StaffMember[];
  maxStaff: number;
  cash: number;
  onHire: (staff: StaffMember) => void;
  onClose: () => void;
}

export default function HiringScreen({ currentStaff, maxStaff, cash, onHire, onClose }: HiringScreenProps) {
  const roles: StaffRole[] = ['writer', 'director', 'editor', 'vfx-artist', 'producer'];
  const [candidates] = useState(() => 
    roles.map((role, i) => generateStaffMember(role, `candidate-${Date.now()}-${i}`))
  );
  
  const canAfford = (salary: number) => cash >= salary * 4; // Can afford at least 4 weeks
  const spotsLeft = maxStaff - currentStaff.length;
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold pixel-text text-purple-300">HIRE STAFF</h1>
              <p className="text-sm text-slate-400 mt-1">Spots: {currentStaff.length}/{maxStaff}</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded pixel-text"
            >
              CLOSE
            </button>
          </div>
          
          {spotsLeft === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No open positions. Upgrade your office for more staff.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {candidates.map(candidate => {
                const affordable = canAfford(candidate.salary);
                
                return (
                  <div
                    key={candidate.id}
                    className={`pixel-border p-4 ${affordable ? 'bg-slate-700' : 'bg-slate-800 opacity-60'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">{candidate.name}</p>
                        <p className="text-sm text-slate-400 capitalize">{candidate.role.replace(/-/g, ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Salary</p>
                        <p className="font-bold text-green-400">${candidate.salary}/wk</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-3 mb-4 text-sm">
                      <div className="bg-blue-900/30 p-2 rounded text-center">
                        <p className="text-xs text-slate-400">Design</p>
                        <p className="font-bold text-blue-400">{candidate.design}</p>
                      </div>
                      <div className="bg-green-900/30 p-2 rounded text-center">
                        <p className="text-xs text-slate-400">Tech</p>
                        <p className="font-bold text-green-400">{candidate.tech}</p>
                      </div>
                      <div className="bg-yellow-900/30 p-2 rounded text-center">
                        <p className="text-xs text-slate-400">Speed</p>
                        <p className="font-bold text-yellow-400">{candidate.speed}</p>
                      </div>
                      <div className="bg-purple-900/30 p-2 rounded text-center">
                        <p className="text-xs text-slate-400">Research</p>
                        <p className="font-bold text-purple-400">{candidate.research}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onHire(candidate)}
                      disabled={!affordable}
                      className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded font-bold text-sm"
                    >
                      {affordable ? 'HIRE' : 'CANNOT AFFORD'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
