import { traitBadgeDefinitions } from './initial-state';
import type { DogTraitBadge, GameState } from './types';

export function buildTraitBadges(state: GameState): DogTraitBadge[] {
  return traitBadgeDefinitions.map(definition => {
    const score = getTraitScore(definition.id, state);

    return {
      ...definition,
      level: score.unlocked ? Math.max(1, Math.min(3, score.level)) : 0,
      unlocked: score.unlocked,
    };
  });
}

function getTraitScore(id: string, state: GameState): { level: number; unlocked: boolean } {
  const memory = state.decisionMemory;

  if (id === 'sock-thief') {
    const level = memory.ignoredSock + Math.floor(memory.tookResourceByForce / 2);
    return { level, unlocked: memory.ignoredSock >= 1 || memory.tookResourceByForce >= 2 };
  }

  if (id === 'pigeon-fan') {
    const level = memory.chasedPigeons + (state.traits.impulsivity >= 58 ? 1 : 0);
    return { level, unlocked: memory.chasedPigeons >= 1 };
  }

  if (id === 'street-vacuum') {
    return { level: memory.ateTrash, unlocked: memory.ateTrash >= 1 };
  }

  if (id === 'calm-dog') {
    const level = memory.calmChoices + (state.stats.stress <= 30 ? 1 : 0);
    const noHarshActions =
      memory.punishedDog === 0 && memory.pulledLeash === 0 && memory.tookResourceByForce === 0;
    return {
      level,
      unlocked: memory.calmChoices >= 3 && state.stats.stress <= 35 && noHarshActions,
    };
  }

  if (id === 'anxious-dog') {
    const harshScore = memory.punishedDog + memory.pulledLeash + memory.tookResourceByForce;
    const level = harshScore + (state.stats.stress >= 50 ? 1 : 0);
    return { level, unlocked: harshScore >= 2 || state.stats.stress >= 55 };
  }

  if (id === 'velcro-dog') {
    const level =
      (state.stats.trust >= 75 ? 2 : state.stats.trust >= 70 ? 1 : 0) +
      memory.praisedSock +
      memory.redirectedPigeons +
      memory.redirectedTrash;
    return { level, unlocked: state.stats.trust >= 75 && memory.calmChoices >= 2 };
  }

  return { level: 0, unlocked: false };
}
