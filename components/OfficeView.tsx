'use client';

import { Studio, Project } from '@/lib/types';

interface OfficeViewProps {
  studio: Studio;
  onNewProject: () => void;
  onContinueProject: () => void;
}

export default function OfficeView({ studio, onNewProject, onContinueProject }: OfficeViewProps) {
  const project = studio.currentProject;
  
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b-4 border-purple-600 p-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-purple-300 pixel-text">{studio.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-slate-400">{studio.studioTier.toUpperCase()} OFFICE</p>
              <span className="text-xs px-2 py-0.5 bg-purple-600 rounded font-bold">LEVEL {studio.level}</span>
            </div>
          </div>
          
          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-slate-400">CASH</p>
              <p className="text-xl font-bold text-green-400">${studio.cash.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400">REPUTATION</p>
              <p className="text-xl font-bold text-purple-400">{studio.reputation}/100</p>
            </div>
            <div>
              <p className="text-slate-400">FOLLOWERS</p>
              <p className="text-xl font-bold text-blue-400">{studio.audience.size.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Active Events */}
        {studio.activeEvents && studio.activeEvents.length > 0 && (
          <div className="mb-8 bg-gradient-to-r from-orange-900/30 to-red-900/30 border-2 border-orange-600 rounded-lg p-4">
            <h2 className="text-lg font-bold text-orange-300 mb-3">🔔 ACTIVE INDUSTRY EVENTS</h2>
            <div className="grid grid-cols-2 gap-3">
              {studio.activeEvents.map(event => (
                <div key={event.id} className="bg-slate-800/50 rounded p-3">
                  <p className="font-bold text-sm text-orange-200">{event.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{event.description}</p>
                  <p className="text-xs text-orange-400 mt-2">
                    {Math.ceil((event.startDay + event.duration - studio.daysPassed) / 7)} weeks remaining
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-8">
          {/* Office Visualization */}
          <div className="col-span-2 bg-slate-800 rounded-lg p-6 pixel-border">
            <h2 className="text-xl font-bold mb-4 text-purple-300">STUDIO FLOOR</h2>
            <div className="bg-slate-700 rounded-lg p-8 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-slate-400">
                  {project ? `Working on: ${project.name}` : 'Ready for new project'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Unlocks & Trends Panel */}
          <div className="bg-slate-800 rounded-lg p-6 pixel-border">
            <h2 className="text-xl font-bold mb-4 text-purple-300">STUDIO STATUS</h2>
            
            {/* Unlock Status */}
            <div className="mb-6 p-3 bg-slate-700 rounded">
              <p className="text-sm font-bold text-purple-300 mb-2">Available Roles ({studio.unlocks.availableRoles.length}/9)</p>
              <div className="flex flex-wrap gap-1">
                {studio.unlocks.availableRoles.map(role => (
                  <span key={role} className="text-xs px-2 py-0.5 bg-purple-600 rounded">
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
            
            <h3 className="text-lg font-bold mb-3 text-purple-300">TRENDING NOW</h3>
            <div className="space-y-3">
              {studio.trends.map(trend => (
                <div key={trend.id} className="bg-slate-700 rounded p-3">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-sm text-purple-200">{trend.name}</p>
                    <span className="text-xs bg-purple-600 px-2 py-0.5 rounded">{trend.genre}</span>
                  </div>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${trend.strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    +{trend.audienceBoost} audience
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Project Status */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 pixel-border">
          <h2 className="text-xl font-bold mb-4 text-purple-300">PROJECT STATUS</h2>
          
            {project ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{project.name}</h3>
                  <p className="text-slate-400">{project.format} · {project.genre} · {project.budgetTier} Budget</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">PHASE</p>
                  <p className="text-xl font-bold text-purple-400">{project.phase.toUpperCase()}</p>
                </div>
              </div>
              
              {project.stageProgress && (
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all"
                      style={{ width: `${project.stageProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">
                    {project.stageProgress.stage}: {Math.floor(project.stageProgress.progress)}% 
                    ({project.weeksElapsed} weeks total)
                  </p>
                </div>
              )}
              
              <button
                onClick={onContinueProject}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition-colors"
              >
                CONTINUE PROJECT
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No active project</p>
              <button
                onClick={onNewProject}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition-colors text-lg"
              >
                START NEW PROJECT
              </button>
            </div>
          )}
        </div>
        
        {/* Completed Projects */}
        {studio.completedProjects.length > 0 && (
          <div className="mt-8 bg-slate-800 rounded-lg p-6 pixel-border">
            <h2 className="text-xl font-bold mb-4 text-purple-300">COMPLETED PROJECTS</h2>
            <div className="grid grid-cols-3 gap-4">
              {studio.completedProjects.slice(-6).reverse().map(p => (
                <div key={p.id} className="bg-slate-700 rounded p-3">
                  <p className="font-bold text-sm mb-1">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.format} · {p.genre}</p>
                  {p.results && (
                    <div className="mt-2 text-xs space-y-1">
                      <p>👥 {p.results.audienceScore}/100</p>
                      <p>⭐ {p.results.criticScore}/100</p>
                      <p className="text-green-400">+${p.results.revenue.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
