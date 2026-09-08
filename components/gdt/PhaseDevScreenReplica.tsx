'use client';

import { useState } from 'react';
import { Project, PhaseAllocation, StaffMember } from '@/lib/types-gdt';
import { getPhaseTime, calculatePhaseQuality } from '@/lib/project-gdt';

interface PhaseDevScreenReplicaProps {
  project: Project;
  staff: StaffMember[];
  onPhaseComplete: (allocation: Partial<PhaseAllocation>) => void;
  onShowScenePlanner?: () => void;
  onBack: () => void;
}

export default function PhaseDevScreenReplica({ 
  project, 
  staff, 
  onPhaseComplete, 
  onShowScenePlanner,
  onBack 
}: PhaseDevScreenReplicaProps) {
  const phase = project.phaseState.currentPhase;
  const phaseTime = getPhaseTime(phase, project.budgetTier);
  
  // Phase 1 sliders
  const [story, setStory] = useState(50);
  const [script, setScript] = useState(50);
  const [attachments, setAttachments] = useState(50);
  
  // Phase 2 sliders
  const [direction, setDirection] = useState(50);
  const [cinematography, setCinematography] = useState(50);
  const [performance, setPerformance] = useState(50);
  
  // Phase 3 sliders
  const [editing, setEditing] = useState(50);
  const [soundVFX, setSoundVFX] = useState(50);
  const [marketing, setMarketing] = useState(50);
  
  const getPhaseDetails = () => {
    if (phase === 'phase1') {
      return {
        name: 'Phase 1: Script & Package',
        icon: '📝',
        description: 'Develop the story, write the script, attach key talent',
        sliders: [
          { name: 'Story Development', value: story, setValue: setStory, icon: '📖', color: 'blue' },
          { name: 'Script Writing', value: script, setValue: setScript, icon: '✍️', color: 'green' },
          { name: 'Talent Attachments', value: attachments, setValue: setAttachments, icon: '⭐', color: 'purple' }
        ]
      };
    } else if (phase === 'phase2') {
      return {
        name: 'Phase 2: Production Craft',
        icon: '🎬',
        description: 'Direct the film, capture cinematography, guide performances',
        sliders: [
          { name: 'Direction', value: direction, setValue: setDirection, icon: '🎯', color: 'red' },
          { name: 'Cinematography', value: cinematography, setValue: setCinematography, icon: '📹', color: 'cyan' },
          { name: 'Performance', value: performance, setValue: setPerformance, icon: '🎭', color: 'yellow' }
        ]
      };
    } else {
      return {
        name: 'Phase 3: Finish & Sell',
        icon: '✨',
        description: 'Edit the film, finalize sound/VFX, market to audiences',
        sliders: [
          { name: 'Editing', value: editing, setValue: setEditing, icon: '✂️', color: 'orange' },
          { name: 'Sound/VFX', value: soundVFX, setValue: setSoundVFX, icon: '🔊', color: 'pink' },
          { name: 'Marketing', value: marketing, setValue: setMarketing, icon: '📢', color: 'indigo' }
        ]
      };
    }
  };
  
  const details = getPhaseDetails();
  
  const allocation: PhaseAllocation = {
    story, script, attachments,
    direction, cinematography, performance,
    editing, soundVFX, marketing
  };
  
  const assignedStaff = staff.filter(s => project.assignedStaff.includes(s.id));
  const estimatedQuality = calculatePhaseQuality(phase, allocation, assignedStaff);
  
  // Calculate total workload
  const totalWorkload = details.sliders.reduce((sum, s) => sum + s.value, 0);
  const avgWorkload = Math.floor(totalWorkload / details.sliders.length);
  
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* GDT-style header */}
      <div className="bg-gradient-to-r from-slate-800 to-purple-900 border-b-4 border-purple-600 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold pixel-text text-yellow-300">{project.name}</h1>
            <p className="text-sm text-purple-200 pixel-text">{project.genre} • {project.tone} • ${project.budget.toLocaleString()}</p>
          </div>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg pixel-text font-bold"
          >
            ← OFFICE
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Phase Banner */}
        <div className="pixel-border bg-gradient-to-r from-purple-900 to-blue-900 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{details.icon}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold pixel-text text-white">{details.name}</h2>
              <p className="text-sm text-purple-200 mt-1">{details.description}</p>
              <p className="text-xs text-slate-400 mt-2">⏱ {phaseTime} weeks • Team: {assignedStaff.length} staff</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 pixel-text">ESTIMATED QUALITY</p>
              <p className="text-4xl font-bold pixel-text text-yellow-300">{estimatedQuality}%</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Allocation Sliders */}
          <div className="col-span-2 space-y-4">
            <div className="pixel-border bg-slate-800/90 p-5">
              <h3 className="text-lg font-bold pixel-text mb-4 text-purple-300">📊 DEVELOPMENT ALLOCATION</h3>
              <div className="space-y-6">
                {details.sliders.map((slider, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm pixel-text flex items-center gap-2">
                        <span className="text-xl">{slider.icon}</span>
                        <span className="font-bold">{slider.name}</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${slider.color}-500 transition-all`}
                            style={{ width: `${slider.value}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold pixel-text text-yellow-300 w-12 text-right">
                          {slider.value}%
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider.value}
                        onChange={(e) => slider.setValue(Number(e.target.value))}
                        className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-gdt"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1 pixel-text">
                        <span>MINIMAL</span>
                        <span>BALANCED</span>
                        <span>MAXIMUM</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Workload Indicator */}
              <div className="mt-6 pt-4 border-t border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs pixel-text text-slate-400">⚡ AVG WORKLOAD</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          avgWorkload < 40 ? 'bg-green-500' :
                          avgWorkload < 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${avgWorkload}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold pixel-text text-yellow-300 w-12">
                      {avgWorkload}%
                    </span>
                  </div>
                </div>
                {avgWorkload > 70 && (
                  <p className="text-xs text-orange-400 mt-2 pixel-text">
                    ⚠️ High workload may increase staff burnout
                  </p>
                )}
              </div>
            </div>
            
            {/* Scene Planner Hook (Phase 2 only) */}
            {phase === 'phase2' && onShowScenePlanner && (
              <div className="pixel-border bg-gradient-to-r from-indigo-900 to-purple-900 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold pixel-text text-white">🎭 Scene Planner</h4>
                    <p className="text-xs text-purple-200 mt-1">Arrange characters for dramatic beats</p>
                  </div>
                  <button
                    onClick={onShowScenePlanner}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg pixel-text font-bold"
                  >
                    PLAN SCENES
                  </button>
                </div>
              </div>
            )}
            
            {/* Complete Button */}
            <button
              onClick={handleComplete}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg pixel-text text-xl font-bold shadow-lg"
            >
              ✓ COMPLETE {details.name.toUpperCase()}
            </button>
          </div>
          
          {/* Right: Staff Cards */}
          <div className="space-y-4">
            <div className="pixel-border bg-slate-800/90 p-4">
              <h3 className="text-lg font-bold pixel-text mb-4 text-green-300">👥 ASSIGNED TEAM</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {assignedStaff.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">No staff assigned</p>
                ) : (
                  assignedStaff.map(s => (
                    <div key={s.id} className="pixel-border bg-slate-700 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{s.role.replace(/-/g, ' ')}</p>
                        </div>
                        <span className="text-xs bg-purple-900 px-2 py-1 rounded pixel-text">
                          Lv {s.level}
                        </span>
                      </div>
                      
                      {/* Stats bars */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-12 text-blue-400 pixel-text">DESIGN</span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500"
                              style={{ width: `${(s.design / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-400 w-6 text-right">{s.design}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-12 text-green-400 pixel-text">TECH</span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500"
                              style={{ width: `${(s.tech / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-400 w-6 text-right">{s.tech}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] w-12 text-yellow-400 pixel-text">SPEED</span>
                          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500"
                              style={{ width: `${(s.speed / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-yellow-400 w-6 text-right">{s.speed}</span>
                        </div>
                      </div>
                      
                      {/* Burnout indicator */}
                      {s.burnout > 50 && (
                        <div className="mt-2 text-[10px] text-orange-400 flex items-center gap-1">
                          <span>🔥</span>
                          <span>Burnout: {s.burnout}%</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Project Info */}
            <div className="pixel-border bg-slate-800/90 p-4">
              <h3 className="text-sm font-bold pixel-text mb-2 text-slate-400">PROJECT INFO</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget:</span>
                  <span className="text-green-400 font-bold">${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Format:</span>
                  <span className="text-white">{project.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget Tier:</span>
                  <span className="text-purple-400 capitalize">{project.budgetTier}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
