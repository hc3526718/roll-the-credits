'use client';

import { ProjectResults } from '@/lib/types-gdt';

interface ReleaseScreenReplicaProps {
  projectName: string;
  genre: string;
  tone: string;
  results: ProjectResults;
  onContinue: () => void;
}

export default function ReleaseScreenReplica({ 
  projectName, 
  genre, 
  tone, 
  results, 
  onContinue 
}: ReleaseScreenReplicaProps) {
  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <div className="pixel-border bg-slate-800/95 p-8 shadow-2xl">
          {/* GDT-style header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🎬</div>
            <h1 className="text-5xl font-bold pixel-text text-yellow-300 mb-2">
              RELEASE REPORT
            </h1>
            <p className="text-3xl pixel-text text-white mb-1">{projectName}</p>
            <p className="text-sm text-purple-300 pixel-text">{genre} • {tone}</p>
          </div>
          
          {/* Main scores - GDT game report style */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="pixel-border bg-gradient-to-br from-purple-900 to-purple-800 p-8 text-center">
              <p className="text-sm text-purple-200 mb-3 pixel-text">⚙️ OVERALL QUALITY</p>
              <p className={`text-7xl font-bold pixel-text ${scoreColor(results.overallQuality)}`}>
                {Math.round(results.overallQuality)}
              </p>
              <p className="text-slate-400 text-sm mt-2">/ 100</p>
            </div>
            
            <div className="pixel-border bg-gradient-to-br from-blue-900 to-cyan-900 p-8 text-center">
              <p className="text-sm text-blue-200 mb-3 pixel-text">👥 FAN SCORE</p>
              <p className={`text-7xl font-bold pixel-text ${scoreColor(results.fanScore)}`}>
                {Math.round(results.fanScore)}
              </p>
              <p className="text-slate-400 text-sm mt-2">/ 100</p>
            </div>
          </div>
          
          {/* Critic Reviews - Multi-outlet */}
          <div className="pixel-border bg-slate-900/80 p-6 mb-6">
            <h2 className="text-2xl font-bold pixel-text mb-4 text-purple-300 flex items-center gap-2">
              <span>📰</span>
              <span>CRITIC REVIEWS</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {results.criticScores.map((critic, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-800 rounded">
                  <span className="text-sm text-slate-300 pixel-text">{critic.outlet}</span>
                  <span className={`font-bold text-xl pixel-text ${scoreColor(critic.score)}`}>
                    {critic.score}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t-2 border-purple-600 flex justify-between items-center">
              <span className="font-bold pixel-text text-lg">CRITIC AVERAGE</span>
              <span className={`text-3xl font-bold pixel-text ${scoreColor(results.averageCriticScore)}`}>
                {Math.round(results.averageCriticScore)}
              </span>
            </div>
          </div>
          
          {/* Financial & Impact */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="pixel-border bg-green-900/50 p-5 text-center">
              <p className="text-xs text-green-300 mb-2 pixel-text">💰 BOX OFFICE</p>
              <p className="text-3xl font-bold text-green-400 pixel-text">
                ${results.boxOffice.toLocaleString()}
              </p>
            </div>
            <div className="pixel-border bg-blue-900/50 p-5 text-center">
              <p className="text-xs text-blue-300 mb-2 pixel-text">👥 FANS GAINED</p>
              <p className="text-3xl font-bold text-blue-400 pixel-text">
                +{results.fansGained.toLocaleString()}
              </p>
            </div>
            <div className="pixel-border bg-purple-900/50 p-5 text-center">
              <p className="text-xs text-purple-300 mb-2 pixel-text">⭐ REPUTATION</p>
              <p className={`text-3xl font-bold pixel-text ${
                results.reputationChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {results.reputationChange > 0 ? '+' : ''}{results.reputationChange}
              </p>
            </div>
          </div>
          
          {/* Weekly Sales Graph - GDT style */}
          {results.weeklySales.length > 0 && (
            <div className="pixel-border bg-slate-900/80 p-5 mb-6">
              <h3 className="text-sm font-bold pixel-text mb-3 text-slate-300">
                📊 WEEKLY BOX OFFICE PERFORMANCE
              </h3>
              <div className="flex items-end gap-1 h-32 bg-slate-950 rounded p-2">
                {results.weeklySales.slice(0, 12).map((week, i) => {
                  const maxSales = Math.max(...results.weeklySales.map(w => w.sales));
                  const height = Math.max((week.sales / maxSales) * 100, 2);
                  return (
                    <div
                      key={i}
                      className="flex-1 relative group"
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-blue-500 rounded-t transition-all hover:from-purple-500 hover:to-purple-400"
                        style={{ height: `${height}%` }}
                      />
                      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        W{week.week}: ${week.sales.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-2 pixel-text">
                <span>WEEK 1</span>
                <span>OPENING RUN</span>
                <span>WEEK {results.weeklySales.length}</span>
              </div>
            </div>
          )}
          
          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-bold pixel-text text-2xl shadow-xl transition-all transform hover:scale-105"
          >
            ✓ CONTINUE TO OFFICE
          </button>
        </div>
      </div>
    </div>
  );
}
