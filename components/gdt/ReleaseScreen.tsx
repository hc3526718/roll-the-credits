'use client';

import { ProjectResults } from '@/lib/types-gdt';

interface ReleaseScreenProps {
  projectName: string;
  results: ProjectResults;
  onContinue: () => void;
}

export default function ReleaseScreen({ projectName, results, onContinue }: ReleaseScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="pixel-border bg-slate-800 p-8">
          <h1 className="text-4xl font-bold pixel-text text-center mb-2 text-purple-300">
            🎬 RELEASE RESULTS
          </h1>
          <p className="text-center text-2xl mb-8">{projectName}</p>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Overall Scores */}
            <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-6 rounded-lg border-2 border-purple-600">
              <p className="text-sm text-slate-300 mb-2">OVERALL QUALITY</p>
              <p className="text-5xl font-bold">{Math.round(results.overallQuality)}<span className="text-2xl">/100</span></p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-900/50 to-green-900/50 p-6 rounded-lg border-2 border-blue-600">
              <p className="text-sm text-slate-300 mb-2">FAN SCORE</p>
              <p className="text-5xl font-bold">{Math.round(results.fanScore)}<span className="text-2xl">/100</span></p>
            </div>
          </div>
          
          {/* Critic Scores */}
          <div className="bg-slate-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold pixel-text mb-4 text-purple-300">CRITIC REVIEWS</h2>
            <div className="space-y-3">
              {results.criticScores.map((critic, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-slate-600 last:border-0">
                  <span className="text-sm">{critic.outlet}</span>
                  <span className={`font-bold ${
                    critic.score >= 80 ? 'text-green-400' :
                    critic.score >= 60 ? 'text-blue-400' :
                    critic.score >= 40 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {critic.score}/100
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t-2 border-purple-600 flex justify-between items-center font-bold">
                <span>AVERAGE</span>
                <span className="text-purple-400 text-xl">{Math.round(results.averageCriticScore)}/100</span>
              </div>
            </div>
          </div>
          
          {/* Box Office & Fans */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-900/30 p-4 rounded border border-green-600 text-center">
              <p className="text-xs text-slate-300 mb-1">BOX OFFICE</p>
              <p className="text-2xl font-bold text-green-400">${results.boxOffice.toLocaleString()}</p>
            </div>
            <div className="bg-blue-900/30 p-4 rounded border border-blue-600 text-center">
              <p className="text-xs text-slate-300 mb-1">FANS GAINED</p>
              <p className="text-2xl font-bold text-blue-400">+{results.fansGained.toLocaleString()}</p>
            </div>
            <div className="bg-purple-900/30 p-4 rounded border border-purple-600 text-center">
              <p className="text-xs text-slate-300 mb-1">REPUTATION</p>
              <p className="text-2xl font-bold text-purple-400">
                {results.reputationChange > 0 ? '+' : ''}{results.reputationChange}
              </p>
            </div>
          </div>
          
          {/* Weekly Sales */}
          {results.weeklySales.length > 0 && (
            <div className="bg-slate-700 p-4 rounded mb-6">
              <p className="text-sm font-bold mb-3">Weekly Box Office</p>
              <div className="flex items-end gap-1 h-24">
                {results.weeklySales.slice(0, 12).map((week, i) => {
                  const maxSales = Math.max(...results.weeklySales.map(w => w.sales));
                  const height = (week.sales / maxSales) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-600 to-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                      title={`Week ${week.week}: $${week.sales.toLocaleString()}`}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                Sales decay over {results.weeklySales.length} weeks
              </p>
            </div>
          )}
          
          <button
            onClick={onContinue}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 rounded font-bold pixel-text text-lg"
          >
            CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
