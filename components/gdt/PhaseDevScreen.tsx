'use client';

import { useState, useEffect } from 'react';
import { Project, PhaseAllocation, DevelopmentPhase, StaffMember } from '@/lib/types-gdt';
import { getPhaseTime, calculatePhaseQuality } from '@/lib/project-gdt';

interface PhaseDevScreenProps {
  project: Project;
  staff: StaffMember[];
  onPhaseComplete: (allocation: Partial<PhaseAllocation>) => void;
  onShowScenePlanner?: () => void; // For Phase 2
}

export default function PhaseDevScreen({ project, staff, onPhaseComplete, onShowScenePlanner }: PhaseDevScreenProps) {
  const phase = project.phaseState.currentPhase;
  const phaseTime = getPhaseTime(phase, project.budgetTier);
  
  // Initialize sliders based on phase
  const [story, setStory] = useState(50);
  const [script, setScript] = useState(50);
  const [attachments, setAttachments] = useState(50);
  
  const [direction, setDirection] = useState(50);
  const [cinematography, setCinematography] = useState(50);
  const [performance, setPerformance] = useState(50);
  
  const [editing, setEditing] = useState(50);
  const [soundVFX, setSoundVFX] = useState(50);
  const [marketing, setMarketing] = useState(50);
  
  const getPhaseDetails = () => {
    if (phase === 'phase1') {
      return {
        name: 'Phase 1: Script & Package',
        description: 'Develop the story, write the script, and attach key talent.',
        sliders: [
          { name: 'Story Development', value: story, setValue: setStory },
          { name: 'Script Writing', value: script, setValue: setScript },
          { name: 'Talent Attachments', value: attachments, setValue: setAttachments }
        ]
      };
    } else if (phase === 'phase2') {
      return {
        name: 'Phase 2: Production Craft',
        description: 'Direct the film, capture cinematography, and guide performances.',
        sliders: [
          { name: 'Direction', value: direction, setValue: setDirection },
          { name: 'Cinematography', value: cinematography, setValue: setCinematography },
          { name: 'Performance', value: performance, setValue: setPerformance }
        ]
      };
    } else {
      return {
        name: 'Phase 3: Finish & Sell',
        description: 'Edit the film, finalize sound/VFX, and market to audiences.',
        sliders: [
          { name: 'Editing', value: editing, setValue: setEditing },
          { name: 'Sound/VFX', value: soundVFX, setValue: setSoundVFX },
          { name: 'Marketing', value: marketing, setValue: setMarketing }
        ]
      };
    }
  };
  
  const details = getPhaseDetails();
  
  // Calculate estimated quality
  const allocation: PhaseAllocation = {
    story, script, attachments,
    direction, cinematography, performance,
    editing, soundVFX, marketing
  };
  
  const assignedStaff = staff.filter(s => project.assignedStaff.includes(s.id));
  const estimatedQuality = calculatePhaseQuality(phase, allocation, assignedStaff);
  
  const handleComplete = () => {
    if (phase === 'phase1') {
      onPhaseComplete({ story, script, attachments });
    } else if (phase === 'phase2') {
      onPhaseComplete({ direction, cinematography, performance });
    } else {
      onPhaseComplete({ editing, soundVFX, marketing });
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold pixel-text text-purple-300">{project.name}</h1>
            <p className="text-slate-400 mt-1">{project.genre} • {project.tone}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Left: Phase Info */}
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded">
                <h2 className="text-lg font-bold mb-2">{details.name}</h2>
                <p className="text-sm text-slate-300 mb-4">{details.description}</p>
                <div className="text-xs space-y-1 text-slate-400">
                  <p>Duration: {phaseTime} weeks</p>
                  <p>Budget: ${project.budget.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-slate-700 p-4 rounded">
                <h3 className="text-sm font-bold mb-2 text-purple-300">Assigned Staff</h3>
                <div className="space-y-2">
                  {assignedStaff.map(s => (
                    <div key={s.id} className="text-xs">
                      <p className="font-bold">{s.name}</p>
                      <p className="text-slate-400 capitalize">{s.role.replace(/-/g, ' ')}</p>
                      <p className="text-[10px] text-slate-500">D:{s.design} T:{s.tech}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 p-4 rounded border-2 border-purple-600">
                <p className="text-xs mb-1">ESTIMATED QUALITY</p>
                <p className="text-3xl font-bold">{Math.round(estimatedQuality)}<span className="text-lg">/100</span></p>
              </div>
            </div>
            
            {/* Center & Right: Sliders */}
            <div className="col-span-2 space-y-6">
              <div className="bg-slate-700 p-6 rounded">
                <h3 className="text-lg font-bold mb-4 pixel-text">Allocation Sliders</h3>
                <p className="text-sm text-slate-300 mb-6">
                  Adjust how much effort to put into each area. Higher values = more time/resources.
                </p>
                
                <div className="space-y-6">
                  {details.sliders.map(slider => (
                    <div key={slider.name}>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-semibold">{slider.name}</label>
                        <span className="text-sm text-purple-400">{slider.value}/100</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider.value}
                        onChange={(e) => slider.setValue(Number(e.target.value))}
                        className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Special Phase 2 Beat: Scene Planner */}
              {phase === 'phase2' && onShowScenePlanner && !project.scenePlannerDone && (
                <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-4 rounded border-2 border-orange-600">
                  <p className="text-sm font-bold mb-2">🎬 SCENE PLANNER AVAILABLE</p>
                  <p className="text-xs text-slate-300 mb-3">Arrange actors in scenes (Storyteller-inspired beat)</p>
                  <button
                    onClick={onShowScenePlanner}
                    className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded font-bold"
                  >
                    PLAN SCENES
                  </button>
                </div>
              )}
              
              {project.scenePlannerDone && (
                <div className="bg-green-900/30 p-3 rounded border border-green-600 text-sm">
                  ✓ Scene planner completed (Quality bonus: +{Math.round((project.scenePlannerQuality || 0) * 0.15)})
                </div>
              )}
              
              {/* Complete Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleComplete}
                  className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 rounded font-bold pixel-text text-lg"
                >
                  COMPLETE PHASE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
