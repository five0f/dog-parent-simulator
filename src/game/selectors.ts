import { skillLabels, statLabels } from './initial-state';
import { normalizeState } from './state-normalization';
import type {
  DayGoal,
  DaySummary,
  DogSkillId,
  DogStatId,
  DogTraitBadge,
  GameState,
  MeterState,
  SkillState,
} from './types';

export function getMeters(state: GameState): MeterState[] {
  return (Object.keys(statLabels) as DogStatId[]).map(id => ({
    id,
    title: statLabels[id],
    value: state.stats[id],
  }));
}

export function getSkillList(state: GameState): SkillState[] {
  return (Object.keys(skillLabels) as DogSkillId[]).map(id => ({
    id,
    title: skillLabels[id],
    value: state.skills[id],
  }));
}

export function getUnlockedTraits(state: GameState): DogTraitBadge[] {
  return state.personalityTraits.filter(trait => trait.unlocked);
}

export function getDaySummary(state: GameState): DaySummary {
  const scoredState = normalizeState(state);
  const unlockedTraitIds = new Set(scoredState.dayStartTraitIds);
  const newTraits = getUnlockedTraits(scoredState).filter(trait => !unlockedTraitIds.has(trait.id));

  return {
    goalSummaries: scoredState.goals.map(goal => ({
      explanation: getGoalSummaryExplanation(goal, scoredState),
      label: goal.label,
      status: goal.status,
    })),
    journal: scoredState.journal.slice(-5),
    newTraits,
    reinforcedLines: describeReinforcedPatterns(scoredState),
    skillChanges: describeSkillChanges(scoredState),
    storyLines: describeDayStory(scoredState),
    title: `Итоги дня ${String(scoredState.day)}`,
  };
}

function getGoalSummaryExplanation(goal: DayGoal, state: GameState): string {
  if (goal.status === 'done' || goal.status === 'failed') return goal.reason;
  if (goal.status === 'at_risk') return `${goal.reason} До конца дня цель осталась под угрозой.`;

  if (goal.id === 'noNewFear' && state.location === 'home_morning') {
    return 'Прогулка так и не началась, поэтому цель нельзя считать закрытой.';
  }

  return `${goal.reason} Цель не успела завершиться.`;
}

function describeDayStory(state: GameState): string[] {
  const lines: string[] = [];
  if (state.stats.stress <= 35) lines.push('спокойно переживал странности дня');
  if (state.stats.trust >= 72) lines.push('чуть лучше реагировал на тебя');
  if (state.decisionMemory.redirectedPigeons > 0)
    lines.push('хотя бы раз выбрал тебя вместо голубя');
  if (state.decisionMemory.chasedPigeons > 0) lines.push('заинтересовался голубями всерьёз');
  if (state.decisionMemory.ateTrash > 0) lines.push('обнаружил, что земля иногда предлагает меню');
  if (state.flags.homeDamage !== true) lines.push('не устроил катастроф дома');
  if (state.flags.homeDamage === true) lines.push('оставил дома историю, которую придётся помнить');

  return lines.length ? lines.slice(0, 5) : ['прожил ещё один день и стал чуть более собой'];
}

function describeReinforcedPatterns(state: GameState): string[] {
  const lines: string[] = [];
  if (state.decisionMemory.praisedSock > state.decisionMemory.tookResourceByForce)
    lines.push('Бублик запомнил, что носки можно обменивать.');
  if (state.decisionMemory.tookResourceByForce > 0)
    lines.push('Бублик запомнил, что добычу могут забрать резко.');
  if (state.decisionMemory.redirectedPigeons > state.decisionMemory.chasedPigeons)
    lines.push('Голуби стали поводом смотреть на тебя, а не только бежать.');
  if (state.decisionMemory.chasedPigeons > 0)
    lines.push('Погоня за голубями закрепилась как яркая идея.');
  if (state.decisionMemory.redirectedTrash > state.decisionMemory.ateTrash)
    lines.push('Уличную еду можно обходить без драмы.');
  if (state.decisionMemory.ateTrash > 0) lines.push('Уличная кухня стала заметнее для Бублика.');
  if (state.decisionMemory.calmChoices >= 3)
    lines.push('Спокойные решения помогают Бублику быстрее выдыхать.');

  return lines.length ? lines.slice(0, 5) : ['Бублик ещё присматривается к правилам новой жизни.'];
}

function describeSkillChanges(state: GameState): string[] {
  const changes = (Object.keys(skillLabels) as DogSkillId[]).flatMap(key => {
    const delta = state.skills[key] - state.dayStartSkills[key];
    if (!delta) return [];
    const sign = delta > 0 ? '+' : '';
    return `${skillLabels[key]} ${sign}${String(delta)}`;
  });

  return changes.length ? changes : ['Навыки почти не изменились.'];
}
