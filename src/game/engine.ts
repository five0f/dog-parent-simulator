import { applyEffects } from './effects';
import { cloneGoals } from './goals';
import { dayGoals } from './initial-state';
import { clamp } from './math';
import { normalizeState } from './state-normalization';
import { getNextStoryDayStart } from './story';
import { getCurrentEvent } from './story/registry';
import type { ChoiceEffect, ChoiceVariant, DogPose, GameState, LocationId } from './types';

export function chooseEventOption(state: GameState, choiceId: string): GameState {
  if (state.phase !== 'event') return state;

  const currentEvent = getCurrentEvent(state);
  const choice = currentEvent.choices.find(item => item.id === choiceId);
  if (!choice) return state;

  const outcome = typeof choice.outcome === 'function' ? choice.outcome(state) : choice.outcome;
  const updatedState = applyEffects(state, outcome.effects);
  const nextLocation = outcome.nextLocation ?? currentEvent.location;
  const nextEventId = outcome.nextEventId ?? state.currentEventId;

  return normalizeState({
    ...updatedState,
    journal: [...updatedState.journal, outcome.journal],
    location: state.location,
    pendingResult: {
      choiceId: choice.id,
      completeDay: Boolean(outcome.completeDay),
      dogPose: outcome.dogPose ?? getResultDogPose(choice.variant),
      nextEventId,
      nextLocation,
      resultText: outcome.resultText,
      sceneObjects: outcome.sceneObjects ?? currentEvent.sceneObjects,
      storyChanges: outcome.storyChanges ?? describeStoryFallback(outcome.effects),
      variant: choice.variant,
    },
    phase: 'result',
  });
}

export function continueAfterResult(state: GameState): GameState {
  if (state.phase !== 'result' || !state.pendingResult) return state;

  const currentEvent = getCurrentEvent(state);
  const completedEventIds = state.completedEventIds.includes(currentEvent.id)
    ? state.completedEventIds
    : [...state.completedEventIds, currentEvent.id];

  if (state.pendingResult.completeDay) {
    const summaryLocation = state.pendingResult.nextLocation;

    return normalizeState({
      ...state,
      completedEventIds,
      location: summaryLocation,
      pendingResult: null,
      phase: 'daySummary',
      timeLabel: getTimeLabelForLocation(summaryLocation),
    });
  }

  const nextState: GameState = {
    ...state,
    completedEventIds,
    currentEventId: state.pendingResult.nextEventId,
    location: state.pendingResult.nextLocation,
    pendingResult: null,
    phase: 'event',
    timeLabel: getTimeLabelForLocation(state.pendingResult.nextLocation),
  };

  return normalizeState(markDepartureIfNeeded(nextState, state.pendingResult.nextLocation));
}

export function startNextDay(state: GameState): GameState {
  const scoredState = normalizeState(state);
  if (scoredState.phase !== 'daySummary') return scoredState;

  const nextStoryDay = getNextStoryDayStart(scoredState.day);
  if (!nextStoryDay) return scoredState;

  const currentTraitIds = scoredState.personalityTraits.flatMap(trait =>
    trait.unlocked ? [trait.id] : []
  );

  return normalizeState({
    ...scoredState,
    completedEventIds: [],
    currentEventId: nextStoryDay.eventId,
    day: nextStoryDay.day,
    dayStartSkills: { ...scoredState.skills },
    dayStartTraitIds: currentTraitIds,
    flags: {},
    goals: cloneGoals(dayGoals),
    journal: [
      `День ${String(nextStoryDay.day)}: Бублик проснулся уже не совсем той собакой, что вчера.`,
    ],
    location: 'home_morning',
    pendingResult: null,
    phase: 'event',
    stats: {
      ...scoredState.stats,
      energy: clamp(scoredState.stats.energy + 12),
      hunger: clamp(scoredState.stats.hunger + 10),
      playNeed: clamp(scoredState.stats.playNeed + 10),
      stress: clamp(scoredState.stats.stress - 10),
      walkNeed: 55,
    },
    timeLabel: 'Утро',
  });
}

function markDepartureIfNeeded(state: GameState, nextLocation: LocationId): GameState {
  if (nextLocation !== 'park' || typeof state.flags.leftHomeStress === 'number') return state;

  return {
    ...state,
    flags: {
      ...state.flags,
      leftHomeStress: state.stats.stress,
    },
  };
}

function describeStoryFallback(effects: ChoiceEffect): string[] {
  const lines: string[] = [];

  if ((effects.stats?.trust ?? 0) > 0)
    lines.push('Бублик почувствовал больше поддержки и контакта.');
  if ((effects.stats?.trust ?? 0) < 0) lines.push('Бублик стал осторожнее в контакте с тобой.');
  if ((effects.stats?.stress ?? 0) > 0) lines.push('Напряжение у Бублика выросло.');
  if ((effects.stats?.stress ?? 0) < 0) lines.push('Бублик немного выдохнул.');
  if ((effects.stats?.energy ?? 0) < 0) lines.push('Он потратил немного сил.');
  if ((effects.stats?.walkNeed ?? 0) < 0) lines.push('Потребность в прогулке снизилась.');
  if ((effects.stats?.playNeed ?? 0) < 0) lines.push('Игровой зуд стал спокойнее.');

  return lines.length ? lines : ['Решение изменило день Бублика, но без резкого поворота.'];
}

function getResultDogPose(variant: ChoiceVariant): DogPose {
  if (variant === 'positive') return 'happy';
  if (variant === 'negative') return 'stressed';
  return 'idle';
}

function getTimeLabelForLocation(location: LocationId) {
  if (location === 'park') return 'Прогулка';
  if (location === 'home_after_walk') return 'Вечер';
  return 'Утро';
}
