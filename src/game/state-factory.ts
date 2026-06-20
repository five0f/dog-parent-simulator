import { cloneGoals } from './goals';
import {
  dayGoals,
  initialDecisionMemory,
  initialSkills,
  initialStats,
  initialTraits,
} from './initial-state';
import { normalizeState } from './state-normalization';
import { getInitialStoryDayStart } from './story';
import type { GameState } from './types';

export function createInitialGameState(): GameState {
  const initialStoryDay = getInitialStoryDayStart();

  return normalizeState({
    completedEventIds: [],
    currentEventId: initialStoryDay.eventId,
    day: initialStoryDay.day,
    dayStartSkills: { ...initialSkills },
    dayStartTraitIds: [],
    decisionMemory: { ...initialDecisionMemory },
    flags: {},
    goals: cloneGoals(dayGoals),
    journal: ['Бублик приехал с передержки и изучает новый дом.'],
    location: 'home_morning',
    pendingResult: null,
    personalityTraits: [],
    phase: 'event',
    skills: { ...initialSkills },
    stats: { ...initialStats },
    timeLabel: 'Утро',
    traits: { ...initialTraits },
  });
}
