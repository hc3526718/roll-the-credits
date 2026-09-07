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
            <p className="text-sm text-slate-400">{studio.officeTier.toUpperCase()} OFFICE</p>
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
          
          {/* Trends Panel */}
          <div className="bg-slate-800 rounded-lg p-6 pixel-border">
            <h2 className="text-xl font-bold mb-4 text-purple-300">TRENDING NOW</h2>
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
              
              {project.phase === 'production' && (
                <div className="mb-4">
                  <div className="w-full bg-slate-700 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all"
                      style={{ width: `${project.productionProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Production: {project.productionProgress}%</p>
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
