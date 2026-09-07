'use client';

import { useState } from 'react';
import { Talent, ScenePanel, SceneSetting } from '@/lib/types';
import { calculateChemistry } from '@/lib/game-data';

interface ScenePlannerProps {
  talent: Talent[];
  existingScenes?: ScenePanel[];
  onConfirm: (scenes: ScenePanel[]) => void;
  onBack: () => void;
}

export default function ScenePlanner({ talent, existingScenes, onConfirm, onBack }: ScenePlannerProps) {
  const [scenes, setScenes] = useState<ScenePanel[]>(
    existingScenes && existingScenes.length > 0 
      ? existingScenes 
      : [
        { id: `scene-0`, setting: 'Interior', characters: [], position: 0, importance: 'key' },
        { id: `scene-1`, setting: 'Exterior-Day', characters: [], position: 1, importance: 'supporting' },
        { id: `scene-2`, setting: 'Interior', characters: [], position: 2, importance: 'key' }
      ]
  );
  
  const [draggedTalent, setDraggedTalent] = useState<string | null>(null);
  
  const settings: SceneSetting[] = ['Interior', 'Exterior-Day', 'Exterior-Night', 'Special-Effects'];
  const actors = talent.filter(t => t.role === 'Actor');
  
  // Actors can now appear in multiple scenes, so show all actors always
  const availableActors = actors;
  
  const addScene = () => {
    if (scenes.length < 5) {
      setScenes([...scenes, { 
        id: `scene-${Date.now()}`,
        setting: 'Interior', 
        characters: [], 
        position: scenes.length,
        importance: 'supporting'
      }]);
    }
  };
  
  const removeScene = (position: number) => {
    if (scenes.length > 2) {
      setScenes(scenes.filter(s => s.position !== position).map((s, i) => ({ ...s, position: i })));
    }
  };
  
  const updateSetting = (position: number, setting: SceneSetting) => {
    setScenes(scenes.map(s => s.position === position ? { ...s, setting } : s));
  };
  
  const addCharacter = (position: number, talentId: string) => {
    setScenes(scenes.map(s => {
      if (s.position === position && !s.characters.includes(talentId)) {
        return { ...s, characters: [...s.characters, talentId] };
      }
      return s;
    }));
  };
  
  const removeCharacter = (position: number, talentId: string) => {
    setScenes(scenes.map(s => 
      s.position === position 
        ? { ...s, characters: s.characters.filter(id => id !== talentId) }
        : s
    ));
  };
  
  // At least one scene must have content
  const hasContent = scenes.some(s => s.characters.length > 0);
  
  const getChemistryColor = (chem: number) => {
    if (chem >= 70) return 'text-green-400';
    if (chem >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
            ← BACK
          </button>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 pixel-border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-300 pixel-text">SCENE PLANNER</h1>
            <p className="text-slate-400 mt-2">
              Arrange your actors across scenes. Chemistry between characters affects quality!
            </p>
          </div>
          
          {/* Scene Panels */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4 overflow-x-auto pb-4">
              {scenes.map((scene, idx) => {
                const sceneTalent = scene.characters
                  .map(id => talent.find(t => t.id === id))
                  .filter(Boolean) as Talent[];
                
                // Calculate chemistry for this scene
                let chemistryInfo = null;
                if (sceneTalent.length >= 2) {
                  const chem = calculateChemistry(sceneTalent[0], sceneTalent[1]);
                  chemistryInfo = { value: chem, color: getChemistryColor(chem) };
                }
                
                return (
                  <div
                    key={scene.position}
                    className="flex-shrink-0 w-64 bg-slate-700 rounded-lg p-4 border-2 border-slate-600"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedTalent && scene.characters.length < 3) {
                        addCharacter(scene.position, draggedTalent);
                        setDraggedTalent(null);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-xs text-purple-300 font-bold">SCENE {idx + 1}</div>
                      {scenes.length > 2 && (
                        <button
                          onClick={() => removeScene(scene.position)}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    <select
                      value={scene.setting}
                      onChange={(e) => updateSetting(scene.position, e.target.value as SceneSetting)}
                      className="w-full mb-3 px-2 py-1 text-xs bg-slate-800 border border-slate-600 rounded"
                    >
                      {settings.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    
                    <div className="min-h-[120px] bg-slate-800 rounded-lg p-3 space-y-2">
                      {sceneTalent.length === 0 && (
                        <p className="text-xs text-slate-500 text-center py-8">
                          Drop actors here
                        </p>
                      )}
                      {sceneTalent.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between bg-slate-700 rounded px-2 py-1"
                        >
                          <span className="text-xs font-bold">{t.name.split(' ')[0]}</span>
                          <button
                            onClick={() => removeCharacter(scene.position, t.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {chemistryInfo && (
                      <div className="mt-2 text-xs text-center">
                        <span className="text-slate-400">Chemistry: </span>
                        <span className={`font-bold ${chemistryInfo.color}`}>
                          {chemistryInfo.value}/100
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
              
              {scenes.length < 5 && (
                <button
                  onClick={addScene}
                  className="flex-shrink-0 w-64 h-48 bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-purple-400 hover:border-purple-600 transition-colors"
                >
                  + ADD SCENE
                </button>
              )}
            </div>
          </div>
          
          {/* Available Actors */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-bold text-purple-300 mb-3">ACTORS (can appear in multiple scenes)</h3>
            <div className="flex flex-wrap gap-2">
              {availableActors.length === 0 ? (
                <p className="text-sm text-slate-400">No actors hired</p>
              ) : (
                availableActors.map(actor => {
                  const usageCount = scenes.filter(s => s.characters.includes(actor.id)).length;
                  return (
                    <div
                      key={actor.id}
                      draggable
                      onDragStart={() => setDraggedTalent(actor.id)}
                      onDragEnd={() => setDraggedTalent(null)}
                      className={`px-3 py-2 bg-slate-800 border-2 rounded cursor-move hover:border-purple-500 transition-colors ${
                        usageCount > 0 ? 'border-purple-600' : 'border-slate-600'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold">{actor.name}</p>
                        {usageCount > 0 && (
                          <span className="text-xs bg-purple-600 px-1 rounded">{usageCount}×</span>
                        )}
                      </div>
                      <div className="flex gap-2 text-xs text-slate-400 mt-1">
                        <span>Skill: {actor.stats.skill}</span>
                        <span>Fame: {actor.stats.fame}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {actor.chemistryTags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-1 bg-slate-700 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          {/* Help */}
          <div className="mt-4 p-3 bg-purple-900/20 border border-purple-600 rounded-lg text-sm text-purple-200">
            <p className="font-bold mb-1">💡 Scene Planning Tips:</p>
            <ul className="text-xs space-y-1 text-purple-300">
              <li>• Drag actors into scenes (up to 3 per scene)</li>
              <li>• High chemistry (70+) = quality boost & audience appeal</li>
              <li>• Low chemistry (30-) = quality penalty</li>
              <li>• Scene 1 sets the tone - use your best talent!</li>
              <li>• Matching chemistry tags create better pairings</li>
            </ul>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => hasContent && onConfirm(scenes)}
              disabled={!hasContent}
              className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 font-bold rounded-lg transition-colors"
            >
              LOCK SCENES & START PRODUCTION
            </button>
            <button
              onClick={onBack}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 font-bold rounded-lg transition-colors"
            >
              BACK
            </button>
          </div>
          
          {!hasContent && (
            <p className="mt-4 text-center text-sm text-red-400">
              At least one scene must have a character
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
