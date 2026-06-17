import { dogTraits, homeEvents } from '../data/actions';
import { parkEvents } from '../data/events';
import type { DaySummaryData, Decision, DogTraitId, EndingId, GameState, LocationId, StatChange, Stats, TimeOfDay } from '../types';

export const STORAGE_KEY = 'dog-owner-simulator-save-v5';
export const timeOfDay: TimeOfDay[] = ['Утро', 'День', 'Вечер', 'Ночь'];
export const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const initialStats: Stats = {
  mood: 74,
  trust: 56,
  health: 88,
};

const allTraitIds = Object.keys(dogTraits) as DogTraitId[];
const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)));

function pickTraits(): DogTraitId[] {
  const shuffled = [...allTraitIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export const createInitialState = (): GameState => ({
  day: 1,
  timeIndex: 0,
  location: 'home',
  mode: 'home',
  currentDecisionId: 'home-door',
  dogPose: 'sit',
  emotion: '🚪',
  stats: { ...initialStats },
  traits: pickTraits(),
  memories: ['Бублик проснулся и сел у двери.'],
  dayNotes: [],
  daySummary: null,
  ending: null,
});

export function getDecision(state: GameState): Decision {
  return [...homeEvents, ...parkEvents].find((decision) => decision.id === state.currentDecisionId) ?? homeEvents[0];
}

export function applyChoice(state: GameState, choiceIndex: number): GameState {
  const decision = getDecision(state);
  const choice = decision.choices[choiceIndex];
  if (!choice || state.daySummary || state.ending) return state;

  let next = applyChange(state, choice.effect);
  next = advanceTime(next, choice.effect.time ?? 0);

  if (choice.effect.goPark) {
    next = nextParkEvent({ ...next, location: 'park', mode: 'walk' });
  } else if (choice.effect.goHome) {
    next = nextHomeEvent({ ...next, location: 'home', mode: 'home' });
  } else if (!choice.effect.nextDecisionId && !next.daySummary && !next.ending) {
    next = next.location === 'park' ? nextParkEvent(next) : nextHomeEvent(next);
  }

  return applySoftConsequences(next);
}

export function navigateToLocation(state: GameState, location: LocationId): GameState {
  if (state.daySummary || state.ending) return state;
  if (location === 'park') return nextParkEvent({ ...state, location: 'park', mode: 'walk' });
  return nextHomeEvent({ ...state, location: 'home', mode: 'home' });
}

function applyChange(state: GameState, change: StatChange): GameState {
  const stats = { ...state.stats };
  if (change.stats) {
    Object.entries(change.stats).forEach(([key, value]) => {
      const statKey = key as keyof Stats;
      stats[statKey] = clamp(stats[statKey] + (value ?? 0));
    });
  }

  const traits = change.addTrait && !state.traits.includes(change.addTrait) ? [...state.traits, change.addTrait].slice(-3) : state.traits;

  const next: GameState = {
    ...state,
    location: change.location ?? state.location,
    mode: change.mode ?? state.mode,
    currentDecisionId: change.nextDecisionId ?? state.currentDecisionId,
    dogPose: change.dogPose ?? state.dogPose,
    emotion: change.emotion ?? state.emotion,
    stats,
    traits,
  };

  if (change.memory) return addMemory(next, change.memory);
  return next;
}

function nextHomeEvent(state: GameState): GameState {
  const event = pickEvent(homeEvents, state);
  return {
    ...state,
    location: 'home',
    mode: 'home',
    currentDecisionId: event.id,
    dogPose: event.dogPose,
    emotion: event.emotion,
  };
}

function nextParkEvent(state: GameState): GameState {
  const event = pickEvent(parkEvents, state);
  return {
    ...state,
    location: 'park',
    mode: 'walk',
    currentDecisionId: event.id,
    dogPose: event.dogPose,
    emotion: event.emotion,
  };
}

function pickEvent(events: Decision[], state: GameState): Decision {
  const currentId = state.currentDecisionId;
  const weighted = events.flatMap((event) => {
    const traitMatches = event.traits?.filter((trait) => state.traits.includes(trait)).length ?? 0;
    const repeatPenalty = event.id === currentId ? 0 : 1;
    return Array.from({ length: Math.max(1, 1 + traitMatches * 3 - repeatPenalty) }, () => event);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] ?? events[0];
}

function advanceTime(state: GameState, steps: number): GameState {
  if (steps <= 0) return state;

  let timeIndex = state.timeIndex + steps;
  let day = state.day;
  let daySummary = state.daySummary;
  let ending = state.ending;
  const stats = { ...state.stats };

  for (let i = 0; i < steps; i += 1) {
    stats.mood = clamp(stats.mood - 1);
    if (stats.mood < 28) stats.health = clamp(stats.health - 2);
  }

  while (timeIndex >= timeOfDay.length) {
    timeIndex -= timeOfDay.length;
    daySummary = createDaySummary({ ...state, stats, day });
    day += 1;

    if (day > 7) {
      ending = chooseEnding({ ...state, stats, day: 7 });
      day = 7;
      timeIndex = 3;
      break;
    }
  }

  return {
    ...state,
    stats,
    day,
    timeIndex,
    daySummary,
    ending,
    dayNotes: daySummary ? [] : state.dayNotes,
  };
}

function createDaySummary(state: GameState): DaySummaryData {
  return {
    day: state.day,
    title: `День ${state.day} завершён`,
    notes: state.dayNotes.slice(0, 3),
    conditionLines: [
      `Настроение: ${conditionLabel('mood', state.stats.mood)}`,
      `Доверие: ${conditionLabel('trust', state.stats.trust)}`,
    ],
  };
}

function applySoftConsequences(state: GameState): GameState {
  if (state.stats.health < 42 && state.emotion !== '😟') {
    return {
      ...addMemory(state, 'Бублик выглядит неважно. Пока лучше выбрать спокойные действия.'),
      dogPose: 'idle',
      emotion: '😟',
    };
  }
  return state;
}

function addMemory(state: GameState, memory: string): GameState {
  return {
    ...state,
    memories: [memory, ...state.memories].slice(0, 18),
    dayNotes: [memory, ...state.dayNotes].slice(0, 6),
  };
}

export function dismissDaySummary(state: GameState): GameState {
  if (!state.daySummary) return state;
  return addMemory(
    {
      ...state,
      daySummary: null,
      location: 'home',
      mode: 'home',
      currentDecisionId: 'home-door',
      dogPose: 'sit',
      emotion: '🚪',
      stats: { ...state.stats, mood: clamp(state.stats.mood + 4), health: clamp(state.stats.health + 2) },
    },
    `День ${state.day} начался спокойно.`,
  );
}

function chooseEnding(state: GameState): EndingId {
  if (state.stats.trust > 78 && state.stats.mood > 65) return 'bestFriends';
  if (state.memories.filter((memory) => memory.includes('парк') || memory.includes('прогул')).length > 8) return 'parkLegend';
  if (state.stats.mood > 78 && state.stats.trust < 45) return 'chaosWeek';
  if (state.stats.health > 74 && state.stats.trust > 58) return 'quietCozy';
  return 'responsible';
}

export function conditionLabel(key: keyof Stats, value: number): string {
  if (key === 'mood') {
    if (value < 35) return 'грустит';
    if (value < 68) return 'спокоен';
    return 'счастлив';
  }
  if (key === 'trust') {
    if (value < 35) return 'хрупкое';
    if (value < 70) return 'тёплое';
    return 'высокое';
  }
  if (value < 40) return 'есть проблема';
  if (value < 68) return 'нормально';
  return 'хорошее';
}

export function traitSummary(state: GameState) {
  return state.traits.map((trait) => dogTraits[trait]);
}

export function loadGame(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as GameState;
    const fresh = createInitialState();
    return {
      ...fresh,
      ...parsed,
      location: parsed.location === 'park' ? 'park' : 'home',
      mode: parsed.location === 'park' ? 'walk' : 'home',
      stats: { ...fresh.stats, ...(parsed.stats ?? {}) },
      traits: parsed.traits?.length ? parsed.traits : fresh.traits,
    };
  } catch {
    return createInitialState();
  }
}

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
