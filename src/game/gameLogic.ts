import { dogTraits, homeEvents } from '../data/actions';
import { achievementLabels, habitLabels, problemLabels } from '../data/development';
import { parkEvents } from '../data/events';
import type { ChoiceResult, DaySummaryData, Decision, DevelopmentEntry, DevelopmentTrack, DogDevelopment, DogHabitId, DogPose, DogProblemId, DogTraitId, EndingId, GameState, LocationId, PendingConsequence, StatChange, Stats, StoryFlag, TimeOfDay } from '../types';

export const STORAGE_KEY = 'dog-owner-simulator-save-v9';
export const timeOfDay: TimeOfDay[] = ['Утро', 'День', 'Вечер'];
export const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const initialStats: Stats = {
  mood: 74,
  trust: 56,
  health: 88,
};

const dogPoses: DogPose[] = ['idle', 'sit', 'sleep'];
const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)));

const createInitialDevelopment = (): DogDevelopment => ({
  habits: [],
  problems: [],
  achievements: [],
  journal: [],
  tracks: {},
});

export const createInitialState = (): GameState => ({
  phase: 'intro',
  introStep: 0,
  day: 1,
  timeIndex: 0,
  location: 'home',
  mode: 'home',
  currentDecisionId: 'home-door',
  lastResult: null,
  dogPose: 'sit',
  emotion: '🚪',
  stats: { ...initialStats },
  traits: [],
  development: createInitialDevelopment(),
  storyFlags: [],
  lastChoiceId: null,
  memories: ['Бублик проснулся и сел у двери.'],
  dayNotes: [],
  daySummary: null,
  ending: null,
  pendingConsequence: null,
});

export function getDecision(state: GameState): Decision {
  return [...homeEvents, ...parkEvents].find((decision) => decision.id === state.currentDecisionId) ?? homeEvents[0];
}

export function applyChoice(state: GameState, choiceIndex: number): GameState {
  const decision = getDecision(state);
  const choice = decision.choices[choiceIndex];
  if (!choice || state.phase !== 'event' || state.daySummary || state.ending) return state;

  const next = applyImmediateChoiceEffect(state, choice.effect);
  const stats = choice.effect.stats ?? {};
  const developmentNote = describeDevelopmentChange(state.development, next.development);
  const pendingConsequence: PendingConsequence = {
    choiceTitle: choice.title,
    resultText: choice.resultText ?? choice.effect.memory ?? choice.text,
    result: buildChoiceResult(choice.result, choice.resultText ?? choice.effect.memory ?? choice.text, stats, developmentNote),
    stats,
    transition: choice.effect,
  };

  return applySoftConsequences({
    ...next,
    phase: 'result',
    pendingConsequence,
    lastChoiceId: `${decision.id}:${choiceIndex}`,
  });
}

export function continueAfterConsequence(state: GameState): GameState {
  if (state.phase !== 'result' || !state.pendingConsequence) return state;

  const effect = state.pendingConsequence.transition;
  let next: GameState = {
    ...state,
    phase: 'event',
    pendingConsequence: null,
    lastResult: state.pendingConsequence.resultText,
  };

  next = advanceTime(next, effect.time ?? 0);

  if (effect.goPark) {
    next = nextParkEvent({ ...next, location: 'park', mode: 'walk' });
  } else if (effect.goHome) {
    next = nextHomeEvent({ ...next, location: 'home', mode: 'home' });
  } else if (effect.nextDecisionId) {
    next = setDecision(next, effect.nextDecisionId);
  } else if (!next.daySummary && !next.ending) {
    next = next.location === 'park' ? nextParkEvent(next) : nextHomeEvent(next);
  }

  return next;
}

export function advanceIntro(state: GameState): GameState {
  if (state.phase !== 'intro') return state;
  if (state.introStep < 3) return { ...state, introStep: state.introStep + 1 };

  return {
    ...state,
    phase: 'event',
    introStep: 4,
    day: 1,
    timeIndex: 0,
    location: 'home',
    mode: 'home',
    currentDecisionId: 'home-door',
    lastResult: null,
    dogPose: 'sit',
    emotion: '🚪',
  };
}

export function navigateToLocation(state: GameState, location: LocationId): GameState {
  if (state.phase !== 'event' || state.daySummary || state.ending) return state;
  if (location === 'park') return nextParkEvent({ ...state, location: 'park', mode: 'walk', lastResult: null });
  return nextHomeEvent({ ...state, location: 'home', mode: 'home', lastResult: null });
}

function applyImmediateChoiceEffect(state: GameState, change: StatChange): GameState {
  const immediateChange: StatChange = {
    stats: change.stats,
    memory: change.memory,
    dogPose: change.dogPose,
    emotion: change.emotion,
    addTrait: change.addTrait,
    addFlag: change.addFlag,
    clearFlag: change.clearFlag,
    development: change.development,
  };
  return applyChange(state, immediateChange);
}

function applyChange(state: GameState, change: StatChange): GameState {
  const stats = { ...state.stats };
  if (change.stats) {
    Object.entries(change.stats).forEach(([key, value]) => {
      const statKey = key as keyof Stats;
      stats[statKey] = clamp(stats[statKey] + (value ?? 0));
    });
  }

  const traitWasAdded = Boolean(change.addTrait && !state.traits.includes(change.addTrait));
  const traits = traitWasAdded && change.addTrait ? [...state.traits, change.addTrait].slice(-4) : state.traits;
  const storyFlags = updateStoryFlags(state.storyFlags, change.addFlag, change.clearFlag);
  let development = applyDevelopmentEffect(state, state.development, change);
  if (traitWasAdded && change.addTrait) {
    development = addDevelopmentEntry(development, {
      day: state.day,
      type: 'trait',
      title: `Получена черта: ${dogTraits[change.addTrait].title}`,
      text: dogTraits[change.addTrait].description,
    });
  }

  const next: GameState = {
    ...state,
    location: change.location ?? state.location,
    mode: change.mode ?? state.mode,
    currentDecisionId: change.nextDecisionId ?? state.currentDecisionId,
    dogPose: change.dogPose ?? state.dogPose,
    emotion: change.emotion ?? state.emotion,
    stats,
    traits,
    development,
    storyFlags,
  };

  if (change.memory) return addMemory(next, change.memory);
  return next;
}

function nextHomeEvent(state: GameState): GameState {
  const event = pickEvent(homeEvents, state);
  const storyFlags = event.requiredFlag ? state.storyFlags.filter((flag) => flag !== event.requiredFlag) : state.storyFlags;
  return {
    ...state,
    storyFlags,
    location: 'home',
    mode: 'home',
    currentDecisionId: event.id,
    dogPose: event.dogPose,
    emotion: event.emotion,
  };
}

function nextParkEvent(state: GameState): GameState {
  const event = pickEvent(parkEvents, state);
  const storyFlags = event.requiredFlag ? state.storyFlags.filter((flag) => flag !== event.requiredFlag) : state.storyFlags;
  return {
    ...state,
    storyFlags,
    location: 'park',
    mode: 'walk',
    currentDecisionId: event.id,
    dogPose: event.dogPose,
    emotion: event.emotion,
  };
}

function setDecision(state: GameState, decisionId: string): GameState {
  const event = [...homeEvents, ...parkEvents].find((decision) => decision.id === decisionId);
  if (!event) return state.location === 'park' ? nextParkEvent(state) : nextHomeEvent(state);

  return {
    ...state,
    location: event.location,
    mode: event.location === 'park' ? 'walk' : 'home',
    currentDecisionId: event.id,
    dogPose: event.dogPose,
    emotion: event.emotion,
  };
}

function pickEvent(events: Decision[], state: GameState): Decision {
  const currentId = state.currentDecisionId;
  const flaggedEvent = events.find((event) => event.requiredFlag && state.storyFlags.includes(event.requiredFlag));
  if (flaggedEvent) return flaggedEvent;

  const weighted = events.flatMap((event) => {
    const traitMatches = event.traits?.filter((trait) => state.traits.includes(trait)).length ?? 0;
    const problemMatches = event.problems?.filter((problem) => state.development.problems.includes(problem)).length ?? 0;
    const habitMatches = event.habits?.filter((habit) => state.development.habits.includes(habit)).length ?? 0;
    const timeMatch = event.timeOfDay?.includes(timeOfDay[state.timeIndex]) ? 2 : 0;
    const warmMood = event.moodTags?.includes('warm') && state.stats.trust > 68 ? 3 : 0;
    const lowMood = event.moodTags?.includes('lowMood') && state.stats.mood < 45 ? 4 : 0;
    const curiousBoost = event.moodTags?.includes('curious') && state.traits.includes('curious') ? 2 : 0;
    const baseWeight = event.id === currentId ? 1 : 3;
    return Array.from({ length: baseWeight + traitMatches * 4 + problemMatches * 7 + habitMatches * 2 + timeMatch + warmMood + lowMood + curiousBoost }, () => event);
  });
  return weighted[Math.floor(Math.random() * weighted.length)] ?? events[0];
}

function applyDevelopmentEffect(state: GameState, current: DogDevelopment, change: StatChange): DogDevelopment {
  if (!change.development) return current;

  let development = current;
  const effect = change.development;

  if (effect.progress) {
    development = applyTrackProgress(development, effect.progress);
  }

  if (effect.addProblem) development = addProblem(development, effect.addProblem, state.day);
  if (effect.removeProblem) development = removeProblem(development, effect.removeProblem, state.day);
  if (effect.addHabit) development = addHabit(development, effect.addHabit, state.day);
  if (effect.addAchievement) development = addAchievement(development, effect.addAchievement, state.day);

  return applyDevelopmentThresholds(development, state.day);
}

function applyTrackProgress(development: DogDevelopment, progress: Partial<Record<DevelopmentTrack, number>>): DogDevelopment {
  const tracks = { ...development.tracks };
  Object.entries(progress).forEach(([key, delta]) => {
    const track = key as DevelopmentTrack;
    tracks[track] = clamp((tracks[track] ?? 0) + (delta ?? 0), 0, 99);
  });
  return { ...development, tracks };
}

function applyDevelopmentThresholds(development: DogDevelopment, day: number): DogDevelopment {
  let next = development;
  const tracks = next.tracks;

  if ((tracks.walkIgnored ?? 0) >= 3) next = addProblem(next, 'doesnt_hold_walk', day);
  if ((tracks.walkSuccess ?? 0) >= 3) {
    next = removeProblem(next, 'doesnt_hold_walk', day);
    next = addHabit(next, 'holds_until_walk', day);
    next = addAchievement(next, 'learned_hold_walk', day);
  }
  if ((tracks.foodAllowed ?? 0) >= 2) next = addProblem(next, 'picks_food', day);
  if ((tracks.foodRedirected ?? 0) >= 2) {
    next = removeProblem(next, 'picks_food', day);
    next = addHabit(next, 'ignores_ground_food', day);
  }
  if ((tracks.dogBadSocial ?? 0) >= 2) next = addProblem(next, 'fear_dogs', day);
  if ((tracks.dogGoodSocial ?? 0) >= 2) {
    next = removeProblem(next, 'fear_dogs', day);
    next = addHabit(next, 'calm_dogs', day);
  }
  if ((tracks.sockChase ?? 0) >= 2) next = addProblem(next, 'sock_thief', day);
  if ((tracks.recallSuccess ?? 0) >= 2) next = addHabit(next, 'comes_when_called', day);
  if ((tracks.calmWalking ?? 0) >= 2) {
    next = removeProblem(next, 'pulls_leash', day);
    next = addHabit(next, 'calm_leash', day);
  }

  return next;
}

function addProblem(development: DogDevelopment, problem: DogProblemId, day: number): DogDevelopment {
  if (development.problems.includes(problem)) return development;
  return addDevelopmentEntry(
    {
      ...development,
      habits: removeConflictingHabit(development.habits, problem),
      problems: [...development.problems, problem],
    },
    {
      day,
      type: 'problem',
      title: `Появилась проблема: ${problemLabels[problem]}`,
      text: 'Это не случайность, а след от повторяющихся решений.',
    },
  );
}

function removeProblem(development: DogDevelopment, problem: DogProblemId, day: number): DogDevelopment {
  if (!development.problems.includes(problem)) return development;
  return addDevelopmentEntry(
    {
      ...development,
      problems: development.problems.filter((item) => item !== problem),
    },
    {
      day,
      type: 'recovery',
      title: `Проблема устранена: ${problemLabels[problem]}`,
      text: 'Последовательные решения начали работать. Бублик меняется.',
    },
  );
}

function addHabit(development: DogDevelopment, habit: DogHabitId, day: number): DogDevelopment {
  if (development.habits.includes(habit)) return development;
  return addDevelopmentEntry(
    {
      ...development,
      problems: removeConflictingProblem(development.problems, habit),
      habits: [...development.habits, habit],
    },
    {
      day,
      type: 'habit',
      title: `Появилась привычка: ${habitLabels[habit]}`,
      text: 'Теперь это часть поведения Бублика, а не просто удачный эпизод.',
    },
  );
}

function addAchievement(development: DogDevelopment, achievement: keyof typeof achievementLabels, day: number): DogDevelopment {
  if (development.achievements.includes(achievement)) return development;
  return addDevelopmentEntry(
    {
      ...development,
      achievements: [...development.achievements, achievement],
    },
    {
      day,
      type: 'achievement',
      title: achievementLabels[achievement],
      text: 'Это не ачивка игрока. Это маленькая победа Бублика.',
    },
  );
}

function addDevelopmentEntry(development: DogDevelopment, entry: DevelopmentEntry): DogDevelopment {
  return {
    ...development,
    journal: [entry, ...development.journal].slice(0, 16),
  };
}

function removeConflictingHabit(habits: DogHabitId[], problem: DogProblemId): DogHabitId[] {
  const conflicts: Partial<Record<DogProblemId, DogHabitId>> = {
    doesnt_hold_walk: 'holds_until_walk',
    pulls_leash: 'calm_leash',
    picks_food: 'ignores_ground_food',
    fear_dogs: 'calm_dogs',
  };
  const conflict = conflicts[problem];
  return conflict ? habits.filter((habit) => habit !== conflict) : habits;
}

function removeConflictingProblem(problems: DogProblemId[], habit: DogHabitId): DogProblemId[] {
  const conflicts: Partial<Record<DogHabitId, DogProblemId>> = {
    holds_until_walk: 'doesnt_hold_walk',
    calm_leash: 'pulls_leash',
    ignores_ground_food: 'picks_food',
    calm_dogs: 'fear_dogs',
  };
  const conflict = conflicts[habit];
  return conflict ? problems.filter((problem) => problem !== conflict) : problems;
}

function updateStoryFlags(flags: StoryFlag[], addFlag?: StoryFlag, clearFlag?: StoryFlag): StoryFlag[] {
  let next = clearFlag ? flags.filter((flag) => flag !== clearFlag) : flags;
  if (addFlag && !next.includes(addFlag)) next = [...next, addFlag];
  return next.slice(-6);
}

function buildChoiceResult(result: ChoiceResult | undefined, fallback: string, stats: Partial<Stats>, developmentNote?: string): ChoiceResult {
  const mood = formatStatLine('mood', stats.mood ?? 0);
  const trust = formatStatLine('trust', stats.trust ?? 0);

  return {
    bublik: result?.bublik ?? fallback,
    situation: result?.situation ?? 'Ситуация двинулась дальше, а Бублик внимательно следит, поняли ли вы главный смысл.',
    mood: result?.mood ?? mood,
    trust: result?.trust ?? trust,
    thought: result?.thought,
    note: result?.note ?? developmentNote,
  };
}

function describeDevelopmentChange(before: DogDevelopment, after: DogDevelopment): string | undefined {
  const newProblem = after.problems.find((problem) => !before.problems.includes(problem));
  if (newProblem) return `В развитии Бублика появилась проблема: ${problemLabels[newProblem]}.`;

  const solvedProblem = before.problems.find((problem) => !after.problems.includes(problem));
  if (solvedProblem) return `Проблема начала уходить: ${problemLabels[solvedProblem]}.`;

  const newHabit = after.habits.find((habit) => !before.habits.includes(habit));
  if (newHabit) return `Новая хорошая привычка: ${habitLabels[newHabit]}.`;

  const newAchievement = after.achievements.find((achievement) => !before.achievements.includes(achievement));
  if (newAchievement) return `Достижение Бублика: ${achievementLabels[newAchievement]}.`;

  return undefined;
}

function formatStatLine(key: 'mood' | 'trust', value: number): string {
  if (key === 'mood') {
    if (value > 0) return `Настроение поднялось: +${value}.`;
    if (value < 0) return `Настроение просело: ${value}.`;
    return 'Настроение не изменилось.';
  }

  if (value > 0) return `Доверие стало теплее: +${value}.`;
  if (value < 0) return `Доверие слегка пошатнулось: ${value}.`;
  return 'Доверие не изменилось.';
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

    if (day > 30) {
      ending = chooseEnding({ ...state, stats, day: 30 });
      day = 30;
      timeIndex = timeOfDay.length - 1;
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
      phase: 'event',
      pendingConsequence: null,
      location: 'home',
      mode: 'home',
      currentDecisionId: 'home-door',
      lastResult: null,
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
    const decision = [...homeEvents, ...parkEvents].find((event) => event.id === parsed.currentDecisionId);
    const phase = parsed.phase === 'result' && !parsed.pendingConsequence ? 'event' : parsed.phase ?? fresh.phase;
    return {
      ...fresh,
      ...parsed,
      phase,
      introStep: parsed.introStep ?? fresh.introStep,
      location: parsed.location === 'park' ? 'park' : 'home',
      mode: parsed.location === 'park' ? 'walk' : 'home',
      lastResult: parsed.lastResult ?? null,
      lastChoiceId: parsed.lastChoiceId ?? null,
      storyFlags: parsed.storyFlags ?? [],
      timeIndex: Math.min(parsed.timeIndex ?? fresh.timeIndex, timeOfDay.length - 1),
      dogPose: dogPoses.includes(parsed.dogPose) ? parsed.dogPose : decision?.dogPose ?? fresh.dogPose,
      stats: { ...fresh.stats, ...(parsed.stats ?? {}) },
      traits: parsed.traits?.length ? parsed.traits : fresh.traits,
      development: {
        ...fresh.development,
        ...(parsed.development ?? {}),
        tracks: { ...fresh.development.tracks, ...(parsed.development?.tracks ?? {}) },
      },
      pendingConsequence: parsed.pendingConsequence ?? null,
    };
  } catch {
    return createInitialState();
  }
}

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
