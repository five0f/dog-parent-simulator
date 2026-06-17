import { dogTraits, goals, lifeDecisions } from '../data/actions';
import { walkEvents } from '../data/events';
import type { DaySummaryData, Decision, DogTraitId, EndingId, GameState, LocationId, StatChange, Stats, TimeOfDay } from '../types';

export const STORAGE_KEY = 'dog-owner-simulator-save-v2';
export const timeOfDay: TimeOfDay[] = ['Утро', 'День', 'Вечер', 'Ночь'];

export const initialStats: Stats = {
  ownerFatigue: 18,
  satiety: 72,
  toilet: 62,
  mood: 70,
  health: 78,
  dirt: 22,
  obedience: 38,
  apartment: 74,
  reputation: 50,
  trust: 48,
};

const nextByTime = ['morning-door', 'day-lull', 'evening-window', 'night-sounds'];
const allTraitIds = Object.keys(dogTraits) as DogTraitId[];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, Math.round(value)));

function pickTraits(): DogTraitId[] {
  const shuffled = [...allTraitIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

export const createInitialState = (): GameState => ({
  day: 1,
  timeIndex: 0,
  money: 120,
  location: 'home',
  mode: 'life',
  currentDecisionId: 'morning-door',
  scenePose: 'door',
  stats: { ...initialStats },
  traits: pickTraits(),
  inventory: {
    toy: false,
    treats: 2,
  },
  memories: ['День 1. Бублик проснулся, сел у двери и начал вашу общую неделю.'],
  dayNotes: [],
  goals: goals.map((goal) => ({ ...goal })),
  walk: {
    step: 0,
    total: 4,
    foundFriend: false,
    learnedRecall: 0,
    contestScore: 0,
    survivedStorm: false,
  },
  daySummary: null,
  ending: null,
});

export function getDecision(state: GameState): Decision {
  if (state.currentDecisionId === 'walk-pause') return createWalkPauseDecision(state);
  if (state.currentDecisionId === 'walk-finish') return createWalkFinishDecision(state);

  return (
    [...lifeDecisions, ...walkEvents].find((decision) => decision.id === state.currentDecisionId) ??
    lifeDecisions.find((decision) => decision.id === nextByTime[state.timeIndex]) ??
    lifeDecisions[0]
  );
}

function createWalkPauseDecision(state: GameState): Decision {
  const left = Math.max(1, state.walk.total - state.walk.step);
  return {
    id: 'walk-pause',
    title: left > 1 ? 'Дорожка зовёт дальше' : 'Последний кусок маршрута',
    text:
      left > 1
        ? 'Бублик идёт впереди на мягком поводке. В парке шуршат листья, кто-то смеётся у площадки, и впереди явно что-то будет.'
        : 'Парк уже почти отпускает вас домой, но Бублик ещё проверяет каждый важный запах.',
    scenePose: 'walk',
    location: 'park',
    choices: [
      {
        title: 'Идти дальше',
        text: 'Подождать следующего маленького приключения.',
        effect: {
          nextDecisionId: 'next-walk-event',
          scenePose: 'walk',
          stats: { mood: 2, dirt: 2, ownerFatigue: 2, satiety: -3 },
        },
      },
      {
        title: 'Свернуть домой',
        text: 'Закончить прогулку раньше, пока всё спокойно.',
        effect: {
          endWalk: true,
          time: 1,
          stats: { toilet: 15, mood: -2, trust: 1, ownerFatigue: -1 },
          memory: 'Вы свернули домой до следующего приключения. Бублик оглядывался на парк.',
        },
      },
    ],
  };
}

function createWalkFinishDecision(state: GameState): Decision {
  return {
    id: 'walk-finish',
    title: 'Пора домой',
    text: 'Маршрут почти закончился. Бублик устал, но всё ещё несёт в себе половину парка.',
    scenePose: state.stats.dirt > 60 ? 'mud' : 'walk',
    location: 'park',
    choices: [
      {
        title: 'Спокойно вернуться',
        text: 'Дать прогулке стать хорошим воспоминанием.',
        effect: {
          endWalk: true,
          time: 1,
          stats: { toilet: 18, mood: 6, trust: 4, ownerFatigue: 4 },
          memory: 'Вы вернулись с прогулки уставшими, но довольными.',
        },
      },
      {
        title: 'Сделать круг почёта',
        text: 'Ещё пять минут для хвоста.',
        effect: {
          endWalk: true,
          time: 1,
          stats: { mood: 10, trust: 3, ownerFatigue: 8, dirt: 4 },
          memory: 'Бублик получил круг почёта и шёл домой с видом победителя.',
        },
      },
    ],
  };
}

export function applyChoice(state: GameState, choiceIndex: number): GameState {
  const decision = getDecision(state);
  const choice = decision.choices[choiceIndex];
  if (!choice || state.daySummary || state.ending) return state;

  if (choice.effect.nextDecisionId === 'next-walk-event') {
    return applySystemPressure(nextWalkEvent(applyChange(state, choice.effect)));
  }

  let next = applyChange(state, choice.effect);
  next = completeGoals(next);
  next = advanceTime(next, choice.effect.time ?? 0);

  if (choice.effect.startWalk) {
    next = startWalk(next);
  } else if (choice.effect.endWalk) {
    next = endWalk(next);
  } else if (!choice.effect.nextDecisionId && next.mode === 'walk' && !next.daySummary && !next.ending) {
    next.currentDecisionId = 'walk-pause';
    next.location = 'park';
  } else if (!choice.effect.nextDecisionId && next.mode === 'life' && !next.daySummary && !next.ending) {
    next.currentDecisionId = nextByTime[next.timeIndex];
  }

  return applySystemPressure(completeGoals(next));
}

export function applyChange(state: GameState, change: StatChange): GameState {
  const stats = { ...state.stats };
  const trustBonus = state.stats.trust > 72 ? 1.15 : state.stats.trust < 30 ? 0.75 : 1;
  const fatiguePenalty = state.stats.ownerFatigue > 78 ? 0.75 : 1;

  if (change.stats) {
    Object.entries(change.stats).forEach(([key, rawValue]) => {
      const statKey = key as keyof Stats;
      const value = rawValue ?? 0;
      let adjusted = value;
      if (value > 0 && ['obedience', 'mood', 'health'].includes(statKey)) adjusted = Math.round(value * fatiguePenalty);
      if (value > 0 && statKey === 'obedience') adjusted = Math.round(adjusted * trustBonus);
      stats[statKey] = clamp(stats[statKey] + adjusted);
    });
  }

  const walk = {
    ...state.walk,
    ...(change.walk ?? {}),
  };

  if (change.walk?.learnedRecall) walk.learnedRecall = state.walk.learnedRecall + change.walk.learnedRecall;
  if (change.walk?.contestScore) walk.contestScore = state.walk.contestScore + change.walk.contestScore;

  const next: GameState = {
    ...state,
    money: Math.max(0, state.money + (change.money ?? 0)),
    location: change.location ?? state.location,
    mode: change.mode ?? state.mode,
    scenePose: change.scenePose ?? state.scenePose,
    currentDecisionId: change.nextDecisionId ?? state.currentDecisionId,
    stats,
    walk,
    inventory: {
      toy: change.toy ?? state.inventory.toy,
      treats: Math.max(0, state.inventory.treats + (change.treats ?? 0)),
    },
  };

  if (change.memory) return addMemory(next, change.memory);
  return next;
}

function startWalk(state: GameState): GameState {
  const next: GameState = {
    ...state,
    mode: 'walk',
    location: 'park',
    scenePose: 'walk',
    walk: { ...state.walk, step: 0, total: 4 },
  };

  return nextWalkEvent(addMemory(next, 'Прогулка началась: Бублик идёт вперёд, а вы ждёте, что подкинет парк.'));
}

function endWalk(state: GameState): GameState {
  return {
    ...addMemory(state, 'Прогулка закончилась. Дома Бублик ещё долго проверял сон во сне.'),
    mode: 'life',
    location: 'home',
    scenePose: state.stats.dirt > 62 ? 'mud' : 'sleep',
    currentDecisionId: nextByTime[state.timeIndex],
    walk: { ...state.walk, step: 0 },
  };
}

function nextWalkEvent(state: GameState): GameState {
  const step = state.walk.step + 1;
  if (step > state.walk.total) {
    return {
      ...state,
      currentDecisionId: 'walk-finish',
      scenePose: 'walk',
      walk: { ...state.walk, step: state.walk.total },
    };
  }

  const event = pickWalkEvent(state);
  return {
    ...state,
    currentDecisionId: event.id,
    location: event.location,
    scenePose: event.scenePose,
    walk: { ...state.walk, step },
  };
}

function pickWalkEvent(state: GameState): Decision {
  const weighted = walkEvents.flatMap((event) => {
    const traitMatches = event.traits?.filter((trait) => state.traits.includes(trait)).length ?? 0;
    const weight = 1 + traitMatches * 3;
    return Array.from({ length: weight }, () => event);
  });

  return weighted[Math.floor(Math.random() * weighted.length)] ?? walkEvents[0];
}

function addPassiveDecay(state: GameState, steps: number): GameState {
  if (steps <= 0) return state;

  const stats = { ...state.stats };
  for (let i = 0; i < steps; i += 1) {
    stats.ownerFatigue = clamp(stats.ownerFatigue + 5);
    stats.satiety = clamp(stats.satiety - 7);
    stats.toilet = clamp(stats.toilet - 10);
    stats.mood = clamp(stats.mood - 2);
    stats.dirt = clamp(stats.dirt + (state.mode === 'walk' ? 5 : 2));

    if (stats.satiety < 28) stats.health = clamp(stats.health - 4);
    if (stats.toilet < 18) stats.apartment = clamp(stats.apartment - 6);
    if (stats.dirt > 78) stats.reputation = clamp(stats.reputation - 3);
    if (state.traits.includes('destroyer') && stats.mood < 42) stats.apartment = clamp(stats.apartment - 4);
    if (state.traits.includes('hyperactive') && state.mode !== 'walk') stats.mood = clamp(stats.mood - 2);
  }

  return { ...state, stats };
}

export function advanceTime(state: GameState, steps = 1): GameState {
  if (steps <= 0) return state;

  let next = addPassiveDecay(state, steps);
  let timeIndex = next.timeIndex + steps;
  let day = next.day;
  let daySummary = next.daySummary;
  let ending = next.ending;

  while (timeIndex >= timeOfDay.length) {
    timeIndex -= timeOfDay.length;
    daySummary = createDaySummary({ ...next, day, timeIndex: 3 });
    day += 1;

    if (day > 7) {
      ending = chooseEnding({ ...next, day: 7 });
      day = 7;
      timeIndex = 3;
      break;
    }
  }

  return {
    ...next,
    day,
    timeIndex,
    daySummary,
    ending,
    currentDecisionId: daySummary || next.mode === 'walk' ? next.currentDecisionId : nextByTime[timeIndex],
    dayNotes: daySummary ? [] : next.dayNotes,
  };
}

function createDaySummary(state: GameState): DaySummaryData {
  const notes = state.dayNotes.length > 0 ? state.dayNotes.slice(0, 5) : ['День прошёл тихо, но Бублик всё равно что-то запомнил.'];
  return {
    day: state.day,
    title: `Итог дня ${state.day}`,
    notes,
    conditionLines: [
      `Бублик: ${conditionLabel('mood', state.stats.mood)}, ${conditionLabel('health', state.stats.health)}`,
      `Доверие: ${conditionLabel('trust', state.stats.trust)}`,
      `Дом: ${conditionLabel('apartment', state.stats.apartment)}`,
    ],
    money: state.money,
  };
}

function applySystemPressure(state: GameState): GameState {
  let next = state;

  if (state.stats.toilet < 10 && state.location === 'home') {
    next = applyChange(next, {
      stats: { apartment: -14, toilet: 12, trust: -2 },
      memory: 'Бублик не дождался прогулки. Это стало домашним уроком без злодеев.',
      scenePose: 'mess',
    });
  }

  if (state.stats.health < 24) {
    next = addMemory(next, 'Бублик сегодня выглядит неважно. Ветеринарка кажется уже не перестраховкой.');
  }

  if (state.stats.apartment < 28 && state.traits.includes('destroyer')) {
    next = addMemory(next, 'Бублик проверил квартиру на прочность. Квартира не всё выдержала.');
  }

  return completeGoals(next);
}

export function addMemory(state: GameState, memory: string): GameState {
  return {
    ...state,
    memories: [memory, ...state.memories].slice(0, 40),
    dayNotes: [memory, ...state.dayNotes].slice(0, 8),
  };
}

function completeGoals(state: GameState): GameState {
  const stats = state.stats;
  const goals = state.goals.map((goal) => {
    if (goal.done) return goal;
    if (goal.id === 'no-complaints' && stats.reputation >= 68 && state.day >= 5) return { ...goal, done: true };
    if (goal.id === 'recall' && state.walk.learnedRecall >= 3) return { ...goal, done: true };
    if (goal.id === 'friend' && state.walk.foundFriend) return { ...goal, done: true };
    if (goal.id === 'contest' && state.walk.contestScore >= 1 && stats.reputation >= 58) return { ...goal, done: true };
    if (goal.id === 'storm' && state.walk.survivedStorm) return { ...goal, done: true };
    if (goal.id === 'training-course' && stats.obedience >= 70 && stats.trust >= 62) return { ...goal, done: true };
    return goal;
  });

  return { ...state, goals };
}

export function dismissDaySummary(state: GameState): GameState {
  if (!state.daySummary) return state;

  return {
    ...addMemory(
      {
        ...state,
        daySummary: null,
        mode: 'life',
        location: 'home',
        scenePose: state.ending ? state.scenePose : 'door',
        currentDecisionId: state.ending ? state.currentDecisionId : 'morning-door',
      },
      state.ending ? 'Неделя завершена.' : `День ${state.day} начался. Бублик снова у двери.`,
    ),
  };
}

export function chooseEnding(state: GameState): EndingId {
  const s = state.stats;
  const completedGoals = state.goals.filter((goal) => goal.done).length;

  if (s.trust >= 72 && s.obedience >= 68 && completedGoals >= 3) return 'legend';
  if (s.apartment <= 30) return 'minusSofa';
  if (s.reputation <= 30 || (s.obedience <= 26 && s.trust <= 36)) return 'districtThreat';
  if (s.mood >= 76 && s.ownerFatigue >= 76) return 'happyDogBrokenOwner';
  return 'responsible';
}

export function conditionLabel(key: keyof Stats, value: number): string {
  if (key === 'ownerFatigue') {
    if (value > 75) return 'на пределе';
    if (value > 45) return 'устал';
    return 'держится';
  }
  if (key === 'toilet') {
    if (value < 24) return 'срочно гулять';
    if (value < 52) return 'пора гулять';
    return 'всё хорошо';
  }
  if (key === 'satiety') {
    if (value < 30) return 'голоден';
    if (value < 62) return 'нормально';
    return 'отлично';
  }
  if (key === 'mood') {
    if (value < 35) return 'грустит';
    if (value < 68) return 'спокоен';
    return 'счастлив';
  }
  if (key === 'health') {
    if (value < 35) return 'плохо';
    if (value < 65) return 'стоит обратить внимание';
    return 'отлично';
  }
  if (key === 'dirt') {
    if (value > 72) return 'очень грязный';
    if (value > 42) return 'после приключений';
    return 'чистый';
  }
  if (key === 'obedience') {
    if (value < 35) return 'сам себе режиссёр';
    if (value < 68) return 'слушает через раз';
    return 'слышит вас';
  }
  if (key === 'apartment') {
    if (value < 35) return 'дом пережил многое';
    if (value < 66) return 'живой беспорядок';
    return 'уютно';
  }
  if (key === 'reputation') {
    if (value < 35) return 'соседи настороже';
    if (value < 66) return 'нейтрально';
    return 'вас любят во дворе';
  }
  if (value < 35) return 'хрупкое';
  if (value < 68) return 'растёт';
  return 'крепкое';
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
    const loaded = {
      ...fresh,
      ...parsed,
      stats: { ...fresh.stats, ...parsed.stats },
      inventory: { ...fresh.inventory, ...(parsed.inventory ?? {}) },
      goals: parsed.goals?.length ? parsed.goals : fresh.goals,
      traits: parsed.traits?.length ? parsed.traits : fresh.traits,
      walk: { ...fresh.walk, ...(parsed.walk ?? {}) },
    };

    const validWalkIds = new Set(['walk-pause', 'walk-finish', ...walkEvents.map((event) => event.id)]);
    const validLifeIds = new Set(lifeDecisions.map((decision) => decision.id));

    if (loaded.mode === 'walk' && !validWalkIds.has(loaded.currentDecisionId)) {
      return { ...loaded, currentDecisionId: 'walk-pause', location: 'park', scenePose: 'walk' };
    }

    if (loaded.mode === 'life' && !validLifeIds.has(loaded.currentDecisionId)) {
      return { ...loaded, currentDecisionId: nextByTime[loaded.timeIndex] ?? 'morning-door', location: 'home' };
    }

    return loaded;
  } catch {
    return createInitialState();
  }
}

export function saveGame(state: GameState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
