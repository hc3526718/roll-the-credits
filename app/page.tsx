'use client';

import { useGame } from '@/lib/game-context-gdt';
import { useState } from 'react';

// Minimal MVP - just to get building
export default function Home() {
  const { state, initializeGame, loadGame } = useGame();
  const [studioName, setStudioName] = useState('');
  const [founderName, setFounderName] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  
  if (!state.initialized) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-8 p-8">
          <h1 className="text-6xl font-bold pixel-text">ROLL THE CREDITS</h1>
          <p className="text-xl text-slate-400">GDT Edition - Film Studio Tycoon</p>
          
          {!showNewGame ? (
            <div className="space-y-4">
              <button
                onClick={() => setShowNewGame(true)}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg w-64 pixel-border"
              >
                NEW GAME
              </button>
              <button
                onClick={() => {
                  const loaded = loadGame();
                  if (!loaded) alert('No saved game found!');
                }}
                className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg w-64 pixel-border"
              >
                LOAD GAME
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="Your name (VFX artist founder)..."
                className="px-4 py-3 w-96 bg-slate-800 text-white border-2 border-purple-500 rounded-lg"
                autoFocus
              />
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Studio name..."
                className="px-4 py-3 w-96 bg-slate-800 text-white border-2 border-purple-500 rounded-lg"
              />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    if (studioName.trim() && founderName.trim()) {
                      initializeGame(studioName.trim(), founderName.trim());
                    }
                  }}
                  disabled={!studioName.trim() || !founderName.trim()}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold rounded-lg"
                >
                  START
                </button>
                <button
                  onClick={() => setShowNewGame(false)}
                  className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg"
                >
                  BACK
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  const studio = state.studio;
  
  // Simple office view
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top bar */}
      <div className="bg-slate-800 border-b-2 border-purple-600 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold pixel-text">{studio.name}</h1>
            <p className="text-sm text-slate-400">
              {studio.officeTier.toUpperCase()} • Y{studio.calendar.year} M{studio.calendar.month} W{studio.calendar.week}
            </p>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-slate-400">CASH</p>
              <p className="text-xl font-bold text-green-400">${studio.cash.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">FANS</p>
              <p className="text-xl font-bold text-blue-400">{studio.fans.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">REP</p>
              <p className="text-xl font-bold text-purple-400">{studio.reputation}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-slate-800 pixel-border p-6 rounded">
          <h2 className="text-3xl font-bold mb-4 pixel-text">Office - {studio.officeTier.replace(/-/g, ' ')}</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl mb-2">Staff</h3>
              <div className="space-y-2">
                {studio.staff.map(s => (
                  <div key={s.id} className="bg-slate-700 p-3 rounded">
                    <p className="font-bold">{s.name} - {s.role}</p>
                    <p className="text-sm text-slate-400">
                      Design: {s.design} | Tech: {s.tech} | Speed: {s.speed} | Research: {s.research} | Lvl {s.level}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl mb-2">Active Projects</h3>
              {studio.activeProjects.length === 0 ? (
                <p className="text-slate-400">No active projects</p>
              ) : (
                <div className="space-y-2">
                  {studio.activeProjects.map(p => (
                    <div key={p.id} className="bg-slate-700 p-3 rounded">
                      <p className="font-bold">{p.name}</p>
                      <p className="text-sm">{p.genre} • {p.tone} • {p.format}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-xl mb-2">Research</h3>
              {studio.activeResearch ? (
                <p className="text-green-400">Researching: {studio.researchTree.find(r => r.id === studio.activeResearch)?.name}</p>
              ) : (
                <p className="text-slate-400">No active research</p>
              )}
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mt-8">
                GDT spine MVP - Core systems implemented. Full UI coming next iteration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
