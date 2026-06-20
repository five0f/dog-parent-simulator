import { createInitialGameState } from './state-factory';
import { sanitizeGameState } from './state-sanitizer';
import type { GameState } from './types';

const storageKey = 'dog-owner-first-day-v3';

export function resetGameSave() {
  window.localStorage.removeItem(storageKey);
}

export function loadGameState(): GameState {
  try {
    const rawState = window.localStorage.getItem(storageKey);
    if (!rawState) return createInitialGameState();

    const parsedState: unknown = JSON.parse(rawState);
    return sanitizeGameState(parsedState);
  } catch {
    return createInitialGameState();
  }
}

export function saveGameState(state: GameState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}
