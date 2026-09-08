// Tutorial screen for Roll the Credits v2

'use client';

import { TutorialStep } from '../lib/types';

interface TutorialScreenProps {
  currentStep: TutorialStep;
  onNext: () => void;
  onSkip: () => void;
}

const TUTORIAL_CONTENT: Record<TutorialStep, { title: string; text: string; buttonText: string }> = {
  'welcome': {
    title: 'Welcome to Roll the Credits',
    text: 'You\'re a VFX artist who couldn\'t break into the big studios. Instead of giving up, you\'ve decided to start your own tiny production outfit. Build your reputation through contract work, create micro-budget films with friends, and grow into a full-fledged studio.',
    buttonText: 'Start Your Journey'
  },
  'name-founder': {
    title: 'This will be handled in the next screen',
    text: '',
    buttonText: 'Continue'
  },
  'explain-calendar': {
    title: 'Time & Calendar',
    text: 'Time passes week-by-week. Projects take multiple weeks to complete. Contract work pays out over time. Plan your schedule carefully - you can only work on one project at a time, but you can take on multiple contracts.',
    buttonText: 'Got it'
  },
  'show-contracts': {
    title: 'Contract Work',
    text: 'Starting out, you need income. Take on VFX, editing, or sound contracts from other agencies. These pay weekly and help keep the lights on while you build your reputation. Your VFX skills make you perfect for these gigs.',
    buttonText: 'Show me'
  },
  'first-contract': {
    title: 'Accept Your First Contract',
    text: 'Choose a contract from the board. Once you accept it, you\'ll earn weekly payouts for the duration. This is your survival income as you build toward your first film.',
    buttonText: 'Understood'
  },
  'explain-projects': {
    title: 'Making Films',
    text: 'When you\'re ready, start a micro-budget film. You\'ll go through 5 stages: Planning, Pre-production, Filming, Post-production, and Marketing. Each stage takes time and money. Make smart decisions along the way.',
    buttonText: 'Continue'
  },
  'first-project': {
    title: 'Your First Project',
    text: 'Keep it small. You can only hire friends right now - cheap actors with low skill. But that\'s okay! A successful micro-budget film will build your reputation and unlock better talent.',
    buttonText: 'Let\'s do this'
  },
  'scene-planner': {
    title: 'Scene Planning',
    text: 'During the Filming stage, you\'ll arrange your cast into scenes. Character pairings and scene order affect the story outcome. Experiment to find interesting combinations!',
    buttonText: 'Got it'
  },
  'release-results': {
    title: 'Release & Results',
    text: 'After release, you\'ll earn money from the box office, gain followers, and build reputation. Higher reputation unlocks better talent, bigger budgets, and new studio upgrades. Keep making films and growing!',
    buttonText: 'Finish Tutorial'
  },
  'complete': {
    title: 'Tutorial Complete',
    text: '',
    buttonText: 'Start'
  }
};

export default function TutorialScreen({ currentStep, onNext, onSkip }: TutorialScreenProps) {
  if (currentStep === 'name-founder' || currentStep === 'complete') {
    return null; // These are handled elsewhere
  }
  
  const content = TUTORIAL_CONTENT[currentStep];
  
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
      <div className="max-w-2xl w-full">
        <div className="pixel-border" style={{ 
          background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
          padding: '3rem',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 className="pixel-text text-4xl mb-6" style={{ color: '#1e293b' }}>
              {content.title}
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: '#475569', fontFamily: 'monospace' }}>
              {content.text}
            </p>
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={onNext}
              className="pixel-border flex-1 py-4 hover:bg-gradient-to-b hover:from-blue-100 hover:to-blue-200 transition-colors"
              style={{ background: 'linear-gradient(to bottom, #dbeafe, #bfdbfe)' }}
            >
              <span className="pixel-text" style={{ color: '#1e40af' }}>
                {content.buttonText}
              </span>
            </button>
            
            {currentStep === 'welcome' && (
              <button
                onClick={onSkip}
                className="pixel-border px-6 py-4 hover:bg-gray-100 transition-colors"
                style={{ background: '#f1f5f9' }}
              >
                <span className="pixel-text text-sm" style={{ color: '#64748b' }}>
                  Skip Tutorial
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
