'use client';

import { useState } from 'react';
import SettingsPanel from './SettingsPanel';

interface TitleScreenProps {
  onNewGame: (studioName: string, founderName: string) => void;
  onContinue: () => boolean;
  onReset: () => void;
}

export default function TitleScreen({ onNewGame, onContinue, onReset }: TitleScreenProps) {
  const [showNewGame, setShowNewGame] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [studioName, setStudioName] = useState('');
  const [founderName, setFounderName] = useState('');
  
  if (showSettings) {
    return (
      <SettingsPanel
        onClose={() => setShowSettings(false)}
        onReset={() => {
          onReset();
          setShowSettings(false);
        }}
      />
    );
  }
  
  if (showNewGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
        <div className="pixel-border bg-slate-800 p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-4xl font-bold pixel-text mb-4 text-center text-yellow-300">🎬 NEW STUDIO</h2>
          <p className="text-center text-sm text-purple-300 mb-6 pixel-text">
            VFX Artist Origin Story
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-slate-300 pixel-text">👤 FOUNDER NAME</label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 bg-slate-900 text-white border-2 border-purple-500 rounded pixel-text"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-slate-300 pixel-text">🏢 STUDIO NAME</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Enter studio name..."
                className="w-full px-4 py-3 bg-slate-900 text-white border-2 border-purple-500 rounded pixel-text"
              />
            </div>
            <div className="bg-slate-900/50 p-3 rounded border border-purple-700 text-xs text-slate-300">
              <p className="pixel-text">
                After years of freelance VFX work, you're starting your own garage studio. 
                Take on contracts, build your reputation, and create films that matter.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  if (studioName.trim() && founderName.trim()) {
                    onNewGame(studioName.trim(), founderName.trim());
                  }
                }}
                disabled={!studioName.trim() || !founderName.trim()}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-lg pixel-border shadow-lg"
              >
                🚀 START
              </button>
              <button
                onClick={() => setShowNewGame(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg pixel-border"
              >
                ← BACK
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
          <div className="mb-8">
            <div className="text-8xl mb-4">🎬</div>
            <h1 className="text-7xl font-bold pixel-text mb-4 text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              ROLL THE CREDITS
            </h1>
            <p className="text-3xl text-purple-300 pixel-text drop-shadow-lg">Film Studio Tycoon</p>
            <p className="text-sm text-slate-400 mt-3 pixel-text">Inspired by Game Dev Tycoon • GDT Edition</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowNewGame(true)}
            className="w-96 px-8 py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-2xl font-bold rounded-lg pixel-border shadow-2xl transition-all transform hover:scale-105"
          >
            🎬 NEW GAME
          </button>
          <button
            onClick={() => {
              const loaded = onContinue();
              if (!loaded) {
                alert('No saved game found!');
              }
            }}
            className="w-96 px-8 py-5 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white text-2xl font-bold rounded-lg pixel-border shadow-xl transition-all transform hover:scale-105"
          >
            📂 CONTINUE
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="w-96 px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white text-xl font-bold rounded-lg pixel-border shadow-xl transition-all transform hover:scale-105"
          >
            ⚙️ SETTINGS
          </button>
        </div>
        
        <div className="text-sm text-slate-400 max-w-2xl mx-auto space-y-2 pixel-text">
          <p className="text-purple-300 font-bold">🏢 Garage → First Studio → Large Lot → Empire</p>
          <p>💼 Contracts • 🎯 Genre/Tone Combos • 🔬 Research • 👥 Staff Progression</p>
          <p className="text-xs text-slate-600 mt-4">Build films, manage your studio, roll the credits.</p>
        </div>
      </div>
    </div>
  );
}
