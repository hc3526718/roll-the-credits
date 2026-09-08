'use client';

import { useState } from 'react';
import { Project, StageAllocation, StaffMember, DevelopmentStage } from '@/lib/types-gdt';
import { getStageTime, getStageSliders } from '@/lib/project-gdt';

interface PhaseDevScreen5StageProps {
  project: Project;
  staff: StaffMember[];
  onPhaseComplete: (allocation: Partial<StageAllocation>) => void;
  onShowScenePlanner?: () => void;
  onBack: () => void;
}

export default function PhaseDevScreen5Stage({ 
  project, 
  staff, 
  onPhaseComplete, 
  onShowScenePlanner,
  onBack 
}: PhaseDevScreen5StageProps) {
  const stage = project.phaseState.currentStage;
  const [slider1, slider2, slider3] = getStageSliders(stage);
  
  // Get current values from project
  const [val1, setVal1] = useState(project.phaseState.allocation[slider1]);
  const [val2, setVal2] = useState(project.phaseState.allocation[slider2]);
  const [val3, setVal3] = useState(project.phaseState.allocation[slider3]);
  
  // Total must equal 100
  const total = val1 + val2 + val3;
  const isValid = Math.abs(total - 100) < 0.5;
  
  const getStageInfo = () => {
    const info = {
      'planning': {
        name: 'Planning',
        icon: '📝',
        description: 'Develop the script, plan the production',
        sliderLabels: ['Script/Story', 'Storyboard/Previz', 'Budget/Schedule']
      },
      'recruitment': {
        name: 'Recruitment',
        icon: '🎯',
        description: 'Assemble your cast and crew',
        sliderLabels: ['Casting', 'Crew', 'Locations']
      },
      'filming': {
        name: 'Filming',
        icon: '🎬',
        description: 'Capture the footage',
        sliderLabels: ['Cinematography', 'Performance', 'Production Design']
      },
      'post': {
        name: 'Post-Production',
        icon: '✂️',
        description: 'Edit, sound, and VFX',
        sliderLabels: ['Editing', 'Sound/Score', 'VFX/Grade']
      },
      'marketing': {
        name: 'Marketing',
        icon: '📢',
        description: 'Promote and distribute',
        sliderLabels: ['Trailer/Campaign', 'Press', 'Distribution/Release']
      }
    };
    return info[stage];
  };
  
  const stageInfo = getStageInfo();
  const stageTime = getStageTime(stage, project.budgetTier);
  
  // Helper to update sliders maintaining 100-pt pool
  const updateSlider = (
    index: number, 
    newVal: number,
    setter1: (v: number) => void,
    setter2: (v: number) => void,
    setter3: (v: number) => void,
    val1: number,
    val2: number,
    val3: number
  ) => {
    const values = [val1, val2, val3];
    values[index] = Math.max(0, Math.min(100, newVal));
    
    // Redistribute remaining points proportionally
    const remaining = 100 - values[index];
    const otherIndices = [0, 1, 2].filter(i => i !== index);
    const otherSum = otherIndices.reduce((sum, i) => sum + values[i], 0);
    
    if (otherSum > 0) {
      otherIndices.forEach(i => {
        values[i] = (values[i] / otherSum) * remaining;
      });
    } else {
      // Equal split if both others are 0
      otherIndices.forEach(i => {
        values[i] = remaining / otherIndices.length;
      });
    }
    
    setter1(values[0]);
    setter2(values[1]);
    setter3(values[2]);
  };
  
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="pixel-border bg-slate-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold pixel-text text-purple-300">
                {stageInfo.icon} {stageInfo.name}
              </h1>
              <p className="text-slate-400 mt-1">{project.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Duration: {stageTime} weeks</p>
              <p className="text-sm text-slate-400">
                Points: <span className={isValid ? 'text-green-400' : 'text-red-400'}>{Math.round(total)}/100</span>
              </p>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6">{stageInfo.description}</p>
          
          <div className="space-y-6 mb-8">
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-300">{stageInfo.sliderLabels[0]}</label>
                <span className="text-purple-300">{Math.round(val1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val1}
                onChange={(e) => updateSlider(0, parseInt(e.target.value), setVal1, setVal2, setVal3, val1, val2, val3)}
                className="w-full slider-gdt"
              />
            </div>
            
            {/* Slider 2 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-300">{stageInfo.sliderLabels[1]}</label>
                <span className="text-purple-300">{Math.round(val2)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val2}
                onChange={(e) => updateSlider(1, parseInt(e.target.value), setVal1, setVal2, setVal3, val1, val2, val3)}
                className="w-full slider-gdt"
              />
            </div>
            
            {/* Slider 3 */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold text-slate-300">{stageInfo.sliderLabels[2]}</label>
                <span className="text-purple-300">{Math.round(val3)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={val3}
                onChange={(e) => updateSlider(2, parseInt(e.target.value), setVal1, setVal2, setVal3, val1, val2, val3)}
                className="w-full slider-gdt"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded font-bold pixel-text"
            >
              ← BACK
            </button>
            <button
              onClick={() => {
                if (isValid) {
                  const allocation: Partial<StageAllocation> = {
                    [slider1]: Math.round(val1),
                    [slider2]: Math.round(val2),
                    [slider3]: Math.round(val3)
                  } as Partial<StageAllocation>;
                  onPhaseComplete(allocation);
                }
              }}
              disabled={!isValid}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded font-bold pixel-text"
            >
              COMPLETE {stageInfo.name.toUpperCase()} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
