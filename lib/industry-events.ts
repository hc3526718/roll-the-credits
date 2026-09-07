// Industry events system

import { IndustryEvent, IndustryEventType, Studio, TalentRole } from './types';

export function generateRandomEvent(currentDay: number): IndustryEvent | null {
  // ~5% chance per week of an event
  if (Math.random() > 0.05) return null;
  
  const eventTypes: IndustryEventType[] = [
    'writer-strike',
    'actor-burnout',
    'union-action',
    'festival-invite',
    'streaming-war',
    'weather-delay',
    'test-screening-leak',
    'awards-buzz'
  ];
  
  const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  return createEvent(type, currentDay);
}

export function createEvent(type: IndustryEventType, startDay: number): IndustryEvent {
  const events: Record<IndustryEventType, Omit<IndustryEvent, 'id' | 'startDay'>> = {
    'writer-strike': {
      type: 'writer-strike',
      name: 'Writers Guild Strike',
      description: 'Industry-wide writer strike. Only non-union writers available.',
      duration: 90, // 3 months
      effects: {
        blockedRoles: ['Writer'],
        salaryModifier: 1.5 // Non-union more expensive
      }
    },
    'actor-burnout': {
      type: 'actor-burnout',
      name: 'Star Takes Sabbatical',
      description: 'A high-profile actor announces break from work.',
      duration: 60,
      effects: {
        // Handled per-talent in logic
      }
    },
    'union-action': {
      type: 'union-action',
      name: 'Crew Union Action',
      description: 'Union negotiates rate increase for below-the-line crew.',
      duration: 30,
      effects: {
        salaryModifier: 1.2
      }
    },
    'festival-invite': {
      type: 'festival-invite',
      name: 'Festival Circuit Opens',
      description: 'Major festivals accepting submissions. Boosts prestige.',
      duration: 45,
      effects: {
        criticBoost: 5,
        reputationChange: 2
      }
    },
    'streaming-war': {
      type: 'streaming-war',
      name: 'Streaming Bidding War',
      description: 'Platforms competing for content. Higher revenues possible.',
      duration: 60,
      effects: {
        audienceBoost: 10
      }
    },
    'weather-delay': {
      type: 'weather-delay',
      name: 'Weather Disruption',
      description: 'Storms delay outdoor filming. Adds time to production.',
      duration: 14,
      effects: {
        // Handled in production stage
      }
    },
    'test-screening-leak': {
      type: 'test-screening-leak',
      name: 'Test Screening Leak',
      description: 'Early reactions leak online. Can build or hurt buzz.',
      duration: 7,
      effects: {
        // Random audience/critic modifier in logic
      }
    },
    'awards-buzz': {
      type: 'awards-buzz',
      name: 'Awards Season Buzz',
      description: 'Industry focused on prestige. Critic scores matter more.',
      duration: 90,
      effects: {
        criticBoost: 8,
        reputationChange: 3
      }
    }
  };
  
  const template = events[type];
  
  return {
    id: `event-${startDay}-${Math.random().toString(36).substr(2, 9)}`,
    ...template,
    startDay
  };
}

export function updateActiveEvents(studio: Studio): Studio {
  const currentDay = studio.daysPassed;
  
  // Remove expired events
  const activeEvents = studio.activeEvents.filter(event => 
    currentDay < event.startDay + event.duration
  );
  
  // Maybe add new event
  const newEvent = generateRandomEvent(currentDay);
  if (newEvent && !activeEvents.some(e => e.type === newEvent.type)) {
    activeEvents.push(newEvent);
  }
  
  return {
    ...studio,
    activeEvents
  };
}

export function isRoleBlocked(role: TalentRole, events: IndustryEvent[]): boolean {
  return events.some(event => 
    event.effects.blockedRoles?.includes(role)
  );
}

export function getSalaryModifier(events: IndustryEvent[]): number {
  let modifier = 1.0;
  events.forEach(event => {
    if (event.effects.salaryModifier) {
      modifier *= event.effects.salaryModifier;
    }
  });
  return modifier;
}

export function getEventEffects(events: IndustryEvent[]): {
  audienceBoost: number;
  criticBoost: number;
  reputationChange: number;
} {
  let audienceBoost = 0;
  let criticBoost = 0;
  let reputationChange = 0;
  
  events.forEach(event => {
    audienceBoost += event.effects.audienceBoost || 0;
    criticBoost += event.effects.criticBoost || 0;
    reputationChange += event.effects.reputationChange || 0;
  });
  
  return { audienceBoost, criticBoost, reputationChange };
}
