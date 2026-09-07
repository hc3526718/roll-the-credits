'use client';

import { useState } from 'react';
import { ProjectFormat, Genre, BudgetTier, Studio } from '@/lib/types';
import { calculateBudget } from '@/lib/game-logic';

interface ConceptPhaseProps {
  studio: Studio;
  onConfirm: (concept: {
    name: string;
    format: ProjectFormat;
    genre: Genre;
    budgetTier: BudgetTier;
  }) => void;
  onCancel: () => void;
}

export default function ConceptPhase({ studio, onConfirm, onCancel }: ConceptPhaseProps) {
  const [name, setName] = useState('');
  const [format, setFormat] = useState<ProjectFormat>('Feature');
  const [genre, setGenre] = useState<Genre>('Drama');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Low');
  
  const budget = calculateBudget(format, budgetTier);
  const canAfford = studio.cash >= budget;
  
  const formats: ProjectFormat[] = ['Feature', 'Limited Series', 'Short'];
  const genres: Genre[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Fantasy'];
  const budgetTiers: BudgetTier[] = ['Micro', 'Low', 'Mid', 'High'];
  
  const matchingTrend = studio.trends.find(t => t.genre === genre);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ← BACK TO OFFICE
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 pixel-text">NEW PROJECT CONCEPT</h1>
          
          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">PROJECT NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-lg focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            {/* Format */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">FORMAT</label>
              <div className="grid grid-cols-3 gap-3">
                {formats.map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      format === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Genre */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">GENRE</label>
              <div className="grid grid-cols-4 gap-3">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                      genre === g
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              {matchingTrend && (
                <div className="mt-3 p-3 bg-purple-900/30 border border-purple-600 rounded-lg">
                  <p className="text-sm text-purple-300">
                    🔥 <strong>{matchingTrend.name}</strong> is trending! 
                    <span className="text-purple-400"> +{matchingTrend.audienceBoost} audience appeal</span>
                  </p>
                </div>
              )}
            </div>
            
            {/* Budget Tier */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">BUDGET TIER</label>
              <div className="grid grid-cols-4 gap-3">
                {budgetTiers.map(tier => {
                  const tierBudget = calculateBudget(format, tier);
                  const affordable = studio.cash >= tierBudget;
                  
                  return (
                    <button
                      key={tier}
                      onClick={() => setBudgetTier(tier)}
                      disabled={!affordable}
                      className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                        budgetTier === tier
                          ? 'bg-purple-600 text-white'
                          : affordable
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      <div>{tier}</div>
                      <div className="text-xs mt-1">${(tierBudget / 1000).toFixed(0)}K</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Summary */}
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">TOTAL BUDGET</p>
                  <p className="text-2xl font-bold text-green-400">${budget.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">YOUR CASH</p>
                  <p className={`text-2xl font-bold ${canAfford ? 'text-white' : 'text-red-400'}`}>
                    ${studio.cash.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            {!canAfford && (
              <div className="p-4 bg-red-900/30 border border-red-600 rounded-lg">
                <p className="text-red-300">⚠️ Insufficient funds for this budget tier</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => name.trim() && canAfford && onConfirm({ name: name.trim(), format, genre, budgetTier })}
                disabled={!name.trim() || !canAfford}
                className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 font-bold rounded-lg transition-colors"
              >
                CONFIRM CONCEPT
              </button>
              <button
                onClick={onCancel}
                className="px-6 py-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-lg transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
