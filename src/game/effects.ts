import { clamp } from './math';
import type { ChoiceEffect, DecisionMemory, GameState } from './types';

export function applyEffects(state: GameState, effects: ChoiceEffect): GameState {
  return {
    ...state,
    decisionMemory: applyMemoryEffects(state.decisionMemory, effects.memory),
    flags: applyFlagEffects(state.flags, effects),
    skills: applyNumberEffects(state.skills, effects.skills),
    stats: applyNumberEffects(state.stats, effects.stats),
    traits: applyNumberEffects(state.traits, effects.traits),
  };
}

function applyNumberEffects<T extends Record<string, number>>(
  values: T,
  effects?: Partial<Record<keyof T, number>>
): T {
  if (!effects) return values;

  const nextValues = { ...values };
  for (const key of Object.keys(effects) as (keyof T)[]) {
    nextValues[key] = clamp(values[key] + (effects[key] ?? 0)) as T[keyof T];
  }

  return nextValues;
}

function applyMemoryEffects(
  memory: DecisionMemory,
  effects?: Partial<Record<keyof DecisionMemory, number>>
): DecisionMemory {
  if (!effects) return memory;

  const nextMemory = { ...memory };
  for (const key of Object.keys(effects) as (keyof DecisionMemory)[]) {
    nextMemory[key] = Math.max(0, memory[key] + (effects[key] ?? 0));
  }

  return nextMemory;
}

function applyFlagEffects(flags: GameState['flags'], effects: ChoiceEffect): GameState['flags'] {
  const nextFlags = { ...flags, ...(effects.flags ?? {}) };

  if (effects.flagDeltas) {
    for (const [key, delta] of Object.entries(effects.flagDeltas)) {
      const currentValue = nextFlags[key];
      const currentNumber =
        typeof currentValue === 'number' && Number.isFinite(currentValue) ? currentValue : 0;

      nextFlags[key] = currentNumber + delta;
    }
  }

  return nextFlags;
}
