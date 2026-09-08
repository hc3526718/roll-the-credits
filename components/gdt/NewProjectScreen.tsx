'use client';

import { useState } from 'react';
import { FilmGenre, FilmTone, ProjectFormat, BudgetTier, ProjectTopic } from '@/lib/types-gdt';
import { getComboRating, getComboDescription } from '@/lib/genre-combos';
import { calculateBudget } from '@/lib/project-gdt';

interface NewProjectScreenProps {
  availableTopics: ProjectTopic[];
  availableGenres: FilmGenre[];
  availableTones: FilmTone[];
  availableFormats: ProjectFormat[];
  onConfirm: (data: {
    name: string;
    topic: ProjectTopic;
    genre: FilmGenre;
    tone: FilmTone;
    format: ProjectFormat;
    budgetTier: BudgetTier;
  }) => void;
  onCancel: () => void;
}

export default function NewProjectScreen({
  availableTopics,
  availableGenres,
  availableTones,
  availableFormats,
  onConfirm,
  onCancel
}: NewProjectScreenProps) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState<ProjectTopic>(availableTopics[0]);
  const [genre, setGenre] = useState<FilmGenre>(availableGenres[0]);
  const [tone, setTone] = useState<FilmTone>(availableTones[0]);
  const [format, setFormat] = useState<ProjectFormat>(availableFormats[0]);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Micro');
  
  const combo = getComboRating(genre, tone);
  const budget = calculateBudget(budgetTier);
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          <h1 className="text-3xl font-bold pixel-text mb-6 text-purple-300">NEW PROJECT</h1>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-slate-300">Project Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter project name..."
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-300">Topic (What)</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as ProjectTopic)}
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                >
                  {availableTopics.map(t => (
                    <option key={t} value={t}>{t.replace('-', ' ')}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-300">Genre (How)</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value as FilmGenre)}
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                >
                  {availableGenres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-300">Tone (Feel)</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as FilmTone)}
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                >
                  {availableTones.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              
              {/* Combo Rating */}
              {combo && (
                <div className={`p-3 rounded border-2 ${
                  combo.rating === 'great' ? 'bg-green-900/30 border-green-600' :
                  combo.rating === 'good' ? 'bg-blue-900/30 border-blue-600' :
                  combo.rating === 'poor' ? 'bg-red-900/30 border-red-600' :
                  'bg-slate-700 border-slate-600'
                }`}>
                  <p className="text-xs font-bold mb-1">GENRE + TONE COMBO</p>
                  <p className="text-sm">{getComboDescription(combo.rating)}</p>
                  <div className="flex gap-3 mt-2 text-xs">
                    <span>Quality: {combo.qualityBoost > 0 ? '+' : ''}{combo.qualityBoost}</span>
                    <span>Audience: {combo.audienceBoost > 0 ? '+' : ''}{combo.audienceBoost}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2 text-slate-300">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ProjectFormat)}
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                >
                  {availableFormats.map(f => (
                    <option key={f} value={f}>{f.replace(/-/g, ' ')}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-2 text-slate-300">Budget Tier</label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value as BudgetTier)}
                  className="w-full px-4 py-2 bg-slate-900 text-white border-2 border-purple-500 rounded"
                >
                  <option value="Micro">Micro ($10K)</option>
                  <option value="Low">Low ($50K)</option>
                  <option value="Medium">Medium ($200K)</option>
                  <option value="High">High ($1M)</option>
                  <option value="Blockbuster">Blockbuster ($10M)</option>
                </select>
              </div>
              
              <div className="bg-slate-700 p-4 rounded">
                <p className="text-sm mb-2">Budget: <span className="font-bold text-green-400">${budget.toLocaleString()}</span></p>
                <p className="text-xs text-slate-400">This will be deducted from your cash when you start.</p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => {
                if (name.trim()) {
                  onConfirm({ name: name.trim(), topic, genre, tone, format, budgetTier });
                }
              }}
              disabled={!name.trim()}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded font-bold pixel-text"
            >
              START PROJECT
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded font-bold pixel-text"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
