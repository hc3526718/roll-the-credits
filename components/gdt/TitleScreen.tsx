'use client';

import { useState } from 'react';

interface TitleScreenProps {
  onNewGame: (studioName: string, founderName: string) => void;
  onContinue: () => boolean;
  onReset: () => void;
}

export default function TitleScreen({ onNewGame, onContinue, onReset }: TitleScreenProps) {
  const [showNewGame, setShowNewGame] = useState(false);
  const [studioName, setStudioName] = useState('');
  const [founderName, setFounderName] = useState('');
  
  if (showNewGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="pixel-border bg-slate-800 p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold pixel-text mb-6 text-center text-purple-300">NEW STUDIO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-slate-300">Founder Name (VFX Artist)</label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Your name..."
                className="w-full px-4 py-3 bg-slate-900 text-white border-2 border-purple-500 rounded"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300">Studio Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Studio name..."
                className="w-full px-4 py-3 bg-slate-900 text-white border-2 border-purple-500 rounded"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  if (studioName.trim() && founderName.trim()) {
                    onNewGame(studioName.trim(), founderName.trim());
                  }
                }}
                disabled={!studioName.trim() || !founderName.trim()}
                className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded pixel-border"
              >
                START
              </button>
              <button
                onClick={() => setShowNewGame(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded pixel-border"
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      <div className="text-center space-y-12">
        <div>
          <h1 className="text-7xl font-bold pixel-text mb-4 text-white">ROLL THE CREDITS</h1>
          <p className="text-2xl text-purple-300 pixel-text">Film Studio Tycoon</p>
          <p className="text-sm text-slate-400 mt-2">GDT Edition</p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setShowNewGame(true)}
            className="w-80 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold rounded-lg pixel-border transition-colors"
          >
            NEW GAME
          </button>
          <button
            onClick={() => {
              const loaded = onContinue();
              if (!loaded) {
                alert('No saved game found!');
              }
            }}
            className="w-80 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-xl font-bold rounded-lg pixel-border transition-colors"
          >
            CONTINUE
          </button>
          <button
            onClick={() => {
              if (confirm('Reset will delete your save. Are you sure?')) {
                onReset();
              }
            }}
            className="w-80 px-6 py-3 bg-red-900 hover:bg-red-800 text-white font-bold rounded-lg pixel-border transition-colors"
          >
            RESET SAVE
          </button>
        </div>
        
        <div className="text-sm text-slate-500 max-w-2xl mx-auto">
          <p>Garage → Contracts → Research → Hire → Upgrade Studios</p>
          <p className="mt-1">3-Phase Development • Genre/Tone Combos • Time-Gated Progression</p>
        </div>
      </div>
    </div>
  );
}
