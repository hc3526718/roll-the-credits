'use client';

import { useState } from 'react';
import { EditChoice } from '@/lib/types';

interface EditingPhaseProps {
  onConfirm: (choices: EditChoice) => void;
}

export default function EditingPhase({ onConfirm }: EditingPhaseProps) {
  const [pacing, setPacing] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [coldOpen, setColdOpen] = useState(false);
  const [cutScenes, setCutScenes] = useState(0);
  const [titleEnergy, setTitleEnergy] = useState<'subtle' | 'bold' | 'viral'>('bold');
  const [thumbnailStyle, setThumbnailStyle] = useState<'artistic' | 'dramatic' | 'clickbait'>('dramatic');
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <h1 className="text-3xl font-bold mb-6 text-purple-300 pixel-text">POST-PRODUCTION</h1>
          <p className="text-slate-400 mb-8">
            Make editing choices that affect audience vs critic appeal
          </p>
          
          <div className="space-y-6">
            {/* Pacing */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">PACING</label>
              <div className="grid grid-cols-3 gap-3">
                {(['slow', 'medium', 'fast'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPacing(p)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      pacing === p
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {p.toUpperCase()}
                    <div className="text-xs mt-1 opacity-75">
                      {p === 'slow' && '+8 critic / -5 audience'}
                      {p === 'medium' && 'Balanced'}
                      {p === 'fast' && '+8 audience / -3 critic'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Cold Open */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">COLD OPEN</label>
              <button
                onClick={() => setColdOpen(!coldOpen)}
                className={`w-full px-4 py-3 rounded-lg font-bold transition-colors ${
                  coldOpen
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {coldOpen ? '✓ START WITH ACTION' : '✗ TRADITIONAL OPENING'}
                <div className="text-xs mt-1 opacity-75">
                  {coldOpen ? '+5 audience retention' : 'Classic approach'}
                </div>
              </button>
            </div>
            
            {/* Cut Scenes */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">
                CUT SCENES FOR RUNTIME
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map(n => (
                  <button
                    key={n}
                    onClick={() => setCutScenes(n)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      cutScenes === n
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {n === 0 ? 'NONE' : `CUT ${n}`}
                    <div className="text-xs mt-1 opacity-75">
                      {n === 0 && 'Full vision'}
                      {n > 0 && `+${n * 2} audience / -${n * 3} critic`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Title Energy */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">TITLE TREATMENT</label>
              <div className="grid grid-cols-3 gap-3">
                {(['subtle', 'bold', 'viral'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTitleEnergy(t)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      titleEnergy === t
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {t.toUpperCase()}
                    <div className="text-xs mt-1 opacity-75">
                      {t === 'subtle' && '+5 critic / -3 audience'}
                      {t === 'bold' && 'Balanced'}
                      {t === 'viral' && '+10 audience / -5 critic'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Thumbnail Style */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3">
                THUMBNAIL / POSTER STYLE
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['artistic', 'dramatic', 'clickbait'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setThumbnailStyle(s)}
                    className={`px-4 py-3 rounded-lg font-bold transition-colors ${
                      thumbnailStyle === s
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {s.toUpperCase()}
                    <div className="text-xs mt-1 opacity-75">
                      {s === 'artistic' && '+10 critic / -2 audience'}
                      {s === 'dramatic' && 'Balanced'}
                      {s === 'clickbait' && '+12 audience / -8 critic'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="mt-8 p-4 bg-purple-900/20 border border-purple-600 rounded-lg">
            <p className="text-sm text-purple-200">
              💡 <strong>Edit Strategy:</strong> Fast-paced with viral marketing favors audience. 
              Slow, artistic approach favors critics. Balance for broad appeal.
            </p>
          </div>
          
          {/* Action */}
          <button
            onClick={() => onConfirm({ pacing, coldOpen, cutScenes, titleEnergy, thumbnailStyle })}
            className="w-full mt-6 px-6 py-4 bg-purple-600 hover:bg-purple-700 font-bold rounded-lg transition-colors"
          >
            FINALIZE & RELEASE
          </button>
        </div>
      </div>
    </div>
  );
}
