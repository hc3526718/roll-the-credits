'use client';

import { Project } from '@/lib/types';

interface ResultsScreenProps {
  project: Project;
  onContinue: () => void;
}

export default function ResultsScreen({ project, onContinue }: ResultsScreenProps) {
  const results = project.results!;
  
  const audienceGrade = 
    results.audienceScore >= 90 ? 'S' :
    results.audienceScore >= 80 ? 'A' :
    results.audienceScore >= 70 ? 'B' :
    results.audienceScore >= 60 ? 'C' :
    results.audienceScore >= 50 ? 'D' : 'F';
    
  const criticGrade = 
    results.criticScore >= 90 ? 'S' :
    results.criticScore >= 80 ? 'A' :
    results.criticScore >= 70 ? 'B' :
    results.criticScore >= 60 ? 'C' :
    results.criticScore >= 50 ? 'D' : 'F';
  
  const profit = results.revenue - project.budget;
  const profitColor = profit >= 0 ? 'text-green-400' : 'text-red-400';
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-purple-300 pixel-text mb-2">
              RELEASE RESULTS
            </h1>
            <h2 className="text-2xl font-bold">{project.name}</h2>
            <p className="text-slate-400 mt-1">{project.format} · {project.genre}</p>
          </div>
          
          {/* Scores */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-lg p-6 border-2 border-blue-600">
              <p className="text-sm text-blue-300 mb-2">AUDIENCE SCORE</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold">{Math.round(results.audienceScore)}</span>
                <span className="text-3xl font-bold text-blue-400">{audienceGrade}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-700">
                <p className="text-sm text-blue-200">
                  +{results.followersGained.toLocaleString()} new followers
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-900 to-slate-800 rounded-lg p-6 border-2 border-purple-600">
              <p className="text-sm text-purple-300 mb-2">CRITIC SCORE</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-bold">{Math.round(results.criticScore)}</span>
                <span className="text-3xl font-bold text-purple-400">{criticGrade}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-700">
                <p className="text-sm text-purple-200">
                  {results.reputationChange >= 0 ? '+' : ''}{results.reputationChange} reputation
                </p>
              </div>
            </div>
          </div>
          
          {/* Financial */}
          <div className="bg-slate-700 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4 text-purple-300">FINANCIAL SUMMARY</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Budget</span>
                <span className="font-bold">${project.budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Box Office / Revenue</span>
                <span className="font-bold text-green-400">${results.revenue.toLocaleString()}</span>
              </div>
              <div className="pt-3 border-t border-slate-600 flex justify-between text-lg">
                <span className="font-bold">Net Profit / Loss</span>
                <span className={`font-bold ${profitColor}`}>
                  {profit >= 0 ? '+' : ''}${profit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Story Tags */}
          {project.storyOutcome && project.storyOutcome.tags.length > 0 && (
            <div className="bg-slate-700 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-purple-300">STORY HIGHLIGHTS</h3>
              <div className="flex flex-wrap gap-2">
                {project.storyOutcome.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-purple-600 rounded-full text-sm font-bold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Performance Message */}
          <div className="p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-600 rounded-lg mb-8">
            <p className="text-lg text-center">
              {results.audienceScore >= 80 && results.criticScore >= 80 && (
                <span className="text-green-400">🏆 <strong>Critical and Commercial Success!</strong> A rare achievement.</span>
              )}
              {results.audienceScore >= 80 && results.criticScore < 80 && (
                <span className="text-blue-400">🎉 <strong>Crowd Pleaser!</strong> Audiences loved it.</span>
              )}
              {results.audienceScore < 80 && results.criticScore >= 80 && (
                <span className="text-purple-400">⭐ <strong>Critics' Darling!</strong> Acclaimed by reviewers.</span>
              )}
              {results.audienceScore < 60 && results.criticScore < 60 && (
                <span className="text-slate-400">📉 <strong>Mixed Reception.</strong> Room for improvement.</span>
              )}
              {results.audienceScore >= 60 && results.audienceScore < 80 && 
               results.criticScore >= 60 && results.criticScore < 80 && (
                <span className="text-slate-300">👍 <strong>Solid Performance!</strong> A respectable release.</span>
              )}
            </p>
          </div>
          
          {/* Continue */}
          <button
            onClick={onContinue}
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition-colors text-lg"
          >
            RETURN TO STUDIO
          </button>
        </div>
      </div>
    </div>
  );
}
