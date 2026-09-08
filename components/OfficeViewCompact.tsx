// Compact Office View for Roll the Credits v2
// Designed to fit 1280×800 with minimal scrolling

'use client';

import { useState } from 'react';
import { Studio, Project } from '@/lib/types';
import { STUDIO_TIERS, getNextTier, getTierUpgradeCost } from '@/lib/studio-tiers';

interface OfficeViewProps {
  studio: Studio;
  onNewProject: () => void;
  onContinueProject: () => void;
  onViewContracts: () => void;
  onAdvanceWeek: () => void;
}

type Tab = 'overview' | 'projects' | 'studio';

export default function OfficeViewCompact({ 
  studio, 
  onNewProject, 
  onContinueProject, 
  onViewContracts,
  onAdvanceWeek
}: OfficeViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const project = studio.currentProject;
  const nextTier = getNextTier(studio.studioTier);
  const upgradeCost = getTierUpgradeCost(studio.studioTier);
  const currentTier = STUDIO_TIERS[studio.studioTier];
  
  const formatCalendar = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[studio.calendar.month - 1]} W${studio.calendar.week}, ${studio.calendar.year}`;
  };
  
  const netCash = studio.cash - studio.debt;
  const weeklyIncome = studio.activeContracts.reduce((sum, c) => c.active ? sum + c.weeklyPayout : sum, 0)
    + studio.departments.filter(d => d.rented).reduce((sum, d) => sum + d.rentalIncome, 0);
  
  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      {/* Compact Header */}
      <div className="bg-slate-800 border-b-2 border-purple-600 px-6 py-3 flex justify-between items-center">
        <div>
          <h1 className="pixel-text text-xl text-purple-300">{studio.name}</h1>
          <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
            <span>{currentTier.displayName}</span>
            <span>•</span>
            <span>LVL {studio.level}</span>
            <span>•</span>
            <span>📅 {formatCalendar()}</span>
          </div>
        </div>
        
        <div className="flex gap-6 text-sm">
          <div className="text-right">
            <p className="text-xs text-slate-400">CASH</p>
            <p className={`font-bold ${netCash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${netCash.toLocaleString()}
            </p>
            {studio.debt > 0 && (
              <p className="text-xs text-red-400">Debt: ${studio.debt.toLocaleString()}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">REP</p>
            <p className="font-bold text-purple-400">{studio.reputation}/100</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">FOLLOWERS</p>
            <p className="font-bold text-blue-400">{(studio.audience.size / 1000).toFixed(1)}K</p>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-slate-800 border-b-2 border-slate-700 px-6 flex gap-1">
        {(['overview', 'projects', 'studio'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 pixel-text text-sm transition-colors ${
              activeTab === tab 
                ? 'bg-slate-900 text-purple-300 border-t-2 border-purple-600' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Main Content - fits in remaining viewport */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Left: Quick Actions */}
              <div className="space-y-4">
                <div className="pixel-border p-4 bg-slate-800">
                  <h3 className="pixel-text text-sm mb-3 text-purple-300">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={onAdvanceWeek}
                      className="w-full pixel-border py-2 bg-blue-900 hover:bg-blue-800 transition-colors"
                    >
                      <span className="pixel-text text-sm text-blue-200">⏭️ Advance Week</span>
                      {weeklyIncome > 0 && (
                        <div className="text-xs text-blue-300 mt-1">+${weeklyIncome.toLocaleString()}/week</div>
                      )}
                    </button>
                    <button
                      onClick={onViewContracts}
                      className="w-full pixel-border py-2 bg-green-900 hover:bg-green-800 transition-colors"
                    >
                      <span className="pixel-text text-sm text-green-200">📋 Contract Board</span>
                      {studio.activeContracts.filter(c => c.active).length > 0 && (
                        <div className="text-xs text-green-300 mt-1">{studio.activeContracts.filter(c => c.active).length} active</div>
                      )}
                    </button>
                    {!project && (
                      <button
                        onClick={onNewProject}
                        className="w-full pixel-border py-3 bg-purple-900 hover:bg-purple-800 transition-colors"
                      >
                        <span className="pixel-text text-purple-200">🎬 New Project</span>
                      </button>
                    )}
                    {project && (
                      <button
                        onClick={onContinueProject}
                        className="w-full pixel-border py-3 bg-purple-900 hover:bg-purple-800 transition-colors animate-pulse"
                      >
                        <span className="pixel-text text-purple-200">▶️ Continue Project</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Active Events */}
                {studio.activeEvents.length > 0 && (
                  <div className="pixel-border p-3 bg-orange-900/30 border-orange-600">
                    <h3 className="pixel-text text-xs mb-2 text-orange-300">🔔 Events</h3>
                    <div className="space-y-2">
                      {studio.activeEvents.slice(0, 3).map(event => (
                        <div key={event.id} className="bg-slate-800/50 p-2 rounded text-xs">
                          <p className="text-orange-200 font-bold">{event.name}</p>
                          <p className="text-slate-400 text-[10px]">{Math.ceil((event.startDay + event.duration - studio.daysPassed) / 7)}w left</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Center: Current Project / Status */}
              <div className="pixel-border p-4 bg-slate-800">
                <h3 className="pixel-text text-sm mb-3 text-purple-300">Current Status</h3>
                {project ? (
                  <div>
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">🎬</div>
                      <p className="font-bold text-lg">{project.name}</p>
                      <p className="text-sm text-slate-400">{project.format} • {project.genre}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Stage:</span>
                        <span className="text-purple-300">{project.stageProgress.stage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Progress:</span>
                        <span className="text-blue-300">{Math.floor(project.stageProgress.progress)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budget Left:</span>
                        <span className={project.remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}>
                          ${project.remainingBudget.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Weeks Elapsed:</span>
                        <span className="text-slate-300">{project.weeksElapsed}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-3">💤</div>
                    <p className="text-slate-400">No active project</p>
                    <p className="text-xs text-slate-500 mt-2">Start a new film or take on contracts</p>
                  </div>
                )}
              </div>
              
              {/* Right: Studio Info */}
              <div className="space-y-4">
                <div className="pixel-border p-4 bg-slate-800">
                  <h3 className="pixel-text text-xs mb-3 text-purple-300">Studio Info</h3>
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-slate-400 mb-1">Available Roles</p>
                      <div className="flex flex-wrap gap-1">
                        {studio.unlocks.availableRoles.map(role => (
                          <span key={role} className="text-[10px] px-1.5 py-0.5 bg-purple-600 rounded">
                            {role === 'Actor' && '🎭'}
                            {role === 'Director' && '🎬'}
                            {role === 'Writer' && '✍️'}
                            {role === 'Cinematographer' && '📷'}
                            {role === 'Editor' && '✂️'}
                            {role === 'Sound Designer' && '🔊'}
                            {role === 'VFX Artist' && '✨'}
                            {role === 'Composer' && '🎵'}
                            {role === 'Producer' && '📋'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Projects Completed</p>
                      <p className="font-bold text-slate-200">{studio.completedProjects.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">Departments Owned</p>
                      <p className="font-bold text-slate-200">{studio.departments.filter(d => d.owned).length}/{currentTier.departmentSlots}</p>
                    </div>
                  </div>
                </div>
                
                {nextTier && upgradeCost && (
                  <div className="pixel-border p-3 bg-indigo-900/30 border-indigo-600">
                    <h3 className="pixel-text text-xs mb-2 text-indigo-300">Next Upgrade</h3>
                    <p className="text-xs text-slate-300">{STUDIO_TIERS[nextTier].displayName}</p>
                    <p className="text-xs text-slate-400">${upgradeCost.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="pixel-border p-4 bg-slate-800">
              <h3 className="pixel-text text-lg mb-4 text-purple-300">Project History</h3>
              {studio.completedProjects.length === 0 ? (
                <p className="text-center py-8 text-slate-400">No completed projects yet</p>
              ) : (
                <div className="grid gap-3">
                  {studio.completedProjects.map((proj, idx) => (
                    <div key={proj.id} className="pixel-border p-3 bg-slate-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{proj.name}</p>
                          <p className="text-sm text-slate-400">{proj.format} • {proj.genre}</p>
                        </div>
                        {proj.results && (
                          <div className="text-right text-sm">
                            <p className="text-blue-300">Audience: {proj.results.audienceScore}/100</p>
                            <p className="text-purple-300">Critics: {proj.results.criticScore}/100</p>
                            <p className="text-green-300">${proj.results.revenue.toLocaleString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Studio Tab */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="pixel-border p-4 bg-slate-800">
                <h3 className="pixel-text text-lg mb-4 text-purple-300">Studio Management</h3>
                <p className="text-sm text-slate-400">Studio upgrades and department management coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
