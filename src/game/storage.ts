import { sanitizeGameState } from './state-sanitizer';
import type { GameState } from './types';

const storageKey = 'dog-owner-first-day-v3';
const settingsStorageKey = 'dog-owner-settings-v1';

export interface GameSavePreview {
  day: number;
  location: GameState['location'];
  phase: GameState['phase'];
  timeLabel: string;
}

export interface GameSettings {
  music: boolean;
  sounds: boolean;
}

const defaultSettings: GameSettings = {
  music: true,
  sounds: true,
};

export function resetGameSave() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(storageKey);
}

export function readGameSave(): GameState | null {
  try {
    if (typeof window === 'undefined') return null;

    const rawState = window.localStorage.getItem(storageKey);
    if (!rawState) return null;

    const parsedState: unknown = JSON.parse(rawState);
    return sanitizeGameState(parsedState);
  } catch {
    return null;
  }
}

export function saveGameState(state: GameState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function getGameSavePreview(): GameSavePreview | null {
  const state = readGameSave();
  if (!state) return null;

  return {
    day: state.day,
    location: state.location,
    phase: state.phase,
    timeLabel: state.timeLabel,
  };
}

export function loadGameSettings(): GameSettings {
  try {
    if (typeof window === 'undefined') return defaultSettings;

    const rawSettings = window.localStorage.getItem(settingsStorageKey);
    if (!rawSettings) return defaultSettings;

    const parsedSettings: unknown = JSON.parse(rawSettings);
    if (!isSettingsRecord(parsedSettings)) return defaultSettings;

    return {
      music: parsedSettings.music,
      sounds: parsedSettings.sounds,
    };
  } catch {
    return defaultSettings;
  }
}

export function saveGameSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings));
}

function isSettingsRecord(value: unknown): value is GameSettings {
  return (
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof (value as Partial<GameSettings>).music === 'boolean' &&
    typeof (value as Partial<GameSettings>).sounds === 'boolean'
  );
}
