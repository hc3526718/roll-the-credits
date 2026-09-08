'use client';

import { useState } from 'react';

interface StartScreenProps {
  onStart: (studioName: string, founderName: string, skipTutorial: boolean) => void;
  onLoad: () => boolean;
}

export default function StartScreen({ onStart, onLoad }: StartScreenProps) {
  const [studioName, setStudioName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  const [skipTutorial, setSkipTutorial] = useState(false);
  
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
          <div className="space-y-4 max-w-md mx-auto">
            <div className="space-y-3">
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Your name (founder)..."
                className="px-4 py-3 w-full bg-slate-800 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-400"
                autoFocus
              />
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Studio name..."
                className="px-4 py-3 w-full bg-slate-800 text-white border-2 border-purple-500 rounded-lg focus:outline-none focus:border-purple-400"
              />
              <label className="flex items-center gap-2 text-purple-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipTutorial}
                  onChange={(e) => setSkipTutorial(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Skip tutorial</span>
              </label>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => studioName.trim() && founderName.trim() && onStart(studioName.trim(), founderName.trim(), skipTutorial)}
                disabled={!studioName.trim() || !founderName.trim()}
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
