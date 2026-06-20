import { resolveGoals } from './goals';
import { buildTraitBadges } from './traits';
import type { GameState } from './types';

export function normalizeState(state: GameState): GameState {
  const stateWithGoals = {
    ...state,
    goals: resolveGoals(state),
  };

  return {
    ...stateWithGoals,
    personalityTraits: buildTraitBadges(stateWithGoals),
  };
}
