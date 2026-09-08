'use client';

import { useState } from 'react';
import { StaffMember, StaffRole } from '@/lib/types-gdt';
import { generateStaffMember } from '@/lib/staff-gdt';

interface HiringScreenReplicaProps {
  currentStaff: StaffMember[];
  maxStaff: number;
  cash: number;
  onHire: (staff: StaffMember) => void;
  onClose: () => void;
}

type FilterType = 'all' | 'design' | 'tech' | 'balanced';

export default function HiringScreenReplica({ currentStaff, maxStaff, cash, onHire, onClose }: HiringScreenReplicaProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const roles: StaffRole[] = ['writer', 'director', 'editor', 'vfx-artist', 'producer'];
  const [candidates] = useState(() => 
    roles.flatMap(role => [
      generateStaffMember(role, `candidate-${Date.now()}-${role}-1`),
      generateStaffMember(role, `candidate-${Date.now()}-${role}-2`)
    ])
  );
  
  const filteredCandidates = candidates.filter(c => {
    if (filter === 'design') return c.design >= c.tech;
    if (filter === 'tech') return c.tech >= c.design;
    if (filter === 'balanced') return Math.abs(c.design - c.tech) <= 2;
    return true;
  });
  
  const canAfford = (salary: number) => cash >= salary * 4;
  const spotsLeft = maxStaff - currentStaff.length;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="bg-gradient-to-r from-slate-800 to-green-900 border-b-4 border-green-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold pixel-text text-yellow-300">👥 FIND STAFF</h1>
            <p className="text-sm text-green-200 pixel-text">
              Open positions: {spotsLeft} • Budget: ${cash.toLocaleString()}
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
        {/* Filter Bar (GDT-style) */}
        <div className="pixel-border bg-slate-800/90 p-4 mb-6">
          <div className="flex gap-3">
            <span className="text-sm text-slate-400 pixel-text self-center">FILTER:</span>
            {[
              { key: 'all', label: '🎯 ALL', color: 'purple' },
              { key: 'design', label: '🎨 DESIGN', color: 'blue' },
              { key: 'tech', label: '⚙️ TECH', color: 'green' },
              { key: 'balanced', label: '⚖️ BALANCED', color: 'yellow' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as FilterType)}
                className={`px-4 py-2 rounded-lg pixel-text font-bold transition-all ${
                  filter === f.key
                    ? `bg-${f.color}-600 text-white`
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
            <div className="flex-1" />
            <span className="text-sm text-slate-400 pixel-text self-center">
              Showing {filteredCandidates.length} candidates
            </span>
          </div>
        </div>
        
        {spotsLeft === 0 ? (
          <div className="pixel-border bg-slate-800 p-12 text-center">
            <p className="text-2xl text-slate-400 pixel-text">⛔ NO OPEN POSITIONS</p>
            <p className="text-sm text-slate-500 mt-2">Upgrade your office for more staff slots.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredCandidates.map(candidate => {
              const affordable = canAfford(candidate.salary);
              const avgStat = Math.round((candidate.design + candidate.tech + candidate.speed) / 3);
              
              return (
                <div
                  key={candidate.id}
                  className={`pixel-border p-4 transition-all ${
                    affordable 
                      ? 'bg-slate-800/90 hover:bg-slate-700' 
                      : 'bg-slate-900/50 opacity-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-xl text-white">{candidate.name}</p>
                      <p className="text-sm text-slate-400 capitalize pixel-text">
                        {candidate.role.replace(/-/g, ' ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-green-300 pixel-text">SALARY</p>
                      <p className="font-bold text-lg text-green-400">${candidate.salary}/wk</p>
                    </div>
                  </div>
                  
                  {/* Stats with bars */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16 text-blue-400 pixel-text">DESIGN</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                          style={{ width: `${(candidate.design / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-blue-400 w-6">{candidate.design}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16 text-green-400 pixel-text">TECH</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-600 to-green-400"
                          style={{ width: `${(candidate.tech / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-green-400 w-6">{candidate.tech}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16 text-yellow-400 pixel-text">SPEED</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                          style={{ width: `${(candidate.speed / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-yellow-400 w-6">{candidate.speed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs w-16 text-purple-400 pixel-text">RESEARCH</span>
                      <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                          style={{ width: `${(candidate.research / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-purple-400 w-6">{candidate.research}</span>
                    </div>
                  </div>
                  
                  {/* Overall rating */}
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-slate-400 pixel-text">AVG RATING</span>
                    <div className="flex gap-1">
                      {[...Array(Math.ceil(avgStat / 2))].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onHire(candidate)}
                    disabled={!affordable}
                    className={`w-full py-3 rounded-lg font-bold pixel-text transition-all ${
                      affordable
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {affordable ? '✓ HIRE FOR ' + candidate.salary + '/WK' : '✗ CANNOT AFFORD'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
