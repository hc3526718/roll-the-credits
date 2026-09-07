'use client';

import { useState } from 'react';

interface StartScreenProps {
  onStart: (studioName: string) => void;
  onLoad: () => boolean;
}

export default function StartScreen({ onStart, onLoad }: StartScreenProps) {
  const [studioName, setStudioName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  
  const handleLoad = () => {
    const loaded = onLoad();
    if (!loaded) {
      alert('No saved game found!');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight pixel-text">
            ROLL THE CREDITS
          </h1>
          <p className="text-xl text-purple-200">
            A Creative Studio Tycoon
          </p>
        </div>
        
        {!showNewGame ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowNewGame(true)}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors w-64 pixel-border"
            >
              NEW GAME
            </button>
            <button
              onClick={handleLoad}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors w-64 pixel-border"
            >
              LOAD GAME
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="Enter studio name..."
              className="px-4 py-3 w-64 bg-slate-800 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-400"
              autoFocus
            />
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => studioName.trim() && onStart(studioName.trim())}
                disabled={!studioName.trim()}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
              >
                START
              </button>
              <button
                onClick={() => setShowNewGame(false)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
              >
                BACK
              </button>
            </div>
          </div>
        )}
        
        <div className="text-sm text-purple-300 mt-8 max-w-lg mx-auto">
          <p>Hybrid of Game Dev Tycoon, creator sims, and Storyteller.</p>
          <p className="mt-2">Build films, manage talent, arrange scenes, chase trends.</p>
        </div>
      </div>
    </div>
  );
}
