'use client';

import { Studio } from '@/lib/types-gdt';
import { OFFICE_TIERS, canUpgradeOffice } from '@/lib/office-tiers';
import IsometricOffice from './IsometricOffice';

interface OfficeViewProps {
  studio: Studio;
  onNewProject: () => void;
  onContinueProject: (projectId: string) => void;
  onAdvanceWeek: () => void;
  onViewContracts: () => void;
  onViewResearch: () => void;
  onHireStaff: () => void;
  onSettings: () => void;
}

export default function OfficeView({
  studio,
  onNewProject,
  onContinueProject,
  onAdvanceWeek,
  onViewContracts,
  onViewResearch,
  onHireStaff,
  onSettings
}: OfficeViewProps) {
  const tierData = OFFICE_TIERS[studio.officeTier];
  const upgradeCheck = canUpgradeOffice(studio.officeTier, studio.cash, studio.calendar.totalWeeks, studio.staff.length);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Top Bar - GDT Style */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-900 border-b-4 border-purple-600 p-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold pixel-text text-yellow-300 drop-shadow-lg">{studio.name}</h1>
            <p className="text-sm text-purple-200 pixel-text">
              {tierData.displayName} • Year {studio.calendar.year} • Week {studio.calendar.totalWeeks}
            </p>
          </div>
          <div className="flex gap-6">
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border-2 border-green-600">
              <p className="text-xs text-green-300 pixel-text">💰 CASH</p>
              <p className={`text-lg font-bold pixel-text ${studio.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${studio.cash.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border-2 border-blue-600">
              <p className="text-xs text-blue-300 pixel-text">👥 FANS</p>
              <p className="text-lg font-bold text-blue-400 pixel-text">{studio.fans.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border-2 border-purple-600">
              <p className="text-xs text-purple-300 pixel-text">⭐ REP</p>
              <p className="text-lg font-bold text-purple-400 pixel-text">{studio.reputation}</p>
            </div>
            <button
              onClick={onSettings}
              className="bg-slate-900/50 px-4 py-2 rounded-lg border-2 border-slate-600 hover:border-slate-400 transition-colors"
              title="Settings"
            >
              <span className="text-xl">⚙️</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Isometric Office View - Main Hub */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-4">
          <IsometricOffice
            tier={studio.officeTier}
            projectCount={studio.activeProjects.length}
            staffCount={studio.staff.length}
            onClickDesk={onNewProject}
            onClickResearch={tierData.canResearch ? onViewResearch : undefined}
            onClickHire={onHireStaff}
          />
        </div>
        
        {/* Control Panel Below Office */}
        <div className="grid grid-cols-4 gap-3">
          {/* Time Control */}
          <div className="pixel-border bg-slate-800/90 p-3">
            <h3 className="text-sm font-bold mb-2 text-yellow-300 pixel-text">⏰ TIME</h3>
            <button
              onClick={onAdvanceWeek}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg pixel-text font-bold text-white shadow-lg"
            >
              ⏭ ADVANCE WEEK
            </button>
            <p className="text-xs text-center text-slate-400 mt-2 pixel-text">
              Week {studio.calendar.totalWeeks}
            </p>
          </div>
          
          {/* Projects Panel */}
          <div className="pixel-border bg-slate-800/90 p-3">
            <h3 className="text-sm font-bold mb-2 text-purple-300 pixel-text">🎬 PROJECTS ({studio.activeProjects.length}/{tierData.maxProjects})</h3>
            {studio.activeProjects.length === 0 ? (
              <button
                onClick={onNewProject}
                disabled={studio.activeProjects.length >= tierData.maxProjects}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 rounded pixel-text font-bold"
              >
                + NEW PROJECT
              </button>
            ) : (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {studio.activeProjects.map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => onContinueProject(proj.id)}
                    className="w-full text-left p-2 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                  >
                    <p className="font-bold truncate">{proj.name}</p>
                    <p className="text-slate-400 text-[10px]">Phase {proj.phaseState.currentPhase}</p>
                  </button>
                ))}
                {studio.activeProjects.length < tierData.maxProjects && (
                  <button
                    onClick={onNewProject}
                    className="w-full py-1 bg-purple-900 hover:bg-purple-800 rounded pixel-text text-xs"
                  >
                    + NEW
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Staff & Hiring */}
          <div className="pixel-border bg-slate-800/90 p-3">
            <h3 className="text-sm font-bold mb-2 text-green-300 pixel-text">👥 STAFF ({studio.staff.length}/{tierData.maxStaff})</h3>
            {studio.staff.length < tierData.maxStaff && (
              <button
                onClick={onHireStaff}
                className="w-full py-2 mb-2 bg-green-600 hover:bg-green-700 rounded pixel-text font-bold"
              >
                HIRE STAFF
              </button>
            )}
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {studio.staff.map(s => (
                <div key={s.id} className="bg-slate-700 p-1 rounded text-[10px]">
                  <p className="font-bold truncate">{s.name}</p>
                  <div className="flex gap-1">
                    <span className="text-blue-400">D{s.design}</span>
                    <span className="text-green-400">T{s.tech}</span>
                    <span className="text-slate-500">Lv{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Side Actions */}
          <div className="pixel-border bg-slate-800/90 p-3">
            <h3 className="text-sm font-bold mb-2 text-orange-300 pixel-text">📋 ACTIONS</h3>
            <div className="space-y-2">
              <button
                onClick={onViewContracts}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded pixel-text text-sm font-bold"
              >
                💼 CONTRACTS
                {studio.activeContracts.filter(c => c.active).length > 0 && (
                  <span className="ml-1 text-xs">({studio.activeContracts.filter(c => c.active).length})</span>
                )}
              </button>
              {tierData.canResearch && (
                <button
                  onClick={onViewResearch}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded pixel-text text-sm font-bold"
                >
                  🔬 RESEARCH
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Office Upgrade Indicator */}
        {upgradeCheck.nextTier && (
          <div className="mt-3 pixel-border bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-yellow-300 pixel-text">
                  🏢 Next Office: {OFFICE_TIERS[upgradeCheck.nextTier].displayName}
                </p>
                {!upgradeCheck.canUpgrade && upgradeCheck.reason && (
                  <p className="text-xs text-orange-300 mt-1">{upgradeCheck.reason}</p>
                )}
              </div>
              {upgradeCheck.canUpgrade && (
                <span className="text-2xl">✨</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
