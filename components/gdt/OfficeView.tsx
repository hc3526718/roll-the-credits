'use client';

import { Studio } from '@/lib/types-gdt';
import { OFFICE_TIERS, canUpgradeOffice } from '@/lib/office-tiers';

interface OfficeViewProps {
  studio: Studio;
  onNewProject: () => void;
  onContinueProject: (projectId: string) => void;
  onAdvanceWeek: () => void;
  onViewContracts: () => void;
  onViewResearch: () => void;
  onHireStaff: () => void;
}

export default function OfficeView({
  studio,
  onNewProject,
  onContinueProject,
  onAdvanceWeek,
  onViewContracts,
  onViewResearch,
  onHireStaff
}: OfficeViewProps) {
  const tierData = OFFICE_TIERS[studio.officeTier];
  const upgradeCheck = canUpgradeOffice(studio.officeTier, studio.cash, studio.calendar.totalWeeks, studio.staff.length);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b-2 border-purple-600 p-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold pixel-text text-purple-300">{studio.name}</h1>
            <p className="text-xs text-slate-400">
              {tierData.displayName} • Y{studio.calendar.year} M{studio.calendar.month} W{studio.calendar.week}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-right">
              <p className="text-xs text-slate-400">CASH</p>
              <p className={`font-bold ${studio.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${studio.cash.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">FANS</p>
              <p className="font-bold text-blue-400">{studio.fans.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">REP</p>
              <p className="font-bold text-purple-400">{studio.reputation}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Office Status */}
          <div className="space-y-3">
            <div className="pixel-border bg-slate-800 p-4">
              <h2 className="text-lg font-bold pixel-text mb-3 text-purple-300">Office</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tier:</span>
                  <span>{tierData.displayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Staff:</span>
                  <span>{studio.staff.length}/{tierData.maxStaff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projects:</span>
                  <span>{studio.activeProjects.length}/{tierData.maxProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Research:</span>
                  <span>{tierData.canResearch ? '✓' : '✗'}</span>
                </div>
              </div>
              
              {upgradeCheck.nextTier && (
                <div className="mt-4 pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-400 mb-2">Next: {OFFICE_TIERS[upgradeCheck.nextTier].displayName}</p>
                  {!upgradeCheck.canUpgrade && upgradeCheck.reason && (
                    <p className="text-xs text-orange-400">{upgradeCheck.reason}</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Quick Actions */}
            <div className="pixel-border bg-slate-800 p-4">
              <h3 className="text-sm font-bold mb-3 text-purple-300">Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={onAdvanceWeek}
                  className="w-full py-2 bg-blue-900 hover:bg-blue-800 rounded pixel-text text-sm"
                >
                  ⏭ Advance Week
                </button>
                <button
                  onClick={onViewContracts}
                  className="w-full py-2 bg-green-900 hover:bg-green-800 rounded pixel-text text-sm"
                >
                  💼 Contracts ({studio.activeContracts.filter(c => c.active).length})
                </button>
                {tierData.canResearch && (
                  <button
                    onClick={onViewResearch}
                    className="w-full py-2 bg-purple-900 hover:bg-purple-800 rounded pixel-text text-sm"
                  >
                    🔬 Research
                  </button>
                )}
                {studio.staff.length < tierData.maxStaff && (
                  <button
                    onClick={onHireStaff}
                    className="w-full py-2 bg-indigo-900 hover:bg-indigo-800 rounded pixel-text text-sm"
                  >
                    👥 Hire Staff
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Center: Projects */}
          <div className="pixel-border bg-slate-800 p-4">
            <h2 className="text-lg font-bold pixel-text mb-3 text-purple-300">Projects</h2>
            
            {studio.activeProjects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No active projects</p>
                {studio.activeProjects.length < tierData.maxProjects && (
                  <button
                    onClick={onNewProject}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded font-bold pixel-text"
                  >
                    🎬 NEW PROJECT
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {studio.activeProjects.map(proj => (
                  <div key={proj.id} className="bg-slate-700 p-3 rounded">
                    <p className="font-bold">{proj.name}</p>
                    <p className="text-sm text-slate-400">{proj.genre} • {proj.tone}</p>
                    <p className="text-xs text-slate-500 mt-1">Phase: {proj.phaseState.currentPhase}</p>
                    <button
                      onClick={() => onContinueProject(proj.id)}
                      className="mt-2 w-full py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                    >
                      Continue
                    </button>
                  </div>
                ))}
                {studio.activeProjects.length < tierData.maxProjects && (
                  <button
                    onClick={onNewProject}
                    className="w-full py-2 bg-purple-900 hover:bg-purple-800 rounded pixel-text text-sm"
                  >
                    + New Project
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Right: Staff */}
          <div className="pixel-border bg-slate-800 p-4">
            <h2 className="text-lg font-bold pixel-text mb-3 text-purple-300">Staff</h2>
            <div className="space-y-2">
              {studio.staff.map(s => (
                <div key={s.id} className="bg-slate-700 p-2 rounded text-xs">
                  <p className="font-bold">{s.name}</p>
                  <p className="text-slate-400 capitalize">{s.role.replace(/-/g, ' ')}</p>
                  <div className="flex gap-2 mt-1 text-[10px]">
                    <span className="text-blue-400">D:{s.design}</span>
                    <span className="text-green-400">T:{s.tech}</span>
                    <span className="text-yellow-400">S:{s.speed}</span>
                    <span className="text-purple-400">R:{s.research}</span>
                    <span className="text-slate-500">Lv{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
